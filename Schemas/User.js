import mongoose from "mongoose"

const {Schema} = mongoose;

const UserScheme = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

const User = mongoose.model("User", UserScheme);

export default User