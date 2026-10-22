/* ============================================================
   OSC CrêSer — Camada de acesso à API (multi-provedor)
   ------------------------------------------------------------
   Todos os provedores abaixo usam o mesmo protocolo
   (endpoint /chat/completions no formato OpenAI), então o mesmo
   código de chamada/streaming serve para todos.

   Monta as mensagens (guardrails + skill + histórico) e chama
   o endpoint com streaming.
   ============================================================ */

const PROVIDERS = {
  gemini: {
    name: "Google Gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    keyUrl: "https://aistudio.google.com/apikey",
    keyHint: "Chave gratuita no Google AI Studio (aistudio.google.com/apikey), sem cartão de crédito.",
    defaultModel: "gemini-3-flash-preview",
    models: [
      ["gemini-3-flash-preview", "gemini-3-flash-preview (recomendado — atual e com camada grátis)"],
      ["gemini-3.1-pro-preview", "gemini-3.1-pro-preview (mais capaz, limite menor no grátis)"],
      ["gemini-2.5-flash", "gemini-2.5-flash (estável)"]
    ]
  },

  groq: {
    name: "Groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    keyUrl: "https://console.groq.com/keys",
    keyHint: "Chave gratuita em console.groq.com/keys. Muito rápido, com limite diário de requisições.",
    defaultModel: "openai/gpt-oss-120b",
    models: [
      ["openai/gpt-oss-120b", "openai/gpt-oss-120b (recomendado)"],
      ["qwen/qwen3.6-27b", "qwen/qwen3.6-27b"],
      ["moonshotai/kimi-k2-instruct", "moonshotai/kimi-k2-instruct"]
    ]
  },

  openrouter: {
    name: "OpenRouter",
    url: "https://openrouter.ai/api/v1/chat/completions",
    keyUrl: "https://openrouter.ai/keys",
    keyHint: "Chave em openrouter.ai/keys. Acessa vários modelos; os terminados em \":free\" são gratuitos.",
    defaultModel: "meta-llama/llama-3.3-70b-instruct:free",
    models: [
      ["meta-llama/llama-3.3-70b-instruct:free", "llama-3.3-70b (grátis)"],
      ["google/gemini-2.0-flash-exp:free", "gemini-2.0-flash-exp (grátis)"],
      ["deepseek/deepseek-chat-v3-0324:free", "deepseek-chat-v3 (grátis)"]
    ]
  },

  openai: {
    name: "OpenAI (API paga)",
    url: "https://api.openai.com/v1/chat/completions",
    keyUrl: "https://platform.openai.com/api-keys",
    keyHint: "Requer contratação de créditos da API (não incluída no plano ChatGPT Business Nonprofit).",
    defaultModel: "gpt-4o",
    models: [
      ["gpt-4o", "gpt-4o"],
      ["gpt-4o-mini", "gpt-4o-mini (mais barato)"],
      ["gpt-4.1", "gpt-4.1"]
    ]
  }
};

/**
 * Busca a lista de modelos disponíveis no provedor (endpoint /models).
 * @param {string} providerId id do provedor
 * @param {string} apiKey     chave do provedor
 * @returns {Promise<string[]>} ids dos modelos de chat disponíveis
 */
async function listModels(providerId, apiKey) {
  const provider = PROVIDERS[providerId];
  if (!provider) throw new Error("Provedor desconhecido");

  const url = provider.url.replace("/chat/completions", "/models");
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${apiKey}` }
  });
  if (!res.ok) {
    let detail = "";
    try {
      const err = await res.json();
      detail = err.error?.message || JSON.stringify(err);
    } catch (_) { /* sem corpo JSON */ }
    throw new Error(`Erro ${res.status} ao listar modelos (${provider.name})${detail ? ": " + detail : ""}`);
  }

  const json = await res.json();
  // formato padrão OpenAI-compatible: { data: [{ id: "..." }] }
  const ids = (json.data || [])
    .map((m) => m.id || m.name)
    .filter(Boolean)
    // descarta modelos que não servem para chat de texto
    .filter((id) => !/embed|whisper|tts|imagen|image|guard|moderation|video|vision-only| dall-e/i.test(id));
  return [...new Set(ids)].sort();
}

/**
 * Chama a API do provedor selecionado com streaming.
 * @param {object} opts
 *   provider    {string}  id do provedor ("gemini", "groq", ...)
 *   apiKey      {string}  chave do provedor
 *   model       {string}  ex.: "gemini-2.0-flash"
 *   temperature {number}  0–1
 *   skill       {object|null} skill ativa (de js/skills.js)
 *   history     {Array<{role, content}>} mensagens já trocadas
 *   userMessage {string}  nova mensagem do usuário
 *   onDelta     {function(string)} recebe cada fragmento de texto
 * @returns {Promise<string>} texto completo da resposta
 */
async function chatCompletion(opts) {
  const provider = PROVIDERS[opts.provider] || PROVIDERS.gemini;

  const messages = [
    { role: "system", content: buildSystemPrompt(opts.skill) },
    ...opts.history,
    { role: "user", content: opts.userMessage }
  ];

  const res = await fetch(provider.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${opts.apiKey}`
    },
    body: JSON.stringify({
      model: opts.model,
      temperature: opts.temperature,
      stream: true,
      messages
    })
  });

  if (!res.ok) {
    let detail = "";
    try {
      const err = await res.json();
      detail = err.error?.message || JSON.stringify(err);
    } catch (_) { /* resposta sem corpo JSON */ }
    throw new Error(`Erro ${res.status} na API (${provider.name})${detail ? ": " + detail : ""}`);
  }

  // Leitura do stream SSE
  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let full = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop(); // guarda linha incompleta

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") continue;
      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) {
          full += delta;
          opts.onDelta?.(delta);
        }
      } catch (_) { /* ignora fragmentos inválidos */ }
    }
  }
  return full;
}
