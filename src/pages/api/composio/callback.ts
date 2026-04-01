import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  try {
    // Extract query parameters
    const params = url.searchParams;
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");

    if (error) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authorization Failed</title>
            <style>
              body { font-family: system-ui; padding: 2rem; max-width: 600px; margin: 0 auto; }
              .error { color: #dc2626; }
            </style>
          </head>
          <body>
            <h1 class="error">Authorization Failed</h1>
            <p>Error: ${error}</p>
            <p><a href="/">Return to home</a></p>
          </body>
        </html>
        `,
        {
          status: 400,
          headers: { "Content-Type": "text/html" },
        }
      );
    }

    // If successful, show success page
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Successful</title>
          <style>
            body { font-family: system-ui; padding: 2rem; max-width: 600px; margin: 0 auto; }
            .success { color: #16a34a; }
            pre { background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1 class="success">Authorization Successful!</h1>
          <p>Your app has been authorized successfully.</p>
          ${code ? `<p>Authorization code: <code>${code}</code></p>` : ""}
          ${state ? `<p>State: <code>${state}</code></p>` : ""}
          <p>You can close this window and return to your application.</p>
          <p><a href="/">Return to home</a></p>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (error) {
    console.error("Callback error:", error);
    return new Response(
      JSON.stringify({
        error: "Callback failed",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
};
