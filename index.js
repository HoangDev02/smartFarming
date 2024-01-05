const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
var cors = require('cors');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override')

const dotenv = require('dotenv');
const {connect} = require('./api/cli/publisher')
const {subscriber} = require('./api/cli/subscriber');

const deviceRouter = require('./api/routes/deviceRouter');

const port = 3100;
dotenv.config();
const fs = require('fs'); // Thêm module này
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));

//change text in jason
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(methodOverride('_method'))
app.use(morgan('combined'))


// app.use('/api/room', roomsRoutes)
app.use('/api/devices', deviceRouter);

server.listen(port, () => {
  subscriber();
  connect();
  console.log(`Example app listening on port ${port}`);
});
