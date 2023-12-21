var admin = require("firebase-admin");

var serviceAccount = require("../../smartfarming.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smarthome-2fbbd-default-rtdb.firebaseio.com"
});
