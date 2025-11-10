import { connectToDatabase } from "../lib/mongodb"
import { parseRecipeData } from "../lib/recipe-utils"
import * as fs from "fs"
import * as path from "path"

async function importUSRecipes() {
  try {
    console.log("Starting recipe import...")
    
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), "data", "US_recipes_null.Pdf.json")
    const fileContent = fs.readFileSync(jsonPath, "utf-8")
    const recipeData = JSON.parse(fileContent)
    
    console.log(`Found ${Object.keys(recipeData).length} recipes to import`)

    const { db } = await connectToDatabase()
    const collection = db.collection("recipes")

    // Optional: Drop existing collection if you want to start fresh
    // Uncomment the lines below if you want to clear existing data
    // try {
    //   await collection.drop()
    //   console.log("Dropped existing collection")
    // } catch (e) {
    //   console.log("No existing collection to drop")
    // }

    // Parse and prepare recipes for insertion
    const recipesToInsert = Object.values(recipeData)
      .filter((recipe: any) => recipe.title) // Filter out entries without titles (like article links)
      .map((recipe: any) => parseRecipeData(recipe))

    console.log(`Preparing to insert ${recipesToInsert.length} valid recipes`)

    // Insert in batches to avoid memory issues
    const batchSize = 100
    let insertedCount = 0

    for (let i = 0; i < recipesToInsert.length; i += batchSize) {
      const batch = recipesToInsert.slice(i, i + batchSize)
      const result = await collection.insertMany(batch)
      insertedCount += Object.keys(result.insertedIds).length
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}: ${insertedCount} recipes total`)
    }

    console.log(`✓ Successfully imported ${insertedCount} recipes`)

    // Create indexes for faster searching
    console.log("Creating indexes...")
    await collection.createIndex({ title: "text", description: "text" })
    await collection.createIndex({ cuisine: 1 })
    await collection.createIndex({ rating: -1 })
    await collection.createIndex({ total_time: 1 })
    await collection.createIndex({ "Country_State": 1 })
    
    console.log("✓ Created indexes")
    console.log("Import completed successfully!")
    
    process.exit(0)
  } catch (error) {
    console.error("Error importing recipes:", error)
    process.exit(1)
  }
}

importUSRecipes()
