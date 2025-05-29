import { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import {
  red, orange, yellow,
  green, blue, purple,
  teal, pink
} from '@mui/material/colors'
import { fetchCategories } from '../services/categoryService'
import { fetchTransactions } from '../services/transactionService'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export default function CategoryChart({ type = 'expense', chartType = 'pie' }) {
  const theme = useTheme()
  const [data, setData] = useState(null)

  useEffect(() => {
    (async () => {
      const [catsRes, txRes] = await Promise.all([
        fetchCategories(),
        fetchTransactions()
      ])
      const categories = catsRes.data.filter(c => c.type === type)
      const transactions = txRes.data.filter(t =>
        categories.some(c => c.id === t.category)
      )

      const sums = categories.map(cat =>
        transactions
          .filter(t => t.category === cat.id)
          .reduce((acc, t) => acc + parseFloat(t.amount), 0)
      )

      const colorPool = [
        red[500], orange[500], yellow[700],
        green[500], blue[500], purple[500],
        teal[500], pink[500]
      ]

      const bgColors = categories.map((_, i) => colorPool[i % colorPool.length])
      const borderColors = bgColors.map(() => theme.palette.background.paper)

      setData({
        labels: categories.map(c => c.name),
        datasets: [{
          data: sums,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 2
        }]
      })
    })()
  }, [type, theme])

  if (!data) return <p>Загрузка диаграммы...</p>

  const commonOptions = {
    maintainAspectRatio: false,
    layout: { padding: 16 },
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => {
            const name = ctx.label
            const raw = ctx.parsed
            const value = typeof raw === 'number' ? raw : raw.y
            return `${name}: ${value.toLocaleString()}`
          }
        }
      },
      legend: {
        display: chartType === 'pie',
        position: 'bottom',
        labels: { boxWidth: 12, padding: 16 }
      }
    },
    scales: {
      ...(chartType === 'bar' && {
        x: { beginAtZero: true },
        y: { ticks: { autoSkip: false } }
      })
    }
  }

  return (
    <div style={{ width: 300, height: 300, margin: '0 auto' }}>
      {chartType === 'pie'
        ? <Pie data={data} options={commonOptions} />
        : <Bar data={data} options={commonOptions} />
      }
    </div>
  )
}
