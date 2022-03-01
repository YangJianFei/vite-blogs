<template>
  <div>
    <TopBar />
    <div id="main">
      <div id="content">
        <div id="blogHead">
          <BlogHead :markdownFileContent="markdownFileContent" />
        </div>
        <div id="blogContent">
          <BlogContent :markdownFileContent="markdownFileContent" />
        </div>
      </div>
      <CFooter />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TopBar from "../../components/TopBar.vue";
import BlogHead from "../../components/BlogHead.vue";
import BlogContent from "../../components/BlogContent.vue";
import CFooter from 'c/c-footer.vue';

const markdownFileContent = ref(null);
const markdownFilePath = ref('');

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
}

getPath();
</script>
