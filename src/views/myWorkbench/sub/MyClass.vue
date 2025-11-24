<template>
  <div class="my-class-wrap">
    <!-- 下拉 -->
    <div
      class="top-selsect mb10"
      v-if="Per.handleButtonPer('teach.myWorkbench.myclass.wbmyClassTimeScope')"
    >
      <CommonTree
        @get_seleParams="get_seleParams"
        isShowLACCSelect="true"
        :hasLAPermission="
          Per.handleButtonPer('teach.myWorkbench.myclass.filterByLA')
        "
        :hasCCPermission="
          Per.handleButtonPer('teach.myWorkbench.myclass.filterByCC')
        "
        :hasTeachTubePermission="
          Per.handleButtonPer('teach.myWorkbench.myclass.filterByTeachTube')
        "
      ></CommonTree>
    </div>
    <!-- 班级分类tab -->
    <div class="class-classify">
      <el-tabs v-model="activeClass" type="card" @tab-click="handleClick">
        <el-tab-pane :label="labelOne" name="first"></el-tab-pane>
        <el-tab-pane :label="labelSmall" name="second"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="my-class-search-wrap">
      <el-radio-group
        v-if="
          Per.handleButtonPer('teach.myWorkbench.myclass.wbmyClassTimePick')
        "
        style="display: inline-block"
        class="time-buttons"
        v-model="dateType"
        @change="changeRadion"
      >
        <el-radio-button label="-7">{{
          $t("my-home-In The Past 7 Days")
        }}</el-radio-button>
        <el-radio-button label="-1">{{
          $t("my-home-Yesterday")
        }}</el-radio-button>
        <el-radio-button label="0">{{ $t("my-home-Today") }}</el-radio-button>
        <el-radio-button label="1">{{
          $t("my-home-Tomorrow")
        }}</el-radio-button>
        <el-radio-button label="7">{{
          $t("my-home-The Next 7 Days")
        }}</el-radio-button>
      </el-radio-group>
      <el-date-picker
        style="width: 230px; marginbottom: 10px"
        unlink-panels
        v-model="applyDate"
        type="daterange"
        value-format="yyyy-MM-dd"
        :start-placeholder="$t('开始日期')"
        :end-placeholder="$t('结束日期')"
        size="small"
        :default-time="['00:00:00', '23:59:59']"
        @change="timeChange"
      />
      <el-select
        class="select"
        v-model="selectValue"
        :placeholder="$t('请选择')"
        v-if="
          Per.handleButtonPer('teach.myWorkbench.myclass.wbmyClassStatusSelect')
        "
      >
        <el-option
          v-for="item in selectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <span class="filter-item-box">
        <el-input
          clearable
          v-model="studentUserName"
          :placeholder="$t('请输入学生名字')"
        ></el-input>
      </span>
      <span
        class="filter-item-box"
        style="display: inline-block; width: 412px; margin-bottom: 15px"
      >
        <span>
          <FilterByUserAccount
          @change="
            (params) => {
              userParams = params;
            }
          "
          @search="search"
        />
        </span>
        
      </span>
      <!-- 课程类型 -->
      <span>
        <span class="search—title">{{ $t("课程类型") }}</span>
        <el-select v-model="courseType" :placeholder="$t('请选择')">
          <el-option
            v-for="item in newCourseOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </span>
      <span class="select-reson-wrap" v-show="selectValue == 4">
        <span class="search—title">{{ $t("异常结束原因") }}</span>
        <el-select
          class="select"
          v-model="selectValueReason"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in reasonOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </span>
      <el-button type="primary" @click="search">{{ $t("查询") }}</el-button>
    </div>
    <div class="my-class-table-wrap">
      <el-table
        :border="false"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang == 'en' ? 110 : 50"
        >
          <template slot-scope="scope"
            >{{
              (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          :label="$t('上课时间')"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          :label="$t('my-home-Class Name')"
          width="120"
          v-if="isShowClass"
        >
          <template slot-scope="scope">
            <el-button
              @click="goGroupDetail(scope.row)"
              v-if="scope.row.classId"
              type="text"
              >{{ scope.row.classNameZh }}
            </el-button>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          :min-width="300"
          :label="$t('my-home-Students')"
        >
          <template slot-scope="scope">
            <p
              v-for="(item, index) in scope.row.classroomClassMemberInfoList"
              :key="item.studentRealName + index"
            >
              <el-button
                @click="
                  goStudentDetail(item.studentUserId, item.studentRealName)
                "
                type="text"
                >{{ item.studentRealName }}
              </el-button>
              <template v-if="selectValue == 2">
                <el-tag
                  type="success"
                  v-if="item.virtualStudentStatus == '3'"
                  >{{ $t("已到") }}</el-tag
                >
                <el-tag type="danger" v-if="item.virtualStudentStatus == '1'">{{
                  $t("未到")
                }}</el-tag>
              </template>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('课程进度')"
          prop="lessonDescription"
          width="200"
        >
          <template slot-scope="scope">
            {{
              currentLang === "en"
                ? scope.row.courseProgressEn
                : scope.row.courseProgressZh
            }}
          </template>
        </el-table-column>
        <!-- 课程类型 -->
        <el-table-column align="center" :label="$t('课程类型')">
          <template slot-scope="scope">
            <p>
              {{ setCourseTypeContent(scope.row.courseType) }}
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('教师ID')" width="180">
          <template slot-scope="scope">
            <router-link
              target="_blank"
              :to="{
                path: `/tutorManagement/teacherInfo?id=${scope.row.tutorUserId}&teacherName=${scope.row.tutorRealName}`,
              }"
            >
              <el-button type="text">{{ scope.row.tutorUserId }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('教师')"
          prop="tutorRealName"
          :min-width="300"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="goTutorDetail(scope.row)">{{
              scope.row.tutorRealName
            }}</el-button>
            <template v-if="selectValue == 2">
              <el-tag
                type="success"
                v-if="scope.row.virtualTeacherStatus == '3'"
                >{{ $t("上课中") }}</el-tag
              >
              <el-tag
                type="danger"
                v-if="scope.row.virtualTeacherStatus == '1'"
                >{{ $t("未到") }}</el-tag
              >
              <el-tag
                type="warning"
                v-if="scope.row.virtualTeacherStatus == '2'"
                >{{ $t("已到未上课") }}</el-tag
              >
            </template>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('上课平台')"
          prop="name"
          :width="currentLang == 'en' ? 110 : 100"
        >
          <template slot-scope="scope">
            <span>{{
              Filters.virtualclassType(
                scope.row.virtualclassTypeId,
                currentLang
              )
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('房间号')"
          :width="150"
          prop="roomId"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('课程顾问')"
          :width="currentLang == 'en' ? 140 : 120"
        >
          <template slot-scope="scope">
            <span
              v-for="(item, index) in scope.row.classroomClassMemberInfoList"
              :key="item.studentUserId + index"
            >
              {{ item.adviserUserName ? item.adviserUserName : "--" }}
              <span
                v-if="
                  index !== scope.row.classroomClassMemberInfoList.length - 1
                "
                >,</span
              >
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('学管老师')" width="120">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in scope.row.classroomClassMemberInfoList"
              :key="item.studentUserId + index + '' + index"
            >
              {{ item.xgUserName ? item.xgUserName : "--" }}
              <span
                v-if="
                  index !== scope.row.classroomClassMemberInfoList.length - 1
                "
                >,</span
              >
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :width="currentLang == 'en' ? '140px' : '100px'"
          align="center"
          :label="$t('my-home-Abnormal Reason')"
          v-if="dateType <= 0"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.reason == 0 && scope.row.status == 4">{{
              $t("老师未反馈")
            }}</span>
            <span v-else>{{ scope.row.reason | abnormalFinishedResult }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('是否修正')"
          prop="name"
          width="120"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.status === 1 || scope.row.status === 2">
              --
            </template>
            <template v-else>
              <span v-if="currentLang === 'zh'">{{
                scope.row.xgCorrectStatus == 1 ? "是" : "否"
              }}</span>
              <span v-else>{{
                scope.row.xgCorrectStatus == 1 ? "yes" : "no"
              }}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('操作')"
          fixed="right"
          width="140"
        >
          <template slot-scope="scope">
            <template
              v-if="
                Per.handleButtonPer('teach.myWorkbench.myclass.correctionFee')
              "
            >
              <span
                v-if="scope.row.status === 1 || scope.row.status === 2"
                class="disable-first-class fix-icon"
                :style="{
                  width: currentLang == 'en' ? '33px' : '20px',
                  height: currentLang == 'en' ? '33px' : '20px',
                  lineHeight: currentLang == 'en' ? '33px' : '',
                }"
                ><span
                  class="fix-icon"
                  style="display: block"
                  :style="{ fontSize: currentLang == 'en' ? '6px' : '14px' }"
                  >{{ $t("修") }}</span
                ></span
              >
              <el-tooltip
                v-else
                class="item"
                effect="dark"
                :content="$t('修正费用')"
                placement="top"
              >
                <span
                  class="column-button fist-class fix-icon"
                  :style="{
                    width: currentLang == 'en' ? '40px' : '20px',
                    height: currentLang == 'en' ? '40px' : '20px',
                    lineHeight: currentLang == 'en' ? '40px' : '20px',
                  }"
                  ><span
                    class="fix-icon"
                    style="display: block"
                    :style="{ fontSize: currentLang == 'en' ? '10px' : '14px' }"
                    @click="goToAlterCost(scope.row)"
                    >{{ $t("修") }}</span
                  ></span
                >
              </el-tooltip>
            </template>

            <el-tooltip
              v-if="
                scope.row.status == 1 ||
                (scope.row.status == 2 &&
                  Per.handleButtonPer(
                    'teach.myWorkbench.myclass.wbmyClassConversionBtn'
                  ))
              "
              class="item"
              effect="dark"
              :content="$t('my-home-Transfer Classroom')"
              placement="top"
            >
              <span
                @click="batchConversion(scope.row)"
                class="column-button iconfont-ali icon-qiehuandikuai"
              ></span>
            </el-tooltip>
            <el-tooltip
              v-if="
                scope.row.status == 1 &&
                Per.handleButtonPer(
                  'teach.myWorkbench.myclass.wbmyClassSubstituteBtn'
                )
              "
              class="item"
              effect="dark"
              :content="$t('my-home-Arrange Substitute Teacher')"
              placement="top"
            >
              <span
                @click="clickHandlerSubstitute(scope.row)"
                class="column-button iconfont-ali icon-5"
              ></span>
            </el-tooltip>
            <el-tooltip
              v-if="
                scope.row.status == 2 &&
                scope.row.virtualclassTypeId !== 2 &&
                Per.handleButtonPer(
                  'teach.myWorkbench.myclass.wbmyClassWatchClassBtn'
                )
              "
              class="item"
              effect="dark"
              :content="$t('my-home-Inspection')"
              placement="top"
            >
              <span
                @click="handlerTourClassRoom(scope.row)"
                class="column-button iconfont-ali icon-jiandu"
              ></span>
            </el-tooltip>
            <el-tooltip
              v-if="
                scope.row.visitStatus == 1 &&
                Per.handleButtonPer(
                  'teach.myWorkbench.myclass.wbmyClassHelpClassBtn'
                )
              "
              class="item"
              effect="dark"
              :content="$t('my-home-Assistant')"
              placement="top"
            >
              <span
                @click="clickHandlerMonitor(scope.row)"
                class="column-button iconfont-ali icon-yuanchengxiezhu"
              ></span>
            </el-tooltip>
            <el-tooltip
              v-if="
                scope.row.status == 3 &&
                Per.handleButtonPer(
                  'teach.myWorkbench.myclass.wbmyClassTeacherCommentBtn'
                )
              "
              class="item"
              effect="dark"
              :content="$t('my-home-Teacher Feedback')"
              placement="top"
            >
              <span
                @click="
                  clickHandlerComment(
                    scope.row.virtualClassId,
                    'Student',
                    scope.row
                  )
                "
                class="column-button iconfont-ali icon-laoshi"
              ></span>
            </el-tooltip>
            <el-tooltip
              v-if="
                scope.row.status == 3 &&
                Per.handleButtonPer(
                  'teach.myWorkbench.myclass.wbmyClassStudentCommentBtn'
                )
              "
              class="item"
              effect="dark"
              :content="$t('my-home-Student Feedback')"
              placement="top"
            >
              <span
                @click="
                  clickHandlerComment(
                    scope.row.virtualClassId,
                    'Tutor',
                    scope.row
                  )
                "
                class="column-button iconfont-ali icon-yewutubiao_xueshengchaxun"
              ></span>
            </el-tooltip>
            <el-tooltip
              v-if="
                scope.row.status == 3 ||
                (scope.row.status == 4 &&
                  Per.handleButtonPer(
                    'teach.myWorkbench.myclass.wbmyClassClassPlayBtn'
                  ))
              "
              class="item"
              effect="dark"
              :content="$t('课堂回放')"
              placement="top"
            >
              <span
                @click="
                  clickHandlerPlayback(
                    scope.row.virtualClassId,
                    scope.row.classTypeId
                  )
                "
                class="column-button iconfont-ali icon-zhibohuifang"
              ></span>
            </el-tooltip>
            <el-tooltip
              v-if="
                scope.row.classTypeId == 1 &&
                scope.row.classroomClassMemberInfoList[0].firstReportId &&
                Per.handleButtonPer('teach.myWorkbench.myclass.wbmyFirstBtn')
              "
              class="item"
              effect="dark"
              :content="$t('lv2-nav-Trial Report')"
              placement="top"
            >
              <div class="fist-class-wrap" @click="goFirstFeedback(scope.row)">
                <span class="column-button fist-class">
                  <b>首</b>
                </span>
              </div>
            </el-tooltip>
            <el-tooltip
              v-if="
                scope.row.classTypeId == 1 &&
                scope.row.classroomClassMemberInfoList[0].unitReportId &&
                Per.handleButtonPer(
                  'teach.myWorkbench.myclass.wbmyClassUnitBtn'
                )
              "
              class="item"
              effect="dark"
              :content="$t('单元报告')"
              placement="top"
            >
              <div class="fist-class-wrap" @click="goUnitReport(scope.row)">
                <span class="column-button unit-report">
                  <b>单</b>
                </span>
              </div>
            </el-tooltip>
            <!-- 旁听 -->
            <el-button
              v-if="
                scope.row.visitStatus == 1 &&
                Per.handleButtonPer('teach.myWorkbench.myclass.scVisit')
              "
              type="text"
              @click="clickHandlerAudit(scope.row.virtualClassId)"
              >{{ $t("旁听") }}</el-button
            >
            <!-- 旁听 -->
            <!-- 视频关单:正在上的有权限的1v1试听课展示 -->
            <!-- &&
                Per.handleButtonPer('teach.myWorkbench.myclass.classroomForCC') -->
            <CCVideoOrder
              v-show="
                activeClass === 'first' &&
                scope.row.courseType === 0 &&
                Per.handleButtonPer('teach.myWorkbench.myclass.classroomForCC')
              "
              :row="scope.row"
              :classTypeId="scope.row.classTypeId"
              :virtualClassId="scope.row.virtualClassId"
              :virtualclassType="scope.row.virtualclassTypeId"
            />
            <!-- 正式课更试听课 1对1 -->
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('更改课堂类型')"
              placement="top"
              v-show="
                scope.row.isShowCorrect === 0 &&
                Per.handleButtonPer(
                  'teach.myWorkbench.myclass.wbmyClassChangeBtn'
                )
              "
            >
              <span
                class="column-button fist-class fix-icon"
                :style="{
                  width: currentLang == 'en' ? '30px' : '20px',
                  height: currentLang == 'en' ? '30px' : '20px',
                  lineHeight: currentLang == 'en' ? '30px' : '20px',
                }"
              >
                <span
                  class="fix-icon"
                  style="display: block"
                  :style="{ fontSize: currentLang == 'en' ? '10px' : '14px' }"
                  @click="goToAlterChange(scope.row)"
                  >{{ $t("更") }}
                </span>
              </span>
            </el-tooltip>
            <!-- 正式课更试听课 1对1 -->
            <el-popover
              :title="$t('请选择学生')"
              :disabled="tabIndex !== 1"
              v-if="scope.row.momentsStatus === 1"
            >
              <div class="my-highlight-list">
                <el-link
                  v-for="(item, index) in getMyHighlightList(scope.row)"
                  :key="item.studentName + index"
                  :href="item.myHighlightUrl"
                  >{{ item.studentName }}</el-link
                >
              </div>
              <el-button
                slot="reference"
                type="text"
                @click="clickMyHighlight(scope.row)"
                >{{ $t("my-highlight") }}
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="screenData.pageNum"
        :pageSize="screenData.pageSize"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
    <!-- 单个课堂转换 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('my-home-Transfer Classroom')"
      :visible.sync="singleConversion"
      :before-close="closeSingleChangeFrom"
      width="30%"
      center
    >
      <div class="margin">
        <el-form
          ref="singleChangeFrom"
          :model="singleChangeFrom"
          :rules="changeClassrules"
        >
          <el-form-item
            :label="$t('教室类型')"
            label-width="80px"
            prop="virtualclassType"
          >
            <el-radio-group v-model="singleChangeFrom.virtualclassType">
              <el-radio :label="1">{{ $t("拓课云") }}</el-radio>
              <!-- <el-radio :label="2">{{ $t("百家云") }}</el-radio> -->
              <el-radio
                v-if="singleChangeFrom.virtualclassType !== 3"
                :label="3"
                :disabled="
                  singleChangeFrom.virtualclassType === 1 ||
                  singleChangeFrom.virtualclassType === 2
                "
                >{{ $t("LingoAce") }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="原因" label-width="80px" prop="reason">
            <el-input
              v-model="singleChangeFrom.reason"
              minlength="10"
              maxlength="200"
              placeholder="请详细描述默认教室原因，不少于10字符"
              style="width: 80%"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSingleChangeFrom">{{ $t("later") }}</el-button>
        <el-button
          type="primary"
          @click="sureSingleConversion"
          :loading="sureSingleConversionLoading"
          >{{ $t("Determine conversion") }}</el-button
        >
      </span>
    </el-dialog>
    <!-- 单个课堂转换 -->
    <!-- 更改试听课 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('更改课堂类型')"
      :visible.sync="changeAudition"
      v-if="changeAudition"
      width="30%"
      center
    >
      <div class="margin formalTry">
        <div>
          <div v-if="activeClass == 'first'">
            <span class="label">{{ $t("学生") }}</span>
            <span class="value">
              {{ classRoomTry.student }}
            </span>
          </div>
          <div v-else>
            <span class="label">{{ $t("班级") }}</span>
            <span class="value">
              {{ classRoomTry.class }}
            </span>
          </div>
          <div>
            <span class="label">{{ $t("课程") }}</span>
            <span class="value">
              <span v-show="currentLang === 'en'">{{
                currentEdtionId | mapEdtionEn
              }}</span>
              <span v-show="currentLang === 'zh'">{{
                currentEdtionId | mapEdtion
              }}</span>
              {{ classRoomTry.classRoom }}
            </span>
          </div>
          <div>
            <span class="label">{{ $t("上课时间") }}</span>
            <span class="value">
              {{ classRoomTry.classTime }}
            </span>
          </div>
          <div v-if="activeClass == 'first'">
            <span class="label">{{ $t("课堂类型") }}</span>
            <span class="value">
              <el-radio-group v-model="classTryradio">
                <el-radio :label="1">{{ $t("试听课") }}</el-radio>
                <br />
                <el-radio :label="0">{{ $t("正式课") }}</el-radio>
              </el-radio-group>
            </span>
          </div>
          <div v-else-if="activeClass == 'second'">
            <template>
              <el-table
                :data="classRoomTry.smallCalssTry"
                border
                style="width: 100%"
              >
                <el-table-column
                  prop="studentRealName"
                  :label="$t('学生')"
                  width="180"
                ></el-table-column>
                <el-table-column :label="$t('my-home-1-Class Type')">
                  <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.auditionCourseCorrect">
                      <el-radio :label="1">{{ $t("试听课") }}</el-radio>
                      <el-radio :label="0">{{ $t("正式课") }}</el-radio>
                    </el-radio-group>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeAudition = false">{{ $t("close") }}</el-button>
        <el-button
          type="primary"
          @click="sureAuditionTry"
          :loading="sureTryLoading"
          >{{ $t("my-home-Confirm") }}</el-button
        >
      </span>
    </el-dialog>
    <!-- 更改试听课 -->
    <!-- 安排代课 start-->
    <SubstituteClass
      :substituteFlag="substituteFlag"
      :currentClassInfo="substituteRowData"
      @closeSubstituteFlag="closeSubstituteFlag"
      @getTableData="getTableData"
      :currentType="currentType"
    ></SubstituteClass>
    <!-- 安排代课 end-->
    <!-- 老师评语和学生反馈 start -->
    <TeacherComments
      v-if="teacherComments"
      :teacherComments="teacherComments"
      :teacherInfo="teacherInfo"
      :commentsLoading="commentsLoading"
      :valuationrate="valuationrate"
      :studentFeedback="studentFeedback"
      :titleName="titleName"
      @getTableData="getTableData"
      @closeTeacherComments="closeTeacherComments"
    ></TeacherComments>
    <!-- 老师评语和学生反馈 end -->
    <!-- 异常审核 start -->
    <abnomalReview
      @closeAbnomalReview="closeAbnomalReview"
      :virtualclassData="virtualclassData"
      :abnormalLog="abnormalLog"
      @getTableData="getTableData"
      :virtualclassId="virtualclassId"
      :currentType="currentType"
    ></abnomalReview>

    <!-- 课堂回放 -->
    <ClassCallBack
      :classType="currentCBclassTypeId"
      :show="showCallBack"
      :currentCallBackId="currentCallBackId"
      @close="handleCloseCallBack"
    ></ClassCallBack>
  </div>
</template>
<script>
/**
 * 课堂转换 未开始 || 正在进行
 * 代课 未开始
 * 巡课 正在进行
 * 助教 正在进行
 * 老师评语 正常结束
 * 学生反馈 正常结束
 * 课堂回放 正常结束 || 异常结束
 * 异常审核 异常结束
 * 结束课堂 异常结束 status 4 && reason 1 2 12 20 22
 * 首课反馈 1对1 老师提交过
 * 单元报告 1对1 老师提交过
 */
import SubstituteClass from "../components/substituteClass";
import TeacherComments from "../components/teacherComments";
import AbnomalReview from "../components/abnomalReview";
import ClassCallBack from "../../../components/ClassCallBack";
import { mapGetters } from "vuex";
import { deepClone } from "../../../utils/handleData";
import { virtualclassMonitor } from "@/api/classManagement/";
import CommonTree from "../../reportManagement/commonTree";
import { JudgeNewAndOld } from "@/api/unitReportManagement/";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";
import CCVideoOrder from "@/views/myWorkbench/components/CCVideoOrder";
export default {
  name: "myClass",
  components: {
    SubstituteClass, // 代课
    TeacherComments, // 老师评价和学生反馈
    AbnomalReview, // 异常审核
    ClassCallBack,
    CommonTree,
    FilterByUserAccount,
    CCVideoOrder,
  },
  props: {},
  data() {
    return {
      singleConversion: false,
      currentSingleConversion: {},
      sureSingleConversionLoading: false,
      userParams: {},
      studentUserName: null,
      dateType: 0,
      selectOptions: [], // 课堂状态 select data
      reasonOptions: [],
      selectValue: -1, // 课堂状态
      selectValueReason: -1, // 异常原因
      tableData: [],
      loading: false,
      tableHeight: window.innerHeight - 200 || 300,
      total: 0,
      screenData: {
        pageNum: 1,
        pageSize: 10,
        startDate: "",
        endDate: "",
      },
      substituteFlag: false, // 显示代课
      substituteRowData: {}, // 点击代课时当前row数据
      studentAll: [],
      teacherInfo: {
        teacherName: "",
        classTime: "",
        classType: "",
        course: "",
      },
      teacherComments: false, // 显示老师评语
      studentFeedback: true, // 学生反馈
      valuationrate: {
        comment: [], // 评价
        valuation: [], // 评分
      },
      commentsLoading: false,
      titleName: "",
      abnormalLog: false, // 异常审核
      virtualclassData: {
        submitter: "", // 老师
        submit_time: "", // 提交时间
        end_reason: "", // 异常类型
        check_result: "", // 审核原因
        check_code: 1, // 审核结果 1学生缺席2老师缺席3学生老师均未出席
        student_amount: "", // 学生罚金
        teacher_amount: "", // 老师补偿
        check_user: "", // 审核人
        check_time: "", // 审核时间
      },
      virtualclassId: 0,
      labelOne: null,
      labelSmall: null,
      activeClass: "first",
      isShowClass: false,
      currentType: "",
      tabIndex: -1,
      currentClassTypeId: -1,
      applyDate: [],
      currentCallBackId: "",
      showCallBack: false,
      currentCBclassTypeId: 0,
      changeAudition: false,
      classTryradio: null,
      smallTryRadio: null,
      classRoomTry: {
        student: "",
        classRoom: "",
        classTime: "",
        class: "",
        smallCalssTry: [],
        virtualclassId: "",
      },
      sureTryLoading: false,
      courseType: "",
      searchType: "", // 1.教管 2.学管 3.顾问
      newCourseOption: [],
      isShowLACCSelect: true,
      singleChangeFrom: {
        virtualclassType: "",
        reason: "",
      },
      changeClassrules: {
        virtualclassType: [
          { required: true, message: this.$t("请选择"), trigger: "change" },
        ],
        reason: [
          { required: true, message: this.$t("请输入"), trigger: "blur" },
          {
            min: 10,
            max: 200,
            message: "长度在 10 到 200 个字符",
            trigger: "blur",
          },
        ],
      },
      currentEdtionId: -1,
    };
  },
  watch: {
    currentLang() {
      this.initData();
    },
    selectValue(newData) {
      if (newData != 4) {
        this.selectValueReason = -1;
      }
      this.screenData.pageNum = 1;
      this.getTableData();
    },
    selectValueReason(newData) {
      if (this.selectValue == 4) {
        this.screenData.pageNum = 1;
        this.getTableData();
      }
    },
  },
  computed: {
    nowUserInfo() {
      return JSON.parse(window.localStorage.getItem("userInfo"));
    },
    ...mapGetters(["currentLang"]),
  },
  activated() {
    this.getTableData();
  },
  methods: {
    // 设置课程类型文案
    setCourseTypeContent(courseType) {
      if (courseType === undefined || courseType === null) return "--";
      return courseType === 0 ? this.$t("试听") : this.$t("正式");
    },
    search() {
      this.screenData.pageNum = 1;
      this.getTableData();
    },
    // 正式课改为试听课
    goToAlterChange(row) {
      this.changeAudition = true;
      this.classTryradio = row.auditionCourseCorrect;
      this.classRoomTry.classTime = this.DateTimeUtils.dateClockTime(
        row.startTime
      );
      this.classRoomTry.student =
        row.classroomClassMemberInfoList[0].studentRealName;
      this.currentEdtionId = row.courseEditionId;
      this.classRoomTry.classRoom =
        "Level" + row.courseLevel + "lesson" + row.lessonNo;
      this.classRoomTry.class = row.classNameZh;
      this.classRoomTry.virtualclassId = row.virtualClassId;
      if (this.activeClass == "second") {
        this.classRoomTry.smallCalssTry = [];
        row.classroomClassMemberInfoList.forEach((item) => {
          if (item.auditionCourseCorrect == 0) {
            this.classRoomTry.smallCalssTry.push(
              JSON.parse(JSON.stringify(item))
            );
          }
        });
      }
    },
    sureAuditionTry() {
      this.sureTryLoading = true;
      if (this.activeClass == "first") {
        if (this.classTryradio == 1) {
          this.$confirm(
            this.$t("更改为试听课后，将不再允许改回正式课，请谨慎操作"),
            this.$t("提示"),
            {
              confirmButtonText: this.$t("my-home-Confirm"),
              cancelButtonText: this.$t("取消"),
              type: "warning",
            }
          )
            .then(() => {
              this.$Api.workBench
                .changeSureTry(this.classRoomTry.virtualclassId)
                .then(({ status, data }) => {
                  if (status == 200 && data.code == 200) {
                    if (data.data == true) {
                      this.sureTryLoading = false;
                      this.$message({
                        type: "success",
                        message: data.message,
                      });
                      this.changeAudition = false;
                      this.getTableData();
                    }
                  }
                });
            })
            .catch(() => {
              this.sureTryLoading = false;
            });
        } else {
          this.changeAudition = false;
        }
      } else {
        let memberIdStr = [];
        this.classRoomTry.smallCalssTry.forEach((item) => {
          if (item.auditionCourseCorrect == 1) {
            memberIdStr.push(item.memberId);
          }
        });
        memberIdStr = memberIdStr ? memberIdStr.join(",") : "";
        if (memberIdStr) {
          this.$confirm(
            this.$t("更改为试听课后，将不再允许改回正式课，请谨慎操作"),
            this.$t("提示"),
            {
              confirmButtonText: this.$t("my-home-Confirm"),
              cancelButtonText: this.$t("取消"),
              type: "warning",
            }
          )
            .then(() => {
              this.$Api.workBench
                .changeSmallSureTry(memberIdStr)
                .then(({ status, data }) => {
                  if (status == 200 && data.code == 200) {
                    if ((data.data = true)) {
                      this.sureTryLoading = false;
                      this.$message({
                        type: "success",
                        message: data.message,
                      });
                      this.changeAudition = false;
                      this.getTableData();
                    }
                  }
                });
            })
            .catch(() => {
              this.sureTryLoading = false;
            });
        } else {
          this.changeAudition = false;
        }
      }
      this.sureTryLoading = false;
    },
    //获取范围组件的值
    get_seleParams(val, valName, type) {
      if (valName === "postIdList") {
        this.screenData.userIdStr = "";
        this.screenData.postIdStr = val.join(",");
        this.searchType = parseInt(type);
        this.getTableData();
      } else if (valName === "userIdList") {
        this.screenData.postIdStr = "";
        this.screenData.userIdStr = val.join(",");
        this.searchType = parseInt(type);
        setTimeout(() => {
          this.getTableData();
        }, 500);
      } else if (valName === "init") {
        this.searchType = parseInt(type);
      } else if (!valName) {
        this.searchType = parseInt(type);
        this.getTableData();
      }
    },
    // 旁听
    clickHandlerAudit(virtualclassId) {
      let classTypeId = this.tabIndex == 1 ? 2 : 1;
      virtualclassMonitor(classTypeId, virtualclassId).then(
        ({ status, data }) => {
          if (status == 200 && data.code == 200) {
            console.log(`${data.data.entryPath}?subRole=2`);
            window.open(`${data.data.entryPath}?subRole=2`, "_blank");
          }
        }
      );
    },
    timeChange() {
      if (this.applyDate) {
        this.screenData.startDate = new Date(`${this.applyDate[0]} 00:00`);
        this.screenData.endDate = new Date(`${this.applyDate[1]} 23:59`);
        this.dateType = "";
      } else {
        this.screenData.startDate = null;
        this.screenData.endDate = null;
        this.dateType = 0;
      }
      this.getTableData();
    },
    initData() {
      this.labelOne = this.$t("1对1");
      this.labelSmall = this.$t("小班课");
      this.selectOptions = [
        { label: this.$t("my-home-All Lesson Status"), value: -1 },
        { label: this.$t("my-home-Future Lesson"), value: 1 },
        { label: this.$t("正在上课"), value: 2 },
        { label: this.$t("my-home-1-Ended"), value: 3 },
        { label: this.$t("my-home-Abort"), value: 4 },
      ];
      this.reasonOptions = [
        { label: this.$t("全部"), value: -1 },
        { label: this.$t("my-home-1-Student Absent"), value: 1 },
        {
          label: this.$t("my-home-Stduent's Device or Network Distruption"),
          value: 2,
        },
        {
          label: this.$t("my-home-Teacher's Device or Network Distruption"),
          value: 12,
        },
        { label: this.$t("my-home-Other Reasons"), value: 20 },
        { label: this.$t("my-home-Initiation Timeout"), value: 21 },
        { label: this.$t("上课时间out"), value: 22 },
      ];
      // 课堂类型
      this.newCourseOption = [
        {
          value: "",
          label: this.$t("全部"),
        },
        {
          value: 1,
          label: this.$t("正式"),
        },
        {
          value: 0,
          label: this.$t("试听"),
        },
      ];
    },
    goGroupDetail({ classId }) {
      this.$router.push(`/groupManagement/classInfo?id=${classId}&type=2`);
    },
    goTutorDetail({ tutorUserId, tutorRealName }) {
      this.$router.push(
        `/tutorManagement/teacherInfo?id=${tutorUserId}&teacherName=${tutorRealName}`
      );
    },
    goStudentDetail(studentId, studentName) {
      this.$router.push(
        `/studentManagement/studentInfo?studentId=${studentId}&studentName=${studentName}`
      );
    },
    getTableData() {
      this.loading = true;
      this.tableData = [];
      let {
        studentUserName,
        dateType,
        selectValue, //课堂状态
        selectValueReason,
        courseType, // 课程类型，0：试听课；1：正式课,
        searchType,
        userParams,
      } = this;
      let { pageNum, pageSize, startDate, endDate, postIdStr, userIdStr } =
        this.screenData;
      const params = {
        dateType,
        studentUserName,
        status: selectValue,
        reason: selectValueReason,
        startDate,
        endDate,
        postIdStr,
        userIdStr,
        userId: this.nowUserInfo.id,
        pageNum,
        pageSize,
        courseType,
        searchType,
        ...userParams,
      };
      const api =
        this.tabIndex == 1
          ? this.$Api.workBench.smallMyclass(params)
          : this.$Api.workBench.oneMyclass(params);

      api.then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.tableData = data.data.list;
          this.total = data.data.total;
        }
        this.loading = false;
      });
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page;
      this.getTableData();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getTableData();
    },
    // buttons change event
    changeRadion() {
      this.applyDate = [];
      this.screenData.startDate = "";
      this.screenData.endDate = "";
      this.getTableData();
    },
    goToAlterCost(item) {
      this.$router.push(
        `/appealManagement/alterCost?classTypeId=${
          item.classTypeId
        }&virtualClassId=${item.virtualClassId}&correctStatus=${
          item.xgCorrectStatus === 1
        }&from=/work/myClass`
      );
    },
    closeSingleChangeFrom() {
      this.singleConversion = false;
      this.$refs.singleChangeFrom.resetFields();
    },
    sureSingleConversion() {
      this.$refs.singleChangeFrom.validate((valid) => {
        if (valid) {
          this.sureSingleConversionLoading = true;
          let ids = [this.currentSingleConversion.virtualClassId],
            apiName = "";
          this.tabIndex == 1
            ? (apiName = "classArrangementCrConMoreSmallClass")
            : (apiName = "classArrangementCrConMore");
          this.$Api.classManagement[apiName]({
            virtualClassIds: ids,
            ...this.singleChangeFrom,
          })
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$notify({
                  message: this.$t("transfer successfully"),
                  type: "success",
                });
                this.getTableData();
                this.closeSingleChangeFrom();
              } else {
                this.$notify({
                  message: this.$t("transfer failed"),
                  type: "error",
                });
              }
            })
            .finally(() => (this.sureSingleConversionLoading = false));
        } else {
          return false;
        }
      });
    },
    // 课堂转换 func
    batchConversion(scopeRow) {
      this.singleConversion = true;
      this.currentSingleConversion = deepClone(scopeRow);
      this.singleChangeFrom.virtualclassType = scopeRow.virtualclassTypeId;
    },
    // 点击代课 func
    clickHandlerSubstitute(scopeRow) {
      if (!scopeRow.virtualClassId || !scopeRow.startTime) return;
      this.substituteFlag = true;
      this.substituteRowData = JSON.parse(JSON.stringify(scopeRow));
      if (this.tabIndex == 1) {
        this.currentType = "smallClass";
      } else {
        this.currentType = "oneByOne";
      }
    },
    // 巡课
    handlerTourClassRoom({ virtualClassId }) {
      this.$confirm(
        this.$t("Will enter the class as a tour, whether to continue"),
        this.$t("提示"),
        {
          confirmButtonText: this.$t("my-home-Confirm"),
          cancelButtonText: this.$t("取消"),
          type: "warning",
        }
      )
        .then(() => {
          let classTypeId = -1;
          if (this.tabIndex == 1) {
            classTypeId = 2;
          } else {
            classTypeId = 1;
          }
          this.$Api.workBench
            .tourClass(classTypeId, virtualClassId, this.nowUserInfo.id)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                window.open(data.data.entryPath, "_blank");
              } else {
                this.$notify({
                  message: data.message,
                  type: "error",
                });
              }
            });
        })
        .catch((_) => {});
    },
    // 助教
    clickHandlerMonitor({ virtualClassId }) {
      // 需要 virtualClassId
      let classTypeId = -1;
      if (this.tabIndex == 1) {
        classTypeId = 2;
      } else {
        classTypeId = 1;
      }
      this.$confirm(
        this.$t(
          "Will enter the class as a teaching assistant, whether to continue"
        ),
        this.$t("提示"),
        {
          confirmButtonText: this.$t("my-home-Confirm"),
          cancelButtonText: this.$t("取消"),
          type: "warning",
        }
      ).then((res) => {
        let classTypeId = this.tabIndex == 1 ? 2 : 1;
        this.$Api.classManagement
          .virtualclassMonitor(classTypeId, virtualClassId)
          .then(({ status, data }) => {
            if (status == 200 && data.code == 200) {
              window.open(data.data.entryPath, "_blank");
            } else {
              this.$notify({
                message: data.message,
                type: "error",
              });
            }
          });
      });
    },
    // 老师评语
    clickHandlerComment(virtualClassId, target, obj) {
      this.studentAll = [];
      this.teacherInfo.teacherName = obj.tutorRealName;
      this.teacherInfo.classTime = this.DateTimeUtils.dateClockTime(
        obj.startTime
      );
      this.teacherInfo.classType = this.tabIndex == 1 ? "小班课" : "1对1";
      this.teacherInfo.course = {
        lessonDescEN: obj.courseProgressEn,
        lessonDescZH: obj.courseProgressZh,
      };
      this.studentFeedback = target === "Student";
      this.titleName =
        target === "Student"
          ? this.$t("my-home-Teacher Feedback")
          : this.$t("my-home-Student Feedback");

      this.commentsLoading = true;
      this.$Api.classManagement
        .virtualclassComment(virtualClassId, target)
        .then((res) => {
          this.commentsLoading = false;
          this.valuationrate = res.data.data || [];
          this.teacherComments = true;
        });
    },
    // 课堂回放
    clickHandlerPlayback(virtualClassId, virtualclassTypeId) {
      this.currentCallBackId = virtualClassId;
      this.currentCBclassTypeId = virtualclassTypeId;
      this.showCallBack = true;
    },
    handleCloseCallBack() {
      this.showCallBack = false;
    },
    // 异常审核
    clickHandlerAbnormal(virtualclassId) {
      this.abnormalLog = true;
      let classTypeId = -1;
      if (this.tabIndex == 1) {
        this.currentType = "smallClass";
        classTypeId = 2;
      } else {
        this.currentType = "oneByOne";
        classTypeId = 1;
      }
      // this.virtualclassId = virtualclassId
      this.$Api.classManagement
        .getExamineInfo(classTypeId, virtualclassId)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.virtualclassData = data.data;
            this.virtualclassId = virtualclassId;
          }
        });
    },
    // 结束课堂
    clickHandlerNormalEnd(virtualClassId) {
      this.$confirm(
        this.$t("my-home-Confirm to end lesson?"),
        this.$t("提示"),
        {
          confirmButtonText: this.$t("my-home-Confirm"),
          cancelButtonText: this.$t("取消"),
          type: "warning",
        }
      )
        .then(() => {
          this.$Api.classManagement
            .classArrangementEndClass(virtualClassId)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$notify({
                  message: this.$t("Finished successfully"),
                  type: "success",
                });
                this.getTableData();
              }
            });
        })
        .catch((_) => {});
    },
    // 关闭代课 dialog
    closeSubstituteFlag() {
      this.substituteFlag = false;
    },
    // 关闭老师评价 dialog
    closeTeacherComments() {
      this.teacherComments = false;
    },
    // 关闭异常审核 dialog
    closeAbnomalReview() {
      this.abnormalLog = false;
    },
    goFirstFeedback(scopeRow) {
      let firstReportId =
          scopeRow.classroomClassMemberInfoList[0].firstReportId,
        firstReportStatus =
          scopeRow.classroomClassMemberInfoList[0].firstReportStatus;
      if (scopeRow.classroomClassMemberInfoList[0].firstReportId) {
        switch (firstReportStatus) {
          case 0:
            // 未提交
            this.$notify({
              message: this.$t(
                "Feedback for the first lesson of this lesson to be submitted"
              ),
              type: "error",
            });
            break;
          case 1:
            // 已提交未审核
            this.$router.push(
              `/reportManagement/feedbackAudited?reportId=${firstReportId}&classTypeId=1`
            );
            break;
          case 2:
            // 审核不通过
            this.$router.push(
              `/reportManagement/feedbackAuditFailed?reportId=${firstReportId}&classTypeId=1`
            );
            break;
          case 3:
            // 审核通过已发送
            this.$router.push(
              `/reportManagement/feedbackAuditSuccessed?reportId=${firstReportId}&classTypeId=1`
            );
            break;
          case 4:
            // 审核通过未发送
            this.$router.push(
              `/reportManagement/feedbackAudited?reportId=${firstReportId}&classTypeId=1`
            );
            break;
          default:
            break;
        }
      }
    },
    async goUnitReport(scopeRow) {
      let unitReportId = scopeRow.classroomClassMemberInfoList[0].unitReportId,
        unitReportStatus =
          scopeRow.classroomClassMemberInfoList[0].unitReportStatus;
      if (unitReportId) {
        let {
          status,
          data: { code, data },
        } = await JudgeNewAndOld(unitReportId);
        if (status !== 200 && code !== 200) return Promise.reject();
        switch (unitReportStatus) {
          case 0:
            // 未提交
            this.$notify({
              message: this.$t(
                "The unit report of this lesson is pending submission"
              ),
              type: "error",
            });
            break;
          case 1:
            // 已提交未审核
            this.$router.push(
              `/reportManagement/audited?reportId=${unitReportId}&version=${data}`
            );
            break;
          case 2:
            // 审核不通过
            this.$router.push(
              `/reportManagement/auditFailed?reportId=${unitReportId}&version=${data}`
            );
            break;
          case 3:
            // 审核通过已发送
            this.$router.push(
              `/reportManagement/auditSuccessed?reportId=${unitReportId}&version=${data}`
            );
            break;
          case 4:
            // 审核通过未发送
            this.$router.push(
              `/reportManagement/audited?reportId=${unitReportId}&version=${data}`
            );
            break;
          default:
            break;
        }
      }
    },

    handleClick(tab, event) {
      if (tab.index == 1) {
        this.isShowClass = true;
      } else {
        this.isShowClass = false;
      }
      this.tabIndex = tab.index;
      this.getTableData();
    },
    clickMyHighlight(row) {
      if (this.tabIndex === 1) {
        return;
      }
      const { momentsUrl } = row;
      if (typeof momentsUrl !== "string" || momentsUrl.length === 0) {
        console.error("无效的精彩瞬间链接地址", row);
        throw new Error();
      }

      const urlParam = encodeURIComponent(momentsUrl);
      this.$router.push(`/work/myHighlight?url=${urlParam}`);
    },
    getMyHighlightList(row) {
      if (this.tabIndex !== 1) {
        return [];
      }
      const { momentsUrlMap, classroomClassMemberInfoList } = row;
      const list = [];
      classroomClassMemberInfoList.forEach((v) => {
        const momentsUrl = momentsUrlMap[v.studentUserId];
        if (momentsUrl == null) {
          return;
        }
        const studentName = v.studentRealName;
        const urlParam = encodeURIComponent(momentsUrl);
        const myHighlightUrl = `/work/myHighlight?url=${urlParam}`;
        list.push({ studentName, myHighlightUrl });
      });
      return list;
    },
  },
  created() {
    this.initData();
    if (
      this.Per.handleButtonPer("teach.myWorkbench.myclass.wbmyClassTimeScope")
    )
      return;
    this.getTableData();
  },
};
</script>
<style lang="scss" scoped>
.elementIcon {
  font-size: 18px;
  cursor: pointer;
}

.my-class-wrap {
  padding: 10px 0 0 10px;

  .my-class-search-wrap {
    margin-top: 20px;

    .check-search-item-wrap {
      display: flex;
      margin: 10px 0;

      .check-search-item {
        margin-right: 20px;
      }
    }
  }

  .my-class-table-wrap {
    margin-top: 17px;
  }

  .column-button {
    display: inline-block;
    cursor: pointer;
    font-size: 18px;
    color: #666;
    margin: 3px;
  }

  .column-button:hover {
    color: rgb(92, 194, 208);
  }

  .fist-class-wrap {
    display: inline-block;
  }

  .disable-first-class {
    border: 1px solid #666;
    color: #666;
    border-radius: 50%;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;

    b {
      font-size: 10px;
    }
  }

  .fist-class,
  .unit-report {
    border: 1px solid #666;
    border-radius: 50%;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;

    b {
      font-size: 10px;
    }
  }

  .fist-class:hover,
  .unit-report:hover {
    border: 1px solid rgb(92, 194, 208);
    color: rgb(92, 194, 208);
  }

  .filter-item-box {
    width: 200px;
    display: inline-block;
    margin-bottom: 20px;
  }

  .fix-icon {
    margin-top: -1px;
    font-size: 14px;
    display: inline-block;
  }
}
.formalTry {
  > div {
    font-size: 14px;
    > div {
      line-height: 33px;
      .label {
        display: inline-block;
        text-align: left;
        width: 85px;
      }
      .value {
        color: #666666;
        margin-left: 15px;
      }
    }
    .smallTable {
      width: 80%;
      min-height: 50px;
      border: 1px solid;
      display: flex;
      flex-wrap: wrap;
      :nth-child(1) {
        width: 30%;
      }
      :nth-child(2) {
        width: 70%;
      }
    }
  }
}
.search—title {
  padding: 0 10px;
  line-height: 32px;
  text-align: right;
  font-size: 12px;
  color: #666;
}

.my-highlight-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
