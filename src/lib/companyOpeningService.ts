import { supabase } from './supabaseClient'

// Tipos TypeScript para o formulário
export interface CompanyOpeningFormData {
  // Informações Pessoais
  full_name: string
  cpf: string
  rg?: string
  birth_date?: string
  phone: string
  email: string
  
  // Endereço
  cep?: string
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  
  // Informações da Empresa
  company_name: string
  business_type?: string
  business_activity?: string
  cnae?: string
  estimated_revenue?: number
  
  // Informações Adicionais
  has_partners?: boolean
  partners_count?: number
  additional_notes?: string
  
  // Preferências de Contato
  preferred_contact_method?: 'whatsapp' | 'email' | 'phone'
  preferred_contact_time?: string
  
  // Origem
  source?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export interface CompanyOpening extends CompanyOpeningFormData {
  id: string
  status: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  assigned_to?: string
  created_at: string
  updated_at: string
  contacted_at?: string
  completed_at?: string
}

export interface CompanyOpeningInteraction {
  id: string
  company_opening_id: string
  interaction_type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'note'
  description: string
  outcome?: string
  created_by?: string
  created_at: string
}

// Serviço para gerenciar aberturas de empresa
export class CompanyOpeningService {
  
  // Criar nova solicitação de abertura de empresa
  static async create(data: CompanyOpeningFormData): Promise<{ success: boolean; data?: CompanyOpening; error?: string }> {
    try {
      const { data: result, error } = await supabase
        .from('company_openings')
        .insert([{
          ...data,
          status: 'pending',
          priority: 'normal',
          source: data.source || 'website'
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar abertura de empresa:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: result }
    } catch (error) {
      console.error('Erro inesperado:', error)
      return { success: false, error: 'Erro ao processar solicitação' }
    }
  }

  // Buscar todas as solicitações
  static async getAll(filters?: {
    status?: string
    limit?: number
    offset?: number
  }): Promise<{ success: boolean; data?: CompanyOpening[]; error?: string }> {
    try {
      let query = supabase
        .from('company_openings')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) {
        console.error('Erro ao buscar aberturas:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Erro inesperado:', error)
      return { success: false, error: 'Erro ao buscar dados' }
    }
  }

  // Buscar por ID
  static async getById(id: string): Promise<{ success: boolean; data?: CompanyOpening; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('company_openings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erro ao buscar abertura:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro inesperado:', error)
      return { success: false, error: 'Erro ao buscar dados' }
    }
  }

  // Atualizar status
  static async updateStatus(
    id: string, 
    status: CompanyOpening['status'],
    assignedTo?: string
  ): Promise<{ success: boolean; data?: CompanyOpening; error?: string }> {
    try {
      const updateData: any = { status }
      
      if (status === 'contacted' && !assignedTo) {
        updateData.contacted_at = new Date().toISOString()
      }
      
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }

      if (assignedTo) {
        updateData.assigned_to = assignedTo
      }

      const { data, error } = await supabase
        .from('company_openings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar status:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro inesperado:', error)
      return { success: false, error: 'Erro ao atualizar status' }
    }
  }

  // Adicionar interação
  static async addInteraction(
    companyOpeningId: string,
    interaction: {
      interaction_type: CompanyOpeningInteraction['interaction_type']
      description: string
      outcome?: string
      created_by?: string
    }
  ): Promise<{ success: boolean; data?: CompanyOpeningInteraction; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('company_opening_interactions')
        .insert([{
          company_opening_id: companyOpeningId,
          ...interaction
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao adicionar interação:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro inesperado:', error)
      return { success: false, error: 'Erro ao adicionar interação' }
    }
  }

  // Buscar interações de uma abertura
  static async getInteractions(companyOpeningId: string): Promise<{ 
    success: boolean
    data?: CompanyOpeningInteraction[]
    error?: string 
  }> {
    try {
      const { data, error } = await supabase
        .from('company_opening_interactions')
        .select('*')
        .eq('company_opening_id', companyOpeningId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar interações:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Erro inesperado:', error)
      return { success: false, error: 'Erro ao buscar interações' }
    }
  }

  // Buscar estatísticas
  static async getStats(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('company_openings_stats')
        .select('*')
        .single()

      if (error) {
        console.error('Erro ao buscar estatísticas:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro inesperado:', error)
      return { success: false, error: 'Erro ao buscar estatísticas' }
    }
  }

  // Buscar por email ou CPF (para verificar duplicatas)
  static async findByEmailOrCPF(email: string, cpf: string): Promise<{ 
    success: boolean
    exists: boolean
    data?: CompanyOpening
    error?: string 
  }> {
    try {
      const { data, error } = await supabase
        .from('company_openings')
        .select('*')
        .or(`email.eq.${email},cpf.eq.${cpf}`)
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Erro ao buscar:', error)
        return { success: false, exists: false, error: error.message }
      }

      return { 
        success: true, 
        exists: !!data,
        data: data || undefined
      }
    } catch (error) {
      console.error('Erro inesperado:', error)
      return { success: false, exists: false, error: 'Erro ao verificar dados' }
    }
  }
}

// Validação de CPF
export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '')
  
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  if (digit !== parseInt(cpf.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  if (digit !== parseInt(cpf.charAt(10))) return false

  return true
}

// Formatar CPF
export function formatCPF(cpf: string): string {
  cpf = cpf.replace(/[^\d]/g, '')
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// Formatar telefone
export function formatPhone(phone: string): string {
  phone = phone.replace(/[^\d]/g, '')
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
}

// Validar email
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
