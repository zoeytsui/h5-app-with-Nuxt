export default ({ app, $axios }, inject) => {
    inject(
        // generate sign value for api use
        'genSign', async (service) => {
            const md5 = require("md5");

            const user = 'app'
            const timestamp = (await $axios.$get("/api/?s=site.getServiceTime")).data;
            const key = 'K5AgjT7yUq2gwUbIaSHBPQeaknbdlfob';

            let sign = md5(service + timestamp + user + key);

            return {user, timestamp, sign};
        },
    )
}