module.exports = {
  version: "3.7",
  title: "Ultimate-TTS-Studio",
  description:
    "Kokoro, KittenTTS, Higgs audio, Chatterbox/Multi, Fish-Speech, F5 & index-tts & indextts2, VoxCPM and VibeVoice in one app",
  icon: "icon.png",
  menu: async (kernel, info) => {
    let installed = info.exists("app/tts_env");
    let mcpInstalled = info.exists("app/tts_mcp_env");
    let running = {
      install: info.running("install.js"),
      mcpInstall: info.running("mcp_install.js"),
      start: info.running("start.js"),
      mcpStart: info.running("mcp_start.js"),
      update: info.running("update.js"),
      reset: info.running("reset.js"),
      link: info.running("link.js"),
    };

    if (running.install) {
      return [
        {
          default: true,
          icon: "fa-solid fa-plug",
          text: "Installing",
          href: "install.js",
        },
      ];
    }

    if (running.mcpInstall) {
      return [
        {
          default: true,
          icon: "fa-solid fa-plug",
          text: "Installing MCP",
          href: "mcp_install.js",
        },
      ];
    }

    if (installed || mcpInstalled) {
      if (running.start) {
        let local = info.local("start.js");
        let items =
          local && local.url
            ? [
                {
                  default: true,
                  icon: "fa-solid fa-rocket",
                  text: "Open Web UI",
                  href: local.url,
                },
                {
                  icon: "fa-solid fa-terminal",
                  text: "Terminal",
                  href: "start.js",
                },
              ]
            : [
                {
                  default: true,
                  icon: "fa-solid fa-terminal",
                  text: "Terminal",
                  href: "start.js",
                },
              ];

        if (running.mcpStart) {
          let mcpLocal = info.local("mcp_start.js");
          if (mcpLocal && mcpLocal.url) {
            items.push({
              icon: "fa-solid fa-plug",
              text: "Open MCP Sidecar UI",
              href: mcpLocal.url,
            });
          }
          if (mcpLocal && mcpLocal.mcp_url) {
            items.push({
              icon: "fa-solid fa-network-wired",
              text: "MCP SSE Endpoint",
              href: mcpLocal.mcp_url,
            });
          }
          items.push({
            icon: "fa-solid fa-terminal",
            text: "MCP Terminal",
            href: "mcp_start.js",
          });
        } else if (mcpInstalled) {
          items.push({
            icon: "fa-solid fa-plug",
            text: "Start MCP",
            href: "mcp_start.js",
          });
        } else {
          items.push({
            icon: "fa-solid fa-plug",
            text: "Install MCP",
            href: "mcp_install.js",
          });
        }

        return items;
      }

      if (running.mcpStart) {
        let local = info.local("mcp_start.js");
        let items =
          local && local.url
            ? [
                {
                  default: true,
                  icon: "fa-solid fa-plug",
                  text: "Open MCP Sidecar UI",
                  href: local.url,
                },
                {
                  icon: "fa-solid fa-terminal",
                  text: "MCP Terminal",
                  href: "mcp_start.js",
                },
              ]
            : [
                {
                  default: true,
                  icon: "fa-solid fa-terminal",
                  text: "MCP Terminal",
                  href: "mcp_start.js",
                },
              ];

        if (local && local.mcp_url) {
          items.push({
            icon: "fa-solid fa-network-wired",
            text: "MCP SSE Endpoint",
            href: local.mcp_url,
          });
        }

        items.push(
          installed
            ? {
                icon: "fa-solid fa-power-off",
                text: "Start",
                href: "start.js",
              }
            : {
                icon: "fa-solid fa-plug",
                text: "Install",
                href: "install.js",
              },
        );

        return items;
      }

      if (running.update) {
        return [
          {
            default: true,
            icon: "fa-solid fa-terminal",
            text: "Updating",
            href: "update.js",
          },
        ];
      }

      if (running.reset) {
        return [
          {
            default: true,
            icon: "fa-solid fa-terminal",
            text: "Resetting",
            href: "reset.js",
          },
        ];
      }

      if (running.link) {
        return [
          {
            default: true,
            icon: "fa-solid fa-terminal",
            text: "Deduplicating",
            href: "link.js",
          },
        ];
      }

      let items = [];

      if (installed) {
        items.push({
          default: true,
          icon: "fa-solid fa-power-off",
          text: "Start",
          href: "start.js",
        });
      }

      if (mcpInstalled) {
        items.push({
          default: !installed,
          icon: "fa-solid fa-plug",
          text: "Start MCP",
          href: "mcp_start.js",
        });
      }

      if (!installed) {
        items.push({
          default: !mcpInstalled,
          icon: "fa-solid fa-plug",
          text: "Install",
          href: "install.js",
        });
      }

      if (!mcpInstalled) {
        items.push({
          icon: "fa-solid fa-plug",
          text: "Install MCP",
          href: "mcp_install.js",
        });
      }

      if (installed) {
        items.push({
          icon: "fa-solid fa-plug",
          text: "Update",
          href: "update.js",
        });
        items.push({
          icon: "fa-solid fa-plug",
          text: "Install",
          href: "install.js",
        });
        items.push({
          icon: "fa-solid fa-file-zipper",
          text: "<div><strong>Save Disk Space</strong><div>Deduplicates redundant library files</div></div>",
          href: "link.js",
        });
      }

      items.push({
        icon: "fa-regular fa-circle-xmark",
        text: "<div><strong>Reset</strong><div>Revert to pre-install state</div></div>",
        href: "reset.js",
        confirm: "Are you sure you wish to reset the app?",
      });

      return items;
    }

    return [
      {
        default: true,
        icon: "fa-solid fa-plug",
        text: "Install",
        href: "install.js",
      },
      {
        icon: "fa-solid fa-plug",
        text: "Install MCP",
        href: "mcp_install.js",
      },
    ];
  },
};
