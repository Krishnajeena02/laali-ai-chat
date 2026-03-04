import mongoose from 'mongoose';

 const connectDb = async ()=>{
    try{
       await mongoose.connect(process.env.MONGO_URL)
        console.log("dataBase connceted")

    }
    catch(error){
        console.log(error, "dataBase not connecting")
    }
}
export default connectDb;

