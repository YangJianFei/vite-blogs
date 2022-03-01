<template>
  <div>
    <TopBar :hightLight="classification" />
    <div id="main">
      <div id="content">
        <div id="blogList">
          <BlogBrief v-for="filename in blogList" :key="filename" :classification="classification" :filename="filename" />

          <h1 v-if="blogList.length===0" style="text-align:center">未找到文件</h1>
        </div>
      </div>
      <CFooter />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TopBar from "../../components/TopBar.vue";
import BlogBrief from "../../components/BlogBrief.vue";
import Engine from "../../core/markdownEngine/Engine";
import { getBlogUnixTime } from "../../core/Utils"
import CFooter from 'c/c-footer.vue';

const classification = ref(null);
const blogList = ref([]);

const getBlogList = async function () {
  let nameTxtCountent = await (
    await fetch("./blogs/" + classification.value + "/name.txt")
  ).text();
  blogList.value = nameTxtCountent
    .split("\n")
    .map(blogFile => blogFile.trim());
  if (blogList.value[0].indexOf("<!DOCTYPE html>") !== -1) {
    blogList.value = [];
  }

  let blogListTime = {}
  for (let filename of blogList.value) {
    blogListTime[filename] = await getBlogUnixTime(classification.value, filename);
  }
  blogList.value.sort(
    (filename0, filename1) => blogListTime[filename1] - blogListTime[filename0]
  );

};

let url = window.location.href;
let reg = /\?classification=.+/;
let parmas = reg.exec(url)[0] ? reg.exec(url)[0] : null;
classification.value = parmas.slice(16);
getBlogList();
</script>