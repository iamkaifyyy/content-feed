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

// @route  GET /api/v1/feed?page=1&limit=20&sort=latest
// @access Public
export const getFeed = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const query = req.query as FeedQuery;

  let page = Math.max(parseInt(query.page ?? "1", 10) || 1, 1);
  let limit = Math.min(Math.max(parseInt(query.limit ?? "20", 10) || 20, 1), 100); // cap at 100
  const sort = query.sort ?? "latest";

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    latest: { publishedAt: -1 },
    oldest: { publishedAt: 1 },
  };
  const sortQuery = sortMap[sort] ?? sortMap.latest;

  const skip = (page - 1) * limit;

  // Run the query and the count in parallel rather than sequentially.
  const [items, totalItems] = await Promise.all([
    Content.find().sort(sortQuery).skip(skip).limit(limit),
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

// @route  GET /api/v1/feed/:id
// @access Public
export const getFeedItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
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
