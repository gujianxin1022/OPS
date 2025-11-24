<template>
  <el-dialog
    @close="closeDialog"
    :title="$t('转班信息确认')"
    :visible.sync="visible"
    center
    append-to-body
    width="800px"
  >
    <el-form
      :model="formState"
      ref="formRef"
      :label-width="isEn ? '200px' : '120px'"
      v-loading="loading"
    >
      <el-form-item
        :label="$t('学员名字')"
        prop="reason"
      >{{refferInfo.studentName || '-'}}
      </el-form-item>
      <el-form-item
        :label="$t('转出班级')"
        prop="reason"
      >
        {{isEn ? leaveClassInfo.className : leaveClassInfo.classNameZh}}
        <el-tag
          type="success"
          v-if="leaveClassInfo.languageLabel"
          class="mr5"
        >
          {{Filters.languageLabelFilter(leaveClassInfo.languageLabel, isEn)}}
        </el-tag>
        <el-tag
          type="danger"
          v-if="leaveClassInfo.ageLabel"
        >
          {{Filters.ageLabelFilter(leaveClassInfo.ageLabel)}}
        </el-tag>
        <div>
          {{$t('上课周期')}}：{{Filters.normalWeekListMap(leaveClassInfo.weekList, isEn)}}
        </div>
        <div>
          {{$t('下节课进度及时间')}}：{{isEn ? leaveClassInfo.nextLessonDescEN : leaveClassInfo.nextLessonDescZH}}
          /
          {{DateTimeUtils.dateClockTime(leaveClassInfo.nextCourseTime)}}</div>
      </el-form-item>
      <el-form-item :label="$t('转入班级')">
        <span v-if="enterClassInfo">
          {{isEn ? enterClassInfo.className : enterClassInfo.classNameZh}}
          <el-tag
            type="success"
            v-if="enterClassInfo.languageLabel"
          >
            {{Filters.languageLabelFilter(enterClassInfo.languageLabel, isEn)}}
          </el-tag>
          <el-tag
            type="danger"
            v-if="enterClassInfo.ageLabel"
          >
            {{Filters.ageLabelFilter(enterClassInfo.ageLabel)}}
          </el-tag>
          <div>
            {{$t('上课周期')}}：{{Filters.normalWeekListMap(enterClassInfo.weekList, isEn)}}
          </div>
          <div>
            {{$t('下节课进度及时间')}}：{{isEn ? enterClassInfo.nextLessonDescEN : enterClassInfo.nextLessonDescZH}}
            / {{DateTimeUtils.dateClockTime(enterClassInfo.nextCourseTime)}}
          </div>
        </span>
      </el-form-item>
      <el-form-item
        :label="$t('转班原因')"
        prop="reasonType"
        :rules="[
      { required: true, message: '请选择'},
    ]"
      >
        <el-select
          style="display: inline-block; width: 200px"
          v-model="formState.reasonType"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in Constants.getTranslateClassReasons(isEn)"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label=""
        prop="reasonDesc"
        v-if="formState.reasonType === TRANSLATE_CLASS_REASON_TYPES.OTHER"
        :rules="[
      { required: true, message: '请输入转班原因'},
    ]"
      >
        <el-input
          type="textarea"
          maxlength="100"
          show-word-limit
          :rows="4"
          :placeholder="$t('请输入转班原因')"
          v-model="formState.reasonDesc"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="closeDialog">{{$t('取消')}}</el-button>
        <el-button
          @click="confirm"
          type="primary"
        >{{$t('确认')}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { computed, defineComponent, onMounted, reactive, ref, watch } from '@vue/composition-api'
import { TRANSLATE_CLASS_REASON_TYPES } from '@/utils/constants'
import {
  translateClassBeforeCheck,
  translateClassAfterCheck
} from "@/api/groupManagement";
import { ABNORMAL_CODE } from "@/utils/constants";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    refferInfo: {
      type: Object,
      default: {
        sid: null,
        classId: null,
        studentName: '',
        coursePackageId: null
      }
    },
    leaveClassInfo: {
      type: Object,
      default: {}
    },
    enterClassId: {
      type: Number,
      default: {}
    },
    packageTreeId: {
      type: Number,
      default: null
    },
    lessonId: {
      type: Number,
      default: null
    }
  },
  setup (props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === 'en')
    const reasonList = ref([])
    const formState = reactive({
      reasonDesc: '',
      reasonType: null,
    })
    const enterClassInfo = ref(null)
    const loading = ref(false)
    watch(() => formState.reason, (val) => {
      if (!val) return
      if (val !== TRANSLATE_CLASS_REASON_TYPES.OTHER) {
        refs.formRef.clearValidate('otherReason')
      }
    })
    const closeDialog = () => { emit('update:visible', false) }
    const confirm = () => {
      refs.formRef.validate((valid) => {
        if (valid) {
          translateClassFinallCheck()
        } else {
          return false;
        }
      })
    }

    const submitTranslate = () => {
      loading.value = true
      const { coursePackageId } = props.refferInfo
      const { packageTreeId, lessonId } = props
      const { refferInfo: { classId, sid } } = props

      const params = {
        studentUserId: sid,
        leaveClassId: classId,
        enterClassId: props.enterClassId,
        coursePackageId, packageTreeId, lessonId,
        ...formState
      }
      root.$Api.groupManagement.translateClass(params).then(({ status, data: { code, data } }) => {
        if (code !== 200 || status !== 200) return Promise.reject()
        root.$notify.success(root.$t('操作成功'))
        loading.value = false
        emit('confirmCb')
      }).catch(() => {
        root.$notify.success(root.$t('操作失败'))
        loading.value = false
      })
    }

    const translateClassFinallCheck = async () => {
      Promise.all([handleTranslateClassBeforeCheck(), handleTranslateClassAfterCheck()]).then((checkCodes) => {
        if (checkCodes?.length) {
          const resolveCode = checkCodes.find(t => t)
          if (resolveCode) {
            if (resolveCode === ABNORMAL_CODE.hasLeaveClassCode || resolveCode === ABNORMAL_CODE.transferedInRecentTimeCode || resolveCode === ABNORMAL_CODE.bothLeaveClassAndTransferedCode) {
              submitTranslate()
            }
          } else {
            submitTranslate()
          }
        }
      })
    }

    const handleTranslateClassAfterCheck = async () => {
      const { coursePackageId } = props.refferInfo
      const { packageTreeId, lessonId } = props
      const params = { coursePackageId, packageTreeId, lessonId }
      const { refferInfo: { classId, sid } } = props
      const {
        status,
        data: { code },
      } = await translateClassAfterCheck(sid, classId, props.enterClassId, params).finally(() => {
      });
      if (status !== 200 || code !== 200) return Promise.reject()
      return Promise.resolve()
    }

    const handleTranslateClassBeforeCheck = async () => {
      const { refferInfo: { classId, sid } } = props
      const {
        status,
        data: { code },
      } = await translateClassBeforeCheck(sid, classId)
      if (code === ABNORMAL_CODE.hasLeaveClassCode) {
        return Promise.resolve(ABNORMAL_CODE.hasLeaveClassCode)
      }
      if (code === ABNORMAL_CODE.transferedInRecentTimeCode) {
        return Promise.resolve(ABNORMAL_CODE.transferedInRecentTimeCode)
      }
      if (code === ABNORMAL_CODE.bothLeaveClassAndTransferedCode) {
        return Promise.resolve(ABNORMAL_CODE.bothLeaveClassAndTransferedCode)
      }
      if (status !== 200 || code !== 200) return Promise.reject()
      return Promise.resolve()
    }

    onMounted(() => {
      root.$Api.groupManagement.getClassInfo(props.enterClassId).then(({ status, data: { code, data } }) => {
        if (status !== 200 || code !== 200) return Promise.reject()
        enterClassInfo.value = data
      }).catch(() => { })
    })
    return {
      isEn,
      formState,
      reasonList,
      loading,
      TRANSLATE_CLASS_REASON_TYPES,
      enterClassInfo,
      closeDialog,
      confirm
    }
  },
})
</script>
<style lang="scss" scoped>
.inner-dialog .el-dialog__body {
  height: 230px;
}
</style>
