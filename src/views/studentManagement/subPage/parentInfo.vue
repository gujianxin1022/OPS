<template>
  <div class="parent-info-wrap">
    <template v-if="parentBasicInfo.status !== -1">
      <div v-if="parentBasicInfo.status !== 3">
        <el-alert
          :title="$t('该账号申请删除中，请勿操作！')"
          type="warning"
          show-icon
          :closable="false"
          style="margin-bottom: 10px"
          v-if="parentBasicInfo.deleteApplyStatus"
        >
        </el-alert>
        <el-alert
          :title="
            $t(
              '注意：请将用户账号与其微信绑定（无微信除外），否则后续可能会影响约课和下单。'
            )
          "
          type="warning"
          show-icon
          v-show="isShowBindWaring"
          center
          :closable="false"
          style="margin-bottom: 10px; font-weight: 700; color: #fd6f09"
        >
        </el-alert>
        <el-card
          class="box-card-class"
          shadow="hover"
          v-loading="baseInfoLoading"
        >
          <div slot="header" class="flex">
            <span>{{ $t("Basic information") }}</span>
            <div>
              <el-button type="primary" @click="showDeviceCheckDrawer"
                >{{ $t("设备检测记录") }}
                <i
                  v-if="deviceCheckInfo.deviceCheckCode != 3"
                  class="el-icon-warning"
                  style="
                    margin-top: -15px;
                    color: red;
                    margin-right: -20px;
                    float: right;
                  "
                ></i>
                <!-- v-if="!studentInfo.studentName" -->
              </el-button>
              <el-button type="primary" @click="showDrawer" plain>{{
                $t("跟进记录")
              }}</el-button>
              <el-button type="primary" @click="imDrawerVisible = true" plain>{{
                $t("会话记录")
              }}</el-button>
              <el-button
                type="primary"
                @click="evaluationsDrawerVisible = true"
                plain
                >{{ $t("用户评价") }}</el-button
              >
            </div>
          </div>
          <div class="base-info-wrap">
            <li>
              <div class="label">{{ $t("username") }}</div>
              <EditUserName
                :userName="parentBasicInfo.userName"
                :parentId="parentId"
                @updateParentInfo="
                  (val) => {
                    parentBasicInfo.userName = val;
                  }
                "
              />
            </li>
            <li>
              <span class="label">{{ $t("家长ID") }}</span>
              <span class="value">{{ parentBasicInfo.id }}</span>
            </li>
            <li>
              <div class="label">{{ $t("家长名字") }}</div>
              <el-input
                :placeholder="$t('请输入')"
                v-if="realNameIsEdit"
                maxlength="100"
                show-word-limit
                v-model.trim="parentBasicInfo.realName"
                @blur="handleSubmitParentInfo('realName')"
              />
              <span class="value" v-else>
                {{ parentBasicInfo.realName }}
              </span>
              <i
                class="el-icon-edit-outline"
                @click="realNameIsEdit = true"
                v-if="
                  Per.handleButtonPer(
                    'teach.studentMT.parentInfo.editParentName'
                  )
                "
              />
            </li>
            <li>
              <span class="label">{{ $t("wechat") }}</span>
              <span class="value">{{ parentBasicInfo.wechat }}</span>
            </li>
            <li>
              <span class="label">{{ $t("glb-Password") }}</span>
              <el-button
                :disabled="
                  !Per.handleButtonPer(
                    'teach.studentMT.parentInfo.olResetPassword'
                  )
                "
                type="text"
                class="value"
                @click="resetPassWord"
                >{{ $t("student-management-Reset Password") }}
              </el-button>
            </li>
            <li>
              <span
                class="label"
                :style="{ marginRight: currentLang === 'zh' ? '58px' : '90px' }"
              >
                {{ $t("email") }}
              </span>
              <EditUserEmail
                :email="parentBasicInfo.email"
                :parentId="parentId"
                @updateParentInfo="
                  (val) => {
                    parentBasicInfo.email = val;
                  }
                "
              />
              <UnverifiedTag
                v-if="
                  !parentBasicInfo.emailVerified &&
                  parentBasicInfo.email !== null
                "
                type="email"
              />
            </li>
            <li>
              <span class="label">WhatsApp</span>
              <span class="value">{{ parentBasicInfo.whatsapp }}</span>
            </li>
            <li>
              <span class="label">{{ $t("手机号码") }}</span>
              <FilterByUserPhone
                :phone="parentBasicInfo.phone"
                :userName="parentBasicInfo.userName"
                :countryCode="parentBasicInfo.countryCode"
                :parentId="parentId"
                @updateParentInfo="
                  (phone, countryCode) => {
                    parentBasicInfo.phone = phone;
                    parentBasicInfo.countryCode = countryCode;
                  }
                "
              />
              <TouchCall
                v-if="
                  Per.handleButtonPer('teach.studentMT.parentInfo.outboundcall')
                "
                :parentUserId="parentBasicInfo.id"
                type="P"
              ></TouchCall>
              <UnverifiedTag
                style="margin-left: 4px"
                v-if="
                  !parentBasicInfo.phoneVerified &&
                  parentBasicInfo.phone !== null
                "
                type="phone"
              />
            </li>
            <li>
              <span class="label">{{ $t("my-home-Registration Date") }}</span>
              <span class="value">{{
                DateTimeUtils.dateClockTime(parentBasicInfo.createTime)
              }}</span>
            </li>
            <li>
              <span class="label">{{
                $t("my-home-3-Country of Residence")
              }}</span>
              <span class="value">{{
                parentBasicInfo.countryOfResidence
              }}</span>
            </li>
            <li>
              <span class="label">{{ $t("Recent login") }}</span>
              <span class="value">{{
                DateTimeUtils.dateClockTime(parentBasicInfo.lastLoginTime)
              }}</span>
            </li>
            <li>
              <span class="label">{{ $t("家庭语言背景") }}</span>
              <span class="value">{{ parentBasicInfo.homeLanguage }}</span>
            </li>
            <li>
              <span class="label">{{ $t("消费归属地") }}</span>
              <span class="value">{{
                currentLang == "en"
                  ? parentBasicInfo.countryNameEn
                  : parentBasicInfo.countryName
              }}</span>
              <i
                v-if="
                  Per.handleButtonPer(
                    'teach.studentMT.parentInfo.placeOfConsumption'
                  )
                "
                style="cursor: pointer"
                class="iconfont ppIcon-approval"
                @click="vestEditor"
              />
            </li>
            <li>
              <span class="label">{{ $t("首单时间") }}</span>
              <span class="value">{{
                DateTimeUtils.dateClockTime(parentBasicInfo.firstPayTime)
              }}</span>
            </li>
            <li>
              <span class="label">{{ $t("用户类型") }}</span>
              <span class="value">{{
                parentBasicInfo.userSourceType || "-"
              }}</span>
            </li>
            <li>
              <span class="label">{{ $t("录像开关") }}</span>
              <span class="value">{{
                parentBasicInfo.personalVideoStatus === 0
                  ? $t("录像开关-开")
                  : $t("录像开关-关")
              }}</span>
            </li>
            <li>
              <span class="label">{{ $t("提醒管理") }}</span>
              <span class="value">
                <ReminderSettings />
              </span>
            </li>
            <li>
              <div class="label">
                {{ $t("服务语言偏好") }}
                <el-tooltip
                  :content="$t('修改后，影响用户接收的通知信息，客服语言')"
                  placement="top"
                  @click.stop.prevent
                >
                  <span style="cursor: pointer" class="el-icon-question" />
                </el-tooltip>
              </div>

              <SpecialLanguagesSelect
                :isDisabled="!specialLanguageIsEdit"
                :defaultValue="parentBasicInfo.specialLanguage"
                :specialLanguageDesc="parentBasicInfo.specialLanguageDesc"
                @change="
                  (val) => {
                    parentBasicInfo.specialLanguage = val;
                    handleSubmitParentInfo('specialLanguage');
                  }
                "
              />
              <i
                v-if="
                  Per.handleButtonPer(
                    'teach.studentMT.parentInfo.specialLanguagePer'
                  )
                "
                class="el-icon-edit-outline"
                @click="specialLanguageIsEdit = true"
              />
            </li>
            <li>
              <span class="label"
                >{{ $t("约课时区") }}
                <el-tooltip
                  :content="
                    $t(
                      '约课时区将会影响用户约课、调课和取消课程时课程时间的计算'
                    )
                  "
                  placement="top"
                  @click.stop.prevent
                >
                  <span style="cursor: pointer" class="el-icon-question" />
                </el-tooltip>
              </span>
              <span class="value">
                <UserTimeZone
                  :timeZone="parentBasicInfo.timeZone"
                  :parentId="parentId"
                  @updateParentInfo="
                    (val) => {
                      parentBasicInfo.timeZone = val;
                    }
                  "
              /></span>
            </li>
            <el-divider
              ><span>{{ $t("扩展信息") }}</span></el-divider
            >
            <div
              v-if="parentBasicInfo.managerExtParent"
              style="
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                position: relative;
              "
            >
              <i
                v-if="!isEdit"
                @click="isEdit = true"
                style="
                  position: absolute;
                  right: 0;
                  top: -10px;
                  cursor: pointer;
                "
                class="iconfont ppIcon-approval"
              />
              <div
                v-if="isEdit"
                style="
                  position: absolute;
                  right: -10px;
                  top: -30px;
                  cursor: pointer;
                "
              >
                <el-button
                  type="text"
                  @click="
                    isEdit = false;
                    getParentBasicInfo();
                  "
                  >{{ $t("取消") }}</el-button
                >
                <el-button type="text" @click="handleSureSave">{{
                  $t("确定")
                }}</el-button>
              </div>
              <li>
                <span class="label">{{ $t("家长称呼") }}</span>
                <span class="value" v-if="!isEdit">{{
                  parentBasicInfo.managerExtParent.alias
                }}</span>
                <el-input
                  style="width: 170px"
                  size="mini"
                  v-model="parentBasicInfo.managerExtParent.alias"
                  v-else
                ></el-input>
              </li>
              <li>
                <span class="label">{{ $t("居住地") }}</span>
                <span class="value" v-if="!isEdit">{{
                  parentBasicInfo.managerExtParent.countryOfResidence
                }}</span>
                <el-input
                  style="width: 170px"
                  size="mini"
                  v-model="parentBasicInfo.managerExtParent.countryOfResidence"
                  v-else
                ></el-input>
              </li>
              <li>
                <span class="label">{{ $t("时区") }}</span>
                <span class="value" v-if="!isEdit">{{
                  parentBasicInfo.managerExtParent.timeZone
                }}</span>
                <el-select
                  size="mini"
                  v-model="parentBasicInfo.managerExtParent.timeZone"
                  filterable
                  v-if="isEdit"
                  :placeholder="$t('请选择')"
                >
                  <el-option
                    v-for="(item, index) in Constants.timeZonesWithMin()"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </li>
              <li>
                <span class="label">{{ $t("时差") }}</span>
                <span class="value" v-if="!isEdit">
                  <span v-if="hour > 0 || minute > 0">
                    {{ radioVal }}
                    <span v-if="hour > 0">{{ hour }}{{ $t("小时") }}</span>
                    <span v-if="minute > 0">{{ minute }}{{ $t("分钟") }}</span>
                  </span>
                  <span v-else> {{ $t("无时差") }} </span>
                </span>
                <span v-else class="timeDifference">
                  <el-radio-group v-model="radioVal">
                    <el-radio size="mini" :label="'+'">+</el-radio>
                    <el-radio size="mini" :label="'-'">-</el-radio>
                  </el-radio-group>
                  <el-select size="mini" v-model="hour">
                    <el-option
                      v-for="item in hours"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option> </el-select
                  >{{ $t("小时") }}
                  <el-select size="mini" v-model="minute">
                    <el-option
                      v-for="item in minutes"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option> </el-select
                  >{{ $t("分钟") }}
                </span>
              </li>
              <li>
                <span class="label">{{ $t("手机号码（内）") }}</span>
                <span class="value" v-if="!internalPhoneIsEdit">{{
                  parentBasicInfo.managerExtParent.internalPhone
                }}</span>
                <el-input
                  style="width: 170px"
                  size="mini"
                  v-model="parentBasicInfo.managerExtParent.internalPhone"
                  @blur="changeInternalPhone"
                  onkeyup="this.value=this.value.replace(/\s+/g,'')"
                  v-else
                ></el-input>
                <i
                  class="el-icon-edit-outline"
                  @click="internalPhoneIsEdit = true"
                  v-if="
                    internalPhoneIsEdit === false &&
                    Per.handleButtonPer(
                      'teach.studentMT.parentInfo.editInternalPhoneNumber'
                    )
                  "
                />
              </li>
              <li>
                <span class="label">{{ $t("邮箱（内）") }}</span>
                <span class="value" v-if="!isEdit">{{
                  parentBasicInfo.managerExtParent.internalEmail
                }}</span>
                <el-input
                  style="width: 170px"
                  size="mini"
                  v-model="parentBasicInfo.managerExtParent.internalEmail"
                  onkeyup="this.value=this.value.replace(/\s+/g,'')"
                  v-else
                ></el-input>
              </li>
              <li>
                <span class="label">{{ $t("微信（内）") }}</span>
                <span class="value" v-if="!isEdit">{{
                  parentBasicInfo.managerExtParent.internalWechat
                }}</span>
                <el-input
                  disabled
                  style="width: 170px"
                  size="mini"
                  v-model="parentBasicInfo.managerExtParent.internalWechat"
                  v-else
                ></el-input>
              </li>
              <li>
                <span class="label">{{ $t("WhatsApp（内）") }}</span>
                <span class="value" v-if="!isEdit">{{
                  parentBasicInfo.managerExtParent.internalWhatsapp
                }}</span>
                <el-input
                  disabled
                  style="width: 170px"
                  size="mini"
                  v-model="parentBasicInfo.managerExtParent.internalWhatsapp"
                  v-else
                ></el-input>
              </li>
              <li>
                <span class="label">{{ $t("LINE（内）") }}</span>
                <span class="value" v-if="!isEdit">{{
                  parentBasicInfo.managerExtParent.internalLine
                }}</span>
                <el-input
                  disabled
                  style="width: 170px"
                  size="mini"
                  v-model="parentBasicInfo.managerExtParent.internalLine"
                  v-else
                ></el-input>
              </li>
              <li>
                <span class="label">{{ $t("家长标签") }}</span>
                <span class="value" v-if="!isEdit">
                  <span
                    v-for="(item, index) in parentBasicInfo.tagInfos"
                    :key="index"
                  >
                    <el-tag
                      v-if="
                        parentTagList &&
                        parentTagList.length > 0 &&
                        handleTagFilter(item) != '-1'
                      "
                      type="success"
                      >{{ handleTagFilter(item) }}</el-tag
                    >
                  </span>
                </span>
                <el-select
                  size="mini"
                  v-model="parentBasicInfo.tagInfos"
                  multiple
                  filterable
                  v-else
                  allow-create
                  default-first-option
                  :placeholder="$t('请选择文章标签')"
                >
                  <el-option
                    v-for="item in parentTagList"
                    :key="item.id"
                    :label="item.shortName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </li>

              <!-- COPPA -->
              <li>
                <span class="label">{{ $t("COPPA认证同意") }}</span>
                <span class="value">
                  <span v-if="!parentBasicInfo.authState">{{
                    $t("未完成")
                  }}</span>
                  <span v-else>
                    <span v-if="parentBasicInfo.authType === 'EMAIL'">{{
                      $t("邮箱认证")
                    }}</span>
                    <span v-if="parentBasicInfo.authType === 'TELEPHONE'">{{
                      $t("电话录音同意")
                    }}</span>
                    <span v-if="parentBasicInfo.authType === 'PAYMENT'">{{
                      $t("付款同意")
                    }}</span>
                    <span v-if="parentBasicInfo.authType === 'OFFLINE'">{{
                      $t("Onsite同意")
                    }}</span>
                    <span
                      v-if="
                        parentBasicInfo.authType === 'EUROPEAN_ENGLISH_ONLY'
                      "
                      >{{ $t("欧洲后认证") }}</span
                    >
                  </span>
                </span>
              </li>

              <li
                v-if="
                  !parentBasicInfo.emailButtonHide && !parentBasicInfo.authState
                "
              >
                <el-button
                  :loading="sendEmailLoading"
                  @click="sendCOPPAEmial"
                  type="primary"
                  size="mini"
                  >{{ $t("发送COPPA邮件") }}</el-button
                >
              </li>
              <li
                v-if="
                  !parentBasicInfo.emailButtonHide && !parentBasicInfo.authState
                "
              >
                <el-checkbox
                  @change="showPhoneRecording = true"
                  v-model="phoneRecording"
                  >{{ $t("COPPA电话录音") }}</el-checkbox
                >
              </li>

              <li
                v-if="
                  remindShow &&
                  Per.handleButtonPer(
                    'teach.studentMT.parentInfo.reminderManagement'
                  )
                "
              >
                <span
                  class="label"
                  style="color: #858fe8; cursor: pointer"
                  @click="openBeforeClassRemind"
                  >{{ $t("课前提醒管理") }}</span
                >
              </li>
              <li>
                <span class="label">{{ $t("聊天工具") }}</span>
                <el-tooltip
                  effect="dark"
                  :content="parentBasicInfo.managerExtParent.chatTool || '-'"
                  placement="top-start"
                >
                  <span class="value w200 thidden" v-show="!isEdit">{{
                    parentBasicInfo.managerExtParent.chatTool || "-"
                  }}</span>
                </el-tooltip>
                <el-input
                  style="width: 170px"
                  size="mini"
                  maxlength="200"
                  v-model="parentBasicInfo.managerExtParent.chatTool"
                  v-show="isEdit"
                ></el-input>
              </li>
              <li>
                <span class="label">{{ $t("家庭信息") }}</span>
                <el-tooltip
                  effect="dark"
                  :content="
                    parentBasicInfo.managerExtParent.familyInformation || '-'
                  "
                  placement="top-start"
                >
                  <span class="value w200 thidden" v-show="!isEdit">{{
                    parentBasicInfo.managerExtParent.familyInformation || "-"
                  }}</span>
                </el-tooltip>
                <el-input
                  style="width: 170px"
                  size="mini"
                  maxlength="200"
                  v-model="parentBasicInfo.managerExtParent.familyInformation"
                  v-show="isEdit"
                ></el-input>
              </li>
              <li>
                <span class="label">{{ $t("沟通禁忌内容") }}</span>
                <el-tooltip
                  effect="dark"
                  :content="
                    parentBasicInfo.managerExtParent.communicationTaboo || '-'
                  "
                  placement="top-start"
                >
                  <span class="value w200 thidden" v-show="!isEdit">{{
                    parentBasicInfo.managerExtParent.communicationTaboo || "-"
                  }}</span>
                </el-tooltip>

                <el-input
                  style="width: 170px"
                  size="mini"
                  maxlength="200"
                  v-model="parentBasicInfo.managerExtParent.communicationTaboo"
                  v-show="isEdit"
                ></el-input>
              </li>
              <li>
                <span class="label" style="white-space: nowrap">{{
                  $t("微信帐号")
                }}</span>
                <span class="value">
                  <div class="mb5">
                    {{ $t("已绑定微信数") }}：
                    <span style="">{{ wechatNum }}</span>
                  </div>
                  <el-button
                    v-if="!weChatAccount.length"
                    type="text"
                    @click="handleDebinding"
                    :disabled="
                      !Per.handleButtonPer(
                        'teach.studentMT.parentInfo.bindWeChat'
                      )
                    "
                  >
                    {{ $t("去绑定") }}
                  </el-button>
                  <template v-else>
                    <span
                      class="mr20"
                      v-for="item of weChatAccount"
                      :key="item.bindId"
                      @click="handleViewWechatDetails(item.bindId)"
                    >
                      <template v-if="item.remark && item.nickName">
                        {{ item.remark }} / {{ item.nickName }}
                      </template>
                      <template v-else-if="item.remark">
                        {{ item.remark }}
                      </template>
                      <template v-else-if="item.nickName">
                        {{ item.nickName }}
                      </template>
                      <template v-else> 微信名为空 </template>
                    </span>
                    <el-popover
                      v-model="parentWeChatRelationshipsVisible"
                      trigger="click"
                    >
                      <ParentWeChatRelationships
                        v-if="parentWeChatRelationshipsVisible"
                        :parentId="parentId"
                      />
                      <el-button slot="reference" type="text">{{
                        $t("查看用户的现有联系人和群组")
                      }}</el-button>
                    </el-popover>
                  </template>
                </span>
              </li>
              <li>
                <span class="label">{{ $t("用户1V1代课意愿") }}</span>
                <span class="value">
                  <el-button
                    type="text"
                    @click="showWillingnessToSubstitute = true"
                  >
                    {{ $t("去设置") }}
                  </el-button>
                </span>
              </li>
              <li>
                <span class="label">{{ $t("约课白名单教师") }}</span>
                <span class="value">
                  <el-button
                    type="text"
                    @click="showTeacherWhiteListForParent = true"
                  >
                    {{ $t("去查看") }}
                  </el-button>
                </span>
              </li>
            </div>
            <div
              style="
                display: block;
                width: 100%;
                margin-bottom: 20px;
                font-size: 14px;
              "
              v-if="
                Per.handleButtonPer(
                  'teach.studentMT.parentInfo.messageDisturb'
                ) && parentBasicInfo.smsNotifyButton == 1
              "
            >
              <template>
                <span class="label">{{ $t("短信提醒免打扰") }}</span>
                <el-switch
                  v-model="parentBasicInfo.managerExtParent.smsNotify"
                  :active-value="0"
                  :inactive-value="1"
                  style="margin-left: 30px; margin-right: 20px"
                  @change="editParentChangeSms"
                >
                </el-switch>
                <i class="el-icon-warning"></i>
                <span
                  style="color: #c0c4cc; font-size: 14px; margin-left: 5px"
                  >{{
                    $t(
                      "开启短信免打扰，将不再给学员发送上课和作业提醒短信。（作业提醒仅泰国、印尼有）"
                    )
                  }}</span
                >
              </template>
            </div>
            <div
              style="
                display: block;
                width: 100%;
                margin-bottom: 20px;
                font-size: 14px;
              "
              v-if="!parentBasicInfo.deleteUserButtonHide"
            >
              <template>
                <span class="label">{{ $t("家长账户删除申请") }}</span>
                <el-button
                  type="primary"
                  @click="showDeleteAccountDialog = true"
                  size="mini"
                  :disabled="parentBasicInfo.deleteApplyStatus"
                  >{{ $t("代家长申请") }}
                </el-button>
              </template>
            </div>
          </div>
          <el-divider
            ><span>{{ $t("商机信息") }}</span></el-divider
          >
          <el-button
            v-if="Per.handleButtonPer('teach.studentMT.parentInfo.createDeal')"
            class="mb10"
            style="float: right"
            type="primary"
            @click="handleCreateDeal"
            >{{ $t("创建商机") }}</el-button
          >
          <el-table
            :border="false"
            :data="dealsData"
            tooltip-effect="dark"
            :height="dealsData && dealsData.length > 5 ? '300px' : ''"
            fit
            v-loading="loadingDeal"
            show-overflow-tooltip="true"
            style="width: 100%; margin-top: 10px"
            stripe
            :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
            :default-sort="{ prop: 'date', order: 'descending' }"
          >
            <el-table-column
              align="center"
              :label="$t('商机id')"
              :width="160"
              prop="dealId"
              fixed
            >
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('线索id')"
              :width="160"
              prop="leadId"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('学生')"
              :width="160"
              prop="studentName"
            >
              <template slot-scope="scope">
                <router-link
                  :to="{
                    path: `studentInfo`,
                    query: {
                      studentId: scope.row.studentId,
                      studentName: scope.row.studentName,
                    },
                  }"
                >
                  <el-button type="text">{{ scope.row.studentName }}</el-button>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('创建平台')"
              :width="160"
              prop="dealSourceSys"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('课程顾问')"
              :width="160"
              prop="adviserUserName"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('学管')"
              :width="160"
              prop="xgUserName"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('商品属性')"
              :width="160"
              prop="subjectType"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.subjectType === 0">{{ $t("中文") }}</span>
                <span v-else-if="scope.row.subjectType === 1">{{
                  $t("英文")
                }}</span>
                <span v-else-if="scope.row.subjectType === 2">{{
                  $t("数学")
                }}</span>
                <span v-else-if="scope.row.subjectType === 3">{{
                  $t("音乐")
                }}</span>
                 <span v-else-if="scope.row.subjectType === 6">{{
                  $t("单词通")
                }}</span>
                <span v-else>---</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('上课形态')" width="120">
              <template slot-scope="scope">
                {{ $t(CLASS_TYPE_CODE_NAME[scope.row.classType]) || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('渠道')"
              :width="160"
              prop="channel"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('商机状态')"
              :width="160"
              prop="stage"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('推送状态')"
              :width="160"
              prop="pushStatus"
            >
              <template slot-scope="scope">
                <span v-show="scope.row.pushStatus === 0">{{
                  $t("待推送")
                }}</span>
                <span v-show="scope.row.pushStatus === 2">{{
                  $t("推送失败")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('推荐人ID')"
              :width="160"
              prop="referrerId"
            >
              <template slot-scope="scope">
                <el-button
                  @click="goParentDetail(scope.row.referrerId)"
                  type="text"
                  >{{ scope.row.referrerId }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('创建时间')"
              :width="160"
              prop="createTime"
            >
              <template slot-scope="scope">
                <span>
                  {{
                    DateTimeUtils.dateClockTime(scope.row.createTime) || "---"
                  }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('操作')"
              :minWidth="currentLang === 'en' ? '330' : '260'"
              fixed="right"
            >
              <template slot-scope="{ row }">
                <div>
                  <span v-if="row.dataType === 1">
                    <el-button
                      class="mr5"
                      v-if="
                        Per.handleButtonPer(
                          'teach.studentMT.parentInfo.assignMe'
                        )
                      "
                      type="text"
                      @click="handleAssignMe(row)"
                      >{{ $t("分配给我") }}</el-button
                    >
                    <el-popover
                      v-if="
                        !row.xgUserId &&
                        Per.handleButtonPer(
                          'teach.studentMT.parentInfo.reAssignLAOfDeal'
                        )
                      "
                      style="display: inline-block"
                      placement="top-start"
                      width="250"
                      trigger="hover"
                    >
                      <div>{{ $t("商机无学管，无法重新分配") }}</div>
                      <div slot="reference">
                        <el-button class="mr5" disabled type="text"
                          >{{ $t("重新分配") }}
                        </el-button>
                      </div>
                    </el-popover>
                    <el-button
                      class="mr5"
                      v-else-if="
                        Per.handleButtonPer(
                          'teach.studentMT.parentInfo.reAssignLAOfDeal'
                        )
                      "
                      type="text"
                      @click="handleReAssign(row)"
                      >{{ $t("重新分配") }}</el-button
                    >
                    <el-button
                      class="mr5"
                      v-if="
                        Per.handleButtonPer(
                          'teach.studentMT.parentInfo.dealFollow'
                        )
                      "
                      type="text"
                      @click="dealsFollow(row)"
                      >{{ $t("商机跟进") }}
                    </el-button>
                  </span>
                  <span v-if="row.dataType === 2">
                    <el-button
                      class="mr5"
                      v-show="row.pushStatus === 0"
                      type="text"
                      @click="handlePushToZoho(row)"
                      >{{ $t("推送") }}
                    </el-button>
                    <el-button
                      class="mr5"
                      v-show="row.pushStatus === 2"
                      type="text"
                      @click="handlePushToZoho(row)"
                      >{{ $t("重新推送") }}
                    </el-button></span
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <div class="student-list-wrap" v-loading="studentListLoading">
          <el-card
            class="student-card-item"
            shadow="hover"
            v-for="(student, index) in parentBasicInfo.studentList"
            :key="index"
          >
            <div class="student-card-switch">
              <el-switch
                v-if="
                  Per.handleButtonPer(
                    'teach.studentMT.parentInfo.studentCardHide'
                  )
                "
                v-model="student.status"
                active-color="#7580E5"
                inactive-color="#808080"
                :active-value="1"
                :inactive-value="3"
                @change="studentHide(student)"
              >
              </el-switch>
              <el-tag
                v-if="
                  !Per.handleButtonPer(
                    'teach.studentMT.parentInfo.studentCardHide'
                  ) && student.status == 3
                "
                type="info"
                size="mini"
              >
                {{ $t("已隐藏") }}</el-tag
              >
            </div>
            <div class="student-item" @click="goStudentInfo(student)">
              <el-avatar
                size="large"
                :src="student.avatar || defaultStuAvatar"
              ></el-avatar>
              <el-button type="text" class="student-name-btn">{{
                student.realName
              }}</el-button>
              <span>{{ student.age }}</span>
              <span>{{ student.gender | mapGender }}</span>
            </div>
          </el-card>
          <img
            class="add-student"
            src="../../../assets/add_child.png"
            alt=""
            srcset=""
            @click="showAddStudentDialog"
            v-if="
              !baseInfoLoading &&
              parentBasicInfo.studentList &&
              parentBasicInfo.studentList.length < 20
            "
          />
        </div>
        <div class="tabs-wrap">
          <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane name="classDetail" class="class-detail">
              <span slot="label">
                <i class="el-icon-notebook-2" />
                {{ $t("课时明细") }}
              </span>
              <div class="class-details-wrap">
                <div class="card-table">
                  <ClassHourDetails
                    :parentId="parentId"
                    :parentUserName="parentUserName"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('积分明细')" name="pointDetail">
              <span slot="label"
                ><i class="el-icon-coin"></i> {{ $t("积分明细") }}</span
              >
              <PointDetails v-if="activeName === 'pointDetail'"></PointDetails>
            </el-tab-pane>
            <el-tab-pane
              v-if="
                Per.handleButtonPer(
                  'teach.studentMT.parentInfo.sharingTimesAndDeductionDetails'
                )
              "
              :label="$t('分享次数扣减明细')"
              name="shareDetail"
            >
              <ShareTimesDetails v-if="activeName === 'shareDetail'">
              </ShareTimesDetails>
            </el-tab-pane>
            <el-tab-pane :label="$t('订单明细')" name="orderDetail">
              <OrderDetail
                :parentUserId="parentId"
                :parentUserName="parentUserName"
                v-if="activeName === 'orderDetail'"
              >
              </OrderDetail>
            </el-tab-pane>
            <el-tab-pane :label="$t('优惠券明细')" name="couponDetail">
              <CouponDetail
                :parentUserId="parentId"
                v-if="activeName === 'couponDetail'"
              >
              </CouponDetail>
            </el-tab-pane>
            <el-tab-pane :label="$t('操作明细')" name="operateDetail">
              <span slot="label"
                ><i class="el-icon-coin"></i> {{ $t("操作明细") }}</span
              >
              <OperateDetails
                :id="parentId"
                :userRole="1"
                :activeTab="activeName"
              ></OperateDetails>
            </el-tab-pane>
          </el-tabs>
          <div class="fp-wrap-wrap">
            <div class="add-fp-info-btn">
              <el-button
                @click="
                  showFpDialog = true;
                  isAddInvoice = true;
                "
                >{{ $t("添加收据信息") }}</el-button
              >
            </div>
            <el-tabs
              class="mt10"
              v-model="fpActiveName"
              type="border-card"
              @tab-click="handleClickFpTabs"
            >
              <el-tab-pane :label="$t('收据信息')" name="fpInfo">
                <span slot="label"
                  ><i class="el-icon-document"></i> {{ $t("收据信息") }}</span
                >
                <div class="fp-wrap" v-loading="invoiceListLoading">
                  <div
                    v-for="(item, index) in invoiceList"
                    :key="index"
                    class="fp-item"
                  >
                    <div class="left-info">
                      <div>
                        <i class="el-icon-user"></i
                        ><span>{{ item.title }}</span>
                      </div>
                      <div>
                        <i class="el-icon-message"></i
                        ><span>{{ item.email }}</span>
                      </div>
                      <div>
                        <i class="el-icon-location-outline"></i
                        ><span>{{ item.address }}</span>
                      </div>
                      <div>
                        <i class="el-icon-notebook-2"></i
                        ><span>{{ item.notes }}</span>
                      </div>
                      <div>
                        <el-radio
                          @change="handleChangeDefault(index)"
                          v-model="defaultFpRadio"
                          :label="index"
                        >
                          {{ $t("默认收据信息") }}
                        </el-radio>
                      </div>
                    </div>
                    <div class="right-edit">
                      <i
                        class="right-edit-icon el-icon-edit"
                        @click="handleUpdateInvoice(item)"
                      ></i>
                      <el-popconfirm
                        :confirm-button-text="$t('确定')"
                        :cancel-button-text="$t('我再想想')"
                        icon="el-icon-info"
                        icon-color="red"
                        :title="$t('确定删除这条收据信息吗？')"
                        @confirm="handleSureDeleteInvoice(item)"
                      >
                        <i
                          slot="reference"
                          class="right-edit-icon el-icon-delete"
                        ></i>
                      </el-popconfirm>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <!-- 课时明细 课时转换 -->
        <!--    添加与修改收据信息-->
        <el-dialog
          :title="isAddInvoice ? $t('添加收据信息') : $t('修改收据信息')"
          center
          :visible.sync="showFpDialog"
          width="50%"
          :before-close="closeFpDialog"
        >
          <div style="width: 500px">
            <el-form
              :model="fpForm"
              :rules="fpFormRules"
              ref="fpForm"
              :label-width="currentLang === 'en' ? '140px' : '100px'"
            >
              <el-form-item :label="$t('收据抬头')" prop="title">
                <el-input
                  :placeholder="$t('请输入')"
                  show-word-limit
                  v-model.trim="fpForm.title"
                  maxlength="50"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('电子邮箱')" prop="email">
                <el-input
                  :placeholder="$t('请输入')"
                  show-word-limit
                  maxlength="50"
                  v-model.trim="fpForm.email"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('收据地址')" prop="address">
                <el-input
                  type="textarea"
                  :rows="2"
                  :placeholder="$t('请输入')"
                  v-model="fpForm.address"
                  maxlength="200"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('备注')" prop="address">
                <el-input
                  type="textarea"
                  :rows="2"
                  :placeholder="$t('请输入备注')"
                  v-model="fpForm.notes"
                  maxlength="50"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeFpDialog">{{ $t("取消") }}</el-button>
            <el-button
              type="primary"
              :loading="fpAddLoading"
              @click="handleSureAddInvoice"
              >{{ isAddInvoice ? $t("确定添加") : $t("确定修改") }}</el-button
            >
          </span>
        </el-dialog>
        <!--    添加与修改收据信息-->
        <el-dialog
          :title="$t('设置推荐人')"
          :visible.sync="setReferalVisibility"
          width="30%"
          :before-close="closeReferal"
        >
          <el-input
            :placeholder="$t('请输入推荐人账号')"
            v-model="referrerUsername"
            @focus="setReferalErrorMsg = null"
          ></el-input>
          <p class="error-msg" :style="{ hidden: setReferalErrorMsg === null }">
            {{ setReferalErrorMsg }}
          </p>
          <div style="text-align: center">
            <el-button @click="closeReferal">{{
              $t("my-home-CCancel")
            }}</el-button>
            <el-button type="primary" :loading="loading" @click="setReferrer">{{
              $t("my-home-CConfirm")
            }}</el-button>
          </div>
        </el-dialog>
        <!--  添加学生 -->
        <el-dialog
          :title="$t('添加学生')"
          :visible.sync="addStudentVisibility"
          width="40%"
          :before-close="closeAddStudent"
        >
          <el-form
            :model="newStudent"
            :rules="rules"
            ref="newStudent"
            :label-width="currentLang === 'en' ? '120px' : '100px'"
          >
            <div class="new-student-content">
              <el-form-item :label="$t('学生名字')" prop="name">
                <el-input
                  v-model="newStudent.name"
                  :placeholder="$t('请输入学生姓名')"
                ></el-input>
              </el-form-item>
            </div>
            <el-form-item :label="$t('my-home-Gender')" prop="gender">
              <el-select
                v-model="newStudent.gender"
                :placeholder="$t('请选择')"
              >
                <el-option :label="$t('male')" value="1"></el-option>
                <el-option :label="$t('female')" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('student-management-Date of Birth')"
              prop="birthday"
            >
              <el-date-picker
                v-model="newStudent.birthday"
                type="date"
                :placeholder="$t('select-Date of Birth')"
              >
              </el-date-picker>
            </el-form-item>
            <div class="add-student-footer">
              <el-button @click="closeAddStudent">{{
                $t("my-home-CCancel")
              }}</el-button>
              <el-button
                :loading="loading"
                type="primary"
                @click="addStudent('newStudent')"
                >{{ $t("立即创建") }}</el-button
              >
            </div>
          </el-form>
        </el-dialog>
        <!--  添加学生 -->
        <!-- 修改消费归属地弹窗 -->
        <el-dialog
          :close-on-click-modal="false"
          :before-close="closeVest"
          :title="$t('修改消费归属地')"
          :visible.sync="vestDiaolog"
          v-if="vestDiaolog"
          width="690px"
        >
          <el-form
            class="mt10"
            label-position="left"
            label-width="100px"
            ref="vestForm"
            :rules="vestRules"
            :model="parentVest"
          >
            <el-form-item :label="$t('消费归属地')" prop="taxVest">
              <el-select
                style="width: 300px"
                v-model="parentVest.taxVest"
                :placeholder="$t('请选择')"
                filterable
                :filter-method="dataFilter"
                @click.native="clickSelectHandle"
                @change="changeArea"
              >
                <el-option-group
                  v-for="(group, key) in taxCountryOptions"
                  :key="group.pyName"
                  :label="key"
                >
                  <el-option
                    @click.native="clickCountryItem(item)"
                    v-for="item in group"
                    :key="item.code"
                    :label="currentLang == 'en' ? item.nameEn : item.nameZh"
                    :value="item.code"
                  ></el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item
              class="btn-wrapper text-center"
              :label="$t('证明材料')"
              prop="fileLists"
              style="text-align: left"
            >
              <el-button
                v-if="disabled && !fileLoading"
                :disabled="disabled"
                size="small"
                type="primary"
                >{{ $t("上传证明材料") }}</el-button
              >
              <el-button
                v-if="fileLoading"
                :loading="fileLoading"
                size="small"
                type="primary"
                >{{ $t("上传证明材料") }}</el-button
              >
              <el-upload
                ref="foreignPersonUploadItem"
                action="#"
                multiple
                :limit="limit"
                :on-exceed="handleExceed"
                :http-request="uploadImage"
                :before-upload="beforeImageUpload"
                :on-change="change"
                accept=".pdf,.jpeg,.jpg,.png,.bmp"
                style="text-align: left"
              >
                <el-button
                  v-if="!disabled && !fileLoading"
                  size="small"
                  type="primary"
                  :loading="fileLoading"
                  >{{ $t("上传证明材料") }}</el-button
                >
                <div slot="tip" class="el-upload__tip">
                  {{
                    $t(
                      "可以是水电单据、银行对账单等，最多支持10张图片（jpg，png，jpeg，bmp）或1份pdf文件"
                    )
                  }}
                </div>
              </el-upload>
              <div style="width: 400px">
                <img
                  style="width: 70px; height: 70px"
                  v-show="selectFile == 'pdf' && pdfOption"
                  src="../../../assets/loading.gif"
                  @click="clickPdf(item)"
                />
                <div
                  div
                  v-for="(item, index) in parentVest.fileLists"
                  :key="index"
                  style="
                    width: 70px;
                    height: 70px;
                    position: relative;
                    float: left;
                    margin-right: 10px;
                    margin-bottom: 10px;
                  "
                >
                  <img
                    style="width: 100%; height: 100%"
                    v-show="selectFile == 'pdf'"
                    src="../../../assets/file.png"
                    @click="clickPdf(item)"
                  />
                  <img
                    v-show="selectFile != 'pdf' && item.url"
                    style="width: 100%; height: 100%"
                    :src="item.url"
                    @click="handlePreview(item, index)"
                  />
                  <i
                    class="el-icon-circle-close elDel"
                    style="
                      position: absolute;
                      top: -6px;
                      right: -6px;
                      font-size: 20px;
                    "
                    @click="handleDel(item, index)"
                  ></i>
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="$t('修改理由')" prop="vestReason">
              <div>
                <div style="width: 450px">
                  <el-input
                    maxlength="500"
                    type="textarea"
                    rows="7"
                    v-model="parentVest.vestReason"
                    :placeholder="$t('请输入修改消费归属地的理由，最多500字')"
                  />
                </div>
              </div>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeVest">{{ $t("取消") }}</el-button>
            <el-button
              type="primary"
              :loading="sureLoading"
              @click="sureVest('vestForm')"
              >{{ $t("确定修改") }}</el-button
            >
          </span>
        </el-dialog>
        <el-dialog
          top="30px"
          :title="$t('证明材料')"
          class="poster-dialog"
          :visible.sync="posterVisibility"
          width="40%"
          v-if="posterVisibility"
          :before-close="handleClose"
        >
          <div class="poster">
            <swiper
              class="swiper-container"
              ref="mySwipers"
              :options="swiperOptions"
            >
              <swiper-slide
                :style="{ height: swiperHeight }"
                v-for="(item, index) in srcList"
                :key="index"
              >
                <img :src="item" alt="" style="width: 100%; height: 100%" />
              </swiper-slide>
              <div
                class="swiper-button-prev"
                slot="button-prev"
                @click="prev"
              ></div>
              <div
                class="swiper-button-next"
                slot="button-next"
                @click="next"
              ></div>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>
        </el-dialog>
        <!-- 课前提醒管理 -->
        <el-dialog
          :title="$t('课前提醒管理')"
          :visible.sync="beforeClassRemind"
          :width="currentLang == 'zh' ? '620px' : '664px'"
          :close-on-click-modal="false"
          :before-close="handleCloseRemind"
          center
        >
          <span class="remindWindows">
            <div class="remindClassWind">
              <span class="label">{{ remindClassList.smsInfo.name }}</span>
              <div>
                <div
                  v-for="(item, index) in remindClassList.smsInfo.items"
                  :key="index"
                >
                  <span
                    :style="{ width: currentLang == 'zh' ? '80px' : '150px' }"
                    >{{ item.remindTimeDesc }}</span
                  >
                  <el-switch
                    style="width: 30px"
                    v-model="item.offOn"
                    active-color="#7A7FDB"
                    inactive-color="#7F7F7F"
                    :active-value="1"
                    :inactive-value="0"
                    @change="editRemind(item, '短信')"
                    :disabled="
                      !Per.handleButtonPer(
                        'teach.studentMT.parentInfo.reminderManagementDisabled'
                      )
                    "
                  >
                  </el-switch>
                </div>
              </div>
            </div>
            <div class="remindClassWind">
              <span class="label">{{ remindClassList.emailInfo.name }}</span>
              <div>
                <div
                  v-for="(item, index) in remindClassList.emailInfo.items"
                  :key="index"
                >
                  <span
                    :style="{ width: currentLang == 'zh' ? '80px' : '150px' }"
                    >{{ item.remindTimeDesc }}</span
                  >
                  <el-switch
                    style="width: 30px"
                    v-model="item.offOn"
                    active-color="#7A7FDB"
                    inactive-color="#7F7F7F"
                    :active-value="1"
                    :inactive-value="0"
                    @change="editRemind(item, '邮件')"
                    :disabled="
                      !Per.handleButtonPer(
                        'teach.studentMT.parentInfo.reminderManagementDisabled'
                      )
                    "
                  >
                  </el-switch>
                </div>
              </div>
            </div>
            <div
              style="font-size: 12px; color: #adadad"
              v-html="
                $t(
                  '注：打开短信或邮件课前提醒需要先完善扩展信息中的“手机号码（内）”或“邮箱（内）”'
                )
              "
            ></div>
          </span>
        </el-dialog>
        <el-dialog
          :title="$t('提醒')"
          :visible.sync="showPhoneRecording"
          :width="currentLang == 'zh' ? '620px' : '664px'"
          :close-on-click-modal="false"
          :show-close="false"
          center
        >
          <span v-if="phoneRecording">{{
            $t("确认已完成COPPA电话录音认证？")
          }}</span>
          <span v-else>{{
            $t("确认修改COPPA电话录音认证状态为未认证吗？")
          }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button
              @click="
                (showPhoneRecording = false),
                  (phoneRecording = parentBasicInfo.authType === 'TELEPHONE')
              "
              >{{ $t("取消") }}</el-button
            >
            <el-button type="primary" @click="changeParentAuth('telephone')">{{
              $t("确定")
            }}</el-button>
          </span>
        </el-dialog>
        <ParentsWechatDetails
          :parentId="parentId"
          :bindId="parentsWechatDetailsInfo.activeBindId"
          :visible.sync="parentsWechatDetailsInfo.visible"
          @update="getParentBindingWechatInfo"
        />
        <DeleteParentAccount
          @close="showDeleteAccountDialog = false"
          @refresh="getParentBasicInfo()"
          :visible.sync="showDeleteAccountDialog"
          :parentUserId="parentId"
        />
      </div>
      <div v-else class="delete-account">
        {{ $t("该用户已删除") }}
      </div>
    </template>
    <!-- 重新分配 -->
    <AssignLaDealDialog
      v-if="showReAssignDialog"
      :visible.sync="showReAssignDialog"
      :currentItem="currentItem"
      :parentId="parentId"
      @assignSuccess="assignSuccess"
    />
    <!-- 完善商机信息 -->
    <DealsInfoFormDialog
      v-if="showDealsInfoDialog"
      :currentItem="currentItem"
      :parentId="parentId"
      :visible.sync="showDealsInfoDialog"
      @saveDealSucess="handleSaveDealSucess"
      :dealFormRefer="dealFormRefer"
      :parentUserName="parentUserName"
    />
    <!-- 商机Follow 抽屉 -->
    <DealsFollowDrawer
      :currentItem="currentItem"
      v-if="showDealsFollowDrawer"
      :visible.sync="showDealsFollowDrawer"
      @followSuccess="handleFollowSucess"
    />
    <el-drawer
      v-if="showFollowRecords"
      :visible.sync="showFollowRecords"
      :title="$t('查看跟进记录')"
      direction="ltr"
      :wrapperClosable="true"
    >
      <!-- <FollowUpRecords /> -->
      <TaskRecordsDrawer />
    </el-drawer>

    <el-drawer
      v-if="showDeviceCheckRecords"
      :visible.sync="showDeviceCheckRecords"
      :title="$t('查看设备检测记录')"
      direction="ltr"
      :wrapperClosable="true"
    >
      <TaskDeviceCheckDrawer :data="deviceCheckInfo" />
    </el-drawer>
    <el-drawer
      v-if="imDrawerVisible"
      :visible.sync="imDrawerVisible"
      :title="$t('会话记录')"
      direction="ltr"
      :wrapperClosable="true"
    >
      <UserConversation :parentId="parentId" />
    </el-drawer>
    <!-- 用户评价抽屉 -->
    <el-drawer
      v-if="evaluationsDrawerVisible"
      :visible.sync="evaluationsDrawerVisible"
      :title="$t('用户评价')"
      direction="ltr"
      :wrapperClosable="true"
      append-to-body
      destroy-on-close
    >
      <UserEvaluations :parentId="parentId" />
    </el-drawer>

    <WillingnessToSubstitute
      v-if="showWillingnessToSubstitute"
      :students="parentBasicInfo.studentList"
      :visible.sync="showWillingnessToSubstitute"
    />
    <TeacherWhiteListForParent
      v-if="showTeacherWhiteListForParent"
      :parentUserId="parentBasicInfo.id"
      :dialogVisible.sync="showTeacherWhiteListForParent"
    />
    
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ClassHourDetails from "./ClassHourDetails/index.vue";
import PointDetails from "./pointDetails";
import OperateDetails from "./operateDetails";
import ShareTimesDetails from "./shareTimesDetails";
import CouponDetail from "./couponDetail";
import OrderDetail from "./orderDetail";
import { deepClone } from "@/utils/handleData";
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import { formatterCountryList } from "../../../utils/formatCountry";
import ParentsWechatDetails from "../components/ParentsWechatDetails";
import { ABNORMAL_CODE } from "@/utils/constants";
import DeleteParentAccount from "@/views/studentManagement/components/deleteParentAccount";
import DealsInfoFormDialog from "../components/dealsInfoFormDialog.vue";
import AssignLaDealDialog from "../components/assignLaDealDialog";
import DealsFollowDrawer from "../components/dealsFollowDrawer";
import WillingnessToSubstitute from "../components/WillingnessToSubstitute";
import TeacherWhiteListForParent from "../components/TeacherWhiteListForParent";

import SpecialLanguagesSelect from "../components/SpecialLanguagesSelect";
import UserTimeZone from "./componentsForParent/UserTimeZone";
import EditUserName from "./componentsForParent/EditUserName";
import EditUserEmail from "./componentsForParent/EditUserEmail";
import TouchCall from "../components/TouchCall";
import constants from "../../notificationManagement/data/constants";
import FollowUpRecords from "@/views/taskManagement/components/FollowUpRecords.vue";
import TaskRecordsDrawer from "@/views/taskManagement/components/TaskRecordsDrawer.vue";
import ReminderSettings from "../components/ReminderSettings.vue";
import FilterByUserPhone from "@/components/FilterItem/CommodityFilter/FilterByUserPhone";
import { CLASS_TYPE_CODE_NAME } from "@/utils/constants";
import { reactive } from "@vue/composition-api";
import TaskDeviceCheckDrawer from "@/views/taskManagement/components/taskDeviceCheckDrawer.vue";
import UnverifiedTag from "@/views/studentManagement/subPage/componentsForParent/UnverifiedTag.vue";
import UserConversation from "./IM/UserConversation.vue";
import UserEvaluations from "./UserEvaluations/index.vue";
import ParentWeChatRelationships from "../components/ParentWeChatRelationships";

const OldParentInfo = { username: "", email: "", phone: "" };
export default {
  name: "parentInfo",
  components: {
    WillingnessToSubstitute,
    TeacherWhiteListForParent,
    ClassHourDetails,
    PointDetails,
    OperateDetails,
    Swiper,
    SwiperSlide,
    ShareTimesDetails,
    ParentsWechatDetails,
    CouponDetail,
    OrderDetail,
    DeleteParentAccount,
    AssignLaDealDialog,
    DealsInfoFormDialog,
    DealsFollowDrawer,
    FollowUpRecords,
    TaskRecordsDrawer,
    ReminderSettings,
    SpecialLanguagesSelect,
    TouchCall,
    FilterByUserPhone,
    UserTimeZone,
    EditUserName,
    EditUserEmail,
    TaskDeviceCheckDrawer,
    UnverifiedTag,
    UserConversation,
    UserEvaluations,
    ParentWeChatRelationships,
  },
  directives: {
    swiper: directive,
  },
  data() {
    let valiTax = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请选择消费归属地")));
      } else {
        return callback();
      }
    };
    let valiFile = (rule, value, callback) => {
      if (value.length == []) {
        return callback(new Error(this.$t("请上传证明材料")));
      } else {
        return callback();
      }
    };
    let valiReason = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请输入修改理由")));
      } else {
        return callback();
      }
    };
    let name = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("学生姓名不能为空")));
      } else {
        return callback();
      }
    };
    let gender = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("学生性别不能为空")));
      } else {
        return callback();
      }
    };
    let birthday = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("学生生日不能为空")));
      } else {
        return callback();
      }
    };
    let title = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请输入")));
      } else {
        return callback();
      }
    };
    let address = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请输入")));
      } else {
        return callback();
      }
    };
    let email = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请输入")));
      } else {
        return callback();
      }
    };

    const deviceCheckInfo = reactive({
      deviceCheckCode: 3, // 1:从未做过设备检测 2:最近一次检测结果为，不通过 3:最近一次检测结果为，通过
      parentUserId: "",
    });
    return {
      wechatNum: 0,
      showFollowRecords: false,
      showWillingnessToSubstitute: false,
      showTeacherWhiteListForParent:false,
      showReAssignDialog: false,
      showDealsInfoDialog: false,
      showDealsFollowDrawer: false,
      dealFormRefer: "", // 'create'  'back'
      sendEmailLoading: false,
      showPhoneRecording: false,
      phoneRecording: false,
      userType: JSON.parse(localStorage.userInfo)?.userType,
      realNameIsEdit: false,
      specialLanguageIsEdit: false,
      parentUserName: null,
      parentsWechatDetailsInfo: {
        visible: false,
        activeBindId: void 0,
      },
      remindClassList: {
        smsInfo: {
          name: "",
          items: [],
        },
        emailInfo: {
          name: "",
          items: [],
        },
      },
      beforeClassRemind: false,
      remindShow: false, //课前提醒管理展示
      imgIndex: "",
      vestDiaolog: false,
      parentVest: {
        taxVest: "",
        vestReason: "",
        fileLists: [],
      },
      indexUrl: "",
      posterVisibility: false,
      imgLoading: false,
      fileLoading: false,
      swiperOptions: {
        loop: true,
        navigation: {
          prevEl: "swiper-button-prev",
          nextEl: "swiper-button-next",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        activeIndex: 0,
        initialSlide: 0,
        on: {
          slideChange: function () {},
        },
        swiperHeight: null,
      },
      currentIndex: 0,
      selectFile: "",
      pdfOption: false,
      sureLoading: false,
      category: "",
      disabled: false,
      imageFlag: false,
      imageInterval: null,
      imageUploadPercent: 0,
      dialogImageUrl: "",
      srcList: [],
      taxCountryOptions: [],
      invoiceListLoading: false,
      invoiceList: [],
      isAddInvoice: true,
      fpAddLoading: false,
      fpFormRules: {
        title: [{ validator: title, trigger: "blur" }],
        address: [{ validator: address, trigger: "blur" }],
        email: [{ validator: email, trigger: "blur" }],
      },
      fpForm: {
        title: "",
        address: "",
        email: "",
      },
      showFpDialog: false,
      defaultFpRadio: 0,
      fpActiveName: "fpInfo",
      activeName: "classDetail",
      referrerUsername: null,
      addStudentVisibility: false,
      setReferalVisibility: false,
      defaultStuAvatar: require("../../../assets/default-avatar-st.png"),
      baseInfoLoading: false,
      studentListLoading: false,
      classInfoLoading: false,
      parentId: null,
      parentBasicInfo: {
        status: -1,
      },
      dealsData: [], // 商机信息
      total: 0,
      setReferalErrorMsg: null,
      loading: false,
      newStudent: {
        name: "",
        gender: "",
        birthday: "",
      },
      rules: {
        name: [{ validator: name, trigger: "blur" }],
        gender: [{ validator: gender, trigger: "change" }],
        birthday: [{ validator: birthday, trigger: "change" }],
      },
      vestRules: {
        taxVest: [{ validator: valiTax, trigger: "blur" }],
        fileLists: [{ validator: valiFile, trigger: "blur" }],
        vestReason: [{ validator: valiReason, trigger: "blur" }],
      },
      isEdit: false,
      parentTagList: [],
      tagInfosCopy: [],
      hours: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ],
      minutes: [0, 30],
      radioVal: "+",
      hour: 0,
      minute: 0,
      timers: null,
      uploadFileArr: [],
      limit: 10,
      uploadArr: [],
      done: false,
      picPdf: false,
      editUpload: false,
      options: [],
      weChatAccount: [],
      showDeleteAccountDialog: false,
      currentItem: {},
      userId: JSON.parse(window.localStorage.getItem("userInfo")).id,
      internalPhoneIsEdit: false,
      CLASS_TYPE_CODE_NAME,
      deviceCheckInfo,
      showDeviceCheckRecords: false,
      imDrawerVisible: false, // 是否显示IM抽屉
      evaluationsDrawerVisible: false, // 是否显示评价抽屉
      parentWeChatRelationshipsVisible: false, // 是否显示家长微信关系
    };
  },
  watch: {
    done(newData) {
      if (newData) {
        this.$notify({
          type: "error",
          message: this.$t("仅支持上传一个PDF文件"),
        });
        return false;
      }
    },
    picPdf(newData) {
      if (newData) {
        this.uploadArr = [];
        this.$notify({
          type: "error",
          message: this.$t("仅支持上传图片或PDF其中一种格式"),
        });
      }
    },
    uploadArr(newData) {
      this.picPdf = false;
      if (newData.length > 1) {
        let picIndex = newData.findIndex((e) => {
          return (
            e == "image/jpeg" ||
            e == "image/jpg" ||
            e == "image/png" ||
            e == "image/bmp"
          );
        });
        let pdfIndex = newData.findIndex((e) => {
          return e == "application/pdf";
        });
        if (picIndex != -1 && pdfIndex != -1) {
          this.disabled = false;
          this.picPdf = true;
        } else if (pdfIndex != -1 && picIndex == -1) {
        }
      }
    },
  },
  computed: {
    ...mapGetters(["currentLang"]),
    isShowBindWaring() {
      return (
        this.parentBasicInfo.firstPayTime &&
        this.parentBasicInfo.firstPayTime.length &&
        this.wechatNum == 0 &&
        this.Per.handleButtonPer("teach.studentMT.parentInfo.showBindWarning")
      );
    },
  },
  methods: {
    async reqWechatNum() {
      const res = await this.$Api.studentManagement.reqParentWechatNum(
        this.parentId
      );
      this.wechatNum = res.length;
    },
    async changeInternalPhone() {
      const {
        status,
        data: { code },
      } = await this.$Api.workBench.changeParentUserInfo({
        parentUserId: this.parentBasicInfo.managerExtParent.parentUserId,
        internalPhone: this.parentBasicInfo.managerExtParent.internalPhone,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      this.$notify({
        type: "success",
        message: this.$t("操作成功"),
      });
      this.internalPhoneIsEdit = false;
    },
    showDrawer() {
      this.showFollowRecords = true;
    },
    handleAssignMe(row) {
      this.currentItem = row;
      const { studentId, xgUserId, subjectType } = row;
      this.$Api.studentManagement
        .checkBeforeBackDeals(
          this.parentId,
          this.userId,
          studentId,
          xgUserId,
          subjectType
        )
        .then(({ status, data: { data, code } }) => {
          if (status !== 200 || code !== 200) return Promise.reject();
          this.dealFormRefer = "back";
          if (data) this.showDealsInfoDialog = true;
        });
    },
    handleReAssign(row) {
      this.currentItem = row;
      this.showReAssignDialog = true;
    },
    handlePushToZoho(row) {
      this.$confirm("确定要推送本条商机数据?")
        .then(async (_) => {
          await this.$Api.studentManagement.reqPushDealTask(row.dealTaskId);
          this.$notify({
            message: this.$t(
              "已推送商机数据，请稍后刷新页面查询状态，若继续失败，请联系管理员"
            ),
            type: "success",
          });
          this.getDealsDatas();
        })
        .catch((_) => {});
    },
    dealsFollow(row) {
      this.currentItem = row;
      this.showDealsFollowDrawer = true;
    },
    handleCreateDeal() {
      this.currentItem = {};
      this.$Api.studentManagement
        .checkBeforeCreateDeals(this.parentId, this.userId)
        .then(({ status, data: { code, data } }) => {
          if (status !== 200 || code !== 200) return Promise.reject();
          this.dealFormRefer = "create";
          if (data) this.showDealsInfoDialog = true;
        });
    },
    handleSaveDealSucess() {
      this.showDealsInfoDialog = false;
      this.getDealsDatas();
    },
    handleFollowSucess() {
      this.showDealsFollowDrawer = false;
    },
    assignSuccess() {
      this.showReAssignDialog = false;
      this.getDealsDatas();
    },
    // 获取家长基本信息
    getParentBasicInfo() {
      if (!this.parentId) {
        return;
      }
      this.baseInfoLoading = true;
      this.$Api.studentManagement
        .getParentUserBasicInfo(this.parentId)
        .then((res) => {
          if (res && res.data && res.data.code === 200) {
            /* status 0：未激活；1：已激活；2：被封禁；3：被删除*/
            this.parentBasicInfo = res.data.data;
            if (res.data.data.status === 3) {
              this.baseInfoLoading = false;
              return;
            }
            this.sendOtherRequest();
            const { userName, email, phone } = res.data.data;
            Object.assign(OldParentInfo, { username: userName, email, phone });
            this.phoneRecording = this.parentBasicInfo.authType === "TELEPHONE";
            this.showPhoneRecording = false;
            this.parentUserName = res.data.data.userName;
            if (res.data.data.managerExtParent) {
              this.parentBasicInfo.managerExtParent =
                res.data.data.managerExtParent;
              let time = res.data.data.managerExtParent.timeDifference + "";
              this.hour = parseInt(
                time.startsWith("-") ? time.substr(1) / 60 : time / 60
              );
              this.minute = parseInt(
                time.startsWith("-") ? time.substr(1) % 60 : time % 60
              );
              this.radioVal = time.startsWith("-") ? "-" : "+";
            } else {
              this.parentBasicInfo.managerExtParent = {
                internalPhone: "",
                internalEmail: "",
                internalWechat: "",
                internalWhatsapp: "",
                internalLine: "",
                alias: "",
                timeZone: "",
                timeDifference: "",
                countryOfResidence: "",
              };
            }
            this.tagInfosCopy = deepClone(this.parentBasicInfo.tagInfos);
            this.parentBasicInfo.managerExtParent.parentUserId = this.parentId;
          }
          this.baseInfoLoading = false;
        });
    },
    // 修改家长认证状态
    async changeParentAuth(authType) {
      try {
        const {
          status,
          data: { code, message },
        } = await this.$Api.studentManagement.updateParentAuth({
          parentUserId: this.parentId,
          authType: authType,
          authState: this.phoneRecording ? 1 : 0,
          operatorId: JSON.parse(window.localStorage.getItem("userInfo")).id,
        });
        if (status !== 200 && code !== 200) return Promise.reject();
        this.$message({
          message: this.$t(message),
          type: "success",
        });
        this.getParentBasicInfo();
        this.showPhoneRecording = false;
      } catch {
        this.sendEmailLoading = false;
      }
    },
    // 发送coppa认证邮件
    async sendCOPPAEmial() {
      this.sendEmailLoading = true;
      try {
        const {
          status,
          data: { code, message },
        } = await this.$Api.studentManagement.parentSendEmailAuth({
          parentUserId: this.parentId,
          operatorId: JSON.parse(window.localStorage.getItem("userInfo")).id,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        this.$message({
          message: this.$t(message),
          type: "success",
        });
      } finally {
        this.sendEmailLoading = false;
      }
    },
    handleDebinding() {
      this.$router.push({
        name: "parentWechatBinding",
        query: { parentId: this.parentId },
      });
    },
    handleViewWechatDetails(bindId) {
      this.parentsWechatDetailsInfo.activeBindId = bindId;
      this.parentsWechatDetailsInfo.visible = true;
    },
    getDealsDatas() {
      this.loadingDeal = true;
      this.$Api.studentManagement
        .getDealsDatas(this.parentId)
        .then(({ data }) => {
          if (data.code === 200) {
            this.dealsData = data.data;
          }
          this.loadingDeal = false;
        })
        .catch(() => {
          this.loadingDeal = false;
        });
    },
    goParentDetail(id) {
      this.$router.push(`/studentManagement/parentInfo?parentUserId=${id}`);
    },
    async handleSubmitParentInfo(field /* realName; specialLanguage; */) {
      let value = this.parentBasicInfo[field];
      if (!value) return;
      if (OldParentInfo[field] === value) {
        return (this[`${field}IsEdit`] = false);
      }
      OldParentInfo[field] = value;
      let key;
      key = field;
      const {
        status,
        data: { code },
      } = await this.$Api.studentManagement.updateParentInfo({
        id: this.parentId,
        [key]: value,
      });
      if (status !== 200 || code !== 200) {
        OldParentInfo[field] = null;
        return;
      }
      this.$notify.success(this.$t("修改成功"));
      this[`${field}IsEdit`] = false;
    },
    // 打开课前提醒弹窗
    openBeforeClassRemind() {
      this.beforeClassRemind = true;
      this.getParentRemind();
    },
    // 关闭课前提醒弹窗
    handleCloseRemind() {
      this.beforeClassRemind = false;
    },
    // 查询课前提醒  课前提醒管理权限
    getSwitch() {
      this.$Api.studentManagement
        .getShowSwitch(this.parentId)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.remindShow = data?.data ?? false;
          }
        });
    },
    // 查询 家长 课前提醒页面数据
    getParentRemind() {
      let params = {
        language: this.currentLang,
      };
      this.$Api.studentManagement
        .getRemindSwitch(this.parentId, params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.remindClassList = data?.data ?? {};
          }
        });
    },
    // 更改提醒状态
    editRemind(value, name) {
      if (
        (this.parentBasicInfo.managerExtParent.internalPhone == null ||
          this.parentBasicInfo.managerExtParent.internalPhone == "") &&
        name == "短信"
      ) {
        if (value.offOn == 1) {
          value.offOn = 0;
        } else {
          value.offOn = 1;
        }
        this.$notify({
          message: this.$t("请完善扩展信息中的“手机号码（内）”"),
          type: "warning",
        });
        return;
      }
      if (
        (this.parentBasicInfo.managerExtParent.internalEmail == null ||
          this.parentBasicInfo.managerExtParent.internalEmail == "") &&
        name == "邮件"
      ) {
        if (value.offOn == 1) {
          value.offOn = 0;
        } else {
          value.offOn = 1;
        }
        this.$notify({
          message: this.$t("请完善扩展信息中的“邮箱（内）”"),
          type: "warning",
        });
        return false;
      }
      let params = {
        offOn: value.offOn,
        parentId: this.parentId,
        remindCode: value.remindCode,
        caller: "ops",
      };
      this.$Api.studentManagement
        .editNewsRemind(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({
              type: "success",
              message: data.message,
            });
          }
        });
    },
    clickCountryItem(item) {
      this.parentVest.taxVest = item.code;
    },
    changeArea(data) {
      this.parentVest.taxVest = data;
    },
    clickSelectHandle() {
      this.taxCountryOptions = this.options;
    },
    dataFilter(val) {
      let templist = this.options;
      let temp = {};
      if (val) {
        //val存在
        for (let key in templist) {
          if (templist[key]) {
            templist[key].forEach((item) => {
              if (
                item["nameZh"].indexOf(val) > -1 ||
                item["nameEn"].toLowerCase().indexOf(val.toLowerCase()) > -1
              ) {
                if (temp[key]) {
                  temp[key].push(item);
                } else {
                  temp[key] = [{ ...item }];
                }
              }
            });
          }
        }
      } else {
        //val为空时，还原数组
        temp = templist;
      }
      this.taxCountryOptions = temp;
    },
    handleClose() {
      this.posterVisibility = false;
    },
    // 上一张
    prev() {
      this.$refs.mySwipers.$swiper.slidePrev();
      this.currentIndex = 0 ? 0 : this.currentIndex - 1;
    },
    // 下一张
    next() {
      this.$refs.mySwipers.$swiper.slideNext();
    },
    handlePreview(item, index) {
      this.swiperOptions.initialSlide = index;
      this.posterVisibility = true;
    },
    clickPdf(item) {
      window.open(item.url);
    },
    handleExceed(files, fileList) {
      this.$notify({
        type: "error",
        message: this.$t("最多上传10张图片"),
      });
    },
    change(file, list) {},
    // 上传图片之前
    beforeImageUpload(file) {
      if (
        file.type == "application/pdf" ||
        file.type == "image/jpeg" ||
        file.type == "image/jpg" ||
        file.type == "image/png" ||
        file.type == "image/bmp"
      ) {
        this.uploadArr.push(file.type);
      } else {
        this.$notify({
          type: "error",
          message: this.$t("仅支持上传图片或PDF其中一种格式"),
        });
        return false;
      }
      if (this.uploadArr) {
        if (this.uploadArr.length > 0) {
          let imgIndex = this.uploadArr.findIndex((e) => {
            return (
              e == "image/jpeg" ||
              e == "image/jpg" ||
              e == "image/png" ||
              e == "image/bmp"
            );
          });
          let pdfIndex = this.uploadArr.findIndex((e) => {
            return e == "application/pdf";
          });
          if (imgIndex != -1 && pdfIndex != -1) {
            return false;
          }
        }
      }
      if (this.uploadArr.length > 1 && this.srcList.length == 0) {
        let num = 0;
        this.uploadArr.forEach((e) => {
          if (e == "application/pdf") {
            num++;
          }
        });
        if (num >= 2) {
          this.done = true;
          return false;
        }
      }
      if (this.srcList.length > 0) {
        let pdfIndexs = this.uploadArr.findIndex((e) => {
          return e == "application/pdf";
        });
        if (pdfIndexs != -1) {
          this.uploadArr = [];
          this.$notify({
            type: "error",
            message: this.$t("仅支持上传图片或PDF其中一种格式"),
          });
          return false;
        }
      }
      if (
        file.name.split(".")[1] == "jpeg" ||
        file.name.split(".")[1] == "jpg" ||
        file.name.split(".")[1] == "png" ||
        file.name.split(".")[1] == "bmp"
      ) {
        this.category = "consumptionpic";
        this.selectFile = "";
        this.pdfOption = false;
      } else {
        this.category = "consumptionpdf";
        this.disabled = true;
        this.selectFile = "pdf";
      }
      if (
        ["image/jpeg", "image/jpg", "image/png", "image/bmp"].indexOf(
          file.type
        ) != -1
      ) {
        const isLt200kb = file.size / 1024 / 1024 < 3;
        if (!isLt200kb) {
          this.$message.error(this.$t("证明材料图片不能超过3MB"));
          return false;
        }
      }
    },
    uploadImage(e) {
      if (this.timers !== null) clearTimeout(this.timers);
      this.uploadFileArr.push(e);
      this.timers = setTimeout(() => {
        let i = 0;
        this.uploadFile(i);
      }, 1000);
    },
    // 上传操作
    uploadFile(i) {
      const loading = this.$loading({
        lock: true,
        text: "上传文件中 ...",
        color: "white",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      this.imageFlag = true;
      this.fileLoading = true;
      let fm = new FormData(),
        _this = this,
        cancelToken = this.$Axios.CancelToken;
      this.source = cancelToken.source();
      let e = this.uploadFileArr[i];
      if (i === this.uploadFileArr.length) {
        loading.close();
        this.fileLoading = false;
        this.uploadFileArr = [];
        return;
      }
      fm.append("category", this.category);
      fm.append("file", e.file);
      this.$Axios({
        method: "post",
        url: `${process.env.VUE_APP_BASE_API}/opsapi/usercenter-service/api/v1/pub/usercenter/ops/upload/api/uploadFile`,
        data: fm,
        headers: {
          "Content-type": "multipart/form-data",
          authorization: `Bearer ${
            JSON.parse(window.localStorage.getItem("userInfo")).jwtToken
          }`,
        },
        cancelToken: _this.source.token,
        onUploadProgress(processEvent) {
          if (processEvent.lengthComputable && !this.imageInterval) {
            this.imageInterval = setInterval(() => {
              if (_this.imageUploadPercent < 99) {
                _this.imageUploadPercent += 1;
              }
            }, 1000);
          }
        },
      }).then(({ status, data }) => {
        this.imageUploadPercent = 100;
        clearInterval(this.imageInterval);
        this.imageInterval = null;
        var timer = null;
        if (status == 200 && data.code == 200) {
          this.editUpload = false;
          timer = setTimeout(() => {
            this.imgLoading = false;
            this.pdfOption = false;
            if (data.data.lastIndexOf(".pdf") != -1) {
              this.parentVest.fileLists.push({
                url: data.data,
                tag: false,
              });
              this.selectFile = "pdf";
            } else {
              this.parentVest.fileLists.push({
                url: data.data,
              });
              if (this.parentVest.fileLists.length == 10) {
                this.disabled = true;
              }
              this.srcList.push(data.data);
              this.imageFlag = false;
              this.selectFile = "";
            }
            loading.close();
            this.fileLoading = false;
            clearTimeout(timer);
            timer = null;
          }, 1000);
          this.uploadFile(++i);
        } else {
          this.imageFlag = false;
          loading.close();
          this.$notify({
            type: "error",
            message: "上传失败",
          });
        }
      });
    },
    handleDel(item, index) {
      if (this.uploadArr.length > 1) {
        this.uploadArr.forEach((e) => {
          if (e == "application/pdf") {
            this.uploadArr = [];
            this.done = false;
          }
        });
      }
      if (this.uploadArr) {
        this.uploadArr.forEach((e) => {
          if (
            (e == "application/pdf" && e == "jpeg") ||
            e == "jpg" ||
            e == "png" ||
            e == "bmp"
          ) {
            this.uploadArr = [];
            this.picPdf = false;
          }
        });
      }
      this.parentVest.fileLists.splice(index, 1);
      this.srcList.splice(index, 1);
      if (this.srcList.length == 0) {
        this.uploadArr = [];
      }
      this.limit = ++this.limit;
      if (
        this.parentVest.fileLists.length == 0 ||
        this.parentVest.fileLists.length < 10
      ) {
        this.disabled = false;
      }
    },
    // 修改消费归属地 关闭
    closeVest() {
      this.vestDiaolog = false;
    },
    // 打开消费归属地弹窗
    vestEditor() {
      this.vestDiaolog = true;
      this.editUpload = true;
      this.getParentInfo();
      this.getCountryList();
    },
    // 获取消费归属地证明材料信息
    getParentInfo() {
      this.parentVest.taxVest = "";
      this.parentVest.vestReason = "";
      this.parentVest.fileLists = [];
      this.srcList = [];
      this.$Api.studentManagement
        .getParentUserAttribution(this.parentId)
        .then((res) => {
          if (res && res.data && res.data.code === 200) {
            let arr = res.data.data.certificatesList;
            this.parentVest.taxVest = res.data.data.consumptionAttributionCode;
            this.parentVest.vestReason = res.data.data.reason;
            let limit = 10;
            this.limit = limit - arr.length;
            if (arr.length >= 10) {
              this.disabled = true;
            } else {
              this.disabled = false;
            }
            for (var i = 0; i < arr.length; i++) {
              if (arr[0].lastIndexOf(".pdf") != -1) {
                this.selectFile = "pdf";
                this.disabled = true;
              } else {
                this.selectFile = "";
              }
              this.parentVest.fileLists.push({ url: arr[i] });
              this.srcList.push(arr[i]);
            }
          }
        });
    },
    // 获取消费归属地国家列表
    getCountryList() {
      this.$Api.studentManagement.getParentUserCountryList().then((res) => {
        if (res && res.data && res.data.code === 200) {
          this.taxCountryOptions = res.data.data;
          this.options = JSON.parse(JSON.stringify(res.data.data));
          this.taxCountryOptions = formatterCountryList(res.data.data);
          this.options = this.taxCountryOptions;
        }
      });
    },
    // 确定修改归属地信息
    sureVest(formName) {
      let arr = this.parentVest.fileLists;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.vestDiaolog = false;
          this.sureLoading = true;
          let params = {
            parentUserId: this.parentId,
            consumptionAttributionCode: this.parentVest.taxVest,
            reason: this.parentVest.vestReason,
          };
          var list = [];
          for (var i = 0; i < arr.length; i++) {
            list.push(arr[i].url);
          }
          params.certificatesList = list;
          this.$Api.studentManagement
            .editParentInfoAttribution(params)
            .then((data) => {
              if (data.data.code == 200) {
                this.$notify({
                  type: "success",
                  message: this.$t("操作成功"),
                });
                this.getParentBasicInfo();
              } else {
                this.$notify({
                  message: data.data.message,
                  type: "error",
                });
              }
              this.sureLoading = false;
            });
        }
      });
    },
    handleTagFilter(id) {
      let i = this.parentTagList.find((item) => item.id === id);
      if (i) {
        return i.shortName;
      } else {
        return "-1";
      }
    },
    // 差异array
    diffArray(originArr, resultarr) {
      var addList = [],
        delList = [];
      if (!Array.isArray(originArr) || !Array.isArray(resultarr))
        throw new TypeError("originArr and resultarr must be a array");
      // 处理结果与源 一致
      if (JSON.stringify(originArr) === JSON.stringify(resultarr))
        return { addList, delList };
      // 处理全部新增
      if (originArr.length === 0 && resultarr.length !== 0) {
        addList = [...resultarr];
        return {
          addList,
          delList,
        };
      }
      // 处理全部情况
      if (originArr.length !== 0 && resultarr.length === 0) {
        delList = [...originArr];
        return {
          addList,
          delList,
        };
      }
      // 处理删除的
      originArr.forEach((item) => {
        let flag = resultarr.find((ite) => item === ite);
        flag === undefined ? delList.push(item) : null;
      });
      // 处理新增的
      resultarr.forEach((item) => {
        let flag = originArr.find((ite) => item === ite);
        flag === undefined ? addList.push(item) : null;
      });
      return {
        addList,
        delList,
      };
    },
    handleSureSave() {
      let timeDifference = this.radioVal + (this.hour * 60 + this.minute);
      this.parentBasicInfo.managerExtParent.timeDifference = timeDifference;
      let mep = deepClone(this.parentBasicInfo.managerExtParent),
        emptyNum = 0;
      delete mep.parentUserId;
      for (let key in mep) {
        if (mep[key]) {
          emptyNum++;
        }
      }
      if (emptyNum === 0) {
        this.$notify({
          type: "warning",
          message:
            this.currentLang === "en"
              ? "Supplementary information cannot be empty"
              : "扩展信息不能为空",
        });
        return;
      }
      let { addList, delList } = this.diffArray(
          this.tagInfosCopy || [],
          this.parentBasicInfo.tagInfos || []
        ),
        mode = "";
      if (addList.length > 0) {
        mode = "create:append";
        this.parentBasicInfo.tagInfos = deepClone(addList);
      } else if (delList.length > 0) {
        mode = "delete";
        this.parentBasicInfo.tagInfos = deepClone(delList);
      }
      this.parentBasicInfo.mode = mode;
      if (this.parentBasicInfo.managerExtParent.internalPhone) {
        this.parentBasicInfo.managerExtParent.internalPhone =
          this.parentBasicInfo.managerExtParent.internalPhone.trim();
      }
      if (this.parentBasicInfo.managerExtParent.internalEmail) {
        this.parentBasicInfo.managerExtParent.internalEmail =
          this.parentBasicInfo.managerExtParent.internalEmail.trim();
      }
      this.parentBasicInfo.managerExtParent.internalPhone = this.handleTrim(
        this.parentBasicInfo.managerExtParent.internalPhone
      );
      let parentBasicInfo = deepClone(this.parentBasicInfo);
      delete parentBasicInfo.managerExtParent.smsNotify;
      delete parentBasicInfo.managerExtParent.internalWechat;
      delete parentBasicInfo.managerExtParent.internalWhatsapp;
      delete parentBasicInfo.managerExtParent.internalLine;
      delete parentBasicInfo.managerExtParent.internalPhone;
      let params = {
        ...parentBasicInfo.managerExtParent,
        tagInfos: parentBasicInfo.tagInfos,
        mode: parentBasicInfo.mode,
      };
      this.$Api.workBench
        .changeParentUserInfo(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({
              type: "success",
              message: this.$t("操作成功"),
            });
            this.isEdit = false;
            this.getParentBasicInfo();
            this.getSwitch();
          }
        });
    },
    handleTrim(str) {
      return str === null ? "" : str.replace(/ /g, "");
    },
    handleChangeDefault(index) {
      this.invoiceList[index].isDefault = true;
      this.$Api.studentManagement
        .updateParentInvoice(this.invoiceList[index])
        .then(({ status, data }) => {
          if (status !== 200 || data.code !== 200) {
            this.$notify({ message: this.$t("操作失败"), type: "error" });
          }
        });
    },
    // 获取家长收据信息LIST
    getParentInvoicesList() {
      this.invoiceListLoading = true;
      this.$Api.studentManagement
        .getParentInvoices(this.parentId)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.invoiceList = data.data;
            this.defaultFpRadio = this.invoiceList.findIndex(
              (item) => item.isDefault === true
            );
          }
          this.invoiceListLoading = false;
        });
    },
    // 确定删除当前收据信息
    handleSureDeleteInvoice(currentInvoiceInfo) {
      this.$Api.studentManagement
        .deleteInvoiceForParent(currentInvoiceInfo.id)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({ message: this.$t("操作成功"), type: "success" });
            this.getParentInvoicesList();
            this.closeFpDialog();
          }
        });
    },
    // 点击修改icon打开弹窗，设置当前状态是打开还是修改
    handleUpdateInvoice(currentInvoiceInfo) {
      this.showFpDialog = true;
      this.isAddInvoice = false;
      this.fpForm = deepClone(currentInvoiceInfo);
    },
    // 确认添加收据
    handleSureAddInvoice() {
      this.$refs["fpForm"].validate((valid) => {
        if (valid) {
          this.fpAddLoading = true;
          let { address, title, email, notes } = this.fpForm;
          if (this.isAddInvoice) {
            // 添加操作
            this.$Api.studentManagement
              .addInvoiceForParent({
                title,
                email,
                address,
                parentUserId: this.parentId,
                notes,
              })
              .then(({ status, data }) => {
                if (status == 200 && data.code == 200) {
                  this.$notify({
                    message: this.$t("操作成功"),
                    type: "success",
                  });
                  this.getParentInvoicesList();
                  this.closeFpDialog();
                }
                this.fpAddLoading = false;
              });
          } else {
            // 更新操作
            this.$Api.studentManagement
              .updateParentInvoice({
                ...this.fpForm,
                parentUserId: this.parentId,
              })
              .then(({ status, data }) => {
                if (status == 200 && data.code == 200) {
                  this.$notify({
                    message: this.$t("操作成功"),
                    type: "success",
                  });
                  this.getParentInvoicesList();
                  this.closeFpDialog();
                }
                this.fpAddLoading = false;
              });
          }
        }
      });
    },
    // 关闭添加/修改收据弹窗
    closeFpDialog() {
      this.showFpDialog = false;
      this.fpForm = this.$options.data().fpForm;
      this.$refs["fpForm"].resetFields();
    },
    // 收据信息tabs切换回调
    handleClickFpTabs() {},
    setReferrer() {
      if (this.loading) return;
      this.loading = true;
      if (!this.referrerUsername) {
        this.$notify({
          message: "推荐人账号不能为空！",
          type: "warning",
        });
        this.loading = false;
      }
      this.$Api.studentManagement
        .setReferrer({
          referrerUserIdentify: this.referrerUsername.trim(),
          parentUserId: this.parentId,
        })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.code === 200) {
              this.$notify({
                message: "设置推荐人成功",
                type: "success",
              });
              this.setReferalVisibility = false;
              this.getParentBasicInfo();
            } else {
              if (res.data.code === 500) {
                this.$notify({
                  message: "操作失败",
                  type: "error",
                });
              } else {
                this.setReferalErrorMsg = res.data.message;
              }
            }
            this.loading = false;
          }
        });
    },
    addStudent(refName) {
      if (this.loading) return;
      this.$refs[refName].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$Api.studentManagement
            .addNewStudent({
              parentUserId: this.parentId,
              avatar: null,
              realName: this.newStudent.name.trim(),
              gender: this.newStudent.gender,
              birthday: this.newStudent.birthday.toISOString(),
            })
            .then((res) => {
              if (res.status === 200) {
                if (res.data.code === 200) {
                  this.addStudentVisibility = false;
                  this.getParentBasicInfo();
                } else {
                  this.$notify({
                    message: res.data.message,
                    type: "error",
                  });
                }
                this.loading = false;
                this.resetAddStudentForm();
              }
            });
        } else {
          return false;
        }
      });
    },
    showAddStudentDialog() {
      this.addStudentVisibility = true;
    },
    closeAddStudent() {
      this.addStudentVisibility = false;
      this.resetAddStudentForm();
    },
    closeReferal() {
      this.setReferalVisibility = false;
      this.referrerUsername = "";
    },
    setReferal() {
      this.setReferalVisibility = true;
    },
    goStudentInfo({ studentUserId, realName }) {
      this.$router.push(
        `/studentManagement/studentInfo?studentId=${studentUserId}&studentName=${realName}`
      );
    },
    // 修改家家长短信通知开关
    editParentChangeSms() {
      this.$Api.studentManagement
        .getParentUserChangeSms(this.parentId)
        .then((res) => {
          if (res && res.data && res.data.code === 200) {
            this.$notify({
              message: res.data.message,
              type: "success",
            });
          }
        });
    },
    showReferInfo() {
      const tempReferId = this.parentBasicInfo.referrerUserId;
      window.open(
        location.origin +
          "/studentManagement/parentInfo" +
          `?parentUserId=${tempReferId}`
      );
    },
    resetPassWord() {
      this.$confirm(this.$t("确定重置密码为lingoace123吗？"), this.$t("提示"), {
        distinguishCancelAndClose: true,
        confirmButtonText: this.$t("my-home-Confirm"),
        cancelButtonText: this.$t("取消"),
        type: "warning",
      })
        .then(() => {
          const userId = this.parentId;
          const role = 1; // ops用户
          this.$Api.classManagement.resetCUserPsw(userId, role).then((res) => {
            if (res && res.data && res.data.code === 200) {
              this.$notify({
                message: res.data.message,
                type: "success",
              });
            }
          });
        })
        .catch((err) => {
          // console.log(err)
        });
    },
    resetAddStudentForm() {
      this.$refs["newStudent"].resetFields();
    },
    getParentTagList() {
      this.$Api.studentManagement
        .getParentTagList()
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.parentTagList = data.data;
          }
        });
    },
    studentHide(row) {
      let list = this.parentBasicInfo.studentList;
      if (list.length > 1) {
        let show = list.find((item) => item.status == 1);
        if (!show) {
          row.status = 1;
          this.$notify({
            type: "error",
            message: "一个孩子不能隐藏",
          });
          return;
        }
      } else {
        row.status = 1;
        this.$notify({
          type: "error",
          message: "一个孩子不能隐藏",
        });
        return;
      }
      this.$Api.studentManagement
        .studentStatusShow(row.studentUserId, row.status)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({
              type: "success",
              message: data.message,
            });
            this.getParentBasicInfo();
          } else if (data.code === ABNORMAL_CODE.existingClassHours) {
            row.status = 1;
            this.$notify({
              type: "error",
              message: this.$t("无法隐藏，该学生存在剩余课时"),
            });
          } else {
            row.status = row.status === 1 ? 3 : 1;
          }
        })
        .catch(() => (row.status = row.status === 1 ? 3 : 1));
    },
    async getParentBindingWechatInfo() {
      this.weChatAccount =
        await this.$Api.studentManagement.getParentBindingWechatInfo({
          userId: JSON.parse(localStorage.userInfo)?.id,
          parentUserId: this.parentId,
        });
    },
    sendOtherRequest() {
      this.getParentBindingWechatInfo();
      this.getParentInvoicesList();
      this.getParentTagList();
      this.getSwitch(); // 获取 课前提醒按钮权限
      this.getDealsDatas(); // 获取商机信息
    },

    showDeviceCheckDrawer() {
      // await this.getDeviceCheck();
      this.showDeviceCheckRecords = true;
    },

    async getDeviceCheck() {
      // console.log("getDeviceCheck parentUserId====", this.parentUserId)
      this.deviceCheckInfo.parentUserId = this.parentId;

      const res = await this.$Api.taskManagement.reqUserLastDeviceCheckResult({
        parentId: this.parentId,
      });
      this.deviceCheckInfo.deviceCheckCode = res ? res.result : 1;
    },
  },
  created() {
    let swiper = new Swiper(".swiper-container");
    this.swiperHeight =
      ((document.documentElement.clientWidth * 0.4 - 40) * 0.6 * 1332) / 750 +
      "px";
    this.parentId = this.$route.query.parentUserId;
    this.getParentBasicInfo();
    this.getDeviceCheck();
    this.reqWechatNum();
  },
};
</script>
<style lang="scss" scoped>
.parent-info-wrap {
  padding: 15px;
  .delete-account {
    color: #909399;
    margin: 0 auto;
    text-align: center;
    padding-top: 280px;
  }
}
::v-deep .el-dialog__header {
  display: flex;
  justify-content: center;
  align-items: center;
}
.remindWindows {
  > div {
    margin: 0 0 10px 0;
  }
  > div:nth-child(1) {
    margin-bottom: 42px;
  }
  > div:nth-child(2) {
    margin-bottom: 30px;
  }
}
.remindClassWind {
  > span {
    margin-bottom: 10px;
  }
  > div {
    display: flex;
    > div {
      margin: 0 10px;
      flex: 1;
    }
    span {
      display: inline-block;
    }
  }
}
::v-deep.el-dialog__footer {
  text-align: center;
  background-color: transparent;
  border-top: 1px solid #eeeeee;
}
::v-deep.el-upload-list__item {
  width: 15px;
  padding: 6px 9px 9px 87px;
}
::v-deep.el-upload-list {
  display: none;
}
.fp-wrap-wrap {
  position: relative;
  .add-fp-info-btn {
    position: absolute;
    right: 5px;
    top: 4px;
    z-index: 999;
  }
}
.fp-wrap {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  .fp-item {
    width: 49%;
    height: 150px;
    margin: 4px;
    //background: #F0F4FB;
    position: relative;
    border: 1px solid #f0f4fb;
    color: rgb(96, 98, 102);
    box-shadow: 0 0 5px #eee;
    border-radius: 5px;
    .left-info {
      height: 100%;
      width: 95%;
      position: absolute;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      font-size: 14px;
      box-sizing: border-box;
      padding: 15px 20px;
      color: rgb(96, 98, 102);
      > div {
        display: flex;
      }
      > div > i {
        font-size: 16px;
        margin-right: 10px;
      }
    }
    .right-edit {
      height: 100%;
      position: absolute;
      right: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 16px;
      box-sizing: border-box;
      padding: 20px;
    }
    .right-edit-icon {
      cursor: pointer;
      &:hover {
        color: #0088ce;
      }
    }
  }
}
.rotate {
  transform: rotate(90deg);
}
.hidden {
  visibility: hidden;
}
.new-student-content {
  width: 300px;
}
.add-student-footer {
  text-align: center;
  margin-top: 40px;
}
.error-msg {
  text-indent: 24px;
  color: red;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.student-card-item {
  margin: 10px;
  position: relative;
  .student-card-switch {
    position: absolute;
    right: 10px;
    top: 4px;
  }
}
.student-list-wrap {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  justify-content: flex-start;
  align-items: center;
  .student-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    .student-name-btn {
      margin: 0 20px;
    }
    > span {
      margin: 0 5px;
    }
  }
  .add-student {
    width: 80px;
    height: 80px;
    margin-left: 20px;
    cursor: pointer;
  }
}
.box-card-class {
  margin-bottom: 10px;
}
.base-info-wrap {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px;
  li {
    display: flex;
    align-items: center;
    list-style: none;
    width: 33%;
    margin-bottom: 20px;
    font-size: 14px;
    .el-input {
      width: 50%;
    }
    i {
      cursor: pointer;
      margin: 0 16px;
    }
  }
}
.label {
  color: #666;
  display: inline-block;
  text-align: right;
  margin-right: 25px;
}
.tabs-wrap {
  padding: 0 10px;
  box-sizing: border-box;
}
.wechat-account {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
  .value {
    cursor: pointer;
    color: #7580e5;
  }
}
</style>
<style lang="scss">
.timeDifference {
  color: #666;
  .el-input--mini .el-input__inner {
    width: 63px;
    margin-right: 5px;
  }
  .el-radio {
    margin-right: 10px;
  }
}
.tabs-wrap {
  .el-tabs__nav-wrap::after {
    width: 0;
  }
}
</style>
