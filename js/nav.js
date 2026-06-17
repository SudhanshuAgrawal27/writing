(function () {
  // Fade in on load
  document.body.style.opacity = '0';
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.style.transition = 'opacity 0.3s ease';
      document.body.style.opacity = '1';
    });
  });

  // Identify current poem from URL
  var filename = window.location.pathname.split('/').pop();
  if (!filename || filename === '') filename = 'index.html';

  var currentIndex = -1;
  for (var i = 0; i < POEMS.length; i++) {
    if (POEMS[i].url === filename) {
      currentIndex = i;
      break;
    }
  }
  if (currentIndex === -1) currentIndex = 0;

  // Build slider dots
  var slider = document.querySelector('.poem-slider');
  if (slider) {
    POEMS.forEach(function (poem, i) {
      var dot = document.createElement('a');
      dot.href = poem.url;
      dot.className = 'slider-dot' + (i === currentIndex ? ' active' : '');
      dot.textContent = i + 1;
      dot.setAttribute('aria-label', poem.title);
      dot.addEventListener('click', function (e) {
        if (i !== currentIndex) {
          e.preventDefault();
          navigateTo(poem.url);
        } else {
          e.preventDefault();
        }
      });
      slider.appendChild(dot);
    });
  }

  // Wire up arrows
  var prevArrow = document.querySelector('.arrow-prev');
  var nextArrow = document.querySelector('.arrow-next');

  if (prevArrow) {
    prevArrow.disabled = currentIndex === 0;
    prevArrow.addEventListener('click', function () {
      if (currentIndex > 0) navigateTo(POEMS[currentIndex - 1].url);
    });
  }

  if (nextArrow) {
    nextArrow.disabled = currentIndex === POEMS.length - 1;
    nextArrow.addEventListener('click', function () {
      if (currentIndex < POEMS.length - 1) navigateTo(POEMS[currentIndex + 1].url);
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' && currentIndex < POEMS.length - 1) {
      navigateTo(POEMS[currentIndex + 1].url);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
      navigateTo(POEMS[currentIndex - 1].url);
    }
  });

  // Touch / swipe (left = next, right = previous — standard mobile)
  var touchStartX = 0;

  document.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < POEMS.length - 1) {
        navigateTo(POEMS[currentIndex + 1].url);
      } else if (diff < 0 && currentIndex > 0) {
        navigateTo(POEMS[currentIndex - 1].url);
      }
    }
  }, { passive: true });

  function navigateTo(url) {
    document.body.style.transition = 'opacity 0.2s ease';
    document.body.style.opacity = '0';
    setTimeout(function () {
      window.location.href = url;
    }, 200);
  }
})();
