// pages/guide/guide.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: "",
    send: true,
    phoneNum: "",
    phoneNum1: "",
    second: 60,
    code: "",
    codeq: ""
  },
  // 获取短信接口
  sendMsg: function () {

    var that = this
    var myreg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    var mobile = that.data.phoneNum
    if (mobile == "") {
      wx.showToast({
        title: '请输入手机号码!',
        icon: "none"
      })
      return false
    } else if (!myreg.test(mobile)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码!',
        showCancel: false
      })
      return
    } else {
      that.setData({

        send: !that.data.send
      })
      that.timer()
      console.log(mobile)
      wx.showLoading({
        title: '加载中',
      });
      wx.request({

        url: app.globalData.baseUrl + '/my/send.html?token=' + wx.getStorageSync('token'),
        // url: 'http://yuewan.ygwl.info/login/send-messages.html',
        method: 'post',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          'mobile': mobile
        },

        success: function (res) {
          console.log(res.data.code)
          if (res.data.success) {
            that.setData({
              send: !that.data.send

            })
            that.timer()
            setTimeout(() => {
              wx.showToast({
                title: "发送成功！",
                icon: 'success'
              })
              setTimeout(() => {
                wx.hideToast();
              }, 3000)
            }, 0);
          } else {
            setTimeout(() => {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
              setTimeout(() => {
                wx.hideToast();
              }, 3000)
            }, 0);
          }
          that.setData({
            code: res.data.code
          })
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    }
  },

  inputPhoneNum: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  inputCode: function (e) {
    this.setData({
      codeq: e.detail.value
    })
  },
  inputPhoneNum1: function (e) {
    this.setData({
      phoneNum1: e.detail.value
    })
  },
  apply: function () {
    var that = this
    var myreg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    var mobile = that.data.phoneNum
    var dealer_mobile = that.data.phoneNum1
    var codeq = that.data.codeq
    var code = that.data.code
    console.log(codeq)
    console.log(code)
    if (mobile == "") {
      wx.showToast({
        title: '请输入手机号码!',
        icon: "none"
      })
      return false
    } else if (!myreg.test(mobile)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码!',
        showCancel: false
      })
      return
    }

    if (codeq == "") {
      wx.showToast({
        title: '请输入手机验证码!',
        icon: "none"
      })
      return false
    } if (codeq != that.data.code) {
      wx.showToast({
        title: '请输入正确的手机验证码!',
        icon: "none"
      })
      return false
    }
     else {

      wx.request({

        url: app.globalData.baseUrl + '/my/binding-mobile.html?token=' + wx.getStorageSync('token'),
        // url: 'http://yuewan.ygwl.info/login/send-messages.html',
        method: 'post',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          mobile: mobile
        },
        success: function (res) {
          if (res.data.status == 10000) {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
            })
          }
        }
      })


    }

  },
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              send: !this.data.send
            })
            resolve(setTimer)
          }
        }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
  },
  toIndex: function () {
    wx.reLaunch({
      url: '/pages/shop/index/index',
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
    var that = this
    let userInfo = wx.getStorageSync('userInfo');
    // if (!userInfo) {
    //   wx.navigateTo({
    //     url: '/pages/shop/authorize/authorize',
    //   })
    // } else {
    //   that.setData({
    //     userInfo: userInfo,
    //   })
    // }
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