import { Z } from "./state.js";

var _render = function () {};
export function setRenderFn(fn) {
  _render = fn;
}

export function mkS(id, lb, ky, mn, mx, st, un, ff, ac, onChange) {
  var el = document.getElementById(id);
  if (!el) return;
  el.innerHTML =
    '<div class="sw"><div class="sh"><span>' +
    lb +
    '</span><span class="sv" style="color:' +
    ac +
    '" id="' +
    ky +
    'V"></span></div><div class="stk"><div class="sbg"><div class="sfl" id="' +
    ky +
    'F" style="background:' +
    ac +
    '"></div><div class="sgl" id="' +
    ky +
    'G" style="background:' +
    ac +
    '"></div></div><input type="range" min="' +
    mn +
    '" max="' +
    mx +
    '" step="' +
    st +
    '" value="' +
    Z[ky] +
    '" style="--tc:' +
    ac +
    '" id="' +
    ky +
    'I"></div><div class="smm"><span>' +
    (ff ? ff(mn) : mn) +
    (un || "") +
    "</span><span>" +
    (ff ? ff(mx) : mx) +
    (un || "") +
    "</span></div></div>";
  var inp = document.getElementById(ky + "I");
  function u() {
    var v = +inp.value;
    Z[ky] = v;
    var p = ((v - mn) / (mx - mn)) * 100;
    document.getElementById(ky + "F").style.width = p + "%";
    document.getElementById(ky + "G").style.left = p + "%";
    document.getElementById(ky + "V").textContent = (ff ? ff(v) : v) + (un || "");
  }
  inp.oninput = function () {
    u();
    if (onChange) onChange();
    else _render();
  };
  u();
}

export function mkP(id, items, ky, cl, onChange) {
  var el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = "";
  Object.keys(items).forEach(function (k) {
    var b = document.createElement("button");
    b.className = "pill";
    b.textContent = typeof items[k] === "string" ? items[k] : k;
    if (Z[ky] === k)
      b.style.cssText =
        "background:" + cl + "18;border-color:" + cl + ";color:" + cl + ";font-weight:600";
    b.onclick = function () {
      Z[ky] = k;
      if (onChange) {
        onChange();
      } else {
        mkP(id, items, ky, cl);
        _render();
      }
    };
    el.appendChild(b);
  });
}
