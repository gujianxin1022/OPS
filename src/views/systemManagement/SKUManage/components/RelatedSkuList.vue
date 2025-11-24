<template>
  <div class="sku-related-list">
    <el-select
      v-model="selectId"
      filterable
      clearable
      :disabled="disabled"
      :collapse-tags="true"
      :multiple="true"
      :placeholder="$t('请选择')"
      @change="changeSelect"
    >
      <el-option
        v-for="(item, index) in skuList"
        :key="index"
        :label="getLabel(item)"
        :value="item.skuId"
      >
      </el-option>
    </el-select>
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
import { sortBy } from "lodash-es";
import { deepClone } from "@/utils/handleData";

export default {
  props: ["type", "skuId",'disabled','skuIDlist'],
  setup(props, { root, emit, refs }) {
    const skuList = ref([]);
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const selectId = ref(null);
    const original = ref([]);
    const reqSkuList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.getSKUDetails(
        root.$route.query.spuId
      );
      original.value = data.spu.skus.filter((e) => {
        return e.status === 1 && e.skuId !== props.skuId;
      });
      skuList.value = deepClone(original.value);
      if (props.type !== "新增") {
        skuList.value = original.value.filter((e) => {
          return e.amount > skuAmount.value;
        });
      } else {
        skuList.value = original.value.filter((e) => {
          return e.amount > 1;
        });
      }
      selectId.value=props.skuIDlist
    };
    onMounted(reqSkuList);
    const getLabel = (item) => {
      return isEn.value
        ? `${item.skuId}_${item.nameEn}_${item.amount}Points`
        : `${item.skuId}_${item.nameCn}_${item.amount}课时`;
    };
    const skuAmount = computed(() => root.$store.getters.skuAmount);
    watch(
      () => skuAmount.value,
      (val) => {
        selectId.value = null;
        skuList.value = original.value.filter((e) => {
          return e.amount > val;
        });
      }
    );
    const changeSelect = () => {
      emit("change", selectId.value);
    };
    return { skuList, selectId, getLabel, skuAmount, changeSelect };
  },
};
</script>
