<template>
  <div style="display: inline-block">
    <!-- <el-button
      v-show="from !== 'transferMethod'"
      type="text"
      @click="openDialog"
      >{{ $t("转账信息") }}</el-button
    > -->
    <el-dialog
      :title="$t('转账信息')"
      :visible.sync="dialogVisible"
      append-to-body
      width="600px"
      v-if="dialogVisible"
      :before-close="handleClose"
    >
      <div
        v-if="transferInfo.length && rowData.payChannel && rowData.payType"
        class="transfer-info-warp"
      >
        <div class="copy">
          <div style="text-align: right">
            <el-button type="text" @click="onCopyLink">{{
              $t("一键复制")
            }}</el-button>
          </div>
          <el-form
            label-position="right"
            :label-width="isEn ? '180px' : '150px'"
          >
            <el-form-item
              v-for="item in transferInfo"
              :key="item.label"
              :label="item.label"
            >
              <span>{{ item.value }}</span>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="isZelle" class="tips mt20">
          <span>{{ $t("注意：") }}</span
          ><br />
          <span class="text-wrap">{{
            $t(
              "1.请协助用户核对转账金额、转账账号、转账识别码与上方信息一致。转账识别码填写在Memo/备注栏，到账后订单自动更改为已支付（同一订单支持多次Zelle转账，转账总额需要订单金额一致）；"
            )
          }}</span
          ><br />
          <span class="text-wrap">{{
            $t(
              "2.一般发起转账后10分钟内到账，首次使用或银行限制的条件下预计1-3个工作日到账；"
            )
          }}</span
          ><br />
          <span class="text-wrap">{{
            $t(
              "3.同一订单到账资金总数或转账识别码与订单不符为转账异常，无法自动添加课时。系统将以邮件和OPS站内信方式通知您，请关注。"
            )
          }}</span>
        </div>
        <div v-else class="tips mt20">
          <span>{{ $t("注意：") }}</span
          ><br />
          <span class="text-wrap">{{
            $t(
              "1.请协助用户核对转账币种、金额和转账信息与订单一致，避免转账错误；"
            )
          }}</span
          ><br />
          <span class="text-wrap">{{
            $t(
              "2.转账时若有SWIFT跨境手续费，请引导用户选择“Share（分担）”的方式支付；"
            )
          }}</span
          ><br />
          <span class="text-wrap">{{
            $t(
              "3.资金到账后订单状态自动更改为已支付；到账资金数异常系统将以邮件和站内信方式通知您，请关注；"
            )
          }}</span>
          <br />
          <span class="text-wrap">{{
            $t("4.不同订单转账信息不同，切勿保存多次使用。")
          }}</span>
        </div>
      </div>
      <div v-else class="transfer-info-warp">
        <div class="title mb20">{{ $t("暂未生成") }}</div>
        <div class="mb10 content">
          <span>{{ $t("选择转账方式后可生成转账信息～") }}</span>
        </div>
        <div class="mb10 content">
          ({{ $t("用户在用户端操作后也可以生成转账信息") }})
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">{{
          $t("关闭")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ref, onMounted, computed } from "@vue/composition-api";

export default {
  props: {
    rowData: {
      type: Object,
      default: () => {},
    },
    from: {
      type: String,
      default: "",
    },
    bankTransferDetail: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit, root, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const dialogVisible = ref(false);
    const transferInfo = ref([]);
    const isZelle = ref(false);
    const handleClose = () => {
      dialogVisible.value = false;
      emit("refreshList");
      emit("handleClose");
    };
    /* 构建展示字段 */
    const buildInfoList = (bankTransferDetail) => {
      let list = [];
      if (!bankTransferDetail) {
        return list;
      }
      const colon = root.$t("：");
      [
        "Account name",
        "Account Type",
        "Bank account number",
        "ACH routing number",
        "Fedwire routing number",
        "SWIFT code",
        "IBAN",
        "Bank code",
        "Branch code",
        "Bank name",
        "BSB code",
        "Account location",
        "Bank address",
        "City",
        "ZIP Code",
        "Postal Code",
      ].forEach((key) => {
        const value = bankTransferDetail[key];
        if (value) {
          if (isZelle.value) {
            if (key === "Account name") {
              list.push({
                label: root.$t("收款账号"),
                value,
              });
            }
            if (key === "Bank account number") {
              list.push({
                label: root.$t("转账识别码"),
                value,
              });
            }
          } else {
            list.push({
              label: root.$t(key),
              value,
            });
          }
        }
      });
      return list;
    };
    const onCopyLink = async () => {
      let copyString = "";
      transferInfo.value.forEach((e) => {
        copyString += `${e.label}:${e.value}\n`;
      });
      navigator.clipboard
        .writeText(copyString)
        .then(function () {
          root.$notify({
            message: root.$t("复制成功"),
            type: "success",
          });
        })
        .catch(function (error) {
          root.$notify({
            message: root.$t("复制失败"),
            type: "error",
          });
        });
    };
    onMounted(() => {
        isZelle.value = props.rowData.payChannel === "Zelle";
        console.log(props.bankTransferDetail)
        transferInfo.value = buildInfoList(props.bankTransferDetail);
        dialogVisible.value = true;
        console.log( transferInfo.value)
        console.log(props.rowData)
    });

    return {
      dialogVisible,
      onCopyLink,
      transferInfo,
      isEn,
      isZelle,
      handleClose,
    };
  },
};
</script>
<style scoped lang="scss">
.transfer-info-warp {
  .copy {
    padding: 0 10px 20px 10px;
    background-color: #e5e6fe;
    .el-form-item {
      margin-bottom: 0px !important;
    }
  }
  .tips {
    text-align: left;
    line-height: 26px;
  }
  .title {
    text-align: center;
    font-size: 16px;
    font-weight: 700;
  }
  .content {
    text-align: center;
  }
}
</style>
<style lang="scss">
.transfer-info-warp {
  .el-form-item__content {
    text-align: left !important;
  }
}
</style>
