export const state = () => ({
    depositList: '',
    withdrawalList: '',
    adjustmentList: '',
})

export const getters = {
    getdepositList: state => state.depositList,

    getwithdrawalList: state => state.withdrawalList,

    getadjustmentList: state => state.adjustmentList
};

export const actions = {
    convertState({ commit }, { depositList, withdrawalList, adjustmentList }) {
        commit('updateState', { depositList, withdrawalList, adjustmentList });
    }
}

export const mutations = {
    updateState(state, { depositList, withdrawalList, adjustmentList }) {
        state.depositList = depositList;
        state.withdrawalList = withdrawalList;
        state.adjustmentList = adjustmentList;
        
    }
}

