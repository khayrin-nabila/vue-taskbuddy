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

  if (!user) {
    return res.status(404).json({ message: "Email not found" });
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  const token = createSecretToken(user._id);
  res.cookie("token", token, {
    path: "/",
    expires: new Date(Date.now() + 86400000),
    secure: true,
    httpOnly: true,
    sameSite: "None",
  });

  res.json({ token, user: { name: user.name } });
};

export default login;
