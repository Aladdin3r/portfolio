import { Composio } from "@composio/core";
import { ClaudeAgentSDKProvider } from "@composio/claude-agent-sdk";
import { createSdkMcpServer, query } from "@anthropic-ai/claude-agent-sdk";

/**
 * Initialize Composio client with API key from environment
 */
export function initializeComposio(apiKey: string) {
  return new Composio({
    apiKey,
    provider: new ClaudeAgentSDKProvider(),
  });
}

/**
 * Create a Composio session for a user
 */
export async function createComposioSession(
  composio: Composio,
  externalUserId: string
) {
  const session = await composio.create(externalUserId);
  return session;
}

/**
 * Get tools from a Composio session
 */
export async function getComposioTools(session: any) {
  return await session.tools();
}

/**
 * Create an MCP server with Composio tools
 */
export function createComposioMcpServer(tools: any[]) {
  return createSdkMcpServer({
    name: "composio",
    version: "1.0.0",
    tools: tools,
  });
}

/**
 * Execute a query using Claude with Composio tools
 */
export async function executeComposioQuery(
  prompt: string,
  mcpServer: any,
  permissionMode: "bypassPermissions" | "requirePermissions" = "requirePermissions"
) {
  const responses: string[] = [];

  for await (const content of query({
    prompt,
    options: {
      mcpServers: { composio: mcpServer },
      permissionMode,
    },
  })) {
    if (content.type === "assistant") {
      responses.push(content.message);
    }
  }

  return responses;
}

/**
 * Authorize a user to use a specific tool/app
 */
export async function authorizeComposioApp(
  session: any,
  appName: string,
  callbackUrl: string
) {
  const connectionRequest = await session.authorize(appName, {
    callbackUrl,
  });

  return {
    redirectUrl: connectionRequest.redirectUrl,
    connectionRequest,
  };
}

/**
 * Wait for a connection to be established
 */
export async function waitForConnection(connectionRequest: any) {
  return await connectionRequest.waitForConnection();
}
