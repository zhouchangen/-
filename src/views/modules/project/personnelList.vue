<template>
  <div>
    <div class="headerSearch">
      <el-form  :inline="true" :model="dataForm"  @keyup.enter.native="getDataList()" >
        <el-form-item label="姓名" >
          <el-input v-model="dataForm.realName" maxlength="20" ></el-input>
        </el-form-item>
        <el-form-item label="工号：" >
          <el-input v-model="dataForm.jobNumber" maxlength="20"  placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" >
          <el-input v-model="dataForm.mobile" maxlength="20"  placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" >
          <el-input v-model="dataForm.email" maxlength="20" placeholder="请输入邮箱账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList(1)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addPerson()">新增参与人员</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="applyList"
      style="width: 100%;overflow-x: auto"
    >
      <!-- <el-table-column header-align="center" align="center" type="index" label="序号" width="50"></el-table-column> -->
      <el-table-column header-align="center" align="center" prop="realName" label="姓名"></el-table-column>
      <el-table-column header-align="center" align="center"  prop="jobNumber" label="工号"></el-table-column>
      <el-table-column header-align="center" align="center"  prop="mobile" label="联系电话"></el-table-column>
      <el-table-column header-align="center" align="center"  prop="email" label="邮箱"></el-table-column>

      <el-table-column fixed="right" header-align="center" align="center" label="操作">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="toDelete(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20]"
      :page-size="limit"
      :total="totalCount"
      layout="total, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog style="" :title="title" @close="closeDialog" :visible.sync="dialogTabVisible" width="20% ">
            <el-form
              :inline="true"
              :model="strForm"
              :label-position="labelPosition"
              label-width="80px"
              @keyup.enter.native="initData(1)"
            >
              <el-form-item label="参与人：">
                <el-select
                  v-model="hURealName"
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
              <el-form-item class="tableAdd">
                <el-button @click="cancelNotes()">取消</el-button>
                <el-button type="primary" @click="changeStatus()">确定</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        dataForm: {
          email: '',
          jobNumber: '',
          mobile: '',
          realName: '',
          capacity: 1,
        },
        strForm: {
          participant: [],
          visible: [],
          type: 1,
          projectUuid: '',
        },
        hURealName: '',
        title:"新增参与人员",
        list: [],
        options4: [],
        labelPosition: "right",
        loading: false,
        applyList: [],
        dialogTabVisible: false,
        pageIndex: 1, // 表格显示页码
        amount: '', // 总金额
        totalCount: 0,
        page: 1,
        limit: 10,
      }
    },
    props: {
      pId : {
        type: Number,
        required : true
      },
      pGuid : {
        type: String,
        required : true
      },
    },
    activated () {
      this.getDataList()
      this.initData()
      this.getVisable()
      this.strForm.projectUuid = this.pGuid
    },
    methods: {
    closeDialog() {
      this.strForm = {}
    },
    cancelNotes(){
      this.dialogTabVisible = false
      this.hURealName = ''
    },
    addPerson() {
      this.dialogTabVisible = true
      console.log(this.strForm)
    },
    changeStatus() {
        if(!this.hURealName) {
          this.$message.warning("请选择处理人！");
          return
        }
      this.strForm.participant.push(this.hURealName);
      let submitData = this.strForm;
      console.log(submitData);
      this.$http({
        url: this.$http.adornUrl("/project/addParticipant"),
        method: "post",
        data: submitData
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.dialogTabVisible = false
              this.getDataList()
            }
          });
        } else {
          this.$message.error(data.msg);
          this.getDataList()
          this.dialogTabVisible = false
        }
      });
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
    getDataList (num) {
        if (num) {this.pageIndex = num }
        this.$http({
          url: this.$http.adornUrl('/project/personnel/' + this.pGuid),
          method: 'get',
          params: this.$http.adornParams({
            'email': this.dataForm.email,
            'jobNumber': this.dataForm.jobNumber,
            'mobile': this.dataForm.mobile,
            'realName': this.dataForm.realName,
            'capacity': this.dataForm.capacity,
            'limit': this.limit,
            'page': this.pageIndex
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
              console.log(data)
            this.applyList = data.page.list
            // 新增参与人
            // let parArr = []
            // data.page.list.forEach(item => {
            //   parArr.push(item.uuid)
            // })
            // this.strForm.participant = parArr
            this.totalCount = data.page.totalCount
          } else {
            this.applyList = []
            this.totalPage = 0
          }
        })
      },
      getVisable () {
        this.$http({
          url: this.$http.adornUrl('/project/personnel/visible'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            let viArr = []
            data.page.list.forEach(item =>{
              viArr.push(item.uuid)
            })
            this.strForm.visible = viArr
          } else {
          }
        })
      },
      toDelete (row) {
        let perForm = {}
        let submitData = perForm;
            this.$http({
              url: this.$http.adornUrl('/project/personnel/delete/' + row.id),
              method: 'post',
              data: submitData
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.getDataList();
                  }
                })
              } else {
                this.$message.error(data.msg);
              }
            })
      },
      handleCurrentChange (val) {
        this.pageIndex = val
        this.getDataList()
      }
    }
  }
</script>

<style lang="scss">
  .headerSearch {
    margin-bottom: 10px;
    border:solid 1px rgba(204, 204, 204, 1) ;
  .el-form {
    padding:20px;
    // border-bottom:solid 1px rgba(204, 204, 204, 1);
  .el-form-item {
    padding: 6px 0;
    margin-bottom: 0;
  }
  }
  .total {
    height: 50px ;
    line-height: 50px;
    padding-left: 10px ;
  }
  }
  .el-table{
    border:solid 1px rgba(204, 204, 204, 1);
    border-bottom:none;
  thead {
    color: #333;
  tr {
  th {
    font-weight: 500;
    background:rgba(242, 242, 242, 1);
    border-bottom:solid 1px rgba(204, 204, 204, 1);
  }
  }
  }
  }
  .el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid rgba(204, 204, 204, 1);;
  }
</style>
