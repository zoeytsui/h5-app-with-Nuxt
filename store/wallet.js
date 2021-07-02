export const state = () => ({
    currentPage: '',
    prevPageURL: 'x60://me_page',
    totalBalance: '',
})
export const mutations = {
    updateState(state, { currentPage, prevPageURL, totalBalance }) {
        state.currentPage = currentPage;
        state.prevPageURL = prevPageURL;
        state.totalBalance = totalBalance;
    }
}