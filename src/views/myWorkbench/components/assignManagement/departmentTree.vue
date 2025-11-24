<template>
  <el-dialog
    class="department-tree-container"
    width="1100px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :title="$t('请选择分配的成员')"
  >
    <div
      class="card-wrap"
      v-loading="loading"
    >
      <el-card class="box-card-left box-card">
        <div
          slot="header"
          class="clearfix"
        >
          <span>{{$t('全部部门/成员')}}</span>
        </div>
        <el-input
          :placeholder="$t('请输入用户名')"
          v-model="filterText"
          class="mb10"
        >
        </el-input>
        <el-tree
          ref="tree"
          :data="treeData"
          show-checkbox
          node-key="id"
          :default-checked-keys="defaultNodes"
          @check="handleCheckChangeArea"
          :props="defaultProps"
          :filter-node-method="filterNode"
        >
          <span
            class="custom-tree-node"
            slot-scope="{ node,data }"
          >
            <span>{{ node.label }}
              <el-tag
                size="mini"
                v-if="data.type === 3"
              >{{ $t("公司") }}</el-tag>
              <el-tag
                size="mini"
                type="success"
                v-if="data.type === 2"
              >{{
              $t("部门")
            }}</el-tag>
            </span>
          </span>
        </el-tree>
      </el-card>
      <el-card class="box-card-right box-card">
        <div
          slot="header"
          class="clearfix"
        >
          <span>{{$t('已选择的成员')}}</span>
          <span
            style="float: right;">{{allCheckedNode.length || 0}}{{$t('人')}}</span>
        </div>
        <div>
          <el-button
            v-for="member in allCheckedNode"
            :key="member.id || member.userId"
            type="primary"
            plain
            icon="el-icon-delete"
            @click="handleDelete(member)"
            class="mb10"
          >{{ (member.username ? member.username + '-' : '') + (isEn ? (member.nameEn || member.nameZh) : (member.nameZh || member.nameEn))}}
          </el-button>
        </div>
      </el-card>
    </div>
    <div style="textAlign: right">
      <el-button
        type="primary"
        @click="handleSave"
        class="mr10 mt20"
      >{{$t('保存')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { defineComponent, computed, ref, watch, reactive, toRefs, onMounted, unref } from '@vue/composition-api'
import { ASSIGN_RULE_TYPE } from '../../dataConfig/enum'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      defalult: false
    },
    ruleType: {
      type: Number,
      defalult: 0
    },
    selectedNode: {
      type: Array,
      defalult: []
    }
  },
  setup (props, { emit, root, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === 'en')
    const loading = ref(false)
    const treeData = ref([])
    const filterText = ref('')

    const defaultNodes = ref([15])
    const treeState = reactive({
      allCheckedNode: []
    })
    const defaultProps = {
      children: "children",
      label: "name",
    };
    watch(filterText, (val) => {
      refs.tree.filter(val);
    })
    const handleClose = () => { emit('update:visible', false) }
    const handleCheckChangeArea = (node) => {
      if (props.ruleType === ASSIGN_RULE_TYPE.DEFAULT_RULE) {
        const selectNode = node
        refs.tree.setCheckedNodes([])
        refs.tree.setCheckedNodes([selectNode])
      }
      treeState.allCheckedNode = refs.tree.getCheckedNodes(true)
    }
    watch(()=>treeState.allCheckedNode, (val) => {
      val.forEach((e,i)=>{
        if(e.hasOwnProperty('type')){
          val.splice(i,1)
        }
      })
    })

    const makeFullPath = (selectedMember) => {
      selectedMember.forEach((node,i) => {
        const currentNode = refs.tree.getNode(node.id)
        const upNode = currentNode.parent
        const thirdNode = upNode.parent
        const fullPathEn = (thirdNode.data.nameEn ? (thirdNode.data.nameEn + '/') : '') + (upNode.data.nameEn ? (upNode.data.nameEn + '/') : '') + currentNode.data.nameEn
        const fullPathZh = (thirdNode.data.nameZh ? (thirdNode.data.nameZh + '/') : '') + (upNode.data.nameZh ? (upNode.data.nameZh + '/') : '') + currentNode.data.nameZh
        node.fullPathEn = fullPathEn
        node.fullPathZh = fullPathZh
      })
      emit('triggerSaveTree', selectedMember)

    }

    const handleDelete = (node) => {
      refs.tree.setChecked(node, false)
      treeState.allCheckedNode = refs.tree.getCheckedNodes(true)
    }

    const handleSave = () => {
      let selectedMember= treeState.allCheckedNode
      // const selectedMember = refs.tree.getCheckedNodes(true)
      if (!selectedMember.length) return root.$notify.error(root.$t('请选择成员'))
      makeFullPath(selectedMember)
    }

    const filterNode = (value, data) => {
      if (!value) return true;
      return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    }

    const queryTreeData = async () => {
      loading.value = true
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.getAllpost();
      if (status !== 200 || code !== 200) return Promise.reject();
      mapPostTreeData([data[0]])
      setTimeout(() => {
        treeData.value = [data[0]]
        if (props.ruleType === ASSIGN_RULE_TYPE.DEFAULT_RULE) {
          disabledDeepTree(unref(treeData))
        }
        loading.value = false
      })
    }

    const mapPostTreeData = (list) => {
      if (!list) return
      list.forEach((node, index) => {
        node.name = (node.username ? (node.username + '-') : '') + (unref(isEn) ? node.nameEn : node.nameZh)
        if (node.postUserInfoList && node.postUserInfoList.length) {
          node.children = (node.postUserInfoList.map(leaf => {
            return {
              ...leaf,
              id: leaf.userId,
              fullCode: node.fullCode,
              name: (leaf.username ? (leaf.username + '-') : '') + (unref(isEn) ? (leaf.nameEn || leaf.nameZh) : (leaf.nameZh || leaf.nameEn))
            }
          }) || []).concat(
            node.children || []
          )
        } else {
          node.children = node.children?.length ? node.children : null
        }
        if (node.children?.length) {
          node.id = node.id + '_' + node.pid
        }
        mapPostTreeData(node.children)
      })
    }

    const disabledDeepTree = (list) => {
      list.forEach((t) => {
        if (t.children) {
          t.disabled = true
          disabledDeepTree(t.children)
        }
      })
    }
    onMounted(() => {
      treeState.allCheckedNode = props.selectedNode
      queryTreeData()
      defaultNodes.value = props.selectedNode?.map(t => props.ruleType === ASSIGN_RULE_TYPE.DEFAULT_RULE ? t.userId : t.id)
    })

    return {
      isEn,
      loading,
      treeData,
      filterText,
      defaultProps,
      defaultNodes,
      ...toRefs(treeState),
      handleClose,
      handleDelete,
      handleSave,
      filterNode,
      handleCheckChangeArea,
      ASSIGN_RULE_TYPE
    }
  },
})
</script>
<style lang="scss" scoped>
.department-tree-container {
  .card-wrap {
    display: flex;
    justify-content: space-evenly;
    .box-card {
      width: 40%;
      height: 500px;
    }
  }
}
::v-deep .el-card__body {
  height: 400px;
  overflow: auto;
}
</style>
