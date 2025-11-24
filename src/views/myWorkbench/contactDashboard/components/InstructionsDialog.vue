<template>
  <el-card class="instructions-card" shadow="nerver">
    <div slot="header" class="header">
      <span class="title">{{ $t('使用说明') }}</span>
    </div>
    <div class="content">
      <!-- 建联标准 -->
      <div class="section">
        <div class="section-title">
          <i class="el-icon-connection"></i>
          <span>1. {{ section1.title }}</span>
        </div>
        <div class="section-content">
          <p>{{ section1.subTitle }}</p>
          <ul>
            <li v-for="(item, i) in section1.list" :key="i">
              <span class="highlight">（{{ i + 1 }}）</span>{{ item.text }}
              <span class="note">{{ item.note }}</span>
            </li>
          </ul>
          <div class="warning">
            <i class="el-icon-warning"></i>
            <span>{{ section1.note }}</span>
          </div>
        </div>
      </div>

      <!-- 数据更新时效与解释 -->
      <div class="section">
        <div class="section-title">
          <i class="el-icon-data-line"></i>
          <span>2. {{ section2.title }}</span>
        </div>
        <div class="section-content">
          <div v-for="(item, i) in section2.list" :key="i" class="sub-section">
            <div class="sub-title">（{{ i + 1 }}）{{ item.subTitle }}</div>
            <p v-if="item.desc">{{ item.desc }}</p>
            <ul v-if="item.list.length">
              <li v-for="(subItem, j) in item.list" :key="j">
                <span class="highlight">{{ subItem.no }}</span>
                {{ subItem.text }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- IM使用指导 -->
      <div class="section">
        <div class="section-title">
          <i class="el-icon-chat-line-square"></i>
          <span>3. {{ section3.title }}</span>
        </div>
        <div class="section-content">
          <div v-for="(item, i) in section3.list" :key="i" class="sub-section">
            <div class="sub-title">（{{ i + 1 }}）{{ item.subTitle }}</div>
            <p v-if="item.desc">{{ item.desc }}</p>
            <ul v-if="item.list.length">
              <li v-for="(subItem, j) in item.list" :key="j">
                <span class="highlight">{{ subItem.no }}</span>
                {{ subItem.text }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'InstructionsDialog',
  computed: {
    isZh() {
      return this.$i18n.locale === 'zh';
    },
    // 建联标准文案
    section1() {
      if (this.isZh) {
        return {
          title: '建联标准',
          subTitle: '以下满足任意一条即为建联成功：',
          list: [
            {
              text: '与家长有微信好友',
              note: '（前提：家长账号绑定了微信）'
            },
            {
              text: '与家长有微信群',
              note: '（前提：家长账号绑定了微信）'
            },
            {
              text: '与家长有有效通话',
              note: '（要求：必须从OPS页面拨出电话）'
            },
            {
              text: '与家长在家长端IM互动过',
              note: '（有双向对话）'
            }
          ],
          note: '注意：建联成功后，如果家长删除你的微信或退出微信群，有可能导致建联状态失效。'
        };
      }
      return {
        title: 'Connection Criteria',
        subTitle: 'Meeting any of the following conditions qualifies as a successful connection:',
        list: [
          {
            text: 'WeChat friend with the parent',
            note: '(Parent account must be bound to WeChat)'
          },
          {
            text: 'In a WeChat group with the parent',
            note: '(Parent account must be bound to WeChat) '
          },
          {
            text: 'Had a valid call with the parent',
            note: ' (Must be dialed from the OPS page) '
          },
          {
            text: 'Interacted with the parent via IM on the Parent App ',
            note: '(Two-way conversation required) '
          }
        ],
        note: 'Note: If the parent deletes your WeChat or leaves the WeChat group after a successful connection, the connection status may become invalid.'
      }
    },
    // 数据更新时效与解释文案
    section2() {
      if (this.isZh) {
        return {
          title: '数据更新时效与解释',
          list: [
            {
              subTitle: '更新时效：',
              desc: '本页面数据为T+1更新，即当日发生的事件次日0点更新',
              list: [],
            },
            {
              subTitle: '数据解释：',
              desc: '',
              list: [
                {
                  no: '①',
                  text: '付费用户定义：家长存在≥8课时的订单'
                },
                {
                  no: '②',
                  text: '活跃用户定义：最近30天内有正常完课'
                }
              ],
            }
          ]
        }
      }
      return {
        title: 'Data Update Frequency & Explanation',
        list: [
          {
            subTitle: 'Update Frequency:',
            desc: 'Data on this page is updated on a T+1 basis, meaning events occurring today will be updated at midnight the next day',
            list: [],
          },
          {
            subTitle: 'Data Explanation:',
            desc: '',
            list: [
              {
                no: '①',
                text: 'Paid User Definition: Parents with an order of ≥8 lesson hours'
              },
              {
                no: '②',
                text: 'Active User Definition: Users who have completed a lesson normally in the past 30 days'
              }
            ],
          }
        ]
      }
    },
    // IM使用指导文案
    section3() {
      if (this.isZh) {
        return {
          title: 'IM使用指导',
          list: [
            {
              subTitle: '使用权限：',
              desc: '新付费用户自动开通IM使用权限，老用户需要运营人员手动添加权限。',
              list: [],
            },
            {
              subTitle: '使用方式：',
              desc: '',
              list: [
                {
                  no: '①',
                  text: '家长在"LingoAce Connect"APP，在"消息"菜单查看或回复消息，或在消息页面点击"联系人"主动发起会话，若无该页面请联系运营人员为家长添加权限。'
                },
                {
                  no: '②',
                  text: '在OPS主动向用户发起会话：进入家长页面-右上角"发起会话"，若无该按钮请联系运营人员为家长添加权限。'
                }
              ],
            }
          ]
        }
      }
      return {
        title: 'IM Usage Guide',
        list: [
          {
            subTitle: 'Access Permissions:',
            desc: 'New paid users are automatically granted IM access, while existing users require manual permission from the operations team.',
            list: [],
          },
          {
            subTitle: 'Usage Methods:',
            desc: '',
            list: [
              {
                no: '①',
                text: `Parents can view or reply to messages in the 'Messages' menu of the 'LingoAce Connect' app, or initiate a conversation by clicking 'Contacts' in the message page. If this page is missing, please contact the operations team to enable access.`
              },
              {
                no: '②',
                text: `To initiate a conversation with users via OPS: Go to the Parent Page > Click 'Start Conversation' in the top right corner. If this button is missing, please contact the operations team to enable access."`
              }
            ],
          }
        ]
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.instructions-card {
  border-style: none;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
    }
  }

  .content {
    max-height: 500px;
    overflow-y: auto;
    padding-right: 5px;

    .section {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .section-title {
        font-size: 15px;
        font-weight: bold;
        color: #409EFF;
        margin-bottom: 12px;
        display: flex;
        align-items: center;

        i {
          margin-right: 8px;
        }
      }

      .section-content {
        padding-left: 10px;

        p {
          margin: 8px 0;
          line-height: 1.5;
        }

        ul {
          padding-left: 15px;
          margin: 8px 0;

          li {
            margin-bottom: 8px;
            line-height: 1.5;
            position: relative;
            list-style-type: none;
          }
        }

        .highlight {
          color: #409EFF;
          font-weight: bold;
          margin-right: 2px;
        }

        .note {
          color: #909399;
          font-size: 13px;
        }

        .warning {
          background-color: #fff9f0;
          border-left: 3px solid #E6A23C;
          padding: 10px;
          margin-top: 10px;
          border-radius: 4px;
          display: flex;
          align-items: flex-start;

          i {
            color: #E6A23C;
            margin-right: 8px;
            font-size: 16px;
            margin-top: 2px;
          }

          span {
            flex: 1;
            line-height: 1.5;
          }
        }

        .sub-section {
          margin-bottom: 12px;

          .sub-title {
            font-weight: bold;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}
</style>
