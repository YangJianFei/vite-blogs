<template>
  <div id="blogList">
    <ElSkeleton :loading="loading" :count="3" animated>
      <template #template>
        <div class="skeleton-card">
          <ElSkeletonItem variant="h1" style="width:50%"></ElSkeletonItem>
          <ElSkeletonItem variant="text"></ElSkeletonItem>
          <ElSkeletonItem variant="text"></ElSkeletonItem>
          <ElSkeletonItem variant="text"></ElSkeletonItem>
          <ElSkeletonItem variant="text" style="width:200px"></ElSkeletonItem>
          <div class="grid-3">
            <ElSkeletonItem variant="text" style="width:200px"></ElSkeletonItem>
            <span></span>
            <ElSkeletonItem variant="text" style="width:150px"></ElSkeletonItem>
          </div>
        </div>
      </template>
      <template #default>
        <BlogBrief v-for="blog in recentBlogList" :key="blog.blogName+blog.time" :classification="blog.classification" :filename="blog.blogName" />
      </template>
    </ElSkeleton>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Engine from "../core/markdownEngine/Engine"
import { getBlogUnixTime, getClassificationList, getBlogListByClassification } from "../core/Utils"
import BlogBrief from "./BlogBrief.vue"
import { ElSkeleton, ElSkeletonItem } from 'element-plus'

const props = defineProps(["start", "end"]);
const recentBlogList = ref([]);
const loading = ref(true);

const loadPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, 300);
});

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
  loadPromise.then(() => {
    loading.value = false;
  });
}

calculateRecentBlogList();
</script>

<style lang="scss" scoped>
.skeleton-card {
  margin: 1rem 0;
}
</style>