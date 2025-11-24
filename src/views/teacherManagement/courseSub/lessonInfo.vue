<template>
  <div class="lesson-info-wrap">
    <div class="top-course-select-wrap">
      <el-select
        style="width:130px"
        v-model="courseEditionId"
        :placeholder="$t('版本')"
        @change="changeEdition"
      >
        <el-option
          v-for="item in editionListData"
          :label="currentLang==='en'?item.editionNameEn:item.editionNameZh"
          :value="item.editionId"
          :key="item.editionId"
        ></el-option>
      </el-select>
      <el-select
        style="width:100px"
        v-model="courseLevel"
        :placeholder="$t('级别')"
        @change="changeLevel"
      >
        <el-option
          v-for="item in levelList"
          :label="item.courseName"
          :value="item.courseLevel"
          :key="item.courseName"
        ></el-option>
      </el-select>
      <el-select
        style="width:100px"
        v-model="unitNo"
        :placeholder="$t('单元')"
        @change="changeUnit"
      >
        <el-option
          v-for="item in unitList"
          :key="item.id"
          :label="strUnit(item.unitNo)"
          :value="item.unitNo"
        ></el-option>
      </el-select>
      <el-button-group>
        <el-button
          @click="changeLessonId(item.value)"
          v-for="item in lessonList"
          :key="item.value"
          :type="item.value == lessonId ? 'primary' : ''"
          >{{ item.label }}</el-button
        >
      </el-button-group>
    </div>
    <div class="lesson-info mt10" v-if="lessonId != ''" v-loading="infoLoading">
      <el-card shadow="hover" class="box-card">
        <div class="lesson-info-in">
          <!-- <div class="edit-info-button">
            <i
              class="el-icon-edit"
              @click="handleEditLessonInfo"
              v-if="!editInfoFlag"
            ></i>
            <el-button
              v-if="editInfoFlag && !sureChangeInfoLoading"
              @click="cancelEditInfo"
              >{{ $t("取消") }}</el-button
            >
            <el-button
              v-if="editInfoFlag"
              :loading="sureChangeInfoLoading"
              @click="changeLessonInfo"
              >{{ $t("保存") }}</el-button
            >
          </div> -->
          <ul>
            <li>
              <span class="label">{{ $t("课程名称") }}</span>
              <span v-if="!editInfoFlag" class="value">{{
                lessonInfo.name ? lessonInfo.name : "---"
              }}</span>
              <el-input
                v-if="editInfoFlag"
                style="width:40%"
                v-model="editCopyData.name"
              ></el-input>
            </li>
            <li>
              <span class="label">{{ $t("课程海报") }}</span>
              <span class="value">
                <img
                  v-if="lessonInfo.pictureUrl && !editInfoFlag"
                  :src="lessonInfo.pictureUrl"
                  alt=""
                />
                <span v-if="!editInfoFlag && !lessonInfo.pictureUrl">---</span>
                <el-upload
                  v-if="editInfoFlag"
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :http-request="uploadImage"
                >
                  <img
                    v-if="editCopyData.pictureUrl"
                    :src="editCopyData.pictureUrl"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </span>
            </li>
            <li>
              <span class="label">{{ $t("课程描述") }}</span>
              <span v-if="!editInfoFlag" class="value">{{
                lessonInfo.description ? lessonInfo.description : "---"
              }}</span>
              <el-input
                v-else
                style="width:40%"
                v-model="editCopyData.description"
              ></el-input>
            </li>
          </ul>
        </div>
      </el-card>
      <el-card shadow="hover" class="box-card mt10">
        <div class="lesson-info-in">
          <div class="edit-info-button">
            <i
              class="el-icon-edit"
              v-if="!editKnowledgeFlag"
              @click="editKnowledgeFlag = true"
            ></i>
            <el-button
              v-if="editKnowledgeFlag && !sureChangeKnowledgeLoading"
              @click="cancelEditKnowledge"
              >{{ $t("取消") }}</el-button
            >
            <el-button
              v-if="editKnowledgeFlag"
              @click="changeKnowledge"
              :loading="sureChangeKnowledgeLoading"
              >{{ $t("保存") }}</el-button
            >
          </div>
          <ul>
            <li>
              <span class="label">{{ $t("课程知识点") }}</span>
              <ol v-if="!editKnowledgeFlag && lessonInfo.courseKnowledgePoints">
                <li
                  style="margin:3px 0;"
                  v-for="(item, index) in lessonInfo.courseKnowledgePoints"
                  :key="index"
                >
                  {{ item.knowledgePoint }}
                </li>
              </ol>
              <span
                v-if="!editKnowledgeFlag && !lessonInfo.courseKnowledgePoints"
                >---</span
              >
              <el-input
                style="width:50%"
                v-if="editKnowledgeFlag"
                type="textarea"
                maxlength="500"
                show-word-limit
                :rows="7"
                v-model="editCopyData.courseKnowledgePointsStr"
              >
              </el-input>
            </li>
          </ul>
        </div>
      </el-card>
      <el-card shadow="hover" class="box-card mt10">
        <ul>
          <li>
            <span class="label">{{ $t("创建人") }}</span>
            <span class="value">{{ lessonInfo.createUserId }}</span>
          </li>
          <li>
            <span class="label">{{ $t("创建时间") }}</span>
            <span class="value">{{
              DateTimeUtils.dateClockTime(lessonInfo.createTime)
            }}</span>
          </li>
          <li>
            <span class="label">{{ $t("最近修改人") }}</span>
            <span class="value">{{ lessonInfo.updateUserName }}</span>
          </li>
          <li>
            <span class="label">{{ $t("最近修改时间") }}</span>
            <span class="value">{{
              DateTimeUtils.dateClockTime(lessonInfo.updateTime)
            }}</span>
          </li>
        </ul>
      </el-card>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "lessonInfo",
  data() {
    return {
      infoLoading: false,
      screenData: {
        courseEditionId: "",
        courseLevel: "",
        unitNo: "",
        lessonId: ""
      },
      lessonInfo: {},
      editCopyData: {},
      courseEditionId: "",
      courseLevel: "",
      unitNo: "",
      lessonId: "",
      levelList: [],
      unitList: [],
      lessonList: [],
      editionListData: [],
      editInfoFlag: false,
      sureChangeInfoLoading: false,
      editKnowledgeFlag: false,
      sureChangeKnowledgeLoading: false
    };
  },
  computed: {
    ...mapGetters(["currentLang"])
  },
  methods: {
    changeKnowledge() {
      this.sureChangeKnowledgeLoading = true;
      let { courseKnowledgePointsStr, id } = this.editCopyData;
      let params = {
        knowledgePointList: courseKnowledgePointsStr.split("\n"),
        lessonId: id
      };
      this.$Api.teacherManagement
        .updateCourseKnowledgePoint(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.getLessonInfo();
            this.cancelEditKnowledge();
            this.$notify({
              type: "success",
              message: this.$t("更新成功")
            });
          }
          this.sureChangeKnowledgeLoading = false;
        });
    },
    cancelEditKnowledge() {
      this.editKnowledgeFlag = false;
      this.editCopyData = JSON.parse(JSON.stringify(this.lessonInfo));
    },
    cancelEditInfo() {
      this.editInfoFlag = false;
      this.editCopyData = JSON.parse(JSON.stringify(this.lessonInfo));
    },
    changeLessonInfo() {
      this.sureChangeInfoLoading = true;
      let { id, description, name, pictureUrl } = this.editCopyData;
      let params = {
        lessonId: id,
        description,
        name,
        pictureUrl
      };
      this.$Api.teacherManagement
        .updateCourseInfo(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.getLessonInfo();
            this.$notify({
              message: this.$t("修改成功"),
              type: "success"
            });
            this.cancelEditInfo();
          }
          this.sureChangeInfoLoading = false;
        });
    },
    uploadImage(e) {
      let fm = new FormData();
      fm.append("category", "bookthumbnail");
      fm.append("file", e.file);
      this.$Api.base.uploadImage(fm).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.editCopyData.pictureUrl = data.data;
        }
      });
    },
    handleEditLessonInfo() {
      this.editInfoFlag = true;
    },
    changeEdition() {
      this.levelList = [];
      this.unitList = [];
      this.lessonList = [];
      this.courseLevel = "";
      this.unitNo = "";
      this.lessonId = "";
      this.editionListData.forEach(item => {
        if (item.editionId == this.courseEditionId) {
          this.levelList = item.courseLevelInfoList;
        }
      });
    },
    changeLevel() {
      this.unitList = [];
      this.lessonList = [];
      this.unitNo = "";
      this.lessonId = "";
      this.levelList.forEach(item => {
        if (item.courseLevel == this.courseLevel) {
          this.unitList = item.courseUnitList;
        }
      });
    },
    changeUnit() {
      this.lessonList = [];
      this.lessonId = "";
      this.$Api.base
        .getLessonList(this.courseEditionId, this.courseLevel, this.unitNo)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200 && data.data.length != 0) {
            data.data.forEach(item => {
              item.label = `lesson ${item.lessonNo}`;
              item.value = item.id;
            });
            this.lessonList = data.data;
          } else {
            this.lessonList = [];
          }
        });
    },
    changeLessonId(lessonId) {
      this.lessonId = lessonId;
      this.getLessonInfo();
    },
    strUnit(unit) {
      return `unit${unit}`;
    },
    getLessonInfo() {
      this.infoLoading = true;
      this.$Api.teacherManagement
        .getLessonInfo(this.lessonId)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.lessonInfo = data.data;
            let str = "";
            if (this.lessonInfo.courseKnowledgePoints) {
              this.lessonInfo.courseKnowledgePoints.forEach(item => {
                str += `${item.knowledgePoint}\n`;
              });
            }
            this.lessonInfo.courseKnowledgePointsStr = str;
            this.editCopyData = JSON.parse(JSON.stringify(this.lessonInfo));
          }
          this.infoLoading = false;
        });
    }
  },
  created() {
    this.courseEditionId = this.$route.query.courseEditionId * 1;
    this.courseLevel = this.$route.query.courseLevel * 1;
    this.unitNo = this.$route.query.unitNo * 1;
    this.lessonId = this.$route.query.lessonId * 1;
    this.getLessonInfo();
    this.$Api.base.courseEdition().then(res => {
      if (res.status === 200) {
        this.editionListData = res.data.data;
        this.editionListData.some(e=>{
          if(e.editionId===this.courseEditionId){
           this.levelList = e.courseLevelInfoList
           return true
          }
        });
        this.unitList = this.levelList[0].courseUnitList;
        this.$Api.base
          .getLessonList(this.courseEditionId, this.courseLevel, this.unitNo)
          .then(({ status, data }) => {
            if (status == 200 && data.code == 200 && data.data.length != 0) {
              data.data.forEach(item => {
                item.label = `lesson ${item.lessonNo}`;
                item.value = item.id;
              });
              this.lessonList = data.data;
            } else {
              this.lessonList = [];
            }
          });
      }
    });
  }
};
</script>
<style lang="scss">
.lesson-info-wrap {
  box-sizing: border-box;
  padding: 10px;
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 158px;
    height: 158px;
    line-height: 158px;
    text-align: center;
  }
  .avatar {
    width: 158px;
    height: 158px;
    display: block;
  }
}
</style>
<style lang="scss" scoped>
.el-icon-edit {
  cursor: pointer;
}
.lesson-info {
  ul {
    list-style: none;
    font-size: 14px;
    li {
      margin-bottom: 30px;
      display: flex;
    }
  }
}
.lesson-info-in {
  width: 100%;
  height: 100%;
  position: relative;
  .edit-info-button {
    position: absolute;
    top: 0;
    right: 0;
  }
  ul {
    li {
      display: flex;
      align-items: center;
    }
  }
}
.label {
  color: #666;
  margin-right: 20px;
}
.value img {
  width: 158px;
  height: 158px;
}
</style>
