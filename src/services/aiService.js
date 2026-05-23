/**
 * Serviço de Integração com IA (Compatível com OpenAI)
 * Suporta modo simulado local e chamadas reais para qualquer API compatível com OpenAI.
 */

// Função auxiliar para analisar localmente usando regras inteligentes de texto (Simulador)
const simulateAIAnalysis = (text) => {
  const t = text.toLowerCase();

  // Detecção de Saúde Mental Crítica -> Folga Saúde
  if (
    (t.includes('esgotad') || t.includes('exaust') || t.includes('surtar') || t.includes('burnout') || t.includes('crise') || t.includes('não aguento') || t.includes('sem força')) &&
    (t.includes('mental') || t.includes('estress') || t.includes('ansied') || t.includes('trabalho') || t.includes('prazo') || t.includes('muito'))
  ) {
    return {
      status: 'Folga Saúde',
      category: 'Saúde Mental',
      summary: 'Indicadores críticos de esgotamento mental e fadiga psíquica extrema (sintomas severos de estresse/Burnout). Nível de gravidade: Crítico. Recomendado afastamento preventivo imediato de 1 a 2 dias (Folga Saúde).'
    };
  }

  // Detecção de Ergonomia Crítica -> Folga Saúde
  if (
    (t.includes('dor') || t.includes('travou') || t.includes('pulso') || t.includes('costa') || t.includes('lombar') || t.includes('pescoço')) &&
    (t.includes('forte') || t.includes('não consigo') || t.includes('crítico') || t.includes('digitar') || t.includes('sentar'))
  ) {
    return {
      status: 'Folga Saúde',
      category: 'Ergonomia',
      summary: 'Desconforto musculoesquelético agudo e incapacidade física temporária para tarefas repetitivas (LER/DORT em estágio avançado). Nível de gravidade: Crítico. Recomendado repouso de 1 dia e readequação imediata da estação de trabalho.'
    };
  }

  // Detecção de Saúde Mental Moderada -> Atenção
  if (t.includes('estress') || t.includes('ansios') || t.includes('dormir') || t.includes('sono') || t.includes('desanimad') || t.includes('cabeça') || t.includes('pressão')) {
    return {
      status: 'Atenção',
      category: 'Saúde Mental',
      summary: 'Sintomas leves a moderados de sobrecarga mental, estresse ocupacional e alteração do padrão de sono. Nível de gravidade: Moderado. Recomendada triagem psicológica preventiva e acompanhamento de rotina.'
    };
  }

  // Detecção de Ergonomia Moderada -> Atenção
  if (t.includes('costa') || t.includes('lombar') || t.includes('ombro') || t.includes('pulso') || t.includes('postura') || t.includes('cadeira') || t.includes('pescoço') || t.includes('articulação')) {
    return {
      status: 'Atenção',
      category: 'Ergonomia',
      summary: 'Desconforto físico localizado associado a fatores ergonômicos da postura sentada prolongada. Nível de gravidade: Leve a Moderado. Recomendadas pausas ativas a cada 2 horas e ajuste ergonômico da cadeira/monitor.'
    };
  }

  // Detecção de Doenças Físicas Gerais -> Atenção
  if (t.includes('gripe') || t.includes('resfriad') || t.includes('febre') || t.includes('garganta') || t.includes('barriga') || t.includes('mal') || t.includes('enjo')) {
    return {
      status: 'Atenção',
      category: 'Saúde Física',
      summary: 'Indisposição física decorrente de quadro infeccioso leve ou alteração metabólica temporária. Nível de gravidade: Leve. Recomendada hidratação, repouso se necessário e monitoramento dos sintomas.'
    };
  }

  // Caso Padrão -> Saudável
  return {
    status: 'Saudável',
    category: 'Geral',
    summary: 'Colaborador relata bem-estar geral e estabilidade no ambiente de trabalho. Sem queixas ocupacionais, ergonômicas ou de sobrecarga mental identificadas. Nível de gravidade: Nulo.'
  };
};

// Função Principal de Análise
export const analyzeHealthReport = async (text, config) => {
  const { appName, isMockAI, openaiApiKey, openaiBaseUrl, openaiModel } = config;

  // Se for simulado ou não tiver API Key, retorna a simulação inteligente local
  if (isMockAI || !openaiApiKey) {
    // Adiciona um delay artificial de 1.5s para simular processamento real de IA
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return simulateAIAnalysis(text);
  }

  // Chamada Real à API compatível com OpenAI
  try {
    const response = await fetch(`${openaiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: openaiModel,
        response_format: { type: 'json_object' }, // Pede resposta em JSON estruturado se suportado
        messages: [
          {
            role: 'system',
            content: `Você é o assistente de IA especialista em medicina ocupacional e bem-estar do aplicativo ${appName || 'SanaWork'}.
Sua função é analisar o relato de saúde semanal de um funcionário.
Você deve retornar OBRIGATORIAMENTE um objeto JSON válido contendo exatamente estas três chaves:
1. "status": Uma string que deve ser EXATAMENTE um destes valores: "Saudável", "Atenção" ou "Folga Saúde".
2. "category": Uma string que deve ser EXATAMENTE um destes valores: "Saúde Mental", "Ergonomia", "Saúde Física" ou "Geral".
3. "summary": Um breve relatório anônimo, seguro, que resume o problema e sugere ações de autocuidado/ergonomia. 

ATENÇÃO: Para cumprir as normas de LGPD e privacidade, NUNCA cite nomes ou exponha detalhes excessivamente pessoais ou íntimos do funcionário. 

O resumo deve ser profissional, neutro e focado em riscos ocupacionais ou bem-estar (ex: "Colaborador relata dores na região lombar ligadas à postura. Nível de gravidade: Moderado. Sugeridas pausas ativas.").

Não incluir informações que possam levar a represalias por parte dos gestores e proprietários da empresa, por mais que esta informação seja de extrema importancia para esclarecer a situação do funcionário, a sua segurança é prioridade.
Se a pessoa mencionar algum nome (além do dela própria) ou informações que possam identificá-la, evite citar nomes, mesmo que seja necessário para dar uma resposta mais precisa, priorize sempre a segurança do funcionário.
Se suspeitar que a pessoa possa estar mentindo ou exagerando, apenas refletir no nivel escolhido no status, o summary deve ser neutro e apenas descrever a situação, sem apontar para uma possível mentira ou exagero.
Evitar mencionar detalhes sobre riscos psicologicos ou fisicos que possam constranger o funcionário.

Sua resposta inteira deve ser APENAS o objeto JSON.`
          },
          {
            role: 'user',
            content: `Analise o seguinte relato semanal de saúde: "${text}"`
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errData = await response.text();
      throw new Error(`Erro na API (${response.status}): ${errData}`);
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content.trim();

    // Tenta fazer o parse do JSON retornado pela IA
    const jsonResult = JSON.parse(resultText);

    // Valida as chaves do JSON
    if (jsonResult.status && jsonResult.category && jsonResult.summary) {
      // Ajusta possíveis inconsistências ortográficas da IA
      let cleanedStatus = 'Saudável';
      if (jsonResult.status.toLowerCase().includes('aten')) cleanedStatus = 'Atenção';
      else if (jsonResult.status.toLowerCase().includes('folga') || jsonResult.status.toLowerCase().includes('afasta')) cleanedStatus = 'Folga Saúde';

      let cleanedCategory = 'Geral';
      if (jsonResult.category.toLowerCase().includes('ment')) cleanedCategory = 'Saúde Mental';
      else if (jsonResult.category.toLowerCase().includes('ergo')) cleanedCategory = 'Ergonomia';
      else if (jsonResult.category.toLowerCase().includes('físi') || jsonResult.category.toLowerCase().includes('fisi')) cleanedCategory = 'Saúde Física';

      return {
        status: cleanedStatus,
        category: cleanedCategory,
        summary: jsonResult.summary
      };
    } else {
      throw new Error("JSON retornado pela IA não contém os campos necessários.");
    }

  } catch (error) {
    console.error("Erro ao chamar API de IA:", error);
    // Fallback amigável caso a chamada real falhe para não quebrar a demo
    return {
      status: 'Atenção',
      category: 'Geral',
      summary: `[Erro na API Real: ${error.message}]. Simulando resposta: O colaborador relatou desconforto. Recomenda-se atenção preventiva.`
    };
  }
};
