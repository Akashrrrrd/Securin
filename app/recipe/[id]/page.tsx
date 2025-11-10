import { notFound } from "next/navigation"
import { ObjectId } from "mongodb"
import { getRecipesCollection } from "@/lib/mongodb"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let recipe

  try {
    const collection = await getRecipesCollection()
    recipe = await collection.findOne({ _id: new ObjectId(id) })

    if (!recipe) {
      notFound()
    }
  } catch (error) {
    notFound()
  }

  const nutrientLabels: Record<string, string> = {
    calories: "Calories",
    carbohydrateContent: "Carbohydrates",
    cholesterolContent: "Cholesterol",
    fiberContent: "Fiber",
    proteinContent: "Protein",
    saturatedFatContent: "Saturated Fat",
    sodiumContent: "Sodium",
    sugarContent: "Sugar",
    fatContent: "Fat",
  }

  const nutrientKeys = [
    "calories",
    "carbohydrateContent",
    "cholesterolContent",
    "fiberContent",
    "proteinContent",
    "saturatedFatContent",
    "sodiumContent",
    "sugarContent",
    "fatContent",
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft size={20} />
          Back to Recipes
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between border-b border-gray-200 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{recipe.title}</h1>
              <p className="text-sm text-gray-600 mt-1">{recipe.cuisine}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{recipe.description}</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Total Time</h3>
                <span className="text-sm text-gray-600">{recipe.total_time ? `${recipe.total_time} min` : "N/A"}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Prep Time:</span>
                  <span className="font-medium text-gray-900">
                    {recipe.prep_time ? `${recipe.prep_time} min` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cook Time:</span>
                  <span className="font-medium text-gray-900">
                    {recipe.cook_time ? `${recipe.cook_time} min` : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Nutrition</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-900">Nutrient</th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-900">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutrientKeys.map((key) => (
                      <tr key={key} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-700">{nutrientLabels[key]}</td>
                        <td className="py-2 px-3 text-right text-gray-600">{recipe.nutrients?.[key] || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Instructions</h3>
              <ol className="space-y-3">
                {recipe.instructions.map((instruction: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-700 flex gap-3">
                    <span className="font-semibold text-gray-500 flex-shrink-0">{idx + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">Serves:</span> {recipe.serves}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
