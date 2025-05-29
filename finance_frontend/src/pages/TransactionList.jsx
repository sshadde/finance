import { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Paper,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import {
  format,
  parseISO,
  isThisWeek,
  isSameWeek,
  subWeeks
} from 'date-fns'
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../services/transactionService'
import { fetchCategories } from '../services/categoryService'

export default function TransactionList() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])

  const [form, setForm] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().slice(0,16),
    note: ''
  })
  const [editingId, setEditingId] = useState(null)

  const [confirmDel, setConfirmDel] = useState({ open: false, id: null })

  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    loadCategories()
    loadTransactions()
  }, [])

  async function loadCategories() {
    const res = await fetchCategories()
    setCategories(res.data)
  }

  async function loadTransactions() {
    const res = await fetchTransactions()
    setTransactions(res.data)
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = { ...form }
    if (editingId) {
      await updateTransaction(editingId, payload)
    } else {
      await createTransaction(payload)
    }
    resetForm()
    await loadTransactions()
  }

  function resetForm() {
    setEditingId(null)
    setForm({
      category: '',
      amount: '',
      date: new Date().toISOString().slice(0,16),
      note: ''
    })
  }

  function startEdit(tx) {
    setEditingId(tx.id)
    setForm({
      category: tx.category,
      amount: tx.amount,
      date: tx.date.slice(0,16),
      note: tx.note || ''
    })
  }

  function confirmDelete(id) {
    setConfirmDel({ open: true, id })
  }

  async function handleDelete() {
    await deleteTransaction(confirmDel.id)
    setConfirmDel({ open: false, id: null })
    await loadTransactions()
  }

  const txWithType = useMemo(() => {
    return transactions.map(tx => {
      const cat = categories.find(c => c.id === tx.category)
      return {
        ...tx,
        type: cat?.type ?? 'expense',
        catName: cat?.name ?? '—'
      }
    })
  }, [transactions, categories])

  const filtered = useMemo(() => {
    if (filterType === 'all') return txWithType
    return txWithType.filter(tx => tx.type === filterType)
  }, [txWithType, filterType])

  const groups = useMemo(() => {
    const now = new Date()
    const lastWeekRef = subWeeks(now, 1)
    const map = {}
    for (let tx of filtered) {
      const dt = parseISO(tx.date)
      let key
      if (isThisWeek(dt, { weekStartsOn: 1 })) {
        key = 'Эта неделя'
      } else if (isSameWeek(dt, lastWeekRef, { weekStartsOn: 1 })) {
        key = 'Прошлая неделя'
      } else {
        key = format(dt, 'LLLL yyyy')
      }
      map[key] = map[key] || []
      map[key].push(tx)
    }
    return map
  }, [filtered])

  const sortedGroupKeys = useMemo(() => {
    const allKeys = Object.keys(groups)
    const weeks = ['Эта неделя', 'Прошлая неделя'].filter(k => allKeys.includes(k))
    const months = allKeys
      .filter(k => !weeks.includes(k))
      .sort((a, b) => {
        const da = parseISO(`${a.split(' ')[1]}-${ 
          ['января','февраля','марта','апреля','мая','июня','июля',
           'августа','сентября','октября','ноября','декабря']
           .indexOf(a.split(' ')[0]) + 1
        }-01`)
        const db = parseISO(`${b.split(' ')[1]}-${ 
          ['января','февраля','марта','апреля','мая','июня','июля',
           'августа','сентября','октября','ноября','декабря']
           .indexOf(b.split(' ')[0]) + 1
        }-01`)
        return db - da
      })
    return [...weeks, ...months]
  }, [groups])

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Транзакции</Typography>

      {/* Фильтр */}
      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Показывать</InputLabel>
        <Select
          value={filterType}
          label="Показывать"
          onChange={e => setFilterType(e.target.value)}
        >
          <MenuItem value="all">Все</MenuItem>
          <MenuItem value="income">Доходы</MenuItem>
          <MenuItem value="expense">Расходы</MenuItem>
        </Select>
      </FormControl>

      {/* Форма */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Категория</InputLabel>
              <Select
                name="category"
                value={form.category}
                label="Категория"
                onChange={handleChange}
                required
              >
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.type === 'income' ? '💰 ' : '🛒 '}
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Сумма"
              name="amount"
              type="number"
              inputProps={{ step: '0.01' }}
              value={form.amount}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Дата и время"
              name="date"
              type="datetime-local"
              value={form.date}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Заметка"
              name="note"
              value={form.note}
              onChange={handleChange}
            />

            <Button variant="contained" type="submit">
              {editingId ? 'Сохранить' : 'Добавить'}
            </Button>
            {editingId && (
              <Button variant="outlined" onClick={resetForm}>
                Отменить
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Группированный список */}
      {sortedGroupKeys.map(key => (
        <Box key={key} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>{key}</Typography>
          <Paper variant="outlined">
            {groups[key].map(tx => (
              <Box
                key={tx.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(tx.date).toLocaleString(undefined, {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                  <Typography variant="body1">{tx.catName}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    variant="body1"
                    color={tx.type === 'income' ? 'success.main' : 'error.main'}
                  >
                    { (tx.type === 'income' ? '+' : '-') + parseFloat(tx.amount).toLocaleString() }
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton size="small" onClick={() => startEdit(tx)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => confirmDelete(tx.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              </Box>
            ))}
          </Paper>
        </Box>
      ))}

      {/* Диалог удаления */}
      <Dialog
        open={confirmDel.open}
        onClose={() => setConfirmDel({ open: false, id: null })}
      >
        <DialogTitle>Удалить транзакцию?</DialogTitle>
        <DialogContent>Вы уверены, что хотите удалить эту транзакцию?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDel({ open: false, id: null })}>
            Отмена
          </Button>
          <Button color="error" onClick={handleDelete}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
