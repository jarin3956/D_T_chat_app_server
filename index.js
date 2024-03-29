const express = require('express');
const port = require('./config/serverConnect');
const connectDB = require('./config/dbConnection');
const user_route = require('./Routes/userRoute');
const cors = require('cors');
const app = express();
const { initializeSocket } = require('./Socket/Socket')

connectDB();
require('dotenv').config()

app.use(express.json());
app.use(cors());

app.use('/', user_route);

const server = app.listen(port, () => {
    console.log(`server running @ port ${port}`);
});

initializeSocket(server)