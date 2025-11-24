<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="close"
    :title="$t('创建账号')"
    :visible.sync="showCreateSDialog"
    width="40%"
    center
  >
    <div class="create-context">
      <div class="create-wraning">
        <p>
          {{
            $t(
              "student-management-Account created will be assigned to owner with default password: lingoace123"
            )
          }}
        </p>
        <p>
          {{ $t("The course advisor is the person who creates the account") }}
        </p>
      </div>
      <div>
        <el-form
          :model="userForm"
          :rules="rules"
          ref="userForm"
          class="userForm"
        >
          <el-form-item :label="$t('手机号码')" prop="phone">
            <div class="flex">
              <el-input
                v-model="userForm.phone"
                style="width: 340px; position: relative; top: 9px"
                show-word-limit
              >
                <el-select
                  :style="currentLang == 'en' ? 'width:135px' : 'width:100px'"
                  v-model="worldTelCode"
                  slot="prepend"
                  filterable
                  :filter-method="filterCountryHandle"
                  :placeholder="$t('请选择')"
                  @click.native="clickSelectHandle"
                  :no-data-text="
                    isChinaTelCode ? $t('不支持中国区手机号注册') : $t('无数据')
                  "
                  @change="changeArea"
                >
                  <el-option-group
                    v-for="(group, key) in countryList"
                    :key="key"
                    :label="key"
                  >
                    <el-option
                      v-for="item in group"
                      @click.native="clickCountryItem(item)"
                      :key="item.nameEn"
                      :label="item.tel"
                      :value="item.tel"
                    >
                      <span style="margin-right: 20px; font-size: 12px"
                        >{{ item.nameZh }} &nbsp;&nbsp; {{ item.nameEn }}</span
                      >
                      <span style="font-size: 12px">{{ item.tel }}</span>
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item :label="$t('电子邮箱')" prop="email">
            <el-input v-model="userForm.email" style="width: 340px"></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('学生名字')"
            prop="studentRealName"
          >
            <el-input
              v-model="userForm.studentRealName"
              style="width: 340px"
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('my-home-student-Gender')" prop="studentSex">
            <el-radio-group v-model="userForm.studentSex">
              <el-radio :label="1">{{ $t("male") }}</el-radio>
              <el-radio :label="2">{{ $t("female") }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label="$t('student-management-Date of Birth')"
            prop="studentBirthday"
          >
            <el-date-picker
              v-model="userForm.studentBirthday"
              type="date"
              :placeholder="$t('选择日期')"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            :label="$t('student-management-Internal Staff')"
            prop="isStaff"
          >
            <el-radio-group v-model="userForm.isStaff">
              <el-radio :label="1">{{ $t("是") }}</el-radio>
              <el-radio :label="0">{{ $t("否") }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('渠道')" prop="channel">
            <el-select v-model="userForm.channel" :placeholder="$t('请选择')">
              <el-option
                v-for="item in channelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-if="userForm.channel === ApiConstants.refferChannelCode"
              style="width: 180px"
              v-model="userForm.referrerUserIdentify"
              :placeholder="$t('请选择推荐人账号(选填)')"
            ></el-input>
            <el-input
              v-if="userForm.channel === ApiConstants.refferChannelCode"
              style="width: 190px; margin-left: 50px; margin-top: 3px"
              v-model="userForm.wechat"
              :placeholder="$t('请输入家长微信号(必填)')"
            ></el-input>
            <el-input
              v-if="userForm.channel === ApiConstants.thirdPartyChannelCode"
              style="width: 190px"
              v-model="userForm.wechat"
              :placeholder="$t('请输入家长微信号(必填)')"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t("取消") }}</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="sureCreateStudentUser"
        >{{ $t("创建账号") }}</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { formatterCountryList } from "../../../utils/formatCountry";
import countryCodeSelector from "vue-country-code-selector";
import { mapGetters } from "vuex";
export default {
  components: {
    countryCodeSelector,
  },
  props: {
    showCreateSDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      channelOptions: [],
      loading: false,
      worldTelCode: "",
      userForm: {
        studentRealName: "",
        studentSex: "",
        studentBirthday: "",
        isStaff: 0,
        channel: "",
        email: "",
        phone: "",
        wechat: "",
        referrerUserIdentify: "",
      },
      countryList: [],
      countryListCopy: [],
      rules: null,
      regionCode: "",
      isChinaTelCode: false,
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
    formChannel() {
      return this.userForm.channel;
    },
  },
  watch: {
    formChannel() {
      this.userForm.referrerUserIdentify = "";
      this.userForm.wechat = "";
      this.$refs["userForm"].clearValidate(["channel"]);
    },
    currentLang() {
      this.initData();
    },
  },
  methods: {
    clickCountryItem(item) {
      this.worldTelCode = item.tel;
      this.regionCode = item.code;
    },
    changeArea(data) {
      this.worldTelCode = data;
    },
    clickSelectHandle() {
      this.countryList = this.countryListCopy;
    },
    // 国家筛选处理函数
    filterCountryHandle(val) {
      this.isChinaTelCode = val === "+86";
      let templist = this.countryListCopy;
      let temp = {};
      if (val) {
        for (let key in templist) {
          templist[key].forEach((item) => {
            if (
              item["nameZh"].indexOf(val) > -1 ||
              item["nameEn"]
                .toLocaleLowerCase()
                .indexOf(val.toLocaleLowerCase()) > -1 ||
              item["tel"].indexOf(val) > -1
            ) {
              if (temp[key]) {
                temp[key].push(item);
              } else {
                temp[key] = [{ ...item }];
              }
            }
          });
        }
      } else {
        temp = templist;
      }
      this.countryList = temp;
    },
    // 关闭创建家长账号弹窗
    close() {
      this.$emit("closeCreateStudentUser");
    },
    // 数据初始化
    initData() {
      this.channelOptions = [
        { label: this.$t("团购团员"), value: "RF-OTA-GB-NA-NA" },
        { label: this.$t("转介绍"), value: "RF-OTA-NA-NA-NA" },
        { label: this.$t("第三方软文"), value: "PM-WC-WCC-NA-YTH" },
        { label: this.$t("新/印/泰付费"), value: "PM-NA-NA-NA-NA" },
        { label: this.$t("新/印/泰转介绍"), value: "RF-NA-NA-NA-NA" },
        { label: this.$t("新/印/泰自然流量"), value: "OT-NA-NA-NA-NA" },
      ];
      let testPhone = (rule, value, callback) => {
        let { email, phone } = this.userForm;
        if (phone) {
          if (!this.worldTelCode) {
            return callback(this.$t("请选择区号"));
          }
        }
        if (email && !phone) {
          return callback();
        }
        if (!email && phone) {
          if (!this.worldTelCode) {
            return callback(this.$t("请选择区号"));
          }
          return callback();
        }
        if (!email && !phone) {
          return callback(this.$t("手机号和邮箱至少填一个"));
        }
        return callback();
      };
      let testEmail = (rule, value, callback) => {
        let { email, phone } = this.userForm;
        if (email && !phone) {
          return callback();
        }
        if (!email && !phone) {
          return callback(this.$t("手机号和邮箱至少填一个"));
        }
        return callback();
      };
      let testChannel = (rule, value, callback) => {
        let { channel, wechat } = this.userForm;
        if (!channel) {
          return callback(this.$t("请选择渠道"));
        }
        if (
          !wechat &&
          (channel === this.ApiConstants.refferChannelCode ||
            channel === this.ApiConstants.thirdPartyChannelCode)
        ) {
          return callback(this.$t("请填写微信号"));
        }
        return callback();
      };
      this.rules = {
        phone: [{ required: true, validator: testPhone, trigger: "blur" }],
        email: [{ required: true, validator: testEmail, trigger: "blur" }],
        studentRealName: [
          {
            required: true,
            message: this.$t("my-home-Please Enter Student Name"),
            trigger: "blur",
          },
        ],
        studentSex: [
          {
            required: true,
            message: this.$t("select-student-Gender"),
            trigger: "change",
          },
        ],
        studentBirthday: [
          {
            required: true,
            message: this.$t("select-Date of Birth"),
            trigger: "change",
          },
        ],
        isStaff: [
          {
            required: true,
            message: this.$t(
              "Please select whether it is an internal employee or not"
            ),
            trigger: "change",
          },
        ],
        channel: [{ required: true, validator: testChannel, trigger: "blur" }],
        wechat: [
          {
            required: true,
            message: this.$t("请输入家长微信号"),
            trigger: "blur",
          },
        ],
      };
      this.getCountryList();
    },
    getCountryList() {
      this.$Api.base.getCountryList().then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.countryList = data.data;
          this.countryListCopy = JSON.parse(JSON.stringify(data.data));

          this.countryList = formatterCountryList(data.data);
          this.countryListCopy = this.countryList;
        }
      });
    },
    sureCreateStudentUser() {
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.userForm.studentBirthday = new Date(
            this.userForm.studentBirthday
          ).toISOString();
          let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
          let {
            studentRealName,
            studentSex,
            studentBirthday,
            isStaff,
            channel,
            email,
            phone,
            wechat,
            referrerUserIdentify,
          } = this.userForm;
          let params = {
            countryCode: `${phone ? this.worldTelCode : ""}`,
            regionCode: this.regionCode,
            adviserUserId: userInfo.id,
            adviserUserName: userInfo.username,
            adviserUserPhone: userInfo.phone == null ? "" : userInfo.phone,
            studentRealName,
            studentSex,
            studentBirthday,
            isStaff,
            channel,
            email,
            phone,
            wechat,
            referrerUserIdentify,
          };
          this.$Api.studentManagement
            .registryStudentUser(params)
            .then(({ status, data }) => {
              if (data.code === 200) {
                this.$notify({
                  message: this.$t("Student account created successfully"),
                  type: "success",
                });
                this.userForm = this.$options.data().userForm;
                this.$emit("closeCreateStudentUser");
                this.$emit("getNewStudentListData");
              }
              this.loading = false;
            });
        }
      });
    },
  },
  created() {
    this.initData();
  },
};
</script>
<style lang="scss">
.create-context {
  width: 100%;
  padding: 0 20px;

  .create-wraning {
    background-color: #feead5;
    color: #f4984b;
    border: 1px solid #f4984b;
    padding: 0 10px;
    border-radius: 4px;
  }
  .userForm {
    margin-top: 20px;
  }
  .flex {
    display: flex;
    align-items: center;
    position: relative;
    top: -10px;
  }
}
</style>
<style >
.flag-list-box {
  background: #fff!important;
}
</style>