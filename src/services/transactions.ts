import { apiGet, apiPost, apiPutFormData } from './api'

export interface Transaction {
  id: number
  userId: number
  totalAmount: number
  paymentMethod?: string | null
  paymentProof?: string | null
  status: 'pending' | 'verified' | 'rejected'
  adminNotes?: string | null
  createdAt: string
  verifiedAt?: string | null
  verifiedBy?: number | null
  recipeCount?: number
  recipes?: Array<{
    recipeId: number
    title: string
    videoThumbnail?: string | null
    price: number
  }>
}

export interface CreateTransactionResponse {
  success: boolean
  message: string
  data: Transaction
}

export interface GetTransactionsResponse {
  success: boolean
  data: Transaction[]
}

export interface GetTransactionResponse {
  success: boolean
  data: Transaction
}

export interface SubmitPaymentResponse {
  success: boolean
  message: string
  data: Transaction
}

export async function createTransaction(): Promise<CreateTransactionResponse> {
  const response = await apiPost<CreateTransactionResponse>('/transactions', undefined, true)
  return response
}

export async function getTransactions(status?: 'pending' | 'verified' | 'rejected'): Promise<Transaction[]> {
  const path = status ? `/transactions?status=${status}` : '/transactions'
  const response = await apiGet<GetTransactionsResponse>(path, true)
  return response.data
}

export async function getTransaction(id: number): Promise<Transaction> {
  const response = await apiGet<GetTransactionResponse>(`/transactions/${id}`, true)
  return response.data
}

export async function submitPayment(
  transactionId: number,
  paymentMethod: string,
  paymentProofFile: File
): Promise<SubmitPaymentResponse> {
  const formData = new FormData()
  formData.append('paymentMethod', paymentMethod)
  formData.append('paymentProof', paymentProofFile)

  const response = await apiPutFormData<SubmitPaymentResponse>(
    `/transactions/${transactionId}/payment`,
    formData,
    true
  )
  return response
}

