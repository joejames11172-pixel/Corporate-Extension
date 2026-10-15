/* Shared registry: URLs are data, never page-supplied commands. */
globalThis.CorporateSites = [
 ['chatgpt','ChatGPT','https://chatgpt.com/',['chatgpt.com','chat.openai.com']],
 ['gemini','Gemini','https://gemini.google.com/',['gemini.google.com']],
 ['claude','Claude','https://claude.ai/',['claude.ai']],
 ['copilot','Copilot','https://copilot.microsoft.com/',['copilot.microsoft.com','copilot.com']],
 ['grok','Grok','https://grok.com/',['grok.com']],
 ['perplexity','Perplexity','https://www.perplexity.ai/',['perplexity.ai','www.perplexity.ai']],
 ['deepseek','DeepSeek','https://chat.deepseek.com/',['chat.deepseek.com']],
 ['qwen','Qwen','https://chat.qwen.ai/',['chat.qwen.ai']],
 ['meta','Meta AI','https://www.meta.ai/',['meta.ai','www.meta.ai']],
 ['mistral','Mistral','https://chat.mistral.ai/',['chat.mistral.ai']],
 ['poe','Poe','https://poe.com/',['poe.com']]
].map(([id,name,url,hosts])=>({id,name,url,hosts}));
globalThis.corporateSite = url => {try {const u=new URL(url);return u.protocol==='https:'?CorporateSites.find(s=>s.hosts.includes(u.hostname)):undefined;}catch{return undefined;}};
