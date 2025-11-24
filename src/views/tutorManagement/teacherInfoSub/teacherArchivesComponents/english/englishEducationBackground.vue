<template>
  <div>
    <div class="btn-box">
      <el-button
        v-show="isDisabled && Per.handleButtonPer('teach.tutorMT.teacherFile.allEditBtn') && teacherExamineStatus"
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
      ref="enEducationalForm"
      :rules="rules"
      :model="enEducationalForm"
      :label-width="currentLang === 'en' ? '230px' : '130px'"
    >
      <el-form-item prop="" :label="$t('最高学历')+':'">
        <el-select v-model="enEducationalForm.highestLevel" clearable :disabled="isDisabled" :placeholder="$t('请选择')">
          <el-option
            v-for="item in enTeacherDegreeOptions"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="" :label="$t('毕业学校')+':'">
        <el-input
          v-model="enEducationalForm.schoolName"
          :disabled="isDisabled"
          type="text"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('专业')+':'">
        <el-input
          v-model="enEducationalForm.major"
          :disabled="isDisabled"
          type="text"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('学历证明')+':'">
        <!-- :interrupt="interrupt" 中断图片上传-->
        <S3upload
          ref="enEducationalUpload"
          :multiple="true"
          :limit="5"
          accept="image/jpg, image/png"
          :maxFileSize="10"
          :disabled="isDisabled"
          :id="$route.query.id"
          field="pictureOfDegree"
          :imgList="enEducationalForm.pictureOfDegree"
          @imgUrl="getImgUrl"
        />
      </el-form-item>

      <el-form-item

        v-for="(item, index) in otherTypeList"
        :label="$t('其他教育经历') + `${index == 0 ? '' : '-'+index}`"
        :key="index"
        :prop="'otherTypeList.'+index"

      >
        <span>{{ $t('学历') }}</span>
        <el-input :disabled="true" v-model="item.highestLevel" type="text" :placeholder="$t('学历')"></el-input>
        <span>{{ $t('毕业学校') }}</span>
        <el-input :disabled="true" v-model="item.schoolName" type="text" :placeholder="$t('毕业学校')"></el-input>
        <span>{{ $t('专业') }}</span>
        <el-input :disabled="true" v-model="item.major" type="text" :placeholder="$t('专业')"></el-input>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { markRaw, reactive, ref, unref, watch, computed, onMounted } from "@vue/composition-api";
import S3upload from '../../components/S3upload.vue'

export default {
  components: {S3upload},
  props: {
    enTeacherDegreeOptions: {type: Array, default: () => ([])},
    childIsUpdate: {type: Boolean, default: false},
    educationExperienceEn: {type: Object, default: () => ({})},
    teacherExamineStatus: {type: Number, default: () => (1)},
  },
  setup(props, { root, emit, refs }) {
    const isDisabled = ref(true);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const enEducationalForm = reactive({
      highestLevel: '', // 最高学历-EN
      schoolName: '', // 毕业学校
      major: '', // 专业
      pictureOfDegree: [], // 学历证明
      otherTypeList: []
    });
    // const interrupt = ref(false);
    const otherTypeList = ref([]);
    if (props.educationExperienceEn && props.educationExperienceEn.otherTypeList) {

      
      props.educationExperienceEn?.otherTypeList?.forEach((item) => {

        if (item) {
          let itemObj = JSON.parse(item)
          itemObj && otherTypeList.value.push(itemObj);
        }
          

      });
    }

    const teacherExamineStatus=ref(1);
    teacherExamineStatus.value = props.teacherExamineStatus;

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
      let newObj = { 
        pictureOfDegree: props.educationExperienceEn?.pictureOfDegree ?? [], 
      }
      Object.assign(enEducationalForm, {...props.educationExperienceEn, ...newObj});
      // handleCancel(); 不能使用这个，他会一直循环请求教师信息
      isDisabled.value = true; 
    }
    // 保存
    const handleSave = async () => {
      await validateUploadState()
      emit('updateInfo', {
        moduleName: 'educationExperienceEn',
        moduleData: enEducationalForm
      })
    }
    // 点击编辑按钮
    const handleEditEvent = () => {
      isDisabled.value = false;
    }
    // 取消
    const handleCancel = async () => {
      await validateUploadState()
      isDisabled.value = true;
      emit('resetTeacherInfo');
    }

    const getImgUrl = ({field, imgUrl}) => {
      enEducationalForm[field] = imgUrl;
    }

    const validateUploadState = async () => {
      if (refs[`enEducationalUpload`]["uploading"]) {
        root.$message.warning(root.$t("图片上传中"));
        await Promise.reject();
      }
    }

    return {
      isDisabled,
      currentLang,
      enEducationalForm,
      // interrupt,
      handleSave,
      handleEditEvent,
      handleCancel,
      getImgUrl,
      otherTypeList
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