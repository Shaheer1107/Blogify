import mongoose from "mongoose"

const {Schema} = mongoose;

const ContactScheme = new Schema({
    name: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    subject: {type: String, required: true},
    message: {type: String, required: true}
});

const Contact = mongoose.model("Contact", ContactScheme);

export default Contact