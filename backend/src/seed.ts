// Seeds the database with sample content items.
// Run with: npm run seed
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db";
import Content from "./models/Content";

const sources: string[] = ["TechCrunch", "The Verge", "Hacker News", "Wired", "Ars Technica"];

const titles: string[] = [
  "Understanding Event Loops in Node.js",
  "MongoDB Indexing Strategies for Scale",
  "Why JWT Beats Sessions for Stateless APIs",
  "A Deep Dive into React Server Components",
  "Designing REST APIs That Don't Suck",
  "Solana's Account Model Explained",
  "Rate Limiting Strategies for Public APIs",
  "The Case for Cursor-Based Pagination",
  "Building Resilient Microservices",
  "What Changed in TypeScript 5.6",
  "Postgres vs MongoDB: Choosing the Right Tool",
  "How Web Sockets Actually Work",
  "A Practical Guide to OAuth 2.0",
  "Caching Strategies Every Backend Dev Should Know",
  "The Rise of Edge Computing",
  "Docker vs Kubernetes for Small Teams",
  "Writing Clean Express Middleware",
  "Understanding CAP Theorem With Examples",
  "Serverless: When It Makes Sense",
  "Zero-Downtime Deployments Explained",
  "GraphQL vs REST in 2026",
  "Building a Rate Limiter From Scratch",
  "The Basics of Database Sharding",
  "How CDNs Actually Speed Up Your Site",
  "Debugging Memory Leaks in Node.js",
  "An Intro to Vector Databases",
  "Why Idempotency Keys Matter",
  "Load Balancing Algorithms Compared",
  "The Real Cost of N+1 Queries",
  "Feature Flags: A Backend Perspective",
];

interface ContentSeed {
  title: string;
  description: string;
  source: string;
  url: string;
  image: string;
  publishedAt: Date;
}

const generateContent = (): ContentSeed[] => {
  return titles.map((title, i) => {
    const daysAgo = titles.length - i;
    const publishedAt = new Date();
    publishedAt.setDate(publishedAt.getDate() - daysAgo);

    return {
      title,
      description: `A closer look at "${title.toLowerCase()}" and why it matters for modern backend systems.`,
      source: sources[i % sources.length],
      url: `https://example.com/articles/${i + 1}`,
      image: `https://picsum.photos/seed/${i + 1}/600/400`,
      publishedAt,
    };
  });
};

const run = async (): Promise<void> => {
  await connectDB();

  await Content.deleteMany({});
  console.log("Cleared existing content");

  const items = await Content.insertMany(generateContent());
  console.log(`Seeded ${items.length} content items`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err: Error) => {
  console.error(err);
  process.exit(1);
});
