(() => {
  const background = document.querySelector('#ambient-background');
  const toggle = document.querySelector('.motion-toggle');
  if (!background || !toggle) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactViewport = window.matchMedia('(max-width: 760px)');
  let effect = null;
  let running = false;
  let failed = false;
  let paused = false;
  try { paused = localStorage.getItem('zyte-background-paused') === 'true'; } catch {}

  const stop = () => {
    if (!effect || !running) return;
    cancelAnimationFrame(effect.req);
    running = false;
  };

  const destroy = () => {
    stop();
    const renderer = effect?.renderer;
    // Vanta can detach its canvas after a partial initialization failure.
    // Its teardown still expects that canvas to belong to this container.
    if (renderer?.domElement && renderer.domElement.parentNode !== background) {
      background.appendChild(renderer.domElement);
    }
    try { effect?.destroy(); } catch {
      // A failed decorative effect must never interrupt the rest of the page.
    } finally {
      renderer?.dispose();
      effect = null;
      background.replaceChildren();
      background.classList.remove('is-active');
      toggle.hidden = true;
    }
  };

  const sync = () => {
    if (reducedMotion.matches) {
      destroy();
      return;
    }
    if (document.hidden || failed) {
      stop();
      return;
    }
    if (!effect) {
      if (!window.VANTA?.NET || !window.THREE) return;
      try {
        effect = window.VANTA.NET({
          el: background,
          THREE: window.THREE,
          color: 0x22dd88,
          backgroundColor: 0x0c1212,
          backgroundAlpha: 0,
          points: compactViewport.matches ? 6 : 8,
          maxDistance: 21,
          spacing: 17,
          showDots: true,
          mouseControls: true,
          mouseEase: true,
          touchControls: false,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: Math.max(1, window.devicePixelRatio || 1),
          scaleMobile: Math.max(1.5, window.devicePixelRatio || 1),
        });
        if (!effect?.renderer || !background.querySelector('canvas')) throw new Error('Background unavailable');
        running = true;
        background.classList.add('is-active');
        toggle.hidden = false;
        effect.renderer.domElement.addEventListener('webglcontextlost', () => {
          failed = true;
          destroy();
        }, { once: true });
      } catch {
        failed = true;
        destroy();
        return;
      }
    }
    if (paused) stop();
    else if (!running) {
      effect.prevNow = null;
      effect.animationLoop();
      running = true;
    }
    toggle.textContent = paused ? 'Resume background' : 'Pause background';
  };

  toggle.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('zyte-background-paused', String(paused)); } catch {}
    sync();
  });
  reducedMotion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', event => event.persisted ? stop() : destroy());
  window.addEventListener('pageshow', sync);
  sync();
})();
