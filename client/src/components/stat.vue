<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Tooltip
} from 'chart.js'
import router from '../router/index.ts'
import { useAuthStore } from '../stores/auth.ts'
import { useStatsStore } from '../stores/stats.ts'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

type CountEntry = [string, number]
type BarChart = Chart<'bar', number[], string>

const auth = useAuthStore()
const stats = useStatsStore()

const localError = ref('')
const date = ref('')
const songChartCanvas = ref<HTMLCanvasElement | null>(null)
const cityChartCanvas = ref<HTMLCanvasElement | null>(null)
const totalChartCanvas = ref<HTMLCanvasElement | null>(null)
const songEntries = computed(() => sortByCount(stats.setlist))
const cityEntries = computed(() => sortByCount(stats.city))

let songChart: BarChart | null = null
let cityChart: BarChart | null = null
let totalChart: BarChart | null = null

function sortByCount(counts: Record<string, number>): CountEntry[] {
  return Object.entries(counts).sort(([, countA], [, countB]) => countB - countA)
}

function chartHeight(entryCount: number): string {
  return `${Math.max(260, entryCount * 32)}px`
}

function createBarChart(
  canvas: HTMLCanvasElement,
  label: string,
  entries: CountEntry[],
  color: string,
): BarChart {
  return new Chart<'bar', number[], string>(canvas, {
    type: 'bar',
    data: {
      labels: entries.map(([name]) => name),
      datasets: [{
        label,
        data: entries.map(([, count]) => count),
        backgroundColor: color,
        borderRadius: 5
      }]
    },
    options: {
      indexAxis: 'y',
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        x: {
          position: 'top',
          beginAtZero: true,
          ticks: {
            precision: 0,
            display: entries.length > 0
          }
        },
        y: {
          grid: { display: false }
        }
      }
    }
  })
}

Chart.defaults.font.family = 'Gamer-Bold'
Chart.defaults.color = '#fff'

function updateBarChart(chart: BarChart | null, entries: CountEntry[]) {
  if (!chart) return
  chart.data.labels = entries.map(([name]) => name)
  const dataset = chart.data.datasets[0]
  if (!dataset) return
  dataset.data = entries.map(([, count]) => count)
  const xScale = chart.options.scales?.x
  if (xScale?.ticks) {
    xScale.ticks.display = entries.length > 0
  }
  chart.update()
}

onMounted(async () => {
  const user = auth.getUser
  if (!user) {
    await router.push('/login')
    return
  }

  await stats.getStats(user.id)
  if (songChartCanvas.value) {
    songChart = createBarChart(songChartCanvas.value, 'Times seen', songEntries.value, '#01696f')
  }
  if (cityChartCanvas.value) {
    cityChart = createBarChart(cityChartCanvas.value, 'Shows attended', cityEntries.value, '#a12c7b')
  }
  if (totalChartCanvas.value) {
    totalChart = createBarChart(
      totalChartCanvas.value,
      'Songs seen',
      [['Songs seen', stats.num_songs]],
      '#aa3bff'
    )
  }
})

watch(
  () => [stats.setlist, stats.city, stats.num_songs] as const,
  () => {
    updateBarChart(songChart, songEntries.value)
    updateBarChart(cityChart, cityEntries.value)
    updateBarChart(totalChart, [['Songs seen', stats.num_songs]])
  },
  { deep: true }
)

onBeforeUnmount(() => {
  songChart?.destroy()
  cityChart?.destroy()
  totalChart?.destroy()
})

async function submitDate() {
  localError.value = ''
  try {
    await stats.updateStats(auth.getUser?.id ?? null, date.value)
  } catch (error) {
    localError.value = error instanceof Error ? error.message : 'Unable to update stats'
  }
}
</script>

<template>
  <main class="stats-page">
    <header class="stats-header">
      <h1>Your concert stats</h1>
      <form class="checkin-form" @submit.prevent="submitDate">
        <label class="field" for="show-date">
          <span>Date of show attended (DD-MM-YYYY)</span>
          <input id="show-date" v-model="date" type="text" placeholder="dd-mm-yyyy" required />
        </label>
        <button type="submit">Add show</button>
      </form>
      <p v-if="localError" class="error-message">{{ localError }}</p>
    </header>

    <section class="charts-grid" aria-label="Your listening statistics">
      <article class="chart-card">
        <h2 class="chart-description">Most seen songs</h2>
        <div class="chart-container" :style="{ height: chartHeight(songEntries.length) }">
          <canvas ref="songChartCanvas" aria-label="Bar chart of most seen songs" />
        </div>
      </article>

      <article class="chart-card">
        <h2 class="chart-description">Most visited cities</h2>
        <div class="chart-container" :style="{ height: chartHeight(cityEntries.length) }">
          <canvas ref="cityChartCanvas" aria-label="Bar chart of most visited cities" />
        </div>
      </article>

      <article class="total-card">
        <div class="Songsdiv">
          <h2>Songs seen</h2>
          <p class="total-count">{{ stats.num_songs }}</p>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.stats-page {
  font-family: 'Gamer-Bold', sans-serif;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem clamp(1rem, 4vw, 2.5rem);
  box-sizing: border-box;
  text-align: left;
}

.stats-header {
  margin-bottom: 1.5rem;
}

.stats-header h1 {
  font-family: 'Gamer-Bold', sans-serif;
  text-shadow: 2px 2px 4px red;
  text-align: center;
  margin-top: 0;
}

.checkin-form {
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field input {
  min-width: 220px;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.4rem;
  color: var(--text-h);
  background: var(--bg);
}

button {
  border: 0;
  border-radius: 0.4rem;
  padding: 0.7rem 1rem;
  background: #254c37;
  color: #fff;
  font: inherit;
  cursor: pointer;
}

.error-message {
  margin-top: 0.75rem;
  color: #a12c7b;
}

.charts-grid {
  font-family: 'Gamer-Bold', sans-serif;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: start;
}

.chart-card {
  min-width: 0;
  max-height: 400px;
  overflow-y: auto;
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--bg);
  box-shadow: var(--shadow);
}

.chart-description {
  font-family: 'Gamer-Bold', sans-serif;
  text-shadow: 2px 2px 4px red;
  font-size: 30px;
}

.Songsdiv {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: 'Gamer-Bold', sans-serif;
  text-shadow: 2px 2px 4px red;
  font-weight: bold;
  font-size: 30px;
}

.Songsdiv h2 {
  font-family: 'Gamer-Bold', sans-serif;
  font-weight: bold;
  text-shadow: 2px 2px 4px red;
}

.chart-container {
  position: relative;
  width: 100%;
  margin-top: 1rem;
  color: var(--text-h);
}

.total-card {
  grid-column: 1 / -1;
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
}

.total-count {
  text-align: center;
  margin: 0.25rem 0;
  color: var(--text-h);
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.1;
}

.total-chart-container {
  position: relative;
  height: 180px;
  min-width: 0;
}

@media (max-width: 760px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .total-card {
    grid-column: auto;
  }
}
</style>