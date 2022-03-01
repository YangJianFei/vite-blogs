<template>
  <div>
    <TopBar hightLight="index" />
    <div id="main">
      <div id="content">
        <CRegister v-if="showRegister" />
        <CLogin v-else />
      </div>
      <CFooter />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TopBar from "../../components/TopBar.vue";
import CLogin from 'c/c-login.vue';
import CRegister from 'c/c-register.vue';
import CFooter from 'c/c-footer.vue';

const showRegister = ref(false);

showRegister.value = window.location.search.indexOf('path=register') > -1;
</script>