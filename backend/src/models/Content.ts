import mongoose, { Document, Model, Schema } from "mongoose";

export interface IContent extends Document {
  title: string;
  description?: string;
  body?: string;
  source?: string;
  author?: string;
  tags?: string[];
  readTime?: string;
  url: string;
  image?: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const contentSchema = new Schema<IContent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    body: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    readTime: {
      type: String,
      default: "5 min read",
    },
    url: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    publishedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

contentSchema.index({ publishedAt: -1 });

contentSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    return ret;
  },
});

const Content: Model<IContent> = mongoose.model<IContent>("Content", contentSchema);
export default Content;
