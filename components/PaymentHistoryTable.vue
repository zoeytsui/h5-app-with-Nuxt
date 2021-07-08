<template>
    <div :class="selectedBox" class="pb-5">
        <div v-if="selectedData.total == 0" class="text-center">
            {{keyStr("NORECORD")}}.
        </div>
        <b-container class="records" v-for="i in count" :key="i" v-else>
            <span v-for="(date , j) in Object.keys(selectedData.dataList[i-1].tenRecords)" :key="j">
                <b-row class="records-header py-1">
                    <b-col sm="3" cols="3" class="pr-0" v-html="selectedData.dataList[i-1].tenRecords[date].date"></b-col>
                    <b-col sm="4" cols="6" v-html="selectedData.dataList[i-1].tenRecords[date].records.length + ' Records'"></b-col>
                    <b-col sm="5" cols="3"></b-col>
                </b-row>
                <span v-for="(record , k) in selectedData.dataList[i-1].tenRecords[date].records" :key="k">
                    <b-row class="py-1">
                        <b-col sm="3" cols="3" v-html="record.time"></b-col>
                        <b-col sm="4" cols="5" class="text-break" v-html="'#' + record.order"></b-col>
                        <b-col sm="5" cols="4" class="text-right amount " v-html="'+' + record.amount"></b-col>
                    </b-row>
                    <b-row class="py-1">
                        <b-col sm="3" cols="3"></b-col>
                        <b-col sm="4" cols="5">{{keyStr(record.status)}}</b-col>
                        <b-col sm="5" cols="4" class="text-right" v-html="record.currency"></b-col>
                    </b-row>
                </span>
            </span>
        </b-container>
    </div>
</template>

<script>
export default {
    props: {
        selectedBox: {
            type: String,
            required: true,
        },
        selectedData: {
            type: Object,
            required: true,
        },
        contents: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            content: "",
            count: "",
        }
    },

    methods: {
        keyStr(key) {
            return this.$csvHandler(this.contents.body, key)
        },
        checkScrollDown(e) {
            // check if already scroll to the bottom

            if (this.count < this.selectedData.dataList.length) {
                if (
                    document.documentElement.scrollHeight -
                        document.documentElement.scrollTop -
                        document.body.clientHeight <
                    5
                ) {
                    this.count++
                }
            } else return
        },
    },
    mounted() {
        // scroll down to load more data
        window.addEventListener(
            "touchend",
            (e) => this.checkScrollDown(e),
            false
        )
    },
    watch: {
        selectedData: {
            immediate: true,
            deep: true,
            handler() {
                this.count = 1
            },
        },
    },
}
</script>

<style lang="scss" scoped>
.records {
    &-header {
        color: #2beae2;
        font-weight: bold;
        background-color: #273d4b;
        border-bottom: 1px solid #f7f7f763;
        font-size: 1.2rem;
    }
    span .row:nth-of-type(even) {
        background-color: #273d4b;
    }
    & > span span:last-of-type .row:last-of-type {
        border-bottom: 1px solid #f7f7f763;
    }
    .amount {
        white-space: nowrap;
    }
}
.deposit {
    .amount {
        color: #60bc3f;
    }
}
.withdrawal,
.adjustment {
    .amount {
        color: #db3e62;
    }
}

@media (max-width: 576px) {
    .records {
        .row{
            div{
                padding-left:5px;
            }
        }
        span span .row {
            div:not(:first-of-type) {
                padding-right: 0;
            }
        }
    }
}
</style>