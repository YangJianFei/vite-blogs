<template>
  <div id="blogBrief">
    <a id="blogTitle" :href="'./blog.html?path='+classification+'&filename='+filename">{{blogTitle}}</a>
    <div id="blogDetail">{{blogDetail}}</div>
    <div id="blogHead">
      <div id="blogKeyword">关键词: {{blogKeyword}}</div>
      <div id="blogDate">{{blogDate}}</div>
      <div id="classification">分类: {{classificationName}}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import Engine from "../core/markdownEngine/Engine";

const props = defineProps(["classification", "filename"]);

const markdownFilePath = ref("");
const blogTitle = ref("");
const blogDetail = ref("");
const blogDate = ref("");
const blogKeyword = ref("");
const classificationName = ref("");
const engine = ref(null);

watch(markdownFilePath, () => {
  nextTick(() => {
    if (!markdownFilePath.value && engine.value) {

    } else {
      calculateData();
    }
  });
});

const calculateData = async () => {
  if (!markdownFilePath.value && engine.value) {
    return;
  }
  markdownFilePath.value =
    "./blogs/" + props.classification + "/" + props.filename;
  let markdownFileContent = await (
    await fetch(markdownFilePath.value)
  ).text();
  engine.value = new Engine(markdownFileContent);
  let blogHead = engine.value.getBlogHead();
  blogTitle.value = blogHead.title;
  blogDate.value = blogHead.date;
  blogKeyword.value = blogHead.keyword;
  //计算博文分类名称
  let classificationTxt = await (
    await fetch("./blogs/name.txt")
  ).text();
  let startIndex =
    classificationTxt.indexOf(props.classification) +
    props.classification.length +
    1;
  let endIndex = classificationTxt.indexOf("\n", startIndex);
  classificationName.value = classificationTxt.slice(
    startIndex,
    endIndex
  );

  //计算博文开头内容
  let blogDetailContent = "";

  let contentBeginLineIndex;
  let fileContentList = markdownFileContent.split("\n");
  for (let lineIndex in fileContentList) {
    lineIndex = Number.parseInt(lineIndex);
    if (fileContentList[lineIndex].indexOf("*/") !== -1) {
      contentBeginLineIndex = lineIndex + 1;
      break;
    }
  }
  //取内容前5行作为博文简介
  let count = 0;
  for (
    let lineIndex = contentBeginLineIndex;
    count <= 10 && lineIndex < fileContentList.length;
    lineIndex++, count++
  ) {
    //去除#号
    let start;
    for (let i = 0; i < fileContentList[lineIndex].length; i++) {
      if (fileContentList[lineIndex][i] !== "#") {
        start = i;
        break;
      }
    }
    blogDetailContent += fileContentList[lineIndex].slice(start);
  }
  blogDetail.value = blogDetailContent.replace(/\s+/g, '').replace(/<[^>]+>/g, '').substr(0, 300);
}

calculateData();
</script>

<style lang="scss" scoped>
#blogBrief {
  border-bottom: 1px solid gray;
  padding: 1rem 1rem;
  margin: 1rem 0;
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
    0 1px 5px 0 rgb(0 0 0 / 12%);
  border-radius: 0.2rem;
  a {
    text-decoration: none;
    &:link {
      color: black;
      text-decoration: none;
    }
    &:visited {
      color: black;
      text-decoration: none;
    }
    &:hover {
      color: black;
      text-decoration: none;
    }
    &:active {
      color: black;
      text-decoration: none;
    }
  }
  #blogTitle {
    color: var(--theme-color);
    font-size: 1.5rem;
    font-weight: bold;
  }
  #blogDetail {
    color: var(--theme-text-light-1);
    margin: 0.2rem 0 0.2rem 0;
  }
  #blogHead {
    &::before {
      content: " ";
      height: 1rem;
      width: 100%;
      display: block;
      border-bottom: 1px dashed grey;
      float: right;
    }
    #blogKeyword {
      display: block;
    }
    #blogDate {
      margin-right: 1rem;
      float: right;
    }

    #classification {
      display: inline-block;
      margin-right: 1rem;
    }
    &::after {
      content: "";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
  }
}
</style>