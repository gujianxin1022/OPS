<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :before-close="closeVideoTypeChange"
    center
    top="10vh"
    width="30%"
    :close-on-click-modal="false"
    :title="$t('视频主题变更')"
  >
    <el-form ref="videoTypeChangeForm" :model="videoTypeChangeForm" :rules="videoTypeChangeRules">
      <el-form-item :label="$t('视频主题')" prop="courseTopicId">
        <el-select
          v-model="videoTypeChangeForm.courseTopicId"
          :placeholder="$t('请选择')"
          style="width:200px"
        >
          <el-option
            v-for="item in videoTypesOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSureChangeType('videoTypeChangeForm')">{{$t('确认保存')}}</el-button>
      <el-button @click="closeVideoTypeChange">{{$t('取消')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { reactive, onMounted } from '@vue/composition-api';

export default {
  props: {
    dialogVisible: {type: Boolean, default: false},
    currentEditViode: {type: Object, default: () => ({})},
    videoTypesOptions: {type: Array, default: () => ([])},
  },
  setup(props, {root, emit, refs}) {
    const videoTypeChangeRules = {
      courseTopicId: [{required: true, message: '请选择'}]
    };
    const videoTypeChangeForm = reactive({
      courseTopicId: ''
    });

    // 初始话内容回显
    const initData = () => {
      videoTypeChangeForm.courseTopicId = props.currentEditViode.courseTopicId;
    };

    // 确认保存
    const handleSureChangeType = (formName) => {
      refs[formName].validate((valid) => {
        if (valid) {
          let videoId = props.currentEditViode.id;
          let oldTopicId = props.currentEditViode.courseTopicId;
          let topicId = videoTypeChangeForm.courseTopicId;
          root.$Api.teacherManagement.updatedVideoTopic(videoId, topicId, oldTopicId).then(({status, data}) => {
            if (status == 200 && data.code == 200) {
              closeVideoTypeChange()
              root.$notify({
                type: 'success',
                message: '修改视频主题成功'
              })
              emit("getTableData");
            }
            else {
              root.$notify({
                type: 'error',
                message: '修改视频主题失败'
              })
            }
          })
        }
      })
    };

    // 关闭弹框
    const closeVideoTypeChange = () => {
      emit("clearCurrentEditViode");
      emit("update:dialogVisible", false);
      refs['videoTypeChangeForm'].resetFields();
    };

    onMounted(() => {
      initData();
    });

    return {
      videoTypeChangeRules,
      videoTypeChangeForm,
      handleSureChangeType,
      closeVideoTypeChange,
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  max-height: 500px;
  overflow: auto;
}
</style>