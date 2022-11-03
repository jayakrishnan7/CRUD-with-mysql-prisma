import express from "express";

import {
  createPerson,
  deletePerson,
  allUsers,
  updateUser,
} from "../controllers/users";

const router = express.Router();

router.post("/register", createPerson);

router.put("/updateUser/:id", updateUser);

router.delete("/delete/:id", deletePerson);

router.get("/", allUsers);

export { router };
