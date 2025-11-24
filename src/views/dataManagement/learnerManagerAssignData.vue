<template>
  <div class="auto-la-assign-data-container">
    <el-radio-group v-model="activeTopTab">
      <el-radio-button :label="ASSIGN_DATA_TYPE.ASSIGN_STATISTICS">
        {{$t('分配统计')}}
      </el-radio-button>
      <el-radio-button :label="ASSIGN_DATA_TYPE.ASSIGN_RECORD">
        {{$t('分配记录')}}
      </el-radio-button>
    </el-radio-group>
    <el-popover
      trigger="hover"
      placement="right"
      title=""
    >
      <div
        style="width: 330px"
        class="word-wrap"
      >
        {{$t('分配统计名词解释')}}
      </div>
      <div
        style="width: 330px"
        class="word-wrap"
      >
        {{$t('分配记录名词解释')}}
      </div>
      <i
        slot="reference"
        class="el-icon-question"
        style="color: #ccc"
      ></i>
    </el-popover>
    <div
      v-if="activeTopTab === ASSIGN_DATA_TYPE.ASSIGN_RECORD"
      class="mt20 ml30"
    >
      <el-radio-group v-model="activeSubTab">
        <el-radio-button :label="ASSIGN_TYPE.FIRST_ASSIGN">
          {{$t('首次分配')}}
        </el-radio-button>
        <el-radio-button :label="ASSIGN_TYPE.RE_ASSIGN">
          {{$t('重新分配')}}
        </el-radio-button>
      </el-radio-group>
    </div>
    <AssignStatisticsList
      v-if="activeTopTab === ASSIGN_DATA_TYPE.ASSIGN_STATISTICS"
    />
    <AssignRecordList
      v-if="activeTopTab === ASSIGN_DATA_TYPE.ASSIGN_RECORD && isRender"
      :assignType="activeSubTab"
      @forceUpdate="handleUpdate"
    />
  </div>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'
import { ASSIGN_DATA_TYPE, ASSIGN_TYPE } from '@/views/myWorkbench/dataConfig/enum'
import AssignStatisticsList from './components/assignStatisticsList.vue'
import AssignRecordList from './components/assignRecordList.vue'
export default defineComponent({
  components: { AssignStatisticsList, AssignRecordList },
  setup (_, { root, emit, refs }) {
    const activeTopTab = ref(ASSIGN_DATA_TYPE.ASSIGN_STATISTICS)
    const activeSubTab = ref(ASSIGN_TYPE.FIRST_ASSIGN)
    const isRender = ref(true)
    const handleUpdate = () => {
      isRender.value = false
      root.$nextTick(() => {
        isRender.value = true
      })
    }
    return {
      activeTopTab,
      activeSubTab,
      isRender,

      ASSIGN_DATA_TYPE,
      ASSIGN_TYPE,
      handleUpdate
    }
  },
})
</script>
<style lang="scss" scoped>
.auto-la-assign-data-container {
  padding: 20px;
}
::v-deep {
  .el-table .cell {
    word-break: break-word !important;
  }
}
.word-wrap {
  word-break: break-word !important;
}
</style>
