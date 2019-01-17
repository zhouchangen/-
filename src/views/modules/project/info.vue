<template>
    <div id="infoDiv">
        <h2 style="text-align:center;margin-top:10px;">{{proName}}</h2>
        <el-tabs id="addInfo" v-model="activeName" type="border-card" stretch="" lazy="true">
            <el-tab-pane label="简介" name="first">
                <div class="content">
                    <el-container>
                        <el-main class="basicInfo">
                        <el-row v-if="editJudge === false">
                            <el-form :model="product" ref="product" :inline="true" status-icon  label-width="100px" class="dataForm">
                              <el-col :span="24">   
                                <el-form-item label="项目名称：">
                                    <span>{{product.name}}</span>
                                </el-form-item>
                              </el-col>
                                <el-col :span="24">
                                <el-form-item label="项目预算：">
                                    <span>{{product.budget/10000}}万元</span>
                                </el-form-item>
                                </el-col>
                                <!-- <el-col :span="24">
                                <el-form-item label="添加时间：">
                                    <span>{{product.beingTime}}</span>
                                </el-form-item>
                                </el-col> -->
                                <el-col :span="24">
                                <el-form-item label="开始时间：">
                                    <span>{{product.beingTime}}</span>
                                </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                <el-form-item label="修改时间：">
                                    <span>{{product.lastUpdateTime}}</span>
                                </el-form-item>
                                </el-col>
                            </el-form>
                            <div style="text-align:center;margin-top:50px;">
                                <el-button type="primary" @click="editInfo()">编辑</el-button>
                            </div>
                        </el-row>
                        <el-row v-if="editJudge === true">
                          <el-form :model="editForm" :rules="rules" ref="editForm" label-width="120px" class="dataForm2">
                            <el-form-item label="项目名称：" prop="projectName">
                                <el-col>
                                <el-input v-model="editForm.projectName"></el-input>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="开始时间：" prop="beingTime">
                                <el-col>
                                <el-date-picker
                                    v-model="editForm.beingTime"
                                    type="date"
                                    :picker-options="pickerOption"
                                    value-format="yyyy-MM-dd"
                                ></el-date-picker>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="项目预算：" prop="budget">
                                <el-col>
                                <el-input v-model="editForm.budget">
                                    <template slot="append">万元</template>
                                </el-input>
                                </el-col>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="briefCancel()">取消</el-button>
                                <el-button type="primary" @click="briefSave()">保存</el-button>
                            </el-form-item>
                          </el-form>
                        </el-row>

                        </el-main>
                    </el-container>
                </div>
            </el-tab-pane>
            <el-tab-pane label="节点" name="second">
                <div class="content">
                    <el-container class="box-sty">
                        <el-main class="basicInfo">
                        <el-row>
                            <el-col :span="20">
                                <div class="progress-container" v-for="(version,index) in projectList" :key="index" @click="toPoint(version.vGuid)">
                                    <div class="version">{{version.projectVersionName}}</div>
                                    <div class="timer">{{version.beingTime}} - {{version.esTime}}</div>
                                    <div class="bottom-pro">{{version.statusStr}}</div>
                                </div>
                                </el-col>
                                <el-col :span="4" style="float:right;">
                                <div class="progress-container-right" @click="addPoint()">
                                    +新建节点
                                </div>
                            </el-col>
                        </el-row>
                        </el-main>
                    </el-container>
                </div>
            </el-tab-pane>
            <el-tab-pane label="人员" name="third">
                <div class="content">
                    <el-container>
                        <el-main class="basicInfo">
                            <personnel-list  ref="flow"  @refreshFlow="getFlow" message="perList" :p-guid="this.pGuid" :p-id="this.pId"></personnel-list>
                        </el-main>
                    </el-container>
                </div>
            </el-tab-pane>
            <el-tab-pane label="可见性" name="fourth">
                <div class="content">
                    <el-container>
                        <el-main class="basicInfo">
                            <visibility-list  ref="visible" :p-guid="this.pGuid"></visibility-list>
                        </el-main>
                    </el-container>
                </div>
            </el-tab-pane>
            <el-tab-pane label="文件" name="文件">
                <div class="content">
                    <el-container>
                        <el-main class="basicInfo">
                        <file-list  ref="visible" :p-guid="this.pGuid"></file-list>
                        </el-main>
                    </el-container>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!-- 编辑节点弹框 -->
        <el-dialog style="" :title="title" @close="closeDialog" :visible.sync="dialogTabVisible" width="35% ">
            <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="120px" >
            <el-form-item label="节点名称：" prop="name">
                <el-col>
                <el-input v-model="dataForm.name"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="计划开始时间：" prop="beingTime">
                <el-col>
                <el-date-picker
                    v-model="dataForm.beingTime"
                    type="date"
                    :picker-options= 'pickerOption'
                    value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="计划结束时间：" prop="esTime">
                <el-col>
                <el-date-picker
                    v-model="dataForm.esTime"
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
                    v-model="dataForm.ideals">
                </el-input>
                </el-col>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTabVisible = false">取 消</el-button>
            <el-button @click="submit('dataForm')">新 增</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import PersonnelList from '../project/personnelList'
    import VisibilityList from '../project/visibilityList'
    import FileList from '../project/fileList'
    export default {
       data() {
        return {
            activeName: 'second',
            pId: '',
            pGuid: '',
            proName: '',
            editJudge: false,
            product: {},
            editForm: {
                projectName: "",
                beingTime: "",
                budget: "",
                pId: "",
                sort : ""
            },
            dataForm: {
                projectName: "",
                beingTime: "",
                budget: ""
            },
            rules: {
                projectName: [
                { required: true, message: "项目名称不能为空！", trigger: "blur" },
                { min: 1, max: 20, message: "请输入1-20位字符", trigger: "blur" }
                ],
                beingTime: [
                { required: true, message: "开始时间不能为空！", trigger: "blur" }
                ],
                budget: [ { required: true, message: "预算不能为空！", trigger: "blur" }]
            },
            // 节点
            dialogTabVisible:false,
            projectList: [],
            title: '新建节点',
            pickerOption: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            },
        }
       },
       components: {
            PersonnelList,
            VisibilityList,
            FileList,
        },
       created() {
        
        if(this.$route.params.pId || this.$route.params.pGuid ){
          this.pId = this.$route.params.pId;
          this.pGuid = this.$route.params.pGuid;
          this.editGet(this.pId)
          this.getData(this.pGuid)
          
        }
        this.getPro()
       },
       methods: {
           toPoint(id) {
               this.$router.push({ name: 'project-points', params: { vGuid:id, pGuid:this.pGuid, pId:this.pId}})
           },
           editInfo() {
               this.editJudge = true
           },
           briefCancel() {
               this.editJudge = false
               this.editForm = {}
           },
        //    简介编辑
           briefSave() {
               this.$refs['editForm'].validate((valid) => {
                if (valid) {
                    this.editForm.sort = 1;
                    this.editForm.pId = this.pId;
                    let submitData = this.editForm;
                    this.$http({
                        url: this.$http.adornUrl('/project/update'),
                        method: 'post',
                        data: submitData
                    }).then(({data}) => {
                        if (data && data.code === 0) {
                          this.$message({
                            message: '修改成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.editJudge = false
                                this.editGet(this.pId)
                            }
                          })
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
                }
            })
           },
        //    简介初始化
           editGet(pId) { 
            this.$http({
                url: this.$http.adornUrl('/project/detail/' + pId),
                method: 'get',
                params: this.$http.adornParams({})
            }).then(({data}) => {
                if (data && data.code === 0) {
                this.product = data.detail
                } else {
                this.$message.warning("数据获取失败！")
                }
            })
           },

        //    节点
            addPoint(item) {
                this.dataForm.projectGuid = this.pGuid
                this.dialogTabVisible = true
            },
            closeDialog() {
                this.dataForm= {}
            },
            submit () {
            this.$refs['dataForm'].validate((valid) => {
            if (valid) {
                let submitData = this.dataForm;
                this.$http({
                url: this.$http.adornUrl('/project/version/save'),
                method: 'post',
                data: submitData
                }).then(({data}) => {
                if (data && data.code === 0) {
                    this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                        this.getData(this.pGuid);
                        this.dialogTabVisible = false;
                        this.dataForm = []
                    }
                    })
                } else {
                    this.$message.error(data.msg);
                    this.dialogTabVisible = false
                    this.dataForm = []
                }
                })
            }
            })

        },
        //获取数据的方法
        getData (pGuid) {
            this.$http({
            url: this.$http.adornUrl('/project/list'),
            method: 'get',
            params: this.$http.adornParams({})
            }).then(({data}) => {
            if (data && data.code === 0) {
                data.list.forEach(item => {
                    this.pGuid === item.pGuid ? this.projectList = item.projectVersionListVoList : ''
                })
                console.log(this.projectList)
            } else {
                this.$message.warning("数据获取失败！")
            }
            })},
            getPro () {//获取数据的方法
                this.$http({
                url: this.$http.adornUrl('/project/list'),
                method: 'get',
                params: this.$http.adornParams({})
                }).then(({data}) => {
                if (data && data.code === 0) {
                    data.list.forEach(item => {
                        this.pGuid==item.pGuid? this.proName = item.projectName : ''
                    })
                } else {
                    this.$message.warning("数据获取失败！")
                }
                })
            },


        // 人员
        getFlow(flow) {
            console.log(flow)
        }
       }
    }
</script>
<style lang="scss">
    #infoDiv {
        // margin: 10%;
        margin-top: 10px;
        #addInfo {
             .icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.5em;
  fill: currentColor;
  overflow: hidden;
}
            
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
                    max-width: 150px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
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
            .tableAdd {
            width: 100%;
            text-align: center;
            }
           
    }
</style>