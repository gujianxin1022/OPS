<template>
  <div class="share-times-details-wrap">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="(shareData, key) in shareTableMap"
        :label="labelText(shareData.label, shareData.shareNumber)"
        :key="key"
        :name="shareData.name"
      >
        <el-table
          v-show="activeName === shareData.name"
          :data="currentMap.list"
          tooltip-effect="dark"
          :border="false"
          v-loading="loadingTable"
          style="width: 100%"
        >
          <el-table-column
            align="center"
            :label="$t('序号')"
            :width="currentLang == 'en' ? 110 : 50"
          >
            <template slot-scope="scope"
              >{{
                (currentMap.pageNum - 1) * currentMap.pageSize +
                scope.$index +
                1
              }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('操作时间')"
            :min-width="currentLang == 'en' ? 110 : 100"
            prop="createTime"
          >
            <template slot-scope="scope">
              <span>{{
                DateTimeUtils.dateClockTime(scope.row.createTime)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('剩余分享次数')"
            :min-width="currentLang == 'en' ? 125 : 100"
          >
            <template slot-scope="scope"
              >{{ scope.row.beforeCount + scope.row.changeDetail }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('原始分享次数')"
            :min-width="currentLang == 'en' ? 130 : 100"
            prop="beforeCount"
          >
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('修改明细')"
            :min-width="currentLang == 'en' ? 134 : 70"
          >
            <template slot-scope="scope"
              >{{
                scope.row.changeDetail > 0
                  ? `+${scope.row.changeDetail}`
                  : scope.row.changeDetail
              }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('修改原因')"
            :min-width="currentLang == 'en' ? 210 : 100"
            prop="reasonDetail"
          >
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('操作人员')"
            :min-width="currentLang == 'en' ? 110 : 100"
            prop="operatorName"
          >
          </el-table-column>
        </el-table>
        <custom-pagination
          :total="currentMap.total"
          :current-page="pageObj.pageNum"
          @getCurrentPage="getCurrentPage"
          @getPerPage="getPerPage"
          :pageSize="pageObj.pageSize"
          :pageSizes="[10, 20, 30, 50, 100]"
          v-if="currentMap.total"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Constants from "@/utils/constants";
import {
  reqShareChangeAllList,
  reqShareChangeCurrentDisciplinesList,
} from "@/api/studentManagement";
export default {
  data() {
    return {
      activeName: "",
      pageObj: {
        pageNum: 1,
        pageSize: 10,
      },
      subjectType: -1,
      parentUserId: "",
      loadingTable: true,
      shareTableMap: [],
    };
  },
  watch: {
    activeName(newData) {
      if (newData) {
        const obj = this.shareTableMap.find((item) => item.name == newData);
        const type = obj.subjectType;
        const value =
          newData === "all"
            ? -1
            : Number(obj.value) >= 0
            ? Number(obj.value)
            : -1;
        this.subjectType = type || value;
        this.getCurrentDisciplinesList();
      }
    },
    currentLang() {
      this.setShareTabMap();
      this.getAllList();
    },
  },
  computed: {
    ...mapGetters(["currentLang"]),
    currentMap() {
      const data = this.shareTableMap.find(
        (item) => item.name == this.activeName
      );
      return data?.data || {};
    },
  },
  created() {
    this.parentUserId = this.$route.query.parentUserId;
    this.setShareTabMap();
    // 初始化
    this.activeName = this.shareTableMap[0].name;
    this.getAllList();
  },
  methods: {
    setShareTabMap() {
      const subList = Constants.subjectListAll(this.currentLang, true);
      this.shareTableMap = subList.map((item, inx) => {
        return {
          ...item,
          data: {},
          name: this.$t(item.label, "en").toLocaleLowerCase(), // 获取制定英文的翻译作为name
        };
      });
    },
    labelText(label, num) {
      return `${label}(${num > 0 ? num : 0})`;
    },
    getAllList() {
      this.loadingTable = true;
      Promise.all([this.getMenuMap(), this.getDisciplinesList()]).then(
        ([menuMap, disciplinesMap]) => {
          this.loadingTable = false;
          if (disciplinesMap.list.length) {
            this.shareTableMap[0].data = { ...disciplinesMap };
          }
          this.shareTableMap[0].value = menuMap[0].subjectType;
          this.shareTableMap[0].shareNumber = menuMap[0].shareNumber;
          this.shareTableMap.map((item, inx) => {
            menuMap.map((menu) => {
              if (item.value === menu.subjectType) {
                Object.assign(item, menu);
              }
            });
          });
        }
      );
    },
    // 菜单
    getMenuMap() {
      this.loadingTable = true;
      return reqShareChangeAllList(this.parentUserId).then(({ data }) => {
        this.loadingTable = false;
        if (data.code == 200 && data.data) {
          const obj = data.data;
          const arr =
            obj.subjectShareNumberVoList.sort(
              (a, b) => a.subjectType - b.subjectType
            ) || [];
          arr.unshift({
            subjectType: -1,
            shareNumber: obj.totalShareNumber || 0,
          });
          return Promise.resolve(arr);
        } else {
          return Promise.resolve([]);
        }
      });
    },
    // 学科
    getDisciplinesList() {
      this.loadingTable = true;
      return reqShareChangeCurrentDisciplinesList(
        this.parentUserId,
        this.pageObj.pageNum,
        this.pageObj.pageSize,
        this.subjectType
      ).then(({ data }) => {
        this.loadingTable = false;
        if (data.code == 200 && data.data) {
          return Promise.resolve(data.data);
        } else {
          return Promise.resolve([]);
        }
      });
    },
    // 当前学科
    getCurrentDisciplinesList() {
      this.getDisciplinesList().then((res) => {
        if (this.shareTableMap.length) {
          const key = this.shareTableMap.findIndex(
            (item) => item.name == this.activeName
          );
          this.shareTableMap[key].data = { ...res };
        }
      });
    },
    getCurrentPage(page) {
      this.pageObj.pageNum = page;
      this.getCurrentDisciplinesList();
    },
    getPerPage(perPage) {
      this.pageObj.pageSize = perPage;
      this.getCurrentDisciplinesList();
    },
  },
};
</script>
<style lang="scss" scoped>
.share-times-details-wrap {
  position: relative;
}
</style>
