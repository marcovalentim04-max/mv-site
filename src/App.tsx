import { useState } from 'react'
import { Building2, Phone, Mail, Calculator, FileText, Users, Shield, ChevronDown, Menu, X, UploadSimple, Trash, Download, Eye, FolderOpen, CalendarBlank, User, FilePdf, FileDoc, FileXls, FileImage } from '@phosphor-icons/react'
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
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

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
  url?: string // In a real app, this would be the file URL
  content?: string // For demo purposes, storing base64 or text content
}

interface DocumentCategory {
  id: string
  name: string
  description: string
  acceptedTypes: string[]
  icon: React.ComponentType<any>
}

const services: Service[] = [
  {
    id: 'contabilidade',
    name: 'Contabilidade Completa',
    description: 'Gestão contábil completa para sua empresa com relatórios mensais',
    basePrice: 299,
    icon: Calculator,
    features: ['Balanços mensais', 'DRE', 'Relatórios fiscais', 'Suporte especializado']
  },
  {
    id: 'juridico',
    name: 'Consultoria Jurídica',
    description: 'Assessoria jurídica empresarial e consultoria em contratos',
    basePrice: 499,
    icon: Shield,
    features: ['Análise de contratos', 'Consultoria trabalhista', 'Assessoria tributária', 'Defesa fiscal']
  },
  {
    id: 'rh',
    name: 'Gestão de RH',
    description: 'Terceirização completa do departamento pessoal',
    basePrice: 199,
    icon: Users,
    features: ['Folha de pagamento', 'Admissões e demissões', 'Férias e 13º', 'eSocial']
  },
  {
    id: 'abertura',
    name: 'Abertura de Empresa',
    description: 'Processo completo de abertura da sua empresa',
    basePrice: 599,
    icon: Building2,
    features: ['Registro na Junta Comercial', 'CNPJ', 'Licenças municipais', 'Alvará de funcionamento']
  }
]

const documentCategories: DocumentCategory[] = [
  {
    id: 'contabil',
    name: 'Documentos Contábeis',
    description: 'Notas fiscais, recibos, extratos bancários',
    acceptedTypes: ['pdf', 'jpg', 'png', 'xlsx', 'xml'],
    icon: Calculator
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

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" weight="bold" />
            <span className="text-xl font-bold text-primary">MV Consultoria</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#servicos" className="text-foreground hover:text-primary transition-colors">Serviços</a>
            <a href="#calculadora" className="text-foreground hover:text-primary transition-colors">Calculadora</a>
            <a href="#sobre" className="text-foreground hover:text-primary transition-colors">Sobre</a>
            <a href="#contato" className="text-foreground hover:text-primary transition-colors">Contato</a>
            <Button variant="outline">Área do Cliente</Button>
            <Button>Fale Conosco</Button>
          </nav>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <a href="#servicos" className="text-foreground hover:text-primary transition-colors">Serviços</a>
              <a href="#calculadora" className="text-foreground hover:text-primary transition-colors">Calculadora</a>
              <a href="#sobre" className="text-foreground hover:text-primary transition-colors">Sobre</a>
              <a href="#contato" className="text-foreground hover:text-primary transition-colors">Contato</a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="w-full">Área do Cliente</Button>
                <Button className="w-full">Fale Conosco</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Consultoria Empresarial
          <span className="block text-accent">Completa e Eficiente</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
          Transforme sua empresa com nossos serviços especializados em contabilidade, 
          jurídico e recursos humanos. Mais de 1.000 empresas confiam na MV Consultoria.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Calcular Preços
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
            Falar com Consultor
          </Button>
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section id="servicos" className="py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nossos Serviços
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Soluções completas para impulsionar o crescimento da sua empresa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    R$ {service.basePrice}
                    <span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </span>
                  <Button size="sm">Contratar</Button>
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
  const [selectedServices, setSelectedServices] = useKV('selected-services', new Set<string>())
  const [companySize, setCompanySize] = useKV('company-size', '')
  const [calculationResult, setCalculationResult] = useKV('calculation-result', null)

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
                    R$ {calculationResult.total}
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
  const [leads, setLeads] = useKV('leads', [] as Lead[])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newLead: Lead = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    }

    setLeads((prevLeads) => [newLead, ...prevLeads])
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      message: ''
    })

    toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.')
  }

  return (
    <section id="contato" className="py-20 bg-secondary/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Entre em Contato
          </h2>
          <p className="text-lg text-muted-foreground">
            Fale com nossos especialistas e descubra como podemos ajudar sua empresa
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="p-8">
            <CardHeader>
              <CardTitle>Fale Conosco</CardTitle>
              <CardDescription>
                Preencha o formulário e receba uma proposta personalizada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="service">Serviço de Interesse</Label>
                  <Select value={formData.service} onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Conte-nos mais sobre suas necessidades..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Telefone</h4>
                  <p className="text-muted-foreground">(11) 99999-9999</p>
                  <p className="text-muted-foreground">(11) 3333-3333</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Email</h4>
                  <p className="text-muted-foreground">contato@mvconsultoria.com.br</p>
                  <p className="text-muted-foreground">comercial@mvconsultoria.com.br</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <Building2 className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Endereço</h4>
                  <p className="text-muted-foreground">
                    Rua da Consultoria, 123<br />
                    Centro - São Paulo/SP<br />
                    CEP: 01000-000
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary text-primary-foreground">
              <h4 className="font-semibold mb-2">Horário de Atendimento</h4>
              <p className="text-sm opacity-90">
                Segunda a Sexta: 8h às 18h<br />
                Sábado: 8h às 12h<br />
                Domingo: Fechado
              </p>
            </Card>
          </div>
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
            <SelectTrigger>
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
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="urgente, declaracao, 2024"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
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
  const [documents, setDocuments] = useKV('client-documents', [] as ClientDocument[])
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
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar documentos..."
              />
            </div>
            <div>
              <Label>Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
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
              <Label>Ordenar por</Label>
              <Select value={sortBy} onValueChange={(value: 'name' | 'date' | 'size') => setSortBy(value)}>
                <SelectTrigger>
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
                              <CalendarBlank className="w-3 h-3" />
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
  const [leads] = useKV('leads', [] as Lead[])
  const [documents] = useKV('client-documents', [] as ClientDocument[])
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Área do Cliente</Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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
          
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Documentos Enviados</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{documents.length}</div>
                  <p className="text-xs text-muted-foreground">Total de arquivos</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Leads</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{leads.length}</div>
                  <p className="text-xs text-muted-foreground">Contatos recebidos</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <CalendarBlank className="w-4 h-4" />
                    <span>Última Atualização</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {documents.length > 0 
                      ? new Date(Math.max(...documents.map(d => new Date(d.uploadedAt).getTime()))).toLocaleDateString()
                      : 'Nenhum'
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">Documento mais recente</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-green-100 text-green-800">Em dia</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Conta regularizada</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documentos por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documentCategories.map(category => {
                      const count = documents.filter(doc => doc.category === category.id).length
                      return (
                        <div key={category.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <category.icon className="w-4 h-4 text-primary" />
                            <span className="text-sm">{category.name}</span>
                          </div>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.slice(0, 5).map(doc => (
                      <div key={doc.id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <UploadSimple className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {documents.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma atividade recente
                      </p>
                    )}
                  </div>
                </CardContent>
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
          
          <TabsContent value="reports">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Relatórios Financeiros</h3>
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Todos
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Balanço Dezembro 2024', type: 'PDF', size: '245 KB', date: '15/12/2024' },
                  { name: 'DRE Novembro 2024', type: 'Excel', size: '186 KB', date: '30/11/2024' },
                  { name: 'Relatório Fiscal', type: 'PDF', size: '532 KB', date: '25/11/2024' },
                  { name: 'Demonstrativo de Impostos', type: 'PDF', size: '298 KB', date: '20/11/2024' },
                  { name: 'Balancete Outubro', type: 'Excel', size: '145 KB', date: '31/10/2024' },
                  { name: 'Relatório de Folha', type: 'PDF', size: '367 KB', date: '28/10/2024' }
                ].map((report, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          {report.type === 'PDF' ? 
                            <FilePdf className="w-5 h-5 text-red-600" /> :
                            <FileXls className="w-5 h-5 text-green-600" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{report.name}</h4>
                          <p className="text-xs text-muted-foreground">{report.size} • {report.date}</p>
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline" className="text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              Ver
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                              <Mail className="w-3 h-3" />
                              <span>{lead.email}</span>
                            </p>
                            <p className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{lead.phone}</span>
                            </p>
                            {lead.company && (
                              <p className="flex items-center space-x-1">
                                <Building2 className="w-3 h-3" />
                                <span>{lead.company}</span>
                              </p>
                            )}
                            <p className="flex items-center space-x-1">
                              <CalendarBlank className="w-3 h-3" />
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
              <Building2 className="h-6 w-6" weight="bold" />
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
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ServicesSection />
      <Calculator />
      <About />
      <ContactForm />
      <Footer />
    </div>
  )
}

export default App