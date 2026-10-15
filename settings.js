'use strict';
const $=id=>document.getElementById(id);let tab;
const status=t=>{$('status').textContent=t;};
const message=async m=>{try{return await chrome.tabs.sendMessage(tab.id,m);}catch{return null;}};
async function init(){
 const target=Number(new URL(location.href).searchParams.get('tab'));if(Number.isSafeInteger(target)&&target>0)tab=await chrome.tabs.get(target);else [tab]=await chrome.tabs.query({active:true,currentWindow:true});const site=corporateSite(tab?.url);
 $('advanced').open=!site;$('chat').hidden=!site;$('launcher').hidden=!!site;$('site').textContent=site?site.name+' · active tab':'Choose a service';
 if(site){let r=await message({op:'corporate.status'});
  if(!r){try{await chrome.scripting.executeScript({target:{tabId:tab.id},files:['sites.js','chat-only.js']});r=await message({op:'corporate.status'});}catch{}}
  if(r){$('mode').checked=r.enabled;status(r.enabled?'On':'Off');}
  else{$('mode').disabled=true;status('Reload this tab once after installing the extension.');}
 }
 for(const s of CorporateSites){const b=document.createElement('button');b.textContent=s.name;b.onclick=async()=>{await chrome.tabs.update(tab.id,{url:s.url});window.close();};$('sites').append(b);}
 const bridgeKey='corporate-bridge:'+tab.id;const saved=await chrome.storage.session.get(['session',bridgeKey]);const {session}=saved;const grant=saved[bridgeKey];$('jsonBridge').checked=!!(grant&&new URL(tab.url).origin===grant.origin&&new URL(tab.url).pathname===grant.path);$('jsonBridge').disabled=site?.id!=='gemini';$('pairState').textContent=session&&session.expires>Date.now()?'Browser bridge paired (session active).':'Browser bridge not paired in this extension.';
}
$('mode').onchange=async()=>{const r=await message({op:'corporate.mode',enabled:$('mode').checked});status(r?.ok?'Display preference updated.':'Unable to update this page.');};
$('full').onclick=async()=>{await message({op:'corporate.mode',enabled:false});$('mode').checked=false;status('Full page restored.');};
$('settings').onclick=async()=>{const r=await message({op:'corporate.settings'});$('mode').checked=false;status(r?.ok?'Native settings opened.':r?.reason||'Open the site’s settings from the full page.');};
$('key').onclick=()=>{const open=$('passwordPanel').hidden;$('passwordPanel').hidden=!open;$('key').setAttribute('aria-expanded',String(open));};
$('generate').onclick=()=>{try{$('password').value=makeCorporatePassword(Number($('length').value),$('symbols').checked);$('copy').disabled=false;status('Password generated locally.');}catch(e){status(e.message);}};
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText($('password').value);status('Copied.');}catch{status('Select the generated password and copy it manually.');}};
$('reveal').onclick=()=>{const show=$('password').type==='password';$('password').type=show?'text':'password';$('reveal').textContent=show?'Hide':'Show';};
$('pair').onclick=()=>chrome.tabs.create({url:chrome.runtime.getURL('popup.html')});
init().catch(()=>status('This browser page cannot be inspected. Open a normal website first.'));

$('jsonBridge').onchange=async()=>{const enabled=$('jsonBridge').checked;const r=await chrome.runtime.sendMessage({op:'corporate.bridge.enable',tabId:tab.id,enabled});if(!r?.ok){$('jsonBridge').checked=false;status(r?.error||'Unable to enable');return;}try{await chrome.scripting.executeScript({target:{tabId:tab.id},files:['chat-protocol.js','chat-bridge.js']});await message({op:'corporate.bridge.activate',enabled});status(enabled?'JSON tools enabled for this Gemini chat.':'JSON tools disabled.');}catch{status('Reload the Gemini page and enable again.');}};
