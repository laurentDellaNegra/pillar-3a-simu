import { T } from "../data/translations.js";

export var Z = {
  monthly: 605,
  salary: 115000,
  status: "single",
  canton: "Lausanne",
  startBal: 0,
  idx: "voo",
  idx2: "cspx",
  showTable: false,
  dedMode: "reinvest",
  lang: "fr",
  customRate: 0,
  cmpMode: false,
  showProj: false,
  projYr: 20,
  projRet: 8,
  showRetro: false,
  retroYrs: 3,
  show2P: false,
  p2Amt: 20000,
  p2Yr: 20,
  age: 30,
  showMC: false,
  showOpp: false,
};

export function t(k) {
  return T[Z.lang][k] || T.fr[k] || k;
}
