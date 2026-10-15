'use strict';
importScripts('sites.js','native-transport.js','browser-snapshot.js');
let serial=Promise.resolve();
const settingsSender=s=>s.id===chrome.runtime.id&&['dashboard.html','settings.html'].some(p=>s.url?.split('?')[0]===chrome.runtime.getURL(p));
const enqueue=(fn,reply)=>{serial=serial.then(fn).then(reply,e=>reply({ok:false,error:e.message}));return true;};
async function preference(){const v=await chrome.storage.local.get('enabled');return v.enabled!==false;}
async function grant(tabId){
 const tab=await chrome.tabs.get(tabId),site=corporateSite(tab.url),enabled=await preference();
 if(!enabled||site?.id!=='gemini')return null;
 const state=await corporateNative('status');if(!state.enabled)return null;
 const u=new URL(tab.url),item={id:tab.id,origin:u.origin,path:u.pathname};
 await chrome.storage.session.set({activeGrant:item});return item;
}
async function pump(){
 const {activeGrant:g}=await chrome.storage.session.get('activeGrant');const enabled=await preference();let tabs=[];
 if(g&&enabled){try{const t=await chrome.tabs.get(g.id),u=new URL(t.url);if(u.origin===g.origin&&u.pathname===g.path)tabs=[{id:g.id,origin:g.origin}];}catch{}}
 const r=await corporateNative('poll',{tabs});
 for(const cmd of r.commands||[]){
  if(cmd.op!=='read'||!tabs.some(t=>t.id===cmd.tabId))continue;
  let value;
  try{const t=await chrome.tabs.get(cmd.tabId),u=new URL(t.url);if(!g||u.origin!==g.origin||u.pathname!==g.path)throw Error('Tab changed');const out=await chrome.scripting.executeScript({target:{tabId:t.id},func:corporateSnapshot});value=out[0]?.result||{error:'Snapshot unavailable'};}
  catch{value={error:'Tab changed or browser permission unavailable'};}
  await corporateNative('capture',{id:cmd.id,snapshot:value});
 }
}
async function activate(tabId){
 try{
  const g=await grant(tabId);if(!g)return;
  await pump();
  await chrome.tabs.sendMessage(tabId,{op:'corporate.bridge.activate',enabled:true});
 }catch{}
}
chrome.runtime.onMessage.addListener((m,s,reply)=>{
 if(s.id!==chrome.runtime.id)return false;
 if(['corporate.pref.get','corporate.pref.set'].includes(m.op)&&s.tab)return enqueue(async()=>{
  if(m.op==='corporate.pref.set'){if(typeof m.enabled!=='boolean')throw Error('Boolean required');/* Layout-only messages cannot change helper enrollment or peer permissions. */}
  return {enabled:await preference()};
 },reply);
 if(m.op==='corporate.connection.status'&&settingsSender(s))return enqueue(async()=>{
  const state=await corporateNative('status');if(state.enabled!==await preference())await chrome.storage.local.set({enabled:state.enabled});
  if(state.enabled)await activate(m.tabId);
  return {ok:true,paired:true,enabled:state.enabled,reachable:state.connected,master_ip:state.master_ip};
 },reply);
 if(m.op==='corporate.bridge.enable'&&settingsSender(s))return enqueue(async()=>{
  if(typeof m.enabled!=='boolean')throw Error('Boolean required');
  await corporateNative('set',{enabled:m.enabled});await chrome.storage.local.set({enabled:m.enabled});
  if(m.enabled)await activate(m.tabId);else{await chrome.storage.session.remove('activeGrant');await corporateNative('poll',{tabs:[]}).catch(()=>{});}
  return {ok:true,enabled:m.enabled};
 },reply);
 if(!s.tab||(s.frameId!==undefined&&s.frameId!==0)||!['corporate.bridge.state','corporate.bridge.rpc'].includes(m.op))return false;
 return enqueue(async()=>{
  const t=await chrome.tabs.get(s.tab.id);if(t.url!==s.url||corporateSite(t.url)?.id!=='gemini')throw Error('Unsupported or changed chat');
  const g=await grant(s.tab.id);if(!g)throw Error('Corporate Helper is off');
  await pump();
  if(m.op==='corporate.bridge.state')return {ok:true,enabled:true};
  const r=m.request;if(!r||r.jsonrpc!=='2.0'||typeof r.id!=='string'||r.id.length>80||!['initialize','ping','tools/list','tools/call'].includes(r.method)||JSON.stringify(r).length>16384)throw Error('Invalid request');
  const key='corporate-rpc:'+s.tab.id+':'+g.path+':'+r.id,payload=JSON.stringify(r),old=(await chrome.storage.session.get(key))[key];
  if(old){if(old.payload!==payload)throw Error('Request ID reused with different content');return old.response||{ok:false,error:'Request outcome uncertain; no automatic replay'};}
  if(Object.keys(await chrome.storage.session.get(null)).filter(k=>k.startsWith('corporate-rpc:')).length>=256)throw Error('Request history full; reload the extension');
  await chrome.storage.session.set({[key]:{payload,state:'pending'}});
  const response={ok:true,response:await corporateNative('rpc',r)};
  await chrome.storage.session.set({[key]:{payload,state:'completed',response}});
  await pump();return response;
 },reply);
});
chrome.alarms.onAlarm.addListener(a=>{if(a.name==='helper-reconnect')serial=serial.then(async()=>{const tabs=await chrome.tabs.query({active:true,currentWindow:true});if(tabs[0])await activate(tabs[0].id);await pump();}).catch(()=>{});});
chrome.tabs.onActivated.addListener(t=>{serial=serial.then(()=>activate(t.tabId)).catch(()=>{});});
chrome.tabs.onUpdated.addListener((id,change)=>{if(change.status==='complete')serial=serial.then(async()=>{const t=await chrome.tabs.get(id);if(t.active)await activate(id);}).catch(()=>{});});
chrome.tabs.onRemoved.addListener(id=>{serial=serial.then(async()=>{const {activeGrant:g}=await chrome.storage.session.get('activeGrant');if(g?.id===id)await chrome.storage.session.remove('activeGrant');}).catch(()=>{});});
chrome.alarms.create('helper-reconnect',{periodInMinutes:.5});
