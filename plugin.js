//09.02.2026 - Fix - HDrezka Auth Fix

Lampa.Plugin.create('online_mod', function() {
    'use strict';

    // ============ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ============
    
    function startsWith(str, searchString) {
        return str.lastIndexOf(searchString, 0) === 0;
    }

    function endsWith(str, searchString) {
        var start = str.length - searchString.length;
        if (start < 0) return false;
        return str.indexOf(searchString, start) === start;
    }

    // ============ УТИЛИТЫ ============
    
    var Utils = {
        rezka2Mirror: function() {
            var url = Lampa.Storage.get('online_mod_rezka2_mirror', '') + '';
            if (!url) return 'https://rezka.cc';
            if (url.indexOf('://') == -1) url = 'https://' + url;
            if (url.charAt(url.length - 1) === '/') url = url.substring(0, url.length - 1);
            return url;
        },
        baseUserAgent: function() {
            return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';
        },
        proxy: function(name) {
            return Lampa.Storage.field('online_mod_proxy_' + name) === true ? 'https://cors.nb557.workers.dev/' : '';
        },
        proxyLink: function(link, proxy, proxy_enc, enc) {
            if (link && proxy) {
                return proxy + 'enc/' + encodeURIComponent(btoa(link)) + '/' + link.split('/').pop();
            }
            return link;
        },
        randomId: function(len) {
            var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
            var result = '';
            for (var i = 0; i < len; i++) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
            return result;
        },
        decodeSecret: function(input, password) {
            // Упрощенная версия для авторизации
            return 'debug';
        },
        isDebug: function() {
            return true;
        }
    };

    // ============ СЕТЕВЫЕ ФУНКЦИИ ============
    
    var network = new Lampa.Reguest();

    // ============ ИСПРАВЛЕННЫЕ ФУНКЦИИ ДЛЯ HDREZKA ============

    function rezka2Login(success, error) {
        var host = Utils.rezka2Mirror();
        var url = host + '/ajax/login/';
        var login = Lampa.Storage.get('online_mod_rezka2_name', '');
        var password = Lampa.Storage.get('online_mod_rezka2_password', '');
        
        if (!login || !password) {
            Lampa.Noty.show('Введите логин и пароль для HDrezka');
            if (error) error();
            return;
        }

        var postdata = 'login_name=' + encodeURIComponent(login);
        postdata += '&login_password=' + encodeURIComponent(password);
        postdata += '&remember=1';
        postdata += '&login_not_save=0';

        Lampa.Noty.show('Авторизация на ' + host + '...');

        network.clear();
        network.timeout(15000);
        network.silent(url, function(json) {
            if (json && json.success) {
                Lampa.Storage.set('online_mod_rezka2_status', 'true');
                Lampa.Noty.show('Успешная авторизация на HDrezka!');
                if (success) success();
            } else {
                Lampa.Storage.set('online_mod_rezka2_status', 'false');
                if (json && json.message) {
                    Lampa.Noty.show('Ошибка: ' + json.message);
                } else {
                    Lampa.Noty.show('Ошибка авторизации на HDrezka');
                }
                if (error) error();
            }
        }, function(a, c) {
            Lampa.Noty.show('Ошибка подключения к HDrezka: ' + (a.status || 'timeout'));
            if (error) error();
        }, postdata, {
            withCredentials: true,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    function rezka2Logout(success, error) {
        var host = Utils.rezka2Mirror();
        var url = host + '/logout/';
        
        network.clear();
        network.timeout(8000);
        network.silent(url, function(str) {
            Lampa.Storage.set('online_mod_rezka2_status', 'false');
            Lampa.Storage.set('online_mod_rezka2_cookie', '');
            Lampa.Noty.show('Вы вышли из HDrezka');
            if (success) success();
        }, function(a, c) {
            Lampa.Storage.set('online_mod_rezka2_status', 'false');
            Lampa.Storage.set('online_mod_rezka2_cookie', '');
            Lampa.Noty.show('Ошибка при выходе');
            if (error) error();
        }, false, {
            dataType: 'text',
            withCredentials: true
        });
    }

    function rezka2CheckAuth(callback) {
        var host = Utils.rezka2Mirror();
        var status = Lampa.Storage.get('online_mod_rezka2_status', 'false');
        
        if (callback) callback(status === 'true');
    }

    // ============ ЯЗЫКОВЫЕ ФУНКЦИИ ============

    function initLang() {
        if (!Lampa.Lang) return;
        
        Lampa.Lang.add({
            online_mod_rezka2_name: {
                ru: 'Логин или email для HDrezka',
                en: 'Login or email for HDrezka'
            },
            online_mod_rezka2_password: {
                ru: 'Пароль для HDrezka',
                en: 'Password for HDrezka'
            },
            online_mod_rezka2_login: {
                ru: 'Войти в HDrezka',
                en: 'Log in to HDrezka'
            },
            online_mod_rezka2_logout: {
                ru: 'Выйти из HDrezka',
                en: 'Log out of HDrezka'
            },
            online_mod_rezka2_mirror: {
                ru: 'Зеркало для HDrezka',
                en: 'Mirror for HDrezka'
            },
            online_mod_proxy_rezka2: {
                ru: 'Проксировать HDrezka',
                en: 'Proxy HDrezka'
            }
        });
    }

    // ============ НАСТРОЙКИ ============

    function addSettingsOnlineMod() {
        if (!Lampa.Settings || !Lampa.Settings.main) return;
        
        var mainSettings = Lampa.Settings.main();
        if (!mainSettings) return;
        
        if (mainSettings.render().find('[data-component="online_mod"]').length) return;

        var field = $('<div class="settings-folder selector" data-component="online_mod">\
            <div class="settings-folder__icon">\
                <svg height="260" viewBox="0 0 244 260" fill="none" xmlns="http://www.w3.org/2000/svg">\
                <path d="M242,88v170H10V88h41l-38,38h37.1l38-38h38.4l-38,38h38.4l38-38h38.3l-38,38H204L242,88L242,88z M228.9,2l8,37.7l0,0 L191.2,10L228.9,2z M160.6,56l-45.8-29.7l38-8.1l45.8,29.7L160.6,56z M84.5,72.1L38.8,42.4l38-8.1l45.8,29.7L84.5,72.1z M10,88 L2,50.2L47.8,80L10,88z" fill="white"/></svg>\
            </div>\
            <div class="settings-folder__name">HDrezka Авторизация</div>\
        </div>');
        
        mainSettings.render().find('[data-component="more"]').after(field);
        mainSettings.update();
    }

    function initSettings() {
        if (!Lampa.Settings) return;
        
        var template = '<div>\
            <div class="settings-param selector" data-name="online_mod_rezka2_mirror" data-type="input" placeholder="rezka.cc">\
                <div class="settings-param__name">#{online_mod_rezka2_mirror}</div>\
                <div class="settings-param__value"></div>\
            </div>\
            <div class="settings-param selector" data-name="online_mod_proxy_rezka2" data-type="toggle">\
                <div class="settings-param__name">#{online_mod_proxy_balanser} HDrezka</div>\
                <div class="settings-param__value"></div>\
            </div>\
            <div class="settings-param selector" data-name="online_mod_rezka2_name" data-type="input" placeholder="Логин или email">\
                <div class="settings-param__name">#{online_mod_rezka2_name}</div>\
                <div class="settings-param__value"></div>\
            </div>\
            <div class="settings-param selector" data-name="online_mod_rezka2_password" data-type="input" data-string="true" placeholder="Пароль">\
                <div class="settings-param__name">#{online_mod_rezka2_password}</div>\
                <div class="settings-param__value"></div>\
            </div>\
            <div class="settings-param selector" data-name="online_mod_rezka2_login" data-static="true">\
                <div class="settings-param__name">#{online_mod_rezka2_login}</div>\
                <div class="settings-param__status"></div>\
            </div>\
            <div class="settings-param selector" data-name="online_mod_rezka2_logout" data-static="true">\
                <div class="settings-param__name">#{online_mod_rezka2_logout}</div>\
                <div class="settings-param__status"></div>\
            </div>\
        </div>';

        Lampa.Template.add('settings_online_mod', template);
        
        if (window.appready) {
            addSettingsOnlineMod();
        } else {
            Lampa.Listener.follow('app', function(e) {
                if (e.type == 'ready') addSettingsOnlineMod();
            });
        }

        Lampa.Settings.listener.follow('open', function(e) {
            if (e.name == 'online_mod') {
                var body = e.body;
                
                // Обновление статуса авторизации
                function updateStatus() {
                    rezka2CheckAuth(function(isAuth) {
                        var loginStatus = body.find('[data-name="online_mod_rezka2_login"] .settings-param__status');
                        var logoutStatus = body.find('[data-name="online_mod_rezka2_logout"] .settings-param__status');
                        
                        if (isAuth) {
                            loginStatus.removeClass('active error wait').addClass('active');
                            logoutStatus.removeClass('active error wait').addClass('active');
                        } else {
                            loginStatus.removeClass('active error wait').addClass('error');
                            logoutStatus.removeClass('active error wait').addClass('error');
                        }
                    });
                }

                updateStatus();

                // Обработчик кнопки входа
                var loginBtn = body.find('[data-name="online_mod_rezka2_login"]');
                loginBtn.unbind('hover:enter').on('hover:enter', function() {
                    var status = $(this).find('.settings-param__status').removeClass('active error wait').addClass('wait');
                    rezka2Login(function() {
                        status.removeClass('active error wait').addClass('active');
                        updateStatus();
                    }, function() {
                        status.removeClass('active error wait').addClass('error');
                        updateStatus();
                    });
                });

                // Обработчик кнопки выхода
                var logoutBtn = body.find('[data-name="online_mod_rezka2_logout"]');
                logoutBtn.unbind('hover:enter').on('hover:enter', function() {
                    var status = $(this).find('.settings-param__status').removeClass('active error wait').addClass('wait');
                    rezka2Logout(function() {
                        status.removeClass('active error wait').addClass('active');
                        updateStatus();
                    }, function() {
                        status.removeClass('active error wait').addClass('error');
                        updateStatus();
                    });
                });
            }
        });
    }

    // ============ ДОБАВЛЕНИЕ КНОПКИ В МЕНЮ ============

    function addMenuButton() {
        Lampa.Listener.follow('menu', function(e) {
            if (e.type == 'create') {
                var menu = e.object;
                
                // Добавляем пункт в меню "Ещё"
                var moreItem = menu.content.find('[data-item="more"]');
                if (moreItem.length) {
                    var onlineItem = $('<div class="menu__item selector" data-item="online_mod">\
                        <div class="menu__item-icon">\
                            <svg viewBox="0 0 24 24" width="24" height="24">\
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13v6l5 3-5-9z" fill="white"/>\
                            </svg>\
                        </div>\
                        <div class="menu__item-text">HDrezka Авторизация</div>\
                    </div>');
                    
                    moreItem.after(onlineItem);
                    
                    onlineItem.on('hover:enter', function() {
                        Lampa.Settings.show('online_mod');
                    });
                    
                    menu.update();
                }
            }
        });
    }

// ============ ЗАПУСК ПЛАГИНА ============

    function startPlugin() {
        console.log('✅ HDrezka Auth Plugin успешно запущен');
        
        initLang();
        initSettings();
        addMenuButton();
    }

    // ←←← ЭТО САМОЕ ВАЖНОЕ ИСПРАВЛЕНИЕ
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                startPlugin();
            }
        });
    }

});
