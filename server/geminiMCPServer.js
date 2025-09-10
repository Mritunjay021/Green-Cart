import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Setup Gemini client using OpenAI SDK
const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/",
});

// Create MCP server
const server = new McpServer(
  {
    name: "gemini-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: { tools: {} },
  }
);

// Define a tool directly
server.tool("askGemini", {
  description: "Ask Gemini a question and get a direct answer.",
  inputSchema: {
    type: "object",
    properties: {
      prompt: {
        type: "string",
        description: "The question you want to ask Gemini.",
      },
    },
    required: ["prompt"],
  },
  execute: async ({ prompt }) => {
    try {
      const response = await client.chat.completions.create({
        model: "gemini-1.5-flash-latest",
        messages: [{ role: "user", content: prompt }],
      });

      const text =
        response.choices[0]?.message?.content || "No response from Gemini.";

      return {
        type: "text",
        text,
      };
    } catch (err) {
      console.error("Gemini API error:", err);
      return {
        type: "text",
        text: "Error calling Gemini API",
      };
    }
  },
});

// Start server with stdio transport
async function startServer() {
  console.log("🚀 Starting Gemini MCP Server...");
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("✅ Gemini MCP Server running, ready for requests.");
}

startServer();
