import { MongoClient } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://aakashrajendran2004_db_user:QmoXAJYD1Wniml1v@securin-database.snancu9.mongodb.net/?appName=Securin-Database",
  )

  await client.connect()
  const db = client.db("recipes_db")

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getRecipesCollection() {
  const { db } = await connectToDatabase()
  return db.collection("recipes")
}
