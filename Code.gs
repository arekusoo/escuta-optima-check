/**
 * Recebe as respostas da pesquisa "Escuta Optima Check" e grava uma linha por envio
 * na aba "Respostas" desta planilha. Nenhum nome é recebido: só um código aleatório
 * que fica no navegador de quem respondeu (o mesmo código aparece se a pessoa reenviar).
 */
const ABA = 'Respostas';
const ORDEM = ["funcao", "projetos", "ferramentas", "aparelho", "revisita", "precisou", "onde", "historia", "top3", "falta", "desconforto", "frequencia", "acesso", "mudanca"];
const COLUNAS = {
  "funcao": "area",
  "projetos": "projetos_semana",
  "ferramentas": "ferramentas_do_dia",
  "aparelho": "onde_faz_checkin",
  "revisita": "volta_ao_registro",
  "precisou": "precisou_saber",
  "onde": "onde_buscou",
  "historia": "relato_dificuldade",
  "top3": "top3_ajudaria",
  "falta": "faltou_na_lista",
  "desconforto": "desconforto",
  "frequencia": "frequencia_painel",
  "acesso": "onde_acessar",
  "mudanca": "mudaria"
};
const PERGUNTAS = {
  "funcao": {
    "tipo": "single",
    "obrig": true,
    "max": 0,
    "nenhum": "",
    "opcoes": {
      "eng-quim": "Engenharia química",
      "quimica": "Química",
      "geo": "Geociências / Geologia",
      "dev": "Desenvolvimento (fullstack)",
      "design": "Design (UX/UI)",
      "operacoes": "Operações",
      "inovacao": "Inovação",
      "pesquisa": "Pesquisa / academia",
      "outro": "Outra"
    }
  },
  "projetos": {
    "tipo": "single",
    "obrig": true,
    "max": 0,
    "nenhum": "",
    "opcoes": {
      "1": "Um só",
      "2-3": "Dois ou três",
      "4+": "Quatro ou mais",
      "varia": "Varia muito"
    }
  },
  "ferramentas": {
    "tipo": "multi",
    "obrig": true,
    "max": 0,
    "nenhum": "",
    "opcoes": {
      "chat": "Google Chat",
      "github": "GitHub",
      "master": "Master (painéis)",
      "gmail": "Gmail / Agenda",
      "sheets": "Planilhas",
      "outra": "Outra ferramenta"
    }
  },
  "aparelho": {
    "tipo": "single",
    "obrig": true,
    "max": 0,
    "nenhum": "",
    "opcoes": {
      "pc": "No computador",
      "cel": "No celular",
      "ambos": "Nos dois"
    }
  },
  "revisita": {
    "tipo": "single",
    "obrig": true,
    "max": 0,
    "nenhum": "",
    "opcoes": {
      "nunca": "Nunca",
      "raro": "Raramente",
      "as-vezes": "Às vezes",
      "freq": "Com frequência"
    }
  },
  "precisou": {
    "tipo": "multi",
    "obrig": true,
    "max": 0,
    "nenhum": "nenhuma",
    "opcoes": {
      "horas-proj": "Quantas horas dediquei a um projeto",
      "dia": "O que fiz num dia específico",
      "esqueci": "Se esqueci de enviar algum check-in",
      "status": "Como está o status ou os riscos de um projeto meu",
      "quem": "Quem mais está no mesmo projeto",
      "internas": "Quanto do meu tempo foi para atividades internas",
      "plano": "O que planejei para o dia",
      "nenhuma": "Nenhuma destas"
    }
  },
  "onde": {
    "tipo": "single",
    "obrig": true,
    "max": 0,
    "nenhum": "",
    "opcoes": {
      "chat-pessoal": "Meus Check-ins no chat pessoal",
      "chat-pmo": "Chat-PMO",
      "nao-achei": "Procurei e não encontrei",
      "nao-precisei": "Não precisei"
    }
  },
  "historia": {
    "tipo": "text",
    "obrig": false,
    "max": 0,
    "nenhum": "",
    "opcoes": null
  },
  "top3": {
    "tipo": "multi",
    "obrig": true,
    "max": 3,
    "nenhum": "",
    "opcoes": {
      "historico": "Ver e corrigir check-ins que já enviei",
      "lembrete": "Lembrete no horário que eu escolher",
      "resumo-semana": "Resumo semanal das minhas horas por projeto",
      "meta": "Ver se estou acima ou abaixo das 8h do dia",
      "status-proj": "Ver status e riscos dos projetos em que estou",
      "carga-time": "Ver a carga do time no meu projeto",
      "auto": "Check-in pré-preenchido com o que fiz no GitHub ou na Agenda",
      "exportar": "Exportar minhas horas em planilha",
      "ao-longo": "Registrar ao longo do dia, não só no fim",
      "copiar": "Começar do check-in de ontem"
    }
  },
  "falta": {
    "tipo": "text",
    "obrig": false,
    "max": 0,
    "nenhum": "",
    "opcoes": null
  },
  "desconforto": {
    "tipo": "multi",
    "obrig": true,
    "max": 0,
    "nenhum": "nenhum",
    "opcoes": {
      "ranking": "Comparação ou ranking entre pessoas",
      "alerta-atraso": "Aviso para a gestão quando eu atrasar o check-in",
      "publico": "Meu check-in visível para todo o time",
      "nenhum": "Nenhuma destas"
    }
  },
  "frequencia": {
    "tipo": "single",
    "obrig": true,
    "max": 0,
    "nenhum": "",
    "opcoes": {
      "diario": "Todo dia",
      "semanal": "Uma vez por semana",
      "mensal": "Uma vez por mês",
      "quando": "Só quando precisar",
      "nunca": "Não abriria"
    }
  },
  "acesso": {
    "tipo": "multi",
    "obrig": true,
    "max": 2,
    "nenhum": "",
    "opcoes": {
      "chat": "No Google Chat",
      "master": "Na Master",
      "celular": "Numa página no celular",
      "email": "Resumo por e-mail"
    }
  },
  "mudanca": {
    "tipo": "text",
    "obrig": false,
    "max": 0,
    "nenhum": "",
    "opcoes": null
  }
};

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.hp) return resposta({ ok: true }); // campo invisível preenchido: robô
    const r = d.r || {};
    const linha = [];
    for (const k of ORDEM) {
      const q = PERGUNTAS[k], v = r[k];
      if (q.tipo === 'text') { linha.push(texto(v, 1500)); continue; }
      if (q.tipo === 'single') {
        if (v == null || v === '') { if (q.obrig) return invalido(); linha.push(''); continue; }
        if (!q.opcoes.hasOwnProperty(v)) return invalido();
        linha.push(q.opcoes[v]); continue;
      }
      // múltipla escolha
      const xs = Array.isArray(v) ? v : [];
      if (q.obrig && !xs.length) return invalido();
      if (q.max && xs.length > q.max) return invalido();
      if (!xs.every(x => q.opcoes.hasOwnProperty(x))) return invalido();
      if (q.nenhum && xs.indexOf(q.nenhum) >= 0 && xs.length > 1) return invalido();
      linha.push(xs.map(x => q.opcoes[x]).join('; '));
    }
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const planilha = SpreadsheetApp.getActiveSpreadsheet();
      let aba = planilha.getSheetByName(ABA);
      if (!aba) {
        aba = planilha.insertSheet(ABA);
        aba.appendRow(['recebidoEm', 'codigo'].concat(ORDEM.map(k => COLUNAS[k]), ['minutos', 'dispositivo', 'versao']));
        aba.setFrozenRows(1);
      }
      aba.appendRow([new Date(), texto(d.codigo, 40)].concat(linha, [numero(d.minutos), texto(d.dispositivo, 20), texto(d.versao, 30)]));
    } finally {
      lock.releaseLock();
    }
    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false, error: 'servidor' });
  }
}

function invalido() { return resposta({ ok: false, error: 'invalido' }); }
// Evita que um texto começando com =, +, - ou @ vire fórmula na planilha.
function texto(v, max) {
  const s = String(v == null ? '' : v).slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function numero(v) {
  const n = Number(v);
  return isFinite(n) && v !== null && v !== '' ? n : '';
}
function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
