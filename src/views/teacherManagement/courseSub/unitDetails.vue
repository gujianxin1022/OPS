<template>
  <div class="unit-details">
    <!-- 单元名称 -->
    <el-card shadow="hover" class="unit-name">
      <span class="UnitName">{{ $t("单元名称") }}</span>
      <span>{{ unitName.version }}</span>
      <span>{{ unitName.courseName }}</span>
      <span class="">{{ unitName.unitName }}</span>
    </el-card>
    <el-card shadow="hover">
      <div class="unit-learningPoint">
        <div class="unit">
          {{ $t("单元知识点") }}
        </div>
        <div class="unit-list">
          <el-form ref="form" :model="tableData" label-width="80px">
            <el-form-item :label="$t('序号')" style="text-align:center">
              <div class="skill-flex">
                <div>{{ $t("知识点维度") }}</div>
                <div>{{ $t("知识点内容") }}</div>
                <div>
                  <div>
                    <i
                      class="el-icon-edit"
                      @click="all({ type: 'modify', ids: '1' })"
                    ></i>
                  </div>
                  <div v-if="this.listKnowledge == true">
                    <el-button
                      type="primary"
                      @click="all({ type: 'update', ids: '1' })"
                    >
                      <span v-show="this.tableupdata == 1">{{
                        $t("保存发布")
                      }}</span>
                      <span v-show="this.tableupdata == 2">{{
                        $t("更新发布")
                      }}</span>
                    </el-button>
                    <el-button
                      type="primary"
                      @click="all({ type: 'preserve', ids: '1' })"
                      >{{ $t("保存") }}</el-button
                    >
                    <el-button @click="all({ type: 'cancel', ids: '1' })">{{
                      $t("取消")
                    }}</el-button>
                  </div>
                  <div v-else></div>
                </div>
              </div>
            </el-form-item>
            <div v-show="this.listKnowledge == false">
              <el-form-item
                :label="index + 1"
                v-for="(item, index) in tableData.courseUnitKnowledgePoints"
                :key="item.id"
              >
                <div class="tableData-list">
                  <div>
                    <el-input
                      v-model="item.knowledgeTitle"
                      placeholder="请输入内容"
                      maxlength="30"
                      show-word-limit
                      disabled
                    ></el-input>
                  </div>
                  <div>
                    <el-input
                      class="textarea"
                      type="textarea"
                      placeholder="请输入内容"
                      v-model="item.knowledgeContent"
                      show-word-limit
                      :autosize="{ minRows: 5 }"
                      maxlength="1000"
                      disabled
                    >
                    </el-input>
                  </div>
                </div>
              </el-form-item>
            </div>
            <div v-show="this.listKnowledge == true">
              <el-form-item
                :label="index + 1"
                v-for="(item, index) in tableData.courseUnitKnowledgePoints"
                :key="item.id"
              >
                <div class="tableData-list">
                  <div>
                    <el-input
                      v-model="item.knowledgeTitle"
                      placeholder="请输入内容"
                      maxlength="40"
                    ></el-input>
                    <div
                      v-show="item.knowledgeTitle.length >= '31'"
                      class="sty"
                    >
                      只能输入30个字
                    </div>
                  </div>
                  <div>
                    <el-input
                      class="textarea"
                      type="textarea"
                      placeholder="请输入内容"
                      v-model="item.knowledgeContent"
                      :autosize="{ minRows: 5 }"
                      maxlength="1020"
                      @blur.native.capture="
                        testUser(item.knowledgeContent, index)
                      "
                    >
                    </el-input>
                    <div v-show="sub(item.knowledgeContent)" class="sty">
                      只能输入1000个字
                    </div>
                  </div>
                </div>
              </el-form-item>
            </div>
            <el-form-item v-show="this.listKnowledge == true">
              <div
                v-show="this.tableData.courseUnitKnowledgePoints.length >= 5"
                class="unit-list-delete"
                @click="all({ type: 'delete', ids: '1' })"
              >
                <span style="cursor:pointer"> {{ $t("删除") }}</span>
              </div>
              <div
                v-show="this.tableData.courseUnitKnowledgePoints.length <= 9"
                class="unit-list-add"
                @click="all({ type: 'add', ids: '1' })"
              >
                <img src="../../../assets/add_child.png" alt="" />
                <div>
                  <span style="cursor:pointer"> {{ $t("继续添加") }}</span>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
    <el-card shadow="hover">
      <div class="unit-learningPoint">
        <div class="unit">
          {{ $t("单元技能") }}
        </div>
        <div class="unit-list">
          <el-form ref="skillList" :model="skillList" label-width="80px">
            <el-form-item :label="$t('序号')" style="text-align:center">
              <div class="skill-flex">
                <div>
                  {{ $t("单元技能维度") }}
                </div>
                <div>
                  {{ $t("单元技能陈述") }}
                </div>
                <div>
                  <div>
                    <i
                      class="el-icon-edit"
                      @click="all({ type: 'modify', ids: '2' })"
                    ></i>
                  </div>
                  <div v-show="this.listSkill == true">
                    <el-button
                      type="primary"
                      @click="all({ type: 'update', ids: '2' })"
                    >
                      <!-- {{ skillupdata | skltext }}发布 -->
                      <span v-show="this.skillupdata == 1">{{
                        $t("保存发布")
                      }}</span>
                      <span v-show="this.skillupdata == 2">{{
                        $t("更新发布")
                      }}</span>
                    </el-button>
                    <el-button
                      type="primary"
                      @click="all({ type: 'preserve', ids: '2' })"
                    >
                      {{ $t("保存") }}
                    </el-button>
                    <el-button @click="all({ type: 'cancel', ids: '2' })">
                      {{ $t("取消") }}</el-button
                    >
                  </div>
                  <div v-show="this.listSkill == false"></div>
                </div>
              </div>
            </el-form-item>
            <div v-show="this.listSkill == false">
              <el-form-item
                :label="index + 1"
                v-for="(item, index) in skillList.courseUnitSkills"
                :key="item.id"
              >
                <div class="tableData-list">
                  <div>
                    <el-input
                      v-model="item.skillsTitle"
                      placeholder="请输入内容"
                      maxlength="30"
                      show-word-limit
                      disabled
                    ></el-input>
                  </div>
                  <div>
                    <el-input
                      class="textarea"
                      type="textarea"
                      placeholder="请输入内容"
                      v-model="item.skillContent"
                      show-word-limit
                      :autosize="{ minRows: 5 }"
                      maxlength="1000"
                      disabled
                    >
                    </el-input>
                  </div>
                </div>
              </el-form-item>
            </div>
            <div v-show="this.listSkill == true">
              <el-form-item
                :label="index + 1"
                v-for="(item, index) in skillList.courseUnitSkills"
                :key="item.id"
              >
                <div class="tableData-list">
                  <div>
                    <el-input
                      v-model="item.skillsTitle"
                      placeholder="请输入内容"
                      maxlength="40"
                    ></el-input>
                    <div v-show="item.skillsTitle.length >= 31" class="sty">
                      只能输入30个字
                    </div>
                  </div>
                  <div>
                    <el-input
                      class="textarea"
                      type="textarea"
                      placeholder="请输入内容"
                      v-model="item.skillContent"
                      :autosize="{ minRows: 5 }"
                      maxlength="1020"
                      @blur.native.capture="testSkill(item.skillContent, index)"
                    >
                    </el-input>
                    <div v-show="sub(item.skillContent)" class="sty">
                      只能输入1000个字
                    </div>
                  </div>
                </div>
              </el-form-item>
            </div>
            <el-form-item v-show="this.listSkill == true">
              <div
                v-show="this.skillList.courseUnitSkills.length >= 5"
                class="unit-list-delete"
                @click="all({ type: 'delete', ids: '2' })"
              >
                <span style="cursor:pointer">{{ $t("删除") }}</span>
              </div>
              <div
                v-show="this.skillList.courseUnitSkills.length <= 9"
                class="unit-list-add"
                @click="all({ type: 'add', ids: '2' })"
              >
                <img src="../../../assets/add_child.png" alt="" />
                <div>
                  <span style="cursor:pointer"> {{ $t("继续添加") }}</span>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { Tree } from "element-ui";
export default {
  name: "unitDetails",
  data() {
    return {
      tableData: {
        courseUnitKnowledgePoints: [
          {
            unitId: null,
            sortNo: 1,
            knowledgeTitle: "",
            status: 0,
            knowledgeContent: [],
            id: null
          },
          {
            unitId: null,
            sortNo: 2,
            knowledgeTitle: "",
            status: 0,
            knowledgeContent: [],
            id: null
          },
          {
            unitId: null,
            sortNo: 3,
            knowledgeTitle: "",
            status: 0,
            knowledgeContent: [],
            id: null
          },
          {
            unitId: null,
            sortNo: 4,
            knowledgeTitle: "",
            status: 0,
            knowledgeContent: [],
            id: null
          }
        ],
        courseUnitKnowledgePointsIds: [],
        unitId: null
      },
      skillList: {
        courseUnitSkills: [
          {
            unitId: null,
            sortNo: 1,
            skillsTitle: "",
            status: 0,
            skillContent: [],
            id: null
          },
          {
            unitId: null,
            sortNo: 2,
            skillsTitle: "",
            status: 0,
            skillContent: [],
            id: null
          },
          {
            unitId: null,
            sortNo: 3,
            skillsTitle: "",
            status: 0,
            skillContent: [],
            id: null
          },
          {
            unitId: null,
            sortNo: 4,
            skillsTitle: "",
            status: 0,
            skillContent: [],
            id: null
          }
        ],
        courseUnitSkillsIds: [],
        unitId: null
      },
      listKnowledge: false,
      listSkill: false,
      formlist: [],
      Skilllist: [],
      unitId: null,
      sortNoid: null,
      SkillNoid: null,
      unitList: [],
      unitName: {
        version: "",
        courseName: "",
        unitName: ""
      },
      userList: [],
      tableupdata: 1,
      skillupdata: 1
    };
  },
  computed: {},
  mounted() {
    this.getLearningPoint();
    this.getskill();
  },
  methods: {
    sub(text) {
      // console.log(text)
      if (text == null) {
        return false;
      } else {
        if (text.length >= "1001") {
          return true;
        } else {
          return false;
        }
      }
    },
    csss(id) {
      if (id == 1) {
        this.tableData.courseUnitKnowledgePoints.forEach(item => {
          if (item.knowledgeContent == null) {
            return;
          } else {
            for (let i = 0; i < item.knowledgeContent.length; i++) {
              let arr = item.knowledgeContent[i].replace(/^\s*|\s*$/g, "");
              if (arr == "") {
                item.knowledgeContent.splice(i, 1);
              }
            }
            let text = item.knowledgeContent.join("♠");
            var reg = /[♠]/g;
            item.knowledgeContent = text.replace(reg, "\n");
          }
        });
      } else {
        this.skillList.courseUnitSkills.forEach(item => {
          if (item.skillContent == null) {
            return;
          } else {
            for (let i = 0; i < item.skillContent.length; i++) {
              let arr = item.skillContent[i].replace(/^\s*|\s*$/g, "");
              if (arr == "") {
                item.skillContent.splice(i, 1);
              }
            }
            let text = item.skillContent.join("♠");
            var reg = /[♠]/g;
            item.skillContent = text.replace(reg, "\n");
          }
        });
      }
    },
    addlist(noe, len) {
      for (let i = noe; i < len; i++) {
        this.tableData.courseUnitKnowledgePoints.push({
          unitId: this.unitId,
          sortNo: i + 1,
          knowledgeTitle: "",
          status: 0,
          knowledgeContent: [],
          id: null
        });
      }
    },
    addskilist(noe, len) {
      for (let i = noe; i < len; i++) {
        this.skillList.courseUnitSkills.push({
          unitId: this.unitId,
          sortNo: i + 1,
          skillsTitle: "",
          status: 0,
          skillContent: [],
          id: null
        });
      }
    },
    getLearningPoint() {
      this.$Api.teacherManagement
        .getLearningPointEcho(this.unitId)
        .then(res => {
          if (res.status == 200) {
            // console.log(res.data.data);
            if (res.data.data.length == 0) {
              this.tableData.courseUnitKnowledgePoints = res.data.data;
              this.addlist(0, 4);
            } else if (res.data.data.length == 1) {
              this.tableData.courseUnitKnowledgePoints = res.data.data;
              this.addlist(1, 4);
              this.tableupdata = 2;
            } else if (res.data.data.length == 2) {
              this.tableData.courseUnitKnowledgePoints = res.data.data;
              this.addlist(2, 4);
              this.tableupdata = 2;
            } else if (res.data.data.length == 3) {
              this.tableData.courseUnitKnowledgePoints = res.data.data;
              this.addlist(3, 4);
              this.tableupdata = 2;
            } else {
              this.tableData.courseUnitKnowledgePoints = res.data.data;
              this.tableupdata = 2;
            }
            for (
              let i = 0;
              i < this.tableData.courseUnitKnowledgePoints.length;
              i++
            ) {
              this.formlist[i] = this.tableData.courseUnitKnowledgePoints[
                i
              ].knowledgeContent;
            }
            this.csss(1);
            // this.func();
          }
        });
    },
    getskill() {
      this.$Api.teacherManagement.getskillEcho(this.unitId).then(res => {
        if (res.status == 200) {
          if (res.data.data.length == 0) {
            this.skillList.courseUnitSkills = res.data.data;
            this.addskilist(0, 4);
          } else if (res.data.data.length == 1) {
            this.skillList.courseUnitSkills = res.data.data;
            this.addskilist(1, 4);
            this.skillupdata = 2;
          } else if (res.data.data.length == 2) {
            this.skillList.courseUnitSkills = res.data.data;
            this.addskilist(2, 4);
            this.skillupdata = 2;
          } else if (res.data.data.length == 3) {
            this.skillList.courseUnitSkills = res.data.data;
            this.addskilist(3, 4);
            this.skillupdata = 2;
          } else {
            this.skillList.courseUnitSkills = res.data.data;
            this.skillupdata = 2;
          }
          for (let i = 0; i < this.skillList.courseUnitSkills.length; i++) {
            this.Skilllist[i] = this.skillList.courseUnitSkills[i].skillContent;
          }
          this.csss(2);
        }
      });
    },
    testUser(val, index) {
      if (val == null) {
        return;
      } else {
        let form = val.split(/[(\r\n)\r\n]+/);
        for (let i = 0; i <= form.length; i++) {
          if (form.length == i) {
            if (form[i - 1] == "") {
              form.splice(i - 1, 1);
            }
          }
        }
        this.formlist[index] = form;
      }
    },
    testSkill(val, index) {
      if (val == null) {
        return;
      } else {
        let form = val.split(/[(\r\n)\r\n]+/);
        for (let i = 0; i <= form.length; i++) {
          if (form.length == i) {
            if (form[i - 1] == "") {
              form.splice(i - 1, 1);
            }
          }
        }
        this.Skilllist[index] = form;
      }
    },
    all(row) {
      switch (row.type) {
        case "update":
          if (row.ids == "1") {
            var id = 0;
            this.tableData.courseUnitKnowledgePoints.forEach(item => {
              if (item.knowledgeTitle == "" || item.knowledgeTitle == " ") {
                if (item.id == null) {
                  id++;
                  if (id == this.tableData.courseUnitKnowledgePoints.length) {
                    this.tableData.courseUnitKnowledgePointsIds = [];
                  }
                } else {
                  this.tableData.courseUnitKnowledgePointsIds.push(item.id);
                }
              }
            });
            var ls = false;
            var count = 0;
            if (ls == false) {
              for (
                let i = 0;
                i < this.tableData.courseUnitKnowledgePoints.length;
                i++
              ) {
                if (
                  this.tableData.courseUnitKnowledgePoints[i].knowledgeTitle ==
                    "" &&
                  this.tableData.courseUnitKnowledgePoints[i]
                    .knowledgeContent != []
                ) {
                  this.$message.warning("知识点维度没有输入");
                  return;
                } else {
                  if (
                    this.tableData.courseUnitKnowledgePoints[i].knowledgeContent
                      .length >= "1001" ||
                    this.tableData.courseUnitKnowledgePoints[i].knowledgeTitle
                      .length >= "31"
                  ) {
                    this.$message.error("请正确填写");
                    return;
                  } else {
                    // if (this.formlist[i] == null) {
                    //   this.formlist[i] == [];
                    // }
                    this.tableData.courseUnitKnowledgePoints[
                      i
                    ].knowledgeContent = [];
                    this.tableData.courseUnitKnowledgePoints[
                      i
                    ].knowledgeContent = this.formlist[i];
                    ls = true;
                  }
                }
              }
            }
            if (ls == true) {
              // this.tableData.courseUnitKnowledgePoints.forEach(item => {
              //   if (item.knowledgeContent == null) {
              //     item.knowledgeContent = [];
              //   }
              //   console.log(Array.isArray(item.knowledgeContent));
              // });
              // console.log(this.tableData.courseUnitKnowledgePoints);
              this.tableData.courseUnitKnowledgePoints.forEach(item => {
                if (item.knowledgeTitle == "") {
                  count++;
                  if (
                    count == this.tableData.courseUnitKnowledgePoints.length
                  ) {
                    this.tableData.courseUnitKnowledgePoints = [];
                  }
                }
              });
              this.$Api.teacherManagement
                .getLearningPointIssue(this.tableData)
                .then(res => {
                  if (res.data.code == 200) {
                    this.$message.success("发布成功");
                    this.getLearningPoint();
                  }
                })
                .catch(error => {
                  this.$message.error("发布失败请检查网络");
                });

              this.listKnowledge = false;
            }
          } else {
            var id = 0;
            this.skillList.courseUnitSkills.forEach(item => {
              if (item.skillsTitle == "" || item.skillsTitle == " ") {
                if (item.id == null) {
                  id++;
                  if (id == this.skillList.courseUnitSkills.length) {
                    this.skillList.courseUnitSkillsIds = [];
                  }
                } else {
                  this.skillList.courseUnitSkillsIds.push(item.id);
                }
              }
            });
            var ls = false;
            var count = 0;
            if (ls == false) {
              for (let i = 0; i < this.skillList.courseUnitSkills.length; i++) {
                if (
                  this.skillList.courseUnitSkills[i].skillsTitle == "" &&
                  this.skillList.courseUnitSkills[i].skillContent != []
                ) {
                  this.$message.warning("单元技能维度没有输入");
                  return;
                } else {
                  if (
                    this.skillList.courseUnitSkills[i].skillsTitle.length >=
                      "31" ||
                    this.skillList.courseUnitSkills[i].skillContent.length >=
                      "1001"
                  ) {
                    this.$message.error("请正确填写");
                    return;
                  } else {
                    // if (this.Skilllist[i] == null) {
                    //   this.Skilllist.splice(i, 1);
                    // }
                    this.skillList.courseUnitSkills[i].skillContent = [];
                    this.skillList.courseUnitSkills[i].skillContent = this.Skilllist[i];
                    ls = true;
                  }
                }
              }
            }
            if (ls == true) {
              this.skillList.courseUnitSkills.forEach(item => {
                if (item.skillsTitle == "") {
                  count++;
                  if (count == this.skillList.courseUnitSkills.length) {
                    this.skillList.courseUnitSkills = [];
                  }
                }
              });
              this.$Api.teacherManagement
                .getskillIssue(this.skillList)
                .then(res => {
                  // console.log(res);
                  if (res.data.code == 200) {
                    this.$message.success("发布成功");
                    this.getskill();
                  }
                })
                .catch(error => {
                  this.$message.error("发布失败请检查网络");
                });
              this.skillupdata = 2;
              this.listSkill = false;
            }
          }
          break;
        case "preserve":
          if (row.ids == "1") {
            this.tableData.courseUnitKnowledgePoints.forEach(item => {
              if (item.knowledgeTitle == "" || item.knowledgeTitle == " ") {
                if (item.id == null) {
                } else {
                  // console.log(item.id);
                  this.tableData.courseUnitKnowledgePointsIds.push(item.id);
                }
              }
            });
            var ls = false;
            var count = 0;
            if (ls == false) {
              for (
                let i = 0;
                i < this.tableData.courseUnitKnowledgePoints.length;
                i++
              ) {
                if (
                  this.tableData.courseUnitKnowledgePoints[i].knowledgeTitle ==
                    "" &&
                  this.tableData.courseUnitKnowledgePoints[i]
                    .knowledgeContent != []
                ) {
                  this.$message.warning("知识点维度没有输入");
                  return;
                } else {
                  if (
                    this.tableData.courseUnitKnowledgePoints[i].knowledgeContent
                      .length >= "1001" ||
                    this.tableData.courseUnitKnowledgePoints[i].knowledgeTitle
                      .length >= "31"
                  ) {
                    this.$message.error("请正确填写");
                    return;
                  } else {
                    // if (this.formlist[i] == null || this.formlist[i] == "") {
                    //   this.formlist.splice(i, 1);
                    // }
                    this.tableData.courseUnitKnowledgePoints[
                      i
                    ].knowledgeContent = [];
                    this.tableData.courseUnitKnowledgePoints[
                      i
                    ].knowledgeContent = this.formlist[i];
                    ls = true;
                  }
                }
              }
            }
            if (ls == true) {
              this.tableData.courseUnitKnowledgePoints.forEach(item => {
                if (item.knowledgeTitle == "" || item.knowledgeTitle == " ") {
                  count++;
                  if (
                    count == this.tableData.courseUnitKnowledgePoints.length
                  ) {
                    // console.log(count);
                    this.tableData.courseUnitKnowledgePoints = [];
                  }
                }
              });
              this.$Api.teacherManagement
                .getLearningPointPreserve(this.tableData)
                .then(res => {
                  if (res.data.code == 200) {
                    this.$message.success("保存成功");
                    this.getLearningPoint();
                  }
                })
                .catch(error => {
                  this.$message.error("保存失败请检查网络");
                });
              this.listKnowledge = false;
            }
          } else {
            this.skillList.courseUnitSkills.forEach(item => {
              if (item.skillsTitle == "" || item.skillsTitle == " ") {
                // count++;
                if (item.id == null) {
                  // console.log(item);
                } else {
                  // console.log(item.id);
                  this.skillList.courseUnitSkillsIds.push(item.id);
                }
              }
            });
            var ls = false;
            var count = 0;
            if (ls == false) {
              for (let i = 0; i < this.skillList.courseUnitSkills.length; i++) {
                if (
                  this.skillList.courseUnitSkills[i].skillsTitle == "" &&
                  this.skillList.courseUnitSkills[i].skillContent != []
                ) {
                  this.$message.warning("单元技能维度没有输入");
                  return;
                } else {
                  if (
                    this.skillList.courseUnitSkills[i].skillsTitle.length >=
                      "31" ||
                    this.skillList.courseUnitSkills[i].skillContent.length >=
                      "1001"
                  ) {
                    this.$message.error("请正确填写");
                    return;
                  } else {
                    // if (this.Skilllist[i] == null) {
                    //   this.Skilllist.splice(i, 1);
                    // }
                    this.skillList.courseUnitSkills[i].skillContent = [];
                    this.skillList.courseUnitSkills[
                      i
                    ].skillContent = this.Skilllist[i];
                    ls = true;
                  }
                }
              }
            }
            if (ls == true) {
              this.skillList.courseUnitSkills.forEach(item => {
                if (item.skillsTitle == "") {
                  count++;
                  if (count == this.skillList.courseUnitSkills.length) {
                    this.skillList.courseUnitSkills = [];
                  }
                }
              });
              this.$Api.teacherManagement
                .getskillPreserve(this.skillList)
                .then(res => {
                  if (res.data.code == 200) {
                    this.$message.success("保存成功");
                    this.getskill();
                  }
                })
                .catch(error => {
                  this.$message.error("保存失败请检查网络");
                });
              this.listSkill = false;
            }
          }
          break;
        case "cancel":
          if (row.ids == "1") {
            this.listKnowledge = false;
            this.getLearningPoint();
          } else {
            this.listSkill = false;
            this.getskill();
          }
          break;
        case "modify":
          if (row.ids == "1") {
            this.listKnowledge = true;
          } else {
            this.listSkill = true;
          }
          break;
        case "delete":
          if (row.ids == "1") {
            for (
              let i = 0;
              i < this.tableData.courseUnitKnowledgePoints.length;
              i++
            ) {
              if (this.tableData.courseUnitKnowledgePoints.length - 1 == i) {
                if (this.tableData.courseUnitKnowledgePoints[i].id == null) {
                  this.tableData.courseUnitKnowledgePoints.pop();
                } else {
                  this.tableData.courseUnitKnowledgePointsIds.push(
                    this.tableData.courseUnitKnowledgePoints[i].id
                  );
                  this.tableData.courseUnitKnowledgePoints.pop();
                }
              }
            }
          } else {
            for (let i = 0; i < this.skillList.courseUnitSkills.length; i++) {
              if (this.skillList.courseUnitSkills.length - 1 == i) {
                if (this.skillList.courseUnitSkills[i].id == null) {
                  this.skillList.courseUnitSkills.pop();
                } else {
                  this.skillList.courseUnitSkillsIds.push(
                    this.skillList.courseUnitSkills[i].id
                  );
                  this.skillList.courseUnitSkills.pop();
                }
              }
            }
          }
          break;
        case "add":
          if (row.ids == "1") {
            for (
              let i = 0;
              i < this.tableData.courseUnitKnowledgePoints.length;
              i++
            ) {
              if (this.tableData.courseUnitKnowledgePoints.length - 1 == i) {
                this.sortNoid = i + 1;
              }
            }
            this.tableData.courseUnitKnowledgePoints.push({
              unitId: this.unitId,
              sortNo: this.sortNoid,
              knowledgeTitle: "",
              status: 0,
              knowledgeContent: [],
              id: null
            });
          } else {
            for (let i = 0; i < this.skillList.courseUnitSkills.length; i++) {
              if (this.skillList.courseUnitSkills.length - 1 == i) {
                this.SkillNoid = i + 1;
              }
            }
            this.skillList.courseUnitSkills.push({
              unitId: this.unitId,
              sortNo: this.SkillNoid,
              skillsTitle: "",
              status: 0,
              skillContent: [],
              id: null
            });
          }
          break;
      }
    }
  },
  created() {
    // console.log(this.$route.query);
    this.unitId = this.$route.query.unitId;
    this.tableData.unitId = this.$route.query.unitId;
    this.skillList.unitId = this.$route.query.unitId;
    this.$Api.base.courseEdition().then(res => {
      if (res.status === 200) {
        this.unitList = res.data.data;
        this.unitList.forEach(item => {
          if (this.$route.query.editionId == item.editionId) {
            this.unitName.version = item.editionNameZh;
            item.courseLevelInfoList.forEach(ite => {
              if (this.$route.query.levelId == ite.courseLevel) {
                this.unitName.courseName = ite.courseName;
                ite.courseUnitList.forEach(itm => {
                  if (itm.id == this.$route.query.unitId) {
                    this.unitName.unitName = "Unit" + itm.unitNo;
                  }
                });
              }
            });
          }
        });
      }
    });
    // console.log(this.unitName);
  },
  filters: {
    text(val) {
      if (val == 1) {
        return "保存";
      } else {
        return "更新";
      }
    },
    skltext(val) {
      if (val == 1) {
        return "保存";
      } else {
        return "更新";
      }
    }
  }
};
</script>
<style lang="scss">
.el-table--enable-row-transition .el-table__body td {
  vertical-align: top;
}
.el-form-item__label {
  text-align: center;
}
</style>
<style scoped lang="scss">
.unit-details {
  padding: 10px;
  width: 100%;
  .unit-learningPoint {
    width: 100%;
    display: flex;
  }
  .unit {
    width: 15%;
    font-weight: bold;
    line-height: 500px;
    text-align: center;
  }
  .unit-list {
    width: 80%;
    .el-form {
      width: 100%;
      .skill-flex {
        display: flex;
        div:nth-child(1) {
          width: 20%;
          color: #000;
          font-weight: bold;
        }
        div:nth-child(2) {
          color: #000;
          width: 30%;
          font-weight: bold;
        }
        div:nth-child(3) {
          width: 50%;
          div {
            text-align: right;
          }
          div:nth-child(1) {
            width: 100%;
            img {
              width: 30px;
              height: 30px;
            }
          }
          div:nth-child(2) {
            width: 100%;

            .el-button:nth-child(1) {
              width: 120px;
              background-color: #7b86e6;
            }
            .el-button:nth-child(2) {
              width: 80px;
              background-color: #7b86e6;
            }
            .el-button:nth-child(3) {
              width: 80px;
            }
          }
        }
      }
      .unit-list-delete {

        width: 50px;
        float: right;
        text-align: right;
        font-size: 12px;
        color: #1f39f4;
        font-weight: bold;
      }
      .unit-list-add {
        text-align: center;
        width: 140px;
        height: 30px;
        line-height: 30px;
        display: flex;
        margin: 20px 0 0 60%;
      }
    }
  }
}

img {
  width: 30px;
  height: 30px;
}

.el-card {
  margin: 0 0 10px 0;
}
.unit-name {
  .UnitName {
    margin-right: 20px;
  }
  span {
    margin-right: 5px;
  }
}

.el-button {
  width: 120px;
}

.tableData-list {
  display: flex;
  div:nth-child(1) {
    width: 20%;
    .el-input {
      width: 100%;
    }
  }
  div:nth-child(2) {
    width: 70%;
    margin: 0 0 0 10%;
    .textarea {
      width: 100%;
    }
  }
}
.sty {
  // text-align: center;
  color: red;
  font-weight: bold;
}
</style>
