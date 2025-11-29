import React from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Brain, 
  Database, 
  Zap, 
  Shield, 
  Check, 
  ArrowRight, 
  Cpu 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-yellow-500/30">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-slate-800/50 backdrop-blur-md fixed w-full z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 bg-gradient-to-tr from-yellow-600 to-yellow-400 rounded-lg flex items-center justify-center text-slate-900 shadow-lg shadow-yellow-500/20">
              <Bot size={20} />
            </div>
            <span className="bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
              THOTH AI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Link 
              href="/register" 
              className="bg-slate-100 hover:bg-white text-slate-900 px-5 py-2 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:shadow-white/10"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Efeito de Fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-yellow-500 mb-6 animate-fade-in">
            <Zap size={12} />
            <span>Nova Engine Llama 3 Disponível</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent">
            Crie sua própria <br />
            Inteligência Soberana
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Treine modelos de IA com seus próprios dados, documentos e estilo. 
            Sem código complexo. Apenas arquivos e magia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-slate-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-900/20 group"
            >
              Criar meu Modelo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#demo" 
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-medium rounded-xl transition-all"
            >
              Ver Demonstração
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-slate-900/30 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-yellow-600/30 transition-colors group">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Database size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">RAG Avançado</h3>
              <p className="text-slate-400 leading-relaxed">
                Faça upload de PDFs e TXTs. Sua IA lerá seus arquivos e responderá baseada apenas na sua verdade.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-yellow-600/30 transition-colors group">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Fine-Tuning Real</h3>
              <p className="text-slate-400 leading-relaxed">
                Ajuste fino de hiperparâmetros (Epochs, Learning Rate) para ensinar novos padrões de comportamento à IA.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-yellow-600/30 transition-colors group">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Dados Privados</h3>
              <p className="text-slate-400 leading-relaxed">
                Seus datasets são seus. Não usamos seus dados para treinar modelos públicos. Segurança de ponta a ponta.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section className="py-24 px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos para Mortais e Deuses</h2>
          <p className="text-slate-400">Comece pequeno, escale conforme sua sabedoria cresce.</p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          
          {/* Free Tier */}
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-all">
            <h3 className="text-xl font-bold text-slate-300 mb-2">Iniciado</h3>
            <div className="text-4xl font-bold mb-6">R$ 0 <span className="text-lg font-normal text-slate-500">/mês</span></div>
            <ul className="space-y-4 mb-8 text-slate-400">
              <li className="flex gap-3"><Check size={20} className="text-slate-500"/> 10 mensagens/mês</li>
              <li className="flex gap-3"><Check size={20} className="text-slate-500"/> 1 Modelo Personalizado</li>
              <li className="flex gap-3"><Check size={20} className="text-slate-500"/> Suporte da comunidade</li>
            </ul>
            <Link href="/register" className="block w-full py-3 text-center rounded-xl border border-slate-700 hover:bg-slate-800 font-medium transition-all">
              Criar Conta Grátis
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="relative p-8 rounded-3xl border border-yellow-600/50 bg-slate-900 shadow-2xl shadow-yellow-900/20 transform md:scale-105">
            <div className="absolute top-0 right-0 bg-yellow-600 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
              MAIS POPULAR
            </div>
            <h3 className="text-xl font-bold text-yellow-500 mb-2 flex items-center gap-2">
              <Cpu size={20}/> Faraó
            </h3>
            <div className="text-4xl font-bold mb-6">R$ 49 <span className="text-lg font-normal text-slate-500">/mês</span></div>
            <ul className="space-y-4 mb-8 text-slate-300">
              <li className="flex gap-3"><Check size={20} className="text-yellow-500"/> Mensagens Ilimitadas</li>
              <li className="flex gap-3"><Check size={20} className="text-yellow-500"/> Modelos Ilimitados</li>
              <li className="flex gap-3"><Check size={20} className="text-yellow-500"/> Treinamento Prioritário</li>
              <li className="flex gap-3"><Check size={20} className="text-yellow-500"/> Acesso a modelos Beta</li>
            </ul>
            <Link href="/register" className="block w-full py-3 text-center rounded-xl bg-yellow-600 hover:bg-yellow-500 text-slate-900 font-bold transition-all shadow-lg hover:shadow-yellow-500/20">
              Assinar Agora
            </Link>
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-slate-900 text-center text-slate-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <Bot size={24} />
          <span className="font-bold text-lg">THOTH AI</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Thoth AI. Todos os direitos reservados nas areias do tempo.</p>
        <div className="flex justify-center gap-6 mt-6">
          <a href="#" className="hover:text-slate-400 transition-colors">Termos</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Privacidade</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Twitter</a>
        </div>
      </footer>

    </div>
  );
}