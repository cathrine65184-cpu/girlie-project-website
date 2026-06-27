/**
 * Girlie Project — Digital Friendship Museum
 * Application logic: routing, rendering, map interaction
 */

var App = (function () {
  let currentPage = 'home';
  let currentStoryIndex = 0;

  /* ---- Navigation ---- */
  function navigate(page, storyId) {
    const target = document.getElementById('page-' + page);
    if (!target) return;

    // Fade out current page
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(function (p) {
      p.classList.remove('active');
    });

    // Update nav
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.classList.toggle('active', link.dataset.page === page);
    });

    // Show target
    target.classList.add('active');
    currentPage = page;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Page-specific init
    if (page === 'archive') {
      renderArchiveGrid();
      triggerReveal();
    } else if (page === 'story' && storyId) {
      renderStoryDetail(storyId);
    } else if (page === 'atlas') {
      initAtlas();
      triggerReveal();
    } else if (page === 'home') {
      triggerReveal();
    }
  }

  /* ---- Story Archive Grid ---- */
  function renderArchiveGrid() {
    const grid = document.getElementById('archive-grid');
    if (!grid) return;
    grid.innerHTML = '';

    STORIES.forEach(function (story, index) {
      const card = document.createElement('div');
      card.className = 'story-card reveal';
      card.style.transitionDelay = (index * 80) + 'ms';
      card.onclick = function () {
        navigate('story', story.id);
      };

      var photoHtml = story.scenePhoto
        ? '<div class="story-card-photo" style="background-image:url(\'' + story.scenePhoto + '\');background-size:cover;background-position:center;"></div>'
        : '<div class="story-card-photo"><span class="placeholder-initial">' + story.name.charAt(0) + '</span><span class="photo-label">Portrait · Pending</span></div>';

      card.innerHTML =
        photoHtml +
        '<div class="story-card-body">' +
          '<div class="story-card-meta">' +
            '<span>' + story.city + '</span>' +
            '<span class="meta-dot"></span>' +
            '<span>' + story.age + '岁</span>' +
            '<span class="meta-dot"></span>' +
            '<span>' + story.identity + '</span>' +
          '</div>' +
          '<h3 class="story-card-name">' + story.name + '</h3>' +
          '<p class="story-card-dream">' + story.dream + '</p>' +
          '<p class="story-card-quote">"' + story.quoteToGirls + '"</p>' +
        '</div>';

      grid.appendChild(card);
    });
  }

  /* ---- Story Detail Page ---- */
  function renderStoryDetail(storyId) {
    const storyIndex = STORIES.findIndex(function (s) {
      return s.id === storyId;
    });
    if (storyIndex === -1) return;
    currentStoryIndex = storyIndex;
    const story = STORIES[storyIndex];

    const container = document.getElementById('story-detail-content');
    if (!container) return;

    const themeTagsHtml = story.themes.map(function (t) {
      return '<span class="theme-tag">' + (THEME_LABELS[t] || t) + '</span>';
    }).join('');

    const storyParagraphs = story.story.map(function (p) {
      return '<p>' + p + '</p>';
    }).join('');

    const memoryItemsHtml = story.memoryItems.map(function (m) {
      return '<li class="memory-item"><span class="memory-icon"></span><span>' + m + '</span></li>';
    }).join('');

    // Navigation
    const prevStory = storyIndex > 0 ? STORIES[storyIndex - 1] : null;
    const nextStory = storyIndex < STORIES.length - 1 ? STORIES[storyIndex + 1] : null;

    let navHtml = '<div class="story-nav">';
    if (prevStory) {
      navHtml +=
        '<div class="story-nav-btn prev" onclick="App.navigate(\'story\', \'' + prevStory.id + '\')">' +
          '<div>' +
            '<div class="nav-label">Previous</div>' +
            '<div class="nav-name">' + prevStory.name + '</div>' +
          '</div>' +
        '</div>';
    } else {
      navHtml += '<div></div>';
    }
    if (nextStory) {
      navHtml +=
        '<div class="story-nav-btn next" onclick="App.navigate(\'story\', \'' + nextStory.id + '\')">' +
          '<div>' +
            '<div class="nav-label">Next</div>' +
            '<div class="nav-name">' + nextStory.name + '</div>' +
          '</div>' +
        '</div>';
    } else {
      navHtml += '<div></div>';
    }
    navHtml += '</div>';

    container.innerHTML =
      '<div class="story-detail-header">' +
        '<div class="story-detail-meta">' +
          '<span>' + story.country + '</span>' +
          '<span class="meta-dot"></span>' +
          '<span>' + story.city + '</span>' +
          '<span class="meta-dot"></span>' +
          '<span>' + story.age + '岁</span>' +
          '<span class="meta-dot"></span>' +
          '<span>' + story.identity + '</span>' +
        '</div>' +
        '<h1 class="story-detail-name">' + story.name + '</h1>' +
      '</div>' +

      '<div class="story-detail-photo">' +
        '<span class="placeholder-initial">' + story.name.charAt(0) + '</span>' +
        '<span class="photo-status">Portrait · Collection in progress</span>' +
      '</div>' +

      '<div class="story-section">' +
        '<div class="story-section-label">她的梦想</div>' +
        '<p class="story-dream">"' + story.dream + '"</p>' +
      '</div>' +

      '<div class="story-section">' +
        '<div class="story-section-label">她最好的朋友</div>' +
        '<div class="best-friend">' +
          '<div class="best-friend-nickname">' + story.bestFriend.nickname + '</div>' +
          '<p class="best-friend-met">' + story.bestFriend.howTheyMet + '</p>' +
          '<p class="best-friend-line">"' + story.bestFriend.oneLineDescription + '"</p>' +
        '</div>' +
      '</div>' +

      '<div class="story-section">' +
        '<div class="story-section-label">她想对世界女孩说的话</div>' +
        '<div class="story-quote">' +
          '<p class="story-quote-text">"' + story.quoteToGirls + '"</p>' +
        '</div>' +
      '</div>' +

      '<div class="story-section">' +
        '<div class="story-section-label">她的故事</div>' +
        '<div class="story-body">' + storyParagraphs + '</div>' +
      '</div>' +

      '<div class="story-section">' +
        '<div class="story-section-label">她保存的回忆</div>' +
        '<ul class="memory-list">' + memoryItemsHtml + '</ul>' +
      '</div>' +

      '<div class="story-section">' +
        '<div class="story-section-label">关联主题</div>' +
        '<div class="theme-tags">' + themeTagsHtml + '</div>' +
      '</div>' +

      navHtml;
  }

  /* ---- Friendship Atlas ---- */
  let atlasInitialized = false;

  function initAtlas() {
    const container = document.getElementById('atlas-map-container');
    if (!container) return;

    if (!atlasInitialized) {
      // Load SVG via fetch (local file)
      fetch('data/world-map.svg')
        .then(function (res) { return res.text(); })
        .then(function (svgText) {
          container.innerHTML = svgText;
          bindMapEvents();
        })
        .catch(function () {
          // Fallback: inline minimal SVG
          container.innerHTML = '<p style="text-align:center;padding:4rem;color:var(--color-ink-faint);">地图加载中...</p>';
        });
      atlasInitialized = true;
    }

    // Animate progress bar
    setTimeout(function () {
      const fill = document.getElementById('atlas-progress-fill');
      if (fill) fill.style.width = '2%';
    }, 300);
  }

  function bindMapEvents() {
    // Country click
    document.querySelectorAll('.map-country.has-stories').forEach(function (country) {
      country.addEventListener('click', function () {
        const countryCode = this.dataset.country;
        selectCountry(countryCode);
      });
    });

    // Marker click
    document.querySelectorAll('.map-marker').forEach(function (marker) {
      marker.addEventListener('click', function (e) {
        e.stopPropagation();
        const storyId = this.dataset.story;
        navigate('story', storyId);
      });
    });
  }

  function selectCountry(countryCode) {
    // Highlight country
    document.querySelectorAll('.map-country').forEach(function (c) {
      c.classList.remove('active');
    });
    const countryEl = document.getElementById('country-' + countryCode);
    if (countryEl) countryEl.classList.add('active');

    // Filter stories by country
    const countryStories = STORIES.filter(function (s) {
      return s.countryCode === countryCode;
    });

    const countryInfo = COUNTRY_DATA[countryCode];
    const panel = document.getElementById('atlas-panel');

    if (countryStories.length === 0) return;

    const storiesHtml = countryStories.map(function (story) {
      return (
        '<div class="atlas-story-link" onclick="App.navigate(\'story\', \'' + story.id + '\')">' +
          '<div class="link-photo">' + story.name.charAt(0) + '</div>' +
          '<div class="link-info">' +
            '<div class="link-name">' + story.name + '</div>' +
            '<div class="link-city">' + story.city + ' · ' + story.age + '岁</div>' +
          '</div>' +
          '<div class="link-arrow">→</div>' +
        '</div>'
      );
    }).join('');

    panel.innerHTML =
      '<div class="atlas-panel-header">' +
        '<div class="atlas-panel-country">' + countryInfo.name + '</div>' +
        '<div class="atlas-panel-count">' + countryStories.length + ' Story' + (countryStories.length > 1 ? 's' : '') + '</div>' +
      '</div>' +
      '<div class="atlas-panel-stories">' + storiesHtml + '</div>';
  }

  /* ---- Scroll Reveal ---- */
  function triggerReveal() {
    setTimeout(function () {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(function (el, index) {
        setTimeout(function () {
          el.classList.add('visible');
        }, index * 100);
      });
    }, 50);
  }

  /* ---- Init ---- */
  function init() {
    // Set home nav active
    document.querySelector('.nav-link[data-page="home"]').classList.add('active');

    // Scroll reveal observer for home page
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.15 });

      // Observe home reveals after load
      setTimeout(function () {
        document.querySelectorAll('#page-home .reveal').forEach(function (el) {
          observer.observe(el);
        });
      }, 100);
    } else {
      // Fallback: show all
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  // Run init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    navigate: navigate
  };
})();
