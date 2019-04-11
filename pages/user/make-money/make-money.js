// pages/user/make-money/make-money.js
var app = getApp()
var util = require('../../../utils/util1.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    numberperpage: 6,
    pagenumber: 1,
    income: 0,
    bankcard_id: "",
    open_bank: "",
    cid: "",
    money: "",
    log: [],
    hidden: false
  },
  addCart: function () {
    wx.navigateTo({
      url: "/pages/user/make-money/cardList/cardlist",
    })
  },
  loadList: function () {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + '/my/my-bankcard-list.html?token=' + wx.getStorageSync('token'),
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {},
      success: function (res) {
        console.log(res.data.data)
        // if (res.data.data.length>0){
        //   that.setData({
        //     hidden: false
        //   })
        // }else{
        //   that.setData({
        //     hidden: true
        //   })
        // }
        

      }
    })
  },
  instr:function(){
    wx.navigateTo({
      url: "/pages/user/make-money/instructions/instructions",
    })
  },
  toList: function () {

    wx.navigateTo({
      url: "/pages/user/make-money/cardList/cardlist?cid=" + this.data.cid + "&open_bank=" + this.data.open_bank + "&bankcard_id=" + this.data.bankcard_id
    })
  },
  money: function (e) {
    console.log(e)
    this.setData({
      money: e.detail.value
    })

  },
  // 提现
  makeMoney: function () {
    var that = this
    console.log(that.data.money)
    if (that.data.cid == "") {
      wx.showModal({
        title: '提示',
        content: '请选择您的银行卡!',
        showCancel: false
      })
      return false
    }
    if (that.data.money == "") {
      wx.showModal({
        title: '提示',
        content: '请选择您提现金额!',
        showCancel: false
      })
      return false
    }  else {
      wx.showLoading({
        title: '加载中',
      });
      wx.request({
        url: app.globalData.baseUrl + '/my/withdraw.html?token=' + wx.getStorageSync('token'),
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: {
          bankcard_id: that.data.cid,
          money: that.data.money
        },
        success: function (res) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {

                that.setData({
                  money: ""
                })
                that.loadData();
                that.loadUser();
              }
            }
          })

        },
        complete: function () {
          wx.hideLoading();
        }
      })
    }


  },
  // 转为余额
  toBalance:function(){

  },
  // 获取身份信息
  loadUser: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.baseUrl + '/my/get-shop-user-info.html?token=' + wx.getStorageSync('token'),
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {

      },
      method: "post",
      success: function (res) {
        that.setData({
          income: res.data.data.income
        })
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

  loadMoreData: function () {
    var that = this
    var numberperpage = that.data.numberperpage
    var pagenumber = that.data.pagenumber
    wx.request({
      url: app.globalData.baseUrl + '/my/withdraw-list.html?token=' + wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        numberperpage: numberperpage,
        pagenumber: pagenumber
      },
      method: "post",
      success: function (res) {

        var datas = res.data.data;

        for (let i = 0; i < datas.length; i++) {
          datas[i]["createtime"] = util.tsFormatTime(datas[i]["createtime"])
          if (datas[i]["status"] == 1) {
            datas[i]["status"] = "刚申请 "
          }
          if (datas[i]["status"] == 2) {
            datas[i]["status"] = "通过"
          }
          if (datas[i]["status"] == 3) {
            datas[i]["status"] = "不通过"
          }
        }
        if (res.data.data.length > 0) {
          that.setData({
            log: that.data.log.concat(datas)
          })
        } else {
          wx.showToast({
            icon: "none",
            title: "数据加载完毕~"
          })
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadUser();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  toLog: function () {
    wx.navigateTo({
      url: "/pages/user/make-money/log/log"
    })
  },
  loadData: function () {
    var that = this
    if (that.data.cid != "") {
      that.setData({
        hidden: true
      })
    } else {
      that.setData({
        hidden: false
      })
    }
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.baseUrl + '/my/withdraw-list.html?token=' + wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        pagenumber: 1,
        numberperpage: 6
      },
      method: "post",
      success: function (res) {

        var datas = res.data.data;

        for (let i = 0; i < datas.length; i++) {
          datas[i]["createtime"] = util.tsFormatTime(datas[i]["createtime"])
          if (datas[i]["status"] == 1) {
            datas[i]["status"] = "刚申请 "
          }
          if (datas[i]["status"] == 2) {
            datas[i]["status"] = "通过"
          }
          if (datas[i]["status"] == 3) {
            datas[i]["status"] = "不通过"
          }
        }
        that.setData({
          log: datas
        })
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadData();
    this.loadList()
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
  onReachBottom: function (e) {
    var that = this;
    var pagenumber = that.data.pagenumber + 1

    that.setData({
      pagenumber: pagenumber++
    });
    setTimeout(function () {
      wx.showToast({
        icon: "loading",
        title: '加载中..',
      }),
        that.loadMoreData()

    }, 1000)
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})