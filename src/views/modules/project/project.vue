<template>
  <div id="addProduct">
      <div class="header-form">
        <!-- @keyup.enter.native="" -->
        <el-form  :inline="true" :model="headForm" label-width="100px"  >
          <el-form-item label="项目名称：">
            <el-input v-model="headForm.name"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- @click="" -->
            <el-button type="primary" icon="el-icon-search" @click="getData()">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <!-- @click="" -->
            <el-button type="primary"  @click="toDetail()">新建项目</el-button>
          </el-form-item>
        </el-form>
      </div>
    <el-container v-for="(item,index) in projectList" :key="index" class="box-sty" >
      <el-header>
          <el-button  class="icon-size" title="编辑" type="text" size="small"><i
        class="el-icon-menu"></i></el-button>
          <span>{{item.projectName}}</span>
          
        <el-tooltip content="项目详情" placement="bottom" effect="light">
          <el-button  class="addExchangeRate icon-size"  type="text" size="small" @click="editBlock(item.pId,item.pGuid)"><i
                class="el-icon-setting"></i></el-button>
        </el-tooltip>
        <el-tooltip content="置顶" placement="bottom" effect="light">
          <el-button  class="addExchangeRate icon-size" type="text" size="small" @click="sortChange(item)"><i
                class="el-icon-upload2"></i></el-button>
        </el-tooltip>
        
          </el-header>
      <el-main >
          <el-row>
            <el-col :span="20">
              <div class="progress-container" v-for="(version,index) in item.projectVersionListVoList" :key="index" @click="toPoint(version.vGuid,item.pGuid,item.pId)">
                <div class="version">{{version.projectVersionName}}</div>
                <div class="timer">{{version.beingTime}} <span style="font-size:21px;position:relative;top:1px;">-</span> {{version.esTime}}</div>
                <div class="bottom-pro1" v-if="version.status === 4">{{version.statusStr}}</div>
                <div class="bottom-pro" v-else>{{version.statusStr}}</div>
              </div>
            </el-col>
            <el-col :span="4" style="float:right">
              <div class="progress-container-right" @click="addPoint(item)">
                +新建节点
              </div>
            </el-col>
            
          </el-row>
      </el-main>
    </el-container>
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
    export default {
      data(){
        return {
          projectName:'',
          firstProject: 0,
          firstCom: false,
          projectList:[],
        dialogTabVisible:false,
        dataForm: {
            name: "",
            beingTime: "",
            esTime: "",
            ideals: "",
            projectGuid: "",
            pVId: "",
        },
        headForm: {
            name: ''
        },
        editForm: {
            beingTime: '',
            budget: '',
            pId: '',
            projectName: '',
            sort: '',
        },
        sortForm: {
            beingTime: '',
            budget: '',
            pId: '',
            projectName: '',
            sort: '',
        },
        title: '新建节点',
        rules: {
            name:[
                { required: true, message: '节点名称不能为空！', trigger: "blur" },
                { min: 1,max: 20, message: '请输入1-20位字符', trigger: "blur" }
            ],
            beingTime:[
                { required: true, message: '计划开始时间不能为空！', trigger: "blur" }
            ],
            esTime:[
                { required: true, message: '计划结束时间不能为空', trigger: "blur" }
            ],
            ideals: [
            {required: true, message: '请输入预期目标', trigger: 'blur'},
            {min: 0, max: 500, message: '请输入1-500位字符', trigger: 'blur'}
            ],
        },
        pickerOption: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        }
       }
      },
      activated () {//页面加载就加载表格数据
        // if(this.$route.params.userId){
        //   this.id = this.$route.params.userId;
        // }
        // this.getData(this.id)
      },
      computed: {
      },
      created() {
        this.getData()
        
      },
      methods: {
        // firstProject
        //    简介初始化
      editGet(item) { 
        this.$http({
            url: this.$http.adornUrl('/project/detail/' + item.pId),
            method: 'get',
            params: this.$http.adornParams({})
        }).then(({data}) => {
            if (data && data.code === 0) {
            this.editForm.beingTime = data.detail.beingTime.substring(0,10)
            this.editForm.budget = data.detail.budget/10000
            this.editForm.pId = data.detail.id
            this.editForm.projectName = data.detail.name
            this.editForm.sort = 1
            } else {
            this.$message.warning("数据获取失败！")
            this.editForm = {}
            }
        })
      },
      editGetFirst() { 
        this.$http({
            url: this.$http.adornUrl('/project/detail/' + this.firstProject),
            method: 'get',
            params: this.$http.adornParams({})
        }).then(({data}) => {
            if (data && data.code === 0) {
              console.log(data)
            this.sortForm.beingTime = data.detail.beingTime.substring(0,10)
            this.sortForm.budget = data.detail.budget/10000
            this.sortForm.pId = data.detail.id
            this.sortForm.projectName = data.detail.name
            this.sortForm.sort = 0
            } else {
            this.$message.warning("数据获取失败！")
            }
        })
      },
      sortChangeFirst() {
          this.editGetFirst()
          let subData = this.sortForm;
          console.log(subData)
          setTimeout(() => {
          if(this.sortForm.pId) {
            this.$http({
              url: this.$http.adornUrl('/project/update'),
              method: 'post',
              data: subData
            }).then(({data}) => {
                if (data && data.code === 0) {
                  this.sortForm = {}
                } else {
                    this.$message.error(data.msg);
                    this.sortForm = {}
                }
            })
          }
          }, 1100);
        },
      sortChange(item) {
        this.sortChangeFirst()
        this.editGet(item)
        setTimeout(() => {
          let submitData = this.editForm;
          console.log(submitData)
          if(this.editForm.pId) {
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
                        this.getData()
                        this.editForm = {}
                    }
                  })
                } else {
                    this.$message.error(data.msg);
                    this.editForm = {}
                }
            })
          }
   }, 1100);
          
        },
        addPoint(item) {
          this.dataForm.projectGuid = item.pGuid
            this.dialogTabVisible = true
        },
        closeDialog() {
            this.dataForm= {}
        },
        editBlock(pId,pGuid) {
          this.$router.push({ name: 'project-info', params: { pId:pId, pGuid:pGuid}})
        },
        toPoint(id,pGuid,pId) {
          this.$router.push({ name: 'project-points', params: { vGuid:id, pGuid:pGuid,pId:pId }})
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
                    this.getData();
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
      toDetail() {
        this.$router.push({ name: 'project-detail', params: {}})
      },
      getData () {//获取数据的方法
        this.$http({
          url: this.$http.adornUrl('/project/list'),
          method: 'get',
          params: this.$http.adornParams({
            'projectName':this.headForm.name
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.projectList = data.list
            this.firstProject = this.projectList[0].pId
          } else {
            this.$message.warning("数据获取失败！")
          }
        })},
        
      }
    }
</script>

<style lang="scss">
// .el-checkbox__input {
//       position: absolute;
//     right: 0;
//     top: 33px;
// }
.el-checkbox+.el-checkbox {
  margin-left: 0;
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
   #addProduct{
     .box-sty{
  padding: 20px;
  background-color: #fff;
  border-radius: 3px;
  overflow: hidden;
}
.box-sty:hover{
  cursor: pointer;
  box-shadow:0 0 20px 10px rgba(0, 0, 0, 0.06);
  transition: all 0.5s;
}

  .flex{
    display: flex;
    align-items: center;
  }
  .el-main {
      padding-top: 30px;
      padding-bottom: 50px;
  }
  .el-container{
    // border:solid 1px rgba(204, 204, 204, 1);
    margin-bottom:10px;
  .el-header{
    height: 40px !important;
    line-height: 40px;
    padding:0 10px;
    border-bottom: solid 1px rgba(204, 204, 204, 1);
  }
  }
     .el-dialog__header{
    background: #3E8EF7;
    .el-dialog__title{
      color:#fff;
    }
    .el-dialog__headerbtn i{
      color:#fff;
      font-size: 14px;
    }
  }
  .el-dialog__body{
    padding: 40px 60px 20px;
  }
  .el-dialog__footer {
    text-align: center;
  }
  .header-form{
    margin-bottom: 20px;
    padding-top:15px;
    border: solid 1px rgba(204, 204, 204, 1);
  }
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
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
    .bottom-pro1 {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 50px;
        line-height: 50px;
        vertical-align:middle;
        border-radius:0 0 10px 10px;
        background: #3E8EF7;
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


  .addExchangeRate{
    float:right;
    margin-top: 4px;
  }
  .icon-size{
    font-size: 20px;
    padding: 5px;
  }

  .btn{
    height: 150px;
    width:300px;
    padding-top:50px;
    margin:0 auto;
  button{
    height: 30px;
    width:100px;
    padding: 0;
    margin: 0 10px;
    line-height: 30px;
    text-align: center;

    border-radius: 5px;
  }
  }

  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
    background: #17b3a3;
    color:#fff;
  }
  }
</style>
