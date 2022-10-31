import express from "express";
import fs from "fs";
// import execQuery from "../config/db";

import {
  createPerson,
  deletePerson,
  searchUsers,
  exportUsers,
  allUsers,
  updateUser,
  uploadFiles,
} from "../controllers/users";

const router = express.Router();

router.post("/register", createPerson);

router.put("/updateUser/:id", updateUser);
// router.put("/updateUser/:id", updateUser);

router.delete("/delete/:id", deletePerson);

router.post("/search", searchUsers);

router.get("/downloadExcel", exportUsers);

// multer api for file uploading    ........................................................

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    // const dir = "../uploads";
    // if (!fs.existsSync(dir)){
    //   fs.mkdirSync(dir);
    // }
    console.log("path: ", path.join(dir));

    cb(null, path.join(dir));
  },

  filename: (req: any, file: any, cb: any) => {
    // console.log('aaaaaaaaaaa', file);
    cb(null, file.originalname);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  // if (
  //   file.mimetype === "image/jpg" ||
  //   file.mimetype === "image/jpeg" ||
  //   //  file.mimetype ==="image/pdf"  ||
  //   file.mimetype === "image/png"
  // ) {
  //   cb(null, true);
  // )

  const ext = path.extname(file.originalname);
  const allowed = [".png", ".jpg", ".jpeg",".svg", ".gif", ".webp", ".csv",".pdf" ];
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Image uploaded is not of type png/jpg/jpeg/svg/gif/webp/csv or pdf"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
router.post("/uploadFile", upload.array("profiles", 5), uploadFiles);

// multer api for file uploading finished   ........................................................

router.get("/", allUsers);

export { router };
