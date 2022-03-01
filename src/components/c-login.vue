/*
 * Author: yang jian fei
 * Email: 1294485765@qq.com
 * Created Date: Monday, February 28th 2022, 3:40:29 pm
 * Modified By: yang jian fei
 * Desc: desc
 * Copyright (c) 2022 瑞为
 */
<template>
  <div class="login-form">
    <el-form ref="form" :model="model" :rules="rules" label-width="75px" label-position="left">
      <el-form-item label="账号" prop="userName">
        <el-input v-model="model.userName" placeholder="请输入账号或手机号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="model.password" type="password" show-password placeholder="密码位数大于5，小于30" @keypress.enter="submitForm"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="model.remember">记住登陆</el-checkbox>
        <el-button class="w100" type="primary" @click="submitForm">登陆</el-button>
      </el-form-item>
      <el-form-item>
        <span>还没有账号？<a href="./auth.html?path=register">点击注册</a></span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElForm, ElFormItem, ElInput, ElCheckbox, ElButton, ElMessage } from 'element-plus';
import Auth from 'core/auth.js';

const form = ref('');

const model = ref({
  userName: '',
  password: '',
  remember: true
});


const passwordValidator = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else if (value.length < 6 || value.length > 29) {
    callback(new Error('密码长度应大于5位小于30位'));
  } else {
    callback();
  }
};

const rules = ref({
  userName: [
    { required: true, message: '请填写账号', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { validator: passwordValidator, trigger: 'change' }
  ]
});

const submitForm = () => {
  if (!form.value) return;
  form.value.validate(valid => {
    if (valid) {
      const result = Auth.login(model.value);
      if (result) {
        localStorage.setItem('nowUser', JSON.stringify(model.value));
        ElMessage({
          type: 'success',
          message: '登陆成功',
          duration: 1500,
          onClose: () => {
            window.location.href = './index.html';
          }
        });
      } else {
        ElMessage({
          type: 'error',
          message: '账号或密码错误！'
        });
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.login-form {
  max-width: 500px;
  margin: 4rem auto;
}
</style>