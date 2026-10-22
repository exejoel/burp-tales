export function scaleIngredient(text: string, multiplier: number): string {
  if (multiplier === 1) return text;
  const match = text.match(/^(\d+\.?\d*)\s*(.*)/);

  if (!match) return text;

  const amount = parseFloat(match[1]);
  const rest = match[2];
  const scaled = amount * multiplier;

  return `${scaled} ${rest}`;
}