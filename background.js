// Content scripts can change only their own tab display preference. Pairing keys
// remain in trusted extension contexts; storage.session is not exposed to pages.
chrome.runtime.onMessage.addListener((m,s,reply)=>{
 if(s.id!==chrome.runtime.id||!s.tab||!['corporate.pref.get','corporate.pref.set'].includes(m.op))return false;
 const key='corporate-tab:'+s.tab.id;
 (async()=>{
  if(m.op==='corporate.pref.set'){
   if(typeof m.enabled!=='boolean')throw Error('Boolean required');
   await chrome.storage.session.set({[key]:m.enabled});
  }
  const v=await chrome.storage.session.get(key);reply({enabled:v[key]!==false});
 })().catch(()=>reply({enabled:false,error:true}));return true;
});
let busy=false, serial=Promise.resolve();
async function signed(path,data){
 const {session}=await chrome.storage.session.get('session');
 if(!session||session.expires<=Date.now())throw Error('Not paired');
 const counter=(session.counter||0)+1;session.counter=counter;await chrome.storage.session.set({session});
 const body=JSON.stringify(data),enc=new TextEncoder(),bytes=Uint8Array.from(session.keyHex.match(/../g),x=>parseInt(x,16));
 const key=await crypto.subtle.importKey('raw',bytes,{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const sig=await crypto.subtle.sign('HMAC',key,enc.encode(`${path}\n${counter}\n${body}`));
 const mac=[...new Uint8Array(sig)].map(x=>x.toString(16).padStart(2,'0')).join('');
 const r=await fetch(session.base+path,{method:'POST',headers:{'Content-Type':'application/json','X-Session':session.sid,'X-Counter':String(counter),'X-Mac':mac},body,credentials:'omit',redirect:'error',signal:AbortSignal.timeout(10000)});
 if(!r.ok)throw Error('Bridge rejected request');return r.json();
}
function snapshot(){
 if(/\/(?:keys?|api[-_]?keys?|login|signin|authenticate)(?:\/|$)/i.test(location.pathname))return{error:'Sensitive account page disabled in prototype'};
 const redact=s=>s.replace(/(?:gsk_|sk-|AIza)[A-Za-z0-9_-]{12,}/g,'[redacted]').replace(/\b[A-Fa-f0-9]{48,}\b/g,'[redacted]').replace(/\b[A-Za-z0-9_-]{60,}\b/g,'[redacted]');
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),out=[];let total=0,node;
 while((node=walker.nextNode())&&total<12000){const p=node.parentElement;if(!p||p.closest('input,textarea,select,script,style,noscript,[contenteditable],[hidden],[aria-hidden="true"]'))continue;const style=getComputedStyle(p);if(style.display==='none'||style.visibility==='hidden')continue;const t=node.textContent.trim();if(t){out.push(t);total+=t.length;}}
 return{origin:location.origin,path:redact(location.pathname),title:redact(document.title).slice(0,200),text:redact(out.join('\n')).slice(0,12000)};
}
async function poll(){
 if(busy)return;busy=true;
 try{
  const {tabs=[]}=await chrome.storage.session.get('tabs');const live=[];
  for(const allowed of tabs){try{const tab=await chrome.tabs.get(allowed.id);if(new URL(tab.url).origin===allowed.origin)live.push(allowed);}catch{}}
  await chrome.storage.session.set({tabs:live});
  const r=await signed('/browser/poll',{tabs:live});
  for(const cmd of r.commands||[]){
   if(cmd.op!=='read'||!live.some(t=>t.id===cmd.tabId))continue;
   let value;
   try{const tab=await chrome.tabs.get(cmd.tabId);if(!live.some(t=>t.id===tab.id&&t.origin===new URL(tab.url).origin))throw Error();const result=await chrome.scripting.executeScript({target:{tabId:tab.id},func:snapshot});value=result[0]?.result||{error:'No snapshot'};}
   catch{value={error:'Tab unavailable or browser permission expired'};}
   await signed('/browser/result',{id:cmd.id,snapshot:value});
  }
 }catch{}finally{busy=false;}
}
chrome.runtime.onMessage.addListener((msg,sender,reply)=>{
 if(sender.id!==chrome.runtime.id||!sender.url?.startsWith(chrome.runtime.getURL('popup.html')))return false;
 serial=serial.then(async()=>{
  if(msg.op==='pair'){await chrome.storage.session.set({session:{...msg.session,counter:0},tabs:[]});await chrome.alarms.create('poll',{periodInMinutes:.5});}
  else if(msg.op==='allow'){const {session,tabs=[]}=await chrome.storage.session.get(['session','tabs']);if(!session||session.expires<=Date.now()||tabs.length>=10)throw Error();await chrome.storage.session.set({tabs:[...tabs.filter(t=>t.id!==msg.tabId),{id:msg.tabId,origin:msg.origin}]});}
  else if(msg.op==='disconnect'){try{await signed('/browser/revoke',{});}catch{}await chrome.storage.session.clear();await chrome.alarms.clear('poll');}
  else throw Error('Unknown action');
  reply({ok:true});
 }).catch(()=>reply({ok:false}));return true;
});
chrome.alarms.onAlarm.addListener(a=>{if(a.name==='poll')serial=serial.then(poll).catch(()=>{});});
chrome.tabs.onRemoved.addListener(id=>{serial=serial.then(async()=>{const {tabs=[]}=await chrome.storage.session.get('tabs');await chrome.storage.session.set({tabs:tabs.filter(t=>t.id!==id)});}).catch(()=>{});});

// The popup alone grants chat access. Content scripts are bound to their own
// tab and origin; they never receive the HMAC key or an operator credential.
chrome.runtime.onMessage.addListener((m,s,reply)=>{
 if(s.id!==chrome.runtime.id)return false;
 const popup=s.url===chrome.runtime.getURL('dashboard.html');
 if(m.op==='corporate.bridge.enable'&&popup){
  serial=serial.then(async()=>{
   if(!Number.isSafeInteger(m.tabId)||typeof m.enabled!=='boolean')throw Error('Invalid tab');
   const tab=await chrome.tabs.get(m.tabId),u=new URL(tab.url);
   if(u.origin!=='https://gemini.google.com')throw Error('Chat JSON adapter currently supports Gemini only');
   const {session,tabs=[]}=await chrome.storage.session.get(['session','tabs']);
   if(!session||session.expires<=Date.now())throw Error('Pair the browser bridge first');
   const live=tabs.filter(t=>t.id!==tab.id);
   if(m.enabled){if(live.length>=10)throw Error('Too many enabled tabs');live.push({id:tab.id,origin:u.origin});}
   await chrome.storage.session.set({tabs:live,['corporate-bridge:'+tab.id]:m.enabled?{origin:u.origin,path:u.pathname}:null});
   await signed('/browser/poll',{tabs:live});
   reply({ok:true,enabled:m.enabled});
  }).catch(e=>reply({ok:false,error:e.message}));return true;
 }
 if(!s.tab||(s.frameId!==undefined&&s.frameId!==0)||!['corporate.bridge.state','corporate.bridge.rpc'].includes(m.op))return false;
 serial=serial.then(async()=>{
  const key='corporate-bridge:'+s.tab.id,{[key]:grant,session}=await chrome.storage.session.get([key,'session']);
  const u=new URL(s.url),tab=await chrome.tabs.get(s.tab.id);
  if(!grant||u.origin!==grant.origin||u.pathname!==grant.path||tab.url!==s.url||!session||session.expires<=Date.now())throw Error('Chat bridge is off or its page/session changed');
  if(m.op==='corporate.bridge.state'){reply({ok:true,enabled:true});return;}
  const r=m.request;
  if(!r||r.jsonrpc!=='2.0'||typeof r.id!=='string'||r.id.length>80||!['initialize','ping','tools/list','tools/call'].includes(r.method)||JSON.stringify(r).length>16384)throw Error('Invalid request');
  // Pending is persisted before dispatch. Never automatically repeat uncertain
  // requests after a worker interruption or a page reload.
  const token='corporate-rpc:'+s.tab.id+':'+grant.path+':'+r.id;
  const old=(await chrome.storage.session.get(token))[token];
  const payload=JSON.stringify(r);
  if(old){if(old.payload!==payload)throw Error('Request ID reused with different content');reply(old.response||{ok:false,error:'Request outcome uncertain; use a new ID to reconcile read-only status'});return;}
  const keys=Object.keys(await chrome.storage.session.get(null)).filter(k=>k.startsWith('corporate-rpc:'));
  if(keys.length>=256)throw Error('Request history full; disconnect and pair again');
  await chrome.storage.session.set({[token]:{payload,state:'pending'}});
  const response={ok:true,response:await signed('/browser/mcp',r)};
  if(r.method==='tools/call'&&r.params?.name==='browser_request_snapshot'&&!response.response.error)await poll();
  await chrome.storage.session.set({[token]:{payload,state:'completed',response}});
  reply(response);
 }).catch(e=>reply({ok:false,error:e.message}));return true;
});
