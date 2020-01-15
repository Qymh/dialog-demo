import Vue from 'vue';
import ExtendDialogVue from './Index.vue';

// 新的构造函数
const ExtendDialogVueConstructor = Vue.extend(ExtendDialogVue);

export default {
  show() {
    // dialog组件实例
    const instance = new ExtendDialogVueConstructor();
    // 挂载实例
    instance.$mount();
    // 设置prop test
    instance.test = '123';
    // 添加实例dom到网页中
    document.body.appendChild(instance.$el);
  }
};
