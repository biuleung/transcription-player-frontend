<template>
  <div class="d-flex justify-content-end m-2">
    <div class="btn-group dropleft" v-show="panelVisible.isVisible">
      <button
        v-if="!hasLogin"
        class="btn btn-primary dropdown-toggle color-white"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Login
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item d-flex gap-1" href="#" @click="onGoolgeLogin"
            ><i class="bi bi-google d-flex align-items-center"></i> Google</a
          >
        </div>
      </button>

      <div v-if="hasLogin" class="d-flex gap-2 align-items-center">
        <span>{{ accountName }}</span>
        <button @click="onLogout" class="btn btn-info" type="button">
          Logout
        </button>
      </div>
    </div>
  </div>
  <router-view></router-view>
  <div v-if="!panelVisible.isVisible">
    <RssFeed :feedUrl="'https://feeds.simplecast.com/54nAGcIl'" :limit="'4'" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import { usePanelVisibleStore } from "@/stores/panel-visible";
import { useCurrentUserIdStore } from "@/stores/current-user-id";
import { useTranscriptStore } from "@/stores/transcript";
import * as customLocalStorage from "../utils/LocalStorage";
import { getUserInfo } from "../api-services/services/login";
import RssFeed from "./RssFeed.vue";

let windowObjectReference = null;
let previousUrl = null;

const hasLogin = ref(false);
const accountName = ref(null);

const panelVisible = usePanelVisibleStore();
const currentUserId = useCurrentUserIdStore();
const transcript = useTranscriptStore();

const checkExistedLoginUser = async () => {
  const user = customLocalStorage.getItem("user");
  if (user && user.userId && user.accessToken) {
    try {
      const userInfo = await getUserInfo({
        userId: user.userId,
        accessToken: user.accessToken,
      });
      setUserInfo(userInfo.data);
      currentUserId.setId(user.userId);
      if (userInfo.data.transcription) {
        transcript.setTranscript(userInfo.data.transcription);
      }
    } catch (error) {
      // TODO handle error
      console.log(error);
    }
  }
};

const onGoolgeLogin = async () => {
  const source = new EventSource(
    `${process.env.VUE_APP_API_SERVER_BASE_URL}authentication/google`
  );
  source.addEventListener("message", (e) => {
    if (e.data) {
      const userInfo = JSON.parse(e.data);
      customLocalStorage.setItem("user", {
        userId: userInfo.userId,
        accessToken: userInfo.user.accessToken,
      });
      if (userInfo.userId) {
        currentUserId.setId(userInfo.userId);
      }
      if (userInfo.isActive) {
        setUserInfo(userInfo.user);
        source.close();
        window.focus();
      } else {
        source.close();
      }
    } else {
      hasLogin.value = false;
    }
  });

  const url = `${process.env.VUE_APP_API_SERVER_BASE_URL}authentication/google/redirect`;
  const strWindowFeatures =
    "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";
  if (windowObjectReference === null || windowObjectReference.closed) {
    windowObjectReference = window.open(url, "auth", strWindowFeatures);
  } else if (previousUrl !== url) {
    windowObjectReference = window.open(url, "auth", strWindowFeatures);
    windowObjectReference.focus();
  } else {
    windowObjectReference.focus();
  }
};

function setUserInfo(userInfo) {
  if (userInfo.userId) {
    currentUserId.setId(userInfo.userId);
  }
  accountName.value = userInfo.name;
  hasLogin.value = true;
}

function onLogout() {
  hasLogin.value = false;
  accountName.value = null;
  customLocalStorage.removeItem("user");
}

function askLoadPreviousTranscript() {}

checkExistedLoginUser();
</script>

<style scoped></style>
