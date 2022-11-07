import jwt from 'jsonwebtoken';


// let jwtSecretString: string = process.env.JWT_ACCESS_SECRET as string;
let accessTokenValidity: string = "5m";

function jwtTokenGenerator(payload: any, expiresIn: string): string {
    return jwt.sign(payload as Object, `${process.env.JWT_ACCESS_SECRET}`, { expiresIn: expiresIn } as Object);
}

export const getAccessToken = (payload: any): Promise<string> => {
    
    return new Promise((resolve, reject) => {

        if (payload.hasOwnProperty('email')) {
            
            resolve(jwtTokenGenerator(payload, accessTokenValidity));
        } else {
            reject("Error Occured");
        }

    })
}
