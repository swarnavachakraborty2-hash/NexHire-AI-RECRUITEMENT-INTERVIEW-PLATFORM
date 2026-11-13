import mongoose from 'mongoose';


const connectDB = async () => {
    try {
        const connected = await mongoose.connect('')
        console.log(`MongoDB connected: ${connected.connection.host}`);
    }catch (err) {
        console.log("database connection error: ", err.message);
    }
}


export default connectDB;
