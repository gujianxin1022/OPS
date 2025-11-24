<template>
  <div class="assign-students-wrap">
    <el-dialog
      :before-close="close"
      :close-on-click-modal="false"
      title="分配学生"
      center
      top="5vh"
      :visible.sync="show"
    >
      <div v-if="studentIds && studentIds.length === 1">
        <div v-loading="loadingInfo">
          <p>
            {{ $t("居住地") }}:
            {{ XgDistributionRevisitTaskInfoResp.countryOfResidence }}
          </p>
          <p>
            {{ $t("时差") }}:
            {{
              getTimeDifference(
                XgDistributionRevisitTaskInfoResp.timeDifference
              )
            }}
          </p>
          <p>
            {{ $t("时区") }}:
            {{ XgDistributionRevisitTaskInfoResp.timeZone }}
          </p>
          <p>
            {{ $t("对学管是否有特殊语言要求") }}:
            {{
              $t(XgDistributionRevisitTaskInfoResp.specialLanguageDesc) || $t("无")
            }}
          </p>
          <p v-if="!XgDistributionRevisitTaskInfoResp.parentHaveXg">
            {{ $t("家长下已有学管") }}:<span>{{ $t("无") }}</span>
          </p>
        </div>
      </div>
      <FamilyLaList
        v-if="
          parentUserId !== -1 && XgDistributionRevisitTaskInfoResp.parentHaveXg
        "
        class="mb20"
        :parentUserId="parentUserId"
      />
      <el-button-group v-if="showButtons">
        <el-button
          :type="type === 'group' ? 'primary' : ''"
          @click="handleChangeType('group')"
          >{{ $t("分配到组") }}</el-button
        >
        <el-button
          :type="type === 'learn' ? 'primary' : ''"
          @click="handleChangeType('learn')"
          >{{ $t("分配到学管") }}</el-button
        >
      </el-button-group>
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        height="400px"
        v-loading="loading"
      >
        <el-table-column type="index"> </el-table-column>
        <el-table-column
          align="center"
          :label="type === 'group' ? $t('组名') : $t('学管')"
          :prop="type === 'group' ? 'nameZh' : 'username'"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('组长')"
          :prop="currentLang === 'en' ? 'leaderNameEn' : 'leaderNameZh'"
        ></el-table-column>
        <el-table-column align="center" :label="$t('操作')">
          <template slot-scope="scope">
            <el-button
              v-if="type === 'group'"
              type="text"
              @click="handleAssgin(scope.row, 'group')"
              >{{ $t("分配到该组") }}</el-button
            >
            <el-button
              v-else
              type="text"
              @click="handleAssgin(scope.row, 'learn')"
              >{{ $t("分配到学管") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { debounce /**防抖函数*/ } from "@/utils/handleData";
import FamilyLaList from "../../Task/components/familyLaList";
export default {
  components: { FamilyLaList },
  props: {
    parentUserId: {
      type: Number || String,
      default: -1,
    },
    studentIds: {
      type: Array,
      default: () => [],
    },
    show: {
      type: Boolean,
      default: false,
    },
    taskIds: {
      type: Array,
      default: () => [],
    },
    taskCode: {
      type: Number || String,
      default: -1,
    },
  },
  mounted() {
    this.getGourpData();
  },
  data() {
    return {
      hasLa: true,
      tableData: [],
      laOptions: [],
      orderKey: "",
      type: "group",
      copy: [],
      showButtons: true,
      loading: false,
      loadingInfo: false,
      XgDistributionRevisitTaskInfoResp: {},
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  watch: {
    show(newData) {
      if (newData) {
        this.type = "group";
        this.showButtons = true;
        this.getGourpData();
      }
    },
  },
  methods: {
    async getTaskInfo() {
      this.loadingInfo = true;
      const {
        status,
        data: { data, code },
      } = await this.$Api.task.getHandOverInfo(this.taskIds);
      const {
        countryOfResidence,
        specialLanguageDesc,
        parentHaveXg,
        timeDifference,
        timeZone,
      } = data;
      this.XgDistributionRevisitTaskInfoResp = {
        countryOfResidence,
        specialLanguageDesc,
        parentHaveXg,
        timeDifference,
        timeZone,
      };
      this.loadingInfo = false;
    },
    getTimeDifference(time) {
      if (!time) return this.$t("无时差");
      time += "";
      if (time === "0") return this.$t("无时差");
      const hour = parseInt(
        time.startsWith("-") ? time.substr(1) / 60 : time / 60
      );
      const minute = parseInt(
        time.startsWith("-") ? time.substr(1) % 60 : time % 60
      );
      const radioVal = time.startsWith("-") ? "-" : "+";
      return minute
        ? `${radioVal} ${hour}${this.$t("小时")}${minute}${this.$t("分钟")}`
        : `${radioVal} ${hour}${this.$t("小时")}`;
    },
    close() {
      this.$emit("close");
    },
    handleChangeType(type) {
      this.type = type;
      if (type === "group") {
        this.getGourpData();
      } else {
        this.getLaListData();
      }
    },
    handleAssgin: debounce(function (scopeRow, typeName) {
      this.handleAssgin1(scopeRow, typeName);
    }, 1000),
    handleAssgin1(scopeRow, typeName) {
      let { leaderId, id } = scopeRow;
      let resultArr = [];
      this.studentIds.forEach((item, index) => {
        switch (typeName) {
          case "group":
            resultArr.push({
              studentUserId: item,
              taskId: this.taskIds[index],
              toUserId: leaderId,
              xgStatus: 1,
            });
            break;
          case "learn":
            resultArr.push({
              studentUserId: item,
              taskId: this.taskIds[index],
              toUserId: id,
              xgStatus: 0,
            });
            break;
          default:
            break;
        }
      });
      this.$Api.learnManager
        .insertDistributionXg(resultArr)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({ message: this.$t("操作成功"), type: "success" });
            this.close();
            this.$emit("refreshPage");
          }
        });
    },
    async getLaListData() {
      this.loading = true;
      const {
        status,
        data: { code, data },
      } = await this.$Api.workBench.getLALists();
      if (status !== 200 || code !== 200) return Promise.reject();
      this.tableData = data;
      this.loading = false;
    },
    async getGourpData() {
      this.loading = true;
      const {
        status,
        data: { code, data },
      } = await this.$Api.workBench.getLAPostLists();
      if (status !== 200 || code !== 200) return Promise.reject();
      this.tableData = data;
      this.loading = false;
    },
  },
  created() {
    if (this.studentIds?.length === 1) {
      this.getTaskInfo();
    }
  },
};
</script>
