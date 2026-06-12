
function renderLucideIcons() {
  const icons = {
    'shield-alert': '<svg data-lucide="shield-alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
    'crown': '<svg data-lucide="crown" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 5 12 5-9 5 9 5-12"/><path d="M5 20h14"/></svg>',
    'trending-up': '<svg data-lucide="trending-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/></svg>',
    'trending-down': '<svg data-lucide="trending-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17 13.5 8.5 8.5 13.5 2 7"/><path d="M16 17h6v-6"/></svg>',
    'shield': '<svg data-lucide="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z"/></svg>',
    'zap': '<svg data-lucide="zap" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>'
  };
  document.querySelectorAll('[data-lucide]').forEach(node => {
    const name = node.getAttribute('data-lucide');
    if (!icons[name]) return;
    const span = document.createElement('span');
    span.innerHTML = icons[name];
    const svg = span.firstElementChild;
    svg.setAttribute('class', node.getAttribute('class') || '');
    node.replaceWith(svg);
  });
}

// Track state for the sandbox layout selector
        let activePersonnel = '12';

        function updatePersonnelSimulator(personnelType) {
            activePersonnel = personnelType;
            
            const buttons = ['11', '12', '13'];
            buttons.forEach(btn => {
                const element = document.getElementById(`btn-pers-${btn}`);
                if (!element) return;
                if (btn === personnelType) {
                    element.classList.remove('bg-white/5', 'text-gray-400', 'border-white/10');
                    element.classList.add('bg-brandGold/20', 'text-brandGold', 'border-brandGold/40');
                } else {
                    element.classList.remove('bg-brandGold/20', 'text-brandGold', 'border-brandGold/40');
                    element.classList.add('bg-white/5', 'text-gray-400', 'border-white/10');
                }
            });

            const fieldGrid = document.getElementById('tactical-field-grid');
            const formulaText = document.getElementById('shift-formula-display');
            const rbStat = document.getElementById('sim-stat-rb');
            const wrStat = document.getElementById('sim-stat-wr');
            const teStat = document.getElementById('sim-stat-te');
            const qbStat = document.getElementById('sim-stat-qb');
            if (!fieldGrid || !formulaText || !rbStat || !wrStat || !teStat || !qbStat) return;

            // Shared Linemen Base Setup for football realism
            const linemenHTML = `
                <!-- Linemen (Dimmed Context Markers as Requested) -->
                <div class="absolute bottom-[44%] left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 sm:gap-2 z-0">
                    <div class="w-6 h-6 rounded-full border border-white/5 bg-white/[0.01] text-[8px] font-mono flex items-center justify-center text-gray-600 cursor-default select-none" title="Left Tackle (LT)">LT</div>
                    <div class="w-6 h-6 rounded-full border border-white/5 bg-white/[0.01] text-[8px] font-mono flex items-center justify-center text-gray-600 cursor-default select-none" title="Left Guard (LG)">LG</div>
                    <div class="w-6 h-6 rounded-full border border-white/10 bg-white/[0.03] text-[8px] font-mono flex items-center justify-center text-gray-500 cursor-default select-none font-bold" title="Center (C)">C</div>
                    <div class="w-6 h-6 rounded-full border border-white/5 bg-white/[0.01] text-[8px] font-mono flex items-center justify-center text-gray-600 cursor-default select-none" title="Right Guard (RG)">RG</div>
                    <div class="w-6 h-6 rounded-full border border-white/5 bg-white/[0.01] text-[8px] font-mono flex items-center justify-center text-gray-600 cursor-default select-none" title="Right Tackle (RT)">RT</div>
                </div>
                <!-- Line of Scrimmage Line -->
                <div class="absolute bottom-[44%] left-0 right-0 h-[1px] border-t border-dashed border-emerald-500/10 pointer-events-none"></div>
            `;

            let playersHTML = linemenHTML;
            
            if (personnelType === '11') {
                playersHTML += `
                    <!-- QB - Shotgun Alignment -->
                    <div class="absolute bottom-[24%] left-[50%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-blue-500 border border-blue-400 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">QB</div>
                        <span class="text-[8px] text-gray-400 font-mono">Shotgun</span>
                    </div>
                    <!-- RB - Offset Left in Shotgun -->
                    <div class="absolute bottom-[24%] left-[42%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-brandGold border border-brandGold/80 flex items-center justify-center text-[10px] font-bold text-black shadow-md">RB</div>
                        <span class="text-[8px] text-brandGold/80 font-semibold font-mono">Offset RB</span>
                    </div>
                    <!-- TE - Inline Right of RT -->
                    <div class="absolute bottom-[44%] left-[68%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-indigo-500 border border-indigo-400 flex items-center justify-center text-[10px] font-bold text-white shadow-md">TE</div>
                        <span class="text-[8px] text-indigo-300 font-mono">Y-Inline</span>
                    </div>
                    <!-- WR1 (X) - Split End (Wide Left Boundary on LOS) -->
                    <div class="absolute bottom-[44%] left-[12%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-red-500 border border-red-400 flex items-center justify-center text-[10px] font-bold text-white shadow-md">WR1</div>
                        <span class="text-[8px] text-red-300 font-mono">Split End</span>
                    </div>
                    <!-- WR2 (Z) - Flanker (Wide Right Boundary off LOS) -->
                    <div class="absolute bottom-[40%] left-[88%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-red-500 border border-red-400 flex items-center justify-center text-[10px] font-bold text-white shadow-md">WR2</div>
                        <span class="text-[8px] text-red-300 font-mono">Flanker</span>
                    </div>
                    <!-- WR3 (Slot) - Slot Left (Positioned in the Seam) -->
                    <div class="absolute bottom-[40%] left-[26%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-red-400 border border-red-300 flex items-center justify-center text-[10px] font-bold text-white shadow-md animate-pulse">WR3</div>
                        <span class="text-[8px] text-red-400 font-semibold font-mono">Slot Left</span>
                    </div>
                `;
                formulaText.innerHTML = `<span class="text-brandGold font-bold">11 Personnel Layout (1 RB, 1 TE, 3 WR)</span>: Highly spread targets, squeezed run surface. Historically favored defensive nickel alignments.`;
                rbStat.innerHTML = '<span class="text-gray-500">RB opportunity:</span> <span class="text-amber-500/80 font-semibold">Volume compromised</span>';
                wrStat.innerHTML = '<span class="text-gray-500">WR opportunity:</span> <span class="text-emerald-400 font-bold">Max Route Availability (3 WR)</span>';
                teStat.innerHTML = '<span class="text-gray-500">TE role:</span> <span class="text-gray-400">Receiving focused</span>';
                qbStat.innerHTML = '<span class="text-gray-500">QB protection:</span> <span class="text-red-400 font-semibold">Vulnerable pocket</span>';

            } else if (personnelType === '12') {
                playersHTML += `
                    <!-- QB - Under Center -->
                    <div class="absolute bottom-[35%] left-[50%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-blue-500 border border-blue-400 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">QB</div>
                        <span class="text-[8px] text-gray-400 font-mono">Under C</span>
                    </div>
                    <!-- RB - Deep Singleback Alignment -->
                    <div class="absolute bottom-[14%] left-[50%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-brandGold border border-brandGold flex items-center justify-center text-[10px] font-bold text-black animate-pulse shadow-md shadow-brandGold/20">RB</div>
                        <span class="text-[8px] text-brandGold font-semibold font-mono">Deep Workhorse</span>
                    </div>
                    <!-- TE1 - Inline Right of RT -->
                    <div class="absolute bottom-[44%] left-[68%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-indigo-500 border border-indigo-400 flex items-center justify-center text-[10px] font-bold text-white shadow-md">TE1</div>
                        <span class="text-[8px] text-indigo-300 font-mono">Y-Inline</span>
                    </div>
                    <!-- TE2 - Inline Left of LT -->
                    <div class="absolute bottom-[44%] left-[32%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-indigo-500 border border-indigo-400 flex items-center justify-center text-[10px] font-bold text-white shadow-md">TE2</div>
                        <span class="text-[8px] text-indigo-300 font-mono">H-Inline</span>
                    </div>
                    <!-- WR1 (X) - Wide Left Boundary on LOS -->
                    <div class="absolute bottom-[44%] left-[12%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-red-500 border border-red-400 flex items-center justify-center text-[10px] font-bold text-white shadow-md">WR1</div>
                        <span class="text-[8px] text-red-300 font-mono">Split End</span>
                    </div>
                    <!-- WR2 (Z) - Wide Right Boundary off LOS -->
                    <div class="absolute bottom-[40%] left-[88%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-red-500 border border-red-400 flex items-center justify-center text-[10px] font-bold text-white shadow-md">WR2</div>
                        <span class="text-[8px] text-red-300 font-mono">Flanker</span>
                    </div>
                `;
                formulaText.innerHTML = `<span class="text-indigo-400 font-bold">12 Personnel Layout (1 RB, 2 TE, 2 WR)</span>: Extra blocking surface created. Defense is punished for staying light. WR3 is entirely benched.`;
                rbStat.innerHTML = '<span class="text-gray-500">RB opportunity:</span> <span class="text-emerald-400 font-bold">Volume & Route Expansion ↑</span>';
                wrStat.innerHTML = '<span class="text-gray-500">WR opportunity:</span> <span class="text-red-400 font-semibold">WR3 Route Compressed ↓</span>';
                teStat.innerHTML = '<span class="text-gray-500">TE role:</span> <span class="text-indigo-400">Two On-Field TEs</span>';
                qbStat.innerHTML = '<span class="text-gray-500">QB protection:</span> <span class="text-emerald-400 font-medium">Extra inline protection ↗</span>';

            } else if (personnelType === '13') {
                playersHTML += `
                    <!-- QB - Under Center -->
                    <div class="absolute bottom-[35%] left-[50%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-blue-500 border border-blue-400 flex items-center justify-center text-[10px] font-bold text-white">QB</div>
                        <span class="text-[8px] text-gray-400 font-mono">Under C</span>
                    </div>
                    <!-- RB - Deep Singleback Power Alignment -->
                    <div class="absolute bottom-[14%] left-[50%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-brandGold border border-brandGold flex items-center justify-center text-[10px] font-bold text-black shadow-lg shadow-brandGold/40 animate-bounce">RB</div>
                        <span class="text-[8px] text-brandGold font-bold font-mono">Power Back</span>
                    </div>
                    <!-- TE1 - Inline Right of RT -->
                    <div class="absolute bottom-[44%] left-[68%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-indigo-500 border border-indigo-400 flex items-center justify-center text-[10px] font-bold text-white shadow-md">TE1</div>
                        <span class="text-[8px] text-indigo-300 font-mono">Y-Inline</span>
                    </div>
                    <!-- TE2 - Wing Right (Forming the ultimate blocking wall) -->
                    <div class="absolute bottom-[38%] left-[74%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-indigo-500 border border-indigo-400 flex items-center justify-center text-[10px] font-bold text-white shadow-md">TE2</div>
                        <span class="text-[8px] text-indigo-300 font-mono">Wing Right</span>
                    </div>
                    <!-- TE3 - Inline Left of LT -->
                    <div class="absolute bottom-[44%] left-[32%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-indigo-500 border border-indigo-400 flex items-center justify-center text-[10px] font-bold text-white shadow-md">TE3</div>
                        <span class="text-[8px] text-indigo-300 font-mono">Inline Left</span>
                    </div>
                    <!-- WR1 (X) - Isolated Wide Left Boundary (X) -->
                    <div class="absolute bottom-[44%] left-[12%] -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                        <div class="w-7 h-7 rounded-full bg-red-500 border border-red-400 flex items-center justify-center text-[10px] font-bold text-white shadow-md">WR1</div>
                        <span class="text-[8px] text-red-300 font-mono">Isolated X</span>
                    </div>
                `;
                formulaText.innerHTML = `<span class="text-brandRed font-bold">13 Personnel Layout (1 RB, 3 TE, 1 WR)</span>: Maximum physical blocking structure. Destroys light defensive sets. Complete wide receiver depth eradication.`;
                rbStat.innerHTML = '<span class="text-gray-500">RB opportunity:</span> <span class="text-emerald-400 font-bold">Peak Leverage & Spacing ↑↑</span>';
                wrStat.innerHTML = '<span class="text-gray-500">WR opportunity:</span> <span class="text-red-500 font-bold">WR2 & WR3 Benched ↓↓</span>';
                teStat.innerHTML = '<span class="text-gray-500">TE role:</span> <span class="text-indigo-400">Triple Snap Expansion</span>';
                qbStat.innerHTML = '<span class="text-gray-500">QB protection:</span> <span class="text-emerald-400 font-medium">Secure Pocket, Low Volume</span>';
            }

            fieldGrid.innerHTML = playersHTML;
        }

        document.addEventListener('DOMContentLoaded', function() {
            renderLucideIcons();
            if (document.getElementById('tactical-field-grid')) updatePersonnelSimulator('12');
        });


let PLAYER_ROWS = [];
const CSV_FILE = 'POS-DIST_2007-2025.csv';

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"') {
      if (inQuotes && next === '"') { value += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(value); value = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i++;
      row.push(value); value = '';
      if (row.some(cell => String(cell).trim() !== '')) rows.push(row);
      row = [];
    } else {
      value += char;
    }
  }
  if (value.length || row.length) {
    row.push(value);
    if (row.some(cell => String(cell).trim() !== '')) rows.push(row);
  }
  return rows;
}

function numberValue(v) {
  const n = Number(String(v ?? '').replace(/,/g,'').trim());
  return Number.isFinite(n) ? n : null;
}

async function loadPlayerRowsFromCSV() {
  const response = await fetch(CSV_FILE, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Could not load ${CSV_FILE}: ${response.status}`);
  const text = await response.text();
  const rows = parseCSV(text);
  if (!rows.length) throw new Error('CSV is empty.');
  const header = rows[0].map(h => String(h).trim());
  const idx = Object.fromEntries(header.map((h,i)=>[h,i]));
  const required = ['YEAR','Player','POS','FPTS RK','FPTS'];
  const missing = required.filter(col => !(col in idx));
  if (missing.length) throw new Error(`CSV missing required columns: ${missing.join(', ')}`);
  return rows.slice(1).map(r => ({
    year: numberValue(r[idx.YEAR]),
    player: String(r[idx.Player] ?? '').trim(),
    pos: String(r[idx.POS] ?? '').trim().toUpperCase(),
    rank: numberValue(r[idx['FPTS RK']]),
    fpts: numberValue(r[idx.FPTS])
  })).filter(r => r.year && r.pos && Number.isFinite(r.rank));
}

async function bootDistributionApp() {
  try {
    PLAYER_ROWS = await loadPlayerRowsFromCSV();
    POS_DATA = computeCounts();
    renderAll();
  } catch (error) {
    console.error(error);
    const msg = `<div style="border:1px solid rgba(239,68,68,.35);background:rgba(239,68,68,.08);color:#fecaca;border-radius:18px;padding:18px;font-weight:800;line-height:1.5">Failed to load CSV: ${error.message}<br><span style="color:#a1a1aa;font-weight:700">Run this folder through a local server so the browser can fetch ${CSV_FILE}.</span></div>`;
    ['globalChart','miniYearGrid','g1LineChart','comboG1G2','g2ThreeLines'].forEach(id => { const node = document.getElementById(id); if (node) node.innerHTML = msg; });
  }
}

document.addEventListener('DOMContentLoaded', bootDistributionApp);

const YEARS = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const POSITIONS = ['QB','RB','WR','TE'];
const RANGE_OPTIONS = ['Top 6','Top 12','Top 24','Top 36','Top 48','Top 60'];
const RANGE_OPTIONS_WIDE_FIRST = ['Top 60','Top 48','Top 36','Top 24'];
const CUTS = {'Top 6':6,'Top 12':12,'Top 24':24,'Top 36':36,'Top 48':48,'Top 60':60};
const POS_CONFIG = {
  QB: {low:'#ff9a3d', mid:'#ff6d62', high:'#ff4187'},
  RB: {low:'#1ac2ff', mid:'#10e7cb', high:'#06ff97'},
  WR: {low:'#8153ff', mid:'#4276ff', high:'#0299fe'},
  TE: {low:'#ff6bc8', mid:'#bf4be4', high:'#7f2fff'}
};
const RANGE_COLORS = {'12':{RB:'#00ad87',WR:'#0467c1'},'36':{RB:'#00ffc6',WR:'#2c9cff'},'60':{RB:'#6afff6',WR:'#6ab7fc'}};
const state = {range:'Top 60', activePositions:['QB','RB','WR','TE'], mode:'single'};
const tip = document.getElementById('tip');
function byId(id) { return document.getElementById(id); }
function showTip(evt, html) { tip.innerHTML=html; tip.style.opacity=1; tip.style.left=evt.clientX+'px'; tip.style.top=(evt.clientY-12)+'px'; }
function hideTip() { tip.style.opacity=0; }
function fmt(v,d=1) { return Number(v).toFixed(d); }
function fmtDelta(v) { return v>0?`+${v}`:v<0?`${v}`:'±0'; }
function mean(arr) { return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0; }
function stdDev(arr) { const m=mean(arr); return Math.sqrt(mean(arr.map(v=>(v-m)**2))); }
function sanitizeCount(v) { const n=Number(v); return Number.isFinite(n) ? Math.max(0,n) : 0; }
function topRowsForYear(year, cut) {
  return PLAYER_ROWS.filter(r=>r.year===year).sort((a,b)=>a.rank-b.rank || b.fpts-a.fpts || String(a.player).localeCompare(String(b.player))).slice(0,cut);
}
function computeCounts() {
  const data = {};
  for (const range of RANGE_OPTIONS) {
    data[range] = {QB:[],RB:[],WR:[],TE:[]};
    const cut = CUTS[range];
    for (const year of YEARS) {
      const rows = topRowsForYear(year, cut);
      for (const pos of POSITIONS) data[range][pos].push(rows.filter(r=>r.pos===pos).length);
    }
  }
  return data;
}
let POS_DATA = {};
function getValues(range,pos) { return POS_DATA[range][pos].map(sanitizeCount); }
function rangeSize(range) { return CUTS[range]; }
function rankHighToLow(current, values) { return 1 + values.filter(v=>v>current).length; }
function yearsMatching(values,target) { return YEARS.filter((_,i)=>values[i]===target).join(', '); }
function getTiers(values) { const sorted=values.map((value,index)=>({value,index})).sort((a,b)=>a.value-b.value||a.index-b.index); const tiers=Array(values.length).fill('high'); sorted.forEach((item,i)=>{ tiers[item.index]=i<6?'low':i<12?'mid':'high'; }); return tiers; }
function getPositionStats(range,pos) { const values=getValues(range,pos), current=values.at(-1), previous=values.at(-2), avg=mean(values), min=Math.min(...values), max=Math.max(...values); return {pos,values,current,previous,changeFromPrevious:current-previous,avg,min,max,bestYears:yearsMatching(values,max),worstYears:yearsMatching(values,min),std:stdDev(values),spread:max-min,rank:rankHighToLow(current,values),recent3Avg:mean(values.slice(-3)),vsAverage:current-avg,vsPeak:current-max,vsFloor:current-min}; }
function getRangeSummary(range) {
  const stats=Object.fromEntries(POSITIONS.map(pos=>[pos,getPositionStats(range,pos)]));
  const current=Object.fromEntries(POSITIONS.map(pos=>[pos,stats[pos].current]));
  const leader=POSITIONS.map(pos=>({pos,value:current[pos]})).sort((a,b)=>b.value-a.value)[0];
  const rb=getValues(range,'RB'), wr=getValues(range,'WR');
  const firstRbOverWrIndex=YEARS.findIndex((_,i)=>rb[i]>wr[i]);
  const wrThreeYear=wr.slice(2).map((value,i)=>({from:YEARS[i],year:YEARS[i+2],change:value-wr[i]}));
  const wrWorstThreeYear=[...wrThreeYear].sort((a,b)=>a.change-b.change)[0];
  const wr2325=wr.at(-1)-wr[YEARS.indexOf(2023)];
  return {range,size:rangeSize(range),stats,current,leader,rbWrDiff:current.RB-current.WR,firstRbOverWr:firstRbOverWrIndex>=0?YEARS[firstRbOverWrIndex]:null,wr2325,wr2325IsWorst:wrWorstThreeYear?.from===2023 && wrWorstThreeYear?.year===2025,rbMax:Math.max(...rb),wrMin:Math.min(...wr)};
}
function pathFromPoints(points) { return points.map((p,i)=>(i?'L':'M')+' '+p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' '); }
function smoothPath(points, smoothing=.18) { if(!points.length)return''; let d=`M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`; for(let i=0;i<points.length-1;i++){ const p0=points[i-1]||points[i],p1=points[i],p2=points[i+1],p3=points[i+2]||p2; const cp1x=p1[0]+(p2[0]-p0[0])*smoothing,cp1y=p1[1]+(p2[1]-p0[1])*smoothing,cp2x=p2[0]-(p3[0]-p1[0])*smoothing,cp2y=p2[1]-(p3[1]-p1[1])*smoothing; d+=` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`; } return d; }
function gradientId(range,pos,index) { return `grad-${range.replaceAll(' ','')}-${pos}-${index}`; }
function refreshControls() {
  byId('rangeButtons').innerHTML=RANGE_OPTIONS.map(r=>`<button class="range-btn ${state.range===r?'active':''}" data-range="${r}">${r}</button>`).join('');
  byId('positionButtons').innerHTML=POSITIONS.map(pos=>{ const cfg=POS_CONFIG[pos], cur=getRangeSummary(state.range).current[pos], active=state.activePositions.includes(pos); return `<button class="pos-btn ${active?'active':''}" data-pos="${pos}" style="--pos-low:${cfg.low};--pos-mid:${cfg.mid};--pos-high:${cfg.high}"><span class="pos-dot"></span><span class="pos-name">${pos}</span><span class="pos-current">${cur}</span></button>`; }).join('');
  document.querySelectorAll('.range-btn').forEach(b=>b.addEventListener('click',()=>{state.range=b.dataset.range; renderAll();}));
  document.querySelectorAll('.pos-btn').forEach(b=>b.addEventListener('click',()=>{ const pos=b.dataset.pos; if(state.activePositions.includes(pos) && state.activePositions.length>1) state.activePositions=state.activePositions.filter(p=>p!==pos); else if(!state.activePositions.includes(pos)) state.activePositions.push(pos); renderAll(); }));
  document.querySelectorAll('.mode-btn').forEach(b=>{ b.classList.toggle('active',b.dataset.mode===state.mode); b.onclick=()=>{state.mode=b.dataset.mode; renderAll();}; });
}
function renderSummaryChips(summary) {
  const chips=[
    {label:'Selected range',value:summary.range,tone:''},
    {label:'2025 leader',value:`${summary.leader.pos} ${summary.leader.value}`,tone:'hot'},
    {label:'RB minus WR',value:fmtDelta(summary.rbWrDiff),tone:summary.rbWrDiff>0?'up':summary.rbWrDiff<0?'down':''},
    {label:'WR 2023→2025',value:fmtDelta(summary.wr2325),tone:summary.wr2325<0?'down':summary.wr2325>0?'up':''}
  ];
  byId('summaryChips').innerHTML=chips.map(c=>`<div class="stat-chip ${c.tone}"><div class="stat-label">${c.label}</div><div class="stat-value">${c.value}</div></div>`).join('');
}
function renderGlobalChart() {
  const summary=getRangeSummary(state.range); byId('globalTitle').textContent=state.mode==='grid'?'Four-range supply comparison':`${state.range} positional supply`; byId('globalSubtitle').textContent=state.mode==='grid'?'Four-range comparison: Top 60, Top 48, Top 36, and Top 24.':'Position counts inside the selected fantasy-points rank range.';
  if(state.mode==='grid') renderGlobalGrid(); else renderGlobalSingle();
  renderSummaryChips(summary); renderProfiles(summary);
}
function renderGlobalSingle() {
  const range=state.range, active=state.activePositions, w=1200,h=430,m={l:50,r:52,t:32,b:54},plotW=w-m.l-m.r,plotH=h-m.t-m.b;
  const yMax=Math.max(rangeSize(range)<=12?6:12, Math.ceil(Math.max(...active.flatMap(p=>getValues(range,p)))+2));
  const x=i=>m.l+i/(YEARS.length-1)*plotW, y=v=>m.t+plotH-v/yMax*plotH;
  let svg=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="POSITIONAL ANALYTICS ◊ 2007-2025">`;
  svg+=`<defs>`;
  for(const pos of active){ const values=getValues(range,pos), tiers=getTiers(values); for(let i=0;i<values.length-1;i++){ const cfg=POS_CONFIG[pos]; svg+=`<linearGradient id="${gradientId(range,pos,i)}" gradientUnits="userSpaceOnUse" x1="${x(i)}" y1="${y(values[i])}" x2="${x(i+1)}" y2="${y(values[i+1])}"><stop offset="0%" stop-color="${cfg[tiers[i]]}"/><stop offset="100%" stop-color="${cfg[tiers[i+1]]}"/></linearGradient>`; } }
  svg+=`</defs><rect x="0" y="0" width="${w}" height="${h}" rx="24" fill="rgba(0,0,0,.20)"/>`;
  for(let v=0; v<=yMax; v+=Math.max(1, Math.ceil(yMax/6))){ svg+=`<line x1="${m.l}" x2="${w-m.r}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(255,255,255,.065)"/><text x="${m.l-12}" y="${y(v)+4}" text-anchor="end" fill="#52525b" font-size="11" font-weight="900">${v}</text>`; }
  YEARS.forEach((year,i)=>{ const xx=x(i); svg+=`<line x1="${xx}" x2="${xx}" y1="${m.t}" y2="${h-m.b}" stroke="rgba(255,255,255,.032)"/>`; if(i%2===0 || i===YEARS.length-1) svg+=`<text x="${xx}" y="${h-22}" text-anchor="middle" fill="#71717a" font-size="11" font-weight="900">${year}</text>`; });
  for(const pos of active){ const values=getValues(range,pos), cfg=POS_CONFIG[pos], tiers=getTiers(values); for(let i=0;i<values.length-1;i++){ svg+=`<line x1="${x(i)}" y1="${y(values[i])}" x2="${x(i+1)}" y2="${y(values[i+1])}" stroke="url(#${gradientId(range,pos,i)})" stroke-width="4.5" stroke-linecap="round" opacity=".95"/>`; } values.forEach((val,i)=>{ svg+=`<circle cx="${x(i)}" cy="${y(val)}" r="${i===values.length-1?5.5:3.2}" fill="#050711" stroke="${cfg[tiers[i]]}" stroke-width="2" onmousemove="showTip(event,'<strong>${pos} · ${YEARS[i]}</strong><br>${range} count: ${val}')" onmouseleave="hideTip()"/>`; }); const last=values.at(-1); svg+=`<text x="${x(values.length-1)+10}" y="${y(last)+4}" fill="${cfg.high}" font-size="13" font-weight="1000">${pos}</text>`; }
  svg+=`<text x="${m.l}" y="22" fill="#e4e4e7" font-size="13" font-weight="1000">${range} · active positions: ${active.join(', ')}</text></svg>`;
  byId('globalChart').innerHTML=svg;
}
function renderGlobalGrid() {
  const ranges=RANGE_OPTIONS_WIDE_FIRST, active=state.activePositions, panelW=560,panelH=220,gap=18,w=panelW*2+gap,h=panelH*2+gap;
  let svg=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Four range supply comparison">`;
  ranges.forEach((range,idx)=>{ const col=idx%2,row=Math.floor(idx/2),ox=col*(panelW+gap),oy=row*(panelH+gap),m={l:34,r:34,t:32,b:34},plotW=panelW-m.l-m.r,plotH=panelH-m.t-m.b; const maxVal=Math.max(8,...active.flatMap(p=>getValues(range,p)))+2, x=i=>ox+m.l+i/(YEARS.length-1)*plotW, y=v=>oy+m.t+plotH-v/maxVal*plotH; svg+=`<rect x="${ox}" y="${oy}" width="${panelW}" height="${panelH}" rx="24" fill="rgba(0,0,0,.24)" stroke="rgba(255,255,255,.075)"/><text x="${ox+18}" y="${oy+23}" fill="#f8fafc" font-size="16" font-weight="1000">${range}</text>`; [0,Math.floor(maxVal/2),maxVal].forEach(v=>svg+=`<line x1="${ox+m.l}" x2="${ox+panelW-m.r}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(255,255,255,.055)"/>`); active.forEach(pos=>{ const vals=getValues(range,pos), cfg=POS_CONFIG[pos], pts=vals.map((v,i)=>[x(i),y(v)]); svg+=`<path d="${smoothPath(pts,.18)}" fill="none" stroke="${cfg.high}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".92"/>`; const last=pts.at(-1); svg+=`<text x="${last[0]+6}" y="${last[1]+3}" fill="${cfg.high}" font-size="10" font-weight="1000">${pos}</text>`; }); });
  svg+='</svg>'; byId('globalChart').innerHTML=svg;
}
function renderProfiles(summary) {
  byId('positionProfiles').innerHTML=POSITIONS.map(pos=>{ const stat=summary.stats[pos], cfg=POS_CONFIG[pos], active=state.activePositions.includes(pos); const trend=stat.changeFromPrevious>0?'up':stat.changeFromPrevious<0?'down':''; return `<div class="profile-card" style="--pos-low:${cfg.low};--pos-mid:${cfg.mid};--pos-high:${cfg.high};opacity:${active?1:.42}"><div class="profile-top"><div><div class="profile-pos">${pos}</div><div class="profile-small">2025 position file</div></div><div class="trend-pill ${trend}">${fmtDelta(stat.changeFromPrevious)} YoY</div></div><div class="profile-metrics"><div class="metric-big"><div class="metric-label">Current</div><div class="metric-num">${stat.current}</div><div class="profile-small">Rank #${stat.rank} of 19</div></div><div><div class="metric-box"><div class="metric-label">Avg</div><div class="metric-num">${fmt(stat.avg)}</div></div><div style="height:8px"></div><div class="metric-box"><div class="metric-label">Peak</div><div class="metric-num">${stat.max}</div></div></div></div></div>`; }).join('');
}
function renderMiniYearGrid() {
  const cols=4,panelW=240,panelH=138,gapX=14,gapY=14,rows=Math.ceil(YEARS.length/cols),w=cols*panelW+(cols-1)*gapX,h=rows*panelH+(rows-1)*gapY,maxY=30;
  let svg=`<svg viewBox="0 0 ${w} ${h}">`;
  YEARS.forEach((year,idx)=>{ const col=idx%cols,row=Math.floor(idx/cols),ox=col*(panelW+gapX),oy=row*(panelH+gapY),m={l:28,r:12,t:25,b:25},plotW=panelW-m.l-m.r,plotH=panelH-m.t-m.b, cuts=[6,12,24,36,48,60]; const x=i=>ox+m.l+i/(cuts.length-1)*plotW, y=v=>oy+m.t+plotH-v/maxY*plotH; const wr=cuts.map(c=>POS_DATA[`Top ${c}`].WR[YEARS.indexOf(year)]), rb=cuts.map(c=>POS_DATA[`Top ${c}`].RB[YEARS.indexOf(year)]); svg+=`<rect x="${ox}" y="${oy}" width="${panelW}" height="${panelH}" rx="18" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.10)"/><text x="${ox+14}" y="${oy+18}" fill="#edf5ff" font-size="12" font-weight="950">${year}</text><text x="${ox+66}" y="${oy+18}" fill="#0299fe" font-size="10" font-weight="900">WR ${wr.at(-1)}</text><text x="${ox+115}" y="${oy+18}" fill="#06ff97" font-size="10" font-weight="900">RB ${rb.at(-1)}</text>`; const wrPts=wr.map((v,i)=>[x(i),y(v)]), rbPts=rb.map((v,i)=>[x(i),y(v)]); svg+=`<path d="${smoothPath(wrPts,.20)}" fill="none" stroke="#0299fe" stroke-width="2.4" stroke-linecap="round"/><path d="${smoothPath(rbPts,.20)}" fill="none" stroke="#06ff97" stroke-width="2.4" stroke-linecap="round"/>`; });
  svg+='</svg>'; byId('miniYearGrid').innerHTML=svg;
}
function renderG1Lines() {
  const w=1100,h=386,m={l:42,r:78,t:28,b:44},plotW=w-m.l-m.r,plotH=h-m.t-m.b,x=yr=>m.l+(yr-YEARS[0])/(YEARS.at(-1)-YEARS[0])*plotW,y=v=>m.t+plotH-v/27*plotH; const series=[['12','WR'],['36','WR'],['60','WR'],['12','RB'],['36','RB'],['60','RB']]; let svg=`<svg viewBox="0 0 ${w} ${h}">`; [0,5,10,15,20,25].forEach(v=>svg+=`<line x1="${m.l}" x2="${w-m.r}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(255,255,255,.07)"/><text x="${m.l-8}" y="${y(v)+4}" text-anchor="end" fill="#52525b" font-size="10.5" font-weight="900">${v}</text>`); YEARS.forEach(yr=>{ const xx=x(yr); svg+=`<text x="${xx}" y="${h-16}" text-anchor="middle" fill="#71717a" font-size="10" font-weight="900">${yr}</text>`; }); series.forEach(([cut,pos],si)=>{ const color=RANGE_COLORS[cut][pos], vals=getValues(`Top ${cut}`,pos), pts=vals.map((v,i)=>[x(YEARS[i]),y(v)]), last=pts.at(-1), dash=si%3===1?'8 5':si%3===2?'2 5':''; svg+=`<path d="${smoothPath(pts)}" fill="none" stroke="${color}" stroke-width="2.5" ${dash?`stroke-dasharray="${dash}"`:''} stroke-linecap="round"/><text x="${last[0]+8}" y="${last[1]+4}" fill="${color}" font-size="10.2" font-weight="1000">${pos} T${cut}</text>`; }); svg+=`<text x="${m.l}" y="18" fill="#e4e4e7" font-size="13" font-weight="1000">WR/RB count lines · Scale max = 27</text></svg>`; byId('g1LineChart').innerHTML=svg;
}
function renderCombo() {
  const groupW=86,w=60+YEARS.length*groupW+22,h=620,markerTop=38,markerBottom=132,barTop=150,barBottom=520,barMax=27; const vals=YEARS.flatMap((yr,i)=>['12','36','60'].map(c=>getValues(`Top ${c}`,'WR')[i]-getValues(`Top ${c}`,'RB')[i])); const gapMin=Math.min(-10,Math.min(...vals)-1),gapMax=Math.max(12,Math.max(...vals)+1),gapY=v=>markerTop+(markerBottom-markerTop)-(v-gapMin)/(gapMax-gapMin)*(markerBottom-markerTop),gapZero=gapY(0),barY=v=>barTop+(barBottom-barTop)-v/barMax*(barBottom-barTop); let svg=`<svg viewBox="0 0 ${w} ${h}">`; [0,5,10,15,20,25].forEach(v=>svg+=`<line x1="46" x2="${w-18}" y1="${barY(v)}" y2="${barY(v)}" stroke="rgba(255,255,255,.075)"/><text x="36" y="${barY(v)+4}" text-anchor="end" fill="#52525b" font-size="11" font-weight="900">${v}</text>`); YEARS.forEach((year,yi)=>{ const gx=46+yi*groupW+10; ['12','36','60'].forEach((cut,ci)=>{ const cx=gx+ci*20, wr=getValues(`Top ${cut}`,'WR')[yi], rb=getValues(`Top ${cut}`,'RB')[yi], gap=wr-rb, wrColor=RANGE_COLORS[cut].WR,rbColor=RANGE_COLORS[cut].RB,gapColor=gap>=0?wrColor:rbColor,markerX=cx+8.5,markerY=gapY(gap); svg+=`<line x1="${markerX}" x2="${markerX}" y1="${gapZero}" y2="${markerY}" stroke="${gapColor}" stroke-width="3.5" stroke-linecap="round"/><circle cx="${markerX}" cy="${markerY}" r="5.2" fill="#050711" stroke="${gapColor}" stroke-width="2.4"/><text x="${markerX}" y="${gap>=0?markerY-8:markerY+15}" text-anchor="middle" fill="${gapColor}" font-size="9" font-weight="1000">${gap>0?'+':''}${gap}</text><rect x="${cx}" y="${barY(wr)}" width="8" height="${barBottom-barY(wr)}" rx="4" fill="${wrColor}"/><rect x="${cx+9.5}" y="${barY(rb)}" width="8" height="${barBottom-barY(rb)}" rx="4" fill="${rbColor}"/><text x="${cx+8.5}" y="${h-48}" text-anchor="middle" fill="#71717a" font-size="9" font-weight="900">T${cut}</text>`; }); svg+=`<text x="${gx+28}" y="${h-24}" text-anchor="middle" fill="#e4e4e7" font-size="10.5" font-weight="1000">${year}</text>`; }); svg+=`<text x="46" y="24" fill="#e4e4e7" font-size="14" font-weight="1000">Bars = WR/RB counts · Markers = WR-RB gap</text></svg>`; byId('comboG1G2').innerHTML=svg;
}
function renderG2ThreeLines() {
  const w=1100,h=386,m={l:44,r:76,t:30,b:44},plotW=w-m.l-m.r,plotH=h-m.t-m.b,minY=-16,maxY=6,x=yr=>m.l+(yr-YEARS[0])/(YEARS.at(-1)-YEARS[0])*plotW,y=v=>m.t+plotH-(v-minY)/(maxY-minY)*plotH,zeroY=y(0); const ranges=[['12',''],['36','8 6'],['60','2 6']]; let svg=`<svg viewBox="0 0 ${w} ${h}"><defs><clipPath id="posClip"><rect x="${m.l}" y="${m.t}" width="${plotW}" height="${Math.max(0,zeroY-m.t)}"/></clipPath><clipPath id="negClip"><rect x="${m.l}" y="${zeroY}" width="${plotW}" height="${Math.max(0,h-m.b-zeroY)}"/></clipPath></defs>`; [-16,-12,-8,-4,0,2,4,6].forEach(v=>svg+=`<line x1="${m.l}" x2="${w-m.r}" y1="${y(v)}" y2="${y(v)}" stroke="${v===0?'rgba(255,255,255,.20)':'rgba(255,255,255,.07)'}"/><text x="${m.l-8}" y="${y(v)+4}" text-anchor="end" fill="#52525b" font-size="10.5" font-weight="900">${v}</text>`); ranges.forEach(([cut,dash])=>{ const rbColor=RANGE_COLORS[cut].RB,wrColor=RANGE_COLORS[cut].WR,wr=getValues(`Top ${cut}`,'WR'),rb=getValues(`Top ${cut}`,'RB'); const pts=YEARS.map((yr,i)=>{ const val=rb[i]-wr[i]; return [x(yr),y(val),val]; }),d=smoothPath(pts.map(p=>[p[0],p[1]])); svg+=`<path d="${d}" fill="none" stroke="${rbColor}" stroke-width="2.8" ${dash?`stroke-dasharray="${dash}"`:''} clip-path="url(#posClip)" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${wrColor}" stroke-width="2.8" ${dash?`stroke-dasharray="${dash}"`:''} clip-path="url(#negClip)" stroke-linecap="round"/>`; const last=pts.at(-1); svg+=`<text x="${last[0]+8}" y="${last[1]+4}" fill="${last[2]>=0?rbColor:wrColor}" font-size="10.2" font-weight="1000">T${cut}</text>`; }); YEARS.forEach(yr=>{ const xx=x(yr); svg+=`<text x="${xx}" y="${h-16}" text-anchor="middle" fill="#71717a" font-size="10" font-weight="900">${yr}</text>`; }); svg+=`<text x="${m.l}" y="18" fill="#e4e4e7" font-size="13" font-weight="1000">Negative = WR edge · Positive = RB edge</text></svg>`; byId('g2ThreeLines').innerHTML=svg;
}
function renderAll() { refreshControls(); renderGlobalChart(); renderMiniYearGrid(); renderG1Lines(); renderCombo(); renderG2ThreeLines(); }
