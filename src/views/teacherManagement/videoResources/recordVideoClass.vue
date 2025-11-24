<template>
  <el-card class="box-card-class" shadow="hover">
    <div slot="header" class="clearfix">
      <span>{{ $t('录播视频') }}</span>
    </div>
    <div class="recordVideoClass-wrap">
      <div class="search-wrap">
        <div class="form-wrap">
          <el-input
            clearable
            class="mr10"
            style="width: 200px"
            v-model="screenData.title"
            :placeholder="$t('请输入视频名称')"
          />
          <el-select
            clearable
            class="mr10"
            style="width: 200px"
            v-model="screenData.videoTopicId"
            :placeholder="$t('请选择视频主题')"
          >
            <el-option
              v-for="item in videoTypesOptions"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button type="primary" @click="search">{{ $t('my-home-Search') }}</el-button>
        </div>
        <div class="add-video-wrap">
          <el-button @click="openTheme"><i class="el-icon-s-open"/>{{$t('主题管理')}}</el-button>
          <el-button @click="openUploadVideo"><i class="el-icon-upload2"></i> {{$t('上传视频')}}</el-button>
        </div>
      </div>
      <div class="table-wrap">
        <el-table
          :border="false"
          :data="tableData"
          v-loading="loading"
          tooltip-effect="dark"
          fit
          show-overflow-tooltip="true"
          style="width: 100%;margin-top:10px"
          stripe
          :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
        >
          <el-table-column fixed align="center" :label="$t('序号')" :width="currentLang === 'zh'?50:150">
            <template
              slot-scope="scope"
            >{{ (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column fixed align="center" :label="$t('视频名称')" width="120" prop="title"></el-table-column>
          <el-table-column align="center" :label="$t('英文名称')" width="120" prop="titleEn"></el-table-column>
          <el-table-column align="center" :label="$t('用途')" width="120" prop="useType">
            <template slot-scope="scope">
              <span>{{ useType(scope.row.useType) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('大小')" width="120" prop="size">
            <template slot-scope="scope">
              <span>{{ scope.row.size }}M</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('中英描述')" :width="currentLang === 'zh'?120:230" prop="introduction">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                title="描述"
                width="200"
                trigger="hover"
                :content="scope.row.introduction">
                <div slot="reference" class="text-overflow">{{ scope.row.introduction }}</div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('视频主题')" width="220" prop="topicTitle">
            <template slot-scope="scope">
              {{ scope.row.topicTitle }}
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('视频时长（秒）')" :width="currentLang === 'zh'?120:180" prop="duration">
            <template slot-scope="scope">
              <span>{{ DateTimeUtils.s_to_hs(scope.row.duration) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('视频格式')" width="120" prop="format"></el-table-column>
          <el-table-column align="center" :label="$t('分辨率')" width="120" prop="resolutionHeight">
            <template slot-scope="scope">
              <span>{{ scope.row.resolutionHeight }}P</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('码率')" width="120" prop="codeRate"></el-table-column>
          <el-table-column align="center" :label="$t('视频封面')" width="120" prop="title">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                lazy
                :src="scope.row.poster"
                :preview-src-list="srcList">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('创建人')" width="120" prop="createUserName"></el-table-column>
          <el-table-column align="center" :label="$t('创建时间')" width="150" prop="createTime">
            <template slot-scope="scope">
              <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('status')" width="120" prop="name">
            <template slot-scope="scope">
              <span>{{ scope.row.status | videoStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('视频上传状态')" width="120" prop="name">
            <template slot-scope="scope">
              <div><span>{{ scope.row.uploadStatus | uploadStatusFilter }}</span></div>        
              <el-button type="text" @click="reUploadVideo(scope.row.courseVideoId)">{{$t('重新上传')}}</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" :label="$t('操作')" width="150" prop="url">
            <template slot-scope="scope">
              <el-button :disabled="scope.row.uploadStatus !== 1" type="text" @click="handleEditVideoInfo(scope.row)">{{$t('编辑')}}</el-button>
              <el-button
                v-if="scope.row.useType === 4"
                :disabled="scope.row.uploadStatus !== 1"
                type="text"
                @click="handleViodeTypeChange(scope.row)"
              >
                {{$t('主题变更')}}
              </el-button>
              <el-button
                v-if="Per.handleButtonPer('teacherMT.videoResources.recordVideoClass.deleteVideo')"
                type="text"
                @click="deleteVideo(scope.row)"
              >
                {{ $t('删除') }}
              </el-button>
              <div>
                <el-button :disabled="scope.row.uploadStatus !== 1" type="text">
                  <a v-if="scope.row.uploadStatus === 1" :href="scope.row.url" target="__blank">{{$t('视频源链接')}}</a>
                  <span v-else>{{$t('视频源链接')}}</span>
                </el-button>
                <el-tooltip v-if="scope.row.uploadStatus === 1" class="item" effect="dark" :content="$t('一键复制')" placement="top-start">
                  <i @click="copyLink(scope.row.url)" class="el-icon-document-copy" style="cursor: pointer;"></i>
                </el-tooltip>
                <br>
              </div>
              <div>
                <el-button :disabled="scope.row.uploadStatus !== 1" type="text">
                  <a v-if="scope.row.uploadStatus === 1" :href="scope.row.userWatchUrl" target="__blank">{{$t('用户观看链接')}}</a>
                  <span v-else>{{$t('用户观看链接')}}</span>
                </el-button>
                <el-tooltip v-if="scope.row.uploadStatus === 1" class="item" effect="dark" :content="$t('一键复制')" placement="top-start">
                  <i @click="copyLink(scope.row.userWatchUrl)" class="el-icon-document-copy"
                     style="cursor: pointer;"></i>
                </el-tooltip>
                <br>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <custom-pagination
          :total="total"
          :current-page="screenData.pageNum"
          :pageSize="screenData.pageSize"
          @getCurrentPage="getCurrentPage"
          @getPerPage="getPerPage"
        />
      </div>
      <UploadVideo
        v-if="uploadVideo"
        :dialogVisible.sync="uploadVideo"
        :isEdit="isEdit"
        :currentEditViode="currentEditViode"
        :videoTypesOptions="videoTypesOptions"
        :couresTreeList="couresTreeList"
        @getTableData="getTableData"
        @clearCurrentEditViode="clearCurrentEditViode"
      />
      <ChangeVideoTheme
        v-if="videoTypeChange"
        :dialogVisible.sync="videoTypeChange"
        :currentEditViode="currentEditViode"
        :videoTypesOptions="videoTypesOptions"
        @getTableData="getTableData"
        @clearCurrentEditViode="clearCurrentEditViode"
      />
      <ReuploadVideo
        v-if="reUploadVisibility"
        :dialogVisible.sync="reUploadVisibility"
        :courseVideoId="courseVideoId"
        @getTableData="getTableData"
      />
    </div>
  </el-card>
</template>
<script>
import {mapGetters} from 'vuex'
import {deepClone} from '@/utils/handleData'
import UploadVideo from './components/uploadVideo';
import ChangeVideoTheme from './components/changeVideoTheme.vue';
import ReuploadVideo from './components/reuploadVideo.vue';
import { hooksFun } from './components/hooks';

export default {
  name: 'recordVideoClass',
  components: {ChangeVideoTheme, ReuploadVideo, UploadVideo},
  data() {
    return {
      screenData: {
        pageSize: 10,
        pageNum: 1,
        videoTopicId: '',
        title: '',
        useType: 4
      },
      total: 0,
      tableData: [],
      loading: false,
      uploadVideo: false,
      srcList: [],
      videoTypesOptions: [],
      currentEditViode: null,
      isEdit: false,
      videoTypeChange: false,
      reUploadVisibility: false,
      courseVideoId: null,
      couresTreeList: [],
    }
  },
  computed: {
    ...mapGetters([
      'currentLang'
    ]),
    useType() {
      return (val) => {
        switch (val) {
          case 1:
            return '课前预习';
          case 2:
            return '课中';
          case 3:
            return '课后';
          case 4:
            return '教辅';
        }
      }
    }
  },
  methods: {
    cascaderList() {
      const localeLanguage = window.localStorage.getItem('localeLanguage');
      const { processCascader } = hooksFun(this, localeLanguage);
      this.$Api.classManagement.infoByFormal(3).then(({data: {code, data}}) => {
        if (code == 200) {
          this.couresTreeList =  processCascader(data);
        };
      });
    },
    // 删除
    deleteVideo(row) {
      this.$confirm(`${this.$t('您是否要删除该视频')}`, `${this.$t('提示')}`, {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
      })
        .then(() => {
          this.$Api.teacherManagement.delVideo(row.courseVideoId).then(({data: {code, data}}) => {
            if (code === 200) {
              this.$notify({
                message: this.$t('删除成功'),
                type: 'success'
              });
              this.getTableData();
            }
          });
        })
        .catch(_ => {});
    },
    // 重新上传
    reUploadVideo(id) {
      this.reUploadVisibility = true
      this.courseVideoId = id
    },
    copyLink(link) {
      let transfer = document.createElement('input');
      transfer.style.position = 'fixed'
      transfer.style.top = '-10000px'
      transfer.style.left = '-10000px'
      document.body.appendChild(transfer);
      transfer.value = link;  // 这里表示想要复制的内容
      transfer.focus();
      transfer.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
      }
      transfer.blur();
      this.$notify({
        message: this.$t('复制成功'),
        type: 'success'
      })
      document.body.removeChild(transfer);
      this.copyLinkVisibility = false
    },
    // 主题变更
    handleViodeTypeChange(scopeRow) {
      this.currentEditViode = deepClone(scopeRow)
      this.videoTypeChange = true
    },
    clearCurrentEditViode() {
      this.currentEditViode = null;
    },
    // 编辑
    handleEditVideoInfo(scopeRow) {
      this.isEdit = true
      this.currentEditViode = deepClone(scopeRow)
      this.uploadVideo = true
    },
    openUploadVideo() {
      this.isEdit = false
      this.uploadVideo = true
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page
      this.getTableData()
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage
      this.getTableData()
    },
    getTableData() {
      this.srcList = []
      this.loading = true
      let {
        pageSize,
        pageNum,
        title,
        videoTopicId,
        useType
      } = this.screenData
      this.$Api.teacherManagement.getVideoList(pageNum, pageSize, {title, videoTopicId, useType})
        .then(({status, data}) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data.list
            this.total = data.data.total
            this.tableData.forEach(item => {
              if (item.poster) {
                this.srcList.push(item.poster)
              }
            })
          }
          this.loading = false
        })
    },
    search() {
      this.screenData.pageNum = 1
      this.screenData.pageSize = 10
      this.getTableData()
    },
    openTheme() {
      this.$router.push({path: '/teacherManagement/themeManagement'})
    }, 
    initData() {
      this.getTableData()
      this.cascaderList()
      this.$Api.teacherManagement.getVideoTopicList()
        .then(({status, data}) => {
          if (status == 200 && data.code == 200) {
            this.videoTypesOptions = data.data
          }
        })
    }
  },
  // created() {
  //   this.initData();
  // },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initData();
    });
  },
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.reupload {
  text-align: center;
}

.reupload ~ p {
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-progress-circle {
  width: 178px !important;
  height: 178px !important;
}
</style>
<style lang="scss" scoped>
.recordVideoClass-wrap {
  width: 100%;

  .search-wrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    display: flex;

    .form-wrap {
      display: flex;
      width: 50%;
    }
  }

  .upload-video-wrap {
    width: 100%;
    height: 500px;
    overflow: auto;
  }

  .message-wraning {
    margin: 0;
    font-size: 14px;
  }
}
</style>
