<template>
  <div id="main">
    <div>
      {{classification}}
    </div>
    <hr>
    <a v-for="blogName in blogListData" :key="blogName" :href="'blog.html'+'?'+'path='+classification+'&filename='+blogName" target="_blank">
      {{blogName.endsWith(".md")?blogName.slice(0,-3):blogName}}
    </a>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Engine from "../core/markdownEngine/Engine"

const props = defineProps(['classification']);

const name = ref("BlogsList");
const blogListData = ref(null);
const components = ref({});

const getBlogsListByClassification = async () => {
  if (!props.classification) {
    console.log("try again after 100ms");
    setTimeout(getBlogsListByClassification, 100);
    return;
  }

  let nameTxtCountent = await (await fetch("./blogs/" + props.classification + "/name.txt")).text();
  blogListData.value = nameTxtCountent.split('\n').map((blogFile) => blogFile.trim())
};
const getBlogContentByFilename = async (blogFileName) => {
  let text = await (await fetch("./blogs/" + props.classification + "/" + blogFileName)).text();
}

onMounted(() => {
  getBlogsListByClassification();
});
</script>

<style lang="scss" scoped>
div[id="main"] {
  border: 1px solid gray;
  padding: 1rem;
  width: 10rem;
  a {
    display: block;
    text-decoration-line: none;
    margin: 0.2em;

    width: 100%;
    word-wrap: break-word;
    word-break: normal;
  }
}
</style>>
