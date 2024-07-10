import mongoose from 'mongoose';
const url = "mongodb://localhost:27017/mongooseauth";
try {
    mongoose.connect(url);
}
catch (error) {
    console.error(error);
}
export default mongoose;
