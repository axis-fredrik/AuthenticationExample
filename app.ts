import express from "express";
import authEndpoint from "./auth";
export const app = express();
const port = 8080;

app.get( "/", ( req, res ) => {;
    res.status(200).end('hello');
} );

app.use('/auth', authEndpoint);

// start the express server
app.listen( 8080, () => {
    console.log( `server started at http://localhost:${ port }` );
} );