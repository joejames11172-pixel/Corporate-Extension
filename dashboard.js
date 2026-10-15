
'use strict';
const $=id=>document.getElementById(id);let tab,enabled=false;
async function state(){
 const r=await chrome.runtime.sendMessage({op:'corporate.connection.status',tabId:tab.id});
 enabled=r?.enabled===true;$('power').textContent=enabled?'On — turn off':'Off — turn on';
 $('power').setAttribute('aria-pressed',String(enabled));
 $('status').textContent=!r?.paired?'Setup needed: open Settings and pair Corporate Helper.':!r.reachable?'Disconnected: helper could not be reached. The Windows SSH supervisor is not installed by this extension.':enabled?'Connected — JSON tools and chat-only mode are on.':'Helper reachable — this chat is off.';
}
$('settings').onclick=()=>chrome.tabs.create({url:chrome.runtime.getURL('settings.html')+'?tab='+tab.id});
$('power').onclick=async()=>{
 $('power').disabled=true;
 try{
  const next=!enabled,r=await chrome.runtime.sendMessage({op:'corporate.bridge.enable',tabId:tab.id,enabled:next});
  if(!r?.ok)throw Error(r?.error||'Unable to change connection');
  await chrome.scripting.executeScript({target:{tabId:tab.id},files:['sites.js','chat-only.js','chat-protocol.js','chat-bridge.js']});
  await chrome.tabs.sendMessage(tab.id,{op:'corporate.mode',enabled:next});
  await chrome.tabs.sendMessage(tab.id,{op:'corporate.bridge.activate',enabled:next});
  await state();
 }catch(e){$('status').textContent=e.message;}finally{$('power').disabled=false;}
};
(async()=>{[tab]=await chrome.tabs.query({active:true,currentWindow:true});const s=corporateSite(tab?.url);$('site').textContent=s?s.name:'Choose an AI service in Settings';if(s?.id!=='gemini'){$('status').textContent='JSON chat tools currently support Gemini. Open Settings for other services.';return;}await state();$('power').disabled=false;})().catch(()=>{$('status').textContent='Unable to inspect this tab.';});
