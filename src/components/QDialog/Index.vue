<script>
export default {
  name: 'QDialog',
  data() {
    return {
      btnsTrans: []
    };
  },
  model: {
    prop: 'show'
  },
  watch: {
    type: {
      handler() {
        this.generateBtnsTrans();
      },
      immediate: true
    },
    btns: {
      handler() {
        this.generateBtnsTrans();
      },
      deep: true
    },
    show: {
      handler(val) {
        if (!val) {
          this.btnsTrans.forEach(v => (v.loading = false));
          this.$emit('close');
        } else {
          this.$emit('opened');
        }
      }
    }
  },
  methods: {
    // 完成回调
    done() {
      if (this.$parent) {
        this.$emit('input', false);
      } else {
        this.show = false;
      }
    },
    // 构造btns
    generateBtnsTrans() {
      if (this.btns && this.btns.length) {
        this.btnsTrans = this.btns.map(v => {
          v.loading = false;
        });
      } else if (this.type === 'alert') {
        this.btnsTrans = [
          {
            value: this.confirmText,
            color: this.confirmTextColor,
            loading: false
          }
        ];
      } else if (this.type === 'confirm') {
        this.btnsTrans = [
          {
            value: this.cancelText,
            color: this.cancelTextColor,
            loading: false
          },
          {
            value: this.confirmText,
            color: this.confirmTextColor,
            loading: false
          }
        ];
      }
    },
    // 按钮点击
    doBtnClick(v, type) {
      if (this.beforeCloseCheck(type)) {
        v.loading = true;
        return;
      }
      if (this.$parent) {
        this.$emit(type, v);
        this.$emit('input', false);
      } else {
        this._doPromiseInstanceClose(type, v);
      }
    },
    // 关闭icon点击
    doCloseIconClick() {
      if (this.beforeCloseCheck('icon')) {
        return;
      }
      this.done();
    },
    // 背景点击
    doBackgroundClick() {
      if (!this.lock) {
        if (this.beforeCloseCheck('background')) {
          return;
        }
        this.done();
      }
    },
    // 关闭前检查
    beforeCloseCheck(type) {
      if (this.beforeClose) {
        this.beforeClose(type, this.done);
        return true;
      }
    }
  },
  props: {
    // 是否展示弹窗
    show: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 详情
    details: {
      type: String,
      default: ''
    },
    // 富文本
    richText: {
      type: String,
      default: ''
    },
    // 类型
    type: {
      type: String,
      default: 'alert'
    },
    // 关闭文案
    cancelText: {
      type: String,
      default: '取消'
    },
    // 关闭文案颜色
    cancelTextColor: {
      type: String,
      default: '#999999'
    },
    // 确认文案
    confirmText: {
      type: String,
      default: '确认'
    },
    // 确认文案颜色
    confirmTextColor: {
      type: String,
      default: '#40A1FF'
    },
    // 按钮集合
    btns: {
      type: Array,
      default: () => []
    },
    // 是否展示关闭按钮
    closeIcon: {
      type: Boolean,
      default: false
    },
    // 是否禁止背景点击
    lock: {
      type: Boolean,
      default: false
    },
    // 关闭前的回调
    beforeClose: {
      type: [Function, String],
      default: ''
    }
  },
  render() {
    return (
      <div class="q-dialog">
        <transition
          name="fade"
          enterActiveClass="animated fadeIn"
          leaveActiveClass="animated fadeOut"
        >
          <div
            class="q-dialog-background"
            v-show={this.show}
            onClick={this.doBackgroundClick}
          ></div>
        </transition>
        <transition
          name="zoom"
          enterActiveClass="animated zoomIn"
          leaveActiveClass="animated zoomOut"
        >
          <div class="q-dialog-core" v-show={this.show}>
            {this.title && <div class="q-dialog-core__title">{this.title}</div>}
            {this.details && (
              <div class="q-dialog-core__details">{this.details}</div>
            )}
            {this.$slots.details && (
              <div class="q-dialog-core__details--slot">
                {this.$slots.details}
              </div>
            )}
            {this.richText && (
              <div
                class="q-dialog-core__details--richText"
                domPropsInnerHTML={this.richText}
              ></div>
            )}
            <div class="q-dialog-core-btns">
              {this.btnsTrans.map((v, i, arr) => {
                const type =
                  arr.length === 2
                    ? i === 0
                      ? 'cancel'
                      : 'confirm'
                    : 'confirm';
                let className = `q-dialog-core-btns-chunk--${type}`;
                className = ' q-dialog-core-btns-chunk';
                if (arr.length === 2 && type === 'confirm') {
                  className += ' q-dialog-core-btns-chunk--confirm--line';
                }
                const color = v.color;
                return (
                  <div
                    class={className}
                    style={{ color }}
                    key={i}
                    onClick={this.doBtnClick.bind(this, v, type)}
                  >
                    {!v.loading && <div>{v.value}</div>}
                    {v.loading && (
                      <svg
                        class="q-dialog-core-btns-chunk-loading"
                        viewBox="25 25 50 50"
                      >
                        <circle
                          class="q-dialog-core-btns-chunk-loading__circle"
                          cx="50"
                          cy="50"
                          r="20"
                          fill="none"
                        />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
            {this.closeIcon && (
              <div
                class="q-dialog-core__closeIcon"
                onClick={this.doCloseIconClick}
              ></div>
            )}
          </div>
        </transition>
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
.q-dialog {
  &-background {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background-color: #000;
    opacity: 0.3;
    z-index: 5;
  }
  /** 此处采用的便是 position margin table 垂直水平居中  **/
  &-core {
    width: 590px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    display: table;
    background-color: #fff;
    z-index: 6;
    border-radius: 6px;
    font-size: 28px;
    &__closeIcon {
      background-image: url('https://user-gold-cdn.xitu.io/2020/1/12/16f9a2163f1872cf?w=56&h=56&f=png&s=407');
      height: 28px;
      width: 28px;
      background-size: 100% 100%;
      position: absolute;
      right: 0;
      top: -58px;
    }
    &__title {
      font-size: 40px;
      line-height: 40px;
      padding: 50px 30px 30px 30px;
      font-weight: 500;
      text-align: center;
    }
    &__details {
      color: #666666;
      padding: 0 40px 40px 40px;
      text-align: center;
      max-height: 350px;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      &--richText,
      &--slot {
        color: #666666;
        padding: 0 40px 40px 40px;
        text-align: center;
        max-height: 350px;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
      }
    }
    &-btns {
      position: relative;
      display: flex;
      &-chunk {
        flex-shrink: 1;
        flex-grow: 1;
        width: 0;
        display: flex;
        height: 90px;
        justify-content: center;
        align-items: center;
        font-size: 32px;
        line-height: 32px;
        font-weight: 400;
        &-loading {
          height: 40px;
          width: 40px;
          animation: loading-rotate 2s linear infinite;
          margin-right: 20px;
          &__circle {
            animation: loading-dash 1.5s ease-in-out infinite;
            stroke-dasharray: 90, 150;
            stroke-dashoffset: 0;
            stroke-width: 2;
            stroke-linecap: round;
            stroke: #40a1ff;
          }
        }
        &--cancel {
          color: #999;
        }
        &--confirm {
          color: #40a1ff;
          &--line {
            position: relative;
            /** 弹窗按钮中间的横线采用1px伪元素解决方案  **/
            &::before {
              content: '';
              position: absolute;
              left: 0;
              top: 20%;
              height: 120%;
              width: 1px;
              transform-origin: top left;
              transform: scaleY(0.5);
              background-color: #eeeeee;
            }
          }
        }
      }
    }
    /** 弹窗按钮上面的横线采用1px伪元素解决方案  **/
    &-btns::before {
      content: '';
      position: absolute;
      height: 1px;
      width: 100%;
      transform-origin: top left;
      transform: scaleY(0.5);
      border-top: 1px solid #eeeeee;
    }
  }
}
.animated {
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
.fadeIn {
  animation-name: fadeIn;
}
.fadeOut {
  animation-name: fadeOut;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.3;
  }
}
@keyframes fadeOut {
  from {
    opacity: 0.3;
  }
  to {
    opacity: 0;
  }
}
@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  50% {
    opacity: 1;
  }
}
.zoomIn {
  animation-name: zoomIn;
}
@keyframes zoomOut {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  to {
    opacity: 0;
  }
}
.zoomOut {
  animation-name: zoomOut;
}
@keyframes loading-rotate {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120;
  }
}
</style>
