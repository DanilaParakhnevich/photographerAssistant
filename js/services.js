"use strict";
var app = angular.module("ui", ["ngAnimate", "ngMessages"]),
    gaQueue = [],
    gaSend = function(e, a, t, i, o) {
        gaQueue.push([e, a, t, i, o]), window.ga && (_.foreach(gaQueue, function(e) {
            ga("send", e[0], e[1], e[2], e[3], e[4])
        }), gaQueue = [])
    };
window.onerror = function(e, a, t) {
    window.onerror = void 0, $("#mainError").css("display", "block"), $("#mainErrorDetails").text(e + " @ " + a + " : " + t), $("#loading").css("display", "none"), Modernizr.localstorage && localStorage && (window.onbeforeunload = void 0, localStorage.clear()), gaSend("event", "Error", "LoadError", e)
}, app.factory("$exceptionHandler", ["$log", function(t) {
    return function(e, a) {
        t.error(e), (window.onerror || angular.noop)()
    }
}]), app.constant("browserSvc", function() {
    var e = $.browser.version && +$.browser.version.split(".")[0];
    return {
        isSupported: !($.browser.mozilla && e < 4 || $.browser.webkit && e < 20 || $.browser.opera && e < 12 || $.browser.safari && e < 6 || $.browser.msie && e < 10 || !(Modernizr.cssfilters || Modernizr.svgfilters && Modernizr.inlinesvg)),
        isMobile: $(window).width() < 960 || /mobile|iphone|ipod|ipad|android|webos|blackberry|fennec|phone|googlebot|cordova/i.test(navigator.userAgent),
        isAndroid: /android/.test(navigator.userAgent.toLowerCase()),
        isCordova: !1,
        isOffline: !1,
        isGooglebot: /Googlebot/i.test(navigator.userAgent)
    }
}()), app.service("cookieSvc", [function() {
    function t(e) {
        var o = {},
            a = _.map(window.document.cookie.split(";"), function(e) {
                return e.trim()
            });
        return _.map(a, function(e) {
            var a = e.split("="),
                t = a.shift(),
                i = a.join();
            o[t] = i
        }), o[e]
    }

    function a(e, a) {
        window.document.cookie = e + "=" + a + ";path=/"
    }

    function i(e) {
        window.document.cookie = e + "=;path=/;expires=Thu, 01 Jan 1980 00:00:01 GMT;", window.document.cookie = e + "=;path=/;domain=." + window.location.host + ";expires=Thu, 01 Jan 1980 00:00:01 GMT;"
    }
    var o = "cookieSettings";
    return {
        getCookie: t,
        setCookie: a,
        deleteCookie: i,
        clearCookies: function() {
            _.foreach(window.document.cookie.split(";"), function(e) {
                var a = e.trim().split("=")[0];
                i(a)
            })
        },
        getCookieSettings: function() {
            var e = t(o),
                a = e ? e.split(":") : [];
            return {
                acceptCookies: -1 !== a.indexOf("cookie"),
                personalizedAds: -1 !== a.indexOf("personalizedAds")
            }
        },
        saveCookieSettings: function(e) {
            e.acceptCookies && a(o, "cookie" + (e.personalizedAds ? ":personalizedAds" : ""))
        }
    }
}]), app.service("gaSvc", [function() {
    var i = !0;
    setTimeout(function() {
        i = !1
    }, 1e4);
    return {
        trackEvent: function(e, a, t) {
            t || (i = !1), gaSend("event", "UserAction", e, a, t ? {
                nonInteraction: !0
            } : void 0)
        },
        trackError: function(e, a) {
            i = !1, gaSend("event", "Error", e, a)
        },
        visitEnd: function() {
            i || gaSend("event", "Visit", "end")
        },
        trackLoadTime: function(e, a, t) {
            gaSend("timing", "LoadTime", e, a, t)
        },
        trackProcessingTime: function(e, a, t) {
            gaSend("timing", "ProcessingTime", e, a, t)
        },
        trackUserTime: function(e, a, t) {
            gaSend("timing", "UserTime", e, a, t)
        }
    }
}]), app.service("paramsSvc", ["$filter", "$location", "gaSvc", "cameras", "lenses", "dialogSvc", "infotipSvc", function(i, h, g, y, v, k, r) {
    function a(e) {
        e.scaleBackground = !1, e.diffraction = !1, e.constDistance = !1, e.video16_9 = !1, e.y = 1 / 0, e.coc = e.cocList.default, e.conv = e.lensConverters.defaultConv, e.matchingLens = !0
    }

    function o(e) {
        a(e), e.f = 85, e.a = e.userA = 1.4, e.lockFOV = !1, e.constant = "f", e.formatType = "sensor", e.format = "35mm (FX, Full-Frame)", e.cameraMake = void 0, e.cameraModel = void 0, e.lensMake = void 0, e.lensModel = void 0, e.x = 0, e.y0 = 3e3, e.customCoc = void 0, e.autoFourierBlur = !1, e.fourierBlurType = void 0
    }

    function n(e) {
        var a, t;
        e.show = {
            config: !0,
            savedParameters: !0,
            simulation: !0,
            overview: !0
        }, e.modes = [{
            advanced: !1,
            name: "Basic"
        }, {
            advanced: !0,
            name: "Advanced"
        }], e.modelsList = SelectOptions([{
            key: "man1",
            name: "Man 1",
            height: 1900,
            faceHeight: .145,
            faceCenter: .09
        }, {
            key: "man2",
            name: "Man 2",
            height: 1800,
            faceHeight: .165,
            faceCenter: .1
        }, {
            key: "woman1",
            name: "Woman 1",
            height: 1700,
            faceHeight: .18,
            faceCenter: .1
        }, {
            key: "woman2",
            name: "Woman 2",
            height: 1600,
            faceHeight: .16,
            faceCenter: .1
        }, {
            key: "girl1",
            name: "Girl 1",
            height: 1450,
            faceHeight: .195,
            faceCenter: .11
        }, {
            key: "boy1",
            name: "Boy 1",
            height: 1300,
            faceHeight: .22,
            faceCenter: .125
        }, {
            key: "girl2",
            name: "Girl 2",
            height: 1150,
            faceHeight: .205,
            faceCenter: .11
        }, {
            key: "boy2",
            name: "Boy 2",
            height: 1e3,
            faceHeight: .245,
            faceCenter: .13
        }]), x = {
            girl1: e.modelsList.woman1,
            girl2: e.modelsList.woman2,
            girl3: e.modelsList.woman2,
            girl4: e.modelsList.woman1,
            man1: e.modelsList.man2,
            man2: e.modelsList.man2,
            man3: e.modelsList.man1,
            man4: e.modelsList.man1
        }, e.backgroundsList = SelectOptions([{
            key: "katedra",
            name: "Cathedral",
            source: "https://commons.wikimedia.org/wiki/File:NidarosdomenPanorama.jpg",
            author: "Eikern",
            license: "CC BY-SA 3.0",
            constBottom: .95,
            maxTop: .45
        }, {
            key: "kosciol",
            name: "Church",
            source: "https://commons.wikimedia.org/wiki/File:Paisley_Abbey_from_North_West_-_Leaning_western_gable_-_125mp.jpg",
            author: "Colin",
            license: "CC BY-SA 3.0",
            constBottom: .82,
            maxTop: .35
        }, {
            key: "miasto",
            name: "City",
            source: "https://www.flickr.com/photos/rickharris/8721964134/",
            author: "Rick Harris",
            license: "CC BY-SA 2.0",
            constTop: .5,
            maxTop: .5
        }, {
            key: "gory",
            name: "Mountains",
            source: "https://www.flickr.com/photos/mondayssocks/8212919738/",
            author: "Monday's Socks",
            license: "CC BY-NC 2.0",
            constTop: .57,
            maxTop: .3
        }, {
            key: "paryz",
            name: "Paris",
            source: "https://commons.wikimedia.org/wiki/File:View_from_eiffel_tower_2nd_level.jpg",
            author: "Wjh31",
            license: "PD",
            constTop: .33,
            maxTop: .33
        }, {
            key: "drzewo",
            name: "Tree",
            source: "https://commons.wikimedia.org/wiki/File:Autumn_Oak_-_Broadhall_Way_-_Stevenage.jpg",
            author: "Colin",
            license: "CC BY-SA 3.0",
            constBottom: .83,
            maxTop: .25
        }, {
            key: "budynek",
            name: "Building",
            source: "https://commons.wikimedia.org/wiki/File:Helsinki_July_2013-15.jpg",
            author: "Alvesgaspar",
            license: "CC BY-SA 3.0",
            constBottom: .86,
            maxTop: .35
        }, {
            key: "park",
            name: "Park",
            source: "https://www.flickr.com/photos/arbron/8319351274/",
            author: "Jeff Hitchcock(Arbron)",
            license: "CC BY 2.0",
            constTop: .5,
            maxTop: .35
        }]), B = ["katedra", "drzewo", "miasto", "park", "paryz", "kosciol", "budynek", "gory"], e.sensors = {
            '11x14"': {
                size: new Size(356, 279),
                multiplier: .096,
                minF: 250,
                maxF: 3100,
                rounding: 10,
                group: "largeFormat"
            },
            '8x10"': {
                size: new Size(254, 203),
                multiplier: .133,
                minF: 180,
                maxF: 2250,
                rounding: 10,
                group: "largeFormat"
            },
            '5x7"': {
                size: new Size(178, 127),
                multiplier: .198,
                minF: 120,
                maxF: 1500,
                rounding: 10,
                group: "largeFormat"
            },
            '4x5"': {
                size: new Size(127, 101),
                multiplier: .267,
                minF: 90,
                maxF: 1100,
                rounding: 10,
                group: "largeFormat"
            },
            "6x12": {
                size: new Size(112, 56),
                multiplier: .346,
                minF: 75,
                maxF: 940,
                rounding: 10,
                group: "mediumFormat"
            },
            "6x9": {
                size: new Size(84, 56),
                multiplier: .428,
                minF: 60,
                maxF: 750,
                rounding: 10,
                group: "mediumFormat"
            },
            "6x7": {
                size: new Size(72, 56),
                multiplier: .474,
                minF: 50,
                maxF: 620,
                rounding: 10,
                group: "mediumFormat"
            },
            "6x6": {
                size: new Size(56, 56),
                multiplier: .546,
                minF: 38,
                maxF: 470,
                rounding: 5,
                group: "mediumFormat"
            },
            645: {
                size: new Size(56, 42),
                multiplier: .618,
                minF: 38,
                maxF: 470,
                rounding: 5,
                group: "mediumFormat"
            },
            "645D": {
                size: new Size(44, 33),
                multiplier: .787,
                minF: 30,
                maxF: 370,
                rounding: 5,
                group: "mediumFormat"
            },
            "35mm (FX, Full-Frame)": {
                size: new Size(36, 24),
                multiplier: 1,
                minF: 24,
                maxF: 300,
                rounding: 5,
                group: "DSLR"
            },
            "APS-H (Canon)": {
                size: new Size(28.5, 19),
                multiplier: 1.263,
                minF: 24,
                maxF: 300,
                rounding: 5,
                group: "DSLR"
            },
            "DX (Nikon)": {
                size: new Size(23.7, 15.8),
                multiplier: 1.52,
                minF: 16,
                maxF: 210,
                rounding: 5,
                group: "DSLR"
            },
            "APS-C": {
                size: new Size(23.7, 15.8),
                multiplier: 1.52,
                minF: 16,
                maxF: 210,
                rounding: 5,
                group: "DSLR"
            },
            "APS-C (Canon)": {
                size: new Size(22.3, 14.9),
                multiplier: 1.614,
                minF: 15,
                maxF: 200,
                rounding: 5,
                group: "DSLR"
            },
            "APS-C (Sigma)": {
                size: new Size(21.2, 14.1),
                multiplier: 1.7,
                minF: 14,
                maxF: 180,
                rounding: 5,
                group: "DSLR"
            },
            '1.5"': {
                size: new Size(18.7, 14),
                multiplier: 1.85,
                minF: 13,
                maxF: 160,
                rounding: 2,
                group: "compact"
            },
            "4/3, micro 4/3": {
                size: new Size(17.3, 13),
                multiplier: 2,
                minF: 12,
                maxF: 150,
                rounding: 2,
                group: "DSLR"
            },
            "CX (Nikon)": {
                size: new Size(13.2, 8.8),
                multiplier: 2.7,
                minF: 9,
                maxF: 110,
                rounding: 2,
                group: "DSLR"
            },
            '1"': {
                size: new Size(12.8, 9.6),
                multiplier: 2.71,
                minF: 9,
                maxF: 110,
                rounding: 2,
                group: "compact"
            },
            '2/3"': {
                size: new Size(8.8, 6.6),
                multiplier: 3.93,
                minF: 6,
                maxF: 75,
                rounding: 1,
                group: "compact"
            },
            '1/1.6"': {
                size: new Size(8.08, 6.06),
                multiplier: 4.41,
                minF: 6,
                maxF: 75,
                rounding: 1,
                group: "compact"
            },
            '1/1.7"': {
                size: new Size(7.6, 5.7),
                multiplier: 4.55,
                minF: 5,
                maxF: 60,
                rounding: 1,
                group: "compact"
            },
            '1/1.8"': {
                size: new Size(7.2, 5.4),
                multiplier: 4.8,
                minF: 5,
                maxF: 60,
                rounding: 1,
                group: "compact"
            },
            '1/2"': {
                size: new Size(6.4, 4.8),
                multiplier: 5.41,
                minF: 5,
                maxF: 60,
                rounding: 1,
                group: "compact"
            },
            '1/2.3"': {
                size: new Size(6.2, 4.65),
                multiplier: 5.58,
                minF: 5,
                maxF: 60,
                rounding: 1,
                group: "compact"
            },
            '1/2.4"': {
                size: new Size(6.03, 4.52),
                multiplier: 5.74,
                minF: 5,
                maxF: 60,
                rounding: 1,
                group: "compact"
            },
            '1/2.5"': {
                size: new Size(5.8, 4.35),
                multiplier: 5.97,
                minF: 4,
                maxF: 48,
                rounding: 1,
                group: "compact"
            },
            '1/2.7"': {
                size: new Size(5.4, 4.05),
                multiplier: 6.41,
                minF: 4,
                maxF: 48,
                rounding: 1,
                group: "compact"
            },
            '1/3"': {
                size: new Size(4.8, 3.6),
                multiplier: 7.21,
                minF: 4,
                maxF: 48,
                rounding: 1,
                group: "compact"
            },
            '1/3.2"': {
                size: new Size(4.54, 3.405),
                multiplier: 7.62,
                minF: 3,
                maxF: 40,
                rounding: 1,
                group: "compact"
            },
            '1/3.6"': {
                size: new Size(4, 3),
                multiplier: 8.65,
                minF: 3,
                maxF: 40,
                rounding: 1,
                group: "compact"
            },
            '1/4"': {
                size: new Size(3.6, 2.7),
                multiplier: 9.61,
                minF: 2.5,
                maxF: 30,
                rounding: 1,
                group: "compact"
            },
            '1/6"': {
                size: new Size(2.46, 1.8),
                multiplier: 16,
                minF: 2,
                maxF: 20,
                rounding: 1,
                group: "compact"
            }
        }, e.sensorsList = i("orderBy")((a = e.sensors, t = [], angular.forEach(a, function(e, a) {
            e.key = a, t.push(e)
        }), t), "multiplier"), e.sensorGroups = {
            largeFormat: "Large format",
            mediumFormat: "Medium format",
            DSLR: "DSLRs / mirrorless",
            compact: "Compact cameras"
        }, w = ['11x14"', '8x10"', '5x7"', '4x5"', "6x7", "6x6", "645", "645D", "35mm (FX, Full-Frame)", "APS-H (Canon)", "DX (Nikon)", "APS-C", "APS-C (Canon)", "APS-C (Sigma)", '1.5"', "4/3, micro 4/3", "CX (Nikon)", '1"', '2/3"', '1/1.6"', '1/1.7"', '1/1.8"', '1/2"', '1/2.3"', '1/2.4"', '1/2.5"', '1/2.7"', '1/3"', '1/3.2"', '1/3.6"', '1/4"', '1/6"', "6x9", "6x12"], e.apertureValues = [1, 1.1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.8, 3.2, 3.5, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 9, 10, 11, 13, 14, 16, 18, 20, 22, 25, 29, 32, 36, 40, 45, 51, 57, 64], e.apertureLabels = [1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32, 45, 64], e.cocList = SelectOptions([{
            key: '10x15cm (4x6")',
            lines: 1200,
            group: "print"
        }, {
            key: '20x30cm (8x12")',
            width: 2400,
            group: "print"
        }, {
            key: '30x45cm (12x18")',
            lines: 3600,
            group: "print"
        }, {
            key: "640px",
            width: 640,
            group: "screen"
        }, {
            key: "PAL/NTSC",
            width: 720,
            group: "screen"
        }, {
            key: "1024px",
            width: 1024,
            group: "screen"
        }, {
            key: "HD (720p)",
            width: 1280,
            group: "screen"
        }, {
            key: "Full HD (1080p)",
            width: 1920,
            group: "screen"
        }, {
            key: "2K (2048px)",
            width: 2048,
            group: "screen"
        }, {
            key: "4K (4096px)",
            width: 4096,
            group: "screen"
        }, {
            key: "8K (8192px)",
            width: 8192,
            group: "screen"
        }, {
            key: "3Mpix",
            mpix: 3,
            group: "resolution"
        }, {
            key: "6Mpix",
            mpix: 6,
            group: "resolution"
        }, {
            key: "9Mpix",
            mpix: 9,
            group: "resolution"
        }, {
            key: "12Mpix",
            mpix: 12,
            group: "resolution"
        }, {
            key: "18Mpix",
            mpix: 18,
            group: "resolution"
        }, {
            key: "24Mpix",
            mpix: 24,
            group: "resolution"
        }, {
            key: "36Mpix",
            mpix: 36,
            group: "resolution"
        }, {
            key: "50Mpix",
            mpix: 50,
            group: "resolution"
        }, {
            key: "default",
            lines: 1492,
            group: "other"
        }, {
            key: "custom",
            group: "other",
            custom: !0
        }]), e.cocGroups = {
            print: "Print",
            screen: "Video size",
            resolution: "Resolution",
            other: void 0
        }, e.cocNames = {
            custom: "Custom",
            default: "Default"
        }, b = ["value", "lines", "resolution", "print", "view"], S = {
            800: '10x15cm (4x6")',
            1600: '20x30cm (8x12")',
            2400: '30x45cm (12x18")',
            1024: "1024px",
            1400: "3Mpix",
            2e3: "6Mpix",
            2450: "9Mpix",
            2800: "12Mpix",
            3500: "18Mpix",
            4e3: "24Mpix",
            4900: "36Mpix",
            5700: "50Mpix"
        }, e.fourierBlurTypes = SelectOptions([{
            key: "0",
            name: "Excellent"
        }, {
            key: "1",
            name: "Soft"
        }, {
            key: "2",
            name: "Neutral"
        }, {
            key: "3",
            name: "Hard"
        }, {
            key: "4",
            name: "Catadioptric lens"
        }, {
            key: "5",
            name: "5 blades diaphragm"
        }, {
            key: "6",
            name: "6 blades diaphragm"
        }, {
            key: "7",
            name: "7 blades diaphragm"
        }, {
            key: "8",
            name: "8 blades diaphragm"
        }, {
            key: "9",
            name: "9 blades diaphragm"
        }]), e.lensConverters = SelectOptions([{
            key: "0.58x",
            multiplier: Math.sqrt(.33),
            anamorph: 1,
            rearAnamorph: 1
        }, {
            key: "0.64x",
            multiplier: Math.sqrt(.4),
            anamorph: 1,
            rearAnamorph: 1
        }, {
            key: "0.71x",
            multiplier: Math.sqrt(.5),
            anamorph: 1,
            rearAnamorph: 1
        }, {
            key: "--",
            multiplier: 1,
            anamorph: 1,
            rearAnamorph: 1
        }, {
            key: "1.4x",
            multiplier: Math.sqrt(2),
            anamorph: 1,
            rearAnamorph: 1
        }, {
            key: "1.7x",
            multiplier: Math.sqrt(3),
            anamorph: 1,
            rearAnamorph: 1
        }, {
            key: "2.0x",
            multiplier: Math.sqrt(4),
            anamorph: 1,
            rearAnamorph: 1
        }, {
            key: "1.33x ANA",
            multiplier: 1,
            anamorph: 4 / 3,
            rearAnamorph: 1,
            group: "Anamorphic"
        }, {
            key: "1.5x ANA",
            multiplier: 1,
            anamorph: 1.5,
            rearAnamorph: 1,
            group: "Anamorphic"
        }, {
            key: "2.0x ANA",
            multiplier: 1,
            anamorph: 2,
            rearAnamorph: 1,
            group: "Anamorphic"
        }, {
            key: "2.0x rear ANA",
            multiplier: 1,
            anamorph: 1,
            rearAnamorph: 2,
            group: "Anamorphic"
        }]), e.lensConverters.defaultConv = e.lensConverters[3], o(e), e.advanced = !1, e.units = "metric", e.helpActive = !1, e.orientation = "landscape", e.model = e.modelsList.woman1, e.background = e.backgroundsList.paryz, e.sensor = angular.copy(e.sensors[e.format]), e.paramsList = [{
            f: 85,
            a: 1.4,
            conv: e.lensConverters.defaultConv,
            convMultiplier: 1,
            formatType: "sensor",
            format: "35mm (FX, Full-Frame)",
            formatMultiplier: 1,
            y0: 3e3,
            y: 1 / 0,
            id: 0
        }, {
            f: 55,
            a: 1.4,
            conv: e.lensConverters.defaultConv,
            convMultiplier: 1,
            formatType: "sensor",
            format: "APS-C",
            formatMultiplier: 1.52,
            y0: 3e3,
            y: 1 / 0,
            id: 1
        }, {
            f: 85,
            a: 1.4,
            conv: e.lensConverters.defaultConv,
            convMultiplier: 1,
            formatType: "sensor",
            format: "APS-C",
            formatMultiplier: 1.52,
            y0: 4500,
            y: 1 / 0,
            id: 2
        }], e.selectedParams = e.paramsList[0]
    }

    function s(i, e, a) {
        function t(a, e, t) {
            if (localStorage[a]) try {
                var i = JSON.parse(localStorage[a]);
                if (!e) return i;
                e(i)
            } catch (e) {
                console.error(e), g.trackError("LocalStorageLoad", a), localStorage.removeItem(a), (t || angular.noop)()
            }
        }
        var o = 1;

        function n() {
            if (Modernizr.localstorage && localStorage) {
                for (var e = [], a = 0; a < i.paramsList.length; a++) {
                    var t = i.paramsList[a];
                    e.push({
                        f: t.f,
                        a: t.a,
                        conv: t.conv ? t.conv.key : void 0,
                        convMultiplier: t.convMultiplier,
                        formatType: t.formatType,
                        format: t.format,
                        cameraMakeName: t.cameraMake ? t.cameraMake.make : void 0,
                        cameraModel: t.cameraModel,
                        lensMakeName: t.lensMake ? t.lensMake.make : void 0,
                        lensModel: t.lensModel,
                        formatMultiplier: t.formatMultiplier,
                        y0: t.y0,
                        y: t.y,
                        id: t.id,
                        fourierBlurType: t.fourierBlurType
                    })
                }
                localStorage.paramsList = JSON.stringify(e), localStorage.selectedParams = i.paramsList.indexOf(i.selectedParams), localStorage.parameters = JSON.stringify({
                    f: i.f,
                    a: i.a,
                    userA: i.userA,
                    conv: i.conv.key,
                    diffraction: i.diffraction,
                    format: i.format,
                    formatType: i.formatType,
                    cameraMakeName: i.cameraMake ? i.cameraMake.make : void 0,
                    cameraModel: i.cameraModel,
                    lensMakeName: i.lensMake ? i.lensMake.make : void 0,
                    lensModel: i.lensModel,
                    matchingLens: i.matchingLens,
                    video16_9: i.video16_9,
                    x: i.x,
                    y0: i.y0,
                    y: i.y,
                    scaleBackground: i.scaleBackground,
                    constant: i.constant,
                    lockFOV: i.lockFOV,
                    constDistance: i.constDistance,
                    model: i.model.key,
                    background: i.background.key,
                    orientation: i.orientation,
                    coc: i.coc.key,
                    customCoc: i.customCoc,
                    units: i.units,
                    advanced: i.advanced,
                    autoFourierBlur: i.autoFourierBlur,
                    fourierBlurType: i.fourierBlurType
                }), localStorage.vertical = i.vertical, localStorage.show = JSON.stringify(i.show), localStorage.infotips = JSON.stringify(r.infotips), localStorage.visitCount = o
            }
        }
        return Modernizr.localstorage && localStorage && (localStorage.version && (o = (t("visitCount") || 1) + 1, (localStorage.version && !localStorage.appVersion || localStorage.appVersion && localStorage.appVersion !== a) && (i.newVersion = !0), localStorage.version == e ? (t("paramsList", function(e) {
            i.paramsList = e;
            for (var a = 0; a < e.length; a++) e[a].conv = i.lensConverters[e[a].conv], e[a].y = e[a].y || 1 / 0, e[a].cameraMake = y.findCameraMake(e[a].cameraMakeName), delete e[a].cameraMakeName, e[a].lensMake = v.findLensMake(e[a].lensMakeName), delete e[a].lensMakeName
        }, function() {
            i.paramsList = []
        }), i.selectedParams = i.paramsList[+t("selectedParams")], t("parameters", function(e) {
            e.model = i.modelsList[e.model], e.background = i.backgroundsList[e.background], e.coc = i.cocList[e.coc], e.y = e.y || 1 / 0, e.conv = i.lensConverters[e.conv], i.cameraMake = y.findCameraMake(e.cameraMakeName), delete e.cameraMakeName, i.lensMake = v.findLensMake(e.lensMakeName), delete e.lensMakeName, angular.extend(i, e)
        }), i.vertical = t("vertical") || i.vertical, i.show = t("show") || i.show, angular.extend(r.infotips, t("infotips"))) : localStorage.clear()), localStorage.version = e, localStorage.appVersion = a), window.onbeforeunload = function() {
            n(), g.visitEnd()
        }, setInterval(n, 3e3), o
    }
    var B, w, b, S, x;
    return {
        initScope: function(e, a, t, i) {
            n(e);
            var o = 0;
            return i && (o = s(e, a, t)),
                function(e) {
                    for (var a = {}, t = location.search.substring(1).split("&"), i = 0; i < t.length; i++) {
                        var o = t[i].split("=");
                        0 < o[0].length && (a[o[0]] = decodeURIComponent(o[1]))
                    }
                    if (!$.isEmptyObject(a)) {
                        try {
                            if (a.show) k.showDialog(a.show);
                            else {
                                e.selectedParams = void 0;
                                var n = {};
                                if (a.camera) {
                                    g.trackEvent("DigicamdbLinkVisit", a.camera, !0);
                                    var r = a.camera.split("_")[0],
                                        s = y.findCameraMake(r);
                                    if (s) {
                                        var l = _.findBy(s.cameras, "l", a.camera);
                                        camera && (n.formatType = "camera", n.cameraMake = s, n.cameraModel = l, n.f = l.minF || e.sensors[l.s].minF)
                                    }
                                } else if (a.x) {
                                    g.trackEvent("ParamsLinkVisit", a.x, !0);
                                    var c = BinaryBase64.decode(a.x),
                                        m = BinaryBase64.fromBinary(c, 0, 4);
                                    if (n.f = BinaryBase64.fromBinary(c, 4, 14) / 10, n.a = n.userA = BinaryBase64.fromBinary(c, 18, 11) / 10, n.diffraction = "1" === c[29], n.format = w[BinaryBase64.fromBinary(c, 30, 5)], n.y0 = BinaryBase64.fromBinary(c, 35, 16), n.y = BinaryBase64.fromBinary(c, 51, 16), 0 == n.y && (n.y = 1 / 0), n.scaleBackground = "1" === c[67], n.constant = "1" === c[68] ? "f" : "y0", n.lockFOV = "1" === c[69], n.constDistance = "1" === c[70], n.model = e.modelsList[BinaryBase64.fromBinary(c, 71, 5)], n.background = e.backgroundsList[B[BinaryBase64.fromBinary(c, 76, 4)]], n.orientation = "1" === c[80] ? "portrait" : "landscape", n.coc = e.cocList[BinaryBase64.fromBinary(c, 81, 5)], n.fourierBlurType = "1" === c[86] ? "" + BinaryBase64.fromBinary(c, 88, 4) : void 0, n.autoFourierBlur = "1" === c[87], n.video16_9 = "1" === c[92], n.formatType = "1" === c[93] ? "sensor" : "camera", "camera" == n.formatType) {
                                        r = y.makes[BinaryBase64.fromBinary(c, 94, 6) - 1];
                                        if (n.cameraMake = y.findCameraMake(r), n.cameraMake) {
                                            var u = BinaryBase64.fromBinary(c, 100, 14);
                                            n.cameraModel = _.findBy(n.cameraMake.cameras, "id", u)
                                        } else n.cameraModel = void 0
                                    }
                                    if (0 === m) n.initFourierBlur = !1, n.advanced = !0, n.conv = e.lensConverters.defaultConv, n.matchingLens = !0, n.lensMake = void 0, n.lensModel = void 0;
                                    else {
                                        if (n.initFourierBlur = "1" === c[114], n.advanced = "1" === c[115], n.conv = e.lensConverters[BinaryBase64.fromBinary(c, 116, 4)], n.matchingLens = "1" === c[120], !n.cameraModel || !n.cameraModel.lens) {
                                            var d = v.makes[BinaryBase64.fromBinary(c, 121, 6) - 1];
                                            if (n.lensMake = v.findLensMake(d), n.lensMake) {
                                                var p = BinaryBase64.fromBinary(c, 127, 11);
                                                n.lensModel = _.findBy(n.lensMake.lenses, "id", p)
                                            } else n.lensModel = void 0
                                        }
                                        if (n.coc.custom) switch (n.customCoc = {
                                            type: b[BinaryBase64.fromBinary(c, 138, 3)]
                                        }, n.customCoc.type) {
                                            case "value":
                                                n.customCoc.value = BinaryBase64.fromBinary(c, 141, 17) / 1e4;
                                                break;
                                            case "lines":
                                                n.customCoc.lines = BinaryBase64.fromBinary(c, 141, 14);
                                                break;
                                            case "resolution":
                                                n.customCoc.resolution = {
                                                    width: BinaryBase64.fromBinary(c, 141, 16)
                                                };
                                                break;
                                            case "print":
                                                var f = "1" === c[141];
                                                n.customCoc.print = {
                                                    units: f ? "big" : "small",
                                                    width: BinaryBase64.fromBinary(c, 142, 14) / (f ? .1 : 10),
                                                    dpi: BinaryBase64.fromBinary(c, 156, 13)
                                                };
                                                break;
                                            case "view":
                                                f = "1" === c[141];
                                                n.customCoc.view = {
                                                    units: f ? "big" : "small",
                                                    width: BinaryBase64.fromBinary(c, 142, 14) / (f ? .1 : 10),
                                                    distance: BinaryBase64.fromBinary(c, 156, 14) / (f ? .1 : 10)
                                                }
                                        }
                                    }
                                } else g.trackEvent("ParamsLinkVisitOld", location.search, !0), n.advanced = !0, n.f = +a.f || void 0, n.a = n.userA = +a.a || void 0, n.diffraction = void 0 !== a.d ? !!JSON.parse(a.d) : void 0, n.format = a.s ? a.s.replace("APS-C (Fuji, Sony)", "APS-C").replace("APS-C (Pentax)", "APS-C").replace("FullFrame", "Full-Frame") : void 0, n.video16_9 = !1, n.formatType = "sensor", n.y0 = +a.y0 || void 0, void 0 !== a.y && (n.y = "null" === a.y ? 1 / 0 : +a.y), n.scaleBackground = void 0 !== a.b ? !!JSON.parse(a.b) : void 0, n.constant = a.c, n.lockFOV = void 0 !== a.l ? !!JSON.parse(a.l) : void 0, n.constDistance = void 0 !== a.e ? !!JSON.parse(a.e) : void 0, n.model = x[a.m], n.background = void 0 !== a.t ? e.backgroundsList[a.t] : void 0, n.orientation = void 0 !== a.o ? "p" === a.o[0] ? "portrait" : "landscape" : void 0, n.coc = e.cocList[S[a.k]], n.initFourierBlur = void 0 !== a.g ? !!JSON.parse(a.g) : void 0, n.autoFourierBlur = void 0 !== a.h ? !!JSON.parse(a.h) : void 0, n.fourierBlurType = a.i;
                                angular.extend(e, n)
                            }
                        } catch (e) {
                            console.error(e), k.showDialog("urlParamsError"), g.trackError("ParamsLink", location.search)
                        }
                        h.url(h.url().split("?")[0]).replace()
                    }
                }(e), o
        },
        loadLocalStorage: s,
        setBasicDefaults: a,
        resetConfig: function(e) {
            o(e), Modernizr.localstorage && localStorage && localStorage.removeItem("parameters")
        },
        getShortLink: function(e) {
            var a = BinaryBase64.toBinary(4, 1);
            if (a += BinaryBase64.toBinary(14, 10 * e.f), a += BinaryBase64.toBinary(11, 10 * e.a), a += BinaryBase64.toBinary(1, e.diffraction), a += BinaryBase64.toBinary(5, w.indexOf(e.format)), a += BinaryBase64.toBinary(16, e.y0), a += BinaryBase64.toBinary(16, isFinite(e.y) ? e.y : 0), a += BinaryBase64.toBinary(1, e.scaleBackground), a += BinaryBase64.toBinary(1, "f" === e.constant), a += BinaryBase64.toBinary(1, e.lockFOV), a += BinaryBase64.toBinary(1, e.constDistance), a += BinaryBase64.toBinary(5, e.modelsList.indexOf(e.model)), a += BinaryBase64.toBinary(4, B.indexOf(e.background.key)), a += BinaryBase64.toBinary(1, "portrait" === e.orientation), a += BinaryBase64.toBinary(5, e.cocList.indexOf(e.coc)), a += BinaryBase64.toBinary(1, void 0 !== e.fourierBlurType), a += BinaryBase64.toBinary(1, e.autoFourierBlur), a += BinaryBase64.toBinary(4, +(e.fourierBlurType || 2)), a += BinaryBase64.toBinary(1, e.video16_9), a += BinaryBase64.toBinary(1, "sensor" == e.formatType || !e.cameraModel), a += BinaryBase64.toBinary(6, e.cameraMake && e.cameraModel ? y.makes.indexOf(e.cameraMake.make) + 1 : 0), a += BinaryBase64.toBinary(14, e.cameraModel ? e.cameraModel.id : 0), a += BinaryBase64.toBinary(1, e.fourierBlurReady), a += BinaryBase64.toBinary(1, e.advanced), a += BinaryBase64.toBinary(4, e.lensConverters.indexOf(e.conv)), a += BinaryBase64.toBinary(1, e.matchingLens), a += BinaryBase64.toBinary(6, e.lensMake ? v.makes.indexOf(e.lensMake.make) + 1 : 0), a += BinaryBase64.toBinary(11, e.lensModel ? e.lensModel.id : 0), e.coc.custom && e.customCoc && e.customCoc.type) {
                var t = e.customCoc;
                switch (a += BinaryBase64.toBinary(3, b.indexOf(t.type)), e.customCoc.type) {
                    case "value":
                        a += BinaryBase64.toBinary(17, 1e4 * t.value);
                        break;
                    case "lines":
                        a += BinaryBase64.toBinary(14, t.lines);
                        break;
                    case "resolution":
                        a += BinaryBase64.toBinary(16, t.resolution.width);
                        break;
                    case "print":
                        var i = "big" === t.print.units;
                        a += BinaryBase64.toBinary(1, i), a += BinaryBase64.toBinary(14, t.print.width * (i ? .1 : 10)), a += BinaryBase64.toBinary(13, t.print.dpi);
                        break;
                    case "view":
                        i = "big" === t.view.units;
                        a += BinaryBase64.toBinary(1, i), a += BinaryBase64.toBinary(14, t.view.width * (i ? .1 : 10)), a += BinaryBase64.toBinary(14, t.view.distance * (i ? .1 : 10))
                }
            }
            return "http://127.0.0.1:5500/en/?x=" + BinaryBase64.encode(a)
        }
    }
}]), app.service("infotipSvc", ["$timeout", "gaSvc", function(e, i) {
    function t(e, a) {
        var t = o[e];
        t.show = !0, t.auto = 0, t.trigger = 0, t.timestamp = new Date, i.trackEvent("InfotipShown", e, a)
    }
    var o = {
            advanced: {
                auto: 1,
                trigger: 1
            },
            fourierBlur: {
                auto: 2,
                trigger: 0
            },
            lockFOV: {
                auto: 2,
                trigger: 5
            },
            paramsList: {
                auto: 2,
                trigger: 0
            },
            sliderKeyboardScroll: {
                auto: 2,
                trigger: 5
            },
            cameraDatabase: {
                auto: 3,
                trigger: 3
            },
            diffraction: {
                auto: 0,
                trigger: 1
            },
            fourierBlurGenerate: {
                auto: 0,
                trigger: 1
            },
            fourierBlurAuto: {
                auto: 0,
                trigger: 3
            },
            coc: {
                auto: 0,
                trigger: 1
            }
        },
        n = function() {
            e(function() {
                if (void 0 === _.find(o, function(e) {
                        return e.show
                    })) {
                    var e = _.filter(o, function(e) {
                        return e && 1 === e.auto
                    });
                    if (0 === e.length) _.foreach(o, function(e) {
                        0 < e.auto && e.auto--
                    });
                    else {
                        var a = Math.floor(Math.random() * e.length);
                        t(e[a].key, !0)
                    }
                }
                n()
            }, 12e4)
        };
    return n(), {
        infotips: o,
        trigger: function(e) {
            var a = o[e];
            a && a.trigger && (a.trigger--, 0 === a.trigger && t(e))
        },
        cancel: function(e) {
            var a = o[e];
            a && (a.auto = 0, a.trigger = 0, a.show && (a.show = !1, i.trackEvent("InfotipClosed", e), i.trackUserTime("InfotipVisible", new Date - a.timestamp, e)))
        },
        dismiss: function(e) {
            var a = o[e];
            a && a.show && (a.show = !1, i.trackEvent("InfotipDismissed", e), i.trackUserTime("InfotipVisible", new Date - a.timestamp, e))
        }
    }
}]), app.service("dialogSvc", ["$rootScope", "gaSvc", function(a, t) {
    function i() {
        o.show = !1, t.trackUserTime("DialogVisible", new Date - r, o.type)
    }
    var o = {
            show: !1,
            type: void 0,
            title: void 0
        },
        n = {
            info: "Info",
            changelog: "Changelog",
            contact: "Contact",
            chooseBackground: "Choose background",
            chooseModel: "Choose model",
            chooseSensor: "Choose sensor size",
            cookie: "Cookies",
            cookieSettings: "Privacy settings",
            link: "Link to the current settings",
            browserUnsupported: "Unsupported browser",
            chooseBokeh: "Choose bokeh",
            downloadOffline: "Download offline version",
            android: "Android app",
            update: "Update",
            urlParamsError: "Invalid link",
            customCoc: "Set the circle of confusion size"
        },
        r = new Date;
    return $(document).on("keydown", function(e) {
        27 == e.keyCode && o.show && !o.hideCloseButton && a.$apply(i)
    }), {
        dialog: o,
        showDialog: function(e, a) {
            r = new Date, t.trackEvent("DialogShown", e), o.type = e, o.hideCloseButton = a || !1, o.title = n[e] || "", o.show = !0, setTimeout(function() {
                var e = Math.max(10, window.pageYOffset + ($(window).height() - $("#dialogWindow").height()) / 2);
                $("#dialogWindow").css("top", e)
            })
        },
        hideDialog: i
    }
}]).controller("DialogCtrl", ["$scope", "dialogSvc", function(e, a) {
    this.hideDialog = a.hideDialog, this.afterHide = function() {
        a.dialog.type = void 0, a.dialog.title = void 0
    }, e.dialog = a.dialog
}]), app.service("tourSvc", ["$timeout", "gaSvc", function(o, m) {
    function u(e) {
        for (var a in i)
            if (i[a].start === e) return i[a]
    }

    function d(e) {
        for (var a in i)
            if (-1 != i[a].steps.indexOf(e)) return i[a]
    }

    function a(e) {
        var a = u(e),
            t = d(e),
            i = t ? t.steps.indexOf(e) : -1,
            o = !!a && a.steps[0],
            n = !(!t || p) && t.start,
            r = 0 < e && (!n || 0 < i),
            s = e < h.length - 1,
            l = e == h.length - 1;
        if (p) {
            var c = p.steps.indexOf(e);
            o = n = !1, r = 0 <= c, s = a ? a.steps[0] : c < p.steps.length - 1, l = c == p.steps.length - 1
        }
        return l && !f && (f = !0, p ? m.trackEvent("TourHelpFinished", p.show) : m.trackEvent("TourFinished")), "<div class='popover tour'>\t<div class='arrow'></div>\t<h3><span class='popover-title'></span> <i class='icon-cancel-circled' data-role='end'></i> </h3>\t<div class='popover-content'></div>\t<div class='popover-navigation'>" + (r ? "\t\t<button class='btn btn-default pull-left' data-role='prev'><i class='icon-left-big'></i> Back</button>" : "") + (s ? "\t\t<button class='btn btn-default pull-right' " + (!0 === s ? "data-role='next'" : "onclick='tour.goTo(" + s + ")'") + ">Next <i class='icon-right-big'></i></button>" : "") + (l ? "\t\t<button class='btn btn-default pull-right' data-role='end'>Finish</button>" : "") + (n ? "\t\t<button class='btn btn-default " + (r ? "center" : "pull-left") + "' onclick='tour.goTo(" + n + ")'><i class='icon-up-big'></i> Return</button>" : "") + (o ? "\t\t<button class='btn btn-default center' onclick='tour.goTo(" + o + ")'><i class='icon-help'></i> More</button>" : "") + "\t</div></div>"
    }
    var t, p, i = {
            config: {
                show: "config",
                start: 1,
                steps: [2, 3, 4, 5, 6, 7]
            },
            savedParameters: {
                show: "savedParameters",
                start: 8,
                steps: [9, 10]
            },
            simulation: {
                show: "simulation",
                start: 11,
                steps: [12, 13]
            },
            overview: {
                show: "overview",
                start: 14,
                steps: [15, 16, 17]
            }
        },
        f = !1,
        h = [],
        n = void 0;
    return {
        initTour: function(i) {
            var e;
            h[0] = {
                title: "Guide",
                content: "<div style='text-align:center;'><h3>This guide helps you learn about all features of the application.</h3>Press <em>Next</em> to proceed.<div>"
            }, h[1] = {
                element: "#config",
                next: 8,
                placement: function() {
                    return i.vertical ? "top" : "right"
                },
                title: "Configuration panel",
                content: "<p>This panel lets you configure all the <em>settings of the simulation</em>. The values can be changed using the sliders or by typing them in the corresponding fields.</p><p>All the parameters are saved in your browser and will be restored the next time you visit the site.</p>"
            }, h[2] = {
                element: "#interface",
                placement: function() {
                    return i.vertical ? "bottom" : "right"
                },
                title: "Interface",
                content: "<p>The <em>Basic</em> mode hides some of the controls to simplify the interface. Certain additional features are available only in the <em>Advanced</em> mode:<ul>  <li>Video 16:9</li>  <li>Diffraction</li>  <li>Lens databse filtering</li>  <li>Converters (boosters, tele and anamorphic)</li>  <li>Background distance</li>  <li>Circle of confusion configuration</li></ul></p><p>The <em>Distance units</em> control sets which measurement system is used for distances display: metric or imperial.</p>"
            }, h[3] = {
                element: "#apperance",
                placement: function() {
                    return i.vertical ? "bottom" : "right"
                },
                title: "Appearance preferences",
                content: "<p>The <em>models</em> differ by appearance and height. Choosing the <em>background</em> allows you to fit the simulation to different shooting scenarios.</p><p>The <i class='icon-th'></i>&nbsp; icons open thumbnails preview choice of the models and the backgrounds.</p>"
            }, h[4] = {
                element: "#camera",
                placement: function() {
                    return i.vertical ? "bottom" : "right"
                },
                title: "Camera choice",
                content: function() {
                    return "<p>The <em>size of the sensor</em> can be set as one of the standard values or by choosing a camera from the database.</p><p>Choosing a camera with an integrated zoom lens sets the focal length and aperture sliders range to values corresponding to that lens.</p>" + (i.advanced ? "<p>The <em>Video 16:9</em> switch changes the image aspect ratio to a typical HD video size.</p>" : "")
                }
            }, h[5] = {
                element: "#lens",
                placement: function() {
                    return i.vertical ? "bottom" : "right"
                },
                title: "Lens parameters",
                content: function() {
                    return "<p>This section lets you set the basic parameters of the lens: the physical <em>focal length</em> and the <em>f-number</em> (aperture).</p><p>Choosing <em>a lens from the database</em> sets the corresponding range on the focal length and aperture sliders and the minimum model distance.</p>" + (i.advanced ? "<p>Checking the <em>Only matching</em> field filters the lens databse by sensor size, and in case of a camera from the databse, also by a lens mount (bayonet).</p>" : "<p>The lens databse is filtered by sensor size, and in case of a camera from the databse, also by a lens mount (bayonet).</p>") + (i.advanced ? "<p>Choosing an additional <em>converter</em> changes the effective focal length and f-number of the lens. Anamorphic converters affect the image ratio and the bokeh shape.</p>" : "")
                }
            }, h[6] = {
                element: "#position",
                placement: function() {
                    return i.vertical ? "top" : "right"
                },
                title: "Position",
                content: function() {
                    return "<p>The <em>model distance</em> from the camera is equal to the focusing distance. At small distances a distortion caused by the perspective can be seen on the model's face.</p>" + (i.advanced ? "<p>By default the <em>background distance</em> affects only its blur. Checking the <em>Background scaling</em> box enables it to also change the size when changing the distance.</p>" : "")
                }
            }, h[7] = {
                element: "#framing",
                placement: function() {
                    return i.vertical ? "top" : "right"
                },
                title: "Framing",
                content: "<p>The <em>Lock field of view</em> feature keeps constant model size on the photo when changing any of the parameters. Depending on the chosen option the focal length or the model distance is automatically changed to achieve this.<p><p>By using the buttons at the bottom of the panel you can set <em>one of the five standard ways of framing</em> with one click.</p>"
            }, h[8] = {
                element: "#savedParameters",
                prev: 1,
                next: 11,
                placement: function() {
                    return i.vertical ? "top" : "right"
                },
                title: "Saved settings",
                content: "<p>This feature allows you to <em>store sets of parameters</em> on a list and to directly compare their outcome on a photo.</p><p>Similarly to the current config, this list is also saved in your browser and restored the next time you visit the site.</p>"
            }, h[9] = {
                element: "#savedParameters",
                placement: function() {
                    return i.vertical ? "bottom" : "right"
                },
                title: "Saved settings",
                content: "<p>The <em>Add</em> button saves the current simulation parameters on the list. Selecting any of the rows recalls them instantly.</p><p>Clicking on any of the <em>headers</em> sorts the list according to the selected parameter.</p>"
            }, h[10] = {
                element: "#savedParametersList",
                placement: function() {
                    return i.vertical ? "bottom" : "right"
                },
                title: "Saved settings list",
                content: "<p>After generating a <em>bokeh simulation</em> for parameters from the list its result is also saved. It is indicated by a <i class='icon-ok'/> icon shown in the bokeh column. This allows to instantly compare the results of the bokeh simulation without generating it again.</p>"
            }, h[11] = {
                element: "#simulation",
                prev: 8,
                next: 14,
                placement: function() {
                    return i.vertical ? "top" : "left"
                },
                title: "Simulation",
                content: "<p>The simulation shows the resulting image with simulated <em>background blur</em> and <em>depth of field</em> on the model. It also simulates <em>the distortion</em> of the model face that occurs when shooting at small distances.</p><p>The numeric values in the header allow you to precisely compare <em>background blur</em> for diferent parameters sets.</p><p>The <em>Bokeh</em> feature realistically simulates different types of background blur.</p>"
            }, h[12] = {
                element: "#simulationValues",
                placement: "bottom",
                title: "Simulation - values",
                content: "<p>The <em>background blur</em> is presented as equivalent numeric values:<ul>  <li>diffusion circle on the sensor in mm,</li>  <li>number of lines along the shorter sensor axis for MTF 50%,</li>  <li>resolution at which the blur will not be visible when viewing the photo at 100% magnification.</li></ul></p>" + (i.advanced ? "<p>Checking the <em>diffraction</em> field enables it on the simulation. This results in a blur of both the model and the backgroud, which is especially visible at small apertures (large f-number).</p>" : "")
            }, h[13] = {
                element: "#fourierBlurSettings",
                placement: function() {
                    return i.vertical ? "top" : "bottom"
                },
                title: "Bokeh simulation",
                content: "<p>The standard background blur provides smooth operation, but it is not very realistic. The <em>bokeh simulation</em> feature recreates different types of real bokeh much more precisely.</p><p>After selecting the <em>bokeh type</em> the processing starts automatically. It can take several seconds - the exact time depends on your device computing power.</p><p>After each parameters modification you should use the <em>Generate</em> button to produce an updated simulation. Alternatively you can activate the <em>Auto</em> feature to start the processing automatically after each change.</p><p>The <em>Ready</em> field indicates whether the bokeh simulation has been processed for the current parameters. The result of the simulation can be saved together with the current settings on the <em>Saved settings</em> list.</p>"
            }, h[14] = {
                element: "#overview",
                prev: 11,
                next: 18,
                placement: "top",
                title: "Depth of field",
                content: "<p>This section shows the calculated <em>depth of field</em> (DOF) values and displays them on a distance scale.</p>"
            }, h[15] = {
                element: "#overviewDofValues",
                placement: "top",
                title: "Depth of field - values",
                content: "<p>The <em>total depth of field</em> as well as <em>near</em> and <em>far</em> limits are shown in the header.</p><p>Other values, such as the <em>total DOF</em> range, <em>in front of</em> and <em>behind</em> the subject distance of the acceptable sharpness and the <em>hiperfocal</em> distance are presented below.</p>"
            }, h[16] = {
                element: "#preview",
                placement: "top",
                title: "Depth of field - preview",
                content: "<p>The photograpther, the model and the background <em>silhouettes</em> can be moved in order to change the distances used for calculations.</p><p>The model size is not consistent with the scale. A real size preview is presented on the zoom view activated with the loupe icon (<i class='icon-zoom-in'/>&nbsp;)."
            }, h[17] = {
                element: "#coc",
                placement: "top",
                title: "Circle of confusion",
                content: function() {
                    return '<p>The circle of confusion is the <em>maximum diameter of the optical spot</em> the on sensor, that is still considered a sharp image. Its size directly affects the calculated DOF values and the hyperfocal distance.</p><p>The default CoC value is equivalent to the commonly adopted value that corresponds to a print size of <em>20x30cm (8x12") viewed at 30cm distance</em>.</p>' + (i.advanced ? "<p>You can select other CoC values from the list or set a custom size based on the sensor diagonal, an image resolution or a print size.</p>" : "")
                }
            }, h[18] = {
                prev: 14,
                title: "Guide - end",
                content: "<p style='text-align:center;'>You have completed the guide. You learned about all features of the simulator.<br/><br/><em>Now you can try it out on your own!</em></p>"
            }, window.tour = t = new Tour({
                backdrop: !0,
                orphan: !0,
                storage: !1,
                template: a,
                container: $("main"),
                onEnd: function() {
                    n && o(function() {
                        i.show = n, n = void 0
                    }), f || m.trackEvent(p ? "TourHelpEnded" : "TourEnded", t.getCurrentStep())
                },
                onShow: function(e, a) {
                    if (i.vertical) {
                        n = n || angular.copy(i.show);
                        var t = u(a) || d(a);
                        if (t && t.show) return {
                            then: function(e) {
                                o(function() {
                                    i.show = angular.copy(n), i.show[t.show] = !0, e()
                                })
                            }
                        }
                    }
                },
                onShown: function() {
                    e = new Date, $(".tour-backdrop").off().on("click", function() {
                        t.end()
                    })
                },
                onHidden: function() {
                    m.trackUserTime("TourStepVisible", new Date - e, t.getCurrentStep())
                },
                steps: h,
                keyboard: !1
            })
        }
    }
}]);
var BinaryBase64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    encode: function(e) {
        for (var a = ""; 6 <= e.length;) {
            var t = e.substring(0, 6);
            e = e.substring(6), a += BinaryBase64._keyStr[parseInt(t, 2)]
        }
        if (0 < e.length) {
            for (var i = e.length; i < 6; i++) e += "0";
            a += BinaryBase64._keyStr[parseInt(e, 2)]
        }
        return a
    },
    decode: function(e) {
        for (var a = "", t = 0; t < e.length; t++) {
            var i = BinaryBase64._keyStr.indexOf(e[t]);
            a += BinaryBase64.toBinary(6, i)
        }
        return a
    },
    toBinary: function(e, a) {
        var t;
        t = angular.isNumber(a) ? Math.minMax(0, (2 << e - 1) - 1, Math.round(a)).toString(2) : a ? 1 : 0;
        for (var i = "", o = 0; o < e - t.length; o++) i += "0";
        return i + t
    },
    fromBinary: function(e, a, t, i) {
        var o = e.substring(a, a + t);
        if (o.length == t) return parseInt(o, 2);
        if (void 0 !== i) return i;
        throw "Binary read error"
    }
};

function SelectOptions(e, a) {
    for (var t = 0; t < e.length; t++) e[e[t][a || "key"]] = e[t];
    return e
}
var _ = {
    map: function(e, a) {
        if (angular.isArray(e)) {
            for (var t = [], i = 0; i < e.length; i++) {
                var o = a(e[i], i);
                t.push(o)
            }
            return t
        }
        if (angular.isObject(e)) {
            t = [];
            for (var n in e) {
                o = a(e[n], n);
                t.push(o)
            }
            return t
        }
        return e
    },
    filter: function(e, a) {
        if (angular.isArray(e)) {
            for (var t = [], i = 0; i < e.length; i++) a(e[i], i) && t.push(e[i]);
            return t
        }
        if (angular.isObject(e)) {
            t = [];
            for (var o in e) a(e[o], o) && t.push({
                key: o,
                obj: e[o]
            });
            return t
        }
        return e
    },
    find: function(e, a) {
        if (angular.isArray(e)) {
            for (var t = 0; t < e.length; t++)
                if (a(e[t], t)) return e[t]
        } else {
            if (!angular.isObject(e)) return e;
            for (var i in e)
                if (a(e[i], i)) return {
                    key: i,
                    obj: e[i]
                }
        }
    },
    findKey: function(e, a) {
        if (angular.isArray(e)) {
            for (var t = 0; t < e.length; t++)
                if (a(e[t], t)) return t
        } else {
            if (!angular.isObject(e)) return e;
            for (var i in e)
                if (a(e[i], i)) return i
        }
    },
    findBy: function(e, a, t) {
        if (angular.isArray(e)) {
            for (var i = 0; i < e.length; i++)
                if (e[i][a] === t) return e[i]
        } else {
            if (!angular.isObject(e)) return e;
            for (var o in e)
                if (e[o][a] === t) return e[o]
        }
    },
    foreach: function(e, a) {
        if (angular.isArray(e))
            for (var t = 0; t < e.length; t++) a(e[t], t);
        else if (angular.isObject(e))
            for (var i in e) a(e[i], i)
    }
};