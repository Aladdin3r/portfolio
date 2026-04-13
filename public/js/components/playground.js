document.addEventListener('DOMContentLoaded', () => {
  const modal          = document.getElementById('playground-modal');
  const modalImg       = document.getElementById('modal-image');
  const modalTitle     = document.getElementById('modal-title');
  const backdrop       = document.getElementById('modal-backdrop');
  const closeBtn       = document.getElementById('modal-close');
  const flipper        = document.getElementById('pg-flipper-inner');
  const flipperWrapper = flipper ? flipper.closest('.pg-flipper') : null;
  const prevBtn        = document.getElementById('pg-prev');
  const nextBtn        = document.getElementById('pg-next');

  if (!modal) return;

  // Build ordered card data from the DOM
  const cards = Array.from(document.querySelectorAll('.playing-card')).map((c) => ({
    img:   c.dataset.img,
    title: c.dataset.title,
  }));

  let currentIndex = 0;
  let isAnimating  = false;

  // ── Show/hide chrome (title + nav arrows) ────────────────
  const showChrome = () => {
    modalTitle.classList.add('visible');
    prevBtn.classList.add('visible');
    nextBtn.classList.add('visible');
  };
  const hideChrome = () => {
    modalTitle.classList.remove('visible');
    prevBtn.classList.remove('visible');
    nextBtn.classList.remove('visible');
  };

  // ── Navigate to a card index: shrink → flip back → flip forward → expand ──
  const navigateTo = (newIndex) => {
    if (isAnimating) return;
    isAnimating = true;

    // Step 1: hide chrome + shrink
    hideChrome();
    flipperWrapper.classList.remove('expanded');

    // Step 2: flip back after shrink settles
    setTimeout(() => {
      flipper.classList.remove('flipped');

      // Step 3: swap image data + flip forward
      setTimeout(() => {
        currentIndex           = ((newIndex % cards.length) + cards.length) % cards.length;
        modalImg.src           = cards[currentIndex].img;
        modalImg.alt           = cards[currentIndex].title;
        modalTitle.textContent = cards[currentIndex].title;

        requestAnimationFrame(() => {
          flipper.classList.add('flipped');

          // Step 4: expand after flip lands
          setTimeout(() => {
            flipperWrapper.classList.add('expanded');

            // Step 5: chrome fades in as expand settles
            setTimeout(() => {
              showChrome();
              isAnimating = false;
            }, 350);
          }, 650);
        });
      }, 700);
    }, 400);
  };

  // ── Open modal ────────────────────────────────────────────
  const openModal = (index) => {
    currentIndex = index;
    modalImg.src   = cards[currentIndex].img;
    modalImg.alt   = cards[currentIndex].title;
    modalTitle.textContent = cards[currentIndex].title;
    hideChrome();

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Step 1: flip the card
    setTimeout(() => {
      flipper.classList.add('flipped');

      // Step 2: expand after flip lands
      setTimeout(() => {
        flipperWrapper.classList.add('expanded');

        // Step 3: chrome fades in as expand settles
        setTimeout(showChrome, 350);
      }, 650);
    }, 80);
  };

  // ── Close modal ───────────────────────────────────────────
  const closeModal = () => {
    if (isAnimating) return;
    hideChrome();
    flipperWrapper.classList.remove('expanded');

    setTimeout(() => {
      flipper.classList.remove('flipped');
      setTimeout(() => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }, 700);
    }, 400);
  };

  // ── Card clicks ───────────────────────────────────────────
  document.querySelectorAll('.playing-card').forEach((card, i) => {
    card.addEventListener('click', () => openModal(i));
  });

  // ── Nav buttons ───────────────────────────────────────────
  prevBtn.addEventListener('click', () => navigateTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => navigateTo(currentIndex + 1));

  // ── Close triggers ────────────────────────────────────────
  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape')       closeModal();
    if (e.key === 'ArrowLeft')    navigateTo(currentIndex - 1);
    if (e.key === 'ArrowRight')   navigateTo(currentIndex + 1);
  });
});
