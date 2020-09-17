import crypto from 'crypto';
import b64url from 'base64-url';

const PADDING_SIZE = 256;

const makeIv = () => crypto.randomBytes(16);
const makeKey = (salt: string) => crypto.createHash('sha256').update(salt).digest();

const encrypt = (key, data) => {
    const iv = makeIv();
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
    return [cipher.update(Buffer.from(JSON.stringify(data)).toString('base64'), 'utf8', 'base64') +
        cipher.final('base64'), iv.toString('base64')];
}

const decrypt = (key, iv, data) => {
    const cipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
    return Buffer.from(cipher.update(data,'base64', 'utf8') + cipher.final('utf8'), 'base64').toString();
}

export const makeRandomSalt = () => crypto.randomBytes(16).toString('base64');

export const seedCrypto = (salt?) => {
    return makeKey(salt ?? 'default');
}

const unpadToken = (jsonPayload) => {
    return jsonPayload.data;
}

export const decryptToken = (seed, token) : { user: string, pass: string} => {
    const dataAndIv = b64url.decode(token).split(':');
    const key = seed
    const data = dataAndIv[0];
    const iv = Buffer.from(dataAndIv[1],'base64');
    const jsonPayload = JSON.parse(decrypt(key, iv, data));

    return unpadToken(jsonPayload);
}

const padToken = (jsonToken, padding) => {
    const t = JSON.stringify(jsonToken);
    if(t.length > padding) {
        throw 'token too large';
    }
    return { data: jsonToken,
             padding: new Array(padding-t.length).fill('?').join('')
           };
}

export const makeToken = (seed, jsonPayload) => {
    const key = seed;
    const token = encrypt(key,padToken(jsonPayload, PADDING_SIZE));

    return b64url.encode(token[0]+':'+token[1]);
}
