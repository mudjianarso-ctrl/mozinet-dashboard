import { ref } from 'vue'

export interface SaleRecord {
  tanggal: string;
  shift: string;
  operator: string;
  atk: number;
  materai: number;
  ani: number;
  lain: number;
  makan: number;
  total: number;
  totalIncome: number;
  totalExpense: number;
  dateObj: Date;
}

const allData = ref<SaleRecord[]>([])
const loading = ref(false)

export function useSalesData() {
  const fetchData = async () => {
    loading.value = true
    const SHEET_ID = '1VSiKKCa4qG_3hwGlIJpcHWTvzgBS5ZgEZfznktfYJ1g';
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

    try {
      const response = await fetch(url);
      const text = await response.text();
      const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\)/);
      
      if (match && match[1]) {
        const json = JSON.parse(match[1]);
        allData.value = json.table.rows.map((row: any) => {
          const c = row.c || [];
          const dateStr = c[1]?.f || c[1]?.v || '';
          
          const atk = Number(c[4]?.v) || 0;
          const materai = Number(c[5]?.v) || 0;
          const ani = Number(c[6]?.v) || 0;
          const lain = Number(c[7]?.v) || 0;
          const makan = Number(c[8]?.v) || 0;
          const net = Number(c[9]?.v) || 0;

          return {
            tanggal: dateStr,
            dateObj: new Date(dateStr),
            shift: c[2]?.v || '',
            operator: c[3]?.v || '',
            atk,
            materai,
            ani,
            lain,
            makan,
            totalIncome: atk + materai,
            totalExpense: ani + lain + makan,
            total: net,
          };
        }).filter((d: any) => !isNaN(d.dateObj.getTime()));
      }
    } catch (e) {
      console.error("Sync Error", e);
    } finally {
      loading.value = false
    }
  }

  if (allData.value.length === 0) fetchData();

  return { allData, loading, fetchData }
}
