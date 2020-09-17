import express from "express";

import bodyParser from "body-parser";
import {decryptToken, makeRandomSalt, makeToken, seedCrypto} from "./cryptoToken";

const authEndpoint = express.Router();

const seed = seedCrypto(makeRandomSalt());

const makePayload = (username, password) => {
    return {
        username: username ?? '',
        password: password ?? '',
    }
}
authEndpoint.post('/',bodyParser.json(), (req, res) => {
    let jsonPayload = makePayload(req.body['user'],req.body['pass']);

    const token = makeToken(seed,
        jsonPayload)

    res.status(200).end(token);
})

authEndpoint.post('/decrypt',bodyParser.json(), (req, res) => {
    try {
        const result = decryptToken(seed, req.body['token'] ?? '')
        res.status(200).end(JSON.stringify(result));
    } catch(e) {
        console.log(e);
        res.status(401).end();
    }
})


export default authEndpoint;
