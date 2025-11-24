<template>
  <div class="work-order-detail" v-loading="loading">
    <div class="flex-end">
      <SetupLanguage />
    </div>
    <el-tabs v-if="orderInfo" v-model="currentTab">
      <el-tab-pane :label="$t('工单信息')" name="1">
        <el-card shadow="never">
          <div class="wo-title">{{ orderInfo.title }}</div>
          <div class="wo-content" v-html="orderInfo.content"></div>
        </el-card>
        <el-card class="mt5" shadow="never">
          <el-form :model="form" :disabled="!orderInfo.editable" label-position="left" label-width="100px">
            <el-form-item :label="$t('工单状态')">
              <div class="flex-between">
                <el-button v-if="!statusOptions.length" :type="statusColorMAp[currentStatus.statusId]">
                  {{ currentStatus.statusName }}
                </el-button>
                <el-dropdown v-else split-button trigger="click" :type="statusColorMAp[currentStatus.statusId]"
                  size="mini">
                  {{ currentStatus.statusName }}
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in statusOptions" :key="item.statusId"
                      @click.native="handleClick(item)">{{ item.statusName }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-tag :type="alertPriorityColorMAp[orderInfo.alertPriority]" effect="dark">
                  {{ $t("预警") }}
                </el-tag>
              </div>
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
              {{ orderInfo.studentName || "-" }}
            </el-form-item>
            <el-form-item :label="$t('学科')">
              <FilterBySubject :initVal="subject" @changeSelect="(val) => subject = val" />
            </el-form-item>
            <el-form-item :label="$t('处理人')">
              <el-select :value="businessUser.businessUserId" placeholder="" @change="onBusinessUserChange">
                <el-option v-for="item in orderInfo.businessUserInfoList" :key="item.businessUserId"
                  :label="item.businessUserName" :value="item.businessUserId"></el-option>
              </el-select>
              <span class="sm-text">{{ $t('搜索范围：仅支持该家长下的课程顾问与学管') }}</span>
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
        </el-card>
      </el-tab-pane>
      <el-tab-pane :label="$t('内部回复')" name="2">
        <el-card class="comment-card" shadow="never">
          <CommentTimeline v-if="orderInfo.commentList" :commentList="orderInfo.commentList" />
        </el-card>
        <el-input class="mt5" type="textarea" :rows="2" placeholder="请输入内容" v-model="comment">
        </el-input>
        <div class="flex-end mt5">
          <el-button @click="submitComment" type="primary">{{
            $t("保存")
          }}</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-button v-if="canEdit" v-show="currentTab === '1'" :loading="submitLoading" class="submit-btn"
      :disabled="!canEdit || !orderInfo.editable" @click="updatedWorkOrder" type="primary">{{ $t("保存") }}</el-button>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "@vue/composition-api";
import SetupLanguage from '../../components/SetupLanguage.vue';
import FilterBySubject from "@/components/FilterItem/CommodityFilter/FilterBySubject";
import CommentTimeline from "./CommentTimeline.vue";

export default {
  components: {
    SetupLanguage,
    FilterBySubject,
    CommentTimeline,
  },
  setup(props, { root, emit, refs }) {
    const showCommentInput = ref(false);
    const showAndFocusCommentInput = () => {
      showCommentInput.value = true;
      console.log(showCommentInput.value)
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
      currentTab: '1',
      onChangeUser: (user) => {
        businessUser.value = {
          businessUserId: user.userInfo.id,
          businessUserName: user.userInfo.username,
          roleCode: 4,
        };
      },
      onBusinessUserChange: (id) => {
        const item = orderInfo.value.businessUserInfoList.find((e) => e.businessUserId === id);
        if (item) {
          businessUser.value = item;
        }
      }
    };
  },
}
</script>

<style lang="scss" scoped>
.work-order-detail {
  position: relative;
  min-height: 100%;
  background-color: #fff;
  padding: 10px 20px 40px 20px;

  ::v-deep .el-tabs__content {
    padding: 20px 0;
  }
}

.flex-end {
  display: flex;
  justify-content: flex-end;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wo-title {
  font-size: 20px;
  font-weight: bold;
}

.wo-content {
  margin-top: 20px;
  font-size: 16px;

  ::v-deep img {
    max-width: 100%;
  }

  ::v-deep iframe {
    width: 100%;
  }
}

.submit-btn {
  position: sticky;
  bottom: 20px;
  width: 100%;
}

.comment-card {
  ::v-deep .el-card__body {
    padding: 20px 5px;
  }
}

.sm-text {
  font-size: 12px;
  line-height: 1.2;
  color: #666;
}
</style>
