-- ====================================
-- SCHEMA SQL PARA FORMULÁRIO "ABRIR EMPRESA GRÁTIS"
-- ====================================

-- Tabela para armazenar os leads de abertura de empresa
CREATE TABLE IF NOT EXISTS company_openings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Informações Pessoais
    full_name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    rg VARCHAR(20),
    birth_date DATE,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    
    -- Endereço
    cep VARCHAR(10),
    street VARCHAR(255),
    number VARCHAR(10),
    complement VARCHAR(100),
    neighborhood VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(2),
    
    -- Informações da Empresa
    company_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100), -- MEI, ME, EIRELI, LTDA, etc.
    business_activity TEXT, -- Descrição da atividade
    cnae VARCHAR(20), -- Código CNAE
    estimated_revenue DECIMAL(15, 2),
    
    -- Informações Adicionais
    has_partners BOOLEAN DEFAULT false,
    partners_count INTEGER DEFAULT 0,
    additional_notes TEXT,
    
    -- Preferências de Contato
    preferred_contact_method VARCHAR(50) DEFAULT 'whatsapp', -- whatsapp, email, phone
    preferred_contact_time VARCHAR(50), -- manha, tarde, noite
    
    -- Status e Controle
    status VARCHAR(50) DEFAULT 'pending', -- pending, contacted, in_progress, completed, cancelled
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    assigned_to VARCHAR(255), -- Responsável pelo atendimento
    
    -- Origem e Rastreamento
    source VARCHAR(100) DEFAULT 'website', -- website, facebook, google, indicacao
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    contacted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Índices para melhor performance
    CONSTRAINT unique_cpf UNIQUE(cpf),
    CONSTRAINT unique_email UNIQUE(email)
);

-- Índices para buscas rápidas
CREATE INDEX idx_company_openings_status ON company_openings(status);
CREATE INDEX idx_company_openings_created_at ON company_openings(created_at DESC);
CREATE INDEX idx_company_openings_email ON company_openings(email);
CREATE INDEX idx_company_openings_phone ON company_openings(phone);

-- Tabela para histórico de interações
CREATE TABLE IF NOT EXISTS company_opening_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_opening_id UUID NOT NULL REFERENCES company_openings(id) ON DELETE CASCADE,
    
    interaction_type VARCHAR(50) NOT NULL, -- call, email, whatsapp, meeting, note
    description TEXT NOT NULL,
    outcome VARCHAR(100), -- successful, no_answer, callback_requested, etc.
    
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_interactions_company_id ON company_opening_interactions(company_opening_id);

-- Tabela para documentos enviados
CREATE TABLE IF NOT EXISTS company_opening_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_opening_id UUID NOT NULL REFERENCES company_openings(id) ON DELETE CASCADE,
    
    document_type VARCHAR(100) NOT NULL, -- cpf, rg, comprovante_residencia, etc.
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_documents_company_id ON company_opening_documents(company_opening_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_company_openings_updated_at
    BEFORE UPDATE ON company_openings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- POLÍTICAS RLS (Row Level Security)
-- ====================================

-- Habilitar RLS
ALTER TABLE company_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_opening_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_opening_documents ENABLE ROW LEVEL SECURITY;

-- Política para permitir INSERT público (formulário web)
CREATE POLICY "Allow public insert" ON company_openings
    FOR INSERT
    WITH CHECK (true);

-- Política para leitura (apenas autenticados)
CREATE POLICY "Allow authenticated read" ON company_openings
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Política para atualização (apenas autenticados)
CREATE POLICY "Allow authenticated update" ON company_openings
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Políticas para interactions
CREATE POLICY "Allow authenticated all" ON company_opening_interactions
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Políticas para documents
CREATE POLICY "Allow public insert documents" ON company_opening_documents
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated read documents" ON company_opening_documents
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- ====================================
-- VIEWS ÚTEIS
-- ====================================

-- View com estatísticas de leads
CREATE OR REPLACE VIEW company_openings_stats AS
SELECT 
    COUNT(*) as total_leads,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
    COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted,
    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as last_7_days,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as last_30_days
FROM company_openings;

-- View com leads recentes
CREATE OR REPLACE VIEW recent_company_openings AS
SELECT 
    id,
    full_name,
    email,
    phone,
    company_name,
    business_type,
    status,
    priority,
    created_at
FROM company_openings
ORDER BY created_at DESC
LIMIT 50;

-- ====================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ====================================

-- INSERT INTO company_openings (
--     full_name,
--     cpf,
--     phone,
--     email,
--     company_name,
--     business_type,
--     business_activity
-- ) VALUES (
--     'João Silva',
--     '123.456.789-00',
--     '(17) 99999-9999',
--     'joao@exemplo.com',
--     'Silva Comércio LTDA',
--     'LTDA',
--     'Comércio de produtos alimentícios'
-- );

-- ====================================
-- QUERIES ÚTEIS
-- ====================================

-- Buscar leads pendentes
-- SELECT * FROM company_openings WHERE status = 'pending' ORDER BY created_at DESC;

-- Buscar por nome ou email
-- SELECT * FROM company_openings WHERE full_name ILIKE '%Silva%' OR email ILIKE '%silva%';

-- Estatísticas do dia
-- SELECT COUNT(*) as leads_hoje FROM company_openings WHERE created_at::date = CURRENT_DATE;

-- Leads por tipo de negócio
-- SELECT business_type, COUNT(*) as total FROM company_openings GROUP BY business_type ORDER BY total DESC;
