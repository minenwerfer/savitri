import { defineComponent as h, ref as $, resolveDirective as w, openBlock as n, createElementBlock as C, Fragment as B, createElementVNode as m, createVNode as a, mergeProps as _, unref as o, withCtx as r, withDirectives as d, createBlock as f, toDisplayString as N, renderSlot as g, createCommentVNode as S, createTextVNode as c } from "vue";
import { useStore as y, useRouter as x } from "@savitri/web";
import { f as I, b as p, g as P, a as U, S as D, h as E } from "./index-88f8c90d.mjs";
const F = { class: "profile__menu" }, M = /* @__PURE__ */ h({
  __name: "profile",
  setup(O) {
    const e = y("user"), k = y("meta"), i = $(!1);
    e.setItem(e.$currentUser);
    const V = async () => {
      await e.insert({ what: e.item }), userStorage.setItem("auth:currentUser", JSON.stringify(e.item)), k.spawnModal({
        title: "Feito!",
        body: "Suas informações foram salvas"
      });
    }, b = async () => {
      await e.signout(), (await x()).push("/user/signin");
    };
    return (l, t) => {
      var v;
      const u = w("clickable");
      return n(), C(B, null, [
        m("div", null, [
          a(I, _({
            width: "14rem",
            height: "14rem"
          }, {
            bordered: "",
            "file-id": ((v = o(e).item.picture) == null ? void 0 : v._id) || o(e).item.picture,
            style: { display: "flex", "flex-direction": "column", "align-items": "center" }
          }), {
            caption: r(() => [
              d((n(), f(p, {
                small: "",
                "icon-right": "",
                name: "edit",
                onClick: t[0] || (t[0] = (s) => i.value = !0)
              }, {
                default: r(() => [
                  m("h2", null, N(o(e).item.full_name), 1)
                ]),
                _: 1
              })), [
                [u]
              ]),
              m("menu", F, [
                l.$slots["user-profile-menu"] ? g(l.$slots, "user-profile-menu", { key: 0 }, void 0, !0) : S("", !0),
                d((n(), f(p, {
                  name: "key-skeleton",
                  onClick: t[1] || (t[1] = (s) => l.$router.push("/dashboard/user/changepass"))
                }, {
                  default: r(() => [
                    c(" Mudar senha ")
                  ]),
                  _: 1
                })), [
                  [u]
                ]),
                d((n(), f(p, {
                  name: "signout",
                  onClick: b
                }, {
                  default: r(() => [
                    c(" Sair ")
                  ]),
                  _: 1
                })), [
                  [u]
                ])
              ])
            ]),
            _: 3
          }, 16, ["file-id"])
        ]),
        l.$slots["user-profile"] ? g(l.$slots, "user-profile", { key: 0 }, void 0, !0) : S("", !0),
        a(P, {
          float: "",
          "close-hint": "",
          title: "Editar perfil",
          modelValue: i.value,
          "onUpdate:modelValue": t[3] || (t[3] = (s) => i.value = s),
          onOverlayClick: t[4] || (t[4] = (s) => i.value = !1)
        }, {
          footer: r(() => [
            a(U, {
              loading: o(e).loading.insert,
              onClick: V
            }, {
              default: r(() => [
                c(" Salvar ")
              ]),
              _: 1
            }, 8, ["loading"])
          ]),
          default: r(() => [
            a(D, _({
              modelValue: o(e).item,
              "onUpdate:modelValue": t[2] || (t[2] = (s) => o(e).item = s)
            }, {
              collection: "user",
              form: o(e).useProperties([
                "full_name",
                "email",
                "phone",
                "picture"
              ]),
              layout: o(e).formLayout
            }), null, 16, ["modelValue"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ], 64);
    };
  }
});
const T = /* @__PURE__ */ E(M, [["__scopeId", "data-v-c425bf7d"]]);
export {
  T as default
};
