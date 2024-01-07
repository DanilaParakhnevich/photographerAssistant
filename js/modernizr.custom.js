/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-canvas-localstorage-webworkers-inlinesvg-prefixes-cookies-css_filters-svg_filters
 */
;
window.Modernizr = function(a, b, c) {
    function v(a) {
        i.cssText = a
    }

    function w(a, b) {
        return v(l.join(a + ";") + (b || ""))
    }

    function x(a, b) {
        return typeof a === b
    }

    function y(a, b) {
        return !!~("" + a).indexOf(b)
    }

    function z(a, b, d) {
        for (var e in a) {
            var f = b[a[e]];
            if (f !== c) return d === !1 ? a[e] : x(f, "function") ? f.bind(d || b) : f
        }
        return !1
    }
    var d = "2.8.3",
        e = {},
        f = b.documentElement,
        g = "modernizr",
        h = b.createElement(g),
        i = h.style,
        j, k = {}.toString,
        l = " -webkit- -moz- -o- -ms- ".split(" "),
        m = {
            svg: "http://www.w3.org/2000/svg"
        },
        n = {},
        o = {},
        p = {},
        q = [],
        r = q.slice,
        s, t = {}.hasOwnProperty,
        u;
    !x(t, "undefined") && !x(t.call, "undefined") ? u = function(a, b) {
        return t.call(a, b)
    } : u = function(a, b) {
        return b in a && x(a.constructor.prototype[b], "undefined")
    }, Function.prototype.bind || (Function.prototype.bind = function(b) {
        var c = this;
        if (typeof c != "function") throw new TypeError;
        var d = r.call(arguments, 1),
            e = function() {
                if (this instanceof e) {
                    var a = function() {};
                    a.prototype = c.prototype;
                    var f = new a,
                        g = c.apply(f, d.concat(r.call(arguments)));
                    return Object(g) === g ? g : f
                }
                return c.apply(b, d.concat(r.call(arguments)))
            };
        return e
    }), n.canvas = function() {
        var a = b.createElement("canvas");
        return !!a.getContext && !!a.getContext("2d")
    }, n.localstorage = function() {
        try {
            return localStorage.setItem(g, g), localStorage.removeItem(g), !0
        } catch (a) {
            return !1
        }
    }, n.webworkers = function() {
        return !!a.Worker
    }, n.inlinesvg = function() {
        var a = b.createElement("div");
        return a.innerHTML = "<svg/>", (a.firstChild && a.firstChild.namespaceURI) == m.svg
    };
    for (var A in n) u(n, A) && (s = A.toLowerCase(), e[s] = n[A](), q.push((e[s] ? "" : "no-") + s));
    return e.addTest = function(a, b) {
        if (typeof a == "object")
            for (var d in a) u(a, d) && e.addTest(d, a[d]);
        else {
            a = a.toLowerCase();
            if (e[a] !== c) return e;
            b = typeof b == "function" ? b() : b, typeof enableClasses != "undefined" && enableClasses && (f.className += " " + (b ? "" : "no-") + a), e[a] = b
        }
        return e
    }, v(""), h = j = null, e._version = d, e._prefixes = l, e
}(this, this.document), Modernizr.addTest("cookies", function() {
    if (navigator.cookieEnabled) return !0;
    document.cookie = "cookietest=1";
    var a = document.cookie.indexOf("cookietest=") != -1;
    return document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT", a
}), Modernizr.addTest("svgfilters", function() {
    var a = !1;
    try {
        a = typeof SVGFEColorMatrixElement !== undefined && SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE == 2
    } catch (b) {}
    return a
}), Modernizr.addTest("cssfilters", function() {
    var a = document.createElement("div");
    return a.style.cssText = Modernizr._prefixes.join("filter:blur(2px); "), !!a.style.length && (document.documentMode === undefined || document.documentMode > 9)
});