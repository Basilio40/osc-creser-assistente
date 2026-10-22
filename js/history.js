/* ============================================================
   OSC CrêSer — Histórico (camada de persistência local)
   ------------------------------------------------------------
   Como o site é estático (sem servidor), o "backend" de histórico
   usa o localStorage do navegador, que é persistente (sobrevive a
   fechar/abrir o navegador) e privada do usuário.

   Dois registros são mantidos:
   1) Histórico de Atividades — toda interação com a IA:
      data/hora, skill, provedor/modelo, pergunta e resposta.
   2) Histórico de Prompts — cada pergunta enviada, com opção de
      reutilizar o prompt em nova conversa.

   Limites: guarda até 500 registros de cada tipo (rotativo) para
   não estourar a cota do localStorage (~5 MB).
   ============================================================ */

"use strict";

const HISTORY = {
  KEY_ACTIVITIES: "creser_hist_activities",
  KEY_PROMPTS: "creser_hist_prompts",
  MAX_RECORDS: 500
};

/** Lê um registro do localStorage com tolerância a dados corrompidos. */
function _read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (_) {
    return [];
  }
}

/** Grava um registro (array), respeitando o limite rotativo. */
function _write(key, arr) {
  if (arr.length > HISTORY.MAX_RECORDS) arr = arr.slice(-HISTORY.MAX_RECORDS);
  try {
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (err) {
    // cota cheia: descarta metade mais antiga e tenta de novo
    try {
      localStorage.setItem(key, JSON.stringify(arr.slice(-Math.floor(HISTORY.MAX_RECORDS / 2))));
    } catch (_) { /* sem espaço disponível */ }
  }
}

/* ---------- Histórico de Atividades ---------- */

/**
 * Registra uma interação completa.
 * @param {object} entry { skillId, skillName, provider, model, question, answer, ok }
 */
function logActivity(entry) {
  const list = _read(HISTORY.KEY_ACTIVITIES);
  list.push({
    ts: Date.now(),
    skillId: entry.skillId || "",
    skillName: entry.skillName || "",
    provider: entry.provider || "",
    model: entry.model || "",
    question: (entry.question || "").slice(0, 2000),
    answer: (entry.answer || "").slice(0, 8000),
    ok: entry.ok !== false
  });
  _write(HISTORY.KEY_ACTIVITIES, list);
}

function getActivities() {
  return _read(HISTORY.KEY_ACTIVITIES).slice().reverse(); // mais recente primeiro
}

function clearActivities() {
  localStorage.removeItem(HISTORY.KEY_ACTIVITIES);
}

/** Exporta o histórico de atividades como CSV. */
function exportActivitiesCSV() {
  const rows = [["Data/hora", "Skill", "Provedor", "Modelo", "Pergunta", "Resposta", "Sucesso"]];
  for (const a of getActivities()) {
    rows.push([
      new Date(a.ts).toLocaleString("pt-BR"),
      a.skillName, a.provider, a.model,
      a.question.replace(/\s+/g, " "),
      a.answer.replace(/\s+/g, " "),
      a.ok ? "sim" : "erro"
    ]);
  }
  const csv = "\uFEFF" + rows.map(r =>
    r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";")
  ).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `creser-historico-atividades-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

/* ---------- Histórico de Prompts ---------- */

/**
 * Registra um prompt enviado.
 * @param {object} entry { skillId, skillName, prompt }
 */
function logPrompt(entry) {
  const list = _read(HISTORY.KEY_PROMPTS);
  list.push({
    ts: Date.now(),
    skillId: entry.skillId || "",
    skillName: entry.skillName || "",
    prompt: (entry.prompt || "").slice(0, 2000)
  });
  _write(HISTORY.KEY_PROMPTS, list);
}

function getPrompts() {
  return _read(HISTORY.KEY_PROMPTS).slice().reverse();
}

function clearPrompts() {
  localStorage.removeItem(HISTORY.KEY_PROMPTS);
}
