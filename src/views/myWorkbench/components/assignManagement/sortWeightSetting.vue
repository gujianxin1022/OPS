<!-- 分配管理权重顺序设置  -->
<template>
  <div class="sort-weight-set-container">
    <p class="sort-title">{{$t('请设置分配顺序/权重')}}</p>
    <el-card
      class="box-card mb20"
      v-for=" (rule,index) in subRuleList"
      :key="index"
    >
      <div
        slot="header"
        class="clearfix"
      >
        <span>{{$t('规则')+ (index + 1)}}</span>
        <el-space style="float: right">
          <el-button
            type="text"
            @click="handleAddRule"
          >{{$t('新建规则')}}</el-button>
          <el-button
            type="text"
            @click="handleCopyRule(index)"
          >{{$t('复制规则')}}</el-button>
          <el-button
            type="text"
            @click="handleDeleteRule(index)"
          >{{$t('删除规则')}}</el-button>
        </el-space>
      </div>
      <el-row>
        <el-col :span="isEn ?  6 : 4">{{$t('新生类型')}}</el-col>
        <el-col :span="isEn ? 18 : 20">
          <el-checkbox-group
            v-model="rule.studentType"
            @change="handleNewStudentChange($event, index)"
          >
            <el-checkbox
              v-for="item in getNewStudentType(isEn)"
              :key="item.value"
              :label="item.value"
              :disabled="getBtnStatus(rule, item.value)"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <p class="rule-title">{{$t('分配顺序/权重')}}</p>
      <el-table
        :data="rule.ruleSecondaryPersonParamList"
        row-key="seq"
        tooltip-effect="dark"
        :border="true"
        fit
        stripe
        :header-cell-style="{ background: '#7580E5', color: '#fff' }"
      >
        <el-table-column
          align="center"
          :label="$t('顺序')"
          width="100"
        >
          <template slot-scope="scope">
            {{scope.$index +1}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('学管')"
          prop="name"
        >
          <template slot-scope="{row}">
            {{((row.username ? row.username + '-' : '') + (isEn ? (row.nameEn || row.nameZh) : (row.nameZh || row.nameEn))) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('部门')"
          prop="part"
          :width="200"
        >
          <template slot-scope="{row}">
            {{isEn ? row.partEn : row.part}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('权重')"
          prop="weight"
          :width="120"
        >
          <el-template slot-scope="{row}">
            <el-input
              v-model="row.weight"
              type="number"
              oninput="if(value && value>100)value=100;if(value && value<1)value=1"
            ></el-input>
          </el-template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('排序')"
          width="50"
        >
          <template>
            <span class="handle-target-wrap"> <img
                src="../../../../assets/drag.png"
                :class="'handle-target' + index"
                class="icon"
              ></span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>
<script>
import { computed, defineComponent, onMounted, ref, unref, set, watch } from '@vue/composition-api'
import Sortable from 'sortablejs';
import { deepClone } from "@/utils/handleData";
import { getNewStudentType } from '../../dataConfig/constant'

export default defineComponent({
  props: {
    selectedMembers: {
      type: Array,
      default: []
    },
    ruleSecondaryParamList: {
      type: Array,
      default: []
    }
  },
  setup (props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === 'en')
    const dataTpl = {
      id: null,
      parentRuleId: null,
      studentType: [],
      seq: null,
      ruleSecondaryPersonParamList: [
        {
          id: null,
          subruleId: null,
          personId: null,
          weight: null,
          seq: null
        }
      ],
      disableBtns: [],
    }
    const disabledNewStu = ref([])
    const currentTableIdx = ref(0)
    const subRuleList = ref([deepClone({ ...dataTpl, ruleSecondaryPersonParamList: [] })])

    watch(() => props.ruleSecondaryParamList, (subList) => {
      mapRespSubRuleList(subList)
    })

    watch(() => props.selectedMembers, (members) => {
      const copyList = unref(subRuleList)
      copyList.forEach(item => {
        item.ruleSecondaryPersonParamList = getMemberList(members, item.ruleSecondaryPersonParamList)
      })
      subRuleList.value = copyList
    })

    const getMemberList = (members, subPersonList) => {
      function currentItem (id) {
        return subPersonList?.find(t => {
          return t.personId === id
        })
      }
      function currentItmFromProps (id) {
        return props.selectedMembers.find(t => t.id === id)
      }
      const finalList = members.map((member, i) => {
        return {
          ...currentItem(member.id),
          nameZh: member.nameZh || member.name,
          nameEn: member.nameEn || member.name,
          part: !subPersonList ? getPartFromByAddRule(currentItmFromProps(member.id), 'zh') : getPartFromPropsOrTree(currentItem(member.id), member, 'zh'),
          partEn: !subPersonList ? getPartFromByAddRule(currentItmFromProps(member.id), 'en') : getPartFromPropsOrTree(currentItem(member.id), member, 'en'),
          weight: currentItem(member.id) ? currentItem(member.id).weight : 1,
          seq: currentItem(member.id) ? currentItem(member.id).seq : (subPersonList?.length + 1 || i + 1),
          personId: member.id,
          username: member.username
        }
      }).sort((a, b) => a.seq - b.seq)
      return finalList.map((_t, _i) => {
        return {
          ..._t,
          seq: _i + 1
        }
      })
    }

    const getPartFromByAddRule = (current, lang) => {
      const isEn = lang === 'en'
      if (current) {
        const { postInfoResp } = current
        if (postInfoResp) {
          const { upPostNameEn, currentPostNameEn, upPostNameZh, currentPostNameZh, thirdPostNameZh, thirdPostNameEn } = postInfoResp
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
          return isEn ? strEn : strZh
        }
      }
      return isEn ? current.fullPathEn : current.fullPathZh
    }

    const getPartFromPropsOrTree = (current, member, lang) => {
      const isEn = lang === 'en'
      if (current) {
        const { postInfoResp } = current
        if (postInfoResp) {
          const { upPostNameEn, currentPostNameEn, upPostNameZh, currentPostNameZh, thirdPostNameZh, thirdPostNameEn } = postInfoResp
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
          return isEn ? strEn : strZh
        }
      }
      return isEn ? member.fullPathEn : member.fullPathZh
    }

    const mapRespSubRuleList = (list) => {
      const copyList = deepClone(list)
      const selectVals = copyList.map(t => t.studentType.split(',')).flat()
      disabledNewStu.value = Array.from(new Set(selectVals))
      subRuleList.value = copyList.map((t, i) => {
        return {
          ...t,
          seq: t.seq,
          parentRuleId: t.parentRuleId,
          studentType: t.studentType.split(','),
          disableBtns: unref(disabledNewStu).filter(disableItem => !(t.studentType?.split(',')?.includes(disableItem))),
          ruleSecondaryPersonParamList: t.ruleSecondaryPersonRespList.map((_t, _i) => {
            return {
              ..._t,
              nameZh: _t.userInfo?.nameZh,
              nameEn: _t.userInfo?.nameEn,
              personId: _t.userInfo?.userId,
              weight: _t.weight,
              username: _t.userInfo?.username,
              seq: _t.seq,
            }
          })
        }
      })
      root.$nextTick(() => {
        unref(subRuleList).map((t, i) => {
          initRowDrop(i)
        })
      })
    }

    const handleNewStudentChange = (val, i) => {
      currentTableIdx.value = i
      const copyList = deepClone(unref(subRuleList))
      const selectVals = copyList.map(t => t.studentType).flat()
      disabledNewStu.value = Array.from(new Set(selectVals))
      copyList.forEach((t, idx) => {
        if (idx !== i) {
          t.disableBtns = unref(disabledNewStu).filter(disableItem => !(t.studentType?.includes(disableItem)))
        }
      })
      subRuleList.value = copyList
    }
    const getBtnStatus = (rule, val) => {
      return !(rule.studentType.includes(val)) && rule.disableBtns?.includes(val)
    }
    const initRowDrop = (index) => {
      const tbody = document.querySelectorAll('.el-table__body-wrapper tbody')[index]
      Sortable.create(tbody, {
        handle: `.handle-target${index}`,
        animation: 150,
        onEnd ({ newIndex, oldIndex }) {
          if (newIndex === oldIndex) return
          const copyTableData = deepClone([...unref(subRuleList)[index].ruleSecondaryPersonParamList])
          const currentRow = copyTableData.splice(oldIndex, 1)[0]
          copyTableData.splice(newIndex, 0, currentRow)
          set(unref(subRuleList)[index], "ruleSecondaryPersonParamList", copyTableData)
        },
      });
    }

    const handleAddRule = () => {
      if (!checkMembersValidate()) return
      const copyRule = { ...deepClone(dataTpl), disableBtns: unref(disabledNewStu), ruleSecondaryPersonParamList: getMemberList(props.selectedMembers, null), new: true }
      unref(subRuleList).push(copyRule)
      root.$nextTick(() => {
        initRowDrop(unref(subRuleList).length - 1)
      })
    }
    const handleCopyRule = (index) => {
      if (!checkMembersValidate()) return
      const copyItem = deepClone(unref(subRuleList)[index])
      copyItem.studentType = []
      copyItem.new = true
      copyItem.disableBtns = unref(disabledNewStu)
      unref(subRuleList).push(copyItem)
      root.$nextTick(() => {
        initRowDrop(unref(subRuleList).length - 1)
      })
    }
    const handleDeleteRule = (index) => {
      if (unref(subRuleList).length === 1) return root.$notify.warning(root.$t('至少保留一条规则'))
      if (!checkMembersValidate()) return
      root.$confirm(root.$t('是否确定删除？'), root.$t('警告'))
        .then(_ => {
          const currentNewStudentType = unref(subRuleList)[index].studentType
          currentNewStudentType.forEach((type, i) => {
            const idx = unref(disabledNewStu).findIndex(t => t === type)
            if (idx > -1) {
              unref(disabledNewStu).splice(idx, 1)
            }
          })
          unref(subRuleList).splice(index, 1)
          unref(subRuleList).forEach((t, _i) => {
            t.disableBtns = unref(disabledNewStu).filter(disableItem => !(t.studentType?.includes(disableItem)))
          })
        })
        .catch(_ => {
        })
    }

    const checkWeightSortValidate = () => {
      return unref(disabledNewStu).length === 4
    }

    const checkMembersValidate = () => {
      if (!props.selectedMembers.length) {
        root.$notify.warning(root.$t('请先选择分配的成员'))
        return false
      }
      return true
    }

    onMounted(() => {
      setTimeout(() => {
        if (!props.ruleSecondaryParamList.length) {
          initRowDrop(0)
        }
      })
    })
    return {
      isEn,
      currentTableIdx,
      subRuleList,
      disabledNewStu,

      handleAddRule,
      handleCopyRule,
      handleDeleteRule,
      handleNewStudentChange,
      getBtnStatus,
      checkWeightSortValidate,
      checkMembersValidate,

      getNewStudentType
    }
  },
})
</script>
<style lang="scss" scoped>
.sort-weight-set-container {
  word-break: break-word !important;
  font-size: 14px;
  .box-card {
    width: 80%;
    margin-left: 100px;
  }
  .sort-title {
    font-size: 14px;
    color: #606266;
    font-weight: 700;
    width: 200px;
    text-align: right;
    padding-right: 10px;
  }
  .icon {
    display: inline-block;
    width: 20px;
    height: 15px;
    position: relative;
    top: 3px;
    cursor: pointer;
  }
}
</style>
