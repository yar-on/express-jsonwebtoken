const UserParams = require('./libs/userParams');
const Jwt = require('./libs/jwt');


module.exports = class JWTExpress {
    /**
     * Props Jwt options object properties
     * @typedef {Object} PropsJwtOptions
     * @property {String|null|undefined} algorithm
     * @property {String|Number|null|undefined} expiresIn
     * @property {String|null|undefined} notBefore
     * @property {String|null|undefined} audience
     * @property {String|Array<string>|null|undefined} issuer
     * @property {String|null|undefined} subject
     * @property {boolean|null|undefined} mutatePayload
     */

    /**
     * Props Jwt middleware object properties
     * @typedef {Object} PropsJwtMiddleware
     * @property {String|null|undefined} tokenPayloadKey
     */

    /**
     * Props Jwt blacklist object
     * @typedef {Object} PropsJwtBlacklist
     * @property {String} driverName
     * @property {PropsJwtBlacklistDriverParams|null|undefined} driverParams
     */

    /**
     * Props Jwt blacklist driver params
     * @typedef {Object} PropsJwtBlacklistDriverParams
     * @property {String|Number|null|undefined} clearExpiredItemsInterval
     * @property {String|Number|null|undefined} clearExpiredItemsIntervalDelay
     */

    /**
     * Props Jwt  object properties
     * @typedef {Object} PropsJwt
     * @property {PropsJwtOptions|undefined} options
     * @property {PropsJwtMiddleware|undefined} middleware
     * @property {PropsJwtBlacklist|undefined} blacklist
     * @property {String} secret
     * @property {Boolean} useEncrypt
     * @property {Boolean} useBlacklist
     * @property {Function} getToken
     */

    /**
     * Props Jwt  object properties
     * @typedef {Object} PropsEncrypt
     * @property {String|undefined} algorithm
     * @property {String} secret
     */

    /**
     * Props  object properties
     * @typedef {Object} Props
     * @property {PropsJwt} jwt
     * @property {PropsEncrypt} encryption
     */

    /**
     * Init Props by user params
     * @param {Props} params
     */
    constructor(params) {
        this.userParams = new UserParams(params);
        this.jwt = new Jwt(this.userParams);
    }

    /**
     * @param {*} payload
     * @param {Object} options
     * @param {jwtSignCallback} callback
     * @returns {null|string}
     */
    sign(payload, options = {}, callback = null) {
        if (!(options instanceof Object)) {
            options = {};
        }

        options = Object.assign({}, this.userParams.get('jwt.options'), options);
        return this.jwt.sign(payload, options, callback);
    }

    /**
     * @param {string} token
     * @param {Object} options
     * @param {jwtVerifyCallback} callback
     * @param {boolean} onlyPayload
     * @returns {null|string}
     */
    verify(token, options = {}, callback = null, onlyPayload = true) {
        if (!(options instanceof Object)) {
            options = {};
        }

        options = Object.assign({}, this.userParams.get('jwt.options'), options);
        return this.jwt.verify(token, options, callback, onlyPayload);
    }

    /**
     * @param {*} payload
     * @param {Object} options
     * @param {jwtSignCallback} callback
     * @returns {null|string}
     */
    signRefresh(payload, options = {}, callback = null) {
        if (!(options instanceof Object)) {
            options = {};
        }

        options = Object.assign({}, this.userParams.get('jwt.refresh.options'), options);
        return this.jwt.sign(payload, options, callback);
    }

    /**
     * @param {string} token
     * @param {Object} options
     * @param {jwtVerifyCallback} callback
     * @param {boolean} onlyPayload
     * @returns {null|string}
     */
    verifyRefresh(token, options = {}, callback = null, onlyPayload = true) {
        if (!(options instanceof Object)) {
            options = {};
        }

        options = Object.assign({}, this.userParams.get('jwt.refresh.options'), options);
        return this.jwt.verify(token, options, callback, onlyPayload);
    }

    middleware(options = {}) {
        return this.jwt.middleware(options);
    }

    middlewareRefreshToken(jwtOptions = {}, refreshOptions = {}) {
        return this.jwt.middlewareRefreshToken(jwtOptions, refreshOptions);
    }

    middlewareSignOut(options = {}) {
        return this.jwt.middlewareSignOut(options);
    }


};