import mongoose from "mongoose";
import { Request, Response } from "express";
import Content from "../models/Content";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";

interface FeedQuery {
  page?: string;
  limit?: string;
  sort?: string;
}

export const getFeed = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const query = req.query as FeedQuery;

  const page = Math.max(parseInt(query.page ?? "1", 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit ?? "20", 10) || 20, 1), 100);
  const sort = query.sort === "oldest" ? 1 : -1;
  const skip = (page - 1) * limit;

  const [items, totalItems] = await Promise.all([
    Content.find().sort({ publishedAt: sort }).skip(skip).limit(limit),
    Content.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  res.status(200).json({
    success: true,
    data: items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

export const getFeedItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid content ID", 400);
  }

  const item = await Content.findById(id);
  if (!item) {
    throw new AppError("Content not found", 404);
  }

  res.status(200).json({
    success: true,
    data: item,
  });
});

export const createArticle = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { title, description, body, source, author, tags, readTime, url, image } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    throw new AppError("Article title is required", 400);
  }

  if (!description || typeof description !== "string" || !description.trim()) {
    throw new AppError("Article description / overview is required", 400);
  }

  const user = req.user;
  const computedAuthor = author?.trim() || user?.name || "Anonymous Engineer";
  const computedSource = source?.trim() || "Community Publication";

  // Calculate estimated read time if omitted
  let computedReadTime = readTime?.trim();
  if (!computedReadTime) {
    const totalWords = `${title} ${description} ${body || ""}`.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(totalWords / 200));
    computedReadTime = `${minutes} min read`;
  }

  const fallbackImages = [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
  ];
  const computedImage = image?.trim() || fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

  // Process tags
  const processedTags = Array.isArray(tags)
    ? tags.map((t: string) => String(t).trim()).filter(Boolean)
    : typeof tags === "string"
    ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
    : [];

  const article = await Content.create({
    title: title.trim(),
    description: description.trim(),
    body: body?.trim() || description.trim(),
    source: computedSource,
    author: computedAuthor,
    tags: processedTags,
    readTime: computedReadTime,
    url: url?.trim() || `https://onefeed.dev/articles/${Date.now()}`,
    image: computedImage,
    publishedAt: new Date(),
  });

  res.status(201).json({
    success: true,
    data: article,
  });
});
