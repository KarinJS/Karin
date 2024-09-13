<template>
  <div class="chart-container">
    <div class="flex justify-between items-center">
      <div class="chart-title">Applicants Received Time</div>
      <div class="chart-subtitle">Week <i class="fas fa-chevron-down"></i></div>
    </div>
    <div class="chart" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
      <svg :viewBox="`0 0 ${width} ${height}`">
        <!-- 灰色横线 -->
        <line v-for="y in horizontalLines" :key="y" :x1="0" :y1="y" :x2="width" :y2="y" stroke="#ccc" stroke-dasharray="5,5" />
        <!-- 曲线 -->
        <path :d="linePath" class="chart-line"></path>
        <!-- 数据点 -->
        <circle v-for="(point, index) in points" :key="index" :cx="point.x" :cy="point.y" r="5" class="chart-point"></circle>
        <!-- 鼠标悬停效果 -->
        <circle v-if="hoveredPoint" :cx="hoveredPoint.x" :cy="hoveredPoint.y" r="7" class="chart-hover-point"></circle>
      </svg>
      <div v-if="hoveredPoint" class="chart-tooltip" :style="{ top: `${hoveredPoint.y}px`, left: `${hoveredPoint.x + 10}px` }">
        <div>Candidates</div>
        <div>{{ hoveredPoint.value }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WaveformChart',
  props: {
    data: {
      type: Array,
      required: true,
      validator: (value) => value.length >= 20 && value.length <= 30
    }
  },
  data() {
    return {
      width: 500,
      height: 200,
      hoveredPoint: null
    };
  },
  computed: {
    points() {
      const maxDataValue = Math.max(...this.data);
      return this.data.map((value, index) => ({
        x: (index / (this.data.length - 1)) * this.width,
        y: this.height - (value / maxDataValue) * this.height,
        value
      }));
    },
    linePath() {
      if (this.points.length < 2) return '';

      const d = this.points.reduce((acc, point, index, arr) => {
        if (index === 0) {
          return `M${point.x},${point.y}`;
        } else {
          const prev = arr[index - 1];
          const controlX1 = (prev.x + point.x) / 2;
          const controlY1 = prev.y;
          const controlX2 = (prev.x + point.x) / 2;
          const controlY2 = point.y;
          return `${acc} C${controlX1},${controlY1} ${controlX2},${controlY2} ${point.x},${point.y}`;
        }
      }, '');

      return d;
    },
    horizontalLines() {
      const lines = [];
      for (let i = 1; i <= 4; i++) {
        lines.push((i / 5) * this.height);
      }
      return lines;
    }
  },
  methods: {
    handleMouseMove(event) {
      const rect = event.target.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const closestPoint = this.points.reduce((prev, curr) => {
        return Math.abs(curr.x - mouseX) < Math.abs(prev.x - mouseX) ? curr : prev;
      });
      this.hoveredPoint = closestPoint;
    },
    handleMouseLeave() {
      this.hoveredPoint = null;
    }
  }
};
</script>

<style scoped>
.chart-container {
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 18px;
  font-weight: bold;
}

.chart-subtitle {
  font-size: 14px;
  color: #888;
}

.chart {
  position: relative;
  height: 100%;
  margin-top: 20px;
  flex-grow: 1;
}

.chart-line {
  stroke: #007bff;
  stroke-width: 3;
  fill: none;
}

.chart-point {
  fill: #007bff;
}

.chart-hover-point {
  fill: #ff0000;
}

.chart-tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  pointer-events: none;
}
</style>