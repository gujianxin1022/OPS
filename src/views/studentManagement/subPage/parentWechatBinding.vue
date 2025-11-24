<template>
  <div class="parent-wechat-binding">
    <div class="tips">
      {{ $t("当前正在为学生的家长绑定帐号", { students }) }}
    </div>
    <el-form inline :model="queryState">
      <el-form-item :label="$t('备注名/昵称')">
        <el-input
          clearable
          :placeholder="$t('请输入')"
          v-model="queryState.remarkName"
        />
      </el-form-item>
      <el-form-item :label="$t('绑定情况')">
        <el-select
          clearable
          :placeholder="$t('请选择')"
          v-model="queryState.bindingStatus"
        >
          <el-option
            v-for="item in queryState.bindingList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handlePaginationChange({ page: 1 })">
          {{ $t("查询") }}
        </el-button>
        <el-button type="primary" @click="handleSynchronous()">
          {{ $t("同步微信好友") }}
        </el-button>
      </el-form-item>
    </el-form>
    <BasicTable
      v-loading="tableState.loading"
      :data="tableState.data"
      :column="tableState.columns"
      :pagination="true"
      :page="tableState.page"
      :total="tableState.total"
      :limit="tableState.limit"
      @pagination="handlePaginationChange"
    />
  </div>
</template>

<script>
import {
  reactive,
  computed,
  onActivated,
  ref,
  set,
} from "@vue/composition-api";
import { ABNORMAL_CODE } from "@/utils/constants";

import BasicTable from "@/components/table/basic-table";

const BOUND = 1;
const UN_BOUND = 0;

const { id, userType } = JSON.parse(localStorage.userInfo);

export default {
  components: {
    BasicTable,
  },
  setup(props, { root }) {
    const queryState = reactive({
      remarkName: void 0,
      bindingStatus: UN_BOUND,
      bindingList: computed(() => [
        { label: root.$t("未绑定"), value: UN_BOUND },
        { label: root.$t("已绑定"), value: BOUND },
      ]),
    });
    const handleSynchronous = async () => {
      const res = await root.$Api.studentManagement.reqWechatSync({
        userId:JSON.parse(localStorage.userInfo).id,
      });
      if (res.code === 200) {
        root.$notify.warning({ success: res.data.message });
      } else {
        root.$notify.warning({ message: res.data.message });
      }
    };

    const students = ref("");

    const tableState = reactive({
      total: 0,
      page: 1,
      limit: 50,
      data: [],
      loading: false,
      columns: computed(() => {
        const { page, limit } = tableState;
        return [
          {
            width: "50",
            label: root.$t("序号"),
            render: (h, { $index }) => (page - 1) * limit + $index + 1,
          },
          {
            label: root.$t("微信头像"),
            render: (h, { row }) => (
              <el-image
                fit="cover"
                style="width: 100px; height: 100px"
                src={row.avatar}
              />
            ),
          },
          {
            label: root.$t("微信备注名"),
            prop: "remark",
          },
          {
            label: root.$t("微信昵称"),
            prop: "nickName",
          },
          {
            label: root.$t("绑定情况"),
            render: (h, { row }) =>
              row.bindingStatus === BOUND
                ? root.$t("已绑定")
                : root.$t("未绑定"),
          },
          {
            label: root.$t("绑定的家长ID"),
            render: (h, { row }) => row.parentUserId ?? "--",
          },
          {
            label: root.$t("操作"),
            render: (h, { row }) => (
              <el-button
                type="primary"
                onClick={() => handleBinding(row)}
                loading={row.loading}
              >
                {row.bindingStatus === BOUND
                  ? root.$t("更改绑定")
                  : root.$t("绑定")}
              </el-button>
            ),
          },
        ];
      }),
    });

    const handleBinding = async (row) => {
      if (row.bindingStatus === BOUND) {
        await root.$confirm(
          root.$t(
            "该家长微信已经绑定在其他家长的ops帐号中，是否将此家长微信更改绑定到本家长ops帐号中？"
          ),
          root.$t("提示"),
          { type: "warning", center: true }
        );
        {
          /* 20230303 新增 - 更改绑定逻辑 */
        }
        const { code } = await root.$Api.studentManagement.wechatUpdateBind({
          bindId: row.bindId,
          externalUserId: row.externalUserId,
          operatorId: id,
          parentUserId: root.$route.query.parentId,
        });
        if (code !== 200) return;
        root.$message.success("更改绑定成功");
        handlePaginationChange({ page: 1 });
        return;
      }
      try {
        set(row, "loading", true);
        const {
          status,
          data: { code },
        } = await root.$Api.studentManagement.wechatCreateBind({
          opsUserId: id,
          parentUserId: root.$route.query.parentId,
          externalUserId: row.externalUserId,
        });
        if (code === ABNORMAL_CODE.bindingWechatLimit) {
          return root.$notify.error(
            root.$t("该家长已经绑定超过5个微信，请先解绑再绑定")
          );
        }
        if (status !== 200 || code !== 200) return;
        handlePaginationChange({ page: 1 });
        root.$message.success("绑定成功");
      } finally {
        set(row, "loading", false);
      }
    };

    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      queryTableData();
    };

    const queryTableData = async () => {
      try {
        tableState.loading = true;
        const { bindingList, ...rest } = queryState;
        const {
          status,
          data: { code, data },
        } = await root.$Api.studentManagement.getParentWechatList({
          ...rest,
          userId: id,
          pageNum: tableState.page,
          pageSize: tableState.limit,
        });
        if (code === ABNORMAL_CODE.noBindingsWeChat) {
          return root.$notify.error(
            root.$t("请先联系ITsupport，绑定您的企微账号")
          );
        }
        if (status !== 200 || code !== 200) return;
        Object.assign(tableState, { data: data.list, total: data.total });
      } finally {
        tableState.loading = false;
      }
    };

    const queryStudent = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.studentManagement.getParentUserBasicInfo(
        root.$route.query.parentId
      );
      if (status !== 200 || code !== 200) return;
      students.value = data.studentList
        .flatMap((v) => {
          return v.status === 1 && v.realName ? [v.realName] : [];
        })
        .join("、");
    };

    onActivated(() => {
      queryStudent();
      queryTableData();
    });

    return {
      students,
      queryState,
      tableState,
      handleSynchronous,
      handlePaginationChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.parent-wechat-binding {
  padding: 24px;
  .tips {
    margin-bottom: 16px;
  }
}
</style>
