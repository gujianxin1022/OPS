<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      top="10vh"
      width="480px"
      :before-close="handleClose">
      <div
        class="portWrap"
        v-loading="loading"
        element-loading-spinner="el-icon-loading"
        element-loading-text="加载中"
        element-loading-background="rgba(20, 34, 58, 0.8)"
      >
        <el-form
          :model="formData"
          :rules="rules"
          ref="formData"
          label-width="auto"
        >
          <el-form-item :label="$t('主题名称')" prop="title">
            <el-input v-model.trim="formData.title" maxlength="30" show-word-limit :placeholder="$t('请输入主题名称')" />
          </el-form-item>
          <el-form-item :label="$t('英文名称')" prop="titleEn">
            <el-input v-model="formData.titleEn" maxlength="120" show-word-limit :placeholder="$t('请输入英文名称')" />
          </el-form-item>
          <el-form-item :label="$t('关联课程树')" prop="couresTree">
            <el-cascader
              v-model="formData.couresTree"
              :options="editionAndLevelInfo"
              :props="cascaderProps"
              :placeholder="$t('请选择课程树')"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{$t('取消')}}</el-button>
        <el-button type="primary" @click="confirm">{{$t('确定')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from '@vue/composition-api';
import { ENUM_VAL } from "../constants";
import { hooksFun } from './hooks';

export default {
  props: {
    dialogVisible: {type: Boolean, default: false},
    type: {type: Number, default: 0},
    themeMsg: {type: Object, default: () => ({})}
  },
  setup(props, {root, emit, refs}) {
    const localeLanguage = window.localStorage.getItem('localeLanguage');
    const { processCascader } = hooksFun(root, localeLanguage);
    const formData = reactive({
      title: '',
      titleEn: '',
      couresTree: [],
    });
    const cascaderProps = { multiple: true };
    const loading = ref(false);
    // 校验主题名称
    const validateThemeName = async (rule, value, callback) => {
      if (!value) {
        callback(new Error(root.$t('请输入主题名称')));
      } else {
        // 校验是否重复
        let params = props.type === ENUM_VAL.edit
          ? {topicId: props.themeMsg.id, title: value}
          : {title: value};
        await root.$Api.teacherManagement.searchThemeNme(params).then(({data: {code, data}}) => {
          if (code === 200) {
            data ? callback(new Error(root.$t('主题名称已存在'))) : callback()
          }
        })
      }
    }
    const rules = {
      title: [{ required: true, validator: validateThemeName, trigger: 'blur' }],
      titleEn: [{ required: true, validator: validateThemeName, trigger: 'blur' }]
    };
    const dialogTitle = computed(() => props.type === ENUM_VAL.edit ? '编辑主题' : '新建主题');
    // 确定
    const confirm = async () => {
      await refs['formData'].validate();
      let courseIdList = [];
      if (formData.couresTree.length) {
        formData.couresTree.forEach(item => {
          courseIdList.push(item[item.length - 1]);
        });
      };
      let params = props.type === ENUM_VAL.edit
        ? {id: props.themeMsg.id, ...formData, courseIdList}
        : {...formData, courseIdList};
      let interApi = props.type === ENUM_VAL.edit
        ? root.$Api.teacherManagement.editTheme(params)
        : root.$Api.teacherManagement.addTheme(params);
      interApi.then(({data: {code, data}}) => {
        if (code === 200) {
          root.$message.success(data);
          handleClose();
          emit("getTableList");
        }
      }); 
    };
    // 关闭弹框
    const handleClose = () => {
      emit("update:dialogVisible", false);
      refs['formData'].resetFields();
    };
    // 获取编辑回显数据
    const getEditData = () => {
      loading.value = true;
      root.$Api.teacherManagement.editThemeData(props.themeMsg.id).then(({data: {code, data}}) => {
        if (code === 200) {
          formData.title = data.courseTopic?.title;
          formData.titleEn = data.courseTopic?.titleEn;
          formData.couresTree = data.courseList;
        }
      }).finally(() => loading.value = false);
    }
    const editionAndLevelInfo = ref([]);
    const initData = async () => {
      let {state, data: {code, data}} = await root.$Api.base.courseEdition();
      if (code !== 200) return Promise.reject();
      editionAndLevelInfo.value = processCascader(data);
      if (props.type === ENUM_VAL.edit) {
        getEditData()
      }
    };

    onMounted(initData);

    return {
      formData,
      rules,
      dialogTitle,
      editionAndLevelInfo,
      cascaderProps,
      loading,
      confirm,
      handleClose,
      ENUM_VAL,
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  max-height: 500px;
  overflow: auto;
  .el-input--small {
    .el-input__inner {
      padding: 0 60px 0 15px;
    }
  }
}
</style>