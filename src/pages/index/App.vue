<template>
  <div>
    <TopBar hightLight="index" />
    <div id="main">
      <div>
        <ElSkeleton :loading="loading" animated>
          <template #template>
            <ElSkeletonItem variant="image" style="height:486px"></ElSkeletonItem>
            <img :src="banner1" @load="banner1Load" style="width:1px;height:1px;">
          </template>
          <template #default>
            <ElCarousel :height="bannerHeight" trigger="click">
              <ElCarouselItem v-for="(banner,index) in banners" :key="banner">
                <img @load="imgLoad(index)" :ref="img=>{if(img) imgs[index]=img}" class="banner-img" :src="banner">
              </ElCarouselItem>
            </ElCarousel>
          </template>
        </ElSkeleton>
        <div id="content">
          <div id="recentBlogList">
            <RecentBlogList :start="0" :end="15" />
          </div>
        </div>
      </div>
      <CFooter />
    </div>
    <ElBacktop />
  </div>
</template>

<script setup>
import { ref, onBeforeUpdate } from 'vue';

import TopBar from "../../components/TopBar.vue";
import RecentBlogList from "../../components/RecentBlogList.vue";
import CFooter from 'c/c-footer.vue';
import { ElCarousel, ElCarouselItem, ElBacktop, ElSkeleton, ElSkeletonItem } from 'element-plus';
import banner1 from '@/assets/image/banner1.png';
import banner2 from '@/assets/image/banner2.png';
import banner3 from '@/assets/image/banner3.png';

const banners = ref([banner1, banner2, banner3]);
const bannerHeight = ref(300);
const imgs = ref([]);
const loading = ref(true);

const loadingPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, 300);
});

const banner1Load = () => {
  loadingPromise.then(() => {
    loading.value = false;
  });
};

const imgLoad = (index) => {
  if (!index) {
    bannerHeight.value = getComputedStyle(imgs.value[0]).height;
  }
};

onBeforeUpdate(() => {
  imgs.value = [];
});
</script>

<style lang="scss" scoped>
.banner-img {
  width: 100%;
}
#main {
  margin-top: -4rem;
}
</style>
