import express from "express";
import { getIngredients } from "../src/ingredients.ts";

const apiRouter = express.Router();

apiRouter.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const reply = await getIngredients(message);

    res.json({
      success: true,
      reply
    });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate response"
    });
  }
});

export default apiRouter;