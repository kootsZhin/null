var core = {
  "start": function () {
    core.load();
  },
  "install": function () {
    core.load();
  },
  "load": function () {
    /*  */
  }
};

app.popup.receive("store", function (e) {
  config.addon.mode = e.mode;
});

app.popup.receive("load", function () {
  app.popup.send("storage", {
    "mode": config.addon.mode
  });
});

app.on.startup(core.start);
app.on.installed(core.install);