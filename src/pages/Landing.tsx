
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  MessageSquareText, 
  Smartphone, 
  Zap, 
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Shield,
  Clock,
  MessageCircle,
  Mic,
  Receipt,
  BarChart3,
  Calendar
} from 'lucide-react';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

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

  const howItWorksSteps = [
    {
      step: "1",
      title: "Envie pelo WhatsApp",
      description: "Mande suas transações de forma simples",
      methods: [
        {
          icon: <MessageCircle className="h-6 w-6" />,
          title: "Texto",
          description: "Digite: 'Comprei pão R$ 5,50'",
          image: "/whatsapp-text-message.png"
        },
        {
          icon: <Mic className="h-6 w-6" />,
          title: "Áudio",
          description: "Grave um áudio contando o gasto",
          image: "/whatsapp-audio-message.png"
        },
        {
          icon: <Receipt className="h-6 w-6" />,
          title: "Comprovante",
          description: "Tire foto do recibo ou nota fiscal",
          image: "/whatsapp-receipt-message.png"
        }
      ]
    },
    {
      step: "2",
      title: "Visualize no Dashboard", 
      description: "Acompanhe seus gastos em tempo real com gráficos e relatórios automáticos",
      icon: <BarChart3 className="h-8 w-8" />,
      image: "/dashboard-screenshot.png"
    },
    {
      step: "3",
      title: "Organize no Calendário",
      description: "Veja todas suas transações organizadas por data e periodo",
      icon: <Calendar className="h-8 w-8" />,
      image: "/calendar-screenshot.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
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
            <button className="p-[3px] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
              <div className="px-6 py-2 bg-slate-900 rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                Entrar
              </div>
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
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
              <button className="p-[3px] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg" />
                <div className="px-8 py-4 bg-slate-900 rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent flex items-center gap-2 text-lg font-semibold">
                  Acessar Plataforma
                  <ArrowRight className="h-5 w-5" />
                </div>
              </button>
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
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Como funciona?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Apenas 3 passos simples para ter controle total das suas finanças
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-20">
            {/* Step 1 - WhatsApp Methods with 3D Cards */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full text-xl font-bold mb-6">
                {howItWorksSteps[0].step}
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">{howItWorksSteps[0].title}</h3>
              <p className="text-lg text-slate-300 mb-12">{howItWorksSteps[0].description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {howItWorksSteps[0].methods.map((method, index) => (
                  <CardContainer key={index} className="inter-var" containerClassName="py-10">
                    <CardBody className="bg-slate-700/50 relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] border-slate-600 w-auto h-auto rounded-xl p-6 border">
                      <CardItem
                        translateZ="50"
                        className="bg-green-500/20 p-3 rounded-lg w-fit mx-auto mb-4 text-green-400"
                      >
                        {method.icon}
                      </CardItem>
                      <CardItem
                        translateZ="60"
                        className="text-xl font-semibold text-white mb-2 text-center"
                      >
                        {method.title}
                      </CardItem>
                      <CardItem
                        as="p"
                        translateZ="60"
                        className="text-slate-300 mb-4 text-center"
                      >
                        {method.description}
                      </CardItem>
                      <CardItem translateZ="100" className="w-full">
                        <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                          <img 
                            src={method.image} 
                            alt={`Exemplo ${method.title}`}
                            className="max-w-full max-h-full object-contain rounded-lg group-hover/card:shadow-xl"
                            onError={(e) => {
                              console.error(`Failed to load image: ${method.image}`);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      </CardItem>
                    </CardBody>
                  </CardContainer>
                ))}
              </div>
            </div>

            {/* Step 2 - Dashboard with 3D Card */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full text-xl font-bold mb-6">
                {howItWorksSteps[1].step}
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">{howItWorksSteps[1].title}</h3>
              <p className="text-lg text-slate-300 mb-8">{howItWorksSteps[1].description}</p>
              
              <div className="max-w-4xl mx-auto">
                <CardContainer className="inter-var" containerClassName="py-10">
                  <CardBody className="bg-slate-700/50 relative group/card hover:shadow-2xl hover:shadow-blue-500/[0.1] border-slate-600 w-full h-auto rounded-xl p-6 border">
                    <CardItem translateZ="100" className="w-full">
                      <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src={howItWorksSteps[1].image} 
                          alt="Dashboard do sistema"
                          className="max-w-full max-h-full object-contain rounded-lg group-hover/card:shadow-xl"
                          onError={(e) => {
                            console.error(`Failed to load image: ${howItWorksSteps[1].image}`);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </div>
            </div>

            {/* Step 3 - Calendar with 3D Card */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 text-white rounded-full text-xl font-bold mb-6">
                {howItWorksSteps[2].step}
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">{howItWorksSteps[2].title}</h3>
              <p className="text-lg text-slate-300 mb-8">{howItWorksSteps[2].description}</p>
              
              <div className="max-w-4xl mx-auto">
                <CardContainer className="inter-var" containerClassName="py-10">
                  <CardBody className="bg-slate-700/50 relative group/card hover:shadow-2xl hover:shadow-purple-500/[0.1] border-slate-600 w-full h-auto rounded-xl p-6 border">
                    <CardItem translateZ="100" className="w-full">
                      <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src={howItWorksSteps[2].image} 
                          alt="Calendário do sistema"
                          className="max-w-full max-h-full object-contain rounded-lg group-hover/card:shadow-xl"
                          onError={(e) => {
                            console.error(`Failed to load image: ${howItWorksSteps[2].image}`);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/50">
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
              <button className="p-[3px] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-lg" />
                <div className="px-12 py-4 bg-white/10 rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent flex items-center gap-3 text-xl font-bold mx-auto w-fit backdrop-blur-sm">
                  Acessar Agora
                  <ArrowRight className="h-6 w-6" />
                </div>
              </button>
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
