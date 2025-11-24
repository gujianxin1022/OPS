<template>
  <div>
    <el-dialog
      class="sort-dialog"
      @close="close"
      :title="$t('常用筛选设置', {num: filterList.length, allNum: NUM})"
      :visible.sync="visible"
      width="600px"
      center
    >
      <div
        class="sort-container"
        v-loading="isLoading"
      >
        <draggable
          :list="filterList"
          class="list-group"
          ghost-class="ghost"
          @start="isDragging = true"
        >
          <div
            v-for="filter in filterList"
            :key="filter.id"
            class="list-group-item"
          >
            <div class="left">{{filter.formName}}</div>
            <div class="right">
              <el-space>
                <el-button
                  type="text"
                  @click="handleEdit(filter)"
                >{{$t('编辑')}}</el-button>
                <el-button
                  type="text"
                  @click="handleDelete(filter)"
                >{{$t('删除')}}</el-button>
              </el-space>
            </div>
          </div>
        </draggable>
        <el-button
          :disabled="!(filterList.length < NUM)"
          class="mt10"
          style="width: 80%"
          type="primary"
          plain
          icon="el-icon-plus"
          @click="handleAdd()"
        >{{$t('新增')}}</el-button>
      </div>
    </el-dialog>
    <AllFilterDialog
      v-if="isShowAllFilterDialog"
      referer="set"
      :visible.sync="isShowAllFilterDialog"
      @closeDialogBySet="closeDialogBySet"
      :searchParams="searchParams"
      :name="name"
    />

  </div>
</template>
<script>
import { computed, defineComponent, reactive, ref, toRefs, onMounted } from '@vue/composition-api'
import draggable from 'vuedraggable'
import AllFilterDialog from './allFilterDialog'
import { transferSubmitData, mapFetchDataToState } from '../../dataConfig/filter'
import { FUNCTION_POINT } from '../../dataConfig/constant'
import EVENT_NAME from '@/utils/event_name'

export default defineComponent({
  components: { draggable, AllFilterDialog },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    usedCombineList: {
      type: Array,
      default: []
    }
  },
  setup (props, { root, emit }) {
    const userName = JSON.parse(window.localStorage.getItem("userInfo"))?.username;
    const filterList = ref([])
    const NUM = 10
    const name = ref('')
    const searchParams = ref({})
    const currentItem = ref(null)

    const flagState = reactive({
      isDragging: false,
      isShowAllFilterDialog: false,
      isLoading: false
    })

    const handleEdit = (item) => {
      currentItem.value = item
      const { formName, formInfo, id } = item
      name.value = formName
      searchParams.value = mapFetchDataToState(JSON.parse(formInfo), id)
      flagState.isShowAllFilterDialog = true
    }

    const handleDelete = (item) => {
      root.$confirm(root.$t('deleteTip', { item: item.name }))
        .then(_ => {
          root.$Api.studentManagement.deleteNormalFilter(item.id).then(({ data }) => {
            if (data.code !== 200) return Promise.reject()
            root.$notify.success(root.$t('删除成功'))
            getNormalFilterList()
          }).catch()
        })
    }

    const handleAdd = () => {
      flagState.isShowAllFilterDialog = true
      name.value = ''
      searchParams.value = {}
    }

    const closeDialogBySet = ({ categoryName, formState }) => {
      formState = transferSubmitData(formState)
      const id = formState.id
      const submitData = {
        formName: categoryName,
        formInfo: JSON.stringify(formState),
      }
      if (id) {
        Object.assign(submitData, { id })
      } else {
        Object.assign(submitData, { functionPoint: FUNCTION_POINT })
      }
      const url = id ? 'updateNormalFilter' : 'addNormalFilter'
      root.$Api.studentManagement[url](submitData).then(({ data }) => {
        if (data.code !== 200) return Promise.reject()
        getNormalFilterList()
        root.$notify.success(root.$t('操作成功'))
      }).finally(() => flagState.isShowAllFilterDialog = false)
    }

    // 获取常用筛选列表
    const getNormalFilterList = () => {
      flagState.isLoading = true
      root.$Api.studentManagement.getNormalFilterList(FUNCTION_POINT).then(({ data }) => {
        if (data.code !== 200) return Promise.reject()
        filterList.value = data.data
      }).finally(() => flagState.isLoading = false)
    }

    const close = () => {
      if (!flagState.isDragging) {
        emit('closeSortFilterDialog')
        return
      }
      onSubmit()
    }

    const onSubmit = async () => {
      filterList.value.forEach((item, index) => {
        item.seq = index + 1
      })
      root.$Api.studentManagement.batchUpdateCacheForm(filterList.value).then(({ data }) => {
        if (data.code !== 200) return Promise.reject()
        root.$notify.success(root.$t('操作成功'))
        emit('closeSortFilterDialog')
      }).catch(() => {
        root.$notify.success(root.$t('操作失败'))
      })
    }

    const setFilterList = () => {
      filterList.value = props.usedCombineList;
    }

    onMounted(() => {
      setFilterList()
    })

    return {
      NUM,
      name,
      searchParams,
      filterList,
      ...toRefs(flagState),

      close,
      onSubmit,
      closeDialogBySet,
      getNormalFilterList,
      handleEdit,
      handleDelete,
      handleAdd
    }
  },
})
</script>
<style lang="scss" scoped>
.sort-dialog {
  .sort-container {
    text-align: center;
  }
  .list-group {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    display: flex;
    flex-direction: column;
    padding-left: 0;
    .list-group-item {
      height: 30px;
      line-height: 30px;
      margin: 10px;
      cursor: pointer;
    }
  }
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
}
</style>
