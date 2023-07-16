var config = {};

config.addon = {
  set mode (val) {app.storage.write("mode", val)},
  get mode () {return app.storage.read("mode") !== undefined ? app.storage.read("mode") : "dark"}
};

config.welcome = {
  set lastupdate (val) {app.storage.write("lastupdate", val)},
  get lastupdate () {return app.storage.read("lastupdate") !== undefined ? app.storage.read("lastupdate") : 0}
};
