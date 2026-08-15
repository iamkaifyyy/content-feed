import mongoose, { Document, Model, Schema } from "mongoose";

export interface IContent extends Document {
  title: string;
  description?: string;
  source?: string;
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
    source: {
      type: String,
      trim: true,
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

// This index supports the default feed query: sort by publishedAt (newest first)
// with pagination. Without it, Mongo would collection-scan + in-memory sort as
// the dataset grows, which doesn't scale.
contentSchema.index({ publishedAt: -1 });

const Content: Model<IContent> = mongoose.model<IContent>(
  "Content",
  contentSchema
);
export default Content;
