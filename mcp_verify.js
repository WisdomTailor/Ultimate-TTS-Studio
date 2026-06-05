module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        conda: "tts_mcp_env",
        path: "app",
        message: [
          'python mcp_verify_summary.py --url "{{(input && input.url) || args.url || \'http://127.0.0.1:7860\'}}" --summary-path "../app_state/mcp_verify_summary.json"',
        ],
      },
    },
    {
      method: "log",
      params: {
        raw: "MCP verification summary saved to app_state/mcp_verify_summary.json",
      },
    },
    {
      method: "fs.read",
      params: {
        path: "app_state/mcp_verify_summary.json",
        encoding: "utf8",
      },
    },
    {
      method: "log",
      params: {
        raw: "MCP verification summary JSON: {{input}}",
      },
    },
    {
      method: "notify",
      params: {
        html: "<strong>MCP verify complete</strong><div>Summary: app_state/mcp_verify_summary.json</div><div>See terminal output for pass/fail details.</div>",
      },
    },
  ],
};
