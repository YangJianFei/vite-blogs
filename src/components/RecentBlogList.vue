<template>
  <div id="blogList">
    <BlogBrief v-for="blog in recentBlogList" :key="blog.blogName+blog.time" :classification="blog.classification" :filename="blog.blogName" />
    <h1 v-if="recentBlogList.length===0" style="text-align:center">未找到文件</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Engine from "../core/markdownEngine/Engine"
import { getBlogUnixTime, getClassificationList, getBlogListByClassification } from "../core/Utils"
import BlogBrief from "./BlogBrief.vue"

const props = defineProps(["start", "end"]);
const recentBlogList = ref([]);

const calculateRecentBlogList = async () => {
  let classificationList = await getClassificationList();
  let allBlogList = [];
  for (let classification of classificationList) {
    let blogList = await getBlogListByClassification(classification.folderName);
    for (let blogName of blogList) {
      let time = await getBlogUnixTime(classification.folderName, blogName);
      allBlogList.push({ classification: classification.folderName, blogName, time })
    }
  }
  allBlogList.sort((blog0, blog1) => blog1.time - blog0.time)
  recentBlogList.value = allBlogList.slice(props.start, props.end);
}

calculateRecentBlogList();
</script>

<style>
</style>