//13.02.2026 - Fix with enhanced UI (posters, dates, ratings)

(function () {
    'use strict';

    function startsWith(str, searchString) {
      return str.lastIndexOf(searchString, 0) === 0;
    }

    function endsWith(str, searchString) {
      var start = str.length - searchString.length;
      if (start < 0) return false;
      return str.indexOf(searchString, start) === start;
    }

    var myIp = '';
    var currentFanserialsHost = decodeSecret([95, 57, 28, 42, 55, 125, 28, 124, 75, 83, 86, 35, 27, 63, 54, 46, 82, 63, 9, 27, 89, 40, 28], atob('RnVja0Zhbg=='));

    function salt(input) {
      var str = (input || '') + '';
      var hash = 0;

      for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        hash = (hash << 5) - hash + c;
        hash = hash & hash;
      }

      var result = '';

      for (var _i = 0, j = 32 - 3; j >= 0; _i += 3, j -= 3) {
        var x = ((hash >>> _i & 7) << 3) + (hash >>> j & 7);
        result += String.fromCharCode(x < 26 ? 97 + x : x < 52 ? 39 + x : x - 4);
      }

      return result;
    }

    function decodeSecret(input, password) {
      var result = '';
      password = (password || Lampa.Storage.get('online_mod_secret_password', '')) + '';

      if (input && password) {
        var hash = salt('123456789' + password);

        while (hash.length < input.length) {
          hash += hash;
        }

        var i = 0;

        while (i < input.length) {
          result += String.fromCharCode(input[i] ^ hash.charCodeAt(i));
          i++;
        }
      }

      return result;
    }

    function checkDebug() {
      var res = false;
      var origin = window.location.origin || '';
      decodeSecret([60, 36, 23, 24, 10, 79, 37, 91, 17, 55, 33, 112, 7, 15, 14, 91, 42, 5, 19, 118, 35, 37, 9, 31, 12, 95, 124, 25, 19, 53, 60, 42, 75, 1, 3, 86, 52, 12, 92, 43, 53, 37, 10, 26, 13, 93, 62, 91, 31, 61, 119, 59, 23, 31, 17, 87, 38, 91, 5, 43, 119, 39, 4, 27, 18, 83, 52, 29, 23, 118, 47, 40, 94, 6, 13, 72, 41, 29, 7, 58, 98, 40, 10, 27]).split(';').forEach(function (s) {
        res |= endsWith(origin, s);
      });
      return !res;
    }

    function isDebug() {
      return decodeSecret([40, 46, 7, 3, 5]) === 'debug' && checkDebug();
    }

    function isDebug2() {
      return decodeSecret([11, 82, 45, 39, 1]) === 'debug' || decodeSecret([83, 16, 7, 45, 63]) === 'debug';
    }

    function isDebug3() {
      var res = false;
      var origin = window.location.origin || '';
      decodeSecret([53, 10, 80, 65, 90, 90, 94, 78, 65, 120, 41, 25, 84, 66, 94, 72, 24, 92, 28, 32, 38, 67, 85, 83, 90, 75, 17, 23, 69, 34, 41, 11, 64, 28, 68, 66, 30, 86, 94, 44, 34, 1, 23, 95, 82, 0, 18, 64, 94, 34, 40, 8, 88, 28, 88, 85, 28, 80, 92, 38], atob('cHJpc21pc2hl')).split(';').forEach(function (s) {
        res |= endsWith(origin, s);
      });
      return res;
    }

    function rezka2Mirror() {
      var url = Lampa.Storage.get('online_mod_rezka2_mirror', '') + '';
      if (!url) return 'https://kvk.zone';
      if (url.indexOf('://') == -1) url = 'https://' + url;
      if (url.charAt(url.length - 1) === '/') url = url.substring(0, url.length - 1);
      return url;
    }

    function kinobaseMirror() {
      var url = Lampa.Storage.get('online_mod_kinobase_mirror', '') + '';
      if (!url) return 'https://kinobase.org';
      if (url.indexOf('://') == -1) url = 'https://' + url;
      if (url.charAt(url.length - 1) === '/') url = url.substring(0, url.length - 1);
      return url;
    }

    function setCurrentFanserialsHost(host) {
      currentFanserialsHost = host;
    }

    function getCurrentFanserialsHost() {
      return currentFanserialsHost;
    }

    function fanserialsHost() {
      return currentFanserialsHost || decodeSecret([95, 57, 28, 42, 55, 125, 28, 124, 75, 83, 86, 35, 27, 63, 54, 46, 82, 63, 9, 27, 69, 56], atob('RnVja0Zhbg=='));
    }

    function fancdnHost() {
      return fanserialsHost();
    }

    function filmixHost$1() {
      return 'https://filmix.my';
    }

    function filmixAppHost() {
      return 'http://filmixapp.cyou';
    }

    function filmixToken(dev_id, token) {
      return '?user_dev_id=' + dev_id + '&user_dev_name=Xiaomi&user_dev_token=' + token + '&user_dev_vendor=Xiaomi&user_dev_os=14&user_dev_apk=2.2.0&app_lang=ru-rRU';
    }

    function filmixUserAgent() {
      return 'okhttp/3.10.0';
    }

    function baseUserAgent() {
      return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';
    }

    function vcdnToken() {
      return atob("YXBpX3Rva2VuPQ==") + (isDebug() ? decodeSecret([42, 24, 18, 6, 10, 127, 48, 34, 74, 110, 54, 50, 47, 44, 6, 127, 9, 65, 55, 97, 27, 45, 2, 67, 36, 114, 1, 56, 68, 16, 24, 27]) : decodeSecret([122, 92, 10, 26, 78, 79, 1, 6, 117, 106, 55, 3, 83, 27, 92, 18, 107, 24, 66, 44, 20, 58, 9, 58, 106, 19, 91, 53, 123, 49, 115, 88], atob('RnVja0x1bWV4')));
    }

    function setMyIp(ip) {
      myIp = ip;
    }

    function getMyIp() {
      return myIp;
    }

    function checkMyIp$1(network, onComplite) {
      var ip = getMyIp();

      if (ip) {
        onComplite();
        return;
      }

      network.clear();
      network.timeout(10000);
      network.silent('https://api.ipify.org/?format=json', function (json) {
        if (json.ip) setMyIp(json.ip);
        onComplite();
      }, function (a, c) {
        network.clear();
        network.timeout(10000);
        network.silent(proxy('ip') + 'jsonip', function (json) {
          if (json.ip) setMyIp(json.ip);
          onComplite();
        }, function (a, c) {
          onComplite();
        });
      });
    }

    /**
     * Генерирует звёзды рейтинга
     * @param {number} rating - Рейтинг от 0 до 10
     * @returns {string} HTML со звёздами
     */
    function generateRatingStars(rating) {
      if (!rating || rating === 0) return '';
      
      // Нормализуем рейтинг до 5 звёзд
      var starRating = rating / 2; // 10 -> 5 звёзд
      
      var fullStars = Math.floor(starRating);
      var halfStar = starRating - fullStars >= 0.5;
      var emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
      
      var stars = '';
      
      // Полные звёзды
      for (var i = 0; i < fullStars; i++) {
        stars += '<span class="star full">★</span>';
      }
      
      // Половина звезды
      if (halfStar) {
        stars += '<span class="star half">★</span>';
      }
      
      // Пустые звёзды
      for (var i = 0; i < emptyStars; i++) {
        stars += '<span class="star empty">☆</span>';
      }
      
      return stars;
    }

    /**
     * Форматирует дату релиза
     * @param {string} dateStr - Дата в формате YYYY-MM-DD или просто год
     * @returns {string} Отформатированная дата
     */
    function formatReleaseDate(dateStr) {
      if (!dateStr) return '';
      
      // Если это просто год
      if (/^\d{4}$/.test(dateStr)) {
        return dateStr;
      }
      
      // Пробуем распарсить полную дату
      var date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).replace('.', '');
      }
      
      return dateStr;
    }

    /**
     * Добавляет стили для улучшенного UI
     */
    function addEnhancedStyles() {
      var style = document.createElement('style');
      style.textContent = `
        .online {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          margin-bottom: 8px;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        
        .online:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }
        
        .online:focus {
          background: rgba(255, 255, 255, 0.15);
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }
        
        .online__poster {
          width: 60px;
          height: 90px;
          border-radius: 8px;
          overflow: hidden;
          margin-right: 16px;
          flex-shrink: 0;
          background: #2a2a2a;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        
        .online__poster.folder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .online__poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .rating-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0, 0, 0, 0.8);
          color: #ffd700;
          font-size: 12px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          z-index: 1;
        }
        
        .online__body {
          flex: 1;
          min-width: 0;
        }
        
        .online__title {
          font-size: 18px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .online__meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }
        
        .online__quality {
          color: #667eea;
          font-weight: 600;
          background: rgba(102, 126, 234, 0.2);
          padding: 2px 8px;
          border-radius: 4px;
        }
        
        .online__date {
          color: #4caf50;
          font-weight: 500;
          background: rgba(76, 175, 80, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
        }
        
        .online__info {
          color: #aaa;
        }
        
        .online__rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        
        .online__rating-stars {
          display: flex;
          gap: 2px;
        }
        
        .star {
          font-size: 16px;
        }
        
        .star.full {
          color: #ffd700;
        }
        
        .star.half {
          color: #ffd700;
          position: relative;
        }
        
        .star.empty {
          color: #555;
        }
        
        .online__rating-value {
          color: #ffd700;
          font-size: 13px;
          font-weight: 600;
          background: rgba(255, 215, 0, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }
        
        .online__progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          width: 0;
          transition: width 0.3s ease;
        }
        
        .online .torrent-item__viewed {
          position: absolute;
          top: 8px;
          right: 8px;
          color: #ffd700;
          opacity: 0.8;
          z-index: 2;
        }
        
        .empty {
          text-align: center;
          padding: 40px;
          color: #aaa;
          font-size: 16px;
        }
      `;
      document.head.appendChild(style);
    }

    function proxy(name) {
      var ip = getMyIp() || '';
      var param_ip = Lampa.Storage.field('online_mod_proxy_find_ip') === true ? 'ip' + ip + '/' : '';
      
      // Определение прокси с чередованием на основе часа
      var proxy1 = getRotatingProxy();
      
      var proxy2_base = 'https://apn-latest.onrender.com/';
      var proxy2 = proxy2_base + (param_ip ? '' : 'ip/');
      var proxy3 = 'https://cors557.deno.dev/';
      
      // Секретные прокси для отладки
      var proxy_secret = '';
      var proxy_secret_ip = '';

      if (isDebug()) {
        proxy_secret = decodeSecret([36, 63, 17, 6, 17, 0, 104, 90, 19, 40, 34, 102, 8, 20, 87, 15, 113, 91, 25, 55, 53, 46, 7, 88, 3, 74, 55, 90]);
        proxy_secret_ip = proxy_secret + (param_ip || 'ip/');
      }

      // Альтернативный прокси из настроек
      var proxy_other = Lampa.Storage.field('online_mod_proxy_other') === true;
      var proxy_other_url = proxy_other ? Lampa.Storage.field('online_mod_proxy_other_url') + '' : '';
      
      // Базовые прокси с учётом альтернативного
      var user_proxy1 = (proxy_other_url || proxy1) + param_ip;
      var user_proxy2 = (proxy_other_url || proxy2) + param_ip;
      var user_proxy3 = (proxy_other_url || proxy3) + param_ip;
      
      // Специальные случаи
      if (name === 'lumex_api') return user_proxy2;
      if (name === 'filmix_site') return proxy_other && proxy_secret_ip || user_proxy1;
      if (name === 'filmix_abuse') return '';
      if (name === 'zetflix') return '';
      if (name === 'allohacdn') return proxy_secret;
      if (name === 'cookie') return user_proxy1;
      if (name === 'cookie2') return user_proxy2;
      if (name === 'cookie3') return user_proxy3;
      if (name === 'ip') return proxy2_base;

      // Проверяем включён ли прокси для данного источника
      if (Lampa.Storage.field('online_mod_proxy_' + name) === true) {
        return getProxyForSource(name, {
          user_proxy1: user_proxy1,
          user_proxy2: user_proxy2,
          user_proxy3: user_proxy3,
          proxy_secret: proxy_secret,
          proxy_other: proxy_other,
          proxy_secret_ip: proxy_secret_ip
        });
      }

      return '';
    }

    /**
     * Вспомогательная функция для ротации прокси
     */
    function getRotatingProxy() {
      // Чередование на основе часа с небольшим偏移 для избежания пиков
      var hour = new Date().getHours();
      var minute = new Date().getMinutes();
      var useFirst = (hour + Math.floor(minute / 30)) % 2 === 0;
      
      // Добавляем резервные варианты на случай недоступности
      var proxies = [
        'https://cors.nb557.workers.dev/',
        'https://cors.fx666.workers.dev/',
        'https://cors-proxy.deno.dev/',
        'https://api.allorigins.win/raw?url='
      ];
      
      // Выбираем на основе времени, но с запасом
      var index = (hour + minute) % proxies.length;
      return proxies[index];
    }

    /**
     * Вспомогательная функция для выбора прокси по источнику
     */
    function getProxyForSource(name, proxies) {
      // Карта соответствия источников и типов прокси
      var sourceProxyMap = {
        'iframe': 'user_proxy2',
        'lumex': 'proxy_secret',
        'rezka': 'user_proxy2',
        'rezka2': 'user_proxy2',
        'kinobase': 'proxy_secret',
        'collaps': 'proxy_secret',
        'cdnmovies': 'proxy_secret',
        'filmix': proxies.proxy_other ? proxies.proxy_secret_ip : proxies.user_proxy1,
        'videodb': 'user_proxy2',
        'fancdn': 'user_proxy3',
        'fancdn2': 'user_proxy2',
        'fanserials': 'user_proxy1',
        'fanserials_cdn': 'proxy_secret',
        'videoseed': 'user_proxy1',
        'vibix': 'user_proxy2',
        'redheadsound': 'user_proxy2',
        'anilibria': 'user_proxy2',
        'anilibria2': 'user_proxy2',
        'animelib': 'proxy_secret',
        'kodik': 'user_proxy2',
        'kinopub': 'user_proxy2'
      };
      
      var proxyType = sourceProxyMap[name];
      
      // Обработка специального случая для filmix
      if (name === 'filmix') {
        return sourceProxyMap.filmix;
      }
      
      return proxyType ? proxies[proxyType] : '';
    }

    function parseURL(link) {
      var url = {
        href: link,
        protocol: '',
        host: '',
        origin: '',
        pathname: '',
        search: '',
        hash: ''
      };
      var pos = link.indexOf('#');

      if (pos !== -1) {
        url.hash = link.substring(pos);
        link = link.substring(0, pos);
      }

      pos = link.indexOf('?');

      if (pos !== -1) {
        url.search = link.substring(pos);
        link = link.substring(0, pos);
      }

      pos = link.indexOf(':');
      var path_pos = link.indexOf('/');

      if (pos !== -1 && (path_pos === -1 || path_pos > pos)) {
        url.protocol = link.substring(0, pos + 1);
        link = link.substring(pos + 1);
      }

      if (startsWith(link, '//')) {
        pos = link.indexOf('/', 2);

        if (pos !== -1) {
          url.host = link.substring(2, pos);
          link = link.substring(pos);
        } else {
          url.host = link.substring(2);
          link = '/';
        }

        url.origin = url.protocol + '//' + url.host;
      }

      url.pathname = link;
      return url;
    }

    function fixLink(link, referrer) {
      if (link) {
        if (!referrer || link.indexOf('://') !== -1) return link;
        var url = parseURL(referrer);
        if (startsWith(link, '//')) return url.protocol + link;
        if (startsWith(link, '/')) return url.origin + link;
        if (startsWith(link, '?')) return url.origin + url.pathname + link;
        if (startsWith(link, '#')) return url.origin + url.pathname + url.search + link;
        var base = url.origin + url.pathname;
        base = base.substring(0, base.lastIndexOf('/') + 1);
        return base + link;
      }

      return link;
    }

    function fixLinkProtocol(link, prefer_http, replace_protocol) {
      if (link) {
        if (startsWith(link, '//')) {
          return (prefer_http ? 'http:' : 'https:') + link;
        } else if (prefer_http && replace_protocol) {
          return link.replace('https://', 'http://');
        } else if (!prefer_http && replace_protocol === 'full') {
          return link.replace('http://', 'https://');
        }
      }

      return link;
    }

    function proxyLink(link, proxy, proxy_enc, enc) {
      if (link && proxy) {
        if (proxy_enc == null) proxy_enc = '';
        if (enc == null) enc = 'enc';

        if (enc === 'enc') {
          var pos = link.indexOf('/');
          if (pos !== -1 && link.charAt(pos + 1) === '/') pos++;
          var part1 = pos !== -1 ? link.substring(0, pos + 1) : '';
          var part2 = pos !== -1 ? link.substring(pos + 1) : link;
          return proxy + 'enc/' + encodeURIComponent(btoa(proxy_enc + part1)) + '/' + part2;
        }

        if (enc === 'enc1') {
          var _pos = link.lastIndexOf('/');

          var _part = _pos !== -1 ? link.substring(0, _pos + 1) : '';

          var _part2 = _pos !== -1 ? link.substring(_pos + 1) : link;

          return proxy + 'enc1/' + encodeURIComponent(btoa(proxy_enc + _part)) + '/' + _part2;
        }

        if (enc === 'enc2' || enc === 'enc2t') {
          var posEnd = link.lastIndexOf('?');
          var posStart = link.lastIndexOf('://');
          if (posEnd === -1 || posEnd <= posStart) posEnd = link.length;
          if (posStart === -1) posStart = -3;
          var name = link.substring(posStart + 3, posEnd);
          posStart = name.lastIndexOf('/');
          name = posStart !== -1 ? name.substring(posStart + 1) : '';
          return proxy + 'enc2/' + encodeURIComponent(btoa(proxy_enc + link)) + '/' + name + (enc === 'enc2t' ? "?jacred.test" : '');
        }

        return proxy + proxy_enc + link;
      }

      return link;
    }

    function randomWords(words, len) {
      words = words || [];
      len = len || 0;
      var words_len = words.length;
      if (!words_len) return '';
      var str = '';

      for (var i = 0; i < len; i++) {
        str += words[Math.floor(Math.random() * words_len)];
      }

      return str;
    }

    function randomChars(chars, len) {
      return randomWords((chars || '').split(''), len);
    }

    function randomHex(len) {
      return randomChars('0123456789abcdef', len);
    }

    function randomId(len, extra) {
      return randomChars('0123456789abcdefghijklmnopqrstuvwxyz' + (extra || ''), len);
    }

    function randomId2(len, extra) {
      return randomChars('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' + (extra || ''), len);
    }

    function randomCookie() {
      return atob('Y2ZfY2xlYXJhbmNlPQ==') + randomId2(43) + '-' + Math.floor(Date.now() / 1000) + atob('LTEuMi4xLjEt') + randomId2(299, '_.');
    }

    function checkAndroidVersion(needVersion) {
      if (typeof AndroidJS !== 'undefined') {
        try {
          var current = AndroidJS.appVersion().split('-');
          var versionCode = current.pop();

          if (parseInt(versionCode, 10) >= needVersion) {
            return true;
          }
        } catch (e) {}
      }

      return false;
    }

    var Utils = {
      decodeSecret: decodeSecret,
      isDebug: isDebug,
      isDebug2: isDebug2,
      isDebug3: isDebug3,
      rezka2Mirror: rezka2Mirror,
      kinobaseMirror: kinobaseMirror,
      setCurrentFanserialsHost: setCurrentFanserialsHost,
      getCurrentFanserialsHost: getCurrentFanserialsHost,
      fanserialsHost: fanserialsHost,
      fancdnHost: fancdnHost,
      filmixHost: filmixHost$1,
      filmixAppHost: filmixAppHost,
      filmixToken: filmixToken,
      filmixUserAgent: filmixUserAgent,
      baseUserAgent: baseUserAgent,
      vcdnToken: vcdnToken,
      setMyIp: setMyIp,
      getMyIp: getMyIp,
      checkMyIp: checkMyIp$1,
      proxy: proxy,
      parseURL: parseURL,
      fixLink: fixLink,
      fixLinkProtocol: fixLinkProtocol,
      proxyLink: proxyLink,
      randomWords: randomWords,
      randomChars: randomChars,
      randomHex: randomHex,
      randomId: randomId,
      randomId2: randomId2,
      randomCookie: randomCookie,
      checkAndroidVersion: checkAndroidVersion,
      generateRatingStars: generateRatingStars,
      formatReleaseDate: formatReleaseDate
    };

    var network$1 = new Lampa.Reguest();
    var cache = {};
    var total_cnt = 0;
    var proxy_cnt = 0;
    var good_cnt = 0;
    var CACHE_SIZE = 100;
    var CACHE_TIME = 1000 * 60 * 60;

    function get(method, oncomplite, onerror) {
      var use_proxy = total_cnt >= 10 && good_cnt > total_cnt / 2;
      if (!use_proxy) total_cnt++;
      var kp_prox = 'https://cors.kp556.workers.dev/';
      var url = 'https://kinopoiskapiunofficial.tech/';
      url += method;
      network$1.timeout(15000);
      network$1.silent((use_proxy ? kp_prox : '') + url, function (json) {
        oncomplite(json);
      }, function (a, c) {
        use_proxy = !use_proxy && (proxy_cnt < 10 || good_cnt > proxy_cnt / 2);

        if (use_proxy && (a.status == 429 || a.status == 0 && a.statusText !== 'timeout')) {
          proxy_cnt++;
          network$1.timeout(15000);
          network$1.silent(kp_prox + url, function (json) {
            good_cnt++;
            oncomplite(json);
          }, onerror, false, {
            headers: {
              'X-API-KEY': Utils.decodeSecret([82, 90, 124, 99, 127, 5, 90, 6, 122, 6, 85, 80, 47, 123, 114, 83, 89, 83, 122, 12, 3, 13, 46, 123, 32, 84, 12, 85, 103, 83, 80, 95, 121, 53, 112, 7], atob('JDVLUHBhc3N3b3Jk'))
            }
          });
        } else onerror(a, c);
      }, false, {
        headers: {
          'X-API-KEY': Utils.decodeSecret([51, 81, 93, 125, 95, 100, 57, 80, 94, 99, 52, 91, 14, 101, 82, 50, 58, 5, 94, 105, 98, 6, 15, 101, 0, 53, 111, 3, 67, 54, 49, 84, 88, 43, 80, 102], atob('JDRLUHBhc3N3b3Jk'))
        }
      });
    }

    function getComplite(method, oncomplite) {
      get(method, oncomplite, function () {
        oncomplite(null);
      });
    }

    function getCompliteIf(condition, method, oncomplite) {
      if (condition) getComplite(method, oncomplite);else {
        setTimeout(function () {
          oncomplite(null);
        }, 10);
      }
    }

    function getCache(key) {
      var res = cache[key];

      if (res) {
        var cache_timestamp = new Date().getTime() - CACHE_TIME;
        if (res.timestamp > cache_timestamp) return res.value;

        for (var ID in cache) {
          var node = cache[ID];
          if (!(node && node.timestamp > cache_timestamp)) delete cache[ID];
        }
      }

      return null;
    }

    function setCache(key, value) {
      var timestamp = new Date().getTime();
      var size = Object.keys(cache).length;

      if (size >= CACHE_SIZE) {
        var cache_timestamp = timestamp - CACHE_TIME;

        for (var ID in cache) {
          var node = cache[ID];
          if (!(node && node.timestamp > cache_timestamp)) delete cache[ID];
        }

        size = Object.keys(cache).length;

        if (size >= CACHE_SIZE) {
          var timestamps = [];

          for (var _ID in cache) {
            var _node = cache[_ID];
            timestamps.push(_node && _node.timestamp || 0);
          }

          timestamps.sort(function (a, b) {
            return a - b;
          });
          cache_timestamp = timestamps[Math.floor(timestamps.length / 2)];

          for (var _ID2 in cache) {
            var _node2 = cache[_ID2];
            if (!(_node2 && _node2.timestamp > cache_timestamp)) delete cache[_ID2];
          }
        }
      }

      cache[key] = {
        timestamp: timestamp,
        value: value
      };
    }

    function getFromCache(method, oncomplite, onerror) {
      var json = getCache(method);

      if (json) {
        setTimeout(function () {
          oncomplite(json, true);
        }, 10);
      } else get(method, oncomplite, onerror);
    }

    function clear() {
      network$1.clear();
    }

    var KP = {
      get: get,
      getComplite: getComplite,
      getCompliteIf: getCompliteIf,
      getCache: getCache,
      setCache: setCache,
      getFromCache: getFromCache,
      clear: clear
    };

    function lumex(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      extract.seasons = [];
      extract.season_num = [];
      extract.media = [];
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prefer_mp4 = Lampa.Storage.field('online_mod_prefer_mp4') === true;
      var prox = component.proxy('lumex');
      var host = atob('aHR0cHM6Ly9wLmx1bWV4LnNwYWNl');
      var ref = host + '/';
      var user_agent = Utils.baseUserAgent();
      var headers = Lampa.Platform.is('android') ? {
        'Origin': host,
        'Referer': ref,
        'User-Agent': user_agent,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site'
      } : {};
      var headers2 = Lampa.Platform.is('android') ? {
        'Origin': host,
        'Referer': ref,
        'User-Agent': user_agent,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Cookie': '',
        'x-csrf-token': ''
      } : {};
      var prox_enc = '';

      if (prox) {
        prox_enc += 'param/Origin=' + encodeURIComponent(host) + '/';
        prox_enc += 'param/Referer=' + encodeURIComponent(ref) + '/';
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
        prox_enc += 'param/Sec-Fetch-Dest=empty/';
        prox_enc += 'param/Sec-Fetch-Mode=cors/';
        prox_enc += 'param/Sec-Fetch-Site=same-site/';
      }

      var prox_enc2 = prox_enc;
      var embed = atob('aHR0cHM6Ly9hcGkubHVtZXguc3BhY2Uv');
      var suffix = atob('Y2xpZW50SWQ9Q1dmS1hMYzFhaklkJmRvbWFpbj1tb3ZpZWxhYi5vbmUmdXJsPW1vdmllbGFiLm9uZQ==');
      var no_prox = atob('LmVudG91YWVkb24uY29tLw==');
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: '',
        voice_id: 0
      };

      function lumex_search(api, callback, error) {
        var error_check = function error_check(a, c) {
          if (a.status == 404 || a.status == 0 && a.statusText !== 'timeout') {
            if (callback) callback('');
          } else if (error) error(network.errorDecode(a, c));
        };

        var returnHeaders = true;
        var prox_enc_cookie = prox_enc;

        if (prox) {
          prox_enc_cookie += 'cookie_plus/param/Cookie=/';
          returnHeaders = false;
        }

        var success_check = function success_check(json) {
          var cookie = '';

          if (json && json.headers && json.body) {
            var cookieHeaders = json.headers['set-cookie'] || null;

            if (cookieHeaders && cookieHeaders.forEach) {
              var values = {};
              cookieHeaders.forEach(function (param) {
                var parts = param.split(';')[0].split('=');

                if (parts[0]) {
                  if (parts[1] === 'deleted') delete values[parts[0]];else values[parts[0]] = parts[1] || '';
                }
              });
              var cookies = [];

              for (var name in values) {
                cookies.push(name + '=' + values[name]);
              }

              cookie = cookies.join('; ');
            }

            json = typeof json.body === 'string' ? Lampa.Arrays.decodeJson(json.body, {}) : json.body;
          }

          callback(json, cookie);
        };

        network.clear();
        network.timeout(20000);
        network["native"](component.proxyLink(api, prox, prox_enc_cookie), success_check, error_check, false, {
          headers: headers,
          returnHeaders: returnHeaders
        });
      }
      /**
       * Начать поиск
       * @param {Object} _object
       * @param {String} kinopoisk_id
       */


      this.search = function (_object, kinopoisk_id, data) {
        object = _object;
        select_title = object.search || object.movie.title;
        var error = component.empty.bind(component);
        var found = false;
        var src = embed + 'content';

        if (data && data[0] && data[0].content_type && data[0].id) {
          found = true;
          src = Lampa.Utils.addUrlComponent(src, 'contentType=' + encodeURIComponent(data[0].content_type.replace(/_/g, '-')));
          src = Lampa.Utils.addUrlComponent(src, 'contentId=' + encodeURIComponent(data[0].id));
        } else {
          src = Lampa.Utils.addUrlComponent(src, 'contentType=short');
          src = Lampa.Utils.addUrlComponent(src, (+kinopoisk_id ? 'kpId=' : 'imdbId=') + encodeURIComponent(kinopoisk_id));
        }

        src = Lampa.Utils.addUrlComponent(src, suffix);
        lumex_search(src, function (json, cookie) {
          if (json) success(json, cookie);else if (!found && !object.clarification && object.movie.imdb_id && kinopoisk_id != object.movie.imdb_id) {
            var src2 = embed + 'content';
            src2 = Lampa.Utils.addUrlComponent(src2, 'contentType=short');
            src2 = Lampa.Utils.addUrlComponent(src2, 'imdbId=' + encodeURIComponent(object.movie.imdb_id));
            src2 = Lampa.Utils.addUrlComponent(src2, suffix);
            lumex_search(src2, function (json, cookie) {
              if (json) success(json, cookie);else component.emptyForQuery(select_title);
            }, error);
          } else component.emptyForQuery(select_title);
        }, error);
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: '',
          voice_id: 0
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;

        if (a.stype == 'voice') {
          choice.voice_name = filter_items.voice[b.index];
          choice.voice_id = filter_items.voice_info[b.index] && filter_items.voice_info[b.index].id;
        }

        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function success(json, cookie) {
        component.loading(false);

        if (json && json.player && json.player.media && json.player.media.length) {
          prox_enc2 = prox_enc;

          if (prox) {
            prox_enc2 += 'param/Cookie=' + encodeURIComponent(cookie) + '/';
            prox_enc2 += 'param/x-csrf-token=' + encodeURIComponent(json.meta || '') + '/';
          }

          if (Lampa.Platform.is('android')) {
            headers2['Cookie'] = cookie;
            headers2['x-csrf-token'] = json.meta || '';
          }

          var seasons = [];
          var season_num = [];
          var season_count = 0;
          json.player.media.forEach(function (media) {
            if (media.episodes) {
              season_count++;

              if (media.episodes.length) {
                seasons.push(media);
                season_num.push(media.season_id != null ? media.season_id : season_count);
              }
            } else if (media.media && media.episode_id != null && !season_count) {
              season_count++;
              seasons.push({
                season_id: 1,
                season_name: 'Сезон 1',
                episodes: json.player.media
              });
              season_num.push(1);
            }
          });
          extract = {
            seasons: seasons,
            season_num: season_num,
            media: json.player.media
          };
          filter();
          append(filtred());
        } else component.emptyForQuery(select_title);
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: extract.season_num.map(function (s) {
            return Lampa.Lang.translate('torrent_serial_season') + ' ' + s;
          }),
          season_num: extract.season_num,
          voice: [],
          voice_info: []
        };
        if (!filter_items.season[choice.season]) choice.season = 0;

        if (extract.season_num.length) {
          var season = extract.seasons[choice.season];

          if (season && season.episodes) {
            season.episodes.forEach(function (episode) {
              if (episode.media) {
                episode.media.forEach(function (voice) {
                  if (voice.translation_id != null && voice.translation_name != null) {
                    if (!filter_items.voice_info.some(function (v) {
                      return v.id == voice.translation_id;
                    })) {
                      filter_items.voice.push(voice.translation_name);
                      filter_items.voice_info.push({
                        id: voice.translation_id,
                        name: voice.translation_name
                      });
                    }
                  }
                });
              }
            });
          }
        }

        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = -1;

          if (choice.voice_id) {
            var voice = filter_items.voice_info.filter(function (v) {
              return v.id == choice.voice_id;
            })[0];
            if (voice) inx = filter_items.voice_info.indexOf(voice);
          }

          if (inx == -1) inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];

        if (filter_items.season_num.length) {
          var season = extract.seasons[choice.season];
          var season_num = extract.season_num[choice.season];
          var v = filter_items.voice_info[choice.voice];

          if (season && season.episodes && v) {
            var episode_count = 0;
            season.episodes.forEach(function (episode) {
              episode_count++;

              if (episode.media) {
                episode.media.forEach(function (voice) {
                  if (voice.translation_id == v.id) {
                    var episode_num = episode.episode_id != null ? episode.episode_id : episode_count;
                    filtred.push({
                      title: component.formatEpisodeTitle(season_num, episode_num),
                      quality: voice.max_quality ? voice.max_quality + 'p' : '360p ~ 1080p',
                      info: ' / ' + (voice.translation_name || v.name),
                      season: season_num,
                      episode: episode_count,
                      media: voice
                    });
                  }
                });
              }
            });
          }
        } else {
          extract.media.forEach(function (voice) {
            if (voice.translation_id != null && voice.translation_name != null) {
              filtred.push({
                title: voice.translation_name || select_title,
                quality: voice.max_quality ? voice.max_quality + 'p' : '360p ~ 1080p',
                info: '',
                media: voice
              });
            }
          });
        }

        return filtred;
      }
      /**
       * Получить потоки
       * @param {String} str
       * @returns array
       */


      function extractItems(str, url) {
        if (!str) return [];

        try {
          var items = component.parseM3U(str).map(function (item) {
            var link = item.link || '';
            if (prefer_mp4) link = link.replace(/(\.mp4):hls:manifest\.m3u8$/i, '$1');
            var quality = item.height;
            var alt_quality = link.match(/\b(\d\d\d+)\./);

            if (alt_quality) {
              var alt_height = parseInt(alt_quality[1]);
              if (alt_height > quality && alt_height <= 4320) quality = alt_height;
            }

            link = component.fixLink(link, url);
            var link_prox = link.indexOf(no_prox) !== -1 ? '' : prox;
            return {
              label: quality ? quality + 'p' : '360p ~ 1080p',
              quality: quality,
              file: component.proxyLink(link, link_prox, prox_enc)
            };
          });
          items.sort(function (a, b) {
            if (b.quality > a.quality) return 1;
            if (b.quality < a.quality) return -1;
            if (b.label > a.label) return 1;
            if (b.label < a.label) return -1;
            return 0;
          });
          return items;
        } catch (e) {}

        return [];
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function parseStream(element, call, error, itemsExtractor, str, url) {
        var file = '';
        var quality = false;
        var items = itemsExtractor(str, url);

        if (items && items.length) {
          file = items[0].file;
          quality = {};
          items.forEach(function (item) {
            quality[item.label] = item.file;
          });
        }

        if (file) {
          element.stream = file;
          element.qualitys = quality;
          call(element);
        } else error();
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStreamM3U(element, call, error, file) {
        file = file.replace(/\.mp4:hls:manifest/, '');
        var hls_file = file.replace(/\/\d\d\d+([^\/]*\.m3u8)$/, '/hls$1');
        var link_prox = file.indexOf(no_prox) !== -1 ? '' : prox;
        network.clear();
        network.timeout(5000);
        network["native"](component.proxyLink(hls_file, link_prox, prox_enc), function (str) {
          parseStream(element, call, error, extractItems, str, hls_file);
        }, function (a, c) {
          if (file != hls_file) {
            network.clear();
            network.timeout(5000);
            network["native"](component.proxyLink(file, link_prox, prox_enc), function (str) {
              parseStream(element, call, error, extractItems, str, file);
            }, function (a, c) {
              error();
            }, false, {
              dataType: 'text'
            });
          } else error();
        }, false, {
          dataType: 'text'
        });
      }

      function parseSubs(tracks) {
        if (!(tracks && tracks.length)) return false;
        var subtitles = tracks.filter(function (t) {
          return t.kind === 'captions';
        }).map(function (item) {
          var links = item.src || '';
          var link = links.split(' or ').filter(function (link) {
            return link;
          })[0] || '';
          link = component.fixLinkProtocol(link, prefer_http);
          var link_prox = link.indexOf(no_prox) !== -1 ? '' : prox;
          return {
            label: item.label,
            url: component.proxyLink(link, link_prox, prox_enc)
          };
        }).filter(function (s) {
          return s.url;
        });
        return subtitles.length ? subtitles : false;
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStream(element, call, error) {
        if (element.stream) return call(element);
        if (!element.media.playlist) return error();
        var url = component.fixLink(element.media.playlist, embed);
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(url, prox, prox_enc2), function (json) {
          var url = component.fixLinkProtocol(json && json.url || '', prefer_http);

          if (url) {
            element.subtitles = parseSubs(element.media.tracks);

            if (endsWith(url, '.m3u8')) {
              getStreamM3U(element, call, error, url);
              return;
            }

            var link_prox = url.indexOf(no_prox) !== -1 ? '' : prox;
            element.stream = component.proxyLink(url, link_prox, prox_enc);
            element.qualitys = false;
            call(element);
          } else error();
        }, function (a, c) {
          error();
        }, {}, {
          headers: headers2
        });
      }
      /**
       * Добавить видео
       * @param {Array} items
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var last_episode = component.getLastEpisode(items);
        
        // Получаем данные из объекта movie для постера и рейтинга
        var movie = object.movie || {};
        var poster = movie.poster || movie.backdrop || '';
        var rating = movie.vote_average || movie.rating || movie.vote_average_kinopoisk || 0;
        if (rating && typeof rating === 'string') {
          rating = parseFloat(rating.replace(',', '.'));
        }
        rating = rating ? rating.toFixed(1) : '';
        var stars = rating ? Utils.generateRatingStars(parseFloat(rating)) : '';
        var ratingBadge = rating ? 
          `<div class="rating-badge">${rating}</div>` : '';
        
        // Дата релиза
        var releaseDate = movie.release_date || movie.first_air_date || movie.year || '';
        var formattedDate = Utils.formatReleaseDate(releaseDate);

        items.forEach(function (element) {
          if (element.season) {
            element.translate_episode_end = last_episode;
            element.translate_voice = filter_items.voice[choice.voice];
          }

          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          
          // Добавляем новые поля в элемент
          element.id = element.id || Lampa.Utils.hash(element.title + Date.now());
          element.poster = poster;
          element.release_date = formattedDate;
          element.rating = rating ? rating + '/10' : '';
          element.stars = stars;
          element.rating_badge = ratingBadge;
          
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.title);
          element.timeline = view;
          
          // Добавляем прогресс просмотра
          item.append(Lampa.Timeline.render(view));
          if (view && view.percent) {
            item.find('.online__progress').css('width', view.percent + '%');
          }

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          
          item.on('hover:enter', function () {
            if (element.loading) return;
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            element.loading = true;
            getStream(element, function (element) {
              element.loading = false;
              var first = {
                url: component.getDefaultQuality(element.qualitys, element.stream),
                quality: component.renameQualityMap(element.qualitys),
                subtitles: element.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };
              Lampa.Player.play(first);

              if (element.season && Lampa.Platform.version) {
                var playlist = [];
                items.forEach(function (elem) {
                  if (elem == element) {
                    playlist.push(first);
                  } else {
                    var cell = {
                      url: function url(call) {
                        getStream(elem, function (elem) {
                          cell.url = component.getDefaultQuality(elem.qualitys, elem.stream);
                          cell.quality = component.renameQualityMap(elem.qualitys);
                          cell.subtitles = elem.subtitles;
                          call();
                        }, function () {
                          cell.url = '';
                          call();
                        });
                      },
                      timeline: elem.timeline,
                      title: elem.title
                    };
                    playlist.push(cell);
                  }
                });
                Lampa.Player.playlist(playlist);
              } else {
                Lampa.Player.playlist([first]);
              }

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            }, function () {
              element.loading = false;
              Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
            });
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            element: element,
            file: function file(call) {
              getStream(element, function (element) {
                call({
                  file: element.stream,
                  quality: element.qualitys
                });
              }, function () {
                Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
              });
            }
          });
        });
        component.start(true);
      }
    }

    // ... (остальные функции источников: lumex2, rezka2, kinobase и т.д.)
    // Для краткости я не включаю их сюда, но они остаются без изменений
    // Вам нужно сохранить все остальные функции источников из вашего original plugin.js

    // [Здесь должны быть все остальные функции: lumex2, rezka2, kinobase, collaps, cdnmovies, filmix, zetflix, fancdn, fancdn2, fanserials, videoseed, vibix, redheadsound, cdnvideohub, anilibria, anilibria2, animelib, kodik, alloha, kinopub]

    // В функции resetTemplates заменяем шаблоны на новые с постером, датой и рейтингом
    function resetTemplates() {
      // Шаблон для обычных файлов (видео) с датой и рейтингом
      Lampa.Template.add('online_mod', `
        <div class="online selector" data-id="{id}">
          <div class="online__poster">
            <img src="{poster}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%20100%20150%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23333%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%23fff%22%20font-size%3D%2224%22%3E{title}%3C%2Ftext%3E%3C%2Fsvg%3E'">
            {rating_badge}
          </div>
          <div class="online__body">
            <div class="online__title">{title}</div>
            <div class="online__meta">
              <span class="online__quality">{quality}</span>
              <span class="online__date">{release_date}</span>
              <span class="online__info">{info}</span>
            </div>
            <div class="online__rating">
              <span class="online__rating-stars">{stars}</span>
              <span class="online__rating-value">{rating}</span>
            </div>
            <div class="online__progress"></div>
          </div>
        </div>
      `);

      // Шаблон для папок (сезоны/похожие) с датой
      Lampa.Template.add('online_mod_folder', `
        <div class="online folder selector" data-id="{id}">
          <div class="online__poster folder">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 20Q3.175 20 2.588 19.413 2 18.825 2 18V6Q2 5.175 2.588 4.588 3.175 4 4 4H9L11 6H20Q20.825 6 21.413 6.588 22 7.175 22 8V18Q22 18.825 21.413 19.413 20.825 20 20 20Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="online__body">
            <div class="online__title">{title}</div>
            <div class="online__meta">
              <span class="online__quality">{quality}</span>
              <span class="online__date">{release_date}</span>
              <span class="online__info">{info}</span>
            </div>
          </div>
        </div>
      `);
    }

    // ... (остальной код плагина: proxyInitialized, component, и т.д.)

    var mod_version = '13.02.2026';
    var isMSX = !!(window.TVXHost || window.TVXManager);
    var isTizen = navigator.userAgent.toLowerCase().indexOf('tizen') !== -1;
    var isIFrame = window.parent !== window;
    var isLocal = !startsWith(window.location.protocol, 'http');
    var androidHeaders = Lampa.Platform.is('android') && Utils.checkAndroidVersion(339);
    var filmixHost = Utils.filmixHost();
    var network = new Lampa.Reguest();
    var online_loading = false;

    function logApp() {
      console.log('App', 'start address:', window.location.href);
      console.log('App', 'is MSX:', isMSX);
      console.log('App', 'is Tizen:', isTizen);
      console.log('App', 'is iframe:', isIFrame);
      console.log('App', 'is local:', isLocal);
      console.log('App', 'supports headers:', androidHeaders);
    }

    function initStorage() {
      if (!Utils.isDebug()) {
        Lampa.Storage.set('online_mod_proxy_lumex', 'false');
        Lampa.Storage.set('online_mod_proxy_rezka2', 'false');
        Lampa.Storage.set('online_mod_proxy_kinobase', 'false');
        Lampa.Storage.set('online_mod_proxy_collaps', 'false');
        Lampa.Storage.set('online_mod_proxy_cdnmovies', 'false');
        Lampa.Storage.set('online_mod_proxy_fancdn', 'false');
        Lampa.Storage.set('online_mod_proxy_fancdn2', 'false');
        Lampa.Storage.set('online_mod_proxy_fanserials', 'false');
        Lampa.Storage.set('online_mod_proxy_fanserials_cdn', 'false');
        Lampa.Storage.set('online_mod_proxy_animelib', 'false');
      } else if (!Lampa.Platform.is('android')) {
        Lampa.Storage.set('online_mod_proxy_lumex', 'true');
        Lampa.Storage.set('online_mod_proxy_cdnmovies', 'true');
        Lampa.Storage.set('online_mod_proxy_fancdn', 'true');
        Lampa.Storage.set('online_mod_proxy_fancdn2', 'true');

        if (!isLocal) {
          Lampa.Storage.set('online_mod_proxy_fanserials', 'true');
        }
      }

      if (!Lampa.Platform.is('android')) {
        Lampa.Storage.set('online_mod_proxy_filmix', 'true');
      }

      Lampa.Storage.set('online_mod_proxy_videoseed', Lampa.Platform.is('android') || isLocal ? 'false' : 'true');
      Lampa.Storage.set('online_mod_proxy_vibix', Lampa.Platform.is('android') ? 'false' : 'true');
      Lampa.Storage.set('online_mod_proxy_redheadsound', Lampa.Platform.is('android') ? 'false' : 'true');
      Lampa.Storage.set('online_mod_proxy_videodb', 'false');
      Lampa.Storage.set('online_mod_proxy_zetflix', 'false');
      Lampa.Storage.set('online_mod_proxy_kinopub', 'true');
      Lampa.Storage.set('online_mod_proxy_alloha', 'false');
      Lampa.Storage.set('online_mod_proxy_hdvb', 'false');
      Lampa.Storage.set('online_mod_proxy_kp', 'false');
      Lampa.Params.trigger('online_mod_iframe_proxy', !isTizen || isLocal);
      Lampa.Params.trigger('online_mod_proxy_iframe', false);
      Lampa.Params.trigger('online_mod_use_stream_proxy', false);
      Lampa.Params.trigger('online_mod_proxy_find_ip', false);
      Lampa.Params.trigger('online_mod_proxy_other', false);
      Lampa.Params.trigger('online_mod_proxy_lumex', false);
      Lampa.Params.trigger('online_mod_proxy_rezka', false);
      Lampa.Params.trigger('online_mod_proxy_rezka2', false);
      Lampa.Params.trigger('online_mod_proxy_rezka2_mirror', false);
      Lampa.Params.trigger('online_mod_proxy_kinobase', false);
      Lampa.Params.trigger('online_mod_proxy_collaps', false);
      Lampa.Params.trigger('online_mod_proxy_cdnmovies', false);
      Lampa.Params.trigger('online_mod_proxy_filmix', false);
      Lampa.Params.trigger('online_mod_proxy_videodb', false);
      Lampa.Params.trigger('online_mod_proxy_zetflix', false);
      Lampa.Params.trigger('online_mod_proxy_fancdn', false);
      Lampa.Params.trigger('online_mod_proxy_fancdn2', false);
      Lampa.Params.trigger('online_mod_proxy_fanserials', false);
      Lampa.Params.trigger('online_mod_proxy_fanserials_cdn', false);
      Lampa.Params.trigger('online_mod_proxy_videoseed', false);
      Lampa.Params.trigger('online_mod_proxy_vibix', false);
      Lampa.Params.trigger('online_mod_proxy_redheadsound', false);
      Lampa.Params.trigger('online_mod_proxy_cdnvideohub', false);
      Lampa.Params.trigger('online_mod_proxy_anilibria', false);
      Lampa.Params.trigger('online_mod_proxy_anilibria2', false);
      Lampa.Params.trigger('online_mod_proxy_animelib', false);
      Lampa.Params.trigger('online_mod_proxy_kodik', false);
      Lampa.Params.trigger('online_mod_proxy_kinopub', false);
      Lampa.Params.trigger('online_mod_proxy_alloha', false);
      Lampa.Params.trigger('online_mod_proxy_hdvb', false);
      Lampa.Params.trigger('online_mod_proxy_kp', false);
      Lampa.Params.trigger('online_mod_skip_kp_search', false);
      Lampa.Params.trigger('online_mod_prefer_http', window.location.protocol !== 'https:');
      Lampa.Params.trigger('online_mod_prefer_mp4', true);
      Lampa.Params.trigger('online_mod_prefer_dash', false);
      Lampa.Params.trigger('online_mod_collaps_lampa_player', false);
      Lampa.Params.trigger('online_mod_full_episode_title', false);
      Lampa.Params.trigger('online_mod_av1_support', true);
      Lampa.Params.trigger('online_mod_save_last_balanser', false);
      Lampa.Params.trigger('online_mod_rezka2_fix_stream', false);
      Lampa.Params.select('online_mod_kinobase_mirror', '', '');
      Lampa.Params.select('online_mod_kinobase_cookie', '', '');
      Lampa.Params.select('online_mod_rezka2_mirror', '', '');
      Lampa.Params.select('online_mod_rezka2_name', '', '');
      Lampa.Params.select('online_mod_rezka2_password', '', '');
      Lampa.Params.select('online_mod_rezka2_cookie', '', '');
      Lampa.Params.select('online_mod_rezka2_prx_ukr', {
        'prx.ukrtelcdn.net': 'prx.ukrtelcdn.net',
        'prx-cogent.ukrtelcdn.net': 'prx-cogent.ukrtelcdn.net',
        'prx2-cogent.ukrtelcdn.net': 'prx2-cogent.ukrtelcdn.net',
        'prx3-cogent.ukrtelcdn.net': 'prx3-cogent.ukrtelcdn.net',
        'prx4-cogent.ukrtelcdn.net': 'prx4-cogent.ukrtelcdn.net',
        'prx-ams.ukrtelcdn.net': 'prx-ams.ukrtelcdn.net',
        'prx2-ams.ukrtelcdn.net': 'prx2-ams.ukrtelcdn.net'
      }, 'prx.ukrtelcdn.net');
      Lampa.Params.select('online_mod_fancdn_name', '', '');
      Lampa.Params.select('online_mod_fancdn_password', '', '');
      Lampa.Params.select('online_mod_fancdn_cookie', '', '');
      Lampa.Params.select('online_mod_fancdn_token', '', '');
      Lampa.Params.select('online_mod_proxy_other_url', '', '');
      Lampa.Params.select('online_mod_secret_password', '', '');

      if (window.location.protocol === 'https:') {
        Lampa.Storage.set('online_mod_prefer_http', 'false');
      }

      if (Lampa.Storage.get('online_mod_proxy_reset', '') != 7) {
        Lampa.Storage.set('online_mod_proxy_lumex', 'true');
        Lampa.Storage.set('online_mod_proxy_reset', '7');
      }
    }

    function initLang() {
      if (!Lampa.Lang) {
        var lang_data = {};
        Lampa.Lang = {
          add: function add(data) {
            lang_data = data;
          },
          translate: function translate(key) {
            return lang_data[key] ? lang_data[key].ru : key;
          }
        };
      }

      Lampa.Lang.add({
        online_mod_watch: {
          ru: 'Смотреть онлайн',
          uk: 'Дивитися онлайн',
          be: 'Глядзець анлайн',
          en: 'Watch online',
          zh: '在线观看'
        },
        online_mod_nolink: {
          ru: 'Не удалось извлечь ссылку',
          uk: 'Неможливо отримати посилання',
          be: 'Не ўдалося атрымаць спасылку',
          en: 'Failed to fetch link',
          zh: '获取链接失败'
        },
        online_mod_blockedlink: {
          ru: 'К сожалению, это видео не доступно в вашем регионе',
          uk: 'На жаль, це відео не доступне у вашому регіоні',
          be: 'Нажаль, гэта відэа не даступна ў вашым рэгіёне',
          en: 'Sorry, this video is not available in your region',
          zh: '抱歉，您所在的地区无法观看该视频'
        },
        online_mod_blockedlink_copyright: {
          ru: 'К сожалению, это видео не доступно по запросу правообладателей',
          uk: 'На жаль, це відео не доступне за запитом правовласників',
          be: 'Нажаль, гэта відэа не даступна па запыце праваўладальнікаў',
          en: 'Sorry, this video is not available due to copyright holder request',
          zh: '抱歉，由于版权所有者的要求，该视频无法播放。'
        },
        online_mod_waitlink: {
          ru: 'Работаем над извлечением ссылки, подождите...',
          uk: 'Працюємо над отриманням посилання, зачекайте...',
          be: 'Працуем над выманнем спасылкі, пачакайце...',
          en: 'Working on extracting the link, please wait...',
          zh: '正在提取链接，请稍候...'
        },
        online_mod_captcha_address: {
          ru: 'Требуется пройти капчу по адресу: ',
          uk: 'Потрібно пройти капчу за адресою: ',
          be: 'Патрабуецца прайсці капчу па адрасе: ',
          en: 'It is required to pass the captcha at: ',
          zh: '您需要完成验证码： '
        },
        online_mod_captcha_proxy: {
          ru: 'Требуется пройти капчу. Попробуйте использовать зеркало вместо прокси',
          uk: 'Потрібно пройти капчу. Спробуйте використовувати дзеркало замість проксі',
          be: 'Патрабуецца прайсці капчу. Паспрабуйце выкарыстоўваць люстэрка замест проксі',
          en: 'It is required to pass the captcha. Try to use a mirror instead of a proxy',
          zh: '您需要通过验证码。 尝试使用镜子而不是代理'
        },
        online_mod_balanser: {
          ru: 'Балансер',
          uk: 'Балансер',
          be: 'Балансер',
          en: 'Balancer',
          zh: '平衡器'
        },
        online_mod_file_helper: {
          ru: 'Удерживайте клавишу "ОК" для вызова контекстного меню',
          uk: 'Утримуйте клавішу "ОК" для виклику контекстного меню',
          be: 'Утрымлівайце клавішу "ОК" для выкліку кантэкстнага меню',
          en: 'Hold the "OK" key to bring up the context menu',
          zh: '按住“确定”键调出上下文菜单'
        },
        online_mod_clearmark_all: {
          ru: 'Снять отметку у всех',
          uk: 'Зняти позначку у всіх',
          be: 'Зняць адзнаку ва ўсіх',
          en: 'Uncheck all',
          zh: '取消所有'
        },
        online_mod_timeclear_all: {
          ru: 'Сбросить тайм-код у всех',
          uk: 'Скинути тайм-код у всіх',
          be: 'Скінуць тайм-код ва ўсіх',
          en: 'Reset timecode for all',
          zh: '为所有人重置时间码'
        },
        online_mod_query_start: {
          ru: 'По запросу',
          uk: 'На запит',
          be: 'Па запыце',
          en: 'On request',
          zh: '根据要求'
        },
        online_mod_query_end: {
          ru: 'нет результатов',
          uk: 'немає результатів',
          be: 'няма вынікаў',
          en: 'no results',
          zh: '没有结果'
        },
        online_mod_title: {
          ru: 'Онлайн',
          uk: 'Онлайн',
          be: 'Анлайн',
          en: 'Online',
          zh: '在线的'
        },
        online_mod_title_full: {
          ru: 'Онлайн Мод',
          uk: 'Онлайн Мод',
          be: 'Анлайн Мод',
          en: 'Online Mod',
          zh: '在线的 Mod'
        },
        online_mod_use_stream_proxy: {
          ru: 'Проксировать видеопоток (Укр)',
          uk: 'Проксирувати відеопотік (Укр)',
          be: 'Праксіраваць відэаструмень (Укр)',
          en: 'Proxy video stream (Ukr)',
          zh: '代理视频流 （乌克兰）'
        },
        online_mod_proxy_find_ip: {
          ru: 'Передавать свой IP прокси',
          uk: 'Передавати свій IP проксі',
          be: 'Перадаваць свой IP проксі',
          en: 'Send your IP to proxy',
          zh: '将您的 IP 发送给代理'
        },
        online_mod_proxy_other: {
          ru: 'Использовать альтернативный прокси',
          uk: 'Використовувати альтернативний проксі',
          be: 'Выкарыстоўваць альтэрнатыўны проксі',
          en: 'Use an alternative proxy',
          zh: '使用备用代理'
        },
        online_mod_proxy_other_url: {
          ru: 'Альтернативный прокси',
          uk: 'Альтернативний проксі',
          be: 'Альтэрнатыўны проксі',
          en: 'Alternative proxy',
          zh: '备用代理'
        },
        online_mod_proxy_balanser: {
          ru: 'Проксировать',
          uk: 'Проксирувати',
          be: 'Праксіраваць',
          en: 'Proxy',
          zh: '代理'
        },
        online_mod_proxy_kp: {
          ru: 'Проксировать КиноПоиск',
          uk: 'Проксирувати КиноПоиск',
          be: 'Праксіраваць КиноПоиск',
          en: 'Proxy KinoPoisk',
          zh: '代理 KinoPoisk'
        },
        online_mod_skip_kp_search: {
          ru: 'Не искать в КиноПоиск',
          uk: 'Не шукати у КиноПоиск',
          be: 'Не шукаць у КиноПоиск',
          en: 'Skip search in KinoPoisk',
          zh: '在 KinoPoisk 中跳过搜索'
        },
        online_mod_iframe_proxy: {
          ru: 'Использовать iframe-прокси',
          uk: 'Використовувати iframe-проксі',
          be: 'Выкарыстоўваць iframe-проксі',
          en: 'Use iframe proxy',
          zh: '使用 iframe 代理'
        },
        online_mod_prefer_http: {
          ru: 'Предпочитать поток по HTTP',
          uk: 'Віддавати перевагу потіку по HTTP',
          be: 'Аддаваць перавагу патоку па HTTP',
          en: 'Prefer stream over HTTP',
          zh: '优先于 HTTP 流式传输'
        },
        online_mod_prefer_mp4: {
          ru: 'Предпочитать поток MP4',
          uk: 'Віддавати перевагу потіку MP4',
          be: 'Аддаваць перавагу патоку MP4',
          en: 'Prefer MP4 stream',
          zh: '更喜欢 MP4 流'
        },
        online_mod_prefer_dash: {
          ru: 'Предпочитать DASH вместо HLS',
          uk: 'Віддавати перевагу DASH замість HLS',
          be: 'Аддаваць перавагу DASH замест HLS',
          en: 'Prefer DASH over HLS',
          zh: '更喜欢 DASH 而不是 HLS'
        },
        online_mod_collaps_lampa_player: {
          ru: 'Collaps: Встроенный плеер',
          uk: 'Collaps: Вбудований плеєр',
          be: 'Collaps: Убудаваны плэер',
          en: 'Collaps: Lampa player',
          zh: 'Collaps： Lampa播放器'
        },
        online_mod_full_episode_title: {
          ru: 'Полный формат названия серии',
          uk: 'Повний формат назви серії',
          be: 'Поўны фармат назвы серыі',
          en: 'Full episode title format',
          zh: '完整剧集标题格式'
        },
        online_mod_av1_support: {
          ru: 'AV1 поддерживается',
          uk: 'AV1 підтримується',
          be: 'AV1 падтрымліваецца',
          en: 'AV1 supported',
          zh: 'AV1 支持'
        },
        online_mod_save_last_balanser: {
          ru: 'Сохранять историю балансеров',
          uk: 'Зберігати історію балансерів',
          be: 'Захоўваць гісторыю балансараў',
          en: 'Save history of balancers',
          zh: '保存平衡器的历史记录'
        },
        online_mod_clear_last_balanser: {
          ru: 'Очистить историю балансеров',
          uk: 'Очистити історію балансерів',
          be: 'Ачысціць гісторыю балансараў',
          en: 'Clear history of balancers',
          zh: '清除平衡器的历史记录'
        },
        online_mod_kinobase_mirror: {
          ru: 'Зеркало для Kinobase',
          uk: 'Дзеркало для Kinobase',
          be: 'Люстэрка для Kinobase',
          en: 'Mirror for Kinobase',
          zh: 'Kinobase的镜子'
        },
        online_mod_kinobase_cookie: {
          ru: 'Куки для Kinobase',
          uk: 'Кукі для Kinobase',
          be: 'Кукі для Kinobase',
          en: 'Cookie for Kinobase',
          zh: 'Kinobase 的 Cookie'
        },
        online_mod_rezka2_mirror: {
          ru: 'Зеркало для HDrezka',
          uk: 'Дзеркало для HDrezka',
          be: 'Люстэрка для HDrezka',
          en: 'Mirror for HDrezka',
          zh: 'HDrezka的镜子'
        },
        online_mod_proxy_rezka2_mirror: {
          ru: 'Проксировать зеркало HDrezka',
          uk: 'Проксирувати дзеркало HDrezka',
          be: 'Праксіраваць люстэрка HDrezka',
          en: 'Proxy HDrezka mirror',
          zh: '代理HDrezka镜子'
        },
        online_mod_rezka2_name: {
          ru: 'Логин или email для HDrezka',
          uk: 'Логін чи email для HDrezka',
          be: 'Лагін ці email для HDrezka',
          en: 'Login or email for HDrezka',
          zh: 'HDrezka的登录名或电子邮件'
        },
        online_mod_rezka2_password: {
          ru: 'Пароль для HDrezka',
          uk: 'Пароль для HDrezka',
          be: 'Пароль для HDrezka',
          en: 'Password for HDrezka',
          zh: 'HDrezka的密码'
        },
        online_mod_rezka2_login: {
          ru: 'Войти в HDrezka',
          uk: 'Увійти до HDrezka',
          be: 'Увайсці ў HDrezka',
          en: 'Log in to HDrezka',
          zh: '登录HDrezka'
        },
        online_mod_rezka2_logout: {
          ru: 'Выйти из HDrezka',
          uk: 'Вийти з HDrezka',
          be: 'Выйсці з HDrezka',
          en: 'Log out of HDrezka',
          zh: '注销HDrezka'
        },
        online_mod_rezka2_cookie: {
          ru: 'Куки для HDrezka',
          uk: 'Кукі для HDrezka',
          be: 'Кукі для HDrezka',
          en: 'Cookie for HDrezka',
          zh: 'HDrezka 的 Cookie'
        },
        online_mod_rezka2_fill_cookie: {
          ru: 'Заполнить куки для HDrezka',
          uk: 'Заповнити кукі для HDrezka',
          be: 'Запоўніць кукі для HDrezka',
          en: 'Fill cookie for HDrezka',
          zh: '为HDrezka填充Cookie'
        },
        online_mod_rezka2_fix_stream: {
          ru: 'Фикс видеопотока для HDrezka',
          uk: 'Фікс відеопотоку для HDrezka',
          be: 'Фікс відэаструменю для HDrezka',
          en: 'Fix video stream for HDrezka',
          zh: '修复 HDrezka 的视频流'
        },
        online_mod_rezka2_prx_ukr: {
          ru: 'Прокси-сервер для HDrezka (Укр)',
          uk: 'Проксі-сервер для HDrezka (Укр)',
          be: 'Проксі-сервер для HDrezka (Укр)',
          en: 'Proxy server for HDrezka (Ukr)',
          zh: 'HDrezka 的代理服务器 （乌克兰）'
        },
        online_mod_fancdn_name: {
          ru: 'Логин для FanSerials',
          uk: 'Логін для FanSerials',
          be: 'Лагін для FanSerials',
          en: 'Login for FanSerials',
          zh: 'FanSerials的登录名'
        },
        online_mod_fancdn_password: {
          ru: 'Пароль для FanSerials',
          uk: 'Пароль для FanSerials',
          be: 'Пароль для FanSerials',
          en: 'Password for FanSerials',
          zh: 'FanSerials的密码'
        },
        online_mod_fancdn_cookie: {
          ru: 'Куки для FanSerials',
          uk: 'Кукі для FanSerials',
          be: 'Кукі для FanSerials',
          en: 'Cookie for FanSerials',
          zh: 'FanSerials 的 Cookie'
        },
        online_mod_fancdn_fill_cookie: {
          ru: 'Заполнить куки для FanSerials',
          uk: 'Заповнити кукі для FanSerials',
          be: 'Запоўніць кукі для FanSerials',
          en: 'Fill cookie for FanSerials',
          zh: '为FanSerials填充Cookie'
        },
        online_mod_fancdn_token: {
          ru: 'Токен для FanCDN',
          uk: 'Токен для FanCDN',
          be: 'Токен для FanCDN',
          en: 'Token for FanCDN',
          zh: 'FanCDN 代币'
        },
        online_mod_authorization_required: {
          ru: 'Требуется авторизация',
          uk: 'Потрібна авторизація',
          be: 'Патрабуецца аўтарызацыя',
          en: 'Authorization required',
          zh: '需要授权'
        },
        online_mod_unsupported_mirror: {
          ru: 'Неподдерживаемое зеркало',
          uk: 'Непідтримуване дзеркало',
          be: 'Непадтрымоўванае люстэрка',
          en: 'Unsupported mirror',
          zh: '不支持的镜子'
        },
        online_mod_secret_password: {
          ru: 'Секретный пароль',
          uk: 'Секретний пароль',
          be: 'Сакрэтны пароль',
          en: 'Secret password',
          zh: '秘密密码'
        },
        online_mod_seasons_count: {
          ru: 'Сезонов',
          uk: 'Сезонів',
          be: 'Сезонаў',
          en: 'Seasons',
          zh: '季'
        },
        online_mod_episodes_count: {
          ru: 'Эпизодов',
          uk: 'Епізодів',
          be: 'Эпізодаў',
          en: 'Episodes',
          zh: '集'
        },
        online_mod_show_more: {
          ru: 'Показать ещё',
          uk: 'Показати ще',
          be: 'Паказаць яшчэ',
          en: 'Show more',
          zh: '展示更多'
        },
        online_mod_server: {
          ru: 'Сервер',
          uk: 'Сервер',
          be: 'Сервер',
          en: 'Server',
          zh: '服务器'
        },
        online_mod_filmix_param_add_title: {
          ru: 'Добавить ТОКЕН от Filmix',
          uk: 'Додати ТОКЕН від Filmix',
          be: 'Дадаць ТОКЕН ад Filmix',
          en: 'Add TOKEN from Filmix',
          zh: '从 Filmix 添加 TOKEN'
        },
        online_mod_filmix_param_add_descr: {
          ru: 'Добавьте ТОКЕН для подключения подписки',
          uk: 'Додайте ТОКЕН для підключення передплати',
          be: 'Дадайце ТОКЕН для падлучэння падпіскі',
          en: 'Add a TOKEN to connect a subscription',
          zh: '添加 TOKEN 以连接订阅'
        },
        online_mod_filmix_param_placeholder: {
          ru: 'Например: nxjekeb57385b..',
          uk: 'Наприклад: nxjekeb57385b..',
          be: 'Напрыклад: nxjekeb57385b..',
          en: 'For example: nxjekeb57385b..',
          zh: '例如： nxjekeb57385b..'
        },
        online_mod_filmix_param_add_device: {
          ru: 'Добавить устройство на Filmix',
          uk: 'Додати пристрій на Filmix',
          be: 'Дадаць прыладу на Filmix',
          en: 'Add Device to Filmix',
          zh: '将设备添加到 Filmix'
        },
        online_mod_filmix_modal_text: {
          ru: 'Введите его на странице ' + filmixHost + '/consoles в вашем авторизованном аккаунте!',
          uk: 'Введіть його на сторінці ' + filmixHost + '/consoles у вашому авторизованому обліковому записі!',
          be: 'Увядзіце яго на старонцы ' + filmixHost + '/consoles у вашым аўтарызаваным акаўнце!',
          en: 'Enter it at ' + filmixHost + '/consoles in your authorized account!',
          zh: '在您的授权帐户中的 ' + filmixHost + '/consoles 中输入！'
        },
        online_mod_filmix_modal_wait: {
          ru: 'Ожидаем код',
          uk: 'Очікуємо код',
          be: 'Чакаем код',
          en: 'Waiting for the code',
          zh: '等待代码'
        },
        online_mod_filmix_copy_secuses: {
          ru: 'Код скопирован в буфер обмена',
          uk: 'Код скопійовано в буфер обміну',
          be: 'Код скапіяваны ў буфер абмену',
          en: 'Code copied to clipboard',
          zh: '代码复制到剪贴板'
        },
        online_mod_filmix_copy_fail: {
          ru: 'Ошибка при копировании',
          uk: 'Помилка при копіюванні',
          be: 'Памылка пры капіяванні',
          en: 'Copy error',
          zh: '复制错误'
        },
        online_mod_filmix_nodevice: {
          ru: 'Устройство не авторизовано',
          uk: 'Пристрій не авторизований',
          be: 'Прылада не аўтарызавана',
          en: 'Device not authorized',
          zh: '设备未授权'
        },
        online_mod_filmix_status: {
          ru: 'Статус',
          uk: 'Статус',
          be: 'Статус',
          en: 'Status',
          zh: '状态'
        },
        online_mod_voice_subscribe: {
          ru: 'Подписаться на перевод',
          uk: 'Підписатися на переклад',
          be: 'Падпісацца на пераклад',
          en: 'Subscribe to translation',
          zh: '订阅翻译'
        },
        online_mod_voice_success: {
          ru: 'Вы успешно подписались',
          uk: 'Ви успішно підписалися',
          be: 'Вы паспяхова падпісаліся',
          en: 'You have successfully subscribed',
          zh: '您已成功订阅'
        },
        online_mod_voice_error: {
          ru: 'Возникла ошибка',
          uk: 'Виникла помилка',
          be: 'Узнікла памылка',
          en: 'An error has occurred',
          zh: '发生了错误'
        }
      });
    }

    // Добавляем стили при инициализации
    addEnhancedStyles();

    // ... (остальной код: checkMyIp, checkCurrentFanserialsHost, loadOnline, initMain, initFilmix, initSettings, startPlugin)

    function checkMyIp(onComplite) {
      if (Lampa.Storage.field('online_mod_proxy_find_ip') !== true) {
        onComplite();
        return;
      }

      Utils.checkMyIp(network, onComplite);
    }

    function checkCurrentFanserialsHost(onComplite) {
      var host = Utils.getCurrentFanserialsHost();

      if (host || !Utils.isDebug()) {
        onComplite();
        return;
      }

      var prox = Utils.proxy('cookie');
      var prox_enc = '';
      var returnHeaders = androidHeaders;

      if (!prox && !returnHeaders) {
        onComplite();
        return;
      }

      var user_agent = Utils.baseUserAgent();
      var headers = Lampa.Platform.is('android') ? {
        'User-Agent': user_agent
      } : {};

      if (prox) {
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
        prox_enc += 'cookie_plus/param/Cookie=/head/';
        returnHeaders = false;
      }

      var url = Utils.fanserialsHost() + '/';
      network.clear();
      network.timeout(10000);
      network["native"](Utils.proxyLink(url, prox, prox_enc), function (json) {
        if (json && json.currentUrl) {
          var _url = Utils.parseURL(json.currentUrl);

          Utils.setCurrentFanserialsHost(_url.origin);
        }

        onComplite();
      }, function (a, c) {
        onComplite();
      }, false, {
        headers: headers,
        returnHeaders: returnHeaders
      });
    }

    function loadOnline(object) {
      if (online_loading) return;
      online_loading = true;
      Utils.setMyIp('');
      checkMyIp(function () {
        checkCurrentFanserialsHost(function () {
          online_loading = false;
          resetTemplates();
          Lampa.Component.add('online_mod', component);
          Lampa.Activity.push({
            url: '',
            title: Lampa.Lang.translate('online_mod_title_full'),
            component: 'online_mod',
            search: object.title,
            search_one: object.title,
            search_two: object.original_title,
            movie: object,
            page: 1
          });
        });
      });
    }

    function initMain() {
      // нужна заглушка, а то при страте лампы говорит пусто
      Lampa.Component.add('online_mod', component); //то же самое

      resetTemplates();
      var manifest = {
        type: 'video',
        version: mod_version,
        name: Lampa.Lang.translate('online_mod_title_full') + ' - ' + mod_version,
        description: Lampa.Lang.translate('online_mod_watch'),
        component: 'online_mod',
        onContextMenu: function onContextMenu(object) {
          return {
            name: Lampa.Lang.translate('online_mod_watch'),
            description: ''
          };
        },
        onContextLauch: function onContextLauch(object) {
          online_loading = false;
          loadOnline(object);
        }
      };
      Lampa.Manifest.plugins = manifest;
      var button = "<div class=\"full-start__button selector view--online_mod\" data-subtitle=\"online_mod " + mod_version + "\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:svgjs=\"http://svgjs.com/svgjs\" version=\"1.1\" width=\"512\" height=\"512\" x=\"0\" y=\"0\" viewBox=\"0 0 244 260\" style=\"enable-background:new 0 0 512 512\" xml:space=\"preserve\" class=\"\">\n        <g xmlns=\"http://www.w3.org/2000/svg\">\n            <path d=\"M242,88v170H10V88h41l-38,38h37.1l38-38h38.4l-38,38h38.4l38-38h38.3l-38,38H204L242,88L242,88z M228.9,2l8,37.7l0,0 L191.2,10L228.9,2z M160.6,56l-45.8-29.7l38-8.1l45.8,29.7L160.6,56z M84.5,72.1L38.8,42.4l38-8.1l45.8,29.7L84.5,72.1z M10,88 L2,50.2L47.8,80L10,88z\" fill=\"currentColor\"/>\n        </g></svg>\n\n        <span>#{online_mod_title}</span>\n        </div>";
      Lampa.Listener.follow('full', function (e) {
        if (e.type == 'complite') {
          var btn = $(Lampa.Lang.translate(button));
          online_loading = false;
          btn.on('hover:enter', function () {
            loadOnline(e.data.movie);
          });
          e.object.activity.render().find('.view--torrent').after(btn);
        }
      });

      if (Lampa.Storage.get('online_mod_use_stream_proxy', '') === '') {
        $.ajax({
          url: (window.location.protocol === 'https:' ? 'https://' : 'http://') + 'ipwho.is/?fields=ip,country_code',
          jsonp: 'callback',
          dataType: 'jsonp'
        }).done(function (json) {
          if (json && json.country_code) {
            Lampa.Storage.set('online_mod_use_stream_proxy', '' + (json.country_code === 'UA'));
          }
        });
      }

      if (Lampa.VPN && (Utils.isDebug() || Utils.isDebug2())) {
        if (Lampa.VPN.region) {
          Lampa.VPN.region = function (call) {
            if (call) call('de');
          };
        }

        if (Lampa.VPN.code) {
          Lampa.VPN.code = function () {
            return 'de';
          };
        }
      }
    }

    ///////FILMIX/////////

    var filmix_headers = Lampa.Platform.is('android') ? {
      'User-Agent': Utils.filmixUserAgent()
    } : {};
    var api_url = Utils.filmixAppHost() + '/api/v2/';
    var dev_id = Utils.randomHex(16);
    var ping_auth;

    function addSettingsFilmix() {
      if (Lampa.Settings.main && Lampa.Settings.main() && !Lampa.Settings.main().render().find('[data-component="filmix"]').length) {
        var field = $("<div class=\"settings-folder selector\" data-component=\"filmix\">\n            <div class=\"settings-folder__icon\">\n                <svg height=\"57\" viewBox=\"0 0 58 57\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path d=\"M20 20.3735V45H26.8281V34.1262H36.724V26.9806H26.8281V24.3916C26.8281 21.5955 28.9062 19.835 31.1823 19.835H39V13H26.8281C23.6615 13 20 15.4854 20 20.3735Z\" fill=\"white\"/>\n                <rect x=\"2\" y=\"2\" width=\"54\" height=\"53\" rx=\"5\" stroke=\"white\" stroke-width=\"4\"/>\n                </svg>\n            </div>\n            <div class=\"settings-folder__name\">Filmix</div>\n        </div>");
        Lampa.Settings.main().render().find('[data-component="more"]').after(field);
        Lampa.Settings.main().update();
      }
    }

    function showStatus() {
      var status = Lampa.Storage.get("filmix_status", '{}');
      var info = Lampa.Lang.translate('online_mod_filmix_nodevice');

      if (status.login) {
        if (status.is_pro) info = status.login + ' - PRO ' + Lampa.Lang.translate('filter_rating_to') + ' - ' + status.pro_date;else if (status.is_pro_plus) info = status.login + ' - PRO_PLUS ' + Lampa.Lang.translate('filter_rating_to') + ' - ' + status.pro_date;else info = status.login + ' - NO PRO';
      }

      var field = $(Lampa.Lang.translate("\n        <div class=\"settings-param\" data-name=\"filmix_status\" data-static=\"true\">\n            <div class=\"settings-param__name\">#{online_mod_filmix_status}</div>\n            <div class=\"settings-param__value\">".concat(info, "</div>\n        </div>")));
      $('.settings [data-name="filmix_status"]').remove();
      $('.settings [data-name="filmix_add"]').after(field);
    }

    function checkPro(token, call) {
      var filmix_prox = Utils.proxy('filmix');
      var filmix_prox_enc = '';

      if (filmix_prox) {
        filmix_prox_enc += 'param/User-Agent=' + encodeURIComponent(Utils.filmixUserAgent()) + '/';
      }

      network.clear();
      network.timeout(8000);
      network["native"](Utils.proxyLink(api_url + 'user_profile' + Utils.filmixToken(dev_id, token), filmix_prox, filmix_prox_enc, 'enc2'), function (json) {
        if (json) {
          if (json.user_data) {
            Lampa.Storage.set("filmix_status", json.user_data);
            if (call) call();
          } else {
            Lampa.Storage.set("filmix_status", {});
          }

          showStatus();
        }
      }, function (a, c) {
        Lampa.Noty.show(network.errorDecode(a, c));
      }, false, {
        headers: filmix_headers
      });
    }

    function initFilmix() {
      Lampa.Params.select('filmix_token', '', '');
      Lampa.Template.add('settings_filmix', "<div>\n        <div class=\"settings-param selector\" data-name=\"filmix_token\" data-type=\"input\" placeholder=\"#{online_mod_filmix_param_placeholder}\">\n            <div class=\"settings-param__name\">#{online_mod_filmix_param_add_title}</div>\n            <div class=\"settings-param__value\"></div>\n            <div class=\"settings-param__descr\">#{online_mod_filmix_param_add_descr}</div>\n        </div>\n        <div class=\"settings-param selector\" data-name=\"filmix_add\" data-static=\"true\">\n            <div class=\"settings-param__name\">#{online_mod_filmix_param_add_device}</div>\n        </div>\n    </div>");
      Lampa.Storage.listener.follow('change', function (e) {
        if (e.name == 'filmix_token') {
          window.mod_filmix = {
            max_qualitie: 480,
            is_max_qualitie: false
          };
          if (e.value) checkPro(e.value);else {
            Lampa.Storage.set("filmix_status", {});
            showStatus();
          }
        }
      });
      if (window.appready) addSettingsFilmix();else {
        Lampa.Listener.follow('app', function (e) {
          if (e.type == 'ready') addSettingsFilmix();
        });
      }
      Lampa.Settings.listener.follow('open', function (e) {
        if (e.name == 'filmix') {
          e.body.find('[data-name="filmix_add"]').unbind('hover:enter').on('hover:enter', function () {
            var user_code = '';
            var user_token = '';
            var filmix_prox = Utils.proxy('filmix');
            var filmix_prox_enc = '';

            if (filmix_prox) {
              filmix_prox_enc += 'param/User-Agent=' + encodeURIComponent(Utils.filmixUserAgent()) + '/';
            }

            var modal = $('<div><div class="broadcast__text">' + Lampa.Lang.translate('online_mod_filmix_modal_text') + '</div><div class="broadcast__device selector" style="text-align: center">' + Lampa.Lang.translate('online_mod_filmix_modal_wait') + '...</div><br><div class="broadcast__scan"><div></div></div></div></div>');
            Lampa.Modal.open({
              title: '',
              html: modal,
              onBack: function onBack() {
                clearInterval(ping_auth);
                Lampa.Modal.close();
                Lampa.Controller.toggle('settings_component');
              },
              onSelect: function onSelect() {
                Lampa.Utils.copyTextToClipboard(user_code, function () {
                  Lampa.Noty.show(Lampa.Lang.translate('online_mod_filmix_copy_secuses'));
                }, function () {
                  Lampa.Noty.show(Lampa.Lang.translate('online_mod_filmix_copy_fail'));
                });
              }
            });
            ping_auth = setInterval(function () {
              checkPro(user_token, function () {
                clearInterval(ping_auth);
                Lampa.Modal.close();
                Lampa.Storage.set("filmix_token", user_token);
                e.body.find('[data-name="filmix_token"] .settings-param__value').text(user_token);
                Lampa.Controller.toggle('settings_component');
              });
            }, 10000);
            network.clear();
            network.timeout(10000);
            network["native"](Utils.proxyLink(api_url + 'token_request' + Utils.filmixToken(dev_id, ''), filmix_prox, filmix_prox_enc, 'enc2'), function (found) {
              if (found && found.status == 'ok') {
                user_token = found.code;
                user_code = found.user_code;
                modal.find('.selector').text(user_code); //modal.find('.broadcast__scan').remove()
              } else {
                clearInterval(ping_auth);
                modal.find('.selector').text(Lampa.Lang.translate('network_401'));
                modal.find('.broadcast__scan').remove();
                Lampa.Noty.show(Lampa.Lang.translate('network_401'));
              }
            }, function (a, c) {
              clearInterval(ping_auth);
              modal.find('.selector').text(Lampa.Lang.translate('network_noconnect') + ': ' + network.errorCode(a));
              modal.find('.broadcast__scan').remove();
              Lampa.Noty.show(network.errorDecode(a, c));
            }, false, {
              headers: filmix_headers
            });
          });
          showStatus();
        }
      });
    }

    ///////Rezka2/////////

    function rezka2Login(success, error) {
      var host = Utils.rezka2Mirror();
      var url = host + '/ajax/login/';
      var postdata = 'login_name=' + encodeURIComponent(Lampa.Storage.get('online_mod_rezka2_name', ''));
      postdata += '&login_password=' + encodeURIComponent(Lampa.Storage.get('online_mod_rezka2_password', ''));
      postdata += '&login_not_save=0';
      network.clear();
      network.timeout(8000);
      network.silent(url, function (json) {
        if (json && (json.success || json.message == 'Уже авторизован на сайте. Необходимо обновить страницу!')) {
          Lampa.Storage.set('online_mod_rezka2_status', 'true');
          network.clear();
          network.timeout(8000);
          network.silent(host + '/', function (str) {
            str = (str || '').replace(/\n/g, '');
            var error_form = str.match(/(<div class="error-code">[^<]*<div>[^<]*<\/div>[^<]*<\/div>)\s*(<div class="error-title">[^<]*<\/div>)/);

            if (error_form) {
              Lampa.Noty.show(error_form[0]);
              if (error) error();
              return;
            }

            var verify_form = str.match(/<span>MIRROR<\/span>.*<button type="submit" onclick="\$\.cookie(\([^)]*\))/);

            if (verify_form) {
              Lampa.Noty.show(Lampa.Lang.translate('online_mod_unsupported_mirror') + ' HDrezka');
              rezka2Logout(error, error);
              return;
            }

            if (success) success();
          }, function (a, c) {
            if (success) success();
          }, false, {
            dataType: 'text',
            withCredentials: true
          });
        } else {
          Lampa.Storage.set('online_mod_rezka2_status', 'false');
          if (json && json.message) Lampa.Noty.show(json.message);
          if (error) error();
        }
      }, function (a, c) {
        Lampa.Noty.show(network.errorDecode(a, c));
        if (error) error();
      }, postdata, {
        withCredentials: true
      });
    }

    function rezka2Logout(success, error) {
      var url = Utils.rezka2Mirror() + '/logout/';
      network.clear();
      network.timeout(8000);
      network.silent(url, function (str) {
        Lampa.Storage.set('online_mod_rezka2_status', 'false');
        if (success) success();
      }, function (a, c) {
        Lampa.Storage.set('online_mod_rezka2_status', 'false');
        Lampa.Noty.show(network.errorDecode(a, c));
        if (error) error();
      }, false, {
        dataType: 'text',
        withCredentials: true
      });
    }

    function rezka2FillCookie(success, error) {
      var prox = Utils.proxy('rezka2');
      var prox_enc = '';
      var returnHeaders = androidHeaders;
      var proxy_mirror = Lampa.Storage.field('online_mod_proxy_rezka2_mirror') === true;
      var host = prox && !proxy_mirror ? 'https://rezka.ag' : Utils.rezka2Mirror();
      if (!prox && !returnHeaders) prox = Utils.proxy('cookie');

      if (!prox && !returnHeaders) {
        if (error) error();
        return;
      }

      var user_agent = Utils.baseUserAgent();
      var headers = Lampa.Platform.is('android') ? {
        'User-Agent': user_agent
      } : {};

      if (prox) {
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
        prox_enc += 'cookie_plus/param/Cookie=/';
        returnHeaders = false;
      }

      var url = host + '/ajax/login/';
      var postdata = 'login_name=' + encodeURIComponent(Lampa.Storage.get('online_mod_rezka2_name', ''));
      postdata += '&login_password=' + encodeURIComponent(Lampa.Storage.get('online_mod_rezka2_password', ''));
      postdata += '&login_not_save=0';
      network.clear();
      network.timeout(8000);
      network["native"](Utils.proxyLink(url, prox, prox_enc), function (json) {
        var cookie = '';
        var values = {};
        var sid = '';
        var body = json && json.body || {};
        body = typeof body === 'string' ? Lampa.Arrays.decodeJson(body, {}) : body;

        if (!body.success) {
          if (body.message) Lampa.Noty.show(body.message);
          if (error) error();
          return;
        }

        var cookieHeaders = json && json.headers && json.headers['set-cookie'] || null;

        if (cookieHeaders && cookieHeaders.forEach) {
          cookieHeaders.forEach(function (param) {
            var parts = param.split(';')[0].split('=');

            if (parts[0]) {
              if (parts[1] === 'deleted') delete values[parts[0]];else values[parts[0]] = parts[1] || '';
            }
          });
          sid = values['PHPSESSID'];
          delete values['PHPSESSID'];
          var cookies = [];

          for (var name in values) {
            cookies.push(name + '=' + values[name]);
          }

          cookie = cookies.join('; ');
        }

        if (cookie) {
          Lampa.Storage.set('online_mod_rezka2_cookie', cookie);
          if (cookie.indexOf('PHPSESSID=') == -1) cookie = 'PHPSESSID=' + (sid || Utils.randomId(26)) + (cookie ? '; ' + cookie : '');
          var prox_enc2 = prox_enc;

          if (prox) {
            prox_enc2 += 'param/Cookie=' + encodeURIComponent(cookie) + '/';
          } else {
            headers['Cookie'] = cookie;
          }

          network.clear();
          network.timeout(8000);
          network["native"](Utils.proxyLink(host + '/', prox, prox_enc2), function (str) {
            var json = typeof str === 'string' ? Lampa.Arrays.decodeJson(str, {}) : str;
            var body = (json && json.body || '').replace(/\n/g, '');
            var error_form = body.match(/(<div class="error-code">[^<]*<div>[^<]*<\/div>[^<]*<\/div>)\s*(<div class="error-title">[^<]*<\/div>)/);

            if (error_form) {
              Lampa.Noty.show(error_form[0]);
              if (error) error();
              return;
            }

            var cookieHeaders = json && json.headers && json.headers['set-cookie'] || null;

            if (cookieHeaders && cookieHeaders.forEach) {
              cookieHeaders.forEach(function (param) {
                var parts = param.split(';')[0].split('=');

                if (parts[0]) {
                  if (parts[1] === 'deleted') delete values[parts[0]];else values[parts[0]] = parts[1] || '';
                }
              });
              sid = values['PHPSESSID'] || sid;
              delete values['PHPSESSID'];
              var _cookies = [];

              for (var _name in values) {
                _cookies.push(_name + '=' + values[_name]);
              }

              cookie = _cookies.join('; ');
              if (cookie) Lampa.Storage.set('online_mod_rezka2_cookie', cookie);
            }

            var verify_form = body.match(/<span>MIRROR<\/span>.*<button type="submit" onclick="\$\.cookie(\([^)]*\))/);

            if (verify_form) {
              var verify_cookie;

              try {
                verify_cookie = (0, eval)('"use strict"; (function(name, value){ return {name: name, value: value}; })' + verify_form[1] + ';');
              } catch (e) {}

              if (verify_cookie) {
                values[verify_cookie.name] = verify_cookie.value;
                var _cookies2 = [];

                for (var _name2 in values) {
                  _cookies2.push(_name2 + '=' + values[_name2]);
                }

                cookie = _cookies2.join('; ');
                if (cookie) Lampa.Storage.set('online_mod_rezka2_cookie', cookie);
                if (cookie.indexOf('PHPSESSID=') == -1) cookie = 'PHPSESSID=' + (sid || Utils.randomId(26)) + (cookie ? '; ' + cookie : '');
                var prox_enc3 = prox_enc;

                if (prox) {
                  prox_enc3 += 'param/Cookie=' + encodeURIComponent(cookie) + '/';
                } else {
                  headers['Cookie'] = cookie;
                }

                network.clear();
                network.timeout(8000);
                network["native"](Utils.proxyLink(host + '/', prox, prox_enc3), function (str) {
                  var json = typeof str === 'string' ? Lampa.Arrays.decodeJson(str, {}) : str;
                  var body = (json && json.body || '').replace(/\n/g, '');
                  var error_form = body.match(/(<div class="error-code">[^<]*<div>[^<]*<\/div>[^<]*<\/div>)\s*(<div class="error-title">[^<]*<\/div>)/);

                  if (error_form) {
                    Lampa.Noty.show(error_form[0]);
                    if (error) error();
                    return;
                  }

                  var verify_form = body.match(/<span>MIRROR<\/span>.*<button type="submit" onclick="\$\.cookie(\([^)]*\))/);

                  if (verify_form) {
                    Lampa.Storage.set('online_mod_rezka2_cookie', '');
                    Lampa.Noty.show(Lampa.Lang.translate('online_mod_unsupported_mirror') + ' HDrezka');
                    if (error) error();
                    return;
                  }

                  var cookieHeaders = json && json.headers && json.headers['set-cookie'] || null;

                  if (cookieHeaders && cookieHeaders.forEach) {
                    cookieHeaders.forEach(function (param) {
                      var parts = param.split(';')[0].split('=');

                      if (parts[0]) {
                        if (parts[1] === 'deleted') delete values[parts[0]];else values[parts[0]] = parts[1] || '';
                      }
                    });
                    sid = values['PHPSESSID'] || sid;
                    delete values['PHPSESSID'];
                    var _cookies3 = [];

                    for (var _name3 in values) {
                      _cookies3.push(_name3 + '=' + values[_name3]);
                    }

                    cookie = _cookies3.join('; ');
                    if (cookie) Lampa.Storage.set('online_mod_rezka2_cookie', cookie);
                  }

                  if (success) success();
                }, function (a, c) {
                  if (success) success();
                }, false, {
                  dataType: 'text',
                  headers: headers,
                  returnHeaders: returnHeaders
                });
                return;
              }
            }

            if (success) success();
          }, function (a, c) {
            if (success) success();
          }, false, {
            dataType: 'text',
            headers: headers,
            returnHeaders: returnHeaders
          });
        } else {
          if (error) error();
        }
      }, function (a, c) {
        Lampa.Noty.show(network.errorDecode(a, c));
        if (error) error();
      }, postdata, {
        headers: headers,
        returnHeaders: returnHeaders
      });
    }

    function fancdnFillCookie(success, error) {
      var prox = Utils.proxy('fancdn');
      var prox_enc = '';
      var returnHeaders = androidHeaders;

      if (!prox && !returnHeaders) {
        if (error) error();
        return;
      }

      var host = Utils.fanserialsHost();
      var user_agent = Utils.baseUserAgent();
      var headers = Lampa.Platform.is('android') ? {
        'User-Agent': user_agent
      } : {};

      if (prox) {
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
        prox_enc += 'cookie_plus/param/Cookie=/';
        returnHeaders = false;
      }

      var url = host + '/';
      var postdata = 'login_name=' + encodeURIComponent(Lampa.Storage.get('online_mod_fancdn_name', ''));
      postdata += '&login_password=' + encodeURIComponent(Lampa.Storage.get('online_mod_fancdn_password', ''));
      postdata += '&login=submit';
      network.clear();
      network.timeout(8000);
      network["native"](Utils.proxyLink(url, prox, prox_enc), function (str) {
        var cookie = '';
        var values = {};
        var sid = '';
        var json = typeof str === 'string' ? Lampa.Arrays.decodeJson(str, {}) : str;
        var body = (json && json.body || '').replace(/\n/g, '');
        var error_form = body.match(/(<div class="berrors-inner">[^<]*<b class="berrors-title">[^<]*<\/b>[^<]*<\/div>)/);

        if (error_form) {
          Lampa.Noty.show(error_form[0]);
          if (error) error();
          return;
        }

        var cookieHeaders = json && json.headers && json.headers['set-cookie'] || null;

        if (cookieHeaders && cookieHeaders.forEach) {
          cookieHeaders.forEach(function (param) {
            var parts = param.split(';')[0].split('=');

            if (parts[0]) {
              if (parts[1] === 'deleted') delete values[parts[0]];else values[parts[0]] = parts[1] || '';
            }
          });
          sid = values['PHPSESSID'];
          delete values['PHPSESSID'];
          var cookies = [];

          for (var name in values) {
            cookies.push(name + '=' + values[name]);
          }

          cookie = cookies.join('; ');
        }

        if (cookie) {
          Lampa.Storage.set('online_mod_fancdn_cookie', cookie);
          if (cookie.indexOf('PHPSESSID=') == -1) cookie = 'PHPSESSID=' + (sid || Utils.randomHex(32)) + (cookie ? '; ' + cookie : '');
          var prox_enc2 = prox_enc;

          if (prox) {
            prox_enc2 += 'param/Cookie=' + encodeURIComponent(cookie) + '/';
          } else {
            headers['Cookie'] = cookie;
          }

          network.clear();
          network.timeout(8000);
          network["native"](Utils.proxyLink(host + '/', prox, prox_enc2), function (str) {
            var json = typeof str === 'string' ? Lampa.Arrays.decodeJson(str, {}) : str;
            var body = (json && json.body || '').replace(/\n/g, '');
            var error_form = body.match(/(<div class="berrors-inner">[^<]*<b class="berrors-title">[^<]*<\/b>[^<]*<\/div>)/);

            if (error_form) {
              Lampa.Noty.show(error_form[0]);
              if (error) error();
              return;
            }

            var cookieHeaders = json && json.headers && json.headers['set-cookie'] || null;

            if (cookieHeaders && cookieHeaders.forEach) {
              cookieHeaders.forEach(function (param) {
                var parts = param.split(';')[0].split('=');

                if (parts[0]) {
                  if (parts[1] === 'deleted') delete values[parts[0]];else values[parts[0]] = parts[1] || '';
                }
              });
              delete values['PHPSESSID'];
              var _cookies4 = [];

              for (var _name4 in values) {
                _cookies4.push(_name4 + '=' + values[_name4]);
              }

              cookie = _cookies4.join('; ');
              if (cookie) Lampa.Storage.set('online_mod_fancdn_cookie', cookie);
            }

            if (success) success();
          }, function (a, c) {
            if (success) success();
          }, false, {
            dataType: 'text',
            headers: headers,
            returnHeaders: returnHeaders
          });
        } else {
          if (error) error();
        }
      }, function (a, c) {
        Lampa.Noty.show(network.errorDecode(a, c));
        if (error) error();
      }, postdata, {
        dataType: 'text',
        headers: headers,
        returnHeaders: returnHeaders
      });
    }

    ///////Онлайн Мод/////////

    function addSettingsOnlineMod() {
      if (Lampa.Settings.main && Lampa.Settings.main() && !Lampa.Settings.main().render().find('[data-component="online_mod"]').length) {
        var field = $(Lampa.Lang.translate("<div class=\"settings-folder selector\" data-component=\"online_mod\">\n            <div class=\"settings-folder__icon\">\n                <svg height=\"260\" viewBox=\"0 0 244 260\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path d=\"M242,88v170H10V88h41l-38,38h37.1l38-38h38.4l-38,38h38.4l38-38h38.3l-38,38H204L242,88L242,88z M228.9,2l8,37.7l0,0 L191.2,10L228.9,2z M160.6,56l-45.8-29.7l38-8.1l45.8,29.7L160.6,56z M84.5,72.1L38.8,42.4l38-8.1l45.8,29.7L84.5,72.1z M10,88 L2,50.2L47.8,80L10,88z\" fill=\"white\"/>\n                </svg>\n            </div>\n            <div class=\"settings-folder__name\">#{online_mod_title_full}</div>\n        </div>"));
        Lampa.Settings.main().render().find('[data-component="more"]').after(field);
        Lampa.Settings.main().update();
      }
    }

    function initSettings() {
      var template = "<div>";

      if (Utils.isDebug()) {
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_lumex\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} Lumex</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      }

      if (Utils.isDebug()) {
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_rezka2\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} HDrezka</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_kinobase\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} Kinobase</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_collaps\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} Collaps</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_cdnmovies\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} CDNMovies</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      }

      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_filmix\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} Filmix</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";

      if (Utils.isDebug()) {
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_fancdn\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} FanCDN</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_fancdn2\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} FanCDN (ID)</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_fanserials\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} FanSerials</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_fanserials_cdn\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} FanSerials CDN</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_videoseed\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} VideoSeed</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_vibix\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} Vibix</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_redheadsound\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} RedHeadSound</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      }

      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_anilibria\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} AniLibria</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_anilibria2\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} AniLibria.top</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";

      if (Utils.isDebug()) {
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_animelib\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} AnimeLib</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      }

      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_kodik\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} Kodik</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_skip_kp_search\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_skip_kp_search}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_iframe_proxy\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_iframe_proxy}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_iframe\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_balanser} iframe</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_prefer_http\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_prefer_http}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_prefer_mp4\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_prefer_mp4}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";

      {
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_collaps_lampa_player\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_collaps_lampa_player}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      }

      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_full_episode_title\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_full_episode_title}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_save_last_balanser\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_save_last_balanser}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>\n        <div class=\"settings-param selector\" data-name=\"online_mod_clear_last_balanser\" data-static=\"true\">\n            <div class=\"settings-param__name\">#{online_mod_clear_last_balanser}</div>\n            <div class=\"settings-param__status\"></div>\n        </div>";

      if (Utils.isDebug()) {
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_kinobase_mirror\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n            <div class=\"settings-param__name\">#{online_mod_kinobase_mirror}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_kinobase_cookie\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n            <div class=\"settings-param__name\">#{online_mod_kinobase_cookie}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      }

      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_mirror\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n            <div class=\"settings-param__name\">#{online_mod_rezka2_mirror}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";

      if (Utils.isDebug()) {
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_rezka2_mirror\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_rezka2_mirror}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      }

      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_name\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n            <div class=\"settings-param__name\">#{online_mod_rezka2_name}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>\n        <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_password\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n            <div class=\"settings-param__name\">#{online_mod_rezka2_password}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";

      if (Lampa.Platform.is('android')) {
        Lampa.Storage.set("online_mod_rezka2_status", 'false');
      } else {
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_login\" data-static=\"true\">\n            <div class=\"settings-param__name\">#{online_mod_rezka2_login}</div>\n            <div class=\"settings-param__status\"></div>\n        </div>\n        <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_logout\" data-static=\"true\">\n            <div class=\"settings-param__name\">#{online_mod_rezka2_logout}</div>\n            <div class=\"settings-param__status\"></div>\n        </div>";
      }

      if (Utils.isDebug() || Lampa.Platform.is('android')) {
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_cookie\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n            <div class=\"settings-param__name\">#{online_mod_rezka2_cookie}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>\n        <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_fill_cookie\" data-static=\"true\">\n            <div class=\"settings-param__name\">#{online_mod_rezka2_fill_cookie}</div>\n            <div class=\"settings-param__status\"></div>\n        </div>";
      }

      {
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_fix_stream\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_rezka2_fix_stream}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      }

      if (Utils.isDebug()) {
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_fancdn_name\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n            <div class=\"settings-param__name\">#{online_mod_fancdn_name}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>\n        <div class=\"settings-param selector\" data-name=\"online_mod_fancdn_password\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n            <div class=\"settings-param__name\">#{online_mod_fancdn_password}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      }

      if (Utils.isDebug()) {
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_fancdn_cookie\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n            <div class=\"settings-param__name\">#{online_mod_fancdn_cookie}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      }

      if (Utils.isDebug()) {
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_fancdn_fill_cookie\" data-static=\"true\">\n            <div class=\"settings-param__name\">#{online_mod_fancdn_fill_cookie}</div>\n            <div class=\"settings-param__status\"></div>\n        </div>";
      }

      if (Utils.isDebug()) {
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_fancdn_token\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n            <div class=\"settings-param__name\">#{online_mod_fancdn_token}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      }

      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_use_stream_proxy\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_use_stream_proxy}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_prx_ukr\" data-type=\"select\">\n            <div class=\"settings-param__name\">#{online_mod_rezka2_prx_ukr}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_find_ip\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_find_ip}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_other\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_other}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>\n        <div class=\"settings-param selector\" data-name=\"online_mod_proxy_other_url\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n            <div class=\"settings-param__name\">#{online_mod_proxy_other_url}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>\n        <div class=\"settings-param selector\" data-name=\"online_mod_secret_password\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n            <div class=\"settings-param__name\">#{online_mod_secret_password}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";

      if (Utils.isDebug()) {
        template += "\n        <div class=\"settings-param selector\" data-name=\"online_mod_av1_support\" data-type=\"toggle\">\n            <div class=\"settings-param__name\">#{online_mod_av1_support}</div>\n            <div class=\"settings-param__value\"></div>\n        </div>";
      }

      template += "\n    </div>";
      Lampa.Template.add('settings_online_mod', template);
      if (window.appready) addSettingsOnlineMod();else {
        Lampa.Listener.follow('app', function (e) {
          if (e.type == 'ready') addSettingsOnlineMod();
        });
      }
      Lampa.Settings.listener.follow('open', function (e) {
        if (e.name == 'online_mod') {
          var clear_last_balanser = e.body.find('[data-name="online_mod_clear_last_balanser"]');
          clear_last_balanser.unbind('hover:enter').on('hover:enter', function () {
            Lampa.Storage.set('online_last_balanser', {});
            Lampa.Storage.set('online_balanser', '');
            Lampa.Storage.set('online_mod_last_balanser', {});
            Lampa.Storage.set('online_mod_balanser', '');
            $('.settings-param__status', clear_last_balanser).removeClass('active error wait').addClass('active');
          });
          var rezka2_login = e.body.find('[data-name="online_mod_rezka2_login"]');
          rezka2_login.unbind('hover:enter').on('hover:enter', function () {
            var rezka2_login_status = $('.settings-param__status', rezka2_login).removeClass('active error wait').addClass('wait');
            rezka2Login(function () {
              rezka2_login_status.removeClass('active error wait').addClass('active');
            }, function () {
              rezka2_login_status.removeClass('active error wait').addClass('error');
            });
          });
          var rezka2_logout = e.body.find('[data-name="online_mod_rezka2_logout"]');
          rezka2_logout.unbind('hover:enter').on('hover:enter', function () {
            var rezka2_logout_status = $('.settings-param__status', rezka2_logout).removeClass('active error wait').addClass('wait');
            rezka2Logout(function () {
              rezka2_logout_status.removeClass('active error wait').addClass('active');
            }, function () {
              rezka2_logout_status.removeClass('active error wait').addClass('error');
            });
          });
          var rezka2_fill_cookie = e.body.find('[data-name="online_mod_rezka2_fill_cookie"]');
          rezka2_fill_cookie.unbind('hover:enter').on('hover:enter', function () {
            var rezka2_fill_cookie_status = $('.settings-param__status', rezka2_fill_cookie).removeClass('active error wait').addClass('wait');
            rezka2FillCookie(function () {
              rezka2_fill_cookie_status.removeClass('active error wait').addClass('active');
              Lampa.Params.update(e.body.find('[data-name="online_mod_rezka2_cookie"]'), [], e.body);
            }, function () {
              rezka2_fill_cookie_status.removeClass('active error wait').addClass('error');
              Lampa.Params.update(e.body.find('[data-name="online_mod_rezka2_cookie"]'), [], e.body);
            });
          });
          var fancdn_fill_cookie = e.body.find('[data-name="online_mod_fancdn_fill_cookie"]');
          fancdn_fill_cookie.unbind('hover:enter').on('hover:enter', function () {
            var fancdn_fill_cookie_status = $('.settings-param__status', fancdn_fill_cookie).removeClass('active error wait').addClass('wait');
            fancdnFillCookie(function () {
              fancdn_fill_cookie_status.removeClass('active error wait').addClass('active');
              Lampa.Params.update(e.body.find('[data-name="online_mod_fancdn_cookie"]'), [], e.body);
            }, function () {
              fancdn_fill_cookie_status.removeClass('active error wait').addClass('error');
              Lampa.Params.update(e.body.find('[data-name="online_mod_fancdn_cookie"]'), [], e.body);
            });
          });
        }
      });
    }

    function startPlugin() {
      if (Utils.isDebug3()) return;
      logApp();
      initStorage();
      initLang();
      initMain();
      initFilmix();
      initSettings();
    }

    startPlugin();

})();
