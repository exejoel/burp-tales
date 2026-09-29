import * as cheerio from "cheerio";

interface ScrapedRecipe {
  title: string;
  imageUrl: string | null;
  ingredients: string;
  steps: string;
}

export async function scrapeRecipeFromUrl(url: string): Promise<ScrapedRecipe> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; BurpTalesBot/1.0)" },
  });
  if (!res.ok) throw new Error(`Failed to fetch page (status ${res.status})`);

  const html = await res.text();
  const $ = cheerio.load(html);

  // Most recipe sites embed structured "Recipe" data as JSON-LD for Google.
  // We look for that first since it's far more reliable than guessing from HTML.
  let recipeData: any = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    if (recipeData) return;
    try {
      const json = JSON.parse($(el).text());
      const candidates = Array.isArray(json)
        ? json
        : json["@graph"]
        ? json["@graph"]
        : [json];
      const found = candidates.find((item: any) => {
        const type = item["@type"];
        return type === "Recipe" || (Array.isArray(type) && type.includes("Recipe"));
      });
      if (found) recipeData = found;
    } catch {
      // Some sites ship malformed JSON-LD — just skip it
    }
  });

  if (recipeData) {
    const ingredients: string[] = recipeData.recipeIngredient || [];
    const rawInstructions = recipeData.recipeInstructions || [];
    const instructions: string[] = Array.isArray(rawInstructions)
      ? rawInstructions.map((step: any) =>
          typeof step === "string" ? step : step.text || ""
        )
      : [String(rawInstructions)];

    return {
      title: recipeData.name || $("title").text() || "Untitled recipe",
      imageUrl: Array.isArray(recipeData.image)
        ? recipeData.image[0]
        : recipeData.image?.url || recipeData.image || null,
      ingredients: ingredients.join("\n"),
      steps: instructions.join("\n"),
    };
  }

  // Fallback if the site has no structured recipe data at all
  return {
    title: $("title").text() || "Untitled recipe",
    imageUrl: $('meta[property="og:image"]').attr("content") || null,
    ingredients: "",
    steps: "",
  };
}
