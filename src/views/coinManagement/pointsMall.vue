<!-- http://localhost:8080/financeManagement/pointsMall -->
<template>
  <div class="points-mall-warp p20">
    <custom-card :title="$t('积分商城商品列表')">
      <div slot="header-right">
        <el-button
          v-if="
            Per.handleButtonPer('financeMT.productManagement.pointsMall.edit')
          "
          type="primary"
          @click="
            () => {
              operationType = 'create';
              currentProduct = {};
              drawer = true;
            }
          "
        >
          {{ $t("创建") }}
        </el-button>
      </div>
      <BasicTable
        v-loading="loadingList"
        class="points-mall-product-list"
        header-cell-class-name="my-theme-color-header"
        border
        :data="tableState.data"
        :column="tableState.columns"
        :pagination="true"
        :page="tableState.page"
        :total="tableState.total"
        :limit="tableState.limit"
        @pagination="handlePaginationChange"
        :pageSizes="[10, 20, 30, 50, 100, 200]"
      />
    </custom-card>
    <el-drawer
      v-if="drawer"
      :visible.sync="drawer"
      direction="rtl"
      :with-header="false"
      :wrapperClosable="false"
      :close-on-press-escape="false"
    >
      <EditPointsProduct
        @refresh="reqProductList"
        :productInfo="currentProduct"
        :visible.sync="drawer"
        :operationType="operationType"
      />
    </el-drawer>
  </div>
</template>
<script>
import {
  onMounted,
  ref,
  reactive,
  computed,
  unref,
  toRefs,
} from "@vue/composition-api";
import BasicTable from "@/components/table/basic-table";
import { deepClone } from "@/utils/handleData";
import Sortable from "sortablejs";
import dragIcon from "@/assets/drag.png";
import EditPointsProduct from "./components/EditPointsProduct";
import QRCode from "qrcode";
import { copyLink } from "@/utils/file";

export default {
  components: {
    BasicTable,
    EditPointsProduct,
  },
  props: {
    myClassName: {
      type: String,
      default: "",
    },
  },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const loadingState = reactive({
      loadingList: false,
    });
    const operationType = ref("create");
    const tableState = reactive({
      total: 0,
      page: 1,
      limit: 50,
      data: [],
      columns: computed(() => {
        const { page, limit } = tableState;
        return [
          {
            width: "50",
            label: root.$t("序号"),
            fixed: true,
            render: (h, { $index }) => (page - 1) * limit + $index + 1,
          },
          {
            label: root.$t("ID"),
            fixed: true,
            prop: "id",
            minWidth: 80,
          },
          {
            label: root.$t("referenceID"),
            fixed: true,
            prop: "reference",
            minWidth: 120,
            renderHeader: (_, { row }) => {
              return (
                <div>
                  {root.$t("Reference ID")}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content={root.$t(
                      "Reference ID为该商品在关联系统的ID。若是课时类商品则为sku ID，若为电子教室装扮，则为该装扮在电子教室列表的ID。"
                    )}
                    placement="right"
                  >
                    <i
                      class={"iconfont ppIcon-problem"}
                      style={"font-size:13px;margin-left:5px;cursor:pointer"}
                    ></i>
                  </el-tooltip>
                </div>
              );
            },
          },
          {
            label: root.$t("商品名称"),
            fixed: true,
            minWidth: 150,
            render: (_, { row }) => {
              return JSON.parse(row.nameCommon)?.zh || "-";
            },
          },
          {
            label: root.$t("图片"),
            width: 100,
            prop: "firstImage",
            render: (_, { row }) => {
              return (
                <div>
                  {row.firstImage &&
                  row.firstImage.length >= 3 &&
                  row.firstImage[0].imageDetail ? (
                    <img
                      style="width:80px;height:80px"
                      src={row.firstImage[0].imageDetail[0].url}
                    ></img>
                  ) : (
                    <span>-</span>
                  )}
                </div>
              );
            },
          },
          {
            label: root.$t("标签"),
            prop: "tabDesc",
            render: (_, { row }) => {
              return JSON.parse(row.tabDesc)?.zh
                ? `${JSON.parse(row.tabDesc)?.zh}/${
                    JSON.parse(row.tabDesc)?.en
                  }/${JSON.parse(row.tabDesc)?.fr}`
                : "-";
            },
          },
          {
            label: root.$t("活动价"),
            prop: "unitCoin",
            width: isEn.value ? 150 : 80,
          },
          {
            label: root.$t("原价"),
            prop: "originalCoin",
            width: isEn.value ? 150 : 80,
          },
          { label: root.$t("库存"), prop: "inventory" },
          {
            label: root.$t("已兑换数量"),
            prop: "sold",
            width: 120,
          },
          {
            label: root.$t("上架时间"),
            prop: "putAwayTime",
            width: "150",
            render: (_, { row }) => {
              return (
                <span>
                  {row.putAwayTime
                    ? root.DateTimeUtils.dateClockTime(row.putAwayTime)
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("下架时间"),
            prop: "soldOutTime",
            width: "150",
            render: (_, { row }) => {
              return (
                <span>
                  {row.soldOutTime
                    ? root.DateTimeUtils.dateClockTime(row.soldOutTime)
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("上下架状态"),
            prop: "status",
            width: isEn.value ? 220 : 180,
            render: (_, { row }) => {
              return (
                <div>
                  <el-switch
                    onChange={() => reqChangeStatus(row)}
                    active-value={row.status != 2}
                    inactive-value={row.status == 2}
                    active-text={root.$t("上架")}
                    inactive-text={root.$t("下架")}
                  ></el-switch>
                </div>
              );
            },
          },
          {
            label: root.$t("操作"),
            width: isEn.value ? 200 : 150,
            render: (h, { row }) => (
              <div>
                <span class="handle-target-wrap">
                  <img src={dragIcon} class="handle-target" />
                </span>
                <el-button
                  onClick={() => handelEdit(row)}
                  class="ml10"
                  type="text"
                  disabled={
                    !root.Per.handleButtonPer(
                      "financeMT.productManagement.pointsMall.edit"
                    )
                  }
                >
                  {root.$t("编辑")}
                </el-button>
                <el-popover
                  onShow={() => showShare(row)}
                  placement="right"
                  width="580"
                  trigger="click"
                >
                  <el-input
                    disabled
                    style="width: 550px;"
                    value={row.shareLink}
                    class="input-with-select"
                  >
                    <el-button
                      slot="append"
                      type="primary"
                      style="color: #7580E5;"
                      onClick={() => onCopyLink(row.shareLink)}
                    >
                      {root.$t("复制专属链接")}
                    </el-button>
                  </el-input>
                  <img
                    style="width:150px;height:150px;vertical-align:middle"
                    id="qrImg"
                    src={myQRCode.value}
                  ></img>
                  <el-button type="text" onClick={() => downloadQrCode()}>
                    {root.$t("下载二维码")}
                  </el-button>
                  <el-button
                    class="ml10"
                    disabled={
                      !root.Per.handleButtonPer(
                        "financeMT.productManagement.pointsMall.share"
                      )
                    }
                    slot="reference"
                    type="text"
                  >
                    {root.$t("分享")}
                  </el-button>
                </el-popover>
                <el-button
                  class="ml10"
                  type="text"
                  disabled={
                    !root.Per.handleButtonPer(
                      "financeMT.productManagement.pointsMall.delete"
                    )
                  }
                  onClick={() => handelDelete(row)}
                >
                  {root.$t("移除")}
                </el-button>
              </div>
            ),
          },
        ];
      }),
    });
    const reqProductList = async () => {
      try {
        Object.assign(tableState, { data: [], total: 0 });
        loadingState.loadingList = true;
        const res = await root.$Api.coinManagement.getPointsMallProductList(
          tableState.page,
          tableState.limit
        );
        Object.assign(tableState, {
          data: res?.list ?? [],
          total: res?.total ?? 0,
        });
      } finally {
        loadingState.loadingList = false;
        createRowDrop();
      }
    };
    const handlePaginationChange = async (info) => {
      Object.assign(tableState, info);
      await reqProductList();
    };
    const createRowDrop = () => {
      try {
        const tbody = document.querySelector(
          `.points-mall-product-list .el-table__body-wrapper tbody`
        );
        Sortable.create(tbody, {
          handle: ".handle-target",
          animation: 150,
          async onEnd({ newIndex, oldIndex }) {
            if (newIndex === oldIndex) return;
            const copyTableData = deepClone(unref(tableState.data));
            const currentRow = copyTableData.splice(oldIndex, 1)[0];
            let params = {
              id: currentRow.id,
              newNo: (tableState.page - 1) * tableState.limit + newIndex + 1,
            };
            await root.$Api.financeManagement.reqSortPointsProduct(params);
            reqProductList();
          },
        });
      } catch (e) {
        console.log(e);
      }
    };
    /* 上下架 */
    const reqChangeStatus = async (row) => {
      await root.$Api.financeManagement.reqUpdatePointsProductStatus({
        id: row.id,
        status: row.status == 2 ? 3 : 2,
      });
      row.status = row.status == 2 ? 3 : 2;
      reqProductList();
      root.$notify.success(root.$t("操作成功"));
    };
    /* 移除 */
    const handelDelete = async (row) => {
      if (row.status == 2) {
        root.$notify.warning(root.$t("只有下架状态的商品才能移除"));
        return;
      }
      await root.$Api.financeManagement.reqDeletePointsProduct(row.id);
      reqProductList();
      root.$notify.success(root.$t("操作成功"));
    };
    /* 分享 */
    const myQRCode = ref(null);
    const qrCodeCreated = (referrerUrl) => {
      return new Promise((resolve) => {
        QRCode.toDataURL(referrerUrl)
          .then((imageBase64) => {
            resolve(imageBase64);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    };
    const showShare = async (row) => {
      let qrcode = await qrCodeCreated(row.shareLink);
      myQRCode.value = qrcode;
    };
    const onCopyLink = async (link) => {
      await copyLink(link)
        .then(
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
        )
        .finally(() => {});
    };
    const downloadQrCode = async (src) => {
      var img = document.getElementById("qrImg"); // 获取要下载的图片
      var url = img.src;
      var a = document.createElement("a");
      var event = new MouseEvent("click");
      a.download = root.$t("分享二维码");
      a.href = url;
      a.dispatchEvent(event);
    };
    /* 抽屉逻辑 */
    const currentProduct = ref(null);
    const drawer = ref(false);
    const handelEdit = (row) => {
      operationType.value = "edit";
      currentProduct.value = row;
      drawer.value = true;
    };
    onMounted(() => {
      reqProductList();
    });
    return {
      isEn,
      tableState,
      drawer,
      currentProduct,
      ...toRefs(loadingState),
      reqProductList,
      handlePaginationChange,
      operationType,
    };
  },
};
</script>
<style lang="scss">
.points-mall-warp {
  .handle-target-wrap {
    vertical-align: middle;
    .handle-target {
      display: inline-block;
      width: 20px;
      height: 15px;
      position: relative;
      top: 3px;
      cursor: pointer;
      .el-icon-s-operation {
        color: #333;
      }
    }
  }
}
</style>
