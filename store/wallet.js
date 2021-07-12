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