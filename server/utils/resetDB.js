import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

async function resetDB() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected!");

    const db = mongoose.connection.db;

    // Drop entire 'users' collection
    console.log("Dropping 'users' collection...");
    try {
      await db.collection("users").drop();
      console.log("✓ Users collection dropped");
    } catch (err) {
      console.log("Users collection doesn't exist or already dropped");
    }

    // Drop entire 'projects' collection
    console.log("Dropping 'projects' collection...");
    try {
      await db.collection("projects").drop();
      console.log("✓ Projects collection dropped");
    } catch (err) {
      console.log("Projects collection doesn't exist or already dropped");
    }

    // Drop entire 'tasks' collection
    console.log("Dropping 'tasks' collection...");
    try {
      await db.collection("tasks").drop();
      console.log("✓ Tasks collection dropped");
    } catch (err) {
      console.log("Tasks collection doesn't exist or already dropped");
    }

    console.log("\n✅ Database reset complete! All collections cleared.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Reset failed:", error.message);
    process.exit(1);
  }
}

resetDB();
