<script setup lang="ts">
// @ts-ignore: 2307
import { withDefaults, defineProps } from 'vue'
const props = withDefaults(
    // @ts-ignore: 2307
    defineProps<{
        title: string,
        link: string,
        target?: string
    }>(),
    {
        target: '_self'
    }
)
</script>

<template>
    <div class="ncard">
        <a :href="props.link" :target="props.target">
            <div class="ncardBody">
                <div class="card-title text">{{ props.title }}</div>
                <div class="card-text text">
                    <slot></slot>
                </div>
            </div>
        </a>
    </div>
</template>

<style scoped>
.ncard {
    border: 1px solid #ebedf0;
    box-shadow: 2px 2px 8px 1px rgba(0, 0, 0, .15);
    margin-bottom: 2em;
    border-radius: 8px;
    transition: all 200ms ease;
}

.ncard:hover {
    border: 1px solid var(--vp-c-brand);
    box-shadow: 2px 2px 1px 0 rgba(0, 0, 0, .1);
}

.ncardBody {
    padding: 1.8em;
}

a {
    color: var(--vp-c-text-1);
    text-decoration-line: none;
}

a::after {
    content: none !important;
}

.card-title {
    font-size: 1.5em;
    margin-bottom: .8em;
}

.card-text {
    font-size: 0.9em;
}
</style>