<template>
  <div
    :style="{
      border: 'solid var(--bs-border-color) 1px',
      borderRadius: 'var(--bs-border-radius)',
      padding: '1rem .75rem',
      height: '298px',
      overflowY: 'scroll',
      marginBottom: '0',
    }"
  >
    <div
      :style="{
        justifyContent: 'start',
        alignItems: 'start',
        fontSize: '1.5rem',
        gap: '10px',
        borderBottom: '1px lightgray solid',
      }"
      v-for="(script, index) in props.scripts.results"
      v-bind:key="index"
      class="row"
    >
      <div :style="{ width: '13%', minWidth: '182px' }" class="pointer">
        <span
          @click="onDurationClick(script.id, script.startTime, script.endTime)"
          class="color-gray"
          :class="{ 'text-warning': props.selectedId === script.id }"
        >
          <span class="">[{{ script.startTime }} - </span>
          <span class="">{{ script.endTime }}]</span>
        </span>
      </div>
      <div :style="{ width: '5%', minWidth: '70px' }">
        <button
          @click="onCheckClick(script.id)"
          :style="{ width: '57.7px' }"
          class="h-50 btn btn-sm btn-outline-primary py-0"
          :class="{ hidden: script.visible }"
        >
          Check
        </button>
        <button
          @click="onHideClick(script.id)"
          :style="{ width: '57.7px' }"
          class="h-50 btn btn-sm btn-outline-primary py-0"
          :class="{ hidden: !script.visible }"
        >
          hide
        </button>
      </div>
      <div :style="{ width: '80%' }">
        <span
          :style="{
            textAlign: 'start',
          }"
          class="align-self-center"
          :class="{
            hidden: !script.visible,
            'd-flex': script.visible,
            'color-gray': props.selectedId !== script.id,
            'text-warning': props.selectedId == script.id,
          }"
          >{{ script.transcript }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["scripts", "selectedId"]);
const emit = defineEmits(["durationClick", "checkClick", "hideClick"]);

const onDurationClick = (id, startTime, endTime) => {
  emit("durationClick", id, startTime, endTime);
};

const onCheckClick = (id) => {
  emit("checkClick", id);
};

const onHideClick = (id) => {
  emit("hideClick", id);
};
</script>
<style></style>
