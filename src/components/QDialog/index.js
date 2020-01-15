import QDiloagVue from './Index.vue';
import Vue from 'vue';

const QDialogVueConstructor = Vue.extend(QDiloagVue);

let instance, _resolve, _reject;

// promise关闭
function _doPromiseInstanceClose(type, v) {
  if (type === 'confirm') {
    _resolve(v);
  } else if (type === 'cancel') {
    _reject(v);
  }
  instance.show = false;
}

// 重置
function resetInstance() {
  const props = instance.$options.props;
  for (const key in props) {
    let defaultValue = props[key].default;
    if (typeof defaultValue === 'function') {
      defaultValue = defaultValue();
    }
    instance[key] = defaultValue;
  }
}

export default {
  show(opts = {}) {
    const promise = new Promise((resolve, reject) => {
      if (!instance) {
        // 创建实例
        instance = new QDialogVueConstructor();
        // 挂载实例
        instance.$mount();
        // 添加到网页中
        document.body.appendChild(instance.$el);
      } else {
        // 重置实例
        resetInstance();
      }
      // 保存变量
      _resolve = resolve;
      _reject = reject;
      // 方法赋值到实例中
      instance._doPromiseInstanceClose = _doPromiseInstanceClose;
      // 设置实例的值
      for (const key in opts) {
        instance[key] = opts[key];
      }
      // 让弹窗显示
      instance.show = true;
    });
    if (opts.beforeClose) {
      return '';
    } else {
      return promise;
    }
  }
};
