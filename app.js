//app.js
App({
  globalData:{
    access_token:''
  },
  onLaunch: function () {
    wx.request({
      method:"POST",
      url:"https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=PjeBvtvY7ci5faw1Qa8srIKs&client_secret=AFabgM3lhIuHemkKfKlUw6pILUAEzswy",
      success:(res)=>{
        // console.log(res);
        this.globalData.access_token=res.data.access_token
      },
      fail:()=>{
       wx:wx.showToast({
         title: '鉴权失败!'
       })
      }
    })
  }
 
})