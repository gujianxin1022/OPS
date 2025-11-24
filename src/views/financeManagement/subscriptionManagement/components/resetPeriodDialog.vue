<template>
  <div>
    <el-dialog
      :title="$t('重置账期')"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          ref="resetPeriodForm" 
          :model="formData"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item :label="$t('选择日期')" prop="trialEndTime">
            <el-date-picker
              v-model="formData.trialEndTime"
              type="date"
              :picker-options="pickerOptions"
              :placeholder="$t('选择日期')"
              @change="changeTime"
            />
            <!-- {{DateTimeUtils.dateClockTime(subscribeEndTime)}} -->
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{$t('取消')}}</el-button>
        <el-button type="primary" :loading="loading" @click="confirm">{{$t('确定')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, toRefs, watch, computed, onMounted } from "@vue/composition-api";

export default {
  props: {
    dialogVisible: {type: Boolean, default: false},
    subscriptionId: {type: Number, default: -1},
    subscribeEndTime: {type: String, default: null}
  },
  setup(props, { root, emit, refs }) {
    const loading = ref(false);
    const formData = reactive({
      trialEndTime: ""
    });
    const rules = reactive({
      trialEndTime: [{ required: true, message: root.$t('请选择'), trigger: 'change' }]
    });
    const pickerOptions = reactive({
      disabledDate(time) {
        return time.getTime() <= Date.now(); // 禁止选着账单日当前及以前的时间 new Date(props.subscribeEndTime).getTime()
      },
    })

    const changeTime = (val) => {
      formData.trialEndTime = new Date(val).toISOString();
    }

    const confirm = () => {
      refs.resetPeriodForm.validate((valid) => {
        if (valid) {
          let params = {
            subscriptionId: props.subscriptionId,
            ...formData,
          }
          loading.value = true;
          root.$Api.financeManagement.updateTrialEnd(params).then(({status, data: {code, data}}) => {
            if( status == 200 && code == 200 ) {
              root.$notify.success('操作成功');
              handleClose();
              emit('updateTable');
            }
          }).finally(() => loading.value = false);
        }
      });
    }

    const handleClose = () => {
      emit('update:dialogVisible', false);
      refs.resetPeriodForm.resetFields();
    }

    return {
      loading,
      formData,
      rules,
      pickerOptions,
      changeTime,
      handleClose,
      confirm
    }
  }
}
</script>

<style lang='scss' scoped>
</style>