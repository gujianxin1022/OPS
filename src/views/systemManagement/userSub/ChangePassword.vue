<template>
  <div>
    <el-dialog
      :visible.sync="show"
      :close-on-click-modal="false"
      :append-to-body="true"
      :show-close="canClose"
      :close-on-press-escape="canClose"
      :width="currentLang=='en' ? '500px' : '400px'"
      center
      :before-close="handleClose"
    >
    <div slot="title" style="text-align: left; height: auto;">
      <span style="font-size: 20px;">{{ $t('glb-Change Password') }}</span><br>
      <span style="font-size: 12px; color: #ccc;"> {{ $t('glb-Change Password desc') }} </span>
      <br>
    </div>
      <el-form
        :rules="rules"
        ref="form"
        :model="form"
        :label-width="currentLang == 'en' ? '125px' : '80px'"
      >
        <el-form-item :label="$t('glb-Old Password')" prop="oldPassword">
          <el-input show-password v-model="form.oldPassword" :placeholder="$t('glb-Change Old Password')" @change="oldPasswordErrorShow=false" :class="oldPasswordErrorShow ? 'oldPasswordRed' : ''"></el-input>
          <span v-if="oldPasswordErrorShow" style="font-size: 12px; color: #f56c6c; line-height: 1;padding-top: 4px;position: absolute;top: 100%;left: 0;">{{ $t('Incorrect old password') }}</span>
        </el-form-item>
        <el-form-item :label="$t('glb-New Password')" prop="newPassword" class="twrapext-">
          <el-input show-password v-model="form.newPassword" :placeholder="$t('glb-Change New Password')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="canClose" @click="handleClose">{{
          $t("my-home-CCancel")
        }}</el-button>
        <el-button type="primary" :loading="loading" @click="sureChange">{{
          $t("my-home-CConfirm")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { userInfo } from "os";
import { mapGetters } from "vuex";
const crypto = require("crypto");
export default {
  name: "ChangePassword",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    userInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      const regular=/^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{12,20}$/
      if (value.length < 1) {
        callback(new Error(this.$t("glb-Change New Password")));
      }
      if(!regular.test(value)){
        callback(new Error(this.$t("glb-Password Format Error")));
      }
      if (value == this.form.oldPassword) {
        callback(new Error(this.$t("glb-Password Same Old And New Passwords error")));
      }
      else {
        callback();
      }
    };
    return {
      oldPasswordErrorShow: false,
      loading: false,
      form: {
        newPassword: "",
        oldPassword: "",
      },
      rules: {
        newPassword: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword,
          },
        ],
        oldPassword: [
          {
            required: true,
            message: this.$t("glb-Change Old Password"),
            trigger: "blur",
          },
        ],
      },
      canClose: "",
    };
  },
  methods: {
    /**
     * 确认修改
     */
    sureChange() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          let userId = this.userInfo.userInfo.id,
            // newPassword = this.form.newPassword,
            // oldPassword = this.form.oldPassword;
          newPassword = this.md5(this.form.newPassword),
          oldPassword = this.md5(this.form.oldPassword)
          this.$Api.systemManagement
            .changeUserPassword(userId, oldPassword, newPassword)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$notify({
                  message: "修改成功",
                  type: "success",
                });
                this.handleClose();
              } else {
                console.log(data)
                if(data.code == 10005){
                  this.oldPasswordErrorShow = true
                }
              }
              this.loading = false;
            });
        }
      });
    },
    /**
     * md5 加密
     */
    md5(psw) {
      var md5 = crypto.createHash("md5");
      md5.update(psw);
      var result = md5.digest("hex");
      return result;
    },
    /**
     * 取消修改
     */
    handleClose() {
      this.$emit("closeChangePsw");
    },
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  created() {
    this.canClose = this.$attrs.necessary != "1";
  },
};
</script>

<style lang="scss">
  .oldPasswordRed {
    .el-input__inner{
      border-color: #f56c6c;
    }
}
</style>