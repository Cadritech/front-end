import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'

const Dashboard = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 1.5, color: '#ff006e' }} color='text.secondary'>
              Planned
            </Typography>
            <Typography
              variant='h5'
              gutterBottom
              sx={{
                fontWeight: 'bold'
              }}
            >
              0
            </Typography>
            <Typography sx={{ mb: 1.5 }} color='text.secondary'>
              Total de Registros
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={3}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 1.5, color: '#80b918' }} color='text.secondary'>
              Open Orders
            </Typography>
            <Typography
              variant='h5'
              sx={{
                fontWeight: 'bold'
              }}
              gutterBottom
            >
              0
            </Typography>
            <Typography sx={{ mb: 1.5 }} color='text.secondary'>
              Total de Registros
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={3}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 1.5, color: '#9b5de5' }} color='text.secondary'>
              New Orders
            </Typography>
            <Typography
              sx={{
                fontWeight: 'bold'
              }}
              variant='h5'
              gutterBottom
            >
              0
            </Typography>
            <Typography sx={{ mb: 1.5 }} color='text.secondary'>
              Total de Registros
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={3}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 1.5, color: '#fb8500' }} color='text.secondary'>
              Closed Orders
            </Typography>
            <Typography
              sx={{
                fontWeight: 'bold'
              }}
              variant='h5'
              gutterBottom
            >
              0
            </Typography>
            <Typography sx={{ mb: 1.5 }} color='text.secondary'>
              Total de Registros
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* ChatJs */}

      <Grid item xs={8} sm={8}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 1.5 }} color='text.secondary'>
              Planned {new Date().getFullYear()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={4} sm={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 1.5 }} color='text.secondary'>
              Planned + New Orders
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Dashboard
