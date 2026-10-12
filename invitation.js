/* One-shot entrances establish narrative hierarchy; no scroll hijacking or loops. */
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const control = document.querySelector('.motion-control');
  let userReduced = false;
  try { userReduced = sessionStorage.getItem('invitation-motion') === 'off'; } catch {}
  const active = new Set();
  const seen = new WeakSet();
  const ease = 'cubic-bezier(0.23, 1, 0.32, 1)';
  const reduced = () => preference.matches || userReduced;
  function sync() {
    document.documentElement.dataset.motion = reduced() ? 'off' : 'on';
    control.textContent = reduced() ? 'Animaciones desactivadas' : 'Desactivar animaciones';
    control.setAttribute('aria-pressed', String(reduced()));
    if (reduced()) { active.forEach(a => a.cancel()); active.clear(); }
  }
  function enter(element, delay = 0, duration = 850) {
    if (reduced() || !element.animate || seen.has(element)) return;
    seen.add(element);
    const animation = element.animate([
      {opacity:0,transform:'translateY(22px)'},
      {opacity:1,transform:'translateY(0)'}
    ], {duration,delay,easing:ease,fill:'backwards'});
    active.add(animation);
    animation.finished.then(()=>active.delete(animation)).catch(()=>active.delete(animation));
  }
  control.addEventListener('click', () => {
    if (preference.matches) { control.textContent = 'Movimiento reducido según tu dispositivo'; return; }
    userReduced = !userReduced;
    try { sessionStorage.setItem('invitation-motion',userReduced?'off':'on'); } catch {}
    sync();
  });
  preference.addEventListener('change',sync);
  sync();
  [...document.querySelector('.hero-copy').children].forEach((el,i)=>enter(el,i*65,1050));
  enter(document.querySelector('.photo-frame'),160,1200);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el=entry.target;
        if (el.classList.contains('timeline')) [...el.children].forEach((child,i)=>enter(child,i*55,750));
        else enter(el,0,900);
        observer.unobserve(el);
      });
    },{threshold:.08,rootMargin:'0px 0px -35px 0px'});
    document.querySelectorAll('.story>div:last-child,.story-images,.quote blockquote,#boda>h2,.details-grid,.people,.program>h2,.timeline,.wide-photo>div,.wide-photo>img,.rsvp,.baby-intro,.baby-gallery').forEach(el=>observer.observe(el));
  }
  document.addEventListener('focusin',() => {active.forEach(a=>a.finish());active.clear();});
  document.querySelector('details').addEventListener('toggle',event=>{
    if(event.currentTarget.open) event.currentTarget.querySelectorAll('.moment').forEach((el,i)=>{seen.delete(el);enter(el,i*40,240)});
  });
})();
