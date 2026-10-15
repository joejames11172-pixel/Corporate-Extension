'use strict';
const $=id=>document.getElementById(id);let tab;
const status=t=>{$('status').textContent=t;};
$('settings').onclick=async()=>{try{const r=await chrome.tabs.sendMessage(tab.id,{op:'corporate.settings'});status(r?.ok?'Native settings opened.':r?.reason||'Open the site’s settings from its native menu.');}catch{status('Open settings from a normal AI chat tab.');}};
$('generate').onclick=()=>{try{$('password').value=makeCorporatePassword(Number($('length').value),$('symbols').checked);$('copy').disabled=false;status('Generated locally.');}catch(e){status(e.message);}};
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText($('password').value);status('Copied.');}catch{status('Select and copy the password manually.');}};
$('reveal').onclick=()=>{$('password').type=$('password').type==='password'?'text':'password';$('reveal').textContent=$('password').type==='password'?'Show':'Hide';};
(async()=>{const id=Number(new URL(location.href).searchParams.get('tab'));if(Number.isSafeInteger(id)&&id>0)tab=await chrome.tabs.get(id);else [tab]=await chrome.tabs.query({active:true,currentWindow:true});const site=corporateSite(tab?.url);$('site').textContent=site?site.name:'Choose an AI service';$('settings').disabled=!site;for(const s of CorporateSites){const b=document.createElement('button');b.textContent=s.name;b.onclick=()=>chrome.tabs.update(tab.id,{url:s.url});$('sites').append(b);}})().catch(()=>status('Open settings from the Corporate Extension button.'));
