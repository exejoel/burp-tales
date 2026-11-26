export function scaleIngredient(text: string, multiplier: number): string {
  if (multiplier === 1) return text;

  const unicodeFractions: Record<string, number> = {
    "½": 0.5,
    "⅓": 1 / 3,
    "⅔": 2 / 3,
    "¼": 0.25,
    "¾": 0.75,
    "⅕": 0.2,
    "⅖": 0.4,
    "⅗": 0.6,
    "⅘": 0.8,
    "⅙": 1 / 6,
    "⅛": 0.125,
    "⅜": 0.375,
    "⅝": 0.625,
    "⅞": 0.875,
  };

  const regex = /[¼-¾⅐-⅞↉]/g;
  text = text.replace(regex, (match) => String(unicodeFractions[match] ?? match));

  // Handle slash fractions like 1/3, 2/3
  text = text.replace(/(\d+)\/(\d+)/g, (_, num, den) =>
    String(parseInt(num) / parseInt(den))
  );

  const match = text.match(/^(\d+\.?\d*)(?:\s+(\d+\.?\d*))?\s+(.*)/);

  if (!match) return text;

  const whole = parseFloat(match[1]);
  const fraction = match[2] ? parseFloat(match[2]) : 0;
  const rest = match[3];
  const scaled = parseFloat(((whole + fraction) * multiplier).toFixed(4));

  return `${scaled} ${rest}`;
}