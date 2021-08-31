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
            'thousandsSeparator', (value) => {
                if (value === 0) return '0.00';
                if (!value || !Number(value)) return 'Loading...';
                value = Number.parseFloat(value).toFixed(8);
                return new Intl.NumberFormat(`${context.i18n.defaultLocale}`, { maximumSignificantDigits: 20 }).format(value)
            }
        ),
        // Turn an Object into Query String Parameters
        inject('objectToQueryString', (obj) => {
            try {
                return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
            } catch (error) { console.error(error) }
        })
}
