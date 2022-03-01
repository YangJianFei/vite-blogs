<template>
  <div id="blogHead">
    <div id="title">
      <h1>{{blogHead.title}}</h1>
    </div>
    <div id="date">
      创建时间:{{blogHead.date}}
    </div>
    <div id="keyword">
      关键词: {{blogHead.keyword}}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Engine from "../core/markdownEngine/Engine"
import "../core/markdownEngine/Engine.css"

const props = defineProps(["markdownFileContent"]);

const name = ref("BlogHead");
const blogHead = ref({
  title: "加载中...",
  date: "加载中...",
  keyword: "加载中..."
});
const engine = ref(null);

watch(() => props.markdownFileContent, () => {
  getBlogHead();
});

const getBlogHead = async () => {
  if (props.markdownFileContent === null)
    return;
  try {
    engine.value = new Engine(props.markdownFileContent);
    blogHead.value = engine.value.getBlogHead();
  } catch (e) {
    blogHead.value = "获取标题信息失败"
    throw e;
  }
}

getBlogHead();
</script>