const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './.env' }); //& { $env:NODE_ENV = "development"; nodemon server.js }

const app = require('./app');

const DB = 'mongodb://127.0.0.1:27017/tour_booking_app';



// mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
mongoose.connect(DB).then(() => {
  const port = process.env.PORT || 3000;

  const server = app.listen(port, () =>
    console.log(`App running on port http://localhost:${port}...`)
  );

  process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
});
