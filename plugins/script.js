export default (context, inject) => {
    inject(
        // pass csv content key
        'csvHandler', (contentBody, keyStr) => {
            let lang = context.store.$i18n.getLocaleCookie().toUpperCase();
            let capkeyStr = keyStr.toUpperCase();
            let keyArr = contentBody;
            let ouputString;

            for (let i in keyArr) {
                keyArr[i].KEY === capkeyStr
                    ? (ouputString = keyArr[i][`${lang}`])
                    : undefined;
            }
            return ouputString;
        },
    ),
        inject(
            // gen api tack with login number + date
            'genTrack', () => {
                let date = new Date();
                let components = [
                    date.getFullYear(),
                    date.getMonth() + 1,
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                    date.getMilliseconds()
                ];
                let loginUser = context.$auth.$storage.getUniversal("login");
                var id = components.join("");
                return loginUser + id;
            }
        )
}
