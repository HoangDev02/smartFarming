var express = require("express");
var router = express.Router();

const deviceController = require("../controllers/deviceController");

router.get("/", deviceController.getDevices);
router.get("/:id", deviceController.getDeviceDetails);
router.post("/create", deviceController.create);
router.put("/update/:id", deviceController.update);
router.put("/manually/:id", deviceController.updateManuallyStatus);
router.delete("/:id", deviceController.remove);

module.exports = router;
