<template>
  <div class="manual-order-wrap">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClickTabs">
      <el-tab-pane :label="$t('待支付')" name="0"></el-tab-pane>
      <el-tab-pane :label="$t('待审批')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('已审批')" name="3"></el-tab-pane>
    </el-tabs>
    <screen-wrapper @search="search" :screenTitle="$t('订单列表')">
      <screen-item
        :label="$t('订单创建时间')"
        :part="2"
        label-width="100"
        v-if="
          Per.handleButtonPer(
            'financeMT.employeePerformance.attendClassInfo.cdFilerByDate'
          ) && activeName != 0
        "
      >
        <FilterByTimePeriod
          @changeSelect="
            (timeArr) => {
              screenData.startTime = timeArr[0];
              screenData.endTime = timeArr[1];
            }
          "
          :defaultTimeArr="defaultTimeArr"
        />
      </screen-item>
      <screen-item
        :label="$t('支付成功时间')"
        :part="2"
        label-width="100"
        v-if="
          Per.handleButtonPer(
            'financeMT.employeePerformance.attendClassInfo.cdFilerByDate'
          ) && activeName != 0
        "
      >
        <FilterByTimePeriod
          @changeSelect="
            (timeArr) => {
              screenData.paySuccessStartTime = timeArr[0];
              screenData.paySuccessEndTime = timeArr[1];
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('审批通过时间')"
        :part="2"
        label-width="100"
        v-if="
          Per.handleButtonPer(
            'financeMT.employeePerformance.attendClassInfo.cdFilerByDate'
          ) && activeName == 3
        "
      >
        <FilterByTimePeriod
          @changeSelect="
            (timeArr) => {
              screenData.examineStartTime = timeArr[0];
              screenData.examineEndTime = timeArr[1];
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('顾问')"
        :labelWidth="currentLang === 'en' ? '130' : '60'"
        :part="2"
        v-if="
          Per.handleButtonPer(
            'financeMT.employeePerformance.attendClassInfo.cdFilerByAdviser'
          )
        "
      >
        <el-select
          clearable
          filterable
          v-model="screenData.adviserUserId"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="(item, index) in gwTeacherList"
            :key="index"
            :label="
              item.nameEn +
              `${item.nameEn && item.nameZh ? '-' : ''}` +
              item.nameZh
            "
            :value="item.id"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('学管')"
        :labelWidth="currentLang === 'en' ? '120' : '60'"
        :part="2"
        v-if="
          Per.handleButtonPer(
            'financeMT.employeePerformance.attendClassInfo.cdFilerByAdviser'
          )
        "
      >
        <el-select
          clearable
          filterable
          v-model="screenData.xgUserId"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="(item, index) in xgTeacherList"
            :key="index"
            :label="
              item.nameEn +
              `${item.nameEn && item.nameZh ? '-' : ''}` +
              item.nameZh
            "
            :value="item.id"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('家长id')"
        :label-width="'80'"
        :part="2"
        v-if="
          Per.handleButtonPer(
            'financeMT.employeePerformance.attendClassInfo.cdFilerByStudentName'
          )
        "
      >
        <el-input
          style="width: 170px"
          v-model.trim="screenData.parentUserId"
          :placeholder="$t('请输入家长ID')"
          @keyup.enter.native="search"
        />
      </screen-item>
    </screen-wrapper>
    <div class="table-wrap">
      <div class="add-btn-wrap">
        <el-button
          type="text"
          v-if="
            Per.handleButtonPer(
              'financeMT.orderManagement.manualOrder.batchUploadManualOrders'
            )
          "
        >
          <a href="https://priv.cdn.lingoace.com/OPS/批量上传人工订单.xlsx">{{
            $t("下载模板")
          }}</a>
        </el-button>
        <el-tooltip
          v-if="
            Per.handleButtonPer(
              'financeMT.orderManagement.manualOrder.batchUploadManualOrders'
            )
          "
          class="item"
          effect="light"
          content="支持最多上传400条数据"
          placement="left"
        >
          <BatchUploadManualOrders
            :config="{
              url: '/opsapi/trading/center/manual/order/import/manual/order/excel',
              btnTxt: $t('批量导入'),
              btnType: 'plan',
            }"
            :showFileList="false"
            @ok="importSuccessFn"
          />
        </el-tooltip>
        <el-dropdown
          v-if="
            Per.handleButtonPer('financeMT.orderManagement.manualOrder.add')
          "
        >
          <el-button type="primary">
            {{ $t("添加订单")
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="showAddOrderDialog(1)">{{
              $t("普通订单")
            }}</el-dropdown-item>
            <el-dropdown-item @click.native="showAddOrderDialog(2)">{{
              $t("升舱订单")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-table
        v-if="activeName === '0'"
        :border="false"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        max-height="500"
      >
        <el-table-column
          key="0-number"
          align="center"
          :label="$t('序号')"
          width="50"
        >
          <template slot-scope="scope">
            {{
              (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-for="col in tableColumn0"
          :key="col.prop"
          :prop="col.prop"
          :label="$t(`${col.label}`)"
          :width="col.width ? col.width : 'auto'"
        >
          <template slot-scope="scope">
            <template v-if="col.prop === 'createTime'">{{
              DateTimeUtils.dateClockTime(scope.row.createTime)
            }}</template>
            <template v-else-if="col.prop === 'parentUserId'">
              <router-link
                :to="{
                  path: `/studentManagement/parentInfo`,
                  query: { parentUserId: scope.row.parentUserId },
                }"
              >
                <el-button type="text">{{ scope.row.parentUserId }}</el-button>
              </router-link>
            </template>
            <template v-else-if="col.prop === 'incentiveAmount'"
              >{{ scope.row.incentiveAmount || 0 }}课时</template
            >
            <template v-else>{{ scope.row[col.prop] || "--" }}</template>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('操作')" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleEnterPaymentRecord(scope.row)"
              v-if="
                Per.handleButtonPer(
                  'financeMT.orderManagement.manualOrder.luru'
                )
              "
              >{{ $t("录入付款记录") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="activeName === '1'"
        :border="false"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        max-height="500"
      >
        <el-table-column
          key="1-number"
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang == 'en' ? 110 : 50"
        >
          <template slot-scope="scope">
            {{
              (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-for="col in tableColumn1"
          :key="col.prop"
          :prop="col.prop"
          :label="$t(`${col.label}`)"
          :width="col.width ? col.width : 'auto'"
          :fixed="col.fixed ? col.fixed : false"
        >
          <template slot-scope="scope">
            <template v-if="col.prop === 'createTime'">{{
              DateTimeUtils.dateClockTime(scope.row.createTime)
            }}</template>
            <template v-else-if="col.prop === 'parentUserId'">
              <router-link
                :to="{
                  path: `/studentManagement/parentInfo`,
                  query: { parentUserId: scope.row.parentUserId },
                }"
              >
                <el-button type="text">{{ scope.row.parentUserId }}</el-button>
              </router-link>
            </template>
            <template v-else-if="col.prop === 'incentiveAmount'"
              >{{ scope.row.incentiveAmount || 0 }}课时</template
            >
            <template v-else-if="col.prop === 'taxRate'">
              <span v-if="scope.row.taxRateName">{{ scope.row.taxRate }}%</span>
              <span v-else>--</span>
            </template>
            <template v-else-if="col.prop === 'rechargeDate'">{{
              DateTimeUtils.dateClockTime(scope.row.rechargeDate)
            }}</template>
            <template v-else>{{ scope.row[col.prop] || "--" }}</template>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('操作')" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleOpenExamine(scope.row, false)"
              v-if="
                Per.handleButtonPer(
                  'financeMT.orderManagement.manualOrder.shenpi'
                )
              "
              >{{ $t("审批") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="activeName === '3'"
        :border="false"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        max-height="500"
      >
        <el-table-column
          key="3-number"
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang == 'en' ? 110 : 50"
        >
          <template slot-scope="scope">
            {{
              (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-for="col in tableColumn2"
          :key="col.prop"
          :prop="col.prop"
          :label="$t(`${col.label}`)"
          :width="col.width ? col.width : 'auto'"
          :fixed="col.fixed ? col.fixed : false"
        >
          <template slot-scope="scope">
            <template v-if="col.prop === 'createTime'">{{
              DateTimeUtils.dateClockTime(scope.row.createTime)
            }}</template>
            <template v-else-if="col.prop === 'parentUserId'">
              <router-link
                :to="{
                  path: `/studentManagement/parentInfo`,
                  query: { parentUserId: scope.row.parentUserId },
                }"
              >
                <el-button type="text">{{ scope.row.parentUserId }}</el-button>
              </router-link>
            </template>
            <template v-else-if="col.prop === 'incentiveAmount'"
              >{{ scope.row.incentiveAmount || 0 }}课时</template
            >
            <template v-else-if="col.prop === 'orderGiftItemRespList'">
              <!-- 后端返回字段内容
              orderGiftItemRespList: {
                giftType:赠送的商品类型;1-课程包sku;2-实体sku;3-虚拟sku;4-课时;5-积分
                giftSkuId:赠品sku_id(1,2,3取)
                amount:数量(4,5取)
                skuName: 5课时(1,2,3取)
              } -->
              <div
                v-if="
                  scope.row.activityPolicyRespList &&
                  scope.row.activityPolicyRespList.length
                "
              >
                <div
                  v-for="item in scope.row.activityPolicyRespList"
                  :key="item.id"
                >
                  {{ giftMap(item) }}
                </div>
              </div>
              <span v-else>--</span>
            </template>
            <template v-else-if="col.prop === 'taxRate'">
              <span v-if="scope.row.taxRateName">{{ scope.row.taxRate }}%</span>
              <span v-else>--</span>
            </template>
            <template v-else-if="col.prop === 'rechargeDate'">{{
              DateTimeUtils.dateClockTime(scope.row.rechargeDate)
            }}</template>
            <template v-else-if="col.prop === 'status'">{{
              scope.row.status | manualOrderStatus
            }}</template>
            <template v-else-if="col.prop === 'updateTime'">{{
              DateTimeUtils.dateClockTime(scope.row.updateTime)
            }}</template>
            <template v-else>{{ scope.row[col.prop] || "--" }}</template>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('操作')"
          :width="currentLang == 'en' ? 180 : 120"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              :disabled="scope.row.status === 2"
              @click="handleShowInvoiceDialog(scope.row)"
              >{{ $t("收据") }}</el-button
            >
            <el-button
              type="text"
              @click="handleOpenExamine(scope.row, true)"
              >{{ $t("查看详情") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="screenData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
    <!-- 添加订单 -->
    <el-dialog
      :before-close="closePaidOrderOrder"
      :close-on-click-modal="false"
      :title="$t('选择要升舱的订单')"
      top="5vh"
      width="72%"
      center
      append-to-body
      :visible.sync="showPaidOrderDialog"
    >
      <MyPaidOrderList
        v-if="showPaidOrderDialog"
        :parentUserId="form.parentUserId"
        :studentUserId="form.studentUserId"
        @getUpgradeOrder="getUpgradeOrder"
    /></el-dialog>
    <el-dialog
      :before-close="closeAddOrder"
      :close-on-click-modal="false"
      :title="isUpgradeOrder ? $t('添加升舱订单') : $t('添加普通订单')"
      top="5vh"
      width="72%"
      center
      :visible.sync="addOrderDialog"
    >
      <el-form
        class="add-form"
        :inline="true"
        ref="form"
        :model="form"
        :label-width="currentLang == 'en' ? '200px' : '120px'"
        :rules="rules"
      >
        <el-form-item :label="$t('家长ID')" prop="parentUserId">
          <el-input
            :disabled="!showPayStatus"
            v-model.trim="form.parentUserId"
            :placeholder="$t('请输入')"
            style="width: 192px"
          />
        </el-form-item>
        <br />
        <el-form-item
          prop="studentUserId"
          :label="$t('选择学员')"
          :rules="[
            { required: true, message: $t('请选择'), trigger: 'change' },
          ]"
        >
          <el-select
            v-model="form.studentUserId"
            :placeholder="$t('请选择')"
            :disabled="!showPayStatus"
            @change="
              () => {
                getExpiresAt();
                if (isUpgradeOrder) {
                  showPaidOrderDialog = true;
                  upgradeOrder = null;
                  form.classTypeId = '';
                  form.subjectTypeId = '';
                  form.productId = '';
                }
              }
            "
          >
            <el-option
              v-for="item in studentList"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item :label="$t('学科')" prop="subjectTypeId">
          <el-select
            v-model="form.subjectTypeId"
            :disabled="!showPayStatus || isUpgradeOrder"
            :placeholder="$t('请选择')"
            @change="getQueryList"
          >
            <el-option
              v-for="item in subjectTypeList"
              :key="item.typeCode"
              :label="currentLang === 'zh' ? item.typeNameCn : item.typeNameEn"
              :value="item.typeCode"
            />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item :label="$t('交易 - 课程包类型')" prop="courseTypeId">
          <el-select
            v-model="form.courseTypeId"
            :disabled="isUpgradeOrder"
            :placeholder="$t('请选择')"
            @change="getQueryList"
          >
            <el-option
              v-for="item in packageTypeList"
              :key="item.typeCode"
              :label="currentLang === 'zh' ? item.typeNameCn : item.typeNameEn"
              :value="item.typeCode"
            />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item :label="$t('交易 - 上课形态')" prop="classTypeId">
          <el-select
            v-model="form.classTypeId"
            :disabled="!showPayStatus || isUpgradeOrder"
            :placeholder="$t('请选择')"
            @change="getQueryList"
          >
            <el-option
              v-for="item in classTypeList"
              :key="item.typeCode"
              :label="currentLang === 'zh' ? item.typeNameCn : item.typeNameEn"
              :value="item.typeCode"
            />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item prop="productId" :label="`${$t('选择产品')}(SPU)`">
          <el-select
            :disabled="
              !showPayStatus ||
              form.subjectTypeId === '' ||
              form.courseTypeId === '' ||
              form.classTypeId === '' ||
              isUpgradeOrder
            "
            filterable
            v-model="form.productId"
            :placeholder="$t('请选择')"
            @change="changeProduct"
          >
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item prop="packageId" :label="`${$t('选择商品')}(SKU)`">
          <el-table
            :data="SKUTableData"
            v-loading="SKUTableDataLoading"
            max-height="300"
            border
            style="width: 850px"
            header-cell-class-name="table_header_class"
          >
            <el-table-column
              v-for="item in SKUTableColumns"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="scope">
                <template v-if="item.prop === 'radio'">
                  <el-radio
                    v-model="scope.row[item.prop]"
                    @change="handleRowChange(scope.row)"
                  />
                </template>
                <template v-else-if="item.prop === 'validType'">
                  {{ scope.row.validityTime || "--"
                  }}{{ changeValidityType(scope.row.validityType) }}
                </template>
                <template v-else-if="item.prop === 'subscribeCycle'">
                  {{ scope.row.subscribeCycle || "--"
                  }}{{
                    changeSubscribeCycleUnitType(scope.row.subscribeCycleUnit)
                  }}
                </template>
                <template v-else-if="item.prop === 'expireType'">
                  {{ $t(expireTypeMap[scope.row.expireType]) }}
                </template>
                <template v-else-if="item.prop === 'appShow'">
                  {{ getAppShow(scope.row.validityTime) }}
                </template>
                <template v-else>
                  <span>
                    {{
                      scope.row[item.prop] === null ||
                      scope.row[item.prop] === undefined ||
                      scope.row[item.prop] === "" ||
                      scope.row[item.prop] === 0
                        ? "--"
                        : scope.row[item.prop]
                    }}
                  </span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <br />
        <el-form-item :label="$t('课时到期日')">
          {{ expiresAt ? DateTimeUtils.dateClockTime(expiresAt) : "-" }}
        </el-form-item>
        <el-form-item
          v-if="currRow.buyMultiple === 1 && !isUpgradeOrder"
          prop="buyNum"
          :label="$t('购买数量')"
        >
          <el-input-number
            :min="1"
            :max="999"
            @change="getExpiresAt()"
            v-model="form.buyNum"
            :step="1"
            step-strictly
          ></el-input-number>
        </el-form-item>
        <br />
        <el-form-item :label="$t('课时到期日')">
          {{ expiresAt ? DateTimeUtils.dateClockTime(expiresAt) : "-" }}
        </el-form-item>
        <el-form-item
          v-if="showPayStatus"
          prop="payStatus"
          :label="$t('支付状态')"
        >
          <el-radio-group v-model="form.payStatus">
            <!-- <el-radio :label="1">{{ $t("未支付（进入待支付）") }}</el-radio> -->
            <el-radio :label="2">{{ $t("已支付（进入待审批）") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <br />
        <el-form-item
          v-if="form.payStatus === 2"
          :label="$t('订单创建时间')"
          prop="orderCreateTime"
        >
          <el-date-picker
            style="width: 192px"
            v-model="form.orderCreateTime"
            type="datetime"
            :placeholder="$t('请选择')"
            @change="changeRechargeDate"
            :picker-options="{
              disabledDate(time) {
                return time.getTime() > Date.now();
              },
            }"
          >
          </el-date-picker>
        </el-form-item>
        <br />
        <el-form-item
          v-if="form.payStatus === 2"
          prop="rechargeDate"
          :label="$t('支付成功时间')"
        >
          <el-date-picker
            style="width: 192px"
            v-model="form.rechargeDate"
            type="datetime"
            :placeholder="$t('请选择')"
          >
          </el-date-picker>
        </el-form-item>
        <br />
        <el-form-item
          v-if="form.payStatus === 2"
          prop="code"
          :label="$t('优惠码')"
        >
          <el-input
            v-model.trim="form.code"
            :placeholder="$t('请输入')"
            style="width: 192px"
          />
        </el-form-item>
        <br />
        <el-divider v-if="form.payStatus === 2"></el-divider>
        <el-form-item
          v-if="form.payStatus === 2"
          prop="rechargeChannel"
          :label="$t('一级支付渠道')"
        >
          <!-- 一级渠道传id -->
          <el-select
            v-model="form.rechargeChannel"
            :placeholder="$t('请选择')"
            @change="getPaymentTypeList"
          >
            <el-option
              v-for="item in rechargeChannelList"
              :key="item.id"
              :label="item.channelName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.payStatus === 2 && paymentTypeList.length"
          prop="paymentType"
          :label="$t('二级支付渠道')"
        >
          <!-- 二级渠道传名字 -->
          <el-select v-model="form.paymentType" :placeholder="$t('请选择')">
            <el-option
              v-for="item in paymentTypeList"
              :key="item.id"
              :label="item.channelName"
              :value="item.channelName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.payStatus === 2"
          prop="reference"
          label="Payment ID"
        >
          <el-input
            v-model="form.reference"
            :placeholder="$t('请输入')"
            style="width: 170px"
            size="small"
            type="textarea"
            :autosize="{ minRows: 1 }"
          />
          <i class="el-icon-warning" @click="goExplain" /> </el-form-item
        ><br />
        <el-form-item
          v-if="form.payStatus === 2"
          prop="currencyId"
          :label="$t('实付币种')"
        >
          <el-select
            v-model="form.currencyId"
            :placeholder="$t('请选择')"
            @change="handleCurrencyId"
          >
            <el-option
              v-for="item in currencyIdList"
              :key="item.currencyZh"
              :label="currentLang === 'en' ? item.currency : item.currencyZh"
              :value="item.id"
              :disabled="item.disabled"
            />
          </el-select>
          <el-popover placement="right" width="600" trigger="click">
            <el-table :data="currencyTableData" max-height="500" align="center">
              <el-table-column
                v-for="col in currencyTableColumn"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width="col.width ? col.width : 'auto'"
              >
                <template slot-scope="scope">
                  <template>{{ scope.row[col.prop] || "--" }}</template>
                </template>
              </el-table-column>
            </el-table>
            <i slot="reference" class="el-icon-warning" />
          </el-popover>
        </el-form-item>
        <el-form-item
          v-if="form.payStatus === 2"
          :label="$t('消费税')"
          prop="taxRateId"
        >
          <el-select v-model="form.taxRateId" :placeholder="$t('请选择')">
            <el-option
              v-for="item in gstOptions"
              :key="item.id"
              :label="item.realname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('手续费')" prop="feeId">
          {{ fee || "-" }}% </el-form-item
        ><br />
        <el-form-item
          v-if="form.payStatus === 2"
          prop=""
          :label="$t('是否减收')"
        >
          <el-switch v-model="reduction" />
        </el-form-item>
        <el-form-item
          v-if="form.payStatus === 2"
          prop=""
          :label="$t('减收金额')"
        >
          <el-input-number
            v-model.trim="form.reductionAmount"
            :min="0"
            :disabled="!reduction"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item
          v-if="form.payStatus === 2"
          prop=""
          :label="$t('减收原因')"
        >
          <el-input
            v-model.trim="form.reductionReason"
            :disabled="!reduction"
            :placeholder="$t('请输入')"
          />
        </el-form-item>
        <br />
        <el-form-item
          v-if="form.payStatus === 2"
          prop=""
          :label="$t('是否增收')"
        >
          <el-switch v-model="increase" />
        </el-form-item>
        <el-form-item
          v-if="form.payStatus === 2"
          prop=""
          :label="$t('增收金额')"
        >
          <el-input-number
            v-model.trim="form.increaseAmount"
            :min="0"
            :disabled="!increase"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item
          v-if="form.payStatus === 2"
          prop=""
          :label="$t('增收原因')"
        >
          <el-input
            v-model.trim="form.increaseReason"
            :disabled="!increase"
            :placeholder="$t('请输入')"
          /> </el-form-item
        ><br />
        <el-form-item
          v-if="form.payStatus === 2"
          prop="totalPrice"
          :label="$t('实收金额')"
        >
          {{ form.totalPrice || "--" }} {{ totalPriceCurrency }}
          <el-button
            type="text"
            :disabled="
              !(
                form.parentUserId &&
                form.productId !== '' &&
                form.packageId !== '' &&
                form.currencyId !== ''
              )
            "
            @click="calculate"
            >{{ $t("计算一下") }}</el-button
          >
        </el-form-item>
        <el-form-item
          v-if="form.payStatus === 2"
          prop="receiptUrl"
          :label="$t('收据链接')"
        >
          <el-input
            v-model.trim="form.receiptUrl"
            :placeholder="$t('请输入')"
            style="width: 192px"
          /> </el-form-item
        ><br />
        <template>
          <el-form-item
            v-if="form.payStatus === 2"
            prop=""
            :label="$t('支付凭证')"
          >
            <el-upload
              accept="image/jpg, image/png, image/jpeg"
              :show-file-list="false"
              :before-upload="beforeImageUpload"
              :http-request="uploadImage"
              :disabled="disableUpload"
            >
              <el-button
                size="mini"
                type="primary"
                :loading="uploadLoading"
                :disabled="disableUpload"
              >
                {{ $t("上传") }}
              </el-button>
            </el-upload>
          </el-form-item>
          <section class="img_list">
            <div class="img_box" v-for="(item, index) in imgList" :key="index">
              <el-image
                style="width: 150px; height: 150px"
                :src="item"
                fit="contain"
                :preview-src-list="[item]"
              />
              <span class="del" @click="deleteImg(index)">{{
                $t("删除")
              }}</span>
            </div>
          </section>
        </template>
        <el-divider v-if="form.payStatus === 2"></el-divider>
        <!-- 添加一笔支付 -->
        <div class="clearfix" v-if="form.payStatus === 2">
          <el-button
            class="fr"
            @click="
              () => {
                form.orderAdditionsParam.push({
                  rechargeChannel: '',
                  paymentType: '',
                  reference: '',
                });
              }
            "
            type="primary"
            >{{ $t("添加另一笔支付") }}</el-button
          >
          <div v-for="(item, index) in form.orderAdditionsParam">
            <el-form-item :label="$t('渠道')">
              <FilterByChannel
                @changeSelect="
                  (channelArr) => {
                    form.orderAdditionsParam[index].rechargeChannel =
                      channelArr[0];
                    form.orderAdditionsParam[index].paymentType =
                      channelArr[1] || '';
                  }
                "
              />
            </el-form-item>
            <el-form-item label="Payment ID">
              <el-input
                v-model="form.orderAdditionsParam[index].reference"
                :placeholder="$t('请输入')"
                style="width: 170px"
                size="small"
                type="textarea"
                :autosize="{ minRows: 1 }"
              />
            </el-form-item>
            <i
              v-show="index == form.orderAdditionsParam.length - 1"
              class="el-icon-circle-close"
              @click="
                () => {
                  form.orderAdditionsParam.splice(index, 1);
                }
              "
            ></i>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddOrder">{{ $t("取消") }}</el-button>
        <el-button @click="sureAdd" :loading="sureAddLoading" type="primary">{{
          $t("提交")
        }}</el-button>
      </span>
    </el-dialog>
    <ExamineOrder
      v-if="showExamineDialog"
      :show="showExamineDialog"
      @close="handleCloseExamine"
      @getTableData="getTableData"
      :orderInfo="currentExamineOrderInfo"
      :showDetail="showDetail"
    ></ExamineOrder>
    <InvoiceDialog
      @close="handleCloseInvoiceDialog"
      :show="showInvoice"
      :currentOrderForInvoice="currentOrderForInvoice"
    ></InvoiceDialog>
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('赠品')"
      width="640"
      center
      :visible.sync="showGiftsDialog"
      ><Gifts :listData="activityPolicyRespList" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showGiftsDialog = false">{{
          $t("我知道了")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import ExamineOrder from "./orderSub/examineOrder";
import InvoiceDialog from "./orderSub/invoiceDetail";
import { deepClone } from "../../../utils/handleData";
import { uploadVideoFun } from "@/views/teacherManagement/videoResources/components/uploadVideoFun";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import FilterByChannel from "@/components/FilterItem/FinanceFilter/FilterByChannel";
import { parentIdValidate } from "@/utils/reg.js";
import BatchUploadManualOrders from "@/components/Upload/CustomUpload";
import Gifts from "@/views/studentManagement/components/Gifts.vue";
import MyPaidOrderList from "./components/MyPaidOrderList.vue";
let oldParentUserName = null;
let oldParentUserNameIsError = false;

export default {
  name: "manualOrder",
  components: {
    ExamineOrder,
    InvoiceDialog,
    FilterByTimePeriod,
    FilterByChannel,
    BatchUploadManualOrders,
    Gifts,
    MyPaidOrderList,
  },
  data() {
    let parentUserId = async (rule, value, callback) => {
      if (!value) {
        this.form.studentUserId = null;
        this.studentList = [];
        oldParentUserName = null;
        return callback(new Error(this.$t("请输入")));
      }
      if (value === oldParentUserName) {
        if (oldParentUserNameIsError)
          return callback(new Error(this.$t("家长账号不存在")));
        return callback();
      }
      oldParentUserName = value;
      this.form.studentUserId = null;
      this.studentList = [];
      const {
        status,
        data: { code, data },
      } = await this.$Api.financeManagement.getStudentListByParentId({
        parentUserId: this.form.parentUserId,
        status: 1,
      });
      if (status !== 200 || code !== 200 || data.length <= 0) {
        oldParentUserNameIsError = true;
        return callback(new Error(this.$t("家长账号不存在")));
      }
      oldParentUserNameIsError = false;
      this.studentList = data;
      this.form.totalPrice = "";
      callback();
    };
    let productId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请选择")));
      } else {
        return callback();
      }
    };
    let rechargeDate = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请选择")));
      } else {
        if (
          value &&
          this.form.orderCreateTime &&
          value.getTime() < this.form.orderCreateTime.getTime()
        ) {
          return callback(
            new Error(this.$t("支付成功时间不得在订单创建时间之前"))
          );
        }
        return callback();
      }
    };
    let reference = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请输入")));
      } else {
        return callback();
      }
    };
    let rechargeChannel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请选择")));
      } else {
        return callback();
      }
    };
    let paymentType = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请选择")));
      } else {
        return callback();
      }
    };
    let currencyId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请选择")));
      } else {
        return callback();
      }
    };
    let totalPrice = (rule, value, callback) => {
      if (this.form.paymentType !== "undertake" && !value) {
        return callback(new Error(this.$t("请计算")));
      } else {
        return callback();
      }
    };
    let subjectTypeId = (rule, value, callback) => {
      return value === "" ? callback(new Error(this.$t("请选择"))) : callback();
    };
    let courseTypeId = (rule, value, callback) => {
      return value === "" ? callback(new Error(this.$t("请选择"))) : callback();
    };
    let classTypeId = (rule, value, callback) => {
      return value === "" ? callback(new Error(this.$t("请选择"))) : callback();
    };
    return {
      expiresAt: "",
      expireTypeMap: {
        0: "从当前有效期结束开始计算",
        1: "课时到账时开始计算",
      },
      currRow: {},
      currentOrderForInvoice: {}, // 当前点击的订单（收据）
      showInvoice: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() + 24 * 60 * 60 * 1000;
        },
      },
      showPayStatus: true,
      activeName: "0",
      applyDate: [],
      manualOrderDetail: null,
      screenData: {
        pageNum: 1,
        pageSize: 50,
        startTime: "",
        endTime: "",
        adviserUserId: "",
        xgUserId: "",
        parentUserId: "",
        taxRateId: "",
        startTime: "",
        endTime: "",
        paySuccessStartTime: "",
        paySuccessEndTime: "",
        examineStartTime: "",
        examineEndTime: "",
      },
      tableData: [],
      loading: false,
      addOrderDialog: false,
      showPaidOrderDialog: false,
      sureAddLoading: false,
      form: {
        orderCreateTime: "",
        parentUserId: "",
        rechargeDate: "",
        code: "",
        rechargeChannel: "",
        paymentType: "",
        totalPrice: "",
        currencyId: "",
        receiptUrl: "",
        reference: "",
        payStatus: 2,
        courseTypeId: 1,
        subjectTypeId: "",
        classTypeId: "",
        productId: "",
        packageId: "",
        studentUserId: null,
        reductionAmount: 0, // 减收金额
        reductionReason: "", // 减收原因
        increaseAmount: 0, // 增收金额
        increaseReason: "", // 增收原因
        orderAdditionsParam: [], //增加一笔支付
        upgradeOrder: null,
        buyNum: 1,
      },
      manualOrderId: "",
      radio: 1,
      gstOptions: [],
      rechargeChannelList: [],
      paymentTypeList: [],
      currencyIdList: [],
      rules: {
        parentUserId: [
          { required: true, validator: parentUserId, trigger: "blur" },
        ],
        productId: [
          { required: true, validator: productId, trigger: "change" },
        ],
        rechargeDate: [
          { required: true, validator: rechargeDate, trigger: "change" },
        ],
        reference: [{ required: true, validator: reference, trigger: "blur" }],
        rechargeChannel: [
          { required: true, validator: rechargeChannel, trigger: "change" },
        ],
        paymentType: [
          { required: true, validator: paymentType, trigger: "change" },
        ],
        totalPrice: [
          { required: true, validator: totalPrice, trigger: "blur" },
        ],
        currencyId: [
          { required: true, validator: currencyId, trigger: "change" },
        ],
        subjectTypeId: [
          { required: true, validator: subjectTypeId, trigger: "change" },
        ],
        orderCreateTime: [
          { required: true, validator: subjectTypeId, trigger: "change" },
        ],
        courseTypeId: [
          { required: true, validator: courseTypeId, trigger: "change" },
        ],
        classTypeId: [
          { required: true, validator: classTypeId, trigger: "change" },
        ],
      },
      productList: [],
      studentList: [],
      coursePackageList: [],
      skuList: [],
      showExamineDialog: false,
      currentExamineOrderInfo: {},
      auditStatus: 0,
      isCreate: true,
      currentManualOrderId: null,
      subjectTypeList: [],
      packageTypeList: [],
      classTypeList: [],
      tableColumn0: [],
      tableColumn1: [],
      tableColumn2: [],
      currencyTableColumn: [],
      currencyTableData: [],
      currency: "--",
      SKUTableData: [],
      SKUTableDataLoading: false,
      reduction: false,
      increase: false,
      totalPriceCurrency: "",
      imgList: [],
      uploadLoading: false,
      showDetail: false,
      defaultTimeArr: null,
      feeId: null /* 手续费率id */,
      fee: null /* 手续费率 */,
      activityPolicyRespList: [],
      showGiftsDialog: false,
      isUpgradeOrder: false,
    };
  },
  computed: {
    ...mapState({
      xgAndGwListSet: (state) => state.user.xgAndGwListSet,
    }),
    ...mapGetters(["currentLang"]),
    gwTeacherList() {
      return this.xgAndGwListSet.filter((item) => item.roleName == "课程顾问");
    },
    xgTeacherList() {
      return this.xgAndGwListSet.filter((item) => item.roleName == "学管");
    },
    formPayStatus() {
      return this.form.payStatus;
    },
    SKUTableColumns() {
      return [
        { label: "", prop: "radio", width: 50 },
        { label: this.$t("交易 - 课时数量"), prop: "amount" },
        { label: this.$t("中文名称"), prop: "nameCn" },
        { label: this.$t("英文名称"), prop: "nameEn" },
        { label: this.$t("订阅周期"), prop: "subscribeCycle" },
        { label: this.$t("有效期"), prop: "validType" },
        {
          label: this.$t("有效期计算方式"),
          width: 120,
          prop: "expireType",
        },
        { label: this.$t("总价") + "(SGD)", prop: "SGD" },
        { label: this.$t("总价") + "(USD)", prop: "USD" },
        { label: this.$t("总价") + "(HKD)", prop: "HKD" },
        { label: this.$t("总价") + "(EUR)", prop: "EUR" },
        { label: this.$t("总价") + "(THB)", prop: "THB" },
        { label: this.$t("总价") + "(IDR)", prop: "IDR" },
        { label: this.$t("总价") + "(AUD)", prop: "AUD" },
        { label: this.$t("总价") + "(CNY)", prop: "CNY" },
        { label: this.$t("总价") + "(JPY)", prop: "JPY" },
      ];
    },
    disableUpload() {
      return this.imgList.length >= 10 || this.uploadLoading;
    },
  },
  watch: {
    async formPayStatus(value) {
      let copyobj = JSON.parse(JSON.stringify(this.form));
      this.form = this.$options.data().form;
      const resetWhiteList = [
        "payStatus",
        "parentUserId",
        "studentUserId",
        "subjectTypeId",
        "courseTypeId",
        "classTypeId",
        "productId",
        "packageId",
      ];
      resetWhiteList.forEach((v) => (this.form[v] = copyobj[v]));
      await this.$nextTick();
      this.$refs.form.clearValidate();
    },
    addOrderDialog(value) {
      if (value) {
        this.getCurrencyList();
      }
    },
    "form.reductionAmount"() {
      this.form.totalPrice = null;
    },
    "form.increaseAmount"() {
      this.form.totalPrice = null;
    },
    "form.taxRateId"() {
      this.form.totalPrice = null;
    },
    reduction() {
      this.form.totalPrice = null;
    },
    increase() {
      this.form.totalPrice = null;
    },
    "form.currencyId"(val) {
      if (this.form.paymentType && this.form.paymentType.length) {
        this.reqSaleTax();
      }
    },
    "form.paymentType"(val) {
      if (val && val.length && this.form.currencyId) {
        this.reqSaleTax();
      }
    },
  },
  methods: {
    giftMap(item) {
      return `${
        this.currentLang === "zh" ? item.campaignTitle : item.campaignTitleEn
      } ${item.value} ${this.currentLang === "zh" ? item.unitZh : item.unitEn}`;

      // switch (item.giftType) {
      //   this.currentLang

      //   case 1:
      //     return `${this.currentLang==='zh'?item.campaignTitle:item.campaignTitleEn} ${item.value} ${this.currentLang==='zh'?item.unitZh:item.unitEn}`
      //   case 2:
      //   case 3:
      //     return `SKU: ${item.skuId} ${item.skuName}`;
      //   case 4:
      //     return `${this.$t('课时')} ${item.amount ? item.amount : "--"}`;
      //   case 5:
      //     return `${this.$t('积分')} ${item.amount ? item.amount : "--"}`;
      //   case 6:
      //     return `${this.$t('打卡次数')} ${item.amount}`;
      // }
      // return;
    },
    async getExpiresAt() {
      this.expiresAt = "";
      if (!this.form.studentUserId || !this.currRow.id || !this.currRow.amount)
        return;
      let params = {
        studentId: this.form.studentUserId,
        courseProductDetailId: this.currRow.id,
        exchangeNum: this.form.buyNum,
      };
      const res = await this.$Api.financeManagement.reqAccountExpiresAt(params);
      this.expiresAt = res;
    },
    importSuccessFn() {
      if (this.activeName === "3") {
        this.getTableData();
      }
    },
    async reqSaleTax() {
      try {
        let currency = this.currencyIdList.filter(
          (item) => item.id === this.form.currencyId
        )[0].currency;
        const res = await this.$Api.financeManagement.reqProcessingFee({
          currency: currency,
          payType: this.form.paymentType,
        });
        if (res) {
          this.feeId = res.feeId;
          this.fee = res.fee;
        } else {
          this.feeId = null;
          this.fee = null;
        }
      } catch {}
    },
    async beforeImageUpload(file) {
      const { validateFileType, validateFileSize } = uploadVideoFun(this);
      await validateFileType(file.name, ["jpeg", "jpg", "png"]);
      await validateFileSize(file.size, 3);
    },
    uploadImage({ file }) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", 3); // 1-sku上传; 2-订单退款上传; 3-对账优化上传
      this.uploadLoading = true;
      this.$Api.systemManagement
        .uploadFileInterface(formData)
        .then(({ status, data: { code, data } }) => {
          if (status === 200 && code === 200) {
            this.imgList.push(data);
          }
        }) // 更新校验状态
        .finally(() => (this.uploadLoading = false));
    },
    // 删除图片
    deleteImg(index) {
      this.imgList.splice(index, 1);
    },
    goExplain() {
      window.open(
        "https://www.notion.so/shawcc/PaymentID-0cdc43a6a02544db94d09bdb4e688f40",
        "__blank"
      );
    },
    // 实收金额计算
    calculate() {
      let params = {
        parentUserId: this.form.parentUserId, // 家长ID
        productId: this.form.productId, // supid
        packageId: this.form.packageId, // skuid
        taxRateId: this.form.taxRateId, // 消费税
        reductionAmount: this.reduction ? this.form.reductionAmount : 0, // 减收金额
        increaseAmount: this.increase ? this.form.increaseAmount : 0, // 增收金额
        code: this.form.code, // 优惠券
        currencyId: this.form.currencyId, // 币种
        currency: this.totalPriceCurrency,
        feeId: this.feeId,
        buyNum: this.form.buyNum,
      };
      if (this.isUpgradeOrder) {
        params.upgradeOrderId = this.upgradeOrder.orderId;
        params.upgradeType = 1;
      }
      this.$Api.financeManagement
        .getCalculateAmount(params)
        .then(({ status, data: { code, data } }) => {
          if (status === 200 && code === 200) {
            this.form.totalPrice = data ?? "--";
            this.totalPriceCurrency = this.currencyIdList.filter(
              (item) => item.id === this.form.currencyId
            )[0].currency;
            this.$refs.form.clearValidate();
          }
        });
    },
    // 获取下拉数据
    getConstantList() {
      this.$Api.financeManagement
        .getChannelList()
        .then(({ status, data: { code, data } }) => {
          if (status === 200 && code === 200) {
            this.rechargeChannelList = data ?? [];
          }
        });
      this.$Api.financeManagement
        .getRateListAll()
        .then(({ status, data: { code, data } }) => {
          if (status === 200 && code === 200) {
            this.currencyTableData = data ?? [];
          }
        });
    },
    // 获取二级渠道下拉数据
    getPaymentTypeList(val) {
      this.form.paymentType = "";
      this.paymentTypeList = [];
      this.rechargeChannelList?.forEach((item) => {
        if (item.id === val) {
          this.paymentTypeList = item?.childList ?? [];
          // 如果没有二级渠道，paymentType需要传一级渠道的名字
          this.form.paymentType = item?.childList?.length
            ? null
            : item.channelName;
        }
      });
    },
    handleRowChange(val) {
      this.setCurrencyList(val);
      this.SKUTableData.forEach((item) => {
        if (item.id !== val.id) {
          item.radio = false;
        }
      });
      this.currRow = val;
      this.form.packageId = val.id;
      this.form.totalPrice = "";
      this.getExpiresAt();
    },
    setCurrencyList(row) {
      this.currencyIdList.forEach((e) => {
        e.disabled = !row[e.currency] || row[e.currency] <= 0;
      });
      this.form.currencyId = "";
    },
    handleCurrencyId() {
      this.form.totalPrice = "";
      this.totalPriceCurrency = this.currencyIdList.filter(
        (item) => item.id === this.form.currencyId
      )[0].currency;
    },
    changeValidityType(val) {
      switch (val) {
        case 0:
          return this.$t("年");
        case 1:
          return this.$t("月");
        case 2:
          return this.$t("日");
        default:
          return "--";
      }
    },
    changeSubscribeCycleUnitType(val) {
      switch (val) {
        case 0:
          return this.$t("日");
        case 1:
          return this.$t("周");
        case 2:
          return this.$t("月");
        case 3:
          return this.$t("年");
        default:
          return "--";
      }
    },
    getAppShow(id) {
      switch (id) {
        case 0:
          return this.currentLang === "en" ? "no" : "不展示";
        case 1:
          return this.currentLang === "en" ? "yes" : "展示";
        default:
          return "--";
      }
    },
    setTableColumn() {
      this.tableColumn0 = [
        { label: "订单编号", prop: "orderNo", width: "260" },
        { label: "订单创建时间", prop: "createTime", width: "200" },
        { label: "家长ID", prop: "parentUserId", width: "150" },
        { label: "学生姓名", prop: "studentUserName", width: "120" },
        { label: "充值产品(SPU)", prop: "productName", width: "180" },
        { label: "充值商品(SKU)", prop: "productPackageName", width: "180" },
        { label: "赠送课时", prop: "incentiveAmount", width: "140" },
        { label: "订单添加人", prop: "creteUserName" },
      ];
      this.tableColumn1 = [
        {
          label: "订单创建时间",
          prop: "createTime",
          width: "200",
          fixed: true,
        },
        { label: "家长ID", prop: "parentUserId", width: "150", fixed: true },
        { label: "订单编号", prop: "orderNo", width: "260" },
        { label: "学生姓名", prop: "studentUserName", width: "120" },
        { label: "充值产品(SPU)", prop: "productName", width: "180" },
        { label: "充值商品(SKU)", prop: "productPackageName", width: "180" },
        { label: "赠送课时", prop: "incentiveAmount", width: "140" },
        { label: "消费税", prop: "taxRateName", width: "120" },
        { label: "消费税率", prop: "taxRate", width: "120" },
        { label: "支付金额", prop: "totalPrice", width: "180" },
        { label: "币种", prop: "currency", width: "120" },
        { label: "支付成功时间", prop: "rechargeDate", width: "150" },
        { label: "优惠码", prop: "code", width: "130" },
        { label: "本次充值课程顾问", prop: "adviserUserName", width: "150" },
        { label: "本次充值学管", prop: "xgUserName", width: "120" },
        { label: "订单添加人", prop: "creteUserName" },
      ];
      this.tableColumn2 = [
        {
          label: "订单创建时间",
          prop: "createTime",
          width: "200",
          fixed: true,
        },
        { label: "家长ID", prop: "parentUserId", width: "150", fixed: true },
        { label: "订单编号", prop: "orderNo", width: "260" },
        { label: "学生姓名", prop: "studentUserName", width: "120" },
        { label: "充值产品(SPU)", prop: "productName", width: "180" },
        { label: "充值商品(SKU)", prop: "productPackageName", width: "180" },
        { label: "赠送课时", prop: "incentiveAmount", width: "140" },
        { label: "赠品信息", prop: "orderGiftItemRespList", width: "260" },
        { label: "消费税", prop: "taxRateName", width: "120" },
        { label: "消费税率", prop: "taxRate", width: "120" },
        { label: "支付金额", prop: "totalPrice", width: "180" },
        { label: "币种", prop: "currency", width: "120" },
        { label: "支付成功时间", prop: "rechargeDate", width: "150" },
        { label: "优惠码", prop: "code", width: "130" },
        { label: "本次充值课程顾问", prop: "adviserUserName", width: "150" },
        { label: "本次充值学管", prop: "xgUserName", width: "120" },
        { label: "审批结论", prop: "status", width: "160" },
        { label: "审批人", prop: "auditUserName", width: "120" },
        { label: "审批通过时间", prop: "updateTime", width: "140" },
        { label: "订单添加人", prop: "creteUserName" },
      ];
      this.currencyTableColumn = [
        { label: "currency", prop: "currency" },
        { label: "currency_symbol", prop: "currencySymbol", width: "120" },
        { label: "currency_en", prop: "currencyEn", width: "120" },
        { label: "currency_zh", prop: "currencyZh", width: "120" },
        { label: "rate", prop: "rate", width: "120" },
      ];
    },
    // 获取 spu 下拉数据
    async getQueryList(supId) {
      this.form.productId = this.isUpgradeOrder ? supId : "";
      this.form.packageId = "";
      this.form.totalPrice = "";
      this.SKUTableData = [];
      this.productList = [];
      const { subjectTypeId, courseTypeId, classTypeId } = this.form;
      if (subjectTypeId !== "" && courseTypeId !== "" && classTypeId !== "") {
        let params = {
          subjectTypeId,
          courseTypeId,
          classTypeId,
        };
        const {
          status,
          data: { code, data },
        } = await this.$Api.financeManagement.getSPUOptionLits(params);
        if (status === 200 && code === 200) {
          this.productList = data;
        }
      }
    },
    // 关闭收据dialog
    handleCloseInvoiceDialog() {
      this.showInvoice = false;
    },
    //弹出收据dialog
    handleShowInvoiceDialog(scopeRow) {
      this.currentOrderForInvoice = deepClone(scopeRow);
      this.showInvoice = true;
    },
    // 打开审批dialog
    handleOpenExamine(orderInfo, disable) {
      this.showExamineDialog = true;
      this.currentExamineOrderInfo = orderInfo;
      this.showDetail = disable;
    },
    // 关闭审批dialog
    handleCloseExamine(needGetTableList) {
      this.showExamineDialog = false;
      this.currentExamineOrderInfo = {};
      if (needGetTableList) {
        this.getTableData();
      }
    },
    // 订单录入信息完善
    async handleEnterPaymentRecord(scopeRow) {
      this.currentManualOrderId = scopeRow.manualOrderId;
      this.showPayStatus = false;
      this.isCreate = false;
      let { parentUserId, productName, productPackageId } = scopeRow;
      oldParentUserName = parentUserId;
      this.form.parentUserId = parentUserId;
      this.form.subjectTypeId = scopeRow.subjectTypeId;
      this.form.courseTypeId = scopeRow.courseTypeId;
      this.form.classTypeId = scopeRow.classTypeId;
      this.form.orderCreateTime = new Date(scopeRow.createTime);
      await this.getQueryList();
      let productId = this.productList.find(
        (item) => item.name === productName
      )?.id;
      this.form.packageId = productPackageId;
      if (productId) {
        this.changeProduct(productId, productPackageId);
      }
      this.form.productId = productId;
      this.form.payStatus = 2;
      this.$Api.financeManagement
        .getStudentListByParentAccount(parentUserId)
        .then(({ status, data: { code, data } }) => {
          if (status === 200 && code === 200) {
            this.studentList = data.studentInfoList;
            this.form.studentUserId = scopeRow.studentUserId;
          }
        });
      this.addOrderDialog = true;
    },
    handleClickTabs() {
      this.auditStatus = this.activeName * 1;
      if (this.auditStatus != 0) {
        this.screenData.startTime = this.defaultTimeArr[0];
        this.screenData.endTime = this.defaultTimeArr[1];
      }
      this.getTableData();
    },
    changeRechargeDate(value) {
      this.$Api.operateManagement
        .getGstList(1, 100, {
          searchTime: new Date(value).toISOString(),
          status: 1,
        })
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            data.data.list.forEach((item) => {
              item.realname = `${item.taxRateName} ${item.taxRate}%`;
            });
            this.gstOptions = [
              { realname: "无消费税", id: -1 },
              ...data.data.list,
            ];
          }
        });
    },
    // 根据spu查询sku
    changeProduct(value, productPackageId) {
      this.expiresAt = "";
      this.form.buyNum = 1;
      this.$Api.financeManagement
        .getSKUListBySPUManual({ spuId: value })
        .then(({ status, data: { code, data } }) => {
          if (status === 200 && code === 200) {
            if (data) {
              if (productPackageId) {
                /* 录入付款记录回显sku */
                data = data.filter((e) => {
                  return e.id === productPackageId;
                });
              } else {
                data.forEach((item) => {
                  item.radio = false;
                  item.currencyTotalPriceList &&
                    item.currencyTotalPriceList.forEach((e) => {
                      item[e.currency] = e.totalPrice;
                    });
                });
                this.form.packageId = "";
                this.form.totalPrice = "";
              }
            }
            if (this.isUpgradeOrder) {
              this.SKUTableData = data.filter((e) => {
                return this.upgradeOrder.skuIds.includes(e.id);
              });
            } else {
              this.SKUTableData = data ?? [];
            }
          }
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
    search() {
      this.screenData.pageNum = 1;
      this.getTableData();
    },
    getTableData() {
      if (
        this.screenData &&
        this.screenData.parentUserId &&
        !parentIdValidate(this, this.screenData.parentUserId)
      ) {
        return;
      }
      this.loading = true;
      let {
        pageNum,
        pageSize,
        startTime,
        endTime,
        paySuccessStartTime,
        paySuccessEndTime,
        examineStartTime,
        examineEndTime,
        adviserUserId,
        xgUserId,
        parentUserId,
      } = this.screenData;

      let params = {
        startTime,
        endTime,
        paySuccessStartTime,
        paySuccessEndTime,
        examineStartTime,
        examineEndTime,
        adviserUserId,
        xgUserId,
        parentUserId,
        auditStatus: this.auditStatus,
      };
      if (this.activeName == 0) {
        delete params.startTime;
        delete params.endTime;
      }
      this.$Api.financeManagement
        .getManualOrderList(pageNum, pageSize, params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.total;
          }
          this.loading = false;
        });
    },
    showAddOrderDialog(val) {
      this.isUpgradeOrder = val === 2;
      this.isCreate = true;
      this.showPayStatus = true;
      this.addOrderDialog = true;
    },
    async closeAddOrder() {
      this.expiresAt = "";
      oldParentUserName = null;
      oldParentUserNameIsError = false;
      this.addOrderDialog = false;
      this.studentList = [];
      this.SKUTableData = [];
      this.imgList = [];
      this.form = this.$options.data().form;
      this.fee = null;
      this.feeId = null;
      this.form.productId = "";
      await this.$nextTick();
      this.$refs["form"].clearValidate();
    },
    async getUpgradeOrder(order, orderId) {
      this.closePaidOrderOrder();
      this.upgradeOrder = order;
      this.upgradeOrder.orderId = orderId;
      this.form.classTypeId = order.classTypeId;
      this.form.subjectTypeId = order.subjectId;
      this.form.productId = order.spuId;
      await this.getQueryList(order.spuId);
      await this.changeProduct(order.spuId);
    },
    closePaidOrderOrder() {
      this.showPaidOrderDialog = false;
    },
    sureAdd() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let params = {};
          let {
            code,
            currencyId,
            parentUserId,
            payStatus,
            paymentType,
            receiptUrl,
            rechargeDate,
            packageId,
            rechargeChannel,
            reference,
            totalPrice,
            taxRateId,
            studentUserId,
            productId,
            reductionAmount, // 减收金额
            reductionReason, // 减收原因
            increaseAmount, // 增收金额
            increaseReason, // 增收原因
            orderAdditionsParam,
            orderCreateTime,
            buyNum,
          } = this.form;
          this.sureAddLoading = true;
          if (payStatus == 1) {
            // 创建订单
            params = {
              studentUserId,
              packageId,
              parentUserId,
              productId,
            };
          } else if (payStatus == 2) {
            // 创建订单并支付
            let orderCreateParam = {
              code,
              currencyId,
              paymentType,
              receiptUrl,
              rechargeChannel,
              rechargeDate: rechargeDate.toISOString(),
              reference,
              taxRateId,
              totalPrice,
              reductionAmount, // 减收金额
              reductionReason, // 减收原因
              increaseAmount, // 增收金额
              increaseReason, // 增收原因
              paymentVoucherPathList: this.imgList,
              orderAdditionsParam,
              orderCreateTime: orderCreateTime.toISOString(),
              feeId: this.feeId,
              fee: this.fee,
              buyNum: buyNum,
            };
            params = {
              studentUserId,
              packageId,
              parentUserId,
              productId,
              orderCreateParam,
            };
            if (!this.isCreate) {
              this.$Api.financeManagement
                .manualPaymentOrderInfo(
                  this.currentManualOrderId,
                  orderCreateParam
                )
                .then(({ status, data }) => {
                  if (status == 200 && data.code == 200) {
                    this.$notify({
                      message: this.$t("操作成功"),
                      type: "success",
                    });
                    this.getTableData();
                    this.closeAddOrder();
                  }
                  this.sureAddLoading = false;
                  return;
                })
                .catch((error) => {
                  this.sureAddLoading = false;
                  return;
                });
              return;
            }
          }
          if (this.isUpgradeOrder && payStatus == 2) {
            params.orderCreateParam.upgradeOrderId = this.upgradeOrder.orderId;
            params.orderCreateParam.upgradeType = 1;
          }
          this.$Api.financeManagement
            .manualAddOrder(params)
            .then(({ status, data }) => {
              if (data.code == 40000) {
                this.$notify({
                  message: this.$t("优惠券无效"),
                  type: "error",
                });
              }
              if (status === 200 && data.code == 200) {
                this.$notify({
                  message: this.$t("操作成功"),
                  type: "success",
                });
                this.getTableData();
                this.closeAddOrder();
              }
              this.sureAddLoading = false;
              if (
                data.data.activityPolicyRespList &&
                data.data.activityPolicyRespList.length
              ) {
                this.activityPolicyRespList = data.data.activityPolicyRespList;
                this.showGiftsDialog = true;
              }
            })
            .catch((error) => {
              this.sureAddLoading = false;
            });
        }
      });
    },
    getCurrencyList() {
      this.$Api.financeManagement.getCurrencyList().then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          this.currencyIdList = data.data;
        }
      });
    },
    // 学科/课程包类型/上课形态列表
    async getSubjectClassTypeList() {
      const {
        status,
        data: { code, data },
      } = await this.$Api.systemManagement.getSubjectClassTypeList();
      if (status === 200 && code === 200) {
        this.subjectTypeList = data?.subjectTypeList ?? [];
        this.packageTypeList = data?.packageTypeList ?? [];
        this.classTypeList = data?.classTypeList ?? [];
      }
    },
  },
  created() {
    this.setTableColumn();
    this.defaultTimeArr = [
      new Date(this.DateTimeUtils.getMonthStartDate()),
      new Date(this.DateTimeUtils.getMonthEndDate()),
    ];
    this.screenData.startTime = this.defaultTimeArr[0];
    this.screenData.endTime = this.defaultTimeArr[1];
    this.getTableData();
    this.getSubjectClassTypeList();
    this.getConstantList();
  },
};
</script>
<style lang="scss" scoped>
.manual-order-wrap {
  .upload {
    position: absolute;
    top: 14px;
    right: 24px;
  }
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  .table-wrap {
    width: 100%;
    .add-btn-wrap {
      width: 100%;
      text-align: right;
      padding-top: 10px;
    }
  }
  .img_list {
    display: flex;
    flex-wrap: wrap;
    .img_box {
      position: relative;
      width: 150px;
      height: 150px;
      margin: 10px 10px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba($color: #000000, $alpha: 0.3);
      .del {
        position: absolute;
        top: 0;
        right: 0;
        width: 50px;
        height: 20px;
        background: #eb5851;
        color: #fff;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
      }
    }
  }
  .add-form {
    height: 550px;
    overflow-y: scroll;
    .el-icon-circle-close {
      font-size: 20px;
      cursor: pointer;
      line-height: 32px;
    }
    .el-icon-circle-close:hover {
      color: #7580e5;
    }
  }
}
</style>
