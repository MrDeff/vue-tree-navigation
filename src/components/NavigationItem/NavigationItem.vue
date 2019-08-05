<template>
  <span
    class="NavigationItem"
    :class="classes">

    <span
      v-if="showLabel"
      @click="handleClick"
      class="NavigationItem__label">
        <span v-if="item.image" class="NavigationItem__label__img"><img :src="item.image"/></span>
        <span class="NavigationItem__label__name" :style="{color: setActiveColor ? item.activeColor : ''}">{{ item.name }}</span>
        <span v-if="item.children && item.children.length" class="NavigationItem__label__number">{{ item.children.length }}</span>
    </span>

    <router-link
      v-if="showRouterLink"
      :to="item.meta.target"
      class="NavigationItem__router-link">{{ item.name }}</router-link>

    <a
      v-if="showHyperLink"
      :href="item.meta.target"
      class="NavigationItem__link">{{ item.name }}</a>

    <a
      v-if="showExternalHyperLink"
      :href="item.meta.target"
      target="_blank"
      class="NavigationItem__external-link">{{ item.name }}</a>
  </span>
</template>

<script>
export default {
  data() {
    return {
      active: false,
    };
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
     selectedKeyName: {
       type: String,
       default: '',
     },
     selectedKeys: {
        type: Array,
        default: function () {
          return []
        },
     },
  },
  methods: {
    handleClick(){
      if(this.item.click && typeof this.item.click === 'function') {
        this.item.click();
      }
    },
    isActive() {
      if (this.item.meta.target === '') {
        return false;
      }

      if (this.$route) {
        return (
          (this.$route.path + this.$route.hash).endsWith(
            this.item.meta.target
          ) ||
          (this.$route.path + this.$route.hash).endsWith(
            this.item.meta.target + '/'
          )
        );
      }

      return (
        window.location.href.endsWith(this.item.meta.target) ||
        window.location.href.endsWith(this.item.meta.target + '/')
      );
    },
  },
  computed: {
    showLabel() {
      return (
        this.item.path === undefined &&
        this.item.element === undefined &&
        this.item.external === undefined
      );
    },
    showRouterLink() {
      return this.showLink && this.$router !== undefined;
    },
    showHyperLink() {
      return this.showLink && this.$router === undefined;
    },
    showExternalHyperLink() {
      return this.item.external !== undefined;
    },
    showLink() {
      return this.item.path !== undefined || this.item.element !== undefined;
    },
    classes() {
      return {
        'NavigationItem--active': this.active,
      };
    },
    setActiveColor(){
      if(!this.item.activeColor){
        return false
      }
      if(this.item.selectedKeys && this.item.selectedKeys.length){
        return true
      }
      if(this.selectedKeys && this.selectedKeys.length && this.selectedKeys.indexOf(this.item[this.selectedKeyName]) >= 0){
        return true
      }
      else{
        return false
      }
    }
  },
  watch: {
    item() {
      this.active = this.isActive();
    },
    $route() {
      this.active = this.isActive();
    },
  },
  mounted() {
    this.active = this.isActive();

    if (!this.$router) {
      window.addEventListener('hashchange', () => {
        this.active = this.isActive();
      });
    }
  },
};
</script>

<style lang="scss">
@import './NavigationItem.scss';
</style>
