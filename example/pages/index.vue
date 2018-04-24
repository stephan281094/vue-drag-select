<template>
  <div id="app" class="app">
    <h1>Vue Drag Select Example  <small style="color:red">with CTRL Support for select/deselect Items</small></h1>
    
      <drag-select-container selectorClass="item">
        <template slot-scope="{ selectedItems }">
          <div
            v-for="(item,i) in 50" :key="i"
            :class="getClasses(item, selectedItems)"
            :data-item="item"
            @click.ctrl=" ctrlSelect( item, selectedItems, $event)"
          >
            Item {{ item }}
          </div>
        </template>
      </drag-select-container>
     
  </div>
</template>

<script>
  import DragSelect from 'vue-drag-select'
   
  export default {
    name: 'home',
    components: {
      'drag-select-container': DragSelect,
      
    },
    methods: {
  findIDX(array, id) {
  var index = array.findIndex(function(rect) {
    return parseInt(rect.dataset.item, 10) == id
})
return index  
},
   
   ctrlSelect(item, selectedItems, obj) {
  
var res=this.findIDX(selectedItems, item);
 
if (res>=0) { selectedItems.splice(res, 1); } else {selectedItems.push(obj.target); }
},  
      getClasses (item, selectedItems) {
        const isActive = !!(selectedItems.find((selectedItem) => {
          return parseInt(selectedItem.dataset.item, 10) === item
        }))
        return {
          item: true,
          active: isActive
        }
      }
    }
  }
</script>

<style>
  /* Basic reset */
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
  html {
    box-sizing: border-box;
    user-select: none;
  }
  html,
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }
  body {
    font: 16px / 1.5 'Helvetica Neue', sans-serif;
    padding: 5%;
  }
  /* Custom styling */
  .item {
    display: inline-flex;
    min-width: 80px;
    height: 100px;
    margin-right: 10px;
    margin-bottom: 10px;
    background-color: #ddd;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 10px;
  }
  .item.active {
    background-color: rgb(0, 162, 255);
    color: #fff;
  }
</style>
