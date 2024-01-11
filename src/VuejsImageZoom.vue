<template>
  <div
    :id="canvasContainer"
    class="vuejs-image-zoom"
    :style="{ width: `${width}`, height: `${height}` }"
    @wheel="handleZoom"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
    <canvas :id="canvasId"></canvas>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "VuejsImageZoom",
  props: {
    src: { type: String, default: "" },
    width: { type: String, default: "100%" },
    height: { type: String, default: "100%" },
  },
  watch: {
    src: {
      immediate: true,
      deep: true,
      async handler(newSrc, oldSrc) {
        this.existingScale = 0;
        this.$nextTick(() => {
          // 사이즈 변경 체크
          const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
              this.handleWidthChange(entry);
            }
          });
          resizeObserver.observe(
            document.querySelector(`#${this.canvasContainer}`)
          );
        });
      },
    },
  },
  data() {
    return {
      canvasContainer: `canvas-container-${uuidv4()}`,
      canvasId: `canvas-id-${uuidv4()}`,
      canvasWidth: 0,
      canvasHeight: 0,
      scale: 1,
      isDragging: false,
      lastX: 0,
      lastY: 0,
      offsetX: 0,
      offsetY: 0,
      minScale: 1,
      ctx: null,
      image: null,
      originalWidth: 0,
      originalHeight: 0,
      existingScale: 0,
    };
  },
  methods: {
    handleWidthChange(entry) {
      if (this.existingScale === 0) {
        const { width, height } = document
          .querySelector(`#${this.canvasContainer}`)
          .getClientRects()[0];
        this.canvasWidth = width;
        this.canvasHeight = height;

        const canvas = document.querySelector(`#${this.canvasId}`);
        canvas.width = width;
        canvas.height = height;
        this.ctx = canvas.getContext("2d");
        this.image = new Image();
        this.image.src = this.src;
        this.image.onload = () => {
          this.originalWidth = this.image.width;
          this.originalHeight = this.image.height;
          this.fitImageIntoCanvas();
          this.adjustOffset();
          this.drawImage();
        };
      } else {
        const { width, height } = entry.contentRect;
        const canvas = document.querySelector(`#${this.canvasId}`);
        canvas.width = width;
        canvas.height = height;
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.fitImageIntoCanvas();
        this.adjustOffset();
        this.drawImage();
      }
    },
    // 초기 이미지 크기(scale) 지정 및 한화면에 나올 수 있게 작업
    fitImageIntoCanvas() {
      // 화면보다 이미지가 클경우
      if (
        this.canvasWidth < this.originalWidth ||
        this.canvasHeight < this.originalHeight
      ) {
        const yScale = this.canvasHeight / this.originalHeight;
        const xScale = this.canvasWidth / this.originalWidth;
        const upDtMinScale = Math.min(yScale, xScale);
        if (upDtMinScale !== this.existingScale) {
          this.scale = upDtMinScale;
          this.existingScale = upDtMinScale;
        }
        this.minScale = upDtMinScale;
      } else {
        const yScale = this.originalHeight / this.canvasHeight;
        const xScale = this.originalWidth / this.canvasWidth;
        const upDtMinScale = 1 / Math.max(yScale, xScale);
        if (upDtMinScale !== this.existingScale) {
          this.scale = upDtMinScale;
          this.existingScale = upDtMinScale;
        }
        this.minScale = upDtMinScale;
      }
    },
    adjustOffset() {
      const canvas = document.querySelector(`#${this.canvasId}`);
      const imgWidth = this.originalWidth * this.scale;
      const imgHeight = this.originalHeight * this.scale;

      if (imgWidth < canvas.width) {
        this.offsetX = (canvas.width - imgWidth) / 2;
      } else {
        if (this.offsetX > 0) {
          this.offsetX = 0;
        } else if (this.offsetX < canvas.width - imgWidth) {
          this.offsetX = canvas.width - imgWidth;
        }
      }

      if (imgHeight < canvas.height) {
        this.offsetY = (canvas.height - imgHeight) / 2;
      } else {
        if (this.offsetY > 0) {
          this.offsetY = 0;
        } else if (this.offsetY < canvas.height - imgHeight) {
          this.offsetY = canvas.height - imgHeight;
        }
      }
    },
    drawImage() {
      const canvas = document.querySelector(`#${this.canvasId}`);
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.ctx.drawImage(
        this.image,
        this.offsetX,
        this.offsetY,
        this.originalWidth * this.scale,
        this.originalHeight * this.scale
      );
    },
    handleZoom(event) {
      event.preventDefault();
      const canvas = document.querySelector(`#${this.canvasId}`);
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const scaleMultiplier = 0.1;
      const wheel = event.deltaY < 0 ? 1 : -1;
      const zoom = Math.exp(wheel * scaleMultiplier);
      const nextScale = this.scale * zoom;

      if (nextScale > 4 || nextScale < this.minScale) {
        return;
      }

      const offsetX = (x - this.offsetX) * (zoom - 1);
      const offsetY = (y - this.offsetY) * (zoom - 1);

      this.offsetX -= offsetX;
      this.offsetY -= offsetY;
      this.scale = nextScale;

      this.adjustOffset();
      this.drawImage();
    },
    handleMouseUp() {
      this.isDragging = false;
    },
    handleMouseDown(event) {
      this.isDragging = true;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    },
    handleMouseMove(event) {
      if (this.isDragging) {
        const offsetX = event.clientX - this.lastX;
        const offsetY = event.clientY - this.lastY;

        const canvas = document.querySelector(`#${this.canvasId}`);

        const imgWidth = this.originalWidth * this.scale;
        const imgHeight = this.originalHeight * this.scale;

        const nextOffsetX = this.offsetX + offsetX;
        const nextOffsetY = this.offsetY + offsetY;

        if (nextOffsetX <= 0 && nextOffsetX >= canvas.width - imgWidth) {
          this.offsetX += offsetX;
        }
        if (nextOffsetY <= 0 && nextOffsetY >= canvas.height - imgHeight) {
          this.offsetY += offsetY;
        }

        this.adjustOffset();
        this.drawImage();

        this.lastX = event.clientX;
        this.lastY = event.clientY;
      }
    },
  },
};
</script>
