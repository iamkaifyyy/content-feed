import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IUser } from "./User";
import { IContent } from "./Content";

export interface IBookmark extends Document {
  user: Types.ObjectId | IUser;
  content: Types.ObjectId | IContent;
  createdAt: Date;
  updatedAt: Date;
}

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

bookmarkSchema.index({ user: 1, content: 1 }, { unique: true });
bookmarkSchema.index({ user: 1, createdAt: -1 });

bookmarkSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    return ret;
  },
});

const Bookmark: Model<IBookmark> = mongoose.model<IBookmark>("Bookmark", bookmarkSchema);
export default Bookmark;
