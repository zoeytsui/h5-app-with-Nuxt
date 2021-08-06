const md5 = require('md5');
const axios = require('axios');

let openapi = 'http://192.168.75.52:8010';

const getTimestamp = async () => {
    try {
        let result = await axios.get(`${openapi}/?s=site.getServiceTime`)
            .then((res) => res.data)
            .catch((err) => {
                console.error(err);
            });
        return result.data;
    } catch (error) {
        console.error(error);
    }
};

const getUser = () => {
    try {
        return 'ucenter'
    } catch (error) {
        console.error(error);
    }
};

const getTrack = () => {
    try {
        let id = [
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            new Date().getDate(),
            new Date().getHours(),
            new Date().getMinutes(),
            new Date().getSeconds(),
            new Date().getMilliseconds()
        ].join("");
        let str = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        return id + str;
    } catch (error) {
        console.error(error);
    }
};

const getSign = (obj) => {
    try {
        let keys = Object.keys(obj).sort();
        let str = '';
        for (let i of keys) {
            str += obj[i]
        }
        return md5(str + 'aajWy7hq1XzcFey1lYozcicA6sDpLCut')
    } catch (error) {
        console.error(error);
    }
};

export {
    getTimestamp,
    getTrack,
    getUser,
    getSign,
}