<template>
  <div id="proInfo">
    <div class="proBox">
      <div class="step">
        <el-steps :active="stepsActive" align-center>
          <el-step title="项目信息"></el-step>
          <el-step title="项目参与成员"></el-step>
          <el-step title="项目可见性"></el-step>
          <el-step title="项目文件"></el-step>
        </el-steps>
      </div>
      <div class="boxContent" v-if="stepsActive == 1">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="120px" class="dataForm">
          <el-form-item label="项目名称：" prop="projectName">
            <el-col>
              <el-input v-model="dataForm.projectName"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="开始时间：" prop="beingTime">
            <el-col>
              <el-date-picker
                v-model="dataForm.beingTime"
                type="date"
                :picker-options="pickerOption"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="项目预算：" prop="budget">
            <el-col>
              <el-input v-model="dataForm.budget">
                <template slot="append">万元</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="resetForm(1)">返回</el-button>
            <el-button type="primary" @click="nextStep(1)">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="boxContent" v-if="stepsActive == 2">
        <div class="header-form">
          <!-- @keyup.enter.native="" -->
          <el-form :inline="true" :model="headForm" label-width="100px">
            <div style="color:#999;margin-bottom:20px;">提示：请从所有企业人员中，选择当前项目的参与人员。若暂不设置，可直接点击“下一步”。</div>
            <el-form-item label="选择人员：">
              <el-input v-model="headForm.query" placeholder="请输入名称/手机号码/工号进行搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <!-- @click="" -->
              <el-button type="primary" icon="el-icon-search" @click="getProject(1)">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
            <el-row>
              <el-col :span="24">
                <div class="checkedBox">
                  <el-checkbox-group v-model="checkList">
                    <el-checkbox 
                    v-for="(item,index) in participantList"
                    :key="index"
                    :label="item.uuid" 
                    @change="checkinlist"
                    class="checkTop"
                    >
                      <div class="checkedContainer">
                        <div class="left">
                          <img src="../../../assets/img/avatar.png" alt>
                        </div>
                        <div class="right">
                          <div class="top">{{item.realName}}（{{item.mobile}})</div>
                          <div class="bottom">{{item.jobNumber}}</div>
                        </div>
                      </div>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <div style="" class="personBox">
                  <span>已选人员（{{parLenth}}人）</span>
                  <el-button type="primary" @click="clearPartipant()">清空</el-button>
                  <div class="personContainer" >
                      <el-tag
                        v-for="tag in tags"
                        :key="tag"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)"
                        >
                        {{tag}}
                        </el-tag>
                  </div>
              </div>
            </el-row>
            <el-row>
                <div style="text-align:center;margin-top:50px;">
                    <el-button type="primary" @click="preStep(2)">上一步</el-button>
                <el-button type="primary" @click="nextStep(2)">下一步</el-button>
                </div>
            </el-row>
      </div>


      <div class="boxContent" v-if="stepsActive == 3">
        <div class="header-form">
          <!-- @keyup.enter.native="" -->
          <el-form :inline="true" :model="visiableForm" label-width="100px">
            <div style="color:#999;margin-bottom:20px;">提示：请从以下人员中选择当前项目的可见人员。若无该人员，请联系管理人员添加人员或修改权限。</div>
            <el-form-item label="选择人员：">
              <el-input v-model="visiableForm.name" placeholder="请输入名称/手机号码/工号进行搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
            <el-row>
              <el-col :span="24">
                <div class="checkedBox">
                  <el-checkbox-group v-model="viCheckList">
                    <el-checkbox 
                    v-for="(item,index) in visiableList"
                    :key="index"
                    :label="item.uuid" 
                    @change="visiableChange"
                    class="checkTop"
                    >
                      <div class="checkedContainer">
                        <div class="left">
                          <img src="../../../assets/img/avatar.png" alt>
                        </div>
                        <div class="right">
                          <div class="top">{{item.realName}}（{{item.mobile}})</div>
                          <div class="bottom">{{item.jobNumber}}</div>
                        </div>
                      </div>
                    </el-checkbox>
                  </el-checkbox-group>
                  <!-- <el-checkbox-group  v-model="checkList" class="checkgroup" >
                                        <el-checkbox v-for="mpb in mb.permissionBeans"  :key="mpb.id" :label="mpb.id" @change="checkinlist">{{mpb.name}}</el-checkbox>
                  </el-checkbox-group>-->
                </div>
              </el-col>
            </el-row>
            <el-row>
              <div style="" class="personBox">
                  <span>已选人员（{{viLenth}}人）</span>
                  <el-button type="primary" @click="clearVisiable()">清空</el-button>
                  <div class="personContainer" >
                      <el-tag
                        v-for="tag in viTags"
                        :key="tag"
                        closable
                        :disable-transitions="false"
                        @close="viClose(tag)"
                        >
                        {{tag}}
                        </el-tag>
                  </div>
              </div>
            </el-row>
            <el-row>
                <div style="text-align:center;margin-top:50px;">
                    <el-button type="primary" @click="preStep(3)">上一步</el-button>
                <el-button type="primary" @click="nextStep(3)">下一步</el-button>
                </div>
            </el-row>
      </div>

      <div class="boxContent" v-if="stepsActive == 4">
            <pro-detail  ref="visible" :p-id="this.pGuid"></pro-detail>
            <el-row>
                <div style="text-align:center;margin-top:50px;">
                    <el-button type="primary" @click="preStep(4)">上一步</el-button>
                <el-button type="primary" @click="nextStep(4)">进入项目</el-button>
                </div>
            </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import ProDetail from '../project/proDetail'
export default {
  data() {
    return {
      stepsActive: 1,
      pGuid: '',
      dataForm: {
        projectName: "",
        beingTime: "",
        budget: ""
      },
      //   步骤2
      headForm: {
        name: ""
      },
      checkList:[],
      participantList:[],
      tags: [],
      parLenth: 0,
      //   步骤3
      visiableForm: {
        name: ""
      },
      viCheckList:[],
      visiableList:[],
      viTags: [],
      viLenth: 0,
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
      pickerOption: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    };
  },
  components: {
    ProDetail,
  },
  created() {
    // this.getData()
  },
   // 用于监听tab标签 用于打开、关闭标签
      computed: {
        menuActiveName: {
          get () { return this.$store.state.common.menuActiveName },
          set (val) { this.$store.commit('common/updateMenuActiveName', val) }
        },
        mainTabs: {
          get () { return this.$store.state.common.mainTabs },
          set (val) { this.$store.commit('common/updateMainTabs', val) }
        },
        mainTabsActiveName: {
          get () { return this.$store.state.common.mainTabsActiveName },
          set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
        }
      },
  methods: {
    resetForm (){
          this.$removeTab(this.mainTabsActiveName)
        },
    //返回
    comeBack() {
      this.$router.push({ name: 'project-project', params: {}})
    },
    //下一步
    nextStep(v) {
      if (v == 1) {
        this.checkStep1();
      }
      if (v == 2) {
        this.checkStep2();
      }
      if (v == 3) {
        this.checkStep3();
      }
      if (v == 4) {
        this.checkStep4();
        //this.checkStep2();
      }
    },
    //上一步
    preStep(v) {
      if (v == 2) {
        this.stepsActive = 1;
      }
      if (v == 3) {
        this.stepsActive = 2;
      }
      if (v == 4) {
        this.stepsActive = 3;
      }
    },
    // 第一步校验
    checkStep1() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          let submitData = this.dataForm;
          // console.log(submitData);
          this.stepsActive = 2;
          this.getProject()
        }
      });
    },

     // 参与人列表
    getProject () {
      this.$http({
        url: this.$http.adornUrl('/project/personnel/participant'),
        method: 'get',
        params: this.$http.adornParams({
          'query': this.headForm.query
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          console.log(data)
          this.participantList = data.page.list
        } else {
          this.$message.warning("数据获取失败！")
        }
      })
    },
    // checkbox点选
    checkinlist() {
      console.log(this.checkList)
      let parName = []
      this.participantList.forEach(item => {
        this.checkList.forEach(version => {
        item.uuid == version ? parName.push(item.realName) : ''
        })
      })
      this.tags = parName
      this.parLenth = this.checkList.length

    },
    // 清空
    clearPartipant() {
      this.checkList = []
      this.tags = []
      this.parLenth = 0
    },
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    // 第二步校验
    checkStep2() {
      if(!this.parLenth) {
        this.$message.warning("请选择项目参与人员！")
        return
      }
      this.getVisible()
      this.stepsActive = 3;
    },
    // 可见人列表
    getVisible () {
      this.$http({
        url: this.$http.adornUrl('/project/personnel/visible'),
        method: 'get',
        params: this.$http.adornParams({
          'query': this.visiableForm.query
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          console.log(data)
          this.visiableList = data.page.list
        } else {
          this.$message.warning("数据获取失败！")
        }
      })
    },
    visiableChange() {
      let visName = []
      this.visiableList.forEach(item => {
        this.viCheckList.forEach(version => {
        item.uuid == version ? visName.push(item.realName) : ''
        })
      })
      this.viTags = visName
      this.viLenth = this.viCheckList.length
    },
    // 清空
    clearVisiable() {
      this.viCheckList = []
      this.viTags = []
      this.viLenth = 0
    },
    viClose(tag) {
      this.viTags.splice(this.viTags.indexOf(tag), 1);
    },
    // 第三步校验
    checkStep3() {
      if(!this.viLenth) {
        this.$message.warning("请选择项目参与人员！")
        return
      }

      let submitData = {};
      submitData.beingTime = this.dataForm.beingTime
      submitData.projectName = this.dataForm.projectName
      submitData.budget = this.dataForm.budget
      submitData.participant = this.checkList
      submitData.visible = this.viCheckList
      console.log(submitData)
        this.$http({
          url: this.$http.adornUrl('/project/save'),
          method: 'post',
          data: submitData
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.pGuid = data.map.guid;
            this.pId = data.map.pId;
            console.log(this.pGuid)
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.stepsActive = 4;
                this.dataForm = []
                this.checkList = []
                this.viCheckList = []
              }
            })
          } else {
            this.$message.error(data.msg);
          }
        })

      
    },
    checkStep4() {
          this.$router.push({ name: 'project-info', params: {pGuid:this.pGuid,pId:this.pId}})
        
    }
  }
};
</script>
<style lang="scss">
#proInfo {
  .icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.5em;
  fill: currentColor;
  overflow: hidden;
}
    .step {
        margin-top: 50px;
    }
    .boxContent {
        margin-top: 100px;
        padding-left: 15%;
        padding-right: 15%;
        .dataForm {
            margin-left: 55%;
            transform: translate(-50%);
            .el-input {
                width: 220px;
            }
        }
        .personBox {
            margin-left:20px;
            margin-top:10px;
            .personContainer {
                margin-top: 20px;
                .el-tag {
                margin-left: 20px;
                 &:first-child {
                     margin-left: 0;
                 }
                }
               
            }
            
        }
        .header-form {
            .el-form-item {
                margin-bottom: 0;
            }
        }
        .header4 {
          padding: 20px;
          border: 1px solid #ccc;
        }
    }
  
  .box-sty {
    padding: 20px;
    margin: 20px;
    background-color: #fff;
    border-radius: 3px;
    overflow: hidden;
  }
  .box-sty:hover {
    cursor: pointer;
    box-shadow: 0 0 20px 10px rgba(0, 0, 0, 0.06);
    transition: all 0.5s;
  }
  .checkedBox {
    padding: 20px;
    padding-bottom: 40px;
    margin: 20px;
    border: 1px solid #ccc;
    .checkTop {
      margin-top: 20px;
      .checkedContainer {
        display: flex;
        height: 50px;
        margin-left: 20px;
        .left {
          width: 50px;
          height: 50px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .right {
          margin-left: 20px;
          position: relative;
          .bottom {
            position: absolute;
            bottom: 0;
            left: 0;
          }
        }
      }
    }
  }
}
// .el-checkbox__input {
//   position: absolute;
//   right: 0;
//   top: 33px;
// }
.el-checkbox + .el-checkbox {
  margin-left: 0;
}

</style>