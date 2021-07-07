<template>
    <div class="container payment-history">
        <section class="options py-2 ">
            <span class="span-box" @click='selectBox("deposit")' :class="{active:selected=='deposit'}">{{keyStr('deposit')}}</span>
            <span class="span-box" @click='selectBox("withdrawal")' :class="{active:selected=='withdrawal'}">{{keyStr('withdrawal')}}</span>
            <span class="span-box" @click='selectBox("adjustment")' :class="{active:selected=='adjustment'}">{{keyStr('Adjustment')}}</span>
        </section>
        <div v-if="errorMsg" class="text-center">
            {{errorMsg[0]}}
        </div>

        <PaymentHistoryTable :selectedBox="selected" :selectedData="detectSelected" :contents="content" v-else />
    </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
    layout: "wallet",
    data() {
        return {
            selected: "deposit",
            convertedDeposit: "",
            convertedWithdraw: "",
            convertedAdjustment: "",
        }
    },

    async asyncData(context) {
        const content = await context.$content("wallet").fetch()

        let depositplugin = await context.$genSign({
            s: "deposit.get_list",
            login: "",
            page: 1,
            pageSize: 99,
            token: "",
            user: "",
            timestamp: "",
        })

        let depositList = await context.$axios.$get(
            `/api/?s=deposit.get_list`,
            {
                params: {
                    login: depositplugin.login,
                    page: 1,
                    pageSize: 99,
                    token: depositplugin.token,
                    user: depositplugin.user,
                    timestamp: depositplugin.timestamp,
                    sign: depositplugin.sign,
                },
            }
        )

        let withdrawalPlugin = await context.$genSign({
            s: "withdraw.get_list",
            login: "",
            page: 1,
            pageSize: 99,
            token: "",
            user: "",
            timestamp: "",
        })

        let withdrawalList = await context.$axios.$get(
            `/api/?s=withdraw.get_list`,
            {
                params: {
                    login: withdrawalPlugin.login,
                    page: 1,
                    pageSize: 99,
                    token: withdrawalPlugin.token,
                    user: withdrawalPlugin.user,
                    timestamp: withdrawalPlugin.timestamp,
                    sign: withdrawalPlugin.sign,
                },
            }
        )

        let adjustmentPlugin = await context.$genSign({
            s: "bounty.get_list",
            login: "",
            page: 1,
            pageSize: 99,
            token: "",
            user: "",
            timestamp: "",
        })

        let adjustmentList = await context.$axios.$get(
            `/api/?s=bounty.get_list`,
            {
                params: {
                    login: adjustmentPlugin.login,
                    page: 1,
                    pageSize: 99,
                    token: adjustmentPlugin.token,
                    user: adjustmentPlugin.user,
                    timestamp: adjustmentPlugin.timestamp,
                    sign: adjustmentPlugin.sign,
                },
            }
        )

        if (
            depositList.ret == "200" &&
            withdrawalList.ret == "200" &&
            adjustmentList.ret == "200"
        ) {
            context.store.dispatch("history/convertState", {
                depositList: depositList.data,
                withdrawalList: withdrawalList.data,
                adjustmentList: adjustmentList.data,
            })
        } else {
            var errorMsg = [
                depositList.msg,
                withdrawalList.msg,
                adjustmentList.msg,
            ]
        }
        return { content, errorMsg }
    },

    created() {
        this.updateState()
        this.convertedDeposit = this.convertData(this.depositList)
        this.convertedWithdraw = this.convertData(this.withdrawalList)
        this.convertedAdjustment = this.convertData(this.adjustmentList)
    },

    computed: {
        ...mapGetters({
            depositList: "history/getdepositList",
            withdrawalList: "history/getwithdrawalList",
            adjustmentList: "history/getadjustmentList",
        }),

        detectSelected() {
            switch (this.selected) {
                case "deposit":
                    return this.convertedDeposit

                case "withdrawal":
                    return this.convertedWithdraw

                case "adjustment":
                    return this.convertedAdjustment
            }
        },
    },

    methods: {
        updateState() {
            this.$store.commit("wallet/updateState", {
                currentPage: this.keyStr("payment history"),
                prevPageURL: "/wallet",
                totalBalance: this.keyStr("Total Balance"),
            })
        },
        keyStr(key) {
            return this.$csvHandler(this.content.body, key)
        },
        selectBox(box) {
            this.selected = box
        },
        convertData(data_list) {
            let dateList = []
            let count = 0
            let tenRecords = "tenRecords"
            let total = data_list.count
            if (total > 0) {
                for (let i = 0; i < data_list.list.length; i++) {
                    if (i == 0 || i % 10 == 0) {
                        count++
                        dateList.push({ count, tenRecords: [] })
                    }
                    if (
                        dateList[count - 1][tenRecords][data_list.list[i].date]
                    ) {
                        dateList[count - 1][tenRecords][
                            data_list.list[i].date
                        ].records.push({
                            time: data_list.list[i].time,
                            order: data_list.list[i].order,
                            amount: data_list.list[i].money,
                            status: data_list.list[i].deposit_status,
                            currency: data_list.list[i].currency_name,
                        })
                    } else {
                        let date = this.convertDateFormat(
                            data_list.list[i].date
                        )
                        let records = [
                            {
                                time: data_list.list[i].time,
                                order: data_list.list[i].order,
                                amount: data_list.list[i].money,
                                status: data_list.list[i].deposit_status,
                                currency: data_list.list[i].currency_name,
                            },
                        ]
                        dateList[count - 1][tenRecords][
                            data_list.list[i].date
                        ] = { records, date }
                    }
                }
            }
            return { dateList, total }
        },

        convertDateFormat(mydate) {
            let date = new Date(mydate)
            let month = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ][date.getMonth()]
            return date.getDate() + " " + month
        },
    },
    // mounted() {
    //     // scroll down to load more data
    //     window.addEventListener(
    //         "touchend",
    //         (e) => this.checkScrollDown(e),
    //         false
    //     )
    // },
}
</script>
<style lang="scss" scoped>
$border-color: #25d6cd54;
.payment-history {
    color: #fff;
    background: #314553;
    .options{
        border-top:$border-color 1px solid;
        border-bottom:$border-color 1px solid;
    }
    .span-box {
        padding: 0.2rem 0.4rem;
        border-radius: 0.2rem;
        color: #fff;
        margin:0 0.5rem;
        &.active {
            background-color: #2beae2;
            color: #000;
        }
    }
    hr {
        margin: 1rem 0;
        border-color: $border-color !important;
    }
    #btn-export {
        @include button-green;
    }
}
</style>
