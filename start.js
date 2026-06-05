module.exports = {
  daemon: true,
  env: [
    {
      title: "Azure AI API Key (optional)",
      description:
        "Enter your Azure AI Services API key for Microsoft Foundry LLM provider. Get it from Azure Portal → AI Services → Keys. Leave blank if you only use local providers (Ollama, LM Studio).",
      key: "AZURE_AI_API_KEY",
    },
  ],
  run: [
    {
      method: "shell.run",
      params: {
        conda: "tts_env",
        env: {},
        path: "app",
        message: ["python launch.py"],
        on: [
          {
            // The regular expression pattern to monitor.
            // When this pattern occurs in the shell terminal, the shell will return,
            // and the script will go onto the next step.
            event: "/(http:\/\/(?:127\\.0\\.0\\.1|localhost):[0-9]+)/",

            // "done": true will move to the next step while keeping the shell alive.
            // "kill": true will move to the next step after killing the shell.
            done: true,
          },
        ],
      },
    },
    {
      // This step sets the local variable 'url'.
      // This local variable will be used in pinokio.js to display the "Open WebUI" tab when the value is set.
      method: "local.set",
      params: {
        // the input.event is the regular expression match object from the previous step
        url: "{{input.event[1]}}",
      },
    },
  ],
};
