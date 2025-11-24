<template>
  <div class="level-appeal-wrap">
    <div class="page-title">{{$t('等级申诉')}}</div>
    <screen-wrapper
      screenTitle
      @search="getData"
    >
      <div style="padding-top: 10px;">
        <el-radio-group
          v-model="screenData.dateType"
          @change="changeDateType"
        >
          <el-radio-button :label="2">{{ $t('上月') }}</el-radio-button>
          <el-radio-button :label="1">{{ $t('本月') }}</el-radio-button>
        </el-radio-group>
      </div>
      <screen-item
        label=""
        :part="4"
        label-width="0"
      >
        <el-date-picker
          style="margin-left:0 ;"
          v-model="screenData.appealTime"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
          @change="changeDatePicker"
        ></el-date-picker>
      </screen-item>
      <screen-item
        :label="$t('教师')"
        :part="5"
        label-width="110"
      >
        <span style="display: inline-block; width: 412px;">
          <FilterByUserAccount
            @change="(params) => (userParams = params)"
            @search="getData"
          />
        </span>
      </screen-item>
      <screen-item
        :label="$t('申诉类型')"
        :part="4"
        label-width="110"
      >
        <el-select
          clearable
          v-model="screenData.appealType"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in Constants.getAppealTypeList(isEn)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('处理状态')"
        :part="4"
        label-width="110"
      >
        <el-select
          clearable
          v-model="screenData.dealStatus"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in Constants.getDealStatusList(isEn)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </screen-item>
    </screen-wrapper>
    <div class="table-wrapper">
      <el-table
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%;margin-top:10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        class="attend-table"
      >
        <el-table-column
          align="center"
          :label="$t('序号')"
          :width="50"
          fixed
        >
          <template
            slot-scope="scope">{{ (pageState.pageNum - 1) * pageState.pageSize + scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('申诉时间')"
          prop="appealTime"
        >
          <template slot-scope="{row}">
            <span>{{ DateTimeUtils.dateClockTime(row.appealTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('申诉类型')"
          prop="appealType"
        >
          <template slot-scope="{row}">
            <span v-if="row.appealType || row.appealType === APPEAL_TYPE.ADD">
              {{row.appealType === APPEAL_TYPE.ADD ? $t('添加') : $t('移除')}}
            </span>
            <span v-else>---</span>
          </template>
        </el-table-column>
        <el-table-column
                width="120"
                prop="appealIdentityName"
                align="center"
                :label="$t('老师姓名')"
              ></el-table-column>
        <el-table-column
                align="center"
                :label="$t('教师ID')"
                width="180"
              >
                <template slot-scope="scope">
                  <router-link
                    target="_blank"
                    :to="{
                      path: `/tutorManagement/teacherInfo?id=${scope.row.appealUserId}&teacherName=${scope.row.appealRealName}`,
                    }"
                  >
                    <el-button type="text">{{ scope.row.appealUserId }}</el-button>
                  </router-link>
                </template>
              </el-table-column>
        <el-table-column
          align="center"
          :label="$t('老师昵称')"
          :min-width="250"
          prop="appealRealName"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('学生数')"
          prop="studentNums"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('处理状态')"
          prop="dealStatus"
          width="140"
        >
          <template slot-scope="{row}">
            <span>
              {{row.dealStatus === 0 ? $t('待处理') : (row.dealStatus === 1 ? $t('已处理') : '---')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('处理时间')"
          prop="handleTime"
          width="140"
        >
          <template slot-scope="{row}">
            <span>{{ DateTimeUtils.dateClockTime(row.handleTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('操作')"
          width="140"
        >
          <template slot-scope="{row}">
            <el-button
              v-if="row.dealStatus === 1"
              type="text"
              @click="toJumpDealPage(row, 'readOnly')"
            >{{ $t('查看详情') }}
            </el-button>
            <el-button
              v-if="row.dealStatus === 0"
              type="text"
              @click="toJumpDealPage(row)"
            >{{ $t('去处理') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="pageState.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, ref, computed, onActivated } from '@vue/composition-api'
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";
import Constants from "@/utils/constants";
import { APPEAL_TYPE } from './constants'

export default defineComponent({
  components: {
    FilterByUserAccount
  },
  setup (props, { root, emit }) {
    const userId = JSON.parse(window.localStorage.getItem("userInfo")).id
    const tableData = ref([])
    const loading = ref(false)
    const isEn = computed(() =>
      root.$store.getters.currentLang === 'en'
    );
    const pageState = reactive({
      pageNum: 1,
      pageSize: 50,
    })

    const total = ref(0)
    const userParams = ref({})
    const screenData = reactive({
      userId,
      dateType: '1',
      appealTime: '',
      appealType: '', // 申诉类型（0-添加，1-移除，默认不传查全部）
      dealStatus: '', // 处理状态（0-待处理，1-已处理，默认不传查全部）
    })

    const getCurrentPage = (page) => {
      pageState.pageNum = page
      getData()
    }

    const getPerPage = (perPage) => {
      pageState.pageSize = perPage
      getData()
    }

    const changeDateType = () => {
      screenData.appealTime = []
      getData()
    }

    const getData = () => {
      loading.value = true
      const params = Object.assign({}, screenData, pageState, userParams.value)
      params.appealTimeStart = params.appealTime && params.appealTime[0] || ''
      params.appealTimeEnd = params.appealTime && params.appealTime[1] || ''
      delete params.appealTime
      root.$Api.appealManagement.getLevelAppealList(params).then(({ data }) => {
        if (data.code !== 200) return Promise.reject()
        tableData.value = data.data.list
        total.value = data.data.total
        loading.value = false
      }).catch(() => {
        loading.value = false
        tableData.value = []
      })
    }

    const toJumpDealPage = (item, readOnly) => {
      const commonPath = `/appealManagement/dealLevelAppeal?ids=${item.ids}&type=${item.appealType}`
      const path = readOnly ? `${commonPath}&read=true` : commonPath
      root.$router.push(
        path
      );
    }

    const changeDatePicker = () => {
      if (screenData.appealTime) {
        screenData.dateType = "";
      } else {
        screenData.dateType = "1";
      }
    }

    onActivated(getData)


    return {
      isEn,
      APPEAL_TYPE,
      total,
      loading,
      pageState,
      tableData,
      screenData,
      userParams,
      changeDateType,
      getCurrentPage,
      getPerPage,
      toJumpDealPage,
      getData,
      changeDatePicker
    }
  },
})
</script>

<style lang="scss" scoped>
.level-appeal-wrap {
  padding: 5px 20px;
}
</style>
