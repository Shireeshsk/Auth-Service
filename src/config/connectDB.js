import mongoose from 'mongoose'
export const connectDB = async ()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_LOCAL_URL)
        console.log("HostName : ",connect.connection.host)
        console.log("Database Name : ",connect.connection.name)
    } catch (error) {
        console.error(error)
        process.exit(0)
    }
}