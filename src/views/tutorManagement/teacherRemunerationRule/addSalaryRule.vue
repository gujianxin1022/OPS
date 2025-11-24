<template>
    <div class="add-salary-rule">
    <h3>{{ title }}</h3>
    <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('基本信息配置')" name="basicInfo" disabled>
            <basicInfoSetting :disabledForm="disabledForm" :subjectType="subjectType" :salaryLabel="salaryLabel" :salaryLabelName="salaryLabelName" :ruleId="ruleId" :disabledPart="disabledPart" :ruleInfo="ruleInfo" @next="handleNext" @cancel="handleCancel"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('规则配置')" name="ruleConfig" disabled>
            <ruleSetting :basicInfo="basicInfo" :ruleList="ruleInfo.ruleList" @back="handleBack" @cancel="handleCancel" :isDetails="disabledForm || disabledPart" :disabledButton="disabledForm"/>
        </el-tab-pane>
    </el-tabs>
    </div>
</template>

<script>
import basicInfoSetting from "./basicInfoSetting.vue";
import ruleSetting from "../../ruleManagement/rule.vue";
import { ref, computed, onMounted ,watch} from "@vue/composition-api";
import { saveSalaryRuleBasicInfo } from "@/api/tutorManagement";
import eventBus from "@/utils/eventBus";
export default {
    name: "addSalaryRule",
    components: {
        basicInfoSetting,
        ruleSetting,
    },
    setup(props, { root }) {
        const ruleId = ref('');
        const subjectType = ref('');
        const salaryLabel = ref('');
        const disabledForm = ref(false);
        const disabledPart = ref(false);
        const activeName = ref("basicInfo");
        const basicInfo = ref({});
        const ruleInfo = ref({});
        const salaryLabelList = ref([]);
        const salaryLabelName = ref('');
        const title = computed(() => {
            let subjectName = "";
            if(subjectType.value === "0"){
                subjectName = "中文";
            }else if(subjectType.value === "1"){
                subjectName = "英文";
            }else if(subjectType.value === "2"){
                subjectName = "数学";
            }
            if(salaryLabelList.value.length > 0){
                salaryLabelName.value = salaryLabelList.value.find(item => item.code === salaryLabel.value)?.description || "";
            }
            return subjectName + "-" + salaryLabelName.value;
        });
        const handleNext = async (params) => {
            //const res = await saveSalaryRuleBasicInfo(params);
            //console.log("res",res);
            if(ruleId.value){
                params.ruleId = ruleId.value;
            }
            basicInfo.value = params;
           activeName.value = "ruleConfig";
        };
        const handleBack = () => {
            activeName.value = "basicInfo";
        };
        const handleCancel = () => {
            // 使用事件总线发送更新事件
            eventBus.$emit("updateSalaryRuleList");
            eventBus.$emit("infoList",basicInfo.value)
            root.$router.push({
                path: "/tutorManagement/teacherRemunerationRule",
            });
        };
        const getsalaryLabelList = async (subjectType) => {
            let businessLine = Number(subjectType) + 1;
            const res = await root.$Api.tutorManagement.getSalaryLabelsList(businessLine);
            if (res.status === 200 && res.data.code === 200) {
                salaryLabelList.value = res.data?.data || [];
            }
        };
        const getRuleInfo = async (ruleId) => {
            const res = await root.$Api.tutorManagement.getSalaryRuleBasicInfo({ruleId});
            ruleInfo.value = res;
        };
        const routeParams = computed(() => {
            return {
                ruleId: root.$route.query.ruleId,
                subjectType: root.$route.query.subjectType,
                salaryLabel: root.$route.query.salaryLabel,
                disabledForm: root.$route.query.disabledForm === "1" ? true : false,
                disabledPart: root.$route.query.disabledPart === "1" ? true : false,
            };
        });
        watch(() => routeParams.value,(newVal) => {
            ruleId.value = newVal.ruleId;
            subjectType.value = newVal.subjectType;
            salaryLabel.value = newVal.salaryLabel;
            disabledForm.value = newVal.disabledForm;
            disabledPart.value = newVal.disabledPart;
            if(ruleId.value){
                getRuleInfo(ruleId.value);
            }
        },{deep: true,immediate: true});
        onMounted(() => {
            getsalaryLabelList(subjectType.value);
        });
        return {
            ruleId,
            subjectType,
            salaryLabel,
            disabledForm,
            disabledPart,
            activeName,
            basicInfo,
            handleNext,
            title,
            ruleInfo,
            salaryLabelName,
            handleCancel,
            handleBack,
        };
    },
};
</script>

<style lang="scss" scoped>
.add-salary-rule {
    padding: 20px;
}
</style>