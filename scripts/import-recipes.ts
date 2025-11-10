import { connectToDatabase } from "../lib/mongodb"
import { parseRecipeData } from "../lib/recipe-utils"

// Import the recipe JSON data
const recipeData = {
  "0": {
    Contient: "North America",
    Country_State: "US",
    cuisine: "Southern Recipes",
    title: "Sweet Potato Pie",
    URL: "https://www.allrecipes.com/recipe/12142/sweet-potato-pie-i/",
    rating: 4.8,
    total_time: 115,
    prep_time: 15,
    cook_time: 100,
    description:
      "Shared from a Southern recipe, this homemade sweet potato pie is easy to make with boiled sweet potato. Try it, it may just be the best you've ever tasted!",
    ingredients: [
      "1 (1 pound) sweet potato, with skin",
      "0.5 cup butter, softened",
      "1 cup white sugar",
      "0.5 cup milk",
      "2 large eggs",
      "0.5 teaspoon ground nutmeg",
      "0.5 teaspoon ground cinnamon",
      "1 teaspoon vanilla extract",
      "1 (9 inch) unbaked pie crust",
    ],
    instructions: [
      "Place whole sweet potato in pot and cover with water; bring to a boil. Boil until tender when pierced with a fork, 40 to 50 minutes.",
      "Preheat the oven to 350 degrees F (175 degrees C).",
      "Remove sweet potato from the pot and run under cold water. Remove and discard skin.",
      "Break sweet potato flesh apart and place in a bowl. Add butter and mix with an electric mixer until well combined. Add sugar, milk, eggs, nutmeg, cinnamon, and vanilla; beat on medium speed until mixture is smooth. Pour filling into unbaked pie crust.",
      "Bake in the preheated oven until a knife inserted in the center comes out clean, 55 to 60 minutes.",
      "Remove from the oven and let cool before serving.",
    ],
    nutrients: {
      calories: "389 kcal",
      carbohydrateContent: "48 g",
      cholesterolContent: "78 mg",
      fiberContent: "3 g",
      proteinContent: "5 g",
      saturatedFatContent: "10 g",
      sodiumContent: "254 mg",
      sugarContent: "28 g",
      fatContent: "21 g",
      unsaturatedFatContent: "0 g",
    },
    serves: "8 servings",
  },
  "1": {
    Contient: "North America",
    Country_State: "US",
    cuisine: "Southern Recipes",
    title: "Fresh Southern Peach Cobbler",
    URL: "https://www.allrecipes.com/recipe/51535/fresh-southern-peach-cobbler/",
    rating: 4.7,
    total_time: 60,
    prep_time: 20,
    cook_time: 40,
    description:
      "A quick and easy Southern peach cobbler that's perfect for summer gatherings and picnics. This delicious dessert features fresh peaches with a buttery cake topping.",
    ingredients: [
      "6 fresh peaches, peeled, pitted and sliced",
      "0.5 cup butter",
      "1 cup all-purpose flour",
      "1.5 cups white sugar",
      "1.5 teaspoons baking powder",
      "0.5 teaspoon salt",
      "1.5 cups milk",
    ],
    instructions: [
      "Preheat oven to 350 degrees F (175 degrees C).",
      "Place the butter in a 9x13 inch baking dish and heat in the oven until melted, about 5 minutes.",
      "In a large bowl, combine the flour, 1.5 cups sugar, baking powder, and salt. Stir in the milk until smooth. Pour the batter over the melted butter.",
      "In another bowl, toss the peaches with the remaining sugar and pour over the batter.",
      "Bake until golden, about 1 hour.",
    ],
    nutrients: {
      calories: "245 kcal",
      carbohydrateContent: "52 g",
      cholesterolContent: "15 mg",
      fiberContent: "2 g",
      proteinContent: "2 g",
      saturatedFatContent: "6 g",
      sodiumContent: "180 mg",
      sugarContent: "38 g",
      fatContent: "6 g",
      unsaturatedFatContent: "0 g",
    },
    serves: "12 servings",
  },
}

async function importRecipes() {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection("recipes")

    // Drop existing collection if it exists
    try {
      await collection.drop()
    } catch (e) {
      // Collection doesn't exist yet, that's fine
    }

    // Parse and insert recipes
    const recipesToInsert = Object.values(recipeData).map((recipe: any) => parseRecipeData(recipe))

    const result = await collection.insertMany(recipesToInsert)
    console.log(`Successfully imported ${result.insertedIds.length} recipes`)

    // Create index for faster searching
    await collection.createIndex({ title: "text", description: "text", cuisine: 1, rating: -1 })
    console.log("Created indexes")
  } catch (error) {
    console.error("Error importing recipes:", error)
    process.exit(1)
  }
}

importRecipes()
