<template>
  <div v-if="data" class="stat-cards">
    <!-- 用户建联率卡片 -->
    <el-card class="stat-card user-contact-card">
      <div class="card-content">
        <div class="main-stat">
          <div class="stat-label purple">{{ $t('用户建联率') }}</div>
          <div class="stat-value purple">{{ toPercent(data.lintRate) }}</div>
        </div>
        <div class="sub-stats">
          <div class="stat-item">
            <span class="stat-label">{{ $t('用户总量') }}</span>
            <span class="stat-value">{{ data.parentCnt }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label strong-text">{{ $t('未建联用户') }}</span>
            <span class="stat-value purple">{{ data.unlinkCnt }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ $t('微信绑定率') }}</span>
            <span class="stat-value">{{ toPercent(data.bindWechatRate) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ $t('未绑定微信用户') }}</span>
            <span class="stat-value purple">{{ data.unbindWechatCnt }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 活跃用户建联率卡片 -->
    <el-card class="stat-card active-user-card">
      <div class="card-content">
        <div class="main-stat">
          <div class="stat-label blue">{{ $t('活跃用户建联率') }}</div>
          <div class="stat-value blue">{{ toPercent(data.finishClass30dLintRate) }}</div>
        </div>
        <div class="sub-stats">
          <div class="stat-item">
            <span class="stat-label">{{ $t('活跃用户量') }}</span>
            <span class="stat-value">{{ data.finishClass30dParentCnt }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ $t('未建联活跃用户') }}</span>
            <span class="stat-value blue">{{ unLinkedActiveUserCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ $t('活跃用户微信绑定率') }}</span>
            <span class="stat-value">{{ toPercent(data.finishClass30dBindWechatRate) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ $t('未绑定微信的活跃用户') }}</span>
            <span class="stat-value blue">{{ data.finishClass30dUnbindWechatCnt }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'StatisticsCards',
  props: {
    data: {
      type: Object,
    }
  },
  computed: {
    // 活跃用户数量
    activeUserCount() {
      // 未建联用户数+建联用户数
      return this.data.finishClass30dParentCnt;
    },
    // 未建联活跃用户
    unLinkedActiveUserCount() {
      // 活跃用户量-建联活跃用户数
      return this.activeUserCount - this.data.finishClass30dLinkCnt;
    }
  },
  methods: {
    toPercent(val) {
      const intNum = val ? Math.floor(val * 100) : 0;
      return `${intNum} %`;
    }
  }
}
</script>

<style lang="scss" scoped>
.stat-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  .stat-card {
    flex: 1 1 auto;
    .card-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .card-content {
      display: flex;
      gap: 20px;

      .main-stat {
        flex: 0 0 auto;

        .stat-label {
          font-size: 14px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
        }
      }

      .sub-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;

        .stat-item {
          .stat-value {
            font-size: 16px;
            font-weight: bold;
            margin-left: .5em;
          }
        }
      }
    }

    .purple {
      color: #4135c9;
    }

    .blue {
      color: #0994b4;
    }
  }
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.strong-text {
  color: #333;
  font-weight: bold;
}

.user-contact-card {
  border: 1px solid #5045c9;
  background-color: #edebf9;
}

.active-user-card {
  border: 1px solid #1199b7;
  background-color: #effbfd;
}
</style>
