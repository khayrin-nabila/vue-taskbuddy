import { createSecretToken } from "../tokenGeneration/generateToken.js";
import { hash } from "bcrypt";

const createUser = (db) => async (req, res) => {
  try {
    const usersCollection = db.collection("users");
    const { email, password, name } = req.body;

    if (!(email && password && name)) {
      return res.status(400).json({ message: "All input is required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const emailExists = await usersCollection.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = { name, email, password: hashedPassword, tourSeen: false};
    const result = await usersCollection.insertOne(newUser);

    const token = createSecretToken(result.insertedId);
    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 86400000),
      secure: true,
      httpOnly: true,
      sameSite: "None",
    });

    res.json({ id: result.insertedId, name, email });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default createUser;
