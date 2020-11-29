module.exports = class Helpers {
    static matchArraysValues(arr1, arr2) {
        if (!(arr1 instanceof Array)) {
            throw new Error('matchArraysValues: First param not instance of array');
        }
        if (!(arr2 instanceof Array)) {
            throw new Error('matchArraysValues: Second param not instance of array');
        }
        return arr1.filter((item) => {
            return arr2.includes(item);
        })
    }

    static deepMerge(...sources) {
        let acc = {};
        for (const source of sources) {
            if (source instanceof Array) {
                if (!(acc instanceof Array)) {
                    acc = [];
                }
                acc = [...acc, ...source];
            } else if (source instanceof Object) {
                for (let [key, value] of Object.entries(source)) {
                    if (value instanceof Object && key in acc) {
                        value = this.deepMerge(acc[key], value);
                    }
                    acc = {...acc, [key]: value}
                }
            }
        }
        return acc
    }

    static timePast(time, curTime = null) {
        if (!curTime) {
            curTime = new Date();
        }

        if (!(time instanceof Object)) {
            time = new Date(time);
        }

        return time < curTime;
    }

    static getProperty(obj, key, separator = '.') {
        if (obj instanceof Object && typeof key === "string" && key.length > 0) {
            try {
                let keyArr = key.split(separator);
                let val = obj;
                let keyCount = keyArr.length;
                for (let i = 0; i < keyCount; i++) {
                    val = val[keyArr[i]];
                }
                return val;
            } catch (ignore) {
            }
        }
        return undefined;
    }
};