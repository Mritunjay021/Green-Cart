import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";

async function testGeminiMCPServer() {
  let serverProcess = null;
  let client = null;

  try {
    console.log("🚀 Starting Gemini MCP Server...");
    
    // // Start the server process
    // serverProcess = spawn("node", ["gemini-mcp-server.js"], {
    //   stdio: ["pipe", "pipe", "inherit"],
    // });

    // Create client transport
    const transport = new StdioClientTransport({
      reader: serverProcess.stdout,
      writer: serverProcess.stdin,
    });

    // Create and connect client
    client = new Client(
      { name: "test-client", version: "1.0.0" },
      { capabilities: {} }
    );

    await client.connect(transport);
    console.log("✅ Connected to server");

    // Test the askGemini tool
    console.log("\n💬 Testing askGemini tool...");
    const result = await client.callTool({
      name: "askGemini",
      arguments: { 
        prompt: "What is the meaning of life? Give a brief answer." 
      }
    });

    console.log("✅ Response from Gemini:");
    console.log(result.content[0].text);

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    // Cleanup
    if (client) {
      await client.close();
    }
    if (serverProcess) {
      serverProcess.kill();
    }
    console.log("🧹 Cleanup completed");
  }
}

testGeminiMCPServer();