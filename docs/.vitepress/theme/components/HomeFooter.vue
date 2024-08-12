<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Footer',
  setup() {
    const Footer_Data = FooterData
    return { Footer_Data }
  }
})
</script>

<template>
  <footer class="ba">
    <div class="ff">
      <div
        class="sc"
        v-for="(section, index) in Footer_Data.group"
        :key="index"
      >
        <div class="st">{{ section.title }}</div>
        <ul>
          <li v-for="(link, idx) in section.links" :key="idx">
            <a
              :class="{ 'external-link': !section.internal }"
              :target="section.internal ? '_self' : '_blank'"
              :name="link.name"
              :title="link.name"
              :href="link.href"
            >
              {{ link.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex" style="display: inline-block">
      <span>
        Copyright<i class="far fa-copyright"></i>{{ Footer_Data.author.time }} -
        {{ new Date().getFullYear() }}
        <a
          target="_blank"
          name="GitHub"
          title="GitHub"
          :href="Footer_Data.author.link"
          >{{ Footer_Data.author.name }}</a
        >. Released under the <a href='https://github.com/KarinJS/Karin/blob/master/LICENSE' target="_blank">GPL-3.0 License</a>
      </span>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
/* 页脚 */
footer {
  width: 100%;
  font-size: 1rem;

  a:hover {
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
  }

  .has-sidebar ~ & {
    display: none;
  }
}

span {
  margin-left: 1rem;
}

li {
  margin-bottom: 0.5rem;
  line-height: 1.2rem;
  font-size: 0.9rem;
}

i {
  margin-right: 0.25rem;
  margin-left: 0.25rem;
}

.external-link {
  position: relative;
  display: inline-block;

  &::after {
    content: '↗︎';
    font-weight: 900;
    font-size:1rem;
    position: absolute;
    color: var(--vp-c-text-3);
    // transform: rotate(-45deg);
  }
}

.ba {
  background: var(--vp-c-bg-alt);
  font-size: 0.9rem;
  text-align: center;
  margin: 0 auto;
}

.ff {
  display: flex;
  justify-content: center;
  margin: 1.25rem;

  &-grow-1 {
    flex-grow: 1;
  }
}

.flex {
  display: flex;
  justify-content: center;
  margin-bottom: 1.25rem;

  &-grow-1 {
    flex-grow: 1;
  }
}

.sc {
  flex-basis: 20rem;
}

.st {
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
}
</style>