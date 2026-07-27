(function () {
    const track = document.getElementById('pricingTrack');
    const prevBtn = document.getElementById('pricingPrev');
    const nextBtn = document.getElementById('pricingNext');
    const dotsWrap = document.getElementById('pricingDots');
    if (!track) return;

    const cards = Array.from(track.children);

    // build dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => scrollToCard(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function cardStep() {
      const card = cards[0];
      const style = getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || 0);
      return card.getBoundingClientRect().width + gap;
    }

    function scrollToCard(i) {
      track.scrollTo({ left: cardStep() * i, behavior: 'smooth' });
    }

    function updateUI() {
      const index = Math.round(track.scrollLeft / cardStep());
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      prevBtn.disabled = track.scrollLeft <= 4;
      nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    }

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: cardStep(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateUI);
    });
    window.addEventListener('resize', updateUI);
    updateUI();
  })();