<template>
  <div class="assign-new-stu-container">
    <el-radio-group v-model="activeTopTab">
      <el-radio-button
        v-if="Per.handleTabsPer('teach.laMT.AssignMT.autoAssignRulePer')"
        :label="ASSIGN_CONFIG_TAB_TYPE.AUTO_ASSIGN_RULE"
      >
        {{$t('自动分配规则')}}
      </el-radio-button>
      <el-radio-button
        v-if="Per.handleTabsPer('teach.laMT.AssignMT.LAAssignSetPer')"
        :label="ASSIGN_CONFIG_TAB_TYPE.LA_ASSIGN_SETTING"
      >
        {{$t('学管分配设置')}}
      </el-radio-button>
    </el-radio-group>
    <div
      class="mt20 ml20 sub-tab-wrap"
      v-if="activeTopTab === ASSIGN_CONFIG_TAB_TYPE.AUTO_ASSIGN_RULE"
    >
      <div>
        <el-radio-group v-model="activeSubTab">
          <el-radio-button
            :label="
      ASSIGN_RULE_TYPE.NORMAL_RULE"
            v-if="Per.handleTabsPer('teach.laMT.AssignMT.NormalRulePer')"
          >
            {{$t('常规规则')}}
          </el-radio-button>
          <el-radio-button
            :label="ASSIGN_RULE_TYPE.DEFAULT_RULE"
            v-if="Per.handleTabsPer('teach.laMT.AssignMT.DefaultRulePer')"
          >
            {{$t('兜底规则')}}
          </el-radio-button>
        </el-radio-group>
        <el-popover
          trigger="hover"
          placement="right"
          title=""
        >
          <div
            style="width: 230px"
            class="tip-content"
          >
            {{$t('自动分配学管规则名词解释')}}
          </div>
          <i
            slot="reference"
            class="el-icon-question"
            style="color: #ccc"
          ></i>
        </el-popover>
      </div>
    </div>
    <RuleList
      v-if="activeTopTab === ASSIGN_CONFIG_TAB_TYPE.AUTO_ASSIGN_RULE && Per.handleTabsPer('teach.laMT.AssignMT.autoAssignRulePer')"
      :ruleType="activeSubTab"
    />
    <AssignLaSetList
      v-else-if="Per.handleTabsPer('teach.laMT.AssignMT.LAAssignSetPer')"
    />
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { ASSIGN_CONFIG_TAB_TYPE, ASSIGN_RULE_TYPE } from '../dataConfig/enum'
import RuleList from '../components/assignManagement/ruleList.vue'
import AssignLaSetList from '../components/assignManagement/assignLaList.vue'
import {
  changeRuleStatus,
  getNormalRuleList,
  getDefaultRuleList
} from "@/api/autoAssignLaManagement";
export default defineComponent({
  components: { RuleList, AssignLaSetList },
  setup (_, { root, emit }) {
    const activeTopTab = ref('')
    const activeSubTab = ref('')
    onMounted(() => {
      if (root.Per.handleTabsPer('teach.laMT.AssignMT.autoAssignRulePer')) {
        activeTopTab.value = ASSIGN_CONFIG_TAB_TYPE.AUTO_ASSIGN_RULE
      } else if (root.Per.handleTabsPer('teach.laMT.AssignMT.LAAssignSetPer')) {
        activeTopTab.value = ASSIGN_CONFIG_TAB_TYPE.LA_ASSIGN_SETTING
      } else {
        console.log('没有自动分配与学管分配设置权限')
      }
      if (root.Per.handleTabsPer('teach.laMT.AssignMT.NormalRulePer')) {
        activeSubTab.value = ASSIGN_RULE_TYPE.NORMAL_RULE
      } else if (root.Per.handleTabsPer('teach.laMT.AssignMT.DefaultRulePer')) {
        activeSubTab.value = ASSIGN_RULE_TYPE.DEFAULT_RULE
      } else {
        console.log('没有常用规则与兜底规则权限')
      }
    })
    return {
      activeTopTab,
      activeSubTab,

      /**enum */
      ASSIGN_CONFIG_TAB_TYPE,
      ASSIGN_RULE_TYPE
    }
  },
})
</script>
<style lang="scss" scoped>
.assign-new-stu-container {
  padding: 20px 20px;
  .sub-tab-wrap {
    display: flex;
    justify-content: space-between;
  }
}
.tip-content {
  word-break: break-word !important;
}
</style>
