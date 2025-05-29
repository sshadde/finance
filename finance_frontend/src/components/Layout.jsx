import { useState } from 'react'
import {
  AppBar, Toolbar, IconButton, Typography, Drawer,
  List, ListItemButton, ListItemIcon, ListItemText,
  CssBaseline, Box, Divider
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CategoryIcon from '@mui/icons-material/Category'
import ReceiptIcon from '@mui/icons-material/Receipt'
import BarChartIcon from '@mui/icons-material/BarChart'
import LogoutIcon from '@mui/icons-material/Logout'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../services/auth'

const drawerWidth = 240

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit" edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Личные финансы
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItemButton component={Link} to="/categories">
            <ListItemIcon><CategoryIcon /></ListItemIcon>
            <ListItemText primary="Категории" />
          </ListItemButton>

          <ListItemButton component={Link} to="/transactions">
            <ListItemIcon><ReceiptIcon /></ListItemIcon>
            <ListItemText primary="Транзакции" />
          </ListItemButton>

          <ListItemButton component={Link} to="/">
            <ListItemIcon><BarChartIcon /></ListItemIcon>
            <ListItemText primary="Статистика" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Основной контент */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          marginTop: theme => theme.spacing(8)
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
