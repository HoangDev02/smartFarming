
const { client, connect } = require("./publisher");
const { admin } = require("../connectFirebase/connect");

// connect()
const devicesRef = admin.firestore().collection("devices");
async function subscriber() {
  const querySnapshot = await admin.firestore().collection("devices").get();
  let topics = [];

  querySnapshot.forEach((doc) => {
    topics.push(doc.data().topic);
  });
  client.subscribe(topics, () => {
    console.log(`Subscribe to topic ${topics}`);
  });

  client.on("message", async (topic, message) => {
    const checkTopic = topics.filter(e => e === topic).toString()
    if (topic === checkTopic) {
      const messageString = message.toString();
      // Query Firestore for documents with the topic 'light'
      const querySnapshot = await devicesRef.where("topic", "==", checkTopic).get();
      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      // duyệt trong mảng láy id
      querySnapshot.forEach((doc) => {
        const deviceRef = devicesRef.doc(doc.id);
        //messageString là mqtt truyền về , status dựa vào giá trị mqtt
        const status = messageString === "ON"  ? "ON" : "OFF";
        deviceRef
          .update({ status: status })
          .then(() => {
            console.log("Update success");
          })
          .catch((err) => {
            console.error("Error updating", err);
          });
      });
    }
  });
}

function parseTemperatureAndHumidity(messageString) {
  const temperatureRegex = /Temperature: (\d+\.\d+)°C/i;
  const humidityRegex = /Humidity: (\d+)%/i;

  const temperatureMatch = messageString.match(temperatureRegex);
  const humidityMatch = messageString.match(humidityRegex);

  if (temperatureMatch && humidityMatch) {
    const temperature = parseFloat(temperatureMatch[1]);
    const humidity = parseInt(humidityMatch[1]);
    return { temperature, humidity };
  }

  return null; // Trả về null nếu không thể trích xuất dữ liệu
}

module.exports = { subscriber };
