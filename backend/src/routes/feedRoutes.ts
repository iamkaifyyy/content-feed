import { Router } from "express";
import { getFeed, getFeedItem } from "../controllers/feedController";
import { addBookmark, removeBookmark } from "../controllers/bookmarkController";
import { protect } from "../middleware/auth";

const router: Router = Router();

// Public
router.get("/", getFeed);
router.get("/:id", getFeedItem);

// Private — bookmarking a specific feed item
router.post("/:id/bookmark", protect, addBookmark);
router.delete("/:id/bookmark", protect, removeBookmark);

export default router;
