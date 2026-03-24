import { CN } from "../data/communes.js";
import { IDX, YR, MA } from "../data/etfs.js";
import { Z, t } from "./state.js";
import { fm, pp } from "./format.js";
import { wT } from "./tax.js";
import { svgC } from "./chart.js";
import { runSim } from "./simulation.js";

export function render() {
  var R = runSim(Z.idx),
    ct = R.ct,
    b = R.bs,
    ba = b.ac,
    ix = R.ix;
  // Header
  document.getElementById("header").innerHTML =
    '<div style="margin-bottom:24px"><div style="font-size:10px;font-family:var(--m);color:#3b5a70;letter-spacing:3px;margin-bottom:6px">' +
    t("sub") +
    '</div><h1 style="font-size:26px;font-weight:700"><span style="color:#3b82f6">' +
    t("h1a") +
    "</span>" +
    t("h1b") +
    '</h1><p style="font-size:12px;color:#5a7080;margin-top:6px">' +
    t("h1sub") +
    "</p></div>";
  document.getElementById("etfLabel").textContent = t("etfLb");
  document.getElementById("paramLabel").textContent = t("param");
  document.getElementById("lbStatus").textContent = t("stat");
  document.getElementById("lbDed").textContent = t("dedLb");
  document.getElementById("lbCmpOn").textContent = t("cmpOn");
  // Index info
  var aH =
    '<table style="width:100%;margin-top:8px;font-size:9px;border-collapse:collapse"><thead><tr style="border-bottom:1px solid #1a2a38"><th style="text-align:left;padding:4px 6px;color:#3a6a78">%</th><th style="text-align:left;padding:4px 6px;color:#3a6a78">Fund</th><th style="text-align:right;padding:4px 6px;color:#3a6a78">TER</th></tr></thead><tbody>';
  ix.alloc.forEach(function (a) {
    aH +=
      '<tr style="border-bottom:1px solid #0e1820"><td style="padding:3px 6px;color:#34d399;font-weight:700">' +
      a.pct +
      '%</td><td style="padding:3px 6px;color:#8aa0b0;text-align:left">' +
      a.fund +
      '</td><td style="padding:3px 6px;color:#6a8a78;text-align:right">' +
      a.ter +
      "</td></tr>";
  });
  aH += "</tbody></table>";
  document.getElementById("idxInfo").innerHTML =
    '<b style="color:#60a5fa">' +
    ix.name +
    "</b> — " +
    ix.full +
    " · " +
    ix.dom +
    " · TER " +
    ix.ter.toFixed(2) +
    '%<br><span style="color:#6a8a9a">' +
    ix.desc +
    '</span><div style="margin-top:8px;color:#34d399;font-size:9px;letter-spacing:.5px">' +
    t("alEq") +
    "</div>" +
    aH;
  // Tax info
  var rm =
    Z.customRate > 0
      ? ' <span style="color:#f59e0b">✋</span>'
      : ' <span style="color:#3a5060">(auto)</span>';
  var mi =
    R.ms < 5
      ? ' · <span style="color:#f59e0b">Max ' +
        R.ms +
        " " +
        t("wd") +
        (R.ms > 1 ? "s" : "") +
        "</span>"
      : "";
  document.getElementById("ti").innerHTML =
    '<b style="color:#7a8fa5">' +
    ct.n +
    '</b> <span style="color:#3a5060">' +
    (ct.cc || "") +
    "</span>" +
    mi +
    "<br>" +
    t("salL") +
    ': <span style="color:#60a5fa">' +
    (Z.salary / 1000).toFixed(0) +
    "k</span> · " +
    t("mgL") +
    ': <span style="color:#60a5fa">' +
    (R.mg * 100).toFixed(1) +
    "%</span>" +
    rm +
    " · " +
    t("foL") +
    ': <span style="color:#60a5fa">' +
    (R.wt * 100).toFixed(2) +
    "%</span><br>" +
    t("coL") +
    ': <span style="color:#34d399">CHF ' +
    fm(Math.min(Z.monthly * 12, 7258)) +
    "</span> · " +
    t("svY") +
    ': <span style="color:#34d399">CHF ' +
    fm(Math.min(Z.monthly * 12, 7258) * R.mg) +
    "</span>";
  document.getElementById("chartTitle").textContent = t("hist") + " — " + ix.name;
  // Stats
  var nYH = YR.length,
    perH = YR[0] + "–" + YR[nYH - 1] + " · " + nYH + " " + t("an");
  var diff = R.fpNO - R.ibN;
  var w = [
    { n: ix.name + " (IBKR)", v: R.ibN, c: "#ef6461" },
    { n: ix.name + " 3a (" + ba + t("ac") + ")", v: R.fpNO, c: "#3b82f6" },
  ].sort(function (a, b2) {
    return b2.v - a.v;
  });
  document.getElementById("sts").innerHTML =
    '<div class="st"><div class="sl">' +
    t("win") +
    ' <span style="color:#3a5060;font-weight:400">(' +
    perH +
    ')</span></div><div class="sv2" style="color:' +
    w[0].c +
    '">' +
    w[0].n +
    '</div><div class="ss">CHF ' +
    fm(w[0].v) +
    '</div></div><div class="st"><div class="sl">' +
    ix.name +
    " 3a (" +
    ba +
    t("ac") +
    ')</div><div class="sv2" style="color:#3b82f6">CHF ' +
    fm(R.fpNO) +
    '</div><div class="ss">' +
    pp((R.fpNO / R.tc - 1) * 100) +
    '</div></div><div class="st"><div class="sl">' +
    ix.name +
    t("onIB") +
    '</div><div class="sv2" style="color:#ef6461">CHF ' +
    fm(R.ibN) +
    '</div><div class="ss">' +
    pp((R.ibN / R.tc - 1) * 100) +
    '</div></div><div class="st"><div class="sl">' +
    t("inv") +
    '</div><div class="sv2">CHF ' +
    fm(R.tc) +
    '</div><div class="ss">2016–2025</div></div><div class="st"><div class="sl">' +
    t("adv") +
    '</div><div class="sv2" style="color:' +
    (diff >= 0 ? "#f59e0b" : "#e87070") +
    '">' +
    (diff >= 0 ? "+" : "") +
    "CHF " +
    fm(diff) +
    '</div><div class="ss">' +
    t("vs") +
    '</div></div><div class="st"><div class="sl">' +
    t("eco") +
    '</div><div class="sv2" style="color:#f59e0b">CHF ' +
    fm(R.ws) +
    '</div><div class="ss">' +
    ba +
    t("ac") +
    " vs 1</div></div>";
  // Chart — with optional ETF2 comparison
  var chartDS = [
    { label: ix.name + " (IBKR)", data: R.cIB, color: "#ef6461", width: 1.5, r: 2 },
    { label: ix.name + " " + t("pen") + " (3a)", data: R.cFP, color: "#3b82f6", width: 2.5, r: 3 },
  ];
  if (Z.cmpMode) {
    var R2 = runSim(Z.idx2);
    var ix2 = IDX[Z.idx2];
    chartDS.push({
      label: ix2.name + " (IBKR)",
      data: R2.cIB,
      color: "#f59e0b",
      width: 1.5,
      r: 2,
      dots: false,
    });
    chartDS.push({
      label: ix2.name + " " + t("pen") + " (3a)",
      data: R2.cFP,
      color: "#8b5cf6",
      width: 2,
      r: 2,
      dots: false,
    });
  }
  svgC(document.getElementById("hc"), R.cL, chartDS);
  // Net values note below chart (separate div to preserve SVG tooltips)
  var wdNote =
    '<div style="padding:8px 12px;background:#080c12;border-radius:6px;font-size:9px;font-family:var(--m);color:#4a6070;line-height:1.6;margin-top:8px">';
  wdNote +=
    '<span style="color:#3b82f6">● 3a ' +
    t("net") +
    " (" +
    ba +
    t("ac") +
    "): <b>CHF " +
    fm(R.fpNO) +
    "</b></span>";
  wdNote +=
    ' · <span style="color:#ef6461">● IBKR ' + t("net") + ": <b>CHF " + fm(R.ibN) + "</b></span>";
  var d2 = R.fpNO - R.ibN;
  wdNote +=
    ' · <span style="color:' +
    (d2 >= 0 ? "#34d399" : "#e87070") +
    '">Δ ' +
    (d2 >= 0 ? "+" : "") +
    "CHF " +
    fm(d2) +
    "</span>";
  if (R.bs.tt > 0)
    wdNote += ' <span style="color:#5a4040">(' + t("wdT") + ": -CHF " + fm(R.bs.tt) + ")</span>";
  wdNote += "</div>";
  document.getElementById("hcNote").innerHTML = wdNote;
  // Withdrawal optimization (compact)
  var wn =
    R.ms < 5
      ? ' <span style="color:#f59e0b">⚠️ ' +
        ct.n +
        t("limW") +
        "<b>" +
        R.ms +
        "</b> " +
        (R.ms > 1 ? t("wds") : t("wd")) +
        ".</span>"
      : "";
  var tr = "";
  R.sc.forEach(function (w2) {
    var sv2 = R.s1 - w2.tt,
      io = w2.ac === ba;
    tr +=
      '<tr style="background:' +
      (io ? "#1a3a2218" : "transparent") +
      '"><td style="text-align:left;color:' +
      (io ? "#34d399" : "#8baa96") +
      ";font-weight:" +
      (io ? 700 : 400) +
      '">' +
      w2.ac +
      " " +
      (w2.ac > 1 ? t("acs") : t("ac")) +
      (io ? " ⭐" : "") +
      '</td><td style="color:#a0baa8">CHF ' +
      fm(w2.pa) +
      '</td><td style="color:' +
      (io ? "#34d399" : "#a0baa8") +
      '">' +
      (w2.rt * 100).toFixed(2) +
      '%</td><td style="color:#e87070">CHF ' +
      fm(w2.tt) +
      '</td><td style="color:' +
      (io ? "#34d399" : "#c9d6e3") +
      ";font-weight:" +
      (io ? 700 : 400) +
      '">CHF ' +
      fm(w2.nt) +
      '</td><td style="color:' +
      (sv2 > 0 ? "#34d399" : "#4a6070") +
      '">' +
      (sv2 > 0 ? "+" + fm(sv2) : "—") +
      "</td></tr>";
  });
  document.getElementById("op").innerHTML =
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px"><span style="font-size:20px">🏦</span><h3 style="font-size:15px;font-weight:700;color:#34d399">' +
    t("stag") +
    '</h3></div><p style="font-size:11px;color:#5a8a6a;margin:6px 0 12px;line-height:1.6">' +
    t("tax") +
    ' <b style="color:#7ac9a0">' +
    t("prog") +
    "</b>." +
    wn +
    '</p><div style="overflow-x:auto"><table><thead><tr><th style="text-align:left">' +
    t("accs") +
    "</th><th>" +
    t("amt") +
    "</th><th>" +
    t("rate") +
    "</th><th>" +
    t("tax") +
    "</th><th>" +
    t("net") +
    "</th><th>" +
    t("sav") +
    "</th></tr></thead><tbody>" +
    tr +
    "</tbody></table></div>";
  // Strat cards (compact)
  var sL = R.dm === "reinvest" ? t("sRi") : R.dm === "cash" ? t("sCa") : "";
  var fpRw = [
    [t("b3a"), R.fp, ""],
    [t("wdT") + " (" + ba + t("ac") + ")", -b.tt, "n"],
  ];
  if (R.dm !== "ignore") fpRw.push([sL, R.fpSide, "p"]);
  var dmN =
    R.dm === "reinvest"
      ? "📌 " + t("dmR") + ix.name + t("dmS")
      : R.dm === "cash"
        ? "📌 " + t("dmC")
        : "📌 " + t("dmI");
  var fpAL = ix.alloc.map(function (a) {
    return (
      "<span style='color:#34d399'>" +
      a.pct +
      "%</span> " +
      a.fund.replace(/Swisscanto /g, "").replace(/IPF I /g, "")
    );
  });
  var ibCS = "TER: " + ix.ter.toFixed(2) + "%";
  if (ix.ibAdj < -ix.ter) ibCS += " + " + t("whD") + ": " + (-ix.ibAdj - ix.ter).toFixed(2) + "%";
  if (ix.ibAdj > -ix.ter) ibCS += " (" + t("whR") + ": +" + (-ix.ibAdj + ix.ter).toFixed(2) + "%)";
  var strats = [
    {
      nm: ix.name + " " + t("pen") + " (3a)",
      tg: "3a×" + ba,
      cl: "#3b82f6",
      nt: R.fpNO,
      rw: fpRw,
      nf: [t("fee"), t("whr"), t("noTx"), dmN, t("alT")].concat(fpAL),
    },
    {
      nm: ix.name + t("onIB"),
      tg: "direct",
      cl: "#ef6461",
      nt: R.ibN,
      rw: [
        [t("gV"), R.ib, ""],
        [t("stD"), -R.ib * 0.0015, "n"],
        [t("dT"), -R.ibDt, "n"],
        [t("wT"), -R.ibWt, "n"],
      ],
      nf: [
        ibCS,
        t("dAt") + Math.round(R.mg * 100) + "%",
        t("fo") + (R.wt * 100).toFixed(2) + "%/" + t("an"),
        t("cg"),
        t("fxNote"),
      ],
    },
  ];
  document.getElementById("scs").innerHTML = strats
    .map(function (s) {
      var i3 = s.tg.indexOf("3a") === 0;
      return (
        '<div class="sc" style="border:1px solid ' +
        s.cl +
        '22"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><div style="width:8px;height:8px;border-radius:2px;background:' +
        s.cl +
        '"></div><span style="font-size:13px;font-weight:600">' +
        s.nm +
        '</span><span style="font-size:9px;font-family:var(--m);margin-left:auto;padding:2px 6px;border-radius:4px;background:' +
        (i3 ? "#0a1a10" : "#1a1010") +
        ";color:" +
        (i3 ? "#34d399" : "#e87070") +
        '">' +
        s.tg.toUpperCase() + " · " + nYH + t("an") +
        '</span></div><div style="font-size:10px;font-family:var(--m);color:#6b8299;line-height:2">' +
        s.rw
          .map(function (r) {
            return (
              "<div>" +
              r[0] +
              ': <span style="color:' +
              (r[2] === "n" ? "#e87070" : r[2] === "p" ? "#34d399" : "#c9d6e3") +
              '">' +
              (r[1] < 0 ? "-" : "") +
              (r[2] === "p" ? "+" : "") +
              "CHF " +
              fm(Math.abs(r[1])) +
              "</span></div>"
            );
          })
          .join("") +
        '<div style="border-top:1px solid #1a2530;padding-top:6px;margin-top:6px"><span style="font-size:16px;font-weight:700;color:' +
        s.cl +
        '">CHF ' +
        fm(s.nt) +
        '</span> <span style="font-size:10px;color:#5a7080">' +
        pp((s.nt / R.tc - 1) * 100) +
        '</span></div></div><div style="margin-top:10px;padding:6px 8px;background:#080c12;border-radius:6px;font-size:9px;color:#3a5060;line-height:1.6">' +
        s.nf
          .map(function (n) {
            return "<div>" + n + "</div>";
          })
          .join("") +
        "</div></div>"
      );
    })
    .join("");

  // ═══ PROJECTION ═══
  document.getElementById("lbProj").textContent = t("proj");
  document.getElementById("projArrow").textContent = Z.showProj ? "▼" : "▶";
  document.getElementById("projContent").classList.toggle("hid", !Z.showProj);
  if (Z.showProj) {
    var mg = R.mg,
      wt = R.wt,
      dy = ix.dy / 100,
      r = Z.projRet / 100;
    var fpP = R.fp,
      ibP = R.ib,
      fpSP = R.fpSide,
      c3 = Math.min(Z.monthly * 12, 7258);
    var pL = [],
      pFP = [],
      pIB = [];
    for (var j = 1; j <= Z.projYr; j++) {
      var fpR2 = r + ix.fpAdj / 100,
        ibR2 = r + ix.ibAdj / 100;
      fpP = (fpP + c3) * (1 + fpR2);
      if (Z.dedMode === "reinvest") {
        fpSP = (fpSP + c3 * mg * 0.9985) * (1 + ibR2);
        fpSP -= fpSP * dy * mg * 0.5;
        fpSP -= fpSP * wt;
      } else if (Z.dedMode === "cash") {
        fpSP += c3 * mg;
        fpSP -= fpSP * wt;
      }
      ibP = (ibP + c3 * 0.9985) * (1 + ibR2);
      ibP -= ibP * dy * mg * 0.5;
      ibP -= ibP * wt;
      pL.push(2025 + j);
      pFP.push(Math.round(fpP + fpSP));
      pIB.push(Math.round(ibP));
    }
    var ly = 2025 + Z.projYr,
      oN = b.ac;
    var pWd = wT(fpP / oN, Z.canton, Z.status) * oN;
    svgC(
      document.getElementById("projChart"),
      pL,
      [
        { label: ix.name + " (IBKR)", data: pIB, color: "#ef6461", width: 1.5, dots: false },
        {
          label: ix.name + " " + t("pen") + " (3a)",
          data: pFP,
          color: "#3b82f6",
          width: 2.5,
          dots: false,
        },
      ],
      240,
    );
    var pNet3a = fpP - pWd + fpSP,
      pNetIB = ibP * 0.9985;
    var perP = t("aft") + " " + Z.projYr + " " + t("an") + " (" + ly + ")";
    document.getElementById("projStats").innerHTML =
      '<div class="st"><div class="sl">' +
      ix.name +
      " 3a" +
      '</div><div class="sv2" style="color:#3b82f6">CHF ' +
      fm(pNet3a) +
      '</div><div class="ss">' +
      perP +
      " · " +
      t("wdT") +
      ": CHF " +
      fm(pWd) +
      '</div></div><div class="st"><div class="sl">' +
      ix.name +
      " IBKR" +
      '</div><div class="sv2" style="color:#ef6461">CHF ' +
      fm(pNetIB) +
      '</div><div class="ss">' +
      perP +
      '</div></div><div class="st"><div class="sl">' +
      t("adv") +
      ' <span style="color:#3a5060;font-weight:400">(' +
      perP +
      ')</span></div><div class="sv2" style="color:#f59e0b">+CHF ' +
      fm(pNet3a - pNetIB) +
      "</div></div>";
    document.getElementById("projNote").textContent = t("pN");
  }

  // ═══ RETROACTIVE 3A ═══
  document.getElementById("lbRetro").textContent = t("retro");
  document.getElementById("retroArrow").textContent = Z.showRetro ? "▼" : "▶";
  document.getElementById("retroContent").classList.toggle("hid", !Z.showRetro);
  document.getElementById("retroDesc").textContent = t("retroD");
  if (Z.showRetro) {
    var rYrs = Math.min(Z.retroYrs, 5),
      rAmt = rYrs * 7258,
      rDed = rAmt * R.mg;
    var rFP = rAmt * (1 + ((Z.projRet || 8) / 100) * 0.5); // rough growth estimate
    var rWd = wT(rFP, Z.canton, Z.status);
    document.getElementById("retroResult").innerHTML =
      '<div class="og"><div class="st"><div class="sl">' +
      t("rAmt") +
      '</div><div class="sv2" style="color:#f59e0b">CHF ' +
      fm(rAmt) +
      '</div><div class="ss">' +
      rYrs +
      ' × CHF 7\'258</div></div><div class="st"><div class="sl">' +
      t("rDed") +
      '</div><div class="sv2" style="color:#34d399">CHF ' +
      fm(rDed) +
      '</div><div class="ss">' +
      (R.mg * 100).toFixed(0) +
      "% × " +
      fm(rAmt) +
      '</div></div><div class="st"><div class="sl">' +
      t("rNet") +
      '</div><div class="sv2" style="color:#3b82f6">CHF ' +
      fm(rFP - rWd + rDed) +
      '</div><div class="ss">' +
      t("wdT") +
      ": CHF " +
      fm(rWd) +
      "</div></div></div>";
  }

  // ═══ 2ND PILLAR ═══
  document.getElementById("lb2P").textContent = t("p2");
  document.getElementById("p2Arrow").textContent = Z.show2P ? "▼" : "▶";
  document.getElementById("p2Content").classList.toggle("hid", !Z.show2P);
  document.getElementById("p2Desc").textContent = t("p2D");
  if (Z.show2P) {
    var p2A = Z.p2Amt,
      p2Y = Z.p2Yr,
      p2Ded = p2A * R.mg;
    var p2LPP = p2A * Math.pow(1.01, p2Y); // 1% annual LPP return
    var p2ETF = p2A * Math.pow(1 + (Z.projRet || 8) / 100, p2Y);
    var p2WdLPP = wT(p2LPP, Z.canton, Z.status);
    document.getElementById("p2Result").innerHTML =
      '<div class="og"><div class="st"><div class="sl">' +
      t("p2Ded") +
      '</div><div class="sv2" style="color:#34d399">CHF ' +
      fm(p2Ded) +
      '</div><div class="ss">' +
      (R.mg * 100).toFixed(0) +
      "% × " +
      fm(p2A) +
      '</div></div><div class="st"><div class="sl">' +
      t("p2LPP") +
      " (" +
      p2Y +
      t("an") +
      ')</div><div class="sv2" style="color:#34d399">CHF ' +
      fm(p2LPP - p2WdLPP) +
      '</div><div class="ss">' +
      t("p2Lock") +
      '</div></div><div class="st"><div class="sl">' +
      t("p2ETF") +
      " (" +
      p2Y +
      t("an") +
      ')</div><div class="sv2" style="color:#ef6461">CHF ' +
      fm(p2ETF * (1 - R.wt * p2Y * 0.5)) +
      '</div><div class="ss">' +
      (Z.projRet || 8) +
      "%/" +
      t("an") +
      " hyp.</div></div></div>";
  }

  // ═══ MONTE CARLO ═══
  document.getElementById("lbMC").textContent = t("mc");
  document.getElementById("mcArrow").textContent = Z.showMC ? "▼" : "▶";
  document.getElementById("mcContent").classList.toggle("hid", !Z.showMC);
  document.getElementById("mcDesc").textContent = t("mcD");
  if (Z.showMC) {
    var rets = [];
    for (var k in ix.r) rets.push(ix.r[k]);
    var mu =
      rets.reduce(function (a, b2) {
        return a + b2;
      }, 0) / rets.length;
    var sig = Math.sqrt(
      rets.reduce(function (a, b2) {
        return a + (b2 - mu) * (b2 - mu);
      }, 0) / rets.length,
    );
    var nSim = 1000,
      nYr = Z.projYr,
      c3m = Math.min(Z.monthly * 12, 7258);
    var finals = [];
    for (var si = 0; si < nSim; si++) {
      var fpM = R.fp,
        fpSM = R.fpSide;
      for (var yj = 0; yj < nYr; yj++) {
        var rr =
          mu +
          sig * (Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()));
        var fpRm = rr + ix.fpAdj;
        fpM = (fpM + c3m) * (1 + fpRm / 100);
        if (Z.dedMode === "reinvest") {
          fpSM = (fpSM + c3m * R.mg * 0.9985) * (1 + (rr + ix.ibAdj) / 100);
          fpSM -= ((fpSM * ix.dy) / 100) * R.mg * 0.5;
          fpSM -= fpSM * R.wt;
        } else if (Z.dedMode === "cash") {
          fpSM += c3m * R.mg;
          fpSM -= fpSM * R.wt;
        }
      }
      var wdM = wT(fpM / ba, Z.canton, Z.status) * ba;
      finals.push(fpM - wdM + fpSM);
    }
    finals.sort(function (a, b2) {
      return a - b2;
    });
    var p10 = finals[Math.floor(nSim * 0.1)],
      p50 = finals[Math.floor(nSim * 0.5)],
      p90 = finals[Math.floor(nSim * 0.9)];
    // Build histogram-like percentile bands
    var pctLabels = [],
      pctP10 = [],
      pctP50 = [],
      pctP90 = [];
    for (var pi = 0; pi <= 10; pi++) {
      var idx2 = Math.floor((nSim * pi) / 10);
      pctLabels.push(pi * 10 + "e %ile");
      pctP10.push(finals[Math.max(0, idx2)]);
      pctP50.push(finals[Math.floor(nSim * 0.5)]);
      pctP90.push(finals[Math.min(nSim - 1, idx2)]);
    }
    var perMC = t("aft") + " " + nYr + " " + t("an");
    document.getElementById("mcStats").innerHTML =
      '<div class="st"><div class="sl">P10 (pessimiste)</div><div class="sv2" style="color:#e87070">CHF ' +
      fm(p10) +
      '</div><div class="ss">' +
      perMC +
      '</div></div><div class="st"><div class="sl">P50 (médian)</div><div class="sv2" style="color:#f59e0b">CHF ' +
      fm(p50) +
      '</div><div class="ss">' +
      perMC +
      '</div></div><div class="st"><div class="sl">P90 (optimiste)</div><div class="sv2" style="color:#34d399">CHF ' +
      fm(p90) +
      '</div><div class="ss">' +
      perMC +
      '</div></div><div class="st"><div class="sl">Avg return</div><div class="sv2" style="color:#8b5cf6">' +
      mu.toFixed(1) +
      '%</div><div class="ss">σ = ' +
      sig.toFixed(1) +
      "%</div></div>";
    // Simple distribution chart: show sorted outcomes
    var distL = [],
      distD = [];
    var step = Math.max(1, Math.floor(nSim / 50));
    for (var di = 0; di < nSim; di += step) {
      distL.push("");
      distD.push(finals[di]);
    }
    svgC(
      document.getElementById("mcChart"),
      distL,
      [
        {
          label: "3a net (" + nSim + " sim., " + nYr + t("an") + ")",
          data: distD,
          color: "#8b5cf6",
          width: 2,
          dots: false,
        },
      ],
      200,
    );
  }

  // ═══ OPPORTUNITY COST ═══
  document.getElementById("lbOpp").textContent = t("opp");
  document.getElementById("oppArrow").textContent = Z.showOpp ? "▼" : "▶";
  document.getElementById("oppContent").classList.toggle("hid", !Z.showOpp);
  if (Z.showOpp) {
    var retireAge = 65,
      lockYrs = Math.max(0, retireAge - 5 - Z.age);
    var annC = Math.min(Z.monthly * 12, 7258),
      rHyp = (Z.projRet || 8) / 100;
    // Free capital (IBKR) — same contributions, accessible anytime
    var ibFree = 0;
    for (var oi = 0; oi < lockYrs; oi++) {
      ibFree = (ibFree + annC * 0.9985) * (1 + rHyp);
      ibFree -= ((ibFree * ix.dy) / 100) * R.mg * 0.5;
      ibFree -= ibFree * R.wt;
    }
    // Locked capital (3a) — same contributions, with deductions
    var fp3 = 0,
      fpS3 = 0;
    for (oi = 0; oi < lockYrs; oi++) {
      fp3 = (fp3 + annC) * (1 + rHyp + ix.fpAdj / 100);
      if (Z.dedMode === "reinvest") {
        fpS3 = (fpS3 + annC * R.mg * 0.9985) * (1 + rHyp);
        fpS3 -= ((fpS3 * ix.dy) / 100) * R.mg * 0.5;
        fpS3 -= fpS3 * R.wt;
      } else if (Z.dedMode === "cash") {
        fpS3 += annC * R.mg;
        fpS3 -= fpS3 * R.wt;
      }
    }
    var wd3 = wT(fp3 / ba, Z.canton, Z.status) * ba;
    var net3 = fp3 - wd3 + fpS3;
    document.getElementById("oppResult").innerHTML =
      '<p style="font-size:11px;color:#8a7a60;margin:0 0 14px;line-height:1.6">' +
      t("oppRes") +
      '</p><div class="og"><div class="st"><div class="sl">' +
      t("oppAge") +
      '</div><div class="sv2" style="color:#fb923c">' +
      Z.age +
      " " +
      t("an") +
      '</div><div class="ss">→ ' +
      lockYrs +
      " " +
      t("oppYrs") +
      '</div></div><div class="st"><div class="sl">' +
      t("oppFree") +
      '</div><div class="sv2" style="color:#ef6461">CHF ' +
      fm(ibFree) +
      '</div><div class="ss">' +
      t("aft") +
      " " +
      lockYrs +
      " " +
      t("an") +
      " · " +
      lockYrs +
      "×" +
      fm(annC) +
      "/" +
      t("an") +
      '</div></div><div class="st"><div class="sl">' +
      t("oppLocked") +
      '</div><div class="sv2" style="color:#3b82f6">CHF ' +
      fm(net3) +
      '</div><div class="ss">' +
      t("aft") +
      " " +
      lockYrs +
      " " +
      t("an") +
      " · " +
      t("adv") +
      ': <span style="color:' +
      (net3 > ibFree ? "#34d399" : "#e87070") +
      '">' +
      (net3 > ibFree ? "+" : "") +
      "CHF " +
      fm(net3 - ibFree) +
      '</span></div></div></div><p style="font-size:10px;color:#6a8a60;font-family:var(--m);margin-top:10px">' +
      t("oppAdvice") +
      "</p>";
  }

  // Year table
  document.getElementById("tt").textContent = Z.showTable ? t("hiR") : t("shR");
  if (Z.showTable) {
    var h =
      '<div class="card" style="overflow-x:auto"><table style="font-size:10px"><thead><tr style="border-bottom:1px solid #1e2d3d"><th style="text-align:right;color:#4a6070;font-size:9px">' +
      t("yr") +
      '</th><th style="text-align:right;color:#4a6070;font-size:9px">' +
      t("co") +
      '</th><th style="text-align:right;color:#4a6070;font-size:9px">' +
      t("iCHF") +
      '</th><th style="text-align:right;color:#3b82f6;font-size:9px">3a</th><th style="text-align:right;color:#ef6461;font-size:9px">IBKR</th></tr></thead><tbody>';
    YR.forEach(function (y) {
      var bR = ix.r[y],
        fR = bR + ix.fpAdj,
        iR = bR + ix.ibAdj,
        c2 = Math.min(Z.monthly * 12, MA[y]);
      h +=
        '<tr style="border-bottom:1px solid #141e28"><td style="padding:4px 8px;color:#6b8299">' +
        y +
        '</td><td style="padding:4px 8px;color:#8ba3bc">' +
        fm(c2) +
        '</td><td style="padding:4px 8px;color:#7a8fa5">' +
        pp(bR) +
        '</td><td style="padding:4px 8px;color:' +
        (fR >= 0 ? "#3b82f6" : "#e87070") +
        '">' +
        pp(fR) +
        '</td><td style="padding:4px 8px;color:' +
        (iR >= 0 ? "#ef6461" : "#e87070") +
        '">' +
        pp(iR) +
        "</td></tr>";
    });
    h += "</tbody></table></div>";
    document.getElementById("tw").innerHTML = h;
  }
  document.getElementById("disclaimer").innerHTML =
    '<b style="color:#4a6070">DISCLAIMER</b> · ' + t("dis");
}
