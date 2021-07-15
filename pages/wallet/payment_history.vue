<template>
    <div class="container payment-history">

        <section class="options py-2 ">
            <span class="span-box mr-1" @click='selectBox("deposit")' :class="{active:selected=='deposit'}">{{keyStr('deposit')}}</span>
            <span class="span-box mx-1" @click='selectBox("withdrawal")' :class="{active:selected=='withdrawal'}">{{keyStr('withdrawal')}}</span>
            <span class="span-box mx-1" @click='selectBox("adjustment")' :class="{active:selected=='adjustment'}">{{keyStr('Adjustment')}}</span>
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
    //Getting data from API and content
    async asyncData(context) {
        const content = await context.$content("wallet").fetch()

        const params = {
            page: 1,
            pageSize: 500,
            user: "ucenter",
            login: context.$auth.$storage.getUniversal("login"),
            timestamp: Math.floor(Date.now() / 1000),
            token: context.$auth.$storage.getUniversal("token"),
        }

        // for deposit
        let depositSign = await context.$axios.$post("/lib/sign", {
            ...params,
            s: "deposit.get_list",
        })
        let depositList = await context.$axios
            .$get(`/api/?s=deposit.get_list`, {
                params: {
                    ...params,
                    ...depositSign,
                },
            })
            .catch((err) => {
                console.log(err)
            })

        //for withdrawal Data
        let withdrawalSign = await context.$axios.$post("/lib/sign", {
            ...params,
            s: "withdraw.get_list",
        })
        let withdrawalList = await context.$axios
            .$get(`/api/?s=withdraw.get_list`, {
                params: {
                    ...params,
                    ...withdrawalSign,
                },
            })
            .catch((err) => {
                console.log(err)
            })

        //for adjustment Data
        let adjustmentSign = await context.$axios.$post("/lib/sign", {
            ...params,
            s: "bounty.get_list",
        })
        let adjustmentList = await context.$axios
            .$get(`/api/?s=bounty.get_list`, {
                params: {
                    ...params,
                    ...adjustmentSign,
                },
            })
            .catch((err) => {
                console.log(err)
            })

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
        //converting data to the suitable format
        //1. Check if there are any records
        //2. Convert data to 10 records per obj
        //3. grouping data with same date for counting
        //4. Add "," to the amount
        convertData(data_list) {
            let dataList = []
            let count = 0
            let total = data_list.count
            if (total > 0) {
                for (let i = 0; i < data_list.list.length; i++) {
                    if (i == 0 || i % 10 == 0) {
                        count++
                        dataList.push({ count, tenRecords: [] })
                    }
                    if (
                        dataList[count - 1]["tenRecords"][
                            data_list.list[i].date
                        ]
                    ) {
                        let amount = new Intl.NumberFormat().format(
                            data_list.list[i].money
                        )
                        dataList[count - 1]["tenRecords"][
                            data_list.list[i].date
                        ].records.push({
                            time: data_list.list[i].time,
                            order: data_list.list[i].order,
                            amount: amount,
                            status: data_list.list[i].deposit_status,
                            currency: data_list.list[i].currency_name,
                        })
                    } else {
                        let date = this.convertDateFormat(
                            data_list.list[i].date
                        )
                        let amount = new Intl.NumberFormat().format(
                            data_list.list[i].money
                        )
                        let records = [
                            {
                                time: data_list.list[i].time,
                                order: data_list.list[i].order,
                                amount: amount,
                                status: data_list.list[i].deposit_status,
                                currency: data_list.list[i].currency_name,
                            },
                        ]
                        dataList[count - 1]["tenRecords"][
                            data_list.list[i].date
                        ] = { records, date }
                    }
                }
            }
            return { dataList, total }
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
}
</script>
<style lang="scss" scoped>
$border-color: #25d6cd54;
.payment-history {
    color: #fff;
    .options {
        border-top: $border-color 1px solid;
        border-bottom: $border-color 1px solid;
    }
    .span-box {
        padding: 0.2rem 0.4rem;
        border-radius: 0.2rem;
        color: #fff;
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
