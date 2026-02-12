(function () {
    'use strict';

    // Ждём, пока Lampa полностью загрузится
    function initMyPlugin() {
        console.log('Простой тестовый плагин запущен ✓');

        // Добавляем кнопку в боковое меню (в раздел "Ещё")
        Lampa.Component.add('my_test_button', {
            render: function (html) {
                html.find('.menu__item').eq(-1).after(
                    '<div class="menu__item selector" data-action="test-plugin">' +
                    '<div class="menu__ico">🧪</div>' +
                    '<div class="menu__name">Тест плагина</div>' +
                    '</div>'
                );
            }
        });

        // Обрабатываем нажатие на кнопку
        Lampa.Listener.follow('menu', function (e) {
            if (e.type === 'action' && e.action === 'test-plugin') {
                Lampa.Noty.show('Плагин работает отлично! 😎');
                console.log('Кнопка нажата');
            }
        });
    }

    // Запуск после готовности приложения
    if (window.appready) {
        initMyPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                initMyPlugin();
            }
        });
    }

})();
