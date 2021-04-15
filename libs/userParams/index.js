const Helpers = require('../helpers');
const JwtExpressError = require('../jwt/errors/index');

const DEFAULT_PARAMS = {
    jwt: {
        options: {
            algorithm: 'HS256',
            expiresIn: '5m',
            // notBefore: undefined,
            // audience: undefined,
            // issuer: undefined,
            // jwtid: undefined,
            // subject: undefined,
            // noTimestamp: undefined,
            // header: undefined,
            // keyid: undefined,
            // mutatePayload: false
        },
        secret: null,
        useEncrypt: false,
        useBlacklist: false,
        getToken: (req) => {
            const authorizationHeader = req.header('authorization')
            if (authorizationHeader && typeof authorizationHeader === "string") {
                const parts = authorizationHeader.split(' ');
                if (parts.length === 2) {
                    const scheme = parts[0];
                    const token = parts[1];

                    if (scheme === "Bearer") {
                        return token;
                    } else {
                        throw new JwtExpressError(JwtExpressError.ErrorCodes.INVALID_TOKEN_SCHEMA);
                    }
                } else {
                    throw new JwtExpressError(JwtExpressError.ErrorCodes.INVALID_TOKEN);
                }
            } else if (req.query.token) {
                return req.query.token;
            } else {
                throw new JwtExpressError(JwtExpressError.ErrorCodes.MISSING_TOKEN);
            }
        },
        middleware: {
            tokenPayloadKey: 'user',
        },
        blacklist: {
            driverName: 'memory',
            driverParams: {
                clearExpiredItemsInterval: '5m',
                clearExpiredItemsIntervalDelay: null,
            },
            customInstance: null,
        },
        refresh: {
            options: {
                algorithm: 'HS256',
                expiresIn: '7d',
                // notBefore: undefined,
                // audience: undefined,
                // issuer: undefined,
                // jwtid: undefined,
                // subject: undefined,
                // noTimestamp: undefined,
                // header: undefined,
                // keyid: undefined,
                // mutatePayload: false
            },
            getToken: (req) => {
                const refreshToken = req.header('refresh-token');
                if (refreshToken && typeof refreshToken === "string") {
                    const parts = refreshToken.split(' ');
                    if (parts.length === 2) {
                        const scheme = parts[0];
                        const token = parts[1];

                        if (scheme === "Bearer") {
                            return token;
                        } else {
                            throw new JwtExpressError(JwtExpressError.ErrorCodes.INVALID_TOKEN_SCHEMA);
                        }
                    } else {
                        throw new JwtExpressError(JwtExpressError.ErrorCodes.INVALID_TOKEN);
                    }
                } else if (req.query.token) {
                    return req.query.token
                } else {
                    throw new JwtExpressError(JwtExpressError.ErrorCodes.MISSING_TOKEN);
                }
            },
        },
    },
    encryption: {
        algorithm: 'aes-256-cbc',
    },
    localization: {
        responses: require('../localization/en/responses'),
    },
};

module.exports = class UserParams {
    constructor(params) {
        const tmpUserParams = Helpers.deepMerge(DEFAULT_PARAMS, params);
        this.validate(tmpUserParams);
        this.userParams = tmpUserParams;
    }

    get(key) {
        return Helpers.getProperty(this.userParams, key);
    }

    // static set(key, value) {
    //     if (key && typeof key === "string") {
    //         let keyArr = key.split('.');
    //         let val = this.userParams;
    //         let keyCount = keyArr.length;
    //         for (let i = 0; i < keyCount - 1; i++) {
    //             val = val[keyArr[i]];
    //             if (val === undefined || val === null) {
    //                 val = {};
    //             }
    //             if (!(val instanceof Object)) {
    //                 throw new Error(`${keyArr.slice(0, i + 1).join('.')} is not an object (actual type ${typeof val})`);
    //             }
    //         }
    //         val[keyArr[keyCount - 1]] = value;
    //     }
    // }

    validate(tmpUserParams) {
        if (Helpers.getProperty(tmpUserParams, 'encryption.secret') !== undefined) {
            if (typeof Helpers.getProperty(tmpUserParams, 'encryption.secret') !== "string") {
                throw new Error("encryption.secret must be string type");
            } else if (Helpers.getProperty(tmpUserParams, 'encryption.secret').length !== 32) {
                throw new Error("encryption.secret length must contains 32 characters");
            }
        }
        // console.log(tmpUserParams);
    }
};
