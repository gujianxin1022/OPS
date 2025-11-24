<template>
  <div>
    <el-dialog
      :title="$t('转账方式')"
      :visible.sync="dialogVisible"
      append-to-body
      width="800px"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div>
        <div class="mb20">
          {{
            $t(
              "订单已创建，选择转账方式后可生成生成转账信息~ (用户在用户端操作后也可以生成转账信息）"
            )
          }}
        </div>
        <el-radio-group v-model="payMethodId">
          <el-radio
            v-for="item in payMethodList"
            :key="item.id"
            :label="item.id"
            >{{ item.label }}
            <span v-show="item.id === 10">({{ $t("所有借记卡均适用") }})</span>
            <span v-show="item.id === 11"
              >({{ $t("仅部分美国借记卡可用，")
              }}<el-button type="text">
                <a
                  href="https://www.zellepay.com/get-started"
                  target="_blank"
                  >{{ $t("查看Zelle可用银行") }}</a
                > </el-button
              >)</span
            ></el-radio
          ><br />
        </el-radio-group>
        <template v-if="payMethodId === 10">
          <br />
          <el-divider content-position="center">{{
            $t("用户银行卡的发放地是哪里？")
          }}</el-divider>
          <el-radio-group v-model="countryCode">
            <el-radio
              class="mb5"
              style="display: inline-block; width: 80px"
              v-for="item in contoryList"
              :key="item.code"
              :label="item.code"
              >{{ isEn ? item.nameEn : item.name }}</el-radio
            >
          </el-radio-group>
          <br />
          <br />
          <div style="font-weight: 700">
            {{ $t("说明：为什么要区分银行卡的发放国家？") }}
          </div>
          <br />
          <div class="text-wrap mb10" style="line-height: 20px">
            {{
              $t(
                "系统会优先根据用户银行卡发卡地出示对应地区的收款账号，为本地转账，不需要支付跨境手续费。如果用户银行卡发卡地不在系统支持的币种国家范围内，系统会发放银行地区为香港的全球收款账号，可能会有跨境手续费（不同用户银行可能会有跨境手续费减免）。"
              )
            }}
          </div>
          <div class="text-wrap mb10" style="line-height: 20px">
            {{
              $t(
                "例：美元订单，如果用户是美国的银行卡，则会出示美国本地的收款账号，走本地转账网络；如果用户的卡不是美国的，需要走跨境转账网络，会出示我们在香港银行的美元收款账号。"
              )
            }}
          </div>
          <div class="text-wrap" style="line-height: 20px">
            {{
              $t(
                "注：如果不知道用户的发卡国家，请让用户在用户端自主操作选择支付方式。"
              )
            }}
          </div>
         
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">{{ $t("确认") }}</el-button>
      </span>
    </el-dialog>
    <TransferDetail
      v-if="showTransferDetail && bankTransferDetail"
      :rowData="rowData"
      :bankTransferDetail="bankTransferDetail"
      @handleClose="closeAllDialog"
      @refreshList="refreshList"
    />
  </div>
</template>
<script>
import { ref, watch, computed, onMounted } from "@vue/composition-api";
import TransferDetail from "@/views/studentManagement/components/TransferDetail.vue";
export default {
  name: "TransferMethod",
  props: {
    dialogVisible: { type: Boolean, default: false },
    orderInfo: { type: Object, default: false },
  },
  components: { TransferDetail },
  setup(props, { emit, root, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const isZelle = ref(false);
    const handleClose = () => {
      emit("update:dialogVisible", false);
    };
    const closeAllDialog = () => {
      emit("handleClose");
      handleClose();
    };
    const refreshList = () => {
      emit("refreshList");
    };

    const payMethodList = ref([]);
    const ruleId = ref(null);
    const reqMethods = async () => {
      const res = await root.$Api.financeManagement.reqPayRuleAndPayMethod({
        orderId: props.orderInfo.id,
        payVersion: "1",
        isOps: "1",
      });
      const payMethodChannel = root.Constants.getPayMethodChannel(isEn.value);
      ruleId.value = res.payRoutingRuleId;
      payMethodList.value = mergeArrays(res.payMethodVoList, payMethodChannel);
      if (!payMethodList.value || !payMethodList.value.length) {
        root.$notify.warning(root.$t("暂无可用的转账方式"));
        setTimeout(() => {
          closeAllDialog()
        }, 500);
      }
      contoryList.value = root.Constants.filterCountryCodeListByCurrency(
        props.orderInfo.currency
      );
    };
    const mergeArrays = (payMethodVoList, payMethodChannel) => {
      return payMethodVoList.map((item) => {
        const found = payMethodChannel.find(
          (channel) => item.id === channel.value
        );
        return found ? { ...item, ...found } : item;
      });
    };
    const contoryList = ref([]);
    const payMethodId = ref(null);
    const countryCode = ref(null);
    const rowData = ref(null);
    const bankTransferDetail = ref(null);
    const showTransferDetail = ref(false);
    const submit = async () => {
      if (!payMethodId.value) {
        return root.$notify.warning(root.$t("请选择转账方式"));
      }
      if (payMethodId.value === 10 && !countryCode.value) {
        return root.$notify.warning(root.$t("请选择用户银行卡的发放地"));
      }
      const params = {
        isOps: 1,
        orderId: props.orderInfo.id,
        payMethodId: payMethodId.value,
        countryCode: countryCode.value,
        ruleId: ruleId.value,
      };
      const res = await root.$Api.financeManagement.reqAccountCode(params);
      // const bankTransferDetail1 = {
      //   "Account name": "demo+lingo",
      //   "Postal Code": "",
      //   "Branch code": "478",
      //   "Bank account number": "798287965",
      //   "Account location": "Hong Kong SAR",
      //   "Bank address":
      //     "18th Floor, The Center, 99 Queen’s Road Central, Central",
      //   City: "Hong Kong SAR",
      //   "Bank code": "016",
      //   "SWIFT code": "DHBKHKHH",
      //   "Bank name": "DBS Bank (Hong Kong) Limited",
      //   "Account Type": "Current",
      // };
      // const payChannel = "airwallex";
      // const type = "bank transfer";

      handleClose();
      bankTransferDetail.value = res.bankTransferDetail;
      rowData.value = {
        payChannel: res.payChannel,
        payType: res.type,
      };
      console.log(bankTransferDetail.value);
      showTransferDetail.value = true;
    };
    watch(
      () => props.dialogVisible,
      (val) => {
        val && reqMethods();
      }
    );
    return {
      isEn,
      isZelle,
      handleClose,
      payMethodList,
      payMethodId,
      countryCode,
      contoryList,
      submit,
      rowData,
      bankTransferDetail,
      closeAllDialog,
      showTransferDetail,
      refreshList,
    };
  },
};
</script>
<style scoped lang="scss"></style>
