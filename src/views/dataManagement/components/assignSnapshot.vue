<template>
  <div class="assign-snapshot-container">
    <el-dialog
      :title="$t('分配快照')"
      :visible.sync="visible"
      @close="closeDialog"
      center
      width="1100px"
    >
      <p>
        {{ snapshotType === SNAPSHOT_TYPE.AUTO_ASSIGN_EXIST_XG ? $t('快照提示2') : $t('快照提示')}}
      </p>
      <p v-if="snapshotType !== SNAPSHOT_TYPE.AUTO_ASSIGN_EXIST_XG">
        {{$t('服务语言偏好')}}: {{$t(currentLog.specialLanguageDesc) || $t('无')}}</p>
      <p>
        {{$t('规则名称')}}:
        {{snapshotType ===SNAPSHOT_TYPE.AUTO_ASSIGN_EXIST_XG ? $t('自动分配原学管'):currentLog.ruleName}}
      </p>
      <p>
        {{$t('分配学管')}}:
        {{currentLog.recipientUserInfoResp && currentLog.recipientUserInfoResp.username }}
      </p>
      <el-table
        :row-class-name="tableRowClassName"
        :data="tableData"
        :key="tableKey"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%;margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column
          v-if="snapshotType === SNAPSHOT_TYPE.RULE"
          align="center"
          :label="$t('序号')"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="snapshotType !== SNAPSHOT_TYPE.AUTO_ASSIGN_EXIST_XG"
          prop="name"
          align="center"
          :label="$t('学管姓名')"
        >
          <template slot-scope="{row}">
            {{ snapshotType === SNAPSHOT_TYPE.RULE ?  (row.userInfoResp && row.userInfoResp.username) : (row.xgUserInfo && row.xgUserInfo.username)}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="snapshotType !== SNAPSHOT_TYPE.AUTO_ASSIGN_EXIST_XG"
          prop="post"
          align="center"
          :label="$t('部门')"
        >
          <template slot-scope="{row}">
            {{snapshotType === SNAPSHOT_TYPE.RULE ? getDepart(row.postInfoResp) :getDepart(row.xgPostInfo)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="specialLanguage"
          v-if="snapshotType === SNAPSHOT_TYPE.LANGUAGE"
          align="center"
          width="150px"
          :label="$t('服务语言')"
        >
          <template slot-scope="{row}">
            <span>{{row.specialLanguageDesc}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="specialLanguage"
          v-if="snapshotType === SNAPSHOT_TYPE.LANGUAGE"
          align="center"
          :label="$t('特殊语言人效')"
        >
          <template slot-scope="{row}">
            {{row.studentNum}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="snapshotType === SNAPSHOT_TYPE.RULE"
          align="center"
          prop="weight"
          :label="$t('分配权重')"
        >
        </el-table-column>
        <el-table-column
          v-if="snapshotType === SNAPSHOT_TYPE.RULE"
          align="center"
          prop="studentNum"
          :label="$t('本轮分到学生')"
        >
        </el-table-column>
        <el-table-column
          v-if="snapshotType === SNAPSHOT_TYPE.RULE"
          align="center"
          prop="shouldAssign"
          :label="$t('应发学管')"
        >
          <template slot-scope="{row}">
            {{row.shouldAssign ? $t('是') : $t('否')}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('开启分配')"
          prop="autoAssign"
          v-if="snapshotType !== SNAPSHOT_TYPE.AUTO_ASSIGN_EXIST_XG"
        >
          <template slot-scope="{row}">
            {{row.autoAssign ? $t('否') : $t('是')}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('是否排班内')"
          prop="workStatus"
          v-if="snapshotType !== SNAPSHOT_TYPE.AUTO_ASSIGN_EXIST_XG"
        >
          <template slot-scope="{row}">
            {{row.workStatus ? $t('否') : $t('是')}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('是否请假')"
          prop="leaveStatus"
          v-if="snapshotType !== SNAPSHOT_TYPE.AUTO_ASSIGN_EXIST_XG"
        >
          <template slot-scope="{row}">
            {{row.leaveStatus ? $t('是') : $t('否')}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="snapshotType === SNAPSHOT_TYPE.AUTO_ASSIGN_EXIST_XG"
          align="center"
          prop="studentName"
          :label="$t('学生')"
        >
        </el-table-column>
        <el-table-column
          v-if="snapshotType === SNAPSHOT_TYPE.AUTO_ASSIGN_EXIST_XG"
          align="center"
          :label="$t('学科')"
          prop="subjectTypeId"
        >
          <template slot-scope="{row}">
            {{Filters.getSubjectLabel(row.subjectTypeId, currentLang)}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="snapshotType === SNAPSHOT_TYPE.AUTO_ASSIGN_EXIST_XG"
          align="center"
          prop="subjectSpeed"
          :label="$t('进度')"
        >
          <template slot-scope="{row}">
            {{isEn ? row.subjectSpeedEn : row.subjectSpeedZh}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="snapshotType === SNAPSHOT_TYPE.AUTO_ASSIGN_EXIST_XG"
          align="center"
          prop="xg"
          :label="$t('服务学管')"
        >
          <template slot-scope="{row}">
            {{row.xgUserInfo && row.xgUserInfo.username}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="snapshotType === SNAPSHOT_TYPE.AUTO_ASSIGN_EXIST_XG"
          align="center"
          prop="subjectIds"
          :label="$t('可服务学科')"
        >
          <template slot-scope="{row}">
            <span
              v-for="subject in row.subjectIds"
              :key="subject"
            >
              {{Filters.getSubjectLabel(subject, currentLang)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="snapshotType !== SNAPSHOT_TYPE.AUTO_ASSIGN_EXIST_XG"
          align="center"
          prop="tomorrowWorkStatus"
          :label="$t('第二天是否上班')"
        >
          <template slot-scope="{row}">
            <span v-if="row.tomorrowWorkStatus === 1">{{$t('否')}}</span>
            <span v-else-if="row.tomorrowWorkStatus === 0">{{$t('是')}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="snapshotType !== SNAPSHOT_TYPE.AUTO_ASSIGN_EXIST_XG"
          align="center"
          prop="tomorrowLeaveStatus"
          :label="$t('第二天是否请假')"
        >
          <template slot-scope="{row}">
            <span v-if="row.tomorrowLeaveStatus === 0">{{$t('否')}}</span>
            <span v-else-if="row.tomorrowLeaveStatus === 1">{{$t('是')}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { computed, defineComponent, onMounted, ref, unref } from '@vue/composition-api'
import { SNAPSHOT_TYPE } from '@/utils/constants'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentLog: {
      type: Object,
      default: {}
    }
  },
  setup (props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === 'en')
    const currentLang = computed(() => root.$store.getters.currentLang)
    const tableData = ref(null)
    const loading = ref(false)
    const closeDialog = () => {
      emit('update:visible', false)
    }
    const snapshotType = ref(SNAPSHOT_TYPE.RULE)
    const tableRowClassName = ({ row, rowIndex }) => {
      if (props.currentLog.recipientUserInfoResp?.userId === (row.xgUserInfo?.userId || row.userInfoResp?.userId)) return 'success-row';
      return '';
    }
    const getTableData = () => {
      loading.value = true
      root.$Api.dataManagement.getAssignSnapshotList(props.currentLog.id).then(({ status, data: { code, data } }) => {
        if (status !== 200 || code !== 200) return Promise.reject()
        snapshotType.value = data.snapshotType
        tableData.value=data.snapshotList
      }).catch(() => {
        tableData.value = []
        loading.value = false
      }).finally(() => {
        loading.value = false
        tableKey.value++
      })
    }

    const getDepart = (info) => {
      const { upPostNameEn, currentPostNameEn, upPostNameZh, currentPostNameZh, thirdPostNameZh, thirdPostNameEn } = info
      let strZh = currentPostNameZh
      if (upPostNameZh) {
        strZh += '/' + upPostNameZh
      }
      if (thirdPostNameZh) {
        strZh += '/' + thirdPostNameZh
      }
      let strEn = currentPostNameEn
      if (upPostNameEn) {
        strEn += '/' + upPostNameEn
      }
      if (thirdPostNameEn) {
        strEn += '/' + thirdPostNameEn
      }
      return unref(isEn) ? strEn : strZh
    }
    const tableKey=ref(0)
    onMounted(() => {
      getTableData()
    })
    return {
      isEn,
      currentLang,
      tableData,
      loading,
      SNAPSHOT_TYPE,
      snapshotType,
      tableKey,
      closeDialog,
      getTableData,
      getDepart,
      tableRowClassName
    }
  },
})
</script>

<style lang="scss" scoped>
.assign-snapshot-container {
}
::v-deep {
  .el-table .cell {
    word-break: break-word !important;
  }
}

::v-deep .el-table .success-row {
  background: #f0f9eb;
}
</style>