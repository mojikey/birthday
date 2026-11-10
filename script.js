
  const scenes = [...document.querySelectorAll('.scene')];
  const nav = document.getElementById('navigation');
  const music = document.getElementById('birthday-music');
  const musicButton = document.getElementById('music-control');
  const fallingLayer = document.getElementById('falling-layer');
  let currentScene = 0;
  let musicStarted = false;
  const discovered = new Set();
  const flowerMessages = [
    'Just being with you feels amazing I cant wait to start my life with you. 💗',
    'Seeing you everyday is enough to make me happy. 🌸',
    'Being with you fells like I am the most lucky man in the world. 🌼',
    'I hope your life is always full of beautiful suprises like you are to me. 🪻'
  ];

  scenes.forEach((scene, index) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (index === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to scene ${index + 1}`);
    dot.addEventListener('click', () => showScene(index));
    nav.appendChild(dot);
  });

  function showScene(index) {
    currentScene = Math.max(0, Math.min(index, scenes.length - 1));
    scenes.forEach((scene, i) => scene.classList.toggle('active', i === currentScene));
    [...nav.children].forEach((dot, i) => dot.classList.toggle('active', i === currentScene));
    if (currentScene === 7) renderFinalBouquet();
    startMusicAfterInteraction();
  }

  function startMusicAfterInteraction() {
    if (musicStarted) return;
    musicStarted = true;
    music.play().then(() => { musicButton.textContent = '♫'; }).catch(() => {
      musicStarted = false;
      musicButton.textContent = '♪';
    });
  }

  function toggleMusic() {
    if (music.paused) {
      music.play().then(() => { musicStarted = true; musicButton.textContent = '♫'; }).catch(() => { musicButton.textContent = '♪'; });
    } else {
      music.pause();
      musicButton.textContent = '♪';
    }
  }

  function revealFlower(index, button) {
    discovered.add(index);
    button.classList.add('found');
    document.getElementById('flower-message').textContent = flowerMessages[index];
    document.getElementById('flower-counter').textContent = `${discovered.size} of 4 flowers discovered 🌸`;
    const box = document.getElementById('flower-message');
    box.classList.remove('pop'); void box.offsetWidth; box.classList.add('pop');
    if (discovered.size === 4) {
      document.getElementById('flower-counter').style.display = 'none';
      document.getElementById('garden-next').classList.add('show');
    }
  }

  function openLetter() {
    document.getElementById('letter').classList.add('reading');
    document.getElementById('letter-paper').classList.add('open');
    document.getElementById('envelope-button').style.display = 'none';
    document.getElementById('letter-intro').style.display = 'none';
    document.getElementById('letter-next').classList.add('show');
    burstFlowers();
  }

  function finishBirthday() {
    document.getElementById('cake-message').textContent = 'Thank you for making life more beautiful. ♡';
    document.getElementById('thank-you').textContent = 'Start again ↺';
    document.getElementById('thank-you').onclick = () => showScene(0);
    burstFlowers();
  }

  function addFallingDecoration() {
    const symbols = ['🌸','🌷','💗','♡','🌼'];
    const item = document.createElement('span');
    item.className = 'falling';
    item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    item.style.left = `${Math.random() * 100}%`;
    item.style.fontSize = `${13 + Math.random() * 17}px`;
    item.style.setProperty('--drift', `${Math.round(Math.random() * 130 - 65)}px`);
    const duration = 7 + Math.random() * 6;
    item.style.animationDuration = `${duration}s`;
    fallingLayer.appendChild(item);
    window.setTimeout(() => item.remove(), duration * 1000 + 300);
  }

  function burstFlowers() {
    for (let i = 0; i < 24; i++) window.setTimeout(addFallingDecoration, i * 45);
  }

  // This layer stays alive while scenes change, so petals/hearts never restart per page.
  for (let i = 0; i < 18; i++) window.setTimeout(addFallingDecoration, i * 260);
  window.setInterval(addFallingDecoration, 520);


  /* ===== Cake: SVG with clickable flames ===== */
  function buildCake() {
    const rnd = (a, b) => a + Math.random() * (b - a);
    let s = `<svg class="cakeSvg" viewBox="0 0 400 380" role="img" aria-label="Birthday cake with three candles">
    <defs>
      <linearGradient id="cg1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffe3ec"/><stop offset="1" stop-color="#ffb8cf"/></linearGradient>
      <linearGradient id="cg2" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff6dc"/><stop offset="1" stop-color="#ffe0a8"/></linearGradient>
      <radialGradient id="cfl" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#fffbc0"/><stop offset=".55" stop-color="#ffb43a"/><stop offset="1" stop-color="#ff5a2a"/></radialGradient>
    </defs>
    <ellipse cx="200" cy="352" rx="185" ry="24" fill="#fff" stroke="#f7b0c9" stroke-width="3"/>
    <ellipse cx="200" cy="348" rx="150" ry="16" fill="#ffe9f1"/>
    <rect x="45" y="225" width="310" height="120" rx="26" fill="url(#cg1)" stroke="#f48fb1" stroke-width="3"/>
    <rect x="45" y="225" width="310" height="26" rx="13" fill="#fff"/>`;
    for (let x = 62; x <= 340; x += 32) s += `<ellipse cx="${x}" cy="${256 + (x % 64 ? 8 : 0)}" rx="14" ry="${18 + (x % 64 ? 4 : 12)}" fill="#fff"/>`;
    for (let x = 62; x <= 340; x += 31) s += `<circle cx="${x}" cy="338" r="11" fill="#fff" stroke="#f9bdd2"/>`;
    s += `<rect x="95" y="140" width="210" height="95" rx="22" fill="url(#cg2)" stroke="#f0b66a" stroke-width="3"/>
    <rect x="95" y="140" width="210" height="24" rx="12" fill="#ffadc9"/>`;
    for (let x = 112; x <= 290; x += 26) s += `<ellipse cx="${x}" cy="${166 + (x % 52 ? 6 : 0)}" rx="12" ry="${14 + (x % 52 ? 4 : 11)}" fill="#ffadc9"/>`;
    s += `<rect x="132" y="262" width="136" height="48" rx="14" fill="#fff" stroke="#f06292" stroke-width="3"/>
    <text x="200" y="283" text-anchor="middle" font-family="Dancing Script, cursive" font-weight="700" font-size="21" fill="#e0457b">Happy</text>
    <text x="200" y="304" text-anchor="middle" font-family="Dancing Script, cursive" font-weight="700" font-size="21" fill="#e0457b">Birthday</text>`;
    const berry = (x, y, r) => `<g transform="translate(${x} ${y})"><path d="M0 ${r} C${-r*1.3} ${r*.2} ${-r*.9} ${-r} 0 ${-r*.7} C${r*.9} ${-r} ${r*1.3} ${r*.2} 0 ${r}Z" fill="#ff4d6d" stroke="#d62a4e" stroke-width="2"/><path d="M${-r*.6} ${-r*.7} l${r*.6} ${-r*.5} l${r*.6} ${r*.5} l${-r*.6} ${r*.2}Z" fill="#5cb85c"/>${[[-.4,0],[.3,-.1],[0,.4],[-.3,.5],[.4,.4]].map(p => `<circle cx="${p[0]*r}" cy="${p[1]*r}" r="1.6" fill="#ffe3e8"/>`).join('')}</g>`;
    [[118,140,15],[282,140,15],[72,226,16],[328,226,16],[200,228,12]].forEach(b => s += berry(...b));
    const flower = (x, y, c) => { let g = `<g transform="translate(${x} ${y})">`; for (let a = 0; a < 5; a++) g += `<ellipse cx="0" cy="-8" rx="6" ry="9" fill="${c}" transform="rotate(${a*72})"/>`; return g + `<circle r="4.5" fill="#ffd54f"/></g>`; };
    [[96,296,'#ff9ec0'],[304,296,'#ff9ec0'],[110,196,'#fff'],[290,196,'#fff'],[160,160,'#ffd1e3'],[240,160,'#ffd1e3']].forEach(f => s += flower(...f));
    const bow = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0 0 L-20 -12 L-20 12Z M0 0 L20 -12 L20 12Z" fill="#f06292"/><circle r="5" fill="#d81b60"/></g>`;
    s += bow(70, 262) + bow(330, 262);
    for (let i = 0; i < 46; i++) { const x = rnd(60, 340), y = rnd(235, 330); if (x > 128 && x < 272 && y > 258 && y < 314) continue;
      s += `<rect x="${x}" y="${y}" width="9" height="3.2" rx="1.6" fill="${['#ff6b9d','#7ad7f0','#ffd54f','#b39ddb','#8bd88b'][i%5]}" transform="rotate(${rnd(0,180)} ${x} ${y})"/>`; }
    [150, 200, 250].forEach((x, i) => {
      s += `<g><rect x="${x-6}" y="78" width="12" height="64" rx="4" fill="#fff" stroke="#f48fb1" stroke-width="2"/>
      <path d="M${x-6} 92 l12 -6 M${x-6} 106 l12 -6 M${x-6} 120 l12 -6 M${x-6} 134 l12 -6" stroke="#ff8fb4" stroke-width="3"/>
      <g class="cake-flame" data-x="${x}" style="animation-delay:${i*.07}s">
        <circle cx="${x}" cy="58" r="26" fill="transparent"/>
        <path d="M${x} 36 C${x+14} 52 ${x+11} 72 ${x} 72 C${x-11} 72 ${x-14} 52 ${x} 36Z" fill="url(#cfl)"/>
        <path d="M${x} 52 C${x+5} 60 ${x+4} 68 ${x} 68 C${x-4} 68 ${x-5} 60 ${x} 52Z" fill="#fffbe0"/>
      </g></g>`;
    });
    return s + '</svg>';
  }

  function setupCake() {
    const wrap = document.getElementById('cake-wrap');
    wrap.innerHTML = buildCake();
    const svg = wrap.firstElementChild;
    svg.querySelectorAll('.cake-flame').forEach(flame => flame.addEventListener('click', () => {
      if (flame.classList.contains('off')) return;
      flame.classList.add('off');
      const x = +flame.dataset.x;
      for (let i = 0; i < 8; i++) {
        const puff = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        puff.setAttribute('class', 'smk');
        puff.setAttribute('cx', x); puff.setAttribute('cy', 66); puff.setAttribute('r', 5 + Math.random() * 3);
        puff.style.setProperty('--dx', (Math.random() * 50 - 25) + 'px');
        puff.style.animationDelay = (i * .15) + 's';
        svg.appendChild(puff);
        setTimeout(() => puff.remove(), 3800);
      }
      if (!svg.querySelector('.cake-flame:not(.off)')) {
        document.getElementById('cake-title').textContent = 'All candles are out!';
        document.getElementById('cake-message').textContent = 'Your wish is made! ♡';
        document.getElementById('thank-you').disabled = false;
        burstFlowers();
      }
    }));
  }

  function resetCake() {
    setupCake();
    document.getElementById('cake-title').textContent = 'Blow out the candles ♡';
    document.getElementById('cake-message').textContent = 'Tap each flame to blow it out 🔥💨';
    const b = document.getElementById('thank-you');
    b.textContent = 'Thank you! ♡'; b.disabled = true; b.onclick = finishBirthday;
  }

  // "Start again" returns to the first page and re-lights the candles
  finishBirthday = function () {
    document.getElementById('cake-message').textContent = 'Thank you for making life more beautiful. ♡';
    const b = document.getElementById('thank-you');
    b.textContent = 'Start again ↺';
    b.onclick = () => { resetCake(); showScene(0); };
    burstFlowers();
  };
  setupCake();


  /* ===== Memories: click a photo to see it large with its caption ===== */
  function openMemory(fig) {
    const img = fig.querySelector('img');
    const view = document.getElementById('memory-view');
    const big = document.getElementById('memory-view-img');
    const hasPhoto = img && img.style.display !== 'none' && img.complete && img.naturalWidth > 0;
    big.style.display = hasPhoto ? 'block' : 'none';
    if (hasPhoto) big.src = img.src;
    document.getElementById('memory-view-text').textContent = fig.querySelector('figcaption').textContent;
    view.classList.add('open');
    burstFlowers();
  }
  function closeMemory() { document.getElementById('memory-view').classList.remove('open'); }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMemory();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('memory')) { e.preventDefault(); openMemory(e.target); }
  });


  /* ===== Flower shop ===== */
  const FLOWERS = [
    { n: 'Pink Rose', t: 'rose', c: ['#ff8fb5', '#ffb3cd', '#d6336c'] },
    { n: 'Red Rose', t: 'rose', c: ['#e5365a', '#ff6b86', '#a3153a'] },
    { n: 'Tulip', t: 'tulip', c: ['#ff9ec0', '#ffc9dc', '#d6336c'] },
    { n: 'Daisy', t: 'daisy' },
    { n: 'Blossom', t: 'blossom' },
    { n: 'Lavender', t: 'lavender' },
    { n: 'Sunflower', t: 'sunflower' },
    { n: 'Peony', t: 'peony', c: ['#ffe0ec', '#ffb8d0', '#f06292'] }
  ];
  const MAX_FLOWERS = 7, MIN_FLOWERS = 3;
  const SLOTS = [[150,95],[98,118],[202,118],[125,160],[175,160],[60,170],[240,170]];
  const chosen = [];
  let shopStep = 0, lastAdded = -1;

  function flowerHead(f) {
    const c = f.c || [];
    switch (f.t) {
      case 'rose': {
        let s = `<circle r="22" fill="${c[0]}"/>`;
        for (let a = 0; a < 6; a++) s += `<circle cx="${(19 * Math.sin(a * Math.PI / 3)).toFixed(1)}" cy="${(-19 * Math.cos(a * Math.PI / 3)).toFixed(1)}" r="11" fill="${c[0]}" stroke="${c[2]}" stroke-width="1"/>`;
        s += `<circle r="15" fill="${c[1]}" stroke="${c[2]}" stroke-width="1.5"/><circle r="8" fill="${c[0]}" stroke="${c[2]}" stroke-width="1.5"/>`;
        return s + `<path d="M-11 1 C-11 -12 11 -12 11 1 C11 10 -5 11 -4 2 C-3 -3 4 -3 4 1" fill="none" stroke="${c[2]}" stroke-width="2" stroke-linecap="round"/>`;
      }
      case 'peony': {
        let s = '';
        [[1, 0], [.7, 22], [.42, 11]].forEach(([k, off], L) => {
          for (let a = 0; a < 8; a++) s += `<ellipse cx="0" cy="${-13 * k}" rx="${10 * k}" ry="${15 * k}" fill="${c[L]}" stroke="#fff" stroke-opacity=".7" stroke-width="1" transform="rotate(${a * 45 + off})"/>`;
        });
        return s + `<circle r="3.5" fill="#ffd54f"/>`;
      }
      case 'tulip':
        return `<path d="M-20 0 C-23 -24 -12 -30 -8 -21 L0 -35 L8 -21 C12 -30 23 -24 20 0 C20 17 -20 17 -20 0Z" fill="${c[0]}" stroke="${c[2]}" stroke-width="2" stroke-linejoin="round"/>
          <path d="M-8 -21 C-7 -4 -9 6 -12 10 M8 -21 C7 -4 9 6 12 10 M0 -35 C-3 -15 -3 0 0 12" fill="none" stroke="${c[2]}" stroke-width="1.5" opacity=".6"/>
          <path d="M-12 -6 C-14 -20 -6 -24 -6 -14 C-6 -6 -9 4 -12 8Z" fill="${c[1]}" opacity=".8"/>`;
      case 'daisy': {
        let s = '';
        for (let a = 0; a < 12; a++) s += `<ellipse cx="0" cy="-15" rx="5.5" ry="14" fill="#fff" stroke="#f3c6d5" stroke-width="1.2" transform="rotate(${a * 30})"/>`;
        return s + `<circle r="8" fill="#ffcc33" stroke="#e5a100" stroke-width="1.5"/>`;
      }
      case 'blossom': {
        let s = '';
        for (let a = 0; a < 5; a++) s += `<path d="M0 0 C-14 -8 -14 -26 -4 -27 L0 -22 L4 -27 C14 -26 14 -8 0 0Z" fill="#ffc2d8" stroke="#f06292" stroke-width="1.5" transform="rotate(${a * 72})"/>`;
        s += `<circle r="5" fill="#e8407a"/>`;
        for (let a = 0; a < 5; a++) s += `<circle cx="${(9 * Math.sin(a * 1.2566)).toFixed(1)}" cy="${(-9 * Math.cos(a * 1.2566)).toFixed(1)}" r="1.8" fill="#ffd54f"/>`;
        return s;
      }
      case 'lavender': {
        let s = `<path d="M0 22 L0 -26" stroke="#7bc67b" stroke-width="3"/>`;
        for (let i = 0; i < 7; i++) { const y = -28 + i * 8, sd = i % 2 ? 5 : -5; s += `<ellipse cx="${sd}" cy="${y}" rx="5" ry="7" fill="${i % 3 ? '#a98be0' : '#c3a8f0'}" stroke="#7e57c2" stroke-width="1" transform="rotate(${sd * 3} ${sd} ${y})"/>`; }
        return s + `<ellipse cx="0" cy="-34" rx="4" ry="6" fill="#b39ddb" stroke="#7e57c2" stroke-width="1"/>`;
      }
      case 'sunflower': {
        let s = '';
        for (let a = 0; a < 16; a++) s += `<ellipse cx="0" cy="-18" rx="5.5" ry="13" fill="#ffc928" stroke="#e59a00" stroke-width="1.2" transform="rotate(${a * 22.5})"/>`;
        s += `<circle r="13" fill="#7a4a21" stroke="#4e2c10" stroke-width="1.5"/>`;
        for (let i = 0; i < 9; i++) s += `<circle cx="${(Math.cos(i * 2.4) * (i * 1.3)).toFixed(1)}" cy="${(Math.sin(i * 2.4) * (i * 1.3)).toFixed(1)}" r="1.4" fill="#c58a4a"/>`;
        return s;
      }
    }
  }

  function renderBouquet() {
    let s = `<svg viewBox="0 0 300 340" role="img" aria-label="Your bouquet"><defs><linearGradient id="bqPaper" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#ffe3ef"/><stop offset="1" stop-color="#ffb3cf"/></linearGradient></defs>
      <ellipse cx="118" cy="188" rx="16" ry="7" fill="#7bc67b" transform="rotate(-25 118 188)"/><ellipse cx="182" cy="188" rx="16" ry="7" fill="#7bc67b" transform="rotate(25 182 188)"/><ellipse cx="150" cy="176" rx="7" ry="17" fill="#6ab86a"/>`;
    const placed = chosen.map((fi, k) => ({ f: FLOWERS[fi], x: SLOTS[k][0], y: SLOTS[k][1], k }));
    placed.forEach(p => {
      const cx = (150 + p.x) / 2, t = .75;
      const lx = (1-t)*(1-t)*150 + 2*(1-t)*t*cx + t*t*p.x, ly = (1-t)*(1-t)*300 + 2*(1-t)*t*230 + t*t*(p.y + 22);
      s += `<path d="M150 300 Q${cx} 230 ${p.x} ${p.y + 22}" fill="none" stroke="#5fae5f" stroke-width="5" stroke-linecap="round"/>
            <ellipse cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" rx="15" ry="6" fill="#7bc67b" stroke="#4f9a4f" stroke-width="1" transform="rotate(${p.x < 150 ? -35 : 35} ${lx.toFixed(1)} ${ly.toFixed(1)})"/>`;
    });
    [...placed].sort((a, b) => a.y - b.y).forEach(p => {
      s += `<g transform="translate(${p.x} ${p.y})"><g class="${p.k === lastAdded ? 'bq-in' : ''}">${flowerHead(p.f)}</g></g>`;
    });
    s += `<path d="M52 200 Q150 188 248 200 L172 334 Q150 342 128 334 Z" fill="url(#bqPaper)" stroke="#f06292" stroke-width="3" stroke-linejoin="round"/>
      <path d="M52 200 L150 268 L248 200" fill="#ffd6e6" stroke="#f48fb1" stroke-width="2.5" stroke-linejoin="round"/>
      <text x="150" y="236" text-anchor="middle" font-size="22" fill="#e8407a" opacity=".7">♡ ♡ ♡</text>
      <g id="bq-ribbon" class="${shopStep === 3 ? 'on' : ''}"><path d="M98 232 Q150 262 202 232" fill="none" stroke="#e8407a" stroke-width="9" stroke-linecap="round"/>
        <g transform="translate(150 252)"><path d="M-6 8 L-22 46 M6 8 L22 46" stroke="#f06292" stroke-width="8" stroke-linecap="round"/><path d="M0 0 L-36 -22 Q-48 0 -36 22Z" fill="#e8407a" stroke="#c2185b" stroke-width="2"/><path d="M0 0 L36 -22 Q48 0 36 22Z" fill="#e8407a" stroke="#c2185b" stroke-width="2"/><circle r="9" fill="#c2185b"/></g></g>
    </svg>`;
    document.getElementById('bouquet-wrap').innerHTML = s;
    // also mirror into stage platform
    const sp = document.getElementById('stage-platform');
    if (sp) sp.innerHTML = '';
  }

  function buildShelves() {
    // Distribute 8 flowers across 3 shelves: 3 / 3 / 2
    const dist = [[0,1,2],[3,4,5],[6,7]];
    dist.forEach((group, si) => {
      const shelf = document.getElementById(['shelf-top','shelf-mid','shelf-bot'][si]);
      shelf.innerHTML = '';
      group.forEach(i => {
        const f = FLOWERS[i];
        const b = document.createElement('button');
        b.className = 'shelf-fl';
        b.innerHTML = `<svg viewBox="-34 -38 68 72">${flowerHead(f)}</svg><span>${f.n}</span>`;
        b.onclick = () => addFlower(i, b);
        shelf.appendChild(b);
      });
    });
  }
  function buildPicker() { buildShelves(); }

  function setShopText(eyebrow, title, text) {
    document.getElementById('shop-eyebrow').textContent = eyebrow;
    document.getElementById('shop-title').textContent = title;
    document.getElementById('shop-text').textContent = text;
  }

  function updateShop() {
    const n = chosen.length, shop = document.getElementById('shop');
    shop.dataset.step = shopStep;
    const downloadButton = document.getElementById('shop-download');
    if (downloadButton) {
      const showDownload = shopStep === 3;
      downloadButton.hidden = !showDownload;
      // Inline display keeps the wrapped-state control visible even if an older
      // stylesheet is cached and does not include the download-button selector.
      downloadButton.style.display = showDownload ? 'inline-flex' : 'none';
    }
    document.getElementById('shop-count').textContent = shopStep === 3
      ? 'Your bouquet is ready 💐'
      : n >= MAX_FLOWERS
        ? 'Your bouquet is full 💐'
        : n < MIN_FLOWERS
          ? `${n} of ${MAX_FLOWERS} • pick at least ${MIN_FLOWERS} flowers 🌸`
          : `${n} of ${MAX_FLOWERS} • ready when you are 💗`;
    document.getElementById('shop-action').disabled = shopStep === 1 && n < MIN_FLOWERS;
  }

  function enterShop() {
    shopStep = 1;
    setShopText('Pick Flowers ♡', 'Choose your favourites', 'Tap flowers to add them to your bouquet.');
    renderBouquet(); updateShop(); burstFlowers();
  }
  function addFlower(i, btn) {
    if (shopStep !== 1) return;
    if (chosen.length >= MAX_FLOWERS) { btn.classList.remove('full'); void btn.offsetWidth; btn.classList.add('full'); return; }
    chosen.push(i); lastAdded = chosen.length - 1;
    renderBouquet(); updateShop();
  }
  function clearBouquet() { chosen.length = 0; lastAdded = -1; renderBouquet(); updateShop(); }
  function shopAction() {
    if (shopStep === 1) {
      shopStep = 3;
      setShopText('Your bouquet is ready', "It's as lovely as you ♡", 'Now close your eyes and make a wish...');
      const a = document.getElementById('shop-action');
      a.textContent = 'Make a Wish ♡'; a.disabled = false;
      renderBouquet(); updateShop(); burstFlowers();
    } else {
      showScene(6);
    }
  }

  async function downloadBouquet() {
    if (shopStep !== 3) return;

    const button = document.getElementById('shop-download');
    const count = document.getElementById('shop-count');
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'Preparing…';
    count.textContent = 'Creating your bouquet picture…';

    let svgUrl;
    let pngUrl;
    try {
      // Use load events instead of Image.decode(), which is unreliable for SVG
      // blob images in some mobile browsers.
      const loadImage = (src) => new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Could not load image: ${src}`));
        image.src = src;
        if (image.complete && image.naturalWidth > 0) resolve(image);
      });

      const backgroundUrl = new URL('./assets/d.png', document.baseURI);
      const background = await loadImage(backgroundUrl.href);
      console.log('Background image:', backgroundUrl.href);
console.log('Background loaded:', background.naturalWidth, background.naturalHeight);

      const bouquetSvg = document.querySelector('#bouquet-wrap svg');
      if (!bouquetSvg) throw new Error('The finished bouquet is not available.');
      const svg = bouquetSvg.cloneNode(true);
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const svgBlob = new Blob([new XMLSerializer().serializeToString(svg)], {
        type: 'image/svg+xml;charset=utf-8'
      });
      svgUrl = URL.createObjectURL(svgBlob);
      const bouquet = await loadImage(svgUrl);

      const canvas = document.createElement('canvas');
      canvas.width = background.naturalWidth;
      canvas.height = background.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('This browser could not create an image canvas.');

      // Composite the bouquet on the shop interior's center display platform.
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      const bouquetWidth = Math.round(canvas.width * 0.29);
      const bouquetHeight = bouquetWidth * (340 / 300);
      ctx.save();
      ctx.shadowColor = 'rgba(92, 35, 67, 0.35)';
      ctx.shadowBlur = 28;
      ctx.shadowOffsetY = 12;
      ctx.drawImage(
        bouquet,
        (canvas.width - bouquetWidth) / 2,
        canvas.height * 0.24,
        bouquetWidth,
        bouquetHeight
      );
      ctx.restore();

      const pngBlob = await new Promise((resolve, reject) => {
        if (typeof canvas.toBlob !== 'function') {
          try {
            const dataUrl = canvas.toDataURL('image/png');
            const binary = atob(dataUrl.split(',')[1]);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            resolve(new Blob([bytes], { type: 'image/png' }));
          } catch (error) {
            reject(error);
          }
          return;
        }
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('The browser returned an empty PNG.'));
        }, 'image/png');
      });

      pngUrl = URL.createObjectURL(pngBlob);
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = 'my-flower-bouquet.png';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();
      count.textContent = 'Your bouquet picture has been downloaded ♡';
      // Some mobile browsers start reading the blob after the click handler returns.
      window.setTimeout(() => URL.revokeObjectURL(pngUrl), 60000);
      pngUrl = undefined;
    } catch (error) {
      console.error('Could not download the bouquet image:', error);
      const reason = error && error.message ? error.message : 'Unknown image creation error';
      count.textContent = `Could not create the bouquet image (${reason}). Check that the shop background image is available, then try again.`;
    } finally {
      if (svgUrl) URL.revokeObjectURL(svgUrl);
      if (pngUrl) URL.revokeObjectURL(pngUrl);
      button.disabled = false;
      button.textContent = originalLabel;
    }
  }

  buildPicker(); renderBouquet(); updateShop();


  /* ===== Cake -> final bouquet page ===== */
  finishBirthday = function () { showScene(7); burstFlowers(); };

  /* ===== Final bouquet: built from the flowers she picked in the shop ===== */
  const FB_SLOTS = [[200,85,1.05],[140,118,1.1],[262,118,1.1],[88,165,1.1],[200,150,1.2],[312,165,1.1],[140,200,1.15],[262,200,1.15],[62,225,1],[338,225,1],[200,232,1.1]];
  const FB_ORDER = [4,1,2,6,7,3,5,0,8,9,10];   // which slot gets the first flower, second flower...

  function kawaiiFace(f) {
    if (f.t === 'lavender') return '';
    const ink = f.t === 'sunflower' ? '#fff3d6' : '#4a2335', y = f.t === 'tulip' ? -8 : 0;
    return `<g transform="translate(0 ${y}) scale(.95)"><circle cx="-7" cy="-1" r="2.4" fill="${ink}"/><circle cx="7" cy="-1" r="2.4" fill="${ink}"/>
      <circle cx="-6.2" cy="-1.8" r=".8" fill="#fff"/><circle cx="7.8" cy="-1.8" r=".8" fill="#fff"/>
      <ellipse cx="-12" cy="4" rx="4" ry="2.6" fill="#ff7aa8" opacity=".65"/><ellipse cx="12" cy="4" rx="4" ry="2.6" fill="#ff7aa8" opacity=".65"/>
      <path d="M-3.5 3 Q0 7.5 3.5 3" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round"/></g>`;
  }

  function wiggleFlower(el) { el.classList.remove('wig'); void el.getBoundingClientRect(); el.classList.add('wig'); burstFlowers(); }

  function renderFinalBouquet() {
    const list = chosen.length ? chosen : [0, 2, 3, 4, 7, 6, 1];
    let s = `<svg viewBox="0 0 400 460" role="img" aria-label="A beautiful bouquet of flowers"><defs>
      <radialGradient id="fbGlow"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#ffd6ea" stop-opacity="0"/></radialGradient>
      <linearGradient id="fbLeaf" x1="0" x2="1"><stop offset="0" stop-color="#6fc36f"/><stop offset="1" stop-color="#3f9a55"/></linearGradient>
      <linearGradient id="fbPaper" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#ffe6f0"/><stop offset="1" stop-color="#ffaccb"/></linearGradient>
      <linearGradient id="fbPaper2" x1="0" x2="1"><stop offset="0" stop-color="#efe2ff"/><stop offset="1" stop-color="#d4b8f5"/></linearGradient></defs>
      <circle cx="200" cy="170" r="215" fill="url(#fbGlow)"/>`;
    // leaves fanning out behind
    [-64,-48,-32,-16,0,16,32,48,64].forEach((a, i) => {
      s += `<g class="fb-in" style="--d:${(i * .05).toFixed(2)}s"><g transform="rotate(${a} 200 330)"><ellipse cx="200" cy="${i % 2 ? 205 : 190}" rx="25" ry="${i % 2 ? 100 : 118}" fill="url(#fbLeaf)" stroke="#357f48" stroke-width="2"/><path d="M200 ${i % 2 ? 300 : 306} L200 ${i % 2 ? 110 : 84}" stroke="#2f7a44" stroke-width="2" opacity=".55"/></g></g>`;
    });
    // baby's breath
    [[108,128],[292,128],[168,70],[236,72],[60,190],[340,190],[104,95],[296,96],[172,200],[230,196]].forEach(([x, y], i) => {
      s += `<g class="fb-in" style="--d:${(.3 + i * .04).toFixed(2)}s"><path d="M200 330 Q${(200 + x) / 2} ${(330 + y) / 2 - 20} ${x} ${y}" stroke="#78c27e" stroke-width="2" fill="none"/>`;
      [[0,0],[-6,-5],[6,-5],[0,-9],[-5,4],[6,3]].forEach(([dx, dy]) => s += `<circle cx="${x + dx}" cy="${y + dy}" r="3.6" fill="#fff" stroke="#f6c3d8" stroke-width=".8"/>`);
      s += `</g>`;
    });
    s += `<path d="M24 222 Q200 262 376 222 L252 412 Q200 424 148 412Z" fill="url(#fbPaper2)" stroke="#b995e6" stroke-width="3" stroke-linejoin="round"/>`;
    // flowers, back row first
    const heads = FB_ORDER.map((slot, n) => ({ f: FLOWERS[list[n % list.length]], slot: FB_SLOTS[slot], n }));
    heads.sort((a, b) => a.slot[1] - b.slot[1]).forEach((h, k) => {
      const [x, y, sc] = h.slot;
      s += `<g transform="translate(${x} ${y}) scale(${sc})"><g class="fb-in" style="--d:${(.45 + k * .1).toFixed(2)}s"><g class="fb-head-flower" onclick="wiggleFlower(this)">${flowerHead(h.f)}${kawaiiFace(h.f)}</g></g></g>`;
    });
    // wrapping paper, ribbon, bow, tag
    s += `<path d="M46 262 Q200 244 354 262 L246 438 Q200 450 154 438Z" fill="url(#fbPaper)" stroke="#f06292" stroke-width="3" stroke-linejoin="round"/>
      <path d="M46 262 L200 362 L354 262" fill="#ffdbe9" stroke="#f48fb1" stroke-width="2.5" stroke-linejoin="round"/>`;
    for (let x = 58; x <= 346; x += 22) s += `<circle cx="${x}" cy="${(253 + Math.pow((x - 200) / 154, 2) * 9 - 2).toFixed(1)}" r="11" fill="#ffe3ee" stroke="#f48fb1" stroke-width="1.6"/>`;
    s += `<text x="200" y="408" text-anchor="middle" font-size="19" fill="#e8407a" opacity=".75">♡ ♡ ♡</text>
      <path d="M70 302 Q200 342 330 302" fill="none" stroke="#ff5c9a" stroke-width="15" stroke-linecap="round"/>
      <path d="M70 302 Q200 342 330 302" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="5 7" stroke-linecap="round"/>
      <g class="fb-in" style="--d:1.5s">
        <path d="M196 326 Q170 380 150 412 L176 405 L190 422 Q200 374 206 330Z" fill="#ff7fb0" stroke="#d81b60" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M204 326 Q230 380 250 412 L224 405 L210 422 Q200 374 194 330Z" fill="#ff7fb0" stroke="#d81b60" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M200 318 C150 266 94 288 112 326 C120 348 170 342 200 318Z" fill="#ff5c9a" stroke="#d81b60" stroke-width="2.5"/>
        <path d="M200 318 C250 266 306 288 288 326 C280 348 230 342 200 318Z" fill="#ff5c9a" stroke="#d81b60" stroke-width="2.5"/>
        <path d="M184 312 C158 290 128 296 124 312" fill="none" stroke="#ffb3d1" stroke-width="5" stroke-linecap="round"/>
        <path d="M216 312 C242 290 272 296 276 312" fill="none" stroke="#ffb3d1" stroke-width="5" stroke-linecap="round"/>
        <circle cx="200" cy="320" r="14" fill="#ff3d85" stroke="#c2185b" stroke-width="2.5"/>
        <text x="200" y="326" text-anchor="middle" font-size="15" fill="#fff">♥</text></g>
      <g class="fb-in" style="--d:1.7s"><path d="M214 334 Q262 346 296 384" fill="none" stroke="#d81b60" stroke-width="2"/>
        <g transform="translate(300 388) rotate(12)"><rect x="-38" y="-4" width="76" height="48" rx="9" fill="#fffdf5" stroke="#f48fb1" stroke-width="2.5"/><circle cx="0" cy="3" r="3" fill="#ffd0e0" stroke="#f48fb1"/>
          <text x="0" y="22" text-anchor="middle" font-family="Dancing Script, cursive" font-weight="700" font-size="15" fill="#e0457b">Happy</text>
          <text x="0" y="38" text-anchor="middle" font-family="Dancing Script, cursive" font-weight="700" font-size="14" fill="#e0457b">Birthday ♡</text></g></g>
    </svg>`;
    document.getElementById('fb-bouquet').innerHTML = s;
  }

  /* floating hearts, sparkles & butterflies on the final page */
  (function () {
    const layer = document.getElementById('fb-magic'), set = ['💗', '✨', '🌸', '🦋', '💖', '🌷', '✨', '🦋'];
    for (let i = 0; i < 20; i++) {
      const e = document.createElement('span');
      e.textContent = set[i % set.length];
      e.style.left = (3 + Math.random() * 94) + '%';
      e.style.fontSize = (16 + Math.random() * 22) + 'px';
      e.style.animationDuration = (9 + Math.random() * 9) + 's';
      e.style.animationDelay = (-Math.random() * 14) + 's';
      layer.appendChild(e);
    }
  })();
  renderFinalBouquet();
