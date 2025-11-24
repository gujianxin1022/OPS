<script>
import {
  markRaw,
  onMounted,
  reactive,
  ref,
  unref,
  computed,
  onBeforeUnmount,
} from "@vue/composition-api";
import moment from "moment";
import AddAllowList from "./compontents/addAllowList.vue";
import { parentIdValidate } from "@/utils/reg.js";

export default {
  name: "AllowList",
  props: { allowListType: Number },
  setup(props, { root }) {
    const searchState = reactive({
      addTime: [void 0, void 0],
      createUser: "",
      parentUserId: "",
      status: null,
    });
    const stateOptions = computed(() => [
      { label: root.$t("已启用"), value: 0 },
      { label: root.$t("已禁用"), value: 1 },
    ]);
    const addVisible = ref(false);
    const tableState = reactive({ loading: true, data: [] });
    const paginationState = reactive({ total: 0, pageNum: 1, pageSize: 50 });

    const handleSearch = () => {
      paginationState.pageNum = 1;
      queryAllowList();
    };
    const updateStatus = async (id, status) => {
      const {
        status: _status,
        data: { code },
      } = await root.$Api.systemManagement.updateAllowListStatus(id, +!status);
      if (_status !== 200 || code !== 200) return Promise.reject();
      queryAllowList();
    };
    const handleCurrentChange = (val) => {
      paginationState.pageNum = val;
      queryAllowList();
    };
    const handleSizeChange = (val) => {
      Object.assign(paginationState, { pageNum: 1, pageSize: val });
      queryAllowList();
    };
    const queryAllowList = async () => {
      if (searchState && searchState.parentUserId && !parentIdValidate(root, searchState.parentUserId)) {
        return;
      }
      tableState.loading = true;
      const { pageNum, pageSize } = paginationState;
      const { createUser, parentUserId, status, addTime } = searchState;
      const [startTime, endTime] = addTime;
      const {
        status: _status,
        data: { code, data },
      } = await root.$Api.systemManagement.queryAllowList(props.allowListType, {
        startTime,
        endTime:
          endTime &&
          new Date(moment(endTime).set({ hours: 23, minutes: 59, seconds: 59 })),
        createUser,
        parentUserId,
        status,
        pageNum,
        pageSize,
      });
      if (_status !== 200 || code !== 200) return Promise.reject();
      tableState.loading = false;
      paginationState.total = data.total;
      tableState.data = markRaw(data.list);
    };
    const resetAddTime = () => void (searchState.addTime = [void 0, void 0]);

    onMounted(() => {
      queryAllowList();

      document
        .getElementsByClassName("el-range__close-icon")[0]
        .addEventListener("click", resetAddTime);
    });
    onBeforeUnmount(() => {
      document
        .getElementsByClassName("el-range__close-icon")[0]
        .removeEventListener("click", resetAddTime);
    });

    return () => (
      <div class="allow-list">
        <screen-wrapper
          onSearch={handleSearch}
          screenTitle={
            root.$route.meta.title[
              root.$store.getters.currentLang === "zh" ? "nameZh" : "nameEn"
            ]
          }
        >
          <div class="search-item">
            <div class="label">{root.$t("添加时间")}</div>
            <el-date-picker
              value={searchState.addTime}
              type="daterange"
              range-separator="-"
              start-placeholder={root.$t("开始日期")}
              end-placeholder={root.$t("结束日期")}
              picker-options={{
                onPick: ({ minDate, maxDate }) => {
                  if (minDate && maxDate)
                    searchState.addTime = [minDate, maxDate];
                },
              }}
            />
          </div>
          <div class="search-item">
            <div class="label">{root.$t("添加操作人")}</div>
            <el-input
              value={searchState.createUser}
              placeholder={root.$t("请输入")}
              onInput={(value) => void (searchState.createUser = value.trim())}
            />
          </div>
          <div class="search-item">
            <div class="label">{root.$t("家长id")}</div>
            <el-input
              value={searchState.parentUserId}
              placeholder={root.$t("请输入")}
              onInput={(value) =>
                void (searchState.parentUserId = value.trim())
              }
            />
          </div>
          <div class="search-item">
            <div class="label">{root.$t("状态")}</div>
            <el-select
              clearable
              value={searchState.status}
              placeholder={root.$t("请选择")}
              onChange={(value) => void (searchState.status = value)}
            >
              {unref(stateOptions).map((item) => (
                <el-option
                  key={item.value}
                  value={item.value}
                  label={item.label}
                />
              ))}
            </el-select>
          </div>
        </screen-wrapper>
        <section class="table-title">
          <div>{root.$t("数据列表")}</div>
          <el-button
            type="primary"
            onClick={() => void (addVisible.value = true)}
          >
            {root.$t("添加")}
          </el-button>
        </section>
        <section class="table-body">
          <el-table v-loading={tableState.loading} data={tableState.data}>
            <el-table-column
              width="50"
              label={root.$t("序号")}
              scopedSlots={{
                default: ({ $index }) =>
                  (paginationState.pageNum - 1) * paginationState.pageSize +
                  $index +
                  1,
              }}
            />
            <el-table-column
              label={root.$t("添加时间")}
              scopedSlots={{
                default: ({ row: { createTime } }) =>
                  moment(createTime).format("YYYY-MM-DD HH:mm:ss"),
              }}
            />
            <el-table-column
              width="100"
              prop="createUser"
              label={root.$t("添加操作人")}
            />
            <el-table-column
              prop="parentUserId"
              label={root.$t("家长ID")}
            />
            <el-table-column
              label={root.$t("有效期开始时间")}
              scopedSlots={{
                default: ({ row: { validStartTime } }) =>
                  moment(validStartTime).format("YYYY-MM-DD HH:mm:ss"),
              }}
            />
            <el-table-column
              label={root.$t("有效期结束时间")}
              scopedSlots={{
                default: ({ row: { validEndTime } }) =>
                  moment(validEndTime).format("YYYY-MM-DD HH:mm:ss"),
              }}
            />
            <el-table-column
              width="70"
              prop="status"
              label={root.$t("状态")}
              scopedSlots={{
                default: ({ row }) => root.$t(row.status ? "已禁用" : "已启用"),
              }}
            />
            <el-table-column
              width="120"
              fixed="right"
              label={root.$t("操作")}
              scopedSlots={{
                default: ({ row: { id, status } }) => (
                  <div>
                    <el-button
                      type="text"
                      size="small"
                      onClick={() => void updateStatus(id, status)}
                      disabled={!status}
                    >
                      {root.$t("启用")}
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      onClick={() => void updateStatus(id, status)}
                      disabled={status}
                    >
                      {root.$t("禁用")}
                    </el-button>
                  </div>
                ),
              }}
            />
          </el-table>
          <custom-pagination
            total={paginationState.total}
            page-size={paginationState.pageSize}
            current-page={paginationState.pageNum}
            onGetCurrentPage={handleCurrentChange}
            onGetPerPage={handleSizeChange}
          />
        </section>
        <AddAllowList
          value={unref(addVisible)}
          allowListType={props.allowListType}
          onInput={(value) => void (addVisible.value = value)}
          onOk={handleSearch}
        />
      </div>
    );
  },
};
</script>

<style lang="scss" scoped>
.allow-list {
  padding: 10px 0;
  .screent-content {
    display: flex;
    align-items: center;
    .search-item {
      display: flex;
      align-items: center;
      margin: 0 10px 10px 0;
      &:first-child,
      &:last-child {
        .label {
          width: 58px;
        }
      }
      .label {
        color: #606266;
        font-size: 14px;
        margin-right: 12px;
        white-space: nowrap;
      }
    }
  }
  .table-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    > div {
      color: #99a9bf;
      font-size: 14px;
    }
  }
  .table-body {
    padding: 0 15px;
  }
}
</style>
