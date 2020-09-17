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

authEndpoint.get('/isAuthenticated', (req, res) => {
    try {
        //console.log(req.hostname,req.socket.localPort);

        const cookie = req.signedCookies['session'];
        const result = decryptToken(seed,cookie)

        console.log('Decrypted to', result);

        res.status(200).end();
    } catch(e) {
        res.status(401).end();
    }
});


authEndpoint.post('/',bodyParser.json(), (req, res) => {
    let jsonPayload = makePayload(req.body['user'],req.body['pass']);

    const token = makeToken(seed, jsonPayload)

    res.cookie('session', token, { httpOnly: true , signed: true, secure: req.protocol !== 'http'});

    res.status(200).end(token);
})


export default authEndpoint;
