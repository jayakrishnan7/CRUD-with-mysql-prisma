import express from "express";

import {
  createPerson,
  deletePerson,
  allUsers,
  updateUser,
  loginUser,
} from "../controllers/users";

const router = express.Router();

router.post("/register", createPerson);

router.put("/updateUser/:id", updateUser);

router.delete("/delete/:id", deletePerson);

router.post("/login", loginUser)

router.get("/", allUsers);


export { router };
