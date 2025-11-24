<template>
  <div class="rule-list-container">
    <el-button
      style="float: right"
      type="primary"
      @click="addRuleConfig"
      class="mb20"
    >
      {{ $t("新建") }}
    </el-button>
    <el-table
      :data="tableData"
      row-key="id"
      v-loading="loading"
      tooltip-effect="dark"
      :border="false"
      fit
      show-overflow-tooltip="true"
      style="width: 100%; margin-top: 10px"
      stripe
      :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
    >
      <el-table-column
        align="center"
        :label="$t('顺序')"
        width="100"
        prop="row"
      >
        <template slot-scope="scope">
          {{scope.$index +1}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('规则名称')"
        prop="ruleName"
      >
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('最近修改时间')"
        prop="user"
        width="150"
      >
        <template slot-scope="{row}">
          {{DateTimeUtils.dateClockTime(row.updateTime || row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('最近修改人')"
        prop="updateUser"
      >
        <template slot-scope="{row}">
          {{row.updateUser && row.updateUser.username || '-'}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('创建时间')"
        width="150"
        prop="createTime"
      >
        <template slot-scope="{row}">
          <span>{{
                DateTimeUtils.dateClockTime(row.createTime)
              }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('创建人')"
        prop="createUser"
      >
        <template slot-scope="{row}">
          {{row.createUser && row.createUser.username || '-'}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('启用')"
        prop="status"
      >
        <template slot-scope="{row}">
          <el-switch
            v-model="row.status"
            :active-color="activeColor"
            @change="changeRuleStatus(row)"
            inactive-color="#ccc"
            :active-value="0"
            :inactive-value="1"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('操作')"
        :width="200"
      >
        <template slot-scope="{row}">
          <el-space>
            <el-button
              type="text"
              @click="handleEdit(row)"
            >{{ $t("编辑") }}</el-button>
            <el-button
              type="text"
              @click="handleCopy(row)"
            >{{ $t("复制") }}</el-button>
            <el-button
              v-if="Per.handleButtonPer('teach.laMT.AssignMT.DeleteRulePer')"
              type="text"
              @click="handleDelete(row)"
            >{{ $t("删除") }}</el-button>
            <span class="handle-target-wrap ml10"> <img
                src="../../../../assets/drag.png"
                class="handle-target"
              ></span>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <!-- <custom-pagination
      :total="pageState.total"
      :current-page="pageState.pageNum"
      @getCurrentPage="getCurrentPage"
      @getPerPage="getPerPage"
    /> -->
  </div>
</template>
<script>
import { ASSIGN_RULE_TYPE } from '../../dataConfig/enum'
import { defineComponent, ref, reactive, toRefs, computed, onMounted, unref, watch, onActivated } from '@vue/composition-api'
import styles from "@/styles/variables.scss";
import Sortable from 'sortablejs';
import { deepClone } from '../../../../utils/handleData';

export default defineComponent({
  props: {
    ruleType: { type: String, default: ASSIGN_RULE_TYPE.NORMAL_RULE }
  },
  components: {},
  setup (props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === 'en')
    const tableData = ref([])
    const activeColor = styles.customPrimaryColor
    const flagState = reactive({
      loading: false
    })

    watch(() => props.ruleType, () => {
      getData()
    })
    // const pageState = reactive({

    //   pageSize: 50,
    //   pageNum: 1,
    //   total: 0
    // })

    const addRuleConfig = () => {
      root.$router.push(`/work/assign/addRule?ruleType=${props.ruleType}`);
    }

    const createRowDrop = () => {
      try {
        const tbody = document.querySelector('.el-table__body-wrapper tbody')
        Sortable.create(tbody, {
          handle: '.handle-target',
          animation: 150,
          onEnd ({ newIndex, oldIndex }) {
            if (newIndex === oldIndex) return
            const copyTableData = deepClone(unref(tableData))
            const currentRow = copyTableData.splice(oldIndex, 1)[0]
            flagState.loading = true
            root.$Api.workBench.ruleListSort(currentRow.id, newIndex + 1).then(({ status, data: { data, code } }) => {
              if (status !== 200 || code !== 200) {
                return Promise.reject()
              }
              root.$notify.success(root.$t('操作成功'))
            }).finally(() => {
              copyTableData.splice(newIndex, 0, currentRow)
              tableData.value = copyTableData
              getData()
            })
          },
        });
      } catch (e) {
        console.log(e)
      }
    }

    const changeRuleStatus = async (row) => {
      await root.$confirm(
        row.status ? root.$t('是否停用该规则') : root.$t('是否启用该规则'),
        root.$t("确认"),
        { type: "warning", center: true }
      ).then(async () => {
        const { status, data: { code, data } } = await root.$Api.workBench.changeRuleStatus(row.ruleType, row.id, row.status)
        if (status !== 200 || code !== 200) return Promise.reject()
        root.$notify.success(root.$t('操作成功'))
        getData()
      }).catch(() => {
        row.status = row.status === 0 ? 1 : 0
      })

    }

    const handleEdit = (row) => {
      root.$router.push(`/work/assign/addRule?ruleType=${props.ruleType}&ruleId=${row.id}`);
    }

    const handleCopy = (row) => {
      root.$router.push(`/work/assign/addRule?ruleType=${props.ruleType}&ruleId=${row.id}&copy=true`);
    }

    const handleDelete = (row) => {
      if (!row.status) return root.$notify.warning(root.$t('启用状态下无法删除'))
      root.$confirm(root.$t('规则删除后无法回复，请谨慎操作。'), root.$t('警告'))
        .then(_ => {
          root.$Api.workBench.deleteRule(row.id).then(({ status, data: { code, data } }) => {
            if (status !== 200 || code !== 200) return Promise.reject()
            root.$notify.success(root.$t('操作成功'))
            getData()
          })
        })
        .catch(_ => {
        })
    }

    // const getCurrentPage = (page) => {
    //   pageState.pageNum = page
    //   getData()
    // }

    // const getPerPage = (perPage) => {
    //   pageState.pageSize = perPage
    //   getData()

    // }

    const getData = () => {
      flagState.loading = true
      root.$Api.workBench.getRuleList(props.ruleType).then(({ status, data: { data, code } }) => {
        if (status !== 200 || code !== 200) return Promise.reject()
        tableData.value = data
        if (data.length) createRowDrop()
      }).catch(() => {
        tableData.value = []
      }).finally(() => {
        flagState.loading = false
      })
    }

    onMounted(() => {
      getData()
    })

    onActivated(getData)

    return {
      isEn,
      activeColor,
      tableData,
      // pageState,
      ...toRefs(flagState),

      // getPerPage,
      // getCurrentPage,
      getData,
      changeRuleStatus,
      handleEdit,
      handleCopy,
      handleDelete,
      createRowDrop,
      addRuleConfig,

      ASSIGN_RULE_TYPE
    }
  },
})
</script>
<style lang="scss" scoped>
.rule-list-container {
  margin-top: -30px;
  .handle-target-wrap {
    vertical-align: middle;
    .handle-target {
      display: inline-block;
      width: 20px;
      height: 15px;
      position: relative;
      top: 3px;
      cursor: pointer;
      .el-icon-s-operation {
        color: #333;
      }
    }
  }
}
::v-deep {
  .el-table .cell {
    word-break: break-word !important;
  }
}
</style>
