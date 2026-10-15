(() => {
 'use strict';
 if(globalThis.__corporateChatOnly)return;globalThis.__corporateChatOnly=true;
 const site=corporateSite(location.href);if(!site)return;
 let enabled=true,timer;
 const hidden=new Map();
 const composerSelector='textarea,[contenteditable="true"][role="textbox"],[contenteditable="true"].ql-editor,[contenteditable="true"][data-placeholder]';
 const panelSelector='nav,aside,[role="navigation"],bard-sidenav,[data-testid="sidebar"],[data-test-id="side-nav"],.sidenav-container';
 const visible=e=>!!(e.getClientRects().length)&&getComputedStyle(e).visibility!=='hidden';
 const restore=()=>{for(const [e,style] of hidden){if(style===null)e.removeAttribute('style');else e.setAttribute('style',style);}hidden.clear();};
 function update(){
  observer.disconnect();
  // Reconcile incrementally: restoring every panel on every DOM mutation
  // makes Gemini rebuild its sidebar and triggers another observer pass.
  for(const e of hidden.keys())if(!e.isConnected)hidden.delete(e);
  if(enabled&&!/\/(?:login|signin|sign-in|auth|settings|account)(?:\/|$)/i.test(location.pathname)){
   const composer=[...document.querySelectorAll(composerSelector)].find(visible);
   const conversation=document.querySelector('main,[role="main"],chat-window');
   if(composer&&conversation){
    for(const e of document.querySelectorAll(panelSelector)){
     if(e.contains(composer)||e.contains(conversation)||e.closest('[role="dialog"]'))continue;
     // Never hide a whole panel that owns a native control the user asked to retain.
     if([...e.querySelectorAll('button,a,input')].some(x=>/new chat|settings|upload|attach|microphone|voice|sign in/i.test((x.getAttribute('aria-label')||'')+' '+(x.textContent||''))))continue;
     if(!hidden.has(e)){hidden.set(e,e.getAttribute('style'));e.style.setProperty('display','none','important');}
    }
   }
  }
  if(!enabled||/\/(?:login|signin|sign-in|auth|settings|account)(?:\/|$)/i.test(location.pathname))restore();
  observer.observe(document.documentElement,{childList:true,subtree:true});
 }
 const observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(update,200);});
 chrome.runtime.sendMessage({op:'corporate.pref.get'}).then(v=>{enabled=v?.enabled!==false;update();}).catch(()=>{enabled=false;update();});
 chrome.runtime.onMessage.addListener((m,s,reply)=>{
  if(s.id!==chrome.runtime.id)return;
  if(m.op==='corporate.status')reply({site:site.id,enabled,hidden:hidden.size,composer:!![...document.querySelectorAll(composerSelector)].find(visible)});
  else if(m.op==='corporate.mode'){
   enabled=!!m.enabled;chrome.runtime.sendMessage({op:'corporate.pref.set',enabled}).catch(()=>{});update();reply({ok:true});
  }else if(m.op==='corporate.settings'){
   enabled=false;chrome.runtime.sendMessage({op:'corporate.pref.set',enabled:false}).catch(()=>{});update();
   const candidates=[...document.querySelectorAll('button,a,[role="menuitem"]')];
   const settings=candidates.find(e=>visible(e)&&/^(settings|settings & help|settings and help)$/i.test((e.getAttribute('aria-label')||e.textContent||'').trim()));
   if(settings){settings.click();reply({ok:true});}else reply({ok:false,reason:'Full page restored. Open the site’s native account/settings menu.'});
  }
 });
 window.addEventListener('popstate',update);
})();
