<template>
  <div id="fileApply" ref="fileApply">
    <div class="headerSearchInfo">
      <div class="topContent">
          文件列表
      </div>
      
      <div title="发送图片" style="position: relative;top:-10px;">
                <el-upload
                  :http-request="Upload"
                  :before-upload="beforeUpload"
                  multiple
                  action=""
                  :show-file-list='isShowList'>
                  <el-button type="primary" >上传文件</el-button>
                </el-upload>
              </div>
    </div>
    <el-table
      :data="applyList"
      style="width: 100%;overflow-x: auto"
    >
      <el-table-column header-align="center" align="center" type="index" label="序号" width="50"></el-table-column>
      <el-table-column header-align="center" align="center" prop="name" label="名称">
        <template slot-scope="scope">
            <span >
                <svg class="icon" aria-hidden="true" v-if="scope.row.type === 1">
                <use xlink:href="#icon-Pdf"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-if="scope.row.type === 2">
                <use xlink:href="#icon-img1"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-if="scope.row.type === 3">
                <use xlink:href="#icon-icon-bofang"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-if="scope.row.type === 4">
                <use xlink:href="#icon-TXT"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-if="scope.row.type === 5">
                <use xlink:href="#icon-word"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-if="scope.row.type === 6">
                <use xlink:href="#icon-rar"></use>
                </svg>
            </span>
            <span style="position:relative; top:-1px; margin-left:5px;">{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" header-align="center" align="center" label="操作">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="toDownload(scope.row.link)">下载</el-button>
          <el-button  type="text" size="small">
             <!-- @click="toRename(scope.row.id)" -->
            <el-popover class="popContainer" width="350" trigger="click">
            <el-form :inline="true" :model="renameForm" @keyup.enter.native="getDataList(1)">
              <el-form-item label="重命名：">
                <el-input v-model="renameForm.name" maxlength="20" ></el-input>
              </el-form-item>
              <el-form-item class="tableFile">
                  <el-button @click="cancel">取消</el-button>
                  <el-button type="primary" @click="toRename(scope.row.id)">确定</el-button>
                </el-form-item>
            </el-form>
            <span class="blueTip" slot="reference">重命名</span>
          </el-popover>
            
            </el-button>
          <el-button  type="text" size="small" @click="toDelete(scope.row.id)">删除</el-button>
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
  </div>
</template>

<script>
  import { getUUID } from '@/utils'
import { setTimeout } from 'timers';
import FileSaver from 'file-saver'
  export default {
    data () {
      return {
        isShowList: false,
        dataForm: {
          email: '',
          jobNumber: '',
          mobile: '',
          realName: '',
          capacity: 1,
        },
        filesSearchForm: {
          name: '',
          principal: 1,
          parentId: this.pId,
        },
         saveForm: {
          name: '',
          principal: 1,
          parentId: this.pId,
          link:'',
          type:1,
        },
        renameForm: {
          name:''
        },
        applyList: [],
        pageIndex: 1, // 表格显示页码
        amount: '', // 总金额
        totalCount: 0,
        page: 1,
        limit: 10,
      }
    },
    props: {
      pId : {
        type: String,
        required : true
      },
      // vId: {
      //   type: String,
      //   required : true
      // },
    },
    activated () {
      this.getDataList()
    },
    methods: {
      cancel() {
      this.$refs.fileApply.click();
    },
      toDownload(url) {
        FileSaver.saveAs(url)
      },
      toRename(id) {
        this.renameForm.id = id
        let submitData = this.renameForm
        this.$refs.fileApply.click();
        console.log(submitData)
        this.$http({
          url: this.$http.adornUrl('/project/files/rename'),
          method: 'post',
          data: submitData
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList(1)
              }
            })
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      toDelete(id) {
        let submitData = {}
        this.$http({
          url: this.$http.adornUrl('/project/files/delete/' + id),
          method: 'post',
          data: submitData
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList(1)
              }
            })
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      getDataList (num) {
        if (num) {this.pageIndex = num }
        this.$http({
          url: this.$http.adornUrl('/project/files/list?principal=' + 1 +'&parentId=' +this.pId),
          method: 'get',
          params: this.$http.adornParams({
            'name': this.filesSearchForm.name,
            'limit': this.limit,
            'pageNum': this.pageIndex
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
              console.log(data)
            this.applyList = data.list.list
            this.totalCount = data.list.totalCount
          } else {
            this.applyList = []
            this.totalPage = 0
          }
        })
      },
     
      beforeUpload (file) {
        const that = this
        let blob
        const reader = new FileReader();
        reader.readAsDataURL(file,"UTF-8");
     
        reader.onload = function (e) {
             let imgUrlUploadMsg64 = reader.result;
           that.$nextTick(() => {
             blob = that.dataURLtoBlob(imgUrlUploadMsg64)
        })
        }
        setTimeout(()=>{
          that.$http({
          url: that.$http.adornUrl('/project/files/getCommonSTS?app=' + 'tonghang.pm.admin'),
          method: 'get',
          params: that.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            let resData = JSON.parse(data.result).data
              that.AccessKeyId = resData.AccessKeyId
              that.AccessKeySecret = resData.AccessKeySecret
              that.SecurityToken = resData.SecurityToken
              that.BucketName = resData.BucketName
              that.Endpoint = resData.Endpoint

              const OSS = require('ali-oss')
              that.client = new OSS({
                endpoint: that.Endpoint,
                bucket: that.BucketName,
                accessKeyId: that.AccessKeyId,
                accessKeySecret: that.AccessKeySecret,
                stsToken: that.SecurityToken
              })
              that.folder = resData.path+'/message/' + getUUID() + '/'+ getUUID();
              console.log("that.folder" + that.folder)
              const progress = function (p) {
                return function (done) {
                  done()
                }
              }
              // 第二步：调用阿里云上传函数上传文件
                that.client.put(that.folder  + '.' + blob.type.split('/')[1], blob).then(function (result) {
                that.saveForm.link = result.url
                that.saveForm.name = file.name
                let type = blob.type.split('/')[1]
                if(type == 'jpg' || type == 'jpeg' || type == 'png' || type == 'gif') {
                  that.saveForm.type = 2
                } else if (type == 'pdf') {
                  that.saveForm.type = 1
                } else if (type == 'mp4' || type == 'm3u8' || type == 'rmvb' || type == 'avi' || type == 'swf' || type == '3gp' || type == 'mkv' || type == 'flv') {
                  that.saveForm.type = 3
                } else if (type == 'ppt' || type == 'doc' || type == 'docx' || type == 'wps' || type == 'xls' || type == 'xlsx' || type == 'msword') {
                  that.saveForm.type = 5
                } else if (type == 'zip' || type == 'rar') {
                  that.saveForm.type = 6
                } else {
                  that.saveForm.type = 4
                }

                // else if (type == 'txt') {
                //   that.saveForm.type = 4
                // }
                let submitData = that.saveForm
                console.log(submitData)
                that.$http({
                  url: that.$http.adornUrl('/project/files/save'),
                  method: 'post',
                  data: submitData
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    that.$message({
                      message: '操作成功',
                      type: 'success',
                      duration: 1500,
                      onClose: () => {
                        that.getDataList(1)
                      }
                    })
                  } else {
                    that.$message.error(data.msg);
                  }
                })
              }).catch(function (err) {
                console.log(err)
              })
          } else {
            
          }
        })
        },0)
      },
      getCaption(obj){
          var index=obj.lastIndexOf("\.");
          obj=obj.substring(index+1,obj.length);
        console.log(obj);
          return obj;
      },

      dataURLtoBlob: function(dataurl) {
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while(n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
          type: mime
        });
      },
      Upload(file) {

      },
      toDetail (id, no) {
        this.$router.push({name: 'apply-detail', params: {userId: id, no: no}})
      },
      handleCurrentChange (val) {
        this.pageIndex = val
        this.getDataList()
      }
    }
  }
</script>

<style lang="scss">
  .headerSearchInfo {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    border-bottom:solid 1px rgba(204, 204, 204, 1);
    // border:solid 1px rgba(204, 204, 204, 1) ;
  .el-form {
    padding:20px;
    
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
  .tableFile {
    display: block !important;
    margin-left: 25%;
    .el-form--inline .el-form-item {
      margin-left: 90%
    }
  }
</style>
