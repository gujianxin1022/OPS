<template>
  <div class="search-remuneration-list-warp">
    <el-radio-group v-model="subjectType" @change="handleChangeSubject" class="mb15">
      <el-radio-button
        v-if="Per.handleTabsPer('teach.tutorMT.searchTeacher.businessLineZh')"
        :label="0"
        >{{ $t("中文") }}</el-radio-button
      >
      <el-radio-button
        v-if="Per.handleTabsPer('teach.tutorMT.searchTeacher.businessLineEn')"
        :label="1"
        >{{ $t("英文") }}</el-radio-button
      >
      <el-radio-button
        v-if="Per.handleTabsPer('teach.tutorMT.searchTeacher.businessLineMath')"
        :label="2"
        >{{ $t("数学") }}</el-radio-button
      >
    </el-radio-group>
    <el-button type="text" @click="handleViewPackageDetail" class="fr mr10">{{ $t("查看课包规则关联明细") }}</el-button>
    <el-tabs v-model="salaryLabel">
      <el-tab-pane :label="item.description" :name="item.code" :key="item.code"  v-for="item in salaryLabelList">
      </el-tab-pane>
    </el-tabs>
    <salaryRuleList :subjectType="subjectType" :salaryLabel="salaryLabel" @update="handleChangeSubject"/>
  </div>
</template>

<script>
import salaryRuleList from "./salaryRuleList.vue";
import { ref, onMounted, provide } from "@vue/composition-api";
import eventBus from "@/utils/eventBus";
const isEidt=ref(false)
export default {
  name: "teacherRemunerationRule",
  components: {
    salaryRuleList,
  },
  setup(props, { root }) {
    const subjectType = ref(void 0);
    const salaryLabel = ref(void 0);
    const salaryLabelList = ref([]);
    const handleChangeSubject = () => {
      getsalaryLabelList(subjectType.value);
    };
    const handleViewPackageDetail = () => {
      root.$router.push({
        path: "/tutorManagement/courseRuleDetail",
        query: {
          subjectType: subjectType.value,
          salaryLabel: salaryLabel.value,
        },
      });
    };
    const getsalaryLabelList = async (subjectType) => {
      let businessLine = subjectType + 1;
      const res = await root.$Api.tutorManagement.getSalaryLabelsList(businessLine);
      if (res.status === 200 && res.data.code === 200) {
        salaryLabelList.value = res.data.data;
        if (salaryLabelList.value.length > 0) {
          if(!isEidt.value){
            salaryLabel.value = salaryLabelList.value[0].code;
          }
        }
      }
    };
    onMounted(() => {
      subjectType.value = 0;
      getsalaryLabelList(subjectType.value);

      eventBus.$on("infoList",(basicInfo) => {
        if(basicInfo.ruleId){
          isEidt.value=true;
          salaryLabel.value = basicInfo.salaryLabel;
          subjectType.value =Number(basicInfo.subjectType);
          getsalaryLabelList(subjectType.value);
        }
      })
    });
    return { 
      subjectType, 
      salaryLabel, 
      salaryLabelList,
      handleChangeSubject,
      handleViewPackageDetail
    };
  }
};
</script>

<style lang="scss" scoped>
.search-remuneration-list-warp {
  padding: 16px;
}
</style>