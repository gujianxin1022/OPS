 <template>
  <div>
    <div>
      <p style="color: #606266; font-weight: 700">
        {{ $t("家长下已有学管") }}：
      </p>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      :empty-text="$t('当前无学管')"
      v-loading="loading"
    >
      <el-table-column
        prop="studentRealName"
        :label="$t('学生')"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="courseZh"
        :label="$t('进度')"
        min-width="180"
      >
        <template slot-scope="scope">
          {{ currentLang === "en" ? scope.row.courseEn : scope.row.courseZh }}
        </template>
      </el-table-column>
      <el-table-column
        prop="xgUserName"
        :label="$t('学管')"
      > </el-table-column>
      <el-table-column
        prop="parentPostNameZh"
        :label="$t('学管部门')"
      >
        <template slot-scope="scope">
          <span
            v-if="currentLang === 'zh'">{{ scope.row.parentPostNameZh }}/{{ scope.row.postNameZh }}</span>
          <span
            v-else>{{ scope.row.parentPostNameEh }}/{{ scope.row.postNameEh }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

  <script>
import { mapGetters } from "vuex";

export default {
  name: "familyLaList" /* 家庭学管列表 */,
  props: ["parentUserId"],
  data () {
    return {
      tableData: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  async mounted () {
    this.loading = true;
    try {
      const {
        status,
        data: { code, data },
      } = await this.$Api.task.getFamilyLAList(this.parentUserId);
      if (status !== 200 && code !== 200) return Promise.reject();
      this.tableData = data || [];
      if (!this.tableData.length) emit('handleEmpty')
    } finally {
      this.loading = false;
    }
  },
  methods: {},
};
</script>