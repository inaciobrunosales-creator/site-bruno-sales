/* ==========================================================
   Portfólio — Bruno Sales · JavaScript puro (sem bibliotecas)
   Para atualizar o conteúdo, edite só as listas "DADOS EDITÁVEIS".
   ========================================================== */

/* ---------- DADOS EDITÁVEIS ---------- */

/* Habilidades. "nivel" = 1 a 5 (ou null enquanto não confirmado).
   "codigo" aparece no editor e "saida" é o que o botão "Ver resultado" mostra. */
const HABILIDADES = [
  { grupo: 'Web', nome: 'HTML5', arquivo: 'index.html', nivel: null,
    codigo: '<main>\n  <h1>Olá, eu sou Bruno Sales</h1>\n  <p>Estudante de Sistemas de Informação</p>\n</main>',
    saida: 'Olá, eu sou Bruno Sales\nEstudante de Sistemas de Informação' },
  { grupo: 'Web', nome: 'CSS3', arquivo: 'style.css', nivel: null,
    codigo: '.ola::before {\n  content: "Olá, eu sou Bruno Sales";\n  color: #8F7BFF;\n}',
    saida: 'Olá, eu sou Bruno Sales' , cor: '#B7A5FF' },
  { grupo: 'Web', nome: 'JavaScript', arquivo: 'script.js', nivel: null,
    codigo: 'const nome = "Bruno Sales";\n\nconsole.log(`Olá, eu sou ${nome}`);',
    saida: 'Olá, eu sou Bruno Sales' },
  { grupo: 'Web', nome: 'Desenvolvimento Web', arquivo: 'este-site.txt', nivel: null,
    codigo: 'index.html\ncss/style.css\njs/script.js\nimagens/bruno-sales.png',
    saida: 'Quatro arquivos como esses formam a página que você está vendo.' },
  { grupo: 'Linguagens', nome: 'Python', arquivo: 'ola.py', nivel: null,
    codigo: 'nome = "Bruno Sales"\n\nprint(f"Olá, eu sou {nome}")',
    saida: 'Olá, eu sou Bruno Sales' },
  { grupo: 'Linguagens', nome: 'Java', arquivo: 'Ola.java', nivel: null,
    codigo: 'public class Ola {\n  public static void main(String[] args) {\n    System.out.println("Olá, eu sou Bruno Sales");\n  }\n}',
    saida: 'Olá, eu sou Bruno Sales' },
  { grupo: 'Linguagens', nome: 'C / C++', arquivo: 'ola.cpp', nivel: null,
    codigo: '#include <iostream>\n\nint main() {\n  std::cout << "Olá, eu sou Bruno Sales";\n  return 0;\n}',
    saida: 'Olá, eu sou Bruno Sales' },
  { grupo: 'Linguagens', nome: 'SQL', arquivo: 'ola.sql', nivel: null,
    codigo: "SELECT 'Olá, eu sou ' || nome AS ola\nFROM estudantes\nWHERE faculdade = 'UDF'\n  AND nome = 'Bruno Sales';",
    saida: 'ola\n-----------------------\nOlá, eu sou Bruno Sales' },
  { grupo: 'Ferramentas', nome: 'Git', arquivo: 'ola.sh', nivel: null,
    codigo: 'git add .\ngit commit -m "Olá, eu sou Bruno Sales"',
    saida: '[main] Olá, eu sou Bruno Sales' },
  { grupo: 'Ferramentas', nome: 'GitHub', arquivo: 'README.md', nivel: null,
    codigo: '# Olá, eu sou Bruno Sales\n\nEstudante de Sistemas de Informação na UDF.',
    saida: 'Olá, eu sou Bruno Sales\nEstudante de Sistemas de Informação na UDF.' },
];


/* Projetos. Lista vazia mostra o terminal "em breve".
   Exemplo de como adicionar um projeto:
   {
     nome: 'Nome do projeto',
     descricao: 'O que ele faz.',
     imagem: 'imagens/projetos/nome.png',   // opcional
     tecnologias: ['HTML', 'CSS', 'JavaScript'],
     link: 'https://...',                   // opcional
     codigo: 'https://github.com/inaciobrunosales-creator/repositorio'
   }
*/
const PROJETOS = [];

const EMAIL_CONTATO = 'inaciobrunosales@gmail.com';
const GITHUB_URL = 'https://github.com/inaciobrunosales-creator';

/* ---------- UTILIDADES ---------- */

const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const temMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const limitar = (v, min, max) => Math.min(max, Math.max(min, v));

/** Cria um elemento com classe e texto (textContent evita injeção de HTML). */
function criar(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function icone(id) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'icone');
  svg.setAttribute('aria-hidden', 'true');
  const uso = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  uso.setAttribute('href', '#' + id);
  svg.appendChild(uso);
  return svg;
}

/** Mostra uma mensagem curta no rodapé da tela. */
let temporizadorAviso;
function avisar(texto) {
  const el = document.getElementById('aviso');
  el.textContent = texto;
  el.classList.add('mostrar');
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => el.classList.remove('mostrar'), 2600);
}

/* ---------- HABILIDADES: editor explorável ---------- */

/** Colore textos, comandos e números. Usa textContent, nunca innerHTML. */
function colorir(codigo, destino) {
  const regra = /("[^"\n]*"|'[^'\n]*'|`[^`\n]*`)|(<\/?[a-z]\w*>|\b(?:const|public|class|static|void|int|return|SELECT|AS|FROM|WHERE|AND|print|git|content|color)\b|#include)|(#[0-9A-F]{6}|\b\d+\b)/g;
  destino.textContent = '';
  codigo.split('\n').forEach(linha => {
    const l = criar('span', 'ed-linha');
    let fim = 0;
    for (const m of linha.matchAll(regra)) {
      l.append(linha.slice(fim, m.index), criar('span', m[1] ? 's' : m[2] ? 'k' : 'v', m[0]));
      fim = m.index + m[0].length;
    }
    l.append(linha.slice(fim) || (fim ? '' : ' '));
    destino.appendChild(l);
  });
}

function iniciarEditor() {
  const anel = document.getElementById('ed-arquivos');
  const roda = document.getElementById('roda');
  if (!anel) return;
  const el = id => document.getElementById('ed-' + id);
  const passo = 360 / HABILIDADES.length;
  let giro = 0;      // pode passar de 360: assim a roda sempre gira pelo caminho mais curto
  let indice = -1;

  function mostrar(h) {
    el('titulo').textContent = h.arquivo;
    el('nome').textContent = h.nome;
    colorir(h.codigo, el('codigo'));
    el('resultado').textContent = '';
    el('resultado').classList.remove('aberto');
    const tem = typeof h.nivel === 'number';
    el('nivel').textContent = tem ? `nível ${h.nivel} de 5` : 'nível a definir';
    el('barras').textContent = '';
    for (let i = 1; i <= 5; i++) el('barras').appendChild(criar('i', tem && i <= h.nivel ? 'cheia' : ''));
  }

  const cartas = HABILIDADES.map((h, i) => {
    const b = criar('button', 'roda-carta grupo-' + h.grupo.toLowerCase());
    b.type = 'button';
    b.style.setProperty('--a', i * passo + 'deg');
    b.append(criar('span', 'roda-grupo', h.grupo), criar('strong', '', h.nome), criar('span', 'roda-arquivo', h.arquivo));
    b.addEventListener('click', () => { if (!arrastou) selecionar(i); });
    anel.appendChild(b);
    return b;
  });

  function aplicar(g) {
    anel.style.setProperty('--giro', g + 'deg');
    cartas.forEach((c, i) => {
      const d = Math.abs(((i * passo + g) % 360 + 540) % 360 - 180); // 0 = de frente
      c.style.setProperty('--luz', Math.max(0.25, 1 - d / 120).toFixed(2));
      c.classList.toggle('tras', d > 95);
      c.style.pointerEvents = d > 95 ? 'none' : '';
    });
  }

  function selecionar(i) {
    const n = HABILIDADES.length;
    i = (i % n + n) % n;
    const alvo = -i * passo;
    giro = alvo + Math.round((giro - alvo) / 360) * 360;
    aplicar(giro);
    if (i === indice) return;
    indice = i;
    cartas.forEach((c, k) => { c.setAttribute('aria-pressed', String(k === i)); c.tabIndex = k === i ? 0 : -1; });
    mostrar(HABILIDADES[i]);
  }

  // Arrastar gira; ao soltar, a carta mais próxima para na frente
  let x0 = null, g0 = 0, arrastou = false;
  roda.addEventListener('pointerdown', e => { if (e.target.closest('.roda-seta')) return; x0 = e.clientX; g0 = giro; arrastou = false; });
  window.addEventListener('pointermove', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 6) { arrastou = true; anel.classList.add('arrastando'); }
    if (arrastou) { giro = g0 + dx * 0.28; aplicar(giro); }
  });
  const soltar = () => {
    if (x0 === null) return;
    x0 = null;
    anel.classList.remove('arrastando');
    if (arrastou) { selecionar(Math.round(-giro / passo)); setTimeout(() => { arrastou = false; }, 0); }
  };
  window.addEventListener('pointerup', soltar);
  window.addEventListener('pointercancel', soltar);

  roda.addEventListener('keydown', e => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    selecionar(indice + d);
    if (e.target.classList.contains('roda-carta')) cartas[indice].focus({ preventScroll: true });
  });
  document.getElementById('roda-ant').addEventListener('click', () => selecionar(indice - 1));
  document.getElementById('roda-prox').addEventListener('click', () => selecionar(indice + 1));

  el('executar').addEventListener('click', () => {
    const h = HABILIDADES[indice];
    el('resultado').textContent = h.saida;
    el('resultado').style.color = h.cor || '';
    el('resultado').classList.add('aberto');
  });
  selecionar(HABILIDADES.findIndex(h => h.nome === 'JavaScript'));
}


/* ---------- PROJETOS ---------- */
function renderizarProjetos() {
  const area = document.getElementById('lista-projetos');
  if (!area) return;

  if (PROJETOS.length === 0) {
    area.appendChild(criarTerminalVazio());
    return;
  }

  PROJETOS.forEach((p, i) => {
    const card = criar('article', 'card projeto reveal');
    card.style.setProperty('--delay', (i * 0.08) + 's');

    if (p.imagem) {
      const img = document.createElement('img');
      img.className = 'projeto-img';
      img.src = p.imagem;
      img.alt = 'Prévia do projeto ' + p.nome;
      img.loading = 'lazy';
      card.appendChild(img);
    }

    const corpo = criar('div', 'projeto-corpo');
    corpo.append(criar('h3', '', p.nome), criar('p', '', p.descricao));

    const tags = criar('ul', 'tags');
    (p.tecnologias || []).forEach(t => tags.appendChild(criar('li', '', t)));
    corpo.appendChild(tags);

    const acoes = criar('div', 'projeto-acoes');
    if (p.link) acoes.appendChild(criarLinkExterno(p.link, 'Acessar projeto', 'btn btn-primario', 'i-external'));
    if (p.codigo) acoes.appendChild(criarLinkExterno(p.codigo, 'Ver código', 'btn btn-secundario', 'i-github'));
    corpo.appendChild(acoes);

    card.appendChild(corpo);
    area.appendChild(card);
  });
}

/** Terminal que "digita" o estado atual: sem projetos publicados ainda. */
function criarTerminalVazio() {
  const t = criar('div', 'terminal reveal');
  t.setAttribute('role', 'group');
  t.setAttribute('aria-label', 'Terminal: nenhum projeto publicado ainda');

  const barra = criar('div', 'janela-barra');
  barra.append(document.createElement('i'), document.createElement('i'), document.createElement('i'),
    criar('span', '', 'bash — projetos'));

  const corpo = criar('div', 'terminal-corpo');
  const linhas = [
    ['cmd', 'git status'],
    ['saida', 'Nenhum projeto publicado ainda.'],
    ['cmd', 'git log --oneline'],
    ['saida', 'O primeiro commit está a caminho…'],
  ];
  linhas.forEach(([tipo, texto], i) => {
    const l = criar('span', 'linha');
    l.style.setProperty('--l', i);
    l.appendChild(criar('span', tipo, texto));
    corpo.appendChild(l);
  });

  const aviso = criar('div', 'terminal-aviso');
  const msg = criar('div');
  msg.append(criar('strong', '', 'Novos projetos estão sendo desenvolvidos.'), criar('span', '', 'Em breve, novidades por aqui!'));
  aviso.append(msg, criarLinkExterno(GITHUB_URL, 'Acompanhar no GitHub', 'btn btn-secundario', 'i-github'));

  t.append(barra, corpo, aviso);
  return t;
}

function criarLinkExterno(url, texto, classe, iconeId) {
  const a = criar('a', classe);
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.append(icone(iconeId), document.createTextNode(' ' + texto));
  return a;
}

/* ---------- TÍTULOS: palavras sobem de uma máscara ---------- */
function dividirTitulos() {
  document.querySelectorAll('.dividir').forEach(h => {
    const texto = h.textContent.trim();
    h.setAttribute('aria-label', texto);
    h.textContent = '';
    texto.split(/\s+/).forEach((palavra, i, todas) => {
      const casca = criar('span', 'palavra');
      casca.setAttribute('aria-hidden', 'true');
      const interno = criar('span', '', palavra);
      interno.style.setProperty('--i', i);
      casca.appendChild(interno);
      h.appendChild(casca);
      if (i < todas.length - 1) h.appendChild(document.createTextNode(' '));
    });
  });
}

/* ---------- MENU RESPONSIVO ---------- */
function iniciarMenu() {
  const botao = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu-principal');
  if (!botao || !menu) return;

  const definir = (aberto) => {
    menu.classList.toggle('aberto', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  };

  botao.addEventListener('click', () => definir(botao.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => definir(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') definir(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 860) definir(false); });
}

/* ---------- SEÇÃO ATIVA NO MENU ---------- */
function iniciarSecaoAtiva() {
  const links = [...document.querySelectorAll('.nav-link')];
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entradas => entradas.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(l => {
      const ativo = l.getAttribute('href') === '#' + e.target.id;
      l.classList.toggle('ativo', ativo);
      if (ativo) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
    });
  }), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main > section').forEach(s => obs.observe(s));
}

/* ---------- ANIMAÇÕES DE ENTRADA (Intersection Observer) ---------- */
function marcarVisivel(el) {
  if (el.classList.contains('visivel')) return;
  el.classList.add('visivel');
  // Solta a classe depois da entrada, para o hover dos cards não herdar o atraso
  if (el.classList.contains('reveal')) setTimeout(() => el.classList.remove('reveal'), 1400);
  if (el.classList.contains('terminal')) el.classList.add('rodando');
}

function iniciarReveal() {
  const alvos = document.querySelectorAll('.reveal, .dividir');
  if (menosMovimento || !('IntersectionObserver' in window)) {
    alvos.forEach(marcarVisivel);
    return;
  }
  // Dispara cedo (≈15% visível) para a animação terminar antes do elemento ocupar a tela
  const obs = new IntersectionObserver((entradas, o) => {
    entradas.forEach(e => { if (e.isIntersecting) { marcarVisivel(e.target); o.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  alvos.forEach(el => obs.observe(el));
}

/* ---------- SCROLL: progresso, cabeçalho, parallax, voltar ao topo ---------- */
function iniciarRolagem() {
  const cabecalho = document.getElementById('cabecalho');
  const topo = document.getElementById('voltar-topo');
  const barra = document.getElementById('progresso-scroll');
  const hero = document.getElementById('inicio');
  let agendado = false;

  const atualizar = () => {
    agendado = false;
    const y = window.scrollY;
    const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;

    barra.style.setProperty('--progresso', alturaTotal > 0 ? limitar(y / alturaTotal, 0, 1).toFixed(4) : 0);
    cabecalho.classList.toggle('rolado', y > 20);

    // Parallax suave nos brilhos do início (frações da rolagem, só enquanto visível)
    if (!menosMovimento && y < hero.offsetHeight) hero.style.setProperty('--py', (y * 0.18).toFixed(1) + 'px');

    if (y > 600) {
      topo.hidden = false;
      requestAnimationFrame(() => topo.classList.add('visivel'));
    } else if (topo.classList.contains('visivel')) {
      topo.classList.remove('visivel');
      setTimeout(() => { if (!topo.classList.contains('visivel')) topo.hidden = true; }, 300);
    }
  };

  const pedir = () => { if (!agendado) { agendado = true; requestAnimationFrame(atualizar); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir);
  atualizar();
  topo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: menosMovimento ? 'auto' : 'smooth' }));
}

/* ---------- FOTO EM 3D: inclina com o mouse ---------- */
function iniciarPalco3D() {
  const hero = document.getElementById('inicio');
  const foto = document.querySelector('.foto-moldura');
  if (!foto || !temMouse || menosMovimento) return;
  hero.addEventListener('pointermove', e => {
    const r = foto.getBoundingClientRect();
    const dx = limitar((e.clientX - r.left - r.width / 2) / window.innerWidth, -1, 1);
    const dy = limitar((e.clientY - r.top - r.height / 2) / window.innerHeight, -1, 1);
    foto.style.setProperty('--ry', (dx * 26).toFixed(2) + 'deg');
    foto.style.setProperty('--rx', (-dy * 26).toFixed(2) + 'deg');
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { foto.style.setProperty('--ry', '0deg'); foto.style.setProperty('--rx', '0deg'); });
}

/* ---------- INTERAÇÕES DE PONTEIRO: spotlight nos cards e botões magnéticos ---------- */
function iniciarPonteiro() {
  document.addEventListener('pointermove', e => {
    const card = e.target.closest && e.target.closest('.card');
    if (card) {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }
  }, { passive: true });

  if (!temMouse || menosMovimento) return;

  // Botões "magnéticos": seguem levemente o cursor
  document.querySelectorAll('.magnetico').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--tx', ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px');
      b.style.setProperty('--ty', ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px');
    });
    b.addEventListener('pointerleave', () => { b.style.setProperty('--tx', '0px'); b.style.setProperty('--ty', '0px'); });
  });

}

/* ---------- REDE DE PARTÍCULAS (canvas) ---------- */
function iniciarRede() {
  const canvas = document.getElementById('rede');
  const hero = document.getElementById('inicio');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, pontos = [], visivel = true, rodando = false;
  const mouse = { x: -999, y: -999 };

  function medir() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth; h = hero.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const qtd = Math.round(limitar((w * h) / 24000, 22, 70));
    pontos = Array.from({ length: qtd }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.4 + 0.7,
    }));
  }

  function desenhar() {
    ctx.clearRect(0, 0, w, h);
    const alcance = 130;
    for (let i = 0; i < pontos.length; i++) {
      const p = pontos[i];
      if (!menosMovimento) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        // O cursor empurra os pontos de leve
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 14000) { const f = 0.6 / Math.sqrt(d2 + 1); p.x += dx * f; p.y += dy * f; }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(190,174,224,.7)';
      ctx.fill();
      for (let j = i + 1; j < pontos.length; j++) {
        const q = pontos[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
        if (d < alcance) {
          ctx.strokeStyle = `rgba(${i % 2 ? '192,76,240' : '143,123,255'},${(1 - d / alcance) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
  }

  function loop() {
    if (!visivel || document.hidden) { rodando = false; return; }
    desenhar();
    requestAnimationFrame(loop);
  }
  function iniciar() { if (!rodando && !menosMovimento) { rodando = true; requestAnimationFrame(loop); } }

  medir();
  desenhar();
  if (menosMovimento) return;

  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
  let t;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(medir, 200); });
  document.addEventListener('visibilitychange', iniciar);
  // Pausa quando o início sai da tela (economiza bateria)
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel) iniciar(); }).observe(hero);
  iniciar();
}

/* ---------- TERMINAL DO INÍCIO: responde a comandos ---------- */
const COMANDOS = {
  sobre: { texto: ['Bruno Sales, estudante de Sistemas de Informação na UDF.', 'Brasília - DF. Perfeccionista.'], link: ['#sobre', 'Ler mais sobre mim'] },
  habilidades: { texto: ['Web, linguagens e ferramentas: ' + HABILIDADES.length + ' itens para explorar.'], link: ['#habilidades', 'Abrir o editor'] },
  projetos: { texto: [PROJETOS.length ? PROJETOS.map(p => p.nome).join(', ') : 'Novos projetos estão sendo desenvolvidos.'], link: ['#projetos', 'Ir para projetos'] },
  formacao: { texto: ['2026: início da graduação.', '2030: previsão de conclusão.'], link: ['#formacao', 'Ver a trajetória'] },
  contato: { texto: [EMAIL_CONTATO], link: ['#contato', 'Escrever uma mensagem'] },
  github: { texto: ['inaciobrunosales-creator'], link: [GITHUB_URL, 'Abrir o GitHub'] },
};

function iniciarTerminal() {
  const saida = document.getElementById('th-saida');
  const form = document.getElementById('th-form');
  const entrada = document.getElementById('th-entrada');
  const atalhos = document.getElementById('th-atalhos');
  if (!saida) return;
  const historico = [];
  let pos = 0;

  function executar(bruto) {
    // aceita "Formação", "formacao", "./sobre"...
    const cmd = bruto.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/^[./]+/, '');
    if (!cmd) return;
    historico.push(bruto); pos = historico.length;
    if (cmd === 'limpar' || cmd === 'clear') { saida.textContent = ''; return; }

    const bloco = criar('div', 'th-bloco');
    bloco.appendChild(criar('p', 'th-cmd', bruto.trim()));
    const c = Object.hasOwn(COMANDOS, cmd) ? COMANDOS[cmd] : null;
    if (cmd === 'ajuda' || cmd === 'help') {
      bloco.appendChild(criar('p', '', 'Comandos: ' + Object.keys(COMANDOS).join(', ') + ', limpar.'));
    } else if (c) {
      c.texto.forEach(t => bloco.appendChild(criar('p', '', t)));
      const a = criar('a', '', c.link[1]);
      a.href = c.link[0];
      if (c.link[0].startsWith('http')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      bloco.appendChild(a);
    } else {
      bloco.appendChild(criar('p', '', 'Comando não encontrado. Digite ajuda para ver a lista.'));
    }
    saida.appendChild(bloco);
    saida.scrollTop = saida.scrollHeight;
  }

  form.addEventListener('submit', e => { e.preventDefault(); executar(entrada.value); entrada.value = ''; });
  // Setas percorrem os comandos anteriores, como num terminal de verdade
  entrada.addEventListener('keydown', e => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    pos = limitar(pos + (e.key === 'ArrowUp' ? -1 : 1), 0, historico.length);
    entrada.value = historico[pos] || '';
  });
  ['sobre', 'habilidades', 'projetos', 'contato'].forEach(nome => {
    const b = criar('button', '', nome);
    b.type = 'button';
    b.addEventListener('click', () => executar(nome));
    atalhos.appendChild(b);
  });
  executar('sobre');
}

/* ---------- CENA 3D E ROLAGEM: tudo ligado à posição da página, sem travar a rolagem ---------- */
function iniciarCena() {
  const hero = document.getElementById('inicio');
  const mundo = document.getElementById('cena-mundo');
  const faixas = document.querySelector('.faixas');
  const texto = document.getElementById('sobre-texto');
  const escada = document.getElementById('escada');
  const degraus = [...escada.children];
  const anoAtual = String(new Date().getFullYear());
  degraus.forEach(d => { if (d.dataset.ano <= anoAtual) d.classList.add('feito'); });

  // Cada palavra do texto vira um span, para acender conforme a leitura
  const palavras = [];
  if (!menosMovimento) {
    texto.querySelectorAll('p').forEach(p => {
      const partes = p.textContent.trim().split(/\s+/);
      p.textContent = '';
      partes.forEach(t => { const s = criar('span', 'lp', t); palavras.push(s); p.append(s, ' '); });
    });
  } else {
    escada.style.setProperty('--sobe', 1);
    degraus.forEach(d => d.style.setProperty('--k', 1));
    return;
  }

  let agendado = false;
  const atualizar = () => {
    agendado = false;
    const vh = window.innerHeight;
    // 1. Início: a câmera avança por entre os cubos
    const curso = hero.offsetHeight - vh;
    const p = curso > 40 ? limitar(window.scrollY / curso, 0, 1) : 0;
    hero.style.setProperty('--p', p.toFixed(4));
    // 2. Faixas andam em sentidos opostos
    const rf = faixas.getBoundingClientRect();
    if (rf.top < vh && rf.bottom > 0) faixas.style.setProperty('--x', ((vh - rf.top) * 0.45).toFixed(1) + 'px');
    // 3. Texto "Sobre" acende palavra por palavra
    const rt = texto.getBoundingClientRect();
    const lidas = limitar((vh * 0.82 - rt.top) / (rt.height + vh * 0.12), 0, 1) * palavras.length;
    palavras.forEach((s, i) => s.classList.toggle('acesa', i < lidas));
    // 4. Escada da graduação sobe em sequência
    const re = escada.getBoundingClientRect();
    const k = limitar((vh * 0.95 - re.top) / (vh * 0.55), 0, 1);
    degraus.forEach((d, i) => {
      const t = limitar(k * 1.8 - i * 0.2, 0, 1);
      d.style.setProperty('--k', (1 - Math.pow(1 - t, 3)).toFixed(3));
    });
  };
  const pedir = () => { if (!agendado) { agendado = true; requestAnimationFrame(atualizar); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir);
  atualizar();

  // Mouse gira o mundo, com amortecimento (a cena chega um pouco depois do cursor)
  if (!temMouse) return;
  let ax = 0, ay = 0, bx = 0, by = 0, vivo = false;
  function seguir() {
    bx += (ax - bx) * 0.07; by += (ay - by) * 0.07;
    mundo.style.setProperty('--my', (bx * 16).toFixed(2) + 'deg');
    mundo.style.setProperty('--mx', (-by * 12).toFixed(2) + 'deg');
    hero.style.setProperty('--ex', (-bx * 10).toFixed(2));
    hero.style.setProperty('--ey', (5 - by * 8).toFixed(2));
    if (Math.abs(ax - bx) + Math.abs(ay - by) > 0.002) requestAnimationFrame(seguir); else vivo = false;
  }
  hero.addEventListener('pointermove', e => {
    ax = e.clientX / window.innerWidth - 0.5; ay = e.clientY / window.innerHeight - 0.5;
    if (!vivo) { vivo = true; requestAnimationFrame(seguir); }
  }, { passive: true });
}

/* ---------- CARTÕES QUE INCLINAM EM 3D ---------- */
function iniciarInclinacao() {
  if (!temMouse || menosMovimento) return;
  document.querySelectorAll('#interesses .card, .contato-cards .card:not(.card-pendente), .filme').forEach(c => {
    c.classList.add('inclina');
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--iy', (((e.clientX - r.left) / r.width - 0.5) * 18).toFixed(1) + 'deg');
      c.style.setProperty('--ix', (-((e.clientY - r.top) / r.height - 0.5) * 18).toFixed(1) + 'deg');
    });
    c.addEventListener('pointerleave', () => { c.style.setProperty('--ix', '0deg'); c.style.setProperty('--iy', '0deg'); });
  });
}

/* ---------- FILME: toca só quando está na tela ---------- */
function iniciarFilme() {
  const v = document.getElementById('filme');
  if (!v) return;
  if (menosMovimento || !('IntersectionObserver' in window)) { v.controls = true; return; }
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) v.play().catch(() => { v.controls = true; }); else v.pause();
  }, { threshold: 0.25 }).observe(v);
}


/* ---------- ABAS DE INTERESSES ---------- */
function iniciarAbas() {
  const lista = document.querySelector('.abas');
  if (!lista) return;
  const abas = [...lista.querySelectorAll('.aba')];
  const marca = lista.querySelector('.aba-marca');

  const posicionar = () => {
    const ativa = abas.find(a => a.getAttribute('aria-selected') === 'true');
    marca.style.width = ativa.offsetWidth + 'px';
    marca.style.height = ativa.offsetHeight + 'px';
    marca.style.transform = `translate(${ativa.offsetLeft}px, ${ativa.offsetTop}px)`;
  };

  function selecionar(aba, foco) {
    abas.forEach(a => {
      const ativa = a === aba;
      a.setAttribute('aria-selected', String(ativa));
      a.tabIndex = ativa ? 0 : -1;
      document.getElementById(a.getAttribute('aria-controls')).hidden = !ativa;
    });
    posicionar();
    if (foco) aba.focus();
  }

  abas.forEach((aba, i) => {
    aba.addEventListener('click', () => selecionar(aba));
    aba.addEventListener('keydown', e => {
      const mover = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (mover) { e.preventDefault(); selecionar(abas[(i + mover + abas.length) % abas.length], true); }
      if (e.key === 'Home') { e.preventDefault(); selecionar(abas[0], true); }
      if (e.key === 'End') { e.preventDefault(); selecionar(abas[abas.length - 1], true); }
    });
  });

  posicionar();
  window.addEventListener('resize', posicionar);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(posicionar);
  window.addEventListener('load', posicionar);
}

/* ---------- COPIAR E-MAIL ---------- */
function iniciarCopiar() {
  const botao = document.getElementById('copiar-email');
  if (!botao) return;
  const rotulo = botao.querySelector('span');

  botao.addEventListener('click', async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(botao.dataset.copiar); ok = true; }
    catch (_) { // alternativa para abrir o arquivo localmente (file://)
      const t = document.createElement('textarea');
      t.value = botao.dataset.copiar; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
      t.remove();
    }
    if (ok) {
      botao.classList.add('copiado');
      rotulo.textContent = 'Copiado!';
      avisar('E-mail copiado para a área de transferência.');
      setTimeout(() => { botao.classList.remove('copiado'); rotulo.textContent = 'Copiar e-mail'; }, 2200);
    } else {
      avisar('Não foi possível copiar. Selecione o e-mail manualmente.');
    }
  });
}

/* ---------- FORMULÁRIO ---------- */
function iniciarFormulario() {
  const form = document.getElementById('form-contato');
  const status = document.getElementById('form-status');
  if (!form) return;

  const regras = {
    nome:     v => v.trim().length >= 2 || 'Informe seu nome (mínimo 2 letras).',
    email:    v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Informe um e-mail válido.',
    assunto:  v => v.trim().length >= 3 || 'Informe o assunto (mínimo 3 letras).',
    mensagem: v => v.trim().length >= 10 || 'Escreva uma mensagem com pelo menos 10 caracteres.',
  };

  function validarCampo(nome) {
    const campo = form.elements[nome];
    const resultado = regras[nome](campo.value);
    const msg = resultado === true ? '' : resultado;
    document.getElementById('erro-' + nome).textContent = msg;
    campo.closest('.campo').classList.toggle('invalido', Boolean(msg));
    campo.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  }

  Object.keys(regras).forEach(nome => {
    const campo = form.elements[nome];
    campo.addEventListener('blur', () => validarCampo(nome));
    campo.addEventListener('input', () => { if (campo.closest('.campo').classList.contains('invalido')) validarCampo(nome); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = '';

    const validos = Object.keys(regras).map(validarCampo);
    if (validos.includes(false)) {
      status.classList.add('erro-envio');
      status.textContent = 'Corrija os campos destacados.';
      const primeiro = form.querySelector('.invalido input, .invalido textarea');
      if (primeiro) primeiro.focus();
      return;
    }

    // Site estático (GitHub Pages): abre o aplicativo de e-mail com a mensagem pronta.
    // Para usar um serviço de formulários (Formspree, Web3Forms...), troque esta parte por um fetch().
    const corpo = `Nome: ${form.nome.value.trim()}\nE-mail: ${form.email.value.trim()}\n\n${form.mensagem.value.trim()}`;
    window.location.href = `mailto:${EMAIL_CONTATO}?subject=${encodeURIComponent(form.assunto.value.trim())}&body=${encodeURIComponent(corpo)}`;

    status.textContent = 'Abrindo seu aplicativo de e-mail… Se nada acontecer, escreva para ' + EMAIL_CONTATO + '.';
  });
}

/* ---------- INICIALIZAÇÃO ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ano-atual').textContent = new Date().getFullYear();
  iniciarEditor();           // montar o conteúdo dinâmico antes de observar
  renderizarProjetos();
  dividirTitulos();
  iniciarMenu();
  iniciarSecaoAtiva();
  iniciarReveal();
  iniciarRolagem();
  iniciarPalco3D();
  iniciarPonteiro();
  iniciarRede();
  iniciarTerminal();
  iniciarCena();
  iniciarInclinacao();
  iniciarFilme();
  iniciarAbas();
  iniciarCopiar();
  iniciarFormulario();
});
