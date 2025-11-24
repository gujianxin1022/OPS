<template>
  <div class="fill-blank" v-if="fillBlankData!==null">
    <div class="body mb30" v-for="(fillBlankItem, fillBlankIndex) in fillBlankData.questionExtendResultList" :key="fillBlankIndex">
      <template v-for="i in fillBlankItem.options.length/3">
        <div class="standard-box flex-wrapper sb mb10" :key="i+'f'">
          <div class="content flex-wrapper sb">
            <div class="title">{{i===1?fillBlankIndex+1+'.':null}}前句：</div>
            <el-input class="flex1" placeholder="点击输入" v-model.trim="fillBlankItem.options[3*i-3].sentence"></el-input>
            <div class="fill-display"></div>
          </div>
          <div class="operation ml20 flex-wrapper" v-if="i===1">
            <el-button class="knowledge" size="mini" @click="setFontFamily(fillBlankItem, fillBlankIndex)">字体设置</el-button>
            <el-button size="mini" class="ml20" @click="setKnowledge(fillBlankItem, fillBlankIndex)">知识点设置</el-button>
            <el-button class="delete-topic" :loading="deleteLoading && deleteLoadingIndex === fillBlankIndex" size="mini" @click="deleteOneTopic(fillBlankItem, fillBlankIndex)" type="primary">删除小题</el-button>
          </div>
        </div>
        <div class="standard-box flex-wrapper sb mb10" :key="i+'r'">
          <div class="content flex-wrapper sb">
            <div class="title">正确答案：</div>
            <el-input class="flex1" placeholder="点击输入" v-model.trim="fillBlankItem.options[3*i-2].sentence"></el-input>
            <div class="fill-display"></div>
          </div>
          <div class="operation ml20 flex-wrapper">
          </div>
        </div>
        <div class="standard-box flex-wrapper sb mb10" :key="i+'b'">
          <div class="content flex-wrapper sb">
            <div class="title">后句：</div>
            <el-input class="flex1" placeholder="点击输入" v-model.trim="fillBlankItem.options[3*i-1].sentence"></el-input>
            <el-button v-if="i>1" class="delete-topic ml20" size="mini" @click="deleteOneGroupFillBlank(fillBlankIndex, i)">删除一组填空</el-button>
            <div v-else class="fill-display"></div>
          </div>
          <div class="operation ml20 flex-wrapper">
          </div>
        </div>
      </template>
      <div class="standard-box flex-wrapper sb mb20" v-if="fillBlankItem.options.length/3<=5">
        <div class="content flex-wrapper">
          <div class="title"></div>
          <el-button @click="addOneGroup(fillBlankItem, fillBlankIndex)">添加</el-button>
        </div>
        <div class="operation ml20 flex-wrapper">
        </div>
      </div>
    </div>
    <setFontFamily :setFontFamilyVisibility="setFontFamilyVisibility" :data="setFontFamilyData" @closeDialog="setFontFamilyVisibility=false"></setFontFamily>
  </div>
</template>

<script>
import SetFontFamily from './setFontFamily'
export default {
  props: {
    fillBlankData: {
      type: Object,
      default: null
    },
    subjectIndex: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      deleteLoading: false,
      deleteLoadingIndex: null,
      setFontFamilyVisibility: false,
      setFontFamilyData: null
    }
  },
  mounted() {
  },
  methods: {
    setFontFamily(choiceItem, choiceIndex) {
      this.setFontFamilyData = choiceItem
      this.setFontFamilyVisibility = true
    },
    setKnowledge(fillBlankItem, fillBlankIndex) {
      this.$emit('showKnowledge', {
        questionType: fillBlankItem.type,
        knowledge_point: {
          knowledge_point_id: fillBlankItem.knowledgePointId,
          knowledge_point_remark: fillBlankItem.remark,
          knowledge_point_remark_content: fillBlankItem.remarkContent,
        },
        subjectIndex: this.subjectIndex,
        topicIndex: fillBlankIndex
      })
    },
    deleteOneTopic(fillBlankItem, fillBlankIndex) {
      if (fillBlankItem.id) {
        this.deleteLoading = true
        this.deleteLoadingIndex = fillBlankIndex
      }
      this.$emit("deleteOneTopic", {
        subjectIndex: this.subjectIndex, 
        topicIndex: fillBlankIndex,
        callback: () => {
          this.deleteLoading = false
          this.deleteLoadingIndex = null
        }
      })
    },
    addOneGroup(fillBlankItem, fillBlankIndex) {
      this.$emit('addOneGroup', {
        subjectIndex: this.subjectIndex,
        topicIndex: fillBlankIndex
      })
    },
    deleteOneGroupFillBlank(topicIndex, index) {
      this.$emit('deleteOneGroupFillBlank', {
        subjectIndex: this.subjectIndex,
        topicIndex: topicIndex,
        index: index
      })
    }
  },
  components: {
    SetFontFamily
  }
}
</script>

<style lang="scss" scoped>
.fill-blank {
  font-size: 14px;
  .body {
    border-bottom: 1px dotted #d5d6de;;
  }
  .sb {
    justify-content: space-between;
    align-items: center;
  }
  .flex1 {
    flex: 1;
  }
  .standard-box {

    .content {
      width: 530px;
      color: #34364D;
      .title {
        width: 70px;
        white-space: nowrap;
        flex-shrink: 0;
        font-size: 13px;
      }

      .fill-display {
        width: 125px;
      }
    }
    .operation {
      .delete-topic {
        margin-left: 15px;
      }
    }
  }
}
</style>