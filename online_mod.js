(function () {
  ("use strict");

  var year;
  var namemovie;
  var savedHTML = null;

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

  // --- Дублированная логика QR/TV авторизации для быстрого вызова с карточки фильма ---
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
    window.rezkaQuickAuthInterval = setInterval(function () {
      attempts++;
      if (attempts > 90) {
        clearInterval(window.rezkaQuickAuthInterval);
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
            clearInterval(window.rezkaQuickAuthInterval);
            Lampa.Storage.set('rezka_video_cookie', d.cookie);
            console.log('[RezkaVideo] (quick) cookie saved:', d.cookie);

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
    clearInterval(window.rezkaQuickAuthInterval);
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

  function searchRezka(name, ye) {
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

    console.log('[RezkaVideo] searching hdrezka with url:', searchUrl);

    return fetchCompat(searchUrl, {
      method: "GET",
      headers: { "Content-Type": "text/html" }
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }
      return response.text();
    }).then(function (fc) {
      var dom = new DOMParser().parseFromString(fc, "text/html");

      var item = dom.querySelector(".b-content__inline_item");
      if (!item) {
        console.warn('[RezkaVideo] show not found on Rezka:', name, ye);
        Lampa.Loading.stop();
        if (looksLikeBotBlockHtml(fc, !!cookie)) {
          showCookieExpiredChoice(function () {
            Lampa.Loading.start();
            searchRezka(name, ye);
          });
        } else {
          Lampa.Noty.show('Фильм/сериал не найден на Rezka');
        }
        return;
      }

      var linkEl = item.querySelector(".b-content__inline_item-link");
      namemovie = linkEl ? linkEl.innerText : "";

      var itemUrl = linkEl ? linkEl.getAttribute("href") : "";
      return video_rezka(itemUrl);
    }).catch(function (e) {
      console.error('[RezkaVideo] searchRezka error:', e);
      Lampa.Noty.show('Ошибка поиска на Rezka: ' + e.message);
      Lampa.Loading.stop();
    });
  }

  function getEnTitle(id, type) {
    var tmdbType = type === 'movie' ? 'movie' : 'tv';
    var tmdbCacheKey = tmdbType + '_' + id;

    window.__tmdbTranslationsCache = window.__tmdbTranslationsCache || {};
    window.__tmdbFallbackTitleCache = window.__tmdbFallbackTitleCache || {};
    var cachedTr = window.__tmdbTranslationsCache[tmdbCacheKey];
    var fallbackTitle = window.__tmdbFallbackTitleCache[tmdbCacheKey] || '';

    var trPromise;

    if (cachedTr) {
      console.log('[RezkaVideo] using shared translations cache for', tmdbCacheKey);
      trPromise = Promise.resolve(cachedTr);
    } else {
      trPromise = new Promise(function (res, rej) {
        Lampa.Api.sources.tmdb.get(
          tmdbType + '/' + id,
          { append_to_response: 'translations' },
          res,
          rej
        );
      }).then(function (data) {
        var tr = (data && data.translations && data.translations.translations) || [];
        window.__tmdbTranslationsCache[tmdbCacheKey] = tr;

        if (data && data.original_language === 'en') {
          fallbackTitle = (data && data.title) || (data && data.name) || (data && data.original_title) || (data && data.original_name) || '';
        }
        window.__tmdbFallbackTitleCache[tmdbCacheKey] = fallbackTitle;

        console.log('[RezkaVideo] TMDB raw response for', tmdbCacheKey, data);
        return tr;
      });
    }

    return trPromise.then(function (tr) {
      var enTitle = '';
      var enList = tr.filter(function (t) {
        return t.iso_639_1 === 'en';
      });
      for (var i = 0; i < enList.length; i++) {
        var cand = enList[i];
        var candTitle = (cand && cand.data && cand.data.title) || (cand && cand.data && cand.data.name);
        if (candTitle) {
          enTitle = candTitle;
          break;
        }
      }
      if (!enTitle) enTitle = fallbackTitle;

      if (enTitle) {
        return searchRezka(normalizeTitle(enTitle), year);
      } else {
        console.warn('[RezkaVideo] English title not found for', tmdbCacheKey, tr, 'fallbackTitle:', fallbackTitle);
        Lampa.Noty.show('Английское название не найдено');
        Lampa.Loading.stop();
      }
    }).catch(function (e) {
      console.error('[RezkaVideo] TMDB error', e);
      var reason = (e && (e.message || e.status_message)) ? (e.message || e.status_message) : JSON.stringify(e);
      Lampa.Noty.show('Ошибка получения данных TMDB: ' + reason);
      Lampa.Loading.stop();
    });
  }

  function cleanTitle(str) {
    return str.replace(/[\s.,:;''`!?]+/g, " ").trim();
  }

  function normalizeTitle(str) {
    return cleanTitle(
      str
        .toLowerCase()
        .replace(/[\-\u2010-\u2015\u2E3A\u2E3B\uFE58\uFE63\uFF0D]+/g, "-")
        .replace(/ё/g, "е")
    );
  }

  function video_rezka(pageUrl) {
    var settings = getSettings();
    var host = settings.host;
    var cookie = settings.cookie;
    var proxy = settings.proxy;
    
    if (!pageUrl) {
      Lampa.Loading.stop();
      Lampa.Noty.show('URL видео не найден');
      return;
    }

    // Построить полный URL видео
    if (typeof pageUrl === 'string' && !pageUrl.startsWith('http')) {
      pageUrl = host + pageUrl;
    }

    console.log('[RezkaVideo] opening video from:', pageUrl);

    Lampa.Loading.stop();
    
    var videoUrl = proxy;
    if (cookie) {
      videoUrl += "param/Cookie=" + encodeURIComponent(cookie) + "/";
    }
    videoUrl += pageUrl;

    var modal = $(
      '<div style="width:100%; height:100%;">' +
        '<iframe src="' + videoUrl + '" style="width:100%;height:100%;border:none;background:#000;" allow="fullscreen" allowfullscreen></iframe>' +
      '</div>'
    );

    Lampa.Modal.open({
      title: namemovie || "Видео",
      html: modal,
      size: "fullscreen",
      mask: true,
      onBack: function () {
        Lampa.Modal.close();
        $(".modal--fullscreen").remove();
        Lampa.Controller.toggle("content");
      }
    });
  }

  function startPlugin() {
    window.video_plugin = true;

    function generateAuthCode() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    try {
      Lampa.SettingsApi.addComponent({
        component: 'rezka_video',
        name: 'Rezka Videos',
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>'
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
          name: 'Зеркало hdrezka',
          description: 'Адрес зеркала hdrezka (например, https://hdrezka.me)'
        },
        onChange: function(value) {
          Lampa.Storage.set('rezka_video_host', value);
        }
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
          name: 'CORS Прокси (Умный)',
          description: 'URL вашего Cloudflare Worker с поддержкой авторизации (с / на конце)'
        },
        onChange: function(value) {
          Lampa.Storage.set('rezka_video_proxy', value);
        }
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
          name: 'Cookie авторизации (Ручной ввод)'
        },
        onChange: function(value) {
          Lampa.Storage.set('rezka_video_cookie', value);
        }
      });

      function pollAuthCode(proxyUrl, code, statusSelector, waitingText, onSuccess, onTimeout) {
          var attempts = 0;
          window.rezkaAuthInterval = setInterval(function() {
              attempts++;
              if(attempts > 90) {
                  clearInterval(window.rezkaAuthInterval);
                  $(statusSelector).text('Время ожидания истекло. Попробуйте снова.').css('color', '#ff5722');
                  if (onTimeout) onTimeout();
                  return;
              }

              $(statusSelector).text(waitingText + repeatChar('.', attempts % 4));

              $.ajax({
                  url: proxyUrl + 'check?code=' + code,
                  type: 'GET',
                  dataType: 'json',
                  success: function(d) {
                      if(d && (d.status === 'success' || d.cookie)) {
                          clearInterval(window.rezkaAuthInterval);
                          Lampa.Storage.set('rezka_video_cookie', d.cookie);
                          console.log('[RezkaVideo] cookie saved:', d.cookie);

                          var tail = (d.cookie || '').slice(-16);
                          $(statusSelector).html('<span style="color: #4CAF50;">Успешно! Cookie сохранены (…' + tail + ').</span>');

                          try {
                              $('.settings-param[data-name="rezka_video_cookie"] .settings-param__value').text(d.cookie);
                          } catch(e) {}

                          if (onSuccess) setTimeout(onSuccess, 2500);
                      }
                  },
                  error: function() {}
              });
          }, 2000);
      }

      function closeAuthModal(modalClass) {
          clearInterval(window.rezkaAuthInterval);
          Lampa.Modal.close();
          $(modalClass).remove();
          try {
              Lampa.Controller.toggle('settings_component');
          } catch (e) {
              try { Lampa.Controller.toggle('settings'); } catch (e2) {}
          }
      }

      function buildAuthUrl() {
          var proxyUrl = (Lampa.Storage.get('rezka_video_proxy', 'https://rezka.lampasochka.workers.dev/') || 'https://rezka.lampasochka.workers.dev/').trim();
          if(!startsWithHttp(proxyUrl)) {
              Lampa.Noty.show('Сначала настройте URL прокси-воркера');
              return null;
          }
          if(!endsWithSlash(proxyUrl)) proxyUrl += '/';

          var host = (Lampa.Storage.get('rezka_video_host', 'https://rezka.ag') || 'https://rezka.ag').trim();
          var hostBare = host.replace(/^https?:\/\//i, '').replace(/\/+$/, '');

          var code = generateAuthCode();
          var authUrl = proxyUrl + 'auth/' + code + '/' + encodeURIComponent(hostBare);

          return { proxyUrl: proxyUrl, code: code, authUrl: authUrl };
      }

      Lampa.SettingsApi.addParam({
        component: 'rezka_video',
        param: {
          name: 'rezka_auth_qr',
          type: 'button'
        },
        field: {
          name: 'Авторизация через QR-код',
          description: 'Отсканируйте код телефоном, чтобы автоматически получить Cookie'
        },
        onChange: function() {
            var auth = buildAuthUrl();
            if (!auth) return;

            var modalHtml = $(
                '<div style="text-align: center; padding: 20px;">' +
                    '<div style="margin-bottom: 20px; font-size: 1.2em; color: #fff;">' +
                        'Отсканируйте код камерой телефона<br>' +
                        '<span style="font-size: 0.8em; opacity: 0.7;">или перейдите по ссылке:</span><br>' +
                        '<a href="' + auth.authUrl + '" target="_blank" style="font-size: 0.8em; color: #a335ff; word-break: break-all;">' + auth.authUrl + '</a>' +
                    '</div>' +
                    '<div id="rezka_qr_container" style="background: white; padding: 15px; display: inline-block; border-radius: 10px;"></div>' +
                    '<div id="rezka_qr_status" style="margin-top: 20px; font-size: 1.1em; color: #e5e5e5;">Ожидание сканирования...</div>' +
                '</div>'
            );

            function closeThisModal() { closeAuthModal('.modal--medium'); }

            Lampa.Modal.open({
                title: 'Авторизация HDRezka',
                html: modalHtml,
                size: 'medium',
                mask: true,
                onBack: closeThisModal
            });

            var qrImgUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(auth.authUrl);
            $('#rezka_qr_container').html(
                '<img src="' + qrImgUrl + '" width="250" height="250" alt="QR" onerror="this.parentElement.innerHTML=' +
                "'<div style=\\'color:#333;font-size:0.9em;padding:20px;\\'>Не удалось загрузить QR. Используйте ссылку выше.</div>'" +
                '">'
            );

            pollAuthCode(auth.proxyUrl, auth.code, '#rezka_qr_status', 'Ожидание решения защиты на телефоне', closeThisModal, null);
        }
      });

      Lampa.SettingsApi.addParam({
        component: 'rezka_video',
        param: {
          name: 'rezka_auth_tv',
          type: 'button'
        },
        field: {
          name: 'Пройти проверку в Lampa',
          description: 'Без телефона — открывает окно проверки в самой Lampa. Может не сработать на слабых/старых ТВ'
        },
        onChange: function() {
            var auth = buildAuthUrl();
            if (!auth) return;

            var modalHtml = $(
                '<div style="padding: 10px;">' +
                    '<iframe src="' + auth.authUrl + '" style="width:100%;height:60vh;border:none;background:#fff;border-radius:6px;"></iframe>' +
                    '<div id="rezka_tv_status" style="margin-top: 15px; font-size: 1.1em; color: #e5e5e5; text-align:center;">Ожидание прохождения проверки...</div>' +
                '</div>'
            );

            function closeThisModal() { closeAuthModal('.modal--large'); }

            Lampa.Modal.open({
                title: 'Проверка HDRezka',
                html: modalHtml,
                size: 'large',
                mask: true,
                onBack: closeThisModal
            });

            pollAuthCode(auth.proxyUrl, auth.code, '#rezka_tv_status', 'Ожидание решения защиты', closeThisModal, null);
        }
      });
    } catch (e) {
      console.error('[RezkaVideo] Settings init error:', e);
    }

    Lampa.Listener.follow("full", function (e) {
      if (e.type == "complite") {
        $(".button--video").remove();
        $(".full-start-new__buttons").append(
          '<div class="full-start__button selector button--video"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg><span>' +
          'Видео' +
          '</span></div>'
        );

        $(".button--video").on("hover:enter", function (card) {
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

  if (!window.video_plugin) startPlugin();
})();
