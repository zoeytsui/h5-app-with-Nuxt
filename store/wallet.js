export const state = () => ({
    currentPage: '',
    prevPageURL: '',
    totalBalance: '',
})
export const mutations = {
    updateState(state, { currentPage, prevPageURL, totalBalance }) {
        state.currentPage = currentPage;
        state.prevPageURL = prevPageURL;
        state.totalBalance = totalBalance;
    }
}