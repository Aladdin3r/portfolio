import type { APIRoute } from "astro";
import {
  initializeComposio,
  createComposioSession,
  authorizeComposioApp,
} from "../../../lib/composio";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { appName } = body;

    if (!appName) {
      return new Response(
        JSON.stringify({ error: "appName is required (e.g., 'gmail')" }),
        { status: 400 }
      );
    }

    // Get environment variables
    const apiKey = import.meta.env.COMPOSIO_API_KEY;
    const externalUserId = import.meta.env.COMPOSIO_EXTERNAL_USER_ID;
    const callbackUrl = import.meta.env.COMPOSIO_CALLBACK_URL;

    if (!apiKey || !externalUserId || !callbackUrl) {
      return new Response(
        JSON.stringify({
          error: "Missing required environment variables"
        }),
        { status: 500 }
      );
    }

    // Initialize Composio
    const composio = initializeComposio(apiKey);

    // Create session with manageConnections disabled
    const session = await composio.create(externalUserId, {
      manageConnections: false,
    });

    // Authorize the app
    const { redirectUrl } = await authorizeComposioApp(
      session,
      appName,
      callbackUrl
    );

    return new Response(
      JSON.stringify({
        success: true,
        redirectUrl,
        message: `Please visit the URL to authorize ${appName}`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Authorization error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create authorization URL",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
};
