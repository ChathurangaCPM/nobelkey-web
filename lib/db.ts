import mongoose, { Connection } from "mongoose";

let openedConnection: Connection | null = null;

const connectDB = async (): Promise<Connection> => {
    try {
        if (openedConnection) {
            console.log("returning open connection");
            return openedConnection;
        } else {
            const connection = await mongoose.connect(process.env.MONGODB_URI!);
            openedConnection = connection.connection;
            console.log('DB connected...');
            return openedConnection;
        }
    } catch (error: unknown) {
        console.log('error', error);
        console.log(`Could not connect to Mongoose. trying to connect to Mongoose ... `);
        return connectDB(); // Recursive call to retry connection
    }
};

export default connectDB;