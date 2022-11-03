import { Request, Response } from "express";

import mysql from "mysql";
// import execQuery from "../config/db";

//importing crypto module to generate random binary data
import CryptoJS from "crypto-js";

// var cron = require('node-cron');
import cron from "node-cron";

// date formatting..........
import moment from "moment";

// send files to mail.........
import nodemailer from "nodemailer";

//creating excel file........
import xlsx from "xlsx";

// creating unique id........
import { v4 } from "uuid";

// multer for file uploads....
import multer from "multer";

const excelJS = require("exceljs");
// import * as excelJS from 'exceljs'
// import excel from 'exceljs';

import { PrismaClient } from "@prisma/client";
const { user } = new PrismaClient();

// .......  user  sign up   ....................
const createPerson = async (req: Request, res: Response) => {
  try {
    type createPersonInput = {
      username: string;
      classNumber: string;
      email: string;
      password: string;
      phone: string;
      dob: Date;
      photo: string;
      isDeleted: boolean;
    };
    const {
      username,
      classNumber,
      email,
      password,
      phone,
      dob,
      photo,
      isDeleted,
    }: createPersonInput = req.body;

    console.log("rr", req.body);

    const userExists = await user.findFirst({
      where: {
        email,
      },
    });

    if (userExists) {
      res.status(400).json({ message: "user already exists" });
    }

    const newUser = await user.create({
      data: {
        username,
        classNumber,
        email,
        password,
        phone,
        dob,
        photo,
        isDeleted,
      },
    });

    console.log("NewUser registered", newUser);

    res.json(newUser);

    // const { name, classNumber, email, password, phone, dob, photo, isDeleted } =
    //   req.body;
    // const pswd = req.body.password;
    // // console.log('greattttttttt......', req.body);
    // // ...........................................password.encrypting............................................
    // var ciphertext = CryptoJS.AES.encrypt(pswd, "crud secret 763").toString();
    // console.log("encrypted text ....... cipherrrrrr", ciphertext);
    // const dateIn = req.body.dob;
    // const newDate = moment.utc(dateIn, "DD/MM/YYYY").toDate();
    // moment().format();
    // // console.log('newwwwwwwwww', newDate);
    // const userData = {
    //   name: req.body.name,
    //   classNumber: req.body.classNumber,
    //   email: req.body.email,
    //   password: ciphertext,
    //   phone: req.body.phone,
    //   dob: newDate,
    //   photo: req.body.photo,
    //   isDeleted: req.body.isDeleted,
    // };
    // // console.log('boddddd...............', name);
    // const checkUsername = `Select name FROM students WHERE name = ${req.body.name}`;
    // // execQuery(checkUsername, [])
    // // console.log('res..........',execQuery.toString());
    // // pool.query(checkUsername, [name], (err, result, fields) => {
    // //   // console.log('rrrrrrrrrrrrrrrrr', result?.length);
    // //   if (!result?.length) {
    // //     // console.log("its a chance..........");
    // //     const sql = `Insert Into students (
    // //       name,
    // //       classNumber,
    // //       email,
    // //       password,
    // //       phone,
    // //       dob,
    // //       photo,
    // //       isDeleted
    // //       ) VALUES ( ?, ?, ?,  ?, ?, ?, ?,  ? )`;
    // //     pool.query(
    // //       sql,
    // //       [
    // //         userData.name,
    // //         userData.classNumber,
    // //         userData.email,
    // //         userData.password,
    // //         userData.phone,
    // //         userData.dob,
    // //         userData.photo,
    // //         userData.isDeleted,
    // //       ],
    // //       (err, result, fields) => {
    // //         if (err) {
    // //           res.send({ status: 0, data: err });
    // //         } else {
    // //           // result.forEach((element: any) => {
    // //           //   if(element.constructor == Array) {
    // //           //     res.send('Inserted student id:  ' + element[0].id)
    // //           //   }
    // //           // })
    // //           res.send({ status: 1, data: result });
    // //         }
    // //       }
    // //     );
    // //   }
    // //   // ...........................................password.decrypting.....................................................
    // //   const decryptUser = userData.password;
    // //   // console.log('deccccccrypt userrr', decryptUser);
    // //   var bytes = CryptoJS.AES.decrypt(decryptUser, "crud secret 763");
    // //   var originalText = bytes.toString(CryptoJS.enc.Utf8);
    // //   console.log("decrypted password..........", originalText);
    // //   // ------------------------------------------------------------------------------------------------------------------
    // // });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

// ....... all users fetching................................................................
const allUsers = async (req: Request, res: Response) => {
  // let skip = 0;
  // let limit = 10;
  try {
    const users = await user.findMany({
      select: {
        username: true,
        id: true,
        // posts: true
      },
    });

    // console.log('ussssssssssss', users);

    res.json(users);
  } catch (error) {
    res.json(error);
  }
};

// ....... edit user....................
const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log("uuuuuuuuu", typeof id);

    // const updatingUser = await user.update({
    //   where: {
    //     id
    //   },
    //   data: {
    //     username
    //   }
    // })

    res.json({
      message: "Updated successfully...",
      status: 1,
      // data: updatingUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Updation failed!!");
  }
};

// ....... delete user...................
const deletePerson = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    console.log("deeeelllllllll", id);

    // const deleteUser = await user.delete({
    //   where: {
    //     id,
    //   },
    // });

    res.json({
      message: "Deleted successfully...",
      status: 1,
      // data: deleteUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// ....... search users....................
const searchUsers = async (req: Request, res: Response) => {
  try {
    // let userData = req.body;

    let classNumber = req.body.classNumber;
    let searchText = req.body.searchText;

    // console.log('sssssssssssss', classNumber, searchText);

    // let skip = userData.skip || 0;
    // let limit = userData.limit || 10;

  } catch (error) {
    console.log("errorrrrrrr", error);
    res.status(500).send(error);
  }
};

// download excel file of users................................
const exportUsers = async (req: Request, res: Response) => {
  let fromDate: any = req.query.dobFrom;
  let lastDate: any = req.query.dobTo;

  // console.log("reeeeeeeeeeeeee.........", fromDate, lastDate);

  const fDate = moment.utc(fromDate, "YYYY/MM/DD").toDate();
  moment().format();

  const workbook = new excelJS.Workbook();

  const worksheet = workbook.addWorksheet("excelUsers");

  // const path = "../../public/assets/";

  // console.log("path addeddd...........", path);

  worksheet.columns = [
    { header: "S no.", key: "id", width: 10 },
    { header: "class no.", key: "classNumber", width: 10 },
    { header: "Name", key: "name", width: 10 },
    { header: "Email Id", key: "email", width: 10 },
    { header: "Phone", key: "phone", width: 10 },
    { header: "Date of Birth", key: "dob", width: 10 },
    { header: "delete status", key: "isDeleted", width: 10 },
  ];

  let counter = 1;

 
  //       if (Array.isArray(result)) {
  //         result.forEach((student) => {
  //           student.classNumber = counter;
  //           worksheet.addRow(student);
  //           counter++;
  //         });
  //       }

  //       worksheet.getRow(1).eachCell((cell: any) => {
  //         cell.font = { bold: true };
  //       });
  //     }

  //     try {
  //       // console.log('tryyyyyyyyyyyyy reached');

  //       async function excelFunction() {
  //         const data = await workbook.xlsx.writeFile(v4() + ".xlsx");

  //         const buffer = await workbook.xlsx.writeBuffer(
  //           "excelSheet of student " + fromDate + "-" + lastDate + ".xlsx"
  //         );

  //         // console.log('bbbbbbbbb', buffer);

  //         let mailTransporter = nodemailer.createTransport({
  //           service: "gmail",
  //           auth: {
  //             user: "jayakrishnan@scriptlanes.com",
  //             pass: "sivzgeycbgqpmsnz",
  //           },
  //         });

  //         let details = {
  //           from: "jayakrishnan@scriptlanes.com",
  //           to: "jayakrishnansfc43@gmail.com",
  //           subject: "Student details in Excel file",
  //           // text: "Testing out first sender"
  //           html: "Students details",
  //           attachments: [
  //             {
  //               buffer,
  //               content: buffer,
  //               contentType:
  //                 "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //             },
  //           ],
  //         };

  //         await mailTransporter.sendMail(details, (err: any) => {
  //           if (err) {
  //             console.log("There is an error ...", err);
  //           } else {
  //             console.log("email has sent!");
  //           }
  //         });

  //         res.send({
  //           status: "success",
  //           message: "file sent to mail successfully!",
  //           // path: `${path}/users.xlsx`,
  //         });
  //       }

  //       excelFunction();

  //     } catch (error) {
  //       res.send({
  //         status: "error",
  //         message: "Something went wrong",
  //       });
  //     }
  //   });
};

// cron jobs fn................................
// cron.schedule('*/3 */2 * * * *', () => {

//   const workbook = new excelJS.Workbook();

//   const worksheet = workbook.addWorksheet("excelUsers");
//   const data =  workbook.xlsx.writeFile(
//     v4()+".xlsx"
//   );
// });

// Uploading files using multer    ................................
const uploadFiles = async (req: Request, res: Response) => {
  try {
    // console.log('fffffffffff',req.file);
    console.log("bbbbbbbbbbbb", req.files);
    // res.json({ message: "Successfully uploaded files" });

    res.status(200).json({
      status: "success",
      message: "File created successfully!!",
    });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

export {
  allUsers,
  createPerson,
  updateUser,
  deletePerson,
  searchUsers,
  exportUsers,
  uploadFiles,
};
