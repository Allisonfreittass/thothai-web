"use client";

import React, { useState, useEffect } from 'react';
import { Check, Crown, Shield } from 'lucide-react';
import axios from 'axios';

export default function PlansPage() {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(false);

  // Busca o plano atual ao carregar
  useEffect(() => {
    const fetchUser = async () => {
        const token = localStorage.getItem('thoth_token');
        try {
            const res = await axios.get('http://localhost:3001/user/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCurrentPlan(res.data.plan);
        } catch (error) {
            console.error(error);
        }
    };
    fetchUser();
  }, []);

const handleUpgrade = async (planType: string) => {
    if (planType === 'free') {
        alert("Para cancelar, entre em contato com o suporte (ou gerencie no portal Stripe).");
        return;
    }

    setLoading(true);
    try {
        const token = localStorage.getItem('thoth_token');
        
        // 1. Pede o link de pagamento pro backend
        const response = await axios.post('http://localhost:3001/payment/checkout', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // 2. Redireciona o usuário para o site do Stripe
        window.location.href = response.data.url;

    } catch (error) {
        console.error(error);
        alert("Erro ao iniciar pagamento.");
        setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-100 mb-4">Escolha seu Destino</h1>
        <p className="text-slate-400">Desbloqueie o verdadeiro poder de Thoth.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* PLANO FREE */}
        <div className={`p-8 rounded-2xl border ${currentPlan === 'free' ? 'bg-slate-900 border-yellow-600' : 'bg-slate-900/50 border-slate-800'} relative`}>
            {currentPlan === 'free' && <div className="absolute top-0 right-0 bg-yellow-600 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">SEU PLANO</div>}
            
            <div className="flex items-center gap-3 mb-4 text-slate-300">
                <Shield size={32} />
                <h3 className="text-2xl font-bold">Iniciado</h3>
            </div>
            <div className="text-4xl font-bold text-slate-100 mb-6">Grátis</div>
            
            <ul className="space-y-4 mb-8 text-slate-400">
                <li className="flex gap-3"><Check size={20} className="text-slate-500"/> Chat com IA Padrão</li>
                <li className="flex gap-3"><Check size={20} className="text-slate-500"/> Upload de Arquivos Pequenos</li>
                <li className="flex gap-3 opacity-50"><Check size={20}/> Treinamento de Modelos</li>
                <li className="flex gap-3 opacity-50"><Check size={20}/> Exportação .GGUF</li>
            </ul>

            {currentPlan === 'pro' && (
                <button 
                    onClick={() => handleUpgrade('free')}
                    disabled={loading}
                    className="w-full py-3 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 transition-all"
                >
                    Cancelar Assinatura
                </button>
            )}
        </div>

        {/* PLANO PRO */}
        <div className={`p-8 rounded-2xl border ${currentPlan === 'pro' ? 'bg-gradient-to-b from-slate-900 to-indigo-950 border-yellow-500 shadow-2xl shadow-yellow-900/20' : 'bg-slate-900 border-slate-800'} relative transform hover:scale-105 transition-all`}>
             {currentPlan === 'pro' && <div className="absolute top-0 right-0 bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">ATIVO</div>}

            <div className="flex items-center gap-3 mb-4 text-yellow-500">
                <Crown size={32} />
                <h3 className="text-2xl font-bold">Faraó</h3>
            </div>
            <div className="text-4xl font-bold text-slate-100 mb-6">R$ 49<span className="text-lg text-slate-500 font-normal">/mês</span></div>
            
            <ul className="space-y-4 mb-8 text-slate-300">
                <li className="flex gap-3"><Check size={20} className="text-yellow-500"/> Tudo do plano Iniciado</li>
                <li className="flex gap-3"><Check size={20} className="text-yellow-500"/> Treinamento Ilimitado</li>
                <li className="flex gap-3"><Check size={20} className="text-yellow-500"/> Chat com Seus Dados (RAG)</li>
                <li className="flex gap-3"><Check size={20} className="text-yellow-500"/> Exportação de Modelos (.GGUF)</li>
            </ul>

            {currentPlan !== 'pro' ? (
                <button 
                    onClick={() => handleUpgrade('pro')}
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-slate-900 font-bold transition-all shadow-lg hover:shadow-yellow-500/20"
                >
                    {loading ? 'Processando...' : 'Assinar Agora'}
                </button>
            ) : (
                <div className="w-full py-3 text-center text-yellow-500 font-bold bg-yellow-500/10 rounded-lg">
                    Plano Ativo
                </div>
            )}
        </div>

      </div>
    </div>
  );
}