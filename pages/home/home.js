// pages/home/home.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wh:0,
    position:"front",
    src:'',
    isShowPic:false,
    // 人脸识别信息
    faceInfo:null,
    isShowFace:false,
    // 英文翻译成中文
    map:{
      gender:{
        male:"男",female:"女"
      },
      expression:{
        none:"不笑",smile:"微笑",laugh:"大笑"
      },
      glasses:{
        none:"无眼镜",common:"普通眼镜",sun:"墨镜"
      },
      emotion:{
        angry:"愤怒", disgust:"厌恶", fear:"恐惧", happy:"高兴", sad:"伤心", surprise:"惊讶", neutral:"无表情", pouty:"撅嘴", grimace:"鬼脸"
      }
    }
  },
  // 切换摄像头
  reverseCamera(){
    const newPosition = this.data.position==="front"? "back" : "front"
    this.setData({
      position:newPosition
    })
  },
  // 拍照
  takePhoto(){
    const ctx = wx.createCameraContext()
    console.log(ctx);
    ctx.takePhoto({
      quality:"high",
      success:(res)=>{
        console.log(res.tempImagePath); 
        this.setData({
          src:res.tempImagePath,
          isShowPic:true
        },()=>{
          this.getDataInfo()
        })
      },
      fail:()=>{
        console.log("拍照失败"); 
      }
    })
  },
  // 选择照片
  chooseImage(){
  wx.chooseImage({
    count:1,
    sizeType:["original"],
    sourceTypeL:["album"],
    success:(res)=>{
      // console.log(res);
      if(res.tempFilePaths.length>0){
        this.setData({
          src:res.tempFilePaths[0],
          isShowPic:true,
          isShowFace:true
        },()=>{
          this.getDataInfo()
        })
      }
    },
    fail:()=>{
      console.log('选择照片失败!');
      this.setData({
        src:''
      })
    }
  })
    
  },
// 重选照片
reChoose(){
  this.setData({
    isShowPic:false,
    src:'',
    isShowFace:false
  })
},
getDataInfo(){
  // console.log('调用了测颜值函数');
  // console.log(app.globalData);
  const token = app.globalData.access_token
  if(!token){
    wx.showToast({
      title: '鉴权失败'
    })
  }
  wx.showLoading({
    title:"颜值检测中....."
  })
  // 进行颜值检测
  // 将用户选择的照片转码为base64格式的字符串
  const fileStr = wx.getFileSystemManager().readFileSync(this.data.src,"base64")
  // console.log(fileStr);
  wx.request({
    method:"POST",
    url:"https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token="+token,
    header:{
      "Content-Type":"application/json"
    },
    data:{
      image_type:"BASE64",
      image:fileStr,
      // 年龄,颜值分数,表情,性别,是否戴眼镜,情绪
      face_field:"age,beauty,expression,gender,glasses,emotion"
    },
    success:(res)=>{
      if(res.data.result.face_list.length<=0){
        wx.showToast({
          title: '人脸识别失败!'
        })
      }
      this.setData({
        faceInfo:res.data.result.face_list[0],
        isShowFace:true
      })
      console.log(res);  
    },
    fail:()=>{
      wx.showToast({
        title: '人脸识别失败!'
      })
    },
    complete:()=>{
      wx.hideLoading()
    }
  })
  
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      const sysInfo = wx.getSystemInfoSync()
      // console.log(sysInfo);
      this.setData({
        wh:sysInfo.windowHeight
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})