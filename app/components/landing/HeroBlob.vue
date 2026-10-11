<script setup lang="ts">
// Animated version of /hero/blob-hero.svg: the blob drifts, turns and morphs
// within a few percent of its resting spot; the orbit line sways independently.
const id = useId()
</script>

<template>
  <div
    class="hero-blob"
    aria-hidden="true"
  >
    <div class="hero-blob__turn">
      <svg
        viewBox="0 0 800 760"
        fill="none"
        class="size-full overflow-visible"
      >
        <defs>
          <radialGradient
            :id="`${id}-fill`"
            cx="45%"
            cy="35%"
            r="70%"
          >
            <stop
              offset="0"
              stop-color="#FA8468"
            />
            <stop
              offset="0.55"
              stop-color="#F6512F"
            />
            <stop
              offset="1"
              stop-color="#E71407"
            />
          </radialGradient>
          <linearGradient
            :id="`${id}-ring`"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0"
              stop-color="#F6512F"
              stop-opacity="0.9"
            />
            <stop
              offset="1"
              stop-color="#F6512F"
              stop-opacity="0.2"
            />
          </linearGradient>
          <filter
            :id="`${id}-blur`"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>
        <!-- pulsing glow behind the blob -->
        <path
          class="hero-blob__morph hero-blob__glow"
          :fill="`url(#${id}-fill)`"
          :filter="`url(#${id}-blur)`"
          d="M410 60C530 50 630 120 670 230C700 310 780 340 770 450C760 560 680 620 580 640C490 658 450 730 330 720C210 710 90 650 70 540C55 450 140 420 150 330C160 230 130 160 200 110C260 68 330 66 410 60Z"
        />
        <!-- main blob -->
        <path
          class="hero-blob__morph"
          :fill="`url(#${id}-fill)`"
          d="M410 60C530 50 630 120 670 230C700 310 780 340 770 450C760 560 680 620 580 640C490 658 450 730 330 720C210 710 90 650 70 540C55 450 140 420 150 330C160 230 130 160 200 110C260 68 330 66 410 60Z"
        />
        <!-- orbit line -->
        <path
          class="hero-blob__orbit"
          :stroke="`url(#${id}-ring)`"
          stroke-width="2.5"
          d="M540 40c140-30 240 30 250 140 10 120-60 220-120 300-70 90-170 200-330 230-150 28-300-10-310-120-8-90 60-170 120-230"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.hero-blob {
  animation: hero-blob-drift 26s ease-in-out infinite;
}

.hero-blob__turn {
  width: 100%;
  height: 100%;
  transform-origin: 52% 51%;
  animation: hero-blob-turn 19s ease-in-out -4s infinite;
}

.hero-blob__morph {
  animation: hero-blob-morph 14s ease-in-out infinite;
}

.hero-blob__glow {
  animation: hero-blob-morph 14s ease-in-out infinite, hero-blob-glow 7s ease-in-out infinite;
}

.hero-blob__orbit {
  transform-box: view-box;
  transform-origin: 420px 390px;
  animation: hero-blob-orbit 23s ease-in-out -9s infinite;
}

@media (prefers-reduced-motion: reduce) {
  .hero-blob,
  .hero-blob * {
    animation: none !important;
  }
}

@keyframes hero-blob-drift {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(1.6%, -1.2%); }
  50% { transform: translate(-0.6%, -2%); }
  75% { transform: translate(-1.8%, 0.9%); }
}

@keyframes hero-blob-turn {
  0%, 100% { transform: rotate(-2.5deg) scale(1); }
  50% { transform: rotate(2.5deg) scale(1.03); }
}

@keyframes hero-blob-glow {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 0.9; }
}

@keyframes hero-blob-orbit {
  0%, 100% { transform: rotate(-4deg); opacity: 0.7; }
  50% { transform: rotate(4deg); opacity: 1; }
}

/* Same command structure in every frame so browsers can interpolate (Safari skips the morph). */
@keyframes hero-blob-morph {
  0%, 100% { d: path("M410 60C530 50 630 120 670 230C700 310 780 340 770 450C760 560 680 620 580 640C490 658 450 730 330 720C210 710 90 650 70 540C55 450 140 420 150 330C160 230 130 160 200 110C260 68 330 66 410 60Z"); }
  33% { d: path("M398 62C518 52 624 125 664 235C694 315 786 321 776 431C766 541 659 635 559 655C469 673 439 718 319 708C199 698 112 649 92 539C77 449 155 419 165 329C175 229 136 145 206 95C266 53 318 68 398 62Z"); }
  66% { d: path("M408 63C528 53 649 118 689 228C719 308 780 344 770 454C760 564 666 621 566 641C476 659 456 743 336 733C216 723 72 641 52 531C37 441 122 434 132 344C142 244 139 140 209 90C269 48 328 69 408 63Z"); }
}
</style>
