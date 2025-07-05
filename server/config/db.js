const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGO_URI_PRODUCTION;
        if (!mongoUri) {
            console.warn("Warning: MONGO_URI_PRODUCTION environment variable is not defined. Using fallback MongoDB URI.");
            // Fallback MongoDB URI for local development or testing
            mongoUri = "mongodb://localhost:27017/socketDB";
        }
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection Error", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;