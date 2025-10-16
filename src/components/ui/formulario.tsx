import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { CompanyOpeningService, validateCPF, validateEmail, formatCPF, formatPhone } from "@/lib/companyOpeningService";
import { toast } from "sonner";

type OpenCompanyFormProps = {
  onClose: () => void;
};

export default function OpenCompanyForm({ onClose }: OpenCompanyFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Dados pessoais
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  
  // Dados da empresa
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessActivity, setBusinessActivity] = useState("");
  
  // Preferências
  const [preferredContactMethod, setPreferredContactMethod] = useState("whatsapp");
  const [additionalNotes, setAdditionalNotes] = useState("");
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Função segura para fechar o modal
  const safeClose = () => {
    try {
      // Pequeno delay para garantir que o DOM foi limpo
      setTimeout(() => {
        onClose();
      }, 0);
    } catch (error) {
      console.error('Erro ao fechar modal:', error);
      // Tenta fechar de qualquer forma
      onClose();
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) newErrors.fullName = "Nome completo é obrigatório";
    if (!cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!validateCPF(cpf)) {
      newErrors.cpf = "CPF inválido";
    }
    if (!phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = "Telefone inválido";
    }
    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email inválido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!companyName.trim()) newErrors.companyName = "Nome da empresa é obrigatório";
    if (!businessType) newErrors.businessType = "Tipo de empresa é obrigatório";
    if (!businessActivity.trim()) newErrors.businessActivity = "Atividade é obrigatória";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    try {
      if (step > 1) {
        setStep(step - 1);
        setErrors({});
      }
    } catch (error) {
      console.error('Erro ao voltar:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setIsSubmitting(true);

    try {
      // Verificar se já existe cadastro com este email ou CPF
      const existingCheck = await CompanyOpeningService.findByEmailOrCPF(email, cpf.replace(/\D/g, ''));
      
      if (existingCheck.exists) {
        toast.error("Já existe um cadastro com este CPF ou email!");
        setIsSubmitting(false);
        return;
      }

      // Criar a solicitação
      const result = await CompanyOpeningService.create({
        full_name: fullName,
        cpf: cpf.replace(/\D/g, ''),
        phone: phone.replace(/\D/g, ''),
        email: email,
        company_name: companyName,
        business_type: businessType,
        business_activity: businessActivity,
        preferred_contact_method: preferredContactMethod as any,
        additional_notes: additionalNotes || undefined,
        source: 'website'
      });

      if (result.success) {
        setSubmitted(true);
        toast.success("Solicitação enviada com sucesso!");
        
        // Fechar após 3 segundos
        setTimeout(() => {
          safeClose();
        }, 3000);
      } else {
        toast.error(result.error || "Erro ao enviar solicitação");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar solicitação");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tela de sucesso
  if (submitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
        <div className="max-w-md w-full p-8 shadow-2xl rounded-2xl bg-white text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Solicitação Enviada!
          </h2>
          <p className="text-gray-600 mb-6">
            Recebemos sua solicitação de abertura de empresa. Nossa equipe entrará em contato em breve!
          </p>
          <Button onClick={safeClose} className="w-full">
            Fechar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 overflow-y-auto"
      onClick={safeClose}
    >
      <div
        className="max-w-2xl w-full my-8 shadow-2xl rounded-2xl bg-white relative"
        onClick={(e) => e.stopPropagation()}
      >
          <button
            type="button"
            onClick={safeClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-700 z-10"
            aria-label="Fechar formulário"
          >
            ✕
          </button>

          <CardHeader className="pb-4">
            <CardTitle className="text-2xl mt-4">Abrir Empresa Grátis</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para iniciar o processo de abertura da sua empresa.
            </CardDescription>
            
            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className={`h-2 w-16 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`h-2 w-16 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              Etapa {step} de 2
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Etapa 1: Dados Pessoais */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Seus Dados Pessoais</h3>
                  
                  <div>
                    <Label htmlFor="fullName">Nome Completo *</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Seu nome completo"
                      className={`mt-1 ${errors.fullName ? "border-red-500" : ""}`}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      value={cpf}
                      onChange={(e) => setCpf(formatCPF(e.target.value))}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className={`mt-1 ${errors.cpf ? "border-red-500" : ""}`}
                    />
                    {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                      className={`mt-1 ${errors.phone ? "border-red-500" : ""}`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <Button type="button" onClick={handleNext} className="w-full mt-6 mb-2">
                    Próximo
                  </Button>
                </div>
              )}

              {/* Etapa 2: Dados da Empresa */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Dados da Empresa</h3>
                  
                  <div>
                    <Label htmlFor="companyName">Nome da Empresa *</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Nome da sua empresa"
                      className={`mt-1 ${errors.companyName ? "border-red-500" : ""}`}
                    />
                    {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="businessType">Tipo de Empresa *</Label>
                    <select
                      id="businessType"
                      value={businessType}
                      onChange={(e) => {
                        setBusinessType(e.target.value);
                        setErrors((prev) => ({ ...prev, businessType: '' }));
                      }}
                      className={`flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.businessType ? "border-red-500" : "border-input"}`}
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="MEI">MEI - Microempreendedor Individual</option>
                      <option value="ME">ME - Microempresa</option>
                      <option value="EIRELI">EIRELI - Empresa Individual</option>
                      <option value="LTDA">LTDA - Sociedade Limitada</option>
                      <option value="SA">S.A. - Sociedade Anônima</option>
                    </select>
                    {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
                  </div>

                  <div>
                    <Label htmlFor="businessActivity">Atividade da Empresa *</Label>
                    <Textarea
                      id="businessActivity"
                      value={businessActivity}
                      onChange={(e) => setBusinessActivity(e.target.value)}
                      placeholder="Descreva brevemente a atividade principal da empresa"
                      rows={3}
                      className={`mt-1 ${errors.businessActivity ? "border-red-500" : ""}`}
                    />
                    {errors.businessActivity && <p className="text-red-500 text-sm mt-1">{errors.businessActivity}</p>}
                  </div>

                  
                    <div>
                        <Label htmlFor="preferredContact">Como prefere ser contatado?</Label>
                        <select
                          id="preferredContact"
                          value={preferredContactMethod}
                          onChange={(e) => setPreferredContactMethod(e.target.value)}
                          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="whatsapp">WhatsApp</option>
                          <option value="email">E-mail</option>
                          <option value="phone">Telefone</option>
                        </select>
                      </div>


                  <div>
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Textarea
                      id="notes"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Alguma informação adicional que gostaria de compartilhar?"
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-3 mt-6 mb-6">
                    <Button 
                      type="button" 
                      onClick={handleBack} 
                      variant="outline" 
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        'Enviar Solicitação'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </div>
      </div> 
  );
}
