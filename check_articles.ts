import mongoose from "mongoose";
import Article from "./models/articles.model";
import { connectDB } from "./utils/connect";

async function check() {
    await connectDB();
    const articles = await Article.find({}).sort({ createdAt: -1 }).limit(5);
    console.log(JSON.stringify(articles, null, 2));
    process.exit(0);
}

check();
