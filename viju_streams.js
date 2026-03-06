(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.VijuStreams = factory();
    }
}(this, function () {
    var pluginName = 'viju_streams';
    var vijuChannels = [
        { name: 'viju+ Comedy', url: 'https://bl.uma.media/live/485539/HLS/4614144_3/2/1/playlist.m3u8' },
        { name: 'viju Explore', url: 'https://bl.uma.media/live/485546/HLS/4614144_3/2/1/playlist.m3u8' },
        { name: 'viju Nature', url: 'https://bl.uma.media/live/485545/HLS/4614144_3/2/1/playlist.m3u8' },
        { name: 'viju+ Planet', url: 'http://moobl.ru/hls/Viju_plus_Planet.m3u8' },
        { name: 'viju TV1000 Русское', url: 'http://82.209.197.187:8080/udp/239.0.100.82:1234' },
        { name: 'viju+ Megahit', url: 'https://bl.uma.media/live/485537/HLS/4614144_3/2/1/playlist.m3u8' },
        { name: 'viju+ Premiere', url: 'https://bl.uma.media/live/485536/HLS/4614144_3/2/1/playlist.m3u8' },
        { name: 'viju+ Serial', url: 'http://94.229.250.73:8008/play/a003' },
        { name: 'viju+ Sport', url: 'http://europe3.livetv.az/russia/viasat_sport/playlist.m3u8' }
    ];

    // Генерация M3U-плейлиста
    function generateM3U(channels) {
        var m3u = '#EXTM3U\n';
        channels.forEach(function(channel) {
            m3u += '#EXTINF:-1,' + channel.name + '\n' + channel.url + '\n';
        });
        return m3u;
    }

    // Инициализация
    function init() {
        Lampa.Menu.add(pluginName, {
            name: 'Viju Streams',
            url: '/' + pluginName,
            icon: 'tv',
            onSelect: function() {
                var m3uContent = generateM3U(vijuChannels);
                Lampa.IPTV.loadPlaylist(m3uContent, 'Viju Channels');
            }
        });
    }

    return {
        init: init
    };
}));