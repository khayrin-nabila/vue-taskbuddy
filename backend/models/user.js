import { Schema, model } from "mongoose";

// Define schema
const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Export model with capitalized variable name
const User = model("User", userSchema);
export default User;
