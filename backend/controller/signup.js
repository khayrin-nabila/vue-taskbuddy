import { createSecretToken } from "../tokenGeneration/generateToken.js";
import { hash } from "bcrypt";

const createUser = (db) => async (req, res) => {
  try {
    const usersCollection = db.collection("users");

    // Check for required fields
    if (
      !(
        req.body.email &&
        req.body.password &&
        req.body.name &&
        req.body.username
      )
    ) {
      return res.status(400).send("All input is required");
    }

    // Check if user already exists
    const oldUser = await usersCollection.findOne({ email: req.body.email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    // Hash the password
    const salt = 10;
    const hashedPassword = await hash(req.body.password, salt);

    // Create a new user object
    const newUser = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };

    // Insert the new user into the database
    const result = await usersCollection.insertOne(newUser);

    // Generate JWT token
    const token = createSecretToken(result.insertedId);

    // Set the cookie with the token
    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 86400000), // 1 day expiry
      secure: true, // HTTPS only
      httpOnly: true, // Prevent client-side access
      sameSite: "None",
    });

    console.log("Cookie set successfully");

    // Respond with the new user data (excluding the password for security)
    res.json({ id: result.insertedId, name: newUser.name, username: newUser.username, email: newUser.email });
  } catch (error) {
    console.error("Got an error", error);
    res.status(500).send("Internal Server Error");
  }
};

export default createUser;
