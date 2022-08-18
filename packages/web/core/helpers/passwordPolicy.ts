type Options = {
  minimumLength: number
  includeNumber?: boolean
  includeSymbol?: boolean
  includeCapital?: boolean
}

export const passwordPolicy = (
  password: string,
  confirmation: string,
  options: Options = {
    minimumLength: 8
  }
) => {
  switch( true ) {
    case password.length < options.minimumLength:
      return `Senha deve ter no mínimo ${options.minimumLength} dígitos`

    case options.includeNumber && !/[0-9]/.test(password): return 'Senha deve conter pelo menos um número'
    case options.includeSymbol && !/[^\w]/.test(password): return 'Senha deve conter pelo menos um símbolo'
    case options.includeCapital && !/[A-Z]/.test(password): return 'Senha deve conter pelo menos uma letra maiúscula'

    case password !== confirmation:
      return 'Confirmação não procede'
  }
}
