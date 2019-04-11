// pages/authorize/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  bindGetUserInfo: function (e) {
    wx.setStorageSync('userInfo', e.detail.userInfo)
    if (!e.detail.userInfo) {
      return;
    }
    this.login();
  },
  login: function () {
    wx.login({
      success: function (res) {
        // return false
        wx.request({
          url: 'https://meiyankongjian.com/login/get-openid.html',
          data: {code:res.code},
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method:"post",
          success: function (res) {
            var openid = res.data.data //返回openid
            let userInfo = wx.getStorageSync('userInfo')
            wx.request({
              url: app.globalData.baseUrl + '/login/login.html',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: { wx_openid: openid, wx_nikename:userInfo.nickName},
              success: function (resp) {
                if (resp.data.status == 10000) {
                  wx.setStorageSync('token', resp.data.data);
                  wx.setStorageSync('openId', openid);
                } else {
                  console.log(2)
                  // 登录错误
                  wx.hideLoading();
                  wx.showModal({
                    title: '提示',
                    content: '无法登录，请重试',
                    showCancel: false
                  })
                }
                wx.navigateBack({
                  delta: 1
                }) 
              }
            })
          }
        })
       
       
        wx.getUserInfo({
          success: function (res) {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
        
            // 下面开始调用注册接口
            // wx.request({
            //   url: app.globalData.baseUrl + '/client/user/saveUserInfo',
            //   data: { encryptedData: encryptedData, iv: iv }, // 设置请求的 参数
            //   method: 'POST',
            //   header: {
            //     'content-type': 'application/x-www-form-urlencoded',
            //     "cookie": wx.getStorageSync('cookie')
            //   },
            //   success: (res) => {
            //     console.log(res)
            //     wx.hideLoading();

            //   }
            // })
          }
        })  
      }
    })
  
  }

})