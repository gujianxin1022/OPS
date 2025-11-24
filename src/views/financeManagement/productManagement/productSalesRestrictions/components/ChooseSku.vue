<template>
  <div class="choose-sku">
    <span>{{
      $t("已经添加$个/最多添加500个").replace("$", selectList.length)
    }}</span>
    <el-button @click="dialogVisible = true" type="text">{{
      $t("添加")
    }}</el-button>
    <BasicTable
      height="500px"
      v-show="selectList.length"
      ref="selectTable"
      header-cell-class-name="my-theme-color-header"
      border
      :data="selectList"
      :column="tableState.columns2"
    />
    <el-dialog
      :title="$t('添加商品')"
      :visible.sync="dialogVisible"
      width="1000px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="5vh"
    >
      <template slot="title">
        <span style="font-size: 20px">{{ $t("添加商品") }}</span>
        <span style="color: #666666; margin-left: 10px"
          >( {{ $t("注：不支持跨页勾选") }} )</span
        >
      </template>
      <div>
        <screen-wrapper
          :screenTitle="$t('filter queries')"
          @search="
            () => {
              search();
            }
          "
        >
          <screen-item :label="$t('交易 - 是否上架')" label-width="100">
            <el-select
              class="onshow-select"
              style="width: 100px"
              v-model="screenData.status"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in SPU_SKULIST_STATUS_NOT_ALL"
                :key="item.id"
                :label="currentLang === 'zh' ? item.nameZh : item.nameEn"
                :value="item.id"
              />
            </el-select>
          </screen-item>
          <screen-item :label="$t('SKU')" label-width="80">
            <FilterBySkuOrSpu
              @search="search"
              @change="
                (type, value) => {
                  if (type == 1) {
                    screenData.skuName = value;
                    screenData.skuId = '';
                  } else {
                    screenData.skuId = value;
                    screenData.skuName = '';
                  }
                }
              "
            />
          </screen-item>
          <screen-item :label="$t('SPU')" label-width="80" :part="4">
            <FilterBySkuOrSpu
              @search="search"
              @change="
                (type, value) => {
                  if (type == 1) {
                    screenData.spuName = value;
                    screenData.spuId = '';
                  } else {
                    screenData.spuId = value;
                    screenData.spuName = '';
                  }
                }
              "
            />
          </screen-item>
        </screen-wrapper>
        <BasicTable
          height="500px"
          ref="chooseTable"
          header-cell-class-name="my-theme-color-header"
          border
          v-loading="tableState.loading"
          :data="curPageList"
          :column="tableState.columns"
          @selection-change="
            (list) => {
              chooseList = list;
            }
          "
        />
        <el-pagination
          v-show="curPageList.length"
          @current-change="handleCurrentChange"
          class="mt10"
          style="text-align: right"
          layout="total,sizes,prev, pager, next"
          :total="tableState.total"
          :current-page.sync="tableState.page"
          :page-sizes="[100, 200, 300, 500, 1000, 2000]"
          @size-change="handleSizeChange"
          :page-size="tableState.limit"
        >
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="(dialogVisible = false), changeSelect()"
          >{{ $t("确定") }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  onMounted,
  ref,
  reactive,
  computed,
  unref,
  watch,
} from "@vue/composition-api";
import BasicTable from "@/components/table/basic-table";
import {
  SPU_SKULIST_STATUS_NOT_ALL,
  getStatus,
  getValidType,
} from "@/views/systemManagement/SKUManage/components//constants";
import FilterBySkuOrSpu from "./FilterBySkuOrSpu.vue";
import { deepClone } from "@/utils/handleData";
export default {
  components: { BasicTable, FilterBySkuOrSpu },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const currentLang = computed(() => root.$store.getters.currentLang);
    const dialogVisible = ref(false);
    const screenData = reactive({
      name: "",
      id: "",
      appShow: -1,
      status: 1,
      spuName: "",
      spuId: "",
      skuName: "",
      skuId: "",
      pageNum: 1,
      pageSize: 10000,
    });
    const reqSkuList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.getSKUList({
        name: "",
        id: "",
        appShow: -1,
        status: -1,
        skuId: "",
        pageNum: 1,
        pageSize: 10000,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      tableState.data = data.list || [];
    };
    const tableState = reactive({
      page: 1,
      limit: 100,
      total: 0,
      loading: false,
      data: [],
      columns: computed(() => {
        return [
          {
            type: "selection",
          },
          {
            label: root.$t("是否上架"),
            prop: "status",
            width: 100,
            render: (_, { row }) => {
              return <span>{getStatus(row.status, currentLang)}</span>;
            },
          },
          {
            label: root.$t("SKU ID"),
            prop: "skuId",
            width: 80,
          },
          {
            minWidth: 100,
            label: root.$t("SKU名称"),
            prop: "skuNameCn",
          },
          {
            label: root.$t("SPU ID"),
            prop: "spuId",
            width: 80,
          },
          {
            label: root.$t("SPU名称"),
            prop: "spuNameCn",
          },
          {
            label: root.$t("课时数"),
            prop: "amount",
            width: 80,
          },
          {
            label: root.$t("价格(美元)"),
            prop: "currencyTotalPriceList",
            width: 100,
            render: (_, { row }) => {
              return <span>{getUSDPrice(row.currencyTotalPriceList)}</span>;
            },
          },
          {
            label: root.$t("有效期"),
            prop: "validityTime",
            width: 100,
            render: (_, { row }) => {
              return (
                <span>
                  {row.validityTime}
                  {getValidType(row.validityType, currentLang)}
                </span>
              );
            },
          },
        ];
      }),
      columns2: computed(() => {
        return [
          {
            label: root.$t("是否上架"),
            prop: "status",
            width: 100,
            render: (_, { row }) => {
              return <span>{getStatus(row.status, currentLang)}</span>;
            },
          },
          {
            label: root.$t("SKU ID"),
            prop: "skuId",
            width: 80,
          },
          {
            minWidth: 100,
            label: root.$t("SKU名称"),
            prop: "skuNameCn",
          },
          {
            label: root.$t("SPU ID"),
            prop: "spuId",
            width: 80,
          },
          {
            label: root.$t("SPU名称"),
            prop: "spuNameCn",
          },
          {
            label: root.$t("课时数"),
            prop: "amount",
            width: 80,
          },
          {
            label: root.$t("价格(美元)"),
            prop: "currencyTotalPriceList",
            width: 100,
            render: (_, { row }) => {
              return <span>{getUSDPrice(row.currencyTotalPriceList)}</span>;
            },
          },
          {
            label: root.$t("有效期"),
            prop: "validityTime",
            width: 100,
            render: (_, { row }) => {
              return (
                <span>
                  {row.validityTime}
                  {getValidType(row.validityType, currentLang)}
                </span>
              );
            },
          },
          {
            label: root.$t("操作"),
            render: (h, { row }) => (
              <el-button type="text" onClick={() => handleRemove(row.skuId)}>
                {root.$t("删除")}
              </el-button>
            ),
          },
        ];
      }),
    });
    const curPageList = ref([]);
    const handleCurrentChange = (page) => {
      tableState.page = page;
      let startIndex = (tableState.page - 1) * tableState.limit;
      let data = deepClone(resultSkuList.value);
      curPageList.value = data.slice(startIndex, startIndex + tableState.limit);
    };
    const handleSizeChange = (size) => {
      tableState.page = 1;
      tableState.limit=size
      let startIndex = (tableState.page - 1) * tableState.limit;
      let data = deepClone(resultSkuList.value);
      curPageList.value = data.slice(startIndex, startIndex + tableState.limit);
    };
    const getUSDPrice = (list) => {
      if (!list) return "-";
      let usd = "";
      list.forEach((e) => {
        if (e.currency === "USD") {
          usd = e.totalPrice;
        }
      });
      return usd;
    };
    const resultSkuList = ref([]);
    const search = () => {
      tableState.page = 1;
      tableState.loading = true;
      let allList = JSON.parse(JSON.stringify(tableState.data));
      let result = allList.filter(
        (item) =>
          item.status === screenData.status &&
          (!screenData.spuName ||
            item.spuNameCn.includes(screenData.spuName)) &&
          (!screenData.spuId || item.spuId == screenData.spuId) &&
          (!screenData.skuName ||
            item.skuNameCn.includes(screenData.skuName)) &&
          (!screenData.skuId || item.skuId == screenData.skuId)
      );
      resultSkuList.value = result;
      dataEcho();
      tableState.loading = false;
    };
    const chooseList = ref([]);
    const selectList = ref([]);
    const changeSelect = () => {
      selectList.value = selectList.value.concat(deepClone(chooseList.value));
      let skuList = [];
      selectList.value.forEach((e) => {
        skuList.push(e.skuId);
      });
      selectList.value.sort(function (a, b) {
        return a.skuId - b.skuId;
      });
      emit("changeSelect", skuList);
    };
    const changeSelectList = (ids) => {
      if (!tableState.data.length) {
        setTimeout(() => {
          changeSelectList(ids);
        }, 500);
      } else {
        ids.forEach((e) => {
          tableState.data.some((i) => {
            if (i.skuId === e) {
              selectList.value.push(i);
            }
          });
        });
      }
    };
    watch(
      () => dialogVisible.value,
      (val) => {
        if (!val) return;
        search();
        dataEcho();
      }
    );
    const dataEcho = () => {
      let skuList = [];
      selectList.value.forEach((e) => {
        skuList.push(e.skuId);
      });
      resultSkuList.value = resultSkuList.value.filter((e) => {
        return !skuList.includes(e.skuId);
      });
      tableState.total = resultSkuList.value.length;
      handleCurrentChange(1);
    };
    onMounted(() => {
      reqSkuList();
    });
    const handleRemove = (skuId) => {
      selectList.value = selectList.value.filter((e) => {
        return e.skuId !== skuId;
      });
      let skuList = [];
      selectList.value.forEach((e) => {
        skuList.push(e.skuId);
      });
      emit("changeSelect", skuList);
    };
    return {
      isEn,
      tableState,
      dialogVisible,
      currentLang,
      screenData,
      SPU_SKULIST_STATUS_NOT_ALL,
      search,
      resultSkuList,
      chooseList,
      selectList,
      changeSelect,
      changeSelectList,
      dataEcho,
      handleRemove,
      handleCurrentChange,
      handleSizeChange,
      curPageList,
    };
  },
};
</script>
<style lang="scss">
.choose-sku {
  .onshow-select {
    .el-input__inner {
      width: 100px;
    }
  }
}
</style>
