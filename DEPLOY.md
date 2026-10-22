# Deploy no Railway — OSC CrêSer Assistente

## Estrutura de deploy

```
package.json   Dependências (express) e script start
server.js      Servidor que entrega os arquivos estáticos na porta PORT
.gitignore     Ignora node_modules
```

## Passo a passo (via GitHub)

1. **Conta no Railway** — acesse https://railway.com e crie sua conta
   (pode ser com login do Google/GitHub). O plano Trial exige cartão de
   crédito para verificação, mas dá US$ 5 de crédito grátis.

2. **Repositório GitHub** — o projeto é publicado em
   `https://github.com/<seu-usuario>/osc-creser-assistente`

3. **No Railway:**
   - Clique em **New Project** → **Deploy from GitHub repo**
   - Autorize o Railway a acessar seus repositórios do GitHub
   - Selecione o repositório `osc-creser-assistente`
   - O Railway detecta automaticamente Node.js (`npm install` + `npm start`)

4. **Domínio público:**
   - Na aba **Settings** do serviço → **Networking** → **Generate Domain**
   - O Railway entrega uma URL como
     `https://osc-creser-assistente-production.up.railway.app`

5. **Atualizações:** cada `git push` no repositório faz redeploy automático.

## Observações importantes

- A **chave de API** de cada provedor continua salva **no navegador** de cada
  usuário (localStorage) — nada sensível fica no repositório ou no Railway.
- O **Histórico** também é local, por navegador/máquina.
- Custos: um serviço web pequeno consome bem menos de US$ 5/mês de crédito
  do trial em uso leve.
