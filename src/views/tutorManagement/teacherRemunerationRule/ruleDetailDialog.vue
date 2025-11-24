<template>
    <div class="rule-detail-dialog">
        <el-dialog :visible.sync="dialogVisible" width="1000px" :title="ruleName" :before-close="handleClose" :close-on-click-modal="false">
            <div class="rule-detail-dialog-content">
                <div class="rule-detail-dialog-content-item">
                    <div class="rule-detail-dialog-content-item-label">
                        {{ $t('适用薪酬标签')+':' }}
                    </div>
                    <div class="rule-detail-dialog-content-item-value">
                        {{ salaryLabelName }}
                    </div>
                </div>
                <div class="rule-detail-dialog-content-item">
                    <div class="rule-detail-dialog-content-item-label">
                        {{ $t('规则类型')+':' }}
                    </div>
                    <div class="rule-detail-dialog-content-item-value">
                        {{ ruleTypeName }}
                    </div>
                </div>
                <div class="rule-detail-dialog-content-item">
                    <div class="rule-detail-dialog-content-item-label">
                        {{ $t('币种')+':' }}
                    </div>
                    <div class="rule-detail-dialog-content-item-value">
                        {{ currencyName }}
                    </div>
                </div>
            </div>
            <ruleSetting :basicInfo="ruleInfo" :ruleList="ruleInfo.ruleList" :isDetails="true" :isDialog="true"/>
        </el-dialog>
    </div>
</template>
<script>
import { ref ,watch,computed, onMounted, inject} from "@vue/composition-api";
import ruleSetting from "../../ruleManagement/rule.vue";
import { ruleType } from "./data";
export default {
    name: "ruleDetailDialog",
    components: {
        ruleSetting,
    },
    props: {
        ruleId: {
            type: String,
            default: ''
        },
        dialogVisible: {
            type: Boolean,
            default: false
        },
        ruleName: {
            type: String,
            default: ''
        },
    },
    setup(props, { root,emit}) {
        const salaryLabelList = inject("salaryLabelList");
        const currencyList = inject("currencyList");
        const dialogVisible = ref(false);
        const ruleInfo = ref({});
        const salaryLabelName = computed(() => {
            return salaryLabelList.value.find(item => item.code === ruleInfo.value.salaryLabel)?.description;
        });
        const ruleTypeName = computed(() => {
            return ruleType.find(item => item.value === ruleInfo.value.ruleType)?.label;
        });
        const currencyName = computed(() => {
            const currency = currencyList.value.find(item => item.id === ruleInfo.value.salaryCurrency);
            return currency?.currencyZh + ' (' + currency?.currency + ')';
        });
        const getRuleInfo = async (ruleId) => {
            const res = await root.$Api.tutorManagement.getSalaryRuleBasicInfo({ruleId});
            ruleInfo.value = res;
            ruleInfo.value.subjectType = String(ruleInfo.value.subjectType);
            ruleInfo.value.salaryLabel = String(ruleInfo.value.salaryLabel);
            ruleInfo.value.salaryCurrencyName = currencyList.value.find(item => item.id === ruleInfo.value.salaryCurrency)?.currency;
        };
        watch(() => props.dialogVisible, (newVal) => {
            if(newVal){
                getRuleInfo(props.ruleId);
            }
        });
        const handleClose = () => {
            emit('close', false);
        }
        onMounted(() => {
        });
        return {
            handleClose,
            ruleInfo,
            dialogVisible,
            salaryLabelList,
            currencyList,
            salaryLabelName,
            ruleTypeName,
            currencyName,
        }
    }
}
</script>
<style lang="scss" scoped>
.rule-detail-dialog {
    //padding: 20px;
    .rule-detail-dialog-content {
        display: flex;
        padding: 20px;
        gap: 50px;
        color: #303133;
        .rule-detail-dialog-content-item {
            display: flex;
            flex-direction: row;
            gap: 10px;
            .rule-detail-dialog-content-item-value {
                flex: 1;
            }
        }
    }
}
::v-deep .el-dialog__body {
    padding: 0px !important;
}
</style>