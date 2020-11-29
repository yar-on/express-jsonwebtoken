const JwtExpressBlacklistDriverBase = require('../base');
const Helpers = require('../../../helpers');

module.exports = class JwtExpressBlacklistDriverMemory extends JwtExpressBlacklistDriverBase {
    constructor() {
        super();
        this._blacklist = {};
        this._clearOldStarts = false;
    }

    isExists(token) {
        return this._blacklist.hasOwnProperty(token);
    }

    set(token, expiredTime) {
        this._blacklist[token] = expiredTime;
    }

    clearOld() {
        if (!this._clearOldStarts) {
            this._clearOldStarts = true;
            try {
                const blacklist = Object.assign({}, this._blacklist);
                const deleteList = [];

                for (const key in blacklist) {
                    if (blacklist.hasOwnProperty(key) && Helpers.timePast(blacklist[key])) {
                        deleteList.push(key);
                    }
                }

                deleteList.map((key) => {
                    delete this._blacklist[key];
                });
            } catch (e) {
                console.error(e);
            }
            this._clearOldStarts = false;
        }
    }

};