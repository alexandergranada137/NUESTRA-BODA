(() => {
  const audio = document.querySelector('#background-music');
  const button = document.querySelector('#music-toggle');
  if (!audio || !button) return;
  audio.volume = 0.5;
  audio.loop = true;
  let userPaused = false;
  let pending = false;
  function update() {
    const playing = !audio.paused;
    button.textContent = playing ? 'Ⅱ  Pausar música' : '♪  Activar música';
    button.setAttribute('aria-pressed', String(playing));
    button.title = playing ? 'Pausar música de fondo' : 'Reproducir música de fondo';
  }
  function removeStartListeners() {
    document.removeEventListener('pointerup', firstInteraction);
    document.removeEventListener('keydown', firstInteraction);
  }
  async function play() {
    if (pending) return;
    pending = true;
    try {
      await audio.play();
      if (userPaused) audio.pause();
      else removeStartListeners();
    } catch { /* A browser may require a direct gesture before audible playback. */ }
    finally { pending = false; update(); }
  }
  function firstInteraction(event) {
    if (userPaused || button.contains(event.target)) return;
    if (event.type === 'keydown' && !['Enter',' '].includes(event.key)) return;
    play();
  }
  button.addEventListener('click', () => {
    if (!audio.paused || pending) {
      userPaused = true;
      removeStartListeners();
      audio.pause();
      update();
    } else {
      userPaused = false;
      play();
    }
  });
  audio.addEventListener('play',update);
  audio.addEventListener('pause',update);
  audio.addEventListener('error',()=>{
    button.textContent='Música no disponible';
    button.disabled=true;
    removeStartListeners();
  });
  document.addEventListener('pointerup',firstInteraction);
  document.addEventListener('keydown',firstInteraction);
  update();
  play();
})();
