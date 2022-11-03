import { Request, Response } from "express";

//importing crypto module to generate random binary data
import CryptoJS from "crypto-js";

// date formatting..........
import moment from "moment";

import { PrismaClient } from "@prisma/client";
const { user } = new PrismaClient();

import * as dotenv from 'dotenv';
dotenv.config()

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

    // console.log("rr", req.body);

    const userExists = await user.findFirst({
      where: {
        email,
      },
    });

    if (userExists) {
      res.status(400).json({ message: "user already exists" });
    } else {
      // password encryption...........................
      let keysec = process.env.ENCRYPTION_KEY as string;
      var ciphertext = CryptoJS.AES.encrypt(
        password,
        keysec
      ).toString();
      console.log("encrypted text ....... cipherrrrrr", ciphertext);

      // date format changing from string to date.......
      const newDate = moment.utc(dob, "DD/MM/YYYY").toDate();
      // moment().format();
      // console.log('newwwwwwwwww', newDate);
      // console.log('newwwwwwwddddddddddddddw', typeof(newDate));

      const newUser = await user.create({
        data: {
          username,
          classNumber,
          email,
          password: ciphertext,
          phone,
          dob: newDate,
          photo,
          isDeleted,
        },
      });

      // console.log("NewUser registered");

      const createdUser = {
        data: {
          username,
          classNumber,
          email,
          phone,
          dob: newDate,
          photo,
          isDeleted,
        },
      };

      res.json({ message: "User created successfully", createdUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
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
        email: true,
        phone: true,
        dob: true,
        photo: true,
        isDeleted: true,
      },
    });

    const count = await user.aggregate({
      _count: {
        email: true
      },
    });

    const totalUsers = count._count.email;

    // console.log('ussssssssssss', count._count.email);
    res.json({ totalUsers, users });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

// ....... edit user....................
const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { username, classNumber, email, password, phone, dob, photo } = req.body;

    // console.log("qqqqqqqqq", req.body);

    const newId = parseInt(id);
    // console.log("uuuuuuuuu", typeof newId);

    const updatingUser = await user.update({
      where: {
        id: newId,
      },
      data: {
        username,
        classNumber,
        email,
        password,
        phone,
        dob,
        photo,
      },
    });

    res.json({
      message: "Updated successfully...",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Updation failed!!");
  }
};

// ....... permanant delete user...................
// const deletePerson = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;

//     const newId = parseInt(id);
//     // console.log("deeeelllllllll", newId);
//     // console.log("vvvvvvvv", typeof newId);

//     const deleteUser = await user.delete({
//       where: {
//         id: newId,
//       },
//     });

//     res.json({
//       message: "Deleted successfully...",
//     });
//   } catch (error) {
//     res.status(500).json({message: "User not exists", error});
//   }
// };

// ....... soft delete user...................
const deletePerson = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const newId = parseInt(id);
    // console.log("deeeelllllllll", newId);
    // console.log("vvvvvvvv", typeof newId);

    const userData = {
      isDeleted: true,
    };

    const deleteUser = await user.update({
      where: {
        id: newId,
      },
      data: userData,
    });

    res.json({
      message: `Deleted ${newId} successfully...`,
    });
  } catch (error) {
    res.status(500).json({ message: "User not exists", error });
  }
};


export {
  allUsers,
  createPerson,
  updateUser,
  deletePerson,

};
