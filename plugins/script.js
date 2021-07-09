export default (context, inject) => {
    // pass csv content key
    inject(
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
        // gen api tack with login number + date
        inject(
            'genTrack', () => {
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
            }
        ),
        inject(
            'numFormatter', (value) => {
                if (!value) return '0.00';
                var intPart = Number(value) - Number(value) % 1;
                var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                return intPartFormat;
            }
        )
}
