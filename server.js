const express = require('express');
const sequelize = require('./dbConfig');
const app = express();
const router = require('./route/userRoute');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use('/', router);
app.listen(4000, async () => {
  console.log(`Server is running`);
  try {
    //Test the database connection
    await sequelize.authenticate();
    await sequelize.sync();
    console.log(
      'Connection to the database has been established successfully.'
    );
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
