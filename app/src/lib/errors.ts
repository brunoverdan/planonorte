export function apiErrorMessage(err: unknown, fallback: string): string {
  const ax = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
  const data = ax?.response?.data
  const errors = data?.errors

  if (errors && typeof errors === 'object') {
    const msgs: string[] = []
    for (const [field, list] of Object.entries(errors)) {
      for (const raw of list ?? []) msgs.push(translate(field, raw))
    }
    if (msgs.length) return msgs.join(' ')
  }

  if (data?.message && !data.message.startsWith('validation.')) return data.message
  return fallback
}

function translate(field: string, raw: string): string {
  const labels: Record<string, string> = { name: 'nome', email: 'e-mail', password: 'senha' }
  const f = labels[field] || field

  switch (raw) {
    case 'validation.required':
      return `Informe o campo ${f}.`
    case 'validation.email':
      return 'Informe um e-mail válido.'
    case 'validation.unique':
      return 'Este e-mail já está cadastrado. Tente entrar com sua senha ou use outro e-mail.'
    case 'validation.confirmed':
      return 'A confirmação de senha não confere.'
    case 'validation.min.string':
      return 'A senha precisa ter no mínimo 8 caracteres.'
    case 'validation.password.mixed':
      return 'A senha precisa conter letras e números.'
    case 'validation.password.letters':
      return 'A senha precisa conter pelo menos uma letra.'
    case 'validation.password.numbers':
      return 'A senha precisa conter pelo menos um número.'
    case 'validation.password.symbols':
      return 'A senha precisa conter pelo menos um símbolo.'
    case 'validation.password.uncompromised':
      return 'Esta senha apareceu em vazamentos conhecidos. Escolha outra.'
    case 'validation.custom.password.required':
      return 'Informe a senha.'
    case 'validation.max.string':
      return `O campo ${f} é longo demais.`
    default:
      return raw.startsWith('validation.') ? `Verifique o campo ${f}.` : raw
  }
}
