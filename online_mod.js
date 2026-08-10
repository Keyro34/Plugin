(function () {
  ("use strict");

  var year;
  var namemovie;

  function endsWithSlash(str) {
    return str.charAt(str.length - 1) === '/';
  }

  function startsWithHttp(str) {
    return str.indexOf('http') === 0;
  }

  function repeatChar(ch, n) {
    var s = '';
    for (var i = 0; i < n; i++) s += ch;
    return s;
  }

  function fetchCompat(url, options) {
    options = options || {};
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(options.method || 'GET', url, true);

      var headers = options.headers || {};
      for (var h in headers) {
        if (headers.hasOwnProperty(h)) {
          try {
            xhr.setRequestHeader(h, headers[h]);
          } catch (e) {}
        }
      }

      xhr.onload = function () {
        resolve({
          ok: xhr.status >= 200 && xhr.status < 300,
          status: xhr.status,
          text: function () {
            return Promise.resolve(xhr.responseText);
          }
        });
      };
      xhr.onerror = function () {
        reject(new Error('Network error'));
      };
      xhr.ontimeout = function () {
        reject(new Error('Request timeout'));
      };

      xhr.send(options.body || null);
    });
  }

  function generateAuthCodeQuick() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  function buildAuthUrlQuick() {
    var proxyUrl = (Lampa.Storage.get('rezka_video_proxy', 'https://rezka.lampasochka.workers.dev/') || 'https://rezka.lampasochka.workers.dev/').trim();
    if (!startsWithHttp(proxyUrl)) {
      Lampa.Noty.show('Сначала настройте URL прокси-воркера в настройках плагина');
      return null;
    }
    if (!endsWithSlash(proxyUrl)) proxyUrl += '/';

    var host = (Lampa.Storage.get('rezka_video_host', 'https://rezka.ag') || 'https://rezka.ag').trim();
    var hostBare = host.replace(/^https?:\/\//i, '').replace(/\/+$/, '');

    var code = generateAuthCodeQuick();
    var authUrl = proxyUrl + 'auth/' + code + '/' + encodeURIComponent(hostBare);

    return { proxyUrl: proxyUrl, code: code, authUrl: authUrl };
  }

  function pollAuthCodeQuick(proxyUrl, code, statusSelector, waitingText, onSuccess, onTimeout) {
    var attempts = 0;
    window.rezkaVideoAuthInterval = setInterval(function () {
      attempts++;
      if (attempts > 90) {
        clearInterval(window.rezkaVideoAuthInterval);
        $(statusSelector).text('Время ожидания истекло. Попробуйте снова.').css('color', '#ff5722');
        if (onTimeout) onTimeout();
        return;
      }

      $(statusSelector).text(waitingText + repeatChar('.', attempts % 4));

      $.ajax({
        url: proxyUrl + 'check?code=' + code,
        type: 'GET',
        dataType: 'json',
        success: function (d) {
          if (d && (d.status === 'success' || d.cookie)) {
            clearInterval(window.rezkaVideoAuthInterval);
            Lampa.Storage.set('rezka_video_cookie', d.cookie);
            console.log('[RezkaVideo] cookie saved:', d.cookie);

            var tail = (d.cookie || '').slice(-16);
            $(statusSelector).html('<span style="color: #4CAF50;">Успешно! Cookie сохранены (…' + tail + ').</span>');

            if (onSuccess) setTimeout(onSuccess, 1500);
          }
        },
        error: function () {}
      });
    }, 2000);
  }

  function closeAuthModalQuick(modalClass) {
    clearInterval(window.rezkaVideoAuthInterval);
    Lampa.Modal.close();
    $(modalClass).remove();
    try {
      Lampa.Controller.toggle('content');
    } catch (e) {}
  }

  function openQrAuthModalQuick(onDone) {
    var auth = buildAuthUrlQuick();
    if (!auth) return;

    var modalHtml = $(
      '<div style="text-align: center; padding: 20px;">' +
        '<div style="margin-bottom: 20px; font-size: 1.2em; color: #fff;">' +
          'Отсканируйте код камерой телефона<br>' +
          '<span style="font-size: 0.8em; opacity: 0.7;">или перейдите по ссылке:</span><br>' +
          '<a href="' + auth.authUrl + '" target="_blank" style="font-size: 0.8em; color: #a335ff; word-break: break-all;">' + auth.authUrl + '</a>' +
        '</div>' +
        '<div id="rezka_qr_container_quick" style="background: white; padding: 15px; display: inline-block; border-radius: 10px;"></div>' +
        '<div id="rezka_qr_status_quick" style="margin-top: 20px; font-size: 1.1em; color: #e5e5e5;">Ожидание сканирования...</div>' +
      '</div>'
    );

    function finish() {
      closeAuthModalQuick('.modal--medium');
      if (onDone) onDone();
    }

    Lampa.Modal.open({
      title: 'Авторизация HDRezka',
      html: modalHtml,
      size: 'medium',
      mask: true,
      onBack: function () { closeAuthModalQuick('.modal--medium'); }
    });

    var qrImgUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(auth.authUrl);
    $('#rezka_qr_container_quick').html(
      '<img src="' + qrImgUrl + '" width="250" height="250" alt="QR" onerror="this.parentElement.innerHTML=' +
      "'<div style=\\'color:#333;font-size:0.9em;padding:20px;\\'>Не удалось загрузить QR. Используйте ссылку выше.</div>'" +
      '">'
    );

    pollAuthCodeQuick(auth.proxyUrl, auth.code, '#rezka_qr_status_quick', 'Ожидание решения защиты на телефоне', finish, null);
  }

  function openTvAuthModalQuick(onDone) {
    var auth = buildAuthUrlQuick();
    if (!auth) return;

    var modalHtml = $(
      '<div style="padding: 10px;">' +
        '<iframe src="' + auth.authUrl + '" style="width:100%;height:60vh;border:none;background:#fff;border-radius:6px;"></iframe>' +
        '<div id="rezka_tv_status_quick" style="margin-top: 15px; font-size: 1.1em; color: #e5e5e5; text-align:center;">Ожидание прохождения проверки...</div>' +
      '</div>'
    );

    function finish() {
      closeAuthModalQuick('.modal--large');
      if (onDone) onDone();
    }

    Lampa.Modal.open({
      title: 'Проверка HDRezka',
      html: modalHtml,
      size: 'large',
      mask: true,
      onBack: function () { closeAuthModalQuick('.modal--large'); }
    });

    pollAuthCodeQuick(auth.proxyUrl, auth.code, '#rezka_tv_status_quick', 'Ожидание решения защиты', finish, null);
  }

  function showCookieExpiredChoice(retryFn) {
    Lampa.Select.show({
      title: 'Cookie Rezka устарели или отсутствуют',
      items: [
        { title: 'Пройти проверку в Lampa', method: 'tv' },
        { title: 'Через QR-код на телефоне', method: 'qr' }
      ],
      onBack: function () {
        Lampa.Controller.toggle('content');
      },
      onSelect: function (item) {
        if (item.method === 'tv') {
          openTvAuthModalQuick(retryFn);
        } else {
          openQrAuthModalQuick(retryFn);
        }
      }
    });
  }

  function hasExplicitBotMarkers(text) {
    return text.indexOf("Проверяем, что вы не бот") !== -1 || text.indexOf("Anubis") !== -1;
  }

  function looksLikeBotBlockHtml(text, hasCookie) {
    if (hasExplicitBotMarkers(text)) return true;
    if (!hasCookie && text.indexOf("b-content") === -1) return true;
    return false;
  }

  function getSettings() {
    var host = (Lampa.Storage.get('rezka_video_host', 'https://rezka.ag') || 'https://rezka.ag').trim().replace(/\/+$/, '');
    var cookie = (Lampa.Storage.get('rezka_video_cookie', '') || '').trim();
    var proxy = (Lampa.Storage.get('rezka_video_proxy', 'https://rezka.lampasochka.workers.dev/') || 'https://rezka.lampasochka.workers.dev/').trim();
    if (proxy && !endsWithSlash(proxy)) {
      proxy += '/';
    }
    return { host: host, cookie: cookie, proxy: proxy };
  }

  // Поиск фильма на Rezka
  function searchRezkaForVideo(name, ye) {
    var settings = getSettings();
    var host = settings.host;
    var cookie = settings.cookie;
    var proxy = settings.proxy;
    var path = host + "/search/?do=search&subaction=search&q=" + encodeURIComponent(name) + (ye ? "+" + ye : "");
    var searchUrl = proxy;
    if (cookie) {
      searchUrl += "param/Cookie=" + encodeURIComponent(cookie) + "/";
    }
    searchUrl += path;

    console.log('[RezkaVideo] searching:', searchUrl);

    return fetchCompat(searchUrl, {
      method: "GET",
      headers: { 
        "Content-Type": "text/html",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    }).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    }).then(function (html) {
      var dom = new DOMParser().parseFromString(html, "text/html");
      var items = dom.querySelectorAll(".b-content__inline_item");
      
      if (!items || items.length === 0) {
        Lampa.Loading.stop();
        if (looksLikeBotBlockHtml(html, !!cookie)) {
          showCookieExpiredChoice(function() {
            Lampa.Loading.start();
            searchRezkaForVideo(name, ye);
          });
        } else {
          Lampa.Noty.show('Фильм не найден на Rezka');
        }
        return;
      }

      var item = items[0];
      var linkEl = item.querySelector(".b-content__inline_item-link");
      namemovie = linkEl ? linkEl.innerText : "";
      var itemUrl = linkEl ? linkEl.getAttribute("href") : "";
      
      if (!itemUrl) {
        Lampa.Noty.show('Не найден URL фильма');
        Lampa.Loading.stop();
        return;
      }
      
      if (!itemUrl.startsWith('http')) {
        itemUrl = host + itemUrl;
      }
      
      // Получаем видео со страницы фильма
      getVideoFromPage(itemUrl);
    }).catch(function (e) {
      console.error('[RezkaVideo] search error:', e);
      Lampa.Noty.show('Ошибка: ' + e.message);
      Lampa.Loading.stop();
    });
  }

  // Получение видео со страницы фильма
  function getVideoFromPage(pageUrl) {
    var settings = getSettings();
    var proxy = settings.proxy;
    var cookie = settings.cookie;
    
    var fullUrl = proxy;
    if (cookie) {
      fullUrl += "param/Cookie=" + encodeURIComponent(cookie) + "/";
    }
    fullUrl += "param/Referer=" + encodeURIComponent(pageUrl) + "/";
    fullUrl += pageUrl;

    console.log('[RezkaVideo] getting video from:', fullUrl);

    fetchCompat(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "text/html",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    }).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    }).then(function (html) {
      var videoUrl = extractVideoUrl(html);
      if (videoUrl) {
        showVideo(videoUrl);
      } else {
        Lampa.Noty.show('Не найдена ссылка на видео');
        Lampa.Loading.stop();
      }
    }).catch(function (e) {
      console.error('[RezkaVideo] getVideo error:', e);
      Lampa.Noty.show('Ошибка получения видео: ' + e.message);
      Lampa.Loading.stop();
    });
  }

  // Извлечение URL видео из HTML
  function extractVideoUrl(html) {
    // Метод 1: CDN ссылки
    var cdnMatches = html.match(/https?:\/\/[a-z0-9\-]+\.cdn[^"'\s<>]+\.(?:mp4|m3u8)/gi);
    if (cdnMatches && cdnMatches.length > 0) {
      return cdnMatches[0];
    }

    // Метод 2: Поиск в скриптах
    var scriptMatch = html.match(/file\s*:\s*["']([^"']+\.(?:mp4|m3u8)[^"']*)["']/);
    if (scriptMatch) {
      return scriptMatch[1];
    }

    // Метод 3: video тег
    var videoMatch = html.match(/<video[^>]*src=["']([^"']+)["']/);
    if (videoMatch) {
      return videoMatch[1];
    }

    // Метод 4: source тег
    var sourceMatch = html.match(/<source[^>]*src=["']([^"']+\.(?:mp4|m3u8)[^"']*)["']/);
    if (sourceMatch) {
      return sourceMatch[1];
    }

    // Метод 5: data-атрибуты
    var dataMatch = html.match(/data-(?:video|url|src)=["']([^"']+\.(?:mp4|m3u8)[^"']*)["']/);
    if (dataMatch) {
      return dataMatch[1];
    }

    // Метод 6: Любая ссылка на видео
    var anyMatch = html.match(/https?:\/\/[^\s<>"']+\.(?:mp4|m3u8|webm|mkv)[^\s<>"']*/i);
    if (anyMatch) {
      return anyMatch[0];
    }

    return null;
  }

  // Показ видео в модальном окне
  function showVideo(videoUrl) {
    Lampa.Loading.stop();
    
    if (videoUrl.startsWith('//')) {
      videoUrl = 'https:' + videoUrl;
    }

    var isVideo = /\.(mp4|m3u8|webm|mkv|avi|mov|flv|wmv|ts)$/i.test(videoUrl);
    
    var modalHtml;
    if (isVideo) {
      modalHtml = $(
        '<div style="width:100%;display:flex;justify-content:center;align-items:center;background:#000;border-radius:8px;overflow:hidden;">' +
          '<video controls autoplay style="width:100%;max-height:80vh;background:#000;" src="' + videoUrl + '"></video>' +
        '</div>'
      );
    } else {
      modalHtml = $(
        '<div style="width:100%;height:80vh;background:#000;border-radius:8px;overflow:hidden;">' +
          '<iframe src="' + videoUrl + '" style="width:100%;height:100%;border:none;" allowfullscreen></iframe>' +
        '</div>'
      );
    }

    if (!document.getElementById("rezka-video-style")) {
      var style = document.createElement("style");
      style.id = "rezka-video-style";
      style.textContent = 
        '.video-modal .modal__body{padding:0!important;background:#000;}' +
        '.video-modal .modal__head{background:#1a1a1a;border-bottom:1px solid #333;}';
      document.head.appendChild(style);
    }

    Lampa.Modal.open({
      title: namemovie || "Видео с Rezka",
      html: modalHtml,
      size: "large",
      className: "video-modal",
      mask: true,
      onBack: function () {
        Lampa.Modal.close();
        $(".modal--large").remove();
        Lampa.Controller.toggle("content");
        var v = document.querySelector("video");
        if (v) { v.pause(); v.src = ''; v.load(); }
      }
    });
  }

  // Получение английского названия из TMDB
  function getEnTitle(id, type) {
    var tmdbType = type === 'movie' ? 'movie' : 'tv';
    var cacheKey = tmdbType + '_' + id;

    window.__tmdbCache = window.__tmdbCache || {};
    window.__tmdbFallback = window.__tmdbFallback || {};

    var cached = window.__tmdbCache[cacheKey];
    var fallback = window.__tmdbFallback[cacheKey] || '';

    var promise = cached ? Promise.resolve(cached) : new Promise(function(res, rej) {
      Lampa.Api.sources.tmdb.get(tmdbType + '/' + id, { append_to_response: 'translations' }, res, rej);
    }).then(function(data) {
      var tr = (data && data.translations && data.translations.translations) || [];
      window.__tmdbCache[cacheKey] = tr;
      if (data && data.original_language === 'en') {
        fallback = (data && data.title) || (data && data.name) || (data && data.original_title) || '';
      }
      window.__tmdbFallback[cacheKey] = fallback;
      return tr;
    });

    return promise.then(function(tr) {
      var enTitle = '';
      var enList = tr.filter(function(t) { return t.iso_639_1 === 'en'; });
      for (var i = 0; i < enList.length; i++) {
        var cand = enList[i];
        var title = (cand && cand.data && cand.data.title) || (cand && cand.data && cand.data.name);
        if (title) { enTitle = title; break; }
      }
      if (!enTitle) enTitle = fallback;

      if (enTitle) {
        searchRezkaForVideo(normalizeTitle(enTitle), year);
      } else {
        Lampa.Noty.show('Английское название не найдено');
        Lampa.Loading.stop();
      }
    }).catch(function(e) {
      console.error('[RezkaVideo] TMDB error:', e);
      Lampa.Noty.show('Ошибка TMDB: ' + (e.message || ''));
      Lampa.Loading.stop();
    });
  }

  function normalizeTitle(str) {
    return str.toLowerCase()
      .replace(/[\s.,:;’'`!?]+/g, " ")
      .replace(/[\-\u2010-\u2015]+/g, "-")
      .replace(/ё/g, "е")
      .trim();
  }

  function startPlugin() {
    if (window.rezkaVideoStarted) return;
    window.rezkaVideoStarted = true;

    function genCode() {
      return Math.floor(1000 + Math.random() * 9000).toString();
    }

    try {
      Lampa.SettingsApi.addComponent({
        component: 'rezka_video',
        name: 'Rezka Video',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>'
      });

      Lampa.SettingsApi.addParam({
        component: 'rezka_video',
        param: {
          name: 'rezka_video_host',
          type: 'input',
          placeholder: 'https://rezka.ag',
          values: Lampa.Storage.get('rezka_video_host', 'https://rezka.ag'),
          default: 'https://rezka.ag'
        },
        field: {
          name: 'Зеркало HDRezka',
          description: 'Адрес зеркала'
        },
        onChange: function(v) { Lampa.Storage.set('rezka_video_host', v); }
      });

      Lampa.SettingsApi.addParam({
        component: 'rezka_video',
        param: {
          name: 'rezka_video_proxy',
          type: 'input',
          placeholder: 'https://ваш-воркер.workers.dev/',
          values: Lampa.Storage.get('rezka_video_proxy', 'https://rezka.lampasochka.workers.dev/'),
          default: 'https://rezka.lampasochka.workers.dev/'
        },
        field: {
          name: 'CORS Прокси',
          description: 'URL Cloudflare Worker'
        },
        onChange: function(v) { Lampa.Storage.set('rezka_video_proxy', v); }
      });

      Lampa.SettingsApi.addParam({
        component: 'rezka_video',
        param: {
          name: 'rezka_video_cookie',
          type: 'input',
          placeholder: 'вставьте cookie',
          values: Lampa.Storage.get('rezka_video_cookie', ''),
          default: ''
        },
        field: {
          name: 'Cookie (ручной ввод)'
        },
        onChange: function(v) { Lampa.Storage.set('rezka_video_cookie', v); }
      });

      function pollAuth(pUrl, code, sel, text, onOk, onTimeout) {
        var attempts = 0;
        window.rezkaVideoPoll = setInterval(function() {
          attempts++;
          if (attempts > 90) {
            clearInterval(window.rezkaVideoPoll);
            $(sel).text('Время истекло').css('color', '#ff5722');
            if (onTimeout) onTimeout();
            return;
          }
          $(sel).text(text + repeatChar('.', attempts % 4));
          $.ajax({
            url: pUrl + 'check?code=' + code,
            type: 'GET',
            dataType: 'json',
            success: function(d) {
              if (d && (d.status === 'success' || d.cookie)) {
                clearInterval(window.rezkaVideoPoll);
                Lampa.Storage.set('rezka_video_cookie', d.cookie);
                var tail = (d.cookie || '').slice(-16);
                $(sel).html('<span style="color:#4CAF50;">Успешно! …' + tail + '</span>');
                try {
                  $('.settings-param[data-name="rezka_video_cookie"] .settings-param__value').text(d.cookie);
                } catch(e) {}
                if (onOk) setTimeout(onOk, 1500);
              }
            }
          });
        }, 2000);
      }

      function closeAuth(cls) {
        clearInterval(window.rezkaVideoPoll);
        Lampa.Modal.close();
        $(cls).remove();
        try { Lampa.Controller.toggle('settings_component'); } catch(e) {}
      }

      function buildAuth() {
        var proxy = (Lampa.Storage.get('rezka_video_proxy', 'https://rezka.lampasochka.workers.dev/') || '').trim();
        if (!startsWithHttp(proxy)) { Lampa.Noty.show('Настройте прокси'); return null; }
        if (!endsWithSlash(proxy)) proxy += '/';
        var host = (Lampa.Storage.get('rezka_video_host', 'https://rezka.ag') || '').trim();
        var bare = host.replace(/^https?:\/\//, '').replace(/\/+$/, '');
        var code = genCode();
        return { proxyUrl: proxy, code: code, authUrl: proxy + 'auth/' + code + '/' + encodeURIComponent(bare) };
      }

      Lampa.SettingsApi.addParam({
        component: 'rezka_video',
        param: { name: 'rezka_auth_qr', type: 'button' },
        field: { name: 'QR-код', description: 'Отсканируйте телефоном' },
        onChange: function() {
          var a = buildAuth();
          if (!a) return;
          var html = $(
            '<div style="text-align:center;padding:20px;">' +
              '<div style="margin-bottom:20px;font-size:1.2em;color:#fff;">Отсканируйте код<br>' +
              '<a href="' + a.authUrl + '" target="_blank" style="font-size:0.8em;color:#a335ff;">' + a.authUrl + '</a></div>' +
              '<div id="r_qr" style="background:#fff;padding:15px;display:inline-block;border-radius:10px;"></div>' +
              '<div id="r_status" style="margin-top:20px;font-size:1.1em;color:#e5e5e5;">Ожидание...</div>' +
            '</div>'
          );
          var close = function() { closeAuth('.modal--medium'); };
          Lampa.Modal.open({ title: 'Авторизация', html: html, size: 'medium', mask: true, onBack: close });
          var qr = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(a.authUrl);
          $('#r_qr').html('<img src="' + qr + '" width="250" height="250">');
          pollAuth(a.proxyUrl, a.code, '#r_status', 'Ожидание', close);
        }
      });

      Lampa.SettingsApi.addParam({
        component: 'rezka_video',
        param: { name: 'rezka_auth_tv', type: 'button' },
        field: { name: 'Проверка в Lampa', description: 'Открыть проверку в приложении' },
        onChange: function() {
          var a = buildAuth();
          if (!a) return;
          var html = $(
            '<div style="padding:10px;">' +
              '<iframe src="' + a.authUrl + '" style="width:100%;height:60vh;border:none;background:#fff;border-radius:6px;"></iframe>' +
              '<div id="r_tv_status" style="margin-top:15px;font-size:1.1em;color:#e5e5e5;text-align:center;">Ожидание...</div>' +
            '</div>'
          );
          var close = function() { closeAuth('.modal--large'); };
          Lampa.Modal.open({ title: 'Проверка', html: html, size: 'large', mask: true, onBack: close });
          pollAuth(a.proxyUrl, a.code, '#r_tv_status', 'Ожидание', close);
        }
      });

    } catch(e) {
      console.error('[RezkaVideo] Settings error:', e);
    }

    // Добавляем кнопку в плеер
    Lampa.Listener.follow("full", function(e) {
      if (e.type == "complite") {
        $(".button--rezka-video").remove();
        $(".full-start-new__buttons").append(
          '<div class="full-start__button selector button--rezka-video">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 356.484 356.484">' +
              '<path d="M293.984 7.23H62.5C28.037 7.23 0 35.268 0 69.731v142.78c0 34.463 28.037 62.5 62.5 62.5l147.443.001 70.581 70.58a12.492 12.492 0 0 0 13.622 2.709 12.496 12.496 0 0 0 7.717-11.547v-62.237c30.759-3.885 54.621-30.211 54.621-62.006V69.731c0-34.463-28.037-62.501-62.5-62.501zm37.5 205.282c0 20.678-16.822 37.5-37.5 37.5h-4.621c-6.903 0-12.5 5.598-12.5 12.5v44.064l-52.903-52.903a12.493 12.493 0 0 0-8.839-3.661H62.5c-20.678 0-37.5-16.822-37.5-37.5V69.732c0-20.678 16.822-37.5 37.5-37.5h231.484c20.678 0 37.5 16.822 37.5 37.5v142.78z" fill="currentcolor"/>' +
            '</svg><span>Смотреть на Rezka</span>' +
          '</div>'
        );

        $(".button--rezka-video").on("hover:enter", function() {
          year = 0;
          if (e.data.movie.release_date) {
            year = e.data.movie.release_date.slice(0, 4);
          } else if (e.data.movie.first_air_date) {
            year = e.data.movie.first_air_date.slice(0, 4);
          }
          Lampa.Loading.start();
          getEnTitle(e.data.movie.id, e.object.method);
        });
      }
    });
  }

  startPlugin();
})();
