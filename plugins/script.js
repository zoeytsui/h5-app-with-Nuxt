export default (context, inject) => {
        // pass csv content key
        inject(
            'csvHandler', (keyArr, keyStr) => {
                try {
                    let lang = context.store.$i18n.defaultLocale.toUpperCase();
                    let ouputString;
                    for (let i in keyArr) {
                        keyArr[i].KEY === keyStr.toUpperCase()
                            ? (ouputString = keyArr[i][`${lang}`])
                            : undefined;
                    }
                    return ouputString;
                } catch (error) {
                    console.error(error);
                }
            },
        ),
        // gen api track with date + random string
        inject(
            'genTrack', () => {
                let id = [
                    new Date().getYear(),
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
        // Number formatting with thousand separator
        inject(
            'numFormatter', (value) => {
                if (!value || !Number(value)) return '0.00';
                return new Intl.NumberFormat(`${context.i18n.defaultLocale}`).format(value)
            }
        )
}
