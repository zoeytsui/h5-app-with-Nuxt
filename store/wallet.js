export const state = () => ({
    currentPage: '',
    prevPageURL: '',
    totalBalance: '',
    userInfo: {
        isSetFundPass: null,
        balance: null,
        currency: null
    }
})

export const mutations = {
    updateState(state, { currentPage, prevPageURL, totalBalance }) {
        state.currentPage = currentPage;
        state.prevPageURL = prevPageURL;
        state.totalBalance = totalBalance;
    },
    updateUserInfo(state, userInfo) {
        state.userInfo = userInfo;
    }
}

export const actions = {
    async getUserInfo({ state, commit }) {
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- getUserInfo
        // http://showdoc.pubhx.com/index.php?s=/50&page_id=1302
        try {
            let userInfo = { ...state.userInfo };

            let getUserInfo_params = {
                s: "members.getUserInfo",
                token: this.$auth.$storage.getUniversal("token"),
                login: this.$auth.$storage.getUniversal("login"),
                timestamp: Math.floor(Date.now() / 1000),
                user: "ucenter"
            };

            let getUserInfo_sign = await this.$axios.$post("/lib/sign", getUserInfo_params);

            let getUserInfoApi = await this.$axios
                .$get("/api", { params: { ...getUserInfo_params, ...getUserInfo_sign } }).then(res => {
                    if (res.ret !== 200) { console.error(`${res.ret}: ${res.msg}`); return; }
                    userInfo.isSetFundPass = res.data.isSetFundPass;
                    userInfo.balance = Object.values(res.data.balance)[0];
                    userInfo.currency = Object.keys(res.data.balance)[0];
                    commit('updateUserInfo', userInfo);
                    if (process.client) {
                        window.localStorage.setItem("isSetFundPass", true);
                    }
                }).catch(err => console.error(err));

        } catch (error) { console.error(error) }
    },

    async userLogout() {
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- members_logout
        // http://showdoc.pubhx.com/index.php?s=/50&page_id=1196
        try {
            let members_logout_params = {
                s: "members.logout",
                user: "ucenter",
                login: this.$auth.$storage.getUniversal("login"),
                timestamp: Math.floor(Date.now() / 1000),
                token: this.$auth.$storage.getUniversal("token")
            };

            let members_logout_sign = await this.$axios.$post("/lib/sign", members_logout_params);

            let members_logout = await this.$axios
                .$get("/api?", { params: { ...members_logout_params, ...members_logout_sign } }).then(res => {
                    if (res.ret !== 200) { console.error(`${res.ret}: ${res.msg}`); return; }
                    return console.warn("Logout:" + res.data);
                }).catch(err => console.error(err));

        } catch (error) {
            console.error(error);
        }
    },
}