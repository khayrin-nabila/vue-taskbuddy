import dotenv from "dotenv";
import pkg from "jsonwebtoken";

dotenv.config();

const { sign } = pkg; // Extract the `sign` function from `jsonwebtoken`

export function createSecretToken(id) {
  return sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
}
