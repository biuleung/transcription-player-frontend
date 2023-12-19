<template>
  <div class="d-flex justify-content-end">
    <button class="btn btn-info color-white" @click="nextFeed()">
      Next feed
    </button>
  </div>
  <div v-if="data.error" class="error">{{ data.error }}</div>
  <div v-else class="feed">
    <h1 v-if="data.feed.title !== undefined && data.feed.title !== null">
      {{ data.feed.title }}
    </h1>
    <div v-if="data.loading" class="spinner">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
    <div class="articles-container">
      <FeedArticle
        v-for="(article, index) of getArticles()"
        v-bind:key="index"
        v-bind:article="article"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watchEffect, onMounted, reactive } from "vue";
import FeedArticle from "./FeedArticle.vue";
import RSSParser from "rss-parser";

const feedUrls = reactive([
  "https://feeds.simplecast.com/54nAGcIl",
  "https://www.fictionontheweb.co.uk/feeds/posts/default?alt=rss",
]);

const limit = ref(4);
const currentFeedIndex = ref(0);

const props = defineProps(["feedUrl", "limit"]);
const data = reactive({
  loading: false,
  error: "",
  feed: {},
});

onMounted(fetchData);

watchEffect(() => {
  if (props.limit !== undefined) {
    getArticles();
  }
});

watchEffect(() => {
  if (currentFeedIndex.value !== null) {
    getArticles();
  }
});

async function fetchData() {
  data.error = "";
  data.loading = true;
  data.feed = {};
  try {
    const corsProxyUrl = "https://cors-anywhere.herokuapp.com/";

    const response = await fetch(feedUrls[currentFeedIndex.value]);
    if (response.ok) {
      const text = await response.text();
      const parser = new RSSParser();
      parser.parseString(text, (err, parsed) => {
        data.loading = false;
        if (err) {
          data.error = `Error occurred while parsing RSS Feed ${err.toString()}`;
        } else {
          data.feed = parsed;
        }
      });
    } else {
      data.error = "Error occurred while fetching the feed";
      data.loading = false;
    }
  } catch (e) {
    if (e.toString() === "TypeError: Failed to fetch") {
      data.error = "Error due to CORS policy";
    } else {
      data.error = e.toString();
    }
    data.loading = false;
  }
}

function getArticles() {
  if (data.feed.items && data.feed.items.length) {
    return data.feed.items.slice(0, props.limit);
  }
}

function nextFeed() {
  const currentIndex = currentFeedIndex.value;
  let randomIndex = currentIndex;
  while (randomIndex === currentIndex) {
    randomIndex = Math.ceil(Math.random() * feedUrls.length) - 1;
  }
  currentFeedIndex.value = randomIndex;
  fetchData();
}
</script>

<style scoped>
h1 {
  margin: 5px;
  font-size: 20px;
}
.feed {
  text-align: left;
}
a {
  color: #42b983;
}
/* CSS Spinner */
.spinner {
  margin: 40px auto 0;
  width: 150px;
  text-align: center;
}

.error {
  color: red;
}

.spinner > div {
  width: 18px;
  height: 18px;
  /* background-color: #ff641b; */
  background-color: #42b983;
  background-color: #777;
  margin-right: 10px;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
