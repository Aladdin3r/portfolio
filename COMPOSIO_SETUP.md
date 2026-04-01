# Composio Integration Setup

This project integrates Composio with Claude Agent SDK to enable AI-powered automation and tool execution.

## Prerequisites

1. A Composio account and API key from [https://app.composio.dev/settings](https://app.composio.dev/settings)
2. Node.js and npm installed

## Installation

The dependencies are already installed:
- `@composio/core`
- `@composio/claude-agent-sdk`
- `@anthropic-ai/claude-agent-sdk`

## Configuration

1. Copy `.env.example` to `.env` (already done)
2. Update the values in `.env`:
   ```
   COMPOSIO_API_KEY=your_actual_api_key
   COMPOSIO_EXTERNAL_USER_ID=unique_user_identifier
   COMPOSIO_CALLBACK_URL=http://localhost:4321/api/composio/callback
   ```

## Project Structure

```
src/
├── lib/
│   └── composio.ts              # Composio utility functions
├── pages/
│   ├── composio-demo.astro      # Demo page to test the integration
│   └── api/
│       └── composio/
│           ├── authorize.ts     # OAuth authorization endpoint
│           ├── callback.ts      # OAuth callback handler
│           └── send-email.ts    # Execute agent queries
```

## Usage

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test the Integration

Visit [http://localhost:4321/composio-demo](http://localhost:4321/composio-demo)

### 3. Authorize an App (e.g., Gmail)

1. Click "Authorize Gmail" button
2. Follow the OAuth flow to connect your Gmail account
3. You'll be redirected back to the callback page

### 4. Execute Agent Queries

Once authorized, you can send prompts like:
- "Send an email to example@email.com saying hello"
- "Create a calendar event for tomorrow at 2pm"
- Any other task the connected tools support

## API Endpoints

### POST `/api/composio/authorize`
Initiates OAuth flow for a specific app.

**Body:**
```json
{
  "appName": "gmail"
}
```

**Response:**
```json
{
  "success": true,
  "redirectUrl": "https://...",
  "message": "Please visit the URL to authorize gmail"
}
```

### GET `/api/composio/callback`
Handles OAuth callback after user authorization.

### POST `/api/composio/send-email`
Executes a query using Claude with Composio tools.

**Body:**
```json
{
  "prompt": "Send an email to test@example.com saying hello"
}
```

**Response:**
```json
{
  "success": true,
  "responses": ["Email sent successfully!"],
  "message": "Query executed successfully"
}
```

## Programmatic Usage

You can also use the Composio functions directly in your Astro pages or API routes:

```typescript
import {
  initializeComposio,
  createComposioSession,
  getComposioTools,
  createComposioMcpServer,
  executeComposioQuery,
} from '../lib/composio';

// Initialize
const composio = initializeComposio(apiKey);
const session = await createComposioSession(composio, userId);
const tools = await getComposioTools(session);
const mcpServer = createComposioMcpServer(tools);

// Execute query
const responses = await executeComposioQuery(
  "Send an email...",
  mcpServer
);
```

## Supported Apps

Composio supports 100+ apps including:
- Gmail
- Google Calendar
- Slack
- GitHub
- Notion
- And many more...

See the full list at [https://docs.composio.dev/apps](https://docs.composio.dev/apps)

## Security Notes

- Never commit your `.env` file (it's already in `.gitignore`)
- Keep your API keys secure
- Use environment variables for all sensitive data
- The callback URL must match what's configured in your Composio dashboard

## Troubleshooting

### "Missing environment variables" error
- Check that `.env` file exists and contains valid values
- Restart the dev server after changing `.env`

### Authorization fails
- Verify your Composio API key is valid
- Check that the callback URL matches your configuration
- Ensure the app name is correct (e.g., 'gmail', not 'Gmail')

### Query execution fails
- Make sure you've authorized the required app first
- Check the Composio dashboard for connection status
- Review the error details in the response

## Documentation

- [Composio Documentation](https://docs.composio.dev)
- [Tool Router Guide](https://docs.composio.dev/tool-router/overview)
- [Claude Agent SDK](https://github.com/anthropics/anthropic-sdk-typescript)
