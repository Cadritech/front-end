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
import InboxIcon from '@mui/icons-material/Inbox'

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
import {
  CardHeader,
  Icon,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { db } from 'src/lib/prisma'
import { BASEURL } from 'src/configs/api'
import { statusCardsData } from 'src/mock/statusCards.mock'

const inputsCards: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const steps = [
  {
    title: 'PASSO 1',
    subtitle: 'Informações da Ordem a ser aberta.'
  },
  {
    title: 'PASSO 2',
    subtitle: 'Roteiro'
  },
  {
    title: 'PASSO 3',
    subtitle: 'RB'
  },
  {
    title: 'PASSO 4',
    subtitle: 'Documentos Complementares'
  }
]

const defaultOrderFormOpenValues = {
  title: '',
  typeOrder: '',
  equipament: '',
  location: '',
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
  const [load, setLoad] = useState(true)

  // ** States
  const [activeStep, setActiveStep] = useState<number>(0)
  const [planned_month, setPlannedMonth] = useState('')

  const [startProg, setStartProg] = useState('')
  const [endProg, setEndProg] = useState('')

  const [typeOrder, setTypeOrder] = useState('')
  const [classification, setClassification] = useState('ABERTO')
  const [priority, setPriority] = useState('NORMAL')
  const [status, setStatus] = useState('')

  const [cardsData, setCardsData] = useState([])
  const [cardNumber, setCardNumber] = useState('')
  const [equipament, setEquipament] = useState('')
  const [panel, setPanel] = useState('')
  const [obs, setObs] = useState('')

  const [valuesDataForm, setValuesDataForm] = useState([])

  const {
    reset: orderFormOpenReset,
    control: orderOpenFormControl,
    handleSubmit: handlePersonalSubmit,
    formState: { errors: orderFormOpenErrors }
  } = useForm({
    defaultValues: defaultOrderFormOpenValues,
    resolver: yupResolver(orderFormOpenSchema)
  })

  const {
    reset: roteiroReset,
    control: roteiroControl,
    handleSubmit: handleRoteiroSubmit,
    formState: { errors: roteiroErrors }
  } = useForm({
    defaultValues: defaultRoteiroValues,
    resolver: yupResolver(roteiroSchema)
  })

  const {
    reset: rbReset,
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
    roteiroReset({ roteiro: '' })
    orderFormOpenReset({ title: '' })
    rbReset({ cardNumber: '' })
  }

  function gerarCodigoAleatorio(param: string) {
    let pre = ''

    if (param == 'PREVENTIVA') {
      pre = '50'
    } else if (param == 'CORRETIVA') {
      pre = '51'
    } else if (param == 'MELHORIA') {
      pre = '52'
    }

    const prefixo = pre
    let codigo = ''

    for (let i = 0; i < 9; i++) {
      const digitoAleatorio = Math.floor(Math.random() * 7)
      codigo += digitoAleatorio
    }

    return prefixo + codigo
  }

  function dataAtualISO() {
    return new Date().toISOString()
  }

  function converterParaISO(dataString) {
    const data = new Date(dataString)

    const ano = data.getUTCFullYear()
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0') // Meses são de 0 a 11
    const dia = String(data.getUTCDate()).padStart(2, '0')
    const horas = String(data.getUTCHours()).padStart(2, '0')
    const minutos = String(data.getUTCMinutes()).padStart(2, '0')
    const segundos = String(data.getUTCSeconds()).padStart(2, '0')

    return `${ano}-${mes}-${dia}T${horas}:${minutos}:${segundos}Z`
  }

  const addCardPanels = () => {
    let arrayRbs = []
    const result = localStorage.getItem('@cardsData')
    const respJson = JSON.parse(result)

    if (respJson?.length <= 0 || respJson === null) {
      arrayRbs.push({
        cardNumber,
        equipament,
        panel,
        status,
        observation: obs
      })
    } else {
      arrayRbs = respJson
      arrayRbs.push({
        cardNumber,
        equipament,
        panel,
        status,
        observation: obs
      })
    }

    localStorage.setItem('@cardsData', JSON.stringify(arrayRbs))
    getCardsData()
  }

  const getCardsData = () => {
    setLoad(false)
    const result = localStorage.getItem('@cardsData')
    const respJson = JSON.parse(result)

    setCardsData(respJson)
    setLoad(true)
  }

  const onSubmit = async data => {
    setLoad(true)
    let newArray = []

    const result = localStorage.getItem('@cardsData')
    const respJson = JSON.parse(result)

    if (valuesDataForm.length < 0) {
      newArray.push(data)
      setValuesDataForm(newArray)
    } else {
      newArray = valuesDataForm
      newArray.push(data)
      setValuesDataForm(newArray)
    }

    if (valuesDataForm.length >= 3) {
      await fetch(`${BASEURL}/neworder`, {
        method: 'post',
        body: JSON.stringify({
          order_id: gerarCodigoAleatorio(typeOrder),
          title: valuesDataForm[0].title,
          classification: classification,
          location: valuesDataForm[0].location,
          drawing: valuesDataForm[0].drawing,
          type_order: typeOrder,
          equipament: valuesDataForm[0].equipament,
          creation: dataAtualISO(),
          start_prog: String(startProg).trim() !== '' ? converterParaISO(startProg) : '',
          end_prog: String(endProg).trim() !== '' ? converterParaISO(endProg) : '',
          responsible: valuesDataForm[0].responsible,
          conditions: valuesDataForm[0].condions,
          priority: priority,
          roteiro: valuesDataForm[1].roteiro,
          rb: respJson
        })
      }).then(response => {
        console.log('response: ')
        console.log(response)
      })

      toast.success('Dados Salvos com Sucesso')
      setActiveStep(activeStep + 1)
    }

    setActiveStep(activeStep + 1)
    if (activeStep === steps.length - 1) {
      toast.success('Form Submitted')
    }

    setLoad(false)
  }

  const removeCardsData = () => {
    localStorage.removeItem('@cardsData')
    getCardsData()
  }

  useEffect(() => {
    getCardsData()
  }, [])

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form key={1} onSubmit={handlePersonalSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[1].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[1].subtitle}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='title'
                    control={orderOpenFormControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Título da Ordem'
                        onChange={onChange}
                        placeholder='Título da Ordem'
                        error={Boolean(orderFormOpenErrors['title'])}
                        aria-describedby='stepper-linear-personal-title'
                      />
                    )}
                  />
                  {orderFormOpenErrors['title'] && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-title'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id='demo-simple-select-outlined-label'>Classificação?</InputLabel>
                  <Select
                    label='Classificação?'
                    defaultValue={classification}
                    id='demo-simple-select-outlined1'
                    labelId='demo-simple-select-outlined-label1'
                    sx={{ width: '100%' }}
                    onChange={value => {
                      setClassification(value.target.value)
                    }}
                  >
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'ABERTO'}>ABERTO</MenuItem>
                    <MenuItem value={'EM_ANDAMENTO'}>EM ANDAMENTO</MenuItem>
                    <MenuItem value={'FECHADO'}>FECHADO</MenuItem>
                  </Select>
                </FormControl>
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
                    <MenuItem value={'CORRETIVA'}>CORRETIVA</MenuItem>
                    <MenuItem value={'MELHORIA'}>MELHORIA</MenuItem>
                    <MenuItem value={'PREVENTIVA'}>PREVENTIVA</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <Controller
                    name='equipament'
                    control={orderOpenFormControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Equipamento'
                        onChange={onChange}
                        placeholder='Equipamento'
                        error={Boolean(orderFormOpenErrors['equipament'])}
                        aria-describedby='stepper-linear-personal-equipament'
                      />
                    )}
                  />
                  {orderFormOpenErrors['equipament'] && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-equipament'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <Controller
                    name='location'
                    control={orderOpenFormControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Localização'
                        onChange={onChange}
                        placeholder='Localização'
                        error={Boolean(orderFormOpenErrors['location'])}
                        aria-describedby='stepper-linear-personal-location'
                      />
                    )}
                  />
                  {orderFormOpenErrors['location'] && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-location'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <Controller
                    name='drawing'
                    control={orderOpenFormControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Desenho'
                        onChange={onChange}
                        placeholder='Desenho'
                        error={Boolean(orderFormOpenErrors['drawing'])}
                        aria-describedby='stepper-linear-personal-drawing'
                      />
                    )}
                  />
                  {orderFormOpenErrors['drawing'] && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-drawing'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='condions'
                    control={orderOpenFormControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Condições'
                        onChange={onChange}
                        placeholder='Condições'
                        error={Boolean(orderFormOpenErrors['condions'])}
                        aria-describedby='stepper-linear-personal-condions'
                      />
                    )}
                  />
                  {orderFormOpenErrors['condions'] && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-condions'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id='demo-simple-select-outlined-label'>Prioridade?</InputLabel>
                  <Select
                    label='Prioridade?'
                    defaultValue={priority}
                    id='demo-simple-select-outlined1'
                    labelId='demo-simple-select-outlined-label1'
                    sx={{ width: '100%' }}
                    onChange={value => {
                      setPriority(value.target.value)
                    }}
                  >
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'NORMAL'}>NORMAL</MenuItem>
                    <MenuItem value={'URGENTE'}>URGENTE</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <FormControl fullWidth>
                  <Controller
                    name='responsible'
                    control={orderOpenFormControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Responsavél'
                        onChange={onChange}
                        placeholder='Responsavél'
                        error={Boolean(orderFormOpenErrors['responsible'])}
                        aria-describedby='stepper-linear-personal-responsible'
                      />
                    )}
                  />
                  {orderFormOpenErrors['responsible'] && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-responsible'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12} lg={3}>
                <Calendario formatDate='MM/yyyy' label='Planejamento' date={planned_month} setDate={setPlannedMonth} />
              </Grid>

              <Grid item xs={12} md={12} lg={3}>
                <Calendario formatDate='dd/MM/yyyy' label='Início' date={startProg} setDate={setStartProg} />
              </Grid>

              <Grid item xs={12} md={12} lg={3}>
                <Calendario formatDate='dd/MM/yyyy' label='Fim' date={endProg} setDate={setEndProg} />
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
        return (
          <form key={2} onSubmit={handleRoteiroSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[1].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[1].subtitle}
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
                        rows={10}
                        value={value}
                        label='Roteiro'
                        onChange={onChange}
                        error={Boolean(roteiroErrors.roteiro)}
                        placeholder='Roteiro'
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
                  VOLTAR
                </Button>
                <Button size='large' type='submit' variant='contained'>
                  AVANÇAR
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 2:
        return (
          <>
            <form key={3} onSubmit={handleRbSubmit(onSubmit)}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {steps[2].title}
                  </Typography>
                  <Typography variant='caption' component='p'>
                    {steps[2].subtitle}
                  </Typography>
                </Grid>

                <>
                  <Grid item xs={1} sm={1}>
                    <TextField
                      type='text'
                      value={cardNumber}
                      label='Cartão'
                      onChange={value => setCardNumber(value.target.value)}
                      placeholder='00000000'
                      aria-describedby='stepper-linear-cardNumber'
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={3} sm={2}>
                    <TextField
                      type='text'
                      value={equipament}
                      label='Equipamento'
                      onChange={value => setEquipament(value.target.value)}
                      placeholder='Equipamento'
                      aria-describedby='stepper-linear-equipament'
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={3} sm={3}>
                    <TextField
                      type='text'
                      value={panel}
                      label='Painel'
                      onChange={value => setPanel(value.target.value)}
                      placeholder='Painel'
                      aria-describedby='stepper-linear-panel'
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={5} sm={1}>
                    <Select
                      label='STATUS'
                      fullWidth
                      defaultValue={status}
                      id='demo-simple-select-outlined1'
                      labelId='demo-simple-select-outlined-label1'
                      sx={{ width: '100%' }}
                      onChange={value => {
                        setStatus(value.target.value)
                      }}
                    >
                      <MenuItem value=''>
                        <em>None</em>
                      </MenuItem>
                      {statusCardsData.map((item, index) => {
                        return (
                          <MenuItem key={index} value={item.value}>
                            {item.name}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </Grid>

                  <Grid item xs={5} sm={3}>
                    <TextField
                      type='text'
                      value={obs}
                      label='Observações'
                      onChange={value => setObs(value.target.value)}
                      placeholder='Observações'
                      aria-describedby='stepper-linear-observation'
                      fullWidth
                    />
                  </Grid>

                  <Grid
                    item
                    xs={2}
                    sm={2}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Button
                      size='large'
                      color='success'
                      type='button'
                      variant='contained'
                      onClick={() => {
                        addCardPanels()
                      }}
                    >
                      Adicionar
                    </Button>
                    <Button
                      size='large'
                      color='error'
                      type='button'
                      variant='contained'
                      onClick={() => {
                        removeCardsData()
                      }}
                    >
                      Limpar
                    </Button>
                  </Grid>
                </>

                <Grid item xs={12} sm={12}>
                  <br />
                  <Typography variant='h6'>Adicionados</Typography> <br />
                  {load && (
                    <TableContainer>
                      <Table aria-label='simple table'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Cartão</TableCell>
                            <TableCell align='left'>Equipamento</TableCell>
                            <TableCell align='left'>Painel</TableCell>
                            <TableCell align='left'>Status</TableCell>
                            <TableCell align='left'>Observações</TableCell>
                          </TableRow>
                        </TableHead>
                        {cardsData?.length > 0 && (
                          <TableBody>
                            {cardsData.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell align='left'>{item.cardNumber}</TableCell>
                                <TableCell align='left'>{item.equipament}</TableCell>
                                <TableCell align='left'>{item.panel}</TableCell>
                                <TableCell align='left'>{item.status}</TableCell>
                                <TableCell align='left'>{item.observation}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        )}
                      </Table>
                    </TableContainer>
                  )}
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
          </>
        )
      case 3:
        return (
          <>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[3].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[3].subtitle}
                </Typography>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
                  Voltar
                </Button>
                <Button size='large' type='submit' variant='contained'>
                  Imprimir Ordem
                </Button>
              </Grid>
            </Grid>
          </>
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
      <CardHeader title='New Order' subheader='Cadastre uma nova ordem nessa tela!' />
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
