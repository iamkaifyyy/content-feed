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
