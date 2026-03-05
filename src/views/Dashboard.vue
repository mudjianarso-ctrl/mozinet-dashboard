<template>
  <v-container fluid class="pa-6">
    <!-- MASTER FILTER BAR -->
    <v-card rounded="xl" elevation="0" :class="['glass-bar mb-6', isDark ? 'dark-glass' : 'light-glass']" border>
      <v-card-text class="py-2">
        <v-row align="center" dense>
          <v-col cols="12" md="2">
            <div class="d-flex align-center">
              <v-avatar color="primary" variant="elevated" size="36" class="me-3">
                <v-icon icon="mdi-rocket-launch" color="white" size="20" />
              </v-avatar>
              <span :class="['font-weight-black text-h6', isDark ? 'text-white' : 'text-primary']">MOZINET</span>
            </div>
          </v-col>
          <v-col cols="6" md="2">
            <v-select v-model="filterYear" :items="['All Years', ...years]" label="Year" variant="plain" density="compact" hide-details :class="isDark ? 'custom-select-white' : 'custom-select-primary'" />
          </v-col>
          <v-col cols="6" md="2">
            <v-select v-model="filterMonth" :items="months" label="Month" variant="plain" density="compact" hide-details :class="isDark ? 'custom-select-white' : 'custom-select-primary'" />
          </v-col>
          <v-col cols="6" md="2">
            <v-select v-model="selectedOperator" :items="['all', ...operators]" label="Staff" variant="plain" density="compact" hide-details :class="isDark ? 'custom-select-white' : 'custom-select-primary'" />
          </v-col>
          
          <v-col cols="12" md="4">
            <div class="d-flex align-center gap-2">
              <v-btn id="date-pick-btn" :variant="isDark ? 'flat' : 'tonal'" rounded="lg" color="primary" class="text-none flex-grow-1 font-weight-bold" prepend-icon="mdi-calendar">
                {{ selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Pick Specific Date' }}
                <v-menu activator="#date-pick-btn" :close-on-content-click="false" v-model="dateMenu">
                  <v-date-picker 
                    v-model="selectedDate" 
                    color="primary" 
                    elevation="24" 
                    rounded="xl" 
                    @update:model-value="dateMenu = false; globalRange = 'all'" 
                  />
                </v-menu>
              </v-btn>
              <v-btn icon="mdi-refresh" variant="text" @click="resetAll" :color="isDark ? 'white' : 'primary'" />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- METRICS GRID -->
    <v-row>
      <v-col cols="12" md="3">
        <DashboardCard title="Net Profit" :value="formatCurrency(filteredStats.net)" icon="mdi-chart-line" :trend="trends.net" gradient="linear-gradient(135deg, #696cff 0%, #3f42ff 100%)" pattern-image="https://www.transparenttextures.com/patterns/carbon-fibre.png" @filter="globalRange = $event" />
      </v-col>
      <v-col cols="12" md="3">
        <DashboardCard title="Total Sales" :value="filteredStats.count.toString()" icon="mdi-cart-variant" :trend="trends.count" gradient="linear-gradient(135deg, #71dd37 0%, #3bc01e 100%)" pattern-image="https://www.transparenttextures.com/patterns/diagmonds-light.png" @filter="globalRange = $event" />
      </v-col>
      <v-col cols="12" md="3">
        <DashboardCard title="Gross Income" :value="formatCurrency(filteredStats.revenue)" icon="mdi-cash-plus" :trend="trends.revenue" gradient="linear-gradient(135deg, #03c3ec 0%, #009ef7 100%)" pattern-image="https://www.transparenttextures.com/patterns/cubes.png" @filter="globalRange = $event" />
      </v-col>
      <v-col cols="12" md="3">
        <DashboardCard title="Expenses" :value="formatCurrency(filteredStats.expenses)" icon="mdi-cash-remove" :trend="trends.expenses" gradient="linear-gradient(135deg, #ff3e1d 0%, #d32f2f 100%)" pattern-image="https://www.transparenttextures.com/patterns/pinstriped-suit.png" @filter="globalRange = $event" />
      </v-col>
    </v-row>

    <!-- TREND & BEST PERFORMER -->
    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card rounded="xl" elevation="0" border :class="['glass-card overflow-hidden', isDark ? 'dark-glass' : 'light-glass']">
          <v-card-item><v-card-title :class="['font-weight-black', isDark ? 'text-white' : 'text-primary']">Revenue Analytics</v-card-title></v-card-item>
          <v-card-text><apexchart type="bar" height="320" :options="multiColorOptions" :series="revenueChartSeries" /></v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="12" class="best-perf-card h-100 text-white" border>
          <!-- LEADERBOARD MENU (3 DOTS) -->
          <div class="position-absolute" style="top: 15px; right: 15px; z-index: 2;">
            <v-menu location="bottom end" transition="slide-y-transition">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" variant="text" color="white" v-bind="props" />
              </template>
              <v-card min-width="280" rounded="xl" class="glass-leaderboard pa-2">
                <v-card-title class="text-subtitle-1 font-weight-black pb-0">Staff Leaderboard</v-card-title>
                <v-card-subtitle class="text-caption mb-2">Total Gross Income reached</v-card-subtitle>
                <v-divider class="mb-2 opacity-10" />
                <v-list density="compact" bg-color="transparent">
                  <v-list-item v-for="(staff, i) in leaderboard" :key="staff.name" class="px-2">
                    <template v-slot:prepend>
                      <v-avatar size="30" class="me-3 border-white-2">
                        <v-img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.name}`" />
                      </v-avatar>
                    </template>
                    <v-list-item-title class="text-body-2 font-weight-bold">{{ staff.name }}</v-list-item-title>
                    <template v-slot:append>
                      <span class="text-caption font-weight-black text-primary-lighten-4">{{ formatCurrency(staff.total) }}</span>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </div>

          <v-card-text class="d-flex flex-column align-center justify-center py-8">
            <v-icon icon="mdi-crown" color="amber-lighten-2" size="48" class="mb-2" />
            <div class="text-overline font-weight-bold opacity-80">BEST PERFORMER</div>
            <v-avatar size="100" class="my-4 elevation-12 border-white-4">
              <v-img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${bestOperator.name}`" />
            </v-avatar>
            <h2 class="text-h4 font-weight-black">{{ bestOperator.name }}</h2>
            <div class="text-h5 font-weight-bold mt-2 opacity-90 text-amber-lighten-2">{{ formatCurrency(bestOperator.total) }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- DETAILED TABLE -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card rounded="xl" elevation="0" border :class="['glass-card', isDark ? 'dark-glass' : 'light-glass']">
          <v-card-item class="pb-4"><v-card-title :class="['font-weight-black', isDark ? 'text-white' : 'text-primary']">Detailed Transaction Logs</v-card-title></v-card-item>
          <v-table :class="[isDark ? 'glass-table-dark' : 'glass-table-light', 'mozinet-table']">
            <thead>
              <tr :class="isDark ? 'bg-white-transparent-10' : 'bg-grey-lighten-4'">
                <th rowspan="2" class="font-weight-black text-center border-bottom-0">OPERATOR</th>
                <th rowspan="2" class="font-weight-black text-center border-bottom-0">DATE</th>
                <th colspan="2" class="text-center text-success border-start font-weight-bold border-bottom-0">INCOME SOURCES</th>
                <th colspan="3" class="text-center text-error border-start font-weight-bold border-bottom-0">EXPENSE SOURCES</th>
                <th rowspan="2" class="text-right border-start font-weight-bold text-success border-bottom-0">TOTAL INCOME</th>
                <th rowspan="2" class="text-right font-weight-bold text-error border-bottom-0">TOTAL EXPENSE</th>
                <th rowspan="2" class="text-right font-weight-black text-primary border-bottom-0">NET PROFIT</th>
              </tr>
              <tr :class="isDark ? 'bg-white-transparent-5' : 'bg-grey-lighten-5'">
                <th class="text-center border-start text-caption font-weight-bold">ATK</th>
                <th class="text-center text-caption font-weight-bold">MATERAI</th>
                <th class="text-center border-start text-caption font-weight-bold">ANI</th>
                <th class="text-center text-caption font-weight-bold">MEAL</th>
                <th class="text-center text-caption font-weight-bold">MISC</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in displayData" :key="t.tanggal + t.shift" class="table-row-hover">
                <td>
                  <div class="d-flex align-center py-2">
                    <v-avatar size="32" class="me-3 elevation-2"><v-img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.operator}`" /></v-avatar>
                    <div><div class="font-weight-bold text-body-2">{{ t.operator }}</div><div class="text-caption opacity-60">{{ t.shift }}</div></div>
                  </div>
                </td>
                <td class="text-caption text-center opacity-80">{{ t.tanggal }}</td>
                <td class="text-right border-start text-caption opacity-80">{{ formatCurrency(t.atk) }}</td>
                <td class="text-right text-caption opacity-80">{{ formatCurrency(t.materai) }}</td>
                <td class="text-right border-start text-caption opacity-80">{{ formatCurrency(t.ani) }}</td>
                <td class="text-right text-caption opacity-80">{{ formatCurrency(t.makan) }}</td>
                <td class="text-right text-caption opacity-80">{{ formatCurrency(t.lain) }}</td>
                <td class="text-right border-start font-weight-bold text-success">{{ formatCurrency(t.totalIncome) }}</td>
                <td class="text-right font-weight-bold text-error">{{ formatCurrency(t.totalExpense) }}</td>
                <td class="text-right font-weight-black text-primary">{{ formatCurrency(t.total) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTheme } from 'vuetify';
import { useSalesData } from '../composables/useSalesData';
import DashboardCard from '../components/DashboardCard.vue';

const { allData, loading, fetchData } = useSalesData();
const theme = useTheme();

const isDark = computed(() => theme.global.name.value === 'dark');

// STATE
const filterYear = ref<string | number>(2026);
const filterMonth = ref('All Months');
const selectedOperator = ref('all');
const selectedDate = ref<any>(null);
const globalRange = ref<'all' | number>('all');
const dateMenu = ref(false);

const years = Array.from({ length: 21 }, (_, i) => 2025 + i);
const months = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const operators = computed(() => [...new Set(allData.value.map(d => d.operator))].filter(Boolean));

const resetAll = () => {
  filterYear.value = 2026; filterMonth.value = 'All Months';
  selectedOperator.value = 'all'; selectedDate.value = null; globalRange.value = 'all';
};

const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);

// TREND CALCULATION
const trends = computed(() => {
  const current = filteredData.value;
  let prevData = [];
  if (globalRange.value !== 'all') {
    const range = Number(globalRange.value);
    const cutoffEnd = Date.now() - (range * 24 * 60 * 60 * 1000);
    const cutoffStart = cutoffEnd - (range * 24 * 60 * 60 * 1000);
    prevData = allData.value.filter(d => d.dateObj.getTime() >= cutoffStart && d.dateObj.getTime() < cutoffEnd);
  } else if (filterMonth.value !== 'All Months') {
    const monthIdx = months.indexOf(filterMonth.value) - 1;
    const prevMonthIdx = monthIdx === 0 ? 11 : monthIdx - 1;
    const prevYear = monthIdx === 0 ? Number(filterYear.value) - 1 : Number(filterYear.value);
    prevData = allData.value.filter(d => d.dateObj.getFullYear() === prevYear && d.dateObj.getMonth() === prevMonthIdx);
  } else {
    prevData = allData.value.filter(d => d.dateObj.getFullYear() === Number(filterYear.value) - 1);
  }
  const calc = (dataset: any[]) => ({
    revenue: dataset.reduce((s, curr) => s + curr.totalIncome, 0),
    net: dataset.reduce((s, curr) => s + curr.total, 0),
    expenses: dataset.reduce((s, curr) => s + curr.totalExpense, 0),
    count: dataset.length
  });
  const curStats = calc(current);
  const oldStats = calc(prevData);
  const getPct = (cur: number, old: number) => old === 0 ? (cur > 0 ? 100 : 0) : Math.round(((cur - old) / old) * 100);
  return { revenue: getPct(curStats.revenue, oldStats.revenue), net: getPct(curStats.net, oldStats.net), expenses: getPct(curStats.expenses, oldStats.expenses), count: getPct(curStats.count, oldStats.count) };
});

// FILTER ENGINE
const filteredData = computed(() => {
  return allData.value.filter(d => {
    const dDate = d.dateObj;
    if (globalRange.value !== 'all') {
      const cutoff = Date.now() - (Number(globalRange.value) * 24 * 60 * 60 * 1000);
      if (dDate.getTime() < cutoff) return false;
    } else if (selectedDate.value) {
      const s = new Date(selectedDate.value);
      if (dDate.getDate() !== s.getDate() || dDate.getMonth() !== s.getMonth() || dDate.getFullYear() !== s.getFullYear()) return false;
    } else {
      if (filterYear.value !== 'All Years' && dDate.getFullYear() !== Number(filterYear.value)) return false;
      if (filterMonth.value !== 'All Months' && dDate.getMonth() !== months.indexOf(filterMonth.value) - 1) return false;
    }
    if (selectedOperator.value !== 'all' && d.operator !== selectedOperator.value) return false;
    return true;
  });
});

const filteredStats = computed(() => {
  const d = filteredData.value;
  const revenue = d.reduce((s, curr) => s + curr.totalIncome, 0);
  return { revenue, net: d.reduce((s, curr) => s + curr.total, 0), expenses: d.reduce((s, curr) => s + curr.totalExpense, 0), count: d.length, avg: d.length ? Math.round(revenue / d.length) : 0 };
});

// LEADERBOARD LOGIC (GROSS INCOME)
const leaderboard = computed(() => {
  const map = new Map();
  filteredData.value.forEach(d => {
    const current = map.get(d.operator) || 0;
    map.set(d.operator, current + d.totalIncome);
  });
  return Array.from(map, ([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total);
});

const bestOperator = computed(() => {
  const list = [...leaderboard.value];
  return list.length > 0 ? list[0] : { name: 'N/A', total: 0 };
});

const displayData = computed(() => [...filteredData.value].reverse().slice(0, 15));

// CHART CONFIG
const revenueChartSeries = computed(() => [{
  name: 'Income',
  data: months.slice(1).map((_, idx) => allData.value.filter(d => (filterYear.value === 'All Years' || d.dateObj.getFullYear() === Number(filterYear.value)) && d.dateObj.getMonth() === idx).reduce((s, curr) => s + curr.totalIncome, 0))
}]);

const multiColorOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 8, columnWidth: '50%', distributed: true } },
  colors: ['#696cff', '#03c3ec', '#71dd37', '#ffab00', '#ff3e1d', '#8592a3', '#03c3ec', '#696cff', '#71dd37', '#ffab00', '#ff3e1d', '#8592a3'],
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], labels: { style: { colors: isDark.value ? '#fff' : '#696cff' } } },
  yaxis: { labels: { style: { colors: isDark.value ? '#fff' : '#696cff' } } },
  grid: { show: false },
  legend: { show: false },
  dataLabels: { enabled: false }
}));
</script>

<style scoped>
.glass-bar, .glass-card { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); transition: all 0.3s ease; }
.light-glass { background: rgba(255, 255, 255, 0.7) !important; border: 1px solid rgba(255, 255, 255, 0.3) !important; }
.dark-glass { background: rgba(30, 41, 59, 0.7) !important; border: 1px solid rgba(255, 255, 255, 0.05) !important; }
.best-perf-card { background: linear-gradient(135deg, #696cff 0%, #3f42ff 100%); border: 1px solid rgba(255, 255, 255, 0.2) !important; position: relative; }
.glass-leaderboard { background: rgba(255, 255, 255, 0.8) !important; backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); }
.custom-select-white :deep(.v-field__input) { color: white !important; font-weight: bold !important; }
.custom-select-primary :deep(.v-field__input) { color: #696cff !important; font-weight: bold !important; }
.border-white-4 { border: 4px solid rgba(255, 255, 255, 0.2); }
.border-white-2 { border: 2px solid rgba(255, 255, 255, 0.3); }
.gap-2 { gap: 0.5rem; }
</style>
