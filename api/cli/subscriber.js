// subscriber.js
const mqtt = require('mqtt');
const TempHumidity = require('../models/tempHumiditymodel');
const { DHT, LED , DISTANCE,FLAME,MANUALLY,PAN } = require('./topic');
const { client, connect } = require('./publisher');
const Device = require('../models/deviceModel')
// connect()

async function subscriber() {
  client.on('message', async (receivedTopic, message) => {
    if (receivedTopic === DHT) {
      // Chuyển đổi thông điệp từ dạng chuỗi thành một đối tượng dữ liệu
      const messageString = message.toString();
      const data = parseTemperatureAndHumidity(messageString);

      // Kiểm tra xem có dữ liệu hợp lệ
      if (data) {
        const { temperature, humidity, deviceId } = data;
        
        // Tìm phòng chứa thiết bị có deviceId tương ứng
        try {
          const device = await Device.findOne({ 'devices.id': deviceId });
          if (device) {
            console.log(`Temperature: ${temperature}, Humidity: ${humidity}, device: ${device.name}`);
            // Lưu dữ liệu vào MongoDB
            const tempHumidityData = new TempHumidity({
              temperature,
              humidity,
              deviceId: device.id,
              timestamp: new Date()
            });
            tempHumidityData.save()
              .then(() => {
                console.log('Dữ liệu đã được lưu vào MongoDB');
              })
              .catch((error) => {
                console.error('Lỗi khi lưu dữ liệu vào MongoDB:', error);
              });
          } else {
            console.error(`Không tìm thấy phòng cho thiết bị có deviceId: ${deviceId}`);
          }
        } catch (error) {
          console.error('Lỗi khi tìm kiếm phòng trong MongoDB:', error);
        }
      } else {
        console.error('Dữ liệu không hợp lệ:', messageString);
      }
    }
  });
  
  client.on('message', async (topic, message) => {
    if (topic === DISTANCE) {
      const messageString = message.toString();
      const devicename = DISTANCE; 
      const distance = parseDistance(messageString);
  
      // Tìm thiết bị dựa trên tên
      const device = await Device.findOne({ name: devicename });
  
      console.log(`device ${devicename}`);
      
      if (device) {
        if (distance === 1) {
          Device.updateOne(
            { _id: device._id },
            { $set: { type: 'there are people moving'}}
          )
          .then(() => {
            console.log('Cập nhật thành công:', );
          })
          .catch(() => {
            console.error('Lỗi khi cập nhật:');
          });
        } else if (distance === 0) {
          Device.updateOne(
            { _id: device._id },
            { $set: { type: 'no one moving' }}
            
          )
          .then(() => {
            console.log('Cập nhật thành công:');
          })
          .catch(() => {
            console.error('Lỗi khi cập nhật:');
          });
          
        }
      }
      
      console.log(` distance ${distance}`);
    }
  });
  client.on('message', async (topic, message) => {
    if (topic === FLAME) {
      const messageString = message.toString();
      const devicename = FLAME; 
      const flame = parseDistance(messageString);
  
      // Tìm thiết bị dựa trên tên
      const device = await Device.findOne({ name: devicename });
  
      console.log(`device ${devicename}`);
      
      if (device) {
        if (flame === 1) {
          Device.updateOne(
            { _id: device._id },
            { $set: { type: 'flame'}}
          )
          .then(() => {
            console.log('update success', );
          })
          .catch(() => {
            console.error('error update');
          });
        } else if (flame === 0) {
          Device.updateOne(
            { _id: device._id },
            { $set: { type: 'no flame' }}
            
          )
          .then(() => {
            console.log('update success');
          })
          .catch(() => {
            console.error('error flame');
          });
          
        }
      }
      console.log(` FLAME ${flame}`);
    }
  });
  client.on('message', async (topic, message) => {
    if (topic === MANUALLY) {
      const messageString = message.toString();
      const devicename = MANUALLY; 
      const manually = parseDistance(messageString);
  
      // Tìm thiết bị dựa trên tên
      const device = await Device.findOne({ name: devicename });
      console.log(`this is device ${device.name}`);
      
      if (device) {
        if (manually === 1) {
          Device.updateOne(
            { _id: device._id },
            { $set: { type: 'auto', status: true}}
          )
          .then(() => {
            console.log('update success', );
          })
          .catch(() => {
            console.error('error update');
          });
        } else if (manually === 0) {
          Device.updateOne(
            { _id: device._id },
            { $set: { type: 'manually',status: false }}
            
          )
          .then(() => {
            console.log('update success');
          })
          .catch(() => {
            console.error('auto');
          });
          
        }
      }
      console.log(` manually ${manually}`);
    }
  });
  client.on('message', async (topic, message) => {
    if (topic === PAN) {
      const messageString = message.toString();
      const devicename = PAN; 
      const pan = parseDistance(messageString);
  
      // Tìm thiết bị dựa trên tên
      const device = await Device.findOne({ name: devicename });
  
      console.log(`device ${devicename}`);
      
      if (device) {
        if (pan === 1) {
          Device.updateOne(
            { _id: device._id },
            { $set: { type: 'turn', status: true}}
          )
          .then(() => {
            console.log('update success', );
          })
          .catch(() => {
            console.error('error update');
          });
        } else if (pan === 0) {
          Device.updateOne(
            { _id: device._id },
            { $set: { type: 'off',status: false }}
            
          )
          .then(() => {
            console.log('update success');
          })
          .catch(() => {
            console.error('auto');
          });
          
        }
      }
      console.log(` pan ${pan}`);
    }
  });
  client.on('message', async (topic, message) => {
    if (topic === LED) {
      const messageString = message.toString();
      const devicename = LED; 
      const led = parseDistance(messageString);
      
      // Tìm thiết bị dựa trên tên
      const device = await Device.findOne({ name: devicename });
      console.log(`device ${devicename}`);
      if (device) {
        if (led === 1) {
          Device.updateOne(
            { _id: device._id },
            { $set: { type: 'turn', status: true}}
          )
          .then(() => {
            console.log('update success', );
          })
          .catch(() => {
            console.error('error update');
          });
        } else if (led === 0) {
          Device.updateOne(
            { _id: device._id },
            { $set: { type: 'off',status: false }}
            
          )
          .then(() => {
            console.log('update success');
          })
          .catch(() => {
            console.error('auto');
          });
          
        }
      }
      console.log(` led ${led}`);
    }
  });
}
function parseDistance(message) {
  if (message.toString() === '1') {
    return 1;
  }

  return 0;

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
