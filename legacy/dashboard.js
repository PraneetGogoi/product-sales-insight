// ── PALETTE ──────────────────────────────────────────────
const CAT_COLS  = ['#00cc00','#1a1a1a','#008000','#333333','#004d00','#000000'];
const CITY_COLS = ['#1a1a1a','#00cc00','#004d00','#008000','#333333'];

// ── GLOBAL STATE ─────────────────────────────────────────
let globalRawData = [];
let currentFilter = 'All Time';
let dataMaxDate = new Date();

// ── STATIC HEATMAP ───────────────────────────────────────
function initHeatmap() {
  const hm = document.getElementById('heatmap');
  if (!hm || (hm && hm.children.length > 0)) return;
  (['lo','lo','mi','mi','mi','hi','hi','lo','mi','mi','hi','hi','mi','lo','mi','hi','hi','hi','mi','lo','lo','lo','mi','hi','hi','mi','lo','lo']).forEach(lvl => {
    const c = document.createElement('div'); c.className = `hc ${lvl}`;
    hm.appendChild(c);
  });
}

// ── BAR CHART BUILDER ────────────────────────────────────
function createBarChart(cId, lId, labels, values, cols, prefix, suffix) {
  const bc = document.getElementById(cId), bl = document.getElementById(lId);
  if (!bc || !bl) return;
  bc.innerHTML = ''; bl.innerHTML = '';
  if (values.length === 0) {
    bc.innerHTML = '<div style="color:var(--tm);font-size:12px;margin-top:20px;text-align:center;width:100%;">No data available for this filter.</div>';
    return;
  }
  const mx = Math.max(...values, 1);
  values.forEach((v, i) => {
    const w = document.createElement('div'); w.className = 'bw';
    const b = document.createElement('div'); b.className = 'bn';
    b.style.cssText = `height:0%;background:${cols[i%cols.length]};box-shadow:inset 3px 3px 8px rgba(0,0,0,.22),inset -2px -2px 5px rgba(255,255,255,.3);transition:height .6s cubic-bezier(.34,1.2,.64,1) ${i*45}ms;`;
    b.title = `${labels[i]}: ${prefix}${v.toLocaleString()}${suffix}`;
    b.addEventListener('mouseenter', function(){ this.style.filter='brightness(1.12)'; this.style.transform='scaleX(1.04)'; });
    b.addEventListener('mouseleave', function(){ this.style.filter=''; this.style.transform=''; });
    setTimeout(() => { b.style.height = Math.round(v/mx*100)+'%'; }, 120+i*45);
    w.appendChild(b); bc.appendChild(w);
    const l = document.createElement('div'); l.className='blri';
    // If too many labels, show only every 5th
    if (labels.length > 15) {
        l.textContent = (i % 5 === 0) ? labels[i] : '';
    } else {
        l.textContent = labels[i];
    }
    bl.appendChild(l);
  });
}

// ── TREND LINE CHART ─────────────────────────────────────
function drawTrendChart(containerId, labels, vals, color, isCurrency) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const W = container.offsetWidth || 700, H = 220, PX = 40, PY = 40;
  if (W === 0) return;
  container.innerHTML = '';
  if (vals.length === 0) {
    container.innerHTML = '<div style="color:var(--tm);font-size:12px;margin-top:20px;text-align:center;width:100%;">No data available.</div>';
    return;
  }
  const mn = Math.min(...vals) * 0.9, mx = Math.max(...vals) * 1.1;
  const sx = (W - 2 * PX) / (vals.length - 1 || 1);
  
  let d = `M ${PX} ${H - PY - ((vals[0] - mn) / (mx - mn || 1)) * (H - 2 * PY)}`;
  let pts = '', lbs = '';
  
  vals.forEach((v, i) => {
    const cx = PX + i * sx;
    const cy = H - PY - ((v - mn) / (mx - mn || 1)) * (H - 2 * PY);
    if (i > 0) d += ` L ${cx} ${cy}`;
    pts += `<circle cx="${cx}" cy="${cy}" r="4" fill="${color}" stroke="var(--bg)" stroke-width="2" style="cursor:pointer" onmouseenter="this.setAttribute('r','6')" onmouseleave="this.setAttribute('r','4')"><title>${labels[i]}: ${isCurrency ? '$' : ''}${v.toLocaleString()}</title></circle>`;
    if (vals.length < 20 || i % 2 === 0) {
        lbs += `<text x="${cx}" y="${H - 10}" font-family="Space Mono" font-size="10" fill="var(--tm)" text-anchor="middle" transform="rotate(45,${cx},${H-10})">${labels[i]}</text>`;
    }
  });

  container.innerHTML = `<svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs><linearGradient id="g_${containerId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity=".2"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    <path d="${d} L ${PX + (vals.length - 1) * sx} ${H - PY} L ${PX} ${H - PY} Z" fill="url(#g_${containerId})"/>
    <path d="${d}" fill="none" stroke="${color}" stroke-width="2.5"/>
    ${pts}${lbs}
  </svg>`;
}

// ── SCATTER CHART ────────────────────────────────────────
function drawScatterChart(containerId, data, colors) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const W = container.offsetWidth || 350, H = 220, PX = 40, PY = 40;
  if (W === 0) return;
  container.innerHTML = '';
  if (data.length === 0) {
    container.innerHTML = '<div style="color:var(--tm);font-size:12px;margin-top:20px;text-align:center;width:100%;">No categories found.</div>';
    return;
  }
  
  const xVals = data.map(d => d.x), yVals = data.map(d => d.y);
  const mxX = Math.max(...xVals, 1), mxY = Math.max(...yVals, 1);
  
  let pts = '';
  data.forEach((d, i) => {
    const cx = PX + (d.x / mxX) * (W - 2 * PX);
    const cy = H - PY - (d.y / mxY) * (H - 2 * PY);
    pts += `<circle cx="${cx}" cy="${cy}" r="6" fill="${colors[i%colors.length]}" opacity="0.8" style="cursor:pointer"><title>${d.label}: Avg Price $${d.x}, Vol ${d.y}</title></circle>`;
  });

  container.innerHTML = `<svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}">
    <line x1="${PX}" y1="${H-PY}" x2="${W-PX}" y2="${H-PY}" stroke="var(--tm)" stroke-width="1"/>
    <line x1="${PX}" y1="${PY}" x2="${PX}" y2="${H-PY}" stroke="var(--tm)" stroke-width="1"/>
    ${pts}
    <text x="${W/2}" y="${H-5}" font-family="Space Mono" font-size="9" fill="var(--tm)" text-anchor="middle">Avg Price →</text>
  </svg>`;
}

// ── DONUT CHART ──────────────────────────────────────────
function drawDonutChart(containerId, labels, values, colors, totalLabel) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  if (values.length === 0) {
    container.innerHTML = '<div style="color:var(--tm);font-size:12px;margin-top:20px;text-align:center;width:100%;">No data available.</div>';
    return;
  }
  const total = values.reduce((a, b) => a + b, 0);
  let cumulative = 0;
  let circles = '';
  const R = 50, C = 2 * Math.PI * R;

  values.forEach((v, i) => {
    const dash = (v / total) * C;
    const offset = - (cumulative / total) * C;
    circles += `<circle cx="68" cy="68" r="${R}" fill="none" stroke="${colors[i%colors.length]}" stroke-width="22" stroke-dasharray="${dash} ${C-dash}" stroke-dashoffset="${offset}"/>`;
    cumulative += v;
  });

  let legend = '';
  labels.forEach((l, i) => {
    const perc = Math.round((values[i] / total) * 100);
    legend += `<div class="dlr"><div class="dld" style="background:${colors[i%colors.length]}"></div><div class="dln">${l}</div><div class="dlv">$${Math.round(values[i]/1000)}k</div><div class="dlp">${perc}%</div></div>`;
  });

  container.innerHTML = `
    <svg class="dsvg" width="136" height="136" viewBox="0 0 136 136">
      <circle cx="68" cy="68" r="${R}" fill="none" stroke="#d4d0c8" stroke-width="22"/>
      ${circles}
      <circle cx="68" cy="68" r="38" fill="#e4e0d8"/>
      <text x="68" y="64" text-anchor="middle" font-family="Space Mono" font-size="13" font-weight="700" fill="#3a3630">${totalLabel}</text>
      <text x="68" y="77" text-anchor="middle" font-family="Nunito" font-size="8.5" font-weight="600" fill="#aca8a0">TOTAL REVENUE</text>
    </svg>
    <div class="dl">${legend}</div>
  `;
}

// ── LIST BUILDER ─────────────────────────────────────────
function drawRankedList(containerId, labels, values, colors, prefix, suffix) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  if (values.length === 0) {
    container.innerHTML = '<div style="color:var(--tm);font-size:12px;margin-top:20px;text-align:center;width:100%;">No results found.</div>';
    return;
  }
  const max = Math.max(...values, 1);
  let html = '';
  labels.slice(0, 5).forEach((l, i) => {
    const perc = (values[i] / max) * 100;
    html += `<div class="cir"><div class="crk">0${i+1}</div><div class="cn">${l}</div><div class="cbt"><div class="cbf" style="width:${perc}%;background:${colors[i%colors.length]}"></div></div><div class="crv">${prefix}${Math.round(values[i]/1000)}${suffix}</div></div>`;
  });
  container.innerHTML = html;
}

// ── CSV PARSER ───────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      let val = values[i];
      if (val !== undefined) {
        val = val.trim();
        if (!isNaN(val) && val !== '') val = parseFloat(val);
      }
      obj[h.trim()] = val;
    });
    return obj;
  });
}

// ── DATA PROCESSING ──────────────────────────────────────
function processData(raw) {
  const data = {
    kpis: { total_revenue: 0, units_sold: 0, avg_price: 0, cities_active: 0 },
    timeline: {}, 
    categories: {},
    cities: {}
  };

  const cities = new Set();
  let totalPrice = 0;

  // Initialize padding for timeline based on filter
  const ref = new Date(dataMaxDate);
  if (currentFilter === 'Last Week') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(ref); d.setDate(d.getDate() - i);
      const k = d.toISOString().split('T')[0];
      data.timeline[k] = { rev: 0, qty: 0 };
    }
  } else if (currentFilter === 'Last Month') {
    // Show 4 weeks for Last Month
    for (let i = 30; i >= 0; i--) {
      const d = new Date(ref); d.setDate(d.getDate() - i);
      const k = d.toISOString().split('T')[0];
      data.timeline[k] = { rev: 0, qty: 0 };
    }
  } else if (currentFilter === 'Last Quarter') {
    for (let i = 2; i >= 0; i--) {
        const d = new Date(ref); d.setMonth(d.getMonth() - i);
        const k = d.toISOString().split('T')[0].substring(0, 7);
        data.timeline[k] = { rev: 0, qty: 0 };
    }
  }

  raw.forEach(row => {
    const rev = row.Total_Sales_USD || 0;
    const qty = row.Quantity_Sold || 0;
    const price = row.Price_USD || 0;
    const city = row.Customer_City;
    const cat = row.Category;
    
    let timeKey = 'Unknown';
    if (row.Order_Date) {
        if (currentFilter === 'Last Week' || currentFilter === 'Last Month') timeKey = row.Order_Date;
        else timeKey = row.Order_Date.substring(0, 7);
    }

    data.kpis.total_revenue += rev;
    data.kpis.units_sold += qty;
    totalPrice += price;
    if (city) cities.add(city);

    if (data.timeline[timeKey] || currentFilter === 'All Time') {
        if (!data.timeline[timeKey]) data.timeline[timeKey] = { rev: 0, qty: 0 };
        data.timeline[timeKey].rev += rev;
        data.timeline[timeKey].qty += qty;
    }

    if (cat) {
        if (!data.categories[cat]) data.categories[cat] = { rev: 0, qty: 0, priceSum: 0, count: 0 };
        data.categories[cat].rev += rev;
        data.categories[cat].qty += qty;
        data.categories[cat].priceSum += price;
        data.categories[cat].count += 1;
    }

    if (city) {
        if (!data.cities[city]) data.cities[city] = { rev: 0, orders: 0 };
        data.cities[city].rev += rev;
        data.cities[city].orders += 1;
    }
  });

  data.kpis.avg_price = totalPrice / (raw.length || 1);
  data.kpis.cities_active = cities.size;

  return data;
}

// ── FILTERING ────────────────────────────────────────────
function getFilteredData() {
  if (currentFilter === 'All Time') return globalRawData;
  const refDate = dataMaxDate;
  return globalRawData.filter(row => {
    const rowDate = row.Order_Date ? new Date(row.Order_Date) : null;
    if (['Electronics', 'Apparel', 'Home', 'Sports'].includes(currentFilter)) {
        return (row.Category || '').toLowerCase().includes(currentFilter.toLowerCase());
    }
    if (!rowDate) return false;
    const diffMs = refDate - rowDate;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (currentFilter === 'Last Week') return diffDays >= 0 && diffDays <= 7;
    if (currentFilter === 'Last Month') return diffDays >= 0 && diffDays <= 30;
    if (currentFilter === 'Last Quarter') return diffDays >= 0 && diffDays <= 90;
    return true;
  });
}

// ── RENDER DASHBOARD ─────────────────────────────────────
function renderDashboard() {
  const filtered = getFilteredData();
  const processed = processData(filtered);

  const kpiEls = document.querySelectorAll('.stat-num');
  const totalRevStr = `$${(processed.kpis.total_revenue / 1000000).toFixed(2)}M`;
  const kpiVals = [
    totalRevStr,
    processed.kpis.units_sold.toLocaleString(),
    `$${processed.kpis.avg_price.toFixed(2)}`,
    processed.kpis.cities_active.toString()
  ];
  kpiEls.forEach((el, i) => { if (kpiVals[i]) el.textContent = kpiVals[i]; });

  const tLabels = Object.keys(processed.timeline).sort();
  const displayLabels = tLabels.map(l => {
    if (currentFilter === 'Last Week' || currentFilter === 'Last Month') return l.split('-')[2];
    return l.split('-')[1] || '??';
  });
  const tRevs = tLabels.map(l => processed.timeline[l].rev);
  const tQtys = tLabels.map(l => processed.timeline[l].qty);

  // Overview Page
  createBarChart('barChart', 'barLabels', displayLabels, tRevs, CAT_COLS, '$', '');
  
  const cLabels = Object.keys(processed.categories).sort((a,b) => processed.categories[b].rev - processed.categories[a].rev);
  const cRevs = cLabels.map(l => processed.categories[l].rev);
  drawDonutChart('overviewCategoryShare', cLabels, cRevs, CAT_COLS, totalRevStr);
  
  const cityLabels = Object.keys(processed.cities).sort((a,b) => processed.cities[b].rev - processed.cities[a].rev);
  const cityRevs = cityLabels.map(l => processed.cities[l].rev);
  drawRankedList('topCitiesList', cityLabels, cityRevs, CITY_COLS, '$', 'k');

  // Revenue Page
  const cKRevs = cLabels.map(l => Math.round(processed.categories[l].rev / 1000));
  createBarChart('revBarChart', 'revBarLabels', cLabels, cKRevs, CAT_COLS, '$', 'k');
  const cQtys_cat = cLabels.map(l => processed.categories[l].qty);
  createBarChart('qtyBarChart', 'qtyBarLabels', cLabels, cQtys_cat, CAT_COLS, '', '');

  // Cities View
  const cityOrderLabels = Object.keys(processed.cities).sort((a,b) => processed.cities[b].orders - processed.cities[a].orders);
  const cityOrders = cityOrderLabels.map(l => processed.cities[l].orders);
  createBarChart('cityOrderChart', 'cityOrderLabels', cityOrderLabels, cityOrders, CITY_COLS, '', '');

  // Trends View
  drawTrendChart('trendChartContainer', tLabels, tRevs, '#00cc00', true);
  drawTrendChart('qtyTrendChartContainer', tLabels, tQtys, '#1a1a1a', false);
  
  const scatterData = cLabels.map(l => ({
    label: l,
    x: Math.round(processed.categories[l].priceSum / (processed.categories[l].count || 1)),
    y: processed.categories[l].qty
  }));
  drawScatterChart('scatterChartContainer', scatterData, CAT_COLS);

  initHeatmap();
  updateTicker();
}

function updateTicker() {
  let el = document.getElementById('data-ticker');
  if(!el){
    el=document.createElement('div'); el.id='data-ticker';
    el.style.cssText='position:fixed;bottom:16px;left:16px;font-size:11px;font-family:"Space Mono",monospace;color:#00cc00;background:rgba(0,0,0,.78);padding:6px 14px;border-radius:8px;z-index:999;letter-spacing:.5px;pointer-events:none;';
    document.body.appendChild(el);
  }
  el.textContent = '⟳ Live Data: ' + new Date().toLocaleTimeString() + ' | Filter: ' + currentFilter;
}

function updateMaxDate(raw) {
  let max = new Date(0);
  raw.forEach(r => {
    if (r.Order_Date) {
      const d = new Date(r.Order_Date);
      if (d > max) max = d;
    }
  });
  dataMaxDate = max;
}

function fetchAndRender() {
  if (window.rawData && window.rawData.length > 0) {
      globalRawData = window.rawData;
      updateMaxDate(globalRawData);
      renderDashboard();
  }
  fetch('product_sales_dataset.csv?_=' + Date.now())
    .then(r => { if (!r.ok) return; return r.text(); })
    .then(text => {
      if (!text) return;
      const raw = parseCSV(text);
      if (raw.length > 0) {
          globalRawData = raw;
          updateMaxDate(globalRawData);
          renderDashboard();
          showToast('Data Synced ✓');
      }
    }).catch(() => {});
}

fetchAndRender();
setInterval(fetchAndRender, 30000);

window.activateNav = function(el, viewId) {
  document.querySelectorAll('.ni').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.view-section').forEach(v => v.style.display = 'none');
  const target = document.getElementById('view-' + viewId);
  if (target) {
      target.style.display = 'block';
      setTimeout(renderDashboard, 10);
  }
};

window.activatePill = function(el) {
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('on'));
  el.classList.add('on');
  currentFilter = el.textContent.trim();
  showToast('Filtering: ' + currentFilter);
  renderDashboard();
};

function showToast(msg) {
  let t = document.getElementById('toast-msg');
  if (!t) { t = document.createElement('div'); t.id = 'toast-msg'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t.timer); t.timer = setTimeout(() => t.classList.remove('show'), 2500);
}

window.toggleDarkMode = function(el) {
  const isOn = el.querySelector('.ts2').classList.toggle('on');
  document.body.classList.toggle('dark-mode', isOn);
};

window.toggleOption = function(el, name) {
  const isOn = el.querySelector('.ts2').classList.toggle('on');
  showToast(name + (isOn ? ' Enabled' : ' Disabled'));
};
