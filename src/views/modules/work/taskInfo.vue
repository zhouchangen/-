<template>
  <div id="detailInfo">
    <div class="headLeft">
      <div class="headerSearchs">
        <h4>标题</h4>
        <div class="title" @click="editTitle(1)" ref="title">
          <!-- <span>积分模块数据库搭建</span> -->
          <el-badge :value="infoForm.statusStr" type="primary">
            <el-button size="small">{{infoForm.name}}</el-button>
          </el-badge>
          <span style="position:relative;left:20px;top:10px;">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-bianji"></use>
            </svg>
          </span>
        </div>
        <div class="inputContainer" v-if="titleInput">
          <el-input ref="inputFocus" v-model="changeForm.name"></el-input>
          <div class="btnTop" style="margin-left:20px;">
            <el-button @click="blurSearchFor(1)">取消</el-button>
            <el-button type="primary" @click="confirmEdit(1)">确定</el-button>
          </div>
        </div>
      </div>
      <div class="headerSearchs">
        <h4>描述</h4>
        <div class="dealPer">
          <!-- @click="editTitle(7)" -->
          <div class="title" @click="returnBottom()"  ref="dealDes" style="display:flex;">
            <span v-html="infoForm.notes"></span>
            <span style="margin-left:25px;">
              <!-- style="position:absolute;top:49.5%;" -->
              <svg class="icon" aria-hidden="true" style="position:relative;top:38%;">
                <use xlink:href="#icon-bianji"></use>
              </svg>
            </span>
          </div>
          <div class="inputContainer" id="inputContainer" v-if="desInput">
            <!--  -->
            <el-input
              type="textarea"
              ref="inputDes"
              :autosize="{ minRows: 2, maxRows: 6}"
              placeholder="请输入内容"
              v-model="changeForm.notes"
            ></el-input>
            <div class="btnTop" style="margin-left:20px;position: relative;top: 7px;">
              <el-button @click="blurSearchFor(7)">取消</el-button>
              <el-button type="primary" @click="confirmEdit(7)">确定</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="headerSearchs headerOver">
        <h4>变更历史</h4>
        <!-- v-show="item.after" -->
          <div class="desDetail" v-for="(item,index) in hisList" :key="index" v-show="item.before!=item.after">
            <div class="desName">
            <el-button type="primary" circle>{{item.user.slice(0,1)}}</el-button>
          </div>
          <div class="desInfo" >
            <div class="desNameInfo">{{item.user}}</div>
            <div class="desTime">{{item.time}}</div>
            <div class="description" >
              <div v-if="item.before!=item.after" style="margin-bottom:10px;">更改 {{item.type}}为{{item.after}}，更改前为 {{item.before}}</div>
              <div class="markTips" ref="markTips" style="display:flex;background:#e0e0e0;padding:10px 0 10px 10px;" v-if="item.mark ">
                <div class="markLeft" style="flex:1;">
                  描述：
                </div>
                <div class="markRight" style="flex:9;">
                  {{item.mark}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="headerSearchsForm">
        <h4>下一状态</h4>
        <div class="desDetails" id="desDetails">
          <div class="desNames">
            <el-form
              :model="ruleForm"
              status-icon
              :rules="rules2"
              ref="ruleForm"
              label-width="70px"
              class="demo-ruleForm"
            >
              <el-col :span="24">
                <el-form-item label="状态：" prop="checkStatus">
                  <el-radio-group v-model="ruleForm.checkStatus">
                    <el-radio
                      v-for="(item,index) in stausList"
                      :key="index"
                      :label="item.value"
                      :value="item.value"
                    >{{item.name}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="20">
                <!-- <div style="background:#e0e0e0;height:36px;margin-left:70px;">
                  <el-button type="primary" style="float:right" @click="Ushow()">选择图片</el-button>
                </div> -->
                <el-form-item label="描述：">
                  <!-- <el-input
                    type="textarea"
                    ref="areaInput"
                    :autosize="{ minRows: 3, maxRows: 9999}"
                    placeholder="请输入内容"
                    v-model="ruleForm.notes"
                  ></el-input> -->
                  <!-- v-model="ruleForm.notes" -->
                  <editor
            class ="editor"
            :value ="content"
            :setting  ="editorSetting"
            @show ="editors"
            :max-size = "MaxSize"
            :accept = "Accept"
            :with-credentials = "withCredentials"
            @on-upload-fail = "onEditorReady"
            @on-upload-success= "onEditorUploadComplete"></editor>
                </el-form-item>
              </el-col>
              <el-col :span="20">
                <el-form-item>
                  <!-- @click="addTask()" -->
                  <el-button type="primary" @click="formChange()">执行</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div class="headRight">
      <div class="headerSearchs">
        <h4 style="border-bottom:1px solid #ccc;padding-bottom:20px;">基本信息</h4>
        <div class="rightDetail">
          <div>创建人: {{infoForm.cURealName}}</div>
          <div class="dealPer">
            <div class="title" @click="editTitle(2)" ref="dealPer" v-popover:popover4>
              <span>处理人: {{infoForm.hURealName}}</span>
              <span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-bianji"></use>
                </svg>
              </span>
            </div>
            <!-- <div class="inputContainer" v-if="delInput"> -->
            <el-popover
              class="popContainer"
              ref="popover4"
              placement="bottom"
              width="450"
              trigger="click"
               v-model="visible"
            >
              <el-form
                :inline="true"
                :model="strForm"
                :label-position="labelPosition"
                label-width="80px"
                @keyup.enter.native="initData(1)"
              >
                <el-form-item label="处理人：">
                  <el-select
                    v-model="strForm.handleUser"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    @focus="tt"
                    :loading="loading"
                  >
                    <el-option
                      v-for="item in options4"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注：" class="tabText">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 6}"
                    placeholder="请输入内容"
                    v-model="strForm.mark"
                  ></el-input>
                </el-form-item>
                <el-form-item class="tableAdd">
                  <el-button @click="visible = !visible">取消</el-button>
                  <el-button type="primary" @click="confirmEdit(2)">确定</el-button>
                </el-form-item>
              </el-form>
            </el-popover>
          </div>
          <div class="cpmplete">状态: {{infoForm.statusStr}}</div>
          <div class="cpmplete">ID: {{infoForm.id}}</div>
          <div class="cpmplete">所属项目: {{infoForm.pName}}</div>
          <div class="dealPer">
            <div class="title" @click="editTitle(3)" ref="dealPointer">
              <span>所属节点: {{infoForm.vName}}</span>
              <span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-bianji"></use>
                </svg>
              </span>
            </div>
            <div class="inputContainerRight" v-if="pointerInput">
              <div class="rightPosition">
                <span class="pointName">节点：</span>
              <el-select  v-model="changeForm.versionUuid" class="pointSelect">
                <el-option
                  ref="inputPointer"
                  v-for="item in pointList"
                  :key="item.guid"
                  :label="item.name"
                  :value="item.guid">
                </el-option>
              </el-select>
              </div>
              <div style="margin-top: 20px;text-align:center;">
                <el-button type="primary" @click="pointCancel()" size="mini">取消</el-button>
                  <el-button type="primary" @click="confirmEdit(3)" size="mini">确定</el-button>
              </div>
              <!-- <el-input @blur="blurSearchFor(3)" ></el-input> -->
            </div>
          </div>
          <div class="cpmplete">类型: {{infoForm.typeStr}}</div>
          <div class="dealPer">
            <div class="title" @click="editTitle(4)" ref="dealLevel">
              <span>优先级: {{infoForm.levelStr}}</span>
              <span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-bianji"></use>
                </svg>
              </span>
            </div>
            <div class="inputContainerRight" v-if="levelInput">
              <div class="rightPosition">
                <span class="pointName">优先级：</span>
              <el-select  v-model="changeForm.level" class="pointSelect">
                <el-option
                  ref="inputPointer"
                  v-for="item in levelList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
              </div>
              <div style="margin-top: 20px;text-align:center;">
                <el-button type="primary" @click="levelCancel()" size="mini">取消</el-button>
                  <el-button type="primary" @click="confirmEdit(4)" size="mini">确定</el-button>
              </div>
              <!-- <el-input @blur="blurSearchFor(3)" ></el-input> -->
            </div>
          </div>

          <div class="cpmplete" v-show="typeShow">开始时间: {{infoForm.tBeingTime}}</div>
          <div class="cpmplete" v-show="typeShow">结束时间: {{infoForm.tEndTime}}</div>
        </div>
      </div>

      <div class="headerSearchs">
        <h4 style="border-bottom:1px solid #ccc;padding-bottom:20px;">{{typeShow?"工时信息" : "完成期限"}}</h4>
        <div class="rightDetail">
          <div class="dealPer" v-show="typeShow">
            <div class="title" @click="editTitle(5)" ref="dealTime">
              <span>工时预估: {{infoForm.esWorkingHours}}小时</span>
              <span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-bianji"></use>
                </svg>
              </span>
            </div>
            <div class="inputContainerRight" v-if="timeInput">
              <!-- <el-input @blur="blurSearchFor(5)" ref="inputTime"></el-input> -->
              <div class="rightPosition">
                <span class="pointName">修改为：</span>
                <el-input  ref="inputTime" v-model="changeForm.esWorkingHours">
                  <template slot="append">小时</template>
                </el-input>
              </div>
              <div style="margin-top: 20px;text-align:center;">
                <el-button type="primary" @click="timeCancel()" size="mini">取消</el-button>
                  <el-button type="primary" @click="confirmEdit(5)" size="mini">确定</el-button>
              </div>
            </div>
          </div>
          <div class="cpmplete" v-show="typeShow">剩余工时: {{leftWorking}}小时</div>
          <div class="cpmplete" v-show="typeShow">实际用时: {{truthWorking}}h</div>
          <div class="dealPer">
            <div class="title" @click="editTitle(6)" ref="dealDate">
              <span>完成期限： {{infoForm.tEsTime}}</span>
              <span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-bianji"></use>
                </svg>
              </span>
            </div>
            <div class="inputContainer" v-if="dateInput">
              <!-- <el-input  @blur="blurSearchFor(3)" ref="inputPointer"></el-input> -->
              <el-date-picker
                ref="timePicker"
                v-model="changeForm.esTime"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOption"
                @change="blurSearchFor(6)"
              ></el-date-picker>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <el-dialog style="" :title="title" @close="closeDialog" :visible.sync="dialogTabVisible" width="60% ">
         <editor
            class ="editor"
            :value ="content"
            :setting  ="editorSetting"
            @show ="editors"
            :max-size = "MaxSize"
            :accept = "Accept"
            :with-credentials = "withCredentials"
            @on-upload-fail = "onEditorReady"
            @on-upload-success= "onEditorUploadComplete"></editor>
        <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTabVisible = false">取 消</el-button>
        <el-button @click="confirmSubmit()">确 认</el-button>
        </div>
  </el-dialog> -->
  </div>
</template>

<script>
import editor from '@/components/editor/index.vue'
export default {
  // props: {
  //   vGuid : {
  //     type: String,
  //     required : true
  //   }
  // },
  data() {
    return {
      editorSetting: { // 配置富文本编辑器高
          height: 300
      },
      // Url: 'http://localhost:9528/api/PublicTransaction-SYS-Web/upload/singleUpload', // 图片对应的上传地址
      MaxSize: 7576500000000, // 文件大小
      Accept: 'image/jpeg, image/png, image/gif,image/jpg,', // 文件格式
      withCredentials: true,
      content: '', // 富文本编辑器双向绑定的内容,
      shouldShowUsers:true,
      typeShow:true,
      id: "",
      pGuid: "",
      vguid: "",
      truthWorking: "",
      leftWorking: "",
      hisList: [],
      labelPosition: "right",
      visible: false,
      titleInput: false,
      delInput: false,
      pointerInput: false,
      levelInput: false,
      timeInput: false,
      dateInput: false,
      desInput: false,
      formComplete: false,
      loading: false,
      levelList: [
        {name: "高", value: 1},
        {name: "中", value: 2},
        {name: "低", value: 3},
      ],
      stausList: [],
      checkList: [],
      pointList: [],
      list: [],
      options4: [],
      editForm: {},
      ruleForm: {
        checkStatus: 1,
        notes: ""
      },
      dateForm: {
        date: ""
      },
      infoForm: {},
      strForm: {
        notes: "",
        handleUser: ""
      },
      changeForm: {
        name: "",
        mark: "",
        notes: "",
        handleUser: "",
        versionUuid: "",
        level: "",
        esWorkingHours: "",
        esTime: "",
        id: "",
        status: 1,
      },
      rules2: {
        checkStatus: [
          { required: true, message: "请点选下一状态！", trigger: "blur" }
        ]
      },
      pickerOption: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    };
  },
  created() {
    this.infoForm = {};
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      this.getData();
      this.initData();
    }
    if(this.pGuid) this.getPoints
  },
  components: {
    editor
  },
  methods: {
    returnBottom() {
      document.querySelector("#desDetails").scrollIntoView(true);
    },
    confirmSubmit() {
      console.log(this.content)
      this.ruleForm.notes = this.content
      this.formChange()
    },
    editors(content) { // editor组件传过来的值赋给content
        console.log(content)
        this.content = content
      },
      onEditorReady(ins, ina) { // 上传失败的函数
        console.log('ins')
        console.log(ins)
        console.log(ina)
      },
      onEditorUploadComplete(json) { // 处理上传图片后返回数据，添加img标签到编辑框内
        console.log('json')
        console.log(json)
        // console.log(json[0].url)
        this.content = this.content + '<img src=' + json[0].url + ' style="width:100ox;height:100px;">'
      },
    
    // 工时预估
    timeCancel() {
      this.$refs.dealTime.style.display = "block";
        this.timeInput = false;
    },
    // 状态
    levelCancel() {
      this.$refs.dealLevel.style.display = "block";
        this.levelInput = false;
    },
    // 节点
    pointCancel() {
      this.$refs.dealPointer.style.display = "block";
      this.pointerInput = false;
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
    editTitle(num) {
      if (num == 1) {
        this.$refs.title.style.display = "none";
        this.titleInput = true;
        this.$nextTick(() => {
          this.$refs.inputFocus.focus();
        });
      } else if (num === 2) {
        this.delInput = true;
      } else if (num === 3) {
        this.$refs.dealPointer.style.display = "none";
        this.pointerInput = true;
      } else if (num === 4) {
        this.$refs.dealLevel.style.display = "none";
        this.levelInput = true;
      } else if (num === 5) {
        this.$refs.dealTime.style.display = "none";
        this.timeInput = true;
        this.$nextTick(() => {
          this.$refs.inputTime.focus();
        });
      } else if (num === 6) {
        this.$refs.dealDate.style.display = "none";
        this.dateInput = true;
      } else if (num === 7) {
        this.$refs.dealDes.style.display = "none";
        this.desInput = true;
        this.$nextTick(() => {
          this.$refs.inputDes.focus();
        });
      }
    },
    blurSearchFor(num) {
      if (num === 1) {
        this.$refs.title.style.display = "block";
        this.titleInput = false;
        this.changeForm.name = "";
      } else if (num === 2) {
        this.$refs.dealPer.style.display = "block";
        this.delInput = false;
        this.changeForm.handleUser = "";
      } else if (num === 6) {
        this.$refs.dealDate.style.display = "block";
        this.dateInput = false;
        console.log(this.changeForm)
        this.confirmEdit(6);
      } else if (num === 7) {
        this.$refs.dealDes.style.display = "block";
        this.desInput = false;
        this.changeForm.notes = "";
      }
    },
    // 下一步执行
    formChange() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.confirmEdit(8);
          setTimeout(() => {
            if (this.formComplete) {
              this.$refs["ruleForm"].resetFields(); //移除校验结果并重置字段值
              this.$refs["ruleForm"].clearValidate(); //移除校验结果
            }
          }, 2000);
        }
      });
    },
    confirmEdit(num) {
      // this.changeForm.versionUuid = this.infoForm.pvGuid;
      if(num === 1 ) {
        let name = this.changeForm.name
        this.changeForm = {}
        this.changeForm.name = name
        this.changeForm.id = this.id;
      } else if (num === 7) {
        let notes = this.changeForm.notes
        this.changeForm = {}
        this.changeForm.notes = notes
        this.changeForm.id = this.id;
      } else if (num === 8) {
        let status = this.ruleForm.checkStatus;
        let notes = this.content;
        this.changeForm = {}
        this.changeForm.notes = notes
        this.changeForm.status = status
        this.changeForm.id = this.id;
      } else if (num === 2) {
        let handleUser = this.strForm.handleUser
        let mark = this.strForm.mark
        this.changeForm = {}
        this.changeForm.handleUser = handleUser
        this.changeForm.mark = mark
        this.changeForm.id = this.id;
      } else if (num === 3) {
        let versionUuid = this.changeForm.versionUuid
        this.changeForm = {}
        this.changeForm.versionUuid = versionUuid
        this.changeForm.id = this.id;
      } else if (num === 4) {
        let level = this.changeForm.level
        this.changeForm = {}
        this.changeForm.level = level
        this.changeForm.id = this.id;
      } else if (num === 5) {
        let esWorkingHours = this.changeForm.esWorkingHours
        this.changeForm = {}
        this.changeForm.esWorkingHours = esWorkingHours
        this.changeForm.id = this.id;
      } else if (num === 6) {
        let esTime  = this.changeForm.esTime 
        this.changeForm = {}
        this.changeForm.esTime  = esTime 
        this.changeForm.id = this.id;
      } 
      // else if (num === 8) {
      //   let status = this.ruleForm.checkStatus;
      //   let notes = this.ruleForm.notes;
      //   this.changeForm = {}
      //   this.changeForm.status = status;
      //   this.changeForm.notes = notes;
      //   this.changeForm.id = this.id;
      // } 
      let submitData = this.changeForm;
      console.log(submitData)
      this.$http({
        url: this.$http.adornUrl("/workbench/task/update"),
        method: "post",
        data: submitData
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (num === 1) {
            this.$refs.title.style.display = "block";
            this.titleInput = false;
          } else if (num === 7) {
            this.$refs.dealDes.style.display = "block";
            this.desInput = false;
          } else if (num === 2) {
            this.visible = false
          } else if (num === 3) {
            this.$refs.dealPointer.style.display = "block";
            this.pointerInput = false;
            // this.changeForm.versionUuid = ''
          } else if (num === 4) {
            this.$refs.dealLevel.style.display = "block";
            this.levelInput = false;
            this.changeForm.level = ''
          } else if (num === 5) {
            this.$refs.dealTime.style.display = "block";
            this.timeInput = false;
            this.changeForm.esWorkingHours = ''
          } else if (num === 6) {
            this.$refs.dealDate.style.display = "block";
            this.dateInput = false;
            this.changeForm.tEsTime = ''
          } else if (num === 8) {
            this.$refs["ruleForm"].resetFields(); //移除校验结果并重置字段值
            this.$refs["ruleForm"].clearValidate(); //移除校验结果
          }
          // 关联formChange
          this.formComplete = true;
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getData();
              this.strForm = {};
            }
          });
          this.$refs["ruleForm"].resetFields(); //移除校验结果并重置字段值
          this.$refs["ruleForm"].clearValidate(); //移除校验结果
        } else {
          this.$message.error(data.msg);
          this.changeForm = {};
        }
      });
    },
    //获取节点
    getPoints () {
        this.$http({
        url: this.$http.adornUrl('/project/version/list/' + this.pGuid),
        method: 'get',
        params: this.$http.adornParams({})
        }).then(({data}) => {
        if (data && data.code === 0) {
            console.log(data)
            this.pointList = data.page.list
        } else {
            this.$message.warning("数据获取失败！")
        }
        })},
    //获取页面数据的方法
    getData() {
      this.$http({
        url: this.$http.adornUrl("/workbench/task/detail/" + this.id),
        method: "get",
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.detail.type === 1 ? this.typeShow = true : this.typeShow = false
          this.infoForm = data.detail;
          // infoForm.tBeingTime infoForm.tEndTime
          var date1 = new Date(this.infoForm.tEndTime);
          var date2 = new Date(this.infoForm.tBeingTime);
          var date = new Date();
          console.log(this.infoForm.esWorkingHours*60*60 -(date-date2)/1000)
          this.leftWorking = ((this.infoForm.esWorkingHours*60*60 -(date-date2)/1000)/(60*60)).toFixed(2)
          this.truthWorking = ((date2 - date1)/(60*60*1000)).toFixed(2)
          this.ruleForm.checkStatus = data.detail.status
          this.ruleForm.notes = data.detail.notes
          this.content = data.detail.notes
          this.pGuid = data.detail.pGuid;
          let record = JSON.parse(data.detail.record);
          this.hisList = record;
          this.hisList.forEach(item => {
            item.after ==='' ? this.shouldShowUsers = false : true
          })
          // if(this.hisList.length=1) {
          //   this.$refs.markTips.style.marginTop="0"
          // }
          this.getPoints()
          if(data.detail.type === 1) {
            if (data.detail.status === 1) {
            this.stausList = [
              { name: "保持未开始", value: 1 },
              { name: "进行中", value: 2 },
              { name: "已完成", value: 3 },
              { name: "已关闭", value: 4 }
            ];
            this.ruleForm.checkStatus = 1
            } else if (data.detail.status === 2) {
              this.stausList = [
                { name: "保持进行中", value: 2 },
                { name: "已完成", value: 3 },
                { name: "已关闭", value: 4 }
              ];
              this.ruleForm.checkStatus = 2
            } else if (data.detail.status === 3) {
              this.stausList = [
                { name: "保持已完成", value: 3 },
                { name: "重新打开", value: 5 }
              ];
              this.ruleForm.checkStatus = 3
            } else if (data.detail.status === 4) {
              this.stausList = [
                { name: "保持已关闭", value: 4 },
                { name: "重新打开", value: 5 }
              ];
              this.ruleForm.checkStatus = 4
            } else if (data.detail.status === 5) {
              this.stausList = [
                { name: "保持重新打开", value: 5 },
                { name: "已完成", value: 3 },
                { name: "已关闭", value: 4 }
              ];
              this.ruleForm.checkStatus = 5
            }
          } else if(data.detail.type === 2) {
              if (data.detail.status === 1) {
              this.stausList = [
                { name: "保持解决中", value: 1 },
                { name: "验收中", value: 2 },
                { name: "已关闭", value: 6 },
              ];
              this.ruleForm.checkStatus = 1
              } else if (data.detail.status === 2) {
                this.stausList = [
                  { name: "保持验收中", value: 2 },
                  { name: "已解决", value: 5 },
                  { name: "不通过", value: 3 },
                  { name: "已关闭", value: 6 }
                ];
                this.ruleForm.checkStatus = 2
              } else if (data.detail.status === 3) {
                this.stausList = [
                  { name: "保持不通过", value: 3 },
                  { name: "验收中", value: 2 },
                  { name: "已关闭", value: 6 }
                ];
                this.ruleForm.checkStatus = 3
              } else if (data.detail.status === 5) {
                this.stausList = [
                  { name: "保持已解决", value: 5 },
                  { name: "重新打开", value: 4 }
                ];
                this.ruleForm.checkStatus = 5
              } else if (data.detail.status === 4) {
                this.stausList = [
                  { name: "保持重新打开", value: 4 },
                  { name: "验收中", value: 2 },
                  { name: "已关闭", value: 6 }
                ];
                this.ruleForm.checkStatus = 4
              } else if (data.detail.status === 6) {
                this.stausList = [
                  { name: "保持已关闭", value: 6 },
                  { name: "重新打开", value: 4 },
                ];
                this.ruleForm.checkStatus = 6
              }
          }
          
        } else {
          this.$message.warning("数据获取失败！");
        }
      });
    }
  }
};
</script>

<style lang="scss">
#detailInfo {
  display: flex;
  .headLeft {
    flex: 7;
    margin-left: 10px;
  }
  .headRight {
    flex: 3;
    margin-left: 50px;
    .rightDetail {
      .cpmplete {
        margin-top: 20px;
      }
      .dealPer > div {
        margin-top: 20px;
      }
    }
  }
  .headerSearchs {
    margin-top: 10px;
    margin-bottom: 10px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    &.headerOver {
      max-height: 350px;
      overflow-y: auto;
    }

    .inputContainer {
      display: flex;
      .el-input {
        width: 50%;
      }
    }
    #inputContainer {
      .el-input--medium {
        flex: 9
      }
    }
    .inputContainerRight {
      .rightPosition {
        display: flex;
        .el-input {
        width: 80%;
      }
      .pointName {
        flex: 1;
        position: relative;
        top: 8px;
      }
      .pointSelect {
        flex: 3;
      }
      }
      
    }
    .desDetail {
      margin-top: 25px;
      display: flex;
      background: #f5f5f5;
      padding: 10px 0 10px 10px;
      .desName {
        flex: 1;
      }
      .desInfo {
        position: relative;
        top: 10px;
        flex: 12;
        display: flex;
        .desNameInfo {
          margin-left: 10px;
          flex: 1;
        }
        .desTime {
          margin-left: 10px;
          flex: 3;
        }
        .description {
          flex: 10;
        }
      }
    }
  }
  .headerSearchsForm {
    margin-top: 20px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    #desDetails {
      .el-textarea__inner {
        border-radius:0;
      }
    }
  }
}

.el-table {
  border: solid 1px rgba(204, 204, 204, 1);
  border-bottom: none;
  thead {
    color: #333;
    tr {
      th {
        font-weight: 500;
        background: rgba(242, 242, 242, 1);
        border-bottom: solid 1px rgba(204, 204, 204, 1);
      }
    }
  }
}
.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid rgba(204, 204, 204, 1);
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.tabText {
  width: 100%;
  .el-textarea__inner {
    width: 223px !important;
  }
}
</style>
