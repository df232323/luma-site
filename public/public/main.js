// страницы
const pages = {
  home: document.getElementById('page-home'),
  vacancy: document.getElementById('page-vacancy'),
  apply: document.getElementById('page-apply'),
  howto: document.getElementById('page-howto'),
  calculator: document.getElementById('page-calculator'),
  reviews: document.getElementById('page-reviews'),
  contacts: document.getElementById('page-contacts'),
};

function setActive(page){
  Object.values(pages).forEach(p=>p.classList.remove('active'));
  (pages[page] || pages.home).classList.add('active');
  if (location.hash !== '#' + page) {
    location.hash = page;
  }
  window.scrollTo({top:0,behavior:'instant'});
  mobileMenu.classList.remove('show');
}

function getPage(){
  return (location.hash || '#home').replace('#','');
}

document.querySelectorAll('[data-page]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    setActive(a.dataset.page);
  });
});

window.addEventListener('hashchange',()=> setActive(getPage()));
setActive(getPage());

// год
document.getElementById('year').textContent = new Date().getFullYear();

// бургер
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click',()=>{
  mobileMenu.classList.toggle('show');
});

// форма
const form = document.getElementById('applyForm');
const modal = document.getElementById('modal');
const trackEl = document.getElementById('trackCode');
const copyBtn = document.getElementById('copyBtn');
const closeModal = document.getElementById('closeModal');
const tgBtn = document.getElementById('tgBtn');

let lastCode = null;

if (form){
  const platformHidden = form.querySelector('input[name="platform"]');
  document.querySelectorAll('.seg').forEach(seg=>{
    seg.addEventListener('click',()=>{
      document.querySelectorAll('.seg').forEach(s=>s.classList.remove('active'));
      seg.classList.add('active');
      platformHidden.value = seg.dataset.value;
    });
  });

  function genCode(){
    let code;
    do { code = Math.floor(1000 + Math.random()*9000).toString(); } while(code === lastCode);
    lastCode = code;
    return code;
  }

  function openModal(code){
    trackEl.textContent = code;
    modal.style.display = 'flex';
  }

  copyBtn.addEventListener('click',()=>{
    navigator.clipboard.writeText(trackEl.textContent).then(()=>{
      copyBtn.textContent='Скопировано!';
      setTimeout(()=>copyBtn.textContent='Скопировать код',1500);
    });
  });

  closeModal.addEventListener('click',()=> modal.style.display='none');

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const code = genCode();
    openModal(code);
    tgBtn.href = 'https://t.me/Luma_Ekaterina';

    // отправка на сервер
    try{
      await fetch('/api/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...data, track_code:code})
      });
    }catch(err){
      console.warn('Не удалось отправить в Telegram', err);
    }

    form.reset();
    platformHidden.value = 'iPhone';
  });
}

// калькулятор
const needle = document.getElementById('needle'),
      hDisplay = document.getElementById('hDisplay'),
      hoursPerDay = document.getElementById('hoursPerDay'),
      daysPerWeek = document.getElementById('daysPerWeek'),
      nightShare = document.getElementById('nightShare'),
      hoursPerDayVal = document.getElementById('hoursPerDayVal'),
      daysPerWeekVal = document.getElementById('daysPerWeekVal'),
      nightShareVal = document.getElementById('nightShareVal'),
      dayIncome = document.getElementById('dayIncome'),
      weekIncome = document.getElementById('weekIncome'),
      monthIncome = document.getElementById('monthIncome');

function fmt(n){ return new Intl.NumberFormat('ru-RU').format(n) + ' ₽'; }

function spin(h){
  const angle = h/12*360;
  if (needle){
    needle.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
  }
  if (hDisplay){
    hDisplay.textContent = h;
  }
}

function recalc(){
  if (!hoursPerDay) return;
  const h = +hoursPerDay.value;
  const d = +daysPerWeek.value;
  const ns = +nightShare.value/100;
  const hNight = h*ns;
  const hDay = h - hNight;
  const daySum = hDay*800 + hNight*1000;
  const weekSum = daySum * d;
  const monthSum = weekSum * 4.345;
  hoursPerDayVal.textContent = h;
  daysPerWeekVal.textContent = d;
  nightShareVal.textContent = Math.round(ns*100);
  dayIncome.textContent = fmt(Math.round(daySum));
  weekIncome.textContent = fmt(Math.round(weekSum));
  monthIncome.textContent = fmt(Math.round(monthSum));
  spin(h);
}

if (hoursPerDay){
  [hoursPerDay, daysPerWeek, nightShare].forEach(el=> el && el.addEventListener('input', recalc));
  recalc();
}

document.querySelectorAll('.quick button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    hoursPerDay.value = btn.dataset.h;
    recalc();
  });
});

// отзывы
const wrap = document.getElementById('reviewsList');
if (wrap){
  const reviews = [
    {n:'Анна', city:'Казань', text:'Начала без опыта, через неделю уже в сменах. Удобно, что без звонков 👍', stars:5},
    {n:'Игорь', city:'СПб', text:'Выходил по 4 часа вечером — хватает. Деньги падают каждый день.', stars:5},
    {n:'Мария', city:'Москва', text:'Менеджер всё объяснил в Telegram, подключили быстро.', stars:5},
    {n:'Ольга', city:'Краснодар', text:'Работаю только ночью — ставка выше 💸', stars:5},
  ];
  const toStars = n => '★★★★★'.slice(0,n);
  reviews.forEach(r=>{
    const el = document.createElement('div');
    el.className = 'review';
    el.innerHTML = `
      <div class="who">
        <div class="avatar">${r.n[0]}</div>
        <div><strong>${r.n}</strong><div class="muted">${r.city}</div></div>
      </div>
      <div class="stars">${toStars(r.stars)}</div>
      <p>${r.text}</p>
    `;
    wrap.appendChild(el);
  });
}
