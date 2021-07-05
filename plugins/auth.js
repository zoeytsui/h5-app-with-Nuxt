const md5 = require("md5");

export default (context, inject) => {
    inject(
        // generate sign value for api use
        'genSign', async (obj) => {
            try {
                let user = 'app';
                let token = context.$auth.$storage.getUniversal("token");
                let login = context.$auth.$storage.getUniversal("login");
                let timestamp = (await context.$axios.$get("/api/?s=site.getServiceTime")).data;
                let secretKey = 'K5AgjT7yUq2gwUbIaSHBPQeaknbdlfob';

                let objKeys = Object.keys(obj).sort();

                let newObj = objKeys.map(k => {
                    k.includes('user') ? obj[k] = user : '';
                    k.includes('token') ? obj[k] = token : '';
                    k.includes('timestamp') ? obj[k] = timestamp : '';
                    return obj[k]
                }).join('')


                let sign = md5(newObj + secretKey)

                return { user, timestamp, sign, token, login };
            } catch (error) {
                console.log(error);
            }
        },
    )
}