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
      ref="zhBankAccountForm"
      :rules="rules"
      :model="zhBankAccountForm"
      :label-width="currentLang === 'en' ? '250px' : '150px'"
    >
      <el-form-item prop="" :label="$t('bank-身份证真实姓名')+':'">
        <el-input
          v-model="zhBankAccountForm.idCardName"
          :disabled="isDisabled"
          type="text"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="idCardNumber" :label="$t('身份证号')+':'">
        <el-input
          v-model="zhBankAccountForm.idCardNumber"
          :disabled="isDisabled"
          type="text"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('bank-身份证照片')+':'">
        <!-- idCardPicture -->
        <S3upload
          ref="zhBankUpload"
          :multiple="true"
          :limit="2"
          accept="image/jpg, image/png"
          :maxFileSize="10"
          :disabled="isDisabled"
          :id="$route.query.id"
          field="idCardPicture"
          :imgList="zhBankAccountForm.idCardPicture"
          @imgUrl="getImgUrl"
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('银行账号')+':'">
        <el-input
          v-model="zhBankAccountForm.bankAccount"
          :disabled="isDisabled"
          type="text"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('bank-开户行')+':'">
        <el-input
          v-model="zhBankAccountForm.issuingBank"
          :disabled="isDisabled"
          type="text"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('bank-支行名称')+':'">
        <el-input
          v-model="zhBankAccountForm.branchName"
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
    childIsUpdate: {type: Boolean, default: false},
    bankAccountZh: {type: Object, default: () => ({})}
  },
  setup(props, { root, emit, refs }) {
    const isDisabled = ref(true);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const zhBankAccountForm = reactive({
      idCardName: "", // 身份证真实姓名
      idCardNumber: "", // 身份证号
      bankAccount: "", // 银行账号
      issuingBank: "", // 开户行
      branchName: "", // 支行名称
      idCardPicture: [], // 身份证照片
    })
    const rules = computed(() => ({
      idCardNumber: [{validator: validatePhone, trigger: 'blur'}],
    }))
    const validatePhone = (rule, value, callback) => {
      if (!value || /^\d{15}|\d{18}$/.test(value)) {
        callback();
      } else {
        callback(new Error(root.$t(`格式错误`)));
      }
    }

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
        idCardPicture: props.bankAccountZh?.idCardPicture ?? [], // 后端返回的默认值为null
      }
      Object.assign(zhBankAccountForm, {...props.bankAccountZh, ...newObj});
      // handleCancel(); 不能使用这个，他会一直循环请求教师信息
      isDisabled.value = true; 
    }
    // 保存
    const handleSave = async () => {
      await validateUploadState();
      refs.zhBankAccountForm.validate((valid) => {
        if (valid) {
          emit('updateInfo', {
            moduleName: 'bankAccountZh',
            moduleData: zhBankAccountForm,
          });
        }
      });
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
      if (refs[`zhBankUpload`]["uploading"]) {
        root.$message.warning(root.$t("图片上传中"));
        await Promise.reject();
      }
    }

    const getImgUrl = ({field, imgUrl}) => {
      zhBankAccountForm[field] = imgUrl;
    }

    return {
      isDisabled,
      currentLang,
      zhBankAccountForm,
      rules,
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