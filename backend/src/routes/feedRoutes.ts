import { Router } from "express";
import { getFeed, getFeedItem, createArticle } from "../controllers/feedController";
import { addBookmark, removeBookmark } from "../controllers/bookmarkController";
import { protect } from "../middleware/auth";

const router: Router = Router();

// Public read routes
router.get("/", getFeed);
router.get("/:id", getFeedItem);

// Protected create article route
router.post("/", protect, createArticle);

// Private — bookmarking a specific feed item
router.post("/:id/bookmark", protect, addBookmark);
router.delete("/:id/bookmark", protect, removeBookmark);

export default router;
