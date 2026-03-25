import { CN } from "../data/communes.js";
import { IDX } from "../data/etfs.js";
import { Z, t, moCap } from "./state.js";
import { mkS, mkP, setRenderFn } from "./ui.js";
import { render } from "./render.js";

// Wire up the render function for ui.js (breaks circular dependency)
setRenderFn(render);

function buildAll() {
  var ltE = document.getElementById("langToggle");
  ltE.innerHTML = "";
  ["fr", "de", "it", "en"].forEach(function (lg) {
    var b = document.createElement("button");
    b.className = "lang-btn" + (Z.lang === lg ? " on" : "");
    b.textContent = lg.toUpperCase();
    b.onclick = function () {
      Z.lang = lg;
      buildAll();
    };
    ltE.appendChild(b);
  });

  // ETF dropdowns
  function fillSel(selId, val) {
    var sel = document.getElementById(selId);
    sel.innerHTML = "";
    var gr = t("grp"),
      gk = {
        "S&P 500": ["voo", "cspx"],
        "World / All-World": ["iwda", "vt", "vwce", "isac"],
        Ém: ["vwo"],
        Jp: ["ewj"],
        CH: ["chspi"],
      };
    Object.keys(gk).forEach(function (g) {
      var og = document.createElement("optgroup");
      og.label = "── " + (gr[g] || g) + " ──";
      gk[g].forEach(function (k) {
        var o = document.createElement("option");
        o.value = k;
        o.textContent =
          IDX[k].name +
          " — " +
          IDX[k].full +
          " (" +
          IDX[k].dom +
          " " +
          IDX[k].ter.toFixed(2) +
          "%)";
        og.appendChild(o);
      });
      sel.appendChild(og);
    });
    sel.value = val;
  }

  fillSel("idxSel", Z.idx);
  fillSel("idxSel2", Z.idx2);
  document.getElementById("idxSel").onchange = function () {
    Z.idx = this.value;
    render();
  };
  document.getElementById("idxSel2").onchange = function () {
    Z.idx2 = this.value;
    render();
  };
  var cmpT = document.getElementById("cmpToggle");
  cmpT.checked = Z.cmpMode;
  cmpT.onchange = function () {
    Z.cmpMode = this.checked;
    document.getElementById("idxSel2").disabled = !Z.cmpMode;
    document.getElementById("idxSel2").style.opacity = Z.cmpMode ? 1 : 0.4;
    render();
  };
  document.getElementById("lbCmpOn").style.cursor = "pointer";
  document.getElementById("lbCmpOn").onclick = function () {
    cmpT.checked = !cmpT.checked;
    cmpT.onchange();
  };
  document.getElementById("idxSel2").disabled = !Z.cmpMode;
  document.getElementById("idxSel2").style.opacity = Z.cmpMode ? 1 : 0.4;

  // Sliders
  var moMax = moCap();
  if (Z.monthly > moMax) Z.monthly = moMax;
  mkS(
    "s1",
    t("mo"),
    "monthly",
    0,
    moMax,
    5,
    " CHF",
    function (v) {
      return v.toLocaleString("de-CH");
    },
    "#3b82f6",
  );
  var salMax = Z.status === "married" || Z.status === "family" ? 750000 : 250000;
  if (Z.salary > salMax) Z.salary = salMax;
  mkS(
    "s2",
    Z.empType === "selfEmployed" ? t("salSE") : t("sal"),
    "salary",
    50000,
    salMax,
    5000,
    " CHF",
    function (v) {
      return (v / 1000).toFixed(0) + "k";
    },
    "#60a5fa",
  );
  mkS(
    "s3",
    t("sb"),
    "startBal",
    0,
    100000,
    1000,
    " CHF",
    function (v) {
      return (v / 1000).toFixed(0) + "k";
    },
    "#8b5cf6",
  );

  // Projection sliders
  mkS("sp1", t("pH"), "projYr", 5, 35, 1, " " + t("an"), null, "#8b5cf6");
  mkS("sp2", t("pR"), "projRet", 2, 14, 0.5, "%", null, "#f59e0b");

  // Retro sliders
  mkS("sr1", t("rYrs"), "retroYrs", 1, 5, 1, "", null, "#f59e0b");

  // 2P sliders
  mkS(
    "s2p1",
    t("p2Am"),
    "p2Amt",
    5000,
    100000,
    5000,
    " CHF",
    function (v) {
      return (v / 1000).toFixed(0) + "k";
    },
    "#34d399",
  );
  mkS("s2p2", t("p2Yr"), "p2Yr", 5, 35, 1, " " + t("an"), null, "#34d399");

  // Pills
  document.getElementById("lbEmpType").textContent = t("empTy");
  var etLb = { employee: t("emp"), selfEmployed: t("se") };
  mkP("pet", etLb, "empType", "#10b981", buildAll);
  document.getElementById("seHint").textContent =
    Z.empType === "selfEmployed" ? t("seCap") : "";
  var stLb = { single: t("si"), married: t("ma"), family: t("fam") };
  mkP("ps", stLb, "status", "#3b82f6", buildAll);
  document.getElementById("lbCanton").textContent = t("cmLb");
  var cl = {};
  Object.keys(CN).forEach(function (k) {
    cl[k] = CN[k].n;
  });
  mkP("pc", cl, "canton", "#60a5fa");
  document.getElementById("cmHint").textContent = t("cmH");
  var dmLb = { reinvest: t("dR"), cash: t("dC"), ignore: t("dI") };
  mkP("pdm", dmLb, "dedMode", "#f59e0b");

  // Custom rate
  document.getElementById("lbCustom").textContent = t("cr");
  document.getElementById("customHint").textContent =
    Z.customRate > 0 ? "✋" : "(" + t("crH") + ")";
  var crI = document.getElementById("customRateInput");
  crI.value = Z.customRate;
  crI.oninput = function () {
    Z.customRate = parseFloat(this.value) || 0;
    document.getElementById("customHint").textContent =
      Z.customRate > 0 ? "✋" : "(" + t("crH") + ")";
    render();
  };

  // Age slider for opportunity cost
  mkS("sAge", t("oppAge"), "age", 20, 55, 1, " " + t("an"), null, "#fb923c");

  // Toggle sections via data-toggle attribute
  document.querySelectorAll("[data-toggle]").forEach(function (el) {
    el.addEventListener("click", function () {
      var key = this.getAttribute("data-toggle");
      Z[key] = !Z[key];
      render();
    });
  });

  // Table toggle
  document.getElementById("tt").onclick = function () {
    Z.showTable = !Z.showTable;
    document.getElementById("tw").classList.toggle("hid", !Z.showTable);
    render();
  };

  render();
}

buildAll();
