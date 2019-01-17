<template>
  <div class="site-wrapper site-page--login">
    <!-- style="height:400px;width:400px;background:#e0e0e0" -->
    <div class="login-box">
      <div class="login-title">
        <h3 style="text-align:center;color:#3E8EF7">一点车项目管理系统</h3>
      </div>
      
    <div id="login_container" style="text-align: center; /*让div内部文字居中*/
    background-color: #fff;
    border-radius: 20px;
    width: 300px;
    height: 350px;
    margin: auto;
    position: absolute;
    z-index:100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;">
    </div>
    </div>
    
    <vue-particles
        color="#3E8EF7"
        :particleOpacity="0.7"
        :particlesNumber="120"
        shapeType="circle"
        :particleSize="4"
        linesColor="#dedede"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      >
      </vue-particles>

    <!-- <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">renren-fast-vue</h2>
          <p class="brand-info__intro">renren-fast-vue基于vue、element-ui构建开发，实现renren-fast后台管理前端功能，提供一套更优的前端解决方案。</p>
        </div>
        <div class="login-main">
          <div class="login-logo">
            <img src="~@/assets/img/logo.png" alt="">
          </div>
          <h3 class="login-title">管理员登录</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
  import { getUUID } from '@/utils'
import { setInterval } from 'timers';
  
  export default {
    data () {
      return {
        dataForm: {
          userName: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        dataRule: {
          userName: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          captcha: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        captchaPath: ''
      }
    },
    created () {
      // this.getCaptcha()
      setTimeout(() => {
        this.dingding()
      },1000)
    },
    
    methods: {
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/login'),
              method: 'post',
              data: this.$http.adornData({
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$cookie.set('token', data.token)
                this.$router.replace({ name: 'home' })
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      },

      dingding(gotoUrl) {
        var ding={"appid":"","agentid":"","corpid":"","uri":"","redirect_uri":"","code":"","accesstoken":""}; 
        ding.appid = "dingoapknkuddosrwibqjs";
        var response_type = "code";
        var scope = "snsapi_login";
        var state = "STATE";
        // https://www.tonghang360.com/api/ypad/
        // http://pmtst.vaiwan.com:8081
        ding.redirect_uri = "http://pmtst.vaiwan.com:8081/dingtalk/loginDd";
        ding.url = "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=" + ding.appid +
            "&response_type=" + response_type +
            "&scope=" + scope +
            "&state=" + state +
            "&redirect_uri=" + ding.redirect_uri;
        var rl = encodeURIComponent(ding.url);
        console.log(rl);
        console.log(global);
        global.DDLogin({
          id: 'login_container',
          goto: rl,
          style: "border:none;background-color:#FFFFFF;",
          width: '300',
          height: '300'
        });
        global.hanndleMessage = (event) => {
          const origin = event.origin;
            if (origin === 'https://login.dingtalk.com') { // 判断是否来自ddLogin扫码事件。
                const loginTmpCode = event.data; // 拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
                ding.code=loginTmpCode;
                window.parent.postMessage(loginTmpCode,'*');  
                var redirect_uri_check = "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=dingoapknkuddosrwibqjs&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=http://pmtst.vaiwan.com:8081/dingtalk/loginDd&loginTmpCode=";  
               console.log(redirect_uri_check+loginTmpCode)
               let u = redirect_uri_check+loginTmpCode
              window.location.href=redirect_uri_check+loginTmpCode; 
           }
        };
        if (typeof window.addEventListener != 'undefined') {
            window.addEventListener('message', global.hanndleMessage, false);
        } else if (typeof window.attachEvent != 'undefined') {
            window.attachEvent('onmessage', global.hanndleMessage);
        };
         
      }
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    // background-color: rgba(38, 50, 56, .6);
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      // background-image: url(~@/assets/img/login_bg.jpg);
      background-size: cover;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }
    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      position: absolute;
      top: 0;
      right: 0;
      padding: 150px 60px 180px;
      width: 470px;
      min-height: 100%;
      background-color: #fff;
    }
    .login-logo {
      width: 220px;
      height: 92px;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }
    .login-box {
      position: absolute;
    width: 450px;
    height: 450px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 10px 2px rgba(29, 26, 202, 0.2);
    border-radius: 5px;
    left: 50%;
    top: 50%;
    z-index: 20;
    transform: translate(-50%, -50%);
    .login-title {
      margin: 20px 0;
      h2 {
        font-size: 28px;
            line-height: 50px;
            text-align: center;
            color: #1890ff;
      }
            
    }
    }
    
  }
</style>
