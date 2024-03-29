require('dotenv').config();
const {connect} = require('mongoose')

const connectDB = () => {
    const connstr = process.env.MONGO_URL;
    connect(connstr).then(() => {
        console.log('dB connected');
    }).catch((err) => {
        console.log('dB connection error',err);
    })
}

module.exports = connectDB
