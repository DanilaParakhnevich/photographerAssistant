(function() {
    "use strict";
    var r;
    r = "undefined" != typeof exports ? exports : this.FFT = {};
    var f = "0.3.0",
        t = "2013-03";
    r.toString = function() {
        return "version " + f + ", released " + t
    };
    for (var y = 0, F = null, g = null, s = {
            init: function(r) {
                if (0 === r || 0 != (r & r - 1)) throw new Error("init: radix-2 required");
                y = r, s._initArray(), s._makeBitReversalTable(), s._makeCosSinTable()
            },
            fft1d: function(r, f) {
                s.fft(r, f, 1)
            },
            ifft1d: function(r, f) {
                var t = 1 / y;
                s.fft(r, f, -1);
                for (var n = 0; n < y; n++) r[n] *= t, f[n] *= t
            },
            fft2d: function(r, f) {
                for (var t = [], n = [], i = 0, o = 0; o < y; o++) {
                    i = o * y;
                    for (var a = 0; a < y; a++) t[a] = r[a + i], n[a] = f[a + i];
                    s.fft1d(t, n);
                    for (var e = 0; e < y; e++) r[e + i] = t[e], f[e + i] = n[e]
                }
                for (var v = 0; v < y; v++) {
                    for (var d = 0; d < y; d++) i = v + d * y, t[d] = r[i], n[d] = f[i];
                    s.fft1d(t, n);
                    for (var u = 0; u < y; u++) r[i = v + u * y] = t[u], f[i] = n[u]
                }
            },
            ifft2d: function(r, f) {
                for (var t = [], n = [], i = 0, o = 0; o < y; o++) {
                    i = o * y;
                    for (var a = 0; a < y; a++) t[a] = r[a + i], n[a] = f[a + i];
                    s.ifft1d(t, n);
                    for (var e = 0; e < y; e++) r[e + i] = t[e], f[e + i] = n[e]
                }
                for (var v = 0; v < y; v++) {
                    for (var d = 0; d < y; d++) i = v + d * y, t[d] = r[i], n[d] = f[i];
                    s.ifft1d(t, n);
                    for (var u = 0; u < y; u++) r[i = v + u * y] = t[u], f[i] = n[u]
                }
            },
            fft: function(r, f, t) {
                for (var n, i, o, a, e, v, d, u, s, c = y >> 2, l = 0; l < y; l++) l < (a = F[l]) && (e = r[l], r[l] = r[a], r[a] = e, e = f[l], f[l] = f[a], f[a] = e);
                for (var h = 1; h < y; h <<= 1) {
                    n = y / (h << 1);
                    for (var w = i = 0; w < h; w++) {
                        v = g[i + c], d = t * g[i];
                        for (var p = w; p < y; p += h << 1) u = v * r[o = p + h] + d * f[o], s = v * f[o] - d * r[o], r[o] = r[p] - u, r[p] += u, f[o] = f[p] - s, f[p] += s;
                        i += n
                    }
                }
            },
            _initArray: function() {
                F = "undefined" != typeof Uint32Array ? new Uint32Array(y) : [], g = "undefined" != typeof Float64Array ? new Float64Array(1.25 * y) : []
            },
            _paddingZero: function() {},
            _makeBitReversalTable: function() {
                var r = 0,
                    f = 0,
                    t = 0;
                for (F[0] = 0; ++r < y;) {
                    for (t = y >> 1; t <= f;) f -= t, t >>= 1;
                    f += t, F[r] = f
                }
            },
            _makeCosSinTable: function() {
                var r = y >> 1,
                    f = y >> 2,
                    t = y >> 3,
                    n = r + f,
                    i = Math.sin(Math.PI / y),
                    o = 2 * i * i,
                    a = Math.sqrt(o * (2 - o)),
                    e = g[f] = 1,
                    v = g[0] = 0;
                i = 2 * o;
                for (var d = 1; d < t; d++) o += i * (e -= o), a -= i * (v += a), g[d] = v, g[f - d] = e;
                0 != t && (g[t] = Math.sqrt(.5));
                for (var u = 0; u < f; u++) g[r - u] = g[u];
                for (var s = 0; s < n; s++) g[s + r] = -g[s]
            }
        }, n = ["init", "fft1d", "ifft1d", "fft2d", "ifft2d"], i = 0; i < n.length; i++) r[n[i]] = s[n[i]];
    r.fft = s.fft1d, r.ifft = s.ifft1d
}).call(this),
    function() {
        var r;
        r = "undefined" != typeof exports ? exports : this.FrequencyFilter = {};
        for (var c = 0, f = {
                init: function(r) {
                    if (0 === r || 0 != (r & r - 1)) throw new Error("init: radix-2 required");
                    c = r
                },
                swap: function(r, f) {
                    for (var t, n, i, o, a, e, v, d = c >> 1, u = 0; u < d; u++) {
                        n = u + d;
                        for (var s = 0; s < d; s++) o = (t = s + d) + n * c, a = s + n * c, e = t + u * c, v = r[i = s + u * c], r[i] = r[o], r[o] = v, v = r[a], r[a] = r[e], r[e] = v, v = f[i], f[i] = f[o], f[o] = v, v = f[a], f[a] = f[e], f[e] = v
                    }
                },
                windowing: function(r, f) {
                    for (var t = r.length, n = Math.PI, i = Math.cos, o = 0; o < t; o++) 1 === f ? r[o] *= .54 - .46 * i(2 * n * o / (t - 1)) : r[o] /= .54 - .46 * i(2 * n * o / (t - 1))
                }
            }, t = ["init", "swap", "HPF", "LPF", "BPF", "windowing"], n = 0; n < t.length; n++) r[t[n]] = f[t[n]]
    }.call(this);