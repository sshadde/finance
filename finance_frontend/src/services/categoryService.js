import api from './api'

export function fetchCategories() {
  return api.get('finance/categories/')
}

export function createCategory(data) {
  return api.post('finance/categories/', data)
}

export function updateCategory(id, data) {
  return api.put(`finance/categories/${id}/`, data)
}

export function deleteCategory(id) {
  return api.delete(`finance/categories/${id}/`)
}
