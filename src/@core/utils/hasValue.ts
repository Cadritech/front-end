import { OpenOrderType } from 'src/types/api/openOrders'

export const hasValue = (array: Array<OpenOrderType>, value: any) => {
  if (Array.isArray(array)) {
    if (String(value).trim() !== '') {
      return value
    } else {
      return 'NÃO INFORMADO'
    }
  }
}
