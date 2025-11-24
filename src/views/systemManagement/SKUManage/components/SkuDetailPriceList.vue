<template>
  <div class="sku-price-list">
    <div
      v-for="(item, index) in currencyTotalPriceList"
      :key="item.currencyId"
      class="mb20"
    >
      <span class="item">
        <span>{{ $t("总价") }}</span>
        <el-input-number
          style="width: 130px; display: inline-block; margin: 0 20px"
          v-model="item.totalPrice"
          controls-position="right"
          :disabled="disabled"
          @change="handleChange(index)"
          :min="0"
        ></el-input-number>
        <span>{{ item.currency }}</span>
      </span>
      <span class="item">
        <span>{{ $t("单价") }}</span>
        <span style="color: #7580e5">{{ item.unitPrice || "__" }}</span>
        <span>{{ item.currency }}</span>
      </span>
      <span class="item">
        <span>{{ $t("节省") }}</span>
        <span style="color: #7580e5">{{ item.discount || "--" }}%</span>
      </span>
      <span class="item">
        <span>{{ $t("支付链接") }}</span>
        <span class="thidden payment_links">{{
          item.paymentLinks || "--"
        }}</span>
        <el-button
          v-if="item.paymentLinks"
          @click="onCopyLink(item.paymentLinks)"
          type="text"
          >{{ $t("复制") }}</el-button
        >
      </span>
    </div>
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from "@vue/composition-api";
import { copyLink } from "@/utils/file";
import { sortBy } from "lodash-es";

export default {
  props: {
    currencyList: {
      type: Array,
      default: [],
    },
    fixedPriceList: {
      type: Array,
      default: [],
    },
    type: {
      type: String,
      default: null,
    },
    supportSubscribe: {
      type: Boolean,
      default: null,
    },
  },
  setup(props, { root, emit, refs }) {
    const currencyTotalPriceList = ref([]);
    const skuAmount = computed(() => root.$store.getters.skuAmount);
    onMounted(() => {
      props.currencyList.forEach((e) => {
        const item = {
          currency: e.currency,
          currencyId: e.id || e.currencyId,
          totalPrice: e.totalPrice || 0,
          unitPrice: e.unitPrice || null,
          paymentLinks: e.paymentLinks || null,
          discount: e.discount || null,
        };
        currencyTotalPriceList.value.push(item);
      });
      currencyTotalPriceList.value = sortBy(
        currencyTotalPriceList.value,
        "currencyId"
      );
    });
    const handleChange = (index) => {
      emit("change", currencyTotalPriceList.value);
      const item = currencyTotalPriceList.value[index];
      item.unitPrice = (item.totalPrice / skuAmount.value).toFixed(2);
      const fixedPrice = props.fixedPriceList.find((e) => {
        return e.currency === item.currency;
      }).cost;
      if (fixedPrice > 0) {
        item.discount = (
          ((fixedPrice - item.unitPrice) / fixedPrice) *
          100
        ).toFixed(2);
      }
    };
    const onCopyLink = async (link) => {
      await copyLink(link).then(
        () => {
          root.$notify({
            message: root.$t("复制成功"),
            type: "success",
          });
        },
        () => {
          root.$notify({
            message: root.$t("复制失败"),
            type: "error",
          });
        }
      );
    };
    watch(
      () => skuAmount.value,
      (val) => {
        if (val <= 0) return;
        currencyTotalPriceList.value.forEach((item, index) => {
          if (item.totalPrice) {
            handleChange(index);
          }
        });
      }
    );

    return {
      currencyTotalPriceList,
      handleChange,
      onCopyLink,
      disabled:
        props.type == "查看" ||
        props.supportSubscribe == 1 /* 1支持订阅的禁止编辑,0是不支持的 */,
    };
  },
};
</script>

<style lang="scss" scoped>
.sku-price-list {
  .item {
    margin-right: 50px;
    .payment_links {
      display: inline-block;
      width: 150px;
      vertical-align: top;
      margin-left: 20px;
    }
  }
}
</style>
