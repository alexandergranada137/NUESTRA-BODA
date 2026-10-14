(() => {
  const intro=document.querySelector('#envelope-intro');
  const button=document.querySelector('#open-envelope');
  if(!intro || !intro.showModal) return;
  let opening=false;
  let finished=false;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  function finish(){
    if(finished) return;
    finished=true;
    intro.close();
    document.documentElement.classList.remove('envelope-locked');
    window.scrollTo({top:0,behavior:'instant'});
    const title=document.querySelector('h1');
    title.setAttribute('tabindex','-1');
    title.focus({preventScroll:true});
    document.dispatchEvent(new Event('invitation:opened'));
  }
  function open(){
    if(opening) return;
    opening=true;
    button.disabled=true;
    document.dispatchEvent(new Event('invitation:opening'));
    intro.classList.add('is-opening');
    if(reduce.matches){
      intro.classList.add('is-leaving');
      setTimeout(finish,180);
      return;
    }
    setTimeout(()=>intro.classList.add('flap-behind'),850);
    setTimeout(()=>intro.classList.add('letter-rising'),1150);
    setTimeout(()=>intro.classList.add('letter-presented'),2350);
    setTimeout(()=>{
      intro.classList.add('is-leaving');
      setTimeout(finish,850);
    },3100);
  }
  button.addEventListener('click',open);
  intro.addEventListener('cancel',event=>{event.preventDefault();open()});
  intro.showModal();
  document.documentElement.classList.add('envelope-locked');
})();

