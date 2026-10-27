/**
 * Recebe as respostas da pesquisa "Escuta Optima Check" e grava uma linha por envio
 * na aba "Respostas" desta planilha. Nenhum nome é recebido: só um código aleatório
 * que fica no navegador de quem respondeu (o mesmo código aparece se a pessoa reenviar).
 * Imagens enviadas vão para a pasta "Escuta OptimaCheck - imagens" no seu Drive;
 * a planilha guarda o link de cada uma.
 */
const ABA = 'Respostas';
const PASTA = 'Escuta OptimaCheck - imagens';
const MAX_IMAGENS = 3;
const ORDEM = ["funcao", "projetos", "comunicacao", "plataforma", "aparelho", "revisita", "precisou", "onde", "historia", "top3", "desconforto", "frequencia", "painel_olha", "painel_uso", "acesso", "mudanca", "prints_sobre"];
const COLUNAS = {
  "funcao": "area",
  "projetos": "projetos_semana",
  "comunicacao": "comunicacao_mais_usada",
  "plataforma": "prefere_outra_plataforma",
  "aparelho": "onde_faz_checkin",
  "revisita": "volta_ao_registro",
  "precisou": "precisou_saber",
  "onde": "onde_buscou",
  "historia": "relato_dificuldade",
  "top3": "top3_ajudaria",
  "desconforto": "desconforto",
  "frequencia": "frequencia_painel",
  "painel_olha": "painel_olharia_primeiro",
  "painel_uso": "painel_usaria_para",
  "acesso": "onde_acessar",
  "mudanca": "mudaria",
  "prints_sobre": "imagens_sobre"
};
const PERGUNTAS = {
  "funcao": {
    "tipo": "single",
    "obrig": true,
    "max": 0,
    "nenhum": "",
    "outro": "outro",
    "opcoes": {
      "eng-quim": "Engenharia química",
      "quimica": "Química",
      "geo": "Geociências / Geologia",
      "dev": "Desenvolvimento (fullstack)",
      "design": "Design (UX/UI)",
      "operacoes": "Operações",
      "inovacao": "Inovação",
      "pesquisa": "Pesquisa / academia",
      "diretoria": "Diretoria",
      "outro": "Outra"
    }
  },
  "projetos": {
    "tipo": "single",
    "obrig": true,
    "max": 0,
    "nenhum": "",
    "outro": "",
    "opcoes": {
      "1": "Um só",
      "2-3": "Dois ou três",
      "4+": "Quatro ou mais",
      "varia": "Varia muito"
    }
  },
  "comunicacao": {
    "tipo": "multi",
    "obrig": true,
    "max": 0,
    "nenhum": "",
    "outro": "outro",
    "opcoes": {
      "chat": "Google Chat",
      "email": "E-mail",
      "meet": "Reuniões (Meet)",
      "github": "GitHub (issues e comentários)",
      "whatsapp": "WhatsApp",
      "outro": "Outro"
    }
  },
  "plataforma": {
    "tipo": "single",
    "obrig": true,
    "max": 0,
    "nenhum": "",
    "outro": "sim",
    "opcoes": {
      "sim": "Sim",
      "nao": "Não, prefiro no Google Chat",
      "tanto-faz": "Tanto faz"
    }
  },
  "aparelho": {
    "tipo": "single",
    "obrig": true,
    "max": 0,
    "nenhum": "",
    "outro": "",
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
    "outro": "",
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
    "outro": "outro",
    "opcoes": {
      "horas-proj": "Quantas horas dediquei a um projeto",
      "dia": "O que fiz num dia específico",
      "esqueci": "Se esqueci de enviar algum check-in",
      "status": "Como está o status ou os riscos de um projeto meu",
      "quem": "Quem mais está no mesmo projeto",
      "internas": "Quanto do meu tempo foi para atividades internas",
      "plano": "O que planejei para o dia",
      "outro": "Outra coisa",
      "nenhuma": "Nenhuma destas"
    }
  },
  "onde": {
    "tipo": "single",
    "obrig": true,
    "max": 0,
    "nenhum": "",
    "outro": "outro",
    "opcoes": {
      "chat-pessoal": "Meus Check-ins no chat pessoal",
      "chat-pmo": "Chat-PMO",
      "nao-achei": "Procurei e não encontrei",
      "nao-precisei": "Não precisei",
      "outro": "Outro lugar"
    }
  },
  "historia": {
    "tipo": "text",
    "obrig": false,
    "max": 0,
    "nenhum": "",
    "outro": "",
    "opcoes": null
  },
  "top3": {
    "tipo": "multi",
    "obrig": true,
    "max": 3,
    "nenhum": "",
    "outro": "outro",
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
      "copiar": "Começar do check-in de ontem",
      "outro": "Outra coisa"
    }
  },
  "desconforto": {
    "tipo": "multi",
    "obrig": true,
    "max": 0,
    "nenhum": "nenhum",
    "outro": "outro",
    "opcoes": {
      "ranking": "Comparação ou ranking entre pessoas",
      "alerta-atraso": "Aviso para a gestão quando eu atrasar o check-in",
      "publico": "Meu check-in visível para todo o time",
      "pontualidade": "Ver a minha pontualidade de check-in registrada",
      "outro": "Outra coisa",
      "nenhum": "Nenhuma destas"
    }
  },
  "frequencia": {
    "tipo": "single",
    "obrig": true,
    "max": 0,
    "nenhum": "",
    "outro": "",
    "opcoes": {
      "diario": "Todo dia",
      "semanal": "Uma vez por semana",
      "mensal": "Uma vez por mês",
      "quando": "Só quando precisar",
      "nunca": "Não abriria"
    }
  },
  "painel_olha": {
    "tipo": "multi",
    "obrig": true,
    "max": 2,
    "nenhum": "nao-usaria",
    "outro": "outro",
    "opcoes": {
      "horas-meta": "Minhas horas por dia comparadas com as 8h",
      "por-projeto": "Quanto do meu tempo vai para cada projeto",
      "pontualidade": "Se enviei o check-in no prazo",
      "status": "Status e riscos dos meus projetos",
      "registro-dia": "O que registrei em cada dia",
      "outro": "Outra coisa",
      "nao-usaria": "Não usaria um painel"
    }
  },
  "painel_uso": {
    "tipo": "multi",
    "obrig": true,
    "max": 2,
    "nenhum": "sem-uso",
    "outro": "outro",
    "opcoes": {
      "conferir": "Conferir se registrei tudo certo",
      "reuniao": "Preparar reunião ou justificar minhas horas",
      "planejar": "Planejar a semana",
      "mostrar": "Mostrar meu trabalho para a liderança",
      "outro": "Outro uso",
      "sem-uso": "Não vejo uso"
    }
  },
  "acesso": {
    "tipo": "multi",
    "obrig": true,
    "max": 2,
    "nenhum": "",
    "outro": "outro",
    "opcoes": {
      "chat": "No Google Chat",
      "master": "Na Master",
      "celular": "Numa página no celular",
      "email": "Resumo por e-mail",
      "outro": "Outro lugar"
    }
  },
  "mudanca": {
    "tipo": "text",
    "obrig": false,
    "max": 0,
    "nenhum": "",
    "outro": "",
    "opcoes": null
  },
  "prints_sobre": {
    "tipo": "text",
    "obrig": false,
    "max": 0,
    "nenhum": "",
    "outro": "",
    "opcoes": null
  }
};
const LEGENDAS = {
  "funcao": "Qual é a sua área principal?",
  "projetos": "Em quantos projetos você trabalha numa semana comum?",
  "comunicacao": "Qual meio de comunicação você mais usa no trabalho?",
  "plataforma": "Você preferiria fazer o check-in em outra plataforma, como a Master?",
  "aparelho": "Onde você costuma fazer o check-in?",
  "revisita": "Depois de enviar o check-in, você volta a olhar o que registrou?",
  "precisou": "Nas últimas duas semanas, você precisou saber alguma destas coisas?",
  "onde": "Da última vez que precisou de uma dessas informações, onde você buscou?",
  "historia": "Conte uma vez em que foi difícil encontrar ou registrar algo sobre o seu trabalho. O que aconteceu?",
  "top3": "Escolha até 3 coisas que mais ajudariam no seu dia a dia.",
  "desconforto": "Alguma destas coisas te deixaria desconfortável?",
  "frequencia": "Com que frequência você abriria um painel com as suas próprias horas e projetos?",
  "painel_olha": "Num painel só seu, o que você olharia primeiro?",
  "painel_uso": "Para que você usaria isso?",
  "acesso": "Onde seria mais prático acessar isso?",
  "mudanca": "Se você pudesse mudar uma coisa no jeito de registrar e acompanhar o seu trabalho, o que seria?",
  "prints_sobre": "O que essas imagens mostram?"
};

function cabecalho() {
  const c = ['recebidoEm', 'codigo'];
  ORDEM.forEach(k => { c.push(COLUNAS[k]); if (PERGUNTAS[k].outro) c.push(COLUNAS[k] + '_outro'); });
  return c.concat(['imagens', 'minutos', 'dispositivo', 'versao']);
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.hp) return resposta({ ok: true }); // campo invisível preenchido: robô
    const r = d.r || {};
    const linha = [];
    for (const k of ORDEM) {
      const q = PERGUNTAS[k], v = r[k];
      if (q.tipo === 'text') { linha.push(texto(v, 1500)); continue; }
      let marcado = false;
      if (q.tipo === 'single') {
        if (v == null || v === '') { if (q.obrig) return invalido(); linha.push(''); }
        else { if (!q.opcoes.hasOwnProperty(v)) return invalido(); linha.push(q.opcoes[v]); marcado = v === q.outro; }
      } else {
        const xs = Array.isArray(v) ? v : [];
        if (q.obrig && !xs.length) return invalido();
        if (q.max && xs.length > q.max) return invalido();
        if (!xs.every(x => q.opcoes.hasOwnProperty(x))) return invalido();
        if (q.nenhum && xs.indexOf(q.nenhum) >= 0 && xs.length > 1) return invalido();
        linha.push(xs.map(x => q.opcoes[x]).join('; '));
        marcado = !!q.outro && xs.indexOf(q.outro) >= 0;
      }
      if (q.outro) linha.push(marcado ? texto(r[k + '_o'], 300) : '');
    }

    // Imagens (opcionais): até 3 JPEG já reduzidos pela página
    const imgs = Array.isArray(d.prints) ? d.prints.slice(0, MAX_IMAGENS) : [];
    const links = [];
    if (imgs.length) {
      try {
        const pasta = pastaImagens();
        const carimbo = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
        imgs.forEach((b64, i) => {
          if (typeof b64 !== 'string' || b64.length > 8000000) return;
          const blob = Utilities.newBlob(Utilities.base64Decode(b64), 'image/jpeg', texto(d.codigo, 40) + '-' + carimbo + '-' + (i + 1) + '.jpg');
          links.push(pasta.createFile(blob).getUrl());
        });
      } catch (err) {
        return resposta({ ok: false, error: 'imagem' });
      }
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const aba = abaRespostas();
      aba.appendRow([new Date(), texto(d.codigo, 40)].concat(linha, [links.join('\n'), numero(d.minutos), texto(d.dispositivo, 20), texto(d.versao, 30)]));
    } finally {
      lock.releaseLock();
    }
    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false, error: 'servidor' });
  }
}

// Usa a aba "Respostas" se as colunas forem desta versão; senão cria "Respostas v2", "v3"...
function abaRespostas() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const cab = cabecalho();
  for (let n = 1; n < 20; n++) {
    const nome = n === 1 ? ABA : ABA + ' v' + n;
    let aba = planilha.getSheetByName(nome);
    if (!aba) {
      aba = planilha.insertSheet(nome);
      aba.appendRow(cab);
      formatarAba(aba);
      return aba;
    }
    if (aba.getLastRow() === 0) { aba.appendRow(cab); formatarAba(aba); return aba; }
    const atual = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0].join('|');
    if (atual === cab.join('|')) return aba;
  }
  throw new Error('abas demais');
}

function pastaImagens() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('PASTA_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  const pasta = DriveApp.createFolder(PASTA);
  props.setProperty('PASTA_ID', pasta.getId());
  return pasta;
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

/**
 * Só formatação: melhora a leitura das abas de respostas sem mudar nenhum valor.
 * Pode rodar de novo quando quiser (Executar → formatarRespostas).
 */
function formatarRespostas() {
  SpreadsheetApp.getActiveSpreadsheet().getSheets().forEach(function (aba) {
    if (aba.getName().indexOf(ABA) === 0 && aba.getLastColumn() > 0) formatarAba(aba);
  });
}

// Executar uma vez no editor para autorizar o acesso ao Drive (pasta das imagens).
function autorizar() { pastaImagens(); }

function formatarAba(aba) {
  const nCol = aba.getLastColumn(), nLin = aba.getMaxRows();
  const cab = aba.getRange(1, 1, 1, nCol).getValues()[0];
  aba.getRange(1, 1, nLin, nCol).setFontFamily('Arial').setFontSize(10).setFontColor('#333333').setVerticalAlignment('top');
  const titulos = {
    recebidoEm: 'Data e hora do envio',
    codigo: 'Código aleatório de quem respondeu (repetido = reenvio; vale o mais recente)',
    imagens: 'Links das imagens enviadas (pasta "' + PASTA + '" no Drive)',
    minutos: 'Minutos entre abrir a página e enviar', dispositivo: 'celular ou computador', versao: 'Versão do formulário'
  };
  ORDEM.forEach(function (k) {
    titulos[COLUNAS[k]] = LEGENDAS[k] || k;
    if (PERGUNTAS[k].outro) titulos[COLUNAS[k] + '_outro'] = 'Texto escrito em "' + PERGUNTAS[k].opcoes[PERGUNTAS[k].outro] + '" na pergunta: ' + (LEGENDAS[k] || k);
  });
  aba.getRange(1, 1, 1, nCol).setBackground('#333333').setFontColor('#FFFFFF').setFontWeight('bold')
    .setVerticalAlignment('middle').setWrap(true)
    .setNotes([cab.map(function (c) { return titulos[c] || ''; })]);
  aba.setRowHeight(1, 40);
  aba.setFrozenRows(1);
  aba.setFrozenColumns(3);
  aba.getBandings().forEach(function (b) { b.remove(); });
  aba.getRange(1, 1, nLin, nCol).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false)
    .setHeaderRowColor('#333333').setFirstRowColor('#FFFFFF').setSecondRowColor('#F1F0F1');
  cab.forEach(function (c, i) {
    const col = i + 1, faixa = aba.getRange(2, col, nLin - 1, 1);
    const k = ORDEM.filter(function (x) { return COLUNAS[x] === c; })[0];
    const tipo = k ? PERGUNTAS[k].tipo : '';
    let larg = 140, quebra = false;
    if (c === 'recebidoEm') { larg = 130; faixa.setNumberFormat('dd/MM/yyyy HH:mm'); }
    else if (c === 'codigo') larg = 100;
    else if (c === 'minutos') { larg = 80; faixa.setNumberFormat('0.0').setHorizontalAlignment('right'); }
    else if (c === 'dispositivo' || c === 'versao') larg = 95;
    else if (c === 'imagens' || /_outro$/.test(c)) { larg = 220; quebra = true; }
    else if (tipo === 'text') { larg = 320; quebra = true; }
    else if (tipo === 'multi') { larg = 260; quebra = true; }
    else if (tipo === 'single') { larg = 170; quebra = true; }
    aba.setColumnWidth(col, larg);
    faixa.setWrap(quebra);
  });
  if (aba.getFilter()) aba.getFilter().remove();
  aba.getRange(1, 1, nLin, nCol).createFilter();
}
