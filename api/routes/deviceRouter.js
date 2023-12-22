var express = require('express');
var router = express.Router();

const deviceController = require('../controllers/deviceController');

router.get('/', deviceController.getDevices);
router.get('/:id', deviceController.getDeviceDetails);
// router.post('/create', deviceController.createDevice);
// router.put('/led', deviceController.updateLedStatus);
// // router.put('/pan', deviceController.updatePanStatus);
router.put('/manually/:id', deviceController.updateManuallyStatus);
// router.put('/lcd/:id', deviceController.updateLCDStatus);

module.exports = router;