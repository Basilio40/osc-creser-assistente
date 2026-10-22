/* ============================================================
   OSC CrêSer — Estado da aplicação e interface
   ------------------------------------------------------------
   Suporta vários provedores (Gemini, Groq, OpenRouter, OpenAI),
   cada um com sua própria chave e lista de modelos.
   ============================================================ */

"use strict";

// ---------- Estado ----------
const state = {
  provider: localStorage.getItem("creser_provider") || "gemini",
  // uma chave por provedor, salvas separadamente
  apiKeys: JSON.parse(localStorage.getItem("creser_api_keys") || "{}"),
  // um modelo por provedor (chave versionada p/ ignorar modelos descontinuados salvos antes)
  models: JSON.parse(localStorage.getItem("creser_models_v3") || "{}"),
  temperature: parseFloat(localStorage.getItem("creser_temperature") || "0.4"),
  activeSkillId: null,
  history: [],          // [{role, content}]
  busy: false
};

function apiKeyOf(providerId) {
  return state.apiKeys[providerId] || "";
}

function modelOf(providerId) {
  const p = PROVIDERS[providerId];
  return state.models[providerId] || p.defaultModel;
}

// ---------- Atalhos DOM ----------
const $ = (id) => document.getElementById(id);
const chatEl = $("chat");
const inputEl = $("user-input");
const sendBtn = $("btn-send");
const emptyEl = $("empty-state");

// ---------- Sidebar: renderizar skills ----------
function renderSkills() {
  const nav = $("skills-nav");
  nav.innerHTML = "";
  for (const group of SKILL_GROUPS) {
    const title = document.createElement("p");
    title.className = "skill-group-title";
    title.textContent = group.group;
    nav.appendChild(title);

    for (const skill of group.skills) {
      const btn = document.createElement("button");
      btn.className = "skill-item" + (skill.id === state.activeSkillId ? " active" : "");
      btn.dataset.skillId = skill.id;
      btn.innerHTML = `<span class="emoji">${skill.emoji}</span>${skill.name}`;
      btn.addEventListener("click", () => selectSkill(skill.id));
      nav.appendChild(btn);
    }
  }
}

function selectSkill(id) {
  const skill = findSkillById(id);
  if (!skill) return;
  state.activeSkillId = id;
  state.history = [];          // trocar skill inicia nova conversa
  renderSkills();
  renderChat();
  $("active-skill-name").textContent = `${skill.emoji} ${skill.name}`;
  $("active-skill-desc").textContent = skill.desc;
  // botão de modelo de prompt só para skills que têm modelo
  $("btn-prompt-template").classList.toggle("hidden", !PROMPT_TEMPLATES[id]);
  updateInputState();
}

function updateInputState() {
  const hasKey = !!apiKeyOf(state.provider);
  const ready = !!state.activeSkillId && hasKey && !state.busy;
  inputEl.disabled = !ready;
  sendBtn.disabled = !ready;
  inputEl.placeholder = !state.activeSkillId
    ? "Selecione uma skill na barra lateral para começar…"
    : (!hasKey ? "Configure sua chave da API em ⚙ Configurações…" : "Digite sua mensagem… (Enter envia)");
  $("model-badge").textContent = hasKey
    ? `${PROVIDERS[state.provider].name} · ${modelOf(state.provider)}`
    : "sem chave";
}

// ---------- Chat: renderização ----------

/** Converte Markdown em HTML seguro (títulos, negrito, tabelas, listas…). */
function renderMarkdown(text) {
  if (typeof marked === "undefined") {
    // sem internet p/ CDN: cai em texto puro com quebras de linha
    const pre = document.createElement("pre");
    pre.textContent = text;
    return pre.innerHTML;
  }
  const html = marked.parse(text, { gfm: true, breaks: true });
  return (typeof DOMPurify !== "undefined")
    ? DOMPurify.sanitize(html)
    : html; // fallback raro (CDN do DOMPurify offline)
}

/** Barra de ações: copiar (Markdown), baixar PDF e baixar Word (.doc). */
function buildMsgActions(text, contentEl) {
  const bar = document.createElement("div");
  bar.className = "msg-actions";

  // --- Copiar Markdown ---
  const btnCopy = document.createElement("button");
  btnCopy.className = "btn-copy";
  btnCopy.textContent = "⧉ Copiar";
  btnCopy.title = "Copiar resposta em Markdown (cola formatada no Notion/Obsidian)";
  btnCopy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(text);
      flash(btnCopy, "✓ Copiado");
    } catch (_) {
      flash(btnCopy, "✗ Erro");
    }
  });
  bar.appendChild(btnCopy);

  // --- Baixar PDF ---
  const btnPdf = document.createElement("button");
  btnPdf.className = "btn-copy";
  btnPdf.textContent = "⬇ PDF";
  btnPdf.title = "Baixar resposta em PDF";
  btnPdf.addEventListener("click", () => downloadAsPdf(contentEl, btnPdf));
  bar.appendChild(btnPdf);

  return bar;
}

/** Feedback temporário no botão. */
function flash(btn, msg) {
  const old = btn.textContent;
  btn.textContent = msg;
  setTimeout(() => (btn.textContent = old), 1500);
}

/** Gera nome de arquivo amigável a partir da skill/pergunta. */
function exportFilename(ext) {
  const skill = findSkillById(state.activeSkillId);
  const base = (skill ? skill.name : "resposta")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").toLowerCase();
  const date = new Date().toISOString().slice(0, 10);
  return `creser-${base}-${date}.${ext}`;
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Baixa o conteúdo renderizado da resposta como PDF. */
async function downloadAsPdf(contentEl, btn) {
  if (typeof html2pdf === "undefined") {
    alert("Biblioteca de PDF não carregada (verifique sua conexão com a internet e recarregue a página).");
    return;
  }
  flash(btn, "… Gerando");
  try {
    // clona o conteúdo p/ não interferir na tela (largura fixa de página A4)
    const clone = contentEl.cloneNode(true);
    clone.style.width = "720px";
    clone.style.maxWidth = "720px";
    clone.style.fontSize = "12px";
    clone.style.background = "#ffffff";
    clone.style.color = "#1a1a1a";

    await html2pdf().set({
      margin: [12, 12, 12, 12],
      filename: exportFilename("pdf"),
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] }
    }).from(clone).save();
    flash(btn, "✓ Baixado");
  } catch (err) {
    console.error(err);
    flash(btn, "✗ Erro");
    alert("Falha ao gerar o PDF: " + err.message);
  }
}

function hideEmptyState() {
  if (emptyEl) emptyEl.style.display = "none";
}

function addMessage(role, text, opts = {}) {
  hideEmptyState();
  const div = document.createElement("div");
  div.className = `msg ${role}`;

  const content = document.createElement("div");
  content.className = "msg-content";
  // assistente recebe Markdown; usuário é sempre texto puro
  if (role === "assistant" && opts.markdown) {
    content.innerHTML = renderMarkdown(text);
  } else {
    content.textContent = text;
  }
  div.appendChild(content);

  // ações (copiar / PDF / Word) em mensagens do assistente
  if (role === "assistant" && text) {
    div.appendChild(buildMsgActions(text, content));
  }

  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
  return div;
}

function renderChat() {
  chatEl.innerHTML = "";
  if (state.history.length === 0) {
    chatEl.appendChild(emptyEl);
    emptyEl.style.display = "";
    return;
  }
  for (const m of state.history) {
    addMessage(m.role, m.content, { markdown: m.role === "assistant" });
  }
}

// ---------- Envio ----------
async function handleSend(e) {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text || state.busy) return;

  inputEl.value = "";
  autoResize(inputEl);
  addMessage("user", text);

    const skill = findSkillById(state.activeSkillId);
    const bubble = addMessage("assistant", "");
    // registra o prompt enviado no histórico
    logPrompt({ skillId: state.activeSkillId, skillName: skill?.name || "", prompt: text });
  const bubbleContent = bubble.querySelector(".msg-content");
  bubbleContent.innerHTML = '<span class="typing"></span>';
  bubbleContent.classList.add("streaming");
  state.busy = true;
  updateInputState();

  try {
    let current = "";
    await chatCompletion({
      provider: state.provider,
      apiKey: apiKeyOf(state.provider),
      model: modelOf(state.provider),
      temperature: state.temperature,
      skill,
      history: state.history,
      userMessage: text,
      onDelta: (d) => {
        current += d;
        bubbleContent.textContent = current;
        chatEl.scrollTop = chatEl.scrollHeight;
      }
    });
    state.history.push(
      { role: "user", content: text },
      { role: "assistant", content: current || "(sem resposta)" }
    );
    // registra a atividade concluída no histórico
    logActivity({
      skillId: state.activeSkillId, skillName: skill?.name || "",
      provider: state.provider, model: modelOf(state.provider),
      question: text, answer: current, ok: true
    });
    // renderiza o Markdown final (durante o stream mostra texto puro, mais fluido)
    if (current) {
      bubbleContent.classList.remove("streaming");
      bubbleContent.innerHTML = renderMarkdown(current);
      bubble.appendChild(buildMsgActions(current, bubbleContent));
      chatEl.scrollTop = chatEl.scrollHeight;
    }
  } catch (err) {
    bubble.remove();
    addMessage("error", err.message);
    logActivity({
      skillId: state.activeSkillId, skillName: skill?.name || "",
      provider: state.provider, model: modelOf(state.provider),
      question: text, answer: err.message, ok: false
    });
  } finally {
    state.busy = false;
    updateInputState();
    inputEl.focus();
  }
}

// ---------- Modal de configurações ----------
const CUSTOM_MODEL = "__custom__";

function fillProviderSelect() {
  const sel = $("provider-select");
  sel.innerHTML = "";
  for (const [id, p] of Object.entries(PROVIDERS)) {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = p.name;
    sel.appendChild(opt);
  }
  sel.value = state.provider;
}

function fillModelSelect(providerId, availableIds) {
  const p = PROVIDERS[providerId];
  const sel = $("model-select");
  sel.innerHTML = "";

  // Usa a lista viva do provedor quando disponível; senão, a lista estática.
  const recommended = new Map(p.models);
  const ids = (availableIds && availableIds.length)
    ? availableIds
    : p.models.map(([v]) => v);

  for (const id of ids) {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = recommended.has(id) ? recommended.get(id) : id;
    sel.appendChild(opt);
  }
  const custom = document.createElement("option");
  custom.value = CUSTOM_MODEL;
  custom.textContent = "Outro (digitar nome do modelo)…";
  sel.appendChild(custom);

  const current = modelOf(providerId);
  const known = ids.includes(current);
  if (known) {
    sel.value = current;
    $("model-custom").classList.add("hidden");
  } else {
    sel.value = CUSTOM_MODEL;
    $("model-custom").classList.remove("hidden");
    $("model-custom").value = current;
  }
}

// ---------- Busca da lista viva de modelos (endpoint /models) ----------
const modelsCache = {};   // providerId -> string[] | null (null = falhou)
const modelsFetching = {}; // providerId -> bool

async function refreshModelList() {
  const providerId = $("provider-select").value;
  const key = $("api-key").value.trim();
  if (!key || modelsFetching[providerId]) return;

  modelsFetching[providerId] = true;
  const status = $("models-status");
  status.textContent = "Buscando modelos disponíveis…";

  try {
    const ids = await listModels(providerId, key);
    modelsCache[providerId] = ids;
    // re-renderiza só se o usuário ainda estiver no mesmo provedor
    if ($("provider-select").value === providerId) {
      fillModelSelect(providerId, ids);
      status.textContent = `${ids.length} modelos disponíveis (lista atualizada do provedor)`;
    }
  } catch (err) {
    modelsCache[providerId] = null;
    if ($("provider-select").value === providerId) {
      status.textContent = "Não foi possível atualizar a lista — usando modelos padrão. Verifique a chave.";
    }
  } finally {
    modelsFetching[providerId] = false;
  }
}

function onProviderChange() {
  const id = $("provider-select").value;
  $("provider-hint").textContent = PROVIDERS[id].keyHint;
  $("api-key").value = apiKeyOf(id);
  fillModelSelect(id, modelsCache[id]);
  $("models-status").textContent = "";
  if (apiKeyOf(id)) refreshModelList();
}

function onModelChange() {
  $("model-custom").classList.toggle("hidden", $("model-select").value !== CUSTOM_MODEL);
}

function openSettings() {
  fillProviderSelect();
  onProviderChange();
  $("temperature").value = state.temperature;
  $("temp-value").textContent = state.temperature.toFixed(1);
  $("settings-modal").classList.remove("hidden");
}

function closeSettings() {
  $("settings-modal").classList.add("hidden");
}

function saveSettings() {
  const providerId = $("provider-select").value;

  state.apiKeys[providerId] = $("api-key").value.trim();

  const selModel = $("model-select").value;
  state.models[providerId] = selModel === CUSTOM_MODEL
    ? ($("model-custom").value.trim() || PROVIDERS[providerId].defaultModel)
    : selModel;

  state.provider = providerId;
  state.temperature = parseFloat($("temperature").value);

  localStorage.setItem("creser_provider", state.provider);
  localStorage.setItem("creser_api_keys", JSON.stringify(state.apiKeys));
  localStorage.setItem("creser_models_v3", JSON.stringify(state.models));
  localStorage.setItem("creser_temperature", String(state.temperature));

  closeSettings();
  updateInputState();
}

// ---------- Utilidades ----------
function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 160) + "px";
}

// ---------- Eventos ----------
$("input-form").addEventListener("submit", handleSend);
inputEl.addEventListener("input", () => autoResize(inputEl));
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    $("input-form").requestSubmit();
  }
});
$("btn-settings").addEventListener("click", openSettings);
$("btn-cancel-settings").addEventListener("click", closeSettings);
$("btn-save-settings").addEventListener("click", saveSettings);
$("settings-modal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeSettings();
});
$("provider-select").addEventListener("change", onProviderChange);
$("model-select").addEventListener("change", onModelChange);
$("api-key").addEventListener("change", () => {
  // chave digitada/alterada -> busca lista viva de modelos com ela
  modelsCache[$("provider-select").value] = undefined;
  refreshModelList();
});
$("temperature").addEventListener("input", (e) => {
  $("temp-value").textContent = parseFloat(e.target.value).toFixed(1);
});
$("btn-new-chat").addEventListener("click", () => {
  state.history = [];
  renderChat();
  inputEl.focus();
});

// ---------- Modal de Histórico ----------
let historyTab = "activities"; // "activities" | "prompts"

function fmtDate(ts) {
  return new Date(ts).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function renderHistoryList() {
  const listEl = $("history-list");
  listEl.innerHTML = "";

  const items = historyTab === "activities" ? getActivities() : getPrompts();
  $("history-count").textContent = items.length
    ? `${items.length} registro${items.length > 1 ? "s" : ""} (máx. 500)`
    : "Nenhum registro ainda.";

  if (!items.length) {
    const p = document.createElement("p");
    p.className = "hint";
    p.textContent = historyTab === "activities"
      ? "As interações com a IA aparecerão aqui automaticamente."
      : "Os prompts enviados aparecerão aqui automaticamente.";
    listEl.appendChild(p);
    return;
  }

  for (const item of items) {
    const card = document.createElement("div");
    card.className = "history-card";

    const head = document.createElement("div");
    head.className = "history-card-head";
    head.innerHTML = `<strong>${item.skillName || "—"}</strong>
      <span class="hint">${fmtDate(item.ts)}${historyTab === "activities" ? " · " + (item.provider || "") + " · " + (item.model || "") : ""}</span>`;
    card.appendChild(head);

    if (historyTab === "activities") {
      const q = document.createElement("div");
      q.className = "history-q";
      q.textContent = "❓ " + item.question;
      const r = document.createElement("div");
      r.className = "history-a";
      r.textContent = (item.ok ? "✅ " : "⚠️ ") + item.answer;
      card.appendChild(q);
      card.appendChild(r);
    } else {
      const q = document.createElement("div");
      q.className = "history-q";
      q.textContent = item.prompt;
      card.appendChild(q);

      const reuse = document.createElement("button");
      reuse.className = "btn-copy";
      reuse.textContent = "↻ Reutilizar";
      reuse.title = "Reenviar este prompt na skill em que foi usado";
      reuse.addEventListener("click", () => {
        if (item.skillId && findSkillById(item.skillId)) selectSkill(item.skillId);
        closeHistory();
        inputEl.value = item.prompt;
        autoResize(inputEl);
        inputEl.focus();
      });
      card.appendChild(reuse);
    }

    listEl.appendChild(card);
  }
}

function openHistory() {
  renderHistoryList();
  $("history-modal").classList.remove("hidden");
}

function closeHistory() {
  $("history-modal").classList.add("hidden");
}

function setHistoryTab(tab) {
  historyTab = tab;
  $("tab-activities").classList.toggle("active", tab === "activities");
  $("tab-prompts").classList.toggle("active", tab === "prompts");
  $("btn-export-activities").style.display = tab === "activities" ? "" : "none";
  renderHistoryList();
}

$("btn-history").addEventListener("click", openHistory);
$("btn-close-history").addEventListener("click", closeHistory);
$("history-modal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeHistory();
});
$("tab-activities").addEventListener("click", () => setHistoryTab("activities"));
$("tab-prompts").addEventListener("click", () => setHistoryTab("prompts"));
$("btn-export-activities").addEventListener("click", exportActivitiesCSV);
$("btn-clear-history").addEventListener("click", () => {
  const what = historyTab === "activities" ? "histórico de atividades" : "histórico de prompts";
  if (!confirm(`Apagar TODO o ${what}? Esta ação não pode ser desfeita.`)) return;
  if (historyTab === "activities") clearActivities(); else clearPrompts();
  renderHistoryList();
});

// ---------- Modal de Modelo de Prompt ----------
// Rascunhos são salvos por skill no localStorage (sobrevivem ao recarregar)
const DRAFT_KEY = (skillId) => `creser_prompt_draft_${skillId}`;

function openPromptModal() {
  const tpl = PROMPT_TEMPLATES[state.activeSkillId];
  if (!tpl) return;
  $("prompt-modal-title").textContent = tpl.title;
  $("prompt-editor").value = localStorage.getItem(DRAFT_KEY(state.activeSkillId)) || tpl.text;
  $("prompt-modal").classList.remove("hidden");
  $("prompt-editor").focus();
}

function closePromptModal() {
  $("prompt-modal").classList.add("hidden");
}

/** Salva o rascunho corrente e devolve o texto do editor. */
function currentPromptText() {
  const text = $("prompt-editor").value;
  localStorage.setItem(DRAFT_KEY(state.activeSkillId), text);
  return text;
}

function downloadPrompt() {
  const text = currentPromptText();
  const blob = new Blob(["\uFEFF", text], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = exportFilename("txt");
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  const btn = $("btn-prompt-download");
  const old = btn.textContent;
  btn.textContent = "✓ Baixado";
  setTimeout(() => (btn.textContent = old), 1500);
}

$("btn-prompt-template").addEventListener("click", openPromptModal);
$("btn-prompt-close").addEventListener("click", closePromptModal);
$("prompt-modal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closePromptModal();
});
$("prompt-editor").addEventListener("input", currentPromptText); // autosave
$("btn-prompt-download").addEventListener("click", downloadPrompt);
$("btn-prompt-copy").addEventListener("click", async (e) => {
  try {
    await navigator.clipboard.writeText(currentPromptText());
    flash(e.target, "✓ Copiado");
  } catch (_) {
    flash(e.target, "✗ Erro");
  }
});
$("btn-prompt-reset").addEventListener("click", () => {
  const tpl = PROMPT_TEMPLATES[state.activeSkillId];
  if (!tpl || !confirm("Descartar o preenchimento e restaurar o modelo original?")) return;
  $("prompt-editor").value = tpl.text;
  localStorage.removeItem(DRAFT_KEY(state.activeSkillId));
});
$("btn-prompt-send").addEventListener("click", () => {
  const text = currentPromptText();
  closePromptModal();
  inputEl.value = text;
  autoResize(inputEl);
  inputEl.focus();
  inputEl.scrollTop = 0;
});

// ---------- Inicialização ----------
renderSkills();
updateInputState();
if (!apiKeyOf(state.provider)) openSettings();
