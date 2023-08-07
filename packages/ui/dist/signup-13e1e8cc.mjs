import { defineComponent as y, withAsyncContext as _, ref as v, resolveDirective as C, openBlock as w, createElementBlock as g, Fragment as S, createElementVNode as p, withDirectives as h, createBlock as B, unref as s, withCtx as r, createTextVNode as m, createVNode as n, mergeProps as D } from "vue";
import { useRouter as E, useStore as b } from "@savitri/web";
import { b as N, S as P, _ as U, c as $, a as A } from "./index-88f8c90d.mjs";
const F = /* @__PURE__ */ p("h1", null, "Criar conta", -1), q = { style: { display: "flex", "flex-direction": "column", "align-items": "start", gap: "2rem" } }, j = /* @__PURE__ */ y({
  __name: "signup",
  async setup(I) {
    let t, l;
    const f = ([t, l] = _(() => E()), t = await t, l(), t), o = b("user"), i = b("meta");
    i.descriptions.user || ([t, l] = _(() => i.describe({
      collections: ["user"],
      roles: !0
    })), await t, l());
    const u = v(!1), c = v({
      password: "",
      confirmation: ""
    }), V = async () => {
      o.item.password = c.value.password, await o.insert().catch(async (d) => {
        throw await o.errorPopup(d), f.back(), d;
      }), await i.spawnModal({
        title: "Conta registrada",
        body: "Blabla"
      });
    };
    return (d, e) => {
      const k = C("clickable");
      return w(), g(S, null, [
        p("div", null, [
          F,
          h((w(), B(N, {
            name: "arrow-left",
            onClick: e[0] || (e[0] = (a) => s(f).push({ name: "/user/signin" }))
          }, {
            default: r(() => [
              m(" Efetuar login ")
            ]),
            _: 1
          })), [
            [k]
          ])
        ]),
        n(P, D({
          modelValue: s(o).item,
          "onUpdate:modelValue": e[3] || (e[3] = (a) => s(o).item = a)
        }, {
          collection: "user",
          form: s(o).useProperties([
            "full_name",
            "email",
            "phone"
          ])
        }), {
          after: r(() => [
            n(U, {
              modelValue: c.value,
              "onUpdate:modelValue": e[2] || (e[2] = (a) => c.value = a)
            }, {
              default: r(({ passwordError: a }) => [
                p("div", q, [
                  n($, {
                    modelValue: u.value,
                    "onUpdate:modelValue": e[1] || (e[1] = (x) => u.value = x),
                    property: {
                      type: "boolean",
                      s$element: "checkbox"
                    }
                  }, {
                    default: r(() => [
                      m(" Declaro que li e aceito os termos de uso ")
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                n(A, {
                  disabled: !!a || !u.value,
                  onClick: V
                }, {
                  default: r(() => [
                    m(" Criar conta ")
                  ]),
                  _: 2
                }, 1032, ["disabled"])
              ]),
              _: 1
            }, 8, ["modelValue"])
          ]),
          _: 1
        }, 16, ["modelValue"])
      ], 64);
    };
  }
});
export {
  j as default
};
