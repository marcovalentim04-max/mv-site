import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import { AlertTriangle, RotateCw } from "lucide-react";

export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  // Para depuração, vamos ver qual é o erro real
  console.error('Erro capturado pelo ErrorBoundary:', error);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Ocorreu um erro na aplicação</AlertTitle>
          <AlertDescription>
            Algo inesperado aconteceu durante a execução da aplicação. Os detalhes do erro são mostrados abaixo. Por favor, tente novamente ou entre em contato com o suporte.
          </AlertDescription>
        </Alert>
        
        <div className="bg-card border rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">Detalhes do Erro:</h3>
          <pre className="text-xs text-destructive bg-muted/50 p-3 rounded border overflow-auto max-h-32">
            {error.message}
          </pre>
        </div>
        
        <Button 
          onClick={resetErrorBoundary} 
          className="w-full"
          variant="outline"
        >
          <RotateCw className="mr-2 h-4 w-4" />
          Tentar Novamente
        </Button>
      </div>
    </div>
  );
}
