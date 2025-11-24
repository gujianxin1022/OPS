<template>
  <!-- 选择部门 -->
  <div class="department-tree-container">
    <div class="card-wrap" v-loading="loading">
      <el-card class="box-card-left box-card">
        <div slot="header" class="clearfix">
          <span>{{ $t("全部部门") }}</span>
        </div>
        <input
          class="my-input mb10"
          :placeholder="$t('请输入组名')"
          v-model="filterText"
        />
        <el-tree
          ref="tree"
          :data="treeData"
          show-checkbox
          node-key="id"
          :default-expand-all="checkStrictly"
          :default-checked-keys="defaultNodes"
          @check="handleCheckChangeArea"
          :props="defaultProps"
          :filter-node-method="filterNode"
          :check-strictly="checkStrictly"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span> {{ isEn ? data.nameEn : data.nameZh }} </span>
          </span>
        </el-tree>
      </el-card>
      <el-card class="box-card-right box-card">
        <div slot="header" class="clearfix">
          <span>{{ $t("已选择的部门") }}</span>
          <span v-if="allCheckedNode.length" style="float: right"
            >{{ allCheckedNode.length || 0 }}{{ $t("组") }}</span
          >
        </div>
        <div>
          <el-button
            v-for="member in allCheckedNode"
            :key="member.id"
            type="primary"
            plain
            icon="el-icon-delete"
            @click="handleDelete(member)"
            class="mb10"
            >{{
              (member.username ? member.username + "-" : "") +
              (isEn
                ? member.nameEn || member.nameZh
                : member.nameZh || member.nameEn)
            }}
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  computed,
  ref,
  watch,
  reactive,
  toRefs,
  onMounted,
  unref,
} from "@vue/composition-api";

export default {
  props: {
    checkStrictly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit, root, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const loading = ref(false);
    const treeData = ref([]);
    const filterText = ref("");
    const defaultNodes = ref([]);
    const treeState = reactive({
      allCheckedNode: [],
    });
    const defaultProps = ref({
      children: "children",
      label: "nameZh",
    });
    watch(filterText, (val) => {
      refs.tree.filter(val);
    });
    const handleCheckChangeArea = (node) => {
      treeState.allCheckedNode = refs.tree.getCheckedNodes(false) || [];
      let postIdList = [];
      treeState.allCheckedNode.forEach((e) => {
        postIdList.push(e.id);
      });
      emit("changeSelect", postIdList);
    };

    const handleDelete = (node) => {
      refs.tree.setChecked(node, false);
      treeState.allCheckedNode = refs.tree.getCheckedNodes(false);
      let postIdList = [];
      treeState.allCheckedNode.forEach((e) => {
        postIdList.push(e.id);
      });
      emit("changeSelect", postIdList);
    };

    const filterNode = (value, data) => {
      if (!value) return true;
      return data.nameZh.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    };

    const queryTreeData = async () => {
      loading.value = true;
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.getAllpost();
      if (status !== 200 || code !== 200) return Promise.reject();
      setTimeout(() => {
        try {
          treeData.value = [data[0]];
          loading.value = false;
        } finally {
          setTimeout(() => {
            handleCheckChangeArea();
          }, 1);
        }
      });
    };
    // 清空已选
    const resetChecked = () => {
      refs.tree.setCheckedKeys([]);
    };
    onMounted(() => {
      treeState.allCheckedNode = props.selectedNode || [];
      queryTreeData();
    });

    return {
      isEn,
      loading,
      treeData,
      filterText,
      defaultProps,
      defaultNodes,
      ...toRefs(treeState),
      handleDelete,
      filterNode,
      handleCheckChangeArea,
      resetChecked,
    };
  },
};
</script>
<style lang="scss" scoped>
.department-tree-container {
  padding-top: 10px;
  .card-wrap {
    display: flex;
    .box-card {
      width: 40%;
      height: 500px;
      margin-right: 80px;
      .my-input {
        outline: none;
        width: 200px;
        height: 32px;
        padding-left: 15px;
        border: 1px solid #dcdfe6;
        color: #606266;
        border-radius: 4px;
        font-size: 13px;
      }
      .my-input::placeholder {
        color: #ccc;
        font-size: 12px;
      }
    }
  }
}
::v-deep .el-card__body {
  height: 400px;
  overflow: auto;
}
.el-button {
  margin-left: 0px;
  margin-right: 10px;
}
</style>
