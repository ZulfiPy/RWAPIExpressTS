const mongoose = require('mongoose');

let connected = false;

const dbConn = async () => {
    mongoose.set('strictQuery', true);

    if (connected) {
        console.log('MongoDB is already connected.');
        return connected;
    }

    const mongoDBURI = process.env.MONGODB_URI as string;

    // Connect to MongoDB
    try {
        await mongoose.connect(mongoDBURI);
        connected = true;
        console.log('MongoDB connected...');
    } catch (error) {
        console.log('error while connecting to the MongoDB', error);
    }
    return connected;
}

export default dbConn;