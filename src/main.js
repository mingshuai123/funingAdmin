import Vue from 'vue';
import App from './App';
import { router } from './router';
import './style/index.less'
import qs from 'qs' 
Vue.prototype.$qs = qs
import axios from 'axios';
// axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Vue.prototype.$axios = axios
import Cookies from 'js-cookie'
Vue.prototype.$Cookies = Cookies
import axiosApi from "./utils/fetch"
Vue.use(axiosApi);
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;
Vue.prototype.defaultImg = 'this.src="'+ require('./assets/head.png') +'"';

import {Divider,RadioGroup, Radio,Stepper,Tag,SwitchCell,NumberKeyboard,Pagination,DatetimePicker ,Overlay,Dialog,Sidebar, SidebarItem,Toast, NavBar, Tab, Tabs, Row, Col, Button, Field, Picker, Popup, Cell, CellGroup, Uploader, Panel, List, Swipe, SwipeItem,Icon,Search,Checkbox, CheckboxGroup,Notify } from 'vant';
Vue.use(Toast)
.use(RadioGroup)
.use(Radio)
.use(Divider)
.use(Icon)
.use(Sidebar)
.use(SidebarItem)
.use(NavBar)
.use(Tab)
.use(Tabs)
.use(Dialog)
.use(Row)
.use(Col)
.use(Button)
.use(Field)
.use(Picker)
.use(Popup)
.use(Cell)
.use(CellGroup)
.use(Uploader)
.use(Panel)
.use(List)
.use(Swipe)
.use(Search)
.use(Checkbox)
.use(CheckboxGroup)
.use(Notify)
.use(SwipeItem)
.use(DatetimePicker)
.use(Pagination)
.use(NumberKeyboard)
.use(SwitchCell)
.use(Tag)
.use(Stepper)
.use(Overlay);
new Vue({
    router,
    el: '#app',
    render: h => h(App)
});