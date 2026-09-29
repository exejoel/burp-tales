async function printSecretMessage(url) {
  const response = await fetch(url);
  const html = await response.text();
  const tableMatch = html.match(/<table[\s\S]*?<\/table>/i);
  if (!tableMatch) throw new Error("No table found in the document.");
  const table = tableMatch[0],
    rows = [...table.matchAll(/<tr[\s\S]*?<\/tr>/gi)].map((m) => m[0]),
    cellText = (cellHtml) =>
      decodeEntities(cellHtml.replace(/<[^>]+>/g, "")).trim(),
    points = [];
  for (const row of rows) {
    const cells = [...row.matchAll(/<td[\s\S]*?<\/td>/gi)].map((m) =>
      cellText(m[0]),
    );
    if (cells.length < 3) continue;
    const [xRaw, ch, yRaw] = cells,
      x = parseInt(xRaw, 10),
      y = parseInt(yRaw, 10);
    if (Number.isNaN(x) || Number.isNaN(y)) continue;
    points.push({ x, y, ch });
  }
  if (points.length === 0) throw new Error("No coordinate data found.");
  const maxX = Math.max(...points.map((p) => p.x)),
    maxY = Math.max(...points.map((p) => p.y)),
    grid = Array.from({ length: maxY + 1 }, () =>
      Array.from({ length: maxX + 1 }, () => " "),
    );
  for (const { x, y, ch } of points) {
    grid[y][x] = ch;
  }
  console.log(grid.map((r) => r.join("")).join("\n"));
}
function decodeEntities(str) {
  return str
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCodePoint(parseInt(h, 16)),
    )
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
printSecretMessage("https://docs.google.com/document/d/e/2PACX-1vSvM5gDlNvt7npYHhp_XfsJvuntUhq184By5xO_pA4b_gCWeXb6dM6ZxwN8rE6S4ghUsCj2VKR21oEP/pub");
module.exports = { printSecretMessage };
