module.exports = {
  requires: {
    bundle: "ai",
  },
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        conda: "tts_mcp_env",
        env: {},
        path: "app",
        message: ["python mcp_sidecar.py --port {{port}}"],
        on: [
          {
            event: "/(http:\/\/(?:127\\.0\\.0\\.1|localhost):[0-9]+)/",
            done: true,
          },
        ],
      },
    },
    {
      method: "local.set",
      params: {
        url: "{{input.event[1]}}",
        mcp_sse_url: "{{input.event[1]}}/gradio_api/mcp/sse",
      },
    },
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
        mcp_url: "{{local.mcp_sse_url}}?token={{input.trim()}}",
      },
    },
    {
      method: "fs.write",
      params: {
        path: ".vscode/mcp.json",
        json2: {
          servers: {
            "ultimate-tts-studio": {
              type: "sse",
              url: "{{local.mcp_sse_url}}",
              headers: {
                Authorization: "Bearer {{input.trim()}}",
              },
            },
          },
        },
      },
    },
    {
      method: "fs.write",
      params: {
        path: ".vscode/mcp.live.json",
        json2: {
          servers: {
            "ultimate-tts-studio": {
              type: "sse",
              url: "{{local.mcp_sse_url}}",
              headers: {
                Authorization: "Bearer {{input.trim()}}",
              },
            },
          },
        },
      },
    },
  ],
};
