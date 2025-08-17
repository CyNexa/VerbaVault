import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dictionaryRoutes from "./routes/dictionary.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/dictionary", dictionaryRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ msg: "Express backend running 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
