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
        // let convertedDeposit = convertData(depositList);
        // let convertedWithdraw = convertData(withdrawalList);
        // let convertedAdjustment = convertData(adjustmentList);
        // console.log(convertedDeposit);
        commit('updateState', { depositList, withdrawalList, adjustmentList });
    }
}

export const mutations = {
    updateState(state, { depositList, withdrawalList, adjustmentList }) {
        state.depositList = depositList;
        state.withdrawalList = withdrawalList;
        state.adjustmentList = adjustmentList;
        
        // console.log(state.depositList);
        // console.log(state.depositList[0].tenRecords);
    }
}

