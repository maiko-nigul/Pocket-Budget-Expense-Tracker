import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { addExpense, deleteExpense, getExpenses } from './api'
import type { Expense } from './api'

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const total = expenses.reduce((sum, e) => sum + e.amount_euros, 0)

  useEffect(() => {
    getExpenses()
      .then(setExpenses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleAdd() {
    const text = description.trim()
    const amountNumber = Number(amount)

    if (text.length < 1 || text.length > 80) {
      setError('Toode peab olema 1–80 märki')
      return
    }
    if (
      amount.trim() === '' ||
      !Number.isInteger(amountNumber) ||
      amountNumber < 1 ||
      amountNumber > 1000
    ) {
      setError('Hind peab olema täisarv 1–1000')
      return
    }

    setError('')
    setSaving(true)
    try {
      const created = await addExpense(text, amountNumber)
      setExpenses([...expenses, created])
      setDescription('')
      setAmount('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lisamine ebaõnnestus')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setError('')
    try {
      await deleteExpense(id)
      setExpenses(expenses.filter((e) => e.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kustutamine ebaõnnestus')
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h1" align="center">
        Budget Tracker
      </Typography>
      <Typography variant="h2" align="center" sx={{ mb: 4 }}>
        Maiko Nigul, Glen Paas, Mirko Aadva
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Items"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              slotProps={{ htmlInput: { maxLength: 80 } }}
            />
            <TextField
              label="Price (€)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              slotProps={{ htmlInput: { min: 1, max: 1000, step: 1 } }}
            />
            <Button variant="contained" onClick={handleAdd} disabled={saving}>
              {saving ? 'Lisan...' : 'Lisa'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : expenses.length === 0 ? (
            <Typography align="center">Kulusid pole veel</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Items</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell align="right">{expense.amount_euros} €</TableCell>
                    <TableCell align="right">
                      <Button color="error" onClick={() => handleDelete(expense.id)}>
                        Kustuta
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Typography variant="h6" align="right" sx={{ mt: 2 }}>
            Kokku: {total} €
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}

export default App
