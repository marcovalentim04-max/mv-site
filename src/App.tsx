import { useState } from 'react'
import { Buildings, Phone, Envelope, Calculator as CalculatorIcon, FileText, Users, Shield, CaretDown, List, X, UploadSimple, Trash, Download, Eye, FolderOpen, Calendar, User, FilePdf, FileDoc, FileXls, FileImage } from '@phosphor-icons/react'
import { Calculator as CalcIcon, Scale, UsersRound, Building2, BriefcaseBusiness, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { toast, Toaster } from 'sonner'
import Formulario from "@/components/ui/formulario.tsx"
import {useEffect } from "react";
import OpenCompanyForm from "@/components/ui/formulario";
import { motion } from "framer-motion"; // animações
interface Service {
  id: string
  name: string
  description: string
  basePrice: number
  icon: React.ComponentType<any>
  features: string[]
}

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
  createdAt: string
}

interface ClientDocument {
  id: string
  name: string
  originalName: string
  type: string
  size: number
  category: 'contabil' | 'fiscal' | 'trabalhista' | 'juridico' | 'outros'
  uploadedAt: string
  uploadedBy: string
  description?: string
  tags: string[]
  isPublic: boolean
  url?: string
  content?: string
}

interface DocumentCategory {
  id: string
  name: string
  description: string
  acceptedTypes: string[]
  icon: React.ComponentType<any>
}

interface Plan {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  features: string[]
  highlight?: string
  maxRevenue: string
  popular?: boolean
}

interface Testimonial {
  id: string
  name: string
  profession: string
  company: string
  message: string
  avatar?: string
  since: string
}

const services: Service[] = [
  {
    id: 'contabilidade',
    name: 'Contabilidade Completa',
    description: 'Gestão contábil completa com relatórios mensais e certificado digital incluso',
    basePrice: 195,
    icon: CalcIcon,
    features: ['Balanços mensais', 'DRE', 'Relatórios fiscais', 'Certificado digital', 'Suporte especializado']
  },
  {
    id: 'juridico',
    name: 'Consultoria Jurídica',
    description: 'Assessoria jurídica empresarial completa com análise de contratos',
    basePrice: 299,
    icon: Scale,
    features: ['Análise de contratos', 'Consultoria trabalhista', 'Assessoria tributária', 'Defesa fiscal', 'Atendimento presencial']
  },
  {
    id: 'rh',
    name: 'Gestão de RH',
    description: 'Departamento pessoal completo com folha de pagamento e eSocial',
    basePrice: 149,
    icon: UsersRound,
    features: ['Folha de pagamento', 'Admissões e demissões', 'Férias e 13º', 'eSocial', 'Pró-labore']
  },
  {
    id: 'abertura',
    name: 'Abertura de Empresa GRÁTIS',
    description: 'Processo completo de abertura da sua empresa sem custo inicial',
    basePrice: 0,
    icon: Building2,
    features: ['Registro na Junta Comercial', 'CNPJ', 'Licenças municipais', 'Alvará de funcionamento', 'Primeira consulta gratuita']
  },
  {
    id: 'mei',
    name: 'Desenquadramento MEI',
    description: 'Transição gratuita do MEI para outros regimes tributários',
    basePrice: 0,
    icon: BriefcaseBusiness,
    features: ['Análise do perfil atual', 'Processo gratuito', 'Orientação completa', 'Suporte especializado']
  },
  {
    id: 'fiscal',
    name: 'Gestão Fiscal',
    description: 'Controle completo de impostos e obrigações fiscais',
    basePrice: 120,
    icon: BarChart3,
    features: ['Cálculo de impostos', 'Emissão de guias', 'Declarações obrigatórias', 'Otimização tributária']
  }
]

const documentCategories: DocumentCategory[] = [
  {
    id: 'contabil',
    name: 'Documentos Contábeis',
    description: 'Notas fiscais, recibos, extratos bancários',
    acceptedTypes: ['pdf', 'jpg', 'png', 'xlsx', 'xml'],
    icon: CalculatorIcon
  },
  {
    id: 'fiscal',
    name: 'Documentos Fiscais',
    description: 'Declarações, guias de impostos, certificados',
    acceptedTypes: ['pdf', 'xml', 'xlsx'],
    icon: FileText
  },
  {
    id: 'trabalhista',
    name: 'Documentos Trabalhistas',
    description: 'Contratos, folhas de ponto, exames médicos',
    acceptedTypes: ['pdf', 'jpg', 'png', 'docx'],
    icon: Users
  },
  {
    id: 'juridico',
    name: 'Documentos Jurídicos',
    description: 'Contratos, procurações, estatutos sociais',
    acceptedTypes: ['pdf', 'docx'],
    icon: Shield
  },
  {
    id: 'outros',
    name: 'Outros Documentos',
    description: 'Documentos diversos não categorizados',
    acceptedTypes: ['pdf', 'jpg', 'png', 'docx', 'xlsx'],
    icon: FolderOpen
  }
]

const plans: Plan[] = [
  {
    id: 'essencial',
    name: 'ESSENCIAL',
    price: 149,
    description: 'Ideal para MEI e pequenas empresas',
    maxRevenue: 'até R$ 30 mil',
    features: [
      'Contabilidade completa',
      'Abertura de empresa GRÁTIS',
      'Certificado digital incluso',
      'Atendimento via WhatsApp',
      'Emissão de notas fiscais',
      'Cálculo de impostos',
      'Pró-labore dos sócios',
      'Primeira consulta gratuita'
    ]
  },
  {
    id: 'profissional',
    name: 'PROFISSIONAL',
    price: 195,
    originalPrice: 250,
    description: 'Consultoria jurídica integrada',
    maxRevenue: 'até R$ 80 mil',
    popular: true,
    highlight: 'MELHOR CUSTO-BENEFÍCIO',
    features: [
      'Tudo do plano Essencial',
      'Consultoria jurídica inclusa',
      'Análise de contratos',
      'Atendimento presencial',
      'Folha de pagamento',
      'Assessoria trabalhista',
      'Otimização tributária',
      'Suporte estendido'
    ]
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: 299,
    originalPrice: 399,
    description: 'Assessor dedicado e atendimento VIP',
    maxRevenue: 'até R$ 200 mil',
    highlight: 'ATENDIMENTO VIP',
    features: [
      'Tudo do plano Profissional',
      'Assessor dedicado exclusivo',
      'Atendimento prioritário',
      'Consultoria estratégica mensal',
      'Relatórios personalizados',
      'Auditoria preventiva',
      'Planejamento tributário',
      'Suporte 24/7'
    ]
  }
]

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ana Silva',
    profession: 'Médica Dermatologista',
    company: 'Clínica Bella Pele',
    message: 'A MV Consultoria me ajudou desde a abertura da clínica até a gestão completa. O atendimento presencial faz toda a diferença.',
    since: '2022'
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    profession: 'Arquiteto',
    company: 'CM Arquitetura',
    message: 'Migrei de outro contador e foi a melhor decisão. Além da contabilidade, tenho apoio jurídico completo para meus contratos.',
    since: '2021'
  },
  {
    id: '3',
    name: 'Marina Santos',
    profession: 'Consultora de Marketing',
    company: 'MS Digital',
    message: 'O que mais me impressiona é a proatividade da equipe. Eles antecipam problemas e sempre trazem soluções inteligentes.',
    since: '2023'
  },
  {
    id: '4',
    name: 'Roberto Lima',
    profession: 'Empresário',
    company: 'Lima Tech Solutions',
    message: 'A abertura gratuita da empresa e a primeira consulta sem custo me convenceram. Hoje não troco a MV por nada.',
    since: '2020'
  },
  {
    id: '5',
    name: 'Juliana Costa',
    profession: 'Psicóloga',
    company: 'Espaço Mente Sã',
    message: 'Tenho um assessor dedicado que conhece meu negócio. É como ter um CFO pessoal cuidando de tudo.',
    since: '2022'
  },
  {
    id: '6',
    name: 'Fernando Oliveira',
    profession: 'Advogado',
    company: 'Oliveira & Associados',
    message: 'A integração entre contabilidade e jurídico é perfeita. Economizo tempo e dinheiro tendo tudo em um só lugar.',
    since: '2019'
  }
]
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-[#0a0f2b] to-[#1a2a4f] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo e nome da empresa */}
          <div className="flex items-center space-x-3">
            <img
              src="imgs/LogoMV.jpg"
              alt="Logo MV Consultoria"
              className="h-15 w-15 object-contain rounded-sm"
            />
            <span className="text-xl font-bold text-[#d4af37]">
              MV Consultoria
            </span>
          </div>

          {/* Navegação desktop */}
          <nav className="hidden md:flex items-center space-x-8 bg-gradient-to-r from-[#0a0f2b] to-[#1a2a4f] p-3 rounded-xl shadow-lg border border-[#d4af37]/30">
            <a
              href="#servicos"
              className="text-[#d4af37] hover:text-[#f1c85c] font-medium transition-colors"
            >
              Serviços
            </a>
            <a
              href="#planos"
              className="text-[#d4af37] hover:text-[#f1c85c] font-medium transition-colors"
            >
              Planos
            </a>
            <a
              href="#calculadora"
              className="text-[#d4af37] hover:text-[#f1c85c] font-medium transition-colors"
            >
              Calculadora
            </a>
            <a
              href="#sobre"
              className="text-[#d4af37] hover:text-[#f1c85c] font-medium transition-colors"
            >
              Sobre
            </a>
            <a
              href="#contato"
              className="text-[#d4af37] hover:text-[#f1c85c] font-medium transition-colors"
            >
              Contato
            </a>

            <ClientPortal />

            <Button
              onClick={() => window.open("https://wa.me/5517999796013")}
              className="bg-[#d4af37] hover:bg-[#f1c85c] text-[#0a0f2b] font-semibold rounded-full px-5 py-2 transition-colors"
            >
              Fale Conosco
            </Button>
          </nav>

          {/* Botão menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#d4af37] focus:outline-none"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0a0f2b] border-t border-[#d4af37]/30 mt-2 rounded-lg shadow-lg">
            <nav className="flex flex-col space-y-2 p-4">
              <a
                href="#servicos"
                className="text-[#d4af37] hover:text-[#f1c85c] font-medium transition-colors"
              >
                Serviços
              </a>
              <a
                href="#planos"
                className="text-[#d4af37] hover:text-[#f1c85c] font-medium transition-colors"
              >
                Planos
              </a>
              <a
                href="#calculadora"
                className="text-[#d4af37] hover:text-[#f1c85c] font-medium transition-colors"
              >
                Calculadora
              </a>
              <a
                href="#sobre"
                className="text-[#d4af37] hover:text-[#f1c85c] font-medium transition-colors"
              >
                Sobre
              </a>
              <a
                href="#contato"
                className="text-[#d4af37] hover:text-[#f1c85c] font-medium transition-colors"
              >
                Contato
              </a>
              <Button
                onClick={() => window.open("https://wa.me/5517999796013")}
                className="bg-[#d4af37] hover:bg-[#f1c85c] text-[#0a0f2b] font-semibold rounded-full px-5 py-2 transition-colors mt-2"
              >
                Fale Conosco
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}


const HighlightItem = ({ text, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="flex items-center gap-2 text-sm text-[#f5e9c9] bg-[#1a2a4f]/20 px-3 py-1 rounded-md shadow-sm"
  >
    <span className="text-[#f1c85c] font-semibold">✓</span>
    <span>{text}</span>
  </motion.div>
);

function Hero() {
  const [showForm, setShowForm] = useState(false);

  const highlights = [
    "Abertura GRÁTIS",
    "Atendimento Presencial",
    "Jurídico + Contábil",
    "Primeira Consulta Grátis",
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0f2b] to-[#1a2a4f] text-[#d4af37] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-6 text-center">

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold leading-snug"
        >
          Da abertura do CNPJ até a consultoria completa,  
          <span className="block text-[#f1c85c] mt-1">conte com a MV Consultoria</span>
        </motion.h1>

        {/* Descrição */}
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-base md:text-lg text-[#f5e9c9] leading-relaxed max-w-lg"
        >
          Escritório de consultoria empresarial com atendimento presencial e personalizado. <br />
          Abertura de empresa <strong>GRÁTIS</strong> + Consultoria jurídica integrada.
        </motion.p>

        {/* Destaques */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {highlights.map((item, idx) => (
            <HighlightItem key={idx} text={item} delay={0.2 + idx * 0.1} />
          ))}
        </div>

        {/* Botões */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 mt-6 justify-center w-full"
        >
          <Button
            
            className="bg-[#d4af37] hover:bg-[#f1c85c] text-[#0a0f2b] font-semibold px-6 py-3 rounded-full shadow-md transition-all transform hover:scale-105"
            onClick={() => setShowForm(true)}
          >
            Abrir Empresa Grátis
          </Button>

          <Button
            
            variant="outline"
            className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0f2b] px-6 py-3 rounded-full transition-all transform hover:scale-105"
            onClick={() => window.open('https://wa.me/5517999796013')}
          >
            Primeira Consulta Grátis
          </Button>
        </motion.div>

        {/* Imagem opcional */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-48 mt-4"
        >
         {/* <img
            src="/imgs/LogoMV.jpg"
            alt="Consultoria Empresarial"
            className="w-full rounded-lg shadow-lg"
          /> */}
        </motion.div>
      </div>

      {/* Modal do formulário */}
      {showForm && <OpenCompanyForm onClose={() => setShowForm(false)} />}
    </section>
  );
}
function PlansSection() {
  return (
    <section id="planos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Conheça nossos planos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Planos de acordo com o seu perfil empresarial. Abertura de empresa grátis em todos os planos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative hover:shadow-xl transition-shadow ${plan.popular ? 'border-accent border-2 scale-105' : ''}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground px-4 py-1 text-xs font-semibold">
                    {plan.highlight}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg font-bold text-foreground mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  {plan.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through mr-2">
                      R$ {plan.originalPrice}
                    </span>
                  )}
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-primary">R$ {plan.price}</span>
                    <span className="text-muted-foreground ml-1">/mês</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <p className="text-xs text-accent font-semibold mt-2">
                  Faturamento mensal ideal {plan.maxRevenue}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
                
                <div className="pt-6">
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-accent hover:bg-accent/90' : ''}`}
                    size="lg" onClick={() => window.open("https://wa.me/5517999796013") }
                  >
                    Contratar Plano
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            Precisa de algo personalizado? Temos soluções sob medida.
          </p>
          <Button variant="outline" size="lg" onClick={() => window.open("https://wa.me/5517999796013")}>
            Falar com Especialista
          </Button>
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section id="servicos" className="py-12 bg-secondary/50 min-h-screen flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Nossos Serviços
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Soluções completas para o crescimento da sua empresa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full">
              <CardHeader className="flex-shrink-0 pb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <service.icon className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-base font-bold leading-tight">{service.name}</CardTitle>
                <CardDescription className="text-xs line-clamp-2">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between pt-0 pb-3">
                <div className="space-y-1 mb-3">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-start text-xs text-muted-foreground">
                      <div className="w-1 h-1 bg-accent rounded-full mr-2 flex-shrink-0 mt-1.5" />
                      <span className="line-clamp-1">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-primary">
                    R$ {service.basePrice}
                    <span className="text-xs font-normal text-muted-foreground">/mês</span>
                  </span>
                  <Button size="sm" className="text-xs px-3 py-1 h-7" onClick={() => window.open("https://wa.me/5517999796013") }>Contratar</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Calculator() {
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  const [companySize, setCompanySize] = useState<string>('')
  const [calculationResult, setCalculationResult] = useState<any>(null)

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId)
      } else {
        newSet.add(serviceId)
      }
      return newSet
    })
  }

  const calculatePrice = () => {
    let total = 0
    let multiplier = 1

    switch (companySize) {
      case 'micro':
        multiplier = 0.8
        break
      case 'pequena':
        multiplier = 1.0
        break
      case 'media':
        multiplier = 1.5
        break
      case 'grande':
        multiplier = 2.0
        break
    }

    selectedServices.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId)
      if (service) {
        total += service.basePrice * multiplier
      }
    })

    setCalculationResult({
      total,
      services: Array.from(selectedServices),
      companySize,
      multiplier
    })

    toast.success('Cálculo realizado com sucesso!')
  }

  return (
    <section id="calculadora" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Calculadora de Preços
          </h2>
          <p className="text-lg text-muted-foreground">
            Descubra quanto custam nossos serviços para sua empresa
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-8">
            <div>
              <Label className="text-lg font-semibold mb-4 block">Selecione os serviços:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedServices.has(service.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <service.icon className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">R$ {service.basePrice}/mês</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-lg font-semibold mb-4 block">Porte da empresa:</Label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o porte da sua empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="micro">Microempresa (até 9 funcionários)</SelectItem>
                  <SelectItem value="pequena">Pequena empresa (10-49 funcionários)</SelectItem>
                  <SelectItem value="media">Média empresa (50-249 funcionários)</SelectItem>
                  <SelectItem value="grande">Grande empresa (250+ funcionários)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={calculatePrice} 
              className="w-full"
              disabled={selectedServices.size === 0 || !companySize}
            >
              Calcular Preço
            </Button>

            {calculationResult && (
              <Card className="bg-secondary/50 border-accent">
                <CardHeader>
                  <CardTitle className="text-center text-2xl text-primary">
                    Investimento Total
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-primary mb-4">
                    R$ {calculationResult.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

                    <span className="text-lg font-normal text-muted-foreground">/mês</span>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {calculationResult.services.length} serviço(s) selecionado(s)
                  </p>
                  <Button className="w-full">Solicitar Proposta</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </Card>
      </div>
    </section>
  )
}



function ContactForm() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newLead: Lead = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    }

    setLeads((prevLeads) => [newLead, ...prevLeads])
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      message: "",
    })

    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.")
  }

  return (
    <section id="contato" className="py-20 bg-secondary/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Entre em Contato
          </h2>
          <p className="text-lg text-muted-foreground">
            Fale conosco ou venha nos visitar pessoalmente!
          </p>
        </div>

        <Card className="p-8 shadow-xl">
          <CardHeader>
            <CardTitle>Localização e Contato</CardTitle>
            <CardDescription>
              Veja onde estamos e fale com a nossa equipe
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Maps */}
            <div className="aspect-video rounded-xl overflow-hidden shadow-md">
              <iframe
                title="Localização MV Consultoria"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d393.2740210202725!2d-48.311122583807496!3d-20.32202347865869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94bb0976e8213efb%3A0xb035d12c2cf01791!2sMv%20consultoria!5e0!3m2!1spt-BR!2sbr!4v1760459647835!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Informações de contato */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
              <div>
                <p><strong>Telefone Fixo:</strong> (17) 3332-0304</p>
                <p><strong>Celular:</strong> (17) 99979-6013</p>
                <p><strong>E-mail:</strong> contato@mvconsultoria.com.br</p>
              </div>
              <div>
                <p><strong>Endereço:</strong> Av 15 Entre Rua 10 e 8, 382</p>
                <p>Centro - Guaíra/SP</p>
                <p>CEP: 14790-000</p>
                <p><strong>Horário:</strong> Seg. a Sex. 8h às 18h</p>
              </div>
            </div>

            {/* Botão para abrir no Google Maps */}
            <Button
              asChild
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium"
            >
              <a
                href="https://www.google.com/maps/place/Av+15,+Gua%C3%ADra+-+SP,+14790-000/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver no Google Maps
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}


function StatsSection() {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">500+</div>
            <p className="text-sm text-blue-100">Empresas atendidas</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">15+</div>
            <p className="text-sm text-blue-100">Especialistas</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">5+</div>
            <p className="text-sm text-blue-100">Cidades atendidas</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">99%</div>
            <p className="text-sm text-blue-100">Clientes satisfeitos</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Abrir empresa grátis é com a MV Consultoria
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Processo 100% gratuito e descomplicado. Nossa equipe cuida de toda a burocracia para você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent-foreground">1</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Cadastro Online</h3>
            <p className="text-sm text-muted-foreground">
              Você realiza o cadastro no site e agenda sua primeira consulta gratuita.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent-foreground">2</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Análise Personalizada</h3>
            <p className="text-sm text-muted-foreground">
              Avaliamos seu modelo de negócio e definimos a melhor estrutura empresarial.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent-foreground">3</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Documentação</h3>
            <p className="text-sm text-muted-foreground">
              Preparamos toda a documentação e orientamos sobre taxas obrigatórias.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent-foreground">4</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">CNPJ Ativo!</h3>
            <p className="text-sm text-muted-foreground">
              Cuidamos do processo nos órgãos e avisamos quando você puder operar.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          
          <p className="text-sm text-muted-foreground mt-4">
            ✓ Processo 100% gratuito &nbsp;&nbsp;|&nbsp;&nbsp; ✓ Primeira consulta sem custo &nbsp;&nbsp;|&nbsp;&nbsp; ✓ Suporte completo
          </p>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Confira o que nossos clientes falam sobre nós
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Somos reconhecidos pela nossa especialização e atendimento personalizado em diversos segmentos.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
              <span className="font-semibold text-foreground">4.9</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">Avaliações reais de clientes</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.profession}</p>
                    <p className="text-xs text-accent">{testimonial.company}</p>
                    <p className="text-xs text-muted-foreground mb-3">Cliente desde {testimonial.since}</p>
                  </div>
                </div>
                
                <blockquote className="text-sm text-foreground leading-relaxed">
                  "{testimonial.message}"
                </blockquote>
                
                <div className="flex items-center space-x-1 mt-4">
                  <span className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Junte-se a mais de 500+ empresas que confiam na MV Consultoria
          </p>
       
          {showForm && (
            <div className="mt-8">
               <Formulario onClose={() => setShowForm(false)}/>
             </div>
)}

        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="sobre" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Sobre a MV Consultoria
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Com mais de 15 anos de experiência no mercado, a MV Consultoria é referência 
              em serviços empresariais, oferecendo soluções completas em contabilidade, 
              consultoria jurídica e gestão de recursos humanos.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Nossa missão é simplificar a gestão empresarial, permitindo que nossos 
              clientes foquem no crescimento de seus negócios enquanto cuidamos de 
              toda a parte burocrática e administrativa.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Empresas Atendidas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">15</div>
                <div className="text-sm text-muted-foreground">Anos de Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Especialistas</div>
              </div>
            </div>

            <Button size="lg">
              Conheça Nossa Equipe
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Segurança Total</h3>
              </div>
              <p className="text-muted-foreground">
                Proteção completa dos seus dados com certificações de segurança internacional.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Equipe Especializada</h3>
              </div>
              <p className="text-muted-foreground">
                Contadores, advogados e consultores com certificações e experiência comprovada.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Tecnologia Avançada</h3>
              </div>
              <p className="text-muted-foreground">
                Plataforma digital completa para gestão e acompanhamento em tempo real.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function DocumentUpload({ onUpload, category }: { onUpload: (doc: Omit<ClientDocument, 'id' | 'uploadedAt'>) => void, category?: DocumentCategory }) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(category?.id || '')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    
    for (const file of fileArray) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`Arquivo ${file.name} é muito grande (máximo 10MB)`)
        continue
      }

      const categoryData = documentCategories.find(c => c.id === selectedCategory)
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      
      if (categoryData && !categoryData.acceptedTypes.includes(fileExtension || '')) {
        toast.error(`Tipo de arquivo ${fileExtension} não aceito para a categoria ${categoryData.name}`)
        continue
      }

      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 20
        })
      }, 200)

      try {
        // In a real app, you'd upload to a server
        // For demo, we'll simulate with setTimeout and base64 conversion
        const content = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })

        setTimeout(() => {
          const newDoc: Omit<ClientDocument, 'id' | 'uploadedAt'> = {
            name: file.name,
            originalName: file.name,
            type: file.type,
            size: file.size,
            category: selectedCategory as ClientDocument['category'],
            uploadedBy: 'Cliente Atual',
            description: description || undefined,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            isPublic,
            content
          }

          setUploadProgress(100)
          onUpload(newDoc)
          toast.success(`${file.name} enviado com sucesso!`)
          
          setTimeout(() => {
            setIsUploading(false)
            setUploadProgress(0)
            setDescription('')
            setTags('')
          }, 1000)
        }, 1500)

      } catch (error) {
        toast.error(`Erro ao enviar ${file.name}`)
        setIsUploading(false)
        setUploadProgress(0)
      }

      clearInterval(progressInterval)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf': return FilePdf
      case 'doc':
      case 'docx': return FileDoc
      case 'xls':
      case 'xlsx': return FileXls
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return FileImage
      default: return FileText
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Categoria do Documento *</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className='mt-5'>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {documentCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center space-x-2">
                    <cat.icon className="w-4 h-4" />
                    <span>{cat.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
          <Input className='mt-2'
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="urgente, declaracao, 2024"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea className='mt-2'
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Adicione uma descrição para o documento..."
          rows={3}
        />
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <UploadSimple className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Enviando documento...</p>
              <Progress value={uploadProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{Math.round(uploadProgress)}%</p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UploadSimple className="w-6 h-6 text-primary" />
            </div>
            <p className="text-lg font-medium text-foreground mb-2">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Arquivos aceitos: PDF, Word, Excel, Imagens (máximo 10MB)
            </p>
            <input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              disabled={!selectedCategory || isUploading}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={!selectedCategory || isUploading}
            >
              Selecionar Arquivos
            </Button>
          </>
        )}
      </div>

      {selectedCategory && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Tipos aceitos para esta categoria:</h4>
          <div className="flex flex-wrap gap-2">
            {documentCategories.find(c => c.id === selectedCategory)?.acceptedTypes.map(type => (
              <Badge key={type} variant="outline" className="text-xs">
                .{type}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DocumentManager() {
  const [documents, setDocuments] = useState<ClientDocument[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const handleDocumentUpload = (docData: Omit<ClientDocument, 'id' | 'uploadedAt'>) => {
    const newDoc: ClientDocument = {
      ...docData,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString()
    }
    setDocuments((prev) => [newDoc, ...prev])
  }

  const handleDocumentDelete = (docId: string) => {
    setDocuments((prev) => prev.filter(doc => doc.id !== docId))
    toast.success('Documento removido com sucesso!')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf': return FilePdf
      case 'doc':
      case 'docx': return FileDoc
      case 'xls':
      case 'xlsx': return FileXls
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return FileImage
      default: return FileText
    }
  }

  const filteredDocuments = documents
    .filter(doc => selectedCategory === 'all' || doc.category === selectedCategory)
    .filter(doc => 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'size':
          return b.size - a.size
        case 'date':
        default:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      }
    })

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UploadSimple className="w-5 h-5" />
            <span>Enviar Documentos</span>
          </CardTitle>
          <CardDescription>
            Faça upload dos seus documentos para nossa equipe analisar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentUpload onUpload={handleDocumentUpload} />
        </CardContent>
      </Card>

      {/* Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FolderOpen className="w-5 h-5" />
              <span>Meus Documentos ({documents.length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                Lista
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grade
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Pesquisar</Label>
              <Input className="mt-1 w-full min-w-[100px]" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar documentos..."
              />
            </div>
            <div  className='ml-1'>
              <Label>Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-1 w-full min-w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {documentCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label  className='ml-15'>Ordenar</Label>
              <Select value={sortBy} onValueChange={(value: 'name' | 'date' | 'size') => setSortBy(value)}>
                <SelectTrigger className="mt-1 w-full min-w-[100px] ml-15">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Data de upload</SelectItem>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="size">Tamanho</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Documents List */}
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {documents.length === 0 ? 'Nenhum documento enviado ainda' : 'Nenhum documento encontrado'}
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
              {filteredDocuments.map((doc) => {
                const FileIcon = getFileIcon(doc.name)
                const categoryData = documentCategories.find(c => c.id === doc.category)
                
                if (viewMode === 'grid') {
                  return (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                            <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {categoryData?.name}
                              </Badge>
                            </div>
                            {doc.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {doc.tags.slice(0, 2).map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {doc.tags.length > 2 && (
                                  <span className="text-xs text-muted-foreground">+{doc.tags.length - 2}</span>
                                )}
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-muted-foreground">
                                {new Date(doc.uploadedAt).toLocaleDateString()}
                              </span>
                              <div className="flex space-x-1">
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Download className="w-3 h-3" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive">
                                      <Trash className="w-3 h-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir "{doc.name}"? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDocumentDelete(doc.id)}>
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                }

                return (
                  <Card key={doc.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">{doc.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Download className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="ghost" className="text-destructive">
                                    <Trash className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir "{doc.name}"? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDocumentDelete(doc.id)}>
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                            <span>{formatFileSize(doc.size)}</span>
                            <Badge variant="outline" className="text-xs">
                              {categoryData?.name}
                            </Badge>
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{doc.uploadedBy}</span>
                            </span>
                          </div>
                          {doc.description && (
                            <p className="text-sm text-muted-foreground mt-1 truncate">{doc.description}</p>
                          )}
                          {doc.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {doc.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ClientPortal() {
  const [leads] = useState<Lead[]>([])
  const [documents] = useState<ClientDocument[]>([])

  const cardBase =
    "group relative w-[150px] h-[200px] hover:w-[250px] hover:h-[300px] transition-all duration-300 ease-in-out flex flex-col justify-between items-start p-4 rounded-2xl shadow-sm hover:shadow-lg bg-card hover:bg-accent/10"

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Área do Cliente</Button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Portal do Cliente</DialogTitle>
          <DialogDescription>
            Gerencie seus documentos e acompanhe o progresso dos seus serviços
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
          </TabsList>

          {/* --- DASHBOARD --- */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex flex-wrap justify-center gap-6">
              {/* Documentos Enviados */}
              <Card className={cardBase}>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h4 className="text-sm font-semibold">Documentos Enviados</h4>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {documents.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total de arquivos enviados
                  </p>
                </div>

                <Button variant="outline" size="sm" className="absolute bottom-4 left-4 group-hover:scale-110 transition">
                  <Eye className="w-4 h-4 mr-1" /> Ver Detalhes
                </Button>
              </Card>

              {/* Leads */}
              <Card className={cardBase}>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-accent" />
                    <h4 className="text-sm font-semibold">Leads Recebidos</h4>
                  </div>
                  <div className="text-3xl font-bold text-accent">{leads.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Contatos cadastrados
                  </p>
                </div>

                <Button variant="outline" size="sm" className="absolute bottom-4 left-4 group-hover:scale-110 transition">
                  <Eye className="w-4 h-4 mr-1" /> Ver Leads
                </Button>
              </Card>

              {/* Última Atualização */}
              <Card className={cardBase}>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h4 className="text-sm font-semibold">Última Atualização</h4>
                  </div>
                  <div className="text-2xl font-bold">
                    {documents.length > 0
                      ? new Date(Math.max(...documents.map(d => new Date(d.uploadedAt).getTime()))).toLocaleDateString()
                      : "Nenhum"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Documento mais recente
                  </p>
                </div>

                <Button variant="outline" size="sm" className="absolute bottom-4 left-4 group-hover:scale-110 transition">
                  <Calendar className="w-4 h-4 mr-1" /> Atualizar
                </Button>
              </Card>

              {/* Status */}
              <Card className={cardBase}>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h4 className="text-sm font-semibold">Status da Conta</h4>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">Em dia</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Conta regularizada
                  </p>
                </div>

                <Button variant="outline" size="sm" className="absolute bottom-4 left-4 group-hover:scale-110 transition">
                  <Eye className="w-4 h-4 mr-1" /> Ver Status
                </Button>
              </Card>
            </div>

            {/* --- Seção inferior --- */}
            <div className="flex flex-wrap justify-center gap-6">
              {/* Documentos por Categoria */}
              <Card className="group relative w-[165px] h-[250px] hover:w-[250px] hover:h-[300px] transition-all duration-300 ease-in-out flex flex-col justify-between items-start p-4 rounded-2xl shadow-md">
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>Documentos por Categoria</span>
                  </h4>
                  <div className="space-y-2 overflow-y-auto max-h-[140px] pr-1">
                    {documentCategories.map(category => {
                      const count = documents.filter(doc => doc.category === category.id).length
                      return (
                        <div
                          key={category.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>{category.name}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="absolute bottom-4 left-4 group-hover:scale-110 transition">
                  <Eye className="w-4 h-4 mr-1" /> Ver Categorias
                </Button>
              </Card>

              {/* Atividade Recente */}
              <Card className={cardBase}>
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center space-x-2">
                    <UploadSimple className="w-5 h-5 text-primary" />
                    <span>Atividade Recente</span>
                  </h4>
                  <div className="space-y-2 overflow-y-auto max-h-[140px] pr-1">
                    {documents.slice(0, 4).map(doc => (
                      <div key={doc.id} className="text-xs text-muted-foreground truncate">
                        <span className="font-medium text-foreground">{doc.name}</span> —{" "}
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </div>
                    ))}
                    {documents.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center">
                        Nenhuma atividade recente
                      </p>
                    )}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="absolute bottom-4 left-4 group-hover:scale-110 transition">
                  <Eye className="w-4 h-4 mr-1" /> Ver Atividade
                </Button>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="documents">
            <DocumentManager />
          </TabsContent>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload de Documentos</CardTitle>
                <CardDescription>
                  Envie seus documentos de forma rápida e segura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentUpload onUpload={(docData) => {
                  const newDoc: ClientDocument = {
                    ...docData,
                    id: Date.now().toString(),
                    uploadedAt: new Date().toISOString()
                  }
                  // This would normally be handled by DocumentManager, but for standalone upload:
                  // setDocuments((prev) => [newDoc, ...prev])
                }} />
              </CardContent>
            </Card>
          </TabsContent>
          
<TabsContent value="reports" className="space-y-6">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <h3 className="text-lg font-semibold text-center sm:text-left">Relatórios Financeiros</h3>
    <Button className="w-full sm:w-auto justify-center">
      <Download className="w-4 h-4 mr-2" />
      Baixar Todos
    </Button>
  </div>

  {/* --- GRID DE RELATÓRIOS --- */}
  <div className="flex flex-wrap justify-center gap-6">
    {[
      { name: 'Balanço Dezembro 2024', type: 'PDF', size: '245 KB', date: '15/12/2024' },
      { name: 'DRE Novembro 2024', type: 'Excel', size: '186 KB', date: '30/11/2024' },
      { name: 'Relatório Fiscal', type: 'PDF', size: '532 KB', date: '25/11/2024' },
      { name: 'Demonstrativo de Impostos', type: 'PDF', size: '298 KB', date: '20/11/2024' },
      { name: 'Balancete Outubro', type: 'Excel', size: '145 KB', date: '31/10/2024' },
      { name: 'Relatório de Folha', type: 'PDF', size: '367 KB', date: '28/10/2024' }
    ].map((report, index) => (
      <Card
        key={index}
        className="group relative w-[150px] h-[265px] hover:w-[250px] hover:h-[250px] transition-all duration-300 ease-in-out flex flex-col justify-between items-start p-4 rounded-2xl shadow-md hover:shadow-lg bg-white"
      >
        {/* --- CABEÇALHO --- */}
        <div className="flex items-start w-full gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            {report.type === 'PDF' ? (
              <FilePdf className="w-5 h-5 text-red-600" />
            ) : (
              <FileXls className="w-5 h-5 text-green-600" />
            )}
          </div>

          {/* --- TEXTO COM QUEBRA DE LINHA --- */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm sm:text-base break-words whitespace-normal leading-tight">
              {report.name}
            </h4>
            <p className="text-xs text-muted-foreground break-words whitespace-normal leading-snug">
              {report.size} • {report.date}
            </p>
          </div>
        </div>

        {/* --- BOTÕES --- */}
        <div className="flex flex-col items-start gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            className="text-xs flex items-center justify-start w-[120px]"
          >
            <Eye className="w-3 h-3 mr-1" /> Ver
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs flex items-center justify-start w-[120px]"
          >
            <Download className="w-3 h-3 mr-1" /> Download
          </Button>
        </div>
      </Card>
    ))}
  </div>
</TabsContent>

          
          <TabsContent value="leads">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Leads Recebidos ({leads.length})</h3>
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {leads.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum lead recebido ainda</p>
                  </div>
                ) : (
                  leads.map((lead) => (
                    <Card key={lead.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">{lead.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {services.find(s => s.id === lead.service)?.name || 'Não especificado'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <p className="flex items-center space-x-1">
                              <Envelope className="w-3 h-3" />
                              <span>{lead.email}</span>
                            </p>
                            <p className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{lead.phone}</span>
                            </p>
                            {lead.company && (
                              <p className="flex items-center space-x-1">
                                <Buildings className="w-3 h-3" />
                                <span>{lead.company}</span>
                              </p>
                            )}
                            <p className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                            </p>
                          </div>
                          {lead.message && (
                            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm">"{lead.message}"</p>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button size="sm" variant="outline">
                            Responder
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Buildings className="h-6 w-6" weight="bold" />
              <span className="text-lg font-bold">MV Consultoria</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Consultoria empresarial completa para impulsionar seu negócio.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Contabilidade</li>
              <li>Consultoria Jurídica</li>
              <li>Gestão de RH</li>
              <li>Abertura de Empresa</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Sobre Nós</li>
              <li>Nossa Equipe</li>
              <li>Carreiras</li>
              <li>Blog</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>(11) 99999-9999</li>
              <li>contato@mvconsultoria.com.br</li>
              <li>São Paulo - SP</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />
        
        <div className="text-center text-sm text-primary-foreground/80">
          <p>&copy; 2024 MV Consultoria. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

function App() {
  // Função auxiliar para abrir WhatsApp com tratamento de erro
  const openWhatsApp = () => {
    try {
      const whatsappNumber = "5517999796013";
      const whatsappUrl = `https://wa.me/${whatsappNumber}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Erro ao abrir WhatsApp:', error);
      toast.error('Erro ao abrir WhatsApp. Por favor, tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ServicesSection />
      <ProcessSection />
      <PlansSection />
      <StatsSection />
      <Calculator />
      <TestimonialsSection />
      <About />
      <ContactForm />
      <Toaster position="top-right" />
      
      <footer className="bg-primary text-primary-foreground py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Buildings className="h-6 w-6" weight="bold" />
                <span className="text-lg font-bold">MV Consultoria</span>
              </div>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Consultoria empresarial completa com atendimento presencial e personalizado.
              </p>
              <div className="flex space-x-4">
                <span className="text-primary-foreground/60">Siga-nos:</span>
                <div className="flex space-x-2">
                  <span className="w-8 h-8 bg-primary-foreground/10 rounded-full flex items-center justify-center">f</span>
                  <span className="w-8 h-8 bg-primary-foreground/10 rounded-full flex items-center justify-center">in</span>
                  <span className="w-8 h-8 bg-primary-foreground/10 rounded-full flex items-center justify-center">ig</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Serviços</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>Abertura de Empresa Grátis</li>
                <li>Contabilidade Completa</li>
                <li>Consultoria Jurídica</li>
                <li>Gestão de RH</li>
                <li>Desenquadramento MEI</li>
                <li>Gestão Fiscal</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>Sobre Nós</li>
                <li>Nossa Equipe</li>
                <li>Depoimentos</li>
                <li>Blog</li>
                <li>Carreira</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>(11) 99999-9999</li>
                <li>contato@mvconsultoria.com.br</li>
                <li>São Paulo - SP</li>
                <li>Atendimento presencial</li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-primary-foreground/20" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/60">
            <p>© 2025 MV Consultoria. Todos os direitos reservados.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span>Política de Privacidade</span>
              <span>Termos de Uso</span>
              <span>Cookies</span>
            </div>
          </div>
        </div>
      </footer>
      <Toaster richColors />
    </div>
  )
}

export default App