import express from "express";
import authEndpoint from "./auth";
import cookieParser from "cookie-parser";
import crypto from 'crypto';

export const app = express();
const port = 8080;

app.use(cookieParser(crypto.randomBytes(16).toString('base64')));

app.get( "/", ( req, res ) => {;
    res.status(200).end('hello');
} );

app.use('/auth', authEndpoint);

app.listen( 8080, () => {
    console.log( `server started at http://localhost:${ port }` );
} );