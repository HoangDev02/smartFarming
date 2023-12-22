const mqtt = require('mqtt');
const { DHT,  LED, PAN ,MANUALLY, DISTANCE, FLAME, RGB,LIGHT} = require('./topic');

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

      //nhận dữ liệu từ mqtt truyền qua file subscriber
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
      client.subscribe([RGB], () => {
        console.log(`Subscribe to topic ${RGB}`);
      });
      client.subscribe([LIGHT], () => {
        console.log(`Subscribe to topic ${LIGHT}`);
      });
    });
    client.on('close', () => {
      console.log('Kết nối đã đóng');
    });
  } catch (err) {
    console.log(err);
  }
};

//dùng để cập nhật status -> file deviceController
const publishManuallyStatus = async (topic,deviceId, status) => {
  const message = status ? 'ON' : 'OFF'; 
  client.publish(topic, message, { qos: 1, retain: true });

  console.log(`Đã publish trạng thái  ${deviceId}: ${topic}`);
}

module.exports = { connect, client,publishManuallyStatus };
