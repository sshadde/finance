import { Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout'
import CategoryList from './CategoryList'
import TransactionList from './TransactionList'
import Reports from './Reports'

export default function Dashboard() {
  return (
    <Layout>
      <Routes>
        <Route path="categories" element={<CategoryList />} />
        <Route path="transactions" element={<TransactionList />} />
        <Route path="*" element={<Reports />} />
      </Routes>
    </Layout>
  )
}
