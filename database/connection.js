const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/twittx');
    } catch (error) {
        throw new Error('Error connecting to database');
    }     
}


module.exports = connection;