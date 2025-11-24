<template>
  <div>
    <el-dialog
      class="field-config-dialog"
      @close="close"
      :title="$t('编辑显示字段')"
      :visible.sync="visible"
      width="800px"
      center
    >
      <el-tabs
        v-model="activeTab"
        type="card"
      >
        <el-tab-pane
          :label="$t('字段显示')"
          name="show"
        >
          <el-transfer
            class="mt10"
            :data="hideFields"
            :titles="[$t('不显示的字段'), $t('显示的字段')]"
            v-model="showFields"
          ></el-transfer>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('字段排序')"
          name="sort"
        >
          <draggable
            :list="showFields"
            class="list-group mt10"
            ghost-class="ghost"
          >
            <div
              v-for="(item, idx) in showFields"
              :key="idx"
              class="list-group-item"
            >
              <div>{{$t(fieldMap[item])}}</div>
            </div>
          </draggable>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer">
        <el-button
          type="primary"
          @click="onSubmit"
        >{{$t('保存')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { computed, defineComponent, onMounted, reactive, ref, toRefs, watch } from '@vue/composition-api'
import draggable from 'vuedraggable'
import { fieldMap, defaultTableColumnData } from '../../dataConfig/filter'
import { FUNCTION_POINT } from '../../dataConfig/constant'

export default defineComponent({
  components: { draggable },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    showFields: {
      type: Array,
      default: []
    }
  },
  setup (props, { root, emit }) {
    const userId = JSON.parse(window.localStorage.getItem("userInfo")).id
    const hideFields = ref([])
    const activeTab = ref('show')
    const close = () => {
      emit('update:visible', false)
    }

    const getHideFields = () => {
      hideFields.value = defaultTableColumnData.map(item => {
        return {
          label: root.$t(fieldMap[item.field]),
          key: item.field
        }
      })
    }

    const onSubmit = () => {
      const showArr = JSON.parse(JSON.stringify(props.showFields)).map((t, i) => {
        return {
          field: t,
          isHide: 0
        }
      })
      const hideArr = hideFields.value.filter((t) => !props.showFields.includes(t.key)).map(t => {
        return {
          field: t.key,
          isHide: 1
        }
      })

      const submitFields = showArr.concat(hideArr).map((t, i) => {
        return {
          ...t,
          seq: i + 1
        }
      })
      const submitData = {
        ownerId: userId,
        functionPoint: FUNCTION_POINT,
        fieldList: submitFields,
      }

      root.$Api.studentManagement.updateFields(submitData).then(({ data }) => {
        if (data.code !== 200) {
          return Promise.reject()
        }
        root.$notify.success(root.$t('操作成功'))
        emit('configCb')
      }).catch(() => {
        root.$notify.error(root.$t('操作失败'))
      })
    }

    onMounted(() => {
      getHideFields()
    })

    return {
      activeTab,
      fieldMap,
      hideFields,

      close,
      onSubmit,
    }
  },
})
</script>
<style lang="scss" scoped>
.field-config-dialog {
  .list-group {
    width: 80%;
    display: flex;
    flex-direction: column;
    padding-left: 0;
    .list-group-item {
      height: 20px;
      line-height: 20px;
      text-align: left;
      margin: 10px;
      cursor: pointer;
    }
  }
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  ::v-deep .el-tabs__content {
    height: 400px;
    overflow: auto;
    .el-tab-pane {
      height: 400px;
    }
  }
  ::v-deep .el-transfer .el-transfer-panel {
    height: 380px;
    width: 240px;
    .el-transfer-panel__body {
      height: 90%;
    }
    .el-transfer-panel__list {
      height: 100%;
    }
  }
}
</style>
