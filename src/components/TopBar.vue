<template>
  <div id="topbar" class="grid-3">
    <a class="company-name" :class="hightLight==='index'?'hight-light':''" :href="'./index.html'"><img class="company-icon" v-if="companyInfo?.icon" :src="companyInfo?.icon">{{companyInfo?.name}}</a>
    <div class="tx-center">
      <a id="classification" v-for="classification of classifications" :key="JSON.stringify(classification)" :class="Object.keys(classification)[0]===hightLight?'hight-light':''" :href="'./classification.html?classification='+Object.keys(classification)[0]">{{Object.values(classification)[0]}}</a>
    </div>
    <CUser />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CUser from 'c/c-user.vue';

const props = defineProps(["hightLight"]);

const name = ref("TopBar");
const classifications = ref([]);
const companyInfo = ref({});

const getClassifications = async () => {
  if (classifications.value.length !== 0) return;
  let classTxtContentList = (
    await (await fetch("./blogs/name.txt")).text()
  ).split("\n");
  for (let classStr of classTxtContentList) {
    if (!/.+:.+/.test(classStr)) continue;
    let folderName = classStr.slice(0, classStr.indexOf(":"));
    let showName = classStr.slice(classStr.indexOf(":") + 1);
    let classification = {};
    classification[folderName] = showName;
    classifications.value.push(classification);
  }
};

const getCompanyInfo = async () => {
  let data = await (await fetch('./data.json')).json();
  companyInfo.value = data.companyInfo;
};

getClassifications();
getCompanyInfo();
</script>

<style lang="scss">
#topbar {
  a {
    line-height: 4rem;
  }
}
</style>

<style lang="scss" scoped>
#topbar {
  position: sticky;
  top: 0;
  width: 100%;
  padding: 0 10vw 0 10vw;
  height: 4rem;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(30px);
  box-sizing: border-box;
  z-index: 900;

  #classification {
    display: inline-block;
    min-width: 2rem;
    margin: 0 0.75rem;
    transition: 200ms;
    &[class="hight-light"] {
      border-bottom: 2px solid grey;
    }
  }
  .company-name {
    font-size: 1.5rem;
    font-weight: bold;
    font-family: "楷体";
  }
  .company-icon {
    width: 120px;
    margin-right: 12px;
  }
}
</style>