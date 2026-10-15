/* Explicit envelope; ordinary JSON and quoted requests are not commands. */
(()=>{
 const parse=text=>{if(typeof text!=='string'||text.length>16384)return null;try{const v=JSON.parse(text);if(!v||Object.keys(v).join(',')!=='corporate_helper')return null;const r=v.corporate_helper;if(!r||r.jsonrpc!=='2.0'||typeof r.id!=='string'||!r.id||r.id.length>80||!['initialize','ping','tools/list','tools/call'].includes(r.method))return null;return r;}catch{return null;}};
 globalThis.CorporateProtocol={parse};
})();
