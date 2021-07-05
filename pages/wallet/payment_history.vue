<template>
    <div class="container deposit">
        <span class="span-box" @click='selectBox("deposit")' :class="{active:selected=='deposit'}">{{keyStr('deposit')}}</span>
        <span class="span-box" @click='selectBox("withdrawal")' :class="{active:selected=='withdrawal'}">{{keyStr('withdrawal')}}</span>
        <span class="span-box" @click='selectBox("payment")' :class="{active:selected=='adjustment'}">{{keyStr('Adjustment')}}</span>

        <hr>

        <b-container class="records" v-for="(item,i) in convertedData" :key="i">
            <b-row class="records-header">
                <b-col cols="3" v-html="item.date"></b-col>
                <b-col cols="4" v-html="item.records.length + ' Records'"></b-col>
                <b-col cols="5"></b-col>
            </b-row>
            <span v-for="(record , j) in item.records" :key="j">
                <b-row>
                    <b-col cols="3" v-html="record.time"></b-col>
                    <b-col cols="4" v-html="record.order"></b-col>
                    <b-col cols="5" class="text-right amount" v-html="'+ ' + record.amount"></b-col>
                </b-row>
                <b-row>
                    <b-col cols="3"></b-col>
                    <b-col cols="4">{{keyStr(record.status)}}</b-col>
                    <b-col cols="5" class="text-right" v-html="record.currency"></b-col>
                </b-row>
            </span>
        </b-container>

    </div>
</template>

<script>
export default {
    layout: "wallet",
    data() {
        return {
            selected: "deposit",
            amount: null,
            // depositData: {
            //     pages: 45,
            //     count: "90",
            //     list: [
            //         {
            //             order: "ep21061008580544973",
            //             create_time: "2021-06-10 08:58:06",
            //             money: "999",
            //             deposit_status: "Processing",
            //             currency_name: "USDT-erc20",
            //             date: "2021-06-10",
            //             time: "08:58:06",
            //         },
            //         {
            //             order: "ep21061008554371853",
            //             create_time: "2021-06-10 08:55:43",
            //             money: "200",
            //             deposit_status: "Success",
            //             currency_name: "USDT-erc20",
            //             date: "2021-06-10",
            //             time: "08:55:43",
            //         },
            //         {
            //             order: "ep21061008554371853",
            //             create_time: "2021-06-10 08:55:43",
            //             money: "200",
            //             deposit_status: "Success",
            //             currency_name: "USDT-erc20",
            //             date: "2021-06-09",
            //             time: "08:55:43",
            //         },
            //         {
            //             order: "ep21061008554371853",
            //             create_time: "2021-06-10 08:55:43",
            //             money: "200",
            //             deposit_status: "Success",
            //             currency_name: "USDT-erc20",
            //             date: "2021-06-09",
            //             time: "08:55:43",
            //         },
            //         {
            //             order: "ep21061008554371853",
            //             create_time: "2021-06-10 08:55:43",
            //             money: "200",
            //             deposit_status: "Success",
            //             currency_name: "USDT-erc20",
            //             date: "2021-06-09",
            //             time: "08:55:43",
            //         },
            //         {
            //             order: "ep21061008554371853",
            //             create_time: "2021-06-10 08:55:43",
            //             money: "200",
            //             deposit_status: "Success",
            //             currency_name: "USDT-erc20",
            //             date: "2021-06-09",
            //             time: "08:55:43",
            //         },
            //         {
            //             order: "ep21061008554371853",
            //             create_time: "2021-06-10 08:55:43",
            //             money: "200",
            //             deposit_status: "Success",
            //             currency_name: "USDT-erc20",
            //             date: "2021-06-09",
            //             time: "08:55:43",
            //         },
            //         {
            //             order: "ep21061008554371853",
            //             create_time: "2021-06-10 08:55:43",
            //             money: "200",
            //             deposit_status: "Success",
            //             currency_name: "USDT-erc20",
            //             date: "2021-06-09",
            //             time: "08:55:43",
            //         },
            //         {
            //             order: "ep21061008554371853",
            //             create_time: "2021-06-10 08:55:43",
            //             money: "200",
            //             deposit_status: "Success",
            //             currency_name: "USDT-erc20",
            //             date: "2021-06-09",
            //             time: "08:55:43",
            //         },
            //     ],
            // },
            depositData:null,
            convertedData: null,
            currentPosition: "",
            lastPosition: "",
        }
    },
    async asyncData(context) {
        const content = await context.$content("wallet").fetch()
        return { content }
    },
    created() {
        this.updateState()
    },
    async fetch(context) {
        let plugin = await context.$genSign({
            s: "deposit.get_list",
            login: 1000036,
            page: 1,
            pageSize: 10,
            token: "c06f36b5d1a0c8c5c57a2bebe78f6d91",
            user: "app",
            timestamp: 0,
        })

        let get_deposit_list = await context.$axios.$get(
            `/api/?s=deposit.get_list`,
            {
                params: {
                    login: 1000036,
                    page: 1,
                    pageSize: 10,
                    token: "c06f36b5d1a0c8c5c57a2bebe78f6d91",
                    user: plugin.user,
                    timestamp: plugin.timestamp,
                    sign: plugin.sign,
                },
            }
        )
        this.depositData = get_deposit_list
        
        console.log(get_deposit_list)
        
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
        convertData() {
            let that = this
            let dateList = {}
            that.depositData.list.forEach((element) => {
                if (dateList[element.date]) {
                    dateList[element.date].records.push({
                        time: element.time,
                        order: element.order,
                        amount: element.money,
                        status: element.deposit_status,
                        currency: element.currency_name,
                    })
                } else {
                    let date = this.convertDateFormat(element.date)
                    let records = [
                        {
                            time: element.time,
                            order: element.order,
                            amount: element.money,
                            status: element.deposit_status,
                            currency: element.currency_name,
                        },
                    ]
                    dateList[element.date] = { records, date }
                }
            })
            this.convertedData = dateList
            console.log(this.convertedData)
        },

        convertDateFormat(date) {
            let mydate = new Date(date)
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
            ][mydate.getMonth()]
            return mydate.getDate() + " " + month
        },

        checkScrollDown() {
            if (process.client) {
                //get the height of entire page
                let height =
                    window.innerHeight || // for IE9 and Safari
                    document.body.scrollHeight || //for Chrome
                    document.documentElement.scrollHeight //for IE6/7/8, Firefox

                let currentPosition =
                    window.pageYOffset || // for IE9 and Safari
                    document.body.scrollTop || //for Chrome
                    document.documentElement.scrollTop //for IE6/7/8, Firefox

                if (height - currentPosition < 20) {
                    switch (selected) {
                        case "deposit":
                            break
                        case "withdrawal":
                            break
                        case "adjustment":
                            break
                    }
                }
            }
        },

    },
    mounted() {
        window.addEventListener("scroll", this.checkScrollDown),
        this.convertData();
    },
}
</script>
<style lang="scss" scoped>
$border-color: #25d6cd54;
.deposit {
    color: #fff;
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

    .records {
        &-header {
            color: #2beae2;
            font-weight: bold;
            background-color: #273d4b;
        }
        span .row:nth-of-type(even) {
            background-color: #273d4b;
        }
        .amount {
            color: #60bc3f;
        }
    }
}
</style>
