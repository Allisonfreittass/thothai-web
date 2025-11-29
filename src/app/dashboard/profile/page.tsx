"use client";

import React, { useState, useEffect } from 'react';
import { User, CreditCard, Key, Shield, Crown, LogOut } from 'lucide-react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProfilePage() {
    const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [keyInput, setKeyInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
        ativarPlanoProAutomatico();
    }
    fetchUser();
  }, []);

  const ativarPlanoProAutomatico = async () => {
    // ATENÇÃO: ISSO É INSEGURO EM PRODUÇÃO (Qualquer um que digitar ?success=true vira PRO)
    // Mas para seu MVP local funciona perfeitamente.
    try {
        const token = localStorage.getItem('thoth_token');
        await axios.post('http://localhost:3001/user/upgrade', { plan: 'pro' }, {
             headers: { Authorization: `Bearer ${token}` }
        });
        // Limpa a URL para não rodar de novo
        window.history.replaceState(null, '', '/dashboard/profile');
        alert("Pagamento confirmado! Bem-vindo, Faraó.");
    } catch (error) {
        console.error("Erro ao ativar");
    }
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('thoth_token');
    try {
        const res = await axios.get('http://localhost:3001/user/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
    } catch (error) {
        console.error(error);
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!keyInput) return;
    
    setLoading(true);
    try {
        const token = localStorage.getItem('thoth_token');
        await axios.post('http://localhost:3001/key/redeem', { key: keyInput }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("Chave aceita! O poder é seu.");
        setKeyInput("");
        fetchUser(); // Atualiza a tela
    } catch (error: any) {
        alert(error.response?.data?.message || "Chave inválida.");
    } finally {
        setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('thoth_token');
    router.push('/login');
  };

  if (!user) return <div className="text-slate-500 p-8">Carregando perfil...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-slate-100">Perfil do Iniciado</h1>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Cartão de Dados Pessoais */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                    <User size={32} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-100">{user.name}</h2>
                    <p className="text-slate-500 text-sm">{user.email}</p>
                </div>
            </div>
            
            <div className="border-t border-slate-800 pt-4">
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium">
                    <LogOut size={16} /> Sair da Conta
                </button>
            </div>
        </div>

        {/* Cartão de Assinatura */}
        <div className={`p-6 rounded-2xl border relative overflow-hidden ${user.plan === 'pro' ? 'bg-gradient-to-br from-slate-900 to-indigo-950 border-yellow-500/50' : 'bg-slate-900 border-slate-800'}`}>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-slate-300">
                        <CreditCard size={20} />
                        <span className="font-medium">Plano Atual</span>
                    </div>
                    {user.plan === 'pro' ? (
                        <span className="bg-yellow-500 text-slate-900 text-xs font-bold px-2 py-1 rounded flex items-center gap-1"><Crown size={12}/> FARAÓ</span>
                    ) : (
                        <span className="bg-slate-700 text-slate-300 text-xs font-bold px-2 py-1 rounded flex items-center gap-1"><Shield size={12}/> FREE</span>
                    )}
                </div>

                <div className="mb-6">
                    {user.plan === 'pro' ? (
                        <p className="text-slate-400 text-sm">Sua assinatura está ativa. Aproveite os recursos ilimitados.</p>
                    ) : (
                        <p className="text-slate-400 text-sm">Você está no plano gratuito. Faça o upgrade para treinar modelos ilimitados.</p>
                    )}
                </div>

                {/* Área de Resgate de Key */}
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-1">
                        <Key size={12} /> Resgatar Licença (Key)
                    </label>
                    <form onSubmit={handleRedeem} className="flex gap-2">
                        <input 
                            type="text" 
                            value={keyInput}
                            onChange={(e) => setKeyInput(e.target.value)}
                            placeholder="THOTH-XXXX-XXXX"
                            className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-yellow-600 hover:bg-yellow-500 text-slate-900 font-bold px-4 py-2 rounded text-sm transition-colors"
                        >
                            {loading ? '...' : 'Ativar'}
                        </button>
                    </form>
                </div>
            </div>
            
            {/* Elemento Decorativo de Fundo */}
            <div className="absolute -bottom-10 -right-10 opacity-10 text-yellow-500">
                <Crown size={150} />
            </div>
        </div>

      </div>
    </div>
  );
}