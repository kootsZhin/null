var background = {
  "port": null,
  "message": {},
  "receive": function (id, callback) {
    if (id) {
      background.message[id] = callback;
    }
  },
  "send": function (id, data) {
    if (id) {
      chrome.runtime.sendMessage({
        "method": id,
        "data": data,
        "path": "popup-to-background"
      });
    }
  },
  "connect": function (port) {
    chrome.runtime.onMessage.addListener(background.listener); 
    /*  */
    if (port) {
      background.port = port;
      background.port.onMessage.addListener(background.listener);
      background.port.onDisconnect.addListener(function () {
        background.port = null;
      });
    }
  },
  "post": function (id, data) {
    if (id) {
      if (background.port) {
        background.port.postMessage({
          "method": id,
          "data": data,
          "path": "popup-to-background",
          "port": background.port.name
        });
      }
    }
  },
  "listener": function (e) {
    if (e) {
      for (var id in background.message) {
        if (background.message[id]) {
          if ((typeof background.message[id]) === "function") {
            if (e.path === "background-to-popup") {
              if (e.method === id) {
                background.message[id](e.data);
              }
            }
          }
        }
      }
    }
  }
};


var config = {
  "mode": "dark",
  "update": function (e) {
    config.mode = e.mode;
    /*  */
    var toggle = document.getElementById("toggle");
    if (toggle) toggle.setAttribute("mode", config.mode);
    /*  */
    document.body.setAttribute("mode", config.mode);
    document.documentElement.setAttribute("mode", config.mode);
  },
  "listener": {
    "toggle": function () {
      config.mode = config.mode === "dark" ? "light" : "dark";
      //
      config.update({"mode": config.mode});
      background.send("store", {
        "mode": config.mode
      });
    }
  },
  "load": function () {
    var toggle = document.getElementById("toggle");
    /*  */
    toggle.addEventListener("click", config.listener.toggle);
    /*  */
    background.send("load");
    window.removeEventListener("load", config.load, false);
  }
};

background.receive("storage", config.update);
window.addEventListener("load", config.load, false);
background.connect(chrome.runtime.connect({"name": "popup"}));