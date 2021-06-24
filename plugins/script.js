export default ({ app }, inject) => {
    inject(
        // for pass csv content key
        'contentHandler', (contentBody, keyStr) => {
            let lang = app.store.$i18n.getLocaleCookie().toUpperCase();
            let capkeyStr = keyStr.toUpperCase();
            let keyArr = contentBody;
            let ouputString;

            for (let i in keyArr) {
                keyArr[i].KEY === capkeyStr
                ? (ouputString = keyArr[i][`${lang}`])
                : undefined;
            }
            return ouputString;
        }
    )
}