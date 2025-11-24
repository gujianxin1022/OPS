<template>
  <div class="handle-by-human-wrap">
    <div class="search-wrap">
      <screen-wrapper @search="search" :screenTitle="$t('人工课时')">
        <screen-item :label="$t('Date')" :part="2" label-width="140">
          <el-radio-group v-model="screenData.dateType" @change="changeRadion">
            <el-radio-button :label="-1">
              <div style="width: 65px">{{ $t("上月") }}</div>
            </el-radio-button>
            <el-radio-button :label="0">
              <div style="width: 65px">{{ $t("本月") }}</div>
            </el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-model="applyDate"
            style="margin-left: 10px; width: 320px"
            type="daterange"
            value-format="yyyy-MM-dd"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            @change="timeChange"
          />
        </screen-item>
        <!-- <screen-item label="原因" label-width="120" :part="2">
						<el-select filterable v-model="screenData.cms_user_id" placeholder="请选择">
							<el-option v-for="(item, index) in xgTeacherList" :key="index" :label="item.nameEn+`${item.nameEn && item.nameZh?'-':''}`+item.nameZh" :value="item.id" />
						</el-select>
					</screen-item> -->
        <screen-item :label="$t('家长id')" label-width="140" :part="4">
          <el-input
            v-model.trim="screenData.parentId"
            :placeholder="$t('glb-input') + ' ' + $t('家长ID')"
            @keyup.enter.native="search"
          />
        </screen-item>
        <screen-item :label="$t('发起申请人员')" label-width="140" :part="4">
          <el-select
            clearable
            filterable
            v-model="screenData.createUserId"
            :placeholder="
              $t('glb-input') +
              (currentLang == 'en' ? ' ' + $t('发起申请人员') : '发起申请人员')
            "
          >
            <el-option
              v-for="(item, index) in xgAndGwListSet"
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
        <screen-item :label="$t('reason')" label-width="140" :part="4">
          <el-select
            clearable
            v-model="screenData.reasonId"
            :placeholder="
              $t('glb-input') +
              (currentLang == 'en' ? ' ' + $t('原因') : '原因')
            "
          >
            <el-option
              v-for="item in reasonList"
              :key="item.id"
              :label="currentLang === 'zh' ? item.describeZh : item.describeEn"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </screen-item>
        <screen-item :label="$t('赠课类型')" label-width="140" :part="4">
          <el-select
            clearable
            v-model="screenData.productId"
            :placeholder="$t('请选择赠课类型')"
            @change="(e) => getCoursePackageId(e, 'screenData')"
          >
            <el-option
              v-for="item in productListScreen"
              :key="item.id"
              :label="currentLang === 'zh' ? item.nameCn : item.nameEn"
              :value="item.id"
            />
          </el-select>
        </screen-item>
        <screen-item :label="$t('成本部门')" label-width="140" :part="4">
          <el-select
            clearable
            v-model="screenData.postId"
            :placeholder="$t('请选择成本部门')"
          >
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="currentLang === 'zh' ? item.nameZh : item.nameEn"
              :value="item.id"
            ></el-option>
          </el-select>
        </screen-item>
        <screen-item :label="$t('课时类型')" label-width="140" :part="4">
          <el-select
            clearable
            v-model="screenData.typeId"
            :placeholder="$t('请选择课时类型')"
          >
            <el-option
              v-for="item in classTypeList"
              :key="item.id"
              :label="item.typeName"
              :value="item.id"
            ></el-option>
          </el-select>
        </screen-item>
      </screen-wrapper>
    </div>
    <div class="center-wrap">
      <!-- <div class="button-tabs-wrap">
					<el-button-group>
						<el-button :type="type == 1 ? 'primary' : ''" @click="changeType(1)">待审批</el-button>
						<el-button :type="type == 2 ? 'primary' : ''" @click="changeType(2)">已审批</el-button>
					</el-button-group>
				</div> -->
      <div class="event-btns-wrap">
        <el-button @click="showAddMoreHours">{{
          $t("批量添加课时")
        }}</el-button>
        <el-button @click="showAddHours">{{ $t("添加课时") }}</el-button>
        <el-button
          @click="deductionClassHoursVisible = true"
          v-if="
            Per.handleButtonPer(
              'financeMT.costCenter.handleByHuman.deductionClassHours'
            )
          "
        >
          {{ $t("扣减课时") }}
        </el-button>
      </div>
    </div>
    <div class="table-wrap">
      <el-table
        :border="false"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        v-show="type == 1"
      >
        <el-table-column fixed align="center" :label="$t('序号')" width="60">
          <template slot-scope="scope">
            {{
              (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          :label="$t('发起申请时间')"
          width="160"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('家长ID')"
          prop="parentUserId"
          width="150"
        >
          <template slot-scope="scope">
            <router-link
              :to="{
                path: `/studentManagement/parentInfo`,
                query: { parentUserId: scope.row.parentUserId },
              }"
            >
              <el-button type="text">{{ scope.row.parentUserId }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('学生姓名')"
          prop="studentRealName"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.studentRealName || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('操作类型')"
          :prop="currentLang === 'zh' ? 'reasonTypeNameZh' : 'reasonTypeNameEn'"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('课时类型')"
          prop="typeName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('申请课时')"
          prop="amount"
        ></el-table-column>
        <el-table-column align="center" :label="$t('赠课类型')" prop="name">
          <template slot-scope="scope">
            <span>{{ scope.row.productName || "--" }}</span>
            <!-- <span v-if="scope.row.accountClass === 1">{{ scope.row.productName }}</span>
							<span v-if="scope.row.accountClass === 2">通用课时</span> -->
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('课程包名称')"
          prop="coursePackageName"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.coursePackageName || "--" }}</span>
            <!-- <span v-if="scope.row.accountClass === 1">{{ scope.row.coursePackageName }}</span>
							<span v-if="scope.row.accountClass === 2">通用课时</span> -->
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('成本部门')"
          prop="postName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('reason')"
          prop="reasonDescribe"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('发起申请人员')"
          prop="createUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('详细原因')"
          prop="name"
          width="120"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-if="scope.row.reasonDetail"
              :content="scope.row.reasonDetail"
            >
              <el-button slot="reference" type="text"
                >{{
                  scope.row.reasonDetail
                    ? scope.row.reasonDetail.substr(0, 4)
                    : ""
                }}...</el-button
              >
            </el-popover>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>

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
        v-show="type == 2"
      >
        <el-table-column fixed align="center" :label="$t('序号')" :width="50">
          <template slot-scope="scope">{{
            (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-Parents')"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('申请课时')"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-Point Type')"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('成本部门')"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('原因')"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('发起申请原因')"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('审批结论')"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('审批人员')"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('审批通过时间')"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('详细原因')"
          prop="name"
          width="120"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="openDetails(scope.row)"
              >实打实大所多...</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <custom-pagination
        :total="total"
        :current-page="screenData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>

    <div class="dialog-wrap">
      <!-- 批量添加课时 start-->
      <el-dialog
        top="10vh"
        width="70%"
        :before-close="closeAddMoreHours"
        :close-on-click-modal="false"
        :title="
          $t(
            '批量添加课时（批量操作涉及数据量较大，请谨慎操作，单次最多支持1000条数据）'
          )
        "
        center
        :visible.sync="addMoreHoursDialogFlag"
      >
        <div class="more-select">
          <el-form
            ref="addMoreHoursForm"
            :rules="ruleMore"
            :model="addMoreHoursForm"
            :label-width="currentLang == 'en' ? '160px' : '110px'"
          >
            <el-form-item :label="$t('原因')" prop="reasonId">
              <el-select
                v-model="addMoreHoursForm.reasonId"
                :placeholder="$t('请选择原因')"
              >
                <el-option
                  v-for="item in addReasonList"
                  :key="item.id"
                  :label="
                    currentLang === 'zh' ? item.describeZh : item.describeEn
                  "
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="SPU" prop="productId">
              <el-select
                filterable
                v-model="addMoreHoursForm.productId"
                :placeholder="$t('请选择课程包')"
                @change="(e) => getSKUList(e, 'addMoreHoursForm', productList)"
              >
                <el-option
                  v-for="item in productList"
                  :key="item.id"
                  :label="currentLang === 'zh' ? item.nameCn : item.nameEn"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="SKU" prop="productDetailId">
              <el-table
                :data="moreSKUTableData"
                v-loading="moreSKUTableDataLoading"
                max-height="300"
                border
                style="width: 100%"
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
                        @change="handleRowChange(scope.row, 'addMoreHoursForm')"
                      />
                    </template>
                    <template v-else-if="item.prop === 'validType'">
                      {{ scope.row.validityTime || "--"
                      }}{{ changeValidityType(scope.row.validityType) }}
                    </template>
                    <template v-else-if="item.prop === 'expireType'">
                      {{ $t(expireTypeMap[scope.row.expireType]) }}
                    </template>
                    <template v-else-if="item.prop === 'appShow'">
                      {{
                        scope.row.validityTime === 0 ? $t("隐藏") : $t("显示")
                      }}
                    </template>
                    <template v-else>
                      <span>
                        {{
                          scope.row[item.prop] === null ||
                          scope.row[item.prop] === undefined ||
                          scope.row[item.prop] === ""
                            ? "--"
                            : scope.row[item.prop]
                        }}
                      </span>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item :label="$t('添加数量')" prop="amount">
              <el-input-number
                v-model.number="addMoreHoursForm.amount"
                :min="1"
              />
              <div>
                <span>{{ $t("赠送课时总数") }}: {{ addMoreHoursTotal }}</span>
                <span style="word-break: keep-all"
                  >（{{ $t("赠送课时总数 = SKU课时数量 * 添加数量") }}）</span
                >
              </div>
            </el-form-item>
            <el-form-item :label="$t('批量数据')" prop="data">
              <el-input
                style="width: 520px"
                type="textarea"
                :rows="12"
                :placeholder="$t('每行一个学生id，以回车分割，最多1000条')"
                v-model="addMoreHoursForm.data"
              />
            </el-form-item>
          </el-form>
          <div class="error-message" v-if="errorNum !== 0">
            <el-alert
              :title="
                $t('XX条数据有问题，请修正后点击确定添加', {
                  number: errorNum,
                }) +
                '。原因：' +
                errorReason
              "
              type="error"
              :center="false"
              :closable="false"
              show-icon
            >
            </el-alert>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeAddMoreHours"
            >&nbsp;&nbsp;{{ $t("取消") }}&nbsp;&nbsp;</el-button
          >
          <el-button
            type="primary"
            @click="sureAddMoreHours"
            :loading="addMoreHoursLoading"
            >{{ $t("确定添加") }}</el-button
          >
        </div>
      </el-dialog>
      <!-- 批量添加课时 end-->
      <!-- 添加课时 start-->
      <el-dialog
        top="10vh"
        width="70%"
        :before-close="closeAddHours"
        :close-on-click-modal="false"
        :title="$t('添加课时')"
        center
        :visible.sync="addHoursDialogFlag"
      >
        <el-form
          ref="addHoursForm"
          :rules="rule"
          :model="addHoursForm"
          :label-width="currentLang == 'en' ? '160px' : '110px'"
        >
          <el-form-item :label="$t('家长ID')" prop="parentUserId">
            <el-input
              loading="true"
              v-model="addHoursForm.parentUserId"
              :placeholder="$t('glb-input') + ' ' + $t('家长ID')"
            >
              <i
                class="el-icon-loading"
                slot="suffix"
                v-show="testParentUserNameLoading"
              >
              </i>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('选择学员')" prop="studentUserId">
            <el-select
              v-model="addHoursForm.studentUserId"
              :placeholder="$t('请选择')"
              @change="getExpiresAt"
            >
              <el-option
                v-for="item in studentList"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('账号课时明细')">
            <el-popover
              placement="right"
              width="360"
              @show="showParentPopover"
              trigger="click"
            >
              <el-table
                v-loading="parentProductLoading"
                :data="parentProductData"
                class="detailed-table"
              >
                <el-table-column
                  :property="
                    currentLang === 'zh'
                      ? 'coursePackageName'
                      : 'coursePackageNameEn'
                  "
                  :label="$t('产品')"
                  width="250"
                />
                <el-table-column
                  property="totalRemainingAmount"
                  :label="$t('余额')"
                ></el-table-column>
              </el-table>
              <el-button
                :disabled="!parentUserId"
                slot="reference"
                el-button
                type="text"
                >{{ $t("查询明细") }}</el-button
              >
            </el-popover>
          </el-form-item>
          <el-form-item label="SPU" prop="productId">
            <el-select
              v-model="addHoursForm.productId"
              :placeholder="$t('请选择课程包')"
              filterable
              @change="
                (e) => {
                  getSKUList(e, 'addHoursForm', productList);
                  getExpiresAt();
                }
              "
            >
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="currentLang === 'zh' ? item.nameCn : item.nameEn"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="SKU" prop="productDetailId">
            <el-table
              :data="SKUTableData"
              v-loading="SKUTableDataLoading"
              max-height="300"
              border
              style="width: 100%"
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
                      @change="handleRowChange(scope.row, 'addHoursForm')"
                    />
                  </template>
                  <template v-else-if="item.prop === 'validType'">
                    {{ scope.row.validityTime || "--"
                    }}{{ changeValidityType(scope.row.validityType) }}
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
                        scope.row[item.prop] === ""
                          ? "--"
                          : scope.row[item.prop]
                      }}
                    </span>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item :label="$t('添加数量')" prop="amount">
            <el-input-number
              @change="getExpiresAt"
              v-model.number="addHoursForm.amount"
              :min="1"
            />
            <span v-if="expiresAt" style="margin-left: 20px"
              >{{ $t("课时到期日") }}：{{
                DateTimeUtils.dateClockTime(expiresAt)
              }}</span
            >
            <div>
              <span>{{ $t("赠送课时总数") }}: {{ addHoursTotal }}</span>
              <span style="word-break: keep-all"
                >（{{ $t("赠送课时总数 = SKU课时数量 * 添加数量") }}）</span
              >
            </div>
          </el-form-item>
          <el-form-item :label="$t('添课理由')" prop="reasonId">
            <el-select
              v-model="addHoursForm.reasonId"
              :placeholder="$t('请选择原因')"
            >
              <el-option
                v-for="item in addReasonList"
                :key="item.id"
                :label="
                  currentLang === 'zh' ? item.describeZh : item.describeEn
                "
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('详细理由')" prop="reasonDetail">
            <el-input
              style="width: 100%"
              type="textarea"
              :rows="4"
              maxlength="501"
              :placeholder="
                $t('glb-input') +
                (currentLang == 'en' ? ' ' + $t('详细理由') : '详细理由')
              "
              v-model="addHoursForm.reasonDetail"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeAddHours">{{ $t("取消") }}</el-button>
          <el-button
            type="primary"
            @click="sureAddHours"
            :loading="addHoursLoading"
            >{{ $t("确定添加") }}</el-button
          >
          <!-- :disabled="!currentParentUserId" -->
        </div>
      </el-dialog>
      <!-- 添加课时 end-->
    </div>
    <DeductionClassHours
      :visible.sync="deductionClassHoursVisible"
      @ok="search"
    />
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import DeductionClassHours from "./components/DeductionClassHours.vue";
import { parentIdValidate } from "@/utils/reg.js";

export default {
  name: "handleByHuman",
  components: { DeductionClassHours },
  data() {
    return {
      expireTypeMap: {
        0: "从当前有效期结束开始计算",
        1: "课时到账时开始计算",
      },
      deductionClassHoursVisible: false,
      testParentUserNameLoading: false,
      parentProductLoading: false,
      parentUserId: "",
      addHoursLoading: false,
      addMoreHoursLoading: false,
      rule: {},
      ruleMore: {},
      total: 0,
      applyDate: "",
      subjectTypeId: "",
      courseType: "",
      screenData: {
        postId: "",
        typeId: "",
        createUserId: "",
        pageNum: 1,
        pageSize: 50,
        dateType: "",
        startTime: "",
        endTime: "",
        parentId: "",
        reasonId: "",
        type: 1,
        productId: "",
        coursePackageId: "",
        userId: "",
      },
      type: 1,
      tableData: [],
      errorNum: 0,
      errorReason: "",
      loading: false,
      addHoursDialogFlag: false,
      addMoreHoursDialogFlag: false,
      showDetail: false,
      addHoursForm: {
        parentUserId: "",
        amount: 1,
        accountClass: 1,
        reasonId: "",
        reasonDetail: "",
        productId: "",
        coursePackageId: "",
        studentUserId: null,
        productDetailId: "", // skuId
      },
      addMoreHoursForm: {
        reasonId: "",
        accountClass: 1,
        data: "",
        productId: "",
        coursePackageId: "",
        amount: 1,
        productDetailId: "", // skuId
      },
      reasonList: [],
      productList: [],
      studentList: [],
      parentProductData: [{ productName: "1v1新加坡课", money: 20 }],
      departmentList: [],
      classTypeList: [],
      currency: "--",
      SKUTableData: [],
      SKUTableDataLoading: false,
      moreSKUTableData: [],
      moreSKUTableDataLoading: false,
      SKUClassHourNum: 0,
      coursePackageName: "",
      expiresAt: "",
    };
  },
  computed: {
    ...mapState({
      xgAndGwListSet: (state) => state.user.xgAndGwListSet,
    }),
    ...mapGetters(["currentLang"]),
    nowUserInfo() {
      return JSON.parse(window.localStorage.getItem("userInfo"));
    },
    productListScreen() {
      return [
        ...this.productList,
        { id: -1, coursePackageId: -1, nameCn: "通用课时", nameEn: "通用课时" },
      ];
    },
    addReasonList() {
      return this.reasonList.filter(
        (v) =>
          v.type === 1 /* 原因类型: 添加 */ &&
          (v.classify === 1 /* 手动 */ || v.classify === 2) /* 手动&自动 */
      );
    },
    SKUTableColumns() {
      return [
        { label: "", prop: "radio", width: 50 },
        { label: this.$t("交易 - 课时数量"), prop: "amount" },
        { label: this.$t("中文名称"), prop: "nameCn" },
        { label: this.$t("英文名称"), prop: "nameEn" },
        {
          label: `${this.$t("交易 - SKU单价")}（${this.currency}）`,
          prop: "unitPrice",
          width: 120,
        },
        {
          label: `${this.$t("交易 - SKU总价")}（${this.currency}）`,
          prop: "totalPrice",
          width: 120,
        },
        { label: this.$t("交易 - 有效期"), prop: "validType" },
        {
          label: this.$t("有效期计算方式"),
          width: 120,
          prop: "expireType",
        },
        {
          label: this.$t("交易 - 是否在商城显示"),
          prop: "appShow",
          width: 120,
        },
        { label: this.$t("积分兑换"), prop: "coinExchangeAmount" },
      ];
    },
    addHoursTotal() {
      return this.SKUClassHourNum * this.addHoursForm.amount;
    },
    addMoreHoursTotal() {
      return this.SKUClassHourNum * this.addMoreHoursForm.amount;
    },
  },
  watch: {
    addMoreHoursDialogFlag(newData) {
      if (!newData) {
        this.addMoreHoursForm = this.$options.data().addMoreHoursForm;
        this.errorNum = 0;
      }
    },
    addHoursDialogFlag(newData) {
      if (!newData) {
        this.addHoursForm = this.$options.data().addHoursForm;
      }
    },
    currentLang(newVal) {
      this.initRuleValid();
    },
  },
  methods: {
    async getExpiresAt() {
      this.expiresAt = "";
      if (
        !this.addHoursForm.studentUserId ||
        !this.addHoursForm.productDetailId ||
        !this.addHoursForm.amount
      )
        return;
      let params = {
        studentId: this.addHoursForm.studentUserId,
        courseProductDetailId: this.addHoursForm.productDetailId,
        exchangeNum: this.addHoursForm.amount,
      };
      const res = await this.$Api.financeManagement.reqAccountExpiresAt(params);
      this.expiresAt = res;
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
    // 获取对应的 coursePackageId
    getCoursePackageId(val, formObj) {
      let useList =
        formObj === "screenData" ? this.productListScreen : this.productList;
      useList.forEach((item) => {
        if (item.id === val) {
          this.coursePackageName =
            this.currentLang === "zh" ? item.nameCn : item.nameEn;
          return (this[formObj].coursePackageId = item.coursePackageId ?? "");
        }
      });
    },
    // 获取对应spu下的sku
    getSKUList(val, formObj, list) {
      this.addHoursForm.productDetailId = "";
      const currentItem = list.find((t) => t.id === val);
      this.subjectTypeId = currentItem.subjectTypeId;
      this.courseType = currentItem.courseTypeId;
      this.getCoursePackageId(val, formObj);
      formObj === "addHoursForm"
        ? (this.SKUTableDataLoading = true)
        : (this.moreSKUTableDataLoading = true);
      this.$Api.financeManagement
        .getSKUList(val, { filter: "filter" }) // filter只在添加课时 & 批量添加课时中使用，后端用来曲分是否过滤订阅制
        .then(({ status, data: { code, data } }) => {
          if (status === 200 && code === 200) {
            this.currency = data.currency;
            data?.skuList.forEach((item) => (item.radio = false));
            formObj === "addHoursForm"
              ? (this.SKUTableData = data?.skuList)
              : (this.moreSKUTableData = data?.skuList);
          }
        })
        .finally(() =>
          formObj === "addHoursForm"
            ? (this.SKUTableDataLoading = false)
            : (this.moreSKUTableDataLoading = false)
        );
    },
    handleRowChange(val, formObj) {
      let tablelist =
        formObj === "addHoursForm" ? this.SKUTableData : this.moreSKUTableData;
      tablelist.forEach((item) => {
        if (item.id !== val.id) {
          item.radio = false;
        }
      });
      formObj === "addHoursForm"
        ? ((this.addHoursForm.productDetailId = val.id),
          (this.addHoursForm.amount = 1))
        : ((this.addMoreHoursForm.productDetailId = val.id),
          (this.addMoreHoursForm.amount = 1));
      this.SKUClassHourNum = val.amount;
      this.getExpiresAt();
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
    handleBlur() {
      this.testParentUserNameLoading = true;
      this.$Api.financeManagement
        .getStudentListByParentId({
          parentUserId: this.addHoursForm.parentUserId,
          status: 1,
        })
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200 && data.data.length > 0) {
            this.$nextTick(() => {
              this.$refs["addHoursForm"].fields[0].error = "";
            });
            this.parentUserId = this.addHoursForm.parentUserId;
            this.studentList = data.data;
          } else {
            this.parentUserId = "";
            this.studentList = [];
            this.addHoursForm.studentUserId = null;
            this.$nextTick(() => {
              this.$refs["addHoursForm"].fields[0].error =
                this.$t("账号不存在或格式错误");
            });
          }
          this.testParentUserNameLoading = false;
        });
    },
    showParentPopover() {
      this.parentProductLoading = true;
      this.parentProductData = [];
      this.$Api.financeManagement
        .getParentProductDetail(this.parentUserId)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.parentProductData = data.data;
          }
          this.parentProductLoading = false;
        });
    },
    getProductList() {
      this.$Api.financeManagement.getProductList().then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.productList = data.data;
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
    closeDetail() {
      this.showDetail = false;
    },
    timeChange() {
      this.screenData.dateType = "";
    },
    changeType(value) {
      this.type = value;
    },
    openDetails(scopeRow) {
      this.showDetail = true;
    },
    search() {
      this.screenData.pageNum = 1;
      this.screenData.pageSize = 50;
      this.getTableData();
    },
    getTableData() {
      if (
        this.screenData &&
        this.screenData.parentId &&
        !parentIdValidate(this, this.screenData.parentId)
      ) {
        return;
      }
      this.loading = true;
      let {
        pageNum,
        pageSize,
        createUserId,
        dateType,
        startTime,
        endTime,
        parentId,
        reasonId,
        type,
        productId,
        coursePackageId,
        postId,
        typeId,
      } = this.screenData;
      let params = {
        userId: this.nowUserInfo.id,
        type,
        pageNum,
        pageSize,
        dateType,
        startTime,
        endTime,
        parentId,
        createUserId,
        reason: reasonId,
        productId,
        coursePackageId,
        postId,
        typeId,
      };
      if (this.applyDate !== null && this.applyDate.length != 0) {
        params.startTime = new Date(`${this.applyDate[0]} 00:00`).toISOString();
        params.endTime = new Date(`${this.applyDate[1]} 23:59`).toISOString();
      } else {
        params.startTime = "";
        params.endTime = "";
      }
      this.$Api.financeManagement
        .getDeductionSessionLog(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.total;
          }
          this.loading = false;
        });
    },
    showAddMoreHours() {
      this.addMoreHoursDialogFlag = true;
    },
    showAddHours() {
      this.addHoursDialogFlag = true;
    },
    async closeAddMoreHours() {
      await this.$nextTick();
      this.addMoreHoursDialogFlag = false;
      this.$refs.addMoreHoursForm.resetFields();
      this.moreSKUTableData = [];
      this.SKUClassHourNum = 0;
    },
    async closeAddHours() {
      await this.$nextTick();
      this.addHoursDialogFlag = false;
      this.$refs.addHoursForm.resetFields();
      this.SKUTableData = [];
      this.SKUClassHourNum = 0;
      this.studentList = [];
      this.parentUserId = "";
    },
    // 批量添加课时
    sureAddMoreHours() {
      this.$refs["addMoreHoursForm"].validate((valid) => {
        if (valid) {
          this.$confirm(
            `${this.$t("Confirm to adds")}"${this.coursePackageName}" ${
              this.addMoreHoursTotal
            }${this.$t("class point(s) to these users")}`,
            {
              confirmButtonText: this.$t("my-home-Confirm"),
              cancelButtonText: this.$t("取消"),
              type: "warning",
            }
          )
            .then((_) => {
              let { reasonId, accountClass } = this.addMoreHoursForm;
              let str = this.addMoreHoursForm.data.replace(/，/gi, ",");
              let importData = str.split("\n"),
                sameUers = [];
              importData.forEach((item) => {
                let uname = item.split(",")[0],
                  result = importData.filter(
                    (ite) => ite.split(",")[0] === uname
                  );
                if (result.length > 1) {
                  result.forEach((t) => {
                    if (sameUers.indexOf(t) === -1) {
                      sameUers.push(t);
                    }
                  });
                }
              });
              sameUers.forEach((item) => {
                let i = importData.findIndex((ite) => item === ite);
                importData[i] = `${importData[i]} （${this.$t("账号重复")}）`;
              });
              this.addMoreHoursForm.data = importData
                .join(";")
                .replace(/\;/g, "\n");
              if (sameUers.length !== 0) {
                this.errorNum = sameUers.length;
                this.errorReason = this.$t("账号重复");
                return;
              }
              this.addMoreHoursLoading = true;
              let params = {
                accountClass,
                reasonId,
                importData,
                userId: this.nowUserInfo.id,
                productId: this.addMoreHoursForm.productId,
                coursePackageId: this.addMoreHoursForm.coursePackageId,
                productDetailId: this.addMoreHoursForm.productDetailId,
                amount: this.addMoreHoursTotal,
                subjectType: this.subjectTypeId,
                courseType: this.courseType,
              };
              this.$Api.financeManagement
                .financeAddMoreClassHour(params)
                .then(({ status, data }) => {
                  if (
                    status == 200 &&
                    data.code == 200 &&
                    data.data.length == 0
                  ) {
                    this.$notify({
                      message: this.$t("批量添加成功"),
                      type: "success",
                    });
                    this.errorNum = 0;
                    this.addMoreHoursForm =
                      this.$options.data().addMoreHoursForm;
                    this.closeAddMoreHours();
                    this.getTableData();
                  } else {
                    this.addMoreHoursLoading = false;
                    this.errorNum = data.data.length;
                    data.data.forEach((item) => {
                      importData[item.index] = `${importData[item.index]} (${
                        item.message
                      })`;
                    });
                    this.errorReason = this.$t("账号不存在或格式错误");
                    this.addMoreHoursForm.data = importData
                      .join(";")
                      .replace(/\;/g, "\n");
                  }
                  this.addMoreHoursLoading = false;
                });
              // done();
            })
            .catch((_) => {});
        }
      });
    },
    // 单个添加课时
    sureAddHours() {
      this.$refs["addHoursForm"].validate((valid) => {
        if (valid) {
          this.$confirm(
            `${this.$t("Confirm to add")}"${this.coursePackageName}" ${
              this.addHoursTotal
            }${this.$t("class point(s) to this user")}`,
            {
              confirmButtonText: this.$t("my-home-Confirm"),
              cancelButtonText: this.$t("取消"),
              type: "warning",
            }
          )
            .then((_) => {
              this.addHoursLoading = true;
              // this.addHoursForm.userId = this.nowUserInfo.id
              Object.assign(this.addHoursForm, {
                userId: this.nowUserInfo.id,
                amount: this.addHoursTotal,
              });
              this.$Api.financeManagement
                .financeAddClassHour({
                  ...this.addHoursForm,
                  parentUserId: this.parentUserId,
                  subjectType: this.subjectTypeId,
                  courseType: this.courseType,
                })
                .then(({ status, data }) => {
                  if (status == 200 && data.code == 200) {
                    this.$notify({
                      message: this.$t("添加课时成功"),
                      type: "success",
                    });
                    this.parentUserId = "";
                    this.addHoursForm = this.$options.data().addHoursForm;
                    this.closeAddHours();
                    this.getTableData();
                  }
                  this.addHoursLoading = false;
                });
              // done();
            })
            .catch((_) => {});
        }
      });
    },
    changeRadion() {
      this.applyDate = [];
    },
    async getDepartmentList() /* 成本部门 */ {
      const {
        status,
        data: { code, data },
      } = await this.$Api.systemManagement.getJobPositionList();
      if (status !== 200 || code !== 200) return Promise.reject();
      this.departmentList = Object.freeze(
        data.filter((v) => v.pid === 4 /* LINGGO_ACE_ID */)
      );
    },
    async getClassHoursTypeList() /* 课时类型 */ {
      const {
        status,
        data: { code, data },
      } = await this.$Api.financeManagement.getClassHoursTypeList();
      if (status !== 200 || code !== 200) return Promise.reject();
      this.classTypeList = Object.freeze(data);
    },
    initRuleValid() {
      const detailLength = (rule, value, callback) => {
        if (value.length <= 0) {
          return callback(new Error(this.$t("请输入详细原因")));
        } else if (value.length < 9) {
          return callback(new Error(this.$t("最少9个字")));
        } else if (value.length > 500) {
          return callback(new Error(this.$t("最多500字")));
        } else {
          callback();
        }
      };
      const checkNum = (rule, value, callback) => {
        if (!Number.isInteger(value)) {
          return callback(new Error(this.$t("只能为整数")));
        }
        return callback();
      };
      const validatorSKUTable = (rule, value, callback) => {
        if (!value) {
          return callback(new Error(this.$t("请选择SKU")));
        }
        return callback();
      };
      const validatorParentId = (rule, value, callback) => {
        if (!/^[0-9]{10,}$/.test(value)) {
          return callback(new Error(this.$t("账号不存在或格式错误")));
        }
        this.handleBlur();
        return callback();
      };
      this.rule = {
        productId: [
          { required: true, message: this.$t("请选择SPU"), trigger: "change" },
        ],
        productDetailId: [
          { required: true, validator: validatorSKUTable, trigger: "blur" },
        ],
        parentUserId: [
          {
            required: true,
            message: this.$t("请输入家长ID"),
            trigger: "blur",
          },
          { required: true, validator: validatorParentId, trigger: "blur" },
        ],
        studentUserId: [
          { required: true, message: this.$t("请选择学员"), trigger: "change" },
        ],
        reasonId: [
          {
            required: true,
            message: this.$t("请选择添加课时原因"),
            trigger: "change",
          },
        ],
        reasonDetail: [
          { required: true, validator: detailLength, trigger: "blur" },
        ],
        amount: [
          {
            required: true,
            message: this.$t("请输入添加数量"),
            trigger: "blur",
          },
          { validator: checkNum, trigger: "blur" },
        ],
      };
      this.ruleMore = {
        productId: [
          { required: true, message: this.$t("请选择SPU"), trigger: "change" },
        ],
        productDetailId: [
          { required: true, validator: validatorSKUTable, trigger: "blur" },
        ],
        reasonId: [
          {
            required: true,
            message: this.$t("请选择添加课时原因"),
            trigger: "change",
          },
        ],
        data: [
          {
            required: true,
            message: this.$t("请输入批量数据"),
            trigger: "blur",
          },
        ],
        amount: [
          {
            required: true,
            message: this.$t("请输入添加数量"),
            trigger: "blur",
          },
          { validator: checkNum, trigger: "blur" },
        ],
      };
    },
  },
  created() {
    this.getDepartmentList();
    this.getClassHoursTypeList();

    this.$Api.financeManagement
      .searchReasonList(this.nowUserInfo.id, { lessonMark: 1 })
      .then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.reasonList = data.data;
        }
      });
    this.getTableData();
    this.getProductList();
    this.initRuleValid();
  },
};
</script>
<style lang="scss">
.handle-by-human-wrap {
  .el-dialog__title {
    font-size: 16px !important;
  }
}
.detailed-table {
  .cell {
    text-align: left;
  }
}
</style>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  height: 80px !important;
}
::v-deep .el-dialog__title {
  margin-top: 10px;
}
.handle-by-human-wrap {
  padding-bottom: 20px;
  .detail-wrap {
    width: 100%;
  }
  .detail-reason {
    background-color: #fcc;
    width: 70%;
    margin-left: 40px;
  }
  .detail-top-info {
    width: 100%;
    display: flex;
    ul {
      list-style: none;
      margin-right: 30px;
      li {
        margin: 20px 0;
      }
    }
  }
  .center-wrap {
    margin: 10px 0;
    position: relative;
    width: 100%;
    height: 30px;
    .button-tabs-wrap {
      position: absolute;
      left: 30px;
    }
    .event-btns-wrap {
      position: absolute;
      display: flex;
      right: 30px;
    }
  }
  .table-wrap {
    padding: 0 30px;
  }
  .more-select {
    margin-bottom: 10px;
  }
  .error-message {
    width: 100%;
    text-align: center;
    .error-message-color {
      color: red;
      font-weight: bold;
      margin: 0 4px;
    }
  }
}
::v-deep .table_header_class {
  & > .cell {
    word-break: keep-all;
  }
}
</style>
