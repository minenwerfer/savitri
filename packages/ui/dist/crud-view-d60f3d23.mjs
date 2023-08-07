import { defineComponent as o, openBlock as t, createBlock as r, createSlots as c, withCtx as l, renderSlot as n, createCommentVNode as i } from "vue";
import { e as m } from "./index-88f8c90d.mjs";
import "@savitri/web";
const f = /* @__PURE__ */ o({
  __name: "crud-view",
  props: {
    collection: {}
  },
  setup(p) {
    return (e, s) => e.collection ? (t(), r(m, {
      collection: e.collection,
      key: e.collection
    }, c({ _: 2 }, [
      e.$slots["crud-empty"] ? {
        name: "empty",
        fn: l(() => [
          n(e.$slots, "crud-empty")
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["collection"])) : i("", !0);
  }
});
export {
  f as default
};
