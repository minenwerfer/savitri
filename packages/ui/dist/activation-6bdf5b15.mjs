import { defineComponent as S, withAsyncContext as c, ref as k, unref as p, openBlock as f, createElementBlock as _, createVNode as r, withCtx as l, createTextVNode as v, createElementVNode as w } from "vue";
import { useRouter as x, useStore as y } from "@savitri/web";
import { d as I, S as R, _ as $, a as g } from "./index-88f8c90d.mjs";
const b = {
  key: 0,
  style: { display: "grid", gap: "1rem" }
}, q = /* @__PURE__ */ w("h1", null, "Cadastre uma senha", -1), B = {
  key: 1,
  style: { display: "grid", gap: "1rem" }
}, E = /* @__PURE__ */ w("h1", null, "Conta ativada com sucesso!", -1), F = /* @__PURE__ */ S({
  __name: "activation",
  async setup(N) {
    let e, n;
    const o = ([e, n] = c(() => x()), e = await e, n(), e), u = y("user"), V = y("meta"), h = o.currentRoute.value.query.step || "success", i = o.currentRoute.value.query.u, d = o.currentRoute.value.query.t, m = I.unsafe(([e, n] = c(() => u.functions.getInfo({
      userId: i,
      token: d
    })), e = await e, n(), e)), t = k({
      full_name: m.full_name,
      email: m.email,
      password: "",
      confirmation: ""
    }), C = async () => {
      await u.custom(`activate?u=${i}&t=${d}`, {
        password: t.value.password
      }), u.credentials.email = t.value.email, await V.spawnModal({
        title: "Sucesso!",
        body: "Sua conta foi ativada com sucesso. Experimente fazer login com o seu email e senha."
      }), o.push("/user/signin");
    };
    return (O, a) => p(h) === "password" ? (f(), _("div", b, [
      q,
      r(R, {
        modelValue: t.value,
        "onUpdate:modelValue": a[0] || (a[0] = (s) => t.value = s),
        form: {
          full_name: {
            type: "string",
            readOnly: !0
          },
          email: {
            type: "string",
            readOnly: !0
          }
        }
      }, null, 8, ["modelValue"]),
      r($, {
        modelValue: t.value,
        "onUpdate:modelValue": a[1] || (a[1] = (s) => t.value = s)
      }, {
        default: l(({ passwordError: s }) => [
          r(g, {
            disabled: !!s,
            onClick: C
          }, {
            default: l(() => [
              v(" Cadastrar senha ")
            ]),
            _: 2
          }, 1032, ["disabled"])
        ]),
        _: 1
      }, 8, ["modelValue"])
    ])) : (f(), _("div", B, [
      E,
      r(g, {
        onClick: a[2] || (a[2] = (s) => p(o).push("/user/signin"))
      }, {
        default: l(() => [
          v(" Ir para a página de login ")
        ]),
        _: 1
      })
    ]));
  }
});
export {
  F as default
};
