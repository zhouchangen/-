<template>
  <div id="wTask" ref="wtf">
    <div class="topCount">
      <!-- <el-button @click="preStep(1)">今天{{todayCount}}</el-button>
      <el-button @click="preStep(2)">本周{{weekCount}}</el-button>
      <el-button @click="preStep(3)">自定义期限</el-button> -->
      <el-button @click="preStep(1)" type="danger" plain>今天{{todayCount}}</el-button>
      <el-button @click="preStep(2)" type="warning" plain>本周{{weekCount}}</el-button>
      <el-button @click="preStep(3)" type="primary" plain>自定义期限</el-button>
      <!-- <el-button type="primary" @click="preStep(4)">上一步</el-button> -->
      <!-- v-model="dateForm.date" -->
      <el-date-picker
        @change="pickTime($event)"
        v-model="dataForm.endTime"
        ref="timePicker"
        type="date"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOption"
      >
      </el-date-picker>
    </div>
    <div class="headerSearch">
      <el-form :inline="true" :model="dataForm">
        <el-form-item label="状态：">
          <el-select v-model="dataForm.status">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="优先级：">
          <el-select v-model="dataForm.level">
            <el-option
              v-for="item in priList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务ID：">
          <el-input v-model="dataForm.id" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="标题：">
          <el-input v-model="dataForm.name" maxlength="20" placeholder="请输入标题名称"></el-input>
        </el-form-item>
        <el-form-item label="处理人：">
          <el-input v-model="dataForm.hURealName" maxlength="20" placeholder="请输入处理人姓名"></el-input>
        </el-form-item>
        <el-form-item label="验收人：">
          <el-input v-model="dataForm.aURealName" maxlength="20" placeholder="请输入验收人姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList(1)">过滤</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="applyList" style="width: 100%;overflow-x: auto">
      <!-- <el-table-column header-align="center" align="center" type="index" label="序号" width="50"></el-table-column> -->
      <el-table-column header-align="center" align="center" prop="id" label="任务ID"></el-table-column>
      <el-table-column header-align="center" align="center" prop="name" label="标题">
        <template slot-scope="scope">
          <span
            @click="goDetail(scope.row.id)"
            style="color:#0099ff;cursor:pointer;"
          >{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="statusStr" label="状态">
        <template slot-scope="scope">
          <el-popover class="popContainer" width="650" trigger="click">
            <el-form :inline="true" :model="strForm" @keyup.enter.native="getDataList(1)">
              <el-form-item label="状态：">
                <el-radio-group v-model="strForm.status">
                  <el-radio
                    v-for="(item,value) in strList"
                    :key="value"
                    :label="item.value"
                    :value="item.value"
                  >{{item.name}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="备注：" class="tableC">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6}"
                  placeholder="请输入内容"
                  v-model="strForm.mark"
                ></el-input>
              </el-form-item>
              <el-form-item class="tableAdd">
                <el-button @click="cancel(1)">取消</el-button>
                <el-button type="primary" @click="changeStatus(scope.row,1)">确定</el-button>
              </el-form-item>
            </el-form>
            <span
              class="blueTip"
              @click="statusChange(scope.row.status)"
              v-if="scope.row.status === 1"
              slot="reference"
            >解决中</span>
            <span
              class="blueTip"
              @click="statusChange(scope.row.status)"
              v-if="scope.row.status === 2"
              slot="reference"
            >验收中</span>
            <span
              class="blueTip"
              @click="statusChange(scope.row.status)"
              v-if="scope.row.status === 3"
              slot="reference"
            >不通过</span>
            <span
              class="blueTip"
              @click="statusChange(scope.row.status)"
              v-if="scope.row.status === 4"
              slot="reference"
            >重新打开</span>
            <span
              class="blueTip"
              @click="statusChange(scope.row.status)"
              v-if="scope.row.status === 5"
              slot="reference"
            >已解决</span>
            <span
              class="blueTip"
              @click="statusChange(scope.row.status)"
              v-if="scope.row.status === 6"
              slot="reference"
            >已关闭</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="hURealName" label="处理人">
        <template slot-scope="scope">
          <el-popover class="popContainer" placement="bottom" width="450" trigger="click">
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
              <el-form-item label="备注：" class="tabInput">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6}"
                  placeholder="请输入内容"
                  v-model="strForm.mark"
                ></el-input>
              </el-form-item>
              <el-form-item class="tableAdd">
                <el-button @click="cancel(2)">取消</el-button>
                <el-button type="primary" @click="changeStatus(scope.row,2)">确定</el-button>
              </el-form-item>
            </el-form>
            <span class="blueTip" slot="reference">{{scope.row.hURealName}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="aURealName" label="验收人">
        <template slot-scope="scope">
          <el-popover class="popContainer" placement="bottom" width="450" trigger="click">
            <el-form
              :inline="true"
              :model="strForm"
              :label-position="labelPosition"
              label-width="80px"
              @keyup.enter.native="initData(1)"
            >
              <el-form-item label="验收人：">
                <el-select
                  v-model="strForm.acceptanceUser"
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
              <el-form-item label="备注：" class="tabInput">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6}"
                  placeholder="请输入内容"
                  v-model="strForm.mark"
                ></el-input>
              </el-form-item>
              <el-form-item class="tableAdd">
                <el-button @click="cancel()">取消</el-button>
                <el-button type="primary" @click="changeStatus(scope.row,4)">确定</el-button>
              </el-form-item>
            </el-form>
            <span class="blueTip" slot="reference">{{scope.row.aURealName}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="level" label="优先级">
        <template slot-scope="scope">
          <el-popover class="popContainer" width="350" trigger="click">
            <el-form :inline="true" :model="strForm" @keyup.enter.native="getDataList(1)">
              <el-form-item label="状态：">
                <el-select  v-model="strForm.level" class="pointSelect" @change="changeLevel($event,scope.row)">
                  <el-option
                    v-for="item in levelList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                    >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <span class="blueTip" slot="reference" v-if="scope.row.level === 1">高</span>
            <span class="blueTip" slot="reference" v-if="scope.row.level === 2">中</span>
            <span class="blueTip" slot="reference" v-if="scope.row.level === 3">低</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="esTime" label="完成期限"></el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20]"
      :page-size="limit"
      :total="totalCount"
      layout="total, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    // vGuid : {
    //   type: String,
    //   required : true
    // }
  },
  data() {
    return {
      list: [],
      options4: [],
      labelPosition: "right",
      loading: false,
      strList: [],
      priList: [
        { label: "全部", value: "" },
        { label: "高", value: "1" },
        { label: "中", value: "2" },
        { label: "低", value: "3" }
      ],
      statusList: [
        { label: "全部", value: "" },
        { label: "解决中", value: "1" },
        { label: "验收中", value: "2" },
        { label: "不通过", value: "3" },
        { label: "重新打开", value: "4" },
        { label: "已解决", value: "5" },
        { label: "已关闭", value: "6" },
      ],
      levelList: [
        {name: "高", value: 1},
        {name: "中", value: 2},
        {name: "低", value: 3},
      ],
      strForm: {
        status: 1,
        mark: "",
        versionUuid: "",
        id: "",
        handleUser: "",
        acceptanceUser: "",
        // esTime: "",
        // esWorkingHours: "",
        // level: "",
        // name: "",
        // notes: "",
        // hURealName: "",
        // aURealName: "",
        type: 2
      },
      dataForm: {
        type: 2,
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
      todayCount: "",
      weekCount: "",
      perDate: "",
      pickerOption: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      applyList: [],
      pageIndex: 1, // 表格显示页码
      amount: "", // 总金额
      totalCount: 0,
      page: 1,
      limit: 10
    };
  },
  created() {
    this.getDataList();
    this.initData();
  },
  methods: {
    changeLevel(selVal,row,num) {
      this.changeStatus(row,3)
    },
    cancel() {
      this.$refs.wtf.click();
      // this.getDataList();
    },
    statusChange(status) {
      if (status === 1) {
        this.strList = [
          { name: "保持解决中", value: 1 },
          { name: "验收中", value: 2 },
          { name: "不通过", value: 3 },
          { name: "已关闭", value: 6 }
        ];
        this.strForm.status = 1;
      } else if (status === 2) {
        this.strList = [
          { name: "保持验收中", value: 2 },
          { name: "已解决", value: 5 },
          { name: "不通过", value: 3 },
          { name: "已关闭", value: 6 }
        ];
        this.strForm.status = 2;
      } else if (status === 3) {
        this.strList = [
          { name: "保持不通过", value: 3 },
          { name: "验收中", value: 2 },
          { name: "已关闭", value: 6 }
        ];
        this.strForm.status = 3;
      } else if (status === 4) {
        this.strList = [
          { name: "保持重新打开", value: 4 },
          { name: "验收中", value: 2 },
          { name: "已关闭", value: 6 }
        ];
        this.strForm.status = 4;
      } else if (status === 5) {
        this.strList = [
          { name: "保持已解决", value: 5 },
          { name: "重新打开", value: 4 }
        ];
        this.strForm.status = 5;
      }
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
    changeStatus(row,num) {
      let strForm = this.strForm
      if(num===1) {
        let mark = this.strForm.mark
        let status = this.strForm.status
        this.strForm = {}
        this.strForm.id = row.id;
        this.strForm.mark = mark;
        this.strForm.status = status;
      }else if(num===2) {
        if(!this.strForm.handleUser) {
          this.$message.warning("请选择处理人！");
          return
        }
        let mark = this.strForm.mark
        let handleUser = this.strForm.handleUser
        this.strForm = {}
        this.strForm.id = row.id;
        this.strForm.mark = mark;
        this.strForm.handleUser = handleUser;
      } else if(num===3) {
        if(!this.strForm.level) {
          this.$message.warning("请选择优先级！");
          return
        } 
        let level = this.strForm.level
        this.strForm = {}
        this.strForm.id = row.id;
        this.strForm.level = level;
      } else if(num===4) {
        if(!this.strForm.acceptanceUser) {
          this.$message.warning("请选择验收人！");
          return
        } 
        let mark = this.strForm.mark
        let acceptanceUser = this.strForm.acceptanceUser
        this.strForm = {}
        this.strForm.id = row.id;
        this.strForm.mark = mark;
        this.strForm.acceptanceUser = acceptanceUser;
      }
      let submitData = this.strForm;
      // console.log(submitData);
      this.$refs.wtf.click();
      this.$http({
        url: this.$http.adornUrl("/workbench/task/update"),
        method: "post",
        data: submitData
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.strForm = strForm
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getDataList();
            }
          });
        } else {
          this.$message.error(data.msg);
          this.strForm = strForm
        }
      });
    },
    pickTime($event) {
      this.getDataList()
    },
    // 顶部条件展示
    preStep(num){
      if(num === 1) {
        // 今天
        let date = new Date();//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        this.dataForm.endTime =  this.timeFormate(date)
      } else if(num === 2) {
        // 本周
        let now = new Date(); 
        let nowTime = now.getTime() ; 
        let day = now.getDay();
        let oneDayLong = 24*60*60*1000 ; 
        let MondayTime = nowTime - (day-1)*oneDayLong  ; 
        let SundayTime =  nowTime + (7-day)*oneDayLong ; 
        let monday = new Date(MondayTime);
        this.dataForm.startTime = this.timeFormate(monday)
        let sunday = new Date(SundayTime);
        this.dataForm.endTime = this.timeFormate(sunday)
      } 
      this.getDataList()
    },
    timeFormate(date) {
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      let D = date.getDate();
      let aa = Y+M+D
      return aa
    },
    getDataList(num) {
      if (num) {
        this.pageIndex = num;
      }
      this.$http({
        url: this.$http.adornUrl("/workbench/task/myList?finish=" + false + "&type=" + 2),
        method: "get",
        params: this.$http.adornParams({
          'type': this.dataForm.type,
          'id': this.dataForm.id,
          'name': this.dataForm.name,
          'hURealName': this.dataForm.hURealName,
          'aURealName': this.dataForm.aURealName,
          'level': this.dataForm.level,
          'startTime': this.dataForm.startTime,
          'endTime': this.dataForm.endTime,
          'status': this.dataForm.status,
          'vUuid': this.dataForm.vUuid,
          'finish': this.dataForm.finish,
          'limit': this.limit,
          'page': this.pageIndex
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.applyList = data.task.pageUtils.list;
          this.todayCount = data.task.todayCount;
          this.weekCount = data.task.weekCount;
          this.totalCount = data.task.pageUtils.totalCount;
        } else {
          this.applyList = [];
          this.totalPage = 0;
        }
      });
    },
    goDetail(id) {
      this.$router.push({ name: "work-tkdetail", params: { id: id,eltab:'second' } });
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getDataList();
    }
  }
};
</script>

<style lang="scss">
#wTask {
  .topCount {
    margin-bottom: 35px;
    .el-button + .el-button {
      margin-left: -5px;
    }
    .el-button--medium {
      border-radius: 0;
    }
    .el-button {
      border-radius: 0;
    }
  }
  .headerSearch {
    margin-bottom: 10px;
    border: solid 1px rgba(204, 204, 204, 1);
    .el-form {
      padding: 20px;
      // border-bottom: solid 1px rgba(204, 204, 204, 1);
      .el-form-item {
        padding: 6px 0;
        margin-bottom: 0;
      }
    }
    .total {
      height: 50px;
      line-height: 50px;
      padding-left: 10px;
    }
  }

  .blueTip {
    color: #0099ff !important;
    cursor: pointer;
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
.tableC {
  width: 100%;
  .el-textarea__inner {
    width: 510px !important;
  }
}
.tabInput {
  .el-textarea__inner {
    width: 220px !important;
  }
}
.tableAdd {
  width: 100%;
  text-align: center;
}
</style>
