<template>
  <div class="task-content-warp">
    <div class="first">
      <div
        class="title"
        v-if="taskData.taskReferenceItem || taskData.taskReferenceResp"
      >
        {{ $t("参考信息") }}
      </div>
      <div
        v-if="
          taskData.taskReferenceItem &&
          (taskData.taskReferenceItem.includes('1') ||
            taskData.taskReferenceItem.includes('2') ||
            taskData.taskReferenceItem.includes('3') ||
            taskData.taskReferenceItem.includes('4'))
        "
      >
        <ClassPlayback
          v-if="taskData.taskReferenceItem.includes('1')"
          :classTypeId="taskData.taskReferenceResp.classTypeId"
          :virtualclassId="taskData.taskReferenceResp.virtualclassId"
        />
        <UnitReport
          v-if="taskData.taskReferenceItem.includes('2')"
          :unitReportStatus="taskData.taskReferenceResp.unitReportStatus"
          :unitReportId="taskData.taskReferenceResp.unitReportId"
        />
        <el-tooltip
          v-if="taskData.taskReferenceItem.includes('3')"
          class="item"
          effect="dark"
          :content="
            isEn
              ? taskData.taskReferenceResp.subjectSpeedEn
              : taskData.taskReferenceResp.subjectSpeedZh
          "
          placement="right"
        >
          <el-button type="text">{{ $t("本节课内容") }}</el-button>
        </el-tooltip>
        <LessonSummary
          v-if="taskData.taskReferenceItem.includes('4')"
          :classTypeId="taskData.taskReferenceResp.classTypeId"
          :virtualclassId="taskData.taskReferenceResp.virtualclassId"
          :virtualClassStartTime="
            taskData.taskReferenceResp.virtualClassStartTime
          "
          :subjectSpeedZh="taskData.taskReferenceResp.subjectSpeedZh"
          :subjectSpeedEn="taskData.taskReferenceResp.subjectSpeedEn"
          :tutorUsername="taskData.taskReferenceResp.tutorUsername"
          :studentUserId="taskData.taskReferenceResp.studentUserId"
        />
      </div>
      <div class="handover" v-if="taskData.taskReferenceResp">
        <div
          class="mb10"
          v-if="taskData.taskReferenceResp.isChangeTutor != null"
        >
          {{ $t("是否更换老师") }}:
          {{ taskData.taskReferenceResp.isChangeTutor ? $t("是") : $t("否") }}
        </div>
        <div
          class="mb10"
          v-if="taskData.taskReferenceResp.expectationForTutor != null"
        >
          {{ $t("老师要求") }}:
          {{ taskData.taskReferenceResp.expectationForTutor || "-" }}
        </div>
        <div
          class="mb10"
          v-if="taskData.taskReferenceResp.handoverDesc != null"
        >
          {{ $t("交接说明") }}:
          {{ taskData.taskReferenceResp.handoverDesc || "-" }}
        </div>
      </div>
      <el-divider></el-divider>
    </div>
    <div class="second">
      <div class="title">{{ $t("任务Follow Up") }}</div>
      <el-form
        v-if="taskFormState.taskFollowReqList.length"
        ref="taskForm"
        :model="taskFormState"
        label-width="140px"
        :disabled="disabled"
      >
        <div
          v-for="(item, index) in taskFormState.taskFollowReqList"
          :key="item.id"
        >
          <el-form-item
            :required="item.required === 1"
            :label="isEn ? item.itemName.en : item.itemName.zh"
            :prop="'taskFollowReqList.' + index + '.valueList'"
            :rules="item.required === 1 ? rulesItemValue : { required: false }"
          >
            <el-radio-group
              v-if="item.itemType === 'Select' || item.itemType === 'Radio'"
              v-model="item.valueList"
            >
              <el-radio
                v-for="ite in item.fieldList"
                :key="ite.id"
                :label="ite.id"
                >{{ $t(ite.itemValue) }}</el-radio
              >
            </el-radio-group>
            <el-checkbox-group
              v-if="item.itemType === 'SelectMultiple'"
              v-model="item.valueList"
            >
              <el-checkbox
                v-for="ite in item.fieldList"
                :label="ite.id"
                :key="ite.id"
                >{{ ite.itemValue }}</el-checkbox
              >
            </el-checkbox-group>
            <el-input
              v-if="item.itemType === 'TextArea'"
              type="textarea"
              maxlength="500"
              show-word-limit
              v-model="item.valueList"
            ></el-input>
          </el-form-item>
        </div>
        <div
          v-if="
            normalFormState.associatedRecord === 1 /* 需要关联记录 */ &&
            normalFormState.contactInformation.length
          "
        >
          <el-divider></el-divider>
          <div class="title">{{ $t("沟通过程") }}</div>
          <div
            v-if="
              normalFormState.contactInformation &&
              normalFormState.contactInformation.length
            "
          >
            <el-form-item
              prop="contactInformation"
              :label-width="isEn ? '200px' : '100px'"
              :rules="{
                required: true,
                message: $t('请选择沟通方式'),
                trigger: 'change',
              }"
              :label="$t('沟通方式')"
            >
              <el-radio-group v-model="taskFormState.contactInformation">
                <el-radio
                  v-for="item in normalFormState.contactInformation"
                  :key="item"
                  :label="item"
                  >{{ contactInformationMap[item] }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </div>
          <div
            v-if="
              taskFormState.contactInformation &&
              taskFormState.contactInformation !== ''
            "
          >
            <el-form-item
              :rules="validateContactInformation"
              prop="contactRecordReqList"
              :required="true"
              :label-width="isEn ? '200px' : '100px'"
              :label="$t('沟通记录')"
            >
              <el-button
                v-show="
                  taskFormState.contactInformation == '1' ||
                  taskFormState.contactInformation == '2'
                "
                type="text"
                @click="showLogDialog"
                >{{ $t("关联记录") }}</el-button
              >
              <div class="record-list" v-if="recordList.length">
                <span class="time">{{
                  moment(recordList[0].threePartyRecordTime).format(
                    "YYYY-MM-DD"
                  )
                }}</span>
                <span
                  class="close-btn fr"
                  @click="
                    () => {
                      recordList = [];
                    }
                  "
                  ><i class="el-icon-close"></i
                ></span>
                <div class="record-num">
                  您和{{ parentName }}的沟通记录({{ recordList.length }}条)
                </div>
              </div>
              <UploadToS3
                ref="uploadToS3"
                @setUploading="setUploading"
                :config="config"
                @changFileData="getUploadFile"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <SessionLog
      v-if="showSessionLog"
      :parentUserId="taskData.parentUserId"
      :show.sync="showSessionLog"
      :isShowAirCall="taskFormState.contactInformation == 1"
      @getRecordList="getRecordList"
    />
  </div>
</template>
<script>
import { computed, watch, ref, onMounted } from "@vue/composition-api";
import UploadToS3 from "@/components/Upload/uploadToS3";
import SessionLog from "../record/SessionLog.vue";
import ClassPlayback from "./ClassPlayback.vue";
import UnitReport from "./UnitReport.vue";
import LessonSummary from "./LessonSummary.vue";

import moment from "moment";
import { deepClone } from "../../../../utils/handleData";

export default {
  components: {
    UploadToS3,
    SessionLog,
    ClassPlayback,
    UnitReport,
    LessonSummary,
  },
  props: {
    taskData: {
      type: Object,
      default: {},
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const taskFormState = ref({
      contactInformation: null,
      taskFollowReqList: [],
      contactRecordReqList: null,
    });
    const imgList = ref([]);
    const normalFormState = ref({
      contactInformation: null,
    });
    // 获取预签名函数
    const getSignUrl = async (fileType) => {
      const res = await root.$Api.taskManagement.reqSopUploadSign({
        fileType: fileType,
      });
      return res;
    };
    const config = {
      accept: "image/jpg, image/png, image/jpeg",
      tips: root.$t("支持截图后ctrl+v/cmd+v粘贴上传,最多5张"),
      limit: 5,
      maxSize: 2,
      showImgList: true,
      getSignFun: getSignUrl,
      pasteUpload: true,
    };
    const abnormalFormState = ref({});
    const contactInformationMap = {
      1: root.$t("打电话"),
      2: root.$t("发消息"),
      3: root.$t("发邮件"),
    };
    const rulesItemValue = {
      required: false,
      validator: (rule, value, callback) => {
        if (!value || (typeof value === "object" && !value.length)) {
          return callback(new Error(root.$t("缺少必填项")));
        }
        return callback();
      },
      trigger: ["change", "blur"],
    };
    const validateContactInformation = {
      required: false,
      validator: (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请上传"));
        }
        return callback();
      },
      trigger: ["change"],
    };
    const getUploadFile = (fileList) => {
      imgList.value = [];
      fileList.forEach((file) => {
        imgList.value.push({
          recordId: file.filePath,
          recordSource: 3 /* 记录来源:1-企业微信 2-AirCall 3-图片 */,
        });
      });
      taskFormState.value.contactRecordReqList = recordList.value.concat(
        imgList.value
      );
      if (taskFormState.value.contactRecordReqList.length) {
        refs["taskForm"].clearValidate(["contactRecordReqList"]);
      }
    };
    // 会话记录
    const showSessionLog = ref(false);
    const showLogDialog = () => {
      showSessionLog.value = true;
    };
    const recordList = ref([]);
    const parentName = ref("");
    const getRecordList = (list, name) => {
      recordList.value = list;
      parentName.value = name;
      taskFormState.value.contactRecordReqList = recordList.value.concat(
        imgList.value
      );
      if (taskFormState.value.contactRecordReqList.length) {
        refs["taskForm"].clearValidate(["contactRecordReqList"]);
      }
    };
    const initForm = (config) => {
      let e = deepClone(config);
      taskFormState.value.contactInformation = null;
      if (e.contactInformation === "") {
        e.contactInformation = [];
      } else {
        e.contactInformation = e.contactInformation.split(",");
      }
      taskFormState.value.taskFollowReqList = [];
      // 增加代码容错性
      (e.taskFormItemRespList || []).forEach((t, i) => {
        taskFormState.value.taskFollowReqList.push({
          formItemId: t.formItemId,
          fieldList: t.valueList,
          itemName: JSON.parse(t.itemName),
          valueList: t.itemType === "SelectMultiple" ? [] : "",
          required: t.required,
          itemType: t.itemType,
        });
      });
      taskFormState.value.completeType = e.completeType;
      normalFormState.value = e;
    };

    onMounted(() => {
      if (props.taskData?.completeConfigRespList?.length) {
        initForm(props.taskData.completeConfigRespList[0]);
      }
    });
    const setAbnormalFinish = () => {
      initForm(props.taskData.completeConfigRespList[1]);
    };
    const setUploading = (uploading) => {
      emit("setUploading", uploading);
    };
    return {
      isEn,
      taskData: props.taskData,
      normalFormState,
      abnormalFormState,
      contactInformationMap,
      taskFormState,
      rulesItemValue,
      config,
      validateContactInformation,
      showSessionLog,
      recordList /* 沟通记录 */,
      moment,
      parentName,
      imgList /* 上传图片列表 */,
      getUploadFile,
      showLogDialog,
      getRecordList,
      setAbnormalFinish /* 父组件调用切换异常完成 */,
      setUploading,
    };
  },
};
</script>
<style lang="scss" scoped>
.task-content-warp {
  .title {
    color: #333333;
    border-left: 2px solid #a0a7e6;
    padding-left: 6px;
    margin-bottom: 10px;
    font-size: 14px;
  }
  .handover {
    font-size: 13px;
    color: #606266;
  }
  .second {
    .record-list {
      width: 260px;
      height: 70px;
      background: #ecedf9;
      padding: 0 8px;
      font-size: 12px;
      .close-btn {
        width: 14px;
        height: 14px;
        border-radius: 14px;
        background: #7580e5;
        color: #fff;
        line-height: 14px;
        padding: 0;
        text-align: center;
        margin-top: 8px;
        cursor: pointer;
      }
      .record-num {
        border-top: 1px solid #ccc;
        color: #333333;
      }
    }
  }
}
</style>
