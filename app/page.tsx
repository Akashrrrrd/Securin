import RecipeTable from "@/components/recipe-table"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900">Recipe Manager</h1>
            <p className="text-gray-600 mt-2">Browse, search, and filter delicious recipes from around the world</p>
          </div>
        </div>

        {/* Content */}
        <RecipeTable />
      </div>
    </main>
  )
}
