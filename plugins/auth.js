export default ({ app, $axios }, inject) => {
    inject(
        // generate sign value for api use
        'genSign', async (obj) => {
            const md5 = require("md5");

            const user = obj.user;
            let timestamp = (await $axios.$get("/api/?s=site.getServiceTime")).data;
            // const timestamp = Math.floor(Date.now() / 1000);

            // let sign = md5(service + timestamp + user + key);

            let keys = Object.keys(obj).sort();
            let key = 'K5AgjT7yUq2gwUbIaSHBPQeaknbdlfob';
            let str = '';

            for (var p = 0; p < keys.length; p++) {
                if (keys[p] == "sign" || obj[keys[p]] === "") {
                    continue;
                }
                if (keys[p] == "timestamp") {
                    str = str + timestamp;
                } else {
                    str = str + obj[keys[p]];
                }
            }
            str = str + key

            let sign = md5(str)

            return { user, timestamp, sign };
        },
    )
}