<template>
  <!-- 手机号码 -->
  <div class="user-filter-key-warp">
    <span v-show="!phoneIsEdit">
      <span class="value">{{ phone }}</span>
      <i
        class="el-icon-edit-outline"
        style="cursor: pointer"
        @click="phoneIsEdit = true"
        v-if="
          phoneIsEdit === false &&
          Per.handleButtonPer('teach.studentMT.parentInfo.editPhoneNumber')
        "
      ></i>
    </span>
    <span v-show="phoneIsEdit">
      <el-input v-model.trim="phoneNumber" style="width: 198px" show-word-limit>
        <el-select
          style="width: 80px"
          v-model="myCountryCode"
          slot="prepend"
          filterable
          :filter-method="filterCountryHandle"
          :placeholder="$t('请选择国际区号或完善手机号码')"
          @click.native="clickSelectHandle"
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
      <template>
        <el-tooltip
          v-if="!myCountryCode || !phoneNumber || !phoneNumber.length"
          class="item"
          effect="dark"
          :content="$t('请选择国际区号或完善手机号码')"
          placement="top"
        >
          <i class="el-icon-check"></i>
        </el-tooltip>
        <i
          slot="reference"
          v-else
          class="el-icon-check"
          @click="showSecondConfirmationDialog = true"
        ></i>
        <i class="el-icon-close" @click="close" />
      </template>
    </span>

    <el-dialog
      :title="$t('更改电话号码')"
      :center="true"
      :visible.sync="showSecondConfirmationDialog"
      width="500px"
      :before-close="closeDialog"
    >
      <div style="line-height: 32px; font-size: 16px">
        <div>{{ $t("原用户电话号码") }}：{{ `${phone || "-"}` }}</div>
        <div>
          {{ $t("更改后的电话号码") }}：<span style="color: darkorange">{{
            `${myCountryCode}${phoneNumber}`
          }}</span>
        </div>
        <div style="color: #f56c6c; font-size: 12px">
          {{
            $t(
              "电话号码会影响用户后续的登录、找回密码、接收通知等行为，请仔细核对。"
            )
          }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{ $t("取消") }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{
          $t("确定修改")
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('修改成功')"
      :center="true"
      :visible.sync="showResultDialog"
      width="500px"
    >
      <div slot="title" style="font-size: 18px">
        <span
          style="color: #67c23a; vertical-align: middle"
          class="el-icon-success mr10"
        ></span
        >{{ $t("修改成功") }}
      </div>
      <div class="text-wrap" style="line-height: 32px; font-size: 14px">
        <div>
          1、{{
            $t("请将【newValue】以微信或者其他聊天渠道同步给用户;").replace(
              "【newValue】",
              `${myCountryCode}${phoneNumber}`
            )
          }}
        </div>
        <div>
          2、{{
            $t(
              "告知用户需要前往【我的】-【设置】-【帐号设置】中进行邮箱验证以便于后续正常使用。"
            )
          }}<UnverifiedTag :isShowTag="false" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, ref } from "@vue/composition-api";
import { formatterCountryList } from "@/utils/formatCountry";
import UnverifiedTag from "@/views/studentManagement/subPage/componentsForParent/UnverifiedTag.vue";

export default {
  name: "FilterByUserPhone",
  props: {
    phone: {
      type: String,
      default: "",
    },
    countryCode: {
      type: String,
      default: "",
    },
    parentId: {
      type: String,
      default: "",
    },
    userName: {
      type: String,
      default: "",
    },
  },
  components: { UnverifiedTag },
  setup(props, { root, emit }) {
    const phoneIsEdit = ref(false);
    const phoneNumber = ref("");
    const myCountryCode = ref("");
    const countryList = ref([]);
    const countryListCopy = ref([]);
    const getCountryList = () => {
      root.$Api.base.getCountryList().then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          countryList.value = data.data;
          countryListCopy.value = JSON.parse(JSON.stringify(data.data));
          countryList.value = formatterCountryList(data.data);
          countryListCopy.value = countryList.value;
        }
      });
    };
    const isShowTips = props.userName == props.phone;
    const clickSelectHandle = () => {
      countryList.value = countryListCopy.value;
    };
    const changeArea = (data) => {
      myCountryCode.value = data;
    };
    const filterCountryHandle = (val) => {
      let templist = countryListCopy.value;
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
      countryList.value = temp;
    };
    const clickCountryItem = (item) => {
      myCountryCode.value = item.tel;
    };
    const showResultDialog = ref(false);
    const handleTrim = (str) => {
      return str === null ? "" : str.replace(/ /g, "");
    };
    const handleSubmit = async () => {
      const {
        status,
        data: { code },
      } = await root.$Api.studentManagement.updateParentInfo({
        id: props.parentId,
        phone: handleTrim(`${myCountryCode.value}${phoneNumber.value}`),
        countryCode: myCountryCode.value,
      });
      showSecondConfirmationDialog.value = false;
      if (status !== 200 || code !== 200) {
        myCountryCode.value = props.countryCode;
        if (props.phone) {
          phoneNumber.value = props.phone.includes(myCountryCode.value)
            ? props.phone.replace(myCountryCode.value, "")
            : props.phone;
        }
        return;
      }
      showResultDialog.value = true;
      phoneIsEdit.value = false;
      emit(
        "updateParentInfo",
        handleTrim(`${myCountryCode.value}${phoneNumber.value}`),
        myCountryCode.value
      );
    };
    const close = () => {
      phoneIsEdit.value = false;
    };
    onMounted(() => {
      getCountryList();
      myCountryCode.value = props.countryCode;
      if (props.phone) {
        phoneNumber.value = props.phone.includes(myCountryCode.value)
          ? props.phone.replace(myCountryCode.value, "")
          : props.phone;
      }
    });
    const showSecondConfirmationDialog = ref(false);
    const closeDialog = () => {
      showSecondConfirmationDialog.value = false;
    };
    return {
      phoneNumber,
      countryList,
      myCountryCode,
      phoneIsEdit,
      clickSelectHandle,
      changeArea,
      filterCountryHandle,
      clickCountryItem,
      handleSubmit,
      close,
      isShowTips,
      showSecondConfirmationDialog,
      closeDialog,
      showResultDialog,
    };
  },
};
</script>

<style lang="scss">
.user-filter-key-warp {
  .el-popconfirm__main {
    width: 393px !important;
  }
  .el-select .el-input {
    .el-input__inner {
      width: 87px !important;
    }
    width: 87px;
  }
  .el-icon-check {
    color: #67c23a;
    font-weight: 700px;
    margin: 0 6px;
    cursor: pointer;
  }
  .el-icon-check:hover,
  .el-icon-close:hover {
    font-size: 16px;
  }
  .el-icon-close {
    color: #f56c6c;
    font-weight: 700px;
    margin: 0px;
    cursor: pointer;
  }
}
.el-popconfirm__main {
  width: 393px !important;
}
</style>
