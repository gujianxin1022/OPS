<template>
  <div class="editTemplat">
    <div class="name">
      <el-form ref="form" :model="form" label-width="140px" :rules="rules">
        <div class="w300">
          <el-form-item label="模板名称" prop="name">
            <el-input
              placeholder="请输入模板名称"
              v-model="form.name"
              :disabled="disabled||templateStatus==1"
            ></el-input>
          </el-form-item>
        </div>
        <el-divider></el-divider>
        <div class="pr20">
          <el-form-item label="总述文案" prop="remark">
            <el-input
              :disabled="disabled||templateStatus==1"
              v-model="form.remark"
              type="textarea"
              resize="none"
              rows="5"
              placeholder="请输入总述文案"
            ></el-input>
          </el-form-item>
          <el-form-item label="版本" prop="versions">
            <el-radio
              :disabled="cantChangeVersions || disabled"
              v-model="form.versions"
              :label="1"
              >{{ $t("v1.0") }}</el-radio
            >
            <el-radio
              :disabled="cantChangeVersions || disabled"
              v-model="form.versions"
              :label="2"
              >{{ $t("v2.0") }}</el-radio
            >
            <el-radio
              :disabled="cantChangeVersions || disabled"
              v-model="form.versions"
              :label="3"
              >{{ $t("v3.0") }}</el-radio
            >
          </el-form-item>
          <el-form-item label="课后建议级别" prop="isShow">
            <el-radio
              :disabled="cantChangeVersions || disabled"
              v-model="form.isShow"
              :label="1"
              >{{ $t("是") }}</el-radio
            >
            <el-radio
              :disabled="cantChangeVersions || disabled"
              v-model="form.isShow"
              :label="0"
              >{{ $t("否") }}</el-radio
            >
            <SuggestLevel
              :disabled="!form.isShow || cantChangeVersions"
              :data="form.listSuggestions"
              @getSuggestLevel="
                (list) => {
                  form.suggestLevelList = list;
                }
              "
              @close="
                () => {
                  form.listSuggestions = [];
                }
              "
            />
          </el-form-item>
          <el-form-item label="建议级别结果推送" prop="isLto">
            <el-radio
              :disabled="cantChangeVersions || disabled || form.isShow === 0"
              v-model="form.isLto"
              :label="1"
              >{{ $t("是") }}</el-radio
            >
            <el-radio
              :disabled="cantChangeVersions || disabled"
              v-model="form.isLto"
              :label="0"
              >{{ $t("否") }}</el-radio
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="content">
      <div class="course-knowledge-point">
        <p class="title-name">一、课程知识点</p>
        <p class="content">知识点可前往后台，在具体课程下编辑、查看</p>
      </div>
      <div class="ability-assessment">
        <p class="title-name flex-wrapper spn">
          <button style="opacity: 0">添加维度</button>
          <span>二、能力评估</span>
          <el-button
            type="primary"
            @click="addAbility"
            v-if="templateStatus == 2 && evaluationFormData.length <= 7"
            :disabled="disabled"
            >添加维度</el-button
          >
          <button v-else style="opacity: 0"></button>
        </p>
        <el-table border :data="evaluationFormData" style="width: 100%">
          <el-table-column
            fixed
            prop="name"
            label
            align="center"
          ></el-table-column>
          <el-table-column
            prop="oneStar"
            label="一星"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="twoStar"
            label="二星"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="threeStar"
            label="三星"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="fourStar"
            label="四星"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="fiveStar"
            label="五星"
            align="center"
          ></el-table-column>
          <el-table-column align="center" :label="$t('操作')" width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="edit(scope.row, scope.$index)"
                :disabled="disabled"
                >编辑</el-button
              >
              <el-button
                v-show="templateStatus == 2"
                type="text"
                @click="deleteItem(scope.row, scope.$index)"
                :disabled="disabled"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="form.versions !== 2" class="class-performance">
        <p class="title-name">三、课堂表现反馈</p>
        <template v-for="(item, index) in classPerformanceData">
          <ClassPerformance
            :key="index"
            :data="item"
            :index="index"
            @changelessonShowListObj="changelessonShowListObj"
            :disabled="disabled"
          ></ClassPerformance>
        </template>
      </div>
      <div v-if="form.versions === 2">
        <p class="title-name">三、课堂表现反馈</p>
        <HonorList
          @getHonorList="
            (val) => {
              honorList = val;
            }
          "
          v-if="!templateId || (honorList && honorList.length > 0)"
          :nowLanguage="'CN'"
          :list="honorList"
          :isDisabled="disabled"
          :status="templateStatus"
        />
      </div>

      <div class="bottom-btns" v-if="templateStatus !== null && !disabled">
        <template v-if="templateStatus !== 1">
          <el-button
            size="medium"
            type="primary"
            :loading="saveLoading"
            class="save-btn"
            @click="saveTemplate('save')"
            >保存</el-button
          >
          <el-button
            size="medium"
            type="primary"
            :loading="publishLoading"
            @click="publishTemplate"
            >发布</el-button
          >
        </template>
        <template v-if="templateStatus === 1">
          <el-button
            size="medium"
            type="primary"
            :loading="cancelPublishLoading"
            class="save-btn"
            @click="cancelPublish"
            >取消发布</el-button
          >
          <el-button
            size="medium"
            type="primary"
            :loading="upgradePublishLoading"
            @click="upgradePublish"
            >更新发布</el-button
          >
        </template>
      </div>
      <div class="bottom-btns" v-else></div>
      <!-- 编辑能力评估维度 start-->
      <el-dialog
        title="编辑维度"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        width="60%"
      >
        <div class="assessment-content">
          <el-form
            :model="editAssessmentInfo"
            :rules="addAbilityRules"
            ref="editAssessmentItem"
          >
            <el-form-item
              label="测评维度"
              :label-width="formLabelWidth"
              prop="name"
            >
              <el-input v-model="editAssessmentInfo.name"></el-input>
            </el-form-item>
            <el-form-item
              label="一星"
              :label-width="formLabelWidth"
              prop="oneStar"
            >
              <el-input
                v-model="editAssessmentInfo.oneStar"
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="二星"
              :label-width="formLabelWidth"
              prop="twoStar"
            >
              <el-input
                v-model="editAssessmentInfo.twoStar"
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="三星"
              :label-width="formLabelWidth"
              prop="threeStar"
            >
              <el-input
                v-model="editAssessmentInfo.threeStar"
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="四星"
              :label-width="formLabelWidth"
              prop="fourStar"
            >
              <el-input
                v-model="editAssessmentInfo.fourStar"
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="五星"
              :label-width="formLabelWidth"
              prop="fiveStar"
            >
              <el-input
                v-model="editAssessmentInfo.fiveStar"
                type="textarea"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEditAssessmentItem">取 消</el-button>
          <el-button type="primary" @click="changeAsseeementItem"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 编辑能力评估维度 end-->
      <!-- 添加能力评估维度 start-->
      <el-dialog
        title="添加维度"
        :visible.sync="addAbilityVisible"
        width="60%"
        :before-close="closeAddAssessmentItem"
        :close-on-click-modal="false"
      >
        <div slot="title" class="header-title">
          <span class="title-dimension">添加维度</span>
          <span class="title-age"
            >添加能力评估维度请确认其他语言版本内容是否已经完成翻译,否则会出现其他语言版本内容不一致的情况</span
          >
        </div>
        <div class="assessment-content">
          <el-form
            :model="addAssessmentData"
            :rules="addAbilityRules"
            ref="addAssessmentItem"
          >
            <el-form-item
              label="测评维度"
              :label-width="formLabelWidth"
              prop="name"
            >
              <el-input
                v-model="addAssessmentData.name"
                placeholder="请输入维度名称"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="一星"
              :label-width="formLabelWidth"
              prop="oneStar"
            >
              <el-input
                v-model="addAssessmentData.oneStar"
                type="textarea"
                placeholder="请输入文案"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="二星"
              :label-width="formLabelWidth"
              prop="twoStar"
            >
              <el-input
                v-model="addAssessmentData.twoStar"
                type="textarea"
                placeholder="请输入文案"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="三星"
              :label-width="formLabelWidth"
              prop="threeStar"
            >
              <el-input
                v-model="addAssessmentData.threeStar"
                type="textarea"
                placeholder="请输入文案"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="四星"
              :label-width="formLabelWidth"
              prop="fourStar"
            >
              <el-input
                v-model="addAssessmentData.fourStar"
                type="textarea"
                placeholder="请输入文案"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="五星"
              :label-width="formLabelWidth"
              prop="fiveStar"
            >
              <el-input
                v-model="addAssessmentData.fiveStar"
                type="textarea"
                placeholder="请输入文案"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeAddAssessmentItem">取 消</el-button>
          <el-button type="primary" @click="saveAssessmentItem"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 添加能力评估维度 end-->
    </div>
  </div>
</template>

<script>
import tryTeachTableVue from "../../tutorManagement/teacherProcess/components/tryTeachTable.vue";
import ClassPerformance from "./classPerformance";
import HonorList from "./components/honorList.vue";
import SuggestLevel from "./components/SuggestLevel";
export default {
  name: "editTemplate",
  data() {
    return {
      cantChangeVersions: false,
      honorList: null,
      disabled: false,
      form: {
        name: "",
        remark: "",
        versions: 1,
        isShow: 0,
        isLto: 0,
        suggestLevelList: [],
        listSuggestions: [],
      },
      rules: {
        name: [
          { required: true, message: "请输入模板名称", trigger: "blur" },
          { min: 5, max: 20, message: "模板名称5-20个字", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "请输入总述文案", trigger: "blur" },
          { min: 5, max: 200, message: "总述文案5-200个字", trigger: "blur" },
        ],
        versions: [{ required: true }],
        isShow: [{ required: true }],
        isLto: [{ required: true }],
      },
      dialogFormVisible: false,
      addAbilityVisible: false,
      addAssessmentData: {
        name: "",
        oneStar: "",
        twoStar: "",
        threeStar: "",
        fourStar: "",
        fiveStar: "",
      },
      evaluationFormData: [],
      editAssessmentInfo: {},
      changeAssessmentIndex: null,
      addAbilityRules: {
        name: [
          { required: true, message: "请输入测评维度名称", trigger: "blur" },
          { min: 1, max: 50, message: "维度1-50个字", trigger: "blur" },
        ],
        oneStar: [
          { required: true, message: "请输入一星文案", trigger: "blur" },
          { min: 5, max: 1000, message: "文案5-1000个字", trigger: "blur" },
        ],
        twoStar: [
          { required: true, message: "请输入二星文案", trigger: "blur" },
          { min: 5, max: 1000, message: "文案5-1000个字", trigger: "blur" },
        ],
        threeStar: [
          { required: true, message: "请输入三星文案", trigger: "blur" },
          { min: 5, max: 1000, message: "文案5-1000个字", trigger: "blur" },
        ],
        fourStar: [
          { required: true, message: "请输入四星文案", trigger: "blur" },
          { min: 5, max: 1000, message: "文案5-1000个字", trigger: "blur" },
        ],
        fiveStar: [
          { required: true, message: "请输入五星文案", trigger: "blur" },
          { min: 5, max: 1000, message: "文案5-1000个字", trigger: "blur" },
        ],
      },
      formLabelWidth: "100px",
      addAbilityLoading: false,
      editAbilityLoading: false,
      classPerformanceData: [],
      deleteLoading: false,
      deleteIndex: null,
      templateId: null,
      lessonShowListObj: {
        课堂表现: [],
        配合度: [],
        学生基础: [],
        // '课程调整': []
      },
      templateStatus: null, // 2待发布 1已发布
      publishLoading: false,
      starTypeToStarKey: {
        1: "oneStar",
        2: "twoStar",
        3: "threeStar",
        4: "fourStar",
        5: "fiveStar",
      },
      showTypeToStarKey: {
        1: "oneStar",
        2: "twoStar",
        3: "threeStar",
      },
      saveLoading: false,
      cancelPublishLoading: false,
      upgradePublishLoading: false,
      loadingObj: {
        upgradePublishLoading: this.upgradePublishLoading,
        publishLoading: this.publishLoading,
        cancelPublishLoading: this.cancelPublishLoading,
      },
      deletes: [],
      dataname: null,
      all: [],
      add: [],
      indexs: [],
      list: [],
      addID: [],
      dataNams: null,
      arrEditAdd: [],
      jianding: null,
    };
  },
  watch: {
    async "form.isShow"(newData) {
      if (newData === 0) {
        this.form.isLto = 0;
      }
    },
  },
  created() {
    if (this.$route.query.type) this.disabled = true;
    let id =
      this.$route.query.id || window.sessionStorage.getItem("templateId");
    if (this.$route.query.status) {
      this.templateStatus = this.$route.query.status;
    } else {
      this.templateStatus = 2;
    }
    if (this.templateStatus == 1) {
      // 已发布
      this.templateId = id;
      this.getTemplateDetail();
    } else if (this.templateStatus == 2 && id) {
      // 待发布且ID存在
      this.templateId = id;
      this.getTemplateDetail();
    } else if (!id) {
      // 新添加
      this.evaluationFormData = [
        {
          name: "听力",
          oneStar: "",
          twoStar: "",
          threeStar: "",
          fourStar: "",
          fiveStar: "",
          idArr: [],
          itemArr: [],
        },
        {
          name: "口语",
          oneStar: "",
          twoStar: "",
          threeStar: "",
          fourStar: "",
          fiveStar: "",
          idArr: [],
          itemArr: [],
        },
        {
          name: "阅读",
          oneStar: "",
          twoStar: "",
          threeStar: "",
          fourStar: "",
          fiveStar: "",
          idArr: [],
          itemArr: [],
        },
        {
          name: "词汇",
          oneStar: "",
          twoStar: "",
          threeStar: "",
          fourStar: "",
          fiveStar: "",
          idArr: [],
          itemArr: [],
        },
        {
          name: "句型",
          oneStar: "",
          twoStar: "",
          threeStar: "",
          fourStar: "",
          fiveStar: "",
          idArr: [],
          itemArr: [],
        },
      ];
      this.classPerformanceData = [
        {
          name: "课堂表现",
          dimension: ["活跃", "中等", "安静"],
        },
        {
          name: "配合度",
          dimension: ["配合", "中等", "不配合"],
        },
        {
          name: "学生基础",
          dimension: ["较高", "中等", "较低"],
        },
      ];
    }
  },
  methods: {
    cancelPublish() {
      this.$confirm(
        '<span style="color:red"><b>多语言模板也会一并取消发布,发布中文模板后需要重新发布多语言</b></span>',
        "确定取消发布模板吗？",
        {
          dangerouslyUseHTMLString: true,
        }
      ).then((_) => {
        this.changeTemplateStatus(2, "cancelPublishLoading");
      });
    },
    async upgradePublish() {
      this.$confirm(`确定更新发布模板吗？`).then(async (_) => {
        if (this.form.versions === 2) await this.saveHonor();
        await this.allEdit();
        this.changeTemplateStatus(1, "upgradePublishLoading");
        this.cantChangeVersions = true;
      });
    },
    async getTemplateDetail() {
      const res = await this.$Api.unitReportManagement.getSingleTemplate({
        templateId: this.templateId,
        language: "CN",
      });
      if (res.status === 1) this.cantChangeVersions = true;
      this.$set(this.form, "name", res.name);
      this.$set(this.form, "remark", res.desc);
      this.$set(this.form, "isLto", res.isLto);
      this.$set(this.form, "isShow", res.isShow);
      this.$set(this.form, "listSuggestions", res.listSuggestions);
      this.$set(this.form, "suggestLevelList", res.listSuggestions);
      this.templateStatus = res.status;
      // 处理能力评估
      if (res.powerAppraiseList == null) {
        this.evaluationFormData = [
          {
            name: "听力",
            oneStar: "",
            twoStar: "",
            threeStar: "",
            fourStar: "",
            fiveStar: "",
            idArr: [],
            itemArr: [],
          },
          {
            name: "口语",
            oneStar: "",
            twoStar: "",
            threeStar: "",
            fourStar: "",
            fiveStar: "",
            idArr: [],
            itemArr: [],
          },
          {
            name: "阅读",
            oneStar: "",
            twoStar: "",
            threeStar: "",
            fourStar: "",
            fiveStar: "",
            idArr: [],
            itemArr: [],
          },
          {
            name: "词汇",
            oneStar: "",
            twoStar: "",
            threeStar: "",
            fourStar: "",
            fiveStar: "",
            idArr: [],
            itemArr: [],
          },
          {
            name: "句型",
            oneStar: "",
            twoStar: "",
            threeStar: "",
            fourStar: "",
            fiveStar: "",
            idArr: [],
            itemArr: [],
          },
        ];
      } else {
        let originAbilityArr = this.collectData(res.powerAppraiseList, "name");
        originAbilityArr.forEach((abilityItem, abilityIndex) => {
          let param = {
            name: abilityItem[0].nameLanguage,
            idArr: [],
            itemArr: [],
          };
          this.deletes.push({
            name: abilityItem[0].name,
            nameLanguage: abilityItem[0].nameLanguage,
          });
          abilityItem.sort((a, b) => a.starType - b.starType);
          abilityItem.forEach((item, index) => {
            param[this.starTypeToStarKey[item["starType"]]] = item.starTypeDesc;
            param.idArr.push(item.id);
            param.itemArr.push(item.starTypeDesc);
          });
          this.$set(this.evaluationFormData, abilityIndex, param);
        });
      }
      // 处理课堂表现反馈
      this.classPerformanceData = [
        {
          name: "课堂表现",
          dimension: ["活跃", "中等", "安静"],
        },
        {
          name: "配合度",
          dimension: ["配合", "中等", "不配合"],
        },
        {
          name: "学生基础",
          dimension: ["较高", "中等", "较低"],
        },
      ];
      let originClassPerformanceArr = this.collectData(
          res.lessonShowList,
          "name"
        ),
        classPerformanceDataTem = [];
      originClassPerformanceArr.forEach(
        (classPerformanceItem, classPerformanceIndex) => {
          let param = {
            name: classPerformanceItem[0].name,
            idArr: [],
            desArr: [],
            dimension: [],
          };
          classPerformanceItem.sort((a, b) => a.showType - b.showType);
          classPerformanceItem.forEach((item, index) => {
            param[this.showTypeToStarKey[item["showType"]]] = item.showDesc;
            param.idArr.push(item.id);
            param.desArr.push(item.showDesc);
            param.dimension.push(item.showTypeDesc);
          });
          classPerformanceDataTem[classPerformanceIndex] = param;
          this.$set(
            this.lessonShowListObj,
            classPerformanceItem[0]["name"],
            param.idArr
          );
        }
      );
      Object.keys(this.lessonShowListObj).forEach((item) => {
        if (this.lessonShowListObj[item].length !== 0) {
          let param = classPerformanceDataTem.filter(
            (classItem) => classItem.name === item
          )[0];
          this.classPerformanceData.some((item, index) => {
            if (item.name === param.name) {
              this.$set(this.classPerformanceData, index, param);
            }
          });
        }
      });
      this.honorList = res.courseFirstHonorList;
      this.form.versions = res.version;
      this.templateStatus = res.status;
    },
    closeAddAssessmentItem() {
      this.addAbilityVisible = false;
      this.$refs["addAssessmentItem"].resetFields();
    },
    closeEditAssessmentItem() {
      this.dialogFormVisible = false;
      this.$refs["editAssessmentItem"].resetFields();
    },
    changeAsseeementItem() {
      this.$refs["editAssessmentItem"].validate((val) => {
        if (val) {
          // 修改
          if (this.editAssessmentInfo.idArr.length > 0) {
            this.jianding = 0;
            let indexToKey = {
              0: "oneStar",
              1: "twoStar",
              2: "threeStar",
              3: "fourStar",
              4: "fiveStar",
            };
            let params = [];
            let par = {};
            let nams = "";
            this.editAssessmentInfo.idArr.forEach((item, index) => {
              params.push({
                id: item,
                starType: index + 1,
                starTypeDesc: this.editAssessmentInfo[indexToKey[index]],
                nameLanguage: this.editAssessmentInfo.name,
              });
            });
            nams = this.dataNams;
            params.forEach((item) => {
              if (item.starType == 1) {
                this.evaluationFormData[this.changeAssessmentIndex].oneStar =
                  item.starTypeDesc;
              } else if (item.starType == 2) {
                this.evaluationFormData[this.changeAssessmentIndex].twoStar =
                  item.starTypeDesc;
              } else if (item.starType == 3) {
                this.evaluationFormData[this.changeAssessmentIndex].threeStar =
                  item.starTypeDesc;
              } else if (item.starType == 4) {
                this.evaluationFormData[this.changeAssessmentIndex].fourStar =
                  item.starTypeDesc;
              } else {
                this.evaluationFormData[this.changeAssessmentIndex].fiveStar =
                  item.starTypeDesc;
              }
              this.evaluationFormData[this.changeAssessmentIndex].nameLanguage =
                this.editAssessmentInfo.name;
              this.evaluationFormData[this.changeAssessmentIndex].name =
                this.editAssessmentInfo.name;
            });
            par = { params, nams };
            this.all.push(par);
            this.editAbilityLoading = false;
            this.closeEditAssessmentItem();
          } else {
            // 新增
            this.jianding = 1;
            this.add.push({
              templateId: this.templateId,
              name: this.editAssessmentInfo.name,
              nameLanguage: this.editAssessmentInfo.name,
              language: "CN",
              starInfos: [
                {
                  starType: 1,
                  nameLanguage: this.editAssessmentInfo.name,
                  starTypeDesc: this.editAssessmentInfo.oneStar,
                },
                {
                  starType: 2,
                  nameLanguage: this.editAssessmentInfo.name,
                  starTypeDesc: this.editAssessmentInfo.twoStar,
                },
                {
                  starType: 3,
                  nameLanguage: this.editAssessmentInfo.name,
                  starTypeDesc: this.editAssessmentInfo.threeStar,
                },
                {
                  starType: 4,
                  nameLanguage: this.editAssessmentInfo.name,
                  starTypeDesc: this.editAssessmentInfo.fourStar,
                },
                {
                  starType: 5,
                  nameLanguage: this.editAssessmentInfo.name,
                  starTypeDesc: this.editAssessmentInfo.fiveStar,
                },
              ],
            });
            this.list[this.changeAssessmentIndex] = {
              name: this.editAssessmentInfo.name,
              oneStar: this.editAssessmentInfo.oneStar,
              twoStar: this.editAssessmentInfo.twoStar,
              threeStar: this.editAssessmentInfo.threeStar,
              fourStar: this.editAssessmentInfo.fourStar,
              fiveStar: this.editAssessmentInfo.fiveStar,
              // idArr: res.data.data,
              itemArr: [
                this.editAssessmentInfo.oneStar,
                this.editAssessmentInfo.twoStar,
                this.editAssessmentInfo.threeStar,
                this.editAssessmentInfo.fourStar,
                this.editAssessmentInfo.fiveStar,
              ],
            };
            this.$set(this.evaluationFormData, this.changeAssessmentIndex, {
              name: this.editAssessmentInfo.name,
              oneStar: this.editAssessmentInfo.oneStar,
              twoStar: this.editAssessmentInfo.twoStar,
              threeStar: this.editAssessmentInfo.threeStar,
              fourStar: this.editAssessmentInfo.fourStar,
              fiveStar: this.editAssessmentInfo.fiveStar,
              idArr: [],
              itemArr: [
                this.editAssessmentInfo.oneStar,
                this.editAssessmentInfo.twoStar,
                this.editAssessmentInfo.threeStar,
                this.editAssessmentInfo.fourStar,
                this.editAssessmentInfo.fiveStar,
              ],
            });
            this.editAbilityLoading = true;
            this.closeEditAssessmentItem();
            this.editAbilityLoading = false;
          }
        } else {
        }
      });
    },
    saveAssessmentItem() {
      this.$refs["addAssessmentItem"].validate((val) => {
        this.jianding = 2;
        this.addAbilityLoading = false;
        this.addAbilityVisible = false;
        let arrlist = {
          name: this.addAssessmentData.name,
          nameLanguage: this.addAssessmentData.name,
          language: "CN",
          starInfos: [
            { starType: 1, starTypeDesc: this.addAssessmentData.oneStar },
            { starType: 2, starTypeDesc: this.addAssessmentData.twoStar },
            { starType: 3, starTypeDesc: this.addAssessmentData.threeStar },
            { starType: 4, starTypeDesc: this.addAssessmentData.fourStar },
            { starType: 5, starTypeDesc: this.addAssessmentData.fiveStar },
          ],
        };
        this.arrEditAdd.push({
          name: this.addAssessmentData.name,
          nameLanguage: this.addAssessmentData.name,
          language: "CN",
          starInfos: [
            { starType: 1, starTypeDesc: this.addAssessmentData.oneStar },
            { starType: 2, starTypeDesc: this.addAssessmentData.twoStar },
            { starType: 3, starTypeDesc: this.addAssessmentData.threeStar },
            { starType: 4, starTypeDesc: this.addAssessmentData.fourStar },
            { starType: 5, starTypeDesc: this.addAssessmentData.fiveStar },
          ],
        });
        let itemArrs = [];
        arrlist.starInfos.forEach((item) => {
          if (item.starType == 1) {
            itemArrs.push(item.starTypeDesc);
          } else if (item.starType == 2) {
            itemArrs.push(item.starTypeDesc);
          } else if (item.starType == 3) {
            itemArrs.push(item.starTypeDesc);
          } else if (item.starType == 4) {
            itemArrs.push(item.starTypeDesc);
          } else if (item.starType == 5) {
            itemArrs.push(item.starTypeDesc);
          }
        });
        this.addAbilityLoading = false;
        this.$set(this.evaluationFormData, this.evaluationFormData.length, {
          fiveStar: this.addAssessmentData.fiveStar,
          fourStar: this.addAssessmentData.fourStar,
          idArr: [],
          itemArr: itemArrs,
          name: this.addAssessmentData.name,
          oneStar: this.addAssessmentData.oneStar,
          threeStar: this.addAssessmentData.threeStar,
          twoStar: this.addAssessmentData.twoStar,
        });
        this.list.push({
          name: this.addAssessmentData.name,
          oneStar: this.addAssessmentData.oneStar,
          twoStar: this.addAssessmentData.twoStar,
          threeStar: this.addAssessmentData.threeStar,
          fourStar: this.addAssessmentData.fourStar,
          fiveStar: this.addAssessmentData.fiveStar,
          // idArr: res.data.data,
          itemArr: [
            this.addAssessmentData.oneStar,
            this.addAssessmentData.twoStar,
            this.addAssessmentData.threeStar,
            this.addAssessmentData.fourStar,
            this.addAssessmentData.fiveStar,
          ],
        });
        this.closeAddAssessmentItem();
        this.addAssessmentData = [];
      });
    },
    edit(data, index) {
      this.changeAssessmentIndex = index;
      this.dataNams = data.name;
      this.dialogFormVisible = true;
      this.editAssessmentInfo = JSON.parse(JSON.stringify(data));
    },
    deleteItem(data, index) {
      if (data.idArr.length > 0) {
        this.$confirm(
          '<span style="color:red"><b>删除后，该维度下所有多语言内容也会同步删除，请谨慎操作</b></span>',
          `确认删除${data.name}`,
          {
            dangerouslyUseHTMLString: true,
          }
        ).then((_) => {
          this.deletes.forEach((item) => {
            if (item.nameLanguage == data.name) {
              this.dataname = item.name;
            }
          });
          this.deleteLoading = true;
          this.deleteIndex = index;
          this.evaluationFormData.splice(this.deleteIndex, 1);
        });
      } else {
        this.evaluationFormData.splice(index, 1);
      }
    },
    addAbility() {
      this.addAbilityVisible = true;
    },
    changelessonShowListObj({ data, index }) {
      this.$set(this.lessonShowListObj, index, data);
    },
    flatten(arr) {
      while (arr.some((item) => Array.isArray(item))) {
        arr = [].concat.apply([], arr);
      }
      return arr;
    },
    collectData(arr, prop) {
      let map = {},
        key;
      if (arr) {
        arr.forEach((arrItem, arrIndex) => {
          if (key !== arrItem[prop] || !map[arrItem[prop]]) {
            key = arrItem[prop];
            map[arrItem[prop]] = [];
            map[arrItem[prop]].push(arrItem);
          } else {
            map[arrItem[prop]].push(arrItem);
          }
        });
      }
      return Object.values(map);
    },
    delete() {
      this.$Api.unitReportManagement
        .deleteAbilityAssessment(this.templateId, this.dataname)
        .then((res) => {
          if (res.status === 200) {
            this.deleteLoading = false;
            this.deleteIndex = null;
          }
        });
    },

    async saveTemplate(operation) {
      this.saveLoading = true;
      let honorList = null;
      if (this.form.versions === 2) honorList = await this.saveHonor();
      if (this.jianding == 0) {
        await this.allEdit();
      } else if (this.jianding == 1) {
        await this.allAdd();
        await this.editAdd();
      } else if (this.jianding == 2) {
        await this.allAdd();
        await this.editAdd();
      }
      // status 1已发布，2待发布, 保存和第一次发布都调这个
      let skillList = [],
        lessonShowList = [],
        params;
      this.evaluationFormData.forEach((item, index) => {
        skillList = skillList.concat(item.idArr);
      });
      lessonShowList = this.flatten(Object.values(this.lessonShowListObj));
      params = {
        id: this.templateId,
        name: this.form.name,
        remark: this.form.remark,
        language: "CN",
        skillList: skillList.join(","),
        lessonShowList: lessonShowList.join(","),
        status: operation === "save" ? 2 : 1,
        versions: this.form.versions,
        honorList: honorList,
        isLto: this.form.isLto,
        isShow: this.form.isShow,
        suggestLevelList: this.form.suggestLevelList,
      };
      operation === "save"
        ? (this.saveLoading = true)
        : (this.publishLoading = true);
      try {
        const res = await this.$Api.unitReportManagement.saveTemplate(params);
        this.templateId = res;
        window.sessionStorage.setItem("templateId", this.templateId);
        // this.delete();
        if (operation === "publish") {
          this.templateStatus = 1;
        }
        this.$notify({
          type: "success",
          message: operation === "publish" ? "发布成功" : "保存成功",
        });
        this.all = [];
        this.add = [];
      } finally {
        operation === "save"
          ? (this.saveLoading = false)
          : (this.publishLoading = false);
      }
    },

    async changeTemplateStatus(status, loading) {
      switch (loading) {
        case "upgradePublishLoading": {
          this.upgradePublishLoading = true;
          break;
        }
        case "publishLoading": {
          this.publishLoading = true;
          break;
        }
        case "cancelPublishLoading": {
          this.cancelPublishLoading = true;
          break;
        }
      }
      this.loadingObj[loading] = true;
      this.$Api.unitReportManagement
        .updateTemplateStatus({
          language: "CN",
          id: this.templateId,
          status: status,
        })
        .then((res) => {
          if (res.status === 200) {
            switch (loading) {
              case "upgradePublishLoading": {
                this.upgradePublishLoading = false;
                break;
              }
              case "publishLoading": {
                this.publishLoading = false;
                break;
              }
              case "cancelPublishLoading": {
                this.cancelPublishLoading = false;
                break;
              }
            }
            if (res.data.code === 200) {
              if (this.jianding == 0) {
                this.allEdit();
              } else if (this.jianding == 1) {
                this.allAdd();
              } else if (this.jianding == 2) {
                this.editAdd();
              }
              this.$notify({
                type: "success",
                message: status === 1 ? "模板发布成功" : "模板取消发布",
              });
              // if (status == 1) {
              //   this.delete();
              // }
              this.getTemplateDetail();
              this.all = [];
              this.add = [];
              this.$router.go(0);
            }
          }
        });
    },
    async publishTemplate() {
      this.publishLoading = true;
      let validateStatus = await this.validateForm();
      if (!validateStatus) {
        this.publishLoading = false;
        return;
      }
      // 点击发布时，如果该模板状态为已发布，调修改模板状态接口，否则调保存模板接口
      if (this.templateStatus === 1) {
        if (this.form.versions === 2) await this.saveHonor();
        this.changeTemplateStatus(1, "publishLoading");
        this.cantChangeVersions = true;
      } else {
        this.saveTemplate("publish");
        this.cantChangeVersions = true;
      }
    },
    async allEdit() {
      this.editAbilityLoading = tryTeachTableVue;
      await this.$Api.unitReportManagement
        .changeAbilityAssessment(this.all)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.code === 200) {
              this.$set(
                this.evaluationFormData,
                this.changeAssessmentIndex,
                JSON.parse(JSON.stringify(this.editAssessmentInfo))
              );
            }
          }
        });
    },
    async editAdd() {
      const res = await this.$Api.unitReportManagement.saveAbilityAssessment(
        this.arrEditAdd
      );
      if (res.status !== 200) return Promise.reject();
      let list = [];
      let leng = this.evaluationFormData.length;
      for (let i = 0; i < res.data.length; i++) {
        list.push(res.data[i]);
        if (i == res.data.length - 1) {
          this.evaluationFormData[leng - 1].idArr = list;
        }
      }
    },
    async allAdd() {
      this.add.forEach((item) => {
        item.templateId = this.templateId;
      });
      await this.$Api.unitReportManagement
        .saveAbilityAssessment(this.add)
        .then((res) => {
          if (res.status === 200) {
            let v = 0;
            let j = 0;
            let list = [];
            for (let i = 0; i < res.data.length; i++) {
              j++;
              list.push(res.data[i]);
              if (j / 5 == 1) {
                this.list[v].idArr = list;
                this.$set(this.evaluationFormData, v, this.list[v]);
                list = [];
                v++;
              } else if (j / 5 == 2) {
                this.list[v].idArr = list;
                this.$set(this.evaluationFormData, v, this.list[v]);
                list = [];
                v++;
              } else if (j / 5 == 3) {
                this.list[v].idArr = list;
                this.$set(this.evaluationFormData, v, this.list[v]);
                list = [];
                v++;
              } else if (j / 5 == 4) {
                this.list[v].idArr = list;
                this.$set(this.evaluationFormData, v, this.list[v]);
                list = [];
                v++;
              } else if (j / 5 == 5) {
                this.list[v].idArr = list;
                this.$set(this.evaluationFormData, v, this.list[v]);
                list = [];
                v++;
              } else if (j / 5 == 6) {
                this.list[v].idArr = list;
                this.$set(this.evaluationFormData, v, this.list[v]);
                list = [];
                v++;
              } else if (j / 5 == 7) {
                this.list[v].idArr = list;
                this.$set(this.evaluationFormData, v, this.list[v]);
                list = [];
                v++;
              } else if (j / 5 == 8) {
                this.list[v].idArr = list;
                this.$set(this.evaluationFormData, v, this.list[v]);
                list = [];
                v++;
              }
            }
          }
        });
    },
    async saveHonor() {
      const params = {
        courseFirstHonorReqList: this.honorList,
      };
      const res = await this.$Api.unitReportManagement.reqSaveHonor(params);
      return res.join(",");
    },
    /* 发布时校验配置项完整性 */
    async validateForm() {
      let skillList = [],
        lessonShowList = [],
        params;
      if (this.jianding == 0) {
        await this.allEdit();
      } else if (this.jianding == 1) {
        await this.allAdd();
        await this.editAdd();
      } else if (this.jianding == 2) {
        await this.allAdd();
        await this.editAdd();
      }
      this.evaluationFormData.forEach((item, index) => {
        skillList = skillList.concat(item.idArr);
      });
      lessonShowList = this.flatten(Object.values(this.lessonShowListObj));
      params = {
        id: this.templateId,
        name: this.form.name,
        remark: this.form.remark,
        language: "CN",
        skillList: skillList.join(","),
        lessonShowList: lessonShowList.join(","),
      };
      let validateStatus;
      this.$refs["form"].validate((val) => {
        if (!val) {
          this.$notify({
            type: "warning",
            message: "请完善模板名称与总述文案",
          });
          return (validateStatus = false);
        }
        let hasEmptyAbilityItem = this.evaluationFormData.some(
          (item) => item.idArr.length === 0
        );
        if (hasEmptyAbilityItem) {
          this.$notify({
            type: "warning",
            message: "能力评估文案不能为空",
          });
          return (validateStatus = false);
        }
        if (skillList.length < 20 || skillList.length > 40) {
          this.$notify({
            type: "warning",
            message: "能力评估维度为4-8个",
          });
          return (validateStatus = false);
        }
        if (this.form.versions !== 2 && lessonShowList.length < 9) {
          this.$notify({
            type: "warning",
            message: "请完善课堂表现反馈",
          });
          return (validateStatus = false);
        }
        if (this.form.isShow === 1 && !this.form.suggestLevelList?.length) {
          this.$notify({
            type: "warning",
            message: "请配置建议级别",
          });
          return (validateStatus = false);
        }
        return (validateStatus = true);
      });
      return validateStatus;
    },
  },
  components: {
    ClassPerformance,
    HonorList,
    SuggestLevel,
  },
};
</script>

<style lang="scss" scoped>
.editTemplat {
  padding-top: 20px;
  padding-left: 20px;
  .content {
    padding-top: 20px;
  }
  .course-knowledge-point,
  .ability-assessment {
    text-align: center;
  }
  .ability-assessment {
    padding-right: 20px;
    margin-bottom: 100px;
  }
  .course-knowledge-point {
    margin-bottom: 100px;
    margin-top: 50px;
    .content {
      color: #606266;
    }
  }
  .title-name {
    color: rgb(218, 196, 110);
    font-weight: 500;
    font-size: 18px;
    text-align: center;
  }
  .spn {
    justify-content: space-between;
  }
  .dialog-footer {
    text-align: center;
  }
  .assessment-content {
    padding-right: 20px;
  }
  .class-performance {
    padding-right: 20px;
  }
  .bottom-btns {
    text-align: center;
    padding-bottom: 20px;
    padding-top: 20px;
    .save-btn {
      margin-right: 100px;
    }
  }
  .title-age {
    color: #e56252;
  }
}
</style>
