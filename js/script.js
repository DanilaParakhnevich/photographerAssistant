"use strict";
var app = angular.module("ui");

function Size(e, i) {
    this.x = e, this.y = i, this.max = Math.max(e, i), this.min = Math.min(e, i), this.d = Math.sqrt(e * e + i * i)
}

function BiMap(e) {
    for (var i in this.values = e, this.keys = {}, e) this.keys[e[i]] = i
}
0 <= navigator.userAgent.indexOf("Trident") && ($.browser.msie = !0), $(document).ready(function() {
    Modernizr.cssfilters && !$.browser.mozilla ? $("#backgroundSVG,#modelSVG,#canvasSVG").remove() : $("#backgroundFilter,#modelFilter,#canvasFilter").remove()
}), app.config(["$animateProvider", function(e) {
    e.classNameFilter(/ng-animate-enabled/)
}]), app.controller("MainCtrl", ["$scope", "$filter", "$timeout", "$location", "$http", "browserSvc", "gaSvc", "paramsSvc", "dialogSvc", "tourSvc", "cameras", "lenses", "infotipSvc", "cookieSvc", function(B, e, u, i, t, c, d, a, o, r, n, s, m, l) {
    var f = this;
    c.isSupported || o.showDialog("browserUnsupported");
    var h = "20170409",
        g = "20200320",
        v = B.minSeparation = 300;
    B.maxLines = 12e3, B.maxMpix = 200, B.$max = Math.max, B.$min = Math.min, B.$math = Math, B.$isFinite = isFinite, B.cameraMakes = n, this.trackEvent = d.trackEvent, this.showDialog = o.showDialog, this.hideDialog = o.hideDialog, this.chooseLanguage = function(e) {
        window.location = "../" + e + "/"
    }, B.vertical = !1, this.printModel = function(e) {
        angular.isString(e) && (e = B.modelsList[e]);
        var i = e.name + " (";
        return "metric" === B.units ? i += (e.height / 1e3).toFixed(2) + "m" : i += Math.floor(e.height / 304.8) + "' " + Math.round(e.height % 304.8 / 25.4) + '"', i + ")"
    }, B.backgroundScale = 1, this.resetConfig = function() {
        d.trackEvent("ConfigReset"), a.resetConfig(B), X(!(de = 0), !1), te(), le(B.sensor.multiplier), B.selectedParams = void 0
    };

    B.cookieSettings = l.getCookieSettings();
    var M = a.initScope(B, h, g, B.cookieSettings.acceptCookies || c.isOffline);
    B.isMobile = c.isMobile, B.isAndroid = c.isAndroid, c.isGooglebot || (Modernizr.cookies && !B.cookieSettings.acceptCookies ? o.showDialog("cookie", !0) : c.isAndroid && M % 5 == 2 && o.showDialog("android")), !B.advanced && 0 < M && M % 2 == 0 && m.trigger("advanced")
    , this.saveCookieSettings = function(e) {
        var i = l.getCookieSettings(),
            t = B.cookieSettings;
        l.saveCookieSettings(B.cookieSettings), t.acceptCookies ? i.acceptCookies ? i.personalizedAds !== t.personalizedAds && (d.trackEvent("PersonalizedAdsChanged", t.personalizedAds, !0), setTimeout(function() {
            window.location.reload()
        })) : (a.loadLocalStorage(B, h, g), t.personalizedAds && d.trackEvent("PersonalizedAdsAccepted", e, !0)) : i.acceptCookies ? (l.clearCookies(), window.localStorage.clear(), window.onbeforeunload = void 0, window.location.reload()) : p(), o.hideDialog()
    };
    var S, k, x = window.require && require("nw.gui");
    x && x.Window && x.Window.get();
    f.showCustomCocDialog = function() {
        o.showDialog("customCoc")
    }, this.changeCoc = function(e) {
        d.trackEvent("CocChanged", B.coc.key), B.coc.custom && !B.customCoc ? (this.showCustomCocDialog(), B.coc = B.cocList[e]) : te(), m.trigger("coc")
    }, B.imageSize = new Size(720, 480), B.backgroundWidth = 1440, B.holeFisheye = void 0, B.holeFormat = void 0, B.contentWidth, B.configWidth, this.blurFilter = function(e) {
        return "blur(" + Math.max(e, B.simulationAiry) / B.sensor.size.x * B.imageSize.x / 4 + "px)"
    }, this.backgroundStyle = function(e, i) {
        var t = {
            height: B.backgroundWidth + "px",
            width: B.backgroundWidth / e * B.conv.anamorph + "px",
            transform: "scaleX(" + 1 / B.conv.anamorph + ")",
            right: -(B.backgroundWidth / e * B.conv.anamorph - B.imageSize.x) / 2 + "px",
            top: B.backgroundOffset + "px"
        };
        return i && (t.filter = t["-webkit-filter"] = f.blurFilter(B.simulationBlur)), t
    }, this.diffractionFilter = function() {
        return "blur(" + B.simulationAiry / B.sensor.size.x * B.imageSize.x / 4 + "px)"
    }, this.modelStyle = function(e, i) {
        var t = {
            height: B.modelHeight * e,
            width: .55 * B.modelHeight * e,
            left: (B.imageSize.x - .55 * B.modelHeight * e) / 2,
            top: B.backgroundOffset + B.modelOffset - (e - 1) * B.modelHeight * B.model.faceCenter
        };
        return void 0 !== i && (t.filter = t["-webkit-filter"] = f.blurFilter(i)), t
    }, B.fftSize = 1024;
    var w = document.createElement("canvas");
    w.width = w.height = 1024;
    var b, F = w.getContext("2d");
    F.fillStyle = "#888888", B.fourierBlurProgress = 100, B.fourierBlurCancelled = !1, B.fourierBlurReady = !1, B.fourierBackgroundOffset = 0, B.fourierImageSizeY = 0, B.fourierImageData;
    var z = !1,
        C = !1,
        O = 0,
        A = function(e) {
            Modernizr.webworkers && k.postMessage && Modernizr.canvas && !($.browser.msie && $.browser.version < 11) && B.fourierBlurType && (B.fourierBlurProgress < 100 && !z ? C = !0 : 0 === B.backgroundScale || !Modernizr.webworkers || !Modernizr.canvas || B.loadedBkg.count < 4 || B.vertical && !B.show.simulation || B.y0 <= B.f || B.autoFourierBlur && (angular.isUndefined(B.f) || angular.isUndefined(B.a) || angular.isUndefined(B.y0) || angular.isUndefined(B.y)) || (e && (m.cancel("fourierBlurGenerate"), d.trackEvent("FourierBlurRequested")), B.fourierBlurCancelled = !1, B.fourierBlurProgress = 0, u(function() {
                try {
                    b = new Date;
                    var e = B.fftSize = 480 < B.imageSize.max ? 1024 : 512,
                        i = document.getElementById("canvasBackgroundImg" + B.backgroundScale),
                        t = B.backgroundWidth / B.backgroundScale,
                        a = 1440 / t;
                    O = (B.backgroundOffset + B.backgroundOffset2) / 2 - (B.imageSize.x - B.imageSize.y) / 4, F.fillRect(0, 0, e, e);
                    var o = Math.max(0, (t - e) / 2) * a,
                        r = Math.max(0, -O - (e - B.imageSize.y) / 2) * a,
                        n = Math.max(0, (e - t) / 2),
                        s = Math.max(0, (e - B.imageSize.y) / 2 + O),
                        l = Math.min(1440, e * a),
                        c = Math.min(B.backgroundWidth <= e ? 1440 : (e - s) * a, i.height - r);
                    F.drawImage(i, o, r, l, c, n, s, l / a, c / a), k.postMessage({
                        type: B.fourierBlurType,
                        radius: B.simulationBlur / B.sensor.size.x * B.imageSize.x / 2,
                        ratio: B.conv.anamorph,
                        image: F.getImageData(0, 0, e, e)
                    }), z = !1
                } catch (e) {
                    console.error(e), z ? (z = !1, B.fourierBlurProgress = void 0, B.fourierBlurReady = !1, d.trackError("FourierBlur", e.message)) : (z = !0, B.fourierBlurProgress = 0, u(A, 200))
                }
            })))
        };
    this.doFourierBlur = A, this.changeAutoFourierBlur = function() {
        B.autoFourierBlur ? (B.fourierBlurReady || A(), m.cancel("fourierBlurGenerate"), d.trackEvent("FourierAutoEnabled")) : m.cancel("fourierBlurGenerate")
    }, this.changeFourierBlurType = function() {
        d.trackEvent("FourierBlurTypeChanged", B.fourierBlurType), B.selectedParams && null != B.selectedParams.fourierBlurType && (B.selectedParams = void 0), B.fourierBlurType ? A() : B.fourierBlurReady = !1
    }, this.selectFourierBlurType = function(e) {
        e !== B.fourierBlurType && (B.fourierBlurType = e, f.changeFourierBlurType()), o.hideDialog()
    };

    function D(e) {
        if ("number" == typeof e.data) B.fourierBlurProgress = +e.data, B.$digest();
        else {
            B.fourierImageSizeY = B.imageSize.y, B.fourierBackgroundOffset = O, B.fourierImageData = e.data, document.getElementById("backgroundCanvas").getContext("2d").putImageData(e.data, 0, 0), B.selectedParams && (B.selectedParams.fourierBlurType = B.fourierBlurType, B.selectedParams.savedFourier = {
                imageData: e.data,
                backgroundOffset: B.fourierBackgroundOffset,
                imageSizeY: B.fourierImageSizeY
            }), B.fourierBlurProgress = 100, C ? (C = !1, A()) : B.fourierBlurReady = !0;
            var i = new Date - b;
            d.trackEvent("FourierBlurGenerated", B.fourierBlurType), d.trackProcessingTime("FourierBlur", i, B.fftSize), B.autoFourierBlur && 3e3 < i && m.trigger("fourierBlurAuto"), B.$digest()
        }
    }

    B.$watch("show", function(e, i) {
        e !== i && !0 === e.simulation && !1 === i.simulation && B.autoFourierBlur && !B.fourierBlurReady && A()
    }, !0), B.$on("$locationChangeSuccess", function(e) {
        $("image").attr("filter", ""), $("image.backgroundImg").attr("filter", "url(#blur)"), $("#canvasSVG #backgroundCanvas").css("filter", "url(#canvasDiffraction)"), $("image#modelEarsSVG").attr("filter", "url(#ears)"), $("image#modelBodySVG").attr("filter", "url(#ears)"), $("image#modelEyesSVG").attr("filter", "url(#diffraction)"), $("image#modelFaceSVG").attr("filter", "url(#mouth)"), $("image#modelMouthSVG").attr("filter", "url(#mouth)"), $("image#modelNoseSVG").attr("filter", "url(#nose)")
    });

    function T() {
        var e = B.f * B.conv.multiplier,
            i = B.a * B.conv.multiplier,
            t = B.y0,
            a = B.y,
            o = B.sensor,
            r = B.imageSize,
            n = B.background,
            s = B.model,
            l = B.blur,
            c = B.airy;
        B.simulationBlur = Math.min(o.size.min, l), B.simulationAiry = !B.advanced || B.diffraction ? c : 0;
        var u = Math.max(t, 250);
        B.earsCoeff = (u - 70) / u;
        var d = t + 70;
        B.earsBlur = e / i * (t / (t - e) * ((d - e) / d) - 1), B.mouthCoeff = (u + 20) / u;
        var m = t - 20;
        B.mouthBlur = e / i * (1 - t / (t - e) * ((m - e) / m)), B.noseCoeff = (u + 50) / u;
        var f = t - 50;
        B.noseBlur = e / i * (1 - t / (t - e) * ((f - e) / f));
        var h = Math.atan(o.size.max / (2 * e)) / Math.PI * 180 * 2,
            g = o.size.max / e * 25e3;
        B.backgroundWidth = 127 < h ? 58434 / g * r.max : 74 < h ? 74 / h * r.max : 37500 / g * r.max, isFinite(a) && B.scaleBackground && (B.backgroundWidth = B.backgroundWidth * (25e3 / a));
        var v = B.backgroundWidth;
        B.holeFisheye = r.max * e / (B.lens.fisheye ? 12 : 8) * o.multiplier, B.holeFormat = B.lens && B.lens.minM && B.lens.minM > o.multiplier ? o.multiplier / B.lens.minM * r.d : void 0, S = t * (o.size.y / e);
        var p = B.modelHeight = r.y * B.model.height / S;
        B.modelOffset = 0;
        var y = .01 * r.y;
        if (n.constBottom) {
            var M = (Math.min(a, 25e3) - Math.min(t, 25e3)) / 25e3;
            B.modelOffset = v * (n.constBottom + M * M * (1 - n.constBottom)) - p
        } else p > .97 * v * (1 - n.constTop) ? B.modelOffset = .97 * v - p : B.modelOffset = v * n.constTop;
        if (B.modelOffset < v * n.maxTop && (B.modelOffset = Math.minMax(B.modelOffset, v - r.y, v * n.maxTop)), v <= r.y) {
            B.backgroundOffset = (r.y - v) / 2;
            var k = Math.max(0, (r.y - B.holeFisheye) / 2);
            B.modelOffset = Math.max(k - B.backgroundOffset + y, B.modelOffset)
        } else {
            p * s.faceHeight > r.y ? B.backgroundOffset = -B.modelOffset + (r.y / 2 - p * s.faceHeight / 2) : p + 2 * y > r.y ? B.backgroundOffset = -B.modelOffset + y : B.backgroundOffset = Math.min(-B.modelOffset + B.modelOffset / v * r.y, r.y - B.modelOffset - p - y);
            var x = Math.max(0, r.y - (B.backgroundOffset + v));
            B.backgroundOffset += x, B.modelOffset -= x
        }
        v <= r.x ? B.backgroundOffset2 = (r.x - v) / 2 : p * s.faceHeight > r.x ? B.backgroundOffset2 = -B.modelOffset + (r.x / 2 - p * s.faceHeight / 2) : p > r.x ? B.backgroundOffset2 = -B.modelOffset : B.backgroundOffset2 = Math.min(0, -B.modelOffset + (r.x - p));
        var w = l / o.size.x * r.x;
        17280 < v ? B.backgroundScale = 0 : 8 < v / (r.max + w) ? B.backgroundScale = 8 : 4 < v / (r.max + w) ? B.backgroundScale = 4 : 2 < v / (r.max + w) ? B.backgroundScale = 2 : B.backgroundScale = 1, R && G && j && (R.setAttribute("stdDeviation", Math.max(l, B.simulationAiry) / o.size.x * r.x / 4 * 1e3 / v), q.setAttribute("stdDeviation", Math.max(B.earsBlur, B.simulationAiry) / o.size.y * r.y / 4 * 440 / p / B.earsCoeff), H.setAttribute("stdDeviation", Math.max(B.mouthBlur, B.simulationAiry) / o.size.y * r.y / 4 * 440 / p / B.mouthCoeff), U.setAttribute("stdDeviation", Math.max(B.noseBlur, B.simulationAiry) / o.size.y * r.y / 4 * 440 / p / B.noseCoeff), G.setAttribute("stdDeviation", B.simulationAiry / o.size.y * r.y / 4 * 440 / p), j.setAttribute("stdDeviation", (B.simulationAiry > B.simulationBlur ? B.simulationAiry : 0) / o.size.y * r.y / 4))
    }

    function P() {
        B.blur = B.lines = B.mpix = void 0, B.airy = B.diffractionLines = B.diffractionMpix = void 0, B.optiA = B.optiBlur = B.optiLines = B.optiMpix = B.maxA = void 0, B.nearDOF = B.farDOF = B.frontDOF = B.backDOF = B.hyperfocal = void 0, B.simulationValid = !1
    }

    function Y(e) {
        if (N && u.cancel(N), angular.isUndefined(B.f) || angular.isUndefined(B.a) || angular.isUndefined(B.y0) || angular.isUndefined(B.y) || B.y0 <= B.f) N = u(P, 500);
        else {
            B.simulationValid = !0;
            var i = B.f * B.conv.multiplier,
                t = B.a * B.conv.multiplier,
                a = B.y0,
                o = B.y,
                r = B.sensor;
            isFinite(o) ? (B.blur = i / t * (a / (a - i) * ((o - i) / o) - 1), B.optiA = Math.sqrt(i / .001342 * (a / (a - i) * ((o - i) / o) - 1))) : (B.blur = i / t * (a / (a - i) - 1), B.optiA = Math.sqrt(i / .001342 * (a / (a - i) - 1))), B.optiBlur = 671e-6 * B.optiA * 2, B.airy = 671e-6 * t * 2, B.maxA = r.c / .001342, !B.advanced && B.airy > B.blur ? (B.totalBlur = B.airy, m.trigger("diffraction")) : B.totalBlur = B.blur, B.nearDOF = Math.max(a * i * i / (i * i + t * r.c * (a - i)), 0), B.farDOF = a * i * i / (i * i - t * r.c * (a - i)), B.frontDOF = a - B.nearDOF, B.backDOF = B.farDOF - a, B.hyperfocal = i * i / (t * r.c), (a > B.hyperfocal || B.farDOF < 0) && (B.farDOF = B.backDOF = 1 / 0);
            var n = r.size.min / B.blur * 2;
            B.lines = Math.round(n), B.mpix = (B.video16_9 ? 16 / 9 : r.ratio) * n * n / 1e6;
            var s = r.size.min / B.airy * 2;
            B.diffractionLines = Math.round(s), B.diffractionMpix = (B.video16_9 ? 16 / 9 : r.ratio) * s * s / 1e6;
            var l = r.size.min / B.optiBlur * 2;
            B.optiLines = Math.round(l), B.optiMpix = (B.video16_9 ? 16 / 9 : r.ratio) * l * l / 1e6, V && (u.cancel(V), V = void 0), c.isMobile && e ? (L || (T(), L = u(function() {
                console.log("Timeout"), T(), L = void 0
            }, 500)), V = u(function() {
                console.log("Delay"), V = void 0, u.cancel(L), L = void 0, T()
            }, 100)) : (u.cancel(L), L = void 0, T())
        }
    }
    var L, V, I, R = document.getElementById("blurSize"),
        G = document.getElementById("diffractionSize"),
        q = document.getElementById("earsBlurSize"),
        H = document.getElementById("mouthBlurSize"),
        U = document.getElementById("noseBlurSize"),
        j = document.getElementById("canvasDiffractionSize"),
        N = void 0;
    this.calculateValues = Y;

    function Z(e) {
        B.fourierBlurReady = !1, I && u.cancel(I), (B.initFourierBlur || B.autoFourierBlur) && 4 == B.loadedBkg.count && (B.initFourierBlur = !1, I = e && 100 === B.fourierBlurProgress ? u(function() {
            A(), I = void 0
        }, 1e3) : u(function() {
            A(), I = void 0
        }, 100))
    }
    var X = function(e, i) {
        if (B.fourierBlurReady && !B.autoFourierBlur && B.fourierBlurType && m.trigger("fourierBlurGenerate"), e)
            for (var t = 0; t < B.paramsList.length; t++) B.paramsList[t].savedFourier && (!0 === e || e === 1 / 0 && B.paramsList[t].y !== 1 / 0) && (B.paramsList[t].savedFourier = void 0, delete B.paramsList[t].savedFourier);
        else B.selectedParams = void 0;
        angular.isDefined(i) ? Z(i) : B.fourierBlurReady = !1
    };
    B.loadedBkg = {
        count: 0,
        error: !1
    }, B.loadedModel = {
        all: $.browser.msie
    }, this.changeModel = function() {
        d.trackEvent("ModelChanged", B.model.key), Y(), X(!0, !1), B.loadedModel = {
            all: $.browser.msie
        }
    }, B.$watch("loadedModel", function(e) {
        B.loadedModel.all = B.loadedModel.all || 7 == Object.keys(e).length
    }, !0);

    function J() {
        K = new Date, d.trackEvent("BackgroundChanged", B.background.key), X(!0), $.browser.msie ? (B.loadedBkg = {
            1: !0,
            2: !0,
            4: !0,
            8: !0,
            count: 4,
            error: !1
        }, B.autoFourierBlur && Z(!0)) : B.loadedBkg = {
            count: 0,
            error: !1
        }, Y()
    }
    var K = new Date;
    this.changeBackground = J, B.$watch("loadedBkg", function(e, i) {
        4 != e.count && (e.count = Object.keys(e).length - 2, e.error = 4 == e.count && (!1 === e[1] || !1 === e[2] || !1 === e[4] || !1 === e[8]), e.error ? d.trackError("BackgroundLoad", B.background.key) : 4 == e.count && (d.trackLoadTime("BackgroundImage", new Date - K, B.background.key), Z(!0)))
    }, !0);

    function Q(e) {
        B.lens.minA_range && (B.lens.minA = ie(B.lens.minA_range, B.lens.minF, B.lens.maxF, B.f)), B.lens.maxA_range && (B.lens.maxA = ie(B.lens.maxA_range, B.lens.minF, B.lens.maxF, B.f)), B.a = Math.minMax(B.lens.minA || .5, B.lens.maxA || 128, B.userA), Y(e)
    }

    function ee() {
        if ("camera" === B.formatType && B.cameraModel && B.cameraModel.lens) {
            var e = B.cameraModel.lens;
            B.lens = {
                minF: e.minF,
                maxF: e.maxF,
                fixedF: e.minF === e.maxF,
                minA_range: e.minA,
                maxA: 22
            }
        } else B.lensModel ? B.lens = {
            minF: B.lensModel.minF,
            maxF: B.lensModel.maxF,
            fixedF: B.lensModel.minF === B.lensModel.maxF,
            minA_range: B.lensModel.minA,
            maxA_range: B.lensModel.maxA,
            fixedA: B.lensModel.minA.min === B.lensModel.maxA.min && B.lensModel.minA.max === B.lensModel.maxA.max,
            minD: B.lensModel.minD,
            minM: B.lensModel.m / B.conv.multiplier,
            fisheye: B.lensModel.fisheye
        } : B.lens = {
            rounding: B.sensor.rounding,
            fisheye: !0
        };
        var i = B.f;
        B.lens.fixedF && B.f !== B.lens.minF && (B.f = B.lens.minF, B.constant = "f", ue());
        var t = B.a;
        Q(!1), t === B.a && i === B.f || X(!1, !1), re()
    }
    var ie = function(e, i, t, a) {
            if (a = Math.minMax(a, i, t), e.min === e.max || a <= i) return e.min;
            if (t <= a) return e.max;
            for (var o = e.min + (e.max - e.min) * Math.atan(4 * (a - i) / (t - i)) / 1.326, r = 0; r < B.apertureValues.length - 1; r++) {
                var n = Math.max(e.min, B.apertureValues[r]),
                    s = Math.min(e.max, B.apertureValues[r + 1]);
                if (n <= o && o <= s) return o - s < n - o ? n : s
            }
        },
        te = B.calculateViewport = function() {
            "camera" === B.formatType && B.cameraModel ? (B.sensor = angular.copy(B.sensors[B.cameraModel.s]), B.sensor.size = new Size(B.cameraModel.w, B.cameraModel.h), B.sensor.multiplier = B.cameraModel.m, B.sensor.multiaspect = B.cameraModel.multiaspect) : B.sensor = angular.copy(B.sensors[B.format]);
            var e = B.sensor;
            e.size = new Size(e.size.x * B.conv.anamorph, e.size.y / B.conv.rearAnamorph), e.ratio = e.size.max / e.size.min;
            var i = angular.copy(B.coc);
            if (B.coc.custom) {
                var t = B.customCoc;
                switch (t.type) {
                    case "value":
                        i.value = t.value;
                        break;
                    case "lines":
                        i.lines = t.lines;
                        break;
                    case "resolution":
                        i.width = t.resolution.width;
                        break;
                    case "print":
                        i.width = t.print.width / 2.54 * t.print.dpi;
                        break;
                    case "view":
                        i.width = t.view.width / t.view.distance * 124.138 * 2 * 10
                }
            }
            i.mpix ? B.sensor.c = e.size.max / Math.sqrt(1e6 * i.mpix * e.ratio) * 2 : i.lines ? B.sensor.c = Math.sqrt(e.size.max * e.size.max + e.size.min * e.size.min) / i.lines : i.width ? B.sensor.c = e.size.max / i.width * 2 : B.sensor.c = i.value;
            var a = e.size.min,
                o = e.size.max;
            if (B.video16_9 && e.ratio < 1.75)
                if (e.multiaspect) {
                    Math.sqrt(o * o + a * a);
                    var r = Math.sqrt((o * o + a * a) / 337);
                    a = 9 * r, o = 16 * r
                } else a = 9 * e.size.max / 16;
            "portrait" == B.orientation ? B.sensor.size = new Size(a, o) : B.sensor.size = new Size(o, a), B.imageSize = new Size(B.imageSize.max * e.size.x / e.size.max, B.imageSize.max * e.size.y / e.size.max), ee()
        };
    f.changeOrientation = function() {
        d.trackEvent("OrientationChanged", B.orientation), te()
    }, this.changeDiffraction = function() {
        B.diffraction && (m.trigger("diffraction"), d.trackEvent("DiffractionEnabled")), Y()
    };

    function ae(e) {
        var i = $(window).width(),
            t = $(window).height(),
            a = i / t,
            o = oe && 1 < Math.max(oe, a) && Math.min(oe, a) < 1;
        !c.isMobile || oe && !o || (B.vertical = a < 1 && i < 800 || i < 320), oe = a, B.vertical ? (B.contentWidth = Math.minMax(360, 980, i - 10), B.configWidth = B.imageWidth = B.contentWidth, B.fontSize = 11 + Math.round((B.contentWidth - 360) / 620 * 4)) : (B.contentWidth = Math.minMax(800, 1600, Math.round(.95 * i)), B.configWidth = Math.minMax(400, 600, .45 * B.contentWidth), B.imageWidth = B.contentWidth - B.configWidth, B.fontSize = 12 + Math.round((B.contentWidth - 800) / 800 * 3)), $(".adsbygoogle").css("width", B.contentWidth);
        var r = Math.min(B.imageWidth - 20, t - 20);
        B.imageSize = new Size(r, r * B.sensor.size.min / B.sensor.size.max), "portrait" == B.orientation && (B.imageSize = new Size(B.imageSize.min, B.imageSize.max)), B.dialogWidth = Math.min(B.contentWidth - 20, 600), B.dialogLeft = (Math.max(i, B.contentWidth) - B.dialogWidth) / 2, re(), u(function() {
            te(), B.lensMakes || le(B.sensor.multiplier)
        })
    }
    var oe, re = function() {
        var e = B.lens && B.lens.minD ? 1e3 * B.lens.minD : 0;
        "imperial" == B.units ? (B.valueRound = 60.96, B.previewScale = [0, 10, 20, 30, 40, 50, 60, 70], B.multiplier = 304.8, B.minY0 = Math.max(e, 304.8), B.minY = 609.6, B.maxY = 24384, B.y0SliderConfig = {
            min: B.minY0,
            max: B.maxY,
            scale: 9,
            multiplier: B.multiplier,
            unit: "ft",
            valueRound: B.valueRound,
            rounding: 1
        }, B.ySliderConfig = {
            min: B.minY,
            max: B.maxY,
            scale: 9,
            multiplier: B.multiplier,
            unit: "ft",
            valueRound: B.valueRound,
            rounding: 1
        }) : (B.valueRound = 100, B.previewScale = [0, 5, 10, 15, 20], B.multiplier = 1e3, B.minY0 = Math.max(e, 300), B.minY = 500, B.maxY = 25e3, B.y0SliderConfig = {
            min: B.minY0,
            max: B.maxY,
            scale: 10,
            multiplier: B.multiplier,
            unit: "m",
            valueRound: B.valueRound,
            rounding: 1
        }, B.ySliderConfig = {
            min: B.minY,
            max: B.maxY,
            scale: 10,
            multiplier: B.multiplier,
            unit: "m",
            valueRound: B.valueRound,
            rounding: 1
        })
    };
    $(window).on("resize", ae), B.$watch("imageSize.max", function(e, i) {
        e !== i && X(!0, !0)
    }), this.toggleVertical = function() {
        B.vertical = !B.vertical, ae(), d.trackEvent("ToggleMobile", B.vertical)
    }, re(), this.changeMode = function() {
        B.advanced ? B.selectedParams && f.selectParams(B.selectedParams) : a.setBasicDefaults(B), le(B.sensor.multiplier), te(), X(!0, !1), d.trackEvent("ModeChanged", B.advanced ? "advanced" : "basic")
    }, B.$watch("units", function(e, i) {
        e !== i && (d.trackEvent("UnitsChanged", e), re())
    });

    function ne(e, i) {
        return B.constDistance && e && B.y < 1 / 0 && (B.y = Math.max(e + v, e + (B.y - i))), e > B.y - v ? (B.y0 = B.y - v, !1) : (B.y0 = e, !0)
    }

    function se(e) {
        if (X(!1, !1), B.lockFOV) {
            var i = e / B.sensor.multiplier;
            "f" == B.constant ? ne(Math.round(B.y0 * i), B.y0) : B.f = Math.round(B.f / i * 10) / 10
        }
        te()
    }
    var le = function(e) {
        B.matchingLens && e ? B.lensMakes = s.filter(e, "camera" === B.formatType && B.cameraModel ? B.cameraModel.mount : void 0) : B.lensMakes = s, B.lensMake && (B.lensMake = _.findBy(B.lensMakes, "make", B.lensMake.make), B.lensMake && B.lensModel ? B.lensModel = _.findBy(B.lensMake.lenses, "id", B.lensModel.id) : B.lensModel = void 0)
    };
    this.changeMatchingLens = function() {
        le(B.sensor.multiplier), ee(), B.matchingLens || d.trackEvent("MatchingLensDisabled")
    }, this.changeFormat = function() {
        var e = B.sensors[B.format].multiplier;
        le(e), se(e), f.trackEvent("FormatChanged", B.format), m.trigger("cameraDatabase")
    };

    function ce() {
        return (B.cameraMake && B.cameraMake.make || "") + " " + (B.cameraModel && B.cameraModel.model || "")
    }
    this.changeCameraMake = function() {
        B.cameraModel = void 0
    }, this.changeCameraModel = function() {
        le(B.cameraModel.m), se(B.cameraModel.m), f.trackEvent("CameraModelSelected", ce())
    }, this.changeFormatType = function() {
        if ("camera" == B.formatType) B.cameraModel && (le(B.cameraModel.m), se(B.cameraModel.m));
        else {
            var e = B.sensors[B.format].multiplier;
            le(e), se(e)
        }
    }, this.changeVideo16_9 = function() {
        te(), B.video16_9 && d.trackEvent("Video16_9Enabled", "sensor" == B.formatType ? B.format : ce())
    }, this.changeLensMake = function() {
        B.lensModel && (B.lensModel = void 0, B.selectedParams = void 0), ee()
    }, this.changeLensModel = function() {
        B.selectedParams = void 0, ee(), f.trackEvent("LensModelSelected", B.lensMake.make + " " + B.lensModel.model)
    }, this.changeF = function(e) {
        B.constant = "f", X(!1, !!e), ue(), Q(e)
    };
    var ue = function(e) {
        if (B.lockFOV && B.f && B.y0 && S) {
            var i = B.y0,
                t = B.sensor.size.y * B.y0 / S;
            ne(Math.round(B.y0 * (B.f * B.conv.multiplier / t)), i) || B.lens.fixedF || (B.f = t * B.y0 / i)
        }
    };
    this.changeConv = function(e) {
        if (B.lockFOV) {
            var i = B.conv.multiplier * B.conv.rearAnamorph / (e.multiplier * e.rearAnamorph);
            "f" == B.constant ? ne(Math.round(B.y0 * i), B.y0) : B.f = Math.round(B.f / i * 10) / 10
        }
        d.trackEvent("ConverterChanged", B.conv.key), X(!1, !1), te()
    };
    var de = B.x;
    this.changeX = function(e) {
        var i = B.y0,
            t = de - B.x;
        B.y0 + t < B.y0SliderConfig.min && (t = B.y0SliderConfig.min - B.y0, B.x = de - t), de = B.x, X(!1, !!e), B.y0 += t, isFinite(B.y) && (B.y += t), B.constant = B.lens.fixedF ? "f" : "y0", B.lockFOV && !B.lens.fixedF && B.f && B.y0 && (B.f = Math.round(B.f * (B.y0 / i) * 10) / 10), Q(e)
    }, this.changeY0 = function(e) {
        var i = B.f * B.conv.multiplier * S / B.sensor.size.y;
        X(!1, !!e), ne(B.y0, i), B.constant = B.lens.fixedF ? "f" : "y0", B.lockFOV && !B.lens.fixedF && B.f && B.y0 && (B.f = Math.round(B.f * (B.y0 / i) * 10) / 10), Q(e)
    }, this.changeY = function(e) {
        X(!1, !!e), B.y < B.y0 + v && (B.y = B.y0 + v), Y(e)
    }, this.changeA = function(e) {
        B.userA = B.a, X(!1, !!e), Y(e)
    }, this.changeScaleBackground = function() {
        B.scaleBackground && d.trackEvent("ScaleBackgroundEnabled"), Y(), X(1 / 0, !1)
    }, this.changeLockFOV = function() {
        B.lockFOV && d.trackEvent("LockFrameEnabled")
    }, this.crop = function(e) {
        d.trackEvent("FramingSelected", e);
        var i = (e = e * (B.model.height / 1700) * (B.sensor.size.max / B.sensor.size.y)) / (S * (B.sensor.size.max / B.sensor.size.y));
        "f" == B.constant ? ne(Math.round(B.y0 * i), B.y0) : B.f = Math.round(B.f / i * 10) / 10, X(!1, !1), Q(), m.trigger("lockFOV")
    }, this.addParams = function() {
        var e = "camera" == B.formatType && B.cameraModel,
            i = B.lensMake && B.lensModel && ("sensor" === B.formatType || !B.cameraModel || !B.cameraModel.lens),
            t = {
                id: (new Date).valueOf(),
                f: B.f,
                a: B.a,
                y0: B.y0,
                y: B.y,
                formatType: e ? "camera" : "sensor",
                format: B.format,
                cameraMake: e ? B.cameraMake : void 0,
                cameraModel: e ? B.cameraModel : void 0,
                lensMake: i ? B.lensMake : void 0,
                lensModel: i ? B.lensModel : void 0,
                formatMultiplier: B.sensor.multiplier,
                conv: B.conv,
                convMultiplier: B.conv.multiplier * B.conv.anamorph * B.conv.rearAnamorph,
                fourierBlurType: B.fourierBlurType
            };
        B.fourierBlurReady && (t.savedFourier = {
            imageData: B.fourierImageData,
            backgroundOffset: B.fourierBackgroundOffset,
            imageSizeY: B.fourierImageSizeY
        }), B.paramsList.push(t), B.selectedParams = t, m.cancel("paramsList"), d.trackEvent("ParamsAdded", B.paramsList.length)
    }, this.selectParams = function(e) {
        var i;
        B.selectedParams = e, B.f = e.f, B.a = B.userA = e.a, B.y0 = e.y0, B.formatType = e.formatType, B.fourierBlurType = e.fourierBlurType, i = "camera" === e.formatType ? (B.cameraMake = e.cameraMake, B.cameraModel = e.cameraModel, B.cameraModel.m) : (B.format = e.format, B.sensors[B.format].multiplier), ("sensor" === e.formatType || e.cameraModel && !e.cameraModel.lens) && (B.lensMake = e.lensMake, B.lensModel = e.lensModel), le(i), B.advanced && (B.conv = e.conv, B.y = e.y), te(), e.savedFourier ? (document.getElementById("backgroundCanvas").getContext("2d").putImageData(e.savedFourier.imageData, 0, 0), B.fourierBackgroundOffset = e.savedFourier.backgroundOffset, B.fourierImageSizeY = e.savedFourier.imageSizeY, B.fourierBlurReady = !0) : Z(!1)
    }, this.removeParams = function(e) {
        e == B.selectedParams && (B.selectedParams = void 0);
        var i = B.paramsList.indexOf(e);
        B.paramsList.splice(i, 1)
    }, this.ifThenElse = function(e, i, t) {
        return e ? i : t
    };

    function me(e) {
        return (e += B.x) < B.maxY ? 22 + e / B.maxY * (B.contentWidth - 202) : e <= 2 * B.maxY ? B.contentWidth - 202 + 22 + (e - B.maxY) / (B.maxY / 100) : B.contentWidth - 60
    }
    this.toPreviewScale = me, this.toPreviewScaleCamera = function(e) {
        return e / B.maxY * (B.contentWidth - 202)
    }, this.toPreviewValue = function(e) {
        return e >= B.contentWidth - 150 ? 1 / 0 : e >= B.contentWidth - 180 ? B.maxY - B.x : B.maxY * (e - 22) / (B.contentWidth - 202) - B.x
    }, this.toPreviewValueCamera = function(e) {
        return B.maxY * (e - 30) / (B.contentWidth - 202)
    }, this.dofWidth = function() {
        return B.farDOF + B.x <= 2 * B.maxY ? me(B.farDOF) - me(B.nearDOF) + 1 : B.farDOF < 1 / 0 ? B.contentWidth - 70 - me(B.nearDOF) : B.contentWidth - 10 - me(B.nearDOF)
    }, this.toPreviewZoomScale = function(e) {
        return Math.minMax(-50, 300, 115 - (B.y0 - e) / 10)
    }, this.toBackgroundZoomValue = function(e) {
        return Math.min(B.maxY, B.y0 + 10 * (e - 115 + 10))
    }, this.dofZoomWidth = function() {
        return B.farDOF == 1 / 0 ? 300 : Math.min(300, (B.farDOF - B.nearDOF) / 10)
    }, this.maxYStyle = function() {
        var e = (B.maxY - B.x) / B.multiplier,
            i = Math.round(e);
        return {
            "margin-left": -1 == B.previewScale.indexOf(i) || e <= i ? -10 : -10 - (e - i) * B.multiplier / B.maxY * (B.contentWidth - 202)
        }
    }, this.previewZoomScalePosition = function() {
        return "metric" == B.units ? -B.y0 / 10 % 200 + 14 : -B.y0 / 10 % 152.41 - 37
    }, this.previewZoomScaleStart = function() {
        return "metric" == B.units ? 2 * Math.floor(B.y0 / 10 / 200) : 5 * Math.floor(B.y0 / 10 / 152.41)
    }, this.chooseBackground = function(e) {
        e != B.background && (B.background = e, J()), o.hideDialog()
    }, this.chooseModel = function(e) {
        e != B.model.key && (B.model = B.modelsList[e], f.changeModel()), o.hideDialog()
    }, this.chooseSensor = function(e) {
        B.format = e, f.changeFormat(), f.trackEvent("FormatChanged", e), o.hideDialog()
    }, this.activateHelp = function() {
        B.helpActive = !B.helpActive, B.helpActive && d.trackEvent("HelpActivated")
    }, this.initTour = r.initTour(B), this.startTour = r.startTour, setTimeout(function() {
        ae(), $("[mb-cloak]").removeAttr("mb-cloak")
    }), window.onerror = void 0
}]), app.controller("CustomCocCtrl", ["$scope", "dialogSvc", "gaSvc", function(i, e, t) {
    var a = i.$parent.$parent.$parent;
    i.customCoc = $.extend(!0, {
        type: "value",
        value: .029,
        lines: 1500,
        resolution: {
            width: 2480
        },
        print: {
            units: "small",
            width: 21,
            dpi: 300
        },
        view: {
            units: "small",
            width: 30,
            distance: 30
        }
    }, a.customCoc), this.lines = {
        value: function() {
            var e = i.sensor.size;
            if (i.customCoc.lines) return Math.sqrt(e.min * e.min + e.max * e.max) / i.customCoc.lines
        }
    }, this.resolution = {
        changeWidth: function() {
            var e = i.customCoc.resolution;
            e.width ? (e.height = e.width / i.sensor.ratio, e.mpix = e.width * e.height / 1e6) : (e.height = void 0, e.mpix = void 0)
        },
        changeHeight: function() {
            var e = i.customCoc.resolution;
            e.height ? (e.width = e.height * i.sensor.ratio, e.mpix = e.width * e.height / 1e6) : (e.width = void 0, e.mpix = void 0)
        },
        changeMpix: function() {
            var e = i.customCoc.resolution;
            e.mpix ? (e.width = Math.sqrt(1e6 * e.mpix * i.sensor.ratio), e.height = Math.sqrt(1e6 * e.mpix / i.sensor.ratio)) : (e.width = void 0, e.height = void 0)
        },
        value: function() {
            if (0 < i.customCoc.resolution.width) return i.sensor.size.max / i.customCoc.resolution.width * 2
        }
    }, this.units = {
        metric: {
            small: {
                unit: "cm",
                multiplier: 1,
                range: {
                    min: .1,
                    max: 1e3
                }
            },
            big: {
                big: !0,
                unit: "m",
                multiplier: 100,
                range: {
                    min: 10,
                    max: 15e3
                }
            }
        },
        imperial: {
            small: {
                unit: "in",
                multiplier: 2.54,
                range: {
                    min: .1,
                    max: 1016
                }
            },
            big: {
                unit: "ft",
                multiplier: 30.48,
                range: {
                    min: .3,
                    max: 15240
                }
            }
        }
    }, this.print = {
        changeWidth: function() {
            var e = i.customCoc.print;
            e.width ? e.height = e.width / i.sensor.ratio : e.height = void 0
        },
        changeHeight: function() {
            var e = i.customCoc.print;
            e.height ? e.width = e.height * i.sensor.ratio : e.width = void 0
        },
        value: function() {
            var e = i.customCoc.print;
            if (0 < e.width && 0 < e.dpi) return i.sensor.size.max / (e.width / 2.54 * e.dpi) * 2
        }
    }, this.view = {
        changeWidth: function() {
            var e = i.customCoc.view;
            e.width ? e.height = e.width / i.sensor.ratio : e.height = void 0
        },
        changeHeight: function() {
            var e = i.customCoc.view;
            e.height ? e.width = e.height * i.sensor.ratio : e.width = void 0
        },
        value: function() {
            var e = i.customCoc.view;
            if (0 < e.width && 0 < e.distance) return i.sensor.size.max / 10 / (e.width / e.distance * 124.138)
        }
    }, this.resolution.changeWidth(), this.print.changeWidth(), this.view.changeWidth(), this.setCustomCoc = function() {
        a.coc = a.cocList.custom, a.customCoc = i.customCoc, e.hideDialog(), a.calculateViewport(), t.trackEvent("CustomCocSet", i.customCoc.type)
    }
}]), Math.minMax = function(e, i, t) {
    return Math.max(e, Math.min(i, t))
}, Math.roundFixed = function(e, i, t) {
    return void 0 !== i && (e = Math.round(e / i) * i, void 0 !== t && (e = +e.toFixed(t))), e
};