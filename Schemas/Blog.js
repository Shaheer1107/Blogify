import mongoose from "mongoose"

const {Schema} = mongoose;

const BlogSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: "User"}
});

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog