"use strict";
var app = angular.module("ui");
app.config(["$locationProvider", function(e) {
    (!$.browser.msie || $.browser.msie && 9 < +$.browser.version.split(".")[0]) && e.html5Mode({
        enabled: !0,
        requireBase: !1
    })
}]), app.directive("mbSlider", ["$document", "$timeout", "infotipSvc", function(V, C, T) {
    var N = 0;
    return {
        require: "ngModel",
        template: "<div tabindex='0' class='slider' style='width:100%'>    <div class='trackWrap'>        <div class='track'>        <div class='dragger' ng-show='isFinite(value)'><div class='dragger-inner'></div></div>    </div>    </div>    <div class='infinity' ng-show='infinity!==null'>        <input id='slider-infinity-{{id}}' type='checkbox' ng-model='infinity' ng-change='onInfinityChange()' ng-disabled='disabled'/>        <label for='slider-infinity-{{id}}'><i class='icon-infinity'></i></label>    </div></div>",
        replace: !0,
        scope: {
            options: "&mbSlider",
            value: "=ngModel",
            onChange: "&",
            disabled: "=ngDisabled"
        },
        compile: function(e, t) {
            return function(l, o, s, r) {
                var u, c, n = 0,
                    i = 0,
                    d = o.children(".trackWrap"),
                    p = d.children(".track"),
                    m = p.children(".dragger"),
                    t = {
                        min: 1,
                        max: 100,
                        multiplier: 1
                    },
                    f = $.extend(t, l.options()),
                    h = l.onChange() || angular.noop,
                    e = f.max;
                if (l.id = N++, s.mbSliderExponent) {
                    var a = +s.mbSliderExponent;
                    u = function(e) {
                        return (Math.pow(a, e) - 1) / (a - 1)
                    }, c = function(e) {
                        return Math.log((a - 1) * e + 1) / Math.log(a)
                    }
                } else u = function(e) {
                    return e
                }, c = function(e) {
                    return e
                };
                l.isFinite = isFinite, s.mbSliderInfinity ? (l.infinity = !isFinite(l.value), l.$watch("value", function() {
                    l.infinity && isFinite(l.value) && (e = l.value), l.infinity = void 0 !== l.value && !isFinite(l.value)
                }), l.onInfinityChange = function() {
                    l.infinity ? (isFinite(l.value) && (e = l.value), l.value = 1 / 0) : l.value = e, C(function() {
                        h(!1)
                    })
                }) : (l.infinity = null, l.onInfinityChange = angular.noop);

                function g(e) {
                    return e > (f.min || Number.MIN_VALUE) && e < (f.max || Number.MAX_VALUE)
                }

                function v(e) {
                    return e < 5 ? .1 : e < 10 ? .2 : e < 20 ? .5 : e < 50 ? 1 : e < 100 ? 2 : e < 200 ? 5 : e < 500 ? 10 : e < 1e3 ? 20 : 50
                }

                function b(e, t) {
                    return t ? Math.roundFixed(e, t, 1) : Math.roundFixed(e, v(e), 1)
                }
                l.$watch("options()", function(e) {
                    f = angular.extend({}, t, e),
                        function() {
                            f.values && (f.values = _.filter(f.values, g), f.labels = _.filter(f.labels, g), void 0 !== f.min && (f.values.unshift(f.min), f.labels.unshift(f.min)), void 0 !== f.max && (f.values.push(f.max), f.labels.push(f.max))), o.find(".scale").remove();
                            var e = $("<div class='scale'></div>");
                            if (d.append(e), f.values) {
                                e.addClass("scale-values"), e.css("padding-right", "0");
                                var t = 100 / (f.values.length + 2);
                                switch (d.css("padding-left", 3 * t / 2 + "%"), e.append("<span style='width:" + 3 * t + "%;'>" + f.labels[0] + "</span>"), f.values.indexOf(f.labels[1])) {
                                    case 3:
                                        e.append("<span style='width:" + 3 * t + "%;'>" + f.labels[1] + "</span>");
                                        break;
                                    case 2:
                                        e.append("<span style='width:" + t + "%;'>" + f.labels[1] + "</span>"), e.append("<span style='width:" + t + "%;'></span>");
                                        break;
                                    case 1:
                                        e.append("<span style='width:" + t + "%;'></span>")
                                }
                                for (var n = 2; n < f.labels.length - 2; n++) e.append("<span style='width:" + 3 * t + "%;'>" + f.labels[n] + "</span>");
                                if (3 < f.labels.length) switch (f.values.length - f.values.indexOf(f.labels[f.labels.length - 2])) {
                                    case 4:
                                        e.append("<span style='width:" + 3 * t + "%;'>" + f.labels[f.labels.length - 2] + "</span>");
                                        break;
                                    case 3:
                                        e.append("<span style='width:" + t + "%;'></span>"), e.append("<span style='width:" + t + "%;'>" + f.labels[f.labels.length - 2] + "</span>");
                                        break;
                                    case 2:
                                        e.append("<span style='width:" + t + "%;'></span>")
                                }
                                2 < f.labels.length && e.append("<span style='width:" + 3 * t + "%;'>" + f.labels[f.labels.length - 1] + "</span>"), d.css("padding-right", 3 * t / 2 + "%")
                            } else {
                                e.addClass("scale-continuous"), s.mbSliderInfinity ? (d.css("padding-right", "50px"), e.css("padding-right", "75px")) : f.unit && 1 < f.unit.length ? (d.css("padding-right", "2.75em"), e.css("padding-right", "4.5em")) : (d.css("padding-right", "1.5em"), e.css("padding-right", "2.75em"));
                                var i = !0 === f.scale ? 10 : f.scale,
                                    a = 100 / (i + 1);
                                e.css("width", 100 + a + "%");
                                f.max, f.min, f.multiplier;
                                e.append("<span style='width:" + a + "%;'>" + Math.roundFixed(f.min / f.multiplier, .1, 1) + "</span>");
                                for (n = 1; n < i; n++) e.append("<span style='width:" + a + "%;'>" + b((f.min + u(n / i) * (f.max - f.min)) / f.multiplier, f.rounding) + "</span>");
                                e.append("<span style='width:" + a + "%'>" + Math.roundFixed(f.max / f.multiplier, .1, 1) + (f.unit || "") + "</span>")
                            }
                        }(), I()
                }, !0);

                function w(e) {
                    if (!angular.isUndefined(e)) {
                        var t;
                        if (f.values) {
                            var n = f.values.indexOf(+e),
                                i = 100 / (f.values.length - 1);
                            if (0 <= n) t = n * i;
                            else if (e < f.values[0]) t = 0;
                            else if (e > f.values[f.values.length - 1]) t = 100;
                            else
                                for (var a = 1; a < f.values.length; a++) f.values[a - 1] < e && f.values[a] > e && (t = i / 2 + (a - .5) * i)
                        } else {
                            var o = Math.minMax(0, e - f.min, f.max - f.min) / (f.max - f.min);
                            t = 100 * c(o)
                        }
                        m.css("left", t + "%")
                    }
                }
                var I = function() {
                    w(r.$modelValue)
                };
                r.$formatters.push(function(e) {
                    return w(e), +e
                }), r.$parsers.push(function(e) {
                    return +e
                });
                var y = function(e, t) {
                        var n = l.value;
                        if (f.values) {
                            var i = 1 / f.values.length * p.width(),
                                a = Math.round((e - i / 2) / i);
                            a < 0 ? a = 0 : a >= f.values.length && (a = f.values.length - 1), n = f.values[a]
                        } else n = (n = u(e / p.width()) * (f.max - f.min) + f.min) < f.min ? f.min : n > f.max ? f.max : b(n, f.valueRound);
                        w(n), l.value != n && l.$apply(function() {
                            r.$setViewValue(n), h(t)
                        })
                    },
                    x = !1;

                function k(e) {
                    e.preventDefault();
                    var t = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX || 0;
                    (x = x || t !== i) && y((i = t) - n, !0)
                }

                function M(e) {
                    V.unbind("mousemove", k), V.unbind("mouseup", M), p.removeClass("dragging"), x && (T.trigger("sliderKeyboardScroll"), y(e.pageX - n, !1))
                }

                function E(e) {
                    o.unbind("touchmove", k), o.unbind("touchend touchcancel", E), p.removeClass("dragging"), x && y(i - n, !1)
                }
                m.on("mousedown touchstart", function(e) {
                    e.preventDefault(), o.focus(), n = p.offset().left, i = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX || 0, x = !1, "touchstart" === e.type ? (o.on("touchmove", k), o.on("touchend touchcancel", E)) : (V.on("mousemove", k), V.on("mouseup", M)), p.addClass("dragging")
                }), p.on("click", function(e) {
                    y(e.pageX - p.offset().left, !1)
                }), l.isActive = function() {
                    return document.activeElement === o[0]
                };

                function S(e, o) {
                    e.preventDefault(), l.$apply(function() {
                        var e = +l.value;
                        if (f.values) {
                            var t = f.values.indexOf(l.value);
                            if (0 <= t) {
                                var n = t + (0 < o ? 1 : -1);
                                0 <= n && n < f.values.length && (e = f.values[n])
                            } else if (e < f.values[0]) e = f.values[0];
                            else if (e > f.values[f.values.length - 1]) e = f.values[f.values.length - 1];
                            else
                                for (var i = 0; i < f.values.length - 1; i++)
                                    if (f.values[i] < e && f.values[i + 1] > e) {
                                        e = 0 < o ? f.values[i + 1] : f.values[i];
                                        break
                                    }
                        } else {
                            var a = (0 < o ? 1 : -1) * (f.valueRound || v(l.value));
                            (e = b(l.value + a, f.valueRound)) < f.min ? e = f.min : e > f.max && (e = s.mbSliderInfinity && 0 < a && (l.value === f.max || l.value === 1 / 0) ? 1 / 0 : f.max)
                        }
                        r.$setViewValue(e), w(e), h(!0), T.cancel("sliderKeyboardScroll")
                    })
                }
                o.on("mousewheel", function(e) {
                    l.isActive() && S(e, e.deltaY)
                }), $([p[0]]).on("mousewheel", function(e) {
                    S(e, e.deltaY)
                }), $(document).on("keydown", function(e) {
                    l.isActive() && ("37" == e.keyCode ? S(e, -1) : "39" == e.keyCode && S(e, 1))
                })
            }
        }
    }
}]), app.directive("mbShowHide", function() {
    return {
        transclude: !0,
        scope: {
            shown: "=mbShowHide",
            enabled: "=enabled"
        },
        template: "<span ng-click='shown = !shown' ng-show='enabled'>    <i class='icon-right-dir' ng-show='enabled && !shown'></i>    <i class='icon-down-dir' ng-show='enabled && shown'></i>    <span ng-transclude=''></span></span><span ng-transclude='' ng-show='!enabled'></span>",
        link: function() {}
    }
}), app.directive("mbMultiplier", function() {
    return {
        priority: -200,
        require: "ngModel",
        link: function(e, t, n, i) {
            var a = e.$eval(n.mbMultiplier);
            i.$formatters.push(function(e) {
                return e ? e / a : e
            }), i.$parsers.push(function(e) {
                return e ? e * a : e
            })
        }
    }
}), app.directive("mbRoundNumber", ["$filter", function(o) {
    return {
        priority: -300,
        require: "ngModel",
        link: function(e, t, n, i) {
            var a = e.$eval(n.mbRoundNumber);
            angular.isDefined(a) && i.$formatters.push(function(e) {
                return null === e || isNaN(e) ? "" : isFinite(e) ? o("number")(e, a).replace(/(\.)0+$/, "") : "∞"
            }), i.$parsers.unshift(function(e) {
                return "∞" === e ? 1 / 0 : e ? +e.toString().replace(/\s/g, "").replace(",", ".") : void 0
            })
        }
    }
}]), app.directive("mbMinMax", function() {
    return {
        priority: -100,
        require: "ngModel",
        link: function(e, t, n, a) {
            var o, l = $.extend({
                min: -1 / 0,
                max: 1 / 0
            }, e.$eval(n.mbMinMax));
            e.$watch(n.mbMinMax, function(e, t) {
                l = $.extend({
                    min: -1 / 0,
                    max: 1 / 0
                }, e), void 0 === a.$modelValue ? a.$setViewValue(a.$viewValue) : i(o)
            }, !0);
            var i = function(e) {
                var t = null != (o = e) && !isNaN(e),
                    n = !t || e >= l.min,
                    i = !t || e <= l.max || e == 1 / 0;
                return a.$setValidity("number", t), a.$setValidity("min", n), a.$setValidity("max", i), t && n && i ? e : void 0
            };
            a.$parsers.push(function(e) {
                return i(e)
            }), a.$formatters.push(function(e) {
                return i(e), e
            })
        }
    }
}), app.directive("mbOnload", function() {
    return {
        link: function(e, t, n, i) {
            t.bind("load", function() {
                e.$apply(n.mbOnload)
            })
        }
    }
}), app.directive("mbOnerror", function() {
    return {
        link: function(e, t, n, i) {
            t.bind("error", function() {
                e.$apply(n.mbOnerror)
            })
        }
    }
}), app.directive("mbXlinkHref", function() {
    return {
        link: function(e, t, n, i) {
            n.$observe("mbXlinkHref", function(e) {
                e && t[0].setAttributeNS("http://www.w3.org/1999/xlink", "href", e)
            })
        }
    }
}), app.directive("mbHelp", function() {
    return {
        compile: function(e, t) {
            return function(t, n, i, e) {
                function a(e) {
                    o.css({
                        left: e.clientX + 16,
                        top: e.clientY + 16
                    })
                }
                var o, l = function() {
                    n.unbind("mousemove", a), n.unbind("mouseleave", l), $(".helpTooltip").remove()
                };
                n.bind("mouseenter", function(e) {
                    t.helpActive && (n.on("mousemove", a), n.on("mouseleave", l), $(".helpTooltip").remove(), o = $("<div class='helpTooltip'><i class='icon-help-circled'></i> " + i.mbHelp + "</div>"), $("body").append(o))
                }), t.$watch("helpActive", function(e) {
                    e ? (n.addClass("helpActive"), n.attr("title", "")) : (n.removeClass("helpActive"), n.attr("title", i.mbHelp))
                })
            }
        }
    }
}), app.filter("infiniteNumber", ["$filter", function(o) {
    return function(e, t, n) {
        if (angular.isUndefined(e) || isNaN(e)) {
            var i = "-";
            if (t) {
                i += ".";
                for (var a = 0; a < t; a++) i += "-"
            }
            return i
        }
        return isFinite(e) ? void 0 === n ? o("number")(e, t) : "imperial" === n ? o("number")(e / .3048, t) + "ft" : o("number")(e, t) + "m" : "∞"
    }
}]), app.filter("mbNumber", ["$filter", function(l) {
    return function(e, t, n, i) {
        if (angular.isUndefined(e) || isNaN(e)) {
            var a = "-";
            if (t) {
                a += ",";
                for (var o = 0; o < t; o++) a += "-"
            }
            return a
        }
        return void 0 !== n && e < n ? "<" + l("number")(n, t) : void 0 !== i && i < e ? ">" + l("number")(i, 0) : l("number")(e, t)
    }
}]), app.filter("maxNumber", ["$filter", function(o) {
    return function(e, t, n) {
        if (angular.isUndefined(e) || isNaN(e)) {
            var i = "-";
            if (t) {
                i += ",";
                for (var a = 0; a < t; a++) i += "-"
            }
            return i
        }
        return void 0 !== n && n < e ? ">" + o("number")(n, 0) : o("number")(e, t)
    }
}]), app.filter("smartNumber", ["$filter", function(e) {
    var i = e("number");
    return function(e, t) {
        if ("imperial" !== t) return angular.isUndefined(e) || isNaN(e) ? "-,--cm" : isFinite(e) ? e < 1e3 ? i(e / 10, 1) + "cm" : i(e / 1e3, 2) + "m" : "∞m";
        if (angular.isUndefined(e) || isNaN(e)) return "-,--ft";
        if (isFinite(e)) {
            var n = Math.floor(e / 304.8);
            return 0 === n ? i((e - 304.8 * n) / 25.4, 1) + "in" : i(e / 304.8, 2) + "ft"
        }
        return "∞ft"
    }
}]), app.directive("mbTooltip", ["$timeout", function(o) {
    return {
        restrict: "E",
        scope: {
            showWhen: "&",
            timeout: "&"
        },
        replace: !0,
        template: "<div class='tooltip ng-animate-enabled' ng-show='showTooltip' ng-click='cancelTooltip()' ng-transclude=''></div>",
        transclude: !0,
        link: function(t, e, n) {
            var i;
            t.showTooltip = !1;
            var a = t.cancelTooltip = function() {
                i && (o.cancel(i), i = void 0), t.showTooltip = !1
            };
            t.$watch("showWhen()", function(e) {
                e ? (t.showTooltip = !0, t.timeout && (i = o(a, t.timeout()))) : a()
            })
        }
    }
}]), app.directive("mbInfotip", ["infotipSvc", function(i) {
    return {
        restrict: "E",
        scope: {
            infotipId: "@",
            infotipActive: "&"
        },
        replace: !0,
        template: "<div class='tooltip' ng-show='infotip.show' ng-click='dismissInfotip()'>  <span class='info'>    <i class='icon-lightbulb icon-2x pull-left'></i>    <span ng-transclude=''></span>  </span></div>",
        transclude: !0,
        link: function(t, e, n) {
            t.infotip = i.infotips[t.infotipId], t.infotip.show && (t.infotip.timestamp = new Date), t.dismissInfotip = function() {
                i.dismiss(t.infotipId)
            }, t.$watch("infotipActive()", function(e) {
                !1 === e && i.cancel(t.infotipId)
            })
        }
    }
}]), app.directive("mbPosition", ["$document", function(v) {
    return {
        require: "ngModel",
        scope: {
            config: "&mbPosition",
            min: "&",
            max: "&",
            valueRound: "&",
            onChange: "&",
            slow: "&"
        },
        link: function(a, o, e, l) {
            var t = a.config(),
                s = t.pos2val,
                n = t.val2pos,
                r = a.onChange() || angular.noop;
            o.css("cursor", "e-resize"), a.$watch(function() {
                return n(l.$modelValue)
            }, function(e) {
                o.css("left", e)
            });
            var i = function(e, t) {
                    var n = Math.minMax(a.min() || 0, a.max() || 1 / 0, s(e + o.width() / 2)),
                        i = a.valueRound();
                    i && (n = Math.round(n / i) * i), n !== l.$modelValue && a.$apply(function() {
                        l.$setViewValue(n), r(t)
                    })
                },
                u = 0,
                c = 0,
                d = 0,
                p = !1,
                m = 1;

            function f(e) {
                e.preventDefault(), e.stopPropagation();
                var t = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX || 0;
                (p = p || t !== d) && i(c + ((d = t) - c) / m - u, !0)
            }

            function h(e) {
                e.stopPropagation(), v.unbind("mousemove", f), v.unbind("mouseup", h), p && i(c + (d - c) / m - u, !1)
            }

            function g(e) {
                e.stopPropagation(), o.unbind("touchmove", f), o.unbind("touchend touchcancel", g), p && i(c + (d - c) / m - u, !1)
            }
            o.on("mousedown touchstart", function(e) {
                e.preventDefault(), e.stopPropagation(), c = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX || 0, u = (d = c) - $(this).offset().left + o.parent().offset().left, p = !1, "touchstart" === e.type ? (m = a.slow() ? 5 : 3, o.on("touchmove", f), o.on("touchend touchcancel", g)) : (m = a.slow() ? 3 : 1, v.on("mousemove", f), v.on("mouseup", h))
            })
        }
    }
}]), app.directive("mbSortable", function() {
    return {
        scope: {
            array: "=mbSortable"
        },
        controller: ["$scope", function(t) {
            var a, o, l = this;
            this.watch = {}, this.sortArray = function(n, i) {
                for (var e in a = n, o = i, l.watch) l.watch[e](n === e ? i : 0);
                t.array.sort(function(e, t) {
                    return e[n] === t[n] ? 0 : e[n] < t[n] ? i : -i
                })
            }, t.$watch("array.length", function(e, t) {
                t < e && l.sortArray(a, o)
            })
        }]
    }
}), app.directive("mbSort", function() {
    return {
        scope: {},
        require: "^mbSortable",
        transclude: !0,
        template: "<span ng-click='sortClick()'><span ng-transclude=''/>&nbsp;<span class='sort-icon'><i class='icon-sort'/><i class='icon-sort-up' ng-show='sort==-1'/><i class='icon-sort-down' ng-show='sort==1'/></span></span>",
        link: function(t, e, n, i) {
            t.sort = 0, t.sortClick = function() {
                t.sort = -1 === t.sort ? 1 : -1, i.sortArray(n.mbSort, t.sort)
            }, i.watch[n.mbSort] = function(e) {
                t.sort = e
            }
        }
    }
}), app.directive("mbClick", function() {
    return {
        link: function(t, e, n) {
            var i, a = !1;
            e.on("mousedown touchstart", function(e) {
                i = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX || 0, a = !1
            }), e.on("mousemove touchmove", function(e) {
                var t = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX || 0;
                a = a || t !== i
            }), e.on("mouseup touchend touchcancel", function(e) {
                a || t.$apply(n.mbClick)
            })
        }
    }
}), app.directive("mbStickyScroll", function() {
    return {
        link: function(a, o, l) {
            var s = $(document),
                r = $(window),
                u = $(l.mbStickyScroll),
                c = 0,
                d = 0;
            $(document).on("scroll resize", function() {
                if (a.$eval(l.mbStickyScrollDisabled)) o.css("margin-top", 0), d = c = 0;
                else {
                    var e = s.scrollTop(),
                        t = Math.min(0, r.height() - o.innerHeight()),
                        n = Math.max(0, u.outerHeight() - o.innerHeight()),
                        i = Math.max(0, e - u.offset().top);
                    d = Math.minMax(t, 0, d + c - e), o.css("margin-top", Math.minMax(0, n, i + d)), c = e
                }
            })
        }
    }
}), app.directive("mbValidationMessages", ["$compile", function(l) {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(e, t, n, i) {
            var a = e.$new(!0);
            a.modelCtrl = i;
            var o = l("<div class='validationMessages' ng-messages='modelCtrl.$error'>  <span ng-message='min'>Value is too small</span>  <span ng-message='max'>Value is too big</span>  <span ng-message='number'>Invalid value</span></div>")(a);
            t.after(o), i.$formatters.push(function(e) {
                return i.$setPristine(), e
            })
        }
    }
}]), app.directive("mbShow", ["$animate", function(o) {
    return {
        link: function(n, i, a) {
            n.$watch(a.mbShow, function(e, t) {
                e ? o.removeClass(i, "ng-hide").then(function() {
                    n.$apply(a.mbAfterShow)
                }) : o.addClass(i, "ng-hide").then(function() {
                    n.$apply(a.mbAfterHide)
                })
            })
        }
    }
}]), app.directive("mbSelect", ["$timeout", "$parse", "browserSvc", function(v, b, e) {
    return {
        restrict: "E",
        require: "ngModel",
        scope: {
            selectItems: "=",
            disabled: "&?ngDisabled",
            placeholder: "@?",
            defaultItem: "@?",
            emptyItem: "@?",
            itemLabel: "@",
            itemValue: "@",
            searchEnabled: "@?",
            groupBy: "@?",
            trackBy: "@?"
        },
        template: function() {
            return e.isMobile ? "<select ng-model='selectedItem'  ng-options='item as getItemLabel(item) group by getGroupBy(item) for item in selectItems track by getTrackBy(item)'  ng-disabled='disabled()'  ng-change='selectItemMobile()'>    <option ng-if='defaultItem || selectedItem === undefined' value=''>{{defaultItem}}</option></select>" : "<div class='mb-select'>\t<button type='button' class='select-toggle' ng-class=\"{'select-toggle-expanded': dropdownExpanded}\"       ng-show='!dropdownExpanded || !selectItems.length || !searchEnabled'\t\tng-keydown='buttonKeydown($event)' ng-click='toggleExpanded()' ng-disabled='disabled()'>\t\t<span class='select-placeholder' ng-show='!selectedItem && (selectItems.length || !emptyItem)'>{{placeholder || defaultItem}}</span>\t\t<span class='select-answer' ng-show='selectedItem'>{{getItemLabel(selectedItem)}}</span>\t\t<i class='select-caret icon-down-open'></i>\t</button>\t<input type='text' class='select-search' ng-model='search'\t\tng-show='dropdownExpanded' ng-class=\"{'hidden-search-input': !searchEnabled || !selectItems.length}\"\t\tng-change='updateSearch()' ng-blur='searchInputBlur($event)' ng-keydown='inputKeydown($event)'/>\t<div class='select-dropdown' ng-if='dropdownExpanded'>\t\t<a href='javascript:void(0)' tabindex='-1' class='dropdown-item' ng-show='defaultItem'\t\t\tng-mouseenter='hoverItem()' ng-click='selectItem()'\t\t\tng-class=\"{'item-selected': selectedItem === undefined, 'item-highlighted': highlightedItem === undefined}\">{{defaultItem}}</a>\t\t<div class='dropdown-group' ng-repeat='group in itemsGroups track by group.label'>\t\t\t<span class='dropdown-group-header' ng-show='group.label'>{{group.label}}</span>\t\t\t<a href='javascript:void(0)' tabindex='-1' class='dropdown-item' ng-repeat='item in group.items track by getTrackBy(item)' \t\t\t\tng-mouseenter='hoverItem(item)' ng-click='selectItem(item)'\t\t\t\tng-class=\"{'item-selected': item === selectedItem, 'item-highlighted': item === highlightedItem}\">{{getItemLabel(item)}}</a>\t\t</div>\t\t<span class='dropdown-item dropdown-empty-item' ng-show='emptyItem && !selectItems.length'>{{emptyItem}}</span>\t</div></div>"
        },
        link: function(a, n, e, t) {
            var o = [];
            if (a.dropdownExpanded = !1, a.search = "", a.itemsGroups = [], a.highlightedItem = void 0, a.selectedItem = void 0, a.itemLabel) {
                var i = b(a.itemLabel);
                a.getItemLabel = function(e) {
                    return e && i(a.$parent, {
                        item: e
                    })
                }
            } else a.getItemLabel = function(e) {
                return e
            };
            if (a.itemValue) {
                var l = b(a.itemValue);
                a.getItemValue = function(e) {
                    return e && l(a.$parent, {
                        item: e
                    })
                }
            } else a.getItemValue = function(e) {
                return e
            };
            if (a.groupBy) {
                var s = b(a.groupBy);
                a.getGroupBy = function(e) {
                    return e && s(a.$parent, {
                        item: e
                    }) || ""
                }
            } else a.getGroupBy = function(e) {};
            if (a.trackBy) {
                var r = b(a.trackBy);
                a.getTrackBy = function(e) {
                    return e && r(a.$parent, {
                        item: e
                    }) || ""
                }
            } else a.getTrackBy = function(e) {
                return a.getItemLabel(e)
            };

            function u() {
                if (o = a.selectItems || [], a.search) {
                    var n = a.search.toLowerCase();
                    o = _.filter(o, function(e) {
                        var t = a.getItemLabel(e);
                        return t && 0 <= t.toLowerCase().indexOf(n)
                    })
                }
                if (a.groupBy) {
                    var e = {
                            label: "",
                            items: []
                        },
                        i = {
                            "": e
                        };
                    a.itemsGroups = [e], _.foreach(o, function(e) {
                        var t = a.getGroupBy(e);
                        if (!i[t]) {
                            var n = i[t] = {
                                label: t,
                                items: []
                            };
                            a.itemsGroups.push(n)
                        }
                        i[t].items.push(e)
                    })
                } else a.itemsGroups = [{
                    label: "",
                    items: o
                }]
            }
            a.$watchCollection("selectItems", function() {
                u(), f()
            }), t.$render = function() {
                a.itemValue ? a.selectedItem = _.find(a.selectItems, function(e) {
                    return a.getItemValue(e) === t.$modelValue
                }) : a.selectedItem = t.$modelValue
            }, a.toggleExpanded = function() {
                (a.dropdownExpanded ? d : c)()
            };
            var c = function() {
                    a.search = "", u(), a.dropdownExpanded = !0, f(), setTimeout(function() {
                        var e = n.find("input.select-search")[0];
                        e && e.focus()
                    })
                },
                d = function() {
                    a.dropdownExpanded = !1, setTimeout(function() {
                        var e = n.find(".select-toggle")[0];
                        e && e.focus()
                    })
                };
            a.updateSearch = function() {
                u(), a.highlightedItem = o[0], h()
            }, a.searchInputBlur = function(e) {
                var t = e.relatedTarget || e.explicitOriginalTarget || e.toElement;
                t ? p(t) : v(function() {
                    p(window.document.activeElement)
                })
            }, a.buttonKeydown = function(e) {
                var t = e.keyCode || e.charCode;
                if (13 === t) c(), e.preventDefault();
                else if (38 === t) {
                    0 < (n = o.indexOf(a.selectedItem)) ? a.selectItem(o[n - 1]) : a.defaultItem && a.selectItem(void 0), e.preventDefault()
                } else if (40 === t) {
                    var n;
                    if (a.selectedItem)(n = o.indexOf(a.selectedItem)) + 1 < o.length && a.selectItem(o[n + 1]);
                    else a.selectItem(o[0]);
                    e.preventDefault()
                }
            }, a.inputKeydown = function(e) {
                var t = e.keyCode || e.charCode;
                if (27 === t) d();
                else if (13 === t) void 0 === a.highlightedItem && !a.defaultItem || (a.highlightedItem !== a.selectedItem ? a.selectItem(a.highlightedItem) : d());
                else if (38 === t) {
                    var n = o.indexOf(a.highlightedItem);
                    a.highlightedItem = 0 < n ? o[n - 1] : a.defaultItem ? void 0 : o[0], h()
                } else if (40 === t) {
                    if (a.highlightedItem) {
                        n = o.indexOf(a.highlightedItem);
                        a.highlightedItem = o[Math.min(n + 1, o.length - 1)]
                    } else a.highlightedItem = o[0];
                    h()
                }
            };
            var p = function(e) {
                    m(e, n[0]) || d()
                },
                m = function(e, t) {
                    return !!e && (e === t || m(e.parentNode, t))
                };
            a.hoverItem = function(e) {
                a.highlightedItem = e
            }, a.selectItem = function(e) {
                a.selectedItem = e, a.selectItemMobile(), d()
            }, a.selectItemMobile = function() {
                var e = a.getItemValue(a.selectedItem);
                t.$setViewValue(e)
            };
            var f = function() {
                    a.selectedItem && -1 !== o.indexOf(a.selectedItem) || a.defaultItem ? (a.highlightedItem = a.selectedItem, g()) : (a.highlightedItem && -1 !== o.indexOf(a.highlightedItem) || (a.highlightedItem = o[0]), h())
                },
                h = function() {
                    setTimeout(function() {
                        var e = n.find(".select-dropdown")[0],
                            t = n.find(".item-highlighted")[0];
                        t && (t.offsetTop < e.scrollTop ? e.scrollTop = t.offsetTop : t.offsetTop + t.offsetHeight > e.scrollTop + e.offsetHeight && (e.scrollTop = t.offsetTop + t.offsetHeight - e.offsetHeight))
                    })
                },
                g = function() {
                    setTimeout(function() {
                        var e = n.find(".select-dropdown")[0],
                            t = n.find(".item-selected")[0];
                        t && (e.scrollTop = t.offsetTop + t.offsetHeight / 2 - e.offsetHeight / 2)
                    })
                }
        }
    }
}]);