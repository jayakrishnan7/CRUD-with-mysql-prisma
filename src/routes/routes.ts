import express from "express";

import {
  createPerson,
  deletePerson,
  allUsers,
  updateUser,
  loginUser,
  htmlToPdfConversion,
} from "../controllers/users";

import { validateToken, getSessionInfo } from "../middlewares/auth";

const router = express.Router();

router.post("/register", createPerson);

router.put("/updateUser", validateToken, getSessionInfo, updateUser);

router.delete("/delete/:id", validateToken, getSessionInfo, deletePerson);

router.get("/htmlToPdf", htmlToPdfConversion);

router.post("/login", loginUser);

router.get("/", validateToken, getSessionInfo, allUsers);

export { router };
