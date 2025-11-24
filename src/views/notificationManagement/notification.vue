<template>
  <div class="notification-wrap">
    <div class="page-title">
      {{ readOnly ? $t("查看消息") : taskId ? $t("编辑消息") : $t("新建消息") }}
    </div>
    <el-form
      v-loading="isSaveLoading"
      ref="formRef"
      :model="form"
      label-width="100px"
      :rules="rules"
    >
      <!--============== 所属业务 ================-->
      <el-card class="mb10">
        <div slot="header" class="clearfix">{{ $t("所属业务") }}</div>
        <el-form-item label="" prop="applicationId">
          <el-radio-group
            v-model="form.applicationId"
            :disabled="readOnly"
            @change="handleChangeApplication"
          >
            <el-radio
              v-for="item in applicationList"
              :key="item.id"
              :label="item.id"
              >{{
                isEn ? getTranslateText(item.name, languageList) : item.name
              }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-card>
      <div class="card-wrap">
        <!-- ==================== 基础信息 ==================== -->
        <el-card class="mb10 top-card mr20">
          <div slot="header" class="clearfix">{{ $t("基础信息") }}</div>
          <el-form-item :label="$t('概要')" prop="name">
            <span v-if="readOnly">{{ form.name || "-" }}</span>
            <el-input
              v-else
              v-model="form.name"
              :placeholder="$t('请输入')"
              size="small"
              maxlength="30"
              show-word-limit
              type="textarea"
              :autosize="{ minRows: 1 }"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('简介')" prop="description">
            <span v-if="readOnly">{{ form.description || "-" }}</span>
            <el-input
              v-else
              type="textarea"
              :autosize="{ minRows: 4 }"
              v-model="form.description"
              size="small"
              maxlength="200"
              show-word-limit
              :placeholder="$t('请输入')"
            ></el-input>
          </el-form-item>
        </el-card>

        <!-- ==================== 目标用户 ==================== -->
        <el-card class="mb10 top-card" v-loading="isLoadBussiness">
          <div slot="header" class="clearfix">{{ $t("目标用户") }}</div>
          <el-form-item :label="$t('发送角色')" prop="role">
            <el-radio-group
              v-model="form.role"
              :disabled="readOnly"
              @change="getBussinesByRole($event, 'clear')"
            >
              <el-radio
                v-for="role in roles"
                :key="role.value"
                :label="role.value"
                >{{
                  isEn ? getTranslateText(role.name, languageList) : role.name
                }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('目标用户')" prop="businessId">
            <el-radio-group
              :disabled="readOnly"
              v-model="form.businessId"
              class="column-radio"
              @change="() => filterTriggerTypes(true)"
            >
              <div v-for="_bussiness in business" :key="_bussiness.value">
                <el-radio :label="_bussiness.value">
                  {{
                    isEn
                      ? getTranslateText(_bussiness.name, languageList)
                      : _bussiness.name
                  }}
                </el-radio>
                <span
                  class="tag-wrap mb5"
                  v-if="
                    _bussiness.value === TARGET_USER_TYPE.TAG &&
                    form.businessId === TARGET_USER_TYPE.TAG
                  "
                >
                  <span v-if="form.tagId">
                    <el-tag
                      v-for="tag in form.tagId"
                      :key="tag.value"
                      class="mr5"
                    >
                      {{ getTagLabel(tag.label || tag.name) }}
                    </el-tag>
                  </span>
                  <el-button
                    :disabled="readOnly"
                    class="ml10"
                    type="text"
                    @click="isShowTagDialog = true"
                    >{{ $t("选择") }}</el-button
                  >
                </span>
                <el-upload
                  :disabled="readOnly"
                  v-if="
                    _bussiness.value === TARGET_USER_TYPE.SELF &&
                    form.businessId === TARGET_USER_TYPE.SELF
                  "
                  v-loading="loading"
                  :show-file-list="false"
                  :http-request="uploadFile"
                  list-type="text"
                  accept=".xls,.xlsx"
                  :element-loading-text="$t('上传中...')"
                  :file-list="fileList"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                >
                  <el-button :disabled="readOnly" size="small" type="primary">{{
                    $t("点击上传")
                  }}</el-button>
                  <div slot="tip" class="el-upload__tip">
                    <span
                      v-if="form.tagTmpId"
                      class="mr10"
                      style="color: #67c23a"
                      >{{ $t("上传成功") }}<i class="el-icon-success"></i></span
                    >{{ $t("支持xls,xlsx类型，最多上传1万条数据") }}
                    <el-button @click="downLoad" type="text">{{
                      $t("下载示例")
                    }}</el-button>
                  </div>
                </el-upload>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-card>
      </div>

      <!--===================  发送设置 ====================  -->
      <el-card class="mb10" v-loading="isLoadTrigger">
        <div slot="header" class="clearfix">{{ $t("发送设置") }}</div>
        <el-form-item :label="$t('发送时间')" prop="triggerType">
          <el-radio-group
            :disabled="readOnly"
            v-model="form.triggerType"
            class="column-radio"
            @change="handleTriggerTypeChange"
          >
            <div v-for="filter in triggerTypes" :key="filter.triggerType">
              <el-radio :label="filter.triggerType">
                {{
                  isEn
                    ? getTranslateText(filter.name, languageList)
                    : filter.name
                }}
              </el-radio>
              <!-- 定时发送 -->
              <el-date-picker
                v-model="form.sendTime"
                v-if="
                  form.triggerType === SEND_TIME.ONCE &&
                  filter.triggerType === SEND_TIME.ONCE
                "
                :placeholder="$t('选择日期时间')"
                style="width: 200px"
                type="datetime"
              >
              </el-date-picker>
              <!-- 循环发送-->
              <div
                v-if="
                  form.triggerType === SEND_TIME.CYCLE &&
                  filter.triggerType === SEND_TIME.CYCLE
                "
                class="interval-box"
              >
                <el-select
                  v-model="form.sendInterval"
                  :disabled="readOnly"
                  @change="handleChangeCycle"
                >
                  <el-option
                    v-for="item in filter.value"
                    :key="item.value"
                    :label="
                      isEn
                        ? getTranslateText(item.name, languageList)
                        : item.name
                    "
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div
                  v-if="form.sendInterval === TIMES_ENUM.WEEK"
                  style="display: inline-block"
                >
                  <el-select
                    v-model="form.sendIntervalWeek"
                    :disabled="readOnly"
                  >
                    <el-option
                      v-for="item in filter.value[1].sendIntervalWeek"
                      :key="item.value"
                      :label="
                        isEn
                          ? getTranslateText(item.name, languageList)
                          : item.name
                      "
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-time-picker
                    :disabled="readOnly"
                    v-if="form.sendIntervalWeek"
                    v-model="form.sendTime"
                    :picker-options="{
                      selectableRange: '00:00:00 - 23:59:59',
                    }"
                    :placeholder="$t('选择时间')"
                  >
                  </el-time-picker>
                </div>
                <el-time-picker
                  :disabled="readOnly"
                  v-if="form.sendInterval === TIMES_ENUM.DAY"
                  v-model="form.sendTime"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59',
                  }"
                  :placeholder="$t('选择时间')"
                >
                </el-time-picker>
              </div>
              <!-- 事件发送-->
              <div
                v-if="
                  form.triggerType === SEND_TIME.EVENT &&
                  filter.triggerType === SEND_TIME.EVENT
                "
                class="send-box"
              >
                <el-select
                  :disabled="readOnly"
                  v-model="form.filterId"
                  @change="getEventBeforeOrLaterList($event, 'clear')"
                  style="width: 400px"
                >
                  <el-option
                    v-for="item in filter.value"
                    :key="item.value"
                    :label="
                      isEn
                        ? getTranslateText(item.name, languageList)
                        : item.name
                    "
                    :value="item.id"
                  ></el-option>
                </el-select>

                <el-select
                  v-model="filterParameter.EVENT_PRE_AFTER"
                  :disabled="readOnly"
                  @change="getEventUnits"
                >
                  <el-option
                    v-for="item in beforeOrLaterList"
                    :key="item.value"
                    :label="
                      isEn
                        ? getTranslateText(item.name, languageList)
                        : item.name
                    "
                    :value="+item.value"
                  ></el-option>
                </el-select>
                <div
                  class="send-box event-time-box"
                  v-if="
                    filterParameter.EVENT_PRE_AFTER ===
                      SENT_EVENT_TIMES.BEFORE ||
                    filterParameter.EVENT_PRE_AFTER === SENT_EVENT_TIMES.AFTER
                  "
                >
                  <el-input
                    v-model="filterParameter.EVENT_TIME_VALUE"
                    :disabled="readOnly"
                    :placeholder="$t('请输入')"
                    type="text"
                  ></el-input>
                  <el-select
                    v-model="filterParameter.EVENT_TIME_UNIT"
                    :disabled="readOnly"
                  >
                    <el-option
                      v-for="item in eventUnitList"
                      :key="item.value"
                      :label="
                        isEn
                          ? getTranslateText(item.name, languageList)
                          : item.name
                      "
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <el-time-select
                  v-model="form.filterHourMinute"
                  :disabled="readOnly"
                  v-if="filterParameter.EVENT_TIME_UNIT === DAY_MINUTES.DAY"
                  :picker-options="{
                    start: '00:00',
                    step: '00:01',
                    end: '23:59',
                  }"
                  :placeholder="$t('选择时间')"
                >
                </el-time-select>
              </div>
            </div>
          </el-radio-group>
          <p class="tip">{{ $t("设置的消息发送时间均为北京时间") }}</p>
        </el-form-item>
      </el-card>

      <!--====================== 通知主体 ==================== -->
      <el-card class="mb10" v-loading="isLoadBussiness">
        <div slot="header" class="clearfix">{{ $t("通知主体") }}</div>
        <el-form-item :label="$t('通知方式')" prop="method">
          <el-checkbox-group
            v-model="form.method"
            :disabled="readOnly"
            @change="handleTplDirty"
          >
            <el-checkbox
              v-for="item in channels"
              :key="item.name"
              :label="item"
            >
              {{ isEn ? getTranslateText(item.name, languageList) : item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- 模板 -->
        <div v-for="(method, index) in form.method" :key="method.value">
          <commonTemplateFormVue
            :languageList="languageList"
            :channel="method"
            :readOnly="readOnly"
            :taskId="taskId"
            :tplIds="form.templateIds"
            :filterId="form.filterId"
            :tagId="form.tagId"
            :ref="'tplFormRef' + index"
            :channelTemplateInfos="form.channelTemplateInfos"
          />
        </div>
      </el-card>

      <!--====================== 操作日志 ====================-->
      <el-card class="mb10" v-loading="isLoadLog" v-if="taskId">
        <el-table
          :data="logData"
          tooltip-effect="dark"
          :border="false"
          fit
          show-overflow-tooltip="true"
          class="calculate-table"
          :cell-style="{ textAlign: 'center' }"
          stripe
        >
          <el-table-column
            align="center"
            prop="opUsername"
            :label="$t('操作人')"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="opStatus"
            :label="$t('操作记录')"
          >
            <template slot-scope="{ row }">
              <span>{{
                isEn
                  ? getTranslateText(row.opStatus, languageList)
                  : row.opStatus
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="createTime"
            :label="$t('操作时间')"
          >
            <template slot-scope="{ row }">
              <span>
                {{ DateTimeUtils.dateClockTime(row.createTime) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-form-item class="footer" v-if="!readOnly">
        <el-button type="primary" @click="beforeSubmit">{{
          $t("保存")
        }}</el-button>
        <el-button @click="onCancel">{{ $t("取消") }}</el-button>
      </el-form-item>
    </el-form>

    <TagDialog
      v-if="isShowTagDialog"
      :visible.sync="isShowTagDialog"
      @successCb="handleTagChange"
      :tagIds="form.tagId"
      :id="taskId"
      :businessId="form.role"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  computed,
  watch,
  ref,
  unref,
  toRefs,
  onMounted,
} from "@vue/composition-api";
import Constants, { SOURCE } from "./data/constants";
import {
  TARGET_USER_TYPE,
  SEND_TIME,
  WECHAT_JUMP,
  ROLE_TYPE,
  NOTIFICE_METHOD,
  TIMES_ENUM,
  SENT_EVENT_TIMES,
  DAY_WEEK,
  DAY_MINUTES,
  EVENT_PARAMS,
  LANG_TYPE,
  EDIT_TYPE,
} from "./data/enum";
import TagDialog from "./components/tagDialog.vue";
import commonTemplateFormVue from "./components/commonTemplateForm.vue";
import { getApplicationList } from "@/api/notificationManagement";
import { form } from '../Task/newStudents';

export default defineComponent({
  components: { TagDialog, commonTemplateFormVue },
  setup(props, { root, refs, emit }) {
    const userName = JSON.parse(
      window.localStorage.getItem("userInfo")
    ).username;
    const taskId = ref(-1);
    const readOnly = ref(false);
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const beforeOrLaterList = ref(null);
    const eventUnitList = ref(null);
    const isDirtyTpl = ref(false);
    const logData = ref(null);
    const languageList = ref(null);
    const { msgTaskTemplateList, makeUpTemplateData } = usePushTpl(root);

    const applicationList = ref(null);

    const flagState = reactive({
      isShowTagDialog: false,
      loading: false,
      isLoadBussiness: false,
      isLoadTrigger: false,
      isSaveLoading: false,
      isLoadLog: false,
    });

    const roleAndBussiness = reactive({
      roles: [], // 角色
      business: [], // 目标用户
      channels: [], // 渠道
    });

    let rules = ref({});

    const form = reactive({
      name: "",
      description: "",
      role: ROLE_TYPE.PARENT, // 角色
      businessId: TARGET_USER_TYPE.ALL, // 目标用户
      triggerType: "", // 发送时机
      sendInterval: "",
      sendIntervalWeek: "",
      filterId: "",
      tagId: "",
      lastSendTime: "",
      sendTime: "",
      method: [],
      filterHourMinute: "",
      tagTmpId: "",
      applicationId: "", // 所属业务
    });

    const otherState = reactive({
      role: ROLE_TYPE.PARENT,
      triggerTypes: [],
      prevTriggerTypes: [],
      filterParameter: {
        EVENT_PRE_AFTER: "",
        EVENT_TIME_UNIT: "",
        EVENT_TIME_VALUE: "",
      },
    });

    watch(
      () => otherState.filterParameter,
      (val) => {
        if (val && val.EVENT_TIME_UNIT === DAY_MINUTES.MINUTES) {
          form.filterHourMinute = "";
        }
      },
      { deep: true }
    );

    watch(isEn, () => {
      initData();
    });
    const initData = () => {
      rules.value = {
        triggerType: [
          {
            type: "number",
            validator: (rule, value, callback) => {
              if (!value && value !== SEND_TIME.RIGHT)
                callback(new Error(root.$t("不能为空")));
              if (value === SEND_TIME.ONCE && !form.sendTime)
                callback(new Error(root.$t("不能为空")));
              if (value === SEND_TIME.CYCLE) {
                if (!form.sendInterval)
                  callback(new Error(root.$t("不能为空")));
                if (form.sendInterval === TIMES_ENUM.DAY && !form.sendTime)
                  callback(new Error(root.$t("不能为空")));
                if (
                  form.sendInterval === TIMES_ENUM.WEEK &&
                  (!form.sendIntervalWeek || !form.sendTime)
                )
                  callback(new Error(root.$t("不能为空")));
                callback();
              }
              if (value === SEND_TIME.EVENT) {
                if (!form.filterId) callback(new Error(root.$t("不能为空")));
                if (otherState.filterParameter) {
                  const { EVENT_PRE_AFTER, EVENT_TIME_UNIT, EVENT_TIME_VALUE } =
                    otherState.filterParameter;
                  if (EVENT_PRE_AFTER && !EVENT_TIME_UNIT)
                    callback(new Error(root.$t("不能为空")));
                  if (EVENT_PRE_AFTER !== 0) {
                    if (!EVENT_TIME_UNIT)
                      callback(new Error(root.$t("不能为空")));
                    if (
                      EVENT_TIME_UNIT === DAY_MINUTES.DAY &&
                      (!EVENT_TIME_VALUE || !form.filterHourMinute)
                    )
                      callback(root.$t("不能为空"));
                    if (
                      EVENT_TIME_UNIT === DAY_MINUTES.MINUTES &&
                      !EVENT_TIME_VALUE
                    )
                      callback(new Error(root.$t("不能为空")));
                  }
                }
              }
              callback();
            },
            trigger: "change",
          },
        ],
        applicationId: [
          { required: true, message: root.$t("不能为空"), trigger: "change" },
        ],
        name: [
          { required: true, message: root.$t("不能为空"), trigger: "change" },
        ],
        description: [
          { required: true, message: root.$t("不能为空"), trigger: "change" },
        ],
        role: [
          { required: true, message: root.$t("不能为空"), trigger: "change" },
        ],
        businessId: [
          { required: true, message: root.$t("不能为空"), trigger: "change" },
        ],
        method: [
          { required: true, message: root.$t("不能为空"), trigger: "change" },
        ],
      };
    };

    const handleTriggerTypeChange = (type) => {
      Object.assign(form, {
        lastSendTime: "",
        sendTime: "",
        filterHourMinute: "",
        filterId: "",
        sendIntervalWeek: "",
        sendInterval: "",
      });
      Object.assign(otherState, {
        filterParameter: {
          EVENT_PRE_AFTER: "",
          EVENT_TIME_UNIT: "",
          EVENT_TIME_VALUE: "",
        },
      });
    };

    const handleChangeCycle = () => {
      form.sendIntervalWeek = "";
      form.sendTime = "";
    };

    const getApplicationData = async () => {
      applicationList.value = await getApplicationList();
      if (!taskId.value) {
        form.applicationId = applicationList.value[0]?.id;
        getBasicInfoAndTargetUser();
      }
    };

    const getEventBeforeOrLaterList = (filterId, clear) => {
      if (clear) {
        Object.assign(otherState, {
          filterParameter: {
            EVENT_PRE_AFTER: "",
            EVENT_TIME_UNIT: "",
            EVENT_TIME_VALUE: "",
          },
        });
      }
      try {
        beforeOrLaterList.value = otherState.triggerTypes
          .find((t) => t.triggerType === SEND_TIME.EVENT)
          ?.value?.find((t) => t.id === filterId).value[0]?.input;
      } catch {
        beforeOrLaterList.value = [];
      }
    };

    const getEventUnits = () => {
      eventUnitList.value = otherState.triggerTypes
        .find((t) => t.triggerType === SEND_TIME.EVENT)
        ?.value?.find((t) => t.id === form.filterId)
        ?.value?.find((t) => t.name === EVENT_PARAMS.EVENT_TIME_UNIT)?.input;
    };

    const downLoad = () => {
      location.href =
        "https://s3.us-west-1.amazonaws.com/media.pplingo.com/templates/MessageTouch/template2022_2.xlsx";
    };

    const handleTplDirty = () => {
      isDirtyTpl.value = true;
    };

    const getTagLabel = (tag) => {
      if (!tag) return;
      return tag.length > 5 ? tag.slice(0, 5) + "..." : tag;
    };

    const handleChangeApplication = () => {
      getBasicInfoAndTargetUser();
    };

    const handleTagChange = (tags) => {
      form.tagId = tags;
      flagState.isShowTagDialog = false;
      filterTriggerTypes(true);
    };

    const getBussinesByRole = (role, clear) => {
      roleAndBussiness.business = roleAndBussiness.roles.find(
        (item) => item.value === role
      ).tag;
      roleAndBussiness.channels = roleAndBussiness.roles.find(
        (item) => item.value === role
      ).channel;
      form.method = [];
      if (clear) {
        (form.filterId = ""), (form.sendTime = ""), (form.triggerType = "");
        otherState.filterParameter = {
          EVENT_PRE_AFTER: "",
          EVENT_TIME_UNIT: "",
          EVENT_TIME_VALUE: "",
        };
      }
      getTaskFilter(taskId.value, role);
    };

    const getTaskFilter = (id, businessId) => {
      flagState.isLoadTrigger = true;
      return root.$Api.notificationManagement
        .getTaskFilter(id, businessId)
        .then(({ data, status }) => {
          if (data.code !== 200 || status !== 200) {
            return Promise.reject();
          }
          Object.assign(otherState, {
            triggerTypes: data.data,
            prevTriggerTypes: data.data,
          });
          if (otherState.filterParameter && taskId.value) {
            getEventBeforeOrLaterList(form.filterId);
            getEventUnits(form.filterId);
          }
          flagState.isLoadTrigger = false;
          filterTriggerTypes();
        })
        .catch((e) => {
          console.log(e);
          flagState.isLoadTrigger = false;
          otherState.triggerTypes = [];
          otherState.prevTriggerTypes = [];
        });
    };

    const getMessageDetail = (id) => {
      root.$Api.notificationManagement
        .getMessageDetail(id)
        .then(({ status, data }) => {
          if (status !== 200 || data.code !== 200) return Promise.reject();
          mapDataToState(data.data);
        })
        .catch(() => {});
    };

    const getBasicInfoAndTargetUser = () => {
      flagState.isLoadBussiness = true;
      root.$Api.notificationManagement
        .getBasicInfoAndTargetUser(taskId.value, form.applicationId)
        .then(({ data, status }) => {
          if (data.code !== 200 || status !== 200) {
            return Promise.reject();
          }
          roleAndBussiness.roles = data.data.business;
          flagState.isLoadBussiness = false;
          getBussinesByRole(form.role || ROLE_TYPE.PARENT);
          form.method = roleAndBussiness.channels.filter((t) => t.selected);
        })
        .catch(() => {
          flagState.isLoadBussiness = false;
          roleAndBussiness.roles = [];
        });
    };

    const getFormPromise = (formItem) => {
      return new Promise((resolve) => {
        const form = formItem.ref;
        form.validate((res) => {
          const { titleEn, contentEn, action } = form.model;
          const tplItem = Object.assign({}, form.model, formItem.channel, {
            channelId: formItem.channel.value,
            language: titleEn || contentEn ? "ZH" : "",
            action: action || 0,
          });
          makeUpTemplateData(tplItem);
          resolve(res);
        });
      });
    };

    const beforeSubmit = () => {
      const tplValidateBatchQueue = form.method.map((item, index) => {
        const validateComp = `tplFormRef${index}`;
        return {
          ref: refs[validateComp][0].$refs.tplFormRef,
          channel: item,
        };
      });
      Promise.all(tplValidateBatchQueue.map(getFormPromise)).then(
        (valid) => {
          const validateResult = valid.every((item) => !!item);
          if (validateResult) {
            refs.formRef.validate((valid) => {
              if (valid) {
                onSubmit();
              } else {
                return false;
              }
            });
          } else {
            return false;
          }
        },
        () => {}
      );
    };

    const mapDataToState = async (originData) => {
      Object.assign(form, originData, {
        role: originData.businessId,
        businessId: originData.tagTmpId
          ? TARGET_USER_TYPE.SELF
          : originData.tagId
          ? TARGET_USER_TYPE.TAG
          : TARGET_USER_TYPE.ALL,
      });
      if (originData.filterParameter) {
        const filterObj = JSON.parse(originData.filterParameter);
        Object.assign(otherState, { filterParameter: filterObj });
      }
      if (originData.tagId) {
        const {
          status,
          data: { code, data },
        } = await root.$Api.notificationManagement.getTagList(
          taskId.value,
          form.role
        );
        if (status !== 200 || code !== 200) {
          return Promise.reject();
        }
        form.tagId = data
          .filter((t) => {
            return originData.tagId?.split(",").includes(t.id + "");
          })
          .map((t) => {
            return { label: t.name, value: t.id, type: t.type };
          });
      }
      getBasicInfoAndTargetUser();
    };

    const validateAll = () => {
      if (form.businessId === TARGET_USER_TYPE.SELF && !form.tagTmpId) {
        root.$notify.error("请上传文件！");
        return false;
      }
      if (form.businessId === TARGET_USER_TYPE.TAG && !form.tagId?.length) {
        root.$notify.error("请选择标签！");
        return false;
      }
      return true;
    };

    const getFinalMsgTplList = (list) => {
      const finalChannelIds = form.method.map((t) => t.value);
      return list.filter((item) => finalChannelIds.includes(item.channelId));
    };

    const onSubmit = () => {
      const validate = validateAll();
      if (!validate) {
        return;
      }
      flagState.isSaveLoading = true;
      const submitData = {
        ...form,
        source: SOURCE,
        filterParameter:
          form.triggerType === SEND_TIME.EVENT
            ? JSON.stringify(otherState.filterParameter)
            : "",
        msgTaskTemplateList: getFinalMsgTplList(msgTaskTemplateList.value),
        businessId: form.role,
        tagTmpId:
          form.businessId === TARGET_USER_TYPE.SELF ? form.tagTmpId : "",
        tagId:
          form.businessId === TARGET_USER_TYPE.ALL || form.tagTmpId
            ? ""
            : (form.tagId || []).map((t) => t.value).join(","),
        sendIntervalWeekMonth: 0,
        updateUser: userName,
        createUser: form.createUser || userName,
        sendTime:
          form.triggerType === SEND_TIME.RIGHT ? new Date() : form.sendTime,
        sendIntervalWeek:
          form.triggerType !== SEND_TIME.CYCLE ||
          form.sendInterval === DAY_WEEK.DAY
            ? 0
            : form.sendIntervalWeek,
        sendInterval:
          form.triggerType !== SEND_TIME.CYCLE ? 0 : form.sendInterval,
        filterId: form.triggerType === SEND_TIME.EVENT ? form.filterId : 0,
      };
      delete submitData.role;
      delete submitData.method;
      delete submitData.templateIds;
      delete submitData.business;
      delete submitData.channelTemplateInfos;
      taskId.value && Object.assign(submitData, { id: taskId.value });
      if (form.tagId) {
        const tagTypes = [];
        const tagNames = [];
        form.tagId.forEach(item => {
            tagTypes.push(item.type);
            tagNames.push(item.label);
        });
        submitData.tagType = tagTypes.join(',');
        submitData.tagName = tagNames.join(',');
      }

      root.$Api.notificationManagement
        .saveMessage(submitData)
        .then(({ data, status }) => {
          if (data.code !== 200 || status !== 200) return Promise.reject();
          root.$notify.success(root.$t("操作成功"));
          flagState.isSaveLoading = false;
          setTimeout(() => {
            root.$router.push({
              name: "notificationList",
              query: { isLoad: true },
            });
          }, 800);
        })
        .catch(() => {
          root.$notify.error(root.$t("操作失败"));
          flagState.isSaveLoading = false;
        });
    };

    const uploadFile = (e) => {
      const header = {
        "Content-type": "multipart/form-data",
        authorization: `Bearer ${
          JSON.parse(window.localStorage.getItem("userInfo")).jwtToken
        }`,
      };
      flagState.loading = true;
      const cancelToken = root.$Axios.CancelToken;
      const source = cancelToken.source();
      let fm = new FormData();
      fm.append("file", e.file);
      fm.append("businessId", form.businessId);
      fm.append("createUserName", userName);
      root
        .$Axios({
          method: "post",
          url: `${process.env.VUE_APP_BASE_API}/opsapi/pubmessagecenter/opsapi/task/add/import`,
          data: fm,
          responseType: "application/json",
          headers: header,
          cancelToken: source.token,
        })
        .then(({ data, status }) => {
          if (status !== 200 || data.code !== 200) {
            return Promise.reject();
          }
          form.tagTmpId = data.data;
          root.$notify.success(root.$t("上传成功"));
          flagState.loading = false;
        })
        .catch(() => {
          root.$notify.error(root.$t("上传失败"));
          flagState.loading = false;
        });
    };

    const onCancel = () => {
      root.$router.push({ name: "notificationList" });
    };

    const getLogData = async (id) => {
      flagState.isLoadLog = true;
      try {
        const {
          status,
          data: { code, data },
        } = await root.$Api.notificationManagement.getOptLogList(id);
        if (status !== 200 || code !== 200) return Promise.reject();
        logData.value = data;
      } catch {
        logData.value = [];
      } finally {
        flagState.isLoadLog = false;
      }
    };

    const getLangList = () => {
      root.$Api.notificationManagement
        .getLanguageList()
        .then(({ data: { code, data }, status }) => {
          if (code !== 200 || status !== 200) return Promise.reject();
          languageList.value = data;
        })
        .catch(() => {});
    };
    // 过滤发送设置
    const filterTriggerTypes = (isChange = false) => {
        return /* 张梁要求注释 */
        if (form.businessId !== TARGET_USER_TYPE.TAG) {
            otherState.triggerTypes = otherState.prevTriggerTypes;
        } else {
            const typeArr = form.tagId && form.tagId.filter(item => {
                return item.type === 3;
            }) || [];
            if (typeArr.length) {
                otherState.triggerTypes = otherState.triggerTypes.filter(item => {
                    return item.triggerType !== 2 && item.triggerType !== 3;
                });
            } else {
                otherState.triggerTypes = otherState.prevTriggerTypes;
            }
        }
        isChange && (form.triggerType = '');
    };

    initData();

    onMounted(async () => {
      getLangList();
      const { id, isRead } = root.$route.query;
      taskId.value = id;
      readOnly.value = isRead;
      getApplicationData();
      if (id) {
        getMessageDetail(id);
        getLogData(id);
      }
    });

    return {
      taskId,
      isEn,
      readOnly,
      form,
      isDirtyTpl,
      beforeOrLaterList,
      eventUnitList,
      logData,
      rules,
      applicationList,
      ...toRefs(roleAndBussiness),
      ...toRefs(flagState),
      ...toRefs(otherState),
      languageList,

      onSubmit,
      beforeSubmit,
      onCancel,
      handleTagChange,
      downLoad,
      uploadFile,
      getBasicInfoAndTargetUser,
      handleChangeApplication,
      getTagLabel,
      getBussinesByRole,
      getEventBeforeOrLaterList,
      handleTriggerTypeChange,
      handleTplDirty,
      getLogData,
      handleChangeCycle,
      getEventUnits,
      filterTriggerTypes,

      /** constansts */
      getSendRoles: Constants.getSendRoles,
      getAppTypes: Constants.getAppTypes,
      getSendWeeks: Constants.getSendWeeks,
      getSendDays: Constants.getSendDays,
      getSendCycles: Constants.getSendCycles,
      getTranslateText: Constants.getTranslateText,
      WECHAT_JUMP,
      SEND_TIME,
      NOTIFICE_METHOD,
      TARGET_USER_TYPE,
      TIMES_ENUM,
      SENT_EVENT_TIMES,
      DAY_MINUTES,
      EVENT_PARAMS,
    };
  },
});

const usePushTpl = (root) => {
  const userName = JSON.parse(window.localStorage.getItem("userInfo")).username;
  const msgTaskTemplateList = ref([]);

  const makeUpTemplateData = (tplData) => {
    try {
      const {
        templateId,
        msgType,
        title,
        action,
        image,
        language,
        url,
        content,
        channelId,
        page,
        status,
        titleEn,
        contentEn,
      } = tplData;
      const currentIndex = msgTaskTemplateList.value.findIndex(
        (item) => item.channelId === channelId
      );
      let submitTplData;
      if (tplData.templateEditable === EDIT_TYPE.PART) {
        submitTplData = {
          templateId,
          status,
          msgType,
          title,
          action,
          image: image || "",
          language,
          url: url || "",
          channelId,
          createUser: form.createUser || userName,
          updateUser: userName,
          url:
            action === WECHAT_JUMP.LINK
              ? url || ""
              : action === WECHAT_JUMP.OPEN_APP
              ? page
              : "",
        };
        if (tplData.channelId === NOTIFICE_METHOD.ACCOUNT_PUSH ||tplData.channelId ===32) {
          if (content) {
            let o = {};
            content.map((t, i) => {
              o[t.key || i] = t.value;
            });
            submitTplData.content = JSON.stringify(o);
          }
        } else {
          if (content && Array.isArray(content)) {
            let o = {};
            const { matchContent } = tplData;
            content.map((t, i) => {
              if (matchContent[i]) {
                const _k = matchContent[i].slice(2, matchContent[i].length - 2);
                o[_k] = t.value;
              }
            });
            submitTplData.content = JSON.stringify(o);
          } else {
            submitTplData.content = content;
          }
        }
      } else {
        submitTplData = {
          templateId: templateId || "",
          status: status || 1,
          msgType,
          title: title || "",
          action,
          image: image || "",
          language,
          content,
          url:
            action === WECHAT_JUMP.LINK
              ? url || ""
              : action === WECHAT_JUMP.OPEN_APP
              ? page
              : "",
          channelId,
          createUser: form.createUser || userName,
          updateUser: userName,
        };
      }
      if (currentIndex > -1) {
        if (tplData.languageType === LANG_TYPE.MULTI) {
          const enItem = {
            ...submitTplData,
            title: titleEn,
            content: contentEn,
            language: "EN",
          };
          msgTaskTemplateList.value[currentIndex] = submitTplData;
          msgTaskTemplateList.value[currentIndex + 1] = enItem;
        } else {
          msgTaskTemplateList.value[currentIndex] = submitTplData;
        }
      } else {
        const enItem = {
          ...submitTplData,
          title: titleEn,
          content: contentEn,
          language: "EN",
        };
        if (tplData.languageType === LANG_TYPE.MULTI) {
          msgTaskTemplateList.value.push(submitTplData);
          msgTaskTemplateList.value.push(enItem);
        } else {
          msgTaskTemplateList.value.push(submitTplData);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return {
    msgTaskTemplateList,
    makeUpTemplateData,
  };
};
</script>
<style lang="scss" scoped>
.notification-wrap {
  padding: 10px 10px;
  .card-wrap {
    display: flex;
    .top-card {
      width: 50%;
      .upload-box {
        display: inline-block;
        .el-icon-upload2 {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .error-border {
    border: 1px solid red;
  }
  .footer {
    text-align: right;
    margin-bottom: 10px;
  }
  .send-box,
  .tag-wrap {
    display: inline-block;
  }
  .interval-box {
    display: inline-block;
    margin-bottom: 10px;
  }
  .tip {
    color: rgb(152, 150, 150);
  }
  ::v-deep .el-textarea .el-input__count {
    height: 12px;
    line-height: 12px;
  }
  ::v-deep .el-textarea textarea {
    padding-bottom: 20px;
  }
}

::v-deep .event-time-box {
  .el-input {
    display: inline-block;
    width: 130px;
  }
}
::v-deep .el-divider__text {
  color: #7580e5;
}
::v-deep .column-radio.el-radio-group {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  label {
    margin-bottom: 15px;
    display: inline-block;
  }
}
</style>
