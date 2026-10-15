const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
function environment(){
 const root=path.resolve(__dirname,'..'),listeners=[],session={},local={},sent=[],calls=[];let enabled=true;
 const storage=state=>({get:async keys=>keys===null?{...state}:Object.fromEntries((Array.isArray(keys)?keys:[keys]).map(k=>[k,state[k]])),set:async v=>Object.assign(state,v),remove:async k=>{delete state[k]}});
 const url='https://gemini.google.com/app/jack',tab={id:7,url,active:true};
 let nativeMessage;const port={onMessage:{addListener:f=>nativeMessage=f},onDisconnect:{addListener(){}},postMessage:m=>{calls.push(m);let result;
 if(m.op==='status')result={enabled,connected:true,master_ip:'10.0.0.195'};
 else if(m.op==='set'){enabled=m.data.enabled;result={enabled};}
 else if(m.op==='poll')result={commands:[]};else if(m.op==='rpc')result={jsonrpc:'2.0',id:m.data.id,result:{}};else result={accepted:true};
 Promise.resolve().then(()=>nativeMessage({id:m.id,ok:true,result}));}};
 const chrome={runtime:{id:'own',getURL:p=>'chrome-extension://own/'+p,connectNative:()=>port,onMessage:{addListener:f=>listeners.push(f)}},storage:{session:storage(session),local:storage(local)},tabs:{get:async id=>{if(id!==7)throw Error('Unknown tab');return tab},query:async()=>[tab],sendMessage:async(id,m)=>{sent.push(m);return{ok:true}},onActivated:{addListener(){}},onUpdated:{addListener(){}},onRemoved:{addListener(){}}},scripting:{executeScript:async()=>[{result:{text:'visible page'}}]},alarms:{create(){},onAlarm:{addListener(){}}}};
 let c;c=vm.createContext({chrome,URL,setTimeout,clearTimeout,console,importScripts:(...names)=>{for(const n of names)vm.runInContext(fs.readFileSync(path.join(root,n),'utf8'),c)}});vm.runInContext(fs.readFileSync(path.join(root,'background.js'),'utf8'),c);
 const sender={id:'own',url,frameId:0,tab:{id:7}},popup={id:'own',url:'chrome-extension://own/dashboard.html'};
 const send=(m,s=sender)=>new Promise(resolve=>{const used=listeners[0](m,s,resolve);if(!used)resolve(null)});
 return {send,popup,sender,calls,sent,local,session};
}
test('new active Gemini chat enrolls automatically through local native host',async()=>{const e=environment(),r=await e.send({op:'corporate.bridge.state'});assert.equal(r.enabled,true);assert(e.calls.some(c=>c.op==='status'));assert(e.calls.some(c=>c.op==='poll'));assert.equal(e.session.activeGrant.origin,'https://gemini.google.com');assert.equal(Object.keys(e.session).some(k=>/key|password|session/i.test(k)),false);});
test('single off switch disables requests and no content script may enable it',async()=>{const e=environment();assert.equal(await e.send({op:'corporate.bridge.enable',enabled:true,tabId:7}),null);assert.equal((await e.send({op:'corporate.bridge.enable',enabled:false,tabId:7},e.popup)).ok,true);const r=await e.send({op:'corporate.bridge.rpc',request:{jsonrpc:'2.0',id:'x',method:'tools/list'}});assert.equal(r.ok,false);assert.equal(e.calls.filter(c=>c.op==='rpc').length,0);assert.equal(e.local.enabled,false);});
test('duplicate IDs do not replay tools; changed payload fails',async()=>{const e=environment(),request={jsonrpc:'2.0',id:'one',method:'tools/list'};assert.equal((await e.send({op:'corporate.bridge.rpc',request})).ok,true);assert.equal((await e.send({op:'corporate.bridge.rpc',request})).ok,true);assert.equal(e.calls.filter(c=>c.op==='rpc').length,1);assert.equal((await e.send({op:'corporate.bridge.rpc',request:{...request,method:'ping'}})).ok,false);});
test('changed page URL cannot request tools',async()=>{const e=environment(),r=await e.send({op:'corporate.bridge.rpc',request:{jsonrpc:'2.0',id:'one',method:'tools/list'}},{...e.sender,url:'https://gemini.google.com/app/other'});assert.equal(r.ok,false);assert.equal(e.calls.length,0);});
