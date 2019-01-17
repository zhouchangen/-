<template>
    <div id="infoDiv" ref="infoDiv">
        <div id="container">
            <div class="topCount">
            <el-button style="height:37.1px;">
                <svg class="icon" aria-hidden="true" >
                    <use xlink:href="#icon-bumen"></use>
                </svg>
                {{info.pName}}
                </el-button>
            <el-button >
                <!-- @click="preStep(2)" -->
                <svg class="icon" aria-hidden="true" >
                    <use xlink:href="#icon-icon-liucheng"></use>
                </svg>
                <!-- {{infoForm.projectVersionName}} -->
                <el-popover class="popContainer" width="350" trigger="click">
                    <el-form :inline="true" :model="info" @keyup.enter.native="getDataList(1)">
                    <el-form-item label="状态：">
                        <el-select  v-model="info.vName" class="pointSelect" @change="changeVname($event)">
                        <el-option
                            v-for="item in projectVersionListVoList"
                            :key="item.vGuid"
                            :label="item.projectVersionName"
                            :value="item.vGuid"
                            >
                        </el-option>
                        </el-select>
                    </el-form-item>
                    </el-form>
                    <span class="blueTip" slot="reference" style="min-width:60px;">{{info.vName}}</span>
                </el-popover>
                <i class="el-icon-arrow-down"></i>
            </el-button>
            <el-button >
                <svg class="icon" aria-hidden="true" >
                    <use xlink:href="#icon-chuli"></use>
                </svg>
                <el-popover class="popContainer" width="350" trigger="click">
                    <el-container>
                        <el-header>
                            预期目标
                        </el-header>
                        <el-main>
                            {{info.vIdeals}}
                        </el-main>
                        <el-header>
                            实际达成目标
                        </el-header>
                        <el-main>
                            {{info.vReality}}
                        </el-main>
                    </el-container>
                    <span class="blueTip" slot="reference">节点目标</span>
                </el-popover>
                <i class="el-icon-arrow-down"></i>
            </el-button>
            <el-button style="position:relative;top:8px;height:36.5px;">
               <el-progress type="circle" :percentage="info.vProgress*100" color="#72a9ff" :width="20" :stroke-width="2" :show-text="false"  style="position:relative;top:-3px;"></el-progress>
               <span style="vertical-align:top">&nbsp;&nbsp;{{info.vStatusStr}} &nbsp;&nbsp; {{info.vProgress*100}}%</span>
            </el-button>
            <!-- <el-button type="primary" @click="preStep(4)">上一步</el-button> -->
            <!-- v-model="dateForm.date" -->
            <el-date-picker
                @change="pickTimeStart($event)"
                v-model="confirmForm.startTime"
                ref="timePicker"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOption"
            >
            </el-date-picker>
            ---
            <el-date-picker
                @change="pickTimeEnd($event)"
                v-model="confirmForm.endTime"
                ref="timePicker"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOption"
            >
            </el-date-picker>
            </div>
            <div class="rightContent">
                <el-button type="primary">
                操作
                <i class="el-icon-arrow-down"></i>
                </el-button>
                <el-button @click="editVersion()" :disabled="disabledEdit" type="primary">
                编辑
                </el-button>
                <el-button @click="editComplete()" :disabled="disabledComplete" type="primary">
                标记为已完成
                </el-button>
            </div>
        </div>
        <el-tabs id="addInfo" v-model="activeName" type="border-card" stretch="" lazy="true">
            <el-tab-pane label="任务" name="first">
                <div class="content">
                    <el-container>
                        <el-main class="basicInfo">
                            <task-list  ref="task"   :v-guid="this.vGuid" :p-guid="this.pGuid" :start-time="this.confirmForm.startTime" :end-time="this.confirmForm.endTime"></task-list>
                        </el-main>
                    </el-container>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Bug" name="second">
                <div class="content">
                    <!-- v-for="(item,index) in projectList" :key="index" -->
                    <el-container  class="box-sty">
                        <el-main class="basicInfo">
                            <bug-list  ref="flow" :v-guid="this.vGuid" :p-guid="this.pGuid"></bug-list>
                        </el-main>
                    </el-container>
                </div>
            </el-tab-pane>
            <el-tab-pane label="文件" name="third">
                <div class="content">
                    <el-container>
                        <el-main class="basicInfo">
                            <ver-detail  ref="visible" :v-guid="this.vGuid"></ver-detail>
                        </el-main>
                    </el-container>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!-- 编辑节点弹框 -->
        <el-dialog style="" :title="title" @close="closeDialog" :visible.sync="dialogTabVisible" width="35% ">
            <el-form :model="topForm" :rules="rules" ref="topForm" label-width="120px" >
            <el-form-item label="节点名称：" prop="name">
                <el-col>
                <el-input v-model="topForm.name"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="计划开始时间：" prop="beingTime">
                <el-col>
                <el-date-picker
                    v-model="topForm.beingTime"
                    type="date"
                    :picker-options= 'pickerOption'
                    value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="计划结束时间：" prop="esTime">
                <el-col>
                <el-date-picker
                    v-model="topForm.esTime"
                    type="date"
                    :picker-options= 'pickerOption'
                    value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="预期目标：" prop="ideals">
                <el-col >
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 6}"
                    placeholder="请输入内容"
                    v-model="topForm.ideals">
                </el-input>
                </el-col>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTabVisible = false">取 消</el-button>
            <el-button @click="submit('topForm',1)">新 增</el-button>
            </div>
        </el-dialog>
        <el-dialog style="" :title="titleConfirm" @close="closeDialogConfirm" :visible.sync="dialogConfirmVisible" width="35% ">
            <el-form :model="topForm" :rules="rulesCom" ref="topForm" label-width="120px" >
                <el-col>
                <div style="margin-bottom:20px;">请确认当前节点已完成，并填写以下信息：</div>
                </el-col>
            <el-form-item label="实际开始时间：" prop="beingTime">
                <el-col>
                <el-date-picker
                    v-model="topForm.beingTime"
                    type="date"
                    :picker-options= 'pickerOption'
                    value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="实际结束时间：" prop="esTime">
                <el-col>
                <el-date-picker
                    v-model="topForm.esTime"
                    type="date"
                    :picker-options= 'pickerOption'
                    value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="实际达成目标：" prop="ideals">
                <el-col >
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 6}"
                    placeholder="请输入内容"
                    v-model="topForm.ideals">
                </el-input>
                </el-col>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dialogConfirmVisible = false">取 消</el-button>
            <el-button @click="submit('topForm',2)">新 增</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import TaskList from '../project/taskList'
    import BugList from '../project/bugList'
    import VerDetail from '../project/verDetail'
    export default {
       data() {
           return {
               activeName: 'first',
               vGuid: '',
               pGuid: '',
               pId: '',
               pVId: '',
               info: {
                   pName:'',
                   pGuid:'',
                   pvGuid:'',
                   pVId:'',
                   vBeingTime:'',
                   vEsTime:'',
                   vIdeals:'',
                   vReality:'',
                   vStatus:'',
                   vProgress:0,
               },
               editJudge: false,
               disabledEdit: false,
               disabledComplete: false,
               projectVersionListVoList: [],   
                topForm: {
                    name: "",
                    beingTime: '',
                    esTime: '',
                    ideals: "",
                    pVId: '',
                    projectGuid: '',
                    reality: "",
                    status: "",
                },
                confirmForm: {
                    startTime:'',
                    endTime:'',
                },
                 dataForm: {
                    type: 1,
                    id: "",
                    name: "",
                    hURealName: "",
                    aURealName: "",
                    level: "",
                    startTime: "",
                    endTime: "",
                    status: "",
                    vUuid: "",
                    finish: false
                },
                rules: {
                    name: [
                    { required: true, message: "项目名称不能为空！", trigger: "blur" },
                    { min: 1, max: 20, message: "请输入1-20位字符", trigger: "blur" }
                    ],
                    beingTime: [
                    { required: true, message: "开始时间不能为空！", trigger: "blur" }
                    ],
                    esTime: [
                    { required: true, message: "结束时间不能为空！", trigger: "blur" }
                    ],
                    ideals: [
                    { required: true, message: "目标不能为空！", trigger: "blur" },
                    { min: 0, max: 500, message: "请输入0-500位字符", trigger: "blur" }
                    ],
                },
                rulesCom: {
                    beingTime: [
                    { required: true, message: "开始时间不能为空！", trigger: "blur" }
                    ],
                    esTime: [
                    { required: true, message: "结束时间不能为空！", trigger: "blur" }
                    ],
                    ideals: [
                    { required: true, message: "目标不能为空！", trigger: "blur" },
                    { min: 0, max: 500, message: "请输入0-500位字符", trigger: "blur" }
                    ],
                },
                // 节点
                dialogTabVisible:false,
                dialogConfirmVisible:false,
                projectList: [],
                title: '编辑节点',
                titleConfirm: '标记为已完成',
                pickerOption: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    }
                },
           }
       },
       components: {
            TaskList,
            BugList,
            VerDetail,
        },
       created() {
        if(this.$route.params.vGuid && this.$route.params.pGuid && this.$route.params.pId){
          this.vGuid = this.$route.params.vGuid;
          this.pGuid = this.$route.params.pGuid;
          this.pId = this.$route.params.pId;
        }
        // this.getData()
        this.getVerDetail()
        this.getData()
        
       },
       methods: {
        pickTimeStart(e) {
            if(this.confirmForm.startTime&&this.confirmForm.endTime){
                if(new Date(this.confirmForm.endTime.toString())<new Date(this.confirmForm.startTime.toString())){
                    this.$message.error("结束时间必须不小于开始时间！")
                    this.confirmForm.startTime = "";
                }
            }
        },
        pickTimeEnd(e) {
            if(this.confirmForm.startTime&&this.confirmForm.endTime){
                if(new Date(this.confirmForm.endTime.toString())<new Date(this.confirmForm.startTime.toString())){
                    this.$message.error("结束时间必须不小于开始时间！")
                    this.confirmForm.endTime = "";
                }
            }
        },
        editVersion() {
            this.dialogTabVisible = true
            this.topForm.pVId = this.pVId
        },
        editComplete() {
            this.dialogConfirmVisible = true
            this.topForm.pVId = this.pVId
        },
        changeVname($event) {
            this.projectVersionListVoList.forEach(item => {
                $event==item.vGuid? this.vGuid = item.vGuid : ''
            })
            this.$refs.task.getDataList()
            this.$refs.infoDiv.click()
            this.getData()
            this.getVerDetail()
        },

        closeDialog() {
            this.topForm= {}
        },
        closeDialogConfirm() {
            this.topForm= {}
        },
        submit (form,num) {
            if(num === 2) {
                this.topForm.status = 4
                this.topForm.name = this.info.vName
            }
            this.$refs['topForm'].validate((valid) => {
            if (valid) {
                let submitData = this.topForm;
                this.$http({
                url: this.$http.adornUrl('/project/version/update'),
                method: 'post',
                data: submitData
                }).then(({data}) => {
                if (data && data.code === 0) {
                    this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                        
                        this.getVerDetail();
                        this.getData();
                        this.dialogTabVisible = false;
                        this.dialogConfirmVisible = false;
                        this.$refs["topForm"].resetFields();
                        this.topForm = {}
                    }
                    })
                } else {
                    this.$message.error(data.msg);
                    this.dialogTabVisible = false
                    this.dialogConfirmVisible = false
                    this.$refs["topForm"].resetFields();
                    this.topForm = {}
                }
                })
            }
            })
        },
        getData () {//获取数据的方法
            this.$http({
            url: this.$http.adornUrl('/project/versionList/' + this.pId),
            method: 'get',
            params: this.$http.adornParams({})
            }).then(({data}) => {
            if (data && data.code === 0) {
                let res = data.versions
                console.log(data)
                this.projectVersionListVoList = res.projectVersionListVoList
                res.projectVersionListVoList.forEach(item => {
                    this.vGuid==item.vGuid? this.pVId = item.pVId : ''
                    if(!this.info.vBeingTime) {
                        // ? this.pVId = item.pVId : ''
                        if(this.vGuid===item.vGuid) {
                            this.info.pName = res.projectName
                            this.info.vName = item.projectVersionName
                            this.info.vStatusStr = item.statusStr
                            this.info.vProgress = item.progress
                            this.confirmForm.startTime = item.beingTime
                            this.confirmForm.endTime = item.esTime
                        }
                    }
                    
                })
                
            } else {
                this.$message.warning("数据获取失败！")
            }
            })
        },
        //节点详情
        getVerDetail () {
            this.dataForm.vUuid = this.vGuid
            let data = this.dataForm
            this.$http({
            url: this.$http.adornUrl('/workbench/task/list'),
            method: 'get',
            params: data
            }).then(({data}) => {
            if (data && data.code === 0) {
                let res = data.list.list
                res.forEach(item => {
                    this.vGuid==item.pvGuid? this.info = item : ''
                })
                console.log(this.info)
                this.topForm.beingTime = this.info.vBeingTime
                this.topForm.esTime = this.info.vEsTime
                this.confirmForm.startTime = this.info.vBeingTime
                this.confirmForm.endTime = this.info.vEsTime
                this.topForm.pVId = this.pVId
                this.topForm.projectGuid = this.info.pGuid
                if(this.info.vStatus === 4) {
                    this.disabledEdit = true
                    this.disabledComplete = true
                }
            } else {
                this.$message.warning("数据获取失败！")
            }
            })
        },

       }
    }
</script>
<style lang="scss">
    #infoDiv {
        .el-dialog__footer {
            text-align: center !important;
        }
        .icon {
            width: 1em;
            height: 1em;
            vertical-align: -0.15em;
            fill: currentColor;
            overflow: hidden;
            }
        // margin: 10%;
        margin-top: 50px;
        position: relative;
        #container {
            .topCount {
            margin-bottom: 35px;
            .el-button + .el-button {
                height: 37px;
            margin-left: -5px;
            }
            .el-button--medium {
                height: 37px;
            border-radius: 0;
            }
            .el-button {
                height: 37px;
            border-radius: 0;
            }
        }
        .rightContent {
            position: absolute;
            right: 20px;
            top: -30px;
            width: 120px;
            .el-button + .el-button {
                width: 120px;
            margin-left: 0px;
            }
            .el-button--medium {
                 width: 120px;
            border-radius: 0;
            }
            .el-button {
                 width: 120px;
            border-radius: 0;
            }
            .el-button--primary {
                color: #fff;
                background-color: #3E8EF7;
                border-color: #fff;
            }
        }
        }
        #addInfo {
            
            margin-top: 40px;
            .topForm {
                margin-left: 58%;
                transform: translate(-50%);
                .el-input {
                    width: 220px;
                }
            }
            .topForm2 {
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
        .el-container{
        // border:solid 1px rgba(204, 204, 204, 1);
        margin-bottom:10px;
        .el-header{
        height: 40px !important;
        line-height: 40px;
        background: rgba(242, 242, 242, 1);
        padding-left: 10px;
        border-bottom: solid 1px rgba(204, 204, 204, 1);
        }
    }
    }
</style>