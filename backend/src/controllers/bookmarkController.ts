import mongoose from "mongoose";
import { Request, Response } from "express";
import Bookmark from "../models/Bookmark";
import Content from "../models/Content";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";

interface MongoError extends Error {
  code?: number;
}

interface BookmarkQuery {
  page?: string;
  limit?: string;
}

// @route  POST /api/v1/feed/:id/bookmark
// @access Private
export const addBookmark = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const contentId = req.params.id as string;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new AppError("Invalid content ID", 400);
  }

  const content = await Content.findById(contentId);
  if (!content) {
    throw new AppError("Content not found", 404);
  }

  try {
    const bookmark = await Bookmark.create({ user: userId, content: contentId });
    res.status(201).json({ success: true, data: bookmark });
  } catch (err) {
    // The unique compound index on (user, content) throws a Mongo duplicate-key
    // error (code 11000) if this bookmark already exists. We catch it here to
    // give a clean 409, but even without this catch, the errorHandler middleware
    // would still translate it correctly — this is just a friendlier message.
    if ((err as MongoError).code === 11000) {
      throw new AppError("You have already bookmarked this content", 409);
    }
    throw err;
  }
});

// @route  DELETE /api/v1/feed/:id/bookmark
// @access Private
export const removeBookmark = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const contentId = req.params.id as string;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new AppError("Invalid content ID", 400);
  }

  // Scoping the delete filter to { user: userId, content: contentId } is what
  // guarantees a user can only ever delete THEIR OWN bookmark — even if they
  // guessed another user's bookmark somehow, this filter would just match nothing.
  const bookmark = await Bookmark.findOneAndDelete({ user: userId, content: contentId });

  if (!bookmark) {
    throw new AppError("Bookmark not found", 404);
  }

  res.status(200).json({ success: true, message: "Bookmark removed" });
});

// @route  GET /api/v1/bookmarks
// @access Private
export const getBookmarks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user._id;
  const query = req.query as BookmarkQuery;

  let page = Math.max(parseInt(query.page ?? "1", 10) || 1, 1);
  let limit = Math.min(Math.max(parseInt(query.limit ?? "20", 10) || 20, 1), 100);
  const skip = (page - 1) * limit;

  // Filtering by { user: userId } is what guarantees users only ever see
  // their own bookmarks — never another user's.
  const [bookmarks, totalItems] = await Promise.all([
    Bookmark.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("content"), // pulls in the full article, not just the content ID
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
    },
  });
});
