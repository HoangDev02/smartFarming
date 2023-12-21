const mqtt = require('mqtt');
const { DHT,  LED, PAN ,MANUALLY, DISTANCE, FLAME} = require('./topic');

require('dotenv').config()

const MQTT_BROKER_HOST = process.env.MQTT_BROKER_HOST
const MQTT_BROKER_PORT = process.env.MQTT_BROKER_PORT
const MQTT_BROKER_PROTOCOL = process.env.MQTT_BROKER_PROTOCOL
const MQTT_USERNAME = process.env.MQTT_USERNAME
const MQTT_PASSWORD = process.env.MQTT_PASSWORD

const options = {
  host: MQTT_BROKER_HOST,
  port: MQTT_BROKER_PORT,
  protocol: MQTT_BROKER_PROTOCOL,
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD
}
const client = mqtt.connect(options);

const connect = async () => {
  try {
    client.on('error', function (error) {
      console.log(error);
    });

    // Sự kiện khi kết nối thành công
    client.on('connect', () => {
      console.log('Đã kết nối thành công đến MQTT Broker');
      client.subscribe([DHT], () => {
        console.log(`Subscribe to topic ${DHT}`);
      });
      client.subscribe([DISTANCE], () => {
        console.log(`Subscribe to topic ${DISTANCE}`);
      });
      client.subscribe([FLAME], () => {
        console.log(`Subscribe to topic ${FLAME}`);
      });
      client.subscribe([PAN], () => {
        console.log(`Subscribe to topic ${PAN}`);
      });
      client.subscribe([MANUALLY], () => {
        console.log(`Subscribe to topic ${MANUALLY}`);
      });
      client.subscribe([LED], () => {
        console.log(`Subscribe to topic ${LED}`);
      });
    });


    client.on('close', () => {
      console.log('Kết nối đã đóng');
    });
  } catch (err) {
    console.log(err);
  }
};

// const publishLCDStatus = async (topic,deviceId, type) => {
//   const message = type; 
//   client.publish(topic, message);

//   console.log(`Đã publish trạng thái của PAN ${deviceId}: ${topic}`);
// }

const publishManuallyStatus = async (topic,deviceId, status) => {
  const message = status ? '1' : '0'; 
  client.publish(topic, message, { qos: 1, retain: true });

  console.log(`Đã publish trạng thái  ${deviceId}: ${topic}`);
}

module.exports = { connect, client,publishManuallyStatus };
