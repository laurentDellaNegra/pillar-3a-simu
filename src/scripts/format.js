export function fm(n) {
  return Math.round(n).toLocaleString("de-CH");
}
export function pp(n) {
  return (n >= 0 ? "+" : "") + n.toFixed(1) + "%";
}
