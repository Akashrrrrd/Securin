export function parseRecipeData(recipe: any) {
  return {
    continent: recipe.Contient || null,
    country_state: recipe.Country_State || null,
    cuisine: recipe.cuisine || null,
    title: recipe.title || null,
    url: recipe.URL || null,
    rating: parseNumericValue(recipe.rating),
    total_time: parseNumericValue(recipe.total_time),
    prep_time: parseNumericValue(recipe.prep_time),
    cook_time: parseNumericValue(recipe.cook_time),
    description: recipe.description || null,
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
    nutrients: recipe.nutrients || {},
    serves: recipe.serves || null,
    created_at: new Date(),
  }
}

function parseNumericValue(value: any) {
  if (value === null || value === undefined) return null
  if (typeof value === "string" && (value.toLowerCase() === "nan" || value === "")) return null
  if (isNaN(value)) return null
  return Number(value)
}

export function extractCalories(nutrients: any): number | null {
  if (!nutrients || !nutrients.calories) return null
  const caloriesStr = nutrients.calories.toString()
  const match = caloriesStr.match(/(\d+(?:\.\d+)?)/)
  return match ? Number.parseFloat(match[1]) : null
}
