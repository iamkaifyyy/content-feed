import { Router } from "express";
import { getBookmarks } from "../controllers/bookmarkController";
import { protect } from "../middleware/auth";

const router: Router = Router();

router.get("/", protect, getBookmarks);

export default router;
