const { publishManuallyStatus, publishLCDStatus } = require("../cli/publisher");
const { MANUALLY } = require("../cli/topic");
const { admin } = require("../connectFirebase/connect");

exports.getDevices = async (req, res) => {
  const querySnapshot = await admin.firestore().collection("devices").get();

  let devices = [];

  querySnapshot.forEach((doc) => {
    devices.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  res.status(200).json({
    devices,
  });
};
exports.getDeviceDetails = async (req, res) => {
  const id = req.params.id;

  const docRef = admin.firestore().collection("devices").doc(id);

  const docSnapshot = await docRef.get();

  if (!docSnapshot.exists) {
    return res.status(404).send("Device not found");
  }

  const device = docSnapshot.data();
  res.status(200).json({
    device,
  });
};

exports.updateManuallyStatus = async (req, res) => {
  const id = req.params.id;
  const { topic, status } = req.body;
  const docRef = admin.firestore().collection("devices").doc(id);

  await docRef.update({
    status: status,
  });

  publishManuallyStatus(topic, id, status);

  res.status(200).send("Device status updated successfully!");
};
