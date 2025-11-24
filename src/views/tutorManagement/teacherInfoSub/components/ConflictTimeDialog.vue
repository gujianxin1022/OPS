<template>
  <el-dialog
    :show-close="true"
    :visible.sync="show"
    :before-close="close"
    :close-on-click-modal="false"
    width="600px"
    append-to-body
    custom-class="about-class-dialog"
    :title="$t('温馨提示')"
    center
  >
    <div style="line-height: 20px">
      {{
        $t(
          "由于老师该时段中部分时间被其他学生预约，不能批量操作；您可以参考下方被占时间重新选择其他时间进行批量约课。"
        )
      }}
    </div>
    <br />
    <div>
      <span class="mb20">{{ $t("老师被占的时间") }}:</span>
      <el-table
        v-loading="loading"
        :data="conflictTimeData.dateList"
        tooltip-effect="dark"
        :border="false"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        class="attend-table"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed align="center" :label="$t('序号')" :width="80">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          :label="$t('上课时间')"
          :min-width="180"
        >
          <template slot-scope="scope"
            >{{ DateTimeUtils.dateClockTime(scope.row.start) }}~{{
              DateTimeUtils.dateClockTime(scope.row.end)
            }}</template
          >
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" @click="close" class="dialog-footer">
      <el-button type="primary">{{ $t("知道啦") }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  ref,
} from "@vue/composition-api";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: {},
    },
  },
  setup(props, { root, emit }) {
    const conflictTimeData = ref(props.data);
    const close = () => {
      emit("close");
    };

    return {
      conflictTimeData,
      show: props.show,
      close,
    };
  },
};
</script>
