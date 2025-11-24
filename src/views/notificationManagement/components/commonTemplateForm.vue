<template>
  <el-form
    :model="templateForm"
    ref="tplFormRef"
    label-width="120px"
    :rules="rules"
  >
    <el-divider content-position="left">
      {{isEn ? getTranslateText(channel.name, languageList) : channel.name}}
    </el-divider>
    <div v-loading="renderTplState.isLoadingTpl">
      <!-- 可选模板 -->
      <el-form-item
        :label="$t('选择模板')"
        prop="currentTplId"
        v-if="renderTplState.templateType === TEMPLATE_TYPE.CAN_SELECT"
      >
        <el-select
          :disabled="readOnly"
          v-model="templateForm.currentTplId"
          @change="handleTplChange"
          style="width:400px"
        >
          <el-option
            v-for="item in renderTplState.tplList"
            :key="item.id"
            :label="isEn ? getTranslateText(item.title, languageList) : item.title"
            :value="item.templateId"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 全编辑 -->
      <div v-if="renderTplState.templateEditable === EDIT_TYPE.ALL">
        <div>
          <el-popover
            v-if="renderTplState.languageType === LANG_TYPE.MULTI"
            placement="top"
            width="300"
            trigger="hover"
            :content="$t('当设备语言为简体中文时显示当前内容')"
          >
            <p
              slot="reference"
              class="language-title"
            >{{ $t('中文通知') }}<i class="el-icon-question"></i></p>
          </el-popover>
          <el-form-item
            v-if="renderTplState.titleType === TITLE_TYPE.HAS_TITLE"
            :label='$t("通知标题")'
            prop="title"
          >
            <el-input
              v-insert-params-input
              :disabled="readOnly"
              class="normal-box"
              v-model="templateForm.title"
              :maxlength="100"
              show-word-limit
              :autosize="{ minRows: 1}"
              type="textarea"
              :placeholder="$t('请输入标题')"
              @change="handleInsertInput(templateForm, $event, 'title')"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="renderTplState.textType === TEXT_TYPE.TEXT"
            :label="$t('消息内容')"
            prop="content"
          >
            <el-input
              v-insert-params-input
              :disabled="readOnly"
              class="normal-box"
              :autosize="{ minRows: 4}"
              type="textarea"
              v-model="templateForm.content"
              :maxlength="renderTplState.textLimit"
              show-word-limit
              :placeholder="$t('请输入内容')"
              @change="handleInsertInput(templateForm, $event, 'content')"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="renderTplState.textType === TEXT_TYPE.EDITOR"
            :label='$t("消息内容")'
            prop="content"
          >
            <quill-editor
              ref="editorRef"
              v-model="templateForm.content"
              class="editor"
              :options="editorOption"
            />
          </el-form-item>
        </div>
        <div v-if="renderTplState.languageType === LANG_TYPE.MULTI">
          <el-popover
            placement="top"
            width="300"
            trigger="hover"
            :content="$t('当设备语言为英文时显示当前内容')"
          >
            <p
              slot="reference"
              class="language-title"
            >{{ $t('英文通知') }}<i class="el-icon-question"></i></p>
          </el-popover>
          <el-form-item
            v-if="renderTplState.titleType === TITLE_TYPE.HAS_TITLE"
            :label="$t('通知标题')"
            prop="titleEn"
          >
            <el-input
              v-insert-params-input
              :disabled="readOnly"
              class="normal-box"
              v-model="templateForm.titleEn"
              :maxlength="100"
              show-word-limit
              :autosize="{ minRows: 1}"
              type="textarea"
              :placeholder="$t('请输入标题')"
              @change="handleInsertInput(templateForm, $event, 'titleEn')"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="renderTplState.textType === TEXT_TYPE.TEXT"
            :label="$t('消息内容')"
            prop="contentEn"
          >
            <el-input
              v-insert-params-input
              :disabled="readOnly"
              class="normal-box"
              :autosize="{ minRows: 4}"
              type="textarea"
              v-model="templateForm.contentEn"
              :maxlength="renderTplState.textLimit"
              show-word-limit
              :placeholder="$t('请输入内容')"
              @change="handleInsertInput(templateForm, $event, 'contentEn')"
            ></el-input>
          </el-form-item>
        </div>
      </div>
      <!-- 部分编辑 -->
      <div v-if="renderTplState.templateEditable === EDIT_TYPE.PART ">
        <el-form-item
          :label="$t('消息内容')"
          v-if="renderTplState.currentTpl"
        >
          <!-- 微信卡片 -->
          <el-card
            class="wechat-tpl-eg-box"
            v-if="channel.value === NOTIFICE_METHOD.ACCOUNT_PUSH||channel.value ===32"
          >
            <div class="content">
              <span class="title">{{ templateForm.title }}</span>
              <div
                class="info-item mb10"
                v-for="(editItem, idx) in templateForm.content"
                :key="idx"
              >
                <div class="mb5 input-box">
                  <span class="label">
                    {{ editItem.name || '-' }}：
                  </span>
                  <el-input
                    style="width: 250px"
                    :placeholder="$t('请输入')"
                    v-if="editFlagRef[idx + 'EditFlag']"
                    v-model="editItem.value"
                    v-insert-params-input
                    :disabled="readOnly"
                    :maxlength="renderTplState.textLimit"
                    show-word-limit
                    :autosize="{ minRows: 1}"
                    type="textarea"
                    @change="handleInsertInput(editItem, $event)"
                  />
                  <span
                    class="value"
                    v-else
                  >{{ editItem.value || '-' }}</span>
                </div>
                <i
                  v-if="!readOnly && !editFlagRef[idx + 'EditFlag']"
                  class="el-icon-edit-outline"
                  @click="handleEdit(idx, EDIT_ICON_TYPE.WEHCAT)"
                />
              </div>
            </div>
            <div class="footer">{{ $t('查看详情') }}</div>
          </el-card>
          <!-- 其他编辑通用模板 -->
          <el-card v-else>
            <div v-if="templateForm.hasParam">
              <div
                class="info-item-exclude-wechat mb10"
                v-for="(editItem, idx) in templateForm.content"
                :key="idx"
              >
                <div class="mb5 input-box">
                  <span class="label">
                    {{ editItem.name || '' }}
                  </span>
                  <el-input
                    v-if="renderTplState.commonEditFlag && editItem.value !== 'no_render'"
                    style="width: 250px"
                    :placeholder="editItem.value"
                    v-model="editItem.value"
                    v-insert-params-input
                    :disabled="readOnly"
                    :maxlength="renderTplState.textLimit"
                    type="textarea"
                    show-word-limit
                    :autosize="{ minRows: 1}"
                    @change="handleInsertInput(editItem, $event)"
                  />
                  <span
                    class="value"
                    v-else
                  >{{ editItem.value !== 'no_render' ? editItem.value : '' }}</span>
                </div>
              </div>
              <i
                v-if="!readOnly && !renderTplState.commonEditFlag"
                class="el-icon-edit-outline"
                @click="handleEdit(idx, EDIT_ICON_TYPE.COMMON)"
              />
            </div>
            <div v-else v-html="templateForm.content"></div>
          </el-card>
        </el-form-item>
      </div>
      <p
        class="tip"
        v-if="renderTplState.textType === TEXT_TYPE.TEXT && renderTplState.parameterAvailable && renderTplState.parameterAvailable.length"
      >{{ $t('提示：编辑区域输入#可插入参数') }}</p>
      <!-- 跳转配置 -->
      <el-form-item
        v-if="renderTplState.linkType === LINK_TYPE.HAS_JUMP"
        :label="$t('点击跳转')"
        prop="action"
      >
        <el-radio-group
          v-model="templateForm.action"
          :disabled="readOnly"
          @change="handleActionChange"
        >
          <el-radio :label="WECHAT_JUMP.NONE">{{ $t('无跳转') }}</el-radio>
          <el-radio :label="WECHAT_JUMP.LINK">{{ $t('指定落地页') }}</el-radio>
          <el-input
            v-insert-params-input:url
            :disabled="readOnly"
            v-if="templateForm.action === WECHAT_JUMP.LINK"
            style="width:200px"
            class="mr20"
            v-model="templateForm.url"
            @change="handleInsertInput(templateForm, $event, 'url')"
          ></el-input>
          <el-radio :label="WECHAT_JUMP.OPEN_APP">{{ $t('打开应用') }}</el-radio>
          <div
            v-if="templateForm.action === WECHAT_JUMP.OPEN_APP"
            class="jump-wrap"
          >
            <el-select
              :placeholder="$t('请选择应用')"
              :disabled="readOnly"
              v-model="templateForm.app"
              @change="handleChangeApp"
            >
              <el-option
                v-for="item in renderTplState.jumpList.appList"
                :key="item.id"
                :label="isEn ? getTranslateText(item.name, languageList) : item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              :placeholder="$t('请选择页面')"
              :disabled="readOnly"
              v-model="templateForm.page"
            >
              <el-option
                v-for="item in renderTplState.jumpList.pageList"
                :key="item.id"
                :label="isEn ? getTranslateText(item.name, languageList) : item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-radio-group>
      </el-form-item>
    </div>
    <!-- 插入参数Dom -->
    <div
      id="insert-params-container"
      v-if="renderTplState.parameterAvailable && renderTplState.parameterAvailable.length"
    >
      <ul>
        <li
          v-for="item in renderTplState.parameterAvailable"
          :key="item"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <!-- 插入url参数Dom -->
    <div
      id="insert-url-params-container"
      v-if="renderTplState.urlParameterAvailable && renderTplState.urlParameterAvailable.length"
    >
      <ul>
        <li
          v-for="item in renderTplState.urlParameterAvailable"
          :key="item"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </el-form>
</template>
<script>
import {defineComponent, onMounted, reactive, computed, watch, ref} from '@vue/composition-api'
import {
  TITLE_TYPE,
  LINK_TYPE,
  TEMPLATE_TYPE,
  TEXT_TYPE,
  EDIT_TYPE,
  LANG_TYPE,
  WECHAT_JUMP,
  NOTIFICE_METHOD
} from '../data/enum'
import constants from "../data/constants";
import {blobToBase64} from "@/utils/file";


const {langList} = constants
const EDIT_ICON_TYPE = {
  WEHCAT: 'wechat',
  COMMON: 'common'
}

export default defineComponent({
  props: {
    readOnly: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: Number || String,
      default: ''
    },
    filterId: {
      type: Number || String,
      default: ''
    },
    tagId: {
      type: Number || String,
      default: ''
    },
    channel: {
      type: Object,
      default: {}
    },
    channelTemplateInfos: {
      type: Array,
      default: []
    },
    languageList: {
      type: Array,
      default: []
    }
  },
  setup(props, {root, emit, refs}) {
    const isEn = computed(() => root.$store.getters.currentLang === 'en');
    let editFlagRef = ref({})
    let editFlag = editFlagRef.value
    const templateForm = reactive({
        title: '',
        content: '',
        titleEn: '',
        contentEn: '',
        action: WECHAT_JUMP.NONE,
        url: '',
        app: '',
        page: '',
        status: 1,
        templateId: '',
        currentTplId: '',
      }
    )

    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // 加粗，斜体，下划线，删除线
      [{'list': 'ordered'}, {'list': 'bullet'}],     // 有序列表，无序列表
      [{'indent': '-1'}, {'indent': '+1'}],          // 缩进
      [{'size': ['small', false, 'large', 'huge']}],  // 字体大小
      [{'header': [1, 2, 3, 4, 5, 6, false]}],// 标题
      [{'color': []}, {'background': []}],          // 颜色选择
      [{'font': []}],// 字体
      [{'align': []}], // 居中
      ['clean'],                                       // 清除样式,
      ['link', 'image'],  // 上传图片、上传视频
      ['video'],
    ]

    const editorOption = {
      modules: {
        history: {
          delay: 1000,
          maxStack: 50,
          userOnly: false
        },
        toolbar: {
          container: toolbarOptions,
          handlers: {
            image: (img) => {
              if (img) {
                doUpload('image')
              }
            },
            video: (video) => {
              showHTML(video)
            }
          }
        }
      }
    }

    const showHTML = (type) => {
      const editor = refs.editorRef.$refs.editor
      const textareaId = "textareaEmailHtml";
      var textarea = document.getElementById(textareaId);
      if (null == textarea) {
        textarea = document.createElement('textarea');
        textarea.style.height = editor.clientHeight + "px";
        textarea.style.width = "100%";
        textarea.setAttribute("id", textareaId);
        textarea.value = editor.children[0].innerHTML;
        editor.style.display = "none";
        editor.insertAdjacentElement("afterend", textarea);
      } else {
        debugger;
        const decodedText = textarea.value.replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&');
        editor.children[0].innerHTML = decodedText;
        textarea.remove();
        editor.style.display = "block";
      }
    }

    const doUpload = (type) => {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      if (type === 'image') {
        input.setAttribute('accept', 'image/*')
      }
      input.click();
      input.addEventListener('change', () => {
        const files = input.files
        if (type === 'image') {
          if (files[0] && files[0].size > 2 * 1024 * 1000) {
            root.$notify.error('图片不能超过2兆')
          } else {
            blobToBase64(files[0], (base64Url) => {
              const editorEl = refs.editorRef.quill
              const index = editorEl.getSelection().index
              editorEl.insertEmbed(index, 'image', base64Url)
              editorEl.setSelection(index + 1)
            })
          }
        }
      })
    }

    const renderTplState = reactive({
      parameterAvailable: [],
      urlParameterAvailable: [],
      jumpList: {
        appList: [],
        pageList: [],
      },
      currentTpl: null,
      tplList: [],
      templateType: '',
      titleType: '',
      linkType: '',
      textType: '',
      templateEditable: '',
      msgType: '',
      textLimit: 200,
      languageType: '',
      selfLangList: [{}],
      isLoadingTpl: false,
      commonEditFlag: false
    })

    let rules = ref({})

    watch(() => templateForm.app, (val) => {
      Object.assign(renderTplState.jumpList, {
        pageList: renderTplState.jumpList.appList.find(t => t.id === val)?.children
      })
    })

    watch(() => props.filterId, (filterId) => {
      getTemplatebyChannel({filterId})
    })
    watch(() => props.tagId, (tagId) => {
      getTemplatebyChannel({tagId})
    })
    watch(isEn, () => {
      initData()
    })

    const initData = () => {
      rules.value = {
        title: [{required: true, message: root.$t('不能为空'), trigger: 'change'}],
        titleEn: [{required: true, message: root.$t('不能为空'), trigger: 'change'}],
        content: [{required: true, message: root.$t('不能为空'), trigger: 'change'}],
        contentEn: [{required: true, message: root.$t('不能为空'), trigger: 'change'}],
        action: [
          {
            required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (!value && value !== WECHAT_JUMP.NONE) {
                return callback(new Error(root.$t('请选择跳转类型')));
              } else if (value === WECHAT_JUMP.LINK && !templateForm.url) {
                return callback(new Error(root.$t('不能为空')));
              } else if (value === WECHAT_JUMP.OPEN_APP && (!templateForm.app || !templateForm.page)) {
                return callback(new Error(root.$t('请配置打开页面')));
              } else {
                return callback()
              }
            },
          }
        ]
      }
    }

    const handleInsertInput = (tpl, val, key) => {
      if (key) {
        tpl[key] = val
      } else {
        tpl.value = val
      }
    }

    const handleChangeApp = () => {
      templateForm.page = ''
    }

    const handleEdit = (idx, type) => {
      if (type === EDIT_ICON_TYPE.WEHCAT) {
        editFlag[idx + 'EditFlag'] = true
      } else {
        renderTplState.commonEditFlag = true
      }
    }

    const handleActionChange = () => {
      templateForm.app = '';
      templateForm.page = '';
      templateForm.url = ''
    }

    const handleTplChange = (tplId) => {
      try {
        const currentTpl = renderTplState.tplList.find(tpl => tpl.templateId === tplId)
        Object.assign(currentTpl, {action: currentTpl.action ?? WECHAT_JUMP.NONE})
        if (props.channel.templateEditable === EDIT_TYPE.ALL) {
          Object.assign(templateForm, {
            content: currentTpl.content,
            title: currentTpl.title,
            templateId: currentTpl.templateId,
            currentTplId: currentTpl.templateId
          })
          return
        }
        templateForm.currentTplId = currentTpl.templateId
        Object.assign(renderTplState, {currentTpl, jumpList: mapActionList(currentTpl)})
        parseTemplateParam(currentTpl)
      } catch (e) {
        console.log(e)
      }
    }

    const setDataToTemplateState = (currentTpl) => {
      if (!currentTpl) {
        return
      }
      if (renderTplState.templateType === TEMPLATE_TYPE.CAN_SELECT) {
        handleTplChange(currentTpl.templateId)
      } else {
        if (!props.taskId) {
          Object.assign(currentTpl, {action: WECHAT_JUMP.NONE})
        }
        Object.assign(templateForm, currentTpl)
        Object.assign(renderTplState, {jumpList: mapActionList(currentTpl)})
      }
    }

    const mapActionList = ({actionList, action}) => {
      let appList;
      templateForm.action = action
      for (let key in actionList) {
        if (key == WECHAT_JUMP.OPEN_APP) {
          appList = actionList[key].data
        }
      }
      if (action === WECHAT_JUMP.OPEN_APP) {
        const selectedAction = actionList[WECHAT_JUMP.OPEN_APP].data.find(t => t.selected)
        templateForm.app = selectedAction?.id
        templateForm.page = selectedAction?.children.find(t => t.selected)?.value
      }
      return {
        appList
      }
    }

    const parseOtherEditableTplParam = (_data) => {
      const data = {..._data}
      let replaceArr
      const matchContent = data.content.match(/\{{.*?\}}/g)
      if (matchContent?.length) {
        replaceArr = data.content.replaceAll(/\{{.*?\}}/g, '-').split('-')
        console.log(_data.parameter)
        if (!_data.parameter || !props.taskId) {
          data.content = replaceArr.map((item, index) => {
            return {
              name: item,
              value: matchContent[index] || 'no_render'
            }
          })
        } else {

          data.content = replaceArr.map((item, index) => {
            const matchKey = matchContent[index]?.slice(2, matchContent[index].length - 2)
            return {
              name: item,
              value: data.parameter[matchKey] || 'no_render'
            }
          })
        }
        data.hasParam = true
        data.matchContent = matchContent
      }
      Object.assign(templateForm, data)
    }

    const parseWechatTemplateParam = (_data) => {
      const data = {..._data}
      const arr = []
      const editFlagObj = {}
      if (!_data.parameter || !props.taskId) {
        data.content.split('\n').map((item, idx) => {
          item = (item + '').replace(':', "：");
          if (item.includes('：')) {
            const _arr = item.split('：')
            arr.push({
              name: _arr[0],
              key: _arr[1].slice(2, _arr[1].length - 3).split('.')[0],
              value: '',
            })
            editFlagObj[[idx + 'EditFlag']] = false
          } else {
            arr.push({
              name: idx === 0 ? '首行默认提示' : '尾行默认提示',
              key: item.slice(2, item.length - 3).split('.')[0],
              value: '',
            })
            editFlagObj[[idx + 'EditFlag']] = false
          }
        })
      } else {
        let map = {}
        try {
          data.content.split('\n').map((t, i) => {
            t =(t + '').replace(':', "：");
            const _a = t.split('：');
            if (t.includes('：')) {
              map[_a[1].slice(2, _a.length - 3).split('.')[0]] = _a[0]
            } else {
              map[t.slice(2, t.length - 3).split('.')[0]] = i === 0 ? '首行默认提示' : '尾行默认提示'
            }
          })
          data.content.split('\n').map((item, idx) => {
            item=(item + '').replace(':', "：");
            if (item.includes('：')) {
              const _arr = item.split('：')
              const key = _arr[1].slice(2, _arr[1].length - 3).split('.')[0]
              arr.push({
                name: map[key],
                key: key,
                value: data.parameter[key],
              })
              editFlagObj[[idx + 'EditFlag']] = false
            } else {
              const key = item.slice(2, item.length - 3).split('.')[0]
              arr.push({
                name: map[key],
                key: key,
                value: data.parameter[key],
              })
              editFlagObj[[idx + 'EditFlag']] = false
            }
          })
        } catch (e) {
          console.log(e)
        }
      }
      console.log(arr)
      data.content = arr
      Object.assign(templateForm, data)
      editFlagRef.value = editFlagObj
      editFlag = editFlagRef.value
    }

    const parseTemplateParam = (_data) => {
      const data = {..._data}
      if (!data.content || !data.content.length) return
      const isWechat = props.channel.value === NOTIFICE_METHOD.ACCOUNT_PUSH || props.channel.value === 32
      if (isWechat) {
        parseWechatTemplateParam(_data)
      } else {
        parseOtherEditableTplParam(_data)
      }

    }

    const renderTemplateUIByChannel = (data) => {
      const {msgTaskTemplateVList: templateList, parameterAvailable, urlParameterAvailable} = data
      renderTplState.parameterAvailable = parameterAvailable
      renderTplState.urlParameterAvailable = urlParameterAvailable
      let currentTemplateId
      if (props.taskId) {
        currentTemplateId = props.channelTemplateInfos.find(t => t.channelId === props.channel.value)?.templateId
      }
      const {titleType, linkType, templateType, textType, templateEditable, languageType, textLimit} = props.channel
      Object.assign(renderTplState, {
        titleType,
        linkType,
        templateType,
        textType,
        templateEditable,
        languageType,
        textLimit: textLimit ? textLimit : 200
      })
      if (languageType === LANG_TYPE.MULTI) {
        renderTplState.selfLangList = langList
      }
      /**可选模板 */
      try {
        if (templateType === TEMPLATE_TYPE.CAN_SELECT) {
          renderTplState.tplList = (templateList || []).filter(item => item.channelId === props.channel.value)
          if (props.taskId && currentTemplateId) {
            renderTplState.currentTpl = renderTplState.tplList.find(t => currentTemplateId === t.templateId)
          }
          setDataToTemplateState(renderTplState.currentTpl || null)

        } else {
          if (languageType === LANG_TYPE.MULTI && props.taskId && templateList?.length) {
            renderTplState.currentTpl = {
              ...templateList[0],
              titleEn: templateList[1]?.title,
              contentEn: templateList[1]?.content
            }
          } else {
            renderTplState.currentTpl = templateList?.length ? (props.taskId ? templateList[0] : {
              ...templateList[0],
              content: '',
              title: ''
            }) : {}
          }
          if (linkType) {
            renderTplState.jumpList = mapActionList(renderTplState.currentTpl)
          }
          setDataToTemplateState(renderTplState.currentTpl)
        }
        renderTplState.isLoadingTpl = false
      } catch (e) {
        console.log(e)
      }
    }

    const getTemplatebyChannel = (param) => {
      const {filterId, tagId} = props
      const params = {channelId: props.channel.value, filterId, tagId: (tagId || []).map(t => t.value).join(',')}
      const selectedChannels = props.channelTemplateInfos.map(t => t.channelId)
      //   if (param) Object.assign(params, param)
      if (selectedChannels.includes(props.channel.value)) params.taskId = props.taskId
      root.$Api.notificationManagement.getTemplatebyChannel(params).then(({data, status}) => {
        if (status !== 200 || data.code !== 200) {
          return Promise.reject()
        }
        renderTemplateUIByChannel(data.data)
      }).catch(() => {
      })
    }

    initData()

    onMounted(() => {
      renderTplState.isLoadingTpl = true
      getTemplatebyChannel()
    })
    return {
      isEn,
      rules,
      EDIT_ICON_TYPE,
      editorOption,
      renderTplState,
      templateForm,
      editFlagRef,

      handleActionChange,
      handleInsertInput,
      renderTemplateUIByChannel,
      mapActionList,
      handleTplChange,
      parseTemplateParam,
      handleEdit,
      setDataToTemplateState,
      handleChangeApp,
      doUpload,
      getTranslateText: constants.getTranslateText,

      /**enum. const*/
      TITLE_TYPE, LINK_TYPE, TEMPLATE_TYPE, TEXT_TYPE, EDIT_TYPE, LANG_TYPE, WECHAT_JUMP, NOTIFICE_METHOD,
      langList
    }
  },
})
</script>
<style lang="scss" scoped>
.tip {
  color: rgb(152, 150, 150);
  text-indent: 30px;
  font-size: 12px;
}

#insert-params-container,
#insert-url-params-container {
  height: 300px;
  overflow: auto;
  padding: 10px 5px;
  display: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 250px;
  background: #fff;
  height: 200px;
  overflow: auto;

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    height: 30px;
    line-height: 30px;
    padding: 0;
    margin: 0;
    list-style: none;
    font-size: 12px;
  }
}

.language-title {
  font-size: 14px;
  color: #7580e5;
  text-indent: 50px;
  width: 300px;
}

.el-icon-question {
  color: #7580e5;
  position: relative;
  left: -45px;
}

.normal-box {
  width: 400px;
}

.language-box {
  width: 200px;
}

.info-item-exclude-wechat {
  display: inline-block;
}

.el-icon-edit-outline {
  float: right;
  color: #7580e5;
  margin-right: 20px;
}

.wechat-tpl-eg-box {
  ::v-deep .el-textarea .el-input__count {
    height: 12px;
    line-height: 12px;
  }

  ::v-deep .el-textarea textarea {
    padding-bottom: 20px;
  }

  ::v-deep .el-card__body {
    padding-bottom: 0px;
  }

  width: 500px;

  .content {
    overflow: auto;

    .info-item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .input-box {
        display: flex;
        align-items: center;
      }

      .value {
        width: 250px;
      }

      .label {
        color: rgb(152, 150, 150);
      }
    }
  }

  .title {
    font-weight: bold;
  }

  .footer {
    text-align: left;
    border-top: 1px solid #ccc;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
  }
}

.jump-wrap {
  display: inline-block;
}

::v-deep .el-textarea .el-input__count {
  height: 12px;
  line-height: 12px;
}

::v-deep .el-textarea textarea {
  padding-bottom: 20px;
}

.editor {
  height: 500px !important;
}

::v-deep .ql-container {
  height: 400px !important;
}

::v-deep .ql-picker-label {
  line-height: 24px;
}

::v-deep .ql-picker-options {
  height: 150px;
  overflow: auto;
}

::v-deep #embedIframe {
  border: none;
  width: 100%;
  min-height: 100vh;
}
</style>
