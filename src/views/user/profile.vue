<template>
<!-- 编辑资料 -->
  <div class="container">
      <!-- left-arrow:是否显示左侧箭头 -->
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <!-- 头像 -->
      <van-cell is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          @click="showPhoto=true"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </van-cell>
      <!-- 用户昵称 -->
      <van-cell is-link title="名称" @click="showName=true" :value="user.name" />
      <!-- 性别 -->
      <van-cell is-link title="性别" @click="showGender=true" :value='user.gender === 0 ? "男" : "女" '/>
      <!-- 生日 -->
      <van-cell is-link title="生日" @click="showDate" :value="user.birthday" />
    </van-cell-group>

    <!-- 头像弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
      <!-- is-link 是右边的小箭头 -->
      <van-cell is-link title="本地相册选择图片"></van-cell>
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 昵称弹层 -->
    <!-- :close-on-click-overlay="false" 点击弹层后面的遮罩层背景，不会关掉弹层，因为在关掉弹层前要先对昵称进行校验 -->
    <!-- round 和 :round 的效果是一样的，变成圆角-->
    <van-popup round :close-on-click-overlay="false" v-model="showName" style="width:80%">
      <!-- 编辑用户昵称  使用 Field 输入框;
      error-message: 底部错误提示文案，为空时不展示-->
      <van-field :error-message="nameMsg" v-model.trim="user.name" type="textarea" rows="2"></van-field>
      <!-- 关闭按钮组件 block 使按钮居中显示-->
      <van-button type="info" size="large" block @click="btnName">确定</van-button>
    </van-popup>
    <!-- 性别弹层 van-action-sheet 上拉菜单
      1.通过actions数组来定义展示的选项，数组的每一项是一个对象
      2.设置cancel-text属性后，会在底部展示取消按钮，点击后关闭当前菜单-->
      <!-- 捕获点击上拉菜单选项的事件, select事件, -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 生日弹层 DatetimePicker 时间选择-->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <!-- cancel:点击取消按钮时触发的事件=>关闭弹层 -->
      <!-- confirm:点击完成按钮时触发的事件 -->
      <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="showBirthDay=false"
          @confirm="confirmDate">
      </van-datetime-picker>
    </van-popup>
  </div>
</template>

<script>
import dayjs from 'dayjs' // 引入dayjs插件，处理时间格式
export default {
  name: 'profile',
  data () {
    return {
      showPhoto: false, // 是否显示选择头像弹层
      showName: false, // 是否显示编辑昵称的弹层
      showGender: false, // 是否显示性别选择的弹层
      showBirthDay: false, // 是否显示日期弹层
      // 定义数据
      user: {
        name: '张三', // 用户昵称
        gender: 0, // 性别  0男 1女
        birthday: '2019-09-08' // 给一个默认生日
      },
      actions: [{ name: '男' }, { name: '女' }],
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 生日最大时间 永远是小于等于当前时间的 new Date就是当前时间
      currentDate: new Date(), // 当前时间
      nameMsg: '' // 用来控制显示的错误信息
    }
  },
  methods: {
    // 绑定按钮点击事件 校验昵称
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        //  如果长度 小于1 或者大于7 表示 这个昵称不符合要求
        this.nameMsg = '您的用户昵称不符合1-7的长度要求'
        return false // 不会继续往下执行了
      }
      // 如果满足的话 就会继续执行
      this.nameMsg = '' // 先把提示消息清空
      this.showName = false // 关闭弹层
    },
    // 选择性别： 当点击菜单项时 会触发该方法
    selectItem (item) {
      // item就是选择的对象
      this.user.gender = item.name === '男' ? 0 : 1 // 根据判断得到当前的性别
      // 关闭当前的弹层
      this.showGender = false
    },
    // 点击生日时  会触发
    showDate () {
      // 要将字符串  2019-08-08 转化成日期类型 new Date
      this.currentDate = new Date(this.user.birthday) // 把用户的生日赋值给当前时间
      this.showBirthDay = true // 显示生日弹层
    },
    // 点击 生日弹层的确定时  触发的方法
    confirmDate (date) {
      this.user.birthday = dayjs(date).format('YYYY-MM-DD') // 将转化后的结果赋值给 user中的生日
      this.showBirthDay = false // 关闭弹层
    }
  }
}
</script>

<style lang="less" scoped>
</style>
