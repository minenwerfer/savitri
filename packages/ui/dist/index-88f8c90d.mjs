import { defineComponent as W, openBlock as d, createElementBlock as b, normalizeClass as x, renderSlot as j, inject as le, unref as y, createElementVNode as C, mergeProps as q, createCommentVNode as I, computed as Z, ref as X, watch as Oe, resolveDirective as ae, withDirectives as se, toDisplayString as M, createBlock as D, withCtx as A, useCssVars as qs, Teleport as Kn, Fragment as re, renderList as ee, createTextVNode as oe, createVNode as F, withModifiers as Xn, normalizeStyle as Xe, pushScopeId as nn, popScopeId as sn, vModelCheckbox as Ws, normalizeProps as ue, guardReactiveProps as Fe, createSlots as Te, vModelDynamic as Ys, provide as _e, onMounted as Zs, nextTick as Gs, onBeforeMount as Ks, resolveDynamicComponent as Ce, isRef as Qn, withAsyncContext as on, onUnmounted as Xs, resolveComponent as Qs, Suspense as xs, useSlots as eo } from "vue";
import { useStore as he, useClipboard as to, useParentStore as Ae, PAGINATION_PER_PAGE_DEFAULTS as no, SV_API_URL as so, useCondition as xn, useDebounce as xt, insertReady as oo, useRouter as rn, useAction as ro, bootstrapRoutes as io, usePasswordPolicy as lo } from "@savitri/web";
const ao = /* @__PURE__ */ W({
  __name: "sv-bare-button",
  props: {
    disabled: { type: Boolean }
  },
  emits: ["click"],
  setup(t, { emit: e }) {
    const s = t, n = (o) => {
      o.stopPropagation(), o.preventDefault(), s.disabled || e("click", o);
    };
    return (o, i) => (d(), b("button", {
      class: x(`
      barebutton
      barebutton--${o.disabled ? "disabled" : "enabled"}
    `),
      onClick: n
    }, [
      j(o.$slots, "default", {}, void 0, !0)
    ], 2));
  }
});
const Q = (t, e) => {
  const s = t.__vccOpts || t;
  for (const [n, o] of e)
    s[n] = o;
  return s;
}, je = /* @__PURE__ */ Q(ao, [["__scopeId", "data-v-531668fd"]]), uo = ["href"], co = {
  key: 0,
  "data-component": "icon-label"
}, fo = /* @__PURE__ */ W({
  __name: "sv-icon",
  props: {
    name: {},
    variant: { default: "line" },
    size: {},
    small: { type: Boolean },
    medium: { type: Boolean },
    alt: { type: Boolean },
    reactive: { type: [Boolean, null], default: null },
    iconRight: { type: Boolean },
    fill: {}
  },
  setup(t) {
    const e = t, s = (() => {
      switch (!0) {
        case e.small:
          return "small";
        case e.medium:
          return "medium";
      }
      return le("iconSize", e.size) || "medium";
    })(), n = typeof e.reactive == "boolean" ? e.reactive : le("iconReactive", !1);
    return (o, i) => (d(), b("a", {
      class: x(`
      icon
      ${y(n) && "icon--reactive"}
      ${o.alt && "icon--alt"}
      ${o.$slots.default && "icon--centered"}
  `)
    }, [
      C("div", {
        class: x(`
      icon__icon
      ${y(s) && `icon__icon--${y(s)}`}
      ${o.iconRight && "icon__icon--right"}
      ${o.small ? "icon__icon--small" : "icon__icon--medium"}
    `)
      }, [
        (d(), b("svg", q({
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          "data-component": "icon"
        }, {
          ...o.fill ? { fill: o.fill } : {}
        }), [
          C("use", {
            href: `/assets/icons.svg#${o.variant}:${o.name}`
          }, null, 8, uo)
        ], 16))
      ], 2),
      o.$slots.default ? (d(), b("div", co, [
        j(o.$slots, "default", {}, void 0, !0)
      ])) : I("", !0)
    ], 2));
  }
});
const te = /* @__PURE__ */ Q(fo, [["__scopeId", "data-v-9142aee5"]]), po = { class: "box__header-left" }, ho = { key: 1 }, mo = {
  key: 2,
  style: { "margin-left": "auto" }
}, yo = /* @__PURE__ */ W({
  __name: "sv-box",
  props: {
    closeHint: { type: Boolean, default: !1 },
    modelValue: { default: !0 },
    title: {},
    float: { type: Boolean },
    fixedRight: { type: Boolean },
    floating: { type: Boolean },
    overlay: { type: Boolean },
    invisibleOverlay: { type: Boolean },
    collapsed: { type: Boolean },
    collapsible: { type: Boolean, default: !1 },
    fullWidth: { type: Boolean },
    fill: { type: Boolean },
    transparent: { type: Boolean },
    transparentMobile: { type: Boolean },
    outerHeader: { type: Boolean }
  },
  emits: ["update:modelValue", "update:collapsed", "update:closeHint", "overlayClick", "close"],
  setup(t, { emit: e }) {
    const s = t, n = Z(() => s.floating || s.float), o = X(s.collapsed), i = X(), a = X(!0), u = () => {
      const { value: l } = i;
      a.value = l ? l.scrollTop + l.offsetHeight >= l.scrollHeight : !0;
    };
    Oe(() => i.value, (l) => {
      l && new ResizeObserver(u).observe(l);
    });
    const r = () => {
      e("update:modelValue", !1), e("close");
    }, h = () => {
      e("overlayClick");
    }, c = (l) => {
      e("update:collapsed", l), o.value = l;
    };
    return (l, p) => {
      const v = ae("clickable"), w = ae("overlay");
      return l.modelValue ? se((d(), b("div", {
        key: 0,
        class: x(`
      box
      ${n.value && "box--floating"}
      ${l.fixedRight && "box--fixed"}
  `)
      }, [
        C("div", {
          "data-component": "box",
          class: x(`
        sv-surface
        box__content
        ${!(n.value || l.fixedRight) && "box__content--bordered"}
        ${n.value && "box__content--floating"}
        ${l.fixedRight && "box__content--fixed-right"}
        ${l.transparent && "box__content--transparent"}
        ${l.transparentMobile && "box__content--transparent-mobile"}
        ${l.outerHeader && "box__content--outer-header"}
      `),
          onClick: p[1] || (p[1] = (S) => S.stopPropagation())
        }, [
          l.$slots.header || l.title ? (d(), b("div", {
            key: 0,
            class: x(`
          box__header
          ${o.value && "box__header--collapsed"}
          ${l.outerHeader && "box__header--outer"}
      `)
          }, [
            C("div", po, [
              l.$slots.header ? j(l.$slots, "header", { key: 0 }, void 0, !0) : l.title ? (d(), b("div", ho, M(l.title), 1)) : I("", !0),
              l.$slots.extra ? (d(), b("div", mo, [
                j(l.$slots, "extra", {}, void 0, !0)
              ])) : I("", !0)
            ]),
            l.collapsible ? se((d(), D(te, {
              key: 0,
              reactive: "",
              name: o.value ? "plus" : "minus",
              onClick: p[0] || (p[0] = (S) => c(!o.value))
            }, null, 8, ["name"])), [
              [v]
            ]) : l.closeHint ? se((d(), D(te, {
              key: 1,
              reactive: "",
              name: "multiply",
              onClick: r
            }, null, 512)), [
              [v]
            ]) : I("", !0)
          ], 2)) : I("", !0),
          o.value ? I("", !0) : (d(), b("div", {
            key: 1,
            class: x(`
          box__body
          ${l.fill || "box__body--padded"}
      `),
            ref_key: "body",
            ref: i,
            onScroll: u
          }, [
            l.$slots.default ? j(l.$slots, "default", { key: 0 }, void 0, !0) : j(l.$slots, "body", { key: 1 }, void 0, !0)
          ], 34)),
          l.$slots.footer ? (d(), b("div", {
            key: 2,
            class: x(`
          box__footer
          ${a.value || "box__footer--shadowed"}
        `)
          }, [
            j(l.$slots, "footer", {}, void 0, !0)
          ], 2)) : I("", !0)
        ], 2)
      ], 2)), [
        [w, {
          condition: l.overlay || l.fixedRight || n.value,
          invisible: l.invisibleOverlay,
          click: h
        }]
      ]) : I("", !0);
    };
  }
});
const ln = /* @__PURE__ */ Q(yo, [["__scopeId", "data-v-f73ff720"]]), go = { style: { width: "100%" } }, _o = /* @__PURE__ */ W({
  __name: "sv-button",
  props: {
    size: {},
    small: { type: Boolean },
    large: { type: Boolean },
    variant: {},
    icon: {},
    disabled: { type: Boolean },
    loading: { type: Boolean }
  },
  setup(t) {
    const e = t, s = le("buttonVariant", e.variant) || "normal", n = (() => {
      switch (!0) {
        case e.small:
          return "small";
        case e.large:
          return "large";
      }
      return le("buttonSize", e.size) || "medium";
    })();
    return (o, i) => (d(), D(je, {
      class: x(`
      button
      button--${y(s)}
      button--${y(n)}
      ${o.loading && "button--loading"}
    `),
      disabled: o.disabled
    }, {
      default: A(() => [
        C("div", go, [
          o.icon ? (d(), D(te, {
            key: 0,
            name: o.icon,
            small: y(n) === "small",
            class: "button__icon"
          }, {
            default: A(() => [
              j(o.$slots, "default", {}, void 0, !0)
            ]),
            _: 3
          }, 8, ["name", "small"])) : j(o.$slots, "default", { key: 1 }, void 0, !0)
        ])
      ]),
      _: 3
    }, 8, ["class", "disabled"]));
  }
});
const ve = /* @__PURE__ */ Q(_o, [["__scopeId", "data-v-a3290c61"]]);
const bo = {}, vo = { class: "card" }, wo = { class: "card__picture" }, $o = { class: "card__footer" };
function So(t, e) {
  return d(), b("div", vo, [
    C("div", wo, [
      j(t.$slots, "default", {}, void 0, !0)
    ]),
    C("div", $o, [
      j(t.$slots, "footer", {}, void 0, !0)
    ])
  ]);
}
const Oo = /* @__PURE__ */ Q(bo, [["render", So], ["__scopeId", "data-v-23effbe2"]]), Bo = {
  key: 0,
  class: "contextmenu__content"
}, No = {
  key: 0,
  class: "contextmenu__section"
}, ko = { class: "contextmenu__item" }, Eo = { class: "contextmenu__section" }, Io = /* @__PURE__ */ W({
  __name: "sv-context-menu",
  props: {
    actions: {},
    subject: {}
  },
  emits: ["actionClick"],
  setup(t, { emit: e }) {
    qs((r) => ({
      "333fcf6f": u.value.x,
      "333fcf70": u.value.y
    }));
    const s = he("user"), n = X(null), o = X(!1), i = (r) => r.filter((h) => h.roles ? h.roles.include(s.$currentUser.role) : !!h.click), a = (r, h) => {
      r.click(h), e("actionClick", { action: r, subject: h }), o.value = !1;
    }, u = Z(() => {
      var r, h;
      return {
        _: o.value,
        x: Math.floor(((r = n.value) == null ? void 0 : r.getBoundingClientRect().left) || 0 - window.scrollX) + "px",
        y: Math.floor(((h = n.value) == null ? void 0 : h.getBoundingClientRect().top) || 0 - window.scrollY) + "px"
      };
    });
    return (r, h) => {
      const c = ae("overlay");
      return r.actions.length > 0 ? (d(), b("div", {
        key: 0,
        ref_key: "contextmenu",
        ref: n,
        class: "contextmenu"
      }, [
        C("a", {
          class: "contextmenu__trigger",
          onClick: h[0] || (h[0] = (l) => o.value = !0)
        }, [
          j(r.$slots, "default", {}, void 0, !0)
        ]),
        (d(), D(Kn, { to: "#main" }, [
          o.value ? se((d(), b("div", Bo, [
            C("div", null, [
              r.$slots.extra ? (d(), b("div", No, [
                C("div", ko, [
                  r.$slots.extra ? j(r.$slots, "extra", { key: 0 }, void 0, !0) : I("", !0)
                ])
              ])) : I("", !0),
              C("div", Eo, [
                (d(!0), b(re, null, ee(i(r.actions), (l, p) => (d(), D(je, {
                  key: `action-${p}`,
                  class: "contextmenu__item contextmenu__item--reactive",
                  onClick: (v) => a(l, r.subject)
                }, {
                  default: A(() => [
                    l.icon ? (d(), D(te, {
                      key: 0,
                      small: "",
                      name: l.icon
                    }, {
                      default: A(() => [
                        oe(M(l.translate ? r.$t(l.name) : l.name), 1)
                      ]),
                      _: 2
                    }, 1032, ["name"])) : I("", !0)
                  ]),
                  _: 2
                }, 1032, ["onClick"]))), 128))
              ])
            ])
          ])), [
            [
              c,
              {
                click: () => {
                  o.value = !1;
                }
              },
              void 0,
              { invisible: !0 }
            ]
          ]) : I("", !0)
        ]))
      ], 512)) : I("", !0);
    };
  }
});
const an = /* @__PURE__ */ Q(Io, [["__scopeId", "data-v-64b6ffe9"]]);
var de = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function To(t) {
  if (t.__esModule)
    return t;
  var e = t.default;
  if (typeof e == "function") {
    var s = function n() {
      return this instanceof n ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    s.prototype = e.prototype;
  } else
    s = {};
  return Object.defineProperty(s, "__esModule", { value: !0 }), Object.keys(t).forEach(function(n) {
    var o = Object.getOwnPropertyDescriptor(t, n);
    Object.defineProperty(s, n, o.get ? o : {
      enumerable: !0,
      get: function() {
        return t[n];
      }
    });
  }), s;
}
var mt = {}, $t = {};
Object.defineProperty($t, "__esModule", { value: !0 });
$t.request = void 0;
const Ao = async (t, e, s = {
  method: e ? "POST" : "GET",
  headers: {
    ...e ? { "content-type": "application/json" } : {}
  }
}, n = async (o) => {
  var a;
  const i = o;
  if (i.data = await o.text(), (a = o.headers.get("content-type")) != null && a.startsWith("application/json")) {
    const u = i.data = JSON.parse(i.data);
    if (u.error) {
      const r = new Error(u.error.message);
      throw Object.assign(r, u.error), r;
    }
  }
  return i;
}) => {
  var i, a, u;
  if (s.body = e, globalThis.userStorage) {
    const r = globalThis.userStorage.getItem("auth:token");
    r && ((i = s.headers).authorization ?? (i.authorization = `Bearer ${r}`));
  }
  (u = (a = s.headers) == null ? void 0 : a["content-type"]) != null && u.startsWith("application/json") && (s.body = JSON.stringify(e));
  const o = await fetch(t, s);
  return n(o);
};
$t.request = Ao;
var es = {}, St = {};
Object.defineProperty(St, "__esModule", { value: !0 });
St.arraysIntersects = void 0;
const Vo = (t, e) => e ? Array.isArray(t) ? t.some((s) => e.includes(s)) : e.includes(t) : !1;
St.arraysIntersects = Vo;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.deepClone = void 0;
const Ro = (t) => JSON.parse(JSON.stringify(t));
Ot.deepClone = Ro;
var ts = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.deepMerge = void 0;
  const e = (s, n, o) => {
    const i = Object.assign({}, s), { arrays: a = !0 } = o || {};
    for (const u in n) {
      const r = i[u], h = n[u];
      if (o != null && o.callback) {
        const c = o.callback(u, r, h);
        if (c !== void 0) {
          i[u] = c;
          continue;
        }
      }
      if (Array.isArray(r) && Array.isArray(h)) {
        i[u] = a ? i[u].concat(...h) : h;
        continue;
      }
      if (h instanceof Function) {
        i[u] = h;
        continue;
      }
      if (r instanceof Object && h instanceof Object) {
        i[u] = (0, t.deepMerge)(r, h, o);
        continue;
      }
      i[u] = h;
    }
    return i;
  };
  t.deepMerge = e;
})(ts);
(function(t) {
  var e = de && de.__createBinding || (Object.create ? function(n, o, i, a) {
    a === void 0 && (a = i);
    var u = Object.getOwnPropertyDescriptor(o, i);
    (!u || ("get" in u ? !o.__esModule : u.writable || u.configurable)) && (u = { enumerable: !0, get: function() {
      return o[i];
    } }), Object.defineProperty(n, a, u);
  } : function(n, o, i, a) {
    a === void 0 && (a = i), n[a] = o[i];
  }), s = de && de.__exportStar || function(n, o) {
    for (var i in n)
      i !== "default" && !Object.prototype.hasOwnProperty.call(o, i) && e(o, n, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), s(St, t), s(Ot, t), s(ts, t);
})(es);
var Le = {}, Be = {};
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.getRelativeTimeFromNow = Be.daysAgo = Be.formatToString = void 0;
const Uo = new Intl.RelativeTimeFormat(void 0, {
  numeric: "auto"
}), jo = {
  year: 24 * 60 * 60 * 1e3 * 365,
  month: 24 * 60 * 60 * 1e3 * 365 / 12,
  day: 24 * 60 * 60 * 1e3,
  hour: 60 * 60 * 1e3,
  minute: 60 * 1e3,
  second: 1e3
}, Co = function(t, e = !1, s = "pt-BR") {
  return e ? t.toLocaleString(s).split(":").slice(0, -1).join(":") : t.toLocaleDateString(s);
};
Be.formatToString = Co;
const Do = function(t, e) {
  const s = /* @__PURE__ */ new Date();
  return s.setDate(t.getDate() - e), s;
};
Be.daysAgo = Do;
const Mo = function(t) {
  const s = /* @__PURE__ */ new Date() - t;
  for (const [n, o] of Object.entries(jo))
    if (Math.abs(s) > o || n === "second")
      return Uo.format(-1 * Math.round(s / o), n);
};
Be.getRelativeTimeFromNow = Mo;
Object.defineProperty(Le, "__esModule", { value: !0 });
Le.formatDateTime = Le.capitalize = void 0;
const Fo = Be, Lo = function(t) {
  return t.charAt(0).toUpperCase() + t.slice(1);
};
Le.capitalize = Lo;
const Po = function(t, e = !1) {
  const s = new Date(t);
  return isNaN(s.getDate()) ? "-" : (0, Fo.formatToString)(s, e);
};
Le.formatDateTime = Po;
var Qe = {}, G = {};
const zo = {}, Ho = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: zo
}, Symbol.toStringTag, { value: "Module" })), Jo = /* @__PURE__ */ To(Ho);
function ns(t) {
  return ["[object ArrayBuffer]", "[object SharedArrayBuffer]"].includes(Object.prototype.toString.call(t));
}
function Ee(t) {
  return Object.prototype.toString.call(t) === "[object Uint8Array]";
}
function We(t) {
  return Object.prototype.toString.call(t) === "[object RegExp]";
}
function ss(t) {
  return Object.prototype.toString.call(t) === "[object Map]";
}
function Ye(t) {
  return Object.prototype.toString.call(t) === "[object Date]";
}
const De = 5, Bt = 2147483647, Nt = -2147483648, os = Math.pow(2, 63) - 1, rs = -Math.pow(2, 63), is = Math.pow(2, 53), ls = -Math.pow(2, 53), yt = 1, as = 2, un = 3, us = 4, cn = 5, qo = 6, cs = 7, fs = 8, ds = 9, fn = 10, gt = 11, Wo = 12, dn = 13, ps = 14, hs = 15, Ge = 16, ms = 17, pn = 18, ys = 19, gs = 255, _s = 127, Yo = 0, _t = 4, bs = Object.freeze({
  double: 1,
  string: 2,
  object: 3,
  array: 4,
  binData: 5,
  undefined: 6,
  objectId: 7,
  bool: 8,
  date: 9,
  null: 10,
  regex: 11,
  dbPointer: 12,
  javascript: 13,
  symbol: 14,
  javascriptWithScope: 15,
  int: 16,
  timestamp: 17,
  long: 18,
  decimal: 19,
  minKey: -1,
  maxKey: 127
});
class $ extends Error {
  get bsonError() {
    return !0;
  }
  get name() {
    return "BSONError";
  }
  constructor(e) {
    super(e);
  }
  static isBSONError(e) {
    return e != null && typeof e == "object" && "bsonError" in e && e.bsonError === !0 && "name" in e && "message" in e && "stack" in e;
  }
}
class Me extends $ {
  get name() {
    return "BSONVersionError";
  }
  constructor() {
    super(`Unsupported BSON version, bson types must be from bson ${De}.0 or later`);
  }
}
class bt extends $ {
  get name() {
    return "BSONRuntimeError";
  }
  constructor(e) {
    super(e);
  }
}
function Zo(t) {
  return ke.fromNumberArray(Array.from({ length: t }, () => Math.floor(Math.random() * 256)));
}
const Go = (() => {
  try {
    return Jo.randomBytes;
  } catch {
    return Zo;
  }
})(), ke = {
  toLocalBufferType(t) {
    if (Buffer.isBuffer(t))
      return t;
    if (ArrayBuffer.isView(t))
      return Buffer.from(t.buffer, t.byteOffset, t.byteLength);
    const e = (t == null ? void 0 : t[Symbol.toStringTag]) ?? Object.prototype.toString.call(t);
    if (e === "ArrayBuffer" || e === "SharedArrayBuffer" || e === "[object ArrayBuffer]" || e === "[object SharedArrayBuffer]")
      return Buffer.from(t);
    throw new $(`Cannot create Buffer from ${String(t)}`);
  },
  allocate(t) {
    return Buffer.alloc(t);
  },
  equals(t, e) {
    return ke.toLocalBufferType(t).equals(e);
  },
  fromNumberArray(t) {
    return Buffer.from(t);
  },
  fromBase64(t) {
    return Buffer.from(t, "base64");
  },
  toBase64(t) {
    return ke.toLocalBufferType(t).toString("base64");
  },
  fromISO88591(t) {
    return Buffer.from(t, "binary");
  },
  toISO88591(t) {
    return ke.toLocalBufferType(t).toString("binary");
  },
  fromHex(t) {
    return Buffer.from(t, "hex");
  },
  toHex(t) {
    return ke.toLocalBufferType(t).toString("hex");
  },
  fromUTF8(t) {
    return Buffer.from(t, "utf8");
  },
  toUTF8(t, e, s) {
    return ke.toLocalBufferType(t).toString("utf8", e, s);
  },
  utf8ByteLength(t) {
    return Buffer.byteLength(t, "utf8");
  },
  encodeUTF8Into(t, e, s) {
    return ke.toLocalBufferType(t).write(e, s, void 0, "utf8");
  },
  randomBytes: Go
};
function Ko() {
  const { navigator: t } = globalThis;
  return typeof t == "object" && t.product === "ReactNative";
}
function Xo(t) {
  if (t < 0)
    throw new RangeError(`The argument 'byteLength' is invalid. Received ${t}`);
  return Ke.fromNumberArray(Array.from({ length: t }, () => Math.floor(Math.random() * 256)));
}
const Qo = (() => {
  var e;
  const { crypto: t } = globalThis;
  if (t != null && typeof t.getRandomValues == "function")
    return (s) => t.getRandomValues(Ke.allocate(s));
  if (Ko()) {
    const { console: s } = globalThis;
    (e = s == null ? void 0 : s.warn) == null || e.call(s, "BSON: For React Native please polyfill crypto.getRandomValues, e.g. using: https://www.npmjs.com/package/react-native-get-random-values.");
  }
  return Xo;
})(), In = /(\d|[a-f])/i, Ke = {
  toLocalBufferType(t) {
    const e = (t == null ? void 0 : t[Symbol.toStringTag]) ?? Object.prototype.toString.call(t);
    if (e === "Uint8Array")
      return t;
    if (ArrayBuffer.isView(t))
      return new Uint8Array(t.buffer.slice(t.byteOffset, t.byteOffset + t.byteLength));
    if (e === "ArrayBuffer" || e === "SharedArrayBuffer" || e === "[object ArrayBuffer]" || e === "[object SharedArrayBuffer]")
      return new Uint8Array(t);
    throw new $(`Cannot make a Uint8Array from ${String(t)}`);
  },
  allocate(t) {
    if (typeof t != "number")
      throw new TypeError(`The "size" argument must be of type number. Received ${String(t)}`);
    return new Uint8Array(t);
  },
  equals(t, e) {
    if (t.byteLength !== e.byteLength)
      return !1;
    for (let s = 0; s < t.byteLength; s++)
      if (t[s] !== e[s])
        return !1;
    return !0;
  },
  fromNumberArray(t) {
    return Uint8Array.from(t);
  },
  fromBase64(t) {
    return Uint8Array.from(atob(t), (e) => e.charCodeAt(0));
  },
  toBase64(t) {
    return btoa(Ke.toISO88591(t));
  },
  fromISO88591(t) {
    return Uint8Array.from(t, (e) => e.charCodeAt(0) & 255);
  },
  toISO88591(t) {
    return Array.from(Uint16Array.from(t), (e) => String.fromCharCode(e)).join("");
  },
  fromHex(t) {
    const e = t.length % 2 === 0 ? t : t.slice(0, t.length - 1), s = [];
    for (let n = 0; n < e.length; n += 2) {
      const o = e[n], i = e[n + 1];
      if (!In.test(o) || !In.test(i))
        break;
      const a = Number.parseInt(`${o}${i}`, 16);
      s.push(a);
    }
    return Uint8Array.from(s);
  },
  toHex(t) {
    return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
  },
  fromUTF8(t) {
    return new TextEncoder().encode(t);
  },
  toUTF8(t, e, s) {
    return new TextDecoder("utf8", { fatal: !1 }).decode(t.slice(e, s));
  },
  utf8ByteLength(t) {
    return Ke.fromUTF8(t).byteLength;
  },
  encodeUTF8Into(t, e, s) {
    const n = Ke.fromUTF8(e);
    return t.set(n, s), n.byteLength;
  },
  randomBytes: Qo
};
var Gn;
const xo = typeof Buffer == "function" && ((Gn = Buffer.prototype) == null ? void 0 : Gn._isBuffer) !== !0, g = xo ? ke : Ke;
class ct extends DataView {
  static fromUint8Array(e) {
    return new DataView(e.buffer, e.byteOffset, e.byteLength);
  }
}
class pe {
  get [Symbol.for("@@mdb.bson.version")]() {
    return De;
  }
}
class J extends pe {
  get _bsontype() {
    return "Binary";
  }
  constructor(e, s) {
    if (super(), e != null && typeof e != "string" && !ArrayBuffer.isView(e) && !(e instanceof ArrayBuffer) && !Array.isArray(e))
      throw new $("Binary can only be constructed from string, Buffer, TypedArray, or Array<number>");
    this.sub_type = s ?? J.BSON_BINARY_SUBTYPE_DEFAULT, e == null ? (this.buffer = g.allocate(J.BUFFER_SIZE), this.position = 0) : (typeof e == "string" ? this.buffer = g.fromISO88591(e) : Array.isArray(e) ? this.buffer = g.fromNumberArray(e) : this.buffer = g.toLocalBufferType(e), this.position = this.buffer.byteLength);
  }
  put(e) {
    if (typeof e == "string" && e.length !== 1)
      throw new $("only accepts single character String");
    if (typeof e != "number" && e.length !== 1)
      throw new $("only accepts single character Uint8Array or Array");
    let s;
    if (typeof e == "string" ? s = e.charCodeAt(0) : typeof e == "number" ? s = e : s = e[0], s < 0 || s > 255)
      throw new $("only accepts number in a valid unsigned byte range 0-255");
    if (this.buffer.byteLength > this.position)
      this.buffer[this.position++] = s;
    else {
      const n = g.allocate(J.BUFFER_SIZE + this.buffer.length);
      n.set(this.buffer, 0), this.buffer = n, this.buffer[this.position++] = s;
    }
  }
  write(e, s) {
    if (s = typeof s == "number" ? s : this.position, this.buffer.byteLength < s + e.length) {
      const n = g.allocate(this.buffer.byteLength + e.length);
      n.set(this.buffer, 0), this.buffer = n;
    }
    if (ArrayBuffer.isView(e))
      this.buffer.set(g.toLocalBufferType(e), s), this.position = s + e.byteLength > this.position ? s + e.length : this.position;
    else if (typeof e == "string") {
      const n = g.fromISO88591(e);
      this.buffer.set(n, s), this.position = s + e.length > this.position ? s + e.length : this.position;
    }
  }
  read(e, s) {
    return s = s && s > 0 ? s : this.position, this.buffer.slice(e, e + s);
  }
  value(e) {
    return e = !!e, e && this.buffer.length === this.position ? this.buffer : e ? this.buffer.slice(0, this.position) : g.toISO88591(this.buffer.subarray(0, this.position));
  }
  length() {
    return this.position;
  }
  toJSON() {
    return g.toBase64(this.buffer);
  }
  toString(e) {
    return e === "hex" ? g.toHex(this.buffer) : e === "base64" ? g.toBase64(this.buffer) : e === "utf8" || e === "utf-8" ? g.toUTF8(this.buffer, 0, this.buffer.byteLength) : g.toUTF8(this.buffer, 0, this.buffer.byteLength);
  }
  toExtendedJSON(e) {
    e = e || {};
    const s = g.toBase64(this.buffer), n = Number(this.sub_type).toString(16);
    return e.legacy ? {
      $binary: s,
      $type: n.length === 1 ? "0" + n : n
    } : {
      $binary: {
        base64: s,
        subType: n.length === 1 ? "0" + n : n
      }
    };
  }
  toUUID() {
    if (this.sub_type === J.SUBTYPE_UUID)
      return new ie(this.buffer.slice(0, this.position));
    throw new $(`Binary sub_type "${this.sub_type}" is not supported for converting to UUID. Only "${J.SUBTYPE_UUID}" is currently supported.`);
  }
  static createFromHexString(e, s) {
    return new J(g.fromHex(e), s);
  }
  static createFromBase64(e, s) {
    return new J(g.fromBase64(e), s);
  }
  static fromExtendedJSON(e, s) {
    s = s || {};
    let n, o;
    if ("$binary" in e ? s.legacy && typeof e.$binary == "string" && "$type" in e ? (o = e.$type ? parseInt(e.$type, 16) : 0, n = g.fromBase64(e.$binary)) : typeof e.$binary != "string" && (o = e.$binary.subType ? parseInt(e.$binary.subType, 16) : 0, n = g.fromBase64(e.$binary.base64)) : "$uuid" in e && (o = 4, n = ie.bytesFromString(e.$uuid)), !n)
      throw new $(`Unexpected Binary Extended JSON format ${JSON.stringify(e)}`);
    return o === _t ? new ie(n) : new J(n, o);
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.inspect();
  }
  inspect() {
    return `Binary.createFromBase64("${g.toBase64(this.buffer.subarray(0, this.position))}", ${this.sub_type})`;
  }
}
J.BSON_BINARY_SUBTYPE_DEFAULT = 0;
J.BUFFER_SIZE = 256;
J.SUBTYPE_DEFAULT = 0;
J.SUBTYPE_FUNCTION = 1;
J.SUBTYPE_BYTE_ARRAY = 2;
J.SUBTYPE_UUID_OLD = 3;
J.SUBTYPE_UUID = 4;
J.SUBTYPE_MD5 = 5;
J.SUBTYPE_ENCRYPTED = 6;
J.SUBTYPE_COLUMN = 7;
J.SUBTYPE_USER_DEFINED = 128;
const Et = 16, er = /^[0-9A-F]{32}$/i, tr = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
class ie extends J {
  constructor(e) {
    let s;
    if (e == null)
      s = ie.generate();
    else if (e instanceof ie)
      s = g.toLocalBufferType(new Uint8Array(e.buffer));
    else if (ArrayBuffer.isView(e) && e.byteLength === Et)
      s = g.toLocalBufferType(e);
    else if (typeof e == "string")
      s = ie.bytesFromString(e);
    else
      throw new $("Argument passed in UUID constructor must be a UUID, a 16 byte Buffer or a 32/36 character hex string (dashes excluded/included, format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).");
    super(s, _t);
  }
  get id() {
    return this.buffer;
  }
  set id(e) {
    this.buffer = e;
  }
  toHexString(e = !0) {
    return e ? [
      g.toHex(this.buffer.subarray(0, 4)),
      g.toHex(this.buffer.subarray(4, 6)),
      g.toHex(this.buffer.subarray(6, 8)),
      g.toHex(this.buffer.subarray(8, 10)),
      g.toHex(this.buffer.subarray(10, 16))
    ].join("-") : g.toHex(this.buffer);
  }
  toString(e) {
    return e === "hex" ? g.toHex(this.id) : e === "base64" ? g.toBase64(this.id) : this.toHexString();
  }
  toJSON() {
    return this.toHexString();
  }
  equals(e) {
    if (!e)
      return !1;
    if (e instanceof ie)
      return g.equals(e.id, this.id);
    try {
      return g.equals(new ie(e).id, this.id);
    } catch {
      return !1;
    }
  }
  toBinary() {
    return new J(this.id, J.SUBTYPE_UUID);
  }
  static generate() {
    const e = g.randomBytes(Et);
    return e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128, e;
  }
  static isValid(e) {
    return e ? typeof e == "string" ? ie.isValidUUIDString(e) : Ee(e) ? e.byteLength === Et : e._bsontype === "Binary" && e.sub_type === this.SUBTYPE_UUID && e.buffer.byteLength === 16 : !1;
  }
  static createFromHexString(e) {
    const s = ie.bytesFromString(e);
    return new ie(s);
  }
  static createFromBase64(e) {
    return new ie(g.fromBase64(e));
  }
  static bytesFromString(e) {
    if (!ie.isValidUUIDString(e))
      throw new $("UUID string representation must be 32 hex digits or canonical hyphenated representation");
    return g.fromHex(e.replace(/-/g, ""));
  }
  static isValidUUIDString(e) {
    return er.test(e) || tr.test(e);
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.inspect();
  }
  inspect() {
    return `new UUID("${this.toHexString()}")`;
  }
}
ie.cacheHexString = !1;
class Ne extends pe {
  get _bsontype() {
    return "Code";
  }
  constructor(e, s) {
    super(), this.code = e.toString(), this.scope = s ?? null;
  }
  toJSON() {
    return this.scope != null ? { code: this.code, scope: this.scope } : { code: this.code };
  }
  toExtendedJSON() {
    return this.scope ? { $code: this.code, $scope: this.scope } : { $code: this.code };
  }
  static fromExtendedJSON(e) {
    return new Ne(e.$code, e.$scope);
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.inspect();
  }
  inspect() {
    const e = this.toJSON();
    return `new Code("${String(e.code)}"${e.scope != null ? `, ${JSON.stringify(e.scope)}` : ""})`;
  }
}
function vs(t) {
  return t != null && typeof t == "object" && "$id" in t && t.$id != null && "$ref" in t && typeof t.$ref == "string" && (!("$db" in t) || "$db" in t && typeof t.$db == "string");
}
class $e extends pe {
  get _bsontype() {
    return "DBRef";
  }
  constructor(e, s, n, o) {
    super();
    const i = e.split(".");
    i.length === 2 && (n = i.shift(), e = i.shift()), this.collection = e, this.oid = s, this.db = n, this.fields = o || {};
  }
  get namespace() {
    return this.collection;
  }
  set namespace(e) {
    this.collection = e;
  }
  toJSON() {
    const e = Object.assign({
      $ref: this.collection,
      $id: this.oid
    }, this.fields);
    return this.db != null && (e.$db = this.db), e;
  }
  toExtendedJSON(e) {
    e = e || {};
    let s = {
      $ref: this.collection,
      $id: this.oid
    };
    return e.legacy || (this.db && (s.$db = this.db), s = Object.assign(s, this.fields)), s;
  }
  static fromExtendedJSON(e) {
    const s = Object.assign({}, e);
    return delete s.$ref, delete s.$id, delete s.$db, new $e(e.$ref, e.$id, e.$db, s);
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.inspect();
  }
  inspect() {
    const e = this.oid === void 0 || this.oid.toString === void 0 ? this.oid : this.oid.toString();
    return `new DBRef("${this.namespace}", new ObjectId("${String(e)}")${this.db ? `, "${this.db}"` : ""})`;
  }
}
let ye;
try {
  ye = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports;
} catch {
}
const Tn = 65536, nr = 1 << 24, Ze = Tn * Tn, ws = Ze * Ze, An = ws / 2, Vn = {}, Rn = {}, sr = 20, or = /^(\+?0|(\+|-)?[1-9][0-9]*)$/;
class f extends pe {
  get _bsontype() {
    return "Long";
  }
  get __isLong__() {
    return !0;
  }
  constructor(e = 0, s, n) {
    super(), typeof e == "bigint" ? Object.assign(this, f.fromBigInt(e, !!s)) : typeof e == "string" ? Object.assign(this, f.fromString(e, !!s)) : (this.low = e | 0, this.high = s | 0, this.unsigned = !!n);
  }
  static fromBits(e, s, n) {
    return new f(e, s, n);
  }
  static fromInt(e, s) {
    let n, o, i;
    return s ? (e >>>= 0, (i = 0 <= e && e < 256) && (o = Rn[e], o) ? o : (n = f.fromBits(e, (e | 0) < 0 ? -1 : 0, !0), i && (Rn[e] = n), n)) : (e |= 0, (i = -128 <= e && e < 128) && (o = Vn[e], o) ? o : (n = f.fromBits(e, e < 0 ? -1 : 0, !1), i && (Vn[e] = n), n));
  }
  static fromNumber(e, s) {
    if (isNaN(e))
      return s ? f.UZERO : f.ZERO;
    if (s) {
      if (e < 0)
        return f.UZERO;
      if (e >= ws)
        return f.MAX_UNSIGNED_VALUE;
    } else {
      if (e <= -An)
        return f.MIN_VALUE;
      if (e + 1 >= An)
        return f.MAX_VALUE;
    }
    return e < 0 ? f.fromNumber(-e, s).neg() : f.fromBits(e % Ze | 0, e / Ze | 0, s);
  }
  static fromBigInt(e, s) {
    return f.fromString(e.toString(), s);
  }
  static fromString(e, s, n) {
    if (e.length === 0)
      throw new $("empty string");
    if (e === "NaN" || e === "Infinity" || e === "+Infinity" || e === "-Infinity")
      return f.ZERO;
    if (typeof s == "number" ? (n = s, s = !1) : s = !!s, n = n || 10, n < 2 || 36 < n)
      throw new $("radix");
    let o;
    if ((o = e.indexOf("-")) > 0)
      throw new $("interior hyphen");
    if (o === 0)
      return f.fromString(e.substring(1), s, n).neg();
    const i = f.fromNumber(Math.pow(n, 8));
    let a = f.ZERO;
    for (let u = 0; u < e.length; u += 8) {
      const r = Math.min(8, e.length - u), h = parseInt(e.substring(u, u + r), n);
      if (r < 8) {
        const c = f.fromNumber(Math.pow(n, r));
        a = a.mul(c).add(f.fromNumber(h));
      } else
        a = a.mul(i), a = a.add(f.fromNumber(h));
    }
    return a.unsigned = s, a;
  }
  static fromBytes(e, s, n) {
    return n ? f.fromBytesLE(e, s) : f.fromBytesBE(e, s);
  }
  static fromBytesLE(e, s) {
    return new f(e[0] | e[1] << 8 | e[2] << 16 | e[3] << 24, e[4] | e[5] << 8 | e[6] << 16 | e[7] << 24, s);
  }
  static fromBytesBE(e, s) {
    return new f(e[4] << 24 | e[5] << 16 | e[6] << 8 | e[7], e[0] << 24 | e[1] << 16 | e[2] << 8 | e[3], s);
  }
  static isLong(e) {
    return e != null && typeof e == "object" && "__isLong__" in e && e.__isLong__ === !0;
  }
  static fromValue(e, s) {
    return typeof e == "number" ? f.fromNumber(e, s) : typeof e == "string" ? f.fromString(e, s) : f.fromBits(e.low, e.high, typeof s == "boolean" ? s : e.unsigned);
  }
  add(e) {
    f.isLong(e) || (e = f.fromValue(e));
    const s = this.high >>> 16, n = this.high & 65535, o = this.low >>> 16, i = this.low & 65535, a = e.high >>> 16, u = e.high & 65535, r = e.low >>> 16, h = e.low & 65535;
    let c = 0, l = 0, p = 0, v = 0;
    return v += i + h, p += v >>> 16, v &= 65535, p += o + r, l += p >>> 16, p &= 65535, l += n + u, c += l >>> 16, l &= 65535, c += s + a, c &= 65535, f.fromBits(p << 16 | v, c << 16 | l, this.unsigned);
  }
  and(e) {
    return f.isLong(e) || (e = f.fromValue(e)), f.fromBits(this.low & e.low, this.high & e.high, this.unsigned);
  }
  compare(e) {
    if (f.isLong(e) || (e = f.fromValue(e)), this.eq(e))
      return 0;
    const s = this.isNegative(), n = e.isNegative();
    return s && !n ? -1 : !s && n ? 1 : this.unsigned ? e.high >>> 0 > this.high >>> 0 || e.high === this.high && e.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.sub(e).isNegative() ? -1 : 1;
  }
  comp(e) {
    return this.compare(e);
  }
  divide(e) {
    if (f.isLong(e) || (e = f.fromValue(e)), e.isZero())
      throw new $("division by zero");
    if (ye) {
      if (!this.unsigned && this.high === -2147483648 && e.low === -1 && e.high === -1)
        return this;
      const i = (this.unsigned ? ye.div_u : ye.div_s)(this.low, this.high, e.low, e.high);
      return f.fromBits(i, ye.get_high(), this.unsigned);
    }
    if (this.isZero())
      return this.unsigned ? f.UZERO : f.ZERO;
    let s, n, o;
    if (this.unsigned) {
      if (e.unsigned || (e = e.toUnsigned()), e.gt(this))
        return f.UZERO;
      if (e.gt(this.shru(1)))
        return f.UONE;
      o = f.UZERO;
    } else {
      if (this.eq(f.MIN_VALUE))
        return e.eq(f.ONE) || e.eq(f.NEG_ONE) ? f.MIN_VALUE : e.eq(f.MIN_VALUE) ? f.ONE : (s = this.shr(1).div(e).shl(1), s.eq(f.ZERO) ? e.isNegative() ? f.ONE : f.NEG_ONE : (n = this.sub(e.mul(s)), o = s.add(n.div(e)), o));
      if (e.eq(f.MIN_VALUE))
        return this.unsigned ? f.UZERO : f.ZERO;
      if (this.isNegative())
        return e.isNegative() ? this.neg().div(e.neg()) : this.neg().div(e).neg();
      if (e.isNegative())
        return this.div(e.neg()).neg();
      o = f.ZERO;
    }
    for (n = this; n.gte(e); ) {
      s = Math.max(1, Math.floor(n.toNumber() / e.toNumber()));
      const i = Math.ceil(Math.log(s) / Math.LN2), a = i <= 48 ? 1 : Math.pow(2, i - 48);
      let u = f.fromNumber(s), r = u.mul(e);
      for (; r.isNegative() || r.gt(n); )
        s -= a, u = f.fromNumber(s, this.unsigned), r = u.mul(e);
      u.isZero() && (u = f.ONE), o = o.add(u), n = n.sub(r);
    }
    return o;
  }
  div(e) {
    return this.divide(e);
  }
  equals(e) {
    return f.isLong(e) || (e = f.fromValue(e)), this.unsigned !== e.unsigned && this.high >>> 31 === 1 && e.high >>> 31 === 1 ? !1 : this.high === e.high && this.low === e.low;
  }
  eq(e) {
    return this.equals(e);
  }
  getHighBits() {
    return this.high;
  }
  getHighBitsUnsigned() {
    return this.high >>> 0;
  }
  getLowBits() {
    return this.low;
  }
  getLowBitsUnsigned() {
    return this.low >>> 0;
  }
  getNumBitsAbs() {
    if (this.isNegative())
      return this.eq(f.MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
    const e = this.high !== 0 ? this.high : this.low;
    let s;
    for (s = 31; s > 0 && !(e & 1 << s); s--)
      ;
    return this.high !== 0 ? s + 33 : s + 1;
  }
  greaterThan(e) {
    return this.comp(e) > 0;
  }
  gt(e) {
    return this.greaterThan(e);
  }
  greaterThanOrEqual(e) {
    return this.comp(e) >= 0;
  }
  gte(e) {
    return this.greaterThanOrEqual(e);
  }
  ge(e) {
    return this.greaterThanOrEqual(e);
  }
  isEven() {
    return (this.low & 1) === 0;
  }
  isNegative() {
    return !this.unsigned && this.high < 0;
  }
  isOdd() {
    return (this.low & 1) === 1;
  }
  isPositive() {
    return this.unsigned || this.high >= 0;
  }
  isZero() {
    return this.high === 0 && this.low === 0;
  }
  lessThan(e) {
    return this.comp(e) < 0;
  }
  lt(e) {
    return this.lessThan(e);
  }
  lessThanOrEqual(e) {
    return this.comp(e) <= 0;
  }
  lte(e) {
    return this.lessThanOrEqual(e);
  }
  modulo(e) {
    if (f.isLong(e) || (e = f.fromValue(e)), ye) {
      const s = (this.unsigned ? ye.rem_u : ye.rem_s)(this.low, this.high, e.low, e.high);
      return f.fromBits(s, ye.get_high(), this.unsigned);
    }
    return this.sub(this.div(e).mul(e));
  }
  mod(e) {
    return this.modulo(e);
  }
  rem(e) {
    return this.modulo(e);
  }
  multiply(e) {
    if (this.isZero())
      return f.ZERO;
    if (f.isLong(e) || (e = f.fromValue(e)), ye) {
      const w = ye.mul(this.low, this.high, e.low, e.high);
      return f.fromBits(w, ye.get_high(), this.unsigned);
    }
    if (e.isZero())
      return f.ZERO;
    if (this.eq(f.MIN_VALUE))
      return e.isOdd() ? f.MIN_VALUE : f.ZERO;
    if (e.eq(f.MIN_VALUE))
      return this.isOdd() ? f.MIN_VALUE : f.ZERO;
    if (this.isNegative())
      return e.isNegative() ? this.neg().mul(e.neg()) : this.neg().mul(e).neg();
    if (e.isNegative())
      return this.mul(e.neg()).neg();
    if (this.lt(f.TWO_PWR_24) && e.lt(f.TWO_PWR_24))
      return f.fromNumber(this.toNumber() * e.toNumber(), this.unsigned);
    const s = this.high >>> 16, n = this.high & 65535, o = this.low >>> 16, i = this.low & 65535, a = e.high >>> 16, u = e.high & 65535, r = e.low >>> 16, h = e.low & 65535;
    let c = 0, l = 0, p = 0, v = 0;
    return v += i * h, p += v >>> 16, v &= 65535, p += o * h, l += p >>> 16, p &= 65535, p += i * r, l += p >>> 16, p &= 65535, l += n * h, c += l >>> 16, l &= 65535, l += o * r, c += l >>> 16, l &= 65535, l += i * u, c += l >>> 16, l &= 65535, c += s * h + n * r + o * u + i * a, c &= 65535, f.fromBits(p << 16 | v, c << 16 | l, this.unsigned);
  }
  mul(e) {
    return this.multiply(e);
  }
  negate() {
    return !this.unsigned && this.eq(f.MIN_VALUE) ? f.MIN_VALUE : this.not().add(f.ONE);
  }
  neg() {
    return this.negate();
  }
  not() {
    return f.fromBits(~this.low, ~this.high, this.unsigned);
  }
  notEquals(e) {
    return !this.equals(e);
  }
  neq(e) {
    return this.notEquals(e);
  }
  ne(e) {
    return this.notEquals(e);
  }
  or(e) {
    return f.isLong(e) || (e = f.fromValue(e)), f.fromBits(this.low | e.low, this.high | e.high, this.unsigned);
  }
  shiftLeft(e) {
    return f.isLong(e) && (e = e.toInt()), (e &= 63) === 0 ? this : e < 32 ? f.fromBits(this.low << e, this.high << e | this.low >>> 32 - e, this.unsigned) : f.fromBits(0, this.low << e - 32, this.unsigned);
  }
  shl(e) {
    return this.shiftLeft(e);
  }
  shiftRight(e) {
    return f.isLong(e) && (e = e.toInt()), (e &= 63) === 0 ? this : e < 32 ? f.fromBits(this.low >>> e | this.high << 32 - e, this.high >> e, this.unsigned) : f.fromBits(this.high >> e - 32, this.high >= 0 ? 0 : -1, this.unsigned);
  }
  shr(e) {
    return this.shiftRight(e);
  }
  shiftRightUnsigned(e) {
    if (f.isLong(e) && (e = e.toInt()), e &= 63, e === 0)
      return this;
    {
      const s = this.high;
      if (e < 32) {
        const n = this.low;
        return f.fromBits(n >>> e | s << 32 - e, s >>> e, this.unsigned);
      } else
        return e === 32 ? f.fromBits(s, 0, this.unsigned) : f.fromBits(s >>> e - 32, 0, this.unsigned);
    }
  }
  shr_u(e) {
    return this.shiftRightUnsigned(e);
  }
  shru(e) {
    return this.shiftRightUnsigned(e);
  }
  subtract(e) {
    return f.isLong(e) || (e = f.fromValue(e)), this.add(e.neg());
  }
  sub(e) {
    return this.subtract(e);
  }
  toInt() {
    return this.unsigned ? this.low >>> 0 : this.low;
  }
  toNumber() {
    return this.unsigned ? (this.high >>> 0) * Ze + (this.low >>> 0) : this.high * Ze + (this.low >>> 0);
  }
  toBigInt() {
    return BigInt(this.toString());
  }
  toBytes(e) {
    return e ? this.toBytesLE() : this.toBytesBE();
  }
  toBytesLE() {
    const e = this.high, s = this.low;
    return [
      s & 255,
      s >>> 8 & 255,
      s >>> 16 & 255,
      s >>> 24,
      e & 255,
      e >>> 8 & 255,
      e >>> 16 & 255,
      e >>> 24
    ];
  }
  toBytesBE() {
    const e = this.high, s = this.low;
    return [
      e >>> 24,
      e >>> 16 & 255,
      e >>> 8 & 255,
      e & 255,
      s >>> 24,
      s >>> 16 & 255,
      s >>> 8 & 255,
      s & 255
    ];
  }
  toSigned() {
    return this.unsigned ? f.fromBits(this.low, this.high, !1) : this;
  }
  toString(e) {
    if (e = e || 10, e < 2 || 36 < e)
      throw new $("radix");
    if (this.isZero())
      return "0";
    if (this.isNegative())
      if (this.eq(f.MIN_VALUE)) {
        const i = f.fromNumber(e), a = this.div(i), u = a.mul(i).sub(this);
        return a.toString(e) + u.toInt().toString(e);
      } else
        return "-" + this.neg().toString(e);
    const s = f.fromNumber(Math.pow(e, 6), this.unsigned);
    let n = this, o = "";
    for (; ; ) {
      const i = n.div(s);
      let u = (n.sub(i.mul(s)).toInt() >>> 0).toString(e);
      if (n = i, n.isZero())
        return u + o;
      for (; u.length < 6; )
        u = "0" + u;
      o = "" + u + o;
    }
  }
  toUnsigned() {
    return this.unsigned ? this : f.fromBits(this.low, this.high, !0);
  }
  xor(e) {
    return f.isLong(e) || (e = f.fromValue(e)), f.fromBits(this.low ^ e.low, this.high ^ e.high, this.unsigned);
  }
  eqz() {
    return this.isZero();
  }
  le(e) {
    return this.lessThanOrEqual(e);
  }
  toExtendedJSON(e) {
    return e && e.relaxed ? this.toNumber() : { $numberLong: this.toString() };
  }
  static fromExtendedJSON(e, s) {
    const { useBigInt64: n = !1, relaxed: o = !0 } = { ...s };
    if (e.$numberLong.length > sr)
      throw new $("$numberLong string is too long");
    if (!or.test(e.$numberLong))
      throw new $(`$numberLong string "${e.$numberLong}" is in an invalid format`);
    if (n) {
      const a = BigInt(e.$numberLong);
      return BigInt.asIntN(64, a);
    }
    const i = f.fromString(e.$numberLong);
    return o ? i.toNumber() : i;
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.inspect();
  }
  inspect() {
    return `new Long("${this.toString()}"${this.unsigned ? ", true" : ""})`;
  }
}
f.TWO_PWR_24 = f.fromInt(nr);
f.MAX_UNSIGNED_VALUE = f.fromBits(-1, -1, !0);
f.ZERO = f.fromInt(0);
f.UZERO = f.fromInt(0, !0);
f.ONE = f.fromInt(1);
f.UONE = f.fromInt(1, !0);
f.NEG_ONE = f.fromInt(-1);
f.MAX_VALUE = f.fromBits(-1, 2147483647, !1);
f.MIN_VALUE = f.fromBits(0, -2147483648, !1);
const rr = /^(\+|-)?(\d+|(\d*\.\d*))?(E|e)?([-+])?(\d+)?$/, ir = /^(\+|-)?(Infinity|inf)$/i, lr = /^(\+|-)?NaN$/i, ot = 6111, It = -6176, Un = 6176, ar = 34, Tt = g.fromNumberArray([
  124,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
].reverse()), jn = g.fromNumberArray([
  248,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
].reverse()), Cn = g.fromNumberArray([
  120,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
].reverse()), ur = /^([-+])?(\d+)?$/, cr = 31, Dn = 16383, fr = 30, dr = 31;
function Mn(t) {
  return !isNaN(parseInt(t, 10));
}
function pr(t) {
  const e = f.fromNumber(1e9);
  let s = f.fromNumber(0);
  if (!t.parts[0] && !t.parts[1] && !t.parts[2] && !t.parts[3])
    return { quotient: t, rem: s };
  for (let n = 0; n <= 3; n++)
    s = s.shiftLeft(32), s = s.add(new f(t.parts[n], 0)), t.parts[n] = s.div(e).low, s = s.modulo(e);
  return { quotient: t, rem: s };
}
function hr(t, e) {
  if (!t && !e)
    return { high: f.fromNumber(0), low: f.fromNumber(0) };
  const s = t.shiftRightUnsigned(32), n = new f(t.getLowBits(), 0), o = e.shiftRightUnsigned(32), i = new f(e.getLowBits(), 0);
  let a = s.multiply(o), u = s.multiply(i);
  const r = n.multiply(o);
  let h = n.multiply(i);
  return a = a.add(u.shiftRightUnsigned(32)), u = new f(u.getLowBits(), 0).add(r).add(h.shiftRightUnsigned(32)), a = a.add(u.shiftRightUnsigned(32)), h = u.shiftLeft(32).add(new f(h.getLowBits(), 0)), { high: a, low: h };
}
function mr(t, e) {
  const s = t.high >>> 0, n = e.high >>> 0;
  if (s < n)
    return !0;
  if (s === n) {
    const o = t.low >>> 0, i = e.low >>> 0;
    if (o < i)
      return !0;
  }
  return !1;
}
function qe(t, e) {
  throw new $(`"${t}" is not a valid Decimal128 string - ${e}`);
}
class ce extends pe {
  get _bsontype() {
    return "Decimal128";
  }
  constructor(e) {
    if (super(), typeof e == "string")
      this.bytes = ce.fromString(e).bytes;
    else if (Ee(e)) {
      if (e.byteLength !== 16)
        throw new $("Decimal128 must take a Buffer of 16 bytes");
      this.bytes = e;
    } else
      throw new $("Decimal128 must take a Buffer or string");
  }
  static fromString(e) {
    let s = !1, n = !1, o = !1, i = 0, a = 0, u = 0, r = 0, h = 0;
    const c = [0];
    let l = 0, p = 0, v = 0, w = 0, S = 0, Y = 0, N = new f(0, 0), V = new f(0, 0), H = 0, m = 0;
    if (e.length >= 7e3)
      throw new $("" + e + " not a valid Decimal128 string");
    const T = e.match(rr), z = e.match(ir), E = e.match(lr);
    if (!T && !z && !E || e.length === 0)
      throw new $("" + e + " not a valid Decimal128 string");
    if (T) {
      const B = T[2], O = T[4], U = T[5], R = T[6];
      O && R === void 0 && qe(e, "missing exponent power"), O && B === void 0 && qe(e, "missing exponent base"), O === void 0 && (U || R) && qe(e, "missing e before exponent");
    }
    if ((e[m] === "+" || e[m] === "-") && (s = e[m++] === "-"), !Mn(e[m]) && e[m] !== ".") {
      if (e[m] === "i" || e[m] === "I")
        return new ce(s ? jn : Cn);
      if (e[m] === "N")
        return new ce(Tt);
    }
    for (; Mn(e[m]) || e[m] === "."; ) {
      if (e[m] === ".") {
        n && qe(e, "contains multiple periods"), n = !0, m = m + 1;
        continue;
      }
      l < 34 && (e[m] !== "0" || o) && (o || (h = a), o = !0, c[p++] = parseInt(e[m], 10), l = l + 1), o && (u = u + 1), n && (r = r + 1), a = a + 1, m = m + 1;
    }
    if (n && !a)
      throw new $("" + e + " not a valid Decimal128 string");
    if (e[m] === "e" || e[m] === "E") {
      const B = e.substr(++m).match(ur);
      if (!B || !B[2])
        return new ce(Tt);
      S = parseInt(B[0], 10), m = m + B[0].length;
    }
    if (e[m])
      return new ce(Tt);
    if (v = 0, !l)
      v = 0, w = 0, c[0] = 0, u = 1, l = 1, i = 0;
    else if (w = l - 1, i = u, i !== 1)
      for (; c[h + i - 1] === 0; )
        i = i - 1;
    for (S <= r && r - S > 16384 ? S = It : S = S - r; S > ot; ) {
      if (w = w + 1, w - v > ar) {
        if (c.join("").match(/^0+$/)) {
          S = ot;
          break;
        }
        qe(e, "overflow");
      }
      S = S - 1;
    }
    for (; S < It || l < u; ) {
      if (w === 0 && i < l) {
        S = It, i = 0;
        break;
      }
      if (l < u ? u = u - 1 : w = w - 1, S < ot)
        S = S + 1;
      else {
        if (c.join("").match(/^0+$/)) {
          S = ot;
          break;
        }
        qe(e, "overflow");
      }
    }
    if (w - v + 1 < i) {
      let B = a;
      n && (h = h + 1, B = B + 1), s && (h = h + 1, B = B + 1);
      const O = parseInt(e[h + w + 1], 10);
      let U = 0;
      if (O >= 5 && (U = 1, O === 5)) {
        for (U = c[w] % 2 === 1 ? 1 : 0, Y = h + w + 2; Y < B; Y++)
          if (parseInt(e[Y], 10)) {
            U = 1;
            break;
          }
      }
      if (U) {
        let R = w;
        for (; R >= 0; R--)
          if (++c[R] > 9 && (c[R] = 0, R === 0))
            if (S < ot)
              S = S + 1, c[R] = 1;
            else
              return new ce(s ? jn : Cn);
      }
    }
    if (N = f.fromNumber(0), V = f.fromNumber(0), i === 0)
      N = f.fromNumber(0), V = f.fromNumber(0);
    else if (w - v < 17) {
      let B = v;
      for (V = f.fromNumber(c[B++]), N = new f(0, 0); B <= w; B++)
        V = V.multiply(f.fromNumber(10)), V = V.add(f.fromNumber(c[B]));
    } else {
      let B = v;
      for (N = f.fromNumber(c[B++]); B <= w - 17; B++)
        N = N.multiply(f.fromNumber(10)), N = N.add(f.fromNumber(c[B]));
      for (V = f.fromNumber(c[B++]); B <= w; B++)
        V = V.multiply(f.fromNumber(10)), V = V.add(f.fromNumber(c[B]));
    }
    const _ = hr(N, f.fromString("100000000000000000"));
    _.low = _.low.add(V), mr(_.low, V) && (_.high = _.high.add(f.fromNumber(1))), H = S + Un;
    const k = { low: f.fromNumber(0), high: f.fromNumber(0) };
    _.high.shiftRightUnsigned(49).and(f.fromNumber(1)).equals(f.fromNumber(1)) ? (k.high = k.high.or(f.fromNumber(3).shiftLeft(61)), k.high = k.high.or(f.fromNumber(H).and(f.fromNumber(16383).shiftLeft(47))), k.high = k.high.or(_.high.and(f.fromNumber(140737488355327)))) : (k.high = k.high.or(f.fromNumber(H & 16383).shiftLeft(49)), k.high = k.high.or(_.high.and(f.fromNumber(562949953421311)))), k.low = _.low, s && (k.high = k.high.or(f.fromString("9223372036854775808")));
    const L = g.allocate(16);
    return m = 0, L[m++] = k.low.low & 255, L[m++] = k.low.low >> 8 & 255, L[m++] = k.low.low >> 16 & 255, L[m++] = k.low.low >> 24 & 255, L[m++] = k.low.high & 255, L[m++] = k.low.high >> 8 & 255, L[m++] = k.low.high >> 16 & 255, L[m++] = k.low.high >> 24 & 255, L[m++] = k.high.low & 255, L[m++] = k.high.low >> 8 & 255, L[m++] = k.high.low >> 16 & 255, L[m++] = k.high.low >> 24 & 255, L[m++] = k.high.high & 255, L[m++] = k.high.high >> 8 & 255, L[m++] = k.high.high >> 16 & 255, L[m++] = k.high.high >> 24 & 255, new ce(L);
  }
  toString() {
    let e, s = 0;
    const n = new Array(36);
    for (let m = 0; m < n.length; m++)
      n[m] = 0;
    let o = 0, i = !1, a, u = { parts: [0, 0, 0, 0] }, r, h;
    const c = [];
    o = 0;
    const l = this.bytes, p = l[o++] | l[o++] << 8 | l[o++] << 16 | l[o++] << 24, v = l[o++] | l[o++] << 8 | l[o++] << 16 | l[o++] << 24, w = l[o++] | l[o++] << 8 | l[o++] << 16 | l[o++] << 24, S = l[o++] | l[o++] << 8 | l[o++] << 16 | l[o++] << 24;
    o = 0, {
      low: new f(p, v),
      high: new f(w, S)
    }.high.lessThan(f.ZERO) && c.push("-");
    const N = S >> 26 & cr;
    if (N >> 3 === 3) {
      if (N === fr)
        return c.join("") + "Infinity";
      if (N === dr)
        return "NaN";
      e = S >> 15 & Dn, a = 8 + (S >> 14 & 1);
    } else
      a = S >> 14 & 7, e = S >> 17 & Dn;
    const V = e - Un;
    if (u.parts[0] = (S & 16383) + ((a & 15) << 14), u.parts[1] = w, u.parts[2] = v, u.parts[3] = p, u.parts[0] === 0 && u.parts[1] === 0 && u.parts[2] === 0 && u.parts[3] === 0)
      i = !0;
    else
      for (h = 3; h >= 0; h--) {
        let m = 0;
        const T = pr(u);
        if (u = T.quotient, m = T.rem.low, !!m)
          for (r = 8; r >= 0; r--)
            n[h * 9 + r] = m % 10, m = Math.floor(m / 10);
      }
    if (i)
      s = 1, n[o] = 0;
    else
      for (s = 36; !n[o]; )
        s = s - 1, o = o + 1;
    const H = s - 1 + V;
    if (H >= 34 || H <= -7 || V > 0) {
      if (s > 34)
        return c.push("0"), V > 0 ? c.push(`E+${V}`) : V < 0 && c.push(`E${V}`), c.join("");
      c.push(`${n[o++]}`), s = s - 1, s && c.push(".");
      for (let m = 0; m < s; m++)
        c.push(`${n[o++]}`);
      c.push("E"), H > 0 ? c.push(`+${H}`) : c.push(`${H}`);
    } else if (V >= 0)
      for (let m = 0; m < s; m++)
        c.push(`${n[o++]}`);
    else {
      let m = s + V;
      if (m > 0)
        for (let T = 0; T < m; T++)
          c.push(`${n[o++]}`);
      else
        c.push("0");
      for (c.push("."); m++ < 0; )
        c.push("0");
      for (let T = 0; T < s - Math.max(m - 1, 0); T++)
        c.push(`${n[o++]}`);
    }
    return c.join("");
  }
  toJSON() {
    return { $numberDecimal: this.toString() };
  }
  toExtendedJSON() {
    return { $numberDecimal: this.toString() };
  }
  static fromExtendedJSON(e) {
    return ce.fromString(e.$numberDecimal);
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.inspect();
  }
  inspect() {
    return `new Decimal128("${this.toString()}")`;
  }
}
class Ve extends pe {
  get _bsontype() {
    return "Double";
  }
  constructor(e) {
    super(), e instanceof Number && (e = e.valueOf()), this.value = +e;
  }
  valueOf() {
    return this.value;
  }
  toJSON() {
    return this.value;
  }
  toString(e) {
    return this.value.toString(e);
  }
  toExtendedJSON(e) {
    return e && (e.legacy || e.relaxed && isFinite(this.value)) ? this.value : Object.is(Math.sign(this.value), -0) ? { $numberDouble: "-0.0" } : {
      $numberDouble: Number.isInteger(this.value) ? this.value.toFixed(1) : this.value.toString()
    };
  }
  static fromExtendedJSON(e, s) {
    const n = parseFloat(e.$numberDouble);
    return s && s.relaxed ? n : new Ve(n);
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.inspect();
  }
  inspect() {
    return `new Double(${this.toExtendedJSON().$numberDouble})`;
  }
}
class Re extends pe {
  get _bsontype() {
    return "Int32";
  }
  constructor(e) {
    super(), e instanceof Number && (e = e.valueOf()), this.value = +e | 0;
  }
  valueOf() {
    return this.value;
  }
  toString(e) {
    return this.value.toString(e);
  }
  toJSON() {
    return this.value;
  }
  toExtendedJSON(e) {
    return e && (e.relaxed || e.legacy) ? this.value : { $numberInt: this.value.toString() };
  }
  static fromExtendedJSON(e, s) {
    return s && s.relaxed ? parseInt(e.$numberInt, 10) : new Re(e.$numberInt);
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.inspect();
  }
  inspect() {
    return `new Int32(${this.valueOf()})`;
  }
}
class Pe extends pe {
  get _bsontype() {
    return "MaxKey";
  }
  toExtendedJSON() {
    return { $maxKey: 1 };
  }
  static fromExtendedJSON() {
    return new Pe();
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.inspect();
  }
  inspect() {
    return "new MaxKey()";
  }
}
class ze extends pe {
  get _bsontype() {
    return "MinKey";
  }
  toExtendedJSON() {
    return { $minKey: 1 };
  }
  static fromExtendedJSON() {
    return new ze();
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.inspect();
  }
  inspect() {
    return "new MinKey()";
  }
}
const yr = new RegExp("^[0-9a-fA-F]{24}$");
let Ue = null;
const we = Symbol("id");
class K extends pe {
  get _bsontype() {
    return "ObjectId";
  }
  constructor(e) {
    super();
    let s;
    if (typeof e == "object" && e && "id" in e) {
      if (typeof e.id != "string" && !ArrayBuffer.isView(e.id))
        throw new $("Argument passed in must have an id that is of type string or Buffer");
      "toHexString" in e && typeof e.toHexString == "function" ? s = g.fromHex(e.toHexString()) : s = e.id;
    } else
      s = e;
    if (s == null || typeof s == "number")
      this[we] = K.generate(typeof s == "number" ? s : void 0);
    else if (ArrayBuffer.isView(s) && s.byteLength === 12)
      this[we] = g.toLocalBufferType(s);
    else if (typeof s == "string")
      if (s.length === 12) {
        const n = g.fromUTF8(s);
        if (n.byteLength === 12)
          this[we] = n;
        else
          throw new $("Argument passed in must be a string of 12 bytes");
      } else if (s.length === 24 && yr.test(s))
        this[we] = g.fromHex(s);
      else
        throw new $("Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer");
    else
      throw new $("Argument passed in does not match the accepted types");
    K.cacheHexString && (this.__id = g.toHex(this.id));
  }
  get id() {
    return this[we];
  }
  set id(e) {
    this[we] = e, K.cacheHexString && (this.__id = g.toHex(e));
  }
  toHexString() {
    if (K.cacheHexString && this.__id)
      return this.__id;
    const e = g.toHex(this.id);
    return K.cacheHexString && !this.__id && (this.__id = e), e;
  }
  static getInc() {
    return K.index = (K.index + 1) % 16777215;
  }
  static generate(e) {
    typeof e != "number" && (e = Math.floor(Date.now() / 1e3));
    const s = K.getInc(), n = g.allocate(12);
    return ct.fromUint8Array(n).setUint32(0, e, !1), Ue === null && (Ue = g.randomBytes(5)), n[4] = Ue[0], n[5] = Ue[1], n[6] = Ue[2], n[7] = Ue[3], n[8] = Ue[4], n[11] = s & 255, n[10] = s >> 8 & 255, n[9] = s >> 16 & 255, n;
  }
  toString(e) {
    return e === "base64" ? g.toBase64(this.id) : e === "hex" ? this.toHexString() : this.toHexString();
  }
  toJSON() {
    return this.toHexString();
  }
  equals(e) {
    if (e == null)
      return !1;
    if (e instanceof K)
      return this[we][11] === e[we][11] && g.equals(this[we], e[we]);
    if (typeof e == "string" && K.isValid(e) && e.length === 12 && Ee(this.id))
      return g.equals(this.id, g.fromISO88591(e));
    if (typeof e == "string" && K.isValid(e) && e.length === 24)
      return e.toLowerCase() === this.toHexString();
    if (typeof e == "string" && K.isValid(e) && e.length === 12)
      return g.equals(g.fromUTF8(e), this.id);
    if (typeof e == "object" && "toHexString" in e && typeof e.toHexString == "function") {
      const s = e.toHexString(), n = this.toHexString().toLowerCase();
      return typeof s == "string" && s.toLowerCase() === n;
    }
    return !1;
  }
  getTimestamp() {
    const e = /* @__PURE__ */ new Date(), s = ct.fromUint8Array(this.id).getUint32(0, !1);
    return e.setTime(Math.floor(s) * 1e3), e;
  }
  static createPk() {
    return new K();
  }
  static createFromTime(e) {
    const s = g.fromNumberArray([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    return ct.fromUint8Array(s).setUint32(0, e, !1), new K(s);
  }
  static createFromHexString(e) {
    if ((e == null ? void 0 : e.length) !== 24)
      throw new $("hex string must be 24 characters");
    return new K(g.fromHex(e));
  }
  static createFromBase64(e) {
    if ((e == null ? void 0 : e.length) !== 16)
      throw new $("base64 string must be 16 characters");
    return new K(g.fromBase64(e));
  }
  static isValid(e) {
    if (e == null)
      return !1;
    try {
      return new K(e), !0;
    } catch {
      return !1;
    }
  }
  toExtendedJSON() {
    return this.toHexString ? { $oid: this.toHexString() } : { $oid: this.toString("hex") };
  }
  static fromExtendedJSON(e) {
    return new K(e.$oid);
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.inspect();
  }
  inspect() {
    return `new ObjectId("${this.toHexString()}")`;
  }
}
K.index = Math.floor(Math.random() * 16777215);
function ft(t, e, s) {
  let n = 5;
  if (Array.isArray(t))
    for (let o = 0; o < t.length; o++)
      n += Fn(o.toString(), t[o], e, !0, s);
  else {
    typeof (t == null ? void 0 : t.toBSON) == "function" && (t = t.toBSON());
    for (const o of Object.keys(t))
      n += Fn(o, t[o], e, !1, s);
  }
  return n;
}
function Fn(t, e, s = !1, n = !1, o = !1) {
  switch (typeof (e == null ? void 0 : e.toBSON) == "function" && (e = e.toBSON()), typeof e) {
    case "string":
      return 1 + g.utf8ByteLength(t) + 1 + 4 + g.utf8ByteLength(e) + 1;
    case "number":
      return Math.floor(e) === e && e >= ls && e <= is && e >= Nt && e <= Bt ? (t != null ? g.utf8ByteLength(t) + 1 : 0) + (4 + 1) : (t != null ? g.utf8ByteLength(t) + 1 : 0) + (8 + 1);
    case "undefined":
      return n || !o ? (t != null ? g.utf8ByteLength(t) + 1 : 0) + 1 : 0;
    case "boolean":
      return (t != null ? g.utf8ByteLength(t) + 1 : 0) + (1 + 1);
    case "object":
      if (e != null && typeof e._bsontype == "string" && e[Symbol.for("@@mdb.bson.version")] !== De)
        throw new Me();
      if (e == null || e._bsontype === "MinKey" || e._bsontype === "MaxKey")
        return (t != null ? g.utf8ByteLength(t) + 1 : 0) + 1;
      if (e._bsontype === "ObjectId")
        return (t != null ? g.utf8ByteLength(t) + 1 : 0) + (12 + 1);
      if (e instanceof Date || Ye(e))
        return (t != null ? g.utf8ByteLength(t) + 1 : 0) + (8 + 1);
      if (ArrayBuffer.isView(e) || e instanceof ArrayBuffer || ns(e))
        return (t != null ? g.utf8ByteLength(t) + 1 : 0) + (1 + 4 + 1) + e.byteLength;
      if (e._bsontype === "Long" || e._bsontype === "Double" || e._bsontype === "Timestamp")
        return (t != null ? g.utf8ByteLength(t) + 1 : 0) + (8 + 1);
      if (e._bsontype === "Decimal128")
        return (t != null ? g.utf8ByteLength(t) + 1 : 0) + (16 + 1);
      if (e._bsontype === "Code")
        return e.scope != null && Object.keys(e.scope).length > 0 ? (t != null ? g.utf8ByteLength(t) + 1 : 0) + 1 + 4 + 4 + g.utf8ByteLength(e.code.toString()) + 1 + ft(e.scope, s, o) : (t != null ? g.utf8ByteLength(t) + 1 : 0) + 1 + 4 + g.utf8ByteLength(e.code.toString()) + 1;
      if (e._bsontype === "Binary") {
        const i = e;
        return i.sub_type === J.SUBTYPE_BYTE_ARRAY ? (t != null ? g.utf8ByteLength(t) + 1 : 0) + (i.position + 1 + 4 + 1 + 4) : (t != null ? g.utf8ByteLength(t) + 1 : 0) + (i.position + 1 + 4 + 1);
      } else {
        if (e._bsontype === "Symbol")
          return (t != null ? g.utf8ByteLength(t) + 1 : 0) + g.utf8ByteLength(e.value) + 4 + 1 + 1;
        if (e._bsontype === "DBRef") {
          const i = Object.assign({
            $ref: e.collection,
            $id: e.oid
          }, e.fields);
          return e.db != null && (i.$db = e.db), (t != null ? g.utf8ByteLength(t) + 1 : 0) + 1 + ft(i, s, o);
        } else
          return e instanceof RegExp || We(e) ? (t != null ? g.utf8ByteLength(t) + 1 : 0) + 1 + g.utf8ByteLength(e.source) + 1 + (e.global ? 1 : 0) + (e.ignoreCase ? 1 : 0) + (e.multiline ? 1 : 0) + 1 : e._bsontype === "BSONRegExp" ? (t != null ? g.utf8ByteLength(t) + 1 : 0) + 1 + g.utf8ByteLength(e.pattern) + 1 + g.utf8ByteLength(e.options) + 1 : (t != null ? g.utf8ByteLength(t) + 1 : 0) + ft(e, s, o) + 1;
      }
    case "function":
      if (s)
        return (t != null ? g.utf8ByteLength(t) + 1 : 0) + 1 + 4 + g.utf8ByteLength(e.toString()) + 1;
  }
  return 0;
}
function gr(t) {
  return t.split("").sort().join("");
}
class be extends pe {
  get _bsontype() {
    return "BSONRegExp";
  }
  constructor(e, s) {
    if (super(), this.pattern = e, this.options = gr(s ?? ""), this.pattern.indexOf("\0") !== -1)
      throw new $(`BSON Regex patterns cannot contain null bytes, found: ${JSON.stringify(this.pattern)}`);
    if (this.options.indexOf("\0") !== -1)
      throw new $(`BSON Regex options cannot contain null bytes, found: ${JSON.stringify(this.options)}`);
    for (let n = 0; n < this.options.length; n++)
      if (!(this.options[n] === "i" || this.options[n] === "m" || this.options[n] === "x" || this.options[n] === "l" || this.options[n] === "s" || this.options[n] === "u"))
        throw new $(`The regular expression option [${this.options[n]}] is not supported`);
  }
  static parseOptions(e) {
    return e ? e.split("").sort().join("") : "";
  }
  toExtendedJSON(e) {
    return e = e || {}, e.legacy ? { $regex: this.pattern, $options: this.options } : { $regularExpression: { pattern: this.pattern, options: this.options } };
  }
  static fromExtendedJSON(e) {
    if ("$regex" in e)
      if (typeof e.$regex != "string") {
        if (e.$regex._bsontype === "BSONRegExp")
          return e;
      } else
        return new be(e.$regex, be.parseOptions(e.$options));
    if ("$regularExpression" in e)
      return new be(e.$regularExpression.pattern, be.parseOptions(e.$regularExpression.options));
    throw new $(`Unexpected BSONRegExp EJSON object form: ${JSON.stringify(e)}`);
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.inspect();
  }
  inspect() {
    return `new BSONRegExp(${JSON.stringify(this.pattern)}, ${JSON.stringify(this.options)})`;
  }
}
class He extends pe {
  get _bsontype() {
    return "BSONSymbol";
  }
  constructor(e) {
    super(), this.value = e;
  }
  valueOf() {
    return this.value;
  }
  toString() {
    return this.value;
  }
  inspect() {
    return `new BSONSymbol("${this.value}")`;
  }
  toJSON() {
    return this.value;
  }
  toExtendedJSON() {
    return { $symbol: this.value };
  }
  static fromExtendedJSON(e) {
    return new He(e.$symbol);
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.inspect();
  }
}
const _r = f;
class ge extends _r {
  get _bsontype() {
    return "Timestamp";
  }
  constructor(e) {
    if (e == null)
      super(0, 0, !0);
    else if (typeof e == "bigint")
      super(e, !0);
    else if (f.isLong(e))
      super(e.low, e.high, !0);
    else if (typeof e == "object" && "t" in e && "i" in e) {
      if (typeof e.t != "number" && (typeof e.t != "object" || e.t._bsontype !== "Int32"))
        throw new $("Timestamp constructed from { t, i } must provide t as a number");
      if (typeof e.i != "number" && (typeof e.i != "object" || e.i._bsontype !== "Int32"))
        throw new $("Timestamp constructed from { t, i } must provide i as a number");
      const s = Number(e.t), n = Number(e.i);
      if (s < 0 || Number.isNaN(s))
        throw new $("Timestamp constructed from { t, i } must provide a positive t");
      if (n < 0 || Number.isNaN(n))
        throw new $("Timestamp constructed from { t, i } must provide a positive i");
      if (s > 4294967295)
        throw new $("Timestamp constructed from { t, i } must provide t equal or less than uint32 max");
      if (n > 4294967295)
        throw new $("Timestamp constructed from { t, i } must provide i equal or less than uint32 max");
      super(n, s, !0);
    } else
      throw new $("A Timestamp can only be constructed with: bigint, Long, or { t: number; i: number }");
  }
  toJSON() {
    return {
      $timestamp: this.toString()
    };
  }
  static fromInt(e) {
    return new ge(f.fromInt(e, !0));
  }
  static fromNumber(e) {
    return new ge(f.fromNumber(e, !0));
  }
  static fromBits(e, s) {
    return new ge({ i: e, t: s });
  }
  static fromString(e, s) {
    return new ge(f.fromString(e, !0, s));
  }
  toExtendedJSON() {
    return { $timestamp: { t: this.high >>> 0, i: this.low >>> 0 } };
  }
  static fromExtendedJSON(e) {
    const s = f.isLong(e.$timestamp.i) ? e.$timestamp.i.getLowBitsUnsigned() : e.$timestamp.i, n = f.isLong(e.$timestamp.t) ? e.$timestamp.t.getLowBitsUnsigned() : e.$timestamp.t;
    return new ge({ t: n, i: s });
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.inspect();
  }
  inspect() {
    return `new Timestamp({ t: ${this.getHighBits()}, i: ${this.getLowBits()} })`;
  }
}
ge.MAX_VALUE = f.MAX_UNSIGNED_VALUE;
const br = 128, vr = 192, wr = 224, $r = 240, Sr = 248, Or = 192, Br = 224, Nr = 240, kr = 128;
function $s(t, e, s) {
  let n = 0;
  for (let o = e; o < s; o += 1) {
    const i = t[o];
    if (n) {
      if ((i & vr) !== kr)
        return !1;
      n -= 1;
    } else if (i & br)
      if ((i & wr) === Or)
        n = 1;
      else if ((i & $r) === Br)
        n = 2;
      else if ((i & Sr) === Nr)
        n = 3;
      else
        return !1;
  }
  return !n;
}
const Er = f.fromNumber(is), Ir = f.fromNumber(ls);
function Ss(t, e, s) {
  e = e ?? {};
  const n = e && e.index ? e.index : 0, o = t[n] | t[n + 1] << 8 | t[n + 2] << 16 | t[n + 3] << 24;
  if (o < 5)
    throw new $(`bson size must be >= 5, is ${o}`);
  if (e.allowObjectSmallerThanBufferSize && t.length < o)
    throw new $(`buffer length ${t.length} must be >= bson size ${o}`);
  if (!e.allowObjectSmallerThanBufferSize && t.length !== o)
    throw new $(`buffer length ${t.length} must === bson size ${o}`);
  if (o + n > t.byteLength)
    throw new $(`(bson size ${o} + options.index ${n} must be <= buffer length ${t.byteLength})`);
  if (t[n + o - 1] !== 0)
    throw new $("One object, sized correctly, with a spot for an EOO, but the EOO isn't 0x00");
  return dt(t, n, e, s);
}
const Tr = /^\$ref$|^\$id$|^\$db$/;
function dt(t, e, s, n = !1) {
  const o = s.fieldsAsRaw == null ? null : s.fieldsAsRaw, i = s.raw == null ? !1 : s.raw, a = typeof s.bsonRegExp == "boolean" ? s.bsonRegExp : !1, u = s.promoteBuffers ?? !1, r = s.promoteLongs ?? !0, h = s.promoteValues ?? !0, c = s.useBigInt64 ?? !1;
  if (c && !h)
    throw new $("Must either request bigint or Long for int64 deserialization");
  if (c && !r)
    throw new $("Must either request bigint or Long for int64 deserialization");
  const l = s.validation == null ? { utf8: !0 } : s.validation;
  let p = !0, v;
  const w = /* @__PURE__ */ new Set(), S = l.utf8;
  if (typeof S == "boolean")
    v = S;
  else {
    p = !1;
    const E = Object.keys(S).map(function(_) {
      return S[_];
    });
    if (E.length === 0)
      throw new $("UTF-8 validation setting cannot be empty");
    if (typeof E[0] != "boolean")
      throw new $("Invalid UTF-8 validation option, must specify boolean values");
    if (v = E[0], !E.every((_) => _ === v))
      throw new $("Invalid UTF-8 validation option - keys must be all true or all false");
  }
  if (!p)
    for (const E of Object.keys(S))
      w.add(E);
  const Y = e;
  if (t.length < 5)
    throw new $("corrupt bson message < 5 bytes long");
  const N = t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24;
  if (N < 5 || N > t.length)
    throw new $("corrupt bson message");
  const V = n ? [] : {};
  let H = 0;
  const m = !1;
  let T = n ? !1 : null;
  const z = new DataView(t.buffer, t.byteOffset, t.byteLength);
  for (; !m; ) {
    const E = t[e++];
    if (E === 0)
      break;
    let _ = e;
    for (; t[_] !== 0 && _ < t.length; )
      _++;
    if (_ >= t.byteLength)
      throw new $("Bad BSON Document: illegal CString");
    const k = n ? H++ : g.toUTF8(t, e, _);
    let L = !0;
    p || w.has(k) ? L = v : L = !v, T !== !1 && k[0] === "$" && (T = Tr.test(k));
    let B;
    if (e = _ + 1, E === as) {
      const O = t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24;
      if (O <= 0 || O > t.length - e || t[e + O - 1] !== 0)
        throw new $("bad string length in bson");
      B = ut(t, e, e + O - 1, L), e = e + O;
    } else if (E === cs) {
      const O = g.allocate(12);
      O.set(t.subarray(e, e + 12)), B = new K(O), e = e + 12;
    } else if (E === Ge && h === !1)
      B = new Re(t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24);
    else if (E === Ge)
      B = t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24;
    else if (E === yt && h === !1)
      B = new Ve(z.getFloat64(e, !0)), e = e + 8;
    else if (E === yt)
      B = z.getFloat64(e, !0), e = e + 8;
    else if (E === ds) {
      const O = t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24, U = t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24;
      B = new Date(new f(O, U).toNumber());
    } else if (E === fs) {
      if (t[e] !== 0 && t[e] !== 1)
        throw new $("illegal boolean type value");
      B = t[e++] === 1;
    } else if (E === un) {
      const O = e, U = t[e] | t[e + 1] << 8 | t[e + 2] << 16 | t[e + 3] << 24;
      if (U <= 0 || U > t.length - e)
        throw new $("bad embedded document length in bson");
      if (i)
        B = t.slice(e, e + U);
      else {
        let R = s;
        p || (R = { ...s, validation: { utf8: L } }), B = dt(t, O, R, !1);
      }
      e = e + U;
    } else if (E === us) {
      const O = e, U = t[e] | t[e + 1] << 8 | t[e + 2] << 16 | t[e + 3] << 24;
      let R = s;
      const P = e + U;
      if (o && o[k] && (R = { ...s, raw: !0 }), p || (R = { ...R, validation: { utf8: L } }), B = dt(t, O, R, !0), e = e + U, t[e - 1] !== 0)
        throw new $("invalid array terminator byte");
      if (e !== P)
        throw new $("corrupted array bson");
    } else if (E === qo)
      B = void 0;
    else if (E === fn)
      B = null;
    else if (E === pn) {
      const O = ct.fromUint8Array(t.subarray(e, e + 8)), U = t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24, R = t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24, P = new f(U, R);
      c ? B = O.getBigInt64(0, !0) : r && h === !0 ? B = P.lessThanOrEqual(Er) && P.greaterThanOrEqual(Ir) ? P.toNumber() : P : B = P;
    } else if (E === ys) {
      const O = g.allocate(16);
      O.set(t.subarray(e, e + 16), 0), e = e + 16, B = new ce(O);
    } else if (E === cn) {
      let O = t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24;
      const U = O, R = t[e++];
      if (O < 0)
        throw new $("Negative binary type element size found");
      if (O > t.byteLength)
        throw new $("Binary type size larger than document size");
      if (t.slice != null) {
        if (R === J.SUBTYPE_BYTE_ARRAY) {
          if (O = t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24, O < 0)
            throw new $("Negative binary type element size found for subtype 0x02");
          if (O > U - 4)
            throw new $("Binary type with subtype 0x02 contains too long binary size");
          if (O < U - 4)
            throw new $("Binary type with subtype 0x02 contains too short binary size");
        }
        u && h ? B = g.toLocalBufferType(t.slice(e, e + O)) : (B = new J(t.slice(e, e + O), R), R === _t && ie.isValid(B) && (B = B.toUUID()));
      } else {
        const P = g.allocate(O);
        if (R === J.SUBTYPE_BYTE_ARRAY) {
          if (O = t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24, O < 0)
            throw new $("Negative binary type element size found for subtype 0x02");
          if (O > U - 4)
            throw new $("Binary type with subtype 0x02 contains too long binary size");
          if (O < U - 4)
            throw new $("Binary type with subtype 0x02 contains too short binary size");
        }
        for (_ = 0; _ < O; _++)
          P[_] = t[e + _];
        u && h ? B = P : (B = new J(t.slice(e, e + O), R), R === _t && ie.isValid(B) && (B = B.toUUID()));
      }
      e = e + O;
    } else if (E === gt && a === !1) {
      for (_ = e; t[_] !== 0 && _ < t.length; )
        _++;
      if (_ >= t.length)
        throw new $("Bad BSON Document: illegal CString");
      const O = g.toUTF8(t, e, _);
      for (e = _ + 1, _ = e; t[_] !== 0 && _ < t.length; )
        _++;
      if (_ >= t.length)
        throw new $("Bad BSON Document: illegal CString");
      const U = g.toUTF8(t, e, _);
      e = _ + 1;
      const R = new Array(U.length);
      for (_ = 0; _ < U.length; _++)
        switch (U[_]) {
          case "m":
            R[_] = "m";
            break;
          case "s":
            R[_] = "g";
            break;
          case "i":
            R[_] = "i";
            break;
        }
      B = new RegExp(O, R.join(""));
    } else if (E === gt && a === !0) {
      for (_ = e; t[_] !== 0 && _ < t.length; )
        _++;
      if (_ >= t.length)
        throw new $("Bad BSON Document: illegal CString");
      const O = g.toUTF8(t, e, _);
      for (e = _ + 1, _ = e; t[_] !== 0 && _ < t.length; )
        _++;
      if (_ >= t.length)
        throw new $("Bad BSON Document: illegal CString");
      const U = g.toUTF8(t, e, _);
      e = _ + 1, B = new be(O, U);
    } else if (E === ps) {
      const O = t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24;
      if (O <= 0 || O > t.length - e || t[e + O - 1] !== 0)
        throw new $("bad string length in bson");
      const U = ut(t, e, e + O - 1, L);
      B = h ? U : new He(U), e = e + O;
    } else if (E === ms) {
      const O = t[e++] + t[e++] * 256 + t[e++] * 65536 + t[e++] * 16777216, U = t[e++] + t[e++] * 256 + t[e++] * 65536 + t[e++] * (1 << 24);
      B = new ge({ i: O, t: U });
    } else if (E === gs)
      B = new ze();
    else if (E === _s)
      B = new Pe();
    else if (E === dn) {
      const O = t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24;
      if (O <= 0 || O > t.length - e || t[e + O - 1] !== 0)
        throw new $("bad string length in bson");
      const U = ut(t, e, e + O - 1, L);
      B = new Ne(U), e = e + O;
    } else if (E === hs) {
      const O = t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24;
      if (O < 4 + 4 + 4 + 1)
        throw new $("code_w_scope total size shorter minimum expected length");
      const U = t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24;
      if (U <= 0 || U > t.length - e || t[e + U - 1] !== 0)
        throw new $("bad string length in bson");
      const R = ut(t, e, e + U - 1, L);
      e = e + U;
      const P = e, me = t[e] | t[e + 1] << 8 | t[e + 2] << 16 | t[e + 3] << 24, tt = dt(t, P, s, !1);
      if (e = e + me, O < 4 + 4 + me + U)
        throw new $("code_w_scope total size is too short, truncating scope");
      if (O > 4 + 4 + me + U)
        throw new $("code_w_scope total size is too long, clips outer document");
      B = new Ne(R, tt);
    } else if (E === Wo) {
      const O = t[e++] | t[e++] << 8 | t[e++] << 16 | t[e++] << 24;
      if (O <= 0 || O > t.length - e || t[e + O - 1] !== 0)
        throw new $("bad string length in bson");
      if (l != null && l.utf8 && !$s(t, e, e + O - 1))
        throw new $("Invalid UTF-8 string in BSON document");
      const U = g.toUTF8(t, e, e + O - 1);
      e = e + O;
      const R = g.allocate(12);
      R.set(t.subarray(e, e + 12), 0);
      const P = new K(R);
      e = e + 12, B = new $e(U, P);
    } else
      throw new $(`Detected unknown BSON type ${E.toString(16)} for fieldname "${k}"`);
    k === "__proto__" ? Object.defineProperty(V, k, {
      value: B,
      writable: !0,
      enumerable: !0,
      configurable: !0
    }) : V[k] = B;
  }
  if (N !== e - Y)
    throw n ? new $("corrupt array bson") : new $("corrupt object bson");
  if (!T)
    return V;
  if (vs(V)) {
    const E = Object.assign({}, V);
    return delete E.$ref, delete E.$id, delete E.$db, new $e(V.$ref, V.$id, V.$db, E);
  }
  return V;
}
function ut(t, e, s, n) {
  const o = g.toUTF8(t, e, s);
  if (n) {
    for (let i = 0; i < o.length; i++)
      if (o.charCodeAt(i) === 65533) {
        if (!$s(t, e, s))
          throw new $("Invalid UTF-8 string in BSON document");
        break;
      }
  }
  return o;
}
const vt = /\x00/, Ln = /* @__PURE__ */ new Set(["$db", "$ref", "$id", "$clusterTime"]);
function At(t, e, s, n) {
  t[n++] = as;
  const o = g.encodeUTF8Into(t, e, n);
  n = n + o + 1, t[n - 1] = 0;
  const i = g.encodeUTF8Into(t, s, n + 4);
  return t[n + 3] = i + 1 >> 24 & 255, t[n + 2] = i + 1 >> 16 & 255, t[n + 1] = i + 1 >> 8 & 255, t[n] = i + 1 & 255, n = n + 4 + i, t[n++] = 0, n;
}
const xe = new DataView(new ArrayBuffer(8), 0, 8), Ar = new Uint8Array(xe.buffer, 0, 4), wt = new Uint8Array(xe.buffer, 0, 8);
function Vt(t, e, s, n) {
  const i = !Object.is(s, -0) && Number.isSafeInteger(s) && s <= Bt && s >= Nt ? Ge : yt;
  i === Ge ? xe.setInt32(0, s, !0) : xe.setFloat64(0, s, !0);
  const a = i === Ge ? Ar : wt;
  t[n++] = i;
  const u = g.encodeUTF8Into(t, e, n);
  return n = n + u, t[n++] = 0, t.set(a, n), n += a.byteLength, n;
}
function Rt(t, e, s, n) {
  t[n++] = pn;
  const o = g.encodeUTF8Into(t, e, n);
  return n += o, t[n++] = 0, xe.setBigInt64(0, s, !0), t.set(wt, n), n += wt.byteLength, n;
}
function rt(t, e, s, n) {
  t[n++] = fn;
  const o = g.encodeUTF8Into(t, e, n);
  return n = n + o, t[n++] = 0, n;
}
function Ut(t, e, s, n) {
  t[n++] = fs;
  const o = g.encodeUTF8Into(t, e, n);
  return n = n + o, t[n++] = 0, t[n++] = s ? 1 : 0, n;
}
function jt(t, e, s, n) {
  t[n++] = ds;
  const o = g.encodeUTF8Into(t, e, n);
  n = n + o, t[n++] = 0;
  const i = f.fromNumber(s.getTime()), a = i.getLowBits(), u = i.getHighBits();
  return t[n++] = a & 255, t[n++] = a >> 8 & 255, t[n++] = a >> 16 & 255, t[n++] = a >> 24 & 255, t[n++] = u & 255, t[n++] = u >> 8 & 255, t[n++] = u >> 16 & 255, t[n++] = u >> 24 & 255, n;
}
function Ct(t, e, s, n) {
  t[n++] = gt;
  const o = g.encodeUTF8Into(t, e, n);
  if (n = n + o, t[n++] = 0, s.source && s.source.match(vt) != null)
    throw new $("value " + s.source + " must not contain null bytes");
  return n = n + g.encodeUTF8Into(t, s.source, n), t[n++] = 0, s.ignoreCase && (t[n++] = 105), s.global && (t[n++] = 115), s.multiline && (t[n++] = 109), t[n++] = 0, n;
}
function Dt(t, e, s, n) {
  t[n++] = gt;
  const o = g.encodeUTF8Into(t, e, n);
  if (n = n + o, t[n++] = 0, s.pattern.match(vt) != null)
    throw new $("pattern " + s.pattern + " must not contain null bytes");
  n = n + g.encodeUTF8Into(t, s.pattern, n), t[n++] = 0;
  const i = s.options.split("").sort().join("");
  return n = n + g.encodeUTF8Into(t, i, n), t[n++] = 0, n;
}
function Mt(t, e, s, n) {
  s === null ? t[n++] = fn : s._bsontype === "MinKey" ? t[n++] = gs : t[n++] = _s;
  const o = g.encodeUTF8Into(t, e, n);
  return n = n + o, t[n++] = 0, n;
}
function Ft(t, e, s, n) {
  t[n++] = cs;
  const o = g.encodeUTF8Into(t, e, n);
  if (n = n + o, t[n++] = 0, Ee(s.id))
    t.set(s.id.subarray(0, 12), n);
  else
    throw new $("object [" + JSON.stringify(s) + "] is not a valid ObjectId");
  return n + 12;
}
function Lt(t, e, s, n) {
  t[n++] = cn;
  const o = g.encodeUTF8Into(t, e, n);
  n = n + o, t[n++] = 0;
  const i = s.length;
  return t[n++] = i & 255, t[n++] = i >> 8 & 255, t[n++] = i >> 16 & 255, t[n++] = i >> 24 & 255, t[n++] = Yo, t.set(s, n), n = n + i, n;
}
function Pt(t, e, s, n, o, i, a, u, r) {
  if (r.has(s))
    throw new $("Cannot convert circular structure to BSON");
  r.add(s), t[n++] = Array.isArray(s) ? us : un;
  const h = g.encodeUTF8Into(t, e, n);
  n = n + h, t[n++] = 0;
  const c = at(t, s, o, n, i + 1, a, u, r);
  return r.delete(s), c;
}
function zt(t, e, s, n) {
  t[n++] = ys;
  const o = g.encodeUTF8Into(t, e, n);
  return n = n + o, t[n++] = 0, t.set(s.bytes.subarray(0, 16), n), n + 16;
}
function Ht(t, e, s, n) {
  t[n++] = s._bsontype === "Long" ? pn : ms;
  const o = g.encodeUTF8Into(t, e, n);
  n = n + o, t[n++] = 0;
  const i = s.getLowBits(), a = s.getHighBits();
  return t[n++] = i & 255, t[n++] = i >> 8 & 255, t[n++] = i >> 16 & 255, t[n++] = i >> 24 & 255, t[n++] = a & 255, t[n++] = a >> 8 & 255, t[n++] = a >> 16 & 255, t[n++] = a >> 24 & 255, n;
}
function Jt(t, e, s, n) {
  s = s.valueOf(), t[n++] = Ge;
  const o = g.encodeUTF8Into(t, e, n);
  return n = n + o, t[n++] = 0, t[n++] = s & 255, t[n++] = s >> 8 & 255, t[n++] = s >> 16 & 255, t[n++] = s >> 24 & 255, n;
}
function qt(t, e, s, n) {
  t[n++] = yt;
  const o = g.encodeUTF8Into(t, e, n);
  return n = n + o, t[n++] = 0, xe.setFloat64(0, s.value, !0), t.set(wt, n), n = n + 8, n;
}
function Wt(t, e, s, n) {
  t[n++] = dn;
  const o = g.encodeUTF8Into(t, e, n);
  n = n + o, t[n++] = 0;
  const i = s.toString(), a = g.encodeUTF8Into(t, i, n + 4) + 1;
  return t[n] = a & 255, t[n + 1] = a >> 8 & 255, t[n + 2] = a >> 16 & 255, t[n + 3] = a >> 24 & 255, n = n + 4 + a - 1, t[n++] = 0, n;
}
function Yt(t, e, s, n, o = !1, i = 0, a = !1, u = !0, r) {
  if (s.scope && typeof s.scope == "object") {
    t[n++] = hs;
    const h = g.encodeUTF8Into(t, e, n);
    n = n + h, t[n++] = 0;
    let c = n;
    const l = s.code;
    n = n + 4;
    const p = g.encodeUTF8Into(t, l, n + 4) + 1;
    t[n] = p & 255, t[n + 1] = p >> 8 & 255, t[n + 2] = p >> 16 & 255, t[n + 3] = p >> 24 & 255, t[n + 4 + p - 1] = 0, n = n + p + 4;
    const v = at(t, s.scope, o, n, i + 1, a, u, r);
    n = v - 1;
    const w = v - c;
    t[c++] = w & 255, t[c++] = w >> 8 & 255, t[c++] = w >> 16 & 255, t[c++] = w >> 24 & 255, t[n++] = 0;
  } else {
    t[n++] = dn;
    const h = g.encodeUTF8Into(t, e, n);
    n = n + h, t[n++] = 0;
    const c = s.code.toString(), l = g.encodeUTF8Into(t, c, n + 4) + 1;
    t[n] = l & 255, t[n + 1] = l >> 8 & 255, t[n + 2] = l >> 16 & 255, t[n + 3] = l >> 24 & 255, n = n + 4 + l - 1, t[n++] = 0;
  }
  return n;
}
function Zt(t, e, s, n) {
  t[n++] = cn;
  const o = g.encodeUTF8Into(t, e, n);
  n = n + o, t[n++] = 0;
  const i = s.buffer;
  let a = s.position;
  return s.sub_type === J.SUBTYPE_BYTE_ARRAY && (a = a + 4), t[n++] = a & 255, t[n++] = a >> 8 & 255, t[n++] = a >> 16 & 255, t[n++] = a >> 24 & 255, t[n++] = s.sub_type, s.sub_type === J.SUBTYPE_BYTE_ARRAY && (a = a - 4, t[n++] = a & 255, t[n++] = a >> 8 & 255, t[n++] = a >> 16 & 255, t[n++] = a >> 24 & 255), t.set(i, n), n = n + s.position, n;
}
function Gt(t, e, s, n) {
  t[n++] = ps;
  const o = g.encodeUTF8Into(t, e, n);
  n = n + o, t[n++] = 0;
  const i = g.encodeUTF8Into(t, s.value, n + 4) + 1;
  return t[n] = i & 255, t[n + 1] = i >> 8 & 255, t[n + 2] = i >> 16 & 255, t[n + 3] = i >> 24 & 255, n = n + 4 + i - 1, t[n++] = 0, n;
}
function Kt(t, e, s, n, o, i, a) {
  t[n++] = un;
  const u = g.encodeUTF8Into(t, e, n);
  n = n + u, t[n++] = 0;
  let r = n, h = {
    $ref: s.collection || s.namespace,
    $id: s.oid
  };
  s.db != null && (h.$db = s.db), h = Object.assign(h, s.fields);
  const c = at(t, h, !1, n, o + 1, i, !0, a), l = c - r;
  return t[r++] = l & 255, t[r++] = l >> 8 & 255, t[r++] = l >> 16 & 255, t[r++] = l >> 24 & 255, c;
}
function at(t, e, s, n, o, i, a, u) {
  if (u == null) {
    if (e == null)
      return t[0] = 5, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, 5;
    if (Array.isArray(e))
      throw new $("serialize does not support an array as the root input");
    if (typeof e != "object")
      throw new $("serialize does not support non-object as the root input");
    if ("_bsontype" in e && typeof e._bsontype == "string")
      throw new $("BSON types cannot be serialized as a document");
    if (Ye(e) || We(e) || Ee(e) || ns(e))
      throw new $("date, regexp, typedarray, and arraybuffer cannot be BSON documents");
    u = /* @__PURE__ */ new Set();
  }
  u.add(e);
  let r = n + 4;
  if (Array.isArray(e))
    for (let c = 0; c < e.length; c++) {
      const l = `${c}`;
      let p = e[c];
      if (typeof (p == null ? void 0 : p.toBSON) == "function" && (p = p.toBSON()), typeof p == "string")
        r = At(t, l, p, r);
      else if (typeof p == "number")
        r = Vt(t, l, p, r);
      else if (typeof p == "bigint")
        r = Rt(t, l, p, r);
      else if (typeof p == "boolean")
        r = Ut(t, l, p, r);
      else if (p instanceof Date || Ye(p))
        r = jt(t, l, p, r);
      else if (p === void 0)
        r = rt(t, l, p, r);
      else if (p === null)
        r = rt(t, l, p, r);
      else if (Ee(p))
        r = Lt(t, l, p, r);
      else if (p instanceof RegExp || We(p))
        r = Ct(t, l, p, r);
      else if (typeof p == "object" && p._bsontype == null)
        r = Pt(t, l, p, r, s, o, i, a, u);
      else {
        if (typeof p == "object" && p[Symbol.for("@@mdb.bson.version")] !== De)
          throw new Me();
        if (p._bsontype === "ObjectId")
          r = Ft(t, l, p, r);
        else if (p._bsontype === "Decimal128")
          r = zt(t, l, p, r);
        else if (p._bsontype === "Long" || p._bsontype === "Timestamp")
          r = Ht(t, l, p, r);
        else if (p._bsontype === "Double")
          r = qt(t, l, p, r);
        else if (typeof p == "function" && i)
          r = Wt(t, l, p, r);
        else if (p._bsontype === "Code")
          r = Yt(t, l, p, r, s, o, i, a, u);
        else if (p._bsontype === "Binary")
          r = Zt(t, l, p, r);
        else if (p._bsontype === "BSONSymbol")
          r = Gt(t, l, p, r);
        else if (p._bsontype === "DBRef")
          r = Kt(t, l, p, r, o, i, u);
        else if (p._bsontype === "BSONRegExp")
          r = Dt(t, l, p, r);
        else if (p._bsontype === "Int32")
          r = Jt(t, l, p, r);
        else if (p._bsontype === "MinKey" || p._bsontype === "MaxKey")
          r = Mt(t, l, p, r);
        else if (typeof p._bsontype < "u")
          throw new $(`Unrecognized or invalid _bsontype: ${String(p._bsontype)}`);
      }
    }
  else if (e instanceof Map || ss(e)) {
    const c = e.entries();
    let l = !1;
    for (; !l; ) {
      const p = c.next();
      if (l = !!p.done, l)
        continue;
      const v = p.value[0];
      let w = p.value[1];
      typeof (w == null ? void 0 : w.toBSON) == "function" && (w = w.toBSON());
      const S = typeof w;
      if (typeof v == "string" && !Ln.has(v)) {
        if (v.match(vt) != null)
          throw new $("key " + v + " must not contain null bytes");
        if (s) {
          if (v[0] === "$")
            throw new $("key " + v + " must not start with '$'");
          if (~v.indexOf("."))
            throw new $("key " + v + " must not contain '.'");
        }
      }
      if (S === "string")
        r = At(t, v, w, r);
      else if (S === "number")
        r = Vt(t, v, w, r);
      else if (S === "bigint")
        r = Rt(t, v, w, r);
      else if (S === "boolean")
        r = Ut(t, v, w, r);
      else if (w instanceof Date || Ye(w))
        r = jt(t, v, w, r);
      else if (w === null || w === void 0 && a === !1)
        r = rt(t, v, w, r);
      else if (Ee(w))
        r = Lt(t, v, w, r);
      else if (w instanceof RegExp || We(w))
        r = Ct(t, v, w, r);
      else if (S === "object" && w._bsontype == null)
        r = Pt(t, v, w, r, s, o, i, a, u);
      else {
        if (typeof w == "object" && w[Symbol.for("@@mdb.bson.version")] !== De)
          throw new Me();
        if (w._bsontype === "ObjectId")
          r = Ft(t, v, w, r);
        else if (S === "object" && w._bsontype === "Decimal128")
          r = zt(t, v, w, r);
        else if (w._bsontype === "Long" || w._bsontype === "Timestamp")
          r = Ht(t, v, w, r);
        else if (w._bsontype === "Double")
          r = qt(t, v, w, r);
        else if (w._bsontype === "Code")
          r = Yt(t, v, w, r, s, o, i, a, u);
        else if (typeof w == "function" && i)
          r = Wt(t, v, w, r);
        else if (w._bsontype === "Binary")
          r = Zt(t, v, w, r);
        else if (w._bsontype === "BSONSymbol")
          r = Gt(t, v, w, r);
        else if (w._bsontype === "DBRef")
          r = Kt(t, v, w, r, o, i, u);
        else if (w._bsontype === "BSONRegExp")
          r = Dt(t, v, w, r);
        else if (w._bsontype === "Int32")
          r = Jt(t, v, w, r);
        else if (w._bsontype === "MinKey" || w._bsontype === "MaxKey")
          r = Mt(t, v, w, r);
        else if (typeof w._bsontype < "u")
          throw new $(`Unrecognized or invalid _bsontype: ${String(w._bsontype)}`);
      }
    }
  } else {
    if (typeof (e == null ? void 0 : e.toBSON) == "function" && (e = e.toBSON(), e != null && typeof e != "object"))
      throw new $("toBSON function did not return an object");
    for (const c of Object.keys(e)) {
      let l = e[c];
      typeof (l == null ? void 0 : l.toBSON) == "function" && (l = l.toBSON());
      const p = typeof l;
      if (typeof c == "string" && !Ln.has(c)) {
        if (c.match(vt) != null)
          throw new $("key " + c + " must not contain null bytes");
        if (s) {
          if (c[0] === "$")
            throw new $("key " + c + " must not start with '$'");
          if (~c.indexOf("."))
            throw new $("key " + c + " must not contain '.'");
        }
      }
      if (p === "string")
        r = At(t, c, l, r);
      else if (p === "number")
        r = Vt(t, c, l, r);
      else if (p === "bigint")
        r = Rt(t, c, l, r);
      else if (p === "boolean")
        r = Ut(t, c, l, r);
      else if (l instanceof Date || Ye(l))
        r = jt(t, c, l, r);
      else if (l === void 0)
        a === !1 && (r = rt(t, c, l, r));
      else if (l === null)
        r = rt(t, c, l, r);
      else if (Ee(l))
        r = Lt(t, c, l, r);
      else if (l instanceof RegExp || We(l))
        r = Ct(t, c, l, r);
      else if (p === "object" && l._bsontype == null)
        r = Pt(t, c, l, r, s, o, i, a, u);
      else {
        if (typeof l == "object" && l[Symbol.for("@@mdb.bson.version")] !== De)
          throw new Me();
        if (l._bsontype === "ObjectId")
          r = Ft(t, c, l, r);
        else if (p === "object" && l._bsontype === "Decimal128")
          r = zt(t, c, l, r);
        else if (l._bsontype === "Long" || l._bsontype === "Timestamp")
          r = Ht(t, c, l, r);
        else if (l._bsontype === "Double")
          r = qt(t, c, l, r);
        else if (l._bsontype === "Code")
          r = Yt(t, c, l, r, s, o, i, a, u);
        else if (typeof l == "function" && i)
          r = Wt(t, c, l, r);
        else if (l._bsontype === "Binary")
          r = Zt(t, c, l, r);
        else if (l._bsontype === "BSONSymbol")
          r = Gt(t, c, l, r);
        else if (l._bsontype === "DBRef")
          r = Kt(t, c, l, r, o, i, u);
        else if (l._bsontype === "BSONRegExp")
          r = Dt(t, c, l, r);
        else if (l._bsontype === "Int32")
          r = Jt(t, c, l, r);
        else if (l._bsontype === "MinKey" || l._bsontype === "MaxKey")
          r = Mt(t, c, l, r);
        else if (typeof l._bsontype < "u")
          throw new $(`Unrecognized or invalid _bsontype: ${String(l._bsontype)}`);
      }
    }
  }
  u.delete(e), t[r++] = 0;
  const h = r - n;
  return t[n++] = h & 255, t[n++] = h >> 8 & 255, t[n++] = h >> 16 & 255, t[n++] = h >> 24 & 255, r;
}
function Vr(t) {
  return t != null && typeof t == "object" && "_bsontype" in t && typeof t._bsontype == "string";
}
const Rr = {
  $oid: K,
  $binary: J,
  $uuid: J,
  $symbol: He,
  $numberInt: Re,
  $numberDecimal: ce,
  $numberDouble: Ve,
  $numberLong: f,
  $minKey: ze,
  $maxKey: Pe,
  $regex: be,
  $regularExpression: be,
  $timestamp: ge
};
function Os(t, e = {}) {
  if (typeof t == "number") {
    const n = t <= Bt && t >= Nt, o = t <= os && t >= rs;
    if (e.relaxed || e.legacy)
      return t;
    if (Number.isInteger(t) && !Object.is(t, -0)) {
      if (n)
        return new Re(t);
      if (o)
        return e.useBigInt64 ? BigInt(t) : f.fromNumber(t);
    }
    return new Ve(t);
  }
  if (t == null || typeof t != "object")
    return t;
  if (t.$undefined)
    return null;
  const s = Object.keys(t).filter((n) => n.startsWith("$") && t[n] != null);
  for (let n = 0; n < s.length; n++) {
    const o = Rr[s[n]];
    if (o)
      return o.fromExtendedJSON(t, e);
  }
  if (t.$date != null) {
    const n = t.$date, o = /* @__PURE__ */ new Date();
    if (e.legacy)
      if (typeof n == "number")
        o.setTime(n);
      else if (typeof n == "string")
        o.setTime(Date.parse(n));
      else if (typeof n == "bigint")
        o.setTime(Number(n));
      else
        throw new bt(`Unrecognized type for EJSON date: ${typeof n}`);
    else if (typeof n == "string")
      o.setTime(Date.parse(n));
    else if (f.isLong(n))
      o.setTime(n.toNumber());
    else if (typeof n == "number" && e.relaxed)
      o.setTime(n);
    else if (typeof n == "bigint")
      o.setTime(Number(n));
    else
      throw new bt(`Unrecognized type for EJSON date: ${typeof n}`);
    return o;
  }
  if (t.$code != null) {
    const n = Object.assign({}, t);
    return t.$scope && (n.$scope = Os(t.$scope)), Ne.fromExtendedJSON(t);
  }
  if (vs(t) || t.$dbPointer) {
    const n = t.$ref ? t : t.$dbPointer;
    if (n instanceof $e)
      return n;
    const o = Object.keys(n).filter((a) => a.startsWith("$"));
    let i = !0;
    if (o.forEach((a) => {
      ["$ref", "$id", "$db"].indexOf(a) === -1 && (i = !1);
    }), i)
      return $e.fromExtendedJSON(n);
  }
  return t;
}
function Ur(t, e) {
  return t.map((s, n) => {
    e.seenObjects.push({ propertyName: `index ${n}`, obj: null });
    try {
      return Se(s, e);
    } finally {
      e.seenObjects.pop();
    }
  });
}
function Pn(t) {
  const e = t.toISOString();
  return t.getUTCMilliseconds() !== 0 ? e : e.slice(0, -5) + "Z";
}
function Se(t, e) {
  if (t instanceof Map || ss(t)) {
    const s = /* @__PURE__ */ Object.create(null);
    for (const [n, o] of t) {
      if (typeof n != "string")
        throw new $("Can only serialize maps with string keys");
      s[n] = o;
    }
    return Se(s, e);
  }
  if ((typeof t == "object" || typeof t == "function") && t !== null) {
    const s = e.seenObjects.findIndex((n) => n.obj === t);
    if (s !== -1) {
      const n = e.seenObjects.map((c) => c.propertyName), o = n.slice(0, s).map((c) => `${c} -> `).join(""), i = n[s], a = " -> " + n.slice(s + 1, n.length - 1).map((c) => `${c} -> `).join(""), u = n[n.length - 1], r = " ".repeat(o.length + i.length / 2), h = "-".repeat(a.length + (i.length + u.length) / 2 - 1);
      throw new $(`Converting circular structure to EJSON:
    ${o}${i}${a}${u}
    ${r}\\${h}/`);
    }
    e.seenObjects[e.seenObjects.length - 1].obj = t;
  }
  if (Array.isArray(t))
    return Ur(t, e);
  if (t === void 0)
    return null;
  if (t instanceof Date || Ye(t)) {
    const s = t.getTime(), n = s > -1 && s < 2534023188e5;
    return e.legacy ? e.relaxed && n ? { $date: t.getTime() } : { $date: Pn(t) } : e.relaxed && n ? { $date: Pn(t) } : { $date: { $numberLong: t.getTime().toString() } };
  }
  if (typeof t == "number" && (!e.relaxed || !isFinite(t))) {
    if (Number.isInteger(t) && !Object.is(t, -0)) {
      if (t >= Nt && t <= Bt)
        return { $numberInt: t.toString() };
      if (t >= rs && t <= os)
        return { $numberLong: t.toString() };
    }
    return { $numberDouble: Object.is(t, -0) ? "-0.0" : t.toString() };
  }
  if (typeof t == "bigint")
    return e.relaxed ? Number(BigInt.asIntN(64, t)) : { $numberLong: BigInt.asIntN(64, t).toString() };
  if (t instanceof RegExp || We(t)) {
    let s = t.flags;
    if (s === void 0) {
      const o = t.toString().match(/[gimuy]*$/);
      o && (s = o[0]);
    }
    return new be(t.source, s).toExtendedJSON(e);
  }
  return t != null && typeof t == "object" ? Cr(t, e) : t;
}
const jr = {
  Binary: (t) => new J(t.value(), t.sub_type),
  Code: (t) => new Ne(t.code, t.scope),
  DBRef: (t) => new $e(t.collection || t.namespace, t.oid, t.db, t.fields),
  Decimal128: (t) => new ce(t.bytes),
  Double: (t) => new Ve(t.value),
  Int32: (t) => new Re(t.value),
  Long: (t) => f.fromBits(t.low != null ? t.low : t.low_, t.low != null ? t.high : t.high_, t.low != null ? t.unsigned : t.unsigned_),
  MaxKey: () => new Pe(),
  MinKey: () => new ze(),
  ObjectId: (t) => new K(t),
  BSONRegExp: (t) => new be(t.pattern, t.options),
  BSONSymbol: (t) => new He(t.value),
  Timestamp: (t) => ge.fromBits(t.low, t.high)
};
function Cr(t, e) {
  if (t == null || typeof t != "object")
    throw new $("not an object instance");
  const s = t._bsontype;
  if (typeof s > "u") {
    const n = {};
    for (const o of Object.keys(t)) {
      e.seenObjects.push({ propertyName: o, obj: null });
      try {
        const i = Se(t[o], e);
        o === "__proto__" ? Object.defineProperty(n, o, {
          value: i,
          writable: !0,
          enumerable: !0,
          configurable: !0
        }) : n[o] = i;
      } finally {
        e.seenObjects.pop();
      }
    }
    return n;
  } else {
    if (t != null && typeof t == "object" && typeof t._bsontype == "string" && t[Symbol.for("@@mdb.bson.version")] !== De)
      throw new Me();
    if (Vr(t)) {
      let n = t;
      if (typeof n.toExtendedJSON != "function") {
        const o = jr[t._bsontype];
        if (!o)
          throw new $("Unrecognized or invalid _bsontype: " + t._bsontype);
        n = o(n);
      }
      return s === "Code" && n.scope ? n = new Ne(n.code, Se(n.scope, e)) : s === "DBRef" && n.oid && (n = new $e(Se(n.collection, e), Se(n.oid, e), Se(n.db, e), Se(n.fields, e))), n.toExtendedJSON(e);
    } else
      throw new $("_bsontype must be a string, but was: " + typeof s);
  }
}
function Bs(t, e) {
  const s = {
    useBigInt64: (e == null ? void 0 : e.useBigInt64) ?? !1,
    relaxed: (e == null ? void 0 : e.relaxed) ?? !0,
    legacy: (e == null ? void 0 : e.legacy) ?? !1
  };
  return JSON.parse(t, (n, o) => {
    if (n.indexOf("\0") !== -1)
      throw new $(`BSON Document field names cannot contain null bytes, found: ${JSON.stringify(n)}`);
    return Os(o, s);
  });
}
function Ns(t, e, s, n) {
  s != null && typeof s == "object" && (n = s, s = 0), e != null && typeof e == "object" && !Array.isArray(e) && (n = e, e = void 0, s = 0);
  const o = Object.assign({ relaxed: !0, legacy: !1 }, n, {
    seenObjects: [{ propertyName: "(root)", obj: null }]
  }), i = Se(t, o);
  return JSON.stringify(i, e, s);
}
function Dr(t, e) {
  return e = e || {}, JSON.parse(Ns(t, e));
}
function Mr(t, e) {
  return e = e || {}, Bs(JSON.stringify(t), e);
}
const Je = /* @__PURE__ */ Object.create(null);
Je.parse = Bs;
Je.stringify = Ns;
Je.serialize = Dr;
Je.deserialize = Mr;
Object.freeze(Je);
const ks = 1024 * 1024 * 17;
let Ie = g.allocate(ks);
function Es(t) {
  Ie.length < t && (Ie = g.allocate(t));
}
function Is(t, e = {}) {
  const s = typeof e.checkKeys == "boolean" ? e.checkKeys : !1, n = typeof e.serializeFunctions == "boolean" ? e.serializeFunctions : !1, o = typeof e.ignoreUndefined == "boolean" ? e.ignoreUndefined : !0, i = typeof e.minInternalBufferSize == "number" ? e.minInternalBufferSize : ks;
  Ie.length < i && (Ie = g.allocate(i));
  const a = at(Ie, t, s, 0, 0, n, o, null), u = g.allocate(a);
  return u.set(Ie.subarray(0, a), 0), u;
}
function Ts(t, e, s = {}) {
  const n = typeof s.checkKeys == "boolean" ? s.checkKeys : !1, o = typeof s.serializeFunctions == "boolean" ? s.serializeFunctions : !1, i = typeof s.ignoreUndefined == "boolean" ? s.ignoreUndefined : !0, a = typeof s.index == "number" ? s.index : 0, u = at(Ie, t, n, 0, 0, o, i, null);
  return e.set(Ie.subarray(0, u), a), a + u - 1;
}
function As(t, e = {}) {
  return Ss(g.toLocalBufferType(t), e);
}
function Vs(t, e = {}) {
  e = e || {};
  const s = typeof e.serializeFunctions == "boolean" ? e.serializeFunctions : !1, n = typeof e.ignoreUndefined == "boolean" ? e.ignoreUndefined : !0;
  return ft(t, s, n);
}
function Rs(t, e, s, n, o, i) {
  const a = Object.assign({ allowObjectSmallerThanBufferSize: !0, index: 0 }, i), u = g.toLocalBufferType(t);
  let r = e;
  for (let h = 0; h < s; h++) {
    const c = u[r] | u[r + 1] << 8 | u[r + 2] << 16 | u[r + 3] << 24;
    a.index = r, n[o + h] = Ss(u, a), r = r + c;
  }
  return r;
}
var Fr = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  BSONError: $,
  BSONRegExp: be,
  BSONRuntimeError: bt,
  BSONSymbol: He,
  BSONType: bs,
  BSONValue: pe,
  BSONVersionError: Me,
  Binary: J,
  Code: Ne,
  DBRef: $e,
  Decimal128: ce,
  Double: Ve,
  EJSON: Je,
  Int32: Re,
  Long: f,
  MaxKey: Pe,
  MinKey: ze,
  ObjectId: K,
  Timestamp: ge,
  UUID: ie,
  calculateObjectSize: Vs,
  deserialize: As,
  deserializeStream: Rs,
  serialize: Is,
  serializeWithBufferAndIndex: Ts,
  setInternalBufferSize: Es
});
G.BSON = Fr;
G.BSONError = $;
G.BSONRegExp = be;
G.BSONRuntimeError = bt;
G.BSONSymbol = He;
G.BSONType = bs;
G.BSONValue = pe;
G.BSONVersionError = Me;
G.Binary = J;
G.Code = Ne;
G.DBRef = $e;
G.Decimal128 = ce;
G.Double = Ve;
G.EJSON = Je;
G.Int32 = Re;
G.Long = f;
G.MaxKey = Pe;
G.MinKey = ze;
G.ObjectId = K;
G.Timestamp = ge;
G.UUID = ie;
G.calculateObjectSize = Vs;
G.deserialize = As;
G.deserializeStream = Rs;
G.serialize = Is;
G.serializeWithBufferAndIndex = Ts;
G.setInternalBufferSize = Es;
var Lr = de && de.__createBinding || (Object.create ? function(t, e, s, n) {
  n === void 0 && (n = s);
  var o = Object.getOwnPropertyDescriptor(e, s);
  (!o || ("get" in o ? !e.__esModule : o.writable || o.configurable)) && (o = { enumerable: !0, get: function() {
    return e[s];
  } }), Object.defineProperty(t, n, o);
} : function(t, e, s, n) {
  n === void 0 && (n = s), t[n] = e[s];
}), Pr = de && de.__setModuleDefault || (Object.create ? function(t, e) {
  Object.defineProperty(t, "default", { enumerable: !0, value: e });
} : function(t, e) {
  t.default = e;
}), zr = de && de.__importStar || function(t) {
  if (t && t.__esModule)
    return t;
  var e = {};
  if (t != null)
    for (var s in t)
      s !== "default" && Object.prototype.hasOwnProperty.call(t, s) && Lr(e, t, s);
  return Pr(e, t), e;
};
Object.defineProperty(Qe, "__esModule", { value: !0 });
Qe.deserialize = Qe.serialize = void 0;
const Us = zr(G), Hr = (...t) => Buffer.from(Us.serialize(...t)).toString("latin1");
Qe.serialize = Hr;
const Jr = (t) => Us.deserialize(new Uint8Array(Array.from(t).map((e) => e.charCodeAt(0))));
Qe.deserialize = Jr;
var kt = {};
Object.defineProperty(kt, "__esModule", { value: !0 });
kt.getReferencedCollection = void 0;
const qr = (t) => {
  const s = [
    t == null ? void 0 : t.items,
    t == null ? void 0 : t.additionalProperties,
    t
  ].find((n) => !!n);
  return s != null && s.$ref ? { ...t, ...s } : null;
};
kt.getReferencedCollection = qr;
var js = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.formatValue = void 0;
  const e = Le, s = (n, o, i, a) => {
    if (Array.isArray(n))
      return n.map((h) => (0, t.formatValue)(h, o, i)).join(", ");
    const u = (() => {
      var h;
      if (i != null && i.s$isReference) {
        const c = a || ((h = i.s$indexes) == null ? void 0 : h[0]);
        return c && (n == null ? void 0 : n[c]);
      }
      return n instanceof Object ? Object.values(n)[0] : n;
    })(), r = (() => {
      switch (!0) {
        case ["date", "date-time"].includes(i == null ? void 0 : i.format):
          return (0, e.formatDateTime)(String(n), i.format === "date-time");
        case (i == null ? void 0 : i.type) === "boolean":
          return u ? "true" : "false";
        case [void 0, null].includes(u):
          return "-";
        default:
          return u;
      }
    })();
    return String(r);
  };
  t.formatValue = s;
})(js);
var Cs = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.unsafe = t.unpack = t.isOk = t.isError = t.ok = t.error = t.unwrapEither = t.isRight = t.isLeft = t.right = t.left = void 0;
  const e = (u) => ({
    _tag: "Left",
    value: u
  });
  t.left = e;
  const s = (u) => ({
    _tag: "Right",
    value: u
  });
  t.right = s;
  const n = (u) => u._tag === "Left";
  t.isLeft = n;
  const o = (u) => u._tag === "Right";
  t.isRight = o;
  const i = (u) => u.value;
  t.unwrapEither = i, t.error = t.left, t.ok = t.right, t.isError = t.isLeft, t.isOk = t.isRight, t.unpack = t.unwrapEither;
  const a = (u, r) => {
    if (u._tag !== "Right")
      throw new Error(`unsafe threw: ${u.value} (${r || "-"})`);
    return u.value;
  };
  t.unsafe = a;
})(Cs);
(function(t) {
  var e = de && de.__createBinding || (Object.create ? function(n, o, i, a) {
    a === void 0 && (a = i);
    var u = Object.getOwnPropertyDescriptor(o, i);
    (!u || ("get" in u ? !o.__esModule : u.writable || u.configurable)) && (u = { enumerable: !0, get: function() {
      return o[i];
    } }), Object.defineProperty(n, a, u);
  } : function(n, o, i, a) {
    a === void 0 && (a = i), n[a] = o[i];
  }), s = de && de.__exportStar || function(n, o) {
    for (var i in n)
      i !== "default" && !Object.prototype.hasOwnProperty.call(o, i) && e(o, n, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), s($t, t), s(es, t), s(Le, t), s(Be, t), s(Qe, t), s(kt, t), s(js, t), s(Cs, t);
})(mt);
/*!
 * maska v1.5.2
 * (c) 2019-2022 Alexander Shabunevich
 * Released under the MIT License.
 */
function zn(t, e) {
  var s = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), s.push.apply(s, n);
  }
  return s;
}
function pt(t) {
  for (var e = 1; e < arguments.length; e++) {
    var s = arguments[e] != null ? arguments[e] : {};
    e % 2 ? zn(Object(s), !0).forEach(function(n) {
      Zr(t, n, s[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(s)) : zn(Object(s)).forEach(function(n) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(s, n));
    });
  }
  return t;
}
function Wr(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Yr(t, e) {
  for (var s = 0; s < e.length; s++) {
    var n = e[s];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, Ds(n.key), n);
  }
}
function Zr(t, e, s) {
  return (e = Ds(e)) in t ? Object.defineProperty(t, e, { value: s, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = s, t;
}
function Ds(t) {
  var e = function(s, n) {
    if (typeof s != "object" || s === null)
      return s;
    var o = s[Symbol.toPrimitive];
    if (o !== void 0) {
      var i = o.call(s, n || "default");
      if (typeof i != "object")
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (n === "string" ? String : Number)(s);
  }(t, "string");
  return typeof e == "symbol" ? e : String(e);
}
var Ms = { "#": { pattern: /[0-9]/ }, X: { pattern: /[0-9a-zA-Z]/ }, S: { pattern: /[a-zA-Z]/ }, A: { pattern: /[a-zA-Z]/, uppercase: !0 }, a: { pattern: /[a-zA-Z]/, lowercase: !0 }, "!": { escape: !0 }, "*": { repeat: !0 } };
function Hn(t, e) {
  var s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ms, n = !(arguments.length > 3 && arguments[3] !== void 0) || arguments[3];
  return Fs(e).length > 1 ? Gr(e)(t, e, s, n) : en(t, e, s, n);
}
function Fs(t) {
  try {
    return JSON.parse(t);
  } catch {
    return [t];
  }
}
function Gr(t) {
  var e = Fs(t).sort(function(n, o) {
    return n.length - o.length;
  });
  return function(n, o, i) {
    var a = !(arguments.length > 3 && arguments[3] !== void 0) || arguments[3], u = e.map(function(c) {
      return en(n, c, i, !1);
    }), r = u.pop();
    for (var h in e)
      if (s(r, e[h], i))
        return en(n, e[h], i, a);
    return "";
  };
  function s(n, o, i) {
    for (var a in i)
      i[a].escape && (o = o.replace(new RegExp(a + ".{1}", "g"), ""));
    return o.split("").filter(function(u) {
      return i[u] && i[u].pattern;
    }).length >= n.length;
  }
}
function en(t, e, s) {
  for (var n = !(arguments.length > 3 && arguments[3] !== void 0) || arguments[3], o = 0, i = 0, a = "", u = ""; o < e.length && i < t.length; ) {
    var r = e[o], h = t[i], c = s[r];
    if (c && c.pattern)
      c.pattern.test(h) && (a += Kr(h, c), o++, n && e[o] && (s[e[o]] ? s[e[o]] && s[e[o]].escape && (a += e[o + 1], o += 2) : (a += e[o], o++))), i++;
    else if (c && c.repeat) {
      var l = s[e[o - 1]];
      l && !l.pattern.test(h) ? o++ : o--;
    } else
      c && c.escape && (r = e[++o]), n && (a += r), h === r && i++, o++;
  }
  for (; n && o < e.length; ) {
    var p = e[o];
    if (s[p]) {
      u = "";
      break;
    }
    u += p, o++;
  }
  return a + u;
}
function Kr(t, e) {
  return e.transform && (t = e.transform(t)), e.uppercase ? t.toLocaleUpperCase() : e.lowercase ? t.toLocaleLowerCase() : t;
}
function Jn(t) {
  return t instanceof HTMLInputElement ? t : t.querySelector("input") || t;
}
function tn(t) {
  return Object.prototype.toString.call(t) === "[object String]";
}
var Xr = function() {
  function t(n) {
    var o = this, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (Wr(this, t), !n)
      throw new Error("Maska: no element for mask");
    if (i.preprocessor != null && typeof i.preprocessor != "function")
      throw new Error("Maska: preprocessor must be a function");
    if (i.tokens)
      for (var a in i.tokens)
        i.tokens[a] = pt({}, i.tokens[a]), i.tokens[a].pattern && tn(i.tokens[a].pattern) && (i.tokens[a].pattern = new RegExp(i.tokens[a].pattern));
    this._opts = { mask: i.mask, tokens: pt(pt({}, Ms), i.tokens), preprocessor: i.preprocessor }, this._el = tn(n) ? document.querySelectorAll(n) : n.length ? n : [n], this.inputEvent = function(u) {
      return o.updateValue(u.target, u);
    }, this.init();
  }
  var e, s;
  return e = t, s = [{ key: "init", value: function() {
    for (var n = this, o = function(a) {
      var u = Jn(n._el[a]);
      !n._opts.mask || u.dataset.mask && u.dataset.mask === n._opts.mask || (u.dataset.mask = n._opts.mask), setTimeout(function() {
        return n.updateValue(u);
      }, 0), u.dataset.maskInited || (u.dataset.maskInited = !0, u.addEventListener("input", n.inputEvent), u.addEventListener("beforeinput", n.beforeInput));
    }, i = 0; i < this._el.length; i++)
      o(i);
  } }, { key: "destroy", value: function() {
    for (var n = 0; n < this._el.length; n++) {
      var o = Jn(this._el[n]);
      o.removeEventListener("input", this.inputEvent), o.removeEventListener("beforeinput", this.beforeInput), delete o.dataset.mask, delete o.dataset.maskInited;
    }
  } }, { key: "updateValue", value: function(n, o) {
    if (n && n.type) {
      var i = n.type.match(/^number$/i) && n.validity.badInput;
      if (!n.value && !i || !n.dataset.mask)
        return n.dataset.maskRawValue = "", void this.dispatch("maska", n, o);
      var a = n.selectionEnd, u = n.value, r = u[a - 1];
      n.dataset.maskRawValue = Hn(n.value, n.dataset.mask, this._opts.tokens, !1);
      var h = n.value;
      this._opts.preprocessor && (h = this._opts.preprocessor(h)), n.value = Hn(h, n.dataset.mask, this._opts.tokens), o && o.inputType === "insertText" && a === u.length && (a = n.value.length), function(c, l, p) {
        for (; l && l < c.value.length && c.value.charAt(l - 1) !== p; )
          l++;
        (c.type ? c.type.match(/^(text|search|password|tel|url)$/i) : !c.type) && c === document.activeElement && (c.setSelectionRange(l, l), setTimeout(function() {
          c.setSelectionRange(l, l);
        }, 0));
      }(n, a, r), this.dispatch("maska", n, o), n.value !== u && this.dispatch("input", n, o);
    }
  } }, { key: "beforeInput", value: function(n) {
    n && n.target && n.target.type && n.target.type.match(/^number$/i) && n.data && isNaN(n.target.value + n.data) && n.preventDefault();
  } }, { key: "dispatch", value: function(n, o, i) {
    o.dispatchEvent(function(a) {
      var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null, r = document.createEvent("Event");
      return r.initEvent(a, !0, !0), u && (r.inputType = u), r;
    }(n, i && i.inputType || null));
  } }], s && Yr(e.prototype, s), Object.defineProperty(e, "prototype", { writable: !1 }), t;
}(), Xt, Ls = (Xt = /* @__PURE__ */ new WeakMap(), function(t, e) {
  e.value && (Xt.has(t) && !function(s) {
    return !(tn(s.value) && s.value === s.oldValue || Array.isArray(s.value) && JSON.stringify(s.value) === JSON.stringify(s.oldValue) || s.value && s.value.mask && s.oldValue && s.oldValue.mask && s.value.mask === s.oldValue.mask);
  }(e) || Xt.set(t, new Xr(t, function(s) {
    var n = {};
    return s.mask ? (n.mask = Array.isArray(s.mask) ? JSON.stringify(s.mask) : s.mask, n.tokens = s.tokens ? pt({}, s.tokens) : {}, n.preprocessor = s.preprocessor) : n.mask = Array.isArray(s) ? JSON.stringify(s) : s, n;
  }(e.value))));
});
function Qr(t) {
  t.directive("maska", Ls);
}
typeof window < "u" && window.Vue && window.Vue.use && window.Vue.use(Qr);
const xr = { class: "info__content" }, ei = /* @__PURE__ */ W({
  __name: "sv-info",
  props: {
    where: {}
  },
  setup(t) {
    const e = t, s = X(!1), n = e.where || "top";
    return (o, i) => (d(), b("div", {
      class: "info",
      onMouseleave: i[1] || (i[1] = (a) => s.value = !1)
    }, [
      s.value ? (d(), b("div", {
        key: 0,
        class: x(`
        info__bubble
        info__bubble--${y(n)}
    `)
      }, [
        C("div", xr, [
          j(o.$slots, "text", {}, void 0, !0)
        ])
      ], 2)) : I("", !0),
      C("div", {
        onMouseover: i[0] || (i[0] = (a) => s.value = !0)
      }, [
        o.$slots.default ? j(o.$slots, "default", { key: 0 }, void 0, !0) : j(o.$slots, "default", { key: 1 }, void 0, !0)
      ], 32)
    ], 32));
  }
});
const ht = /* @__PURE__ */ Q(ei, [["__scopeId", "data-v-9569706e"]]), ti = {
  key: 0,
  class: "input__label"
}, ni = {
  key: 1,
  class: "input__hint"
}, si = ["value"], oi = {
  key: 1,
  class: "input__clipboard"
}, ri = ["placeholder", "readonly"], ii = {
  inheritAttrs: !1
}, li = /* @__PURE__ */ W({
  ...ii,
  __name: "sv-input",
  props: {
    modelValue: {},
    property: {},
    propertyName: {},
    parentCollection: {},
    variant: {},
    bordered: { type: Boolean }
  },
  emits: ["update:modelValue", "input", "change"],
  setup(t, { emit: e }) {
    const s = t, n = s.property || {}, o = s.bordered || le("inputBordered", !1), i = le("searchOnly", !1), a = le("innerInputLabel", !1), u = !i && n.readOnly, r = to(), h = X(null), c = X(0), l = le("inputVariant", s.variant) || "normal", { s$icon: p, s$mask: v, readOnly: w } = n, S = {
      type: (() => {
        if (["number", "integer"].includes(n.type))
          return "number";
        if (n.s$inputType)
          return n.s$inputType;
        switch (typeof s.modelValue) {
          case "string":
            return "text";
          case "number":
            return "number";
          default:
            return "text";
        }
      })(),
      placeholder: a ? n.description || s.propertyName : n.s$placeholder,
      min: n.minimum || n.exclusiveMinimum,
      max: n.maximum || n.exclusiveMaximum
    };
    S.name = s.propertyName, S.readonly = u, ["date", "date-time"].includes(n.format) && (S.type = !i && n.format === "date-time" ? "datetime-local" : "date"), S.type === "text" && i && (S.type = "search");
    const Y = () => {
      try {
        return new Date(s.modelValue).toISOString().split("T").shift();
      } catch {
        return "";
      }
    }, N = X(["date", "date-time"].includes(S.type) ? Y() : s.modelValue || ""), V = (m) => {
      const T = (() => {
        if (S.type === "number")
          return Number(m);
        switch (n.format) {
          case "date":
          case "date-time":
            return new Date(m);
          default:
            return m;
        }
      })();
      e("input", T), e("update:modelValue", T);
    }, H = (m, T) => {
      var E, _;
      if (!T && ((E = m.target.dataset) != null && E.maskRawValue))
        return;
      N.value = m.target.value;
      const z = T ? (_ = m.target.dataset) == null ? void 0 : _.maskRawValue : m.target.value;
      if (n.type === "number" && !z) {
        V(0);
        return;
      }
      V(z);
    };
    return Oe(() => s.modelValue, (m, T) => {
      T && !m && (N.value = n.type === "number" ? 0 : "", n.s$mask && (c.value += 1));
    }), (m, T) => {
      const z = ae("focus"), E = ae("clickable");
      return d(), b("label", {
        key: c.value,
        class: "input"
      }, [
        y(a) ? I("", !0) : (d(), b("div", ti, [
          m.$slots.default ? j(m.$slots, "default", { key: 0 }, void 0, !0) : j(m.$slots, "description", { key: 1 }, void 0, !0)
        ])),
        m.$slots.hint ? (d(), b("div", ni, [
          j(m.$slots, "hint", {}, void 0, !0)
        ])) : I("", !0),
        y(n).s$element !== "textarea" ? (d(), b("div", {
          key: 2,
          class: x(`
        input__container
        input__container--${y(l)}
        ${y(o) && "input__container--bordered"}
    `)
        }, [
          se(C("input", q(S, {
            ref_key: "input",
            ref: h,
            value: N.value,
            "data-component": "input",
            class: `
          input__input
          input__input--${y(l)}
          ${y(p) && "input__input--icon"}
          ${y(u) && "input__input--readOnly"}
        `,
            onMaska: T[0] || (T[0] = (_) => H(_, !0)),
            onInput: H,
            onChange: T[1] || (T[1] = (_) => e("change", _))
          }), null, 16, si), [
            [y(Ls), y(v)],
            [z, c.value > 0 || y(n).s$focus]
          ]),
          y(p) ? (d(), D(te, {
            key: 0,
            name: y(p),
            class: x(`
          input__icon
          input__icon--${y(l)}
      `)
          }, null, 8, ["name", "class"])) : I("", !0),
          y(u) ? (d(), b("div", oi, [
            F(ht, null, {
              text: A(() => [
                oe("Copiar")
              ]),
              default: A(() => [
                se(F(te, {
                  name: "clipboard",
                  onClick: T[2] || (T[2] = (_) => y(r)(m.modelValue))
                }, null, 512), [
                  [E]
                ])
              ]),
              _: 1
            })
          ])) : I("", !0)
        ], 2)) : (d(), b("div", {
          key: 3,
          class: x(`
        input__container
        input__container--${y(l)}
        ${y(o) && "input__container--bordered"}
    `)
        }, [
          se((d(), b("textarea", {
            placeholder: S.placeholder,
            readonly: y(u),
            class: x(`
          input__textarea
          input__input--${y(l)}
        `),
            onInput: H
          }, [
            oe(M(m.modelValue), 1)
          ], 42, ri)), [
            [z, c.value > 0 || y(n).s$focus]
          ])
        ], 2))
      ]);
    };
  }
});
const lt = /* @__PURE__ */ Q(li, [["__scopeId", "data-v-c4bba12e"]]), ai = ["value"], ui = { value: "" }, ci = ["value"], fi = {
  inheritAttrs: !1
}, di = /* @__PURE__ */ W({
  ...fi,
  __name: "sv-select",
  props: {
    modelValue: {},
    property: {},
    propertyName: {},
    parentCollection: {},
    booleanRef: { type: Boolean }
  },
  emits: ["update:modelValue", "change"],
  setup(t, { emit: e }) {
    const s = t, n = s.property || {}, o = (a) => {
      s.booleanRef && (i.value = a), e("update:modelValue", (a == null ? void 0 : a._id) || a), e("change", (a == null ? void 0 : a._id) || a);
    }, i = s.booleanRef ? (() => {
      const a = X(s.modelValue);
      return Z({
        get: () => a.value === "true" ? !0 : a.value === "false" ? !1 : null,
        set: (r) => {
          a.value = r;
        }
      });
    })() : Z({
      get: () => s.modelValue,
      set: o
    });
    return (a, u) => {
      var r, h;
      return d(), b("select", {
        ref: "select",
        class: "select",
        key: ((r = y(i)) == null ? void 0 : r._id) || y(i),
        value: ((h = y(i)) == null ? void 0 : h._id) || y(i),
        onClick: u[0] || (u[0] = Xn((c) => a.void, ["stop"])),
        onChange: u[1] || (u[1] = (c) => o(c.target.value))
      }, [
        C("option", ui, M(a.$t("none")), 1),
        (d(!0), b(re, null, ee(y(n).enum, (c) => (d(), b("option", {
          key: c,
          value: c
        }, M(y(n).s$translate ? a.$t(c) : c), 9, ci))), 128)),
        j(a.$slots, "default", {}, void 0, !0)
      ], 40, ai);
    };
  }
});
const hn = /* @__PURE__ */ Q(di, [["__scopeId", "data-v-2ff711ea"]]), pi = { class: "pagination" }, hi = { class: "pagination__control" }, mi = ["value"], yi = { class: "pagination__control" }, gi = { class: "pagination__page-input" }, _i = /* @__PURE__ */ W({
  __name: "sv-pagination",
  props: {
    collection: {}
  },
  setup(t) {
    const s = Ae(t.collection), n = Z({
      get: () => Math.floor(s.pagination.offset / s.pagination.limit),
      set: (h) => {
        s.pagination.offset = h * s.pagination.limit;
      }
    }), o = Z({
      get: () => s.pagination.limit,
      set: (h) => {
        s.pagination.limit = Number(h);
      }
    }), i = X(n.value ? n.value + 1 : 1), a = Z(() => Math.ceil(s.pagination.recordsTotal / s.pagination.limit)), u = (h) => {
      window.scrollTo(0, 0), n.value = h === "previous" ? n.value - 1 : n.value + 1;
    }, r = () => s.filter({
      project: [
        ...Object.keys(s.properties),
        ...s.tableMeta
      ]
    });
    return Oe([n, o], ([h]) => {
      i.value = h + 1, r();
    }), (h, c) => (d(), b("div", pi, [
      C("div", hi, [
        F(hn, {
          modelValue: o.value,
          "onUpdate:modelValue": c[0] || (c[0] = (l) => o.value = l),
          property: {}
        }, {
          default: A(() => [
            (d(!0), b(re, null, ee(y(no), (l) => (d(), b("option", {
              key: `limit-${l}`,
              value: l
            }, M(l), 9, mi))), 128))
          ]),
          _: 1
        }, 8, ["modelValue"]),
        F(te, {
          name: "list-ul",
          fill: "gray",
          style: { "margin-left": ".8rem" }
        })
      ]),
      C("div", yi, [
        F(je, {
          onClick: c[1] || (c[1] = (l) => n.value = 0)
        }, {
          default: A(() => [
            F(te, {
              reactive: "",
              name: "angle-double-left"
            })
          ]),
          _: 1
        }),
        F(je, {
          disabled: y(s).loading.getAll || n.value === 0,
          onClick: c[2] || (c[2] = (l) => u("previous"))
        }, {
          default: A(() => [
            F(te, {
              reactive: "",
              name: "angle-left"
            })
          ]),
          _: 1
        }, 8, ["disabled"]),
        C("div", gi, [
          (d(), D(lt, {
            bordered: "",
            modelValue: i.value,
            "onUpdate:modelValue": c[3] || (c[3] = (l) => i.value = l),
            key: n.value,
            property: {
              type: "number",
              minimum: 1
            },
            onChange: c[4] || (c[4] = (l) => n.value = i.value === 0 ? 0 : i.value - 1)
          }, null, 8, ["modelValue"])),
          C("span", null, M(h.$t("of")) + " " + M(a.value), 1)
        ]),
        F(je, {
          disabled: y(s).loading.getAll || n.value >= a.value - 1,
          onClick: c[5] || (c[5] = (l) => u("next"))
        }, {
          default: A(() => [
            F(te, {
              reactive: "",
              name: "angle-right"
            })
          ]),
          _: 1
        }, 8, ["disabled"]),
        F(je, {
          onClick: c[6] || (c[6] = (l) => n.value = a.value - 1)
        }, {
          default: A(() => [
            F(te, {
              reactive: "",
              name: "angle-double-right"
            })
          ]),
          _: 1
        })
      ])
    ]));
  }
});
const bi = /* @__PURE__ */ Q(_i, [["__scopeId", "data-v-f58d84ba"]]), Ps = (t) => (nn("data-v-6a10f145"), t = t(), sn(), t), vi = { class: "picture" }, wi = {
  key: 0,
  style: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
}, $i = ["src"], Si = {
  key: 0,
  class: "picture__meta"
}, Oi = ["src"], Bi = /* @__PURE__ */ Ps(() => /* @__PURE__ */ C("line", {
  x1: "0",
  y1: "0",
  x2: "200",
  y2: "200",
  stroke: "#000",
  "vector-effect": "non-scaling-stroke"
}, null, -1)), Ni = /* @__PURE__ */ Ps(() => /* @__PURE__ */ C("line", {
  x1: "200",
  y1: "0",
  x2: "0",
  y2: "200",
  stroke: "#000",
  "vector-effect": "non-scaling-stroke"
}, null, -1)), ki = [
  Bi,
  Ni
], Ei = { key: 4 }, Ii = /* @__PURE__ */ W({
  __name: "sv-picture",
  props: {
    url: {},
    fileId: {},
    modelValue: {},
    objectFit: {},
    bordered: { type: Boolean },
    width: {},
    height: {},
    expandable: { type: Boolean },
    meta: {}
  },
  setup(t) {
    const e = t, s = Z(() => e.fileId ? `${so}/file/${e.fileId}/picture` : e.url || e.modelValue), n = X(!1);
    return (o, i) => {
      const a = ae("overlay");
      return d(), b("figure", vi, [
        (d(), D(Kn, { to: "#app" }, [
          n.value ? se((d(), b("div", wi, [
            C("img", {
              src: s.value,
              style: `
            max-height: 60vh;
            object-fit: contain;
          `,
              onClick: i[0] || (i[0] = (u) => n.value = !0)
            }, null, 8, $i),
            o.meta ? (d(), b("div", Si, " Criado por " + M(o.meta.owner.full_name) + " em " + M(o.formatDateTime(o.meta.created_at, !0)), 1)) : I("", !0)
          ])), [
            [a, {
              click: () => {
                n.value = !1;
              }
            }]
          ]) : I("", !0)
        ])),
        s.value ? (d(), b("img", {
          key: 0,
          src: s.value,
          class: x(`
        picture__image
        ${o.bordered && "picture__image--bordered"}
        ${o.expandable && "picture__image--expandable"}
      `),
          style: Xe(`
        object-fit: ${o.objectFit || "cover"};
        width: ${o.width || "100%"};
        height: ${o.height || "100%"};
      `),
          onClick: i[1] || (i[1] = () => {
            o.expandable && (n.value = !0);
          })
        }, null, 14, Oi)) : o.$slots.fallback ? j(o.$slots, "fallback", { key: 1 }, void 0, !0) : o.$slots.default ? j(o.$slots, "default", { key: 2 }, void 0, !0) : (d(), b("svg", {
          key: 3,
          class: x(["picture__background", `
        ${o.bordered && "picture__image--bordered"}
      `]),
          xmlns: "https://www.w3.org/2000/svg",
          viewBox: "0 0 200 200",
          preserveAspectRatio: "none",
          style: Xe(`
        object-fit: ${o.objectFit || "cover"};
        width: ${o.width || "100%"};
        height: ${o.height || "100%"};
      `)
        }, ki, 6)),
        o.$slots.caption ? (d(), b("figcaption", Ei, [
          j(o.$slots, "caption", {}, void 0, !0)
        ])) : I("", !0)
      ]);
    };
  }
});
const mn = /* @__PURE__ */ Q(Ii, [["__scopeId", "data-v-6a10f145"]]), Ti = (t) => (nn("data-v-1ef97a33"), t = t(), sn(), t), Ai = {
  key: 0,
  class: "sv-surface table"
}, Vi = { key: 0 }, Ri = { key: 1 }, Ui = { key: 0 }, ji = { key: 0 }, Ci = ["checked"], Di = {
  key: 1,
  style: { "text-align": "right" }
}, Mi = { key: 2 }, Fi = { key: 3 }, Li = ["onClick"], Pi = { key: 0 }, zi = ["value"], Hi = {
  key: 0,
  class: "table__cell-container"
}, Ji = {
  key: 1,
  class: "table__cell-container"
}, qi = { class: "table__cell-mobile-label" }, Wi = { class: "table__cell-grid" }, Yi = { key: 0 }, Zi = { key: 1 }, Gi = { key: 0 }, Ki = ["href"], Xi = { key: 2 }, Qi = { key: 1 }, xi = { key: 2 }, el = { key: 2 }, tl = {
  key: 1,
  class: "no-print table__cell"
}, nl = { class: "table__cell-actions" }, sl = ["id"], ol = { key: 1 }, rl = ["colspan"], il = /* @__PURE__ */ Ti(() => /* @__PURE__ */ C("div", { class: "table__empty" }, " Não foram encontrados resultados. ", -1)), ll = [
  il
], al = /* @__PURE__ */ W({
  __name: "sv-table",
  props: {
    columns: {},
    rows: {},
    collection: {},
    checkbox: { type: Boolean },
    border: { type: Boolean, default: !0 },
    headers: { type: Boolean, default: !0 },
    actions: {},
    layout: {}
  },
  setup(t) {
    const e = t, s = e.collection || le("storeId", null), n = s ? he(s.value || s) : null, o = Z({
      get: () => n.selected,
      set: (r) => n.selectManyItems(r, !0)
    }), i = Z(() => {
      var r;
      return ((r = e.actions) == null ? void 0 : r.filter((h) => {
        var c, l, p;
        return (p = (l = (c = e.layout) == null ? void 0 : c.actions) == null ? void 0 : l[h.action]) == null ? void 0 : p.button;
      })) || [];
    }), a = Z(() => {
      var r;
      return ((r = e.actions) == null ? void 0 : r.filter((h) => {
        var c, l, p;
        return !((p = (l = (c = e.layout) == null ? void 0 : c.actions) == null ? void 0 : l[h.action]) != null && p.button);
      })) || [];
    }), u = (r, h) => {
      var p, v;
      const c = [], l = (v = (p = e.layout) == null ? void 0 : p.actions) == null ? void 0 : v[h.action];
      return l != null && l.if && (xn(r, l.if).satisfied || c.push("display: none;")), c.join("");
    };
    return (r, h) => {
      var l, p;
      const c = ae("clickable");
      return r.columns && Object.keys(r.columns).length > 0 || r.$slots.thead ? (d(), b("table", Ai, [
        r.$slots.thead ? (d(), b("thead", Vi, [
          j(r.$slots, "thead", {}, void 0, !0)
        ])) : r.headers && (!y(n) || y(n).loading.getAll || y(n).itemsCount > 0) ? (d(), b("thead", Ri, [
          r.headers ? (d(), b("tr", Ui, [
            r.checkbox && y(n) ? (d(), b("th", ji, [
              C("input", {
                type: "checkbox",
                checked: y(n).selected.length > 0 && y(n).selected.length === y(n).itemsCount,
                onChange: h[0] || (h[0] = (v) => y(n).selectAllItems(v.target.checked))
              }, null, 40, Ci)
            ])) : I("", !0),
            (d(!0), b(re, null, ee(Object.entries(r.columns), ([v, w], S) => (d(), b("th", {
              key: `header-${S}`,
              class: x(`
            table__header
            ${r.border && "table__header--border"}
        `)
            }, M(w.description || r.$t(v)), 3))), 128)),
            r.actions ? (d(), b("th", Di)) : I("", !0)
          ])) : I("", !0)
        ])) : I("", !0),
        r.$slots.tbody ? (d(), b("tbody", Mi, [
          j(r.$slots, "tbody", {}, void 0, !0)
        ])) : (d(), b("tbody", Fi, [
          (d(!0), b(re, null, ee(r.rows, (v) => {
            var w;
            return d(), b("tr", {
              key: v._id,
              onClick: (S) => r.$emit("itemClick", v)
            }, [
              y(n) && r.checkbox ? (d(), b("td", Pi, [
                se(C("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": h[1] || (h[1] = (S) => o.value = S),
                  value: v._id
                }, null, 8, zi), [
                  [Ws, o.value]
                ])
              ])) : I("", !0),
              (d(!0), b(re, null, ee(Object.entries(r.columns), ([S, Y], N) => {
                var V;
                return d(), b("td", {
                  key: `column-${v._id}-${N}`
                }, [
                  `row-${S}` in r.$slots ? (d(), b("div", Hi, [
                    j(r.$slots, `row-${S}`, ue(Fe({
                      store: y(n),
                      column: S,
                      property: Y,
                      row: v
                    })), void 0, !0)
                  ])) : (d(), b("div", Ji, [
                    C("div", qi, M(Y.description || r.$t(S)), 1),
                    C("div", Wi, [
                      Y.type === "boolean" ? (d(), b("div", Yi, [
                        v[S] ? (d(), D(te, {
                          key: 0,
                          small: "",
                          name: "check",
                          fill: "green"
                        }, {
                          default: A(() => [
                            oe(M(r.$t("yes")), 1)
                          ]),
                          _: 1
                        })) : (d(), D(te, {
                          key: 1,
                          small: "",
                          name: "times",
                          fill: "red"
                        }, {
                          default: A(() => [
                            oe(M(r.$t("no")), 1)
                          ]),
                          _: 1
                        }))
                      ])) : (d(), b("div", Zi, [
                        Y.$ref === "file" && v[S] ? (d(), b("div", Gi, [
                          /^image/.test(v[S].mime) ? (d(), D(mn, {
                            key: 0,
                            expandable: "",
                            modelValue: v[S].link,
                            "onUpdate:modelValue": (H) => v[S].link = H,
                            meta: v[S],
                            class: "table__picture"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "meta"])) : v[S].link ? (d(), b("a", {
                            key: 1,
                            href: v[S].link,
                            style: { "font-size": "10pt" }
                          }, M(v[S].filename), 9, Ki)) : (d(), b("div", Xi, " - "))
                        ])) : y(n) ? (d(), b("span", Qi, M(y(n).formatValue({
                          value: v[S],
                          key: S,
                          property: Y
                        })), 1)) : (d(), b("span", xi, M(Array.isArray(v[S]) ? v[S].filter((H) => !!H).join(", ") : [void 0, null].includes(v[S]) ? "-" : v[S]), 1))
                      ])),
                      ((V = Y.s$indexes) == null ? void 0 : V.length) > 1 && Y.s$referencedCollection !== "file" ? (d(), b("div", el, [
                        (d(!0), b(re, null, ee(Y.s$indexes.slice(1, 2), (H, m) => (d(), b("div", {
                          key: `subvalue-${m}`
                        }, M(y(n).formatValue({
                          value: v[S],
                          key: S,
                          property: Y,
                          index: H
                        })), 1))), 128))
                      ])) : I("", !0)
                    ])
                  ]))
                ]);
              }), 128)),
              (w = r.actions) != null && w.length ? (d(), b("td", tl, [
                C("div", nl, [
                  (d(!0), b(re, null, ee(i.value, (S) => (d(), D(ve, {
                    small: "",
                    key: `action-${S.action}`,
                    variant: "transparent",
                    icon: S.icon,
                    style: Xe(u(v, S)),
                    onClick: (Y) => S.click(v)
                  }, {
                    default: A(() => [
                      oe(M(r.$t(S.name)), 1)
                    ]),
                    _: 2
                  }, 1032, ["icon", "style", "onClick"]))), 128)),
                  a.value.length > 0 ? (d(), D(an, ue(q({ key: 0 }, {
                    subject: v,
                    actions: a.value
                  })), {
                    default: A(() => [
                      se(F(te, {
                        reactive: "",
                        name: "ellipsis-h"
                      }, null, 512), [
                        [c]
                      ])
                    ]),
                    _: 2
                  }, 1040)) : I("", !0)
                ])
              ])) : I("", !0),
              C("div", {
                id: `dropdown-${v._id}`
              }, null, 8, sl)
            ], 8, Li);
          }), 128))
        ])),
        C("tfoot", null, [
          r.$slots.tfoot ? j(r.$slots, "tfoot", { key: 0 }, void 0, !0) : r.columns && !((l = r.rows) != null && l.length) && !((p = y(n)) != null && p.loading.getAll) ? (d(), b("tr", ol, [
            C("td", {
              colspan: Object.keys(r.columns).length
            }, ll, 8, rl)
          ])) : I("", !0)
        ])
      ])) : I("", !0);
    };
  }
});
const ul = /* @__PURE__ */ Q(al, [["__scopeId", "data-v-1ef97a33"]]), cl = /* @__PURE__ */ W({
  __name: "sv-tabular",
  props: {
    individualActions: {},
    hasSelectionActions: { type: Boolean },
    layoutOptions: {},
    componentProps: {}
  },
  setup(t) {
    const e = t, s = Ae(), n = le("storeId", ""), o = Z(() => {
      const i = {
        collection: n,
        checkbox: s.hasSelectionActions,
        columns: s.tableProperties,
        rows: s.items,
        actions: e.individualActions,
        layout: s.tableLayout
      };
      return Object.assign(i, e.componentProps);
    });
    return (i, a) => (d(), b(re, null, [
      i.$slots.inner ? j(i.$slots, "inner", { key: 0 }) : I("", !0),
      y(s).properties ? (d(), D(ul, q({ key: 1 }, o.value, {
        key: y(s).$id
      }), Te({ _: 2 }, [
        ee(Object.keys(i.$slots).filter((u) => !["inner"].includes(u)), (u) => ({
          name: u,
          fn: A((r) => [
            j(i.$slots, u, ue(Fe(r)))
          ])
        }))
      ]), 1040)) : I("", !0)
    ], 64));
  }
});
const fl = {}, dl = { class: "grid" };
function pl(t, e) {
  return d(), b("div", dl, [
    j(t.$slots, "default", {}, void 0, !0)
  ]);
}
const hl = /* @__PURE__ */ Q(fl, [["render", pl], ["__scopeId", "data-v-a2c4bb0e"]]), ml = /* @__PURE__ */ W({
  __name: "sv-grid",
  props: {
    individualActions: {},
    hasSelectionActions: { type: Boolean },
    layoutOptions: {}
  },
  setup(t) {
    const s = t.layoutOptions, n = Ae(), o = (i) => Array.isArray(i) ? i[0] : i;
    return (i, a) => {
      const u = ae("clickable");
      return d(), D(hl, null, {
        default: A(() => [
          (d(!0), b(re, null, ee(y(n).items, (r) => (d(), D(Oo, { key: r }, {
            footer: A(() => [
              C("div", null, M(r[y(s).title]), 1),
              i.individualActions.length > 0 ? (d(), D(an, ue(q({ key: 0 }, {
                subject: r,
                actions: i.individualActions
              })), {
                default: A(() => [
                  se(F(te, {
                    reactive: "",
                    name: "ellipsis-h"
                  }, null, 512), [
                    [u]
                  ])
                ]),
                _: 2
              }, 1040)) : I("", !0)
            ]),
            default: A(() => {
              var h;
              return [
                F(mn, {
                  expandable: "",
                  url: (h = o(r[y(s).picture])) == null ? void 0 : h.link,
                  meta: o(r[y(s).picture])
                }, null, 8, ["url", "meta"])
              ];
            }),
            _: 2
          }, 1024))), 128))
        ]),
        _: 1
      });
    };
  }
}), yl = (t) => {
  const e = {
    tabular: cl,
    grid: ml
  };
  return e[t] || e.tabular;
}, gl = { class: "checkbox__text" }, _l = ["innerHTML"], bl = { class: "checkbox__hint" }, vl = ["innerHTML"], wl = {
  inheritAttrs: !1
}, $l = /* @__PURE__ */ W({
  ...wl,
  __name: "sv-checkbox",
  props: {
    modelValue: {},
    property: {},
    propertyName: {},
    parentCollection: {},
    value: {},
    variant: {}
  },
  emits: ["update:modelValue", "change"],
  setup(t, { emit: e }) {
    var h;
    const s = t, n = s.property || {}, o = ["array", "boolean"].includes(n.type) ? "checkbox" : "radio", i = X(null), a = typeof s.value == "object" ? ((h = s.value) == null ? void 0 : h._id) || s.value : s.value || !1, u = (c) => c.map((l) => l._id || l), r = Z({
      get: () => s.modelValue ? n.type !== "array" ? s.modelValue === s.value : Array.isArray(s.modelValue) ? u(s.modelValue).includes(s.value) : !!s.value : !1,
      set: () => {
        if (n.readOnly)
          return;
        if (n.type !== "array") {
          e("update:modelValue", !s.modelValue);
          return;
        }
        const c = s.modelValue ? [s.modelValue] : [];
        e("update:modelValue", u(c).includes(a) ? u(c).filter((l) => l !== a) : [...c, a]);
      }
    });
    return (c, l) => {
      const p = ae("clickable");
      return d(), b("label", {
        class: x(`
    checkbox
    ${y(n).readOnly && "checkbox--readOnly"}
  `)
      }, [
        se(C("input", q({
          "onUpdate:modelValue": l[0] || (l[0] = (v) => r.value = v),
          ref_key: "checkbox",
          ref: i
        }, {
          type: y(o),
          readOnly: y(n).readOnly,
          checked: r.value
        }, { class: "checkbox__input" }), null, 16), [
          [Ys, r.value]
        ]),
        se((d(), b("div", gl, [
          C("div", null, [
            c.$slots.description ? j(c.$slots, "description", { key: 0 }, void 0, !0) : y(a) ? (d(), b("div", {
              key: 1,
              innerHTML: y(a)
            }, null, 8, _l)) : j(c.$slots, "default", { key: 2 }, void 0, !0)
          ]),
          C("div", bl, [
            c.$slots.hint ? j(c.$slots, "hint", { key: 0 }, void 0, !0) : y(n).s$hint ? (d(), b("div", {
              key: 1,
              innerHTML: y(n).s$hint
            }, null, 8, vl)) : I("", !0)
          ])
        ])), [
          [p]
        ])
      ], 2);
    };
  }
});
const Sl = /* @__PURE__ */ Q($l, [["__scopeId", "data-v-1a922364"]]), Ol = {
  inheritAttrs: !1
}, Bl = /* @__PURE__ */ W({
  ...Ol,
  __name: "sv-options",
  props: {
    modelValue: {},
    property: {},
    propertyName: {},
    parentCollection: {},
    columns: { default: 1 }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: e }) {
    const s = t, n = Z(() => s.modelValue), o = (i) => {
      e("update:modelValue", i);
    };
    return (i, a) => (d(), b("div", {
      class: "options",
      style: Xe(`
      --columns: ${i.columns || 1};
      grid-template-columns: repeat(var(--columns), 1fr);
    `)
    }, [
      (d(!0), b(re, null, ee(i.property.enum, (u, r) => (d(), b("div", {
        key: `option-${r}`,
        class: x(`
        options__checkbox
        ${n.value && "options__checkbox--selected"}
    `)
      }, [
        F(Sl, q({ "model-value": n.value }, {
          value: u,
          property: i.property
        }, { "onUpdate:modelValue": o }), null, 16, ["model-value"])
      ], 2))), 128))
    ], 4));
  }
});
const Nl = /* @__PURE__ */ Q(Bl, [["__scopeId", "data-v-a8883901"]]), kl = (t) => (nn("data-v-c3aab905"), t = t(), sn(), t), El = { class: "switch-wrapper" }, Il = ["onClick"], Tl = /* @__PURE__ */ kl(() => /* @__PURE__ */ C("div", { class: "switch__slider" }, null, -1)), Al = { key: 1 }, Vl = {
  inheritAttrs: !1
}, Rl = /* @__PURE__ */ W({
  ...Vl,
  __name: "sv-switch",
  props: {
    modelValue: {},
    property: {},
    propertyName: {},
    parentCollection: {}
  },
  emits: ["update:modelValue", "change"],
  setup(t, { emit: e }) {
    const s = t, n = Z(() => s.property || {}), o = () => {
      n.value.readOnly || (e("change", !s.modelValue), e("update:modelValue", !s.modelValue));
    };
    return (i, a) => {
      const u = ae("clickable");
      return d(), b("div", El, [
        se((d(), b("a", {
          class: x(`
        switch
        ${i.modelValue && "switch--active"}
        ${n.value.readOnly && "switch--readOnly"}
      `),
          onClick: Xn(o, ["stop"])
        }, [
          Tl,
          C("div", {
            class: x(`
        switch__dummy
        ${!i.modelValue && "switch__dummy--flex"}
      `)
          }, null, 2)
        ], 10, Il)), [
          [u, {
            blocked: n.value.readOnly
          }]
        ]),
        i.$slots.default ? j(i.$slots, "default", { key: 0 }, void 0, !0) : (d(), b("div", Al, M(n.value.description || i.propertyName), 1))
      ]);
    };
  }
});
const Ul = /* @__PURE__ */ Q(Rl, [["__scopeId", "data-v-c3aab905"]]), jl = { class: "file" }, Cl = { key: 0 }, Dl = ["href"], Ml = { class: "file__actions" }, Fl = ["accept"], Ll = {
  key: 0,
  class: "file__buttons"
}, Pl = {
  key: 1,
  class: "file__buttons"
}, zl = /* @__PURE__ */ W({
  __name: "sv-file",
  props: {
    modelValue: {},
    property: {},
    propertyName: {},
    parentCollection: {},
    meta: {}
  },
  emits: ["update:modelValue", "change"],
  setup(t, { emit: e }) {
    const s = t, n = Ae();
    _e("buttonSize", "small");
    const o = X(null), i = Z(() => {
      var p;
      return o.value ? URL.createObjectURL(o.value) : (p = s.modelValue) == null ? void 0 : p.link;
    }), a = Z(() => {
      var p, v, w;
      return /^image\//.test((p = s.modelValue) == null ? void 0 : p.mime) && !((v = o.value) != null && v.type) || /^image\//.test((w = o.value) == null ? void 0 : w.type);
    }), u = (p) => new Promise((v) => {
      const w = new FileReader();
      w.onload = () => v({
        filename: p.name,
        content: w.result,
        last_modified: p.lastModified,
        mime: p.type,
        size: p.size
      }), w.readAsDataURL(p);
    }), r = (p) => {
      o.value = p.target.files[0];
    }, h = () => {
      o.value = null;
    }, c = async () => {
      var w;
      const p = await u(o.value), { result: v } = await n.functions.upload({
        parentId: n.item._id,
        propertyName: s.propertyName,
        what: {
          _id: (w = s.modelValue) == null ? void 0 : w._id,
          ...p
        },
        meta: s.meta
      });
      h(), e("update:modelValue", v), e("change", v);
    }, l = async () => {
      await n.functions.removeFile({
        parentId: n.item._id,
        propertyName: s.propertyName,
        filters: {
          _id: s.modelValue._id
        }
      }), e("update:modelValue", {});
    };
    return (p, v) => {
      var w, S, Y, N;
      return d(), b("div", jl, [
        o.value || (w = p.modelValue) != null && w._id ? (d(), b("div", Cl, [
          a.value ? (d(), D(mn, {
            key: 0,
            modelValue: i.value,
            "onUpdate:modelValue": v[0] || (v[0] = (V) => i.value = V),
            class: "file__image"
          }, null, 8, ["modelValue"])) : I("", !0),
          (S = p.modelValue) != null && S._id ? (d(), b("a", {
            key: 1,
            href: p.modelValue.download_link
          }, M(p.modelValue.filename), 9, Dl)) : I("", !0)
        ])) : I("", !0),
        C("div", Ml, [
          C("input", {
            type: "file",
            ref: "file",
            accept: (Y = p.property.s$accept) == null ? void 0 : Y.join(","),
            onChange: r
          }, null, 40, Fl),
          o.value ? (d(), b("div", Ll, [
            F(ve, { onClick: c }, {
              default: A(() => [
                oe(" Enviar ")
              ]),
              _: 1
            }),
            F(ve, { onClick: h }, {
              default: A(() => [
                oe(" Limpar ")
              ]),
              _: 1
            })
          ])) : (N = p.modelValue) != null && N._id ? (d(), b("div", Pl, [
            F(ve, { onClick: l }, {
              default: A(() => [
                oe(" Remover ")
              ]),
              _: 1
            })
          ])) : I("", !0)
        ])
      ]);
    };
  }
});
const Hl = /* @__PURE__ */ Q(zl, [["__scopeId", "data-v-03b7e8f0"]]), Jl = { class: "item" }, ql = { class: "item__values" }, Wl = /* @__PURE__ */ W({
  __name: "sv-search-item",
  props: {
    item: {},
    indexes: {}
  },
  setup(t) {
    return (e, s) => {
      const n = ae("clickable");
      return se((d(), b("div", Jl, [
        j(e.$slots, "default", {}, void 0, !0),
        C("div", ql, [
          (d(!0), b(re, null, ee(e.indexes, (o, i) => (d(), b("div", {
            key: `index-${e.item._id}-${i}`,
            class: "item__value"
          }, M(e.item[o]), 1))), 128))
        ])
      ])), [
        [n]
      ]);
    };
  }
});
const zs = /* @__PURE__ */ Q(Wl, [["__scopeId", "data-v-c0d31400"]]), Yl = /* @__PURE__ */ W({
  __name: "sv-search-selected",
  props: {
    modelValue: {},
    indexes: {},
    searchOnly: { type: Boolean },
    property: {}
  },
  emits: ["update:modelValue", "pushBack"],
  setup(t, { emit: e }) {
    const s = t, n = s.property, o = Ae(), i = Z(() => n.type === "array" ? s.modelValue : Object.keys(s.modelValue || {}).length > 0 ? Array(s.modelValue) : []), a = async (u, r = !0) => {
      if (n.s$purge && r) {
        const { _id: c } = u;
        await o.remove({ filters: { _id: c } });
      }
      const h = () => {
        const c = s.modelValue, l = c.findIndex((p) => p._id === u._id);
        return c.splice(l, 1), c;
      };
      e("update:modelValue", n.type === "array" ? h() : null), (n.uniqueItems || n.type === "array" && s.searchOnly) && e("pushBack", u);
    };
    return (u, r) => {
      const h = ae("clickable");
      return d(!0), b(re, null, ee(i.value, (c) => (d(), D(zs, q({
        item: c,
        indexes: u.indexes
      }, {
        key: c._id,
        onClick: (l) => a(c, !1)
      }), {
        default: A(() => [
          se(F(te, { name: "check-circle" }, null, 512), [
            [h]
          ])
        ]),
        _: 2
      }, 1040, ["onClick"]))), 128);
    };
  }
}), Zl = { class: "search" }, Gl = {
  key: 2,
  class: "search__container search__container--selected"
}, Kl = { key: 3 }, Xl = {
  key: 0,
  class: "search__container search__container--results"
}, Ql = { key: 0 }, xl = { key: 1 }, ea = { key: 0 }, ta = { key: 1 }, na = /* @__PURE__ */ W({
  __name: "sv-search",
  props: {
    modelValue: {},
    propertyName: {},
    parentCollection: {},
    property: {},
    searchOnly: { type: Boolean }
  },
  emits: ["update:modelValue", "change"],
  setup(t, { emit: e }) {
    const s = t, n = s.property;
    _e("storeId", n.s$referencedCollection), _e("innerInputLabel", !0), _e("omitInputLabels", !0);
    const o = !n.s$inlineEditing || le("searchOnly", null);
    le("omitFormHeader", !1);
    const i = he(n.s$referencedCollection), a = s.property.s$indexes, u = X(!1), r = X(!1), h = X({
      result: []
    }), c = Z(() => h.value.result || []), l = Z(() => h.value.pagination), p = Z(() => u.value || n.s$inline), v = X(!1), w = X(null), S = X({}), Y = (B, O) => {
      const U = (P) => P.filter((me) => typeof me != "object" || Object.keys(me || {}).length > 0), R = n.type === "array" ? U(Array.isArray(s.modelValue) ? s.modelValue : [s.modelValue]) : s.modelValue;
      (n.uniqueItems || n.type === "array" && o) && c.value.splice(O, 1), e("update:modelValue", n.type === "array" ? [...R, B] : B), e("change", B), r.value = !1, Gs(() => {
        r.value = !0;
      });
    }, N = (B) => {
      h.value.result.push(B);
    }, V = async (B) => {
      if (Object.values(S.value).every((O) => !(String(O).length > 0))) {
        B && c.value.length === 0 && (h.value = await i.custom("getAll", { limit: 100 }, { fullResponse: !0 }));
        return;
      }
      i.loading.getAll || (h.value = await i.custom("getAll", {
        limit: 100,
        filters: {
          $or: a == null ? void 0 : a.filter((O) => {
            var U;
            return ((U = S.value[O]) == null ? void 0 : U.length) > 0;
          }).map((O) => ({
            [O]: {
              $regex: S.value[O].trim(),
              $options: "i"
            }
          }))
        }
      }, { fullResponse: !0 }));
    };
    Zs(async () => {
      n.s$prefetch && (h.value = await i.custom("getAll", {}, { fullResponse: !0 }));
    });
    const [H] = xt({ delay: 800 })(() => {
      V(), v.value = !1;
    }), m = () => {
      v.value = !0, H();
    };
    let T;
    const z = () => {
      r.value = !1, h.value = {
        result: []
      };
    }, E = () => {
      T(), V(!0), w.value = "in";
    }, _ = () => {
      k(), w.value = "out";
    }, [k, L] = xt({ delay: 200 })(z);
    return T = L, (B, O) => {
      var U, R;
      return d(), b("div", Zl, [
        p.value ? (d(), D(et, q({ key: 0 }, {
          collection: y(n).$ref,
          modelValue: B.modelValue,
          form: y(n).s$form ? y(i).useProperties(y(n).s$form) : y(i).properties,
          layout: y(i).formLayout
        }, {
          "onUpdate:modelValue": O[0] || (O[0] = (P) => e("update:modelValue", P))
        }), null, 16)) : (d(), D(et, q({
          key: 1,
          modelValue: S.value,
          "onUpdate:modelValue": O[1] || (O[1] = (P) => S.value = P)
        }, {
          collection: y(n).$ref,
          form: y(i).useProperties(y(a)),
          layout: y(i).formLayout,
          searchOnly: !0,
          focus: r.value
        }, {
          onFocusin: E,
          onFocusout: _,
          onInput: m
        }), null, 16, ["modelValue"])),
        p.value ? I("", !0) : (d(), b("div", Gl, [
          F(Yl, q({
            searchOnly: y(o),
            indexes: y(a),
            property: y(n),
            modelValue: B.modelValue
          }, {
            "onUpdate:modelValue": O[2] || (O[2] = (P) => e("update:modelValue", P)),
            onPushBack: N
          }), null, 16)
        ])),
        p.value ? I("", !0) : (d(), b("div", Kl, [
          c.value.length ? (d(), b("div", Xl, [
            (d(!0), b(re, null, ee(c.value, (P, me) => (d(), D(zs, q({
              item: P,
              indexes: y(a)
            }, {
              key: `matching-${P._id}`,
              onClick: (tt) => Y(P, +me)
            }), {
              default: A(() => [
                F(te, { name: "plus" })
              ]),
              _: 2
            }, 1040, ["onClick"]))), 128)),
            l.value.recordsTotal > l.value.recordsCount ? (d(), b("div", Ql, " +" + M(l.value.recordsTotal - l.value.recordsCount) + " resultados ", 1)) : I("", !0)
          ])) : (d(), b("div", xl, [
            v.value ? (d(), b("div", ea, " Pesquisando... ")) : !y(i).loading.getAll && w.value === "in" && Object.values(S.value).filter((P) => !!P).length > 0 && !(y(n).type === "array" && ((U = B.modelValue) != null && U.length) || (R = B.modelValue) != null && R._id) ? (d(), b("div", ta, " Não há resultados ")) : I("", !0)
          ]))
        ]))
      ]);
    };
  }
});
const sa = /* @__PURE__ */ Q(na, [["__scopeId", "data-v-bd0d8b86"]]), qn = (t, e) => {
  const s = t.type === "array" ? t.items : t, n = {
    options: Nl,
    select: hn,
    switch: Ul,
    file: Hl,
    search: sa,
    input: lt,
    form: et
  }, o = (() => {
    if (!s)
      return "input";
    switch (!0) {
      case ["checkbox", "radio"].includes(t.s$element):
        return "options";
      case t.s$element === "select":
        return "select";
      case s.type === "boolean":
        return "switch";
      case t.s$referencedCollection === "file":
        return "file";
      case t.s$isReference:
        return "search";
      case !!s.enum:
        return "select";
      case s.type === "object":
        return "form";
      default:
        return "input";
    }
  })();
  return e != null && e[o] ? e[o] : n[o] || n.input;
}, oa = (t, e) => {
  var n;
  t ?? (t = []);
  const s = ((n = e.items) == null ? void 0 : n.type) || e.type;
  if (e.s$isReference) {
    const o = he(e.s$referencedCollection), i = mt.deepClone(o.$freshItem);
    return t.push(i);
  }
  return s === "object" ? t.push({}) : t.push(null);
}, ra = (t, e) => {
  t.splice(e, 1);
}, ia = {
  key: 0,
  class: "form__header"
}, la = {
  key: 1,
  class: "form__fieldset"
}, aa = { key: 0 }, ua = ["innerHTML"], ca = ["onInput"], fa = { key: 4 }, da = { value: "true" }, pa = { value: "false" }, ha = {
  key: 5,
  style: { display: "grid", "row-gap": ".4rem" }
}, ma = { style: { "flex-grow": "1" } }, ya = { key: 6 }, ga = {
  key: 8,
  class: "form__validation-error"
}, _a = { key: 0 }, ba = { key: 1 }, va = {
  key: 3,
  class: "form__footer"
}, wa = /* @__PURE__ */ W({
  __name: "sv-form",
  props: {
    modelValue: {},
    property: {},
    propertyName: {},
    parentCollection: {},
    form: {},
    collection: {},
    isReadOnly: { type: Boolean, default: !1 },
    searchOnly: { type: Boolean },
    strict: { type: Boolean, default: !0 },
    layout: {},
    required: {},
    formComponents: {},
    propertyComponents: {},
    omitFormHeader: { type: Boolean },
    omitInputLabels: { type: Boolean },
    innerInputLabel: { type: Boolean },
    validationErrors: { default: null },
    highlightRequired: { type: Boolean, default: !0 },
    focus: { type: Boolean }
  },
  emits: ["update:modelValue", "input", "change"],
  setup(t, { emit: e }) {
    const s = t;
    Ks(() => {
      s.modelValue || e("update:modelValue", {});
    });
    const n = s.property ? null : s.collection || le("storeId", null), o = n ? he(n.value || n) : null;
    !n && process.env.NODE_ENV !== "production" && console.warn(`sv-form was used without providing storeId or specifying
    collection prop, some features may not work as intended`);
    const i = Z(() => {
      var m;
      return ((m = s.property) == null ? void 0 : m.properties) || s.form;
    }), a = (m) => {
      const T = le(m, s[m]);
      return s[m] && _e(m, s[m]), T;
    }, u = Z(() => s.validationErrors !== null ? s.validationErrors : o == null ? void 0 : o.validationErrors), r = a("formComponents") || {}, h = a("propertyComponents") || {}, c = a("omitFormHeader"), l = a("omitInputLabels"), p = a("innerInputLabel");
    _e("storeId", n), _e("searchOnly", s.searchOnly || !1), _e("inputBordered", le("inputBordered", !0));
    const v = (m) => {
      if (i.value)
        return Object.entries(i.value).reduce((T, [z, E]) => E && (!E.s$meta || s.searchOnly) && (!m || m([z, E])) ? [
          ...T,
          [
            z,
            {
              ...E,
              hidden: void 0
            }
          ]
        ] : T, []);
    }, w = (m) => {
      var z;
      if (s.searchOnly || !s.strict || !n)
        return !0;
      const T = (z = o.description) == null ? void 0 : z.form;
      return !T || T.includes(m);
    }, S = v(([m, T]) => !T.meta && w(m)), Y = (m, T) => {
      var _, k, L, B;
      const z = [], E = ((k = (_ = s.layout) == null ? void 0 : _.fields) == null ? void 0 : k[m]) || ((B = (L = s.layout) == null ? void 0 : L.fields) == null ? void 0 : B.$default);
      if (T)
        return E != null && E.if && !s.searchOnly && (xn(s.modelValue, E.if).satisfied || (s.modelValue[m] = o ? o.$freshItem[m] : [void 0, null].includes(s.modelValue[m]) ? null : s.modelValue[m].constructor(), z.push("display: none;"))), z.push(`
    --field-span: ${(E == null ? void 0 : E.span) || 6};
    grid-column: span var(--field-span) / span var(--field-span);
  `), E && E.verticalSpacing && z.push(`
      --vertical-spacing: ${E.verticalSpacing};
      padding: var(--vertical-spacing) 0;
    `), z.join("");
    }, N = (m) => m === null || m instanceof Object && !Object.keys(m).length, V = Z(() => s.required || (o == null ? void 0 : o.description.required)), H = Z(() => oo(s.modelValue, s.form, V.value, o == null ? void 0 : o.description));
    return (m, T) => {
      const z = ae("clickable"), E = ae("focus");
      return d(), b("form", {
        class: "form",
        style: Xe(`row-gap: ${y(c) ? ".8rem" : "2rem"};`)
      }, [
        m.$slots.header && !y(c) ? (d(), b("header", ia, [
          j(m.$slots, "header", {}, void 0, !0)
        ])) : I("", !0),
        j(m.$slots, "default", {}, void 0, !0),
        m.isReadOnly ? I("", !0) : (d(), b("fieldset", la, [
          (d(!0), b(re, null, ee(y(S), ([_, k], L) => {
            var B, O, U, R, P, me, tt, yn, gn, _n, bn, vn, wn, $n;
            return d(), b("div", {
              key: `field-${L}`,
              style: Xe(Y(_, k)),
              class: "form__field"
            }, [
              (k.type !== "boolean" || m.searchOnly) && !k.s$noLabel && !y(l) && !y(p) ? (d(), b("label", aa, [
                C("div", {
                  class: x({
                    "form__field-label": !0,
                    "form__field-required-hint": m.highlightRequired && !m.searchOnly && (!V.value || V.value.includes(_))
                  })
                }, M(k.description || m.$t(_)), 3),
                k.s$hint ? (d(), b("div", {
                  key: 0,
                  innerHTML: k.s$hint
                }, null, 8, ua)) : I("", !0)
              ])) : I("", !0),
              m.$slots[`field-${_}`] ? j(m.$slots, `field-${_}`, ue(q({ key: 1 }, {
                property: k,
                modelValue: m.modelValue,
                key: _
              })), void 0, !0) : (O = (B = m.layout) == null ? void 0 : B[_]) != null && O.component && y(h)[m.layout[_].component.name] ? (d(), D(Ce(y(h)[m.layout[_].component.name]), q({
                key: 2,
                modelValue: m.modelValue[_],
                "onUpdate:modelValue": (ne) => m.modelValue[_] = ne
              }, {
                property: k,
                propertyName: _,
                ...m.layout[_].component.props || {}
              }, {
                onInput: (ne) => e("input", _),
                onChange: T[0] || (T[0] = (ne) => e("change", ne))
              }), null, 16, ["modelValue", "onUpdate:modelValue", "onInput"])) : ["date", "date-time"].includes(k.format) && m.searchOnly ? (d(), b("div", {
                key: 3,
                style: { display: "grid", "grid-template-columns": "repeat(2, 1fr)", "column-gap": "1rem" },
                onInput: (ne) => e("input", _),
                onChange: T[1] || (T[1] = (ne) => e("change", ne))
              }, [
                F(lt, q({
                  modelValue: m.modelValue[_].$gte,
                  "onUpdate:modelValue": (ne) => m.modelValue[_].$gte = ne
                }, {
                  property: k,
                  propertyName: _
                }), null, 16, ["modelValue", "onUpdate:modelValue"]),
                F(lt, q({
                  modelValue: m.modelValue[_].$lte,
                  "onUpdate:modelValue": (ne) => m.modelValue[_].$lte = ne
                }, {
                  property: k,
                  propertyName: _
                }), null, 16, ["modelValue", "onUpdate:modelValue"])
              ], 40, ca)) : k.type === "boolean" && m.searchOnly ? (d(), b("div", fa, [
                F(hn, q({
                  property: k,
                  propertyName: _
                }, {
                  "boolean-ref": "",
                  "model-value": m.modelValue[_],
                  onChange: T[2] || (T[2] = (ne) => e("change", ne)),
                  "onUpdate:modelValue": (ne) => {
                    m.modelValue[_] = ne == "true" ? !0 : ne == "false" ? !1 : null;
                  }
                }), {
                  default: A(() => [
                    C("option", da, M(m.$t("yes")), 1),
                    C("option", pa, M(m.$t("no")), 1)
                  ]),
                  _: 2
                }, 1040, ["model-value", "onUpdate:modelValue"])
              ])) : k.type === "array" && (!(k.s$isReference && !k.s$inline) || k.s$isFile) ? (d(), b("div", ha, [
                (d(!0), b(re, null, ee(m.modelValue[_], (ne, nt) => {
                  var Sn, On, Bn, Nn, kn, En;
                  return d(), b("div", {
                    key: `rep-${_}-${nt}`,
                    style: { display: "flex", "column-gap": ".6rem", "align-items": "center" }
                  }, [
                    C("div", ma, [
                      (d(), D(Ce(y(qn)(k, y(r))), q({
                        modelValue: m.modelValue[_][nt],
                        "onUpdate:modelValue": (st) => m.modelValue[_][nt] = st
                      }, {
                        property: {
                          ...k,
                          ...k.items
                        },
                        value: ne,
                        modelValue: m.modelValue[_][nt],
                        propertyName: _,
                        parentCollection: y(n),
                        columns: ((Bn = (On = (Sn = m.layout) == null ? void 0 : Sn.fields) == null ? void 0 : On[_]) == null ? void 0 : Bn.optionsColumns) || ((En = (kn = (Nn = m.layout) == null ? void 0 : Nn.fields) == null ? void 0 : kn.$default) == null ? void 0 : En.optionsColumns),
                        ...k.s$componentProps || {}
                      }, {
                        onInput: (st) => e("input", _),
                        onChange: T[3] || (T[3] = (st) => e("change", st))
                      }), null, 16, ["modelValue", "onUpdate:modelValue", "onInput"]))
                    ]),
                    se(F(te, {
                      reactive: "",
                      name: "trash",
                      onClick: (st) => y(ra)(m.modelValue[_], nt)
                    }, null, 8, ["onClick"]), [
                      [z]
                    ])
                  ]);
                }), 128)),
                C("div", null, [
                  F(ve, {
                    small: "",
                    variant: "alt",
                    icon: "plus",
                    disabled: ((U = m.modelValue[_]) == null ? void 0 : U.length) >= k.maxItems || N((P = m.modelValue[_]) == null ? void 0 : P[((R = m.modelValue[_]) == null ? void 0 : R.length) - 1]) || k.s$isFile && ((me = m.modelValue[_]) == null ? void 0 : me.length) > 0 && !((gn = (yn = m.modelValue[_]) == null ? void 0 : yn[((tt = m.modelValue[_]) == null ? void 0 : tt.length) - 1]) != null && gn._id),
                    onClick: (ne) => {
                      m.modelValue[_] || (m.modelValue[_] = []), y(oa)(m.modelValue[_], k);
                    }
                  }, {
                    default: A(() => [
                      oe(" Adicionar ")
                    ]),
                    _: 2
                  }, 1032, ["disabled", "onClick"])
                ])
              ])) : k.type === "object" ? (d(), b("pre", ya, M(m.modelValue[_]), 1)) : se((d(), D(Ce(y(qn)(k, y(r))), q({
                key: 7,
                modelValue: m.modelValue[_],
                "onUpdate:modelValue": (ne) => m.modelValue[_] = ne
              }, {
                property: k,
                propertyName: _,
                parentCollection: y(n),
                columns: ((bn = (_n = m.layout) == null ? void 0 : _n[_]) == null ? void 0 : bn.optionsColumns) || ((wn = (vn = m.layout) == null ? void 0 : vn.$default) == null ? void 0 : wn.optionsColumns),
                ...k.s$componentProps || {},
                modelValue: m.modelValue[_]
              }, {
                key: m.focus,
                onInput: (ne) => e("input", _),
                onChange: T[4] || (T[4] = (ne) => e("change", ne))
              }), null, 16, ["modelValue", "onUpdate:modelValue", "onInput"])), [
                [E, L === 0 && m.focus]
              ]),
              ($n = u.value) != null && $n[_] ? (d(), b("div", ga, [
                u.value[_].type ? (d(), b("span", _a, M(m.$t(`validation_error.${u.value[_].type}`)), 1)) : I("", !0),
                u.value[_].detail ? (d(), b("span", ba, M(m.$t(u.value[_].detail)), 1)) : I("", !0)
              ])) : I("", !0)
            ], 4);
          }), 128))
        ])),
        m.$slots.after ? j(m.$slots, "after", { key: 2 }, void 0, !0) : I("", !0),
        m.$slots.footer ? (d(), b("div", va, [
          C("pre", null, M(V.value), 1),
          j(m.$slots, "footer", ue(Fe({
            isInsertReady: H.value
          })), void 0, !0)
        ])) : I("", !0)
      ], 4);
    };
  }
});
const et = /* @__PURE__ */ Q(wa, [["__scopeId", "data-v-f593e959"]]), $a = /* @__PURE__ */ W({
  __name: "sv-filter-panel",
  emits: ["update:modelValue"],
  setup(t, { emit: e }) {
    const s = Ae(), n = () => {
      s.pagination.offset = 0, s.filter(), e("update:modelValue", !1);
    };
    return (o, i) => (d(), D(ln, {
      "close-hint": "",
      "fixed-right": "",
      title: "Filtrar por",
      onClose: i[1] || (i[1] = (a) => e("update:modelValue", !1)),
      onOverlayClick: i[2] || (i[2] = (a) => e("update:modelValue", !1))
    }, {
      footer: A(() => [
        F(ve, {
          variant: "transparent",
          onClick: y(s).clearFilters
        }, {
          default: A(() => [
            oe(" Limpar ")
          ]),
          _: 1
        }, 8, ["onClick"]),
        F(ve, {
          icon: "filter",
          disabled: !y(s).hasActiveFilters,
          onClick: n
        }, {
          default: A(() => [
            oe(" Filtrar ")
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: A(() => [
        F(et, q({
          modelValue: y(s).filters,
          "onUpdate:modelValue": i[0] || (i[0] = (a) => y(s).filters = a)
        }, {
          form: y(s).availableFilters,
          searchOnly: !0,
          layout: y(s).formLayout
        }), null, 16, ["modelValue"])
      ]),
      _: 1
    }));
  }
});
const Sa = /* @__PURE__ */ Q($a, [["__scopeId", "data-v-d4be054f"]]), fe = X(!1), Wn = X(!1), it = X(!1), Qt = X(), Yn = X(), Zn = !1, Oa = /* @__PURE__ */ W({
  __name: "sv-insert-panel",
  props: {
    parentCollection: {},
    parentField: {}
  },
  setup(t) {
    const e = t, s = he("meta"), n = he(s.view.collection), o = le("individualActions", []), i = le("parentStore"), a = async () => {
      var h, c;
      const r = await n.deepInsert();
      if (e.parentField) {
        const l = (h = i.item)[c = e.parentField] || (h[c] = []);
        l.findIndex(({ _id: p }) => p === r._id) === -1 && l.push(r._id), await i.insert({
          what: {
            _id: i.item._id,
            [e.parentField]: l
          }
        });
      }
      fe.value = !1;
    }, u = () => {
      n.ask({
        action: () => {
          n.clearItem(), n.validationErrors = {}, fe.value = !1;
        },
        body: I18N.global.tc("prompt.close_panel")
      });
    };
    return Oe(() => n.item._id, (r) => {
      r === null && (fe.value = !1);
    }), (r, h) => {
      const c = ae("clickable");
      return d(), D(ln, {
        "fixed-right": "",
        modelValue: y(fe),
        "onUpdate:modelValue": h[3] || (h[3] = (l) => Qn(fe) ? fe.value = l : null),
        onOverlayClick: u
      }, {
        header: A(() => [
          C("span", null, M((() => {
            switch (y(fe)) {
              case "add":
                return r.$t("action.add");
              case "duplicate":
                return r.$t("action.duplicate");
              case "edit":
              default:
                return r.$t("action.edit");
            }
          })()), 1),
          C("span", null, " " + M(r.$t(y(s).view.collection)), 1)
        ]),
        extra: A(() => [
          F(an, q({
            subject: y(n).item,
            actions: y(o).filter(({ action: l }) => l !== "ui/spawnEdit")
          }, {
            onActionClick: h[2] || (h[2] = (l) => fe.value = !1)
          }), {
            default: A(() => [
              y(n).item._id ? se((d(), D(te, {
                key: 0,
                reactive: "",
                name: "ellipsis-h"
              }, null, 512)), [
                [c]
              ]) : I("", !0)
            ]),
            _: 1
          }, 16)
        ]),
        footer: A(() => [
          F(ve, {
            small: "",
            variant: "transparent",
            onClick: u
          }, {
            default: A(() => [
              oe(M(r.$t("action.cancel")), 1)
            ]),
            _: 1
          }),
          F(ve, {
            disabled: !y(n).isInsertReady || Zn,
            loading: y(n).loading.insert,
            onClick: a
          }, {
            default: A(() => [
              oe(M(r.$t("action.insert")), 1)
            ]),
            _: 1
          }, 8, ["disabled", "loading"])
        ]),
        default: A(() => [
          F(et, q({
            modelValue: y(n).item,
            "onUpdate:modelValue": h[0] || (h[0] = (l) => y(n).item = l)
          }, {
            collection: y(s).view.collection,
            form: y(n).properties,
            isReadOnly: Zn,
            layout: y(n).formLayout
          }, {
            onAdd: h[1] || (h[1] = (l) => l.preventDefault())
          }), Te({ _: 2 }, [
            ee(Object.keys(r.$slots).filter((l) => l.startsWith("field-")), (l) => ({
              name: l,
              fn: A((p) => [
                j(r.$slots, l, ue(Fe(p)))
              ])
            }))
          ]), 1040, ["modelValue"])
        ]),
        _: 3
      }, 8, ["modelValue"]);
    };
  }
}), Ba = { class: "crud__main" }, Na = {
  key: 0,
  class: "crud__controls"
}, ka = {
  key: 0,
  style: { flex: "1" }
}, Ea = { key: 0 }, Ia = {
  key: 2,
  class: "crud__controls"
}, Ta = /* @__PURE__ */ W({
  __name: "sv-crud",
  props: {
    collection: {},
    noControls: { type: Boolean },
    noActions: { type: Boolean },
    noFetch: { type: Boolean },
    noRefresh: { type: Boolean, default: !0 },
    noLayoutToggle: { type: Boolean },
    parentCollection: {},
    parentField: {},
    layout: {},
    action: {},
    componentProps: {}
  },
  emits: ["uiEvent"],
  async setup(t, { emit: e }) {
    let s, n;
    const o = t, i = ([s, n] = on(() => rn()), s = await s, n(), s), a = xt({
      delay: 600
    }), u = X("");
    let r, h;
    const c = he("meta");
    r = he(o.collection), h = o.parentField ? Ae(o.parentCollection) : null;
    const l = o.action ? o.action.value || o.action : ro(r, i);
    Qt.value = l[0], Yn.value = l[1];
    const p = async () => r.filter({
      project: [
        ...r.description.table || Object.keys(r.properties),
        ...r.tableMeta
      ]
    }), v = le("emptyComponent");
    Oe(i.currentRoute, async () => {
      c.view.title = o.collection, c.view.collection = o.collection, Wn.value = !1, o.noFetch || await p();
    }, {
      immediate: !0,
      flush: "post"
    });
    const [w] = a((N) => N ? (r.filters = Object.assign(mt.deepClone(r.freshFilters), {
      $text: {
        $search: `"${N}"`,
        $caseSensitive: !1
      }
    }), p()) : (r.filters = mt.deepClone(r.freshFilters), p()));
    Oe(u, (N) => {
      w(N);
    });
    const S = (N) => {
      N.currentLayout = N.currentLayout === "tabular" ? N.description.layout.name : "tabular";
    };
    Xs(() => {
      const N = () => r.filters, V = N();
      if (r.clearFilters(), r.filtersPreset = {}, r.preferredTableProperties = [], Object.keys(V).length > 0) {
        const H = N();
        Object.entries(V).some(([T, z]) => H[T] !== z) && r.clearItems();
      }
    }), Oe(() => Yn.value, async (N) => {
      var V;
      if ([
        "spawnEdit",
        "spawnView",
        "duplicate"
      ].includes(N.name) && await r.get({
        filters: {
          _id: N.params._id
        }
      }), N.name === "spawnAdd")
        r.clearItem(), (V = N.params) != null && V.item && (r.setItem(N.params.item), Object.keys(N.params.item).forEach((H) => {
          delete r.referenceItem[H];
        })), fe.value = "add";
      else if (N.name === "spawnEdit")
        fe.value = "edit";
      else if (N.name === "spawnView")
        Wn.value = !0, fe.value = "view";
      else if (N.name === "duplicate") {
        const H = Object.entries(r.item).reduce((m, [T, z]) => {
          const E = r.properties[T] || {}, _ = (k) => {
            if (E.s$isFile)
              return {};
            if (E.s$inline && k) {
              const { _id: L, ...B } = k;
              return B;
            }
            return k;
          };
          return z = E.type === "array" ? z.map(_) : _(z), {
            ...m,
            [T]: z
          };
        }, {});
        r.setItem({
          ...H,
          _id: void 0
        }), r.referenceItem = {}, fe.value = "duplicate";
      } else
        e("uiEvent", N);
    }, { deep: !0 }), Oe(() => fe, (N) => {
      N.value === !1 && (c.view.collection = o.collection, r.clearItem());
    });
    const Y = Z(() => r.individualActions.map((N) => ({
      click: Qt.value(N),
      ...N
    })));
    return _e("storeId", Z(() => o.collection)), _e("individualActions", Y), _e("parentStore", h), (N, V) => {
      var T, z, E, _, k, L, B, O, U;
      const H = ae("clickable"), m = ae("loading");
      return d(), b(re, null, [
        y(it) ? (d(), D(Sa, {
          modelValue: y(it),
          "onUpdate:modelValue": V[0] || (V[0] = (R) => Qn(it) ? it.value = R : null),
          key: y(r).$id
        }, null, 8, ["modelValue"])) : I("", !0),
        y(fe) ? (d(), D(Oa, ue(q({ key: 1 }, {
          parentCollection: N.parentCollection,
          parentField: N.parentField
        })), Te({ _: 2 }, [
          ee(Object.keys(N.$slots).filter((R) => R.startsWith("field-")), (R) => ({
            name: R,
            fn: A((P) => [
              j(N.$slots, R, ue(Fe(P)), void 0, !0)
            ])
          }))
        ]), 1040)) : I("", !0),
        C("div", Ba, [
          !N.noActions && ((T = y(r).description.search) != null && T.active || !N.noRefresh || y(r) && Object.keys(y(r).availableFilters).length > 0 || ((z = y(r)) == null ? void 0 : z.actions.length) > 0 || N.$slots.actions || !N.noLayoutToggle && y(r) && y(r).description.layout && ((E = y(r).description.layout) == null ? void 0 : E.name) !== "tabular") ? (d(), b("div", Na, [
            (_ = y(r).description.search) != null && _.active ? (d(), b("div", ka, [
              F(lt, q({
                modelValue: u.value,
                "onUpdate:modelValue": V[1] || (V[1] = (R) => u.value = R)
              }, {
                variant: "bold",
                property: {
                  type: "text",
                  s$icon: "search-alt",
                  s$placeholder: y(r).description.search.placeholder || "Pesquise aqui",
                  s$inputType: "search"
                }
              }), null, 16, ["modelValue"])
            ])) : I("", !0),
            N.noRefresh ? I("", !0) : (d(), D(ht, {
              key: 1,
              where: "bottom"
            }, {
              text: A(() => [
                oe(" Atualizar ")
              ]),
              default: A(() => [
                se(F(te, {
                  reactive: "",
                  name: "refresh",
                  onClick: p
                }, null, 512), [
                  [H]
                ])
              ]),
              _: 1
            })),
            y(r) && Object.keys(y(r).availableFilters).length > 0 ? se((d(), D(te, {
              key: 2,
              reactive: "",
              name: "filter",
              onClick: V[2] || (V[2] = (R) => it.value = !0)
            }, {
              default: A(() => [
                oe(" Filtros ")
              ]),
              _: 1
            })), [
              [H]
            ]) : I("", !0),
            y(r) && Object.keys(y(r).availableFilters).length > 0 ? (d(), D(ht, {
              key: 3,
              where: "bottom"
            }, {
              text: A(() => [
                oe(" Limpar filtros ")
              ]),
              default: A(() => [
                F(je, {
                  disabled: y(r).filtersCount === 0
                }, {
                  default: A(() => [
                    y(r) && Object.keys(y(r).availableFilters).length > 0 ? (d(), D(te, {
                      key: 0,
                      reactive: "",
                      name: "trash",
                      onClick: V[3] || (V[3] = () => y(r).clearFilters() && y(r).filter(void 0, { unproxied: !0 }))
                    })) : I("", !0)
                  ]),
                  _: 1
                }, 8, ["disabled"])
              ]),
              _: 1
            })) : I("", !0),
            !N.noLayoutToggle && y(r) && y(r).description.layout && ((k = y(r).description.layout) == null ? void 0 : k.name) !== "tabular" ? (d(), D(ht, {
              key: 4,
              where: "bottom"
            }, {
              text: A(() => [
                oe(" Alternar layout ")
              ]),
              default: A(() => [
                se(F(te, {
                  reactive: "",
                  name: "table",
                  onClick: V[4] || (V[4] = (R) => S(y(r)))
                }, null, 512), [
                  [H]
                ])
              ]),
              _: 1
            })) : I("", !0),
            ((L = y(r)) == null ? void 0 : L.actions.length) > 0 || N.$slots.actions ? (d(), b("div", {
              key: N.collection,
              class: "crud__actions"
            }, [
              (d(!0), b(re, null, ee(y(r).actions, (R, P) => (d(), D(ve, {
                key: `action-${P}`,
                icon: R.icon,
                disabled: y(r).selectedIds.length === 0 && R.selection,
                onClick: (me) => y(Qt)(R)({ _id: N.selectedIds })
              }, {
                default: A(() => [
                  oe(M(N.$t(R.name)), 1)
                ]),
                _: 2
              }, 1032, ["icon", "disabled", "onClick"]))), 128)),
              N.$slots.actions ? j(N.$slots, "actions", { key: 0 }, void 0, !0) : I("", !0)
            ])) : I("", !0)
          ])) : I("", !0),
          se((d(), b("div", null, [
            y(r).itemsCount === 0 && !y(r).loading.getAll && (y(v) || N.$slots.empty) ? (d(), b("div", Ea, [
              y(v) ? (d(), D(Ce(y(v)), ue(q({ key: 0 }, {
                collection: y(r).$id
              })), null, 16)) : j(N.$slots, "empty", ue(q({ key: 1 }, {
                collection: y(r).$id
              })), void 0, !0)
            ])) : N.$slots.component ? j(N.$slots, "component", ue(q({ key: 1 }, {
              store: y(r)
            })), void 0, !0) : (d(), D(Ce(y(yl)(((B = N.layout) == null ? void 0 : B.name) || y(r).$currentLayout)), ue(q({ key: 2 }, {
              individualActions: Y.value,
              layoutOptions: ((O = N.layout) == null ? void 0 : O.options) || ((U = y(r)) == null ? void 0 : U.layout.options),
              componentProps: N.componentProps
            })), Te({ _: 2 }, [
              ee(Object.keys(N.$slots).filter((R) => R.startsWith("row-")), (R) => ({
                name: R,
                fn: A((P) => [
                  j(N.$slots, R, ue(Fe(P)), void 0, !0)
                ])
              })),
              N.$slots.tfoot ? {
                name: "tfoot",
                fn: A(() => [
                  j(N.$slots, "tfoot", {}, void 0, !0)
                ]),
                key: "0"
              } : void 0
            ]), 1040))
          ])), [
            [m, y(r).loading.getAll]
          ])
        ]),
        !N.noControls && !y(r).loading.getAll && y(r).itemsCount > 0 ? (d(), b("div", Ia, [
          F(bi, { collection: N.collection }, null, 8, ["collection"])
        ])) : I("", !0)
      ], 64);
    };
  }
});
const xa = /* @__PURE__ */ Q(Ta, [["__scopeId", "data-v-25be976a"]]), Hs = /* @__PURE__ */ W({
  __name: "sv-modal",
  props: {
    closeHint: { type: Boolean, default: !0 }
  },
  setup(t) {
    const e = t, s = he("meta");
    return (n, o) => (d(), D(ln, q({ float: "" }, e, {
      onClose: o[0] || (o[0] = (i) => y(s).modal.isVisible = !1),
      onOverlayClick: o[1] || (o[1] = (i) => y(s).modal.isVisible = !1)
    }), Te({
      default: A(() => [
        n.$slots.body ? j(n.$slots, "body", { key: 0 }) : j(n.$slots, "default", { key: 1 })
      ]),
      _: 2
    }, [
      n.$slots.footer ? {
        name: "footer",
        fn: A(() => [
          j(n.$slots, "footer")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Aa = /* @__PURE__ */ W({
  __name: "sv-prompt",
  props: {
    title: {},
    actions: {}
  },
  setup(t) {
    const e = he("meta"), s = (n) => {
      e.fulfillPrompt(n);
    };
    return (n, o) => (d(), D(Hs, { "close-hint": !1 }, Te({
      footer: A(() => [
        (d(!0), b(re, null, ee(n.actions, (i, a) => (d(), D(ve, q(i, {
          key: `action-${a}`,
          onClick: (u) => s(i)
        }), {
          default: A(() => [
            oe(M(i.title), 1)
          ]),
          _: 2
        }, 1040, ["onClick"]))), 128))
      ]),
      default: A(() => [
        n.$slots.body ? j(n.$slots, "body", { key: 0 }) : j(n.$slots, "default", { key: 1 })
      ]),
      _: 2
    }, [
      n.title ? {
        name: "title",
        fn: A(() => [
          oe(M(n.title), 1)
        ]),
        key: "0"
      } : void 0
    ]), 1024));
  }
}), Va = /* @__PURE__ */ W({
  __name: "sv-toast",
  props: {
    idx: {},
    itr: {},
    date: {},
    icon: {}
  },
  setup(t) {
    const e = he("meta");
    return (s, n) => {
      const o = ae("clickable");
      return se((d(), b("div", {
        class: x({
          toast: !0,
          "toast--animate": y(e).toasts[0].itr === s.itr
        }),
        onAnimationend: n[0] || (n[0] = (i) => y(e).popToast()),
        onClick: n[1] || (n[1] = (i) => y(e).popToast(s.itr))
      }, [
        C("div", null, [
          s.icon ? (d(), D(te, {
            key: 0,
            small: "",
            name: s.icon
          }, {
            default: A(() => [
              j(s.$slots, "default", {}, void 0, !0)
            ]),
            _: 3
          }, 8, ["name"])) : j(s.$slots, "default", { key: 1 }, void 0, !0)
        ]),
        C("div", null, M(s.date), 1)
      ], 34)), [
        [o]
      ]);
    };
  }
});
const Ra = /* @__PURE__ */ Q(Va, [["__scopeId", "data-v-f50dd1f6"]]);
const Ua = ["innerHTML"], ja = { class: "main__toasts" }, Ca = ["innerHTML"], Da = /* @__PURE__ */ W({
  __name: "sv-main",
  setup(t) {
    const e = he("meta");
    return io(), (s, n) => {
      const o = Qs("router-view");
      return d(), b("div", {
        id: "main",
        class: x(`
      main
      main--${y(e).$theme}
      ${y(e).$theme === "dark" && "tw-dark"}
  `)
      }, [
        (d(), D(xs, null, {
          default: A(() => [
            F(o, null, {
              default: A(({ Component: i }) => [
                (d(), D(Ce(i), null, Te({ _: 2 }, [
                  ee(Object.keys(s.$slots), (a) => ({
                    name: a,
                    fn: A(() => [
                      j(s.$slots, a, {}, void 0, !0)
                    ])
                  }))
                ]), 1024))
              ]),
              _: 3
            })
          ]),
          _: 3
        })),
        j(s.$slots, "default", {}, void 0, !0),
        F(Hs, q({
          modelValue: y(e).modal.visible,
          "onUpdate:modelValue": n[0] || (n[0] = (i) => y(e).modal.visible = i)
        }, y(e).modal), {
          default: A(() => [
            y(e).modal.body ? (d(), b("div", {
              key: 0,
              innerHTML: y(e).modal.body,
              style: { "white-space": "pre-wrap" }
            }, null, 8, Ua)) : I("", !0),
            y(e).modal.component ? (d(), D(Ce(y(e).modal.component), { key: 1 })) : I("", !0)
          ]),
          _: 1
        }, 16, ["modelValue"]),
        y(e).prompt.visible ? (d(), D(Aa, ue(q({ key: 0 }, y(e).prompt)), {
          default: A(() => [
            oe(M(y(e).prompt.body), 1)
          ]),
          _: 1
        }, 16)) : I("", !0),
        C("div", ja, [
          (d(!0), b(re, null, ee(y(e).toasts, (i) => (d(), D(Ra, q(i, {
            key: `toast-${i.itr}`
          }), {
            default: A(() => [
              C("div", {
                innerHTML: Array.isArray(i.text) ? s.$t(...i.text) : i.text
              }, null, 8, Ca)
            ]),
            _: 2
          }, 1040))), 128))
        ])
      ], 2);
    };
  }
});
const eu = /* @__PURE__ */ Q(Da, [["__scopeId", "data-v-7b03ceb6"]]), Ma = { class: "tabs" }, Fa = ["onClick"], La = /* @__PURE__ */ W({
  __name: "sv-tabs",
  props: {
    query: {},
    param: {}
  },
  async setup(t) {
    let e, s;
    const n = t;
    eo();
    const o = n.query ? "query" : "params", i = Z(() => a.currentRoute.value[o][n.query || n.param]), a = ([e, s] = on(() => rn()), e = await e, s(), e), u = (r) => {
      a.push({
        [o]: {
          [n.query || n.param]: r
        }
      });
    };
    return (r, h) => (d(), b("div", Ma, [
      (d(!0), b(re, null, ee(Object.keys(r.$slots), (c, l) => (d(), b("div", {
        key: c,
        class: x({
          tabs__tab: !0,
          "tabs__tab--current": c === i.value || !i.value && l === 0
        }),
        onClick: (p) => u(c)
      }, [
        j(r.$slots, c, {}, void 0, !0)
      ], 10, Fa))), 128))
    ]));
  }
});
const Pa = /* @__PURE__ */ Q(La, [["__scopeId", "data-v-caf4a198"]]), za = {
  key: 0,
  class: "topbar"
}, Ha = ["onClick"], Ja = { key: 1 }, qa = { key: 2 }, Wa = /* @__PURE__ */ W({
  __name: "sv-crud-topbar",
  props: {
    collection: {}
  },
  async setup(t) {
    let e, s;
    const n = t, i = ([e, s] = on(() => rn()), e = await e, s(), e).currentRoute, a = Z(() => {
      var r, h;
      try {
        const c = n.collection ? n.collection : ((r = i.value.meta) == null ? void 0 : r.collection) || ((h = i.value.params) == null ? void 0 : h.collection);
        return Ae(c);
      } catch {
        return null;
      }
    }), u = (r, h) => {
      if (a.value)
        return (({ value: c }) => {
          c.filtersPreset = (h == null ? void 0 : h.filters) || {}, c.preferredTableProperties = (h == null ? void 0 : h.table) || [], c.pagination.offset = 0;
        })(a);
    };
    return Oe(i, (r, h) => {
      if (!a.value || h)
        return;
      const { query: { preset: c } } = r;
      return (({ value: l }) => {
        if (l.description.filtersPresets) {
          if (c) {
            u(c, l.description.filtersPresets[c]);
            return;
          }
          u();
        }
      })(a);
    }, { immediate: !0 }), (r, h) => {
      var c;
      return a.value && Object.keys(a.value.description.filtersPresets || {}).length > 0 ? (d(), b("div", za, [
        (c = a.value) != null && c.description.filtersPresets ? (d(), D(Pa, {
          key: 0,
          query: "section"
        }, Te({
          all: A(() => [
            C("div", {
              onClick: h[0] || (h[0] = (l) => u())
            }, M(r.$t("all")), 1)
          ]),
          _: 2
        }, [
          ee(Object.entries(a.value.description.filtersPresets), ([l, p]) => ({
            name: l,
            fn: A(() => [
              C("div", {
                onClick: (v) => u(l, p)
              }, [
                p.icon ? (d(), D(te, {
                  key: 0,
                  small: "",
                  name: p.icon
                }, {
                  default: A(() => [
                    oe(M(p.name || r.$tc(l, 2)), 1)
                  ]),
                  _: 2
                }, 1032, ["name"])) : (d(), b("span", Ja, M(p.name || r.$tc(l, 2)), 1)),
                p.badgeFunction ? (d(), b("span", qa, " (" + M(a.value.customGetter[p.badgeFunction](l, {
                  filters: p.filters
                })) + ") ", 1)) : I("", !0)
              ], 8, Ha)
            ])
          }))
        ]), 1024)) : I("", !0)
      ])) : I("", !0);
    };
  }
});
const Ya = /* @__PURE__ */ Q(Wa, [["__scopeId", "data-v-d86ffe8a"]]), Za = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ya
}, Symbol.toStringTag, { value: "Module" })), tu = /* @__PURE__ */ W({
  __name: "sv-password-form",
  props: {
    modelValue: {}
  },
  setup(t) {
    const e = t;
    _e("storeId", null);
    const s = lo(), n = Z(() => s(e.modelValue.password, e.modelValue.confirmation));
    return (o, i) => (d(), b(re, null, [
      F(et, {
        form: {
          password: {
            type: "string",
            s$icon: "key-skeleton",
            s$inputType: "password"
          },
          confirmation: {
            type: "string",
            s$icon: "key-skeleton",
            s$inputType: "password"
          }
        },
        "model-value": o.modelValue,
        "onUpdate:modelValue": i[0] || (i[0] = (a) => o.$emit("update:modelValue", a))
      }, null, 8, ["model-value"]),
      C("div", null, M(n.value || "Senhas conferem"), 1),
      j(o.$slots, "default", ue(Fe({ passwordError: n.value })))
    ], 64));
  }
}), Js = async (t) => {
  var n, o;
  const e = (o = (n = ROUTER.getRoutes().find((i) => i.name === t)) == null ? void 0 : n.components) == null ? void 0 : o.default;
  return e instanceof Function ? await e() : e;
}, Ga = [
  {
    path: "/user",
    name: "/user",
    component: () => Js("/auth-wall"),
    children: [
      {
        path: "invite/:id",
        redirect: (t) => ({
          path: "/user/signup",
          params: {
            inviteId: t.params.id
          }
        })
      },
      {
        path: "signin",
        name: "/user/signin",
        component: () => import("./signin-974fcaf1.mjs"),
        meta: {
          title: "Autenticação"
        }
      },
      {
        path: "signup",
        name: "/user/signup",
        component: () => import("./signup-13e1e8cc.mjs"),
        meta: {
          title: "Registro"
        }
      },
      {
        path: "activation",
        name: "/user/activation",
        component: () => import("./activation-6bdf5b15.mjs"),
        meta: {
          title: "Ativação"
        }
      }
    ]
  }
], Ka = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => Js("/dashboard"),
    redirect: {
      name: "/dashboard/"
    },
    meta: {
      title: "Dashboard"
    },
    children: [
      {
        path: "c/:collection?",
        name: "dashboard-crud",
        props: !0,
        components: {
          default: () => import("./crud-view-d60f3d23.mjs"),
          topbar: () => Promise.resolve().then(() => Za)
        },
        meta: {
          title: "%viewTitle%"
        }
      },
      {
        path: "user",
        name: "dashboard-user-group",
        meta: {
          title: "user"
        },
        redirect: {
          name: "dashboard-user"
        },
        children: [
          {
            path: "/dashboard/user/profile",
            name: "dashboard-user-profile",
            component: () => import("./profile-f7dda9ff.mjs"),
            meta: {
              title: "Meu perfil",
              icon: "user-square"
            }
          },
          {
            path: "/dashboard/user/changepass",
            name: "dashboard-user-changepass",
            component: () => import("./password-change-8d3e120b.mjs"),
            meta: {
              title: "Mudar senha",
              icon: "lock"
            }
          }
        ]
      }
    ]
  }
], nu = [
  ...Ga,
  ...Ka
];
export {
  Ra as A,
  Ya as B,
  et as S,
  tu as _,
  ve as a,
  te as b,
  Sl as c,
  mt as d,
  xa as e,
  mn as f,
  ln as g,
  Q as h,
  je as i,
  Oo as j,
  an as k,
  ht as l,
  bi as m,
  ul as n,
  Pa as o,
  hl as p,
  Hl as q,
  nu as r,
  eu as s,
  lt as t,
  Nl as u,
  sa as v,
  hn as w,
  Ul as x,
  Hs as y,
  Aa as z
};
