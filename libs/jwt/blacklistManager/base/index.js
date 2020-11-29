const ms = require('ms');
const userParams = require('../../../userParams');
const defaultTime = 1800000;

module.exports = class JwtExpressBlacklistDriverBase {
    /**
     * Base blacklist driver params
     * @typedef {Object} JwtExpressBlacklistDriverBaseParams
     * @property {boolean|null|undefined} bypassClockInit
     */

    /**
     *
     * @param {JwtExpressBlacklistDriverBaseParams} params
     */
    constructor(params = {}) {
        if (!params instanceof Object) {
            params = {};
        }

        if (params.bypassClockInit !== true) {
            const time = ms(userParams.get(this.userParamsKeys.intervalDelay) || userParams.get(this.userParamsKeys.intervalTime) || defaultTime) || defaultTime;
            setTimeout(this.clearOld, time);
        }
    }

    get userParamsKeys() {
        return {
            intervalTime: 'jwt.blacklist.driverParams.clearExpiredItemsInterval',
            intervalDelay: 'jwt.blacklist.driverParams.clearExpiredItemsIntervalDelay',
        }
    }

    clockHandler() {
        this.clearOld();
        const time = ms(userParams.get(this.userParamsKeys.intervalTime) || defaultTime) || defaultTime;
        setTimeout(this.clearOld, time);
    }

    isExists(token) {
        throw new Error('unimplemented isExists function');
    }

    set(token, expiredTime) {
        throw new Error('unimplemented set function');
    }

    clearOld() {
        throw new Error('unimplemented clearOld function');
    }
};