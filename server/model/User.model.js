import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: [true, "username already exists"],
  },

  password: {
    type: String,
    required: [true, "password is required"],
    unique: false,
  },

  // email: {
  //   type: String,
  //   required: [true, "provide a unique and valid email"],
  //   unique: true,
  // },

  email: {
    type: String,
    required: [true, "provide a unique and valid email"],
    unique: [true, "Email already exists"],
    match: [/.+\@.+\..+/, "Please enter a valid email address"], // Regex for basic email validation
  },

  firstName: { type: String },
  lastName: { type: String },
  mobile: { type: Number },
  address: { type: String },
  profile: { type: String },
});

export default mongoose.model.Users || mongoose.model("User", UserSchema);
