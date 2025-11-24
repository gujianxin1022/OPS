<template>
  <el-dialog
    :title="$t('新增')"
    :visible.sync="visible"
    @close="closeDialog"
    center
    :close-on-click-modal="false"
  >

    <el-form
      :model="formState"
      ref="formRef"
      label-width="140px"
    >
      <el-form-item
        :label="$t('用户id')"
        prop="userId"
        :rules="[
      { required: true, message: $t('请输入')},
    ]"
      >
        <el-input
          style="width:300px"
          type="text"
          v-model="formState.userId"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('消息类型')"
        prop="msgTypeList"
        :rules="[
      { required: true, message: $t('请选择'), trigger:'blur'},
    ]"
      >
        <el-select
          style="width:300px"
          multiple
          clearable
          :placeholder="$t('请选择')"
          v-model="formState.msgTypeList"
        >
          <el-option
            v-for="item in msgTypes"
            :key="item.id"
            :label="isEn ? getTranslateText(item.name, languageList) : item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('任务范围')"
        prop="taskRange"
        :rules="[
      { required: true, message: $t('请选择')},
    ]"
      >
        <el-select
          clearable
          :placeholder="$t('请选择')"
          v-model="formState.taskRange"
          style="width:300px"
        >
          <el-option
            v-for="item in taskmain"
            :key="item.id"
            :label="isEn ? getTranslateText(item.name, languageList) : item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="formState.taskRange === -1"
        :label="$t('指定任务')"
        prop="taskId"
        :rules="[
      { required: true, message: $t('请选择')},
    ]"
      >
        <el-select
          clearable
          filterable
          :placeholder="$t('请选择')"
          v-model="formState.taskId"
          style="width:300px"
        >
          <el-option
            v-for="item in task"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="closeDialog">{{$t('取消')}}</el-button>
        <el-button
          @click="beforeSubmit"
          type="primary"
        >{{$t('确认')}}</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>
<script>
import { reactive, ref, onMounted, computed, toRefs, watch } from "@vue/composition-api";
import constants from "../data/constants";
const {
  getTranslateText,
  taskRangeList,
} = constants;
import {
  getTaskListForRedUSer,
  getMsgTypes
} from '@/api/notificationManagement'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    languageList: {
      type: Array,
      default: []
    },
    channelList: {
      type: Array,
      default: []
    }
  },
  setup (props, { root, refs, emit }) {
    const userName = JSON.parse(window.localStorage.getItem("userInfo")).username
    const isEn = computed(() => root.$store.getters.currentLang === 'en');
    const formState = reactive({
      msgTypeList: [],
      taskRange: void 0,
      taskId: void 0,
      userId: void 0
    })

    const taskListObj = reactive({
      taskmain: [],
      task: []
    })

    const msgTypes = ref(null)

    const closeDialog = () => {
      emit('update:visible', false)
    }

    const beforeSubmit = () => {
      refs.formRef.validate((valid) => {
        if (valid) {
          submit()
        } else {
          return false
        }
      });
    }

    const gettaskListObj = async () => {
      Object.assign(taskListObj, await getTaskListForRedUSer())
    }

    const getMsgTypeList = async () => {
      msgTypes.value = await getMsgTypes()
    }

    const submit = () => {
      const params = {
        createUser: userName,
        updateUser: userName,
        userId: formState.userId,
        taskId: formState.taskRange === -1 ? formState.taskId : formState.taskRange,
        msgTypeList: formState.msgTypeList
      }
      root.$Api.notificationManagement.addRedItem(params).then(({ status, data: { data, code } }) => {
        if (code !== 200 || status !== 200) return Promise.reject()
        root.$notify.success(root.$t('操作成功'))
        emit('addCb')
        root.$router.push({
          name: "redList"
        });
      }).catch(() => {
        root.$notify.error(root.$t('操作失败'))
      })
    }

    onMounted(() => {
      gettaskListObj()
      getMsgTypeList()
    })

    return {
      ...toRefs(taskListObj),
      formState,
      msgTypes,
      taskRangeList,
      isEn,
      closeDialog,
      submit,
      beforeSubmit,
      getTranslateText,
    };
  },
};
</script>

<style scoped lang="scss">
</style>