<template>
  <div v-loading="loading" style="min-height: 300px">
    <header class="mt20">
      <el-radio-group v-model="coursePackageId">
        <el-radio-button
          v-for="productItem in productList"
          :key="productItem.coursePackageId"
          :label="productItem.coursePackageId"
        >
          {{
            `${
              productItem[isZh ? "coursePackageName" : "coursePackageNameEn"]
            } (${productItem.totalRemainingAmount})`
          }}
        </el-radio-button>
      </el-radio-group>
      <el-button
        type="primary"
        v-if="
          Per.handleButtonPer('teach.studentMT.parentInfo.classHoursConversion')
        "
        @click="visible = true"
      >
        {{ $t("课时转换") }}
      </el-button>
    </header>
    <el-tabs
      v-if="coursePackageId !== void 0"
      :key="coursePackageId"
      v-model="activeClassHourTab"
    >
      <el-tab-pane
        key="remainingClassHoursDetails"
        name="remainingClassHoursDetails"
        :label="$t('剩余课时明细')"
      >
        <RemainingClassHoursDetails
          v-if="activeClassHourTab === 'remainingClassHoursDetails'"
          :key="refreshKey"
          :balanceTotal="balanceTotal"
          :studentUserId="studentId"
          :coursePackageId="coursePackageId"
          @refresh="handleRefresh"
        />
      </el-tab-pane>
      <el-tab-pane
        key="classHourFlow"
        name="classHourFlow"
        :label="$t('课时流水')"
      >
        <ClassHourFlow
          v-if="activeClassHourTab === 'classHourFlow'"
          :key="refreshKey"
          :studentUserId="studentId"
          :coursePackageId="coursePackageId"
        />
      </el-tab-pane>
      <el-tab-pane
        key="classTimeExpires"
        name="classTimeExpires"
        :label="$t('失效课时')"
      >
        <ClassTimeExpires
          v-if="activeClassHourTab === 'classTimeExpires'"
          :key="refreshKey"
          :studentUserId="studentId"
          :coursePackageId="coursePackageId"
        />
      </el-tab-pane>
    </el-tabs>
    <ClassHourConversion
      v-if="visible"
      :studentId="studentId"
      :visible.sync="visible"
      @ok="handleRefresh"
      :parentUserId="parentUserId"
    />
  </div>
</template>
<script>
import { computed, onMounted, ref, unref, watch } from "@vue/composition-api";

import ClassHourFlow from "./components/ClassHourFlow";
import ClassTimeExpires from "./components/ClassTimeExpires";
import RemainingClassHoursDetails from "./components/RemainingClassHoursDetails";
import ClassHourConversion from "./components/ClassHourConversion";

export default {
  components: {
    ClassHourFlow,
    RemainingClassHoursDetails,
    ClassHourConversion,
    ClassTimeExpires,
  },
  props: {
    studentId: {
      type: String,
      default: void 0,
    },
    parentUserId:{
      type: String,
      default: void 0,
    }
  },
  setup(props, { root }) {
    const isZh = computed(() => root.$store.state.app.currentLang === "zh");

    const balanceTotal = computed(
      () =>
        unref(productList).find(
          (v) => v.coursePackageId === unref(coursePackageId)
        )?.totalRemainingAmount
    );

    const visible = ref(false);
    const refreshKey = ref(0);
    const loading = ref(true);
    const productList = ref([]);
    const coursePackageId = ref(
      root.$route.query.coursePackageId
        ? +root.$route.query.coursePackageId
        : void 0
    );
    const activeClassHourTab = ref("remainingClassHoursDetails");

    const getStudentProductList = async () => {
      loading.value = true;
      const {
        status,
        data: { code, data },
      } = await root.$Api.studentManagement.queryStudentAccountInfo({
        studentUserId: props.studentId,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      loading.value = false;
      productList.value = data ?? [];
      if (unref(coursePackageId) !== void 0) return;
      if (data?.length) coursePackageId.value = data[0].coursePackageId;
    };

    const handleRefresh = async () => {
      await getStudentProductList();
      refreshKey.value += 1;
    };

    watch(
      coursePackageId,
      () => (activeClassHourTab.value = "remainingClassHoursDetails")
    );

    onMounted(getStudentProductList);

    return {
      isZh,
      refreshKey,
      visible,
      loading,
      balanceTotal,
      productList,
      coursePackageId,
      activeClassHourTab,
      parentUserId:props.parentUserId,

      getStudentProductList,
      handleRefresh,
    };
  },
};
</script>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
::v-deep .el-tabs__active-bar {
  width: 0px !important;
}
::v-deep .el-tabs__nav-wrap::after {
  width: 0px !important;
}
::v-deep .el-tabs__header {
  margin: 10px 0;
}
</style>
