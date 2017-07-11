<template>
  <div class="vue-drag-select" @mousedown="onMouseDown">
    <slot :selectedItems="selectedItems" />
    <div v-if="mouseDown" class="vue-drag-select-box"
      :style="selectionBoxStyling"></div>
  </div>
</template>

<script>
  export default {
    name: 'vue-drag-select',
    props: {
      selectorClass: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        mouseDown: false,
        startPoint: null,
        endPoint: null,
        selectedItems: []
      }
    },
    computed: {
      selectionBox () {
        // Only set styling when necessary
        if (!this.mouseDown || !this.startPoint || !this.endPoint) return {}

        const clientRect = this.$el.getBoundingClientRect()

        // Calculate position and dimensions of the selection box
        const left = Math.min(this.startPoint.x, this.endPoint.x) - clientRect.left
        const top = Math.min(this.startPoint.y, this.endPoint.y) - clientRect.top
        const width = Math.abs(this.startPoint.x - this.endPoint.x)
        const height = Math.abs(this.startPoint.y - this.endPoint.y)

        // Return the styles to be applied
        return {
          left,
          top,
          width,
          height
        }
      },
      selectionBoxStyling () {
        // Only set styling when necessary
        if (!this.mouseDown || !this.startPoint || !this.endPoint) return {}

        const { left, top, width, height } = this.selectionBox

        // Return the styles to be applied
        return {
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`
        }
      }
    },
    watch: {
      selectedItems (val) {
        this.$emit('change', val)
      }
    },
    methods: {
      onMouseDown (event) {
        // Ignore right clicks
        if (event.button === 2) return

        // Register begin point
        this.mouseDown = true
        this.startPoint = {
          x: event.pageX,
          y: event.pageY
        }

        // Start listening for mouse move and up events
        window.addEventListener('mousemove', this.onMouseMove)
        window.addEventListener('mouseup', this.onMouseUp)
      },
      onMouseMove (event) {
        // Update the end point position
        if (this.mouseDown) {
          this.endPoint = {
            x: event.pageX,
            y: event.pageY
          }

          const children = this.$children.length
            ? this.$children
            : this.$el.children

          if (children) {
            this.selectedItems = Array.from(children).filter((item) => {
              return this.isItemSelected(item.$el || item)
            })
          }
        }
      },
      onMouseUp (event) {
        // Clean up event listeners
        window.removeEventListener('mousemove', this.onMouseMove)
        window.removeEventListener('mouseup', this.onMouseUp)

        // Reset state
        this.mouseDown = false
        this.startPoint = null
        this.endPoint = null
      },
      isItemSelected (el) {
        if (el.classList.contains(this.selectorClass)) {
          const boxA = this.selectionBox
          const boxB = {
            top: el.offsetTop,
            left: el.offsetLeft,
            width: el.clientWidth,
            height: el.clientHeight
          }

          return !!(
            boxA.left <= boxB.left + boxB.width &&
            boxA.left + boxA.width >= boxB.left &&
            boxA.top <= boxB.top + boxB.height &&
            boxA.top + boxA.height >= boxB.top
          )
        }

        return false
      }
    },
    mounted () {
      this.$children.forEach((child) => {
        child.$on('click', (event) => {
          const included = this.selectedItems.find((item) => {
            return child.$el === item.$el
          })

          if (included) {
            this.selectedItems = this.selectedItems.filter((item) => {
              return child.$el !== item.$el
            })
          } else {
            this.selectedItems.push(child)
          }
        })
      })
    },
    beforeDestroy () {
      // Remove event listeners
      window.removeEventListener('mousemove', this.onMouseMove)
      window.removeEventListener('mouseup', this.onMouseUp)

      this.$children.forEach((child) => {
        child.$off('click')
      })
    }
  }
</script>

<style>
  .vue-drag-select {
    position: relative;
    user-select: none;
  }

  .vue-drag-select-box {
    position: absolute;
    background: rgba(0, 162, 255, .4);
    z-index: 99;
  }
</style>
