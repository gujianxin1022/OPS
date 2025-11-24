<template>
  <div>
    <div class="btn-box">
      <el-button
        v-show="isDisabled && Per.handleButtonPer('teach.tutorMT.teacherFile.allEditBtn')"
        @click="handleEditEvent"
      >
        {{$t('编辑')}}
      </el-button>
      <el-button
        v-show="!isDisabled"
        type="primary"
        @click="handleSave"
      >
        {{$t('preservation')}}
      </el-button>
      <el-button
        v-show="!isDisabled"
        @click="handleCancel"
      >
        {{$t('取消')}}
      </el-button>
    </div>
    <el-form
      ref="zhExperienceForm"
      :rules="rules"
      :model="zhExperienceForm"
      :label-width="currentLang === 'en' ? '250px' : '200px'"
    >
      <el-form-item prop="" :label="$t('开始工作时间')+':'">
        <el-date-picker
          v-model="zhExperienceForm.workStartDate"
          type="date"
          placeholder="选择日期"
          :disabled="isDisabled"
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('目前就职单位')+':'">
        <el-input
          v-model="zhExperienceForm.currentCompany"
          :disabled="isDisabled"
          type="text"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('目前职位')+':'">
        <el-input
          v-model="zhExperienceForm.currentPosition"
          :disabled="isDisabled"
          type="text"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('语文教学工作经历')+':'">
        <el-radio-group v-model="zhExperienceForm.chinesExp">
          <el-radio :disabled="isDisabled" label="有">{{ $t('有') }}</el-radio>
          <el-radio :disabled="isDisabled" label="无">{{ $t('无') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="" :label="$t('经历描述')+':'" v-if="zhExperienceForm.chinesExp==='有'">
        <el-input
          v-model="zhExperienceForm.chinesDesc"
          type="textarea"
          :rows="4"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('对外汉语教学经历')+':'">
        <el-radio-group v-model="zhExperienceForm.teachingChineseExp">
          <el-radio :disabled="isDisabled" label="有">{{ $t('有') }}</el-radio>
          <el-radio :disabled="isDisabled" label="无">{{ $t('无') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="" :label="$t('经历描述')+':'" v-if="zhExperienceForm.teachingChineseExp==='有'">
        <el-input
          v-model="zhExperienceForm.teachingChineseDesc"
          type="textarea"
          :rows="4"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('其他教学经历')+':'">
        <el-radio-group v-model="zhExperienceForm.otherExp">
          <el-radio :disabled="isDisabled" label="有">{{ $t('有') }}</el-radio>
          <el-radio :disabled="isDisabled" label="无">{{ $t('无') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="" :label="$t('经历描述')+':'" v-if="zhExperienceForm.otherExp==='有'">
        <el-input
          v-model="zhExperienceForm.otherDesc"
          type="textarea"
          :rows="4"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('海外居住、留学或工作经历')+':'">
        <el-radio-group v-model="zhExperienceForm.overseasExp">
          <el-radio :disabled="isDisabled" label="有">{{ $t('有') }}</el-radio>
          <el-radio :disabled="isDisabled" label="无">{{ $t('无') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="" :label="$t('经历描述')+':'" v-if="zhExperienceForm.overseasExp==='有'">
        <el-input
          v-model="zhExperienceForm.overseasDesc"
          type="textarea"
          :rows="4"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { markRaw, reactive, ref, unref, watch, computed, onMounted } from "@vue/composition-api";

export default {
  props: {
    childIsUpdate: {type: Boolean, default: false},
    teachingExperienceZh: {type: Object, default: () => ({})}
  },
  setup(props, { root, emit, refs }) {
    const isDisabled = ref(true);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const zhExperienceForm = reactive({
      workStartDate: "", // 开始工作开始时间
      currentCompany: "", // 目前就职单位
      currentPosition: "", // 目前职位
      chinesExp: "", // 语文教学经历
      chinesDesc: "", // 语文教学经历描述
      teachingChineseExp: "", // 对外汉语教学经历
      teachingChineseDesc: "", // 对外汉语教学经历描述
      otherExp: "", // 其他教学经历
      otherDesc: "", // 其他教学经历描述
      overseasExp: "", // 海外居住、留学或工作经历
      overseasDesc: "", // 海外居住、留学或工作经历描述
    });

    watch(
      () => props.childIsUpdate,
      (val) => {
        // console.log('更新中文教育背景: ', val);
        if (val) {
          updateComp()
        }
      }
    )
    
    const updateComp = () => {
      Object.assign(zhExperienceForm, props.teachingExperienceZh);
      // handleCancel(); 不能使用这个，他会一直循环请求教师信息
      isDisabled.value = true; 
    }
    // 保存
    const handleSave = () => {
      emit('updateInfo', {
        moduleName: 'teachingExperienceZh',
        moduleData: zhExperienceForm
      })
    }
    // 点击编辑按钮
    const handleEditEvent = () => {
      isDisabled.value = false;
    }
    // 取消
    const handleCancel = async () => {
      isDisabled.value = true;
      emit('resetTeacherInfo');
    }

    return {
      isDisabled,
      currentLang,
      zhExperienceForm,
      handleSave,
      handleEditEvent,
      handleCancel,
    }
  }
}
</script>

<style lang='scss' scoped>
.btn-box {
  text-align: right;
  margin: 0 0 10px;
}
</style>