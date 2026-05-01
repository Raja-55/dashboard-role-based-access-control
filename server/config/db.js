import mongoose from "mongoose";

export async function connectDB() {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${connect.connection.host}`);

    // Clean up old indexes
    const db = mongoose.connection.db;
    const userCollection = db.collection("users");

    // Drop all indexes except _id
    try {
      const indexes = await userCollection.getIndexes();
      for (const indexName in indexes) {
        if (indexName !== "_id_") {
          console.log(`Dropping index: ${indexName}`);
          await userCollection.dropIndex(indexName);
        }
      }
    } catch (err) {
      console.log("Index cleanup completed");
    }
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
}
