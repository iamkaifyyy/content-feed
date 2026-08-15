import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IUser } from "./User";
import { IContent } from "./Content";

export interface IBookmark extends Document {
  user: Types.ObjectId | IUser;
  content: Types.ObjectId | IContent;
  createdAt: Date;
  updatedAt: Date;
}

// Populated version with fully resolved references
export interface IBookmarkPopulated extends Omit<IBookmark, "content"> {
  content: IContent;
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index: a given user can only bookmark a given content item once.
// This is enforced at the DATABASE level (not just app logic), so it holds even
// under race conditions (e.g. a user double-clicking "bookmark" fast, or two
// requests hitting different server instances at once).
bookmarkSchema.index({ user: 1, content: 1 }, { unique: true });

// Supports "GET /bookmarks" -> fetch all bookmarks for a user, most recent first.
bookmarkSchema.index({ user: 1, createdAt: -1 });

const Bookmark: Model<IBookmark> = mongoose.model<IBookmark>(
  "Bookmark",
  bookmarkSchema
);
export default Bookmark;
