<script setup lang="ts">
import confetti from 'canvas-confetti'

/* 纸屑 */
confetti({
    particleCount: 100,
    spread: 170,
    origin: { y: 0.6 },
})

</script>