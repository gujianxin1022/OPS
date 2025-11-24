<template>
  <div class="messageTips-drawer">
    <el-drawer
      :append-to-body="true"
      :with-header="false"
      :visible.sync="drawerVisible"
      :wrapperClosable="true"
      size="500px"
      :before-close="closeDrawer"
    >
      <div v-loading="loading" class="messageTips-mian">
        <div class="titie">
          <span>{{ $t("系统通知") }}</span>
          <i v-if="latestMessage" @click="allRead">{{
            $t("全部标记为已读")
          }}</i>
        </div>
        <div class="body-mian">
          <el-tabs v-if="drawerVisible" v-model="activeTab">
            <el-tab-pane
              v-for="(item, i) in categoryTabs"
              :key="item.businessTypeId"
              :name="i.toString()"
              lazy
            >
              <template v-slot:label>
                <el-badge
                  :class="{ 'sub-badge': item.businessTypeId > 0 }"
                  :value="item.unReadCount"
                  :max="99"
                  class="item"
                >
                  {{
                    currentLang === "en"
                      ? item.businessTypeNameEn
                      : item.businessTypeName
                  }}
                </el-badge>
              </template>
              <CategoryList
                ref="categoryList"
                :businessTypeId="item.businessTypeId"
                :userId="userInfo.id"
                @messageLoad="onMessageLoad"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import CategoryList from "./CategoryList.vue";

export default {
  components: {
    CategoryList,
  },
  data() {
    return {
      drawerVisible: false,
      // 通知分类
      categoryTabs: [],
      activeTab: "0",
      loading: false,
      // 最新的一条消息数据，从全部消息接口中取第一页的第一条数据
      latestMessage: null,
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
    userInfo() {
      return JSON.parse(window.localStorage.getItem("userInfo"));
    },
  },
  watch: {
    drawerVisible(val) {
      if (val) {
        this.getMessageCategories();
      }
    },
  },
  methods: {
    open() {
      this.drawerVisible = true;
    },
    // 全部标记为已读
    allRead() {
      if (!this.latestMessage) {
        return;
      }
      const createTime = this.latestMessage.createTime;
      this.$Api.base
        .allMessageRead(this.userInfo.id, 3, createTime)
        .then(({ data }) => {
          if (data.code === 200) {
            this.$notify({
              showClose: true,
              message: data.message,
              type: "success",
            });
            const listRef = this.$refs.categoryList;
            listRef.forEach((item) => {
              item.setAllRead();
            });
            this.categoryTabs.forEach((item) => {
              item.unReadCount = 0;
            });
          }
        });
    },
    // 关闭抽屉
    closeDrawer() {
      this.drawerVisible = false;
      this.$emit("getMessageNum");
    },
    // 获取所有分类 & 分类下未读消息数量
    getMessageCategories() {
      this.loading = true;
      this.$Api.base
        .getUnreadMessageCounts(this.userInfo.id)
        .then((list) => {
          this.categoryTabs = list;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onMessageLoad(list, typeId) {
      if (typeId === 0 && list.length > 0) {
        this.latestMessage = list[0];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// ::v-deep .el-drawer__body::-webkit-scrollbar{
// 	display: none
// }
::v-deep .el-drawer__wrapper {
  z-index: 5000 !important;
}
i {
  font-style: normal;
}
.messageTips-mian {
  height: 100%;
  display: flex;
  flex-direction: column;
  .titie {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 450px;
    border-bottom: 1px solid rgb(212, 212, 212);
    padding: 20px 20px;
    background: #fff;
    & > span {
      font-size: 18px;
      font-weight: 500;
    }
    & > i {
      font-size: 12px;
      color: #7581e5;
      cursor: pointer;
      font-style: normal;
    }
  }
  .body-mian {
    // position: relative;
    flex-grow: 1;
    overflow: hidden;
    ::v-deep .el-badge__content.is-fixed {
      top: 10px;
      right: 0;
    }
  }
  ::v-deep .el-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
    .el-tabs__header {
      padding: 0 20px;
    }
    .el-tabs__content {
      flex-grow: 1;
      overflow: hidden;
    }
    .el-tab-pane {
      height: 100%;
    }
  }
}
.sub-badge {
  ::v-deep .el-badge__content {
    background-color: transparent;
    color: #ff4949;
    padding: 0;
  }
}
</style>
