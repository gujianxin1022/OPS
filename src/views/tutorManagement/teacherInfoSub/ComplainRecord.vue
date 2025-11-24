<template>
    <div class="examine-time-line-wrap">
      <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
        <screen-item label="" labelWidth="0">
          <el-date-picker v-model="query.timeRange" type="datetimerange" :start-placeholder="$t('开始时间')"
          :end-placeholder="$t('结束时间')" size="small" :default-time="['00:00:00', '23:59:59']" />
        </screen-item>
        <screen-item :label="$t('操作人')" :labelWidth="labelWidth">
          <el-input v-model="query.operatorName" clearable />
        </screen-item>
        <screen-item :label="$t('课堂ID')" :labelWidth="labelWidth">
          <el-input v-model="query.classId" clearable />
        </screen-item>
      </screen-wrapper>
      <BasicTable 
        v-loading="tableState.loading"
        border
        :column="columns"
        :data="tableState.data"
        :pagination="true"
        :limit="paginationState.limit"
        :page="paginationState.page"
        :total="paginationState.total"
        @pagination-change="handlePaginationChange"
       />
    </div>
  </template>
  <script>
  import BasicTable from "@/components/table/basic-table/table.vue";
  export default {
    data() {
      return {
        query: {
          timeRange: [],
          operatorName: "",
          classId: "",
        },
        reasonList: [
            { value: '1', label: this.$t('教学背景不合适') },
            { value: '2', label: this.$t('教室灯光不合适') },
            { value: '3', label: this.$t('网络不稳定') },
            { value: '4', label: this.$t('教师声音（麦克风）问题') },
            { value: '5', label: this.$t('教师耳机问题') },
            { value: '6', label: this.$t('沟通态度不好') },
            { value: '7', label: this.$t('上课分心') },
            { value: '8', label: this.$t('备课不充分') },
            { value: '9', label: this.$t('上课困倦') },
            { value: '10', label: this.$t('上课敷衍') },
            { value: '11', label: this.$t('其他') },
        ],
        tableState: {
          loading: false,
          data: [],
        },
        paginationState: {
          limit: 10,
          page: 1,
          total: 0,
        },
      };
    },
    computed: {
      columns() {
        const { page, limit } = this.paginationState;
        return [
            {
                label: this.$t("序号"),
                render: (h, { $index }) => (page - 1) * limit + $index + 1,
            },
            {
                label: this.$t("操作人"),
                prop: "createUserName",
            },
            {
                label: this.$t("课堂ID"),
                prop: "virtualclassId",
            },
            {
                label: this.$t("投诉状态"),
                prop: "type",
                render: (h, { row }) => {
                    return row.type === 2 ? this.$t("撤销投诉") : this.$t("投诉");
                },
            },
            {
                label: this.$t("原因"),
                render: (h, { row }) => {
                    const reason = row.reason?.split(',') || [];
                    return row.type === 2 ? row.amendReason : reason.map(item => this.reasonList.find(ite => ite.value === item)?.label).join(','); 
                },
            },
            {
                label: this.$t("备注"),
                prop: "remark",
                showOverflowTooltip: true
            },
        
        ];
      },
    },
    components: {
      BasicTable,
    },
    methods: {
      search() {
        const params = {
          current: this.paginationState.page,
          size: this.paginationState.limit,
          object:{
            tutorUserId: this.$route.query.id,
            operatorName: this.query.operatorName || undefined,
            virtualclassId: this.query.classId || undefined,
            startTime: this.query.timeRange?.[0] || undefined,
            endTime: this.query.timeRange?.[1] || undefined,
          }
        };
        this.tableState.loading = true;
        this.$Api.tutorManagement
          .getTutorComplainRecord(params)
          .then(( data ) => {
              this.tableState.data = data.list;
              this.paginationState.total = data.total;
          }).finally(() => {
            this.tableState.loading = false;
          });
      },
      handlePaginationChange(page) {
        this.paginationState.page = page;
        this.search();
      },
    },
    created() {
      this.search();
    },
  };
  </script>
  <style lang="scss" scoped>
  .examine-time-line-wrap {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  </style>
  