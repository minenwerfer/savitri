import { defineComponent as v, withAsyncContext as V, resolveDirective as b, openBlock as s, createElementBlock as o, Fragment as w, createElementVNode as u, createCommentVNode as d, withDirectives as C, unref as e, createTextVNode as c, createVNode as _, withCtx as g, createBlock as x, toDisplayString as S } from "vue";
import { useRouter as $, useStore as y } from "@savitri/web";
import { S as T, a as f } from "./index-88f8c90d.mjs";
const N = { style: { "text-align": "center" } }, B = ["innerHTML"], L = { key: 1 }, D = /* @__PURE__ */ u("span", null, "Não possui uma conta?", -1), E = { style: { width: "100%", display: "flex", "flex-direction": "column", gap: "1rem" } }, z = /* @__PURE__ */ v({
  __name: "signin",
  async setup(F) {
    let i, m;
    const a = ([i, m] = V(() => $()), i = await i, m(), i), t = y("user"), p = y("meta"), h = async () => {
      await t.authenticate(t.credentials), a.push("/dashboard");
    };
    return (r, n) => {
      const k = b("clickable");
      return s(), o(w, null, [
        u("div", N, [
          r.instanceVars.signinText ? (s(), o("h1", {
            key: 0,
            innerHTML: r.instanceVars.signinText,
            style: { "font-size": "2.4rem", "margin-bottom": ".8rem" }
          }, null, 8, B)) : d("", !0),
          r.instanceVars.signupForm ? (s(), o("div", L, [
            D,
            C((s(), o("span", {
              style: { color: "#2d96fa" },
              onClick: n[0] || (n[0] = (l) => e(a).push("/user/signup"))
            }, [
              c(" Criar uma conta ")
            ])), [
              [k]
            ])
          ])) : d("", !0)
        ]),
        _(T, {
          modelValue: e(t).credentials,
          "onUpdate:modelValue": n[1] || (n[1] = (l) => e(t).credentials = l),
          form: {
            email: {
              type: "string",
              s$icon: "user"
            },
            password: {
              type: "string",
              s$icon: "key-skeleton",
              s$inputType: "password"
            }
          }
        }, null, 8, ["modelValue"]),
        u("div", E, [
          _(f, {
            loading: e(t).loading.authenticate,
            disabled: !e(t).credentials.email || !e(t).credentials.password,
            onClick: h
          }, {
            default: g(() => [
              c(" Entrar ")
            ]),
            _: 1
          }, 8, ["loading", "disabled"]),
          e(t).$currentUser._id && !e(p).isLoading ? (s(), x(f, {
            key: 0,
            disabled: e(t).loading.authenticate || e(p).isLoading,
            onClick: n[2] || (n[2] = (l) => e(a).push("/dashboard"))
          }, {
            default: g(() => [
              c(" Continuar como " + S(e(t).$currentUser.first_name), 1)
            ]),
            _: 1
          }, 8, ["disabled"])) : d("", !0)
        ])
      ], 64);
    };
  }
});
export {
  z as default
};
