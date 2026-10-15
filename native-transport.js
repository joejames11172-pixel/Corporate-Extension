/* Extension talks only to the registered local native host. No LAN dialer. */
(()=>{
 let port=null,sequence=0;const pending=new Map();
 globalThis.corporateNative=(op,data={})=>new Promise((resolve,reject)=>{
  if(pending.size>=16){reject(Error('Helper request limit reached'));return;}
  try{
   if(!port){
    port=chrome.runtime.connectNative('com.corporate.helper');
    port.onMessage.addListener(m=>{const p=pending.get(m.id);if(!p)return;clearTimeout(p.timer);pending.delete(m.id);if(m.ok)p.resolve(m.result);else p.reject(Error(m.error||'Helper rejected request'));});
    port.onDisconnect.addListener(()=>{const reason=chrome.runtime.lastError?.message||'Local helper disconnected';port=null;for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error(reason));}pending.clear();});
   }
   const id=String(++sequence),timer=setTimeout(()=>{pending.delete(id);reject(Error('Helper response timed out; outcome uncertain'));},25000);
   pending.set(id,{resolve,reject,timer});port.postMessage({id,op,data});
  }catch(e){reject(e);}
 });
})();
