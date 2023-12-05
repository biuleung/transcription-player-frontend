<template>
  <div class="h2 mb-0"></div>
  <div style="font-size: 87.5%; font-family: sans-serif">
    <div
      :style="{
        position: 'relative',
      }"
      class="justify-content-start"
    >
      <!-- <p class="d-flex p-0 m-0">audio cannot exceed 6 minutes</p> -->
      <div class="input-group custom-file-button">
        <v-file-input
          ref="inputVT"
          accept="video/*,audio/*"
          label="only mp3, mov accepted (audio cannot exceed 6 minutes)"
          @change="uploadFile"
        ></v-file-input>
      </div>
    </div>
    <div
      ref="myResizable"
      :style="{ background: '#ddd', minHeight: '64px', minWidth: '100%' }"
      class="pt-1"
    ></div>
    <div class="form-floating my-2">
      <div
        :style="[
          isLoadingTranscription
            ? { display: 'inline-block' }
            : { display: 'none' },
          { position: 'absolute', top: '40%' },
        ]"
        class="spinner-border"
        role="status"
      >
        <span class="sr-only"></span>
      </div>
      <div>
        <DisplayedTranscription
          :scripts="scripts"
          :selectedId="selectedDurationId"
          @durationClick="onDurationClick"
          @checkClick="onCheckClick"
          @hideClick="onHideClick"
        />
      </div>
    </div>
    <div class="form-floating my-2">
      <textarea
        :style="{
          fontSize: '22px',
          height: '5.5rem',
        }"
        class="form-control"
        placeholder="Leave a comment here"
        id="floatingTextarea"
      ></textarea>
      <label for="floatingTextarea">Type here</label>
    </div>
    <!-- takes one of the players -->
    <div id="timeInputs" ref="timeInputs" style="margin: 3px 0px 0px 0px">
      <div
        :style="{
          margin: '3px 0px 0px 0px',
          padding: '5px',
          backgroundColor: '#eee',
        }"
      >
        <div class="d-flex gap-2 justify-content-center align-items-center">
          <button
            :disabled="hasVideo == false"
            @mousedown="onJumpToA"
            @mouseup="myPlay()"
            type="button"
            class="btn btn-sm btn-outline-dark"
          >
            <i class="bi bi-arrow-clockwise"></i>
          </button>

          <label for="myTimeA">A:</label>
          <input
            ref="timeARef"
            :disabled="hasVideo == false || true"
            v-model="startedLoopTime"
            size="8"
          />
          <label for="timeBRef" ref="timeBRef">B:</label>
          <input
            :disabled="hasVideo == false || true"
            v-model="endedLoopTime"
            onchange="onInputTime(this,1)"
            size="8"
          />
        </div>
        <div class="d-flex mt-2 gap-1 justify-content-center">
          <div
            :disabled="hasVideo == false"
            :class="{ disabled: hasVideo == false, pointer: hasVideo == true }"
            id="loopForwardsButton"
            :style="{ fontSize: 'x-large' }"
            @mousedown="onPlayBackward(movingDuration)"
          >
            <div>
              <img
                :style="{ height: '2rem' }"
                :src="getImagPath('svg/backward-svgrepo-com.svg')"
              />
            </div>
          </div>
          <button
            :disabled="hasVideo == false"
            v-on:mouseup="changeSpeed(0.5)"
            type="button"
            class="btn btn-sm speed-btn"
            :class="{
              'btn-primary': playbackRate === 0.5 && hasVideo == true,
              'btn-outline-primary': playbackRate !== 0.5 && hasVideo == true,
            }"
          >
            x0.5
          </button>
          <button
            :disabled="hasVideo == false"
            v-on:mouseup="changeSpeed(0.75)"
            type="button"
            class="btn btn-sm speed-btn"
            :class="{
              'btn-primary': playbackRate === 0.75 && hasVideo == true,
              'btn-outline-primary': playbackRate !== 0.75 && hasVideo == true,
            }"
          >
            x0.75
          </button>
          <button
            :disabled="hasVideo == false"
            v-on:mouseup="changeSpeed(1)"
            type="button"
            class="btn btn-sm speed-btn"
            :class="{
              'btn-primary': playbackRate === 1 && hasVideo == true,
              'btn-outline-primary': playbackRate !== 1,
            }"
          >
            x1
          </button>
          <div
            id="loopForwardsButton"
            :style="{ fontSize: 'x-large' }"
            @mousedown="onPlayForward(movingDuration)"
            :class="{ disabled: hasVideo == false, pointer: hasVideo == true }"
          >
            <div>
              <img
                :style="{ height: '2rem' }"
                :src="getImagPath('svg/forward-svgrepo-com.svg')"
              />
            </div>
          </div>
        </div>
        <div id="speed-handle" class="ui-slider-handle"></div>
      </div>
    </div>

    <div
      id="bottom"
      :disabled="hasVideo == false"
      :style="{
        margin: '3px 0px 0px 0px',
        padding: '5px',
        backgroundColor: '#ddd',
        position: 'relative',
      }"
    >
      <div class="d-flex justify-content-center gap-2 align-content-center">
        <label for="loopButton" class="align-self-center">A-B Loop:</label>
        <div class="position-relative">
          <button
            id="loopButton"
            ref="loopButton"
            @mousedown="onLoopDown"
            :disabled="hasVideo == false"
            :style="{
              width: '1.6em',
              height: '1.6em',
              padding: '0px',
              margin: '0px',
              backgroundSize: '80%',
              verticalAlign: 'baseline',
            }"
            class="btn btn-lg"
            :class="{
              disabled: hasVideo == false,
              active: hasVideo == true,
              'btn-primary': hasVideo == true,
              'bg-red': !!isTimeBSet,
            }"
          >
            A
          </button>
          <span
            class="align-self-end position-absolute"
            :style="{
              fontSize: '10px',
              width: 'max-content',
              top: '18px',
              left: '35px',
            }"
            >(shortcut: shift + B)
          </span>
        </div>
      </div>
    </div>
    <hr class="double" style="margin-top: 0px" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { apiGetTranscription } from "@/api-services/services/transcription";
import DisplayedTranscription from "./DisplayedTranscription.vue";
import { formattedTime, formattedTimeToSec } from "../utils/FormattedTime";

let myVideo;
let timeA, timeB;
let isTimeASet = false;
let isTimeBSet = false;
const loopTimer = [];
const loopMeas = [];

const inputVT = ref(null);
const myResizable = ref(null);
const timeInputs = ref(null);
const loopButton = ref(null);
const timeARef = ref(null);
const timeBRef = ref(null);
const playbackRate = ref(1);
const movingDuration = ref(2);
const scripts = ref({ id: null, totalTime: null, results: [] });
const selectedDurationId = ref(null);
const isLoadingTranscription = ref(false);

const startedLoopTime = ref();
const endedLoopTime = ref();
const hasVideo = ref(false);

let myPlay;

const initSettings = () => {
  timeA = null;
  timeB = null;
  isTimeASet = false;
  isTimeBSet = false;
  timeARef.value = null;
  timeBRef.value = null;
  startedLoopTime.value = null;
  endedLoopTime.value = null;
  loopButton.value.innerHTML = "A";
  scripts.value = { id: null, totalTime: null, results: [] };
  selectedDurationId.value = null;
};

const init = () => {
  myGetCurrentTime;
  myGetDuration;
  myPlay = function () {
    myVideo.play();
  };
};

const myBlur = function () {
  document.activeElement.blur();
};

const myGetDuration = function () {
  return myVideo.duration;
};

const mySetCurrentTime = function (t) {
  if (t !== null) {
    myVideo.currentTime = t;
  }
};

const myGetCurrentTime = function () {
  return myVideo.currentTime;
};

function getImagPath(image) {
  return require("@/assets/" + image);
}

function getDuration(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      console.log("rejct");
      return resolve(false);
    }
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = (e) => {
      const ctx = new AudioContext();
      const audioArrayBuffer = e.target.result;
      ctx.decodeAudioData(
        audioArrayBuffer,
        (data) => {
          const duration = data.duration;
          resolve(duration);
        },
        (error) => {
          console.error(error);
          reject(false);
        }
      );
    };
  });
}

async function uploadFile(event) {
  if (event?.target?.files) {
    const formData = new FormData();
    const file = event?.target?.files[0];
    formData.append("file", file);
    let duration;
    try {
      duration = await getDuration(file);
    } catch (error) {
      console.log(error);
    }
    if (duration > 360) {
      alert(
        "If you want to obtain the transcript, the audio duration should not exceed 6 minutes."
      );
    } else if (duration === false) {
      console.log("error happened while get audio's duration");
    } else {
      initSettings();
      getTranscription(formData);
    }
  }
}

function getTranscription(formData) {
  isLoadingTranscription.value = true;
  try {
    apiGetTranscription(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        const { data } = res;
        scripts.value = {
          totalTime: data.totalTime,
          results: data.results?.map((res) => ({
            id:
              formattedTime(res.words[0].startTime.seconds) +
              formattedTime(res.endTime.seconds),
            transcript: res.transcript,
            startTime: formattedTime(res.words[0].startTime.seconds),
            endTime: formattedTime(res.endTime.seconds),
            visible: false,
          })),
        };
        isLoadingTranscription.value = false;
        selectedDurationId.value = null;
      })
      .catch((error) => {
        console.log(error);
        alert("Unexpected error, try again");
        isLoadingTranscription.value = false;
      });
  } catch (error) {
    alert("Unexpected error, try again");
    isLoadingTranscription.value = false;
  }
}

const onDurationClick = (id, startTime, endTime) => {
  cancelABLoop();
  timeA = formattedTimeToSec(startTime) - 0.2;
  timeB = formattedTimeToSec(endTime) + 0.6; //0.6: add some buffer time
  const currentTime = myGetCurrentTime();

  if (timeA < 0) {
    timeA = 0;
  }
  if (timeB > scripts.value.totalTime) {
    timeB = scripts.value.totalTime;
  }

  isTimeASet = true;
  isTimeBSet = true;
  startedLoopTime.value = startTime;
  endedLoopTime.value = endTime;
  loopButton.value.innerHTML = "X";
  if (timeA < currentTime && timeB < currentTime) {
    myVideo.currentTime = timeA;
  }
  selectedDurationId.value = id;
  loopTimer.push(setInterval(onLoopTimerUpdate, 5));
  myVideo.play();
};

const onCheckClick = (id) => {
  const selectedScript = scripts.value.results.find((res) => res.id === id);
  if (selectedScript) {
    selectedScript.visible = true;
  }
};

const onHideClick = (id) => {
  const selectedScript = scripts.value.results.find((res) => res.id === id);
  if (selectedScript) {
    selectedScript.visible = false;
  }
};

const onLoopDown = function () {
  if (isTimeBSet) {
    cancelABLoop();
  } else {
    if (isTimeASet) {
      if (myGetCurrentTime() != timeA) {
        if (myGetCurrentTime() < timeA) {
          timeB = timeA;
          timeA = myGetCurrentTime();
        } else {
          timeB = myGetCurrentTime();
        }
        isTimeBSet = true;
        loopButton.value.innerHTML = "X";
        if (!myVideo.paused && !loopTimer.length)
          loopTimer.push(setInterval(onLoopTimerUpdate, 5));
      }
    } else {
      timeA = myGetCurrentTime();
      isTimeASet = true;
      loopButton.value.innerHTML = "B";
    }
    if (isTimeASet) {
      startedLoopTime.value = formattedTime(timeA);
    }
    if (isTimeBSet) {
      endedLoopTime.value = formattedTime(timeB);
    }
  }
};

const cancelABLoop = function () {
  while (loopTimer.length) clearInterval(loopTimer.pop());
  isTimeASet = isTimeBSet = false;
  timeA = null;
  loopButton.value.innerHTML = "A";
  loopButton.value.style.backgroundImage = "none";
  loopMeas.splice(0);
  startedLoopTime.value = null;
  endedLoopTime.value = null;
};

const onJumpToA = () => {
  if (!timeA) return;
  myVideo.pause();
  mySetCurrentTime(timeA);
};

const onPlayBackward = (second) => {
  if (!myVideo) return;
  myVideo.pause();
  mySetCurrentTime(myGetCurrentTime() - second);
  myVideo.play();
};

const onPlayForward = (second) => {
  if (!myVideo) return;
  myVideo.pause();
  mySetCurrentTime(myGetCurrentTime() + second);
  myVideo.play();
};

const changeSpeed = (rate) => {
  if (playbackRate.value === rate) {
    playbackRate.value = 1;
    myVideo.playbackRate = playbackRate.value;
  } else {
    playbackRate.value = rate;
    myVideo.playbackRate = rate;
  }
};

const playSelectedFile = function (f) {
  init(); //initialize player-specific functions
  myVideo = document.createElement("audio");
  myVideo.id = "myVideo";
  myVideo.autoplay = false;
  myVideo.controls = true;
  myVideo.style.width = "99%";
  myVideo.addEventListener("durationchange", function (e) {
    // eslint-disable-next-line no-empty
    if (isFinite(e.target.duration)) {
    } else {
      e.target.src = e.target.currentSrc;
    }
  });
  while (myResizable.value.lastElementChild) {
    myResizable.value.removeChild(myResizable.value.lastElementChild);
  }
  myResizable.value.appendChild(myVideo);
  hasVideo.value = true;

  if (
    process.env.VUE_APP_MODE === "demonstration" ||
    !process.env.VUE_APP_MODE
  ) {
    myVideo.src = new Audio(
      "/transcription-player-frontend/demo/free_112sec.mov"
    ).src;
  } else {
    if (f) {
      try {
        myVideo.srcObject = f;
      } catch (e) {
        myVideo.src = URL.createObjectURL(f);
      }
    }
  }
};

const onLoopTimerUpdate = () => {
  let currentTime = myGetCurrentTime();
  if (currentTime < timeA) loopMeas.splice(0);
  if (currentTime <= timeA || currentTime >= timeB) {
    let curDate = Date.now() / 1000; //[s]
    if (
      currentTime >= timeB &&
      (!loopMeas.length ||
        curDate - loopMeas.at(-1) >= (timeB - timeA) / playbackRate.value)
    ) {
      loopMeas.push(curDate);
    }
    mySetCurrentTime(timeA);
  }
};

onMounted(() => {
  if (
    process.env.VUE_APP_MODE === "demonstration" ||
    !process.env.VUE_APP_MODE
  ) {
    playSelectedFile();
    getTranscription();
  }
  inputVT.value.addEventListener("change", function (e) {
    myBlur();
    playSelectedFile(e.target.files[0]);
    scripts.value = { id: null, totalTime: null, results: [] };
  });
  addEventListener("keydown", (event) => {
    if (myVideo) {
      switch (event.code) {
        case "ArrowRight":
          onPlayForward(movingDuration.value);
          break;
        case "ArrowLeft":
          onPlayBackward(movingDuration.value);
          break;
        default:
          break;
      }

      // shift + space
      if (event.shiftKey && event.code === "Space") {
        if (myVideo.paused) {
          myVideo.play();
        } else if (myVideo.played) {
          myVideo.pause();
        }
      }

      // shift + b
      if (event.shiftKey && event.code === "KeyB") {
        onLoopDown();
      }
    }
  });

  watch(isLoadingTranscription, (current) => {});
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.speed-btn {
  width: 53px;
}
</style>
