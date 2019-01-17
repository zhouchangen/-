<template>

  <div id="addContainer" ref="addContainer">
    <el-container>
      <el-header>新建</el-header>
      <el-main>
        <el-form :model='ruleForm' status-icon :rules='rules2' ref='ruleForm' label-width='200px' class='demo-ruleForm'>
          <el-col :span='12'>
            <el-form-item label='所属项目：' prop='projectUuid'>
              <!-- :disabled="proDisable" -->
              <el-select  v-model="ruleForm.projectUuid" @change="pickProject($event)" >
                    <el-option
                    v-for="item in projectList"
                    :key="item.pGuid"
                    :label="item.projectName"
                    :value="item.pGuid"
                    >
                    </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <!-- :disabled="versionDisable" -->
            <el-form-item label='所属节点：' prop='versionUuid'>
              <el-select  v-model="ruleForm.versionUuid"  v-if="versionDisable">
                    <el-option
                      v-for="version in primaryList"
                      :key="version.vGuid"
                      :label="version.projectVersionName"
                      :value="version.vGuid"
                    >
                    </el-option>
              </el-select>
              <!-- :disabled="versionDisable" -->
              <el-select  v-model="ruleForm.versionUuid"  v-else>
                    <el-option
                    v-for="version in priList"
                    :key="version.guid"
                    :label="version.name"
                    :value="version.guid"
                    >
                    </el-option>
              </el-select>
              
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='任务名称：' prop='name'>
              <el-input v-model='ruleForm.name'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='优先等级：'>
              <el-select  v-model="ruleForm.level" >
                    <el-option
                    v-for="item in levList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='24'>
            <el-form-item label='新建类型：'>
              <!-- :disabled="taskDisable" -->
              <el-radio-group v-model="ruleForm.type" >
                <el-radio  :label="1">任务</el-radio>
                <el-radio  :label="2">bug</el-radio>
            </el-radio-group>
            </el-form-item>
          </el-col>
          
          <el-col :span='12'>
            <el-form-item label='处理人：' prop='handleUser'>
              <!-- <el-input v-model='ruleForm.handleUser'></el-input> -->
              <el-button type='primary'>
                 <!-- @click = 'choosePerson()' -->
                <!-- <span v-if="!personInfo">请选择</span>
                <span v-else>{{personInfo}}</span> -->
                <el-popover class="popContainer" ref="popover3" placement="bottom" width="250" trigger="click">
                  <el-select
                    v-model="ruleForm.handleUser"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    @focus="tt"
                    @change="changePerson($event)"
                    :loading="loading"
                  >
                    <el-option
                      v-for="item in options4"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    ></el-option>
                  </el-select>
                  
                </el-popover>
                <span class="blueTip" v-popover:popover3 v-if="!personInfo">请选择</span>
                  <span class="blueTip" v-popover:popover3 v-else>{{personInfo}}</span>
                </el-button>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='完成时间：'>
              <el-date-picker style='width: 100%;' 
              v-model='ruleForm.esTime'  
              type='date' 
              value-format='yyyy-MM-dd' 
              :picker-options= 'pickerOption'
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='12' v-if="ruleForm.type === 1">
            <el-form-item label='任务工时：'>
              <el-input v-model='ruleForm.esWorkingHours'>
                  <template slot="append">小时</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12' v-if="ruleForm.type === 2">
            <el-form-item label='验收人：'  prop='acceptanceUser'>
              <el-button type='primary' >
                <!-- <span v-if="!checkInfo">请选择</span>
                <span v-else>{{checkInfo}}</span> -->
                <el-popover class="popContainer" ref="popover" placement="bottom" width="250" trigger="click">
                  <el-select
                    v-model="ruleForm.acceptanceUser"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethodYan"
                    @focus="tt"
                    @change="changePersonYan($event)"
                    :loading="loadingYan"
                  >
                    <el-option
                      v-for="item in options4"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    ></el-option>
                  </el-select>
                  
                </el-popover>
                <span class="blueTip" v-popover:popover v-if="!checkInfo">请选择</span>
                  <span class="blueTip" v-popover:popover v-else>{{checkInfo}}</span>
                </el-button>
            </el-form-item>
          </el-col>
          <el-col :span='20'>
            <el-form-item label='描述：' prop='notes'>
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6}"
                placeholder="请输入内容"
                v-model="ruleForm.notes">
            </el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-main>
    </el-container>
    <div style='text-align: center;'>
      <el-button type='primary' icon='el-icon-refresh' @click = 'resetForm()'>返回</el-button>
      <el-button type='primary' icon='el-icon-message' @click = 'submitForm()'>创建</el-button>
    </div>
  </div>
</template>

<script>
    export default {
      data () {
        return {
          
            list: [],// 处理人
            options4: [],
            loading: false,
            listYan: [],// 处理人
            options4Yan: [],
            loadingYan: false,
            type:'',
            // proDisable: false,
            // taskDisable: false,
            versionDisable: false,
            dialogTabVisible: false,
            dialogCheckVisible: false,
            personInfo:'',
            checkInfo:'',
            proIndex:false,
            priList: [],
            primaryList: [],
            projectList: [],
            participantList: [],
            levList: [
              {label: '高', value: '1'},
              {label: '中', value: '2'},
              {label: '低', value: '3'}
            ],
            ruleForm: {
                projectUuid: '',
                versionUuid: '',
                name: '',
                level: '2',
                type: 1,
                handleUser: '',
                esTime: '',
                esWorkingHours: '',
                acceptanceUser: '',
                notes: '',
            },
            rules2: {
                name: [
                { required: true, message: '请输入任务名称', trigger: 'blur' },
                { min: 1, max: 40, message: '请输入1-40位字符', trigger: 'blur' }
                ],
                projectUuid: [
                { required: true, message: '请选择所属项目', trigger: 'blur' },
                ],
                versionUuid: [
                { required: true, message: '请输选择项目所属节点', trigger: 'blur' }
                ],
                handleUser: [
                { required: true, message: '请选择处理人', trigger: 'blur' },
                ],
                acceptanceUser: [
                { required: true, message: '请选择处理人', trigger: 'blur' },
                ],
                notes: [
                { required: true, message: '请输入描述内容', trigger: 'blur' },
                ],
            },
            pickerOption: {
            disabledDate(time) {
            return time.getTime() < Date.now();
            }
        }
        }
      },
      created () { // 页面加载就加载表格数据
        this.url = this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`)
        this.getProject()
        this.fromType()
        if(this.$route.params.type || this.$route.params.pGuid || this.$route.params.vGuid){
          this.pGuid = this.$route.params.pGuid;
          this.type = this.$route.params.type;
          this.vGuid = this.$route.params.vGuid;
          this.proIndex = true
          if(this.type ===1 ) {
            setTimeout(() => {
              this.judgeFrom(1)
              this.getParticipant(this.pGuid)
            },300)
          } else if (this.type ===2) {
            setTimeout(() => {
              this.judgeFrom(2)
              this.getParticipant(this.pGuid)
            },300)
          }
        }
        this.initData()
        this.initDataYan()
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
        changePerson($event,num) {
          console.log($event)
          if(num=1) {
            this.ruleForm.handleUser = $event
            this.list.forEach(item => {
              $event === item.label ? this.personInfo = item.value : ''
            })
            console.log(this.ruleForm)
          } else if(num=2){
            this.ruleForm.acceptanceUser = $event
            this.list.forEach(item => {
              $event === item.label ? this.checkInfo = item.value : ''
            })
            console.log(this.ruleForm)
          }
          this.$refs.addContainer.click()
        },
        // 处理人
        initData() {
          this.$http({
            url: this.$http.adornUrl("/project/personnel/participant"),
            method: "get",
            params: this.$http.adornParams({})
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.list = data.page.list.map(item => {
                return { value: item.realName, label: item.uuid };
              });
            } else {
              this.$message.warning("数据获取失败！");
            }
          });
        },
        // focus 初始化select列表
        tt() {
          this.options4 = this.list;
        },
        // 联想搜索
        remoteMethod(query) {
          if (query !== "") {
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
              this.options4 = this.list.filter(item => {
                if (item.value) {
                  return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
                }
              });
            }, 200);
          } else {
            this.options4 = [];
          }
        },
        changePersonYan($event) {
            this.ruleForm.acceptanceUser = $event
            this.listYan.forEach(item => {
              $event === item.label ? this.checkInfo = item.value : ''
            })
            this.$refs.addContainer.click()
        },
        // 处理人
        initDataYan() {
          this.$http({
            url: this.$http.adornUrl("/project/personnel/participant"),
            method: "get",
            params: this.$http.adornParams({})
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.listYan = data.page.list.map(item => {
                return { value: item.realName, label: item.uuid };
              });
            } else {
              this.$message.warning("数据获取失败！");
            }
          });
        },
        // focus 初始化select列表
        ttYan() {
          this.options4 = this.listYan;
        },
        // 联想搜索
        remoteMethodYan(query) {
          if (query !== "") {
            this.loading = true;
            setTimeout(() => {
              this.loadingYan = false;
              this.options4 = this.list.filter(item => {
                if (item.value) {
                  return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
                }
              });
            }, 200);
          } else {
            this.options4 = [];
          }
        },
        fromType() {
          if(this.$route.params.typeJuDge === 1) {
            this.ruleForm.type = 1
          } else {
            this.ruleForm.type = 2
          }
        },
        // 处理人
        choosePerson() {
          if(!this.proIndex) {
            this.$message.warning("请选择所属项目！")
            return
          }
          this.dialogTabVisible = true
        },
        
        // 验收人
        chooseCheck() {
          if(!this.proIndex) {
            this.$message.warning("请选择所属项目！")
            return
          }
          this.dialogCheckVisible = true
        },
        // 验收人弹框
        checkClick(row) {
          console.log(row)
            this.checkInfo = row.realName
            this.ruleForm.acceptanceUser = row.uuid
            this.dialogCheckVisible = false
        },
        
        closeDialog() {
            
        },
        // 非工作台任务/bug添加
        judgeFrom(num) {
          this.getProject()
          if(num === 1) {
            this.ruleForm.type = 1
          }
          if(num === 2) {
            this.ruleForm.type = 2
          }
          // this.taskDisable = true
          // this.proDisable = true
          this.versionDisable = true
          this.projectList.forEach(item => {
            // this.primaryList = item.projectVersionListVoList
            this.pGuid===item.pGuid? this.ruleForm.projectUuid = item.pGuid : ''
            this.pGuid===item.pGuid? this.primaryList = item.projectVersionListVoList : ''
            item.projectVersionListVoList.forEach(version => {
              this.vGuid===version.vGuid? this.ruleForm.versionUuid = version.vGuid : ''
            })
          })

        },
        //   项目可参与人员
        getParticipant (index) {
          this.$http({
            url: this.$http.adornUrl('/project/personnel/' + index),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.participantList = data.page.list
            } else {
              this.$message.warning("数据获取失败！")
            }
          })
        },
        //   项目列表
        getProject () {
          this.$http({
            url: this.$http.adornUrl('/project/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.projectList = data.list
            } else {
              this.$message.warning("数据获取失败！")
            }
          })
        },
        // 项目选择节点
        pickProject (index) {
          this.priList = []
          this.primaryList = []
          this.ruleForm.versionUuid = ''
          this.proIndex = true
          this.versionDisable = false
          this.getParticipant(index)
          this.$http({
            url: this.$http.adornUrl('/project/version/list/' + index),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.priList = data.page.list
            } else {
              this.$message.warning("数据获取失败！")
            }
          })
        },

        submitForm (ruleForm) { // 提交表单
          // 自定义表单的判断
          this.$refs.ruleForm.validate(valid => {
            if (valid) {
              let submitData = this.ruleForm
              this.$http({
                url: this.$http.adornUrl('/workbench/task/save'),
                method: 'post',
                data: submitData
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.ruleForm = ''
                      this.$removeTab(this.mainTabsActiveName)
                      this.$router.push({ name: 'work-list'})
                    }
                  })
                } else {
                  this.$message.error(data.msg)
                }
              })

            } else { // 表单自定义验证报错的else
              console.log('error submit!!')
              return false
            }
          })
        },
        resetForm (){
          this.$removeTab(this.mainTabsActiveName)
        }
      }
    }
</script>

<style lang='scss'>
  #addContainer {
      margin: 10%;
      margin-top: 20px;
      .el-col-12 {
        height: 59px;
      }
       .el-container{
    border:solid 1px rgba(204, 204, 204, 1);
    margin-bottom: 10px;
    .el-header{
      height: 40px !important;
      line-height: 40px;
      background: rgba(242, 242, 242, 1);
      padding-left: 10px;
      border-bottom: solid 1px rgba(204, 204, 204, 1);
    }
  }
  }
 
  .basicInfo .grid-content {
    height: 40px;
    line-height: 40px;
  }
</style>
