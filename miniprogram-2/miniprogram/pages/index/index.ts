// pages/index/index.ts
interface Data {
  backgroundImage: string;
  textContent: string;
  fontSize: number;
  textColor: string;
  borderWidth: number;
  borderColor: string;
  isGenerating: boolean;
  generatedImage: string;
  showTextEditor: boolean;
  showFontSettings: boolean;
  showBorderSettings: boolean;
  showMemePanel: boolean;
  memeOptions: Array<{ id: number; name: string; effect: string }>;
  selectedMeme: number | null;
  memeIntensity: number;
  showFilters: boolean;
  filterType: string;
  showReplaceModal: boolean;
  coverTitle: string;
  coverDesc: string;
  coverAuthor: string;
}

Page({
  data: {
    backgroundImage: '',
    textContent: '恭喜发财',
    fontSize: 30,
    textColor: '#FFD700',
    borderWidth: 8,
    borderColor: '#FF0000',
    isGenerating: false,
    generatedImage: '',
    showTextEditor: false,
    showFontSettings: false,
    showBorderSettings: false,
    showMemePanel: false,
    memeOptions: [
      { id: 1, name: '放大眼睛', effect: 'eye_enlarge' },
      { id: 2, name: '拉长鼻子', effect: 'nose_extend' },
      { id: 3, name: '大嘴巴', effect: 'mouth_widen' },
      { id: 4, name: '变脸', effect: 'face_swap' },
      { id: 5, name: '模糊', effect: 'blur' },
      { id: 6, name: '像素化', effect: 'pixelate' },
      { id: 7, name: '旋转', effect: 'rotate' },
      { id: 8, name: '镜像', effect: 'mirror' },
      { id: 9, name: '彩虹', effect: 'rainbow' },
      { id: 10, name: '马赛克', effect: 'mosaic' }
    ],
    selectedMeme: null,
    memeIntensity: 50,
    showFilters: false,
    filterType: 'none',
    showReplaceModal: false,
    coverTitle: '我的红包封面',
    coverDesc: '祝您新年快乐',
    coverAuthor: '自定义红包'
  } as Data,

  onLoad: function () {
    // 初始化时绘制默认画布
    this.drawCanvas();
  },

  // 选择背景图片
  selectBackground: function() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          backgroundImage: tempFilePaths[0],
          selectedMeme: null
        } as Partial<Data>);
        that.drawCanvas();
      }
    });
  },

  // 显示文字编辑器
  showTextEdit: function() {
    this.setData({
      showTextEditor: true
    } as Partial<Data>);
  },

  // 显示字体设置
  showFontSetting: function() {
    this.setData({
      showFontSettings: true
    } as Partial<Data>);
  },

  // 显示边框设置
  showBorderSetting: function() {
    this.setData({
      showBorderSettings: true
    } as Partial<Data>);
  },

  // 显示恶搞功能面板
  showMemePanel: function() {
    this.setData({
      showMemePanel: true
    } as Partial<Data>);
  },

  // 显示滤镜面板
  showFilterPanel: function() {
    this.setData({
      showFilters: true
    } as Partial<Data>);
  },

  // 显示替换封面模态框
  showReplaceModal: function() {
    if (!this.data.generatedImage) {
      wx.showToast({
        title: '请先生成封面',
        icon: 'none'
      });
      return;
    }
    this.setData({
      showReplaceModal: true
    } as Partial<Data>);
  },

  // 关闭所有设置面板
  closeAllPanels: function() {
    this.setData({
      showTextEditor: false,
      showFontSettings: false,
      showBorderSettings: false,
      showMemePanel: false,
      showFilters: false,
      showReplaceModal: false
    } as Partial<Data>);
  },

  // 选择恶搞效果
  selectMeme: function(e: WechatMiniprogram.TouchEvent) {
    const memeId = parseInt(e.currentTarget.dataset.id);
    this.setData({
      selectedMeme: memeId
    } as Partial<Data>);
    this.applyMemeEffect(memeId);
  },

  // 应用恶搞效果
  applyMemeEffect: function(memeId: number) {
    // 这里只是模拟效果，实际实现需要复杂的图像处理
    // 实际应用中可以使用云函数或第三方SDK
    console.log(`应用恶搞效果: ${memeId}`);
    this.drawCanvas();
  },

  // 更新恶搞强度
  updateMemeIntensity: function(e: WechatMiniprogram.SliderChange) {
    this.setData({
      memeIntensity: parseInt(e.detail.value.toString())
    } as Partial<Data>);
    if (this.data.selectedMeme !== null) {
      this.applyMemeEffect(this.data.selectedMeme);
    }
  },

  // 选择滤镜
  selectFilter: function(e: WechatMiniprogram.TouchEvent) {
    const filterType = e.currentTarget.dataset.filter;
    this.setData({
      filterType: filterType
    } as Partial<Data>);
    this.drawCanvas();
  },

  // 更新文字内容
  updateTextContent: function(e: WechatMiniprogram.InputEvent) {
    this.setData({
      textContent: e.detail.value
    } as Partial<Data>);
    this.drawCanvas();
  },

  // 更新字体大小
  updateFontSize: function(e: WechatMiniprogram.SliderChange) {
    this.setData({
      fontSize: parseInt(e.detail.value.toString())
    } as Partial<Data>);
    this.drawCanvas();
  },

  // 更新文字颜色
  updateTextColor: function(e: WechatMiniprogram.InputEvent) {
    this.setData({
      textColor: e.detail.value
    } as Partial<Data>);
    this.drawCanvas();
  },

  // 更新边框宽度
  updateBorderWidth: function(e: WechatMiniprogram.SliderChange) {
    this.setData({
      borderWidth: parseInt(e.detail.value.toString())
    } as Partial<Data>);
    this.drawCanvas();
  },

  // 更新边框颜色
  updateBorderColor: function(e: WechatMiniprogram.InputEvent) {
    this.setData({
      borderColor: e.detail.value
    } as Partial<Data>);
    this.drawCanvas();
  },

  // 更新封面标题
  updateCoverTitle: function(e: WechatMiniprogram.InputEvent) {
    this.setData({
      coverTitle: e.detail.value
    } as Partial<Data>);
  },

  // 更新封面描述
  updateCoverDesc: function(e: WechatMiniprogram.InputEvent) {
    this.setData({
      coverDesc: e.detail.value
    } as Partial<Data>);
  },

  // 更新作者信息
  updateCoverAuthor: function(e: WechatMiniprogram.InputEvent) {
    this.setData({
      coverAuthor: e.detail.value
    } as Partial<Data>);
  },

  // 绘制Canvas
  drawCanvas: function() {
    const ctx = wx.createCanvasContext('coverCanvas');
    const { backgroundImage, textContent, fontSize, textColor, borderWidth, borderColor, filterType } = this.data;

    // 设置画布尺寸
    const width = 300;
    const height = 400;

    // 绘制纯色背景（如果没有背景图片）
    if (!backgroundImage) {
      ctx.setFillStyle('#FF6B6B'); // 默认红色背景
      ctx.fillRect(0, 0, width, height);
    } else {
      // 绘制背景图片
      ctx.drawImage(backgroundImage, 0, 0, width, height);
      
      // 应用滤镜效果
      switch(filterType) {
        case 'grayscale':
          // 灰度滤镜（简化实现）
          ctx.setFillStyle('rgba(0,0,0,0.2)');
          ctx.fillRect(0, 0, width, height);
          break;
        case 'sepia':
          // 怀旧滤镜（简化实现）
          ctx.setFillStyle('rgba(165,42,42,0.2)');
          ctx.fillRect(0, 0, width, height);
          break;
        case 'invert':
          // 反色滤镜（简化实现）
          ctx.setFillStyle('rgba(255,255,255,0.5)');
          ctx.fillRect(0, 0, width, height);
          break;
        default:
          break;
      }
    }

    // 绘制边框
    if (borderWidth > 0) {
      ctx.setStrokeStyle(borderColor);
      ctx.setLineWidth(borderWidth);
      ctx.strokeRect(borderWidth/2, borderWidth/2, width - borderWidth, height - borderWidth);
    }

    // 绘制文字
    ctx.setFontSize(fontSize);
    ctx.setFillStyle(textColor);
    ctx.setTextAlign('center');
    ctx.setTextBaseline('middle');
    ctx.fillText(textContent, width/2, height/2);

    // 绘制装饰元素（红包封口）
    ctx.setFillStyle('#FF0000');
    ctx.fillRect(width/2 - 50, 40, 100, 20);

    // 绘制金币图案
    ctx.beginPath();
    ctx.arc(width/2, 80, 15, 0, 2 * Math.PI);
    ctx.setFillStyle('#FFD700');
    ctx.fill();

    // 绘制恶搞元素
    this.drawMemeElements(ctx, width, height);

    // 绘制完成
    ctx.draw();
  },

  // 绘制恶搞元素
  drawMemeElements: function(ctx: WechatMiniprogram.CanvasContext, width: number, height: number) {
    const { selectedMeme, memeIntensity } = this.data;
    
    if (selectedMeme === null) return;

    // 根据选择的恶搞效果绘制相应元素
    switch(selectedMeme) {
      case 1: // 放大眼睛
        // 左眼
        ctx.beginPath();
        ctx.arc(width/2 - 30, height/2 - 30, 10 + memeIntensity/10, 0, 2 * Math.PI);
        ctx.setFillStyle('#FFFFFF');
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width/2 - 30, height/2 - 30, 5 + memeIntensity/20, 0, 2 * Math.PI);
        ctx.setFillStyle('#000000');
        ctx.fill();
        
        // 右眼
        ctx.beginPath();
        ctx.arc(width/2 + 30, height/2 - 30, 10 + memeIntensity/10, 0, 2 * Math.PI);
        ctx.setFillStyle('#FFFFFF');
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width/2 + 30, height/2 - 30, 5 + memeIntensity/20, 0, 2 * Math.PI);
        ctx.setFillStyle('#000000');
        ctx.fill();
        break;
        
      case 2: // 拉长鼻子
        ctx.beginPath();
        ctx.moveTo(width/2, height/2 - 10);
        ctx.lineTo(width/2 - memeIntensity/10, height/2 + 20);
        ctx.lineTo(width/2 + memeIntensity/10, height/2 + 20);
        ctx.closePath();
        ctx.setFillStyle('#FFA07A');
        ctx.fill();
        break;
        
      case 3: // 大嘴巴
        ctx.beginPath();
        ctx.arc(width/2, height/2 + 30, 20 + memeIntensity/5, 0, Math.PI);
        ctx.setFillStyle('#FF69B4');
        ctx.fill();
        break;
        
      case 5: // 模糊效果提示
        ctx.setFillStyle('rgba(0,0,0,0.3)');
        ctx.fillRect(0, 0, width, height);
        ctx.setFontSize(16);
        ctx.setFillStyle('#FFFFFF');
        ctx.setTextAlign('center');
        ctx.fillText('模糊效果', width/2, height/2);
        break;
        
      case 6: // 像素化效果提示
        ctx.setFillStyle('rgba(255,255,255,0.7)');
        ctx.fillRect(0, 0, width, height);
        ctx.setFontSize(16);
        ctx.setFillStyle('#000000');
        ctx.setTextAlign('center');
        ctx.fillText('像素化效果', width/2, height/2);
        break;
        
      case 9: // 彩虹效果
        const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
        const stripeHeight = height / colors.length;
        
        for (let i = 0; i < colors.length; i++) {
          ctx.setFillStyle(colors[i]);
          ctx.fillRect(0, i * stripeHeight, width, stripeHeight);
        }
        break;
    }
  },

  // 生成红包封面
  generateCover: function() {
    const that = this;
    this.setData({
      isGenerating: true
    } as Partial<Data>);

    // 确保Canvas绘制完成后再生成图片
    setTimeout(() => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 300,
        height: 400,
        destWidth: 900,
        destHeight: 1200,
        canvasId: 'coverCanvas',
        success: function(res) {
          that.setData({
            generatedImage: res.tempFilePath,
            isGenerating: false
          } as Partial<Data>);

          wx.showToast({
            title: '生成成功',
            icon: 'success'
          });
        },
        fail: function(err) {
          console.error('生成封面失败:', err);
          that.setData({
            isGenerating: false
          } as Partial<Data>);
          wx.showToast({
            title: '生成失败',
            icon: 'none'
          });
        }
      });
    }, 100);
  },

  // 保存图片到相册
  saveToAlbum: function() {
    if (!this.data.generatedImage) {
      wx.showToast({
        title: '请先生成封面',
        icon: 'none'
      });
      return;
    }

    wx.saveImageToPhotosAlbum({
      filePath: this.data.generatedImage,
      success: function() {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      },
      fail: function() {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    });
  },

  // 一键替换红包封面
  replaceCover: function() {
    if (!this.data.generatedImage) {
      wx.showToast({
        title: '请先生成封面',
        icon: 'none'
      });
      return;
    }

    // 检查用户是否授权保存相册权限
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          // 请求授权
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              this.performReplace();
            },
            fail: () => {
              wx.showModal({
                title: '授权提示',
                content: '需要授权才能保存封面到相册，用于替换红包封面',
                showCancel: true,
                confirmText: '去设置',
                cancelText: '取消',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    wx.openSetting({
                      success: (settingRes) => {
                        if (settingRes.authSetting['scope.writePhotosAlbum']) {
                          this.performReplace();
                        }
                      }
                    });
                  }
                }
              });
            }
          });
        } else {
          this.performReplace();
        }
      }
    });
  },

  // 执行替换操作
  performReplace: function() {
    const { generatedImage, coverTitle, coverDesc, coverAuthor } = this.data;

    // 保存到相册
    wx.saveImageToPhotosAlbum({
      filePath: generatedImage,
      success: () => {
        wx.showModal({
          title: '替换红包封面',
          content: `即将跳转到红包封面平台，使用"${coverTitle}"作为封面名称`,
          confirmText: '立即替换',
          cancelText: '稍后再说',
          success: (modalRes) => {
            if (modalRes.confirm) {
              // 跳转到红包封面平台（实际上无法直接跳转，这里提示用户手动操作）
              wx.showModal({
                title: '操作提示',
                content: '请打开微信 -> 我 -> 表情 -> 红包封面 -> 制作红包封面，然后选择刚刚保存的图片来制作新封面',
                showCancel: false,
                confirmText: '我知道了',
                success: () => {
                  wx.showToast({
                    title: '封面已保存至相册',
                    icon: 'success'
                  });
                }
              });
            }
          }
        });
      },
      fail: () => {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    });
  },

  // 分享功能
  onShareAppMessage: function() {
    return {
      title: '自定义红包封面',
      path: '/pages/index/index'
    };
  }
});