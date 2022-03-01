<template>
  <div>
    <div v-if="user?.userName">
      <span class="userName">{{user.userName}}</span>
      <span id="separator">/</span>
      <a href="#" @click="loginOut">退出</a>
    </div>
    <div v-else>
      <a href="./auth.html">登陆</a>
      <span id="separator">/</span>
      <a href="./auth.html?path=register">注册</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const user = ref({});

const loginOut = () => {
  localStorage.removeItem('nowUser');
  window.location.href = './index.html';
};

const getUser = () => {
  let nowUser = localStorage.getItem('nowUser') || '{}';
  try {
    nowUser = JSON.parse(nowUser);
  } catch (e) {
    nowUser = {};
    localStorage.removeItem('nowUser');
  }

  user.value = nowUser;
};

getUser();
</script>

<style lang="scss" scoped>
#separator {
  margin: 0 1rem;
}
.userName {
  color: var(--theme-color);
}
</style>