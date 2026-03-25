import { T } from "../data/translations.js";
import { MA } from "../data/etfs.js";

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
  empType: "employee",
};

export function t(k) {
  return T[Z.lang][k] || T.fr[k] || k;
}

// Annual 3a contribution cap (employee vs self-employed without BVG)
export function annCap(yr) {
  var base = yr ? MA[yr] : 7258;
  if (Z.empType === "selfEmployed") {
    return Math.min(Z.salary * 0.2, base * 5);
  }
  return base;
}

// Monthly slider max
export function moCap() {
  if (Z.empType === "selfEmployed") {
    return Math.floor(Math.min(Z.salary * 0.2, 36288) / 12);
  }
  return 605;
}
