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
      ref="zhEducationalForm"
      :rules="rules"
      :model="zhEducationalForm"
      :label-width="currentLang === 'en' ? '250px' : '130px'"
    >
      <el-form-item prop="" :label="$t('最高学历')+':'">
        <el-select
          v-model="zhEducationalForm.highestLevel"
          :disabled="isDisabled"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in zhTeacherDegreeOptions"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="" :label="$t('最高学历就读时间')+':'">
        <el-date-picker
          v-model="highestStudyTime"
          type="monthrange"
          value-format="yyyy-MM"
          range-separator="-"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          :disabled="isDisabled"
          @change="timeChange"
        />
      </el-form-item>
      <!-- 大专 -->
      <template v-if="zhEducationalForm.highestLevel === '大专'">
        <el-form-item prop="" :label="$t('education-专科毕业学校')+':'">
          <el-input
            v-model="zhEducationalForm.associateCollege"
            :disabled="isDisabled"
            type="text"
            :placeholder="$t('glb-input')"
          />
        </el-form-item>
        <el-form-item prop="" :label="$t('education-专科专业')+':'">
          <el-input
            v-model="zhEducationalForm.associateMajor"
            :disabled="isDisabled"
            type="text"
            :placeholder="$t('glb-input')"
          />
        </el-form-item>
      </template>
      <!-- 本科 -->
      <template
        v-if="
          zhEducationalForm.highestLevel && 
          (zhEducationalForm.highestLevel.includes('本科') || zhEducationalForm.highestLevel === '硕士' || zhEducationalForm.highestLevel === '博士')
        "
      >
        <el-form-item prop="" :label="$t('education-本科毕业学校')+':'">
          <el-input
            v-model="zhEducationalForm.undergraduateSchool"
            :disabled="isDisabled"
            type="text"
            :placeholder="$t('glb-input')"
          />
        </el-form-item>
        <el-form-item prop="" :label="$t('education-本科专业')+':'">
          <el-input
            v-model="zhEducationalForm.undergraduateMajor"
            :disabled="isDisabled"
            type="text"
            :placeholder="$t('glb-input')"
          />
        </el-form-item>
      </template>
      <!-- 硕士 -->
      <template v-if="zhEducationalForm.highestLevel === '硕士' || zhEducationalForm.highestLevel === '博士'">
        <el-form-item prop="" :label="$t('education-硕士毕业学校')+':'">
          <el-input
            v-model="zhEducationalForm.masterSchool"
            :disabled="isDisabled"
            type="text"
            :placeholder="$t('glb-input')"
          />
        </el-form-item>
        <el-form-item prop="" :label="$t('education-硕士专业')+':'">
          <el-input
            v-model="zhEducationalForm.masterMajor"
            :disabled="isDisabled"
            type="text"
            :placeholder="$t('glb-input')"
          />
        </el-form-item>
      </template>
      <!-- 博士 -->
      <template v-if="zhEducationalForm.highestLevel === '博士'">
        <el-form-item prop="" :label="$t('education-博士毕业学校')+':'">
          <el-input
            v-model="zhEducationalForm.phdSchool"
            :disabled="isDisabled"
            type="text"
            :placeholder="$t('glb-input')"
          />
        </el-form-item>
        <el-form-item prop="" :label="$t('education-博士专业')+':'">
          <el-input
            v-model="zhEducationalForm.phdMajor"
            :disabled="isDisabled"
            type="text"
            :placeholder="$t('glb-input')"
          />
        </el-form-item>
      </template>
      <el-form-item prop="" :label="$t('education-是否在读')+':'">
        <el-radio-group v-model="zhEducationalForm.currently">
          <el-radio :disabled="isDisabled" :label="1">{{ $t('found') }}</el-radio>
          <el-radio :disabled="isDisabled" :label="0">{{ $t('notFound') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="zhEducationalForm.currently" prop="" :label="$t('在读年级')+':'">
        <el-input
          v-model="zhEducationalForm.currentGrade"
          type="text"
          :placeholder="$t('glb-input')"
          :disabled="isDisabled"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { markRaw, reactive, ref, unref, watch, computed, onMounted } from "@vue/composition-api";
import moment from "moment";

export default {
  props: {
    childIsUpdate: {type: Boolean, default: false},
    zhTeacherDegreeOptions: {type: Array, default: () => ([])},
    educationExperienceZh: {type: Object, default: () => ({})}
  },
  setup(props, { root, emit, refs }) {
    const isDisabled = ref(true);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const zhEducationalForm = reactive({
      highestLevel: '', // 最高学历
      highestStudyStartTime: '', // 最高学历就读开始时间
      highestStudyEndTime: '', // 最高学历就读结束时间
      associateCollege: '', // 专科毕业学校
      associateMajor: '', // 专科专业 
      undergraduateSchool: '', // 本科毕业学校
      undergraduateMajor: '', // 本科专业
      masterSchool: '', // 硕士毕业学校
      masterMajor: '', // 硕士专业
      phdSchool: '', // 博士毕业学校
      phdMajor: '', // 博士专业
      currently: '', // 是否在读
      currentGrade: '', // 在读年级
    });
    const highestStudyTime = ref([]);// 最高学历就读时间

    watch(
      () => props.childIsUpdate,
      (val) => {
        // console.log('更新教学经历: ', val);
        if (val) {
          updateComp()
        }
      }
    )
    
    const updateComp = () => {
      Object.assign(zhEducationalForm, props.educationExperienceZh);
      let {highestStudyStartTime, highestStudyEndTime} = props?.educationExperienceZh ?? {};
      highestStudyTime.value = [
        root.DateTimeUtils.dateClockTimeMonth(highestStudyStartTime),
        root.DateTimeUtils.dateClockTimeMonth(highestStudyEndTime),
      ]
      // handleCancel(); 不能使用这个，他会一直循环请求教师信息
      isDisabled.value = true; 
    }

    // 保存
    const handleSave = () => {
      emit('updateInfo', {
        moduleName: 'educationExperienceZh',
        moduleData: zhEducationalForm
      })
    }
    // 点击编辑按钮
    const handleEditEvent = () => {
      isDisabled.value = false;
    }
    // 取消
    const handleCancel = () => {
      isDisabled.value = true;
      emit('resetTeacherInfo');
    }

    const timeChange = () => {
      zhEducationalForm.highestStudyStartTime =
        Array.isArray(highestStudyTime.value) && highestStudyTime.value.length != 0
          ? moment(`${highestStudyTime.value[0]} 00:00:00`).toISOString()
          : "";
      zhEducationalForm.highestStudyEndTime =
        Array.isArray(highestStudyTime.value) && highestStudyTime.value.length != 0
          ? moment(`${highestStudyTime.value[1]} 23:59:59`).toISOString()
          : "";
    }

    return {
      isDisabled,
      currentLang,
      zhEducationalForm,
      highestStudyTime,
      handleSave,
      handleEditEvent,
      handleCancel,
      timeChange,
    }
  }
}
</script>

<style lang='scss' scoped>
.btn-box {
  text-align: right;
  margin: 0 0 10px;
}
::v-deep .el-date-editor{
  .el-range-separator {
    padding: 0;
  }
}
</style>