<template>
  <div id="blogContent" v-html="blogContentDom"></div>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import Engine from "../core/markdownEngine/Engine"
import "../core/markdownEngine/Engine.css"

const props = defineProps(["markdownFileContent"]);

const name = ref("BlogContent");
const blogContentDom = ref("加载中...");
const engine = ref(null);

watch(() => props.markdownFileContent, () => {
  getBlogContent();
});

const getBlogContent = async () => {
  if (props.markdownFileContent === null)
    return;
  try {
    engine.value = new Engine(props.markdownFileContent);
    blogContentDom.value = engine.value.getBlogContentDom();
  } catch (e) {
    blogContentDom.value = "获取内容失败";
    throw e;
  }
}

onBeforeMount(() => {
  getBlogContent();
});
</script>