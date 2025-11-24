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
      ref="zhQualificationForm"
      :rules="rules"
      :model="zhQualificationForm"
      :label-width="currentLang === 'en' ? '250px' : '220px'"
    >
      <!-- 教师资格证持证情况 start -->
      <el-form-item prop="" :label="$t('教师资格证持证情况')+':'">
        <el-radio-group v-model="zhQualificationForm.quaCertificate">
          <el-radio :disabled="isDisabled" label="有">{{ $t('有') }}</el-radio>
          <el-radio :disabled="isDisabled" label="无">{{ $t('无') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="zhQualificationForm.quaCertificate === '有'">
        <el-form-item prop="" :label="$t('证书名称')+':'">
          <el-input
            v-model="zhQualificationForm.quaCertificateName"
            :disabled="isDisabled"
            type="text"
            :placeholder="$t('glb-input')"
          />
        </el-form-item>
        <el-form-item prop="" :label="$t('证书图片')+':'">
          <!-- quaCertificatePicture -->
          <S3upload
            ref="zhQualification_1"
            :multiple="true"
            :limit="5"
            accept="image/jpg, image/png"
            :maxFileSize="10"
            :disabled="isDisabled"
            :id="$route.query.id"
            field="quaCertificatePicture"
            :imgList="zhQualificationForm.quaCertificatePicture"
            @imgUrl="getImgUrl"
          />
        </el-form-item>
      </template>
      <!-- 教师资格证持证情况 end -->

      <!-- 对外汉语教学相关证书持证情况 start -->
      <el-form-item prop="" :label="$t('对外汉语教学相关证书持证情况')+':'">
        <el-radio-group v-model="zhQualificationForm.foreignLanguage">
          <el-radio :disabled="isDisabled" label="有">{{ $t('有') }}</el-radio>
          <el-radio :disabled="isDisabled" label="无">{{ $t('无') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <template  v-if="zhQualificationForm.foreignLanguage === '有'">
        <el-form-item prop="" :label="$t('证书名称')+':'">
          <el-input
            v-model="zhQualificationForm.forCertificateName"
            :disabled="isDisabled"
            type="text"
            :placeholder="$t('glb-input')"
          />
        </el-form-item>
        <el-form-item prop="" :label="$t('证书图片')+':'">
          <!-- forCertificatePicture -->
          <S3upload
            ref="zhQualification_2"
            :multiple="true"
            :limit="5"
            accept="image/jpg, image/png"
            :maxFileSize="10"
            :disabled="isDisabled"
            :id="$route.query.id"
            field="forCertificatePicture"
            :imgList="zhQualificationForm.forCertificatePicture"
            @imgUrl="getImgUrl"
          />
        </el-form-item>
      </template>
      <!-- 对外汉语教学相关证书持证情况 end -->

      <!-- 普通话等级证书 start -->
      <el-form-item prop="" :label="$t('普通话等级证书')+':'">
        <el-select 
          v-model="zhQualificationForm.mandarinCertificate"
          :placeholder="$t('请选择')"
          :disabled="isDisabled"
          clearable
        >
          <el-option
            v-for="item in mandarinLevelOptions"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="" :label="$t('证书图片')+':'" v-if="zhQualificationForm.mandarinCertificate && zhQualificationForm.mandarinCertificate!=='无'">
        <!-- manCertificatePicture -->
        <S3upload
          ref="zhQualification_3"
          :multiple="true"
          :limit="5"
          accept="image/jpg, image/png"
          :maxFileSize="10"
          :disabled="isDisabled"
          :id="$route.query.id"
          field="manCertificatePicture"
          :imgList="zhQualificationForm.manCertificatePicture"
          @imgUrl="getImgUrl"
        />
      </el-form-item>
      <!-- 普通话等级证书 end -->
      <el-form-item prop="" :label="$t('英语口语水平')+':'">
        <el-select 
          v-model="zhQualificationForm.englishSpeaking"
          :placeholder="$t('请选择')"
          :disabled="isDisabled"
          clearable
        >
          <el-option
            v-for="item in oralEnglishLevelOptions"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </el-form-item>
      <!-- 英语相关资格证书持证情况 start -->
      <el-form-item prop="" :label="$t('英语相关资格证书持证情况')+':'">
        <el-radio-group v-model="zhQualificationForm.engCertificate">
          <el-radio :disabled="isDisabled" label="有">{{ $t('有') }}</el-radio>
          <el-radio :disabled="isDisabled" label="无">{{ $t('无') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="zhQualificationForm.engCertificate === '有'">
        <el-form-item prop="" :label="$t('证书名称')+':'">
          <el-input
            v-model="zhQualificationForm.engCertificateName"
            :disabled="isDisabled"
            type="text"
            :placeholder="$t('glb-input')"
          />
        </el-form-item>
        <el-form-item prop="" :label="$t('证书图片')+':'">
          <!-- engCertificatePicture -->
          <S3upload
            ref="zhQualification_4"
            :multiple="true"
            :limit="5"
            accept="image/jpg, image/png"
            :maxFileSize="10"
            :disabled="isDisabled"
            :id="$route.query.id"
            field="engCertificatePicture"
            :imgList="zhQualificationForm.engCertificatePicture"
            @imgUrl="getImgUrl"
          />
        </el-form-item>
      </template>
      <!-- 英语相关资格证书持证情况 end -->
      <el-form-item prop="" :label="$t('是否会小语种')+':'">
        <el-radio-group v-model="zhQualificationForm.canMinority">
          <el-radio :disabled="isDisabled" label="是">{{ $t('found') }}</el-radio>
          <el-radio :disabled="isDisabled" label="否">{{ $t('notFound') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="" :label="$t('小语种')+':'" v-if="zhQualificationForm.canMinority === '是'">
        <el-select 
          v-model="zhQualificationForm.minorityLanguage"
          :placeholder="$t('请选择')"
          :disabled="isDisabled"
          multiple
        >
          <el-option
            v-for="item in minorLanguagesOptions"
            :key="item.id"
            :label="item.typeKey"
            :value="item.typeKey"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="" :label="$t('方言')+':'">
        <el-input
          v-model="zhQualificationForm.dialects"
          :disabled="isDisabled"
          type="text"
          :placeholder="$t('glb-input')"
        />
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
    mandarinLevelOptions: {type: Array, default: () => ([])},
    oralEnglishLevelOptions: {type: Array, default: () => ([])},
    minorLanguagesOptions: {type: Array, default: () => ([])},
    childIsUpdate: {type: Boolean, default: false},
    qualificationZh: {type: Object, default: () => ({})}
  },
  setup(props, { root, emit, refs }) {
    const isDisabled = ref(true);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const zhQualificationForm = reactive({
      quaCertificate: "", // 教师资格证持证情况
      quaCertificateName: "", // 教师资格证持证情况 - 证书名称
      quaCertificatePicture: [], // 教师资格证持证情况 - 证书照片
      foreignLanguage: "", // 对外汉语教学持证情况
      forCertificateName: "", // 对外汉语教学持证情况 - 证书名称
      forCertificatePicture: [], // 对外汉语教学持证情况 - 证书照片
      mandarinCertificate: "", // 普通话等级证书
      manCertificatePicture: [], // 普通话等级证书 - 证书照片
      englishSpeaking: "", // 英语口语水平
      engCertificate: "", // 英语相关资格证书持证情况
      engCertificateName: "",  // 英语相关资格证书持证情况 - 证书名称
      engCertificatePicture: [], // 英语相关资格证书持证情况 - 证书照片
      canMinority: "", // 是否会小语种
      minorityLanguage: [], // 小语种
      dialects: "", // 方言
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
      let newObj = { 
        quaCertificatePicture: props.qualificationZh?.quaCertificatePicture ?? [], 
        forCertificatePicture: props.qualificationZh?.forCertificatePicture ?? [], 
        manCertificatePicture: props.qualificationZh?.manCertificatePicture ?? [],
        engCertificatePicture: props.qualificationZh?.engCertificatePicture ?? [],
      }
      Object.assign(zhQualificationForm, {...props.qualificationZh, ...newObj});
      // handleCancel(); 不能使用这个，他会一直循环请求教师信息
      isDisabled.value = true; 
    }
    // 保存
    const handleSave = async () => {
      await validateUploadState();
      emit('updateInfo', {
        moduleName: 'qualificationZh',
        moduleData: zhQualificationForm
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
      let refList = ['zhQualification_1', 'zhQualification_2', 'zhQualification_3', 'zhQualification_4'];
      if (refList.some((it, i) => refs[`zhQualification_${i + 1}`]?.uploading)) {
        root.$message.warning(root.$t("图片上传中"));
        await Promise.reject();
      }
    }

    const getImgUrl = ({field, imgUrl}) => {
      zhQualificationForm[field] = imgUrl;
    }

    return {
      isDisabled,
      currentLang,
      zhQualificationForm,
      handleSave,
      handleEditEvent,
      handleCancel,
      getImgUrl,
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