const fs = require('fs');

const userParams = require('../../userParams');
const BaseDriver = require('./base');
const MemoryDriver = require('./memory');
const validateDriver = (driver) => {
    return driver instanceof BaseDriver;
};

let currDriver = null;

module.exports = class BlacklistManager {
    /**
     *
     * @param params
     * @returns {module.JwtExpressBlacklistDriverBase}
     */
    static getDriver(params) {
        if (currDriver != null) {
            return currDriver;
        }
        let driver = null;
        if (validateDriver(userParams.get('jwt.blacklist.customInstance'))) {
            driver = userParams.get('jwt.blacklist.customInstance');
        } else {
            const driverName = userParams.get('jwt.blacklist.driverName');
            if (fs.existsSync(`./${driverName}/index.js`)) {
                const tmpDriverClass = require(`./${driverName}/index.js`);
                const driver = new tmpDriverClass(params);
            }
        }

        if (!validateDriver(driver)) {
            console.warn('express-jsonwebtoken: invalid blacklist driver, used memory as fallback');
            driver = new MemoryDriver(params);
        }

        currDriver = driver;
        return driver;
    }
};