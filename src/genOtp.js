function getImpl(e) {
  ;(function(t) {
    "use strict"

    function s(t, s) {
      for (var h = 0; h < s.length; h++) {
        var n = s[h]
        ;(n.enumerable = n.enumerable || !1),
          (n.configurable = !0),
          "value" in n && (n.writable = !0),
          Object.defineProperty(t, n.key, n)
      }
    }
    Object.defineProperty(t, "__esModule", {
      value: !0,
    }),
      (t.default = void 0)
    var h = (function() {
      function t() {
        var s =
            0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "",
          h =
            1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0,
          n =
            2 < arguments.length && void 0 !== arguments[2]
              ? arguments[2]
              : "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        !(function(s, h) {
          if (!(s instanceof t))
            throw new TypeError("Cannot call a class as a function")
        })(this)
        var l,
          u,
          p = ""
        ;(this.escapeRegExp = function(t) {
          return t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
        }),
          (this.parseInt = function(t, s) {
            return /^(-|\+)?([0-9]+|Infinity)$/.test(t) ? parseInt(t, s) : NaN
          }),
          (this.seps = "cfhistuCFHISTU"),
          (this.minLength = 0 < parseInt(h, 10) ? h : 0),
          (this.salt = "string" == typeof s ? s : ""),
          "string" == typeof n && (this.alphabet = n)
        for (var o = 0; o !== this.alphabet.length; o++)
          -1 === p.indexOf(this.alphabet.charAt(o)) &&
            (p += this.alphabet.charAt(o))
        if (((this.alphabet = p), this.alphabet.length < 16))
          throw "error: alphabet must contain at least X unique characters".replace(
            "X",
            16
          )
        if (-1 !== this.alphabet.search(" "))
          throw "error: alphabet cannot contain spaces"
        for (var f = 0; f !== this.seps.length; f++) {
          var c = this.alphabet.indexOf(this.seps.charAt(f))
          ;-1 === c
            ? (this.seps =
                this.seps.substr(0, f) + " " + this.seps.substr(f + 1))
            : (this.alphabet =
                this.alphabet.substr(0, c) + " " + this.alphabet.substr(c + 1))
        }
        ;(this.alphabet = this.alphabet.replace(/ /g, "")),
          (this.seps = this.seps.replace(/ /g, "")),
          (this.seps = this._shuffle(this.seps, this.salt)),
          (!this.seps.length ||
            3.5 < this.alphabet.length / this.seps.length) &&
            (l = Math.ceil(this.alphabet.length / 3.5)) > this.seps.length &&
            ((u = l - this.seps.length),
            (this.seps += this.alphabet.substr(0, u)),
            (this.alphabet = this.alphabet.substr(u))),
          (this.alphabet = this._shuffle(this.alphabet, this.salt))
        var b = Math.ceil(this.alphabet.length / 12)
        this.alphabet.length < 3
          ? ((this.guards = this.seps.substr(0, b)),
            (this.seps = this.seps.substr(b)))
          : ((this.guards = this.alphabet.substr(0, b)),
            (this.alphabet = this.alphabet.substr(b)))
      }
      var h, n
      return (
        (h = t),
        (n = [
          {
            key: "encode",
            value: function() {
              for (
                var t = arguments.length, s = new Array(t), h = 0;
                h < t;
                h++
              )
                s[h] = arguments[h]
              if (!s.length) return ""
              if (s[0] && s[0].constructor === Array && !(s = s[0]).length)
                return ""
              for (var n = 0; n !== s.length; n++)
                if (((s[n] = this.parseInt(s[n], 10)), !(0 <= s[n]))) return ""
              return this._encode(s)
            },
          },
          {
            key: "decode",
            value: function(t) {
              return t && t.length && "string" == typeof t
                ? this._decode(t, this.alphabet)
                : []
            },
          },
          {
            key: "encodeHex",
            value: function(t) {
              if (((t = t.toString()), !/^[0-9a-fA-F]+$/.test(t))) return ""
              for (var s = t.match(/[\w\W]{1,12}/g), h = 0; h !== s.length; h++)
                s[h] = parseInt("1" + s[h], 16)
              return this.encode.apply(this, s)
            },
          },
          {
            key: "decodeHex",
            value: function(t) {
              for (var s = [], h = this.decode(t), n = 0; n !== h.length; n++)
                s += h[n].toString(16).substr(1)
              return s
            },
          },
          {
            key: "_encode",
            value: function(t) {
              for (var s, h = this.alphabet, n = 0, l = 0; l !== t.length; l++)
                n += t[l] % (l + 100)
              for (
                var u = (s = h.charAt(n % h.length)), p = 0;
                p !== t.length;
                p++
              ) {
                var o = t[p],
                  f = u + this.salt + h
                h = this._shuffle(h, f.substr(0, h.length))
                var c = this._toAlphabet(o, h)
                if (((s += c), p + 1 < t.length)) {
                  var b = (o %= c.charCodeAt(0) + p) % this.seps.length
                  s += this.seps.charAt(b)
                }
              }
              if (s.length < this.minLength) {
                var v = (n + s[0].charCodeAt(0)) % this.guards.length,
                  y = this.guards[v]
                ;(s = y + s).length < this.minLength &&
                  ((v = (n + s[2].charCodeAt(0)) % this.guards.length),
                  (s += y = this.guards[v]))
              }
              for (
                var A = parseInt(h.length / 2, 10);
                s.length < this.minLength;

              ) {
                var _ =
                  (s = (h = this._shuffle(h, h)).substr(A) + s + h.substr(0, A))
                    .length - this.minLength
                0 < _ && (s = s.substr(_ / 2, this.minLength))
              }
              return s
            },
          },
          {
            key: "_decode",
            value: function(t, s) {
              var h = [],
                n = 0,
                l = new RegExp(
                  "[".concat(this.escapeRegExp(this.guards), "]"),
                  "g"
                ),
                u = t.replace(l, " "),
                p = u.split(" ")
              if (
                ((3 !== p.length && 2 !== p.length) || (n = 1),
                void 0 !== (u = p[n])[0])
              ) {
                var o = u[0]
                ;(u = u.substr(1)),
                  (l = new RegExp(
                    "[".concat(this.escapeRegExp(this.seps), "]"),
                    "g"
                  )),
                  (p = (u = u.replace(l, " ")).split(" "))
                for (var f = 0; f !== p.length; f++) {
                  var c = p[f],
                    b = o + this.salt + s
                  ;(s = this._shuffle(s, b.substr(0, s.length))),
                    h.push(this._fromAlphabet(c, s))
                }
                this.encode(h) !== t && (h = [])
              }
              return h
            },
          },
          {
            key: "_shuffle",
            value: function(t, s) {
              var h
              if (!s.length) return t
              for (
                var n = (t = t.split("")).length - 1, l = 0, u = 0, p = 0;
                0 < n;
                n--, l++
              ) {
                ;(l %= s.length), (u += h = s.charCodeAt(l))
                var o = t[(p = (h + l + u) % n)]
                ;(t[p] = t[n]), (t[n] = o)
              }
              return t.join("")
            },
          },
          {
            key: "_toAlphabet",
            value: function(t, s) {
              for (
                var h = "";
                (h = s.charAt(t % s.length) + h),
                  (t = parseInt(t / s.length, 10));

              );
              return h
            },
          },
          {
            key: "_fromAlphabet",
            value: function(t, s) {
              return t
                .split("")
                .map(function(t) {
                  return s.indexOf(t)
                })
                .reduce(function(t, h) {
                  return t * s.length + h
                }, 0)
            },
          },
        ]) && s(h.prototype, n),
        t
      )
    })()
    t.default = h
  })(e)
}

const e = {}
getImpl(e)

export default function getOtp(time, uid) {
  return new e.default(
    "+DP;=SW`DGX&n|]OGoGkj/4XqPw?^Fclc2F-_V~D=rquG+L(kW_xzVR=slp+Yj;B",
    30
  ).encode(
    parseInt(time),
    parseInt(uid ? uid : 0),
    Math.floor(1e5 + 9e5 * Math.random())
  )
}
