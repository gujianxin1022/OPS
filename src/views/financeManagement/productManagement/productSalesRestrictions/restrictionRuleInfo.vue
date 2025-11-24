<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span v-show="handleType === 'create'">{{ $t("新建规则") }}</span>
      <span v-show="handleType === 'edit'">{{ $t("编辑规则") }}</span>
      <span v-show="handleType === 'view'">{{ $t("规则详情") }}</span>
      <span v-show="handleType === 'copy'">{{ $t("复制规则") }}</span>
      <el-button
        v-show="handleType !== 'view'"
        style="float: right; width: 108px"
        @click="submit"
        class="submit-btn"
        type="primary"
        >{{ $t("保存") }}</el-button
      >
    </div>
    <div class="restriction-rule-info-warp" v-loading="loading">
      <div class="form-warp">
        <el-form
          :disabled="handleType === 'view'"
          class="my-form"
          :rules="rules"
          ref="myForm"
          :model="formState"
          :label-width="isEn?'165px':'130px'"
        >
          <el-form-item :label="$t('规则名称')" prop="ruleName">
            <el-input
              maxlength="20"
              :placeholder="$t('请输入')"
              class="w375"
              v-model="formState.ruleName"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('规则描述')" prop="ruleDesc">
            <el-input
              type="textarea"
              :placeholder="$t('请输入')"
              maxlength="100"
              show-word-limit
              class="w375"
              rows="2"
              v-model="formState.ruleDesc"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('生效时间')" prop="startTime">
            <FilterByTimePeriod
              ref="datePicker"
              @changeSelect="
                (timeArr) => {
                  formState.startTime = timeArr[0];
                  formState.endTime = timeArr[1];
                }
              "
              :defaultTimeArr="defaultTimeArr"
            />
          </el-form-item>
          <el-form-item :label="$t('适用商品(SKU)')" prop="skuList">
            <ChooseSku
              ref="chooseSku"
              @changeSelect="
                (ids) => {
                  formState.skuList = ids;
                }
              "
            />
          </el-form-item>
          <el-form-item :label="$t('适用群体')" prop="addSaleRuleDetailReqList">
            <AddSaleRules
              ref="addSaleRules"
              @changeSelect="
                (list) => {
                  formState.addSaleRuleDetailReqList = list;
                }
              "
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-card>
</template>

<script>
import { onMounted, ref, unref, computed } from "@vue/composition-api";
import { deepClone } from "../../../../utils/handleData";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod.vue";
import ChooseSku from "./components/ChooseSku.vue";
import AddSaleRules from "./components/AddSaleRules.vue";
import { withNewSaleRule } from "./dataConfig/communicate";

export default {
  components: { FilterByTimePeriod, ChooseSku, AddSaleRules },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const formState = ref({
      ruleName: "",
      ruleDesc: "",
      skuList: [],
      addSaleRuleDetailReqList: [],
      startTime: "",
      endTime: "",
    });
    const validateSaleRule = async (rule, value, callback) => {
      value.some((e) => {
        if (e.ruleType === 1 && e.userType === 0) {
          /* ops用户条件筛选 */
          if (
            e.opsUserChannel === "" ||
            e.typeContain === null ||
            !e.userRuleIdList?.length
          ) {
            callback(new Error(root.$t("请完善OPS用户筛选条件")));
          }
        }
        if (e.ruleType === 1 && e.userType === 1) {
          /* C端用户条件筛选 */
          if (e.userChannel === "" || e.typeContain === null) {
            callback(new Error(root.$t("请完善C端用户筛选条件")));
          }
          if (e.userChannel === 1) {
            /* 校验新/续签 */
            if (!e.userChannelDetail || !e.userChannelDetail.length) {
              callback(new Error(root.$t("请完善C端用户筛选条件")));
            }
          }
          if (e.userChannel === 0) {
            /* 校验渠道码 */
            e.channelCode.some((code) => {
              if (code.startsWith("-") || code.includes("--")) {
                callback(new Error(root.$t("请检查渠道码是否正确")));
              }
            });
          }
        }
        if (e.ruleType === 2 && e.userType === 1) {
          /* C端用户上传 */
          if (e.markId === "") {
            callback(new Error(root.$t("请上传")));
          }
        }
      });
    };
    const rules = {
      ruleName: [
        { required: true, message: root.$t("请输入"), trigger: "blur" },
      ],
      ruleDesc: [
        { required: true, message: root.$t("请输入"), trigger: "blur" },
      ],
      startTime: [
        { required: true, message: root.$t("请选择"), trigger: "change" },
      ],
      skuList: [
        { required: true, message: root.$t("请选择"), trigger: "none" },
      ],
      addSaleRuleDetailReqList: [
        { required: true, trigger: "blur", validator: validateSaleRule },
      ],
    };
    const routesMemoryList = computed(
      () => root.$store.state.tabs.routesMemoryList
    );
    const resetForm = async () => {
      // refs["myForm"].reset();
    };
    const deleteTabPage = async () => {
      let item, index;
      const routes = unref(routesMemoryList);
      routes.forEach((routeItem, routeIndex) => {
        if (routeItem.name === "restrictionRuleInfo") {
          item = routeItem;
          index = routeIndex;
        }
      });
      root.$notify.success(root.$t("操作成功"));
      await resetForm();
      setTimeout(() => {
        root.$router.push(`/financeManagement/restrictionRuleList`);
        root.$store.commit("DELETE_ROUTE", [item, index]);
      }, 800);
      withNewSaleRule.value = true;
    };
    const finalData = ref({});
    const submit = async () => {
      await refs["addSaleRules"].buildParameters();
      finalData.value = deepClone(formState.value);
      await refs["myForm"].validate();
      if (handleType.value === "copy") {
        delete finalData.value.id;
      }
      if (
        new Date(finalData.value.startTime).getTime() < Date.now() &&
        handleType.value === "create"
      ) {
        return root.$notify.warning(root.$t("开始时间需大于当前时间"));
      }
      if (finalData.value.skuList.length > 800) {
        return root.$notify.warning(root.$t("超出可添加的最大数量限制"));
      }
      try {
        loading.value = true;
        if (handleType.value === "edit") {
          await root.$Api.financeManagement.reqSaleRuleEdit(finalData.value);
        } else {
          await root.$Api.financeManagement.reqSaleRuleCreated(finalData.value);
        }
        deleteTabPage();
      } finally {
        loading.value = false;
      }
    };
    const handleType = ref("");
    onMounted(() => {
      const { id, type } = root.$route.query;
      handleType.value = type;
      reqDetail(id);
    });
    const reqDetail = async (id) => {
      if (id === undefined) return;
      try {
        loading.value = true;
        const res = await root.$Api.financeManagement.reqSaleRuleDetail({ id });
        defaultTimeArr.value = [res.startTime, res.endTime];
        formState.value = {
          id: id,
          ruleName:
            handleType.value === "copy"
              ? (res.ruleName += "-copy")
              : res.ruleName,
          ruleDesc: res.ruleDesc,
          ruleDesc: res.ruleDesc,
          skuList: res.skuList,
          startTime: res.startTime,
          endTime: res.endTime,
        };
        refs["chooseSku"].changeSelectList(res.skuList);
        refs["addSaleRules"].dataEcho(res.saleRuleDetailResp);
        setTimeout(() => {
          formState.value.addSaleRuleDetailReqList = res.saleRuleDetailResp;
        }, 1000);
      } finally {
        loading.value = false;
      }
    };
    const defaultTimeArr = ref([]);
    const loading = ref(false);
    return {
      isEn,
      formState,
      rules,
      finalData,
      defaultTimeArr,
      submit,
      loading,
      handleType,
    };
  },
};
</script>
<style lang="scss" scoped>
.restriction-rule-info-warp {
  color: #606266;
  box-sizing: border-box;
  overflow: scroll;
  height: calc(100vh - 225px);
  .form-warp {
    overflow: scroll;
  }
  .w375 {
    width: 400px;
  }
  .w375 {
    width: 400px;
  }
  .el-textarea__inner {
    padding-right: 40px;
  }
}
</style>
