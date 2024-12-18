import { Router } from "express";

import login from "../controller/login";


const authRoutes = (db) => {
  const router = Router();
  // router.post("/signup", createUser(db)); // Pass the db object
  router.post("/login", login(db));       // Pass the db object if login requires db
  router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  });

  return router;
};

export default authRoutes;
