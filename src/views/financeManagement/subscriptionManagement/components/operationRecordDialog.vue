<template>
  <div>
    <el-dialog
      :title="$t('操作记录')"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        <el-table
          v-loading="loading"
          tooltip-effect="dark"
          :data="tableList"
          style="width: 100%; margin-top: 20px"
          stripe
          :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        >
          <el-table-column
            v-for="item in tableColumn"
            :key="item.label"
            :label="item.label"
            :prop="item.prop"
            :width="item.width ? item.width : 'auto'"
          >
            <template slot-scope="scope">
              <span v-if="item.prop === 'createTime'">{{DateTimeUtils.dateClockTime(scope.row[item.prop])}}</span>
              <span v-else-if="item.prop === 'operationRecord'">
                {{getOperationRecord(scope.row[item.prop])}}
              </span>
              <template v-else>{{scope.row[item.prop] || '--'}}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">{{$t('关闭')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, toRefs, watch, computed, onMounted } from "@vue/composition-api";

export default {
  props: {
    dialogVisible: {type: Boolean, default: false},
    subscriptionId: {type: Number, default: -1}
  },
  setup(props, { root, emit, refs }) {
    const tableObj = reactive({
      tableList: [],
      // pageSize: 50,
      // pageNum: 1,
      // total: 0,
      loading: false,
      tableColumn: computed(() => [
        {label: root.$t("操作时间"), prop: "createTime"},
        {label: root.$t("操作人"), prop: "createUserName", width: '120px'},
        {label: root.$t("operationRecordDialog 操作记录"), prop: "operationRecord", width: '120px'},
      ])
    });

    const handleClose = () => {
      emit('update:dialogVisible', false)
    }

    const getOperationRecord = (val) => {
      switch (val) {
        case 0: return root.$t('status 创建订阅卡');
        case 1: return root.$t('status 订阅成功');
        case 2: return root.$t('status 学管取消订阅');
        case 3: return root.$t('status 用户取消订阅');
        case 4: return root.$t('status 发送通知');
        case 5: return root.$t('status 变更账期日');
        default: return '--';
      }
    }
    
    const getTableListt = () => {
      tableObj.loading = true;
      let params = {
        subscriptionId: props.subscriptionId,
      };
      root.$Api.financeManagement.subscribeLogList(params).then(({status, data: {code, data}}) => {
				if( status == 200 && code == 200 ) {
          tableObj.tableList = data;
				}
			}).finally(() => tableObj.loading = false);
    }

    onMounted(() => {
      getTableListt()
    })

    return {
      ...toRefs(tableObj),
      handleClose,
      getOperationRecord,
    }
  }
}
</script>

<style lang='scss' scoped>
</style>