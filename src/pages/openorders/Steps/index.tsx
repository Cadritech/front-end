// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Components Imports
import StepperCustomDot from './StepperCustomDot'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import Calendario from 'src/pages/components/Calendario'
import { InputLabel, MenuItem, Select } from '@mui/material'
import { BASEURL } from 'src/configs/api'
import axios from 'axios'

const inputsCards: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const steps = [
  {
    title: 'PASSO 1',
    subtitle: 'Insira o ID da Ordem a ser aberta.'
  },
  {
    title: 'PASSO 2',
    subtitle: 'Informações da Ordem a ser aberta.'
  },
  {
    title: 'PASSO 3',
    subtitle: 'Roteiro'
  },
  {
    title: 'PASSO 4',
    subtitle: 'RB'
  },
  {
    title: 'PASSO 5',
    subtitle: 'Documentos Complementares'
  }
]

const defaultOrderValues = {
  orderid: ''
}
const defaultOrderFormOpenValues = {
  title: '',
  classification: '',
  typeOrder: '',
  equipament: '',
  location: '',
  drawing: '',
  condions: '',
  priority: '',
  responsible: '',
  hourWork: ''
}

const defaultRoteiroValues = {
  roteiro: ''
}

const defaultRbValues = {
  cardNumber: '',
  equipament: '',
  panel: '',
  state: '',
  observation: ''
}

const rbSchema = yup.object().shape({
  cardNumber: yup.string(),
  equipament: yup.string(),
  panel: yup.string(),
  state: yup.string(),
  observation: yup.string()
})

const orderFormOpenSchema = yup.object().shape({
  title: yup.string()
})
const roteiroSchema = yup.object().shape({
  roteiro: yup.string()
})

const StepperLinearWithValidation = () => {
  const [load, setLoad] = useState(false)

  // ** States
  const [activeStep, setActiveStep] = useState<number>(0)
  const [creation, setCreation] = useState('')
  const [planned_month, setPlannedMonth] = useState('')

  const [startProg, setStartProg] = useState('')
  const [endProg, setEndProg] = useState('')
  const [endEnc, setEndEnc] = useState('')

  const [orderId, setOrderId] = useState('')

  // inputs step 1
  const [title, setTitle] = useState('')
  const [classification, setClassification] = useState('')
  const [typeOrder, setTypeOrder] = useState('')
  const [equipment, setEquipment] = useState('')
  const [location, setLocation] = useState('')
  const [drawing, setDrawing] = useState('')
  const [conditions, setConditions] = useState('')
  const [priority, setPriority] = useState('')
  const [responsible, setResponsible] = useState('')
  const [hourWork, setHourWork] = useState('')
  const [encerrado, setEncerrado] = useState('')

  // ** Hooks
  const { handleSubmit: handleAccountSubmit } = useForm({
    defaultValues: defaultOrderValues
  })

  const {
    handleSubmit: handlePersonalSubmit,
    formState: { errors: orderFormOpenErrors }
  } = useForm({
    defaultValues: defaultOrderFormOpenValues,
    resolver: yupResolver(orderFormOpenSchema)
  })

  const {
    control: roteiroControl,
    handleSubmit: handleRoteiroSubmit,
    formState: { errors: roteiroErrors }
  } = useForm({
    defaultValues: defaultRoteiroValues,
    resolver: yupResolver(roteiroSchema)
  })

  const {
    control: rbControl,
    handleSubmit: handleRbSubmit,
    formState: { errors: rbErrors }
  } = useForm({
    defaultValues: defaultRbValues,
    resolver: yupResolver(rbSchema)
  })

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }
  const handleReset = () => {
    setActiveStep(0)
  }

  const getOrderData = async (id: string) => {
    setLoad(true)

    // const response = await fetch(`${BASEURL}/openorders/${id}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    // const data = await response.json()

    axios
      .get(`${BASEURL}/openorders/${id}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      })
      .then(function (response) {
        console.log(response)
      })

    // setTitle(hasValue(data, data[0].title))
    // setClassification(hasValue(data, data[0].classification))
    // setTypeOrder(hasValue(data, data[0].type_order))
    // setEquipment(hasValue(data, data[0].equipament))
    // setLocation(hasValue(data, data[0].location))
    // setDrawing(hasValue(data, data[0].drawing))
    // setConditions(hasValue(data, data[0].conditions))

    // setCreation(getTimeStampsDate(data[0].creation))

    setLoad(false)
  }

  const onSubmit = data => {
    const formState = {
      title,
      classification,
      typeOrder,
      equipment,
      location,
      drawing,
      conditions,
      priority,
      responsible,
      hourWork,
      encerrado
    }

    getOrderData(orderId)

    setActiveStep(activeStep + 1)
    if (activeStep === steps.length - 1) {
      toast.success('Form Submitted')
    }
  }

  useEffect(() => {
    if (activeStep === 1) {
      getOrderData(orderId)
    }
  }, [activeStep])

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleAccountSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[0].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[0].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  type='text'
                  value={orderId}
                  label='Order ID'
                  onChange={value => setOrderId(value.target.value)}
                  placeholder='00000000'
                  aria-describedby='stepper-linear-account-orderid'
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size='large' variant='outlined' color='secondary' disabled>
                  Voltar
                </Button>
                <Button size='large' type='submit' variant='contained'>
                  Avançar
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 1:
        if (load) {
          return (
            <Grid item xs={12}>
              <Typography fontWeight={700} variant='h6' gutterBottom>
                Carregando Dados...
              </Typography>
            </Grid>
          )
        } else {
          return (
            <form key={1} onSubmit={handlePersonalSubmit(onSubmit)}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Typography fontWeight={700} variant='h6' gutterBottom>
                    ORDER: 123456789
                  </Typography>

                  <br />

                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {steps[1].title}
                  </Typography>
                  <Typography variant='caption' component='p'>
                    {steps[1].subtitle}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    value={title}
                    label='Título da Ordem'
                    onChange={value => setTitle(value.target.value)}
                    placeholder='Título da Ordem'
                    aria-describedby='stepper-linear-personal-title'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    value={classification}
                    label='Classificação'
                    onChange={value => setClassification(value.target.value)}
                    placeholder='Classificação'
                    aria-describedby='stepper-linear-personal-classification'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id='demo-simple-select-outlined-label'>Tipo de Ordem?</InputLabel>
                    <Select
                      label='Tipo de Ordem?'
                      defaultValue={typeOrder}
                      id='demo-simple-select-outlined1'
                      labelId='demo-simple-select-outlined-label1'
                      sx={{ width: '100%' }}
                      onChange={value => {
                        setTypeOrder(value.target.value)
                      }}
                    >
                      <MenuItem value=''>
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={'PREVENTIVA'}>PREVENTIVA</MenuItem>
                      <MenuItem value={'CORRETIVA'}>CORRETIVA</MenuItem>
                      <MenuItem value={'MELHORIA'}>MELHORIA</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={equipment}
                    label='Equipamento'
                    onChange={value => setEquipment(value.target.value)}
                    placeholder='Equipamento'
                    aria-describedby='stepper-linear-personal-equipament'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={location}
                    label='Localização'
                    onChange={value => setLocation(value.target.value)}
                    placeholder='Localização'
                    aria-describedby='stepper-linear-personal-location'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={drawing}
                    label='Desenho'
                    onChange={value => setDrawing(value.target.value)}
                    placeholder='Desenho'
                    aria-describedby='stepper-linear-personal-drawing'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={conditions}
                    label='Condições'
                    onChange={value => setConditions(value.target.value)}
                    placeholder='Condições'
                    aria-describedby='stepper-linear-personal-condions'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={priority}
                    label='Prioridade'
                    onChange={value => setPriority(value.target.value)}
                    placeholder='Prioridade'
                    aria-describedby='stepper-linear-personal-priority'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={responsible}
                    label='Responsavél'
                    onChange={value => setResponsible(value.target.value)}
                    placeholder='Responsavél'
                    aria-describedby='stepper-linear-personal-responsible'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={12} lg={3}>
                  <Calendario formatDate='dd/MM/yyyy' label='Data Criação' date={creation} setDate={setCreation} />
                </Grid>

                <Grid item xs={12} md={12} lg={3}>
                  <Calendario
                    formatDate='MM/yyyy'
                    label='Planejamento'
                    date={planned_month}
                    setDate={setPlannedMonth}
                  />
                </Grid>

                <Grid item xs={12} md={12} lg={3}>
                  <Calendario formatDate='dd/MM/yyyy' label='Início' date={startProg} setDate={setStartProg} />
                </Grid>

                <Grid item xs={12} md={12} lg={3}>
                  <Calendario formatDate='dd/MM/yyyy' label='Fim' date={endProg} setDate={setEndProg} />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={hourWork}
                    label='Tempo'
                    onChange={value => setHourWork(value.target.value)}
                    placeholder='00:00'
                    error={Boolean(orderFormOpenErrors['hourWork'])}
                    aria-describedby='stepper-linear-personal-hourWork'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    value={encerrado}
                    label='Encerrado por'
                    onChange={value => setEncerrado(value.target.value)}
                    placeholder='Encerrado por'
                    error={Boolean(orderFormOpenErrors['responsible'])}
                    aria-describedby='stepper-linear-personal-responsible'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={12} lg={4}>
                  <Calendario formatDate='dd/MM/yyyy' label='Encerramento' date={endEnc} setDate={setEndEnc} />
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
                    Voltar
                  </Button>
                  <Button size='large' type='submit' variant='contained'>
                    Avançar
                  </Button>
                </Grid>
              </Grid>
            </form>
          )
        }
      case 2:
        return (
          <form key={2} onSubmit={handleRoteiroSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography fontWeight={700} variant='h6' gutterBottom>
                  RT: 001048
                </Typography>

                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[2].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[2].subtitle}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <Controller
                    name='roteiro'
                    control={roteiroControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        multiline
                        rows={4}
                        value={value}
                        label='line 01'
                        onChange={onChange}
                        error={Boolean(roteiroErrors.roteiro)}
                        placeholder='line 01'
                        aria-describedby='stepper-linear-social-roteiro'
                      />
                    )}
                  />
                  {roteiroErrors.roteiro && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-social-roteiro'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
                  Back
                </Button>
                <Button size='large' type='submit' variant='contained'>
                  AVANÇAR
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 3:
        return (
          <form key={3} onSubmit={handleRbSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography fontWeight={700} variant='h6' gutterBottom>
                  RB: 000000
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[0].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[0].subtitle}
                </Typography>
                <Button size='large' type='button' variant='contained' sx={{ marginTop: 5 }}>
                  Adicionar mais uma linha
                </Button>
              </Grid>

              {/* verificar se a quantidade de 10 items será fixa */}

              {inputsCards.map((item, index) => {
                return (
                  <>
                    <Grid item xs={3} sm={3}>
                      <FormControl fullWidth>
                        <Controller
                          name={'cardNumber' + index}
                          control={rbControl}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              type='text'
                              value={value}
                              label='Cartão'
                              onChange={onChange}
                              error={Boolean(rbErrors.cardNumber)}
                              placeholder='00000000'
                              aria-describedby='stepper-linear-cardNumber'
                            />
                          )}
                        />
                        {rbErrors.cardNumber && (
                          <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-cardNumber'>
                            {rbErrors.cardNumber.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={3} sm={3}>
                      <FormControl fullWidth>
                        <Controller
                          name='equipament'
                          control={rbControl}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              type='text'
                              value={value}
                              label='Equipamento'
                              onChange={onChange}
                              error={Boolean(rbErrors.equipament)}
                              placeholder='Equipamento'
                              aria-describedby='stepper-linear-equipament'
                            />
                          )}
                        />
                        {rbErrors.equipament && (
                          <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-equipament'>
                            {rbErrors.equipament.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={3} sm={3}>
                      <FormControl fullWidth>
                        <Controller
                          name='panel'
                          control={rbControl}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              type='text'
                              value={value}
                              label='Painel'
                              onChange={onChange}
                              error={Boolean(rbErrors.panel)}
                              placeholder='Painel'
                              aria-describedby='stepper-linear-panel'
                            />
                          )}
                        />
                        {rbErrors.panel && (
                          <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-panel'>
                            {rbErrors.panel.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={3} sm={3}>
                      <FormControl fullWidth>
                        <Controller
                          name='observation'
                          control={rbControl}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              type='text'
                              value={value}
                              label='Observações'
                              onChange={onChange}
                              error={Boolean(rbErrors.observation)}
                              placeholder='Observações'
                              aria-describedby='stepper-linear-observation'
                            />
                          )}
                        />
                        {rbErrors.observation && (
                          <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-observation'>
                            {rbErrors.observation.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </>
                )
              })}

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
                  Voltar
                </Button>
                <Button size='large' type='submit' variant='contained'>
                  Avançar
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      default:
        return null
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='large' variant='contained' onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <Card>
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              return (
                <Step key={index}>
                  <StepLabel StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography className='step-number'>{`0${index + 1}`}</Typography>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <Divider sx={{ m: '0 !important' }} />

      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
}

export default StepperLinearWithValidation
