<template>
  <!-- 创建/更新ops登陆用户信息 -->
  <div class="user-info-warp" v-loading="loading">
    <el-form
      class="form"
      ref="userInfoForm"
      :model="userForm"
      label-width="120px"
      :rules="rules"
    >
      <el-form-item v-if="!id" :label="$t('username')" prop="username">
        <el-input v-model="userForm.username"></el-input>
      </el-form-item>
      <el-form-item v-if="!id" :label="$t('glb-Password')" prop="password">
        <el-input
          auto-complete="new-password"
          v-model="userForm.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('真实姓名')" prop="realName">
        <el-input v-model.trim="userForm.realName"></el-input>
      </el-form-item>
      <el-form-item class="text-wrap" :label="$t('企微帐号')">
        <el-input v-model="userForm.enterpriseWeChat"></el-input>
        <div class="important-note">{{ $t('企微账号需要满足说明') }}</div>
      </el-form-item>
      <el-form-item :label="$t('Aircall账号')" prop="airCallUserEmail">
        <el-input v-model="userForm.airCallUserEmail"></el-input>
      </el-form-item>
      <el-form-item :label="$t('中文名')" prop="nameZh">
        <el-input v-model.trim="userForm.nameZh"></el-input>
      </el-form-item>
      <el-form-item :label="$t('英文名')" prop="nameEn">
        <el-input v-model.trim="userForm.nameEn"></el-input>
      </el-form-item>
      <el-form-item :label="$t('my-home-Gender')" prop="gender">
        <el-radio-group v-model="userForm.gender">
          <el-radio :label="1">{{ $t("male") }}</el-radio>
          <el-radio :label="2">{{ $t("female") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('电子邮箱')" prop="email">
        <el-input v-model.trim="userForm.email"></el-input>
      </el-form-item>
      <el-form-item
        :label-width="isEn ? '146px' : '120px'"
        :label="$t('电话号码')"
        prop="phone"
      >
        <div :key="worldTelCode" style="display: flex">
          <countryCodeSelector
            style="margin-top: -10px"
            :countryCode.sync="worldTelCode"
          ></countryCodeSelector>
          <el-input style="height: 40px" v-model="userForm.phone"></el-input>
        </div>
        <div class="important-note">{{ $t('请正确填写手机号的国家代码提示文案') }}</div>
      </el-form-item>
      <el-form-item
        style="margin-top: 30px"
        :label="$t('微信号')"
        prop="wechat"
      >
        <el-input v-model="userForm.wechat"></el-input>
      </el-form-item>
      <el-form-item
        :label-width="isEn ? '130px' : '120px'"
        :label="$t('微信二维码')"
        prop="wechatQrcode"
      >
        <UploadToS3
          ref="wechatQrcodeImg"
          :config="config"
          @changFileData="changWechatQrcodeImg"
        />
      </el-form-item>
      <el-form-item
        :label-width="isEn ? '130px' : '120px'"
        :label="$t('老师昵称')"
        prop="nickName"
      >
        <el-input v-model="userForm.nickName"></el-input
      ></el-form-item>
      <el-form-item
        :label-width="isEn ? '130px' : '120px'"
        :label="$t('老师简介')"
        prop="profile"
      >
        <el-input
          maxlength="500"
          show-word-limit
          type="textarea"
          rows="4"
          v-model="userForm.profile"
        ></el-input
      ></el-form-item>
      <el-form-item
        :label-width="isEn ? '130px' : '120px'"
        :label="$t('老师头像')"
        prop="avatar"
      >
        <UploadToS3
          ref="avatar"
          :config="config"
          @changFileData="changAvatarImg"
        />
      </el-form-item>
      <el-form-item
        :label-width="isEn ? '140px' : '120px'"
        :label="$t('whatsapp账号')"
        prop="whatsapp"
      >
        <el-input v-model="userForm.whatsapp"></el-input>
      </el-form-item>
      <el-form-item
        :label-width="isEn ? '130px' : '120px'"
        :label="$t('whatsapp二维码')"
        prop="whatsappQrcode"
      >
        <UploadToS3
          ref="whatsappQrcode"
          :config="config"
          @changFileData="changWhatsappQrcodeImg"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="user-info-footer">
      <el-button type="primary" @click="submitForm">{{
        $t("my-home-CConfirm")
      }}</el-button>
      <el-button @click="handleClose">{{ $t("my-home-CCancel") }}</el-button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "@vue/composition-api";
import countryCodeSelector from "vue-country-code-selector";
const crypto = require("crypto");
import UploadToS3 from "@/components/Upload/uploadToS3";
import { ABNORMAL_CODE } from "@/utils/constants";

export default {
  components: { countryCodeSelector, UploadToS3 },
  props: ["id"],
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const userForm = ref({
      email: "",
      realName: "",
      enterpriseWeChat: "",
      airCallUserEmail: "",
      gender: "",
      nameEn: "",
      nameZh: "",
      username: "",
      password: "",
      phone: "",
      wechat: "",
      wechatQrcode: "",
      whatsapp: "",
      nickName: "",
      avatar: "",
      whatsappQrcode: "",
      profile: "您好，非常高兴能陪伴您在LingoAce一起学习，我将秉承着认真负责的态度对待每一次课程服务，见证每一位学生的学习成长！",
    });
    const rules = {
      email: [
        {
          required: true,
          message: root.$t("请输入电子邮箱地址"),
          trigger: "blur",
        },
        {
          pattern: /@{1}/,
          message: root.$t("邮箱格式有误"),
        },
      ],
      realName: [
        { required: true, message: root.$t("请输入真实姓名"), trigger: "blur" },
      ],
      gender: [
        { required: true, message: root.$t("请选择性别"), trigger: "blur" },
      ],
      nameEn: [
        { required: true, message: root.$t("请输入英文名称"), trigger: "blur" },
        {
          pattern: /[a-zA-Z]/,
          message: root.$t("只能为英文"),
        },
      ],
      nameZh: [
        { pattern: /^[\u4E00-\u9FA5]+$/, message: root.$t("只能为中文") },
      ],
      username: [
        { required: true, message: root.$t("请输入用户名"), trigger: "blur" },
      ],
      password: [
        { required: true, message: root.$t("请输入密码"), trigger: "blur" },
      ],
      phone: [
        { required: true, message: root.$t("请输入电话号码"), trigger: "blur" },
      ],
      nickName: [
        { required: true, message: root.$t("请输入老师昵称"), trigger: "blur" },
      ],
    };
    const loading = ref(false);
    const worldTelCode = ref(86);
    watch(
      () => worldTelCode,
      (val) => {
        let box = [
          ...window.document.getElementsByClassName("flag-list-box scroll-bar"),
        ][0];
        box.style.display = "none";
      }
    );
    const getUserInfo = async (id) => {
      try {
        loading.value = true;
        const res = await root.$Api.systemManagement.reqOpsUserInfo(id);
        userForm.value = { ...res.userInfo };
        worldTelCode.value = userForm.value.phone.split("-")[0] - 0;
        userForm.value.phone = userForm.value.phone.split("-")[1];
        if (userForm.value.wechatQrcode?.length) {
          refs.wechatQrcodeImg.fileDataList = [
            {
              imgSrc: userForm.value.wechatQrcode,
              filePath: null,
              uid: null,
              imgSrc: userForm.value.wechatQrcode,
              type:'image'
            },
          ];
        }
        if (userForm.value.whatsappQrcode?.length) {
          refs.whatsappQrcode.fileDataList = [
            {
              imgSrc: userForm.value.whatsappQrcode,
              filePath: null,
              uid: null,
              imgSrc: userForm.value.whatsappQrcode,
              type:'image'
            },
          ];
        }
        if (userForm.value.avatar?.length) {
          refs.avatar.fileDataList = [
            {
              imgSrc: userForm.value.avatar,
              filePath: null,
              uid: null,
              imgSrc: userForm.value.avatar,
              type:'image'
            },
          ];
        }
      } finally {
        loading.value = false;
      }
    };
    watch(
      () => props.id,
      (id) => {
        id && getUserInfo(id);
      },
      { immediate: true }
    );

    // 获取预签名函数
    const getSignUrl = async (fileType) => {
      const res = await root.$Api.systemManagement.reqUserCenterUploadSign({
        fileType: fileType,
      });
      return res;
    };
    const config = {
      accept: "image/jpg, image/png, image/jpeg",
      limit: 1,
      maxSize: 2,
      showImgList: true,
      getSignFun: getSignUrl,
    };
    const submitForm = async () => {
      await refs["userInfoForm"].validate();
      const {
        username,
        password,
        realName,
        enterpriseWeChat,
        airCallUserEmail,
        nameZh,
        nameEn,
        gender,
        email,
        phone,
        wechat,
        wechatQrcode,
        nickName,
        profile,
        avatar,
        whatsapp,
        whatsappQrcode,
      } = userForm.value;
      let params = {
        username,
        password,
        realName,
        enterpriseWeChat,
        airCallUserEmail,
        nameZh,
        nameEn,
        gender,
        email,
        phone,
        wechat,
        wechatQrcode,
        nickName,
        profile,
        avatar,
        whatsapp,
        whatsappQrcode,
      };
      if (!props.id) {
        let psws = password;
        var md5 = crypto.createHash("md5");
        md5.update(psws);
        var psw = md5.digest("hex");
        params.password = psw;
        params.username = params.username.replace(/\s+/g, "");
      } else {
        delete params.password;
        delete params.username;
      }
      params.email = email.toLocaleLowerCase().replace(/\s+/g, "");
      params.phone = `${worldTelCode.value} - ${userForm.value.phone}`.replace(
        /\s+/g,
        ""
      );
      try {
        loading.value = true;
        const handelFun = props.id
          ? root.$Api.systemManagement.updateUser
          : root.$Api.systemManagement.addUser;
        const {
          status,
          data: { code, data },
        } = await handelFun(params, props.id);
        if (code === ABNORMAL_CODE.enterpriseWechatAccountBound) {
          root.$notify({
            message: isEn.value ? data.en : data.zh,
            type: "error",
          });
        }
        if (status !== 200 || code !== 200) return Promise.reject();
        root.$notify({ message: root.$t("操作成功"), type: "success" });
        emit("refresh");
        handleClose()
      } finally {
        loading.value = false;
      }
    };
    const handleClose = () => {
      emit("close");
    };

    const changWechatQrcodeImg = (val) => {
      userForm.value.wechatQrcode = val.length ? val[0].filePath : null;
    };
    const changAvatarImg = (val) => {
      userForm.value.avatar = val.length ? val[0].filePath : null;
    };
    const changWhatsappQrcodeImg = (val) => {
      userForm.value.whatsappQrcode = val.length ? val[0].filePath : null;
    };
    return {
      isEn,
      userForm,
      rules,
      worldTelCode,
      loading,
      config,
      submitForm,
      changWechatQrcodeImg,
      changAvatarImg,
      changWhatsappQrcodeImg,
      handleClose,
    };
  },
};
</script>

<style scoped lang="scss">
.user-info-warp {
  width: 600px;
  padding: 0 20px;
  border-radius: 8px;
  padding-bottom: 60px;
  overflow-y: scroll;
  .user-info-footer {
    padding: 10px 0;
    width: 560px;
    position: fixed;
    bottom: 0px;
    text-align: right;
    background-color: #fff;
  }
}
.important-note {
  color: #F56C6C;
  font-size: 12px;
}
</style>
<style>
.flag-list-box {
  background: #fff !important;
}
</style>
