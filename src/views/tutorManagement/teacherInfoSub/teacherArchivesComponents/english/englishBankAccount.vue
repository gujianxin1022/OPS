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
      ref="enBankAccountForm"
      :model="enBankAccountForm"
      :label-width="'250px'"
    >
      <el-form-item prop="" label="Prove of Identity:">
        <!-- prove -->
        <S3upload
          ref="enBankUpload"
          :multiple="true"
          :limit="5"
          accept="image/jpg, image/png"
          :maxFileSize="10"
          :disabled="isDisabled"
          :id="$route.query.id"
          field="prove"
          :imgList="enBankAccountForm.prove"
          @imgUrl="getImgUrl"
        />
      </el-form-item>

      <el-form-item prop="currency" label="Currency:">
        <el-select
          v-model="enBankAccountForm.currency"
          filterable
          clearable
          :placeholder="$t('please select your currency')"
          :disabled="isDisabled"
          @change="handleCurrency"
        >
          <el-option
            v-for="item in currencyListOptions"
            :key="item.id"
            :label="item.nameEn"
            :value="item.nameEn"/>
        </el-select>
      </el-form-item>

      <el-form-item prop="" label="Bank Location:">
        <el-select
          v-model="enBankAccountForm.bankLocation"
          filterable
          clearable
          :placeholder="$t('请选择')"
          :disabled="isDisabled"
          @change="handleBank"
        >
          <el-option
            v-for="item in countryListOptions"
            :key="item.areaId"
            :label="item.nameEn"
            :value="item.nameEn"/>
        </el-select>
      </el-form-item>
      <el-form-item 
        prop="" 
        label="Payment Method:" 
        v-if="enBankAccountForm.bankLocation === 'United States'"
      >
        <el-select
          v-model="enBankAccountForm.paymentMethod"
          :placeholder="$t('请选择')"
          :disabled="isDisabled"
          @change="handlePayment"
        >
          <el-option
            v-for="item in PAYMENTMETHOD"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item 
        prop="" 
        label="Beneficiary Bank Account Routing Number:"  
        v-if="enBankAccountForm.bankLocation === 'Canada'"
      >
        <el-input
          v-model="enBankAccountForm.benRoutNumber"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
          @input="enBankAccountForm.benRoutNumber = enBankAccountForm.benRoutNumber.replace(/[^\d]/g,'')"
        />
      </el-form-item>
      <el-form-item
        prop=""
        label="Routing Number:"
        v-if="enBankAccountForm.paymentMethod === 'ACH'"
      >
        <el-input
          v-model="enBankAccountForm.routNumber"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
          @input="enBankAccountForm.routNumber = enBankAccountForm.routNumber.replace(/[^\d]/g,'')"
        />
      </el-form-item>
      <el-form-item
        prop=""
        label="Beneficiary Bank Swift Code:"
        v-if="
          enBankAccountForm.paymentMethod === 'Wire Transfer' || 
          (enBankAccountForm.bankLocation && !['United States', 'Canada', 'United Kingdom'].includes(enBankAccountForm.bankLocation))
        "
      >
        <el-input
          v-model="enBankAccountForm.swiftCode"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item
        prop=""
        label="Beneficiary Bank Sort Code:"
        v-if="enBankAccountForm.bankLocation === 'United Kingdom'"
      >
        <el-input
          v-model="enBankAccountForm.sortCode"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item
        prop=""
        label="Beneficiary IBAN:"
        v-if="enBankAccountForm.bankLocation && !['United States', 'Canada', 'United Kingdom'].includes(enBankAccountForm.bankLocation)"
      >
        <el-input
          v-model="enBankAccountForm.iban"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" label="Beneficiary Bank Name:">
        <el-input
          v-model="enBankAccountForm.bankName"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" label="Beneficiary Bank Account Number:">
        <el-input
          v-model="enBankAccountForm.accountNumber"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" label="Beneficiary Bank Account Name:">
        <el-input
          v-model="enBankAccountForm.accountName"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" label="Beneficiary First Name:">
        <el-input
          v-model="enBankAccountForm.firstName"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" label="Beneficiary Last Name:">
        <el-input
          v-model="enBankAccountForm.lastName"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" label="Beneficiary Address Street:">
        <el-input
          v-model="enBankAccountForm.addressStreet"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" label="Beneficiary Address City:">
        <el-input
          v-model="enBankAccountForm.addressCity"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" label="Beneficiary Address State:">
        <el-input
          v-model="enBankAccountForm.addressState"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" label="Beneficiary Address Postcode:">
        <el-input
          v-model="enBankAccountForm.addressPostcode"
          :disabled="isDisabled"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { markRaw, reactive, ref, unref, watch, computed, onMounted, toRefs } from "@vue/composition-api";
import S3upload from '../../components/S3upload.vue';
import {PAYMENTMETHOD} from '../constants';

export default {
  components: {S3upload},
  props: {
    childIsUpdate: {type: Boolean, default: false},
    bankAccountEn: {type: Object, default: () => ({})},
    countryListOptions: {type: Object, default: () => ([])},
  },
  setup(props, { root, emit, refs }) {
    const isDisabled = ref(true);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const constants = reactive({PAYMENTMETHOD});
    const enBankAccountForm = reactive({
      prove: [], // 身份证明
      bankLocation: "",
      paymentMethod: "",
      benRoutNumber: "",
      routNumber: "",
      swiftCode: "",
      sortCode: "",
      iban: "",
      bankName: "",
      accountNumber: "",
      accountName: "",
      firstName: "",
      lastName: "",
      addressStreet: "",
      addressCity: "",
      addressState: "",
      addressPostcode: "",
      currency: "",
    });

    const currencyListOptions = reactive([
      {id: 0, nameEn: 'USD', nameZh: '美元'},
      {id: 1, nameEn: 'CNY', nameZh: '人民币'},
      {id: 2, nameEn: 'GBP', nameZh: '英镑'},
      {id: 3, nameEn: 'EUR', nameZh: '欧元'},
      {id: 4, nameEn: 'CAD', nameZh: '加元'},
      {id: 5, nameEn: 'AUD', nameZh: '澳元'},
      {id: 6, nameEn: 'NZD', nameZh: '新西兰元'},
      {id: 7, nameEn: 'HKD', nameZh: '港币'},
      {id: 8, nameEn: 'SGD', nameZh: '新加坡元'},
      {id: 9, nameEn: 'CHF', nameZh: '瑞士法郎'},
      {id: 10, nameEn: 'JPY', nameZh: '日元'},
      {id: 11, nameEn: 'RMB', nameZh: '人民币'},
      {id: 12, nameEn: 'INR', nameZh: '印度卢比'},
      {id: 13, nameEn: 'MXN', nameZh: '墨西哥比索'},
      {id: 14, nameEn: 'RUB', nameZh: '卢布'},
      {id: 15, nameEn: 'ZAR', nameZh: '南非兰特'},
      {id: 16, nameEn: 'KRW', nameZh: '韩元'},
      {id: 17, nameEn: 'TWD', nameZh: '台币'},
      {id: 18, nameEn: 'THB', nameZh: '泰铢'},
      {id: 19, nameEn: 'PHP', nameZh: '菲律宾比索'},
      {id: 20, nameEn: 'MYR', nameZh: '马来西亚林吉特'},
      {id: 21, nameEn: 'IDR', nameZh: '印尼卢比'},
      {id: 22, nameEn: 'VND', nameZh: '越南盾'},
      {id: 23, nameEn: 'ARS', nameZh: '阿根廷比索'},
      {id: 24, nameEn: 'CLP', nameZh: '智利比索'},
      {id: 25, nameEn: 'COP', nameZh: '哥伦比亚比索'},
      {id: 26, nameEn: 'PEN', nameZh: '秘鲁索尔'},
      {id: 27, nameEn: 'BRL', nameZh: '巴西雷亚尔'},
      {id: 28, nameEn: 'ARS', nameZh: '阿根廷比索'},
      {id: 29, nameEn: 'CLP', nameZh: '智利比索'},
      {id: 30, nameEn: 'COP', nameZh: '哥伦比亚比索'},
      {id: 31, nameEn: 'PEN', nameZh: '秘鲁索尔'},
      {id: 32, nameEn: 'BRL', nameZh: '巴西雷亚尔'},
      {id: 33, nameEn: 'ARS', nameZh: '阿根廷比索'},
      {id: 34, nameEn: 'CLP', nameZh: '智利比索'},
      {id: 35, nameEn: 'COP', nameZh: '哥伦比亚比索'},
      {id: 36, nameEn: 'PEN', nameZh: '秘鲁索尔'},
      {id: 37, nameEn: 'BRL', nameZh: '巴西雷亚尔'},
      
    ]);

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
        prove:  props.bankAccountEn?.prove ?? [], 
      }
      Object.assign(enBankAccountForm, {... props.bankAccountEn, ...newObj});
      // Object.assign(enBankAccountForm, props.bankAccountEn ?? {
      //   prove: [], // 身份证明
      //   bankLocation: "",
      //   paymentMethod: "",
      //   benRoutNumber: "",
      //   routNumber: "",
      //   swiftCode: "",
      //   sortCode: "",
      //   iban: "",
      //   bankName: "",
      //   accountNumber: "",
      //   accountName: "",
      //   firstName: "",
      //   lastName: "",
      //   addressStreet: "",
      //   addressCity: "",
      //   addressState: "",
      //   addressPostcode: "",
      // });
      // handleCancel(); 不能使用这个，他会一直循环请求教师信息
      isDisabled.value = true; 
    }
    // 保存
    const handleSave = async () => {
      await validateUploadState();
      emit('updateInfo', {
        moduleName: 'bankAccountEn',
        moduleData: enBankAccountForm
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
      if (refs[`enBankUpload`]["uploading"]) {
        root.$message.warning(root.$t("图片上传中"));
        await Promise.reject();
      }
    }
    const getImgUrl = ({field, imgUrl}) => {
      enBankAccountForm[field] = imgUrl;
    }
    const handleBank = (val) => {
      enBankAccountForm.paymentMethod = '';
      enBankAccountForm.benRoutNumber = '';
      enBankAccountForm.swiftCode = '';
      enBankAccountForm.sortCode = '';
      enBankAccountForm.iban = '';
    }
    const handlePayment = (val) => {
      if (!val) {
        enBankAccountForm.routNumber = '';
        enBankAccountForm.swiftCode = '';
      }
    }

    const handleCurrency = (val) => {
      enBankAccountForm.currency = val;
    }

    return {
      isDisabled,
      currentLang,
      enBankAccountForm,
      ...toRefs(constants),
      handleSave,
      handleEditEvent,
      handleCancel,
      getImgUrl,
      handleBank,
      handlePayment,
      handleCurrency,
      currencyListOptions
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