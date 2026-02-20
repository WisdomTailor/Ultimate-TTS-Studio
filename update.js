module.exports = {
  run: [{
    method: "shell.run",
    params: {
      message: [
        "git pull upstream main --rebase",
        "git push origin my-custom-features"
      ]
    }
  }, {
    method: "shell.run",
    params: {
      path: "app",
      message: [
        "git pull upstream main --rebase",
        "git push origin my-custom-features"
      ]
    }
  }, {
    method: "script.start",
    params: {
      uri: "install.js"
    }
  }]
}