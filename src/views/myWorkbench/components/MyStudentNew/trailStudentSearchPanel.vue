<template>
  <div class="trail-student-search-panel">
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <el-form
        inline="true"
        :model="formState"
        ref="formRef"
        label-width="130px"
        size="small"
        @keyup.enter.native="search"
      >
        <el-form-item :label="$t('我的范围')" :label-width="isEn ? 400 : 130">
          <CommonTree @get_seleParams="getRangeData"></CommonTree>
        </el-form-item>
        <el-form-item
          :label="$t('商机创建时间')"
          :label-width="isEn ? 300 : 200"
        >
          <el-date-picker
            v-model="formState.businessCreateTime"
            type="daterange"
            :start-placeholder="$t('开始日期')"
            :default-time="['00:00:00', '23:59:59']"
            style="width: 300px"
            :end-placeholder="$t('结束日期')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('用户')" :label-width="isEn ? 400 : 130">
          <UserSelect :isShowParentUserName="false" @userChange="userChange" />
        </el-form-item>
        <el-form-item :label="$t('学科')" :label-width="isEn ? 200 : 130">
          <el-select
            clearable
            :placeholder="$t('请选择')"
            v-model="formState.subjectTypeId"
          >
            <el-option
              v-for="(item, index) in Constants.subjectListAll(
                currentLang,
                false
              )"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('商机id')" :label-width="isEn ? 200 : 130">
          <el-input
            v-model.trim="formState.dealId"
            :placeholder="$t('请输入')"
          />
        </el-form-item>
        <el-form-item :label="$t('商机状态')" :label-width="isEn ? 200 : 130">
          <el-select
            clearable
            :placeholder="$t('请选择')"
            v-model="formState.dealStatus"
          >
            <el-option
              v-for="(item, index) in Constants.getDealsStatus(isEn)"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="">
          <el-checkbox v-model="formState.handover">{{ $t("可交接") }}
          </el-checkbox>
        </el-form-item> -->
      </el-form>
    </screen-wrapper>
  </div>
</template>
<script>
import CommonTree from "@/views/reportManagement/commonTree";
import { computed, defineComponent, reactive, watch } from '@vue/composition-api'
import UserSelect from './userSelect.vue'
import { DEALS_STATUS } from '@/utils/constants'
import { deepClone } from "../../../../utils/handleData";

export default defineComponent({
  components: { CommonTree, UserSelect },
  setup (props, { root, emit, refs }) {
    const userId = JSON.parse(window.localStorage.getItem("userInfo")).id
    const isEn = computed(() => root.$store.getters.currentLang === 'en')
    const currentLang = computed(() => root.$store.getters.currentLang)
    const formState = reactive({
      userId,
      userIdStr: '',
      postIdStr: '',
      businessCreateTime: [],
      dealCreateTimeStart: '',
      dealCreateTimeEnd: '',
      studentName: '',
      studentId: null,
      parentUserName: '',
      parentUserId: null,
      subjectTypeId: 0,
      dealId: null,
      // handover: '',
      dealStatus: ''
    })
    watch(() => formState.businessCreateTime, (newData) => {
      if (!newData) {
        formState.dealCreateTimeStart = "";
        formState.dealCreateTimeEnd = "";
      } else {
        formState.dealCreateTimeStart = new Date(newData[0]).toISOString();
        formState.dealCreateTimeEnd = new Date(newData[1]).toISOString();
      }
    })
    const search = () => {
      const params = deepClone(formState)
      delete params.businessCreateTime
      emit('updateTrailTable', { ...params, load: Math.random() })
    }
    const getRangeData = (val, valName, lacc = null, type, postVal) => {
      if (valName === "postIdList") {
        formState.userIdStr = "";
        formState.postIdStr = val.join(",");
      } else if (valName === "userIdList") {
        formState.postIdStr = "";
        formState.userIdStr = val.join(",");
      } else if (valName === "clear") {
        formState.postIdStr = "";
        formState.userIdStr = "";
      }
      search()
    }

    const userChange = (userState) => {
      const params = deepClone(userState)
      params.studentId = params.studentUserId
      delete params.studentUserId
      Object.assign(formState, params)
    }

    return {
      isEn,
      currentLang,
      formState,
      DEALS_STATUS,
      search,
      getRangeData,
      userChange
    }
  },
})
</script>
<style lang="scss" scoped>
.trail-student-search-panel {
}
</style>
