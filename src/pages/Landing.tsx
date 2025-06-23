
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Boxes } from '@/components/ui/background-boxes';
import { 
  MessageSquareText, 
  Smartphone, 
  Zap, 
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Shield,
  Clock,
  Mic,
  FileText,
  Receipt
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <MessageSquareText className="h-6 w-6" />,
      title: "Tudo via WhatsApp",
      description: "Registre gastos e receitas diretamente no WhatsApp, sem precisar abrir outro app"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Zero burocracia",
      description: "Simplesmente digite sua transação e pronto. Nada de formulários complicados"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Sem precisar abrir o app",
      description: "Use o WhatsApp que você já tem instalado. Não precisa lembrar de abrir outro app"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Totalmente automático",
      description: "Suas transações são categorizadas automaticamente e você recebe relatórios prontos"
    }
  ];

  const benefits = [
    "Controle financeiro sem complicação",
    "Relatórios automáticos por WhatsApp",
    "Dashboard completo com gráficos",
    "Metas e alertas personalizados",
    "Sincronização em tempo real",
    "100% seguro e privado"
  ];

  const howItWorks = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Mensagem de Texto",
      description: "Digite suas despesas diretamente no chat",
      example: "Gastei 100 em compras no Atacadão",
      image: "/whatsapp-text-message.png"
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Mensagem de Áudio",
      description: "Grave um áudio com sua transação",
      example: "Áudio: 'Gastei 150 em compras no Atacadão'",
      image: "/whatsapp-audio-message.png"
    },
    {
      icon: <Receipt className="h-8 w-8" />,
      title: "Comprovante PIX",
      description: "Envie o comprovante e deixe o resto conosco",
      example: "Comprovante automático do PIX",
      image: "/whatsapp-receipt-message.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/7149adf3-440a-491e-83c2-d964a3348cc9.png" 
              alt="Finance Home Logo" 
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold text-white">Finance Home</span>
          </div>
          <Link to="/auth">
            <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-slate-900">
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section with Background */}
      <section className="relative">
        <Boxes />
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Controle financeiro
              <span className="block text-green-400">via WhatsApp</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              A única plataforma que permite organizar suas finanças pessoais 100% integrada com o WhatsApp. 
              Sem apps extras, sem complicação.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/auth">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Acessar Plataforma
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <div className="flex items-center text-slate-300">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">Configuração em 2 minutos</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">100%</div>
                <div className="text-slate-400">Via WhatsApp</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">0</div>
                <div className="text-slate-400">Apps extras</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">24/7</div>
                <div className="text-slate-400">Disponível</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Como funciona?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Três formas simples de registrar suas transações no WhatsApp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {howItWorks.map((method, index) => (
              <div key={index} className="text-center">
                <div className="bg-slate-700/50 p-8 rounded-xl border border-slate-600 hover:border-green-500 transition-all duration-300 hover:bg-slate-700/70">
                  <div className="bg-green-500/20 p-4 rounded-lg w-fit mx-auto mb-6 text-green-400">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{method.title}</h3>
                  <p className="text-slate-300 mb-4">{method.description}</p>
                  <div className="bg-green-500/10 p-3 rounded-lg">
                    <p className="text-green-300 text-sm font-medium">"{method.example}"</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <img 
                    src={method.image} 
                    alt={`Exemplo de ${method.title}`}
                    className="w-48 h-auto mx-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard Preview */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">Visualize tudo no dashboard</h3>
            <p className="text-lg text-slate-300 mb-8">
              Acompanhe suas finanças com gráficos detalhados e relatórios completos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-white mb-4">Dashboard Financeiro</h4>
              <img 
                src="/dashboard-screenshot.png" 
                alt="Dashboard Financeiro"
                className="w-full h-auto rounded-lg shadow-xl border border-slate-600"
              />
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold text-white mb-4">Calendário de Transações</h4>
              <img 
                src="/calendar-screenshot.png" 
                alt="Calendário de Transações"
                className="w-full h-auto rounded-lg shadow-xl border border-slate-600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Por que escolher o Finance Home?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Desenvolvido para quem não tem tempo ou paciência para apps complicados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-700/50 p-6 rounded-xl border border-slate-600 hover:border-green-500 transition-all duration-300 hover:bg-slate-700/70">
                <div className="bg-green-500/20 p-3 rounded-lg w-fit mb-4 text-green-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Tudo que você precisa em um só lugar
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="text-lg text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <TrendingUp className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Pronto para organizar suas finanças?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Comece agora e tenha controle total do seu dinheiro direto no WhatsApp
            </p>
            
            <Link to="/auth">
              <Button size="lg" className="bg-white text-green-600 hover:bg-slate-100 px-12 py-4 text-xl font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                Acessar Agora
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/7149adf3-440a-491e-83c2-d964a3348cc9.png" 
                alt="Finance Home Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-white">Finance Home</span>
            </div>
            
            <div className="text-slate-400 text-center md:text-right">
              <p>&copy; 2025 Finance Home. Todos os direitos reservados.</p>
              <p className="text-sm mt-1">Controle financeiro inteligente via WhatsApp</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
