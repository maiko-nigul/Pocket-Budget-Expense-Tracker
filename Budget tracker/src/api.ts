import { supabase } from './supabase'

export type Expense = {
  id: string
  description: string
  amount_euros: number
}

const API_URL = import.meta.env.VITE_API_URL

async function getToken() {
  const { data } = await supabase.auth.getSession()
  if (data.session) return data.session.access_token

  const { data: guest, error } = await supabase.auth.signInAnonymously()
  if (error || !guest.session) {
    throw new Error('Külalisena sisselogimine ei õnnestunud')
  }
  return guest.session.access_token
}

async function request(path: string, options: RequestInit = {}) {
  const token = await getToken()

  const response = await fetch(API_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })

  if (response.status === 204) return null

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(body?.error ?? 'Päring ebaõnnestus (' + response.status + ')')
  }
  return body
}

export function getExpenses(): Promise<Expense[]> {
  return request('/api/items')
}

export function addExpense(description: string, amount_euros: number): Promise<Expense> {
  return request('/api/items', {
    method: 'POST',
    body: JSON.stringify({ description, amount_euros }),
  })
}

export function deleteExpense(id: string): Promise<null> {
  return request('/api/items/' + id, { method: 'DELETE' })
}
