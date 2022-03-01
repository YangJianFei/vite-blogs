/*
 * Author: yang jian fei
 * Email: 1294485765@qq.com
 * Created Date: Monday, February 28th 2022, 3:40:29 pm
 * Modified By: yang jian fei
 * Desc: desc
 * Copyright (c) 2022 瑞为
 */
<template>
  <div class="register-form">
    <el-form ref="form" :model="model" :rules="rules" label-width="85px" label-position="left">
      <el-form-item label="账号" prop="userName">
        <el-input v-model="model.userName" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="model.password" type="password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="passwordRepeat">
        <el-input v-model="model.passwordRepeat" type="password" placeholder="请输入确认密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="model.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="model.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="agreement">
        <el-checkbox v-model="model.agreement">我已仔细阅读并接受</el-checkbox>
        <el-button type="text" @click="showRegisterTips">注册许可协议</el-button>
        <div class="w100">
          <el-button class="w100" type="primary" @click="submitForm">注册</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElForm, ElFormItem, ElInput, ElCheckbox, ElButton, ElMessage, ElMessageBox } from 'element-plus';
import Auth from 'core/auth.js';

const form = ref('');

const model = ref({
  userName: '',
  password: '',
  passwordRepeat: '',
  phone: '',
  email: '',
  agreement: false
});

const EmailReg = /^[.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
const PhoneReg = /^1\d{10}$/;

const passwordValidator = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else if (value.length < 6 || value.length > 29) {
    callback(new Error('密码长度应大于5位小于30位'));
  } else {
    callback();
  }
};

const passwordRepeatValidator = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入确认密码'));
  } else if (value !== model.value.passwordRepeat) {
    callback(new Error('确认密码不一致'));
  } else if (value.length < 6 || value.length > 29) {
    callback(new Error('密码长度应大于5位小于30位'));
  } else {
    callback();
  }
};

const phoneValidator = (rule, value, callback) => {
  if (PhoneReg.test(value)) {
    callback();
  } else {
    callback(new Error('手机号格式错误'));
  }
};

const emailValidator = (rule, value, callback) => {
  if (EmailReg.test(value)) {
    callback();
  } else {
    callback(new Error('邮箱格式错误'));
  }
};

const agreementValidator = (rule, value, callback) => {
  if (value) {
    callback();
  } else {
    callback(new Error('请阅读并接受许可协议'));
  }
};

const rules = ref({
  userName: [
    { required: true, message: '请填写账号', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { validator: passwordValidator, trigger: 'change' }
  ],
  passwordRepeat: [
    { required: true, message: '请输入确认密码', trigger: 'change' },
    { validator: passwordRepeatValidator, trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'change' },
    { validator: phoneValidator, trigger: 'change' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'change' },
    { validator: emailValidator, trigger: 'change' }
  ],
  agreement: [
    { validator: agreementValidator, trigger: 'change' }
  ]
});

const submitForm = () => {
  if (!form.value) return;
  form.value.validate(valid => {
    if (valid) {
      const result = Auth.addUser(model.value);
      if (result) {
        ElMessage({
          type: 'success',
          message: '注册成功,请登录',
          duration: 1500,
          onClose: () => {
            window.location.href = './auth.html';
          }
        });
      } else {
        ElMessage({
          type: 'error',
          message: '账号或手机号已被注册！'
        });
      }
    }
  });
};

const showRegisterTips = () => {
  ElMessageBox.alert(`
    1、在本站注册的会员，必须遵守《互联网电子公告服务管理规定》，不得在本站发表诽谤他人，侵犯他人隐私，侵犯他人知识产权，传播病毒，政治言论，商业讯息等信息。
    2、在所有在本站发表的文章，本站都具有最终编辑权，并且保留用于印刷或向第三方发表的权利，如果你的资料不齐全，我们将有权不作任何通知使用你在本站发布的作品。 
    3、在登记过程中，您将选择注册名和密码。注册名的选择应遵守法律法规及社会公德。您必须对您的密码保密，您将对您注册名和密码下发生的所有活动承担责任。`, '注册许可协议', {
    confirmButtonText: '确定'
  });
}
</script>

<style lang="scss" scoped>
.register-form {
  max-width: 500px;
  margin: 4rem auto;
}
</style>