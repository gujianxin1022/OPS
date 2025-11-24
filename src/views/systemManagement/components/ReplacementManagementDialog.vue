<template>
  <div>
    <el-dialog
      :title="$t('指定代管')"
      :visible.sync="visible"
      top="5vh"
      width="80%"
      close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div>
        <el-form label-position="left" label-width="100px">
          <el-form-item :label="$t('离职人')">
            {{ currentUser.userInfo.username }}
            <span v-if="currentUser.userInfo && currentUser.userInfo.email"
              >({{ currentUser.userInfo.email }})</span
            >
          </el-form-item>
          <el-form-item :label="$t('离职日期')">
            <FilterBySingleDate
              ref="FilterBySingleDate"
              style="width: 300px"
              :clearable="false"
              :defaultCurDate="true"
              @changeSelect="changeSingleDate"
              :invalidTime="new Date()"
              invalidTimeDirection="old"
            />
          </el-form-item>
          <el-form-item :label="$t('指定代管人')">
            <FilterByOPSAccountOrEmail
              style="width: 300px"
              @change="
                (user) => {
                  if (!user) {
                    agentUserId = '';
                  } else {
                    agentUserId = user.id;
                    setDefauleAgent(user);
                  }
                }
              "
              :excludedUserId="currentUser.userInfo.id"
            />
          </el-form-item>
          <el-form-item :label="$t('被代管人列表')">
            <el-table :data="custodianslist" style="width: 100%" height="500px">
              <el-table-column :label="$t('姓名')" prop="username" width="180">
              </el-table-column>
              <el-table-column :label="$t('邮箱')" prop="email" width="180">
              </el-table-column>
              <el-table-column label="指定代管人">
                <template v-slot="{ row, $index }">
                  <FilterByOPSAccountOrEmail
                    :ref="'FilterByOPSAccountOrEmail' + $index"
                    style="width: 300px"
                    @change="
                      (user) => {
                        if (!user) {
                          delete row.agentId;
                          return;
                        }
                        row.agentId = user.id;
                      }
                    "
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="submitLoading" type="primary" @click="confirm">
          {{ $t("提交代管设置") }}
        </el-button>
        <el-button @click="handleClose">{{ $t("关闭") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  toRefs,
  onMounted,
  computed,
  set,
  unref,
} from "@vue/composition-api";
import FilterByOPSAccountOrEmail from "@/components/FilterItem/UserDimensionFilter/FilterByOPSAccountOrEmail";
import FilterBySingleDate from "@/components/FilterItem/CommodityFilter/FilterBySingleDate";

export default {
  props: {
    visible: { type: Boolean, default: false },
    currentUser: { type: Boolean, default: {} },
  },
  components: { FilterByOPSAccountOrEmail, FilterBySingleDate },
  setup(props, { root, emit, refs }) {
    const setDefauleAgent = (user) => {
      if (custodianslist.value && custodianslist.value.length) {
        custodianslist.value.forEach((e, i) => {
          refs[`FilterByOPSAccountOrEmail${i}`].autoSearchAndSelect(
            user.username
          );
        });
      }
    };
    const submitLoading = ref(false);
    const handleClose = () => {
      emit("update:visible", false);
    };
    const checkAgentId = (custodiansList) => {
      if (agentUserId.value === "" || !agentUserId.value) {
        root.$notify.error(root.$t(`请指定代管人`));
        return false;
      }
      // 判断是否为空数组
      console.log(custodiansList);
      if (!Array.isArray(custodiansList) || custodiansList.length === 0)
        return true;
      const hasValidAgentId = custodiansList.every((item) => item.agentId);
      if (!hasValidAgentId) {
        console.log();
        root.$notify.error(root.$t(`请指定代管人`));
        return false;
      }
      return true;
    };
    const agentUserId = ref("");

    const confirm = async () => {
      if (!checkAgentId(custodianslist.value)) return;
      const params = {};
      if (custodianslist.value.length) {
        let transferAgentMap = new Map();
        custodianslist.value.forEach((ele) => {
          transferAgentMap.set(ele.pendingResignationId, ele.agentId);
        });
        console.log(transferAgentMap);
        params.transferAgentMap = Object.fromEntries(transferAgentMap);
      }
      params.agentUserId = agentUserId.value;
      params.dmissionUserId = props.currentUser.userInfo.id;
      params.dimissionTime = dimissionTime.value;
      try {
        submitLoading.value = true;
        const res = await root.$Api.systemManagement.reqHandleUserDimission(
          params
        );
        root.$notify.success(root.$t("操作成功"));
        setTimeout(() => {
          emit("updateList");
          handleClose();
        }, 1000);
      } finally {
        submitLoading.value = false;
      }
    };
    const custodianslist = ref([]);
    const listLoading = ref(false);
    const reaList = async () => {
      try {
        listLoading.value = true;
        const res = await root.$Api.systemManagement.reqListOfCustodians({
          agentId: props.currentUser.userInfo.id,
        });
        custodianslist.value = res || [];
      } finally {
        listLoading.value = false;
      }
    };
    const dimissionTime = ref();
    const changeSingleDate = (time) => {
      dimissionTime.value = time[0];
    };
    onMounted(reaList);
    return {
      handleClose,
      confirm,
      submitLoading,
      custodianslist,
      agentUserId,
      changeSingleDate,
      setDefauleAgent,
    };
  },
};
</script>

<style lang="scss" scoped></style>
