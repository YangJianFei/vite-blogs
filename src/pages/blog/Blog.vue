<template>
  <div>
    <TopBar />
    <div id="main">
      <div id="content">
        <ElSkeleton :loading="loading" animated>
          <template #template>
            <ElSkeletonItem variant="h1" style="width:50%;margin-top:1rem;"></ElSkeletonItem>
            <div>
              <ElSkeletonItem variant="text" style="width:200px"></ElSkeletonItem>
            </div>
            <ElSkeletonItem variant="text" style="width:200px"></ElSkeletonItem>
            <ElSkeletonItem variant="p"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="text"></ElSkeletonItem>
            <ElSkeletonItem variant="p"></ElSkeletonItem>
          </template>
          <template #default>
            <div id="blogHead">
              <BlogHead :markdownFileContent="markdownFileContent" />
            </div>
            <div id="blogContent">
              <BlogContent :markdownFileContent="markdownFileContent" />
            </div>
          </template>
        </ElSkeleton>
      </div>
      <CFooter />
    </div>
    <ElBacktop />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TopBar from "../../components/TopBar.vue";
import BlogHead from "../../components/BlogHead.vue";
import BlogContent from "../../components/BlogContent.vue";
import CFooter from 'c/c-footer.vue';
import { ElBacktop, ElSkeleton, ElSkeletonItem } from 'element-plus';

const markdownFileContent = ref(null);
const markdownFilePath = ref('');
const loading = ref(true);

const loadPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, 300);
});

const getPath = () => {
  let url = window.location.href;
  let reg = /\?.+/;
  let parmas = reg.exec(url)[0] ? reg.exec(url)[0] : null;
  if (parmas) {
    parmas = parmas.slice(1).split("&");
    markdownFilePath.value =
      "./blogs/" + parmas[0].slice(5) + "/" + parmas[1].slice(9);
  }
  getMarkdownFileContent();
};

const getMarkdownFileContent = async () => {
  try {
    markdownFileContent.value = await (
      await fetch(markdownFilePath.value)
    ).text();
  } catch (e) {
    console.log("获取博文markdown失败");
    throw e;
  }
  loadPromise.then(() => {
    loading.value = false;
  });
}

getPath();
</script>
