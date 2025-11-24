<template>
  <div class="sort-question">
    <div class="body mb20" v-for="(sortItem, sortIndex) in sortData.questionExtendResultList" :key="sortIndex">
      <div class="standard-box flex-wrapper sb mb10">
        <div class="content flex-wrapper sb">
          <div class="title">{{sortIndex+1}}.前句：</div>
          <el-input placeholder="点击输入" v-model.trim="sortItem.pre" class="flex1"></el-input>
          <div class="fill-display"></div>
        </div>
        <div class="operation ml20 flex-wrapper">
          <el-button class="knowledge" size="mini" @click="setFontFamily(sortItem, sortIndex)">字体设置</el-button>
          <el-button size="mini" class="ml20" @click="setKnowledge(sortItem, sortIndex)">知识点设置</el-button>
          <el-button class="delete-topic" :loading="deleteLoading && deleteLoadingIndex === sortIndex" size="mini" type="primary" @click="deleteOneTopic(sortItem, sortIndex)">删除小题</el-button>
        </div>
      </div>
      <div class="standard-box flex-wrapper sb mb20">
        <div class="content flex-wrapper sb">
          <div class="title">后句：</div>
          <el-input placeholder="点击输入" v-model.trim="sortItem.post" class="flex1"></el-input>
          <div class="fill-display"></div>
        </div>
        <div class="operation ml20 flex-wrapper">
        </div>
      </div>
      <div class="otherSort standard-box mb10" v-for="(otherSortItem, otherSortIndex) in sortItem.options" :key="otherSortIndex">
        <div class="content flex-wrapper sb">
          <div class="title">排序{{noToSortNo[otherSortIndex+1]}}</div>
          <el-input placeholder="请输入不超过四个字的内容" v-model.trim="otherSortItem.word" class="flex1"></el-input>
          <el-button v-if="otherSortIndex!==0&&otherSortIndex!==sortItem.options.length-1" size="mini ml20" @click="deleteOtherOption(sortIndex, otherSortIndex)">删除</el-button>
          <div v-else class="fill-display"></div>
        </div>
        <div class="operation ml20 flex-wrapper">
        </div>
      </div>
      <div class="standard-box flex-wrapper sb mb20">
        <div class="content flex-wrapper">
          <div class="title"></div>
          <el-button @click="addSort(sortIndex)" v-if="sortItem.options.length<7">添加选项</el-button>
        </div>
        <div class="operation ml20">
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
    sortData: {
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
      noToSortNo: {
        1: '①',
        2: '②',
        3: '③',
        4: '④',
        5: '⑤',
        6: '⑥',
        7: '⑦'
      },
      deleteLoading: false,
      deleteLoadingIndex: null,
      setFontFamilyVisibility: false,
      setFontFamilyData: null
    }
  },
  mounted() {
  },
  methods: {
    setFontFamily(sortItem, sortIndex) {
      this.setFontFamilyData = sortItem
      this.setFontFamilyVisibility = true
    },
    setKnowledge(sortItem, sortIndex) {
      this.$emit('showKnowledge', {
        questionType: sortItem.type,
        knowledge_point: {
          knowledge_point_id: sortItem.knowledgePointId,
          knowledge_point_remark: sortItem.remark,
          knowledge_point_remark_content: sortItem.remarkContent,
        },
        subjectIndex: this.subjectIndex,
        topicIndex: sortIndex
      })
    },
    deleteOtherOption(topicIndex, optionsIndex) {
      this.$emit('deleteOtherOption', {
        subjectIndex: this.subjectIndex, 
        topicIndex: topicIndex,
        optionsIndex: optionsIndex
      })
    },
    addSort(topicIndex) {
      this.$emit('addSort', {
        subjectIndex: this.subjectIndex,
        topicIndex: topicIndex
      })
    },
    deleteOneTopic(sortItem, topicIndex) {
      if (sortItem.id) {
        this.deleteLoading = true,
        this.deleteLoadingIndex = topicIndex
      }
      this.$emit('deleteOneTopic', {
        subjectIndex: this.subjectIndex,
        topicIndex: topicIndex,
        callback: () => {
          this.deleteLoading = false,
          this.deleteLoadingIndex = null
        }
      })
    }
  },
  components: {
    SetFontFamily
  }
}
</script>

<style lang="scss" scoped>
.sort-question {
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
      width: 600px;

      .title {
        width: 60px;
        white-space: nowrap;
        flex-shrink: 0;
        font-size: 13px;
        color: #34364D;
      }

      .fill-display {
        width: 76px;
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