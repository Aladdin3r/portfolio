import type { APIRoute } from "astro";
import {
  initializeComposio,
  createComposioSession,
  getComposioTools,
  createComposioMcpServer,
  executeComposioQuery,
} from "../../../lib/composio";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400 }
      );
    }

    // Get environment variables
    const apiKey = import.meta.env.COMPOSIO_API_KEY;
    const externalUserId = import.meta.env.COMPOSIO_EXTERNAL_USER_ID;

    if (!apiKey || !externalUserId) {
      return new Response(
        JSON.stringify({
          error: "Missing COMPOSIO_API_KEY or COMPOSIO_EXTERNAL_USER_ID in environment variables"
        }),
        { status: 500 }
      );
    }

    // Initialize Composio
    const composio = initializeComposio(apiKey);

    // Create session
    const session = await createComposioSession(composio, externalUserId);

    // Get tools
    const tools = await getComposioTools(session);

    // Create MCP server
    const mcpServer = createComposioMcpServer(tools);

    // Execute query
    const responses = await executeComposioQuery(
      prompt,
      mcpServer,
      "bypassPermissions"
    );

    return new Response(
      JSON.stringify({
        success: true,
        responses,
        message: "Query executed successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error executing Composio query:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to execute query",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
};
