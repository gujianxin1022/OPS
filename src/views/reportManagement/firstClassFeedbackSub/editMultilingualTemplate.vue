<template>
  <div class="editTemplat">
    <div class="content">
      <div class="course-knowledge-point">
        <p class="title-name">一、课程知识点</p>
        <p class="content">知识点可前往后台，在具体课程下编辑、查看</p>
      </div>
      <div class="ability-assessment">
        <p class="title-name spn">
          <span>二、能力评估</span>
        </p>
        <el-table border :data="evaluationFormData" style="width: 100%">
          <el-table-column
            fixed
            prop="nameLanguageZh"
            label="CN"
            align="center"
          ></el-table-column>
          <el-table-column
            fixed
            prop="nameLanguage"
            :label="language"
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
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="class-performance" v-if="version !== 2">
        <p class="title-name">三、课堂表现反馈</p>
        <template v-for="(item, index) in classPerformanceData">
          <ClassPerformance
            :data="item"
            :key="index"
            :index="index"
            :language="language"
            @changelessonShowListObj="changelessonShowListObj"
            :disabled="disabled"
          ></ClassPerformance>
        </template>
      </div>
      <div v-if="version === 2">
        <p class="title-name">三、课堂表现反馈</p>
        <MultilingualHonorList
          @getHonorList="
            (val) => {
              honorList = val;
            }
          "
          :nowLanguage="language"
          :honorListZh="honorListZh"
          :list="honorList"
          :isDisabled="disabled"
          :status="templateStatus"
        />
      </div>
      <div class="bottom-btns" v-if="templateStatus !== null && !disabled">
        <template v-if="templateStatus != '1'">
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
        <template v-if="templateStatus == '1'">
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
        v-if="editAssessmentInfo.data"
        title="编辑维度"
        :visible.sync="dialogFormVisible"
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
              prop="nameLanguage"
            >
              <el-input v-model="editAssessmentInfo.nameLanguage"></el-input>
              <div style="font-size: 12px">
                中文对照：{{ editAssessmentInfo.data.nameLanguageZh }}
              </div>
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
              <div style="font-size: 12px">
                中文对照：{{ editAssessmentInfo.data.oneStar }}
              </div>
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
              <div style="font-size: 12px">
                中文对照：{{ editAssessmentInfo.data.twoStar }}
              </div>
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
              <div style="font-size: 12px">
                中文对照：{{ editAssessmentInfo.data.threeStar }}
              </div>
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
              <div style="font-size: 12px">
                中文对照：{{ editAssessmentInfo.data.fourStar }}
              </div>
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
              <div style="font-size: 12px">
                中文对照：{{ editAssessmentInfo.data.fiveStar }}
              </div>
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
    </div>
  </div>
</template>

<script>
import ClassPerformance from "./classPerformance";
import MultilingualHonorList from "./components/multilingualHonorList.vue";

export default {
  name: "editTemplate",
  data() {
    return {
      version: null,
      honorListZh: null,
      honorList: [],
      disabled: false,
      form: {
        name: "",
        remark: "",
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
      },
      dialogFormVisible: false,
      evaluationFormData: [],
      evaluationFormDataLan: [],
      editAssessmentInfo: {},
      changeAssessmentIndex: null,
      addAbilityRules: {
        name: [
          { required: true, message: "请输入测评维度名称", trigger: "blur" },
          { min: 1, max: 50, message: "维度1-50个字", trigger: "blur" },
        ],
        nameLanguage: [
          { required: true, message: "请输入测评维度名称", trigger: "blur" },
          { min: 1, max: 100, message: "维度1-100个字", trigger: "blur" },
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
      templateId: null,
      addAbilityLoading: false,
      editAbilityLoading: false,
      classPerformanceDataZN: [],
      classPerformanceData: [],
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
      language: "CN",
      type: "",
      originClassPerformanceIdArr: [],
      list: [],
      editList: [],
      addList: [],
      addMemory: [],
      dataNams: null,
    };
  },
  created() {
    if (this.$route.query.type) this.disabled = true;
    let id =
      this.$route.query.id || window.sessionStorage.getItem("templateId");
    this.language = this.$route.query.language;
    this.templateId = id;
    this.templateStatus = this.$route.query.status;
    this.getTemplateDetail();
  },
  methods: {
    async allEdit() {
      await this.$Api.unitReportManagement
        .changeAbilityAssessment(this.editList)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.code === 200) {
              this.$set(
                this.evaluationFormData,
                this.changeAssessmentIndex,
                JSON.parse(JSON.stringify(this.editAssessmentInfo))
              );
            }
            this.editAssessmentInfo = false;
          }
        });
    },
    async allAdd() {
      const res = await this.$Api.unitReportManagement.saveAbilityAssessment(
        this.addList
      );
      if (res.status !== 200) return Promise.reject();
      let v = 0;
      let indexArr = [];
      this.addMemory.forEach((e, index) => {
        if (e) {
          indexArr.push(index);
        }
      });
      let j = 0;
      let list = [];
      for (let i = 0; i < res.data.length; i++) {
        j++;
        list.push(res.data[i]);
        if (j / 5 == 1) {
          this.addMemory[indexArr[v]].idArr = list;
          let nameLanguageZh =
            this.evaluationFormData[indexArr[v]].nameLanguageZh;
          this.addMemory[indexArr[v]].nameLanguageZh = nameLanguageZh;
          this.$set(
            this.evaluationFormData,
            indexArr[v],
            this.addMemory[indexArr[v]]
          );
          list = [];
          v++;
        } else if (j / 5 == 2) {
          this.addMemory[indexArr[v]].idArr = list;
          let nameLanguageZh =
            this.evaluationFormData[indexArr[v]].nameLanguageZh;
          this.addMemory[indexArr[v]].nameLanguageZh = nameLanguageZh;
          this.$set(
            this.evaluationFormData,
            indexArr[v],
            this.addMemory[indexArr[v]]
          );
          list = [];
          v++;
        } else if (j / 5 == 3) {
          this.addMemory[indexArr[v]].idArr = list;
          let nameLanguageZh =
            this.evaluationFormData[indexArr[v]].nameLanguageZh;
          this.addMemory[indexArr[v]].nameLanguageZh = nameLanguageZh;
          this.$set(
            this.evaluationFormData,
            indexArr[v],
            this.addMemory[indexArr[v]]
          );
          list = [];
          v++;
        } else if (j / 5 == 4) {
          this.addMemory[indexArr[v]].idArr = list;
          let nameLanguageZh =
            this.evaluationFormData[indexArr[v]].nameLanguageZh;
          this.addMemory[indexArr[v]].nameLanguageZh = nameLanguageZh;
          this.$set(
            this.evaluationFormData,
            indexArr[v],
            this.addMemory[indexArr[v]]
          );
          list = [];
          v++;
        } else if (j / 5 == 5) {
          this.addMemory[indexArr[v]].idArr = list;
          let nameLanguageZh =
            this.evaluationFormData[indexArr[v]].nameLanguageZh;
          this.addMemory[indexArr[v]].nameLanguageZh = nameLanguageZh;
          this.$set(
            this.evaluationFormData,
            indexArr[v],
            this.addMemory[indexArr[v]]
          );
          list = [];
          v++;
        } else if (j / 5 == 6) {
          this.addMemory[indexArr[v]].idArr = list;
          let nameLanguageZh =
            this.evaluationFormData[indexArr[v]].nameLanguageZh;
          this.addMemory[indexArr[v]].nameLanguageZh = nameLanguageZh;
          this.$set(
            this.evaluationFormData,
            indexArr[v],
            this.addMemory[indexArr[v]]
          );
          list = [];
          v++;
        } else if (j / 5 == 7) {
          this.addMemory[indexArr[v]].idArr = list;
          let nameLanguageZh =
            this.evaluationFormData[indexArr[v]].nameLanguageZh;
          this.addMemory[indexArr[v]].nameLanguageZh = nameLanguageZh;
          this.$set(
            this.evaluationFormData,
            indexArr[v],
            this.addMemory[indexArr[v]]
          );
          list = [];
          v++;
        } else if (j / 5 == 8) {
          this.addMemory[indexArr[v]].idArr = list;
          let nameLanguageZh =
            this.evaluationFormData[indexArr[v]].nameLanguageZh;
          this.addMemory[indexArr[v]].nameLanguageZh = nameLanguageZh;
          this.$set(
            this.evaluationFormData,
            indexArr[v],
            this.addMemory[indexArr[v]]
          );
          list = [];
          v++;
        }
      }
    },
    async changeTemplateStatus(status, loading) {
      await this.allAdd();
      await this.allEdit();
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
      if (status == 1 && this.version === 2) await this.saveHonor();
      this.loadingObj[loading] = true;
      this.$Api.unitReportManagement
        .updateTemplateStatus({
          id: this.templateId,
          language: this.language,
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
              this.$notify({
                type: "success",
                message: status === 1 ? "模板发布成功" : "模板取消发布",
              });

              this.addList = [];
              this.editList = [];
              this.templateStatus = `${status}`;
              this.$router.go(0);
            }
          }
        });
    },
    cancelPublish() {
      this.$confirm(`确定取消发布模板吗？`).then((_) => {
        this.changeTemplateStatus(2, "cancelPublishLoading");
      });
    },
    // 发布
    async publishTemplate() {
      this.publishLoading = true;
      let skillList = [],
        lessonShowList = [],
        params;
      await this.allAdd();
      let status = this.evaluationFormData.some((item) => {
        return item.idArr.length < 5;
      });
      if (status) {
        this.$notify({
          message: "能力评估存在未填写或填写不规范项，请重新检查填写",
          type: "warning",
        });
        this.publishLoading = false;
        return;
      }
      this.evaluationFormData.forEach((item, index) => {
        skillList = skillList.concat(item.idArr);
      });
      if (this.version !== 2) {
        lessonShowList = this.flatten(Object.values(this.lessonShowListObj));
        let missing = lessonShowList.filter((item) =>
          this.originClassPerformanceIdArr.some(
            (resultItem) => resultItem === item
          )
        );
        if (missing.length > 0) {
          this.$notify({
            message: "课堂表现反馈存在未填写或填写不规范项，请重新检查填写",
            type: "warning",
          });
          this.publishLoading = false;
          return;
        }
      }

      params = {
        id: this.templateId,
        name: this.form.name,
        remark: this.form.remark,
        language: this.language,
        skillList: skillList.join(","),
        lessonShowList: lessonShowList.join(","),
      };
      let hasEmptyAbilityItem = this.evaluationFormData.some(
        (item) => item.idArr.length === 0
      );
      if (!hasEmptyAbilityItem) {
        if (skillList.length >= 20 && skillList.length <= 40) {
          if (this.version !== 2) {
            if (lessonShowList.length === 9) {
            } else {
              this.$notify({
                type: "warning",
                message: "请完善课堂表现反馈",
              });
            }
          }
          // 点击发布时，如果该模板状态为已发布，调修改模板状态接口，否则调保存模板接口
          if (this.templateStatus === "1") {
            this.changeTemplateStatus(1, "publishLoading");
          } else {
            this.saveTemplate("publish");
          }
        } else {
          this.$notify({
            type: "warning",
            message: "能力评估维度为4-8个",
          });
        }
      } else {
        this.$notify({
          type: "warning",
          message: "能力评估文案不能为空",
        });
        this.publishLoading = false;
      }
    },
    // 更新发布
    async upgradePublish() {
      this.$confirm(`确定更新发布模板吗？`).then(async (_) => {
        // if (this.version === 2) await this.saveHonor();
        // await this.allEdit();
        this.changeTemplateStatus(1, "upgradePublishLoading");
      });
    },
    async getTemplateDetail() {
      const res = await this.$Api.unitReportManagement.getSingleTemplate({
        templateId: this.templateId,
        language: "CN",
      });
      this.version = res.version;
      this.list = res.powerAppraiseList;
      this.$set(this.form, "name", res.name);
      this.$set(this.form, "remark", res.desc);
      // 处理能力评估
      if (res.powerAppraiseList === null) {
        this.evaluationFormDataLan = [
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
            name: abilityItem[0].name,
            nameLanguageZh: abilityItem[0].nameLanguage,
            idArr: [],
            itemArr: [],
          };
          abilityItem.sort((a, b) => a.starType - b.starType);
          abilityItem.forEach((item, index) => {
            param[this.starTypeToStarKey[item["starType"]]] = item.starTypeDesc;
            param.idArr.push(item.id);
            param.itemArr.push(item.starTypeDesc);
          });
          this.$set(this.evaluationFormDataLan, abilityIndex, param);
        });
      }
      this.getLanguageTemDetail();
      if (this.version !== 2) {
        /* 处理课堂表现反馈 */
        this.classPerformanceDataZN = [
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
            this.classPerformanceDataZN.some((item, index) => {
              if (item.name === param.name) {
                this.$set(this.classPerformanceDataZN, index, param);
              }
            });
          }
        });
        res.lessonShowList.forEach((e) => {
          this.originClassPerformanceIdArr.push(e.id);
        });
      }
      if (this.version === 2) {
        this.honorListZh = res.courseFirstHonorList;
      }
    },
    // 获取多语言模板详情
    async getLanguageTemDetail() {
      const res = await this.$Api.unitReportManagement.getSingleTemplate({
        templateId: this.templateId,
        language: this.language,
      });
      // this.templateStatus = res.status;
      if (res.powerAppraiseList == null) {
        this.type = "add";
        let arr = JSON.parse(JSON.stringify(this.evaluationFormDataLan));
        let evaluationFormData = [];
        arr.forEach((e) => {
          evaluationFormData.push({
            name: e.name,
            nameLanguageZh: e.nameLanguageZh,
            nameLanguage: "",
            oneStar: "",
            twoStar: "",
            threeStar: "",
            fourStar: "",
            fiveStar: "",
            idArr: [],
            itemArr: [],
          });
        });
        // 新添加
        this.evaluationFormData = evaluationFormData;
        if (this.version !== 2) {
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
          this.classPerformanceData.forEach((e, i) => {
            e.tips = this.classPerformanceDataZN[i].desArr;
          });
        }
      } else {
        this.type = "update";
        //渲染模板
        this.$set(this.form, "name", res.name);
        this.$set(this.form, "remark", res.desc);
        // 处理能力评估
        if (res.powerAppraiseList === null) {
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
        } else if (
          res.powerAppraiseList.length > this.evaluationFormDataLan.length
        ) {
          let names = [];
          this.evaluationFormDataLan.forEach((item) => {
            names.push(item.name);
          });
          let data = this.collectData(res.powerAppraiseList, "name");
          let lists = this.collectData(this.list, "name");
          let params = [];
          lists.forEach((item, index) => {
            params.push({
              name: item[0].name,
              nameLanguage: item[0].nameLanguage,
            });
          });
          let listParam = [];
          data.forEach((abilityItem, abilityIndex) => {
            let param = {
              name: names[abilityIndex],
              nameLanguage: abilityItem[0].nameLanguage,
              idArr: [],
              itemArr: [],
            };
            abilityItem.sort((a, b) => a.starType - b.starType);
            abilityItem.forEach((item, index) => {
              param[this.starTypeToStarKey[item["starType"]]] =
                item.starTypeDesc;
              param.idArr.push(item.id);
              param.itemArr.push(item.starTypeDesc);
            });
            listParam.push(param);
          });
          if (params.length > listParam.length) {
            listParam.push({
              name: params[params.length - 1],
              nameLanguage: "",
              idArr: [],
              itemArr: [],
            });
          }
          listParam.forEach((e) => {
            params.forEach((p) => {
              if (e.name === p.name) {
                e.nameLanguageZh = p.nameLanguage;
              }
            });
          });

          this.evaluationFormData = listParam;
        } else {
          let names = [];
          this.evaluationFormDataLan.forEach((item) => {
            names.push(item.name);
          });
          let data = this.collectData(res.powerAppraiseList, "name");
          data.forEach((abilityItem, abilityIndex) => {
            let param = {
              name: names[abilityIndex],
              nameLanguage: abilityItem[0].nameLanguage,
              idArr: [],
              itemArr: [],
            };
            abilityItem.sort((a, b) => a.starType - b.starType);
            abilityItem.forEach((item, index) => {
              param[this.starTypeToStarKey[item["starType"]]] =
                item.starTypeDesc;
              param.idArr.push(item.id);
              param.itemArr.push(item.starTypeDesc);
            });
            this.$set(this.evaluationFormData, abilityIndex, param);
          });
        }
        if (this.version !== 2) {
          /* 处理课堂表现反馈 */
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
          this.classPerformanceData.forEach((e, i) => {
            e.tips = this.classPerformanceDataZN[i].desArr;
          });
        }
      }
      if (this.version === 2) {
        this.honorList = res.courseFirstHonorList;
      }
    },
    closeAddAssessmentItem() {
      this.$refs["addAssessmentItem"].resetFields();
    },
    closeEditAssessmentItem() {
      this.dialogFormVisible = false;
      this.$refs["editAssessmentItem"].resetFields();
    },
    changeAsseeementItem() {
      // evaluationFormData
      this.$refs["editAssessmentItem"].validate((val) => {
        if (val) {
          // 修改
          if (this.editAssessmentInfo.idArr.length > 0) {
            let indexToKey = {
              0: "oneStar",
              1: "twoStar",
              2: "threeStar",
              3: "fourStar",
              4: "fiveStar",
            };
            let params = [];
            let nameLanguage = [];
            nameLanguage = this.dataNams;
            this.editAssessmentInfo.idArr.forEach((item, index) => {
              params.push({
                id: item,
                starType: index + 1,
                starTypeDesc: this.editAssessmentInfo[indexToKey[index]],
                nameLanguage: this.editAssessmentInfo.nameLanguage,
              });
            });
            params.forEach((item) => {
              this.evaluationFormData[this.changeAssessmentIndex].nameLanguage =
                this.editAssessmentInfo.nameLanguage;
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
              // this.evaluationFormData[
              //   this.changeAssessmentIndex
              // ].nameLanguage = nams;
            });
            let par = { params, nameLanguage };
            this.editList.push(par);
            this.editAbilityLoading = true;
            this.closeEditAssessmentItem();
            this.editAbilityLoading = false;
          } else {
            // 新增
            this.addList.push({
              name: this.editAssessmentInfo.name,
              nameLanguage: this.editAssessmentInfo.nameLanguage,
              language: this.language,
              starInfos: [
                {
                  starType: 1,
                  starTypeDesc: this.editAssessmentInfo.oneStar,
                },
                {
                  starType: 2,
                  starTypeDesc: this.editAssessmentInfo.twoStar,
                },
                {
                  starType: 3,
                  starTypeDesc: this.editAssessmentInfo.threeStar,
                },
                {
                  starType: 4,
                  starTypeDesc: this.editAssessmentInfo.fourStar,
                },
                {
                  starType: 5,
                  starTypeDesc: this.editAssessmentInfo.fiveStar,
                },
              ],
            });
            this.addMemory[this.changeAssessmentIndex] = {
              name: this.editAssessmentInfo.name,
              nameLanguage: this.editAssessmentInfo.nameLanguage,
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
            };
            this.$set(this.evaluationFormData, this.changeAssessmentIndex, {
              name: this.editAssessmentInfo.name,
              nameLanguage: this.editAssessmentInfo.nameLanguage,
              nameLanguageZh: this.editAssessmentInfo.nameLanguageZh,
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
            this.editAbilityLoading = false;
            this.closeEditAssessmentItem();
          }
        } else {
        }
      });
    },

    edit(data, index) {
      this.changeAssessmentIndex = index;
      this.dataNams = data.nameLanguage;
      this.editAssessmentInfo = JSON.parse(JSON.stringify(data));
      this.editAssessmentInfo.data = JSON.parse(
        JSON.stringify(this.evaluationFormDataLan)
      )[index];
      this.editAssessmentInfo.data.nameLanguageZh = data.nameLanguageZh;
      this.dialogFormVisible = true;
    },
    changelessonShowListObj({ data, index }) {
      this.$set(this.lessonShowListObj, index, data);
    },
    // 保存
    async saveTemplate(operation) {
      this.saveLoading = true;
      // status 1已发布，2待发布, 保存和第一次发布都调这个
      let skillList = [],
        lessonShowList = [],
        params;
      await this.allEdit();
      await this.allAdd();
      let status = this.evaluationFormData.some((item) => {
        return item.idArr.length < 5;
      });
      if (status) {
        this.$notify({
          message: "能力评估存在未填写或填写不规范项，请重新检查填写",
          type: "warning",
        });
        this.saveLoading = false;
        return;
      }
      this.evaluationFormData.forEach((item, index) => {
        skillList = skillList.concat(item.idArr);
      });
      lessonShowList = this.flatten(Object.values(this.lessonShowListObj));
      let missing = lessonShowList.filter((item) =>
        this.originClassPerformanceIdArr.some(
          (resultItem) => resultItem === item
        )
      );
      if (missing.length > 0) {
        this.$notify({
          message: "课堂表现反馈存在未填写或填写不规范项，请重新检查填写",
          type: "warning",
        });
        return;
      }
      operation === "save"
        ? (this.saveLoading = true)
        : (this.publishLoading = true);
      let honorList = null;
      try {
        if (this.version === 2) honorList = await this.saveHonor();
      } catch {
        operation === "save"
          ? (this.saveLoading = false)
          : (this.publishLoading = false);
      }
      params = {
        id: this.templateId,
        name: this.form.name,
        remark: this.form.remark,
        language: this.language,
        skillList: skillList.join(","),
        lessonShowList: lessonShowList.join(","),
        status: operation === "save" ? 2 : 1,
        honorList: honorList,
      };
      this.$Api.unitReportManagement
        .saveMultilingualTemplate(params, this.type)
        .then((res) => {
          if (res.status === 200) {
            operation === "save"
              ? (this.saveLoading = false)
              : (this.publishLoading = false);
            if (res.data.code === 200) {
              // this.templateId = res.data.data;
              window.sessionStorage.setItem("templateId", this.templateId);
              // }
              if (operation === "publish") {
                this.templateStatus = "1";
              }

              this.addList = [];
              this.editList = [];
              this.$notify({
                type: "success",
                message: operation === "publish" ? "发布成功" : "保存成功",
              });
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
    flatten(arr) {
      while (arr.some((item) => Array.isArray(item))) {
        arr = [].concat.apply([], arr);
      }
      return arr;
    },
    collectData(arr, prop) {
      let map = {},
        key;
      arr.forEach((arrItem, arrIndex) => {
        if (key !== arrItem[prop] || !map[arrItem[prop]]) {
          key = arrItem[prop];
          map[arrItem[prop]] = [];
          map[arrItem[prop]].push(arrItem);
        } else {
          map[arrItem[prop]].push(arrItem);
        }
      });
      return Object.values(map);
    },
  },
  components: {
    ClassPerformance,
    MultilingualHonorList,
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
}
</style>
