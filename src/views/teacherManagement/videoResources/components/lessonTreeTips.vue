<template>
  <el-dialog
    :title="$t('提示')"
    :visible.sync="dialogVisible"
    width="420px"
    :before-close="closeDialog">
    <main class="main">
      <dl v-for="(item, key) in repeatData" :key="key" class="repeatData">
        <dt>{{item.title}} {{useType}}使用:</dt>
        <dd>{{item.content}}</dd>
      </dl>
    </main>
    <p class="tips">以上课程树已绑定视频，请确认是否使用新视频替换</p>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="repeatFun()">{{$t('替换')}}</el-button>
      <el-button @click="closeDialog()">{{$t('取消')}}</el-button>
    </span>
  </el-dialog>

</template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import { USE_OPTIONS } from "../constants";

export default {
  props: {
    dialogVisible: {type: Boolean, default: false},
    tipsDialogData: {type: Array, default: []},
    tipsUseType: {type: Number, default: -1},
  },
  setup(props, {root, emit, refs}) {
    const repeatData = ref([]);
    const repeatFun = () => {
      emit("repeatFun", 'child');
      closeDialog();
    };
    const useType = computed(() => {
      return USE_OPTIONS.find(item => item.value === props.tipsUseType).label;
    });

    // 关闭弹框
    const closeDialog = () => {
      emit("update:dialogVisible", false);
    };

    const processRepeatData = () => {
      repeatData.value = props.tipsDialogData.reduce((pre, cur) => {
        let changeArr = cur.split(":")
        pre.push({
          title: changeArr[0],
          content: changeArr[1],
        });
        return pre;
      }, []);
    };

    onMounted(async () => {
      await processRepeatData();
    });

    return {
      repeatData,
      useType,
      closeDialog,
      repeatFun,
    };
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 15px 15px 40px;
  max-height: 300px;
  overflow: auto;
}
.tips {
  width: 90%;
  height: 40px;
  line-height: 40px;
  margin: 0;
  padding: 0 0 0 15px;
  background: #fff;
  position: absolute;
  left: 0;
  bottom: 66px;
  color: red;
}
.repeatData {
  margin: 0 0 15px;
  dt, dd {
    margin: 5px 0;
  }
}
</style>