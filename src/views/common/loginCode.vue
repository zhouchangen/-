<template>
  <div class="site-wrapper site-page--login">
    <!-- style="height:400px;width:400px;background:#e0e0e0" -->
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getUUID } from '@/utils'
import { setInterval } from 'timers';
  
  export default {
    data () {
      return {
      }
    },
    created () {
      setTimeout(() => {
        this.formSubmit()
      },1000)
    },
    
    methods: {
      formSubmit() {
          this.token = this.getUrlKey('token')
          this.code = this.getUrlKey('code')
          console.log(this.token)
          if(this.code===500) {
              this.$router.replace({ name: 'error' })
          }
          if(this.token) {
            this.$cookie.set('token', this.token)
            this.$router.replace({ name: 'home' })
          }
      },
         getUrlKey(name){
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
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
