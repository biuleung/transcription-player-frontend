<template>
  <div class="d-flex justify-content-end">
    <div class="btn-group dropleft">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Login
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item" href="#" @click="onGoolgeLogin"
            ><i class="bi bi-google"></i> Google</a
          >
        </div>
      </button>
    </div>
  </div>
</template>
<script setup>
import { v4 as uuidv4 } from "uuid";

let windowObjectReference = null;
let previousUrl = null;

const onGoolgeLogin = async () => {
  const uuid = uuidv4();
  const source = new EventSource(
    `${process.env.VUE_APP_API_SERVER_BASE_URL}authentication/${uuid}/subscribe-login-state`
  );
  source.addEventListener("message", (e) => {
    if (e.data) {
      windowObjectReference.close();
      source.close();
    }
  });

  const url = `${process.env.VUE_APP_API_SERVER_BASE_URL}authentication/google/redirect/`;
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
</script>

<style scoped></style>
