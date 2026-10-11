<script setup lang="ts">
// Animated version of /hero/blob-corner.svg: breathes and reshapes while staying
// anchored to its corner (the path's bottom-left, which the parent may rotate).
const id = useId()
</script>

<template>
  <div
    class="corner-blob"
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 600 400"
      fill="none"
      class="size-full overflow-visible"
    >
      <defs>
        <radialGradient
          :id="`${id}-fill`"
          cx="10%"
          cy="15%"
          r="95%"
        >
          <stop
            offset="0"
            stop-color="#C22C1A"
            stop-opacity="0.85"
          />
          <stop
            offset="0.5"
            stop-color="#86291D"
            stop-opacity="0.6"
          />
          <stop
            offset="1"
            stop-color="#49110A"
            stop-opacity="0"
          />
        </radialGradient>
        <linearGradient
          :id="`${id}-rim`"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0"
            stop-color="#FA8468"
          />
          <stop
            offset="0.6"
            stop-color="#F6512F"
            stop-opacity="0.7"
          />
          <stop
            offset="1"
            stop-color="#F6512F"
            stop-opacity="0"
          />
        </linearGradient>
        <filter
          :id="`${id}-soft`"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter
          :id="`${id}-haze`"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="28" />
        </filter>
        <filter
          :id="`${id}-glow`"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur
            stdDeviation="8"
            result="b"
          />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <!-- outer haze -->
      <path
        class="corner-blob__morph"
        :filter="`url(#${id}-haze)`"
        fill="#F6512F"
        fill-opacity="0.35"
        d="M0 30C120 10 230 70 290 190C320 250 330 320 340 400H0V30Z"
      />
      <!-- body -->
      <path
        class="corner-blob__morph"
        :filter="`url(#${id}-soft)`"
        :fill="`url(#${id}-fill)`"
        d="M0 30C120 10 230 70 290 190C320 250 330 320 340 400H0V30Z"
      />
      <!-- glowing rim -->
      <path
        class="corner-blob__rim"
        :filter="`url(#${id}-glow)`"
        :stroke="`url(#${id}-rim)`"
        stroke-width="3"
        stroke-linecap="round"
        d="M0 30C120 10 230 70 290 190C320 250 330 320 340 400"
      />
    </svg>
  </div>
</template>

<style scoped>
.corner-blob {
  transform-origin: 0% 100%;
  animation: corner-blob-breathe 17s ease-in-out infinite;
}

.corner-blob__morph {
  animation: corner-blob-morph 13s ease-in-out infinite;
}

.corner-blob__rim {
  animation: corner-blob-rim 13s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .corner-blob,
  .corner-blob * {
    animation: none !important;
  }
}

@keyframes corner-blob-breathe {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.05) rotate(1.5deg); }
}

@keyframes corner-blob-morph {
  0%, 100% { d: path("M0 30C120 10 230 70 290 190C320 250 330 320 340 400H0V30Z"); }
  33% { d: path("M0 22C128 4 246 74 302 196C330 258 336 326 344 400H0V22Z"); }
  66% { d: path("M0 36C112 18 222 76 280 192C312 252 326 318 336 400H0V36Z"); }
}

@keyframes corner-blob-rim {
  0%, 100% { d: path("M0 30C120 10 230 70 290 190C320 250 330 320 340 400"); opacity: 0.8; }
  33% { d: path("M0 22C128 4 246 74 302 196C330 258 336 326 344 400"); opacity: 1; }
  66% { d: path("M0 36C112 18 222 76 280 192C312 252 326 318 336 400"); opacity: 0.9; }
}
</style>
