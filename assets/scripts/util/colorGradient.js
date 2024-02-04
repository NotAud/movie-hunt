// Convert a percentage into a color gradient using HSL
// Our use-case is a percentage to a color between red and green
export function colorGradient(percent, start, end) {
  var a = percent / 100,
    b = (end - start) * a,
    c = b + start;

  // Return a CSS HSL string
  return "hsl(" + c + ", 100%, 50%)";
}
