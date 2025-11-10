import { type NextRequest, NextResponse } from "next/server"
import { getRecipesCollection } from "@/lib/mongodb"
import { extractCalories } from "@/lib/recipe-utils"

function parseComparisonOperator(value: string) {
  if (value.startsWith("<=")) {
    return { operator: "$lte", value: Number.parseFloat(value.slice(2)) }
  }
  if (value.startsWith(">=")) {
    return { operator: "$gte", value: Number.parseFloat(value.slice(2)) }
  }
  if (value.startsWith("<")) {
    return { operator: "$lt", value: Number.parseFloat(value.slice(1)) }
  }
  if (value.startsWith(">")) {
    return { operator: "$gt", value: Number.parseFloat(value.slice(1)) }
  }
  if (value.startsWith("=")) {
    return { operator: "$eq", value: Number.parseFloat(value.slice(1)) }
  }
  return { operator: "$eq", value: Number.parseFloat(value) }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const query: any = {}

    // Title search (partial match, case-insensitive)
    const title = searchParams.get("title")
    if (title) {
      query.title = { $regex: title, $options: "i" }
    }

    // Cuisine filter
    const cuisine = searchParams.get("cuisine")
    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: "i" }
    }

    // Rating filter
    const rating = searchParams.get("rating")
    if (rating) {
      const { operator, value } = parseComparisonOperator(rating)
      query.rating = { [operator]: value }
    }

    // Total time filter
    const totalTime = searchParams.get("total_time")
    if (totalTime) {
      const { operator, value } = parseComparisonOperator(totalTime)
      query.total_time = { [operator]: value }
    }

    const collection = await getRecipesCollection()
    const recipes = await collection.find(query).toArray()

    // Filter by calories if provided (since it's stored in nutrients object)
    const calories = searchParams.get("calories")
    let filteredRecipes = recipes

    if (calories) {
      const { operator, value } = parseComparisonOperator(calories)
      filteredRecipes = recipes.filter((recipe) => {
        const recipeCalories = extractCalories(recipe.nutrients)
        if (recipeCalories === null) return false

        switch (operator) {
          case "$lte":
            return recipeCalories <= value
          case "$gte":
            return recipeCalories >= value
          case "$lt":
            return recipeCalories < value
          case "$gt":
            return recipeCalories > value
          case "$eq":
            return recipeCalories === value
          default:
            return true
        }
      })
    }

    return NextResponse.json({
      data: filteredRecipes,
    })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to search recipes", details: error.message }, { status: 500 })
  }
}
