module.exports = {
  requires: {
    bundle: "ai",
  },
  run: [
    {
      method: "fs.read",
      params: {
        path: "app/.mcp_token",
        encoding: "utf8",
      },
    },
    {
      method: "local.set",
      params: {
        token: "{{input.trim()}}",
      },
    },
    {
      method: "net",
      params: {
        url: "{{args.url || 'http://127.0.0.1:7860'}}/status",
        method: "get",
      },
    },
    {
      method: "log",
      params: {
        raw: "MCP status response: {{JSON.stringify(input)}}",
      },
    },
    {
      method: "net",
      params: {
        url: "{{args.url || 'http://127.0.0.1:7860'}}/gradio_api/mcp/sse",
        method: "get",
        headers: {
          Authorization: "Bearer {{local.token}}",
          Accept: "text/event-stream",
        },
      },
    },
    {
      method: "log",
      params: {
        raw: "MCP SSE probe response: {{JSON.stringify(input)}}",
      },
    },
    {
      method: "notify",
      params: {
        html: "<strong>MCP verify complete</strong><div>Check the terminal output for the status and SSE probe results.</div>",
      },
    },
  ],
};