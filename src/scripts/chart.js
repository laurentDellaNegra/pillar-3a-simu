import { fm } from "./format.js";

export function svgC(el, lb, ds, h) {
  h = h || 280;
  var W = 620,
    H = h,
    P = 50,
    PR = 10,
    PT = 20,
    PB = 30,
    cW = W - P - PR,
    cH = H - PT - PB;
  var mn = 0,
    mx = 0;
  ds.forEach(function (d) {
    d.data.forEach(function (v) {
      if (v > mx) mx = v;
    });
  });
  if (mx === 0) mx = 1;
  function gx(i) {
    return P + (i / (lb.length - 1)) * cW;
  }
  function gy(v) {
    return PT + (1 - v / mx) * cH;
  }
  var uid = "c" + Math.random().toString(36).substr(2, 6);
  var s =
    '<div style="position:relative"><svg id="' +
    uid +
    '" viewBox="0 0 ' +
    W +
    " " +
    H +
    '" style="width:100%;height:auto">';
  for (var i = 0; i <= 5; i++) {
    var v = (mx * i) / 5,
      yy = gy(v);
    s +=
      '<line x1="' +
      P +
      '" y1="' +
      yy +
      '" x2="' +
      (W - PR) +
      '" y2="' +
      yy +
      '" stroke="#1a2530"/>';
    s +=
      '<text x="' +
      (P - 6) +
      '" y="' +
      (yy + 3) +
      '" fill="#4a6070" font-size="9" text-anchor="end">' +
      (v / 1000).toFixed(0) +
      "k</text>";
  }
  lb.forEach(function (l, i) {
    s +=
      '<text x="' +
      gx(i) +
      '" y="' +
      (H - 8) +
      '" fill="#4a6070" font-size="9" text-anchor="middle">' +
      l +
      "</text>";
  });
  ds.forEach(function (d) {
    var p = "";
    d.data.forEach(function (v, i) {
      p += (i === 0 ? "M" : "L") + gx(i).toFixed(1) + "," + gy(v).toFixed(1);
    });
    s +=
      '<path d="' +
      p +
      '" fill="none" stroke="' +
      d.color +
      '" stroke-width="' +
      (d.width || 1.5) +
      '" stroke-linecap="round" stroke-linejoin="round"/>';
    if (d.dots !== false)
      d.data.forEach(function (v, i) {
        s +=
          '<circle cx="' +
          gx(i) +
          '" cy="' +
          gy(v) +
          '" r="' +
          (d.r || 2) +
          '" fill="' +
          d.color +
          '"/>';
      });
  });
  // Invisible hover zones per x-point
  for (var i = 0; i < lb.length; i++) {
    var xp = gx(i),
      bw = (cW / (lb.length - 1)) * 0.8;
    s +=
      '<rect x="' +
      (xp - bw / 2) +
      '" y="' +
      PT +
      '" width="' +
      bw +
      '" height="' +
      cH +
      '" fill="transparent" data-i="' +
      i +
      '" class="hz"/>';
  }
  s +=
    '<line id="' +
    uid +
    'hl" x1="0" y1="' +
    PT +
    '" x2="0" y2="' +
    (PT + cH) +
    '" stroke="#3b82f640" stroke-width="1" style="display:none"/>';
  s += "</svg>";
  s +=
    '<div id="' +
    uid +
    'tt" style="display:none;position:absolute;background:#111a26ee;border:1px solid #2a3d52;border-radius:8px;padding:8px 12px;pointer-events:none;font-size:10px;font-family:var(--m);color:#e4e8ec;z-index:10;line-height:1.7;white-space:nowrap"></div></div>';
  s += '<div class="leg">';
  ds.forEach(function (d) {
    s += '<span><i style="background:' + d.color + '"></i>' + d.label + "</span>";
  });
  s += "</div>";
  el.innerHTML = s;
  // Attach tooltip events
  var svgEl = document.getElementById(uid),
    ttEl = document.getElementById(uid + "tt"),
    hlEl = document.getElementById(uid + "hl");
  if (!svgEl) return;
  var zones = svgEl.querySelectorAll(".hz");
  zones.forEach(function (z) {
    z.addEventListener("mouseenter", function () {
      var idx = +this.getAttribute("data-i"),
        xp = gx(idx);
      hlEl.setAttribute("x1", xp);
      hlEl.setAttribute("x2", xp);
      hlEl.style.display = "";
      var html = '<b style="color:#7a8fa5">' + lb[idx] + "</b><br>";
      ds.forEach(function (d) {
        if (d.data[idx] !== undefined)
          html +=
            '<span style="color:' +
            d.color +
            '">● ' +
            d.label +
            ": CHF " +
            fm(d.data[idx]) +
            "</span><br>";
      });
      ttEl.innerHTML = html;
      ttEl.style.display = "block";
      // Position tooltip
      var rect = svgEl.getBoundingClientRect(),
        pct2 = xp / W;
      ttEl.style.left = Math.min(pct2 * rect.width, rect.width - 180) + "px";
      ttEl.style.top = "10px";
    });
    z.addEventListener("mouseleave", function () {
      hlEl.style.display = "none";
      ttEl.style.display = "none";
    });
  });
}
