<template>
  <el-dialog
    :visible.sync="setFontFamilyVisibility"
    title="字体设置" 
    width="80%"
    @closed="closeDialog"
    :close-on-click-modal="false"
  >
    <template v-if="editorNum !== null">
      <template v-if="data.type === 1">
        <template v-if="contentJson.question">
          <p>题干</p>
          <div id="editor-question"></div>
        </template>
        <div v-for="(item, index) in (editorNum-1)" :key="index" class="mb20">
          <template v-if="contentJson.options[index].answer">
            <p v-if="index === 0">正确答案</p>
            <p v-else>其他答案</p>
            <div :id="'editor-option-'+index"></div>
          </template>
        </div>
      </template>
      <template v-if="data.type === 2">
        <div v-for="(item, index) in editorNum" :key="index" class="mb20">
          <template v-if="contentJson.options[index].sentence">
            <p v-if="index%3 === 0">前句</p>
            <p v-if="index%3 === 2">后句</p>
            <div :id="'editor-option-'+index" v-if="(index%3 === 0 || index%3 === 2)"></div>
          </template>
        </div>
      </template>
      <template v-if="data.type === 3">
        <div v-for="(item, index) in editorNum" :key="index" class="mb20">
          <template v-if="contentJson.options[index].head">
            <p>前句</p>
            <div :id="'editor-option-head-'+index"></div>
          </template>
          <template v-if="contentJson.options[index].tail">
            <p>正确答案</p>
            <div :id="'editor-option-tail-'+index"></div>
          </template>
        </div>
      </template>
      <template v-if="data.type === 4">
        <template v-if="contentJson.pre">
          <p>前句</p>
          <div id="editor-pre"></div>
        </template>
        <template v-if="contentJson.post">
          <p>后句</p>
          <div id="editor-post"></div>
        </template>
        <div v-for="(item, index) in editorNum-2" :key="index" class="mb20">
          <template v-if="contentJson.options[index].word">
            <p>排序</p>
            <div :id="'editor-option-'+index"></div>
          </template>
        </div>
      </template>
    </template>
    <div style="text-align: center">
      <el-button type="primary" @click="changeFontFamily">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import wangeditor from 'wangeditor'
import { replacePStyleLastBr, replaceSpanClass } from '@/utils/handleData'
export default {
  props: {
    setFontFamilyVisibility: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      titleObj: {
        1: {
          question: '题干',
          options: {
            0: '正确答案',
            1: '其他答案',
          }
        },
        2: {
          options: {
            0: '其他答案',
            1: '正确答案',
            2: '其他答案',
          }
        },
        3: {
          options: {
            head: '前句',
            tail: '正确答案'
          }
        },
        4: {
          pre: '前句',
          post: '后句',
          options: {
            0: '排序①',
            1: '排序②',
            2: '排序③',
            3: '排序④',
            4: '排序⑤',
            5: '排序⑥',
            6: '排序⑦'
          }
        }
      },
      editorNum: null,
      editorArr: []
    }
  },
  watch: {
    setFontFamilyVisibility(newVal) {
      if (newVal) {
        this.renderEditor()
      } else {
        this.editorNum = null
      }
    }
  },
  computed: {
    contentJson() {
      return this.data
    }
  },
  methods: {
    changeFontFamily() {
      switch (this.data.type) {
        case 1:
          this.contentJson.question = replacePStyleLastBr(this.editorArr[0].txt.html())
          this.editorArr.forEach((editor, index) => {
            if (index !== 0) {
              this.contentJson.options[index-1].answer = replacePStyleLastBr(editor.txt.html())
            }
          })
          break;
        case 2:
          this.editorArr.forEach((editor, index) => {
            this.contentJson.options[index].sentence = replacePStyleLastBr(editor.txt.html())
          })
          break;
        case 3:
          this.editorArr.forEach((editor, index) => {
            this.contentJson.options[index].head = replacePStyleLastBr(editor[0].txt.html())
            this.contentJson.options[index].tail = replacePStyleLastBr(editor[1].txt.html())
          })
          break;
        case 4:
          this.contentJson.pre = replacePStyleLastBr(this.editorArr[0].txt.html())
          this.contentJson.post = replacePStyleLastBr(this.editorArr[1].txt.html())
          this.editorArr[2].forEach((editor, index) => {
            this.contentJson.options[index].word = replacePStyleLastBr(editor.txt.html())
          })
          break;
        default:
          break;
      }
      this.destroyEditorBeforeClose(this.editorArr)
      this.editorArr.length = 0
      this.$emit('closeDialog')
    },
    destroyEditorBeforeClose(arr) {
      arr.forEach((editor, index) => {
        if (Array.isArray(editor)) {
          this.destroyEditorBeforeClose(editor)
        } else {
          editor.destroy()
        }
      })
    },
    closeDialog() {
      this.destroyEditorBeforeClose(this.editorArr)
      this.editorArr.length = 0
      this.$emit('closeDialog')
    },
    computeEditorNum() {
      switch (this.data.type) {
        case 1:
          this.editorNum = this.contentJson.options.length + 1
          break;
        case 2:
          this.editorNum = this.contentJson.options.length
          break;
        case 3:
          this.editorNum = this.contentJson.options.length
          break;
        case 4:
          this.editorNum = this.contentJson.options.length + 2
          break;
        default:
          break;
      }
    },
    setEditorConfig(editor) {
      editor.config.menus = ['fontName']
      editor.config.focus = false
      editor.config.showFullScreen = false
      editor.config.fontNames = ['fzkt', 'fzktpy01', 'fzktpy02', 'fzktpy03', 'fzktpy04', 'fzktpy05', 'fzktpy06', 'simhei']
      editor.config.height = 50
      editor.create()
    },
    render() {
      switch (this.data.type) {
        case 1:	
          {
            let editor0 = new wangeditor("#editor-question")
            editor0.config.zIndex = 100001
            this.setEditorConfig(editor0)
            this.editorArr.push(editor0)
            editor0.txt.html(replaceSpanClass(this.contentJson.question))

            this.contentJson.options.forEach((optionItem, optionIndex) => {
              let editor = new wangeditor('#editor-option-' + optionIndex)
              editor.config.zIndex = 100001 - (optionIndex*10) - 1
              this.setEditorConfig(editor)
              this.editorArr.push(editor)
              editor.txt.html(replaceSpanClass(optionItem.answer))
            })
          }			
          break;
        case 2:
          {
            this.contentJson.options.forEach((optionItem, optionIndex) => {
              let editor = new wangeditor('#editor-option-' + optionIndex)
              editor.config.zIndex = 100001-(optionIndex*10)
              this.setEditorConfig(editor)
              this.editorArr.push(editor)
              editor.txt.html(replaceSpanClass(optionItem.sentence))
            })
          }
          break;
        case 3:
          {
            this.contentJson.options.forEach((optionItem, optionIndex) => {
              let arr = []

              let editor0 = new wangeditor('#editor-option-head-' + optionIndex)
              editor0.config.zIndex = 100001-(optionIndex*10)
              this.setEditorConfig(editor0)
              editor0.txt.html(replaceSpanClass(optionItem.head))
              arr.push(editor0)

              let editor1 = new wangeditor('#editor-option-tail-' + optionIndex)
              editor1.config.zIndex = 100001-(optionIndex*10)-1
              this.setEditorConfig(editor1)
              editor1.txt.html(replaceSpanClass(optionItem.tail))
              arr.push(editor1)

              this.editorArr.push(arr)
            })
          }
          break;
        case 4:
          {
            let editor0 = new wangeditor('#editor-pre')
            editor0.config.zIndex = 100001
            this.setEditorConfig(editor0)
            this.editorArr.push(editor0)
            editor0.txt.html(replaceSpanClass(this.contentJson.pre))

            let editor1 = new wangeditor('#editor-post')
            editor0.config.zIndex = 9999
            this.setEditorConfig(editor1)
            this.editorArr.push(editor1)
            editor1.txt.html(replaceSpanClass(this.contentJson.post))

            let arr = []
            this.contentJson.options.forEach((optionItem, optionIndex) => {
              let editor = new wangeditor('#editor-option-' + optionIndex)
              editor.config.zIndex = 10000-(optionIndex*10)-1
              this.setEditorConfig(editor)
              editor.txt.html(replaceSpanClass(optionItem.word))
              arr.push(editor)
            })
            this.editorArr.push(arr)
          }
          break;
        default:
          break;
      }
    },
    renderEditor() {
      this.computeEditorNum()
      this.$nextTick(() => this.render())
      
    }
  }
}
</script>

<style>

</style>