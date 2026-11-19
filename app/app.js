// Leonida Legend — offline trophy tracker: saved checklist, filters, spoiler hiding, export/import.
const EARNED_KEY = 'gta6-leonida-earned';
const SPOILER_KEY = 'gta6-leonida-spoiler';
const params = new URLSearchParams(location.search);
const doc = await (await fetch('data/trophies.json')).json();
const sourceUrls = new Map((doc.sources || []).map((s) => [s.name, s.url || '']));

const list = document.getElementById('list');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kind');
const gradeEl = document.getElementById('grade');
const spoilerEl = document.getElementById('spoiler');
const earnedOnlyEl = document.getElementById('earnedOnly');

let earned = new Set(JSON.parse(localStorage.getItem(EARNED_KEY) ?? '[]'));
// Shareable progress link: ?earned=2,3,7 ticks those trophies on load and saves them.
if (params.get('earned')) {
  for (const id of params.get('earned').split(',')) {
    const t = doc.trophies.find((x) => String(x.id) === id.trim());
    if (t) earned.add(t.name);
  }
}
let spoiler = params.get('spoiler') === 'off' ? false : params.get('spoiler') === 'on' ? true : (localStorage.getItem(SPOILER_KEY) ?? 'on') === 'on';
spoilerEl.checked = spoiler;
if (params.get('kind')) kindEl.value = params.get('kind');
if (params.get('grade')) gradeEl.value = params.get('grade');
if (params.get('search')) searchEl.value = params.get('search');

function save() {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned]));
  localStorage.setItem(SPOILER_KEY, spoiler ? 'on' : 'off');
}

function el(tag, text, cls) {
  const n = document.createElement(tag);
  if (text != null) n.textContent = text;
  if (cls) n.className = cls;
  return n;
}

function render() {
  save();
  const q = searchEl.value.trim().toLowerCase();
  const kind = kindEl.value;
  const grade = gradeEl.value;
  const shown = doc.trophies.filter((t) => {
    if (grade !== 'all' && t.grade !== grade) return false;
    if (kind === 'online') return false;
    if (kind === 'missable' && !t.missable) return false;
    if (kind !== 'all' && kind !== 'missable' && !t.kinds.includes(kind)) return false;
    if (earnedOnlyEl.checked && !earned.has(t.name)) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.guide.toLowerCase().includes(q))) return false;
    return true;
  });
  list.replaceChildren();
  for (const t of shown) {
    const isEarned = earned.has(t.name);
    const hidden = spoiler && t.hidden && !isEarned;
    const card = el('article', null, 'card' + (isEarned ? ' earned' : ''));
    card.id = 'trophy-' + t.id;
    const top = el('div', null, 'card-top');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned;
    box.setAttribute('aria-label', 'Earned: ' + t.name);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name); else earned.delete(t.name);
      render();
    });
    const head = el('div');
    const h = el('h3', hidden ? 'Hidden trophy' : t.name);
    const badge = el('span', t.grade, 'badge ' + t.grade);
    h.append(badge);
    head.append(h, el('p', hidden ? 'Earn this trophy to reveal its name and description.' : t.description, 'desc'));
    top.append(box, head);
    card.append(top);
    for (const k of t.kinds) card.append(el('span', k, 'tag'));
    if (t.missable) card.append(el('span', 'MISSABLE — do not miss', 'tag missable'));
    if (t.count) card.append(el('span', 'Count: ' + t.count, 'tag'));
    if (hidden) {
      card.append(el('p', 'Spoiler hidden until earned. Turn off “Hide story spoilers until earned” to reveal it.', 'hidden-note'));
    } else {
      const guide = el('p', null, 'guide');
      // The guide text names its sources in the data; the linked Sources line below shows them,
      // so the trailing "Sources: ..." sentence is dropped from the displayed guide to avoid repeating it.
      const text = t.guide.replace(/^METHOD UNCONFIRMED: /, '').replace(/\sSources: [A-Za-z, ]+\.$/, '');
      if (t.guide.startsWith('METHOD UNCONFIRMED')) {
        guide.append(el('strong', 'Method unconfirmed — '));
        guide.append(document.createTextNode(text));
      } else {
        guide.textContent = text;
      }
      card.append(guide);
      const src = el('p', null, 'sources');
      src.append(document.createTextNode('Sources: '));
      (t.sources || []).forEach((name, i) => {
        if (i) src.append(document.createTextNode(' · '));
        const url = sourceUrls.get(name);
        if (url) {
          const a = document.createElement('a');
          a.href = url; a.textContent = name; a.target = '_blank'; a.rel = 'noopener';
          src.append(a);
        } else {
          src.append(document.createTextNode(name));
        }
      });
      card.append(src);
    }
    if (t.chapter) card.append(el('p', 'Story — Chapter ' + t.chapter + (t.mission ? ' · ' + t.mission : ''), 'meta'));
    list.append(card);
  }
  const total = doc.trophies.length;
  const pct = Math.round((earned.size / total) * 100);
  document.getElementById('bar').style.width = pct + '%';
  document.getElementById('progress').textContent = earned.size + ' of ' + total + ' earned · ' + pct + '%';
  const byGrade = {};
  for (const t of doc.trophies) byGrade[t.grade] = (byGrade[t.grade] || 0) + 1;
  document.getElementById('counts').textContent =
    '1 Platinum · 2 Gold · 6 Silver · 46 Bronze · 27 visible · 28 hidden · 0 online';
  document.getElementById('showing').textContent = 'Showing ' + shown.length + ' of ' + total + ' trophies'
    + (kind === 'online' ? ' — the game has no online trophies.' : '')
    + (spoiler ? ' · Spoilers hidden until earned.' : '');
  document.getElementById('empty').hidden = shown.length !== 0;
  if (params.get('open')) {
    const target = document.getElementById('trophy-' + params.get('open'));
    if (target) target.scrollIntoView({ block: 'center' });
  }
}

document.getElementById('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned] }, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned || [];
    const known = new Set(doc.trophies.map((t) => t.name));
    earned = new Set(names.filter((n) => known.has(n)));
    render();
  } catch {
    alert('That file is not a valid progress export.');
  }
  e.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Clear all earned trophies?')) { earned = new Set(); render(); }
});
spoilerEl.addEventListener('change', () => { spoiler = spoilerEl.checked; render(); });
for (const input of [searchEl, kindEl, gradeEl, earnedOnlyEl]) input.addEventListener('input', render);
render();
