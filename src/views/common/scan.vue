<template>
  <div id="scanLogin">
      <!-- <qrcode :size="200" :value="qcode"></qrcode> -->
  </div>
</template>
<script type="text/javascript" src="//g.alicdn.com/dingding/dinglogin/0.0.5/ddLogin.js"></script>
<script>
  //  import qrcode from 'qrcode'
  import { getUUID } from '@/utils'
 
  export default {
    data () {
      return {
          qcode:'',
        dataForm: {
          userName: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        captchaPath: ''
      }
    },
    created () {
      this.getCaptcha()
    },
    components: {qrcode},
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

    hanndleMessage (event) {
        var origin = event.origin;
        console.log("origin", event.origin);
        if (origin == "https://login.dingtalk.com") { //判断是否来自ddLogin扫码事件。
            var loginTmpCode = event.data; //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
            console.log("loginTmpCode", loginTmpCode);
            let posturl = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=APPID&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=REDIRECT_URI&loginTmpCode=loginTmpCode`
            this.$http({
                url: posturl,
                method: 'get',
                params: this.$http.adornParams({})
            }).then(({data}) => {
                console.log(data)
                if (data && data.code === 0) {
                console.log(data)
                this.visiableList = data.page.list
                } else {
                this.$message.warning("数据获取失败！")
                }
            })

        }
    },
    

    },

    
  };
   var appid = "dingoa7zpo3zjufv2wbefy";
        var response_type = "code";
        var scope = "snsapi_login";
        var state = "STATE";
        var redirect_uri = "http://192.168.11.150:8209/dingtalk/loginDd";

        var url = "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=" + appid +
            "&response_type=" + response_type +
            "&scope=" + scope +
            "&state=" + state +
            "&redirect_uri=" + redirect_uri;
        var rl = encodeURIComponent(url);

        console.log(rl);

        var obj = DDLogin({
            //这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
            id: "login_container",
            goto: rl, //请参考注释里的方式
            style: "border:none;background-color:#FFFFFF;",
            width: "365",
            height: "400"
        });
        var hanndleMessage = function(event) {
        var origin = event.origin;
        console.log("origin", event.origin);
        if (origin == "https://login.dingtalk.com") { //判断是否来自ddLogin扫码事件。
            var loginTmpCode = event.data; //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
            console.log("loginTmpCode", loginTmpCode);
            let posturl = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=APPID&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=REDIRECT_URI&loginTmpCode=loginTmpCode`
            this.$http({
                url: posturl,
                method: 'get',
                params: this.$http.adornParams({})
            }).then(({data}) => {
                console.log(data)
                if (data && data.code === 0) {
                console.log(data)
                this.visiableList = data.page.list
                } else {
                this.$message.warning("数据获取失败！")
                }
            })

        }
    };
if (typeof window.addEventListener != 'undefined') {
    window.addEventListener('message', this.hanndleMessage, false);
} else if (typeof window.attachEvent != 'undefined') {
    window.attachEvent('onmessage', this.hanndleMessage);
}
</script>

<style lang="scss">
  #scanLogin {
      background:#3E8EF7;
    canvas{
        margin: 0;
        padding: 0;
        display: block; /*  ˉ\_(ツ)_/ˉ  */
        touch-action: none; 
    }
  }
  
</style>
