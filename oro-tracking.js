(function () {
    'use strict';

    if (window.__oroTrackingLoaded) return;
    window.__oroTrackingLoaded = true;

    var storageKey = 'oro_ad_attribution';
    var attributionKeys = [
        'gclid',
        'gbraid',
        'wbraid',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content'
    ];

    function readStoredAttribution() {
        try {
            return JSON.parse(window.sessionStorage.getItem(storageKey) || '{}');
        } catch (error) {
            return {};
        }
    }

    function captureAttribution() {
        var searchParams = new URLSearchParams(window.location.search);
        var storedAttribution = readStoredAttribution();
        var nextAttribution = {};

        attributionKeys.forEach(function (key) {
            var value = searchParams.get(key) || storedAttribution[key];
            if (value) nextAttribution[key] = value;
        });

        try {
            window.sessionStorage.setItem(storageKey, JSON.stringify(nextAttribution));
        } catch (error) {
            // Tracking still works when a browser blocks session storage.
        }

        return nextAttribution;
    }

    function currentAttribution() {
        return Object.assign({}, readStoredAttribution(), captureAttribution());
    }

    function baseEventData() {
        var attribution = currentAttribution();

        return Object.assign({
            page_location: window.location.href,
            page_path: window.location.pathname,
            page_title: document.title,
            page_referrer: document.referrer || '',
            is_google_ads_visit: Boolean(attribution.gclid || attribution.gbraid || attribution.wbraid || attribution.utm_source === 'google')
        }, attribution);
    }

    window.oroTrack = function (eventName, eventData) {
        var payload = Object.assign({}, baseEventData(), eventData || {});

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(Object.assign({ event: eventName }, payload));

    };

    document.addEventListener('click', function (event) {
        var target = event.target instanceof Element ? event.target : null;
        var link = target ? target.closest('a[href]') : null;
        if (!link) return;

        var href = link.getAttribute('href') || '';
        var eventData = {
            link_text: (link.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
            link_url: href
        };

        if (href.indexOf('maps.google.') !== -1 || href.indexOf('google.com/maps') !== -1) {
            window.oroTrack('oro_map_click', eventData);
        }
    });

    captureAttribution();
}());
