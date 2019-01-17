export default{
  install(Vue,options)
  {
    Vue.prototype.$removeTab = function (tabName) {
      this.mainTabs = this.mainTabs.filter(item => item.name !== tabName)
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.mainTabsActiveName) {
          this.$router.push({ name: this.mainTabs[this.mainTabs.length - 1].name }, () => {
            this.mainTabsActiveName = this.$route.name
          })
        }
      } else {
        this.menuActiveName = ''
        this.$router.push({ name: 'home' })
      }
    }
  }
}
