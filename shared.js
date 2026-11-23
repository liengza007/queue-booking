// ตั้งค่า Supabase (ค่า URL และ anon/publishable key เปิดเผยได้ ไม่ใช่รหัสลับ)
window.CONFIG = {
  SUPABASE_URL: "https://gegoyivdgcukosdkmawl.supabase.co",
  SUPABASE_KEY: "sb_publishable_496_4mNJ_QBpTMSMisn96A_c_PeQ0aW",
};

window.SHOP = {
  SERVICES: [
    { id: "cut", name: "ตัดผมชาย", price: 150 },
    { id: "cutwash", name: "ตัด + สระ", price: 200 },
    { id: "shave", name: "โกนหนวด / กันขอบ", price: 100 },
    { id: "kid", name: "ตัดผมเด็ก (ไม่เกิน 12 ปี)", price: 120 },
  ],
  OPEN: 10, CLOSE: 19, STEP: 30, CLOSED_DAY: 1, DAYS: 14,
};

window.U = (() => {
  const WD = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  const MO = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const pad = n => String(n).padStart(2, "0");
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseYmd = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const thDate = s => { const d = parseYmd(s); return `${WD[d.getDay()]} ${d.getDate()} ${MO[d.getMonth()]}`; };
  const svc = id => SHOP.SERVICES.find(s => s.id === id);
  const times = () => { const o = []; for (let m = SHOP.OPEN * 60; m < SHOP.CLOSE * 60; m += SHOP.STEP) o.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`); return o; };
  const isPast = (date, time) => { const [h, m] = time.split(":").map(Number); const d = parseYmd(date); d.setHours(h, m, 0, 0); return d.getTime() <= Date.now(); };
  const days = () => { const o = []; const d = new Date(); d.setHours(0, 0, 0, 0); for (let i = 0; i < SHOP.DAYS; i++) { o.push(new Date(d)); d.setDate(d.getDate() + 1); } return o; };
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  function dateChips(container, selected, onPick, allowClosed) {
    container.replaceChildren();
    for (const d of days()) {
      const k = ymd(d), closed = d.getDay() === SHOP.CLOSED_DAY;
      const b = el("button", "chip"); b.type = "button";
      b.disabled = closed && !allowClosed; b.setAttribute("aria-pressed", String(selected === k));
      b.append(el("span", "w", closed ? "ปิด" : WD[d.getDay()]), el("span", "d", d.getDate()), el("span", "w", MO[d.getMonth()]));
      b.onclick = () => onPick(k);
      container.append(b);
    }
  }
  function armButton(label, confirmLabel, fn) {
    const b = el("button", "ghost danger", label); b.type = "button"; let armed = false, t;
    b.onclick = async () => {
      if (!armed) { armed = true; b.classList.add("armed"); b.textContent = confirmLabel; t = setTimeout(() => { armed = false; b.classList.remove("armed"); b.textContent = label; }, 4000); return; }
      clearTimeout(t); b.disabled = true; await fn();
    };
    return b;
  }
  return { WD, MO, ymd, parseYmd, thDate, svc, times, isPast, days, el, dateChips, armButton };
})();

window.sb = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
