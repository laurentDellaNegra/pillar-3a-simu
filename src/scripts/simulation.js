import { CN } from "../data/communes.js";
import { IDX, YR, MA } from "../data/etfs.js";
import { Z } from "./state.js";
import { wT, getMg } from "./tax.js";

export function runSim(idxKey) {
  var ct = CN[Z.canton],
    mg = getMg(Z.salary, Z.canton, Z.status),
    wt = ct.w,
    ms = ct.ms,
    dm = Z.dedMode;
  var ix = IDX[idxKey],
    dy = ix.dy / 100;
  var fp = Z.startBal,
    ib = Z.startBal,
    fpTs = 0,
    fpSide = 0,
    ibDt = 0,
    ibWt = 0;
  var cL = [],
    cFP = [],
    cIB = [];
  for (var yi = 0; yi < YR.length; yi++) {
    var yr = YR[yi],
      c = Math.min(Z.monthly * 12, MA[yr]);
    var bR = ix.r[yr],
      fpR = bR + ix.fpAdj,
      ibR = bR + ix.ibAdj;
    fpTs += c * mg;
    fp = (fp + c) * (1 + fpR / 100);
    var sv = c * mg;
    if (dm === "reinvest") {
      var ig = ibR / 100;
      fpSide = (fpSide + sv * 0.9985) * (1 + ig);
      fpSide -= ((fpSide * dy * mg) / (1 + ig / 2)) * 0.5;
      fpSide -= fpSide * wt;
    } else if (dm === "cash") {
      fpSide += sv;
      fpSide -= fpSide * wt;
    }
    var fxF = ix.dom === "🇨🇭" ? 1 : 0.9997; // IBKR FX fee ~2 USD per conversion (~0.03%)
    var ig2 = ibR / 100;
    ib = (ib + c * 0.9985 * fxF) * (1 + ig2);
    var aB = ib / (1 + ig2 / 2);
    var dd = aB * dy * mg,
      ww = ib * wt;
    ibDt += dd;
    ibWt += ww;
    ib -= dd + ww;
    cL.push(yr);
    cFP.push(Math.round(fp + fpSide));
    cIB.push(Math.round(ib));
  }
  var tc = Z.startBal;
  for (yi = 0; yi < YR.length; yi++) tc += Math.min(Z.monthly * 12, MA[YR[yi]]);
  var sc = [];
  for (var n = 1; n <= ms; n++) {
    var pa = fp / n,
      tp = wT(pa, Z.canton, Z.status) * n;
    sc.push({ ac: n, pa: fp / n, tt: tp, rt: fp > 0 ? tp / fp : 0, nt: fp - tp });
  }
  var s1 = sc[0].tt;
  var bs = sc[sc.length - 1];
  if (sc.length > 1) {
    var mxS = s1 - sc[sc.length - 1].tt;
    for (var i = 0; i < sc.length; i++) {
      if (mxS <= 0 || s1 - sc[i].tt >= mxS * 0.95) {
        bs = sc[i];
        break;
      }
    }
  }
  return {
    cL: cL,
    cFP: cFP,
    cIB: cIB,
    fp: fp,
    ib: ib,
    fpSide: fpSide,
    dm: dm,
    tc: tc,
    ibDt: ibDt,
    ibWt: ibWt,
    fpTs: fpTs,
    sc: sc,
    bs: bs,
    s1: s1,
    ws: s1 - bs.tt,
    fpNO: fp - bs.tt + fpSide,
    fpN1: fp - s1 + fpSide,
    ibN: ib * 0.9985,
    mg: mg,
    wt: wt,
    ms: ms,
    ct: ct,
    ix: ix,
  };
}
