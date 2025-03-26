import { connect } from "mongoose";

async function dbConnect() {
  try {
    await connect(process.env.LINK_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" Connected to MongoDB");
  } catch (error) {
    console.error(" Error to connect to MongoDB:", error.message);
  }
}

export default dbConnect;

