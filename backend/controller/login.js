import { compare } from "bcrypt";

import { config } from "dotenv";
import { createSecretToken } from "../tokenGeneration/generateToken.js";

config();

const login = (db) => async (req, res) => {
  const usersCollection = db.collection("users");
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).json({ message: "All input is required" });
  }
  const user = await usersCollection.findOne({ email });
  if (!(user && (await compare(password, user.password)))) {
    return res.status(404).json({ message: "Invalid credentials" });
  }
  const token = createSecretToken(user._id);
  res.cookie("token", token, {
    path: "/", // Cookie is accessible from all paths
    expires: new Date(Date.now() + 86400000), // Cookie expires in 1 day
    secure: true, // Cookie will only be sent over HTTPS
    httpOnly: true, // Cookie cannot be accessed via client-side scripts
    sameSite: "None",
  });

  res.json({ token, user: { name: user.name } });
};
export default login;