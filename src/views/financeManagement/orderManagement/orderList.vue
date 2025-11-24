<template>
  <div class="order-list-wrap" v-loading="loading">
    <screen-wrapper @search="search" :screenTitle="$t('订单列表')">
      <screen-item
        :label="$t('订单创建时间')"
        :part="2"
        label-width="100"
        v-if="
          Per.handleButtonPer(
            'financeMT.employeePerformance.attendClassInfo.cdFilerByDate'
          )
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
          )
        "
      >
        <FilterByTimePeriod
          @changeSelect="
            (timeArr) => {
              screenData.orderPaySuccessStartTime = timeArr[0];
              screenData.orderPaySuccessEndTime = timeArr[1];
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('common-Course Consultants')"
        :labelWidth="'130'"
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
          v-model="screenData.adviserId"
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
        :label="$t('common-Learning Advisor')"
        :labelWidth="'120'"
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
          v-model="screenData.xgId"
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
          :placeholder="
            $t('glb-input') +
            (currentLang == 'en' ? ' ' + $t('家长id') : '家长ID')
          "
          @keyup.enter.native="search"
        />
      </screen-item>
      <screen-item
        :label="$t('支付状态')"
        :labelWidth="'120'"
        :part="2"
        v-if="
          Per.handleButtonPer(
            'financeMT.orderManagement.orderList.paymentStatus'
          )
        "
      >
        <el-select
          clearable
          filterable
          v-model="screenData.paymentStatus"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="(item, index) in paymentStatusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('退款 - 订单编号')" :labelWidth="'120'" :part="2">
        <el-input
          style="width: 170px"
          v-model.trim="screenData.orderNo"
          clearable
          :placeholder="
            $t('glb-input') +
            (currentLang == 'en' ? ' ' + $t('退款 - 订单编号') : '订单编号')
          "
          @keyup.enter.native="search"
        />
      </screen-item>
    </screen-wrapper>
    <div class="table-wrapper">
      <div class="btn-wrap">
        <el-button-group class="type-btn">
          <el-button
            @click="changeType(-1)"
            size="medium"
            :type="type == -1 ? 'primary' : ''"
            >{{ $t("全部") }}</el-button
          >
          <el-button
            @click="changeType(0)"
            size="medium"
            :type="type == 0 ? 'primary' : ''"
            >{{ $t("待支付") }}</el-button
          >
          <el-button
            @click="changeType(7)"
            size="medium"
            :type="type == 2 ? 'primary' : ''"
            >{{ $t("处理中") }}</el-button
          >
          <el-button
            @click="changeType(1)"
            size="medium"
            :type="type == 1 ? 'primary' : ''"
            >{{ $t("已支付") }}</el-button
          >
          <el-button
            @click="changeType(5)"
            size="medium"
            :type="type == 5 ? 'primary' : ''"
            >{{ $t("已取消") }}</el-button
          >
          <el-button
            @click="changeType(3)"
            size="medium"
            :type="type == 3 ? 'primary' : ''"
            >{{ $t("已退款") }}</el-button
          >
        </el-button-group>
      </div>
      <div v-if="type == -1 && tableData != null">
        <el-table
          :data="tableData"
          v-loading="loading"
          tooltip-effect="dark"
          :border="false"
          fit
          show-overflow-tooltip="true"
          style="width: 100%; margin-top: 10px"
          stripe
          :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
          max-height="500"
        >
          <el-table-column fixed align="center" :label="$t('序号')">
            <template slot-scope="scope"
              >{{
                (screenData.pageNum - 1) * screenData.pageSize +
                scope.$index +
                1
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
               <template v-else-if="col.prop === 'successTime'">{{
                DateTimeUtils.dateClockTime(scope.row.successTime)
              }}</template>
              <template v-else-if="col.prop === 'parentUserId'">
                <router-link
                  :to="{
                    path: `/studentManagement/parentInfo`,
                    query: { parentUserId: scope.row.parentUserId },
                  }"
                >
                  <el-button type="text"
                    >{{ scope.row.parentUserId }}
                  </el-button>
                </router-link>
              </template>
              <template v-else-if="col.prop === 'taxRate'">
                <span v-if="scope.row.taxRateName"
                  >{{ scope.row.taxRate }}%</span
                >
                <span v-else>--</span>
              </template>
              <template v-else-if="col.prop === 'totalPrice'"
                >{{ scope.row[col.prop] || "--" }}
                {{ scope.row.currency }}</template
              >
              <template v-else-if="col.prop === 'taxRateName'"
                >{{ scope.row[col.prop] || "--" }}
                {{ scope.row.currency }}</template
              >
              <template v-else-if="col.prop === 'status'">{{
                Filters.orderStatusFilter(scope.row.status, currentLang)
              }}</template>
              <template v-else>{{ scope.row[col.prop] || "--" }}</template>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('操作')" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="showOrderDetail(scope.row)">{{
                $t("View details")
              }}</el-button>
              <el-button
                type="text"
                v-if="scope.row.taxStatus === 1 && scope.row.status === 0"
                @click="handleShowChangeGst(scope.row)"
                >{{ $t("修改消费税") }}</el-button
              >
              <el-button
                type="text"
                v-if="scope.row.status === 1 || scope.row.status === 3"
                @click="handleShowInvoiceDialog(scope.row)"
                >{{ $t("收据") }}</el-button
              >
              <el-button
                v-if="
                  Per.handleButtonPer(
                    'financeMT.orderManagement.orderList.applyForRefund'
                  ) && scope.row.status === ORDER_STATUS.paymentDone
                "
                type="text"
                @click="openRefund(ORDER_STATUS.paymentDone, scope.row)"
              >
                {{ $t("申请退款") }}
              </el-button>
              <el-button
                v-if="
                  Per.handleButtonPer(
                    'financeMT.orderManagement.orderList.refundDetails'
                  ) &&
                  (scope.row.status === ORDER_STATUS.refunded ||
                    scope.row.status === ORDER_STATUS.anotherRefunded)
                "
                type="text"
                @click="openRefund(ORDER_STATUS.refunded, scope.row)"
              >
                {{ $t("退款详情") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="type == 0 && tableData != null">
        <el-table
          :data="tableData"
          v-loading="loading"
          tooltip-effect="dark"
          :border="false"
          fit
          show-overflow-tooltip="true"
          style="width: 100%; margin-top: 10px"
          stripe
          :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
          max-height="500"
        >
          <el-table-column
            fixed
            align="center"
            :label="$t('序号')"
            :width="120"
          >
            <template slot-scope="scope"
              >{{
                (screenData.pageNum - 1) * screenData.pageSize +
                scope.$index +
                1
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
              <template v-if="col.prop === 'paymentStatus'">
                {{ paymentStatusMap[scope.row.paymentStatus] }}</template
              >
              <template v-else-if="col.prop === 'parentUserId'">
                <router-link
                  :to="{
                    path: `/studentManagement/parentInfo`,
                    query: { parentUserId: scope.row.parentUserId },
                  }"
                >
                  <el-button type="text"
                    >{{ scope.row.parentUserId }}
                  </el-button>
                </router-link>
              </template>
              <template v-else-if="col.prop === 'chargeTimes'">{{
                scope.row.chargeTimes > 0 ? $t("是") : $t("否")
              }}</template>
              <template v-else-if="col.prop === 'taxRate'">
                <span v-if="scope.row.taxRateName"
                  >{{ scope.row.taxRate }}%</span
                >
                <span v-else>--</span>
              </template>
              <template v-else-if="col.prop === 'totalPrice'"
                >{{ scope.row[col.prop] || "--" }}
                {{ scope.row.currency }}</template
              >
              <template v-else-if="col.prop === 'taxRateName'"
                >{{ scope.row[col.prop] || "--" }}
                {{ scope.row.currency }}</template
              >
              <template
                v-else-if="
                  col.prop === 'originTotalPrice' ||
                  col.prop === 'savePrice' ||
                  col.prop === 'totalPriceCopy'
                "
              >
                {{
                  scope.row[col.prop] === "" ||
                  scope.row[col.prop] === null ||
                  scope.row[col.prop] === undefined
                    ? "--"
                    : scope.row[col.prop]
                }}
                {{ scope.row.currency }}
              </template>
              <template v-else>{{ scope.row[col.prop] || "--" }}</template>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('操作')" width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleShowChangeGst(scope.row)"
                v-if="scope.row.taxStatus === 1"
              >
                {{ $t("修改消费税") }}
              </el-button>
              <el-button type="text" @click="showOrderDetail(scope.row)">{{
                $t("View details")
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="type == 1 && tableData != null">
        <el-table
          :data="tableData"
          v-loading="loading"
          tooltip-effect="dark"
          :border="false"
          fit
          show-overflow-tooltip="true"
          style="width: 100%; margin-top: 10px"
          stripe
          :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
          max-height="500"
        >
          <el-table-column
            fixed
            align="center"
            :label="$t('序号')"
            :width="120"
          >
            <template slot-scope="scope"
              >{{
                (screenData.pageNum - 1) * screenData.pageSize +
                scope.$index +
                1
              }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="col in tableColumn3"
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
               <template v-else-if="col.prop === 'successTime'">{{
                DateTimeUtils.dateClockTime(scope.row.successTime)
              }}</template>
              <template v-else-if="col.prop === 'parentUserId'">
                <router-link
                  :to="{
                    path: `/studentManagement/parentInfo`,
                    query: { parentUserId: scope.row.parentUserId },
                  }"
                >
                  <el-button type="text"
                    >{{ scope.row.parentUserId }}
                  </el-button>
                </router-link>
              </template>
              <template v-else-if="col.prop === 'taxRate'">
                <span v-if="scope.row.taxRateName"
                  >{{ scope.row.taxRate }}%</span
                >
                <span v-else>--</span>
              </template>
              <template
                v-else-if="
                  col.prop === 'originTotalPrice' ||
                  col.prop === 'savePrice' ||
                  col.prop === 'totalPriceCopy'
                "
              >
                {{
                  scope.row[col.prop] === "" ||
                  scope.row[col.prop] === null ||
                  scope.row[col.prop] === undefined
                    ? "--"
                    : scope.row[col.prop]
                }}
                {{ scope.row.currency }}
              </template>
              <template v-else-if="col.prop === 'instalment'">
                <span>{{
                  scope.row.instalment == 0 ? $t("全款") : $t("分期")
                }}</span>
              </template>
              <template v-else-if="col.prop === 'totalPrice'"
                >{{ scope.row[col.prop] || "--" }}
                {{ scope.row.currency }}</template
              >
              <template v-else-if="col.prop === 'taxRateName'"
                >{{ scope.row[col.prop] || "--" }}
                {{ scope.row.currency }}</template
              >
              <template v-else>{{ scope.row[col.prop] || "--" }}</template>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('操作')" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="showOrderDetail(scope.row)">{{
                $t("View details")
              }}</el-button>
              <el-button
                type="text"
                v-if="scope.row.status === 1 || scope.row.status === 3"
                @click="handleShowInvoiceDialog(scope.row)"
                >{{ $t("收据") }}</el-button
              >
              <el-button
                v-if="
                  Per.handleButtonPer(
                    'financeMT.orderManagement.orderList.applyForRefund'
                  ) && scope.row.status === ORDER_STATUS.paymentDone
                "
                type="text"
                @click="openRefund(ORDER_STATUS.paymentDone, scope.row)"
                >{{ $t("申请退款") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 处理中 -->
      <div v-if="type == 7 && tableData != null">
        <el-table
          :data="tableData"
          v-loading="loading"
          tooltip-effect="dark"
          :border="false"
          fit
          show-overflow-tooltip="true"
          style="width: 100%; margin-top: 10px"
          stripe
          :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
          max-height="500"
        >
          <el-table-column
            fixed
            align="center"
            :label="$t('序号')"
            :width="120"
          >
            <template slot-scope="scope"
              >{{
                (screenData.pageNum - 1) * screenData.pageSize +
                scope.$index +
                1
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
              <template v-if="col.prop === 'paymentStatus'">
                {{ paymentStatusMap[scope.row.paymentStatus] }}</template
              >
              <template v-else-if="col.prop === 'parentUserId'">
                <router-link
                  :to="{
                    path: `/studentManagement/parentInfo`,
                    query: { parentUserId: scope.row.parentUserId },
                  }"
                >
                  <el-button type="text"
                    >{{ scope.row.parentUserId }}
                  </el-button>
                </router-link>
              </template>
              <template v-else-if="col.prop === 'chargeTimes'">{{
                scope.row.chargeTimes > 0 ? $t("是") : $t("否")
              }}</template>
              <template v-else-if="col.prop === 'taxRate'">
                <span v-if="scope.row.taxRateName"
                  >{{ scope.row.taxRate }}%</span
                >
                <span v-else>--</span>
              </template>
              <template v-else-if="col.prop === 'totalPrice'"
                >{{ scope.row[col.prop] || "--" }}
                {{ scope.row.currency }}</template
              >
              <template v-else-if="col.prop === 'taxRateName'"
                >{{ scope.row[col.prop] || "--" }}
                {{ scope.row.currency }}</template
              >
              <template
                v-else-if="
                  col.prop === 'originTotalPrice' ||
                  col.prop === 'savePrice' ||
                  col.prop === 'totalPriceCopy'
                "
              >
                {{
                  scope.row[col.prop] === "" ||
                  scope.row[col.prop] === null ||
                  scope.row[col.prop] === undefined
                    ? "--"
                    : scope.row[col.prop]
                }}
                {{ scope.row.currency }}
              </template>
              <template v-else>{{ scope.row[col.prop] || "--" }}</template>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('操作')" width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleShowChangeGst(scope.row)"
                v-if="scope.row.taxStatus === 1"
              >
                {{ $t("修改消费税") }}
              </el-button>
              <el-button type="text" @click="showOrderDetail(scope.row)">{{
                $t("View details")
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="type == 5 && tableData != null">
        <el-table
          :data="tableData"
          v-loading="loading"
          tooltip-effect="dark"
          :border="false"
          fit
          show-overflow-tooltip="true"
          style="width: 100%; margin-top: 10px"
          stripe
          :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
          max-height="500"
        >
          <el-table-column
            fixed
            align="center"
            :label="$t('序号')"
            :width="120"
          >
            <template slot-scope="scope"
              >{{
                (screenData.pageNum - 1) * screenData.pageSize +
                scope.$index +
                1
              }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="col in tableColumn4"
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
                  <el-button type="text"
                    >{{ scope.row.parentUserId }}
                  </el-button>
                </router-link>
              </template>
              <template v-else-if="col.prop === 'paymentStatus'">
                <span>
                  {{
                    scope.row.paymentStatus == 0
                      ? $t("待支付")
                      : scope.row.paymentStatus == 1
                      ? $t("支付成功")
                      : scope.row.paymentStatus == 2
                      ? $t("支付失败")
                      : scope.row.paymentStatus == 3
                      ? $t("支付超时")
                      : scope.row.paymentStatus == 4
                      ? $t("退款")
                      : scope.row.paymentStatus == 5
                      ? $t("取消")
                      : scope.row.paymentStatus == 6
                      ? $t("已扣款")
                      : "--"
                  }}
                </span>
              </template>
              <template v-else-if="col.prop === 'paymentTransactionID'">
                {{
                  scope.row.paymentTransactionID
                    ? scope.row.paymentTransactionID
                    : "--"
                }}
              </template>
              <template v-else-if="col.prop === 'taxRate'">
                <span v-if="scope.row.taxRateName"
                  >{{ scope.row.taxRate }}%</span
                >
                <span v-else>--</span>
              </template>
              <template v-else-if="col.prop === 'totalPrice'"
                >{{ scope.row[col.prop] || "--" }}
                {{ scope.row.currency }}</template
              >
              <template v-else-if="col.prop === 'taxRateName'"
                >{{ scope.row[col.prop] || "--" }}
                {{ scope.row.currency }}</template
              >
              <template v-else-if="col.prop === 'updateTime'">
                <span>{{
                  DateTimeUtils.dateClockTime(scope.row.updateTime)
                }}</span>
              </template>
              <template v-else>{{ scope.row[col.prop] || "--" }}</template>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('操作')" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="showOrderDetail(scope.row)">{{
                $t("View details")
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="type == 3 && tableData != null">
        <el-table
          :data="tableData"
          v-loading="loading"
          tooltip-effect="dark"
          :border="false"
          fit
          show-overflow-tooltip="true"
          style="width: 100%; margin-top: 10px"
          stripe
          :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
          max-height="500"
        >
          <el-table-column
            fixed
            align="center"
            :label="$t('序号')"
            :width="120"
          >
            <template slot-scope="scope"
              >{{
                (screenData.pageNum - 1) * screenData.pageSize +
                scope.$index +
                1
              }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="col in tableColumn4"
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
              <template v-else-if="col.prop === 'updateTime'">{{
                DateTimeUtils.dateClockTime(scope.row.updateTime)
              }}</template>
              <template v-else-if="col.prop === 'refundTime'">{{
                DateTimeUtils.dateClockTime(scope.row.refundTime)
              }}</template>
              <template v-else-if="col.prop === 'parentUserId'">
                <router-link
                  :to="{
                    path: `/studentManagement/parentInfo`,
                    query: { parentUserId: scope.row.parentUserId },
                  }"
                >
                  <el-button type="text"
                    >{{ scope.row.parentUserId }}
                  </el-button>
                </router-link>
              </template>
              <template v-else-if="col.prop === 'taxRate'">
                <span v-if="scope.row.taxRateName"
                  >{{ scope.row.taxRate }}%</span
                >
                <span v-else>--</span>
              </template>
              <template v-else-if="col.prop === 'totalPrice'"
                >{{ scope.row[col.prop] || "--" }}
                {{ scope.row.currency }}</template
              >
              <template v-else-if="col.prop === 'taxRateName'"
                >{{ scope.row[col.prop] || "--" }}
                {{ scope.row.currency }}</template
              >
              <template v-else>{{ scope.row[col.prop] || "--" }}</template>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('操作')" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="showOrderDetail(scope.row)">{{
                $t("View details")
              }}</el-button>
              <el-button
                type="text"
                v-if="scope.row.status === 1 || scope.row.status === 3"
                @click="handleShowInvoiceDialog(scope.row)"
                >{{ $t("收据") }}</el-button
              >
              <el-button
                v-if="
                  Per.handleButtonPer(
                    'financeMT.orderManagement.orderList.refundDetails'
                  ) &&
                  (scope.row.status === ORDER_STATUS.refunded ||
                    scope.row.status === ORDER_STATUS.anotherRefunded)
                "
                type="text"
                @click="openRefund(ORDER_STATUS.refunded, scope.row)"
                >{{ $t("退款详情") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <custom-pagination
      :total="total"
      :current-page="screenData.pageNum"
      @getCurrentPage="getCurrentPage"
      @getPerPage="getPerPage"
    />
    <OrderDetail
      :showOrderDetailDialog="showOrderDetailDialog"
      :orderDetailId="orderDetailId"
      @closeOrderDetail="showOrderDetailDialog = false"
      :type="type"
      :titleProp="titleProp"
    ></OrderDetail>
    <ChangeGST
      @getData="getData"
      :currentGstInfo="currentGstInfo"
      :showChangeGst="showChangeGst"
      @closeChangeGst="closeChangeGst"
    ></ChangeGST>
    <InvoiceDialog
      @close="showInvoice = false"
      :show="showInvoice"
      :currentOrderForInvoice="currentOrderForInvoice"
    ></InvoiceDialog>
    <RefundDialog
      v-if="refundDialogVisible"
      :visible.sync="refundDialogVisible"
      :orderStatus="orderStatus"
      :orderId="orderId"
      @getTable="getData"
    />
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import OrderDetail from "./orderSub/orderDetail";
import ChangeGST from "./orderSub/changeGST";
import InvoiceDialog from "./orderSub/invoiceDetail";
import { deepClone } from "../../../utils/handleData";
import RefundDialog from "./components/refundDialog.vue";
import { ORDER_STATUS } from "./constants";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import { parentIdValidate } from "@/utils/reg.js";

export default {
  name: "orderList",
  components: {
    OrderDetail,
    ChangeGST,
    InvoiceDialog,
    RefundDialog,
    FilterByTimePeriod,
  },
  data() {
    return {
      currentOrderForInvoice: {}, // 当前点击的订单（收据）
      showInvoice: false,
      screenData: {
        xgId: "",
        adviserId: "",
        parentUserId: "",
        pageSize: 50,
        pageNum: 1,
        startTime: null,
        endTime: null,
        paymentStatus: null,
        orderNo: "",
        paySuccessTime: "",
        orderPaySuccessStartTime: "",
        orderPaySuccessEndTime: "",
      },
      total: 0,
      type: -1,
      tableData: null,
      loading: false,
      currentPage: 1,
      orderDetailId: -1,
      showOrderDetailDialog: false,
      titleProp: "",
      showChangeGst: false,
      currentGstInfo: {},
      paymentStatusList: [],
      refundDialogVisible: false,
      ORDER_STATUS,
      orderStatus: -1,
      orderId: -1,
      defaultTimeArr: null,
      paymentStatusMap: {
        1: "待支付",
        2: "支付成功",
        3: "支付失败",
        3: "支付超时",
        3: "退款",
        3: "取消",
        3: "已扣款",
        3: "处理中",
      },
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
    tableColumn1() {
      return [
        {
          label: "订单创建时间",
          prop: "createTime",
          width: "140",
          fixed: true,
        },
        { label: "下单人", prop: "createUserName", width: "140", fixed: true },
        {
          label: "家长ID",
          prop: "parentUserId",
          width: "150",
          fixed: true,
        },
        { label: "学生姓名", prop: "studentRealName", width: "130" },
        { label: "订单编号", prop: "orderNo", width: "260" },
        { label: "SPU_ID", prop: "productId", width: "120" },
        { label: "SPU名称", prop: "productName", width: "120" },
        { label: "SKU_ID", prop: "productPackageId", width: "130" },
        { label: "SKU名称", prop: "productPackageName", width: "130" },
        { label: "商品原价", prop: "originTotalPrice", width: "130" },
        { label: "优惠金额", prop: "savePrice", width: "130" },
        { label: "消费税", prop: "taxRateName", width: "130" },
        { label: "消费税率", prop: "taxRate", width: "130" },
        { label: "手续费", prop: "feePrice", width: "120" },
        { label: "手续费率", prop: "fee", width: "140" },
        { label: "支付金额", prop: "totalPrice", width: "130" },
        { label: "订单状态", prop: "status", width: "120" },
        { label: "支付成功时间", prop: "successTime", width: "140" },
        { label: "支付通道", prop: "channel", width: "150" },
        { label: "支付方式", prop: "payType", width: "120" },
        { label: "课程顾问", prop: "adviserUsername", width: "150" },
        { label: "common-Learning Advisor", prop: "xgUserName", width: "150" },
      ];
    },
    tableColumn2() {
      return [
        {
          label: "订单创建时间",
          prop: "createTime",
          width: "140",
          fixed: true,
        },
        {
          label: "支付状态",
          prop: "paymentStatus",
          width: "140",
          fixed: true,
        },
        { label: "下单人", prop: "createUserName", width: "140", fixed: true },
        {
          label: "家长ID",
          prop: "parentUserId",
          width: "150",
          fixed: true,
        },
        { label: "学生姓名", prop: "studentRealName", width: "130" },
        { label: "是否付费用户", prop: "chargeTimes", width: "120" },
        { label: "订单编号", prop: "orderNo", width: "260" },
        { label: "SPU_ID", prop: "productId", width: "120" },
        { label: "SPU名称", prop: "productName", width: "120" },
        { label: "SKU_ID", prop: "productPackageId", width: "130" },
        { label: "SKU名称", prop: "productPackageName", width: "130" },
        { label: "商品原价", prop: "originTotalPrice", width: "120" },
        { label: "优惠金额", prop: "savePrice", width: "150" },
        { label: "优惠码", prop: "code", width: "120" },
        { label: "消费税", prop: "taxRateName", width: "130" },
        { label: "消费税率", prop: "taxRate", width: "130" },
        { label: "手续费", prop: "feePrice", width: "120" },
        { label: "手续费率", prop: "fee", width: "140" },
        { label: "实付总额", prop: "totalPrice", width: "130" },
        { label: "应付金额", prop: "totalPriceCopy", width: "120" },
        { label: "支付失败次数", prop: "payFailureTimes", width: "175" },
        { label: "支付通道", prop: "channel", width: "150" },
        { label: "支付方式", prop: "payType", width: "120" },
        { label: "课程顾问", prop: "adviserUsername", width: "150" },
        { label: "common-Learning Advisor", prop: "xgUserName", width: "150" },
      ];
    },
    tableColumn3() {
      return [
        {
          label: "订单创建时间",
          prop: "createTime",
          width: "140",
          fixed: true,
        },
        { label: "下单人", prop: "createUserName", width: "140", fixed: true },
        {
          label: "家长ID",
          prop: "parentUserId",
          width: "150",
          fixed: true,
        },
        { label: "学生姓名", prop: "studentRealName", width: "130" },
        { label: "Recharge times", prop: "chargeTimes", width: "120" },
        { label: "订单编号", prop: "orderNo", width: "260" },
        { label: "流水号", prop: "reference", width: "200" },
        { label: "SPU_ID", prop: "productId", width: "120" },
        { label: "SPU名称", prop: "productName", width: "120" },
        { label: "SKU_ID", prop: "productPackageId", width: "130" },
        { label: "SKU名称", prop: "productPackageName", width: "130" },
        { label: "商品原价", prop: "originTotalPrice", width: "120" },
        { label: "优惠金额", prop: "savePrice", width: "150" },
        { label: "优惠码", prop: "code", width: "120" },
        { label: "商品实付金额", prop: "totalPriceCopy", width: "145" },
        { label: "消费税", prop: "taxRateName", width: "130" },
        { label: "消费税率", prop: "taxRate", width: "130" },
        { label: "手续费", prop: "feePrice", width: "120" },
        { label: "手续费率", prop: "fee", width: "140" },
        { label: "实付总额", prop: "totalPrice", width: "130" },
        { label: "支付成功时间", prop: "successTime", width: "140" },
        { label: "是否分期", prop: "instalment", width: "220" },
        { label: "支付通道", prop: "channel", width: "150" },
        { label: "支付方式", prop: "payType", width: "120" },
        { label: "课程顾问", prop: "adviserUsername", width: "150" },
        { label: "common-Learning Advisor", prop: "xgUserName", width: "150" },
      ];
    },
    tableColumn4() {
      return [
        {
          label: "订单创建时间",
          prop: "createTime",
          width: "140",
          fixed: true,
        },
        { label: "下单人", prop: "createUserName", width: "140", fixed: true },
        {
          label: "家长ID",
          prop: "parentUserId",
          width: "150",
          fixed: true,
        },
        { label: "学生姓名", prop: "studentRealName", width: "130" },
        { label: "支付状态", prop: "paymentStatus", width: "150" },
        { label: "Recharge times", prop: "chargeTimes", width: "120" },
        { label: "交易号", prop: "paymentTransactionID", width: "220" },
        { label: "订单编号", prop: "orderNo", width: "260" },
        { label: "SPU_ID", prop: "productId", width: "120" },
        { label: "SPU名称", prop: "productName", width: "120" },
        { label: "SKU_ID", prop: "productPackageId", width: "130" },
        { label: "SKU名称", prop: "productPackageName", width: "130" },
        { label: "消费税", prop: "taxRateName", width: "130" },
        { label: "消费税率", prop: "taxRate", width: "130" },
        { label: "手续费", prop: "feePrice", width: "120" },
        { label: "手续费率", prop: "fee", width: "140" },
        { label: "实付总额", prop: "totalPrice", width: "130" },
        { label: "订单取消时间", prop: "updateTime", width: "180" },
        { label: "操作人", prop: "cancelUserName", width: "150" },
        { label: "支付通道", prop: "channel", width: "150" },
        { label: "支付方式", prop: "payType", width: "120" },
        { label: "课程顾问", prop: "adviserUsername", width: "150" },
        { label: "common-Learning Advisor", prop: "xgUserName", width: "150" },
      ];
    },
    tableColumn5() {
      return [
        { label: "退款时间", prop: "refundTime", width: "140", fixed: true },
        {
          label: "家长ID",
          prop: "parentUserId",
          width: "150",
          fixed: true,
        },
        { label: "学生姓名", prop: "studentRealName", width: "130" },
        { label: "退款金额", prop: "refundMoney", width: "130" },
        { label: "对应充值订单编号", prop: "orderNo", width: "260" },
        { label: "订单已消耗付费课时", prop: "consumeNum", width: "200" },
        { label: "SPU_ID", prop: "productId", width: "120" },
        { label: "SPU名称", prop: "productName", width: "120" },
        { label: "SKU_ID", prop: "productPackageId", width: "130" },
        { label: "SKU名称", prop: "productPackageName", width: "130" },
        { label: "消费税", prop: "taxRateName", width: "130" },
        { label: "消费税率", prop: "taxRate", width: "130" },
        { label: "实付总额", prop: "totalPrice", width: "130" },
        { label: "收回剩余付费课时", prop: "collectionNum", width: "200" },
        { label: "课程顾问", prop: "adviserUsername", width: "150" },
        { label: "common-Learning Advisor", prop: "xgUserName", width: "150" },
      ];
    },
  },
  watch: {
    currentLang() {
      this.initData();
    },
  },
  methods: {
    // 打开退款弹框
    openRefund(val, { id }) {
      this.orderId = id;
      this.orderStatus = val;
      this.refundDialogVisible = true;
    },
    initData() {
      this.paymentStatusList = [
        { label: this.$t("待支付"), value: 0 },
        { label: this.$t("支付成功"), value: 1 },
        { label: this.$t("支付失败"), value: 2 },
        { label: this.$t("支付超时"), value: 3 },
        { label: this.$t("退款"), value: 4 },
        { label: this.$t("取消"), value: 5 },
        { label: this.$t("已扣款"), value: 6 },
      ];
    },
    //弹出收据dialog
    handleShowInvoiceDialog(scopeRow) {
      this.currentOrderForInvoice = deepClone(scopeRow);
      this.showInvoice = true;
    },
    closeChangeGst() {
      this.showChangeGst = false;
      this.currentGstInfo = {};
    },
    handleShowChangeGst(scopeRow) {
      this.showChangeGst = true;
      this.currentGstInfo = scopeRow;
    },
    showOrderDetail(orderData) {
      this.orderDetailId = orderData.id;
      this.showOrderDetailDialog = true;
      this.titleProp = this.Filters.orderStatusFilter(orderData.status);
    },
    search() {
      this.screenData.pageNum = 1;
      this.getData();
    },
    changeType(typeCode) {
      this.type = typeCode;
      this.getData();
    },
    tableRowClassNameAll({ row, rowIndex }) {
      if (rowIndex === this.unitReportAllScrollTop.ind) {
        return "hover-row";
      }
      return "";
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page;
      this.getData();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getData();
    },
    getData() {
      let {
        pageNum,
        pageSize,
        startTime,
        endTime,
        parentUserId,
        xgId,
        adviserId,
        paymentStatus,
        orderNo,
        orderPaySuccessStartTime,
        orderPaySuccessEndTime,
      } = this.screenData;
      if (
        !startTime.length &&
        !orderPaySuccessStartTime.length &&
        !adviserId.length &&
        !xgId.length &&
        !parentUserId.length &&
        !orderNo.length
      ) {
        return this.$message.warning(this.$t("请选择筛选条件"));
      }
      if (
        this.screenData &&
        this.screenData.parentUserId &&
        !parentIdValidate(this, this.screenData.parentUserId)
      ) {
        return;
      }
      this.tableData = null;
      this.loading = true;
      this.$Api.financeManagement
        .orderList(pageNum, pageSize, {
          xgId,
          adviserId,
          endTime,
          startTime,
          orderPaySuccessStartTime,
          orderPaySuccessEndTime,
          paymentStatus,
          parentUserId,
          orderStatus: this.type == -1 ? null : this.type,
          orderNo,
        })
        .then(({ status, data }) => {
          if (status === 200 && data.code === 200) {
            this.tableData = data.data.list;
            this.total = data.data.total;
          } else {
            this.tableData = null;
          }
          this.loading = false;
        });
    },
  },
  created() {
    this.defaultTimeArr = [
      new Date(this.DateTimeUtils.getMonthStartDate()),
      new Date(this.DateTimeUtils.getMonthEndDate()),
    ];
    this.screenData.startTime = this.defaultTimeArr[0].toISOString();
    this.screenData.endTime = this.defaultTimeArr[1].toISOString();
    this.getData();
    this.initData();
  },
};
</script>
<style lang="scss" scoped>
.table-wrapper {
  margin-top: 10px;
  padding: 0 15px;
}
</style>
