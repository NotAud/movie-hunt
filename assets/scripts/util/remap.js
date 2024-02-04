// https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56
export function clamp(input, min, max) {
  return input < min ? min : input > max ? max : input;
}

// Remap a number that is between a min and max to a new min and max range
// i.e 5 between 0 and 10 to 0 and 100 would become 50
export function remap(current, in_min, in_max, out_min, out_max) {
  const mapped =
    ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
}
