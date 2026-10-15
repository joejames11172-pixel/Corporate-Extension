function snapshot(){
 if(/\/(?:keys?|api[-_]?keys?|login|signin|authenticate)(?:\/|$)/i.test(location.pathname))return{error:'Sensitive account page disabled in prototype'};
 const redact=s=>s.replace(/(?:gsk_|sk-|AIza)[A-Za-z0-9_-]{12,}/g,'[redacted]').replace(/\b[A-Fa-f0-9]{48,}\b/g,'[redacted]').replace(/\b[A-Za-z0-9_-]{60,}\b/g,'[redacted]');
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),out=[];let total=0,node;
 while((node=walker.nextNode())&&total<12000){const p=node.parentElement;if(!p||p.closest('input,textarea,select,script,style,noscript,[contenteditable],[hidden],[aria-hidden="true"]'))continue;const style=getComputedStyle(p);if(style.display==='none'||style.visibility==='hidden')continue;const t=node.textContent.trim();if(t){out.push(t);total+=t.length;}}
 return{origin:location.origin,path:redact(location.pathname),title:redact(document.title).slice(0,200),text:redact(out.join('\n')).slice(0,12000)};
}

globalThis.corporateSnapshot=snapshot;
