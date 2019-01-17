<template>
  <div id="infoDiv">
        <el-tabs id="addInfo" v-model="activeName" type="border-card" stretch="" lazy="true" @tab-click="toPage">
            
            <el-tab-pane label="待办任务" name="first" @tab-click="toPage">
                <div class="content">
                    <!-- <el-container>
                        <el-main class="basicInfo">
                        </el-main>
                    </el-container> -->
                </div>
            </el-tab-pane>
            <el-tab-pane label="待办Bug" name="second">
                <div class="content" >
                    <el-container  class="box-sty">
                        <el-main class="basicInfo">
                            <!-- <wbug-list  ref="flow" :v-guid="this.vGuid"></wbug-list> -->
                        </el-main>
                    </el-container>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已办任务" name="third">
                <div class="content">
                    <el-container>
                        <el-main class="basicInfo">
                             <!-- <ctask-list  ref="flow"   :v-guid="this.vGuid"></ctask-list> -->
                        </el-main>
                    </el-container>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已办任务" name="fourth">
                <div class="content">
                    <el-container>
                        <el-main class="basicInfo">
                             <!-- <cbug-list  ref="flow" :v-guid="this.vGuid"></cbug-list> -->
                        </el-main>
                    </el-container>
                </div>
            </el-tab-pane>
            <task-info  ref="flow"></task-info>
        </el-tabs>
        
    </div>
</template>
<script>
import taskInfo from '../work/taskInfo'
export default {
  data() {
    return {
      activeName: 'first'
    };
  },
  components: {
      taskInfo,
  },
  created() {
    if (this.$route.params.eltab) {
      this.activeName = this.$route.params.eltab;
    }
  },
  methods: {
    //返回
    toPage(tab, event) {
      console.log(event)
        console.log(event.target.getAttribute('id'))
        let res = event.target.getAttribute('id')
        if(res == 'tab-first') {
          this.$router.push({ name: 'work-list', params: {activeNames:'first'}})
        } else if(res == 'tab-second') {
          this.$router.push({ name: 'work-list', params: {activeNames:'second'}})
        } else if(res == 'tab-third') {
          this.$router.push({ name: 'work-list', params: {activeNames:'third'}})
        } else if(res == 'tab-fourth') {
          this.$router.push({ name: 'work-list', params: {activeNames:'fourth'}})
        }
    },
  }
};
</script>
<style lang="scss">
#infoDiv {
    // .el-checkbox__input {
    //     position: absolute;
    //     right: 0;
    //     top: 33px;
    //     }
        margin: 5%;
        margin-top: 20px;
        #addInfo {
            
            margin-top: 40px;
            .dataForm {
                margin-left: 58%;
                transform: translate(-50%);
                .el-input {
                    width: 220px;
                }
            }
            .dataForm2 {
                margin-left: 53%;
                transform: translate(-50%);
                .el-input {
                    width: 220px;
                }
            }
            .progress-container-right {
                width:150px;
                height: 150px;
                margin-top: 20px;
                line-height: 150px;
                float: right;
                text-align: center;
                margin-right: 50px;
                background:#EEEEEE;
                border-radius: 10px;
            }
        }
        .el-dialog__header{
                background: #3E8EF7;
                padding: 20px 20px 10px;
                .el-dialog__title{
                color:#fff;
                }
                .el-dialog__headerbtn i{
                color:#fff;
                font-size: 14px;
                }
            }
    }

.el-checkbox + .el-checkbox {
  margin-left: 0;
}
</style>