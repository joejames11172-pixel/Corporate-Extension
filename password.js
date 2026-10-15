/* Rejection sampling avoids modulo bias; no storage or network calls. */
globalThis.makeCorporatePassword=(length,symbols=true)=>{
 if(!Number.isInteger(length)||length<12||length>128)throw Error('Choose 12–128 characters.');
 const groups=['ABCDEFGHJKLMNPQRSTUVWXYZ','abcdefghijkmnopqrstuvwxyz','23456789'];
 if(symbols)groups.push('!@#$%*-_=+?');
 const alphabet=groups.join(''),limit=256-(256%alphabet.length);
 for(;;){let out='';while(out.length<length){const bytes=crypto.getRandomValues(new Uint8Array(128));for(const b of bytes)if(b<limit&&out.length<length)out+=alphabet[b%alphabet.length];}
  if(groups.every(g=>[...out].some(c=>g.includes(c))))return out;
 }
};
