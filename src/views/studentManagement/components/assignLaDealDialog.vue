<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="$t('商机重新分配学管')"
    :visible.sync="visible"
    width="800px"
    @close="closeAssignDialog"
  >
    <p>{{$t('请从家长已有学管中选择')}}:</p>
    <el-table
      :data="xgList"
      v-loading="loading"
      tooltip-effect="dark"
      :border="false"
      fit
      show-overflow-tooltip="true"
      style="width: 100%; margin-top: 10px"
      stripe
      :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      @current-change="clickChange"
    >
      <el-table-column width="50">
        <template slot-scope="{row}">
          <el-radio
            v-model="learnManagerId"
            :label="row"
            :disabled="row.xgUserId === currentItem.xgUserId"
          ><i></i></el-radio>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        align="center"
        :label="$t('my-home-Students')"
        prop="studentRealName"
      />
      <el-table-column
        align="center"
        :label="$t('进度')"
        width="150"
        prop="courseEn"
      >
        <template slot-scope="{row}">
          {{isEn ? row.courseEn : row.courseZh}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('学管')"
        width="150"
        prop="xgUserName"
      >
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('学管部门')"
        prop="postNameEn"
      >
        <template slot-scope="{row}">
          {{getPost(row)}}
        </template>
      </el-table-column>
    </el-table>
    <div
      class="mt20"
      style="textAlign: right"
    >
      <el-space>
        <el-button
          type="primary"
          @click="closeAssignDialog"
        >{{$t('取消')}}</el-button>
        <el-button
          :disabled="!learnManagerId"
          type="primary"
          @click="submitAssign"
        >{{$t('确定')}}</el-button>
      </el-space>
    </div>
  </el-dialog>
</template>
<script>
import { defineComponent, reactive, computed, onMounted, ref, unref } from '@vue/composition-api'
import FamilyLaList from "@/views/Task/components/familyLaList";

export default defineComponent({
  props: {
    currentItem: {
      type: Object,
      dealut: {}
    },
    visible: {
      type: Boolean,
      default: false,
    },
    parentId: {
      type: Number,
      default: -1
    }
  },
  components: { FamilyLaList },
  setup (props, { root, emit, refs }) {
    const userId = JSON.parse(window.localStorage.getItem("userInfo")).id
    const loading = ref(false)
    const isEn = computed(() => root.$store.getters.currentLang === 'en')
    const xgList = ref(null)
    const learnManagerId = ref(null)
    const closeAssignDialog = () => {
      emit('update:visible', false)
    }

    const clickChange = (item) => {
      if (item.xgUserId === props.currentItem.xgUserId) return
      learnManagerId.value = item
    }
    const submitAssign = () => {
      const { id, xgUserId, studentId, subjectType } = props.currentItem
      console.log(xgUserId)
      const params = {
        dealId: id,
        orgLaUserId: xgUserId || '',
        newLaUserId: unref(learnManagerId).xgUserId,
        studentId,
        subjectType,
        operatorId: userId
      }
      root.$Api.studentManagement.reAssignLAOfDeals(params)
        .then(({ status, data: { code } }) => {
          if (status !== 200 || code !== 200) return Promise.reject()
          root.$notify({
            message: root.$t("Allocation succeeded"),
            type: "success",
          });
          emit('assignSuccess')
        });
    }

    const getPost = (row) => {
      let str = ''
      if(unref(isEn)){
        str += row.postNameEn 
        if(row.parentPostNameEn) {
          str += '/' + row.parentPostNameEn 
        }
      } else {
        str += row.postNameZh
        if(row.parentPostNameZh) {
          str += '/' + row.parentPostNameZh 
        }
      }
      return str
    }

    const getLaOfParent = async () => {
      loading.value = true
      const {
        status,
        data: { code, data },
      } = await root.$Api.task.getFamilyLAList(props.parentId);
      if (status !== 200 && code !== 200) return Promise.reject();
      xgList.value = data || [];
      loading.value = false
    }

    onMounted(getLaOfParent)

    return {
      loading,
      userId,
      isEn,
      learnManagerId,
      xgList,
      closeAssignDialog,
      submitAssign,
      clickChange,
      getPost
    }
  },
})
</script>
<style lang="scss" scoped>
</style>
