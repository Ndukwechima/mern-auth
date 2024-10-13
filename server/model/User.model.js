import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "username is required"],
    unique: [true, "username already exists"],
  },

  password: {
    type: String,
    required: [true, "password is required"],
    unique: false,
  },

  email: {
    type: String,
    required: [true, "provide a unique and valid email"],
    unique: true,
  },

  firstName: { type: String },
  lastName: { type: String },
  mobile: { type: Number },
  address: { type: String },
  profile: { type: String },
});

export default mongoose.model.Users || mongoose.model("User", UserSchema);
