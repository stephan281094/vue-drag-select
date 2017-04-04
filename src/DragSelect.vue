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

        // Calculate position and dimensions of the selection box
        const left = Math.min(this.startPoint.x, this.endPoint.x)
        const top = Math.min(this.startPoint.y, this.endPoint.y)
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
          height: `${height}px`,
        }
      }
    },
    methods: {
      onMouseDown (event) {
        // Ignore right clicks
        if (event.button === 2 || this.hasSelectorClass(event.target)) return

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

          const children = this.$children
          if (children) {
            this.selectedItems = children.filter(this.isItemSelected)
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
      isItemSelected ({ $el }) {
        if ($el.classList.contains(this.selectorClass)) {
          const boxA = this.selectionBox
          const boxB = $el.getBoundingClientRect()

          return !!(
            boxA.left <= boxB.left + boxB.width &&
            boxA.left + boxA.width >= boxB.left &&
            boxA.top <= boxB.top + boxB.height &&
            boxA.top + boxA.height >= boxB.top
          )
        }

        return false
      },
      hasSelectorClass (el) {
        return !!(
          el.classList.contains(this.selectorClass) ||
          el.closest(`.${this.selectorClass}`)
        )
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
    user-select: none;
  }

  .vue-drag-select-box {
    position: fixed;
    background: rgba(0, 162, 255, .4);
    z-index: 99;
  }
</style>
