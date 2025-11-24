<template>
  <div class="abnormal-class-pay" v-loading="loading">
    <section>
      <div class="flex-wrapper" style="font-size: 14px">
      </div>
      <div>
        <el-button type="primary" v-if="!isEdit" @click="isEdit = true">
          {{ $t("编辑") }}
        </el-button>
        <template v-else>
          <el-button @click="handleCancel">{{ $t("取消") }}</el-button>
          <el-button type="primary" @click="handleSave" :loading="saveLoading">
            {{ $t("保存") }}
          </el-button>
        </template>
      </div>
    </section>
    <div v-for="(item, index) of tableState" :key="item.id">
      <h5>{{ $t(item.title) }}</h5>
      <el-form :model="item" :ref="`form_${index}`">
        <el-table
          border
          :data="item.data"

          :key="index"
        >
          <el-table-column :label="$t(item.column1Name)">
            <template slot-scope="{ row }">
              {{ row.desc }}
            </template>
          </el-table-column>

          <el-table-column :label="$t(item.column2Name)">
            <template slot-scope="{ row, $index }">
              <template v-if="isEdit">
                <el-form-item
                  :show-message="false"
                  :rules="{ required: true, trigger: 'blur' }"
                  :prop="'data.' + $index + `.value`"
                >
                  <el-input-number
                    :placeholder="$t('请输入')"
                    :controls="false"
                    :min="0"
                    :max="MAX_PERCENTAGE"
                    :precision="PERCENTAGE_PRECISION"
                    :disabled="!isEdit"
                    v-model="row.value"
                  />
                  <span>%</span>
                </el-form-item>
              </template>
              <template v-else>
                {{ `${row.value} %` }}
              </template>
            </template>
          </el-table-column>
          
        </el-table>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, unref } from "@vue/composition-api";
import {
  updateOtherRewardPunish,
  queryOtherRewardPunish,
} from "@/api/tutorManagement";

const { id: userId } = JSON.parse(localStorage.userInfo);

const MAX_PERCENTAGE /* 百分比最大值 */ = 100;
const PERCENTAGE_PRECISION /* 百分比小数位 */ = 0;

export default {

  props: ["subjectType"],
  setup(props, { refs }) {
    const isEdit = ref(false);
    const loading = ref(true);
    const saveLoading = ref(false);

    const tableState = ref([
      { title: "老师请假", column1Name: "请假时间距离开课时间X(小时)", column2Name: "薪酬扣款(百分比)", data: [] },
      { title: "学生取消", column1Name: "取消时间距离开课时间X(小时)", column2Name: "薪酬补偿(百分比)", data: [] },
    ]);

    const handleCancel = () => {
      isEdit.value = false;
      queryTableList();
    }

    const handleSave = async () => {
      await Promise.all(
        tableState.value.map((_, idx) => refs[`form_${idx}`][0].validate())
      );

      saveLoading.value = true;

      // const params = unref(tableState).reduce((a, b) => {
      //   const data = b.data.map((v) => ({
      //     ...v,
      //     rewardRule: JSON.stringify(v.rewardRule),
      //   }));
      //   return [...a, ...data];
      // }, []);

      let params = {
        subjectType: props.subjectType,
        tutorLeave: JSON.stringify(tableState.value[0]["data"]),
        studentCancel: JSON.stringify(tableState.value[1]["data"]),
      }
      await updateOtherRewardPunish(params).finally(
        () => (saveLoading.value = false)
      );

      queryTableList();

      isEdit.value = false;
    };

    const handleMergeCell = ({ rowIndex, columnIndex }) => {
      if (columnIndex === 0) return rowIndex % 4 === 0 ? [4, 1] : [0, 0];
      if (columnIndex === 1) return rowIndex % 2 === 0 ? [2, 1] : [0, 0];
    };

    const queryTableList = async () => {
      try {
        loading.value = true;
        const data = await queryOtherRewardPunish({subjectType: props.subjectType});
        tableState.value[0]["data"] = data && data.tutorLeave ? JSON.parse(data.tutorLeave) : [];
        tableState.value[1]["data"] = data && data.studentCancel ? JSON.parse(data.studentCancel) : [];
      } finally {
        loading.value = false;
      }
    };

    onMounted(queryTableList);

    return {
      MAX_PERCENTAGE,
      PERCENTAGE_PRECISION,

      isEdit,
      loading,
      saveLoading,
      tableState,

      handleCancel,
      handleSave,
      handleMergeCell,
    };
  },
};
</script>

<style lang="scss" scoped>
.abnormal-class-pay {
  section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    color: #e6a23c;
  }
  .el-form-item {
    margin-bottom: 0;
    .el-input-number {
      width: auto;
    }
  }
}
</style>
