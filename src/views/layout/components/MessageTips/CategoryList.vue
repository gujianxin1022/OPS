<template>
  <div class="category-list">
    <template v-if="messageList.length">
      <div v-for="(item, key) in messageList" :key="key" class="listItem">
        <div class="listItem-left" @click="handleClick(item)">
          <div class="listItem-title">
            <span>{{ getTitle(item) }}</span>
            <i>{{ DateTimeUtils.dateClockTime(item.createTime) }}</i>
          </div>
          <ul
            v-if="WECHAT_AND_DISTRIBUTION.includes(item.subCategory)"
            class="messageContent"
          >
            <li>
              <span>{{ $t("学员名称") }}</span
              >：
              <u v-if="[5002, 5003].includes(item.subCategory)">
                <span
                  class="mr15"
                  v-for="(studentItem, studentIdx) in item.detail
                    .studentObjList"
                  :key="studentItem.studentId"
                  @click="goStudentDetails(studentItem)"
                >
                  {{ studentItem.studentName
                  }}{{
                    studentIdx === item.detail.studentObjList.length - 1
                      ? ""
                      : "、"
                  }}
                </span>
              </u>
              <u @click="goStudentDetails(item.detail)" v-else>
                {{ item.detail.studentName }}
              </u>
            </li>
            <li>
              <span>{{ $t("家长账号") }}</span
              >：
              <u @click="goParentDetails(item.detail)">{{
                item.detail.parentName || item.detail.parentId
              }}</u>
            </li>
            <li>
              <span>{{ $t("消息提示中温馨提示") }}</span
              >：
              <u v-if="item.subCategory === 5002">{{
                $t("您已经删除了该家长的微信，微信绑定关系已经删除")
              }}</u>
              <u v-if="item.subCategory === 5003">{{
                $t("该家长已经删除了您的微信，微信绑定关系已经删除")
              }}</u>
              <u v-if="item.subCategory === 5000">{{
                $t(
                  "24小时后，该家长的微信帐号会和您企微帐号建立联系（如果家长不拒绝），请您注意联系"
                )
              }}</u>
              <u v-if="item.subCategory === 5001">{{
                $t("当前未获取家长的微信，请您及时绑定")
              }}</u>
            </li>
          </ul>
          <ul v-else-if="item.subCategory === 4013" class="messageContent">
            <li>
              <span>{{ $t("学生名字") }}</span
              >：<u>{{ item.detail.studentName }}</u>
            </li>
            <li>
              <span>{{ $t("家长账号") }}</span
              >：<u>{{ item.detail.parentAccount }}</u>
            </li>
            <li>
              <span>{{ $t("教师昵称") }}</span
              >：<u>{{ item.detail.teacherNickname }}</u>
            </li>
            <li>
              <span>{{ $t("课程时间") }}</span
              >：
              <u>{{
                item.detail.courseTime
                  ? `${DateTimeUtils.dateClockTime(
                      item.detail.courseTime
                    )} (${getUTCWeek(item.detail.courseTime)})`
                  : $t("内容无")
              }}</u>
            </li>
            <li>
              <span>{{ $t("消息提示中温馨提示") }}</span
              >：<u>{{ $t("请您及时联系学员重新预约课程，谢谢！") }}</u>
            </li>
          </ul>
          <ul
            v-else-if="LA_TYPE_CODE.includes(item.subCategory)"
            class="messageContent"
          >
            <template v-if="item.subCategory === 4015">
              <li>
                <span>{{ $t("messagetips 学生") }}</span
                >：<u>{{ item.detail.studentName }}</u>
              </li>
              <li>
                <span>{{ $t("messagetips 家长") }}</span
                >：<u>{{ item.detail.parentName }}</u>
              </li>
              <li>
                <span>{{ $t("messagetips 学管") }}</span
                >：<u>{{ item.detail.xgRealName }}</u>
              </li>
              <li>
                <span>{{ $t("messagetips 取消课节") }}</span
                >：
                <u>
                  {{
                    currentLang === "en"
                      ? item.detail.coursePackageNameEN
                      : item.detail.coursePackageNameZH
                  }}
                  （<span
                    v-for="(itm, index) in item.detail.timetableDesc"
                    :key="index"
                    >{{ itm }}</span
                  >） （GMT+08:00 Singapore）
                </u>
              </li>
              <li>
                <span>{{ $t("messagetips 取消原因") }}</span
                >：<u>{{
                  currentLang === "en"
                    ? item.detail.cancelReasonObj.en
                    : item.detail.cancelReasonObj.zh
                }}</u>
              </li>
            </template>
            <template v-if="item.subCategory === 3152">
              <li>
                <span>{{ $t("messagetips 学生") }}</span
                >：<u>{{ item.detail.studentName }}</u>
              </li>
              <li>
                <span>{{ $t("messagetips 家长") }}</span
                >：<u>{{ item.detail.parentName }}</u>
              </li>
              <li>
                <span>{{ $t("messagetips 学管") }}</span
                >：<u>{{ item.detail.learnAdvisorName }}</u>
              </li>
              <li>
                <span>{{ $t("messagetips 所购产品") }}</span
                >：
                <u>
                  {{
                    currentLang === "en"
                      ? item.detail.spuNameEn || $t("内容无")
                      : item.detail.spuNameCn || $t("内容无")
                  }}
                  -
                  {{ item.detail.skuAmount }}{{ $t("课时") }} -
                  {{
                    currentLang === "en"
                      ? item.detail.subscribeInfoEn || $t("内容无")
                      : item.detail.subscribeInfoCn || $t("内容无")
                  }}</u
                >
              </li>
              <li>
                <span>{{ $t("messagetips 账单日") }}</span
                >：<u
                  >{{
                    item.detail.billDate ? item.detail.billDate : $t("内容无")
                  }}（PDT Time）</u
                >
              </li>
            </template>
          </ul>
          <ul v-else-if="item.subCategory === 4014" class="messageContent">
            <li>
              <span>{{ $t("学生名字") }}</span
              >：<u>{{ item.detail.studentRealName }}</u>
            </li>
            <li @click="handleClick(item, 'enter')">
              <span>{{ $t("转入班级") }}</span
              >：<u>{{ item.detail.enterClassNameZh }}</u>
              <b v-if="item.detail.enterAgeLabel" class="form-tag language">{{
                Filters.ageLabelFilter(
                  item.detail.enterAgeLabel,
                  currentLang === "en"
                )
              }}</b>
              <b v-if="item.detail.enterLanguageLabel" class="form-tag age">{{
                Filters.languageLabelFilter(
                  item.detail.enterLanguageLabel,
                  currentLang === "en"
                )
              }}</b>
            </li>
            <li @click="handleClick(item, 'leave')">
              <span>{{ $t("转出班级") }}</span
              >：<u>{{ item.detail.leaveClassNameZh }}</u>
              <b v-if="item.detail.leaveAgeLabel" class="form-tag language">{{
                Filters.ageLabelFilter(
                  item.detail.leaveAgeLabel,
                  currentLang === "en"
                )
              }}</b>
              <b v-if="item.detail.leaveLanguageLabel" class="form-tag age">{{
                Filters.languageLabelFilter(
                  item.detail.leaveLanguageLabel,
                  currentLang === "en"
                )
              }}</b>
            </li>
            <li>
              <span>{{ $t("下节课时间") }}</span
              >：
              <u>{{
                DateTimeUtils.dateClockTime(item.detail.nextStartTime)
              }}</u>
            </li>
            <li>
              <u>{{ $t("请提醒家长留意新班级的上课时间~") }}</u>
            </li>
          </ul>
          <ul v-else class="messageContent">
            <li>
              <span v-if="item.subCategory !== 9999"
                >{{
                  GROUP_TYPE_CODE.includes(item.subCategory)
                    ? $t("班型名称")
                    : $t("班级名称")
                }}:</span
              >
              <u
                :style="{
                  maxWidth:
                    item.detail.languageLabel || item.detail.ageLabel
                      ? '46%'
                      : '',
                }"
              >
                {{ item.detail.classNameZh || item.detail.classtypeNameZh }}
              </u>
              <div class="tagBox">
                <b v-if="item.detail.languageLabel" class="form-tag language">{{
                  Filters.languageLabelFilter(
                    item.detail.languageLabel,
                    currentLang === "en"
                  )
                }}</b>
                <b v-if="item.detail.ageLabel" class="form-tag age">{{
                  item.detail.ageLabel | ageLabelFilter
                }}</b>
              </div>
            </li>
            <template v-if="item.subCategory === 4002">
              <li>
                <span>{{ $t("上课周期") }}</span
                >：<u
                  ><i v-for="(i, k) in item.detail.cycle" :key="k"
                    >{{ getWeek(i.week) }} {{ i.time }}；</i
                  ></u
                >
              </li>
              <li>
                <span>{{ $t("首课时间") }}</span
                >：
                <u
                  >{{
                    item.detail.startTime
                      ? DateTimeUtils.dateClockTime(item.detail.startTime)
                      : $t("内容无")
                  }}
                  {{
                    item.detail.startTime
                      ? `（${getUTCWeek(item.detail.startTime)}）`
                      : ""
                  }}</u
                >
              </li>
              <li>
                <span>{{ $t("首课进度") }}</span
                >：<u
                  >{{
                    currentLang == "en"
                      ? item.detail.courseEditionNameEn
                      : item.detail.courseEditionNameZh
                  }}
                  Level{{ item.detail.courseLevel }} Unit{{
                    item.detail.courseUnit
                  }}
                  Lesson{{ item.detail.courseLesson }}</u
                >
              </li>
            </template>
            <template
              v-if="item.subCategory === 4003 || item.subCategory === 4004"
            >
              <li>
                <span>{{ $t("老师姓名") }}</span
                >：<u>{{
                  currentLang == "en"
                    ? item.detail.tutorNameEn || $t("内容无")
                    : item.detail.tutorNameZh || $t("内容无")
                }}</u>
              </li>
            </template>
            <template v-if="item.subCategory === 4005">
              <li>
                <span>{{ $t("上课时间") }}</span
                >：<u>{{
                  item.detail.startTime
                    ? DateTimeUtils.dateClockTime(item.detail.startTime)
                    : $t("内容无")
                }}</u>
              </li>
              <li>
                <span>{{ $t("原老师") }}</span
                >：<u>{{
                  currentLang == "en"
                    ? item.detail.oldTutorNameEn || $t("内容无")
                    : item.detail.oldTutorNameZh || $t("内容无")
                }}</u>
              </li>
              <li>
                <span>{{ $t("消息提示中更换老师") }}</span
                >：<u>{{
                  currentLang == "en"
                    ? item.detail.newTutorNameEn || $t("内容无")
                    : item.detail.newTutorNameZh || $t("内容无")
                }}</u>
              </li>
            </template>
            <template v-if="item.subCategory === 4006">
              <li>
                <span>{{ $t("上课时间") }}</span
                >：
                <u
                  >{{
                    item.detail.startTime
                      ? DateTimeUtils.dateClockTime(item.detail.startTime)
                      : $t("内容无")
                  }}
                  {{
                    item.detail.startTime
                      ? `（${getUTCWeek(item.detail.startTime)}）`
                      : ""
                  }}</u
                >
              </li>
              <li>
                <span>{{ $t("原老师") }}</span
                >：<u>{{
                  currentLang == "en"
                    ? item.detail.oldTutorNameEn || $t("内容无")
                    : item.detail.oldTutorNameZh || $t("内容无")
                }}</u>
              </li>
              <li>
                <span>{{ $t("消息提示中更换老师") }}</span
                >：<u>{{
                  currentLang == "en"
                    ? item.detail.newTutorNameEn || $t("内容无")
                    : item.detail.newTutorNameZh || $t("内容无")
                }}</u>
              </li>
              <li>
                <span>{{ $t("学员姓名") }}</span
                >：<u>{{ item.detail.newStudents || $t("内容无") }}</u>
                <!-- <u><i v-for="(i, k) in item.detail.students" :key="k">{{i}}</i></u> -->
              </li>
              <li>
                <span>{{ $t("消息提示中温馨提示") }}</span
                >：<u>{{ $t("温馨提示内容1") }}</u>
              </li>
            </template>
            <template v-if="item.subCategory === 4007">
              <li>
                <span>{{ $t("上课时间") }}</span
                >：
                <u
                  >{{
                    item.detail.startTime
                      ? DateTimeUtils.dateClockTime(item.detail.startTime)
                      : $t("内容无")
                  }}
                  {{
                    item.detail.startTime
                      ? `（${getUTCWeek(item.detail.startTime)}）`
                      : ""
                  }}</u
                >
              </li>
              <li>
                <span>{{ $t("下节课程") }}</span
                >：
                <u>
                  {{
                    currentLang == "en"
                      ? item.detail.courseEditionNameEn
                      : item.detail.courseEditionNameZh
                  }}
                  Level{{ item.detail.courseLevel }} Unit{{
                    item.detail.courseUnit
                  }}
                  Lesson{{ item.detail.courseLesson }}
                </u>
              </li>
              <li>
                <span>{{ $t("新学员") }}</span
                >：<u
                  >{{ item.detail.studentRealName || $t("内容无") }}（{{
                    $t("学管")
                  }}: {{ item.detail.xgUserName || $t("内容无") }}）</u
                >
              </li>
            </template>
            <template v-if="item.subCategory === 4009">
              <li>
                <span>{{ $t("消息提示中温馨提示") }}</span
                >：<u>{{ $t("温馨提示内容2") }}</u>
              </li>
            </template>
            <template v-if="item.subCategory === 4010">
              <li>
                <span>{{ $t("消息提示中温馨提示") }}</span
                >：<u
                  >{{
                    currentLang == "en"
                      ? item.detail.tutorNameEn
                      : item.detail.tutorNameZh
                  }}{{ $t("温馨提示内容3") }}</u
                >
              </li>
            </template>
            <template v-if="item.subCategory === 4011">
              <li>
                <span>{{ $t("试听时间") }}</span
                >：
                <u
                  >{{
                    item.detail.startTime
                      ? DateTimeUtils.dateClockTime(item.detail.startTime)
                      : $t("内容无")
                  }}
                  {{
                    item.detail.startTime
                      ? `（${getUTCWeek(item.detail.startTime)}）`
                      : ""
                  }}</u
                >
              </li>
              <li>
                <span>{{ $t("消息提示中温馨提示") }}</span
                >：<u>{{
                  $t("温馨提示内容4").replace("$", item.detail.num)
                }}</u>
              </li>
            </template>
            <template v-if="item.subCategory === 4012">
              <li>
                <span>{{ $t("消息提示中温馨提示") }}</span
                >：<u>{{
                  $t("温馨提示内容4").replace("$", item.detail.num)
                }}</u>
              </li>
            </template>
            <template v-if="item.subCategory === 9999">
              <li>
                <div
                  :id="'message-content-' + key"
                  class="list-item-message-content"
                  v-html="getMessageLangContent(item.detail.content)"
                ></div>
              </li>
            </template>
          </ul>
        </div>
        <div class="listItem-right">
          <span
            class="tagState"
            :class="item.isRead === 1 ? 'unread' : 'read'"
            @click="readState(item)"
            >{{ item.isRead === 1 ? $t("未读") : $t("已读") }}</span
          >
        </div>
      </div>
      <div class="footer-title">
        <span
          v-if="!getListLoadding"
          style="cursor: pointer"
          @click="loadMore"
          >{{ seeMore ? $t("查看更多") : $t("暂无数据") }}</span
        >
        <span v-else>{{ $t("加载中") }}……</span>
      </div>
    </template>
    <div v-else class="noList">
      {{ getListLoadding ? `${$t("加载中")}……` : `${$t("暂无数据")}~` }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

const GROUP_TYPE_CODE = [4011, 4012];
const STUDENT_TYPE_CODE = [4013];
const LA_TYPE_CODE = [4015, 3152];
const MESSAGE_CENTER = [9999];
const WECHAT_AND_DISTRIBUTION = [5000, 5001, 5002, 5003];
export default {
  props: {
    // 通知类型
    businessTypeId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      WECHAT_AND_DISTRIBUTION,
      GROUP_TYPE_CODE,
      LA_TYPE_CODE,
      MESSAGE_CENTER,
      LA_TYPE_CODE: [4015, 3152],
      messageList: [],
      getListLoadding: false,
      pageNum: 1,
      pageSize: 30,
      seeMore: true,
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  methods: {
    fetchDataList() {
      this.getListLoadding = true;
      const data = {
        userId: this.userId,
        role: 5,
        category: 3,
        businessType: this.businessTypeId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      // 查询全部时，不要传递 businessType 参数
      if (this.businessTypeId === 0) {
        delete data.businessType;
      }
      return this.$Api.base
        .getMessageListByType(data)
        .then((res) => {
          const list = res.list;
          if (list.length === 0) {
            this.seeMore = false;
            return;
          }
          list.forEach((item) => {
            if (item.detail) {
              item.detail = JSON.parse(item.detail);
              if (item.detail.students) {
                item.detail.newStudents = item.detail.students.join("，");
              }
              if (item?.detail?.cancelReason) {
                // 后端返回一个中英文混合的字符串，没有标点作为区分，先提取中文，再用提取的中文分割字符串
                const zh = item.detail.cancelReason.replace(
                  /[^\u4E00-\u9FA5]/g,
                  ""
                );
                item.detail.cancelReasonObj = {
                  zh,
                  en: item.detail.cancelReason.split(zh)[0],
                };
              }
            }
          });
          this.messageList = [...this.messageList, ...list];
          if (data.pageNum === 1) {
            this.$emit("messageLoad", list, this.businessTypeId);
          }
          return list;
        })
        .finally(() => {
          this.getListLoadding = false;
        });
    },
    loadMore() {
      this.pageNum += 1;
      this.fetchDataList();
    },
    getTitle(item) {
      const val = item.subCategory;
      switch (val) {
        case 3152:
          return this.$t("请及时联系家长确认是否修改账单日或终止订阅");
        case 4002:
          return this.$t("新班级创建成功提醒");
        case 4003:
        case 4004:
          return this.$t("班级已排老师提醒");
        case 4005:
          return this.$t("班级更换老师提醒");
        case 4006:
          return this.$t("您有小班课已换老师");
        case 4007:
          return this.$t("您的班级有新学员加入");
        case 4009:
          return this.$t("班级续排课通知");
        case 4010:
          return this.$t("班级续排课失败通知");
        case 4011:
        case 4012:
          return this.$t("班型产能不足提醒");
        case 4013:
          return this.$t("预占课程过期提醒");
        case 4015:
          return this.$t("取消约课提示");
        case 9999:
          return this.getMessageLangTitle(item.detail.title);
        case 5002:
          return this.$t("您删除了家长微信");
        case 5003:
          return this.$t("家长删除了您微信");
        case 5000:
        case 5001:
          return this.$t("您的名下有新学员被分配");
        case 4014:
          return this.$t("转班成功通知");
      }
    },
    getMessageLangTitle(info) {
      try {
        const obj = JSON.parse(info);
        if (Object.prototype.toString.call(obj) === "[object Object]") {
          return this.currentLang === "en" ? obj.EN : obj.ZH;
        }
      } catch {
        return info;
      }
    },
    goStudentDetails(item) {
      const { href } = this.$router.resolve({
        name: "studentInfo",
        query: { studentId: item.studentId, studentName: item.studentName },
      });
      window.open(href, "_blank");
    },
    goParentDetails(item) {
      const { href } = this.$router.resolve({
        name: "parentInfo",
        query: { parentUserId: item.parentId },
      });
      window.open(href, "_blank");
    },
    // 获取日期对应周几
    getUTCWeek(utc) {
      const weekArr = [
        this.$t("周日"),
        this.$t("周一"),
        this.$t("周二"),
        this.$t("周三"),
        this.$t("周四"),
        this.$t("周五"),
        this.$t("周六"),
      ];
      return weekArr[new Date(utc).getDay()];
    },
    getWeek(val) {
      switch (val) {
        case 1:
          return this.$t("周一");
        case 2:
          return this.$t("周二");
        case 3:
          return this.$t("周三");
        case 4:
          return this.$t("周四");
        case 5:
          return this.$t("周五");
        case 6:
          return this.$t("周六");
        case 7:
          return this.$t("周日");
      }
    },
    // 跳转班级页面
    handleClick(item, type) {
      const STUDENT_TYPE_CODE = [4013];
      if (
        [
          ...WECHAT_AND_DISTRIBUTION,
          ...STUDENT_TYPE_CODE,
          ...LA_TYPE_CODE,
        ].includes(item.subCategory)
      )
        return;
      let address = "";
      if (GROUP_TYPE_CODE.includes(item.subCategory)) {
        address = this.$router.resolve({
          path: `/groupManagement/groupTypeDetail`,
          query: { groupTypeId: item.detail.classtypeId },
        });
      } else if (!MESSAGE_CENTER.includes(item.subCategory)) {
        let classId;
        if (item.subCategory === 4014 && (type === "enter" || !type)) {
          classId = item.detail.enterClassId;
        } else if (item.subCategory === 4014 && type === "leave") {
          classId = item.detail.leaveClassId;
        } else {
          classId = item.detail.classId;
        }
        address = this.$router.resolve({
          path: `/groupManagement/classInfo`,
          query: { id: classId, type: 2 },
        });
      } else {
        if (item.detail.intentUrl) {
          if(item.detail.intentUrl.includes('https')){
            window.open(item.detail.intentUrl, "__blank");
            return
          }
          address = this.$router.resolve({
            path: item.detail.intentUrl,
          });
        }
        if (item.detail.callbackUrl) {
          this.$Axios({
            method: "get",
            url: item.detail.callbackUrl,
          });
        }
      }
      if (address) {
        window.open(address.href, "_blank");
        this.readState(item);
      }
    },
    // 设置卡片状态（已读，未读）
    readState(item) {
      if (item.isRead === 1) {
        this.$Api.base
          .fixParentRemark(this.userId, item.id)
          .then(({ data }) => {
            if (data.code === 200) {
              this.$notify({
                showClose: true,
                message: data.message,
                type: "success",
              });
              item.isRead = 2;
              if (item.subCategory === 9999) {
                if (item.detail.callbackUrl) {
                  this.$Axios({
                    method: "get",
                    url: item.detail.callbackUrl,
                  });
                }
              }
            }
          });
      }
    },
    getMessageLangContent(info) {
      let content;
      try {
        const obj = JSON.parse(info);
        if (Object.prototype.toString.call(obj) === "[object Object]") {
          content = this.currentLang === "en" ? obj.EN : obj.ZH;
        }
      } catch {
        content = info;
      }
      let matchContent = content;
      const matchDate = matchContent.match(/\$(\d|\-|\s|:)+\$/g);
      if (matchDate) {
        matchContent = matchContent.replace(
          /\$(\d|\-|\s|:)+\$/g,
          function (matchStr, index, sourceStr) {
            const subArr = matchStr.slice(1, matchDate[0].length - 1);
            return moment.utc(subArr).local().format("YYYY-MM-DD HH:mm:ss");
          }
        );
      }
      return matchContent;
    },
    setAllRead() {
      this.messageList.forEach((item) => (item.isRead = 2));
    },
  },
  created() {
    this.fetchDataList();
  },
};
</script>

<style lang="scss" scoped>
i {
  font-style: normal;
}
.category-list {
  height: 100%;
  overflow: auto;
  padding: 0 20px;
  .listItem {
    display: flex;
    justify-content: space-between;
    padding: 20px 0 11px;
    border-bottom: 1px solid rgb(212, 212, 212);
    .listItem-left {
      flex: 1;
      margin-right: 10px;
      cursor: pointer;
      .listItem-title {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        & > span {
          font-size: 16px;
          font-weight: 500;
          margin-right: 5px;
        }
        & > i {
          font-size: 14px;
          color: #888;
        }
      }
      .messageContent {
        list-style: none;
        padding: 0;
        margin: 10px 0 0;
        li {
          color: #888;
          padding: 0 0 8px;
          display: flex;
          font-size: 14px;
          & > span {
            font-weight: 500;
          }
          & > u {
            text-decoration: none;
            max-width: 70%;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
          }
        }
      }
      .tagBox {
        margin: -1px 0 0;
      }
      .form-tag {
        // display: inline-block;
        font-size: 12px;
        font-weight: none;
        padding: 0 3px;
        height: 20px;
        line-height: 20px;
        border-radius: 5px;
        margin: 0 0 0 5px;
        &.language {
          background: #f4f5ff;
          color: #7581e5;
        }
        &.age {
          background: #f2ffff;
          color: #84d6d6;
        }
      }
    }
    .listItem-right {
      width: 50px;
      text-align: right;
      .tagState {
        display: inline-block;
        width: auto;
        min-width: 35px;
        height: 20px;
        line-height: 20px;
        color: #fff;
        font-size: 12px;
        text-align: center;
        border-radius: 5px;
        padding: 0 3px;
        cursor: pointer;
      }
      .unread {
        color: #ee382e;
        border: 1px solid #ee382e;
      }
      .read {
        color: #7581e5;
        border: 1px solid #7581e5;
      }
    }
  }
  .footer-title {
    text-align: center;
    padding: 20px 0;
    font-size: 14px;
    color: #888;
  }
  .noList {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #888;
    font-size: 18px;
    font-weight: 500;
  }
}
.list-item-message-content {
  word-break: break-all;
  ::v-deep img {
    width: 100% !important;
  }
}
</style>
