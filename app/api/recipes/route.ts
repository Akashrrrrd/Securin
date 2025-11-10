import { type NextRequest, NextResponse } from "next/server"
import { getRecipesCollection } from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    const skip = (page - 1) * limit

    const collection = await getRecipesCollection()

    const total = await collection.countDocuments()
    const recipes = await collection.find({}).sort({ rating: -1 }).skip(skip).limit(limit).toArray()

    return NextResponse.json({
      page,
      limit,
      total,
      data: recipes,
    })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch recipes", details: error.message }, { status: 500 })
  }
}
