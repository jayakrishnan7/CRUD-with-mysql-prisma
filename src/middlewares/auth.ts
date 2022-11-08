
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecretString: string = process.env.JWT_ACCESS_SECRET!;



export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | null = req.headers.authorization!;

    if (!token || !token.startsWith('Bearer')) {
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
                result: []
            };
            res.send(result);
        }
    }

}

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext' ;


export const getSessionInfo = async (req: Request, res: Response, next: NextFunction) => {
   
    try {
        let token: string | null = req.headers.authorization!;
    
        function parseJwt (token: any) {
            return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        }

        const decodedToken = parseJwt(token)   

        console.log('deeeeeeeee', decodedToken);



        
        next();
        
    } catch (error) {
        console.log(error);
        res.send("Access token invalid or expired!");        
    }

}                              