export const state = () => ({
    currentPage: 'STATE 1',
    prevPageURL: 'STATE 2',
    totalBalance: 'STATE 3',
})
export const mutations = {
    update(state, { currentPage, prevPageURL, totalBalance }) {
        state.currentPage = currentPage;
        state.prevPageURL = prevPageURL;
        state.totalBalance = totalBalance;
    }
}