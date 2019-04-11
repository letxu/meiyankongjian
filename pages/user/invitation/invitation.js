// pages/user/invitation/invitation.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrCode: "",
    height: "",
    user_id:"",
    url: app.globalData.baseUrl
  },
  // 获取身份信息
  loadUser: function () {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + '/my/qrcode.html?token='+ wx.getStorageSync('token'),
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          qrCode: res.data.data
        })
      }
    })
  },
  // previewImage: function (e) {
  //   var imglist=[]
  //   var url = app.globalData.baseUrl + this.data.qrCode.split(',')
  //   imglist.push(url)
  //   console.log(imglist)
  //   wx.previewImage({
  //     urls: imglist
  //     // 需要预览的图片http链接  使用split把字符串转数组。不然会报错
  //   })
  // },
  loadData: function () {
    // var that =this
    // console.log(that.data.mobile)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    wx.request({
      url: app.globalData.baseUrl + '/my/get-shop-user-info.html?token=' + wx.getStorageSync('token'),
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "post",
      success: function (res) {
        console.log(res)
        that.setData({
          user_id: res.data.data.user_id
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
    this.loadUser();
  },
// 保存图片
  downloadImage:function(){
    console.log(this.data.url + this.data.qrCode)
    wx.downloadFile({
      url: this.data.url + this.data.qrCode,
      success: function (res) {
        console.log("下载文件：success");
        // 保存图片到系统相册  
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log("保存图片：success");
            wx.showToast({
              title: '保存成功',
            });
          },
          fail(res) {
            console.log("保存图片：fail");
            console.log(res);
          }
        })
      },
      fail: function (res) {
        console.log("下载文件：fail");
        console.log(res);
      }
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    console.log('/pages/index/index?shop_user_id=' + this.data.user_id)
    return {
      title: '美颜空间',
      path: '/pages/index/index?shop_user_id=' + this.data.user_id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})