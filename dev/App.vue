<template>
  <div id="app">
    <vue-tree-navigation :items="items" :defaultOpenLevel="defaultOpenLevel" >
    </vue-tree-navigation>

    <hr>
    <h2>Router View</h2>
    <router-view></router-view>

    <hr>
    <h2>About (this section is not part of router view)</h2>
    <ul>
      <li id="company">Company</li>
      <li id="contact">Contact</li>
      <li id="blog">Blog</li>
    </ul>
  </div>
</template>

<script>
import TreeNavigation from '../src/components/TreeNavigation/TreeNavigation';

export default {
  data() {
    return {
      items: [
        { name: 'Home', path: 'home' },
        { name: 'red',click: () => { console.log("ok") }, image: 'http://icons.iconarchive.com/icons/custom-icon-design/flag-2/256/India-Flag-icon.png', number:23 },
        {
          name: 'Products',
          path: 'products',
          children: [
            {
              name: 'Running shoes',
              path: 'shoes',
              selectedKeys:['red','Road'],
              selectedKeyName:'name',
              activeColor:'#32d6de',
              children: [
                { name: 'red' , activeColor:'#32d6de',},
                { name: 'Road', element: 'road' },
                { name: 'Trail', element: 'trail' },
              ],
            },
            {
              name: 'Running clothing',
              path: 'clothing',
              children: [
                { name: 'Jackets', path: 'jackets' },
                {
                  name: 'Tops',
                  path: 'tops',
                  children: [
                    {
                      name: 'Long Sleeve',
                      element: 'long-sleeve',
                      children: [
                        { name: 'For summer', element: 'summer' },
                        { name: 'For winter', element: 'winter' },
                      ],
                    },
                    { name: 'Short Sleeve', element: 'short-sleeve' },
                    { name: 'Sleeveless', element: 'sleeveless' },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'About',
          selectedKeys:['Company'],
          selectedKeyName:'name',
          activeColor:'#32d6de',
          children: [
            { name: 'Company', element: 'company' },
            { name: 'Contact', element: 'contact' },
            { name: 'Blog', element: 'blog' },
            { name: 'Test', element: 'test' },
            { name: 'Github', external: 'https://github.com' },
          ],
        },
      ],
      defaultOpenLevel: 2,
    };
  },
  components: {
    'vue-tree-navigation': TreeNavigation,
  },
};
</script>

<style lang="scss">
@import './App.scss';
</style>
