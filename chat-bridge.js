(()=>{
 'use strict';if(globalThis.__corporateJSONBridge)return;globalThis.__corporateJSONBridge=true;
 if(location.origin!=='https://gemini.google.com')return;
 let enabled=false,timer,running=false,lastPath=location.pathname;
 const seen=new Set();
 const blocks=()=>[...document.querySelectorAll('model-response pre code,model-response pre')].filter(e=>!e.querySelector('code'));
 const baseline=()=>{for(const e of blocks())seen.add(e.textContent.trim());};
 baseline();
 const panel=document.createElement('section');panel.id='corporate-helper-results';
 panel.style.cssText='position:fixed;bottom:12px;right:12px;z-index:2147483647;background:#fff;color:#111;border:2px solid #245;padding:12px;max-width:400px;max-height:40vh;overflow:auto;font:14px sans-serif;display:none';
 const title=document.createElement('strong');title.textContent='Corporate Helper result';
 const output=document.createElement('textarea');output.readOnly=true;output.style.cssText='display:block;width:360px;height:120px';
 const insert=document.createElement('button');insert.textContent='Insert result into chat';
 const close=document.createElement('button');close.textContent='Hide';close.onclick=()=>panel.style.display='none';
 panel.append(title,output,insert,close);document.documentElement.append(panel);
 function stage(text){
  output.value=text;panel.style.display='block';
  // Never overwrite a draft or send a result twice. When native controls cannot
  // be identified, leave the result here for the user to copy/insert.
  insert.onclick=()=>deliver(text,false);
 }
 function deliver(text,send){
  const editor=document.querySelector('rich-textarea [contenteditable="true"],.ql-editor[contenteditable="true"]');
  if(!editor||editor.textContent.trim()||location.pathname!==lastPath)return false;
  editor.focus();document.execCommand('insertText',false,text);editor.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data:text}));
  if(send)setTimeout(()=>{const b=document.querySelector('button[aria-label="Send message"],button[data-test-id="send-button"]');if(b&&!b.disabled&&editor.textContent.trim()===text.trim())b.click();},250);
  return true;
 }
 async function scan(){
  if(running||!enabled)return;
  if(location.pathname!==lastPath){enabled=false;baseline();return;}
  if(document.querySelector('button[aria-label="Stop response"],button[aria-label="Stop generating"]'))return;
  running=true;
  try{
   for(const e of blocks()){
    const text=e.textContent.trim();if(seen.has(text))continue;
    const request=CorporateProtocol.parse(text);if(!request)continue;
    seen.add(text);
    const r=await chrome.runtime.sendMessage({op:'corporate.bridge.rpc',request});
    const result=JSON.stringify({corporate_helper_result:r?.ok?r.response:{jsonrpc:'2.0',id:request.id,error:{code:-32000,message:r?.error||'Bridge unavailable'}}});
    stage(result);deliver(result,true);
    break;
   }
  }finally{running=false;}
 }
 const observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(scan,1500);});observer.observe(document.body,{childList:true,subtree:true,characterData:true});
 chrome.runtime.onMessage.addListener((m,s,reply)=>{
  if(s.id!==chrome.runtime.id)return;
  if(m.op==='corporate.bridge.activate'){baseline();lastPath=location.pathname;enabled=m.enabled===true;reply({ok:true,enabled});}
 });
 chrome.runtime.sendMessage({op:'corporate.bridge.state'}).then(r=>{enabled=r?.enabled===true;}).catch(()=>{});
})();
