<template>
    <div id="infoDiv">
        
        <el-tabs id="addInfo" v-model="activeName" type="border-card" stretch="" lazy="true" @tab-click="toPage">
            
            <el-tab-pane label="待办任务" name="first" @tab-click="toPage">
                <div class="addBox">
                    <el-button type="primary" @click="addTask()">新建任务</el-button>
                </div>
                <div class="content">
                    <el-container>
                        <el-main class="basicInfo">
                            <wtask-list  ref="wtask"   :v-guid="this.vGuid" ></wtask-list>
                        </el-main>
                    </el-container>
                </div>
            </el-tab-pane>
            <el-tab-pane label="待办Bug" name="second">
                <div class="addBox">
                    <el-button type="primary" @click="addBug()">新建Bug</el-button>
                </div>
                <div class="content" >
                    <el-container  class="box-sty">
                        <el-main class="basicInfo">
                            <wbug-list  ref="wbug" :v-guid="this.vGuid"></wbug-list>
                        </el-main>
                    </el-container>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已办任务" name="third">
                <div class="content">
                    <el-container>
                        <el-main class="basicInfo">
                             <ctask-list  ref="ctask"   :v-guid="this.vGuid" ></ctask-list>
                        </el-main>
                    </el-container>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已办Bug" name="fourth">
                <div class="content">
                    <el-container>
                        <el-main class="basicInfo">
                             <cbug-list  ref="cbug" :v-guid="this.vGuid"></cbug-list>
                        </el-main>
                    </el-container>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import WtaskList from '../work/wtaskList'
    import WbugList from '../work/wbugList'
    import CtaskList from '../work/ctaskList'
    import CbugList from '../work/cbugList'
    export default {
       data() {
           return {
               activeName: 'first',
               vGuid: '',
               editJudge: false,
               click1: false,
               product: {

               },
                dataForm: {
                    projectName: "",
                    beingTime: "",
                    budget: ""
                },
           }
       },
       components: {
            WtaskList,
            WbugList,
            CtaskList,
            CbugList,
        },
       created() {
        if(this.$route.params.activeNames){
            this.activeName = this.$route.params.activeNames;
        }
       },
       methods: {
        addTask() {
            this.$router.push({ name: 'work-add', params: {typeJuDge:1}})
        },
        addBug() {
            this.$router.push({ name: 'work-add', params: {typeJuDge:2}})
        },
        // tab切换刷新数据
        toPage(tab, event) {
            let res = event.target.getAttribute('id')
            if(res == 'tab-first') {
                this.$refs.wtask.getDataList(1)
            } else if(res == 'tab-second') {
                this.$refs.wbug.getDataList(1)
            } else if(res == 'tab-third') {
                this.$refs.ctask.getDataList(1)
            } else if(res == 'tab-fourth') {
                this.$refs.wbug.getDataList(1)
            }
        },
       }
    }
</script>
<style lang="scss">
    #infoDiv {
        // margin: 10%;
        // margin-top: 20px;
        .el-tabs--border-card {
            border: none;
        }
        
        #addInfo {
            
            margin-top: 40px;
            .addBox {
                position: absolute;
                right: 35px;
                top: 35px;
            }
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
            // 节点
            .progress-container{
                position: relative;
                display: inline-block;
                width:150px;
                height: 150px;
                margin-left: 20px;
                margin-top: 20px;
                background:#EEEEEE;
                border-radius: 10px;
                transition: 1s;
                &:hover{
                    background:-webkit-gradient(linear, left top, left bottom, from(#F9F9F9), to(#EEEEEE)); //背景线性渐变
                    -webkit-transform:scale(1.2);  //规模变大为1.2倍
                    -webkit-box-shadow:2px 4px 6px #555555;  //wrap阴影效果
                    -webkit-box-shadow:0 0 10px rgba(32,67,208,.5);
                    -moz-box-shadow:0 0 10px rgba(32,67,208,.5);
                    box-shadow:0 0 10px rgba(32,67,208,.5);
                    cursor: pointer;
                }
                .version {
                    padding-top: 40px;
                    font-size: 25px;
                    font-weight: 700;
                    text-align: center;
                }
                .timer {
                    font-size: 12px;
                    padding-top: 5px;
                    text-align: center;
                }
                .bottom-pro {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 50px;
                    line-height: 50px;
                    vertical-align:middle;
                    border-radius:0 0 10px 10px;
                    background: red;
                    text-align: center;
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
</style>