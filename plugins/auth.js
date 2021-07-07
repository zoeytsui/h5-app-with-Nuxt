const md5 = require("md5");

const key = 'K5AgjT7yUq2gwUbIaSHBPQeaknbdlfob';

export default (context, inject) => {
    inject(
        // generate sign value for api use
        'genSign', async (obj) => {
            try {
                let user = 'app';
                let token = context.$auth.$storage.getUniversal("token");
                let login = context.$auth.$storage.getUniversal("login");
                let timestamp = (await context.$axios.$get("/api/?s=site.getServiceTime")).data;
                let track = context.$genTrack();

                let newObj = Object.keys(obj).sort().map(k => {
                    if (k.includes('user')) obj[k] = user
                    if (k.includes('token')) obj[k] = token
                    if (k.includes('login')) obj[k] = login
                    if (k.includes('track')) obj[k] = track
                    if (k.includes('timestamp')) obj[k] = timestamp
                    
                    return obj[k]
                }).join('')

                let sign = md5(newObj + key)

                return { user, timestamp, sign, token, login, track };

            } catch (error) {
                console.log(error);
            }
        },
    )
}