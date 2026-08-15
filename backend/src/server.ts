import "dotenv/config";
import connectDB from "./config/db";
import app from "./app";

const PORT: number = parseInt(process.env.PORT || "5001", 10);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
