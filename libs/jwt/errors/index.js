const errorCodes = require('./errorCodes');
module.exports = class JwtExpressError extends Error {
    constructor(errorCode, extra = {}) {
        super();
        if (errorCodes[errorCode]) {
            this._errorCode = errorCode;
        } else {
            this._errorCode = errorCodes.UNKNOWN_ERROR;
        }
        this._extra = (extra instanceof Object) ? extra : {};
    }

    get errorCode() {
        return this._errorCode;
    }

    get extraObject() {
        return this._extra;
    }

    static get ErrorCodes() {
        return errorCodes;
    }
};