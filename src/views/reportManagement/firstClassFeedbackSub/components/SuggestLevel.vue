<template>
  <span class="suggest-level-warp">
    <el-button
      v-show="!isView"
      @click="drawer = true"
      :disabled="disabled"
      type="text"
      >{{ $t("配置建议级别") }}</el-button
    >
    <el-button v-show="isView" @click="drawer = true" type="text">{{
      $t("查看建议级别")
    }}</el-button>
    <el-drawer
      :title="isView ? $t('查看建议级别') : $t('配置建议级别')"
      :visible.sync="drawer"
      direction="rtl"
      :wrapperClosable="false"
    >
      <div class="suggest-level-drawer">
        <el-form
          :style="`height:${tabHeight}px`"
          class="my-form"
          :rules="rules"
          ref="myForm"
          :model="formState"
          label-width="130px"
          :disabled="isView"
        >
          <el-form-item :label="$t('请选择级别维度')" prop="levelType">
            <el-radio-group v-model="formState.levelType">
              <el-radio label="Lesson">Lesson</el-radio>
              <el-radio label="Level">Level</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('请选择课程树')" prop="suggestLevelList">
            <div v-for="(item, index) in treeList" :key="index">
              <el-cascader
                style="width: 300px"
                ref="cascader"
                :key="item.id"
                v-model="treeList[index].editionId"
                :props="cascaderProps"
                :options="treeList[index].subjectList"
                class="w-100"
                @change="
                  reqLevelList(
                    treeList[index].editionId[
                      treeList[index].editionId.length - 1
                    ],
                    index
                  )
                "
              ></el-cascader>
              <i
                v-show="
                  index == treeList.length - 1 &&
                  treeList.length < 3 &&
                  !isView &&
                  formState.levelType === 'Lesson'
                "
                @click="addOption(index)"
                class="el-icon-plus"
              ></i>
              <i
                @click.prevent="deleteOption(index)"
                v-if="
                  index == treeList.length - 1 &&
                  treeList.length > 1 &&
                  !isView &&
                  formState.levelType === 'Lesson'
                "
                class="el-icon-minus"
              ></i>
              <el-tree
                v-show="treeList[index].editionId"
                ref="myTree"
                :data="treeList[index].levelListResult"
                :props="classTreeProps"
                node-key="nodeId"
                show-checkbox
                style="margin-top: 10px"
                @check-change="onCheck"
                :default-expand-all="isView"
              ></el-tree>
            </div>
          </el-form-item>
        </el-form>
        <el-button
          v-show="!isView"
          type="primary"
          class="submit-btn"
          @click="getCheckdNode(true)"
          >确认</el-button
        >
      </div>
    </el-drawer>
  </span>
</template>

<script>
import {
  onMounted,
  ref,
  computed,
  watch,
  reactive,
} from "@vue/composition-api";
import { deepClone } from "@/utils/handleData";
export default {
  props: {
    data: {
      type: Array,
      default: [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");

    const drawer = ref(false);
    /* 获取学科下的课程树 */
    const originalSubjectList = ref([]);
    const formState = ref({
      levelType: "Lesson",
      suggestLevelList: [],
    });
    const treeList = ref([
      {
        ref: "tree1",
        id: 0,
        levelList: null /* 存原始数据,用于切换级别维度 */,
        levelListResult: null,
        params: [],
        editionId: null,
        editionName: null,
        subjectList: null,
      },
    ]);
    const addOption = (index) => {
      treeList.value.splice(index + 1, 0, {
        ref: `tree${index + 1}`,
        id: index + 1,
        levelList: null,
        levelListResult: null,
        params: [],
        editionId: null,
        editionName: null,
        subjectList: deepClone(originalSubjectList.value),
      });
    };
    const deleteOption = (index) => {
      treeList.value.splice(index, 1);
    };
    watch(
      () => formState.value.levelType,
      (val) => {
        handelTreeByLevelType(val);
      }
    );
    const handelTreeByLevelType = (val) => {
      if (val === "Level") {
        treeList.value = [treeList.value.shift()];
      }
      treeList.value.forEach((e, i) => {
        if (val === "Level") {
          const arr = deepClone(e.levelListResult);
          arr?.forEach((item) => {
            item?.list && delete item.list;
          });
          root.$set(treeList.value[i], "levelListResult", arr);
          // 只保留一颗树
        } else {
          e.levelListResult = deepClone(e.levelList);
        }
      });
    };

    const levelListResult = computed(() => {
      let list = deepClone(levelList.value);
      if (formState.value.levelType === "Level") {
        list.forEach((e) => {
          delete e.list;
        });
      }
      return list;
    });
    const validateSuggestLevel = async (rule, value, callback) => {
      treeList.value.forEach((e, i) => {
        if (!e.editionId) {
          callback(new Error());
        }
      });
    };
    const rules = {
      levelType: [
        { required: true, message: root.$t("请选择"), trigger: "blur" },
      ],
      suggestLevelList: [
        {
          required: true,
          message: root.$t("请选择"),
          validator: validateSuggestLevel,
          trigger: "change",
        },
      ],
    };
    const reqSubjectList = async () => {
      const res = await root.$Api.unitReportManagement.getSubjectRelatedTree();
      // setDisStatus(res)
      originalSubjectList.value = deepClone(res);
      treeList.value[0].subjectList = deepClone(originalSubjectList.value);
    };
    // const setDisStatus = (list) => {
    //   if (!list || !list.length) return;
    //   list.forEach((e) => {
    //     e.disabled = false;
    //     e.children && setDisStatus(e.children);
    //   });
    // };
    /* 回显数据 */
    watch(drawer, (val) => {
      if (!val) {
        emit("close");
        return;
      }
      let treeMap = {};
      let idArr = [];
      let keyArr = [];
      props.data &&
        props.data.forEach((e) => {
          idArr.push(e.lessonId ? e.lessonId : e.levelId);
          treeMap[e.editionId] = idArr;
          if (!keyArr.includes(e.editionId)) {
            keyArr.push(e.editionId);
          }
        });
      keyArr.length && setChecked(treeMap, keyArr);
    });
    /* 回显处理 */
    const setChecked = (treeMap, keyArr) => {
      treeList.value = [];
      keyArr.forEach(async (editionId, index) => {
        treeList.value.push({
          ref: `tree${index + 1}`,
          id: index + 1,
          levelList: null,
          levelListResult: null,
          params: [],
          editionId: [null, null, null, editionId],
          editionName: null,
          subjectList: deepClone(originalSubjectList.value),
        });
        await reqLevelList(editionId, index, treeMap[editionId]);
      });
      /* 回显维度 */
      setTimeout(() => {
        let isToLesson = props.data.some((e) => {
          return e.lessonId;
        });
        formState.value.levelType = isToLesson ? "Lesson" : "Level";
      }, 1000);
    };

    /* 根据学科下课程树id获取级别列表 */
    const levelList = ref([]);
    const reqLevelList = async (editionId, index, keys) => {
      try {
        const res = await root.$Api.unitReportManagement.getcourseTree(
          editionId
        );
        generateUniqueKey(res, null, editionId);
        treeList.value[index].levelListResult = deepClone(res);
        treeList.value[index].levelList = deepClone(res);
        if (keys) {
          refs["myTree"][index].setCheckedKeys(keys);
        }
      } finally {
        handelTreeByLevelType(formState.value.levelType)
      }
    };
    const onCheck = async () => {
      getCheckdNode();
    };

    const generateUniqueKey = (list, pid, editionId) => {
      if (!list || !list.length) return;
      list.forEach((item) => {
        item.key = pid
          ? `${pid}-${item.nodeId}`
          : `${editionId}-${item.nodeId}`;
        item.list && generateUniqueKey(item.list, item.key);
        item.editionId = editionId;
      });
    };

    const getCheckdNode = async (isSubmit) => {
      await refs["myForm"].validate();
      let keyList = [];
      let idsList = [];
      treeList.value.forEach((e, i) => {
        keyList = keyList.concat(refs["myTree"][i].getCheckedNodes());
      });
      if (formState.value.levelType === "Lesson") {
        keyList.forEach((e) => {
          if (e.levelName === "Lesson") {
            idsList.push({
              editionId: e.key.split("-")[0],
              levelId: e.key.split("-")[1],
              unitId: e.key.split("-")[2],
              lessonId: e.key.split("-")[3],
            });
          }
        });
      } else {
        keyList.forEach((e) => {
          idsList.push({
            editionId: e.key.split("-")[0],
            levelId: e.key.split("-")[1],
          });
        });
      }
      formState.value.suggestLevelList = idsList;
      if (isSubmit) {
        if (!idsList.length) {
          return root.$notify({
            message: root.$t("最少选择一个级别"),
            type: "error",
          });
        }
        emit("getSuggestLevel", idsList);
        drawer.value = false;
      }
    };

    const disFn = (list) => {
      const copyOriginal = deepClone(originalSubjectList.value);
      const findFn = (children) => {
        children.forEach((e) => {
          if (e.children) {
            findFn(e.children);
          } else {
            if (e.editionId && list.includes(e.editionId)) {
              e.disabled = true;
              e.id;
            }
          }
        });
      };
      findFn(copyOriginal);
      treeList.value.forEach((e) => {
        e.subjectList = copyOriginal;
        e.id++;
      });
    };
    const checkedEditionList = computed(() => {
      let list = [];
      treeList.value.forEach((e, i) => {
        list.push(e.editionId?.[3] || null);
      });
      return list;
    });
    watch(
      () => checkedEditionList.value,
      (list) => {
        disFn(list);
      }
    );

    onMounted(() => {
      reqSubjectList();
    });
    return {
      isEn,
      drawer,
      formState,
      rules,
      treeList,
      cascaderProps: {
        value: "editionId",
      },
      classTreeProps: {
        label: "name",
        children: "list",
        value: "key",
      },
      levelList,
      levelListResult,
      tabHeight: window.innerHeight - 180,
      addOption,
      deleteOption,
      onCheck,
      getCheckdNode,
      reqLevelList,
      isView: root.$route.query.type == 1,
      disabled: props.disabled,
    };
  },
};
</script>

<style scoped lang="scss">
.suggest-level-warp {
  .suggest-level-drawer {
    width: 550px;
    padding: 20px;
    .my-form {
      overflow-y: scroll;
      .el-icon-plus,
      .el-icon-minus {
        cursor: pointer;
      }
    }
    .submit-btn {
      width: 100px;
      float: right;
      margin-top: 20px;
    }
  }
}
</style>
