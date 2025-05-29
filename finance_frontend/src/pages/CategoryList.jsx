import {
  Paper,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Alert,
  FormControl,
  InputLabel
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { useState, useEffect, useMemo } from 'react'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../services/categoryService'

export default function CategoryList() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', type: 'expense' })
  const [editingId, setEditingId] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const res = await fetchCategories()
    setCategories(res.data)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setErrorMsg('')
    if (editingId) {
      await updateCategory(editingId, form)
    } else {
      await createCategory(form)
    }
    setForm({ name: '', type: 'expense' })
    setEditingId(null)
    await loadCategories()
  }

  const handleDelete = async () => {
    try {
      await deleteCategory(confirmDel)
      setConfirmDel(null)
      setErrorMsg('')
      await loadCategories()
    } catch {
      setErrorMsg('Нельзя удалить категорию: в ней есть связанные транзакции.')
      setConfirmDel(null)
    }
  }

  const visibleCategories = useMemo(() => {
    if (filterType === 'all') return categories
    return categories.filter(cat => cat.type === filterType)
  }, [categories, filterType])

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Категории</Typography>

      {/* Ошибка удаления */}
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}

      {/* Фильтр по типу */}
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
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

      {/* Форма добавления/редактирования */}
      <Stack
        component="form"
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        onSubmit={handleSubmit}
        sx={{ mb: 3 }}
      >
        <TextField
          label="Название"
          name="name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          fullWidth
        />

        <Select
          name="type"
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <MenuItem value="income">Доход</MenuItem>
          <MenuItem value="expense">Расход</MenuItem>
        </Select>

        <Button variant="contained" type="submit">
          {editingId ? 'Сохранить' : 'Добавить'}
        </Button>
        {editingId && (
          <Button onClick={() => {
            setEditingId(null)
            setForm({ name: '', type: 'expense' })
          }}>
            Отменить
          </Button>
        )}
      </Stack>

      {/* Таблица категорий */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell>Тип</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleCategories.map(cat => (
            <TableRow key={cat.id}>
              <TableCell>{cat.name}</TableCell>
              <TableCell>
                {cat.type === 'income'
                  ? <Typography color="success.main">Доход</Typography>
                  : <Typography color="error.main">Расход</Typography>
                }
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => {
                  setEditingId(cat.id)
                  setForm({ name: cat.name, type: cat.type })
                  setErrorMsg('')
                }}>
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => {
                    setConfirmDel(cat.id)
                    setErrorMsg('')
                  }}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={Boolean(confirmDel)}
        onClose={() => setConfirmDel(null)}
      >
        <DialogTitle>Удалить категорию?</DialogTitle>
        <DialogContent>Действительно удалить эту категорию?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDel(null)}>Отмена</Button>
          <Button color="error" onClick={handleDelete}>Удалить</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
