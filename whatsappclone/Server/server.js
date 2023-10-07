const express = require("express");
const connectDB = require("./dbConnection");
const routes = require("./routes/routes");
const configureExpressApp = require("./config/index");
const app = express();
configureExpressApp(app);
const PORT = 3001;

const startServer = () => {
  
  Promise.all([connectDB()])
    .then(() => {
      routes(app);
      app.listen(PORT, () => {
        console.log(`Server started on Port ${PORT}`);
      });
    })
    .catch((error) => console.error(`Unable to start the server`, error));
};

startServer();
