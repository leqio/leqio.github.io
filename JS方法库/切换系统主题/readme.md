useTheme.js 主题切换hook
theme.less 主题css

在vue中，使用：
```vue
<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="content-container">
          <div class="header-box">
            <div class="title">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4e677d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-command"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
              <div class="title-name">CmdPro</div>
            </div>
            <div class="switch-theme" :class="theme" @click="toggleTheme">
              <el-icon size="20" :color="theme === 'light' ? '#000' : '#ddf'">
                <component :is="theme === 'light' ? Sunny : Moon" />
              </el-icon>
            </div>
          </div>
        </div>
        <div class="line"></div>
      </el-header>

      <el-main>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleTabClick">
          <el-tab-pane label="常用" name="common">
            <common-cmd></common-cmd>
          </el-tab-pane>
          <el-tab-pane label="收藏" name="favorite">
            <collected-cmd></collected-cmd>
          </el-tab-pane>
          <el-tab-pane label="推荐" name="recommended">
            <suggested-cmd></suggested-cmd>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { Moon, Sunny } from '@element-plus/icons-vue';
import { ref, reactive, computed} from 'vue';
import {useTheme} from '@/hooks/useTheme.js';
import commonCmd from './cpns/common-cmd/common-cmd.vue';
import collectedCmd from './cpns/collected-cmd/collected-cmd.vue';
import suggestedCmd from './cpns/suggested-cmd/suggested-cmd.vue';


const activeName = ref('common');

//#region Tab导航切换
const handleTabClick = (tab, event) => {
  console.log(tab, event)
}
//#endregion Tab导航

//#region 切换主题
const {theme, toggleTheme} = useTheme();
//#endregion 切换主题


</script>

<style lang="less" scoped>
  
.home {
  height: 100vh;
  width: 100vw;
}

// 鼠标移入，svg图标变色
::v-deep(.svg) {
    
    svg{
        stroke: #b1b0b0;
    }

    &:hover {
        cursor: pointer;
        svg {
            stroke: var(--el-color-primary);
        }
    }
    
}

.el-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
 
  .el-header {
    --el-header-padding: 0;
    --el-header-height: auto;

    .header-box {
      padding: 8px 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .title {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        font-size: 25px;
        font-weight: bold;
        line-height: 30px;
        color: var(--el-color-primary);
        gap: 8px;
        
      }
    }

  }

  .el-main {
    padding: 0;
    flex: 1;

    ::v-deep(.el-tabs__nav-scroll) {
        padding: 0 32px;  // 内容左右留空32px
    }

    .el-tabs {
        --el-tabs-header-height: 32px;
        height: 100%;

        ::v-deep(.el-tab-pane) {
            height: 100%;
        }

        ::v-deep(.el-tabs__item) {
            font-size: 16px;
        }
    }

    // .el-input {
    //     --el-input-height: 30px;

    // }




 
  

    

    
  }

  
}
  
</style>
```