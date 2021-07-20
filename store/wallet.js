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
    async getUserInfo({ commit }) {
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

            let getUserInfo_sign = await this.$axios.$post(
                "/lib/sign",
                getUserInfo_params
            );

            let getUserInfoApi = await this.$axios
                .$get("/api", {
                    params: { ...getUserInfo_params, ...getUserInfo_sign }
                })
                .then(res => {
                    if (res.ret !== 200) {
                        console.error(res.msg);
                        return;
                    }
                    userInfo.isSetFundPass = res.data.isSetFundPass;
                    userInfo.balance = Object.values(res.data.balance)[0];
                    userInfo.currency = Object.keys(res.data.balance)[0];
                    commit('updateUserInfo', userInfo);
                })
                .catch(err => {
                    console.error(err);
                });

        } catch (error) {
            console.error(error);
        }
    }
}