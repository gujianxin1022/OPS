<template>
  <div class="add-rule-config-page-container" v-loading="pageLoading">
    <span class="page-title"
      >{{ $t(title) }}-{{
        editRuleId && !isCopy ? $t("编辑") : $t("新建")
      }}</span
    >
    <el-form
      style="margintop: 15px"
      :model="form"
      ref="formRef"
      label-width="200px"
    >
      <el-form-item style="text-align: right">
        <el-button type="primary" @click="handleSave">{{
          $t("保存")
        }}</el-button>
        <el-button @click="handleClose">{{ $t("关闭") }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('请输入规则名称')">
        <el-input
          style="width: 500px"
          maxlength="30"
          show-word-limit
          type="text"
          v-model="form.ruleName"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-for="(t, index) in form.conditionParamList"
        :key="index"
        :label="!index ? $t('请选择该条分配规则的条件') : ''"
      >
        <div class="condition-item">
          <el-select
            :style="{ width: isEn ? '180px' : '120px' }"
            v-model="t.conditionCode"
            clearable
          >
            <el-option
              v-for="item in getConditionList(isEn)"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            style="width: 100px"
            v-model="t.calculationSymbols"
            clearable
          >
            <el-option
              v-for="item in getConditionStatus(isEn)"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="
              t.conditionCode !== CONDITION_TYPE.DEPARTMENT &&
              t.conditionCode !== CONDITION_TYPE.COUNTRY
            "
            style="width: 300px"
            v-model="t.conditionValue"
            clearable
            multiple
          >
            <el-option
              v-for="item in conditionValueListMap[t.conditionCode]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-cascader
            style="width: 300px"
            :props="countryProps"
            :options="conditionValueState.countryList"
            v-if="t.conditionCode === CONDITION_TYPE.COUNTRY"
            :show-all-levels="false"
            v-model="t.conditionValue"
            size="mini"
            clearable
          >
          </el-cascader>
          <el-cascader
            ref="departmentRef"
            v-if="t.conditionCode === CONDITION_TYPE.DEPARTMENT"
            style="width: 300px"
            :options="conditionValueState.departments"
            :props="defaultProps"
            clearable
            filterable
            v-model="t.conditionValue"
            size="mini"
            collapse-tags
            :show-all-levels="false"
          ></el-cascader>
        </div>
        <i @click="addCondition" class="el-icon-plus"></i>
        <i @click.prevent="handleDelete(t)" class="el-icon-minus"></i>
      </el-form-item>
      <p class="error-tip" v-if="showError">{{ $t("条件存在矛盾") }}</p>
      <el-form-item :label="$t('请选择分配的成员')">
        <div class="member-info-wrap">
          <i class="el-icon-circle-plus-outline" @click="showTreeDialog"></i>
          <span
            >{{ $t("已选") }}: {{ form.allCheckedNode.length }}
            {{ $t("人") }}</span
          >
        </div>
        <div v-if="form.allCheckedNode.length">
          <el-button
            v-for="member in form.allCheckedNode"
            :key="member.id || member.userId"
            type="primary"
            plain
            icon="el-icon-delete"
            @click="handleDeleteMember(member)"
            class="mb10"
            >{{
              (member.username ? member.username + "-" : "") +
              (isEn
                ? member.nameEn || member.nameZh
                : member.nameZh || member.nameEn)
            }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <SortWeightSetting
      ref="weightSortCmpRef"
      v-if="form.ruleType === ASSIGN_RULE_TYPE.NORMAL_RULE"
      :selectedMembers="form.allCheckedNode"
      :ruleSecondaryParamList="form.ruleSecondaryParamList"
    />
    <DepartmentTreeDialog
      v-if="showDepartmentDialog"
      :visible.sync="showDepartmentDialog"
      @triggerSaveTree="triggerSaveTree"
      :ruleType="form.ruleType"
      :selectedNode="form.allCheckedNode"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  ref,
  computed,
  reactive,
  onMounted,
  toRefs,
  watch,
  unref,
} from "@vue/composition-api";
import { ASSIGN_RULE_TYPE, CONDITION_TYPE } from "../../dataConfig/enum";
import { conditionValueListFilter } from "../../dataConfig/filter";
import {
  getConditionList,
  getConditionStatus,
} from "../../dataConfig/constant.js";
import DepartmentTreeDialog from "./departmentTree.vue";
import { queryClassPackageList } from "@/api/groupManagement";
import SortWeightSetting from "./sortWeightSetting.vue";
import { deepClone } from "../../../../utils/handleData";

export default defineComponent({
  components: { DepartmentTreeDialog, SortWeightSetting },
  setup(props, { root, emit, refs }) {
    const routesMemoryList = computed(
      () => root.$store.state.tabs.routesMemoryList
    );
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const currentLang = computed(() => root.$store.getters.currentLang);
    const ruleInfo = reactive({
      title: "",
      editRuleId: void 0,
      isCopy: false,
    });
    const flagState = reactive({
      showDepartmentDialog: false,
      showError: false,
      pageLoading: false,
    });
    const conditionValueListMap = reactive({});
    const form = reactive({
      id: null,
      ruleName: "",
      conditionParamList: [
        {
          id: null,
          ruleType: "",
          conditionCode: "",
          calculationSymbols: "",
          conditionValue: [],
        },
      ],
      ruleSecondaryParamList: [],
      allCheckedNode: [],
      ruleType: "",
    });
    const conditionValueState = reactive({
      countryList: [],
      packageList: [],
      packageTreeList: [],
      departments: [],
      courseTreeList: [],
      languageList: [],
    });
    const addCondition = () => {
      form.conditionParamList.push({
        conditionCode: "",
        calculationSymbols: "",
        conditionValue: "",
        ruleType: root.$route.query.ruleType,
      });
    };
    const defaultProps = {
      children: "children",
      label: "nameZh",
      value: "id",
      multiple: true,
      emitPath: false,
      // checkStrictly: true
    };

    const countryProps = {
      emitPath: false,
      multiple: true,
      children: "children",
      label: "name",
      value: "id",
    };

    const getCountryLists = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.base.getCountryList();
      if (status !== 200 || code !== 200) {
        return Promise.resolve([]);
      }
      conditionValueState.countryList = data;
      return Promise.resolve(conditionValueState.countryList);
    };

    const queryTreeData = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.getAllpost();
      if (status !== 200 || code !== 200) return Promise.reject();
      conditionValueState.departments = [data[0]];
    };

    const mapPostTreeData = (list) => {
      if (!list) return;
      list.forEach((node, index) => {
        // node.name = unref(isEn) ? node.nameEn : node.nameZh
        node.children = node.children?.length ? node.children : null;
        mapPostTreeData(node.children);
      });
    };

    watch(
      () => form.conditionParamList,
      (list) => {
        validateCondition(list);
      },
      { deep: true }
    );

    watch(isEn, () => {
      makeConditionValues();
    });

    const validateCondition = (list) => {
      if (list.length === 1) {
        flagState.showError = false;
        return;
      }
      for (let i = 0; i < list.length - 1; i++) {
        for (let j = i + 1; j < list.length; j++) {
          if (
            list[i].conditionCode === list[j].conditionCode &&
            list[i].calculationSymbols !== list[j].calculationSymbols
          ) {
            const concatValues = list[i].conditionValue.concat(
              list[j].conditionValue
            );
            const setValue = new Set(concatValues);
            flagState.showError = setValue.size !== concatValues.length;
            if (flagState.showError) {
              return;
            }
          } else {
            flagState.showError = false;
          }
        }
      }
    };

    const triggerSaveTree = (data) => {
      form.allCheckedNode = data;
      flagState.showDepartmentDialog = false;
    };

    const showTreeDialog = () => {
      flagState.showDepartmentDialog = true;
    };

    const makeConditionValues = () => {
      const map = {};
      Object.values(CONDITION_TYPE).forEach((val) => {
        if (val === CONDITION_TYPE.COUNTRY) {
          conditionValueState.countryList.forEach(async (item) => {
            item.name = unref(isEn) ? item.nameEn : item.nameZh;
            item.id = item.nameZh || item.nameEn;
          });
          map[val] = conditionValueState.countryList;
        } else if (val === CONDITION_TYPE.PACKAGE) {
          map[val] = conditionValueState.packageList.map((t) => {
            return {
              label: getCoursePackageName(t),
              value: t.packageId,
            };
          });
        } else if (val === CONDITION_TYPE.SPECIAL_LANGUAGE) {
          map[val] = conditionValueState.languageList.map((t) => {
            return {
              label: t.name,
              value: t.code,
            };
          });
        } else if (val === CONDITION_TYPE.DEPARTMENT) {
          mapPostTreeData(conditionValueState.departments);
        } else if (val === CONDITION_TYPE.PACKAGE_TREE) {
          map[val] = conditionValueState.courseTreeList.map((t) => {
            return {
              // label: t.editionNameOpsZh,
              label: unref(isEn) ? t.editionNameOpsEn : t.editionNameOpsZh,
              value: t.editionId,
            };
          });
        } else {
          map[val] = conditionValueListFilter(val, unref(currentLang));
        }
      });
      Object.assign(conditionValueListMap, map);
    };

    const getPackageList = async () => {
      const {
        status,
        data: { code, data },
      } = await queryClassPackageList({ packageType: 1 });
      if (status !== 200 || code !== 200) return Promise.resolve([]);
      conditionValueState.packageList = data;
      return Promise.resolve(conditionValueState.packageList);
    };

    const getLanguageList = async () => {
      conditionValueState.languageList = [{ name: "空", code: " " }].concat(
        await root.$Api.base.getLanguageList()
      );
      return Promise.resolve(conditionValueState.languageList);
    };

    const getCoursePackageName = (item) => {
      return (
        item.coursePackageNameList.find((t) =>
          unref(isEn) ? t.languageCode === "EN" : t.languageCode === "CN"
        )?.name || item.packageName
      );
    };

    const handleDelete = (item) => {
      if (form.conditionParamList.length === 1)
        return root.$notify.warning(root.$t("至少保留一个"));
      const index = form.conditionParamList.indexOf(item);
      if (index !== -1) {
        form.conditionParamList.splice(index, 1);
        validateCondition(form.conditionParamList);
      }
    };

    const handleDeleteMember = (member) => {
      const idx = form.allCheckedNode.findIndex((t) => t.id === member.id);
      form.allCheckedNode.splice(idx, 1);
    };

    const handleClose = () => {
      let item, index;
      const routes = unref(routesMemoryList);
      routes.forEach((routeItem, routeIndex) => {
        if (routeItem.name === "AssignRuleConfig") {
          item = routeItem;
          index = routeIndex;
        }
      });
      root
        .$confirm(
          root.$t(
            "关闭后将不会保存页面中修改的内容, 确定要关闭并离开该页面吗?"
          ),
          root.$t("提示"),
          {
            confirmButtonText: root.$t("离开页面"),
            cancelButtonText: root.$t("继续编辑"),
            type: "warning",
          }
        )
        .then((_) => {
          root.$store.commit("DELETE_ROUTE", [item, index]);
          root.$router.push(`newStuMt`);
        })
        .catch((_) => {});
    };

    const handleSave = () => {
      const { ruleName, allCheckedNode } = form;
      let ruleSecondaryParamList = [];
      if (!ruleName) return root.$notify.error(root.$t("请填写规则名称"));
      if (flagState.showError)
        return root.$notify.error(root.$t("规则条件存在矛盾"));
      if (checkConditionValidate())
        return root.$notify.error(root.$t("请完善规则条件"));
      if (!allCheckedNode.length)
        return root.$notify.error(root.$t("请选择要分配的成员"));
      if (form.ruleType === ASSIGN_RULE_TYPE.NORMAL_RULE) {
        if (!refs.weightSortCmpRef.checkWeightSortValidate())
          return root.$notify.error(root.$t("规则需要覆盖所有新生类型"));
        // 与现有规则名称重复
        ruleSecondaryParamList = refs.weightSortCmpRef.subRuleList;
        const isNotCompleteRule = ruleSecondaryParamList.some(
          (t) =>
            !t.studentType.length ||
            t.ruleSecondaryPersonParamList.some((t) => !t.weight)
        );
        if (isNotCompleteRule)
          return root.$notify.error(root.$t("请完善规则条件"));
      }
      handleSubmit(ruleSecondaryParamList);
    };

    const mapSubRule = (ruleSecondaryParamList) => {
      const { editRuleId, isCopy } = ruleInfo;
      const onlyEdit = editRuleId && !isCopy;
      return ruleSecondaryParamList.map((item, index) => {
        return {
          id: item.new ? null : onlyEdit ? item.id : null,
          parentRuleId: onlyEdit ? +editRuleId : null,
          studentType: item.studentType.join(","),
          seq: index + 1,
          ruleSecondaryPersonParamList: item.ruleSecondaryPersonParamList.map(
            (subItem, i) => {
              return {
                id: item.new ? null : onlyEdit ? subItem.id : null,
                subruleId: item.new ? null : onlyEdit ? item.id : null,
                personId: subItem.personId,
                weight: +subItem.weight,
                seq: i + 1,
              };
            }
          ),
        };
      });
    };
    const mapConditionListArray2Str = (list) => {
      let count = 0;
      list.forEach((t, i) => {
        if (t.conditionCode === CONDITION_TYPE.DEPARTMENT) {
          t.conditionValue = refs.departmentRef[count]
            .getCheckedNodes()
            .map((t) => t.value)
            .join(",");
          count++;
        } else {
          t.conditionValue = t.conditionValue.join(",");
        }
      });
    };

    const handleSubmit = (ruleSecondaryParamList) => {
      const { editRuleId, isCopy } = ruleInfo;
      const onlyEdit = editRuleId && !isCopy;
      const submitParams = deepClone(form);
      delete submitParams.assignLa;
      delete submitParams.allCheckedNode;
      if (form.ruleType === ASSIGN_RULE_TYPE.NORMAL_RULE) {
        submitParams.ruleSecondaryParamList = mapSubRule(
          ruleSecondaryParamList
        );
      } else {
        submitParams.assignLaId = form.allCheckedNode[0].id;
        delete submitParams.ruleSecondaryParamList;
      }
      if (ruleInfo.editRuleId && !ruleInfo.isCopy) {
        form.id = +ruleInfo.editRuleId;
      }
      mapConditionListArray2Str(submitParams.conditionParamList);
      const url = onlyEdit ? "updateRule" : "createRule";
      root.$Api.workBench[url](submitParams)
        .then(({ status, data: { data, code } }) => {
          if (code !== 200 || status !== 200) return Promise.reject();
          let item, index;
          const routes = unref(routesMemoryList);
          routes.forEach((routeItem, routeIndex) => {
            if (routeItem.name === "AssignRuleConfig") {
              item = routeItem;
              index = routeIndex;
            }
          });
          root.$notify.success(root.$t("操作成功"));
          setTimeout(() => {
            root.$store.commit("DELETE_ROUTE", [item, index]);
            root.$router.push("/work/assign/newStuMt");
          }, 800);
        })
        .catch(() => {});
    };

    const checkConditionValidate = () => {
      return form.conditionParamList.some((t) => {
        return (
          !t.conditionCode || !t.calculationSymbols || !t.conditionValue.length
        );
      });
    };

    const mapRespConditionListStr2Arr = (list) => {
      const arr = list.map((t) => {
        return {
          ...t,
          conditionValue: t.conditionValue.split(",").map((_t) => {
            return t.conditionCode === CONDITION_TYPE.COUNTRY ||
              t.conditionCode === CONDITION_TYPE.PAY_TYPE ||
              t.conditionCode === CONDITION_TYPE.TIME_ZONE ||
              t.conditionCode === CONDITION_TYPE.PARENT_LTO_LABEL ||
              t.conditionCode === CONDITION_TYPE.SPECIAL_LANGUAGE
              ? _t
              : +_t;
          }),
        };
      });
      return arr;
    };
    const getRuleDetail = async (ruleId, ruleType) => {
      const {
        status,
        data: { data, code },
      } = await root.$Api.workBench.getRuleDetail(ruleId, ruleType);
      if (status !== 200 || code !== 200) return Promise.reject();
      const {
        id,
        ruleName,
        assignLa,
        conditionRespList,
        ruleSecondaryRespList,
      } = data;
      Object.assign(form, {
        id: ruleInfo.isCopy ? null : id,
        ruleName: ruleInfo.isCopy ? "" : ruleName,
        assignLa,
        conditionParamList: mapRespConditionListStr2Arr(conditionRespList),
        ruleSecondaryParamList: ruleSecondaryRespList,
        allCheckedNode:
          form.ruleType === ASSIGN_RULE_TYPE.NORMAL_RULE
            ? filterMemberAndSubRule(data.ruleSecondaryRespList)
            : [
                {
                  ...assignLa,
                  id: assignLa?.userId,
                  username: assignLa.nameZh,
                },
              ],
      });
      flagState.pageLoading = false;
    };

    const filterMemberAndSubRule = (list) => {
      return list[0]?.ruleSecondaryPersonRespList.map((t) => {
        return {
          id: t.userInfo?.userId,
          nameZh: t.userInfo?.nameZh,
          nameEn: t.userInfo?.nameEn,
          postInfoResp: t.postInfoResp,
          username: t.userInfo?.username,
        };
      });
    };

    const getAllCourseTreeList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.courseTree.reqAllCourseTreeList();
      if (status !== 200 || code !== 200) return Promise.resolve([]);
      conditionValueState.courseTreeList = data;
      return Promise.resolve(conditionValueState.courseTreeList);
    };

    onMounted(async () => {
      flagState.pageLoading = true;
      const { ruleType, ruleId, copy } = root.$route.query;
      form.ruleType = ruleType;
      form.conditionParamList[0].ruleType = ruleType;
      Object.assign(ruleInfo, {
        title:
          ruleType === ASSIGN_RULE_TYPE.NORMAL_RULE
            ? root.$t("常用规则")
            : root.$t("兜底规则"),
        editRuleId: ruleId,
        isCopy: copy,
      });
      Promise.all([
        getPackageList(),
        getCountryLists(),
        queryTreeData(),
        getAllCourseTreeList(),
        getLanguageList(),
      ]).then(() => {
        makeConditionValues();
        if (ruleId) {
          getRuleDetail(ruleId, ruleType);
        } else {
          flagState.pageLoading = false;
        }
      });
    });
    return {
      isEn,
      currentLang,
      form,
      countryProps,
      conditionValueListMap,
      ...toRefs(flagState),
      ...toRefs(ruleInfo),
      conditionValueState,
      defaultProps,

      addCondition,
      handleDelete,
      handleDeleteMember,
      handleClose,
      handleSave,
      showTreeDialog,
      getCoursePackageName,
      triggerSaveTree,

      /**enum constants */
      ASSIGN_RULE_TYPE,
      CONDITION_TYPE,
      getConditionList,
      getConditionStatus,
      conditionValueListFilter,
    };
  },
});
</script>
<style lang="scss" scoped>
.add-rule-config-page-container {
  word-break: break-word !important;
  padding: 20px;
  .condition-item {
    display: inline-block;
  }
  .error-tip {
    font-size: 12px;
    text-indent: 200px;
    color: rgb(245, 46, 46);
  }
  .member-info-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 60px;
  }
}
</style>
