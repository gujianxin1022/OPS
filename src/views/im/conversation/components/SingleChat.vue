<template>
  <div class="single-chat">
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <!-- 最近会话时间 -->
      <screen-item :label="$t('最近会话时间')" :labelWidth="labelWidth">
        <el-date-picker
          v-model="query.timeRange"
          type="datetimerange"
          :start-placeholder="$t('开始时间')"
          :end-placeholder="$t('结束时间')"
          size="small"
          :default-time="['00:00:00', '23:59:59']"
        />
      </screen-item>
      <screen-item :label="$t('家长ID')" :labelWidth="labelWidth">
        <el-input v-model.trim="query.parentId" />
      </screen-item>
      <screen-item :label="$t('教师管理人员')" :label-width="labelWidth">
        <FilterByTeachManager @changeSelect="(val) => (query.tmUserId = val)" />
      </screen-item>
      <screen-item
        :label="$t('教师')"
        v-if="
          Per.handleButtonPer(
            'teach.tutorMT.searchTeacher.ftFilterByTeacherName'
          )
        "
        :label-width="labelWidth"
      >
        <!-- <FilterByTeacherKey
          @changeSearchType="(val) => (query.teacherSearchType = val)"
          @changeSearchValue="(val) => (query.teacher = val)"
        /> -->
        <FilterByUserAccount
          @change="
            (params) => {
              userParams = params;
            }
          "
          @search="search"
        />
      </screen-item>
    </screen-wrapper>
    <ConversationTable
      v-loading="loading"
      :data="list"
      :isGroup="false"
      :index="(index) => (page.pageNum - 1) * page.pageSize + index + 1"
    />
    <custom-pagination
      :current-page="page.pageNum"
      :total="page.total"
      :pageSize="page.pageSize"
      @getCurrentPage="onCurrentPageChange"
      @getPerPage="onPageSizeChange"
    />
  </div>
</template>

<script>
import ConversationTable from "@/components/IM/ConversationTable.vue";
import FilterByTeachManager from "@/components/FilterItem/TeacherFilter/FilterByTeachManager";
// import FilterByTeacherKey from "@/components/FilterItem/TeacherFilter/FilterByTeacherKey";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";

import { getSingleChatList } from "@/api/im";

export default {
  components: {
    ConversationTable,
    FilterByTeachManager,
    // FilterByTeacherKey,
    FilterByUserAccount
  },
  data() {
    return {
      userParams:{},
      query: {
        timeRange: [], // 最近会话时间
        parentId: "", // 家长id
        tmUserId: "", // 教师管理人员
        teacherSearchType: "1", // 教师搜索类型
        teacher: "", // 教师搜索值
        teacherIdList: [], // 老师id列表，使用 hack 写法赋值
        teacherIdListSearchKey: "", //hack 搜索key，用来判断是否需要重新搜索
      },
      loading: false,
      list: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  computed: {
    labelWidth() {
      return this.$i18n.local == "en" ? 165 : 100;
    },
  },
  created() {
    this.getConversationList();
  },
  methods: {
    search() {
      this.page.pageNum = 1;
      this.getConversationList();
    },
    // 获取会话列表
    async getConversationList() {
      this.loading = true;
      // await this.hackSearch();
      const params = {
        parentUserId: this.query.parentId,
        // teacherUserIds: this.query.teacherIdList,
        page: this.page.pageNum,
        size: this.page.pageSize,
        tmUserId:this.query.tmUserId,
        ...this.userParams
      };
      const numberReg = /^\d+$/;
      if (
        [params.parentUserId, params.teacherUserId]
          .filter((p) => p)
          .some((p) => !numberReg.test(p))
      ) {
        const message =
          this.$i18n.locale === "zh"
            ? "请输入正确的家长ID或老师ID"
            : "Please enter the correct parent ID or teacher ID";
        this.$message.error(message);
        this.loading = false;
        return;
      }
      const timeRange = this.query.timeRange;
      if (timeRange && timeRange.length > 1) {
        params.startLastMessageTime = timeRange[0].getTime();
        params.endLastMessageTime = timeRange[1].getTime();
      }
      const data = await getSingleChatList(params);
      this.page.total = data.total;
      // 转换数据结构
      this.list = data.data;
      this.loading = false;
    },
    // 当前页码改变
    onCurrentPageChange(val) {
      this.page.pageNum = val;
      this.getConversationList();
    },
    // 每页展示数据条数改变
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.page.pageNum = 1;
      this.getConversationList();
    },
    // 因产品需求和服务端接口的客观条件，教师搜索的 hack 方案。根据 教管 和 老师 输入框的内容，调用接口获取教师id列表，然后再查询会话列表
    async hackSearch() {
      try {
        const { tmUserId, teacher, teacherSearchType } = this.query;
        console.log("hackSearch", this.query);
        console.log(`tmUserId: ${tmUserId}, teacher: ${teacher}, teacherSearchType: ${teacherSearchType}`);
        if (!tmUserId && !teacher) {
          this.query.teacherIdList = [];
          return;
        }
        const newKey = `${tmUserId}-${teacher}-${teacherSearchType}`;
        if (newKey === this.query.teacherIdListSearchKey) {
          return;
        }
        this.query.teacherIdListSearchKey = newKey;
        // = 2 表示是按老师id搜索
        const isSearchByTeacherId = teacherSearchType === "2" && teacher;
        // 如果是按老师id搜索，就无需再调用老师查询接口获取老师id
        if (isSearchByTeacherId) {
          this.query.teacherIdList = [teacher];
          return;
        }
        const params = {
          tmUserId,
          teacherUsername: teacher,
          businessLine: 1, // 中文业务线
          searchType: teacherSearchType,
        };
        const { status, data } = await this.$Api.tutorManagement.getTutorList(
          1,
          10000,
          params
        );
        if (status == 200 && data.code == 200) {
          const list = data.data.list;
          // 如果查询老师列表返回结果是 null，表示是无匹配数据，那么设置为 [0] 使 查询会话列表也无匹配数据；如果设置 [] ，查询会话列表接口会认为是查询所有
          this.query.teacherIdList = list ? list.map((item) => item.id) : [0];
        }
      } catch (error) {
        this.$message.error("教管和老师搜索条件失败");
        console.error("hackSearch error:", error);
      }
    },
  },
};
</script>
