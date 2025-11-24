<template>
  <div class="deal-level-appeal-wrap">
    <div class="page-title">
      {{ readOnly ? $t("已经处理过的申诉") : $t("处理等级申诉") }}
    </div>
    <div class="opt-btn" v-if="!readOnly">
      <el-space>
        <el-button
          type="primary"
          :disabled="!tableData.length"
          @click="beforeSubmit"
          >{{ $t("提交") }}
        </el-button>
      </el-space>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      size="small"
      v-loading="isLoading"
    >
      <el-table-column align="center" :label="$t('序号')" fixed>
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="studentName"
        :label="$t('学生姓名')"
        fixed
      >
        <template slot-scope="scope">
          <el-button
            @click="
              goStudentDetail(scope.row.studentUserId, scope.row.studentName)
            "
            type="text"
            >{{ scope.row.studentName || "-" }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('申诉老师')"
        prop="appealUserName"
      >
      </el-table-column>
      <template v-if="appealType == APPEAL_TYPE.ADD">
        <el-table-column
          align="center"
          :label="$t('师生首次上课时间')"
          prop="firstFinishCourseTime"
        >
          <template slot-scope="{ row }">
            <span>{{
              DateTimeUtils.dateClockTime(row.firstFinishCourseTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="totalCourseTimes"
          :label="$t('师生上课次数')"
        >
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column
          align="center"
          :label="$t('首次跟随时间')"
          prop="followSettlementTime"
        >
          <template slot-scope="{ row }">
            <span>{{
              DateTimeUtils.dateClockTime(row.followSettlementTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="quarterCourseTimes"
          :label="$t('季度已完结课次数')"
        >
        </el-table-column>
      </template>
      <el-table-column align="center" :label="$t('申诉类型')" prop="appealType">
        <template slot-scope="{ row }">
          <span v-if="row.appealType || row.appealType === APPEAL_TYPE.ADD">
            {{ row.appealType === APPEAL_TYPE.ADD ? $t("添加") : $t("移除") }}
          </span>
          <span v-else>---</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('申诉原因')"
        prop="appealReason"
      >
        <template slot-scope="{ row }">
          {{ Filters.getDealCauseEnum(row.appealReason) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('申诉理由')"
        prop="appealReasonDetail"
        minWidth="140"
      >
        <template slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.appealReasonDetail"
            placement="top"
          >
            <span>
              {{ row.appealReasonDetail }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="handleReason"
        :label="$t('处理原因')"
        width="150"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-select
            v-if="!readOnly"
            clearable
            size="small"
            v-model="row.handleReason"
          >
            <el-option
              v-for="item in Constants.getDealReasonType()"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <span v-else>{{ Filters.getDealCauseEnum(row.handleReason) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="reason"
        :label="$t('处理理由')"
        width="200"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-input
            type="textarea"
            :rows="2"
            v-if="!readOnly"
            :placeholder="$t('最多输入不超过50字')"
            size="small"
            maxlength="50"
            show-word-limit
            v-model="row.handleReasonDetail"
          >
          </el-input>
          <span v-else>{{ row.handleReasonDetail }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('操作')"
        prop="appealResult"
        width="150"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-select
            v-if="!readOnly"
            clearable
            size="small"
            v-model="row.appealResult"
          >
            <el-option
              v-for="item in Constants.getDealAppealResultType(isEn)"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <span v-else>{{
            Filters.getDealResultEnum(row.appealResult, isEn)
          }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  computed,
  onMounted,
} from "@vue/composition-api";
import Constants from "@/utils/constants";
import { APPEAL_TYPE, DEFAULT_VALUE } from "./constants";

export default defineComponent({
  setup(_, { root, emit }) {
    const userId = JSON.parse(window.localStorage.getItem("userInfo")).id;
    const isLoading = ref(false);
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const appealType = ref(APPEAL_TYPE.ADD);
    const readOnly = ref(true);
    const tableData = ref([]);

    const goStudentDetail = (studentId, studentName) => {
      root.$router.push(
        `/studentManagement/studentInfo?studentId=${studentId}&studentName=${studentName}`
      );
    };

    const getData = (ids) => {
      isLoading.value = true;
      root.$Api.appealManagement
        .getLevelAppealInfo(ids)
        .then(({ data }) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          data.data.forEach((t) => {
            t.handleReason = t.handleReason || DEFAULT_VALUE.DEAL_CAUSE;
            t.appealResult = t.appealResult || DEFAULT_VALUE.DEAL;
          });
          tableData.value = data.data;
          isLoading.value = false;
        })
        .catch(() => {
          isLoading.value = false;
          tableData.value = [];
        });
    };

    const submit = () => {
      try {
        isLoading.value = true;
        const submitParams = tableData.value.map((t) => {
          return {
            appealResult: t.appealResult,
            handleReasonDetail: t.handleReasonDetail,
            appealReason: t.appealReason,
            handleReason: t.handleReason,
            followId: t.followId,
            id: t.id,
          };
        });
        root.$Api.appealManagement
          .submitLevelAppeal(userId, submitParams, appealType.value)
          .then(({ data }) => {
            if (data.code !== 200) return Promise.reject();
            root.$notify({
              message: root.$t("提交成功"),
              type: "success",
            });
            isLoading.value = false;
            setTimeout(() => {
              root.$router.push("/appealManagement/levelAppeal");
            }, 500);
          })
          .catch(() => {
            isLoading.value = false;
          });
      } catch (e) {
        console.log(e);
      }
    };

    const beforeSubmit = () => {
      const data = tableData.value;
      let ids = [];
      data.map((t, i) => {
        if (!t.handleReasonDetail) {
          ids.push(i + 1);
        }
      });
      const isValidate = !ids.length;
      root
        .$msgbox({
          title: root.$t("提醒"),
          message: isValidate ? (
            root.$t("确认提交")
          ) : (
            <div>
              <p>第{ids.join("、")} 个学生尚未填写处理理由，请填写后提交。</p>
            </div>
          ),
          showCancelButton: !!isValidate,
          confirmButtonText: root.$t("确定"),
        })
        .then(() => {
          isValidate && submit();
        })
        .catch(() => {});
    };

    onMounted(() => {
      const { read, ids, type } = root.$route.query;
      readOnly.value = !!read;
      appealType.value = type;
      getData(ids);
    });
    return {
      APPEAL_TYPE,
      appealType,
      isLoading,
      readOnly,
      isEn,
      tableData,
      submit,
      beforeSubmit,
      goStudentDetail,
    };
  },
});
</script>

<style lang="scss" scoped>
.deal-level-appeal-wrap {
  padding: 0 20px;
  .opt-btn {
    text-align: right;
    margin-bottom: 15px;
  }
}
</style>
<style lang="scss">
.el-tooltip__popper {
  max-width: 350px !important;
  line-height: 20px;
}
</style>
