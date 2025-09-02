import { useState } from 'react'
import { Building2, Phone, Mail, Calculator, FileText, Users, Shield, ChevronDown, Menu, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

function ClientPortal() {
  const [leads] = useKV('leads', [] as Lead[])
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Área do Cliente</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Portal do Cliente</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Documentos Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">3</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Última Atualização</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">Hoje</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-green-100 text-green-800">Em dia</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Seus Documentos</h3>
              <div className="space-y-2">
                {['Balanço Dezembro 2024', 'DRE Novembro 2024', 'Relatório Fiscal'].map((doc, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <span>{doc}</span>
                      </div>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reports">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Relatórios Financeiros</h3>
              <p className="text-muted-foreground">
                Aqui você encontrará todos os relatórios gerados pela nossa equipe.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="leads">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Leads Recebidos ({leads.length})</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {leads.map((lead) => (
                  <Card key={lead.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{lead.name}</h4>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                        <p className="text-sm text-muted-foreground">{lead.company}</p>
                      </div>
                      <Badge variant="outline">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    {lead.message && (
                      <p className="text-sm mt-2 text-muted-foreground">"{lead.message}"</p>
                    )}
                  </Card>
                ))}
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