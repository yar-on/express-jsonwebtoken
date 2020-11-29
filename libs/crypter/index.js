'use strict';
const crypto = require('crypto');
const Helpers = require('../helpers');

const IV_LENGTH = 16; // For AES, this is always 16

const getAvailableAlgorithm = () => {
    const cryptoList = crypto.getCiphers();
    const supportedCiphers = {
        'aes-256-cbc': {
            iv: 16,
        },
    };
    const ciphers = {};

    const matches = Helpers.matchArraysValues(cryptoList, Object.keys(supportedCiphers));

    for (let key of matches) {
        if (supportedCiphers[key]) {
            ciphers[key] = supportedCiphers[key];
        }
    }
    return ciphers;
};

const availableAlgorithm = getAvailableAlgorithm();

module.exports = class Crypter {
    static encrypt(algorithm, text, key) {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encrypted = cipher.update(text);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    static decrypt(algorithm, text, key) {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }
};