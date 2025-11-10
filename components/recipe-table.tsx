"use client"

import { useState, useEffect, useCallback } from "react"
import { Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


interface Recipe {
  _id: string
  title: string
  cuisine: string
  rating: number | null
  total_time: number | null
  serves: string
  description: string
  prep_time: number | null
  cook_time: number | null
  nutrients: any
  ingredients: string[]
  instructions: string[]
}

interface RecipeTableProps {
  onSearchChange?: (filters: any) => void
}

export default function RecipeTable({ onSearchChange }: RecipeTableProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)
  const [total, setTotal] = useState(0)


  // Filter states
  const [filters, setFilters] = useState({
    title: "",
    cuisine: "",
    rating: "",
    total_time: "",
    calories: "",
  })

  // Fetch recipes with filters
  const fetchRecipes = useCallback(async () => {
    setLoading(true)
    try {
      const hasActiveFilters = Object.values(filters).some((v) => v.trim() !== "")

      const endpoint = hasActiveFilters ? "/api/recipes/search" : "/api/recipes"
      const params = new URLSearchParams()

      if (hasActiveFilters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value.trim()) params.append(key, value)
        })
      } else {
        params.append("page", page.toString())
        params.append("limit", limit.toString())
      }

      const response = await fetch(`${endpoint}?${params}`)
      const result = await response.json()

      if (hasActiveFilters) {
        setRecipes(result.data || [])
        setTotal(result.data?.length || 0)
      } else {
        setRecipes(result.data || [])
        setTotal(result.total || 0)
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error)
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }, [filters, page, limit])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setPage(1)
  }

  const handleRowClick = (recipe: Recipe) => {
    window.location.href = `/recipe/${recipe._id}`
  }

  const renderRating = (rating: number | null) => {
    if (rating === null) return <span className="text-gray-400">N/A</span>
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < fullStars
                ? "fill-yellow-400 text-yellow-400"
                : i === fullStars && hasHalfStar
                  ? "fill-yellow-200 text-yellow-400"
                  : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm ml-1">{rating.toFixed(1)}</span>
      </div>
    )
  }

  const truncateText = (text: string, maxLength = 30) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  const totalPages = Math.ceil(total / limit)
  const hasActiveFilters = Object.values(filters).some((v) => v.trim() !== "")

  return (
    <div className="w-full space-y-4 p-6">
      <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <Input
            placeholder="Search by title"
            value={filters.title}
            onChange={(e) => handleFilterChange("title", e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Filter by cuisine"
            value={filters.cuisine}
            onChange={(e) => handleFilterChange("cuisine", e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Rating (e.g., >=4.5)"
            value={filters.rating}
            onChange={(e) => handleFilterChange("rating", e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Total time (e.g., <=60)"
            value={filters.total_time}
            onChange={(e) => handleFilterChange("total_time", e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Calories (e.g., <=400)"
            value={filters.calories}
            onChange={(e) => handleFilterChange("calories", e.target.value)}
            className="text-sm"
          />
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters({ title: "", cuisine: "", rating: "", total_time: "", calories: "" })
              setPage(1)
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading recipes...</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-600 font-medium">No recipes found</p>
          <p className="text-gray-500 text-sm mt-1">Nice to Have</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Cuisine</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Total Time (min)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Serves</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe) => (
                  <tr
                    key={recipe._id}
                    onClick={() => handleRowClick(recipe)}
                    className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <span title={recipe.title}>{truncateText(recipe.title)}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{recipe.cuisine}</td>
                    <td className="px-6 py-4 text-sm">{renderRating(recipe.rating)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{recipe.total_time || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{recipe.serves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Results per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number.parseInt(e.target.value))
                  setPage(1)
                }}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="35">35</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm text-gray-600">
                Showing {recipes.length} of {total} recipes
              </span>
            </div>

            {!hasActiveFilters && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </>
      )}


    </div>
  )
}
