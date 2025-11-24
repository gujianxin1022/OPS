<template>
  <div>
    <el-dialog
      :title="$t('终止订阅 btn')"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        {{$t('终止订阅后，我们将不再自动扣款，同时不会再为用户发放课时。')}}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="handleEnd">{{$t('终止订阅 btn')}}</el-button>
        <el-button @click="handleClose">{{$t('取消')}}</el-button>
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
    const loading = ref(false);

    const handleEnd = () => {
      loading.value = true;
      root.$Api.financeManagement.cancelSubscribe({subscriptionId: props.subscriptionId}).then(({status, data: {code, data}}) => {
				if( status == 200 && code == 200 ) {
          root.$notify.success('操作成功');
          handleClose();
          emit('updateTable');
				}
			}).finally(() => {loading.value = false})
    }

    const handleClose = () => {
      emit('update:dialogVisible', false)
    }

    return {
      loading,
      handleEnd,
      handleClose,
    }
  }
}
</script>

<style lang='scss' scoped>
</style>