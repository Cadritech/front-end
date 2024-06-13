export type relServiceType = {
  id: string
  order_id: string
  service_id: string
  description: string
  line01: string
  line02: string
  line03: string
  line04: string
  line05: string
  line06: string
  line07: string
  line08: string
  line09: string
  line10: string
  line11: string
  line12: string
  line13: string
  line14: string
}

// Define o tipo de dados esperado na resposta
export type OpenOrderType = {
  id: string
  num_id: number
  order_id: string
  title: string
  classification: string
  location: string
  type_order: 'PREVENTIVA' | 'CORRETIVA' | 'MELHORIA'
  equipament: string
  creation: string
  start_prog: string
  end_prog: string
  responsible: string
  conditions: string
  priority: string
  status: 'ABERTA' | 'ANDAMENTO' | 'FECHADA'
  rel_service: relServiceType
}

// Define o tipo de erro
export type ErrorResponseType = {
  error: string
}
