/* ============================================================
   OSC CrêSer — Modelos de prompt (preenchíveis) por skill
   ------------------------------------------------------------
   Cada entrada é ligada ao id de uma skill em js/skills.js.
   O texto contém campos [ENTRE COLCHETES] que a equipe preenche
   antes de enviar ao assistente, baixar ou copiar.
   ============================================================ */

"use strict";

const PROMPT_TEMPLATES = {
  "rel-trimestral-cdcm": {
    title: "Modelo de Prompt — Relatório Trimestral CDCM (Direitos Humanos)",
    text: `Aja como Coordenador(a) de um Centro de Defesa e Convivência da Mulher (CDCM) conveniado com a Secretaria Municipal de Direitos Humanos e Cidadania (SMDHC) de São Paulo através de Termo de Colaboração.

Sua tarefa é redigir o RELATÓRIO TRIMESTRAL DE ATIVIDADES com base nos dados brutos que fornecerei ao final deste prompt.

REGRAS DE FORMATAÇÃO E TOM:
1. Tom: Formal, institucional, técnico, sensível às questões de gênero e violência, e transparente.
2. Formatação: Utilize Markdown. Crie tabelas para todos os dados quantitativos e financeiros. Use negrito para os títulos das seções.
3. Estrutura Obrigatória (Siga exatamente esta ordem):
   - CABEÇALHO: Nome do Serviço, Endereço, Telefone, E-mail.
   - I - IDENTIFICAÇÃO: Termo de Colaboração, Data de Início, Vigência, Processo.
   - II - ABRANGÊNCIA TERRITORIAL: Endereço completo e horário de funcionamento.
   - III - PÚBLICO ALVO: Descrição do perfil das mulheres atendidas.
   - IV - CAPACIDADE CONVENIADA: Número total de vagas.
   - V - DADOS DA EXECUÇÃO DO SERVIÇO: 8 tabelas específicas (detalhadas abaixo).
   - VI - ORIGEM DOS RECURSOS: Tabela financeira mensal com saldos.
   - VII - ATIVIDADES DESENVOLVIDAS: Texto narrativo detalhando as ações do trimestre.
   - RODAPÉ: Local, Data, Nome do Serviço e dados de contato.

ESTRUTURA DAS 8 TABELAS DA SEÇÃO V:
Tabela I - Número de Mulheres que Entraram no Mês (Casos Novos) X Tipos de Violência (Física, Psicológica, Abuso Sexual, Patrimonial, Ameaça)
Tabela II - Faixa Etária (18-29 anos, 30-59 anos, 60+ anos)
Tabela III - Entradas Totais por Eixo (Outras Políticas, CRAS, CREAS, Judiciário, Espontâneo, MP, Saúde, Delegacia/GCM, Centro Cidadania)
Tabela IV - Atividades Desenvolvidas/Nº Total de Casos em Acompanhamento (14 tipos de atividades)
Tabela V - Oficinas Socioeducativas Desenvolvidas (modalidade, inscritas, frequência, concluintes)
Tabela VI - Número de Mulheres Desligadas x Motivo de Saída
Tabela VII - Tempo de Acompanhamento de Mulheres Desligadas
Tabela VIII - Origem dos Recursos (recebido, gasto, saldo, contrapartida)

OBSERVAÇÃO IMPORTANTE para Tabela I: Incluir nota explicativa de que "a tabela revela o nº de mulheres que chegaram ao serviço devido a alguma situação de violência, mas em sua maioria é na Casa da Mulher que ela descobre estar inserida em mais de uma situação de violência. Posto isso, o nº de violências soma maior que a entrada de casos."

ORIENTAÇÕES PARA A SEÇÃO VII (ATIVIDADES DESENVOLVIDAS):
O texto narrativo deve ser coeso, dividido em parágrafos, e abordar SEMPRE que houver dados sobre isso:
- Continuidade das ações do Plano de Trabalho (atendimentos individuais, grupos reflexivos, palestras, discussões de caso, encaminhamentos).
- Acolhimentos em abrigo sigiloso (se houver).
- Oficinas socioeducativas de geração de renda (autonomia financeira, empoderamento, taxa de ocupação de vagas).
- Ações de captação de recursos (ex: doação de notas fiscais para diminuir contrapartida da OSC).
- Suporte técnico de supervisão (nome da organização supervisora, tipo de suporte oferecido).
- Contexto territorial (aumento de demanda por violência/feminicídio, solicitações de palestras de escolas e rede).
- Questões de infraestrutura e gestão (vistorias, renovação de contratos de locação, tratativas com proprietário e SMDHC).
- Número de casos ativos ao final do trimestre.
- Reafirmação do compromisso com promoção de direitos e enfrentamento à violência.

---
DADOS PARA PREENCHIMENTO DO RELATÓRIO DE [INSERIR TRIMESTRE] / [INSERIR ANO]:

[DADOS DO CDCM]
Nome do CDCM: [Ex: CDCM Casa da Mulher CrêSer]
Endereço: [Ex: Rua Salvador Rodrigues Negrão, 351, Vila Marari - São Paulo/SP - CEP: 04401-160]
Horário: [Ex: Segunda a Sexta-Feira 8h às 17h]
Telefone: [Ex: 3539-8163 / 3539-8130]
E-mail: [Ex: cdcm.creser@gmail.com]
Termo de Colaboração: [Ex: 021/SMDHC/2023]
Início do Termo: [Ex: 28/11/2024]
Vigência: [Ex: 06/2023]
Processo SMDHC: [Ex: 6074.2024/0009551-2]
Capacidade Conveniada: [Ex: 100 vagas]

[TABELA I - MULHERES QUE ENTRARAM X TIPOS DE VIOLÊNCIA]
Mês 1: [Nº mulheres] - Física: [X], Psicológica: [X], Abuso Sexual: [X], Patrimonial: [X], Ameaça: [X]
Mês 2: [Nº mulheres] - Física: [X], Psicológica: [X], Abuso Sexual: [X], Patrimonial: [X], Ameaça: [X]
Mês 3: [Nº mulheres] - Física: [X], Psicológica: [X], Abuso Sexual: [X], Patrimonial: [X], Ameaça: [X]

[TABELA II - FAIXA ETÁRIA]
Mês 1: 18-29 anos: [X], 30-59 anos: [X], 60+: [X], Total: [X]
Mês 2: 18-29 anos: [X], 30-59 anos: [X], 60+: [X], Total: [X]
Mês 3: 18-29 anos: [X], 30-59 anos: [X], 60+: [X], Total: [X]

[TABELA III - ENTRADAS TOTAIS POR EIXO]
Mês 1: Outras Políticas: [X], CRAS: [X], CREAS: [X], Judiciário: [X], Espontâneo: [X], MP: [X], Saúde: [X], Delegacia/GCM: [X], Centro Cidadania: [X], Total: [X]
Mês 2: [mesmos campos]
Mês 3: [mesmos campos]

[TABELA IV - ATIVIDADES DESENVOLVIDAS]
Mês 1: Orientações Jurídicas: [X], Psicológicas: [X], Sociais: [X], Atendimento remoto: [X], Palestras: [X], Grupo Violação Direitos: [X], Visitas Domiciliares: [X], Encaminhamento Saúde: [X], Encaminhamento Rede Socioassistencial: [X], Encaminhamento Acolhida: [X], Encaminhamento Judiciário: [X], Cestas Básicas: [X], Discussão de Caso: [X], Total Casos Ativos: [X]
Mês 2: [mesmos campos]
Mês 3: [mesmos campos]

[TABELA V - OFICINAS SOCIOEDUCATIVAS]
Mês 1: [Nº oficinas] - Modalidade 1: [nome], Inscritas: [X], Frequência: [X], Concluintes: [X] | Modalidade 2: [nome], Inscritas: [X], Frequência: [X], Concluintes: [X]
Mês 2: [mesma estrutura]
Mês 3: [mesma estrutura]

[TABELA VI - MULHERES DESLIGADAS X MOTIVO]
Mês 1: Rompimento Ciclo Violência: [X], Mudança Endereço: [X], Desistência: [X], Transferência: [X], Óbito Feminicídio: [X], Óbito outras causas: [X], Total: [X]
Mês 2: [mesmos campos]
Mês 3: [mesmos campos]

[TABELA VII - TEMPO DE ACOMPANHAMENTO DAS DESLIGADAS]
Mês 1: Total: [X], 1-6 meses: [X], 7-12 meses: [X], 13 meses-2 anos: [X], Mais de 2 anos: [X]
Mês 2: [mesmos campos]
Mês 3: [mesmos campos]

[TABELA VIII - DADOS FINANCEIROS]
Saldo Meses Anteriores: [R$ X]
Mês 1 ([Mês/Ano]): Recebido: [R$ X] | Gasto: [R$ Y] | Saldo: [R$ Z] | Contrapartida: [NÃO HOUVE / Valor]
Mês 2 ([Mês/Ano]): Recebido: [R$ X] | Gasto: [R$ Y] | Saldo: [R$ Z] | Contrapartida: [NÃO HOUVE / Valor]
Mês 3 ([Mês/Ano]): Recebido: [R$ X] | Gasto: [R$ Y] | Saldo: [R$ Z] | Contrapartida: [NÃO HOUVE / Valor]
Saldo Final do Trimestre: [R$ Z]

[RASCUNHO / NOTAS PARA A SEÇÃO VII - ATIVIDADES DESENVOLVIDAS]
(Forneça aqui um resumo em tópicos do que aconteceu no trimestre.)
[INSIRA SUAS NOTAS AQUI]

---
Com base em todas as regras e dados acima, gere o Relatório Trimestral completo, pronto para ser impresso e assinado, seguindo rigorosamente a estrutura da SMDHC.`
  },

  "rel-trimestral-cei": {
    title: "Modelo de Prompt — Relatório Trimestral CEI (Educação)",
    text: `Aja como um(a) Diretor(a) de Centro de Educação Infantil (CEI) conveniado com a Secretaria Municipal de Educação de São Paulo (SME-SP) através de Termo de Colaboração.

Sua tarefa é redigir o RELATÓRIO TRIMESTRAL DE ATIVIDADES com base nos dados brutos que fornecerei ao final deste prompt.

REGRAS DE FORMATAÇÃO E TOM:
1. Tom: Formal, institucional, técnico, pedagógico e transparente.
2. Formatação: Utilize Markdown. Crie tabelas para os dados quantitativos e financeiros. Use negrito para os títulos das seções.
3. Estrutura Obrigatória (Siga exatamente esta ordem):
   - CABEÇALHO: Nome do Serviço, Endereço, Telefone, E-mail.
   - I - IDENTIFICAÇÃO: Termo de Colaboração, Data de Assinatura, Vigência, Processo.
   - II - ABRANGÊNCIA TERRITORIAL: Distrito e bairros atendidos.
   - III - PÚBLICO ALVO: Descrição do perfil das crianças e forma de ingresso.
   - IV - CAPACIDADE CONVENIADA: Faixa etária e total de vagas.
   - V - DADOS DA EXECUÇÃO DO SERVIÇO: Tabela com os indicadores do trimestre.
   - VI - ORIGEM DOS RECURSOS: Tabela financeira mensal com saldos.
   - VII - AVALIAÇÃO DAS ATIVIDADES: Texto narrativo detalhando as ações do trimestre.
   - RODAPÉ: Local, Data, Nome e Cargo do(a) Diretor(a).

ORIENTAÇÕES PARA A SEÇÃO VII (AVALIAÇÃO DAS ATIVIDADES):
O texto narrativo deve ser coeso e dividido em parágrafos que abordem, sempre que houver dados sobre isso:
- Manutenção e infraestrutura do espaço.
- Movimentação de matrículas (entradas, saídas, ampliação/redução de quadro).
- Parcerias intersetoriais (ex: UBS, CRAS, CREAS).
- Ações de Educação Especial / Inclusão (ex: itinerâncias, CEFAI, PAAI, AEE, acessibilidade comunicacional).
- Gestão Democrática (Conselho de Escola, reuniões de pais, mediação de conflitos).
- Formação continuada da equipe.
- Citação do nome do Supervisor(a) de escola responsável pelo acompanhamento.

---
DADOS PARA PREENCHIMENTO DO RELATÓRIO DE [INSERIR TRIMESTRE] / [INSERIR ANO]:

[DADOS DO CEI]
Nome do CEI: [Ex: CEI CrêSer I]
Endereço: [Ex: Rua Vicente Strichalsky, 512 - Jd. Guaciri - CEP 04475-072 - São Paulo/SP]
Telefone: [Ex: 5676-1480]
E-mail: [Ex: ceicreser@gmail.com]
Termo de Colaboração: [Ex: 332022-RPP]
Data Assinatura: [Ex: 13/08/2022]
Vigência: [Ex: 13/08/2022 a 12/08/2027]
Processo SME: [Ex: 6016.2022/0084038-2]
Distrito/Bairros: [Ex: Distrito de Pedreira - Jd. Guacuri, Jd. Célia, etc.]
Faixa Etária e Capacidade: [Ex: 0 a 3 anos / 145 crianças]

[INDICADORES DO TRIMESTRE - Seção V]
Total de crianças: [Ex: 145]
Feminino: [Ex: 81]
Masculino: [Ex: 64]
Inscrições para vaga (Lista de espera): [Ex: 38]
Reuniões com responsáveis: [Ex: 1]
Responsáveis presentes: [Ex: 88]
Reuniões Pedagógicas: [Ex: 1]
Cursos realizados: [Ex: 0]
Eventos (Família): [Ex: 1]
Encaminhamentos UBS/Saúde: [Ex: 0]
Crianças desligadas: [Ex: 13]
Crianças matriculadas no período: [Ex: 39]

[DADOS FINANCEIROS - Seção VI]
Saldo Meses Anteriores: [Ex: R$ 53.317,75]
Mês 1 ([Mês/Ano]): Recebido: [R$ X] | Gasto: [R$ Y] | Saldo: [R$ Z] | Contrapartida: [NÃO HOUVE / Valor]
Mês 2 ([Mês/Ano]): Recebido: [R$ X] | Gasto: [R$ Y] | Saldo: [R$ Z] | Contrapartida: [NÃO HOUVE / Valor]
Mês 3 ([Mês/Ano]): Recebido: [R$ X] | Gasto: [R$ Y] | Saldo: [R$ Z] | Contrapartida: [NÃO HOUVE / Valor]
Saldo Final do Trimestre: [R$ Z]

[RASCUNHO / NOTAS PARA A AVALIAÇÃO DAS ATIVIDADES - Seção VII]
(Forneça aqui um resumo em tópicos do que aconteceu no trimestre.)
[INSIRA SUAS NOTAS AQUI]

---
Com base em todas as regras e dados acima, gere o Relatório Trimestral completo, pronto para ser impresso e assinado.`
  },

  "rel-trimestral-smse": {
    title: "Modelo de Prompt — Relatório Trimestral SMSE (Assistência Social)",
    text: `Aja como Gerente/Pedagogo(a) Social de um Serviço de Medidas Socioeducativas em Meio Aberto (SMSE-MA) conveniado com a Secretaria Municipal de Assistência e Desenvolvimento Social (SMADS) de São Paulo através de Termo de Colaboração.

Sua tarefa é redigir o RELATÓRIO TRIMESTRAL DE ATIVIDADES com base nos dados brutos que fornecerei ao final deste prompt.

REGRAS DE FORMATAÇÃO E TOM:
1. Tom: Formal, institucional, técnico, socioeducativo, pautado em direitos humanos de adolescentes e transparente.
2. Formatação: Utilize Markdown. Crie tabelas para todos os dados quantitativos e financeiros. Use negrito para os títulos das seções.
3. Estrutura Obrigatória (Siga exatamente esta ordem):
   - CABEÇALHO: Nome do Serviço, Endereço, Telefone, E-mail.
   - I - IDENTIFICAÇÃO: Termo de Colaboração, Data de Assinatura, Vigência, Processo.
   - II - ABRANGÊNCIA: Subdistrito e endereço completo.
   - IV - CAPACIDADE CONVENIADA: Número total de vagas.
   - V - DADOS DA EXECUÇÃO DO SERVIÇO: 5 tabelas específicas (detalhadas abaixo).
   - VI - MURAL DO CLIMA: Informações sobre alterações ou ampliação de ações.
   - VII - AVALIAÇÃO DAS ATIVIDADES DESENVOLVIDAS: Texto narrativo detalhando as ações do trimestre.
   - RODAPÉ: Local, Data, Nome do(a) Gerente, Cargo e dados de contato.

ESTRUTURA DAS 5 TABELAS DA SEÇÃO V:
Tabela I - Entradas (Sistema Judiciário) - única via de entrada no SMSE/MA
Tabela II - Saídas (Sistema Judiciário)
Tabela III - Quadro de Atividades Desenvolvidas (20 tipos de atividades)
Tabela IV - Quadro de Raça/Cor (Brancos, Pretos, Pardos, Amarelos, Indígenas, Não Informado)
Tabela V - Origem dos Recursos (recebido, gasto, saldo, contrapartida)

OBSERVAÇÃO IMPORTANTE para Tabela V: Incluir nota explicativa sobre o saldo remanescente (recursos de RH não contratado, passível de glosa) e sobre a contrapartida (aluguel e IPTU não cobertos pela prefeitura, com status de aditamento/vistoria, se aplicável).

ORIENTAÇÕES PARA A SEÇÃO VII (AVALIAÇÃO DAS ATIVIDADES):
O texto narrativo deve ser coeso, dividido em parágrafos, e abordar SEMPRE que houver dados sobre isso:
- Avanços das ações socioeducativas com adolescentes (engajamento, adesão às atividades, PIA).
- Participação das famílias (grupos de famílias, busca ativa, corresponsabilização, fortalecimento de vínculos).
- Atividades culturais, esportivas e externas (ex: Sesc, museus, oficinas de grafite, barbearia).
- Oficinas profissionalizantes e de geração de renda.
- Articulação com a rede intersetorial (Fundação CASA, Fórum DCA, encontros de SMSE da região, CRAS, CREAS, Saúde, Educação).
- Gestão do trabalho e saúde mental dos trabalhadores (seminários internos, formações, Horas Técnicas).
- Questões de infraestrutura e gestão (vistorias, aditamentos de contrato de locação, adequações no imóvel).
- Projetos específicos em desenvolvimento (ex: projeto Escola com estagiárias).
- Casos pós-medida acompanhados.
- Desafios do período e perspectivas para o próximo trimestre.
- Número de casos ativos ao final do trimestre.

---
DADOS PARA PREENCHIMENTO DO RELATÓRIO DE [INSERIR TRIMESTRE] / [INSERIR ANO]:

[DADOS DO SMSE]
Nome do Serviço: [Ex: Serviço de Medidas Socioeducativas em Meio Aberto de Pedreira – GFWC CrêSer]
Endereço: [Ex: Rua Córrego Azul, 142, Balneário Mar Paulista, CEP: 04463-010 - São Paulo/SP]
Telefone: [Ex: 2384-3116 / 2384-3181]
E-mail: [Ex: msepedreira.creser@gmail.com]
Termo de Colaboração: [Ex: 180/SMADS/2024]
Data de Assinatura: [Ex: 30/06/2024]
Vigência: [Ex: 30/06/2024 a 29/06/2029]
Processo: [Ex: 6024.2024.0001806-0]
Subdistrito: [Ex: Pedreira]
Capacidade Conveniada: [Ex: 90 vagas]

[TABELA I - ENTRADAS PELO SISTEMA JUDICIÁRIO]
Mês 1: [X]
Mês 2: [X]
Mês 3: [X]

[TABELA II - SAÍDAS PELO SISTEMA JUDICIÁRIO]
Mês 1: [X]
Mês 2: [X]
Mês 3: [X]

[TABELA III - QUADRO DE ATIVIDADES DESENVOLVIDAS]
Mês 1:
- Número total de socioeducandos: [X]
- Femininos: [X]
- Masculinos: [X]
- Atendimentos Individuais aos Adolescentes: [X]
- Atendimentos Grupais aos Adolescentes (atividades): [X]
- Atendimentos Grupais aos Adolescentes (participantes): [X]
- Oficinas de Grafite (atividades): [X]
- Oficinas de Grafite (participantes): [X]
- Oficinas de Barbearia (atividades): [X]
- Oficinas de Barbearia (participantes): [X]
- Atividades Externas: [X]
- Atendimentos Individuais às Famílias: [X]
- Atendimentos Grupais às Famílias (participantes): [X]
- Relatórios Emitidos: [X]
- Visitas Domiciliares: [X]
- Casos Pós Medida: [X]
- Encaminhamentos Saúde: [X]
- Encaminhamentos Educação: [X]
- Encaminhamentos Rede: [X]
- Articulações de Rede: [X]

Mês 2: [mesmos campos]
Mês 3: [mesmos campos]

[TABELA IV - QUADRO DE RAÇA/COR]
Mês 1: Brancos: [X], Pretos: [X], Pardos: [X], Amarelos: [X], Indígenas: [X], Não Informado: [X]
Mês 2: [mesmos campos]
Mês 3: [mesmos campos]

[TABELA V - DADOS FINANCEIROS]
Saldo Meses Anteriores: [R$ X]
Mês 1 ([Mês/Ano]): Recebido: [R$ X] | Gasto: [R$ Y] | Saldo: [R$ Z] | Contrapartida: [R$ X]
Mês 2 ([Mês/Ano]): Recebido: [R$ X] | Gasto: [R$ Y] | Saldo: [R$ Z] | Contrapartida: [R$ X]
Mês 3 ([Mês/Ano]): Recebido: [R$ X] | Gasto: [R$ Y] | Saldo: [R$ Z] | Contrapartida: [R$ X]

[NOTAS SOBRE SALDO E CONTRAPARTIDA]
(Ex: O saldo remanescente refere-se a recursos de RH não contratado. A contrapartida corresponde ao pagamento do aluguel e IPTU.)
[INSIRA NOTAS AQUI]

[MURAL DO CLIMA - Seção VI]
(Ex: Não houve alteração e nem ampliação das ações.)
[INSIRA INFORMAÇÕES AQUI]

[RASCUNHO / NOTAS PARA A SEÇÃO VII - AVALIAÇÃO DAS ATIVIDADES]
(Forneça aqui um resumo em tópicos do que aconteceu no trimestre.)
[INSIRA SUAS NOTAS AQUI]

---
Com base em todas as regras e dados acima, gere o Relatório Trimestral completo, pronto para ser impresso e assinado, seguindo rigorosamente a estrutura da SMADS.`
  }
};
