# OSC CrêSer — Assistente com Skills (site estático)

Frontend que usa modelos de IA via **API compatível com o formato OpenAI**,
com suporte a **vários provedores** e **skills agrupadas por categoria de
tarefa**, sempre limitado pelos **guardrails da OSC CrêSer**.

## Como usar

1. Abra `index.html` no navegador (basta duplo clique).
2. Em **⚙ Configurações**, escolha o **provedor** e cole a chave correspondente:
   - **Google Gemini** (recomendado — chave gratuita em
     https://aistudio.google.com/apikey, sem cartão de crédito)
   - **Groq** (gratuito em https://console.groq.com/keys)
   - **OpenRouter** (vários modelos, alguns gratuitos, em https://openrouter.ai/keys)
   - **OpenAI** (requer contratação separada de créditos da API)
   - Cada chave fica salva **apenas no seu navegador** (localStorage), uma por provedor.
3. Escolha o modelo (ou digite um nome personalizado) e clique em Salvar.
4. Selecione uma skill na barra lateral e converse.

> O plano ChatGPT Business Nonprofit **não inclui** chave/créditos da API da
> OpenAI — por isso o assistente usa provedores com camada gratuita
> (Gemini/Groq/OpenRouter) no mesmo formato de chamada.

## Estrutura

```
index.html        Interface (sidebar de skills + chat + configurações)
css/styles.css    Visual
js/guardrails.js  ⚠ GUARDRAILS: texto injetado como system prompt em TODA chamada
js/skills.js      Categorias e skills (edite aqui para adicionar/remover)
js/api.js         Multi-provedor (Gemini/Groq/OpenRouter/OpenAI) com streaming
js/app.js         Estado e interface
```

## Personalizar

- **Guardrails:** edite a constante `GUARDRAILS` em `js/guardrails.js`
  (há um marcador `>>> COLE AQUI <<<` indicando onde colar o texto real).
  O texto é sempre aplicado pelo código — não pode ser desativado pela interface.
- **Skills:** edite `SKILL_GROUPS` em `js/skills.js`. Cada skill define um
  `prompt` próprio que é combinado com os guardrails.

## Observações

- Não é possível incorporar o chatgpt.com via iframe nem usar aquela URL de
  conversa específica pela API. Este projeto **replica o comportamento** do seu
  GPT (instruções + skills) usando a API oficial.
- A chave exposta no navegador é aceitável para uso pessoal/local; para publicar
  na internet, recomenda-se um backend (proxy) para guardar a chave.
