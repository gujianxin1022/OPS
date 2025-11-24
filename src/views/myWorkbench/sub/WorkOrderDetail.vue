<template>
  <div class="work-order-detail-warp p20">
    <el-row :gutter="10">
      <el-col :span="16" style="border-right: 1px dashed #ccc"
        ><div class="left">
          <div class="info" v-loading="loading">
            <div class="title">{{ orderInfo.title }}</div>
            <div v-html="orderInfo.content"></div>
          </div>
          <div class="comment" v-loading="loading">
            <div style="color: #606266">
              <span>{{ $t("内部回复") }}</span>
              <el-tooltip
                :content="$t('回复的信息仅被内部员工看到')"
                placement="top"
                @click.stop.prevent
              >
                <span style="cursor: pointer" class="el-icon-question" />
              </el-tooltip>
            </div>
            <div class="block">
              <el-timeline :reverse="false">
                <el-timeline-item
                  v-for="(activity, index) in orderInfo.commentList"
                  :key="index"
                  :timestamp="activity.commentTime.split(' ')[0]"
                  placement="top"
                >
                  <el-card style="width: 80%">
                    <div
                      style="overflow-x: scroll"
                      v-html="activity.content.replace(/\n/g, '<br>')"
                    ></div>
                    <p>
                      {{ activity.commentator }} 提交于
                      {{ activity.commentTime }}
                    </p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
            <div
              class="add-comment"
              :style="
                showCommentInput
                  ? 'height:480px;overflow-y: scroll;'
                  : 'height:43px'
              "
            >
              <el-input
                v-show="!showCommentInput"
                show-word-limit
                :placeholder="$t('添加评论')"
                @focus="showAndFocusCommentInput"
              >
              </el-input>
              <div v-if="showCommentInput" style="height: 400px">
                <RichTextEditor
                  ref="inputElement"
                  @handelChangeContent="
                    (html) => {
                      comment = html;
                    }
                  "
                  :editorConfig="editorConfig"
                />
                <div>
                  <el-button @click="submitComment" type="primary">{{
                    $t("保存")
                  }}</el-button>
                  <el-button @click="showCommentInput = false" type="text">{{
                    $t("取消")
                  }}</el-button>
                </div>
              </div>
            </div>
          </div>
        </div></el-col
      >
      <el-col :span="8">
        <div class="right-warp">
          <div class="right" v-loading="loading">
            <div class="title mb20">
              <span>{{ $t("工单详情") }}</span>
              <el-tag
                class="fr"
                :type="alertPriorityColorMAp[orderInfo.alertPriority]"
                effect="dark"
              >
                {{ $t("预警") }}
              </el-tag>
            </div>
            <el-form
              :model="form"
              :disabled="!orderInfo.editable"
              label-position="left"
              label-width="100px"
            >
              <el-form-item :label="$t('工单状态')">
                <el-button
                  v-if="!statusOptions.length"
                  :type="statusColorMAp[currentStatus.statusId]"
                >
                  {{ currentStatus.statusName }}
                </el-button>
                <el-dropdown
                  v-else
                  split-button
                  :type="statusColorMAp[currentStatus.statusId]"
                  size="mini"
                >
                  {{ currentStatus.statusName }}
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in statusOptions"
                      :key="item.statusId"
                      @click.native="handleClick(item)"
                      >{{ item.statusName }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
              <el-divider></el-divider>
              <el-form-item :label="$t('工单编号')">
                {{ orderInfo.thirdTicketId }}
              </el-form-item>
              <el-form-item :label="$t('优先级')">
                {{ $t(orderInfo.priorityName) }}
              </el-form-item>
              <el-form-item :label="$t('工单类型')">
                {{ orderInfo.typeName }}
              </el-form-item>
              <el-form-item :label="$t('用户信息')">
                <span v-if="orderInfo.studentId && orderInfo.studentId.length" style="cursor: pointer; color: #7580e5">
                  <router-link
                    :to="{
                      path: `/studentManagement/studentInfo`,
                      query: {
                        studentId: orderInfo.studentId,
                        studentName: orderInfo.studentName,
                      },
                    }"
                  >
                    {{ orderInfo.studentName || "-" }}
                  </router-link>
                </span>
              </el-form-item>
              <el-form-item :label="$t('学科')">
                <FilterBySubject
                  :initVal="subject"
                  @changeSelect="
                    (val) => {
                      subject = val;
                    }
                  "
                />
              </el-form-item>
              <el-form-item :label="$t('处理人')">
                <FilterByOPSAccount
                  :user="businessUser"
                  @change="
                    (user) => {
                      businessUser = {
                        businessUserId: user.userInfo.id,
                        businessUserName: user.userInfo.username,
                        roleCode: 4,
                      };
                    }
                  "
                />
              </el-form-item>
              <el-form-item :label="$t('创建人')">
                {{ orderInfo.createName }}
              </el-form-item>
              <el-form-item :label="$t('创建时间')">
                {{ orderInfo.createTime }}
              </el-form-item>
              <el-form-item :label="$t('已解决时间')">
                {{ orderInfo.solvedTime || "-" }}
              </el-form-item>
              <el-form-item :label="$t('已关闭时间')">
                {{ orderInfo.closeTime || "-" }}
              </el-form-item>
            </el-form>
            <el-button
              :loading="submitLoading"
              class="submit-btn"
              :disabled="!canEdit || !orderInfo.editable"
              @click="updatedWorkOrder"
              type="primary"
              >{{ $t("保存") }}</el-button
            >
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "@vue/composition-api";
import FilterBySubject from "@/components/FilterItem/CommodityFilter/FilterBySubject";
import UploadToS3 from "@/components/Upload/uploadToS3";
import RichTextEditor from "@/components/RichTextEditor.vue";
import FilterByOPSAccount from "@/components/FilterItem/UserDimensionFilter/FilterByOPSAccount";

export default {
  components: {
    FilterBySubject,
    UploadToS3,
    RichTextEditor,
    FilterByOPSAccount,
  },
  setup(props, { root, emit, refs }) {
    const showCommentInput = ref(false);
    const showAndFocusCommentInput = () => {
      showCommentInput.value = true;
      console.log( showCommentInput.value)
      root.$nextTick(() => {
        refs.inputElement.$children[0].quill.focus();
      });
    };
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    watch(isEn, async () => {
      reqWorkOrderDetail();
    });
    const handleClick = (e) => {
      currentStatus.value = e;
    };
    const comment = ref("");
    const submitComment = async () => {
      const { id } = root.$route.query;
      if (!comment.value.length) return;
      await root.$Api.workBench.reqWorkOrderComment({
        ticketId: id,
        content: comment.value,
      });
      root.$notify.success(root.$t("操作成功"));
      showCommentInput.value = false;
      reqWorkOrderDetail();
      comment.value = "";
    };
    const form = ref({
      subject: "0",
    });
    const loading = ref(false);
    const orderInfo = ref({});
    const currentStatus = ref({});
    const statusOptions = ref([]);
    const subject = ref("");
    const canEdit = ref(false);
    const businessUser = ref({});
    const reqWorkOrderDetail = async () => {
      const { id } = root.$route.query;
      try {
        loading.value = true;
        const res = await root.$Api.workBench.reqWorkOrderInfo({
          ticketId: id,
        });
        orderInfo.value = res;
        subject.value = res.subjectType + "";
        businessUser.value =
          res.businessUserInfoList.filter((e) => {
            return e.default;
          })[0] || {};
        currentStatus.value = res.statusList.filter((e) => {
          return e.default;
        })[0];
        canEdit.value = [0, 1, 2, 4].includes(currentStatus.value.statusId);
        statusOptions.value = res.statusList.filter((e) => {
          return !e.default;
        });
      } finally {
        loading.value = false;
      }
    };
    onMounted(() => {
      reqWorkOrderDetail();
    });
    const alertPriorityColorMAp = {
      1: "info",
      2: "warning",
      3: "danger",
    };
    const statusColorMAp = {
      0: "primary",
      2: "warning",
      3: "success",
      4: "danger",
      5: "info",
    };
    const submitLoading = ref(false);
    const updatedWorkOrder = async () => {
      const { id } = root.$route.query;
      const params = {
        ticketId: id,
        statusId: currentStatus.value.statusId,
        subjectType: subject.value,
        businessUser: businessUser.value,
      };
      try {
        submitLoading.value = true;
        await root.$Api.workBench.reqUpdateWorkOrder(params);
        root.$notify.success(root.$t("操作成功"));
      } finally {
        submitLoading.value = false;
        reqWorkOrderDetail();
      }
    };
    /* 上传图片 */
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
      maxSize: 200,
      showImgList: true,
      getSignFun: getSignUrl,
      pasteUpload: true,
    };
    const imgList = ref([]);
    const getUploadFile = (fileList) => {
      imgList.value = fileList;
    };

    return {
      isEn,
      comment,
      form,
      canEdit,
      handleClick,
      submitComment,
      loading,
      orderInfo,
      alertPriorityColorMAp,
      subject,
      statusColorMAp,
      currentStatus,
      statusOptions,
      updatedWorkOrder,
      submitLoading,
      showCommentInput,
      showAndFocusCommentInput,
      getSignUrl,
      config,
      getUploadFile,
      businessUser,
      editorConfig: {
        modules: {
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false,
          },
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], // 加粗，斜体，下划线，删除线
              [{ list: "ordered" }, { list: "bullet" }], // 有序列表，无序列表
              [{ indent: "-1" }, { indent: "+1" }], // 缩进
              [{ size: ["small", false, "large", "huge"] }], // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
              [{ color: [] }, { background: [] }], // 颜色选择
              [{ font: [] }], // 字体
              [{ align: [] }], // 居中
              ["clean"], // 清除样式,
              ["audio"],
            ],
          },
        },
        placeholder: root.$t("请输入"),
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.work-order-detail-warp {
  width: 100%;
  .left {
    height: calc(100vh - 150px);
    width: 100%;
    .info {
      height: 40%;
      width: 100%;
      margin-bottom: 5px;
      border-bottom: 1px #ccc dashed;
      overflow-y: scroll;
    }
    .comment {
      height: 60%;
      width: 100%;
      overflow: hidden;
      padding-top: 10px;
      position: relative;
      padding-bottom: 33px;
      overflow-y: scroll;
      .block {
        overflow-y: scroll;
        height: calc(100% - 40px);
        padding-top: 10px;
        margin-top: 10px;
      }
      .add-comment {
        padding-top: 10px;
        width: 100%;
        background: #fff;
      }
    }
  }
  .right-warp {
    height: calc(100vh - 150px);
    overflow: scroll;
    position: relative;
    .right {
      height: auto;
      width: 100%;
      padding-left: 20px;
      .submit-btn {
        margin-left: 50%;
        width: 200px;
        transform: translateX(-50%);
        margin-top: 20px;
      }
    }
    .title {
      font-size: 20px;
      font-weight: bold;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
<style lang="scss">
.work-order-detail-warp {
  .el-card__body {
    padding: 10px 10px 0 10px !important;
  }
}
</style>
