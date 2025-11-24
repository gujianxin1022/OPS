<template>
  <div class="my-student-new-wrap">
    <div class="board-wrap">
      <el-popover
        placement="bottom"
        trigger="click"
        @show="loadData = true"
        @hide="loadData = false"
      >
        <DataBoard v-if="loadData" />
        <el-button slot="reference" type="text">{{
          $t("本月数据概要")
        }}</el-button>
      </el-popover>
      <i class="el-icon-s-data"></i>
      <el-popover placement="left-end" trigger="click">
        <CalculateTip />
        <i slot="reference" class="el-icon-question"></i>
      </el-popover>
    </div>
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane
        v-for="(tab, idx) in tabList(isEn)"
        :key="idx"
        :label="tab.name"
        :name="tab.value"
        v-if="tab.visible"
      >
        <AllStuFilter v-if="activeTab == TABS.ALL_STUDENT" />
        <TrailStudentSearchPanel
          v-if="activeTab == TABS.TRAIL_STUDENT"
          @updateTrailTable="updateTrailTable($event)"
        />
      </el-tab-pane>
    </el-tabs>
    <AllStuTable v-if="activeTab == TABS.ALL_STUDENT" />
    <TrailStudentTable
      v-if="activeTab == TABS.TRAIL_STUDENT"
      :searchParams="searchParams"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  computed,
  ref,
  watch,
  unref,
  onMounted,
} from "@vue/composition-api";
import { tabList } from "../dataConfig/constant";
import { TABS } from "../dataConfig/enum";
import AllStuFilter from "../components/MyStudentNew/studentSearchPanel.vue";
import AllStuTable from "../components/MyStudentNew/studentTable.vue";
import TrailStudentSearchPanel from "../components/MyStudentNew/trailStudentSearchPanel.vue";
import DataBoard from "../components/MyStudentNew/dataBoard.vue";
import CalculateTip from "../components/MyStudentNew/calculateTip.vue";
import TrailStudentTable from "../components/MyStudentNew/trailStuTable.vue";
import HandlePermission from "@/utils/handlePermission";
const { handleTabsPer } = HandlePermission;
export default defineComponent({
  components: {
    AllStuFilter,
    AllStuTable,
    DataBoard,
    CalculateTip,
    TrailStudentSearchPanel,
    TrailStudentTable,
  },
  setup(_, { root }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const loadData = ref(false);
    const activeTab = ref(0);
    const searchParams = ref(null);
    const updateTrailTable = (formState) => {
      searchParams.value = formState;
    };
    onMounted(() => {
      if (handleTabsPer("teach.myWorkbench.myStudentNew.formalStudent")) {
        activeTab.value = TABS.ALL_STUDENT;
      }
      if (
        !handleTabsPer("teach.myWorkbench.myStudentNew.formalStudent") &&
        handleTabsPer("teach.myWorkbench.myStudentNew.trailStudent")
      ) {
        activeTab.value = TABS.TRAIL_STUDENT;
      }
    });
    return {
      loadData,
      TABS,
      isEn,
      searchParams,
      tabList,
      activeTab,
      updateTrailTable,
    };
  },
});
</script>
<style lang="scss" scoped>
.my-student-new-wrap {
  padding: 10px;
  .board-wrap {
    height: 40px;
    line-height: 40px;
    padding-right: 20px;
    cursor: pointer;
    position: relative;
    z-index: 1;
    float: right;
    .el-icon-s-data {
      color: #7580e5;
    }
    .el-icon-question {
      color: #ccc;
    }
  }
}
</style>
