<template>
  <div>
    <el-table
      class="conversation-table"
      :key="isGroup"
      :data="dataList"
      :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
    >
      <el-table-column
        v-if="index"
        :label="$t('序号')"
        width="50"
        type="index"
        :index="index"
      >
      </el-table-column>
      <el-table-column prop="id" :label="$t('会话ID')" width="70">
      </el-table-column>
      <el-table-column
        v-if="isGroup"
        prop="groupId"
        label="Group ID"
        width="150"
      >
      </el-table-column>
      <el-table-column
        v-if="isGroup"
        prop="conversationName"
        :label="$t('会话名称')"
      >
      </el-table-column>
      <el-table-column
        v-if="!isGroup && !hideColumns.includes('parent')"
        :label="$t('家长')"
      >
        <template v-slot="{ row }">
          <router-link
            v-if="row.parentId"
            :to="{
              path: `/studentManagement/parentInfo`,
              query: {
                parentUserId: row.parentId,
              },
            }"
          >
            <el-button type="text">{{
              row.parentName || row.parentId
            }}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isGroup"
        prop="studentUserName"
        :label="$t('学生')"
        width="150"
      >
        <template v-slot="{ row }">
          <router-link
            v-if="row.studentId"
            :to="{
              path: `/studentManagement/studentInfo`,
              query: {
                studentId: row.studentId,
                studentName: row.studentUserName,
              },
            }"
          >
            <el-button type="text">{{
              row.studentUserName || row.studentId
            }}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column v-if="isGroup" prop="subjectName" :label="$t('学科')">
        <template v-slot="{ row }">
          {{ toSubjectName(row.subjectType) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="roleName"
        :label="$t('会话角色')"
      ></el-table-column>
      <el-table-column v-if="!isGroup" :label="$t('老师')">
        <template v-slot="{ row }">
          <router-link
            v-if="row.teacherId"
            :to="{
              path: `/tutorManagement/teacherInfo`,
              query: {
                id: row.teacherId,
                teacherName: row.teacherName,
              },
            }"
          >
            <el-button type="text">{{
              row.teacherName || row.teacherId
            }}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!isGroup"
        prop="teacherManagerName"
        :label="$t('教管')"
      ></el-table-column>
      <el-table-column v-if="isGroup" :label="$t('群成员')">
        <template v-slot="{ row }">
          {{
            row.members
              .map((item) => item.memberName)
              .filter((p) => p)
              .join(",")
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="lastMessageTime"
        :label="$t('最近会话时间')"
        width="140"
      >
      </el-table-column>
      <el-table-column
        v-if="!isGroup"
        prop="_lastMessageContent"
        :label="$t('最近一条消息')"
        width="200"
        class-name="ct_last-message"
      ></el-table-column>
      <el-table-column :label="$t('操作')" width="100" fixed="right">
        <template v-slot="{ row }">
          <el-button
            type="text"
            size="small"
            @click="openConversationDialog(row)"
            >{{ $t("会话记录") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <ConversationDialog
      v-if="conversationDialogVisible && currentRow"
      :conversationId="isGroup ? currentRow.groupId : currentRow.id"
      :conversationName="currentRow.conversationName"
      :isGroup="isGroup"
      @close="closeConversationDialog"
    />
  </div>
</template>

<script>
import constants from "@/utils/constants.js";
import { toRoleName, toOurUserId } from "@/components/IM/util.js";
import ConversationDialog from "./ConversationDialog.vue";
import moment from "moment";

export default {
  components: {
    ConversationDialog,
  },
  props: {
    data: Array,
    // 是否是群聊
    isGroup: {
      type: Boolean,
      default: false,
    },
    // 需要隐藏的列
    hideColumns: {
      type: Array,
      default: () => [],
    },
    // 同 el-table-column 的 index 属性
    index: {
      type: [Number, Function],
    },
  },
  data() {
    return {
      conversationDialogVisible: false,
      // 当前行数据
      currentRow: null,
    };
  },
  computed: {
    // 单聊和群聊的数据结构不同，这里处理成一样的数据结构
    dataList() {
      const isEn = this.$i18n.locale === "en";
      const orgList = this.data || [];
      if (this.isGroup) {
        return orgList.map((item) => {
          let role = 0;
          // 群聊标识编码 1.老师服务群, 2.CC服务群, 3.LA服务群
          if (item.groupBizId == 1) {
            role = 3; // 转为对应的角色编码
          } else if (item.groupBizId == 2) {
            role = 4;
          } else if (item.groupBizId == 3) {
            role = 5;
          }
          return {
            ...item,
            id: item.id,
            conversationName: isEn ? item.groupEnName : item.groupName,
            lastMessageTime: this.toFormatTime(item.lastMessageTime),
            parentId: item.parentUserId,
            studentId: item.studentUserId,
            subjectType: item.subjectTypeId,
            groupBizId: item.groupBizId,
            roleName: toRoleName(role, isEn),
            members: item.members.map((member) => {
              const [prefix, userId] = member.imUserId.split("-");
              let memberRole = 0;
              switch (prefix) {
                case "p":
                  memberRole = 1;
                  break;
                case "s":
                  memberRole = 2;
                  break;
                case "t":
                  memberRole = 3;
                  break;
                case "o":
                  memberRole = item.groupBizId == 2 ? 4 : 5;
                  break;
              }
              const roleName = toRoleName(memberRole, isEn);
              return {
                ...member,
                userId: userId,
                role: role,
                roleName: roleName,
                memberName: member.memberName || roleName,
              };
            }),
          };
        });
      } else {
        return orgList.map((item) => {
          const members = [
            {
              userId: item.oneUserId,
              role: item.oneUserRole,
              roleName: toRoleName(item.oneUserRole, isEn),
            },
            {
              userId: item.otherUserId,
              role: item.otherUserRole,
              roleName: toRoleName(item.otherUserRole, isEn),
            },
          ];
          const user1RoleName = members[0].roleName;
          const user2RoleName = members[1].roleName;
          const parent = members.find((user) => user.role == 1) || {};
          // 最后一条消息的发送者角色
          const lastMessageSenderRoleName =
            members.find((user) => user.userId == item.lastMessageSender)
              ?.roleName || "";
          return {
            ...item,
            id: item.id,
            conversationName: `${user1RoleName}-${user2RoleName}`,
            lastMessageTime: this.toFormatTime(item.lastMessageTime),
            parentId: toOurUserId(parent.userId),
            studentId: "",
            teacherId: toOurUserId(item.otherUserId),
            subjectType: null,
            members,
            roleName: user2RoleName,
            _lastMessageContent: `${lastMessageSenderRoleName}: ${this.getTextFromMsg(
              item.lastMessageContent
            )}`,
          };
        });
      }
    },
  },
  methods: {
    openConversationDialog(row) {
      console.log("openConversationDialog", row);
      this.currentRow = row;
      this.conversationDialogVisible = true;
    },
    closeConversationDialog() {
      this.conversationDialogVisible = false;
    },
    toSubjectName(subjectType) {
      const subjectList = constants.subjectList(this.$i18n.locale);
      const item = subjectList.find((item) => item.value === subjectType);
      return item ? item.label : "";
    },
    toFormatTime(val) {
      if (val) {
        return moment(Number(val)).format("YYYY-MM-DD HH:mm:ss");
      }
      return "";
    },
    // 从消息中获取文本内容
    getTextFromMsg(msg) {
      const list = msg && typeof msg === "string" ? JSON.parse(msg) : msg;
      if (list && list.length > 0) {
        const info = list[0];
        if (info.MsgType === "TIMTextElem") {
          return info.MsgContent.Text;
        } else if (info.MsgType === "TIMImageElem") {
          return "[image]";
        } else {
          return "[Message]";
        }
      }
      return "";
    },
  },
};
</script>

<style lang="scss">
.conversation-table {
  .ct_last-message .cell {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
