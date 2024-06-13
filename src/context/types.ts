export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  matricula: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: number
  role: string
  matricula: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
