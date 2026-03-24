import { CN } from "../data/communes.js";
import { Z } from "./state.js";

export function wT(a, c, s) {
  var b = CN[c].br[s];
  for (var i = 0; i < b.length; i++) if (a <= b[i][0]) return a * b[i][1];
  return 0;
}

export function getMg(sal, canton, status) {
  if (Z.customRate > 0) return Z.customRate / 100;
  var ct = CN[canton];
  if (!ct) return 0.3;
  var mr = ct.mr;
  if (!mr) return ct.mg[status] || 0.3;
  var si = status === "single" ? 1 : status === "married" ? 2 : 3;
  for (var i = 0; i < mr.length - 1; i++) {
    if (sal <= mr[i + 1][0]) {
      var t2 = (sal - mr[i][0]) / (mr[i + 1][0] - mr[i][0]);
      return mr[i][si] + t2 * (mr[i + 1][si] - mr[i][si]);
    }
  }
  return mr[mr.length - 1][si];
}
