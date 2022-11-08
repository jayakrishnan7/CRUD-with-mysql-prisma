import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { user } from "../controllers/users";

const jwtSecretString: string = process.env.JWT_ACCESS_SECRET!;

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | null = req.headers.authorization!;

  if (!token || !token.startsWith("Bearer")) {
    res.send("Unauthorized Access");
  } else {
    token = token.slice(7, token.length);
    if (token) {
      try {
        jwt.verify(token, jwtSecretString, function (error: any) {
          if (error) {
            res.send("Access token invalid or expired!");
          } else {
            next();
          }
        });
      } catch (err) {
        res.send("Access token invalid or expired!");
      }
    } else {
      let result: Object = {
        code: 401,
        message: `Authentication error. Access Token required.`,
        result: [],
      };
      res.send(result);
    }
  }
};

// import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
// import { request } from "http";

export const getSessionInfo = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string = req.headers.authorization!;

    const decodedToken = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    // req.sessionObj =  decodedToken

    console.log("deeeeeeeee", decodedToken);
    const email = decodedToken.email;

    const userDetails = await user.findFirst({
        where: {
            email
        }
    })

    console.log('detailsssssss', userDetails);

    const data = {
        id: userDetails?.id,
        username: userDetails?.username,
        classNumber: userDetails?.classNumber,
        email: userDetails?.email,
        phone: userDetails?.phone,
        dob: userDetails?.dob,
        isDeleted: userDetails?.isDeleted,

    }

    console.log('filtered data from token', data);
    
    req.sessionObj = data;

    next();
  } catch (error) {
    console.log(error);
    res.send("Access token invalid or expired!");
  }
};
