import { defineComponent as u, withAsyncContext as _, ref as p, openBlock as f, createElementBlock as w, createVNode as n, withCtx as i, createTextVNode as x } from "vue";
import { useRouter as h, useStore as d } from "@savitri/web";
import { _ as v, a as y } from "./index-88f8c90d.mjs";
const b = { style: { display: "flex", "flex-direction": "column", gap: "1.2rem", "max-width": "30rem" } }, B = /* @__PURE__ */ u({
  __name: "password-change",
  async setup(S) {
    let e, o;
    const l = ([e, o] = _(() => h()), e = await e, o(), e), s = d("user"), c = d("meta"), t = p({
      password: "",
      confirmation: ""
    }), m = async () => {
      await s.insert({
        what: {
          _id: s.item._id,
          password: t.value.password
        }
      }), await c.spawnModal({
        title: "Feito!",
        body: "A senha foi atualizada"
      }), l.back();
    };
    return (V, r) => (f(), w("div", b, [
      n(v, {
        modelValue: t.value,
        "onUpdate:modelValue": r[0] || (r[0] = (a) => t.value = a)
      }, {
        default: i(({ passwordError: a }) => [
          n(y, {
            class: "passchange__save-button",
            disabled: !!a,
            onClick: m
          }, {
            default: i(() => [
              x(" Salvar ")
            ]),
            _: 2
          }, 1032, ["disabled"])
        ]),
        _: 1
      }, 8, ["modelValue"])
    ]));
  }
});
export {
  B as default
};
