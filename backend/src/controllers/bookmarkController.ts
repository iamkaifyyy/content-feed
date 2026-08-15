import mongoose from "mongoose";
import { Request, Response } from "express";
import Bookmark from "../models/Bookmark";
import Content from "../models/Content";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";

interface BookmarkQuery {
  page?: string;
  limit?: string;
}

export const addBookmark = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const contentId = req.params.id as string;
  const userId = req.user._id;

  if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
    throw new AppError("Invalid content ID", 400);
  }

  const contentExists = await Content.exists({ _id: contentId });
  if (!contentExists) {
    throw new AppError("Content not found", 404);
  }

  try {
    const bookmark = await Bookmark.create({ user: userId, content: contentId });
    res.status(201).json({ success: true, data: bookmark });
  } catch (err: any) {
    if (err.code === 11000) {
      throw new AppError("Content is already bookmarked", 409);
    }
    throw err;
  }
});

export const removeBookmark = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const contentId = req.params.id as string;
  const userId = req.user._id;

  if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
    throw new AppError("Invalid content ID", 400);
  }

  const bookmark = await Bookmark.findOneAndDelete({ user: userId, content: contentId });
  if (!bookmark) {
    throw new AppError("Bookmark not found", 404);
  }

  res.status(200).json({ success: true, message: "Bookmark removed" });
});

export const getBookmarks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user._id;
  const query = req.query as BookmarkQuery;

  const page = Math.max(parseInt(query.page ?? "1", 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit ?? "20", 10) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const [bookmarks, totalItems] = await Promise.all([
    Bookmark.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("content"),
    Bookmark.countDocuments({ user: userId }),
  ]);

  res.status(200).json({
    success: true,
    data: bookmarks,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      hasNextPage: page * limit < totalItems,
      hasPrevPage: page > 1,
    },
  });
});
