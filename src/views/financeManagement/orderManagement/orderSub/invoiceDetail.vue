<template>
  <div class="invoice-wrap">
    <el-dialog
      :before-close="close"
      :close-on-click-modal="false"
      :title="$t('收据')"
      center
      width="40%"
      :visible.sync="show"
    >
      <div class="invoice-inner">
        <div v-if="resultInvoiceInfo" class="invoice-inner-top">
          <div>
            <el-button
              v-show="currentComponent !== 'myDeal'"
              @click="handleShowChangeDialog"
              >{{ $t("修改收据信息") }}</el-button
            >
          </div>
          <div>
            <el-popconfirm
              :title="
                currentLang === 'zh'
                  ? '确认发送至' + resultInvoiceInfo.customerEmail + '吗？'
                  : 'Confirm sending to ' +
                    resultInvoiceInfo.customerEmail +
                    '?'
              "
              @confirm="handleSureSend"
            >
              <el-button
                :disabled="
                  !resultInvoiceInfo.customerAddress ||
                  !resultInvoiceInfo.customerEmail
                "
                slot="reference"
                >{{ $t("发送邮箱") }}</el-button
              >
            </el-popconfirm>
          </div>
        </div>
        <div
          v-if="resultInvoiceInfo"
          class="invoice-inner-pdf mt10"
          v-loading="invoiceLoading"
        >
          <embed
            :src="resultInvoiceInfo.receiptUrl"
            type="application/pdf"
            width="100%"
            height="94%"
          />
        </div>
        <div class="without-invoice-wrap" v-else>
          <i class="el-icon-warning"></i>{{ $t("该订单没有收据") }}
          <p style="line-height:30px;width: 80%;word-break:keep-all"> {{$t('提示：请在家长信息页检查是否已有收据信息，家长名字是否完善。')}} </p>
          <el-button
            :loading="regeneratLoading"
            @click="regenerate(false)"
            style="margin-top: 10px"
          >
            {{ $t("重新生成") }}</el-button
          >
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :before-close="handleCloseChangeDialog"
      :close-on-click-modal="false"
      :title="$t('修改收据信息')"
      center
      width="50%"
      :visible.sync="showChangeDialog"
    >
      <div class="change-invoice-wrap">
        <div
          v-for="(item, index) in parentInvoiceList"
          :key="index"
          @click="handleChangeDefault(index)"
          class="fp-item"
        >
          <div class="left-info">
            <div>
              <i class="el-icon-user"></i><span>{{ item.title }}</span>
            </div>
            <div>
              <i class="el-icon-message"></i><span>{{ item.email }}</span>
            </div>
            <div>
              <i class="el-icon-location-outline"></i
              ><span>{{ item.address }}</span>
            </div>
            <div>
              <i class="el-icon-notebook-2"></i><span>{{ item.notes }}</span>
            </div>
            <div class="default-text" v-if="item.isDefault">
              {{ $t("默认收据信息") }}
            </div>
          </div>
          <div class="right-edit">
            <div
              style="width: 34px; height: 100%; z-index: 1; position: relative"
            ></div>
            <el-radio
              style="position: absolute; left: 0"
              v-model="defaultFpRadio"
              :label="index"
              ><span style="display: none">1</span></el-radio
            >
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="regenerate(true)"
          :disabled="defaultFpRadio === -1"
          :loading="saveLoading"
          >{{ $t("重新生成") }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from "@/utils/handleData";
import { mapGetters } from "vuex";

export default {
  name: "invoiceDetail",
  props: {
    show: {
      default: false,
      type: Boolean,
    },
    currentOrderForInvoice: {
      default: () => {},
      type: Object,
    },
    currentComponent: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      regeneratLoading: false,
      parentInvoiceList: [],
      defaultFpRadio: -1,
      currentInvoiceInfo: {
        email: "",
        address: "",
        title: "",
      },
      showChangeDialog: false,
      resultInvoiceInfo: null,
      invoiceLoading: false,
      saveLoading: false,
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  watch: {
    show(newData) {
      if (newData) {
        this.makeInvoice();
      }
    },
    showChangeDialog(newData) {
      if (newData) {
        this.getParentInvoicesList();
      }
    },
  },
  methods: {
    // 重新生成
    async regenerate(isReCreate) {
      this.regeneratLoading = true;
      try {
        await this.$Api.financeManagement.regenerateReceipt({
          orderId:
            this.currentOrderForInvoice.orderId ||
            this.currentOrderForInvoice.id,
          isReCreate: isReCreate,
        });
      } finally {
        this.regeneratLoading = false;
        this.showChangeDialog = false;
      }
      this.makeInvoice();
    },
    // 关闭第二个弹窗...
    handleCloseChangeDialog() {
      this.showChangeDialog = false;
      this.defaultFpRadio = -1;
    },
    // 打开第二个修改弹窗....
    handleShowChangeDialog() {
      this.showChangeDialog = true;
    },
    // 确定发送
    handleSureSend() {
      this.$Api.financeManagement
        .sendTheEmailOrderInvoice(this.resultInvoiceInfo.id)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({ type: "success", message: "操作成功" });
          }
        });
    },
    // 关闭弹窗
    close() {
      this.$emit("close");
    },
    async handleChangeDefault(index) {
      if (index === this.defaultFpRadio) return;
      this.saveLoading = true;
      this.parentInvoiceList[index].isDefault = true;
      try {
        const {
          status,
          data: { code, data },
        } = await this.$Api.studentManagement.updateParentInvoice(
          this.parentInvoiceList[index]
        );
        if (status !== 200 || code !== 200) return Promise.reject();
        if (this.defaultFpRadio !== -1) {
          this.parentInvoiceList[this.defaultFpRadio].isDefault = false;
        }
        this.defaultFpRadio = index;
      } finally {
        this.saveLoading = false;
      }
    },
    // 生成收据
    makeInvoice() {
      this.invoiceLoading = true;
      let orderId = this.currentOrderForInvoice.id
        ? this.currentOrderForInvoice.id
        : this.currentOrderForInvoice.orderId;
      this.$Api.financeManagement
        .getOrdersInvoiceInfo(orderId)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200 && data.data) {
            this.resultInvoiceInfo = deepClone(data.data);
          } else {
            this.resultInvoiceInfo = null;
          }
          this.invoiceLoading = false;
        })
        .catch((err) => {
          this.invoiceLoading = false;
        });
    },
    // 获取家长所有的收据信息
    getParentInvoicesList() {
      this.$Api.studentManagement
        .getParentInvoices(this.currentOrderForInvoice.parentUserId)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.parentInvoiceList = deepClone(data.data);
            this.defaultFpRadio = this.parentInvoiceList.findIndex(
              (item) => item.isDefault === true
            );
            this.currentInvoiceInfo =
              this.parentInvoiceList[this.defaultFpRadio];
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.without-invoice-wrap {
  width: 100%;
  text-align: center;
  color: #666666;
  font-size: 14px;
  position: relative;
  top: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;

  > i {
    font-size: 78px;
    color: #ff9900;
    margin-bottom: 10px;
  }
}

.change-invoice-wrap {
  width: 100%;
  height: 300px;
  overflow: auto;

  .fp-item {
    cursor: pointer;
    width: 100%;
    height: 150px;
    margin: 4px 0;
    background: #f0f4fb;
    position: relative;
    border: 1px solid #f0f4fb;
    color: rgb(96, 98, 102);
    overflow: hidden;

    .left-top-div {
      position: absolute;
      left: -19px;
      top: -19px;
      width: 30px;
      height: 30px;
      background: #737ddd;
      transform: rotate(45deg);
    }

    .left-info {
      height: 100%;
      width: 95%;
      position: absolute;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      font-size: 14px;
      box-sizing: border-box;
      padding: 15px 20px;
      color: rgb(96, 98, 102);
      > div {
        display: flex;
      }
      > div > i {
        font-size: 16px;
        margin-right: 10px;
      }
      .default-text {
        color: #737ddd;
        font-size: 12px;
      }
    }

    .right-edit {
      height: 100%;
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding-right: 10px;
    }
  }
}

.pd-20 {
  padding: 20px !important;
}

.invoice-inner {
  width: 100%;
  height: 700px;

  .invoice-inner-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .invoice-inner-pdf {
    width: 100%;
    height: 100%;
  }
}
</style>
