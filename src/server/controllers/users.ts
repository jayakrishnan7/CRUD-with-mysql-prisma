import { Request, Response } from "express";
import UserModel from "../models/users";

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

// ....... all users fetching................................................................
const allUsers = async (req: Request, res: Response) => {
  // let skip = 0;
  // let limit = 10;

  const users = await user.findMany({
    select: {
      username: true,
      // posts: true
    },
  });

  // console.log('ussssssssssss', users);

  res.json(users);
};

// .......  user  sign up   ....................
const createPerson = async (req: Request, res: Response) => {
  try {

    const {username} = req.body;

    const userExists = await user.findUnique({
      where : {
        username
      }, 
      select: {
        username: true
      }
    });

    if(userExists) {

      res.status(400).json({message: "user already exists" })
    }

    const newUser = await user.create({
      data: {
        username
      }
    })

    console.log('NewUser registered', newUser);
    
    res.json(newUser)










    // console.log("rrrrrrrrrrr", req.body);
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
    console.log("errrrr", error);
    res.send({ status: 0, error: error });
  }
};

// ....... edit user....................
const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // console.log('uuuuuuuuu', id);

    // console.log("idsssssssss", req.body);

    // let student = req.body;

    // console.log('stttttttt', student);

    const { name, classNumber, email, password, phone, dob, photo, isDeleted } =
      req.body;

    // console.log('eeeeeeeeeeeeeee', email);

    // const userData = {
    //   name: req.body.name,
    //   classNumber: req.body.classNumber,
    //   email: req.body.email,
    //   password: req.body.password,
    //   phone: req.body.phone,
    //   dob: req.body.dob,
    //   photo: req.body.photo,
    //   isDeleted: req.body.isDeleted,
    // };

    // console.log('dddddddd', dob);
    // console.log('tttttt', typeof(dob));

    // const dateFormatting = moment.utc(dob, "DD/MM/YYYY").toDate();
    // const newDate = moment.utc(dateFormatting).format('DD/MM/YYYY');

    // var formatted = moment(dob).format("DD-MM-YYYY");
    var formatted = moment(dob).format("YYYY-MM-DD");

    console.log("newddddddd", formatted);
    console.log("tyyyyyyy", typeof formatted);

    const sql = `
    UPDATE students 
        SET name = "${name}", 
        classNumber = "${classNumber}",  
        email  = "${email}", 
        password  = "${password}", 
        phone  = "${phone}", 
        dob   = "${formatted}", 
        photo  = "${photo}", 
        isDeleted = "${isDeleted}"

        WHERE id = "${id}"
       `;

    // pool.query(
    //   sql,
    //   [name, classNumber, email, phone, dob, photo, isDeleted],
    //   (err, result, fields) => {
    //     if (err) {
    //       res.send({ status: 0, data: err });
    //     } else {
    //       // result.forEach((element: any) => {
    //       //   if(element.constructor == Array) {
    //       //     res.send('Inserted student id:  ' + element[0].id)
    //       //   }
    //       // })
    //       res.json({
    //         message: "Updated successfully...",
    //         status: 1,
    //         data: result,
    //       });
    //     }
    //   }
    // );
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

    const sql = `
      DELETE FROM students
      WHERE id = "${id}"`;

    // pool.query(sql, [id], (err, result, fields) => {
    //   if (err) {
    //     res.send({ status: 0, data: err });
    //   } else {
    //     res.json({
    //       message: "Deleted successfully...",
    //       status: 1,
    //       data: result,
    //     });
    //   }
    // });
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

    let sql =
      "SELECT * FROM students WHERE name LIKE '%" +
      searchText +
      "%' OR email LIKE '%" +
      searchText +
      "%' OR phone LIKE '%" +
      searchText +
      "%'";

    // pool.query(sql, function (error, result) {
    //   if (error) {
    //     console.log(error);
    //     res.send(error);
    //   } else {
    //     if (!result.length) {
    //       res.json({ message: "No students with this details!!!", result });
    //     } else {
    //       // console.log('search result......', result);
    //       res.json({ message: "search result of students", result });
    //     }
    //   }
    // });
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

  const sql = `SELECT * FROM students WHERE dob >= '${fromDate}' AND dob <= '${lastDate}'`;

  //   pool.query(sql, function (error, result) {
  //     if (error) {
  //       console.log(error);
  //       // res.send(error)
  //     } else {
  //       // console.log("rrrrrrrrrrrrrr", result);

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

// Uploading files with multer    ................................
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
