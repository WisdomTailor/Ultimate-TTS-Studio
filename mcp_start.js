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
        mcp_url: "{{input.event[1]}}/gradio_api/mcp/sse",
      },
    },
  ],
};