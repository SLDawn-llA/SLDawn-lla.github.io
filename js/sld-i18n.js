(function(global) {
  'use strict';

  var LANG_KEY = 'sldawn-lang';

  var MENU = {
    '首页': 'Home',
    '关于': 'About',
    '项目': 'Projects',
    '摄影': 'Photography',
    '标签': 'Tags',
    '分类': 'Categories',
    '归档': 'Archives'
  };

  var UI = {
    'Read more': 'Read more',
    '阅读全文': 'Read more',
    'Older': 'Older',
    'Newer': 'Newer',
    '上一页': 'Prev',
    '下一页': 'Next',
    'Search': 'Search',
    '搜索': 'Search',
    'Toggle Dark Mode': 'Toggle theme',
    '切换明暗模式': 'Toggle theme',
    'LOADING': 'LOADING',
    'Powered by': 'Powered by',
    '由 Hexo & NexT.Mist 驱动': 'Powered by Hexo & NexT.Mist',
    '站点概览': 'Overview',
    '文章目录': 'Contents',
    '分类': 'Categories',
    '标签': 'Tags',
    '友情链接': 'Links',
    '社交': 'Social',
    '本站总访客数': 'Visitors',
    '本站总访问量': 'Pageviews',
    '发表于': 'Posted',
    '分类于': 'In',
    '更新于': 'Updated',
    '本文字数': 'Words',
    '阅读时长': 'Reading time',
    '分钟': 'min'
  };

  var I18N = {
    home: {
      'home.hero.copy': 'Building open-source tools and keeping everyday scenes in frame — turning ideas into things people can see and use.',
      'home.hero.action.projects': 'GitHub Projects',
      'home.hero.action.photography': 'Photography',
      'home.hero.action.archives': 'Archives',
      'home.band.1.body': 'Tools, experiments, and learning notes live on GitHub — the homepage links straight to the repos.',
      'home.band.2.body': 'A dedicated space for travel, street, campus, and everyday photo sets.',
      'home.band.3.body': 'Long-form writing stays below as the main thread for thinking and technical notes.'
    },
    photo: {
      'photo.stage.label': 'PHOTOGRAPHY',
      'photo.stage.enter': 'CLICK THE CARDS',
      'photo.wall.kicker': 'SHOWOUT / 2026',
      'photo.wall.title': 'Moments kept in frame'
    },
    pages: {
      '/about/': {
        title: 'About Me',
        body: '<h2 id="关于我"><span class="headerlink"></span>About Me</h2><p>Welcome to my personal blog.</p><p>This site collects learning notes, reflections, and observations from development, design, and everyday life.</p><h2 id="联系方式"><span class="headerlink"></span>Contact</h2><ul><li>GitHub: <a href="https://github.com/SLDawn-llA">SLDawn-llA</a></li><li>Email: <a href="mailto:2833802906@qq.com">2833802906@qq.com</a></li></ul><hr><p><em>Powered by Hexo &amp; NexT.Mist</em></p>'
      },
      '/categories/': { title: 'Categories' },
      '/tags/': { title: 'Tags' },
      '/archives/': { title: 'Archives' }
    },
    posts: {
      '/2026/01/06/我的第一篇博客/': {
        title: 'A new insight into the scales of learning',
        categories: ['Thoughts'],
        tags: ['Blog']
      },
      '/2024/01/06/hexo-next-guide/': {
        title: 'Hexo & NexT.Mist Theme Guide',
        categories: ['Tech'],
        tags: ['Hexo', 'NexT', 'Tutorial']
      },
      '/2024/01/06/hello-world/': {
        title: 'Hello World',
        categories: ['Notes'],
        tags: ['Blog', 'Hexo']
      }
    },
    categoryNames: {
      '思考': 'Thoughts',
      '技术': 'Tech',
      '随笔': 'Notes'
    },
    tagNames: {
      '博客': 'Blog',
      '教程': 'Tutorial'
    }
  };

  if (global.SLDawnPostBodies) {
    Object.keys(global.SLDawnPostBodies).forEach(function(path) {
      if (!I18N.posts[path]) I18N.posts[path] = {};
      I18N.posts[path].body = global.SLDawnPostBodies[path];
    });
  }

  function swapPostBody(bodyEl, lang, post) {
    if (!bodyEl || !post || !post.body) return;
    if (!bodyEl.dataset.sldZhBody) bodyEl.dataset.sldZhBody = bodyEl.innerHTML;
    bodyEl.innerHTML = lang === 'en' ? post.body : bodyEl.dataset.sldZhBody;
  }

  function normalizePath(pathname) {
    if (!pathname || pathname === '/index.html') return '/';
    if (pathname.endsWith('/index.html')) {
      return pathname.slice(0, -('/index.html'.length)) || '/';
    }
    return pathname.endsWith('/') ? pathname : pathname + '/';
  }

  function getLang() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved === 'en' || saved === 'zh') return saved;
    } catch (error) {}
    return 'zh';
  }

  function setLang(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang === 'en' ? 'en' : 'zh');
    } catch (error) {}
    applyLang(lang);
  }

  function stripIconText(link) {
    var clone = link.cloneNode(true);
    clone.querySelectorAll('i,svg').forEach(function(node) {
      node.remove();
    });
    return clone.textContent.replace(/\s+/g, ' ').trim();
  }

  function setLinkLabel(link, text) {
    var icon = link.querySelector('i,svg');
    link.textContent = '';
    if (icon) link.appendChild(icon);
    link.appendChild(document.createTextNode(text));
  }

  function translateNodeText(node, lang) {
    if (!node || lang !== 'en') return;
    var text = node.textContent.trim();
    if (UI[text]) node.textContent = UI[text];
  }

  function applyHome(lang) {
    document.querySelectorAll('[data-sld-i18n]').forEach(function(node) {
      var key = node.getAttribute('data-sld-i18n');
      if (!node.dataset.sldZhText) node.dataset.sldZhText = node.textContent;
      if (lang === 'en' && I18N.home[key]) node.textContent = I18N.home[key];
      else node.textContent = node.dataset.sldZhText;
    });
  }

  function applyPhoto(lang) {
    savePhotoDefaults();
    var map = I18N.photo;
    var stageP = document.querySelector('.sld-photo-stage-copy p');
    var enter = document.querySelector('.sld-photo-enter');
    var wallP = document.querySelector('.sld-photo-wall-head p');
    var wallH = document.querySelector('.sld-photo-wall-head h2');
    if (lang === 'en') {
      if (stageP) stageP.textContent = map['photo.stage.label'];
      if (enter) enter.textContent = map['photo.stage.enter'];
      if (wallP) wallP.textContent = map['photo.wall.kicker'];
      if (wallH) wallH.textContent = map['photo.wall.title'];
    } else {
      if (stageP && stageP.dataset.sldPhotoZh) stageP.textContent = stageP.dataset.sldPhotoZh;
      if (enter && enter.dataset.sldPhotoZh) enter.textContent = enter.dataset.sldPhotoZh;
      if (wallP && wallP.dataset.sldPhotoZh) wallP.textContent = wallP.dataset.sldPhotoZh;
      if (wallH && wallH.dataset.sldPhotoZh) wallH.textContent = wallH.dataset.sldPhotoZh;
    }
  }

  function savePhotoDefaults() {
    var stageP = document.querySelector('.sld-photo-stage-copy p');
    if (stageP && !stageP.dataset.sldPhotoZh) stageP.dataset.sldPhotoZh = stageP.textContent;
    var enter = document.querySelector('.sld-photo-enter');
    if (enter && !enter.dataset.sldPhotoZh) enter.dataset.sldPhotoZh = enter.textContent;
    var wallP = document.querySelector('.sld-photo-wall-head p');
    if (wallP && !wallP.dataset.sldPhotoZh) wallP.dataset.sldPhotoZh = wallP.textContent;
    var wallH = document.querySelector('.sld-photo-wall-head h2');
    if (wallH && !wallH.dataset.sldPhotoZh) wallH.dataset.sldPhotoZh = wallH.textContent;
  }

  function applyPage(lang, path) {
    var page = I18N.pages[path];
    if (!page) return;

    var titleEl = document.querySelector('.post-title, .page-title, .posts-expand .post-title');
    if (titleEl && page.title) {
      if (!titleEl.dataset.sldZhTitle) titleEl.dataset.sldZhTitle = titleEl.textContent.trim();
      titleEl.textContent = lang === 'en' ? page.title : titleEl.dataset.sldZhTitle;
    }

    if (page.body) {
      var body = document.querySelector('.post-body');
      if (body) {
        if (!body.dataset.sldZhBody) body.dataset.sldZhBody = body.innerHTML;
        body.innerHTML = lang === 'en' ? page.body : body.dataset.sldZhBody;
      }
    }
  }

  function applyPostMeta(lang, path) {
    var post = I18N.posts[path];
    if (!post) return;

    var titleLink = document.querySelector('.post-title-link, .post-title .post-title-link');
    if (titleLink && post.title) {
      if (!titleLink.dataset.sldZhTitle) titleLink.dataset.sldZhTitle = titleLink.textContent.trim();
      titleLink.textContent = lang === 'en' ? post.title : titleLink.dataset.sldZhTitle;
    }

    document.querySelectorAll('.post-meta-item-category a').forEach(function(link, index) {
      if (!link.dataset.sldZhLabel) link.dataset.sldZhLabel = link.textContent.trim();
      if (lang === 'en' && post.categories && post.categories[index]) {
        link.textContent = post.categories[index];
      } else if (lang === 'en' && I18N.categoryNames[link.dataset.sldZhLabel]) {
        link.textContent = I18N.categoryNames[link.dataset.sldZhLabel];
      } else {
        link.textContent = link.dataset.sldZhLabel;
      }
    });

    document.querySelectorAll('.post-meta-item-tag a').forEach(function(link, index) {
      if (!link.dataset.sldZhLabel) link.dataset.sldZhLabel = link.textContent.trim();
      if (lang === 'en' && post.tags && post.tags[index]) {
        link.textContent = post.tags[index];
      } else if (lang === 'en' && I18N.tagNames[link.dataset.sldZhLabel]) {
        link.textContent = I18N.tagNames[link.dataset.sldZhLabel];
      } else {
        link.textContent = link.dataset.sldZhLabel;
      }
    });

    var body = document.querySelector('.post-body');
    swapPostBody(body, lang, post);
  }

  function applyPostList(lang) {
    document.querySelectorAll('.post-block').forEach(function(block) {
      var link = block.querySelector('.post-title-link');
      if (!link || !link.href) return;
      var path = normalizePath(new URL(link.href, location.origin).pathname);
      var post = I18N.posts[path];
      if (!post) return;
      if (post.title) {
        if (!link.dataset.sldZhTitle) link.dataset.sldZhTitle = link.textContent.trim();
        link.textContent = lang === 'en' ? post.title : link.dataset.sldZhTitle;
      }

      if (post.body) {
        swapPostBody(block.querySelector('.post-body'), lang, post);
      }
    });

    document.querySelectorAll('.post-button .btn').forEach(function(btn) {
      if (!btn.dataset.sldZhLabel) btn.dataset.sldZhLabel = btn.textContent.trim();
      btn.textContent = lang === 'en' ? (UI[btn.dataset.sldZhLabel] || 'Read more') : btn.dataset.sldZhLabel;
    });
  }

  function applyMenu(lang) {
    document.querySelectorAll('.menu-item a').forEach(function(link) {
      var zh = link.dataset.sldZhLabel || stripIconText(link);
      if (!link.dataset.sldZhLabel) link.dataset.sldZhLabel = zh;
      var en = MENU[zh] || zh;
      setLinkLabel(link, lang === 'en' ? en : zh);
    });
  }

  function applyUiStrings(lang) {
    document.querySelectorAll('.sidebar-nav-item, .sidebar-nav-overview, .sidebar-nav-toc, .site-state-name, .footer .powered, .footer .copyright, .post-meta-item-text').forEach(function(node) {
      if (!node.dataset.sldZhLabel) node.dataset.sldZhLabel = node.textContent.trim();
      if (lang === 'en' && UI[node.dataset.sldZhLabel]) {
        node.textContent = UI[node.dataset.sldZhLabel];
      } else if (lang === 'zh') {
        node.textContent = node.dataset.sldZhLabel;
      }
    });

    document.querySelectorAll('.pagination a, .toggle-darkmode, .sld-loader-text').forEach(function(node) {
      translateNodeText(node, lang);
    });

    var darkBtn = document.querySelector('.toggle-darkmode');
    if (darkBtn) {
      if (!darkBtn.dataset.sldZhTitle) darkBtn.dataset.sldZhTitle = darkBtn.getAttribute('title') || '切换明暗模式';
      darkBtn.setAttribute('title', lang === 'en' ? 'Toggle theme' : darkBtn.dataset.sldZhTitle);
      darkBtn.setAttribute('aria-label', lang === 'en' ? 'Toggle theme' : darkBtn.dataset.sldZhTitle);
    }
  }

  function applyCategoryTagPages(lang) {
    document.querySelectorAll('.category-list-link, .tag-list-link').forEach(function(link) {
      var zh = link.dataset.sldZhLabel || link.textContent.trim();
      if (!link.dataset.sldZhLabel) link.dataset.sldZhLabel = zh;
      if (lang === 'en' && I18N.categoryNames[zh]) link.textContent = I18N.categoryNames[zh];
      else if (lang === 'en' && I18N.tagNames[zh]) link.textContent = I18N.tagNames[zh];
      else link.textContent = zh;
    });
  }

  function updateSwitcher(lang) {
    var switcher = document.querySelector('.sld-lang-switch');
    if (!switcher) return;
    switcher.classList.toggle('is-en', lang === 'en');
    switcher.querySelectorAll('.sld-lang-option').forEach(function(btn) {
      var active = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function applyLang(lang) {
    lang = lang === 'en' ? 'en' : 'zh';
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    document.documentElement.setAttribute('data-sld-lang', lang);

    var path = normalizePath(location.pathname);
    savePhotoDefaults();
    applyMenu(lang);
    applyUiStrings(lang);
    applyHome(lang);
    applyPhoto(lang);
    applyPage(lang, path);
    applyPostMeta(lang, path);
    applyPostList(lang);
    applyCategoryTagPages(lang);
    updateSwitcher(lang);
  }

  function initSwitcher() {
    var switcher = document.querySelector('.sld-lang-switch');
    if (!switcher || switcher.dataset.sldBound === 'true') return;
    switcher.dataset.sldBound = 'true';
    switcher.addEventListener('click', function(event) {
      var btn = event.target.closest('.sld-lang-option');
      if (!btn) return;
      setLang(btn.dataset.lang);
    });
  }

  function redirectLegacyEnglishRoute() {
    var match = location.pathname.match(/^\/en(\/.*)?$/);
    if (!match) return false;
    try {
      localStorage.setItem(LANG_KEY, 'en');
    } catch (error) {}
    var nextPath = match[1] || '/';
    if (nextPath !== '/' && !nextPath.endsWith('/')) nextPath += '/';
    location.replace(nextPath + location.search + location.hash);
    return true;
  }

  if (redirectLegacyEnglishRoute()) return;

  function boot() {
    applyLang(getLang());
    initSwitcher();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  global.SLDawnI18n = {
    applyLang: applyLang,
    getLang: getLang,
    setLang: setLang,
    initSwitcher: initSwitcher
  };
})(window);
