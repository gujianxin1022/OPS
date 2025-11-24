<template>
  <div class="follow-up-drawer-wrap">
    <div class="top-title-wrap">
      <span>{{ $t("添加跟进记录") }}</span>
      <i
        class="el-icon-close"
        @click="$emit('close')"
      ></i>
    </div>
    <div class="follow-up-drawer-content-wrap">
      <div v-if="!changeFollowType">
        <div v-if="dataList !== null">
          <div
            v-for="(item, index) in dataList"
            :key="index"
            class="follow-up-record-item"
          >
            <div class="top-info">
              <el-tag
                type="success"
                v-if="item.sopTaskType"
              >{{
                currentLang === "en"
                  ? item.sopTaskType.nameEn
                  : item.sopTaskType.nameCn
              }}</el-tag>
              <template
                v-if="item.sopTaskType && item.sopTaskType.code == '102101'"
              >
                <el-popover
                  v-if="item.unitReportStatus == 0"
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  content="单元报告未提交"
                  class="popover-btn"
                >
                  <el-button
                    slot="reference"
                    type="text"
                  >
                    {{ $t("单元报告") }}</el-button>
                </el-popover>
                <template v-else>
                  <el-button
                    class="report-link"
                    v-if="item.unitReportStatus == 3 || item.unitReportStatus == 4"
                    type="text"
                    @click="topath(item.unitReportId,1)"
                  >{{
                      $t("单元报告")
                    }}</el-button>
                  <el-button
                    class="report-link"
                    v-if="item.unitReportStatus == 2"
                    type="text"
                    @click="topath(item.unitReportId,2)"
                  >{{
                      $t("单元报告")
                    }}</el-button>
                  <el-button
                    class="report-link"
                    type="text"
                    v-if="item.unitReportStatus == 1"
                    @click="topath(item.unitReportId,3)"
                  >{{
                      $t("单元报告")
                    }}</el-button>
                </template>
              </template>
              <CountDown
                v-if="item.ss"
                :remainTime="item.ss * 1"
              ></CountDown>
            </div>
            <div class="mt10">
              <el-input
                type="textarea"
                :placeholder="$t('请输入内容')"
                v-model="item.content"
                rows="8"
                show-word-limit
              ></el-input>
            </div>
            <el-divider v-if="index !== dataList.length - 1"><i
                class="el-icon-tickets"
              ></i></el-divider>
          </div>
        </div>
        <div v-else>{{ $t("无数据") }}</div>
      </div>
      <div v-else>
        <div class="follow-up-record-item">
          <div class="top-info">
            <el-tag type="success">{{ $t("自发跟进") }}</el-tag>
          </div>
          <div class="mt10">
            <el-input
              type="textarea"
              :placeholder="$t('请输入内容')"
              v-model="dataList[0].content"
              rows="8"
              show-word-limit
            ></el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="follow-up-drawer-bottom-wrap">
      <el-button @click="$emit('close')">{{ $t("取消") }}</el-button>
      <el-button
        type="primary"
        @click="handleAddFollowRecord"
      >{{
        $t("添加跟进记录")
      }}</el-button>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import { JudgeNewAndOld } from '@/api/unitReportManagement/'
import CountDown from "../../../components/CountDown";
import { mapGetters } from "vuex";

export default {
  components: {
    CountDown,
  },
  props: {
    changeFollowType: {
      type: Boolean,
      default: false,
    },
    studentId: {
      type: String || Number,
      default: "-1",
    },
    planId: {
      type: String || Number,
      default: "-1",
    }
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  watch: {
    changeFollowType (newData) {
      if (newData) {
        this.dataList = [];
        this.dataList.push({ content: "", studentId: this.studentId });
      }
    },
  },
  data () {
    return {
      word: "",
      tipsActiveNames: ["1"],
      textarea: "",
      dataList: [{}],
      unitReportId: "",
      taskCode: "", //102101->单元回访  104101->首课回访
    };
  },
  methods: {
    ...mapMutations(["END_TASK"]),
    async topath (id, val) {
      let { status, data: { code, data } } = await JudgeNewAndOld(id)
      if (status !== 200 && code !== 200) return Promise.reject()
      switch (val) {
        case 1:
          this.$router.push({
            path: `/reportManagement/auditSuccessed`,
            query: {
              reportId: id,
              version: data
            }
          })
          break;
        case 2:
          this.$router.push({
            path: `/reportManagement/auditFailed`,
            query: {
              reportId: id,
              version: data
            }
          })
          break;
        case 3:
          this.$router.push({
            path: `/reportManagement/audited`,
            query: {
              reportId: id,
              version: data
            }
          })
          break;
        default:
          break;
      }
    },
    close () {
      this.$eventBus.$emit("doGetPls", 12);
      this.dataList = [{ content: "", studentId: this.$route.query.studentId }];
      this.$emit("close");
    },
    handleAddFollowRecord () {
      if (this.changeFollowType) {
        //自发跟进
        let param = {
          studentId: this.dataList[0].studentId,
          doTaskParam: JSON.stringify({
            notes: this.dataList[0].content,
          }),
          studentLearningPlanId: this.planId
        };

        this.$Api.studentManagement
          .addStudentTaskByMyself(param)
          .then(({ status, data }) => {
            if (status == 200 && data.code == 200) {
              this.$notify({ type: "success", message: this.$t("操作成功") });
              this.close();
            }
          });
      } else {
        //系统跟进
        // let resultArr = [];
        // this.dataList.forEach((item) => {
        //   if (!item.content.match(/^[ ]*$/)) {
        //     resultArr.push({
        //       taskId: item.id,
        //       content: item.content,
        //     });
        //   }
        // });
        // let flag = resultArr.every((item) => item.content.trim() === "");
        // if (flag) {
        //   this.$notify({
        //     type: "warning",
        //     message: "至少填写一项",
        //   });
        //   return;
        // }
        // this.$Api.studentManagement
        //   .addStudentTasks(resultArr)
        //   .then(({ status, data }) => {
        //     if (status == 200 && data.code == 200) {
        //       this.$notify({ type: "success", message: this.$t("操作成功") });
        //       resultArr.forEach((item) => {
        //         let flag = this.dataList.find((ite) => ite.id === item.taskId),
        //           flagIndex = this.dataList.findIndex(
        //             (ite) => ite.id === item.taskId
        //           );
        //         let mutationsParams = {
        //           taskCode: flag.sopTaskType.code,
        //           taskId: item.taskId,
        //           studentId: this.studentId,
        //         };
        //         this.dataList.splice(flagIndex, 1);
        //         // this.END_TASK(mutationsParams);
        //       });
        //       this.close();
        //     }
        //   });
      }
    },
    sortTask (arr, key) {
      let targetItem = null;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == key) {
          targetItem = arr.splice(i, 1);
          break;
        }
      }
      arr.unshift(targetItem[0]);
      return arr;
    },
    getDataList () {
      this.$Api.studentManagement
        .getStudentTask(this.studentId || this.$route.query.studentId)
        .then(({ status, data }) => {
          let now = +new Date();
          if (status == 200 && data.code == 200 && data.data !== null) {
            this.dataList = data.data;
            this.dataList.forEach((item) => {
              this.$set(item, "content", "");
              item.ss = Math.floor(
                (new Date(item.timeToComplete).getTime() - now) / 1000
              );
            });
            this.dataList = this.sortTask(
              this.dataList,
              this.$route.query.taskId
            );
          }
        });
    },
  },
  created () {
    this.taskCode = this.$route.query?.taskCode ?? "";
    if (this.$route.query.followCode) {
      this.getDataList();
    }
  },
};
</script>
<style lang="scss" scoped>
.el-collapse,
.el-collapse-item__wrap {
  border: none !important;
}

.el-collapse-item ::v-deep .el-collapse-item__content {
  padding: 0;
}

.el-collapse-item ::v-deep .el-collapse-item__wrap {
  border: none;
}

.el-collapse-item,
.el-collapse-item__header {
  border: none;
}

.top-info {
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding-right: 10px;
}

.follow-up-drawer-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .top-title-wrap {
    width: 100%;
    font-size: 20px;
    font-weight: bold;
    box-sizing: border-box;
    padding-left: 10px;
    color: #666;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #f2f2f2;
    position: relative;

    > i {
      cursor: pointer;
      font-size: 16px;
      position: absolute;
      right: 4px;
      top: 15px;
    }
  }

  .follow-up-drawer-content-wrap {
    width: 100%;
    flex: 1;
    overflow: auto;

    .follow-up-record-item {
      box-sizing: border-box;
      padding: 10px 15px;
      .report-link {
        margin-top: -5px;
      }
    }
  }

  .follow-up-drawer-bottom-wrap {
    width: 100%;
    height: 60px;
    border-top: 1px solid #f2f2f2;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

//::-webkit-scrollbar {
//  width: 4px;
//  height: 4px;
//}
//
///* Track */
//::-webkit-scrollbar-track {
//  background: rgb(255, 255, 255);
//  border-radius: 8px;
//}
//
///* Handle */
//::-webkit-scrollbar-thumb {
//  background: rgb(201, 201, 202);
//  border-radius: 8px;
//}
//
///* Handle on hover */
//::-webkit-scrollbar-thumb:hover {
//  background: rgb(162, 162, 163);
//}
</style>
<style lang='scss'>
.follow-up-drawer-wrap {
  .popover-btn {
    .el-button--text {
      color: #333;
    }
  }
}
</style>
