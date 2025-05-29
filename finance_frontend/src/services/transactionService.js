import api from './api'

export function fetchTransactions() {
  return api.get('finance/transactions/')
}

export function createTransaction(data) {
  return api.post('finance/transactions/', data)
}

export function updateTransaction(id, data) {
  return api.put(`finance/transactions/${id}/`, data)
}

export function deleteTransaction(id) {
  return api.delete(`finance/transactions/${id}/`)
}
