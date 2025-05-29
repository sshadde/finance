import { Grid, Paper, Typography, Box } from '@mui/material'
import CategoryChart from '../components/CategoryChart'

export default function Reports() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Статистика по категориям
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Расходы
            </Typography>
            <CategoryChart type="expense" chartType="pie" />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Доходы
            </Typography>
            <CategoryChart type="income" chartType="bar" />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
