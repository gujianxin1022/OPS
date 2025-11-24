<template>
  <div class="abnormal-class-pay" v-loading="loading">
    <section>
      <div class="flex-wrapper" style="font-size: 14px">
        <p class="mb5">{{ $t("提醒") }}：</p>
        <div>
          <p class="mb5">
            {{
              $t("课堂为异常的时候，按照异常课堂薪酬来计算，不走正常课堂的薪酬")
            }}
          </p>
          <p v-if="salaryUnit == 2" class="mb5">
            {{ $t("以下配置的薪酬单位都为人民币/CNY") }}
          </p>
          <p v-if="salaryUnit == 3" class="mb5">
            {{ $t("以下配置的薪酬单位都为美元/USD") }}
          </p>
        </div>
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
          :span-method="handleMergeCell"
          :key="index"
        >
          <el-table-column :label="$t('课堂类型')">
            <template slot-scope="{ row }">
              {{ row.courseType === 1 ? $t("正式课") : $t("试听课") }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('课程时长(分钟)')">
            <template slot-scope="{ row }">
              {{ row.lessonsTime / 60 }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('老师类型')">
            <template slot-scope="{ row }">
              {{ row.teacherFullWork === 1 ? $t("全职") : $t("兼职") }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('学生/老师均未出席')">
            <template slot-scope="{ row, $index }">
              <template v-if="isEdit">
                <el-form-item
                  :show-message="false"
                  :rules="{ required: true, trigger: 'blur' }"
                  :prop="'data.' + $index + `.rewardRule.SNTN`"
                >
                  <el-input-number
                    v-model="row.rewardRule.SNTN"
                    :controls="false"
                    :max="9999.99"
                    :precision="2"
                    :placeholder="$t('请输入')"
                  />
                </el-form-item>
              </template>
              <template v-else>
                {{ row.rewardRule.SNTN }}
              </template>
            </template>
          </el-table-column>
          <el-table-column :label="$t('学生未出席，老师出席')">
            <template slot-scope="{ row, $index }">
              <template v-if="row.courseType === 1 && row.classType === 2">
                {{ $t("正常课堂") }}
              </template>
              <template v-else-if="isEdit">
                <el-form-item
                  :show-message="false"
                  :rules="{ required: true, trigger: 'blur' }"
                  :prop="'data.' + $index + `.rewardRule.SNTY`"
                >
                  <el-input-number
                    v-model="row.rewardRule.SNTY"
                    :controls="false"
                    :max="9999.99"
                    :precision="2"
                    :placeholder="$t('请输入')"
                  />
                </el-form-item>
              </template>
              <template v-else>
                {{ row.rewardRule.SNTY }}
              </template>
            </template>
          </el-table-column>
          <el-table-column :label="$t('老师未出席，学生出席')">
            <template slot-scope="{ row, $index }">
              <template v-if="isEdit">
                <el-form-item
                  :show-message="false"
                  :rules="{ required: true, trigger: 'blur' }"
                  :prop="'data.' + $index + `.rewardRule.SYTN`"
                >
                  <el-input-number
                    v-model="row.rewardRule.SYTN"
                    :controls="false"
                    :max="9999.99"
                    :precision="2"
                    :placeholder="$t('请输入')"
                  />
                </el-form-item>
              </template>
              <template v-else>
                {{ row.rewardRule.SYTN }}
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
  updateChineseAbnormalClassroomRules,
  queryChineseAbnormalClassroomRules,
} from "@/api/tutorManagement";

const { id: userId } = JSON.parse(localStorage.userInfo);

export default {
  setup(props, { refs }) {
    const isEdit = ref(false);
    const loading = ref(true);
    const saveLoading = ref(false);

    const tableState = ref([
      { title: "1v1课堂", data: [] },
      { title: "小班课", data: [] },
    ]);

    const handleCancel = () => {
      isEdit.value = false;
      queryTableList();
    };

    const handleSave = async () => {
      await Promise.all(
        tableState.value.map((_, idx) => refs[`form_${idx}`][0].validate())
      );

      saveLoading.value = true;

      const params = unref(tableState).reduce((a, b) => {
        const data = b.data.map((v) => ({
          ...v,
          rewardRule: JSON.stringify(v.rewardRule),
        }));
        return [...a, ...data];
      }, []);

      await updateChineseAbnormalClassroomRules(userId, params).finally(
        () => (saveLoading.value = false)
      );

      queryTableList();

      isEdit.value = false;
    };

    const handleMergeCell = ({ rowIndex, columnIndex }) => {
      if (columnIndex === 0) return rowIndex % 4 === 0 ? [4, 1] : [0, 0];
      if (columnIndex === 1) return rowIndex % 2 === 0 ? [2, 1] : [0, 0];
    };

    const salaryUnit = ref(null);

    const queryTableList = async () => {
      try {
        loading.value = true;
        const data = await queryChineseAbnormalClassroomRules();
        tableState.value[0]["data"] = data.oneVoneClass;
        tableState.value[1]["data"] = data.smallClass;
        console.log(data);
        salaryUnit.value = data.salaryUnit;
      } finally {
        loading.value = false;
      }
    };

    onMounted(queryTableList);

    return {
      isEdit,
      loading,
      saveLoading,
      tableState,
      salaryUnit,
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
