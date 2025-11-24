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
      ref="enQualificationForm"
      :rules="rules"
      :model="enQualificationForm"
      :label-width="currentLang === 'en' ? '220px' : '100px'"
    >
      <el-form-item prop="" :label="$t('资质种类')+':'">
        <el-select 
          v-model="enQualificationForm.type"
          :disabled="isDisabled"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in enTeacherAptitudeOptions"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="" :label="$t('资质证明')+':'">
        <!-- picture -->
        <S3upload
          ref="enQualificationUpload"
          :multiple="true"
          :limit="5"
          accept="image/jpg, image/png"
          :maxFileSize="10"
          :disabled="isDisabled"
          :id="$route.query.id"
          field="picture"
          :imgList="enQualificationForm.picture"
          @imgUrl="getImgUrl"
        />
      </el-form-item>

      <el-form-item

          v-for="(item, index) in teachingCertification"
          :label="$t('其他证书') + `${index == 0 ? '' : '-'+index}`"
          :key="index"
          :prop="'teachingCertification.'+index"
  
      >
          <span>{{ $t('证书主题') }}</span>
          <el-input :disabled="true" v-model="item.subject" type="text" :placeholder="$t('请填写证书主题')"></el-input>
          <span>{{ $t('资质种类') }}</span>
          <el-input :disabled="true" v-model="item.type" type="text" :placeholder="$t('请选择资质种类')"></el-input>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { markRaw, reactive, ref, unref, watch, computed, onMounted } from "@vue/composition-api";
import S3upload from '../../components/S3upload.vue';

export default {
  components: {S3upload},
  props: {
    enTeacherAptitudeOptions: {type: Array, default: () => ([])},
    childIsUpdate: {type: Boolean, default: false},
    qualificationEn: {type: Object, default: () => ({})},
    teacherExamineStatus: {type: Number, default: () => (1)},
  },
  setup(props, { root, emit, refs }) {
    const isDisabled = ref(true);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const enQualificationForm = reactive({
      type: "", // 资质种类
      picture: [], // 资质证明
      teachingCertification: []
    })
    const teachingCertification = ref([]);
    if (props.qualificationEn && props.qualificationEn.otherTypeList) {

      
      props.qualificationEn?.otherTypeList?.forEach((item) => {

        if (item) {
          let itemObj = JSON.parse(item)
          itemObj && teachingCertification.value.push(itemObj);
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
        picture: props.qualificationEn?.picture ?? [], 
      }
      Object.assign(enQualificationForm, {...props.qualificationEn, ...newObj});
      // handleCancel(); 不能使用这个，他会一直循环请求教师信息
      isDisabled.value = true; 
    }
    // 保存
    const handleSave = async () => {
      await validateUploadState();
      emit('updateInfo', {
        moduleName: 'qualificationEn',
        moduleData: enQualificationForm
      })
    }
    // 点击编辑按钮
    const handleEditEvent = () => {
      isDisabled.value = false;
    }
    // 取消
    const handleCancel = async () => {
      await validateUploadState();
      isDisabled.value = true;
      emit('resetTeacherInfo');
    }

    const validateUploadState = async () => {
      if (refs[`enQualificationUpload`]["uploading"]) {
        root.$message.warning(root.$t("图片上传中"));
        await Promise.reject();
      }
    }

    const getImgUrl = ({field, imgUrl}) => {
      enQualificationForm[field] = imgUrl;
    }

    return {
      isDisabled,
      currentLang,
      enQualificationForm,
      handleSave,
      handleEditEvent,
      handleCancel,
      getImgUrl,
      teachingCertification
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