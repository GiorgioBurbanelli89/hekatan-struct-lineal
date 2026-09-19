import { v as o } from "./Text-B_686FPU.js";
import { D as n, __tla as __tla_0 } from "./aiAgent-Bekk_6_j.js";
let a;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  a = function({ template: t, data: r }) {
    const e = document.createElement("div");
    return o.derive(() => {
      n(t(r), e);
    }), e;
  };
});
export {
  __tla,
  a as g
};
