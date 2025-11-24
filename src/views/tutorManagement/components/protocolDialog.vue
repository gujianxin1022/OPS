<template>
  <div>
    <el-dialog
      :title="$t('服务协议')"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <main>
        <el-table
          :data="tutorContractList"
          style="width: 100%"
          max-height="350"
        >
          <el-table-column
            v-for="col in tableColumn"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :width="col.width ? col.width : 'auto'"
          >
            <template slot-scope="scope">
              <span v-if="col.prop === 'createTime'">
                {{DateTimeUtils.handleOtherTimesError(scope.row[col.prop])}} 
              </span>
              <span v-else-if="col.prop === 'startTime'">
                {{DateTimeUtils.handleOtherTimesError(scope.row.startTime)}} - {{DateTimeUtils.handleOtherTimesError(scope.row.endTime)}}  
              </span>
              <span v-else-if="col.prop === 'status'">
                {{getContractStatus(scope.row[col.prop])}} 
              </span>
              <span v-else-if="col.prop === 'agreementUrl'">
                <el-button type="text" @click="goRead(scope.row[col.prop])">{{$t('查看合同')}}</el-button>
              </span>
              <template v-else>{{scope.row[col.prop]}}</template>
            </template>
          </el-table-column>
        </el-table>
      </main>
    </el-dialog>
  </div>
</template>

<script>
import { computed } from "@vue/composition-api";

export default {
  props: {
    dialogVisible: {type: Boolean, default: false},
    tutorContractList: {type: Array, default: () => ([])}
  },
  setup(props, { root, emit, refs }) {
    const tableColumn = computed(() => [
      {label: root.$t("签约日期"), prop: "createTime"},
      {label: root.$t("生效日期"), prop: "startTime", width: "260"},
      {label: root.$t("合同状态"), prop: "status"},
      {label: root.$t("查看合同"), prop: "agreementUrl"},
  ])

    const handleClose = () => {
      emit('update:dialogVisible', false)
    }

    const getContractStatus = (val) => {
      switch (val) {
        case 0: return root.$t('protocolDialog 生效中');
        case 1: return root.$t('已过期');
        case 2: return root.$t('未生效');
        default: return '--'
      }
    }

    const goRead = (url) => {
      window.open(url, '__blank');
    }

    return {
      tableColumn,
      handleClose,
      getContractStatus,
      goRead,
    }
  }
}
</script>