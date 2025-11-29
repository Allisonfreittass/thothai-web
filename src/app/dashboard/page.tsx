"use client";

import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Database, MessageSquare, Cpu, Crown, Activity } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    models: 0,
    datasets: 0,
    chats: 0,
    plan: 'free',
    userName: 'Iniciado'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('thoth_token');
        const res = await axios.get('http://localhost:3001/dashboard/stats', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header com Boas Vindas */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-800 pb-6">
        <div>
            <h1 className="text-4xl font-bold text-slate-100 mb-2">
                Olá, {stats.userName}
            </h1>
            <p className="text-slate-400 text-lg flex items-center gap-2">
                O templo está operante. 
                {stats.plan === 'pro' && (
                    <span className="text-xs bg-yellow-500 text-slate-900 font-bold px-2 py-1 rounded flex items-center gap-1">
                        <Crown size={12}/> FARAÓ ATIVO
                    </span>
                )}
            </p>
        </div>
        <div className="text-right hidden md:block">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status do Sistema</p>
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                <Activity size={16} /> Todos os serviços online
            </div>
        </div>
      </div>

      {/* Grid de Métricas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card Chats */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <MessageSquare size={100} />
            </div>
            <div className="flex items-center gap-3 mb-4 text-blue-400">
                <div className="p-2 bg-blue-500/10 rounded-lg"><MessageSquare size={24} /></div>
                <span className="font-medium">Conversas</span>
            </div>
            <div className="text-4xl font-bold text-slate-100 mb-1">{stats.chats}</div>
            <p className="text-sm text-slate-500">Sessões de sabedoria</p>
        </div>

        {/* Card Datasets */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Database size={100} />
            </div>
            <div className="flex items-center gap-3 mb-4 text-purple-400">
                <div className="p-2 bg-purple-500/10 rounded-lg"><Database size={24} /></div>
                <span className="font-medium">Papiros (Datasets)</span>
            </div>
            <div className="text-4xl font-bold text-slate-100 mb-1">{stats.datasets}</div>
            <p className="text-sm text-slate-500">Arquivos processados</p>
        </div>

        {/* Card Modelos */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-yellow-500/30 transition-all">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Cpu size={100} />
            </div>
            <div className="flex items-center gap-3 mb-4 text-yellow-500">
                <div className="p-2 bg-yellow-500/10 rounded-lg"><Cpu size={24} /></div>
                <span className="font-medium">Modelos Forjados</span>
            </div>
            <div className="text-4xl font-bold text-slate-100 mb-1">{stats.models}</div>
            <p className="text-sm text-slate-500">IAs personalizadas</p>
        </div>
      </div>

      {/* Ações Rápidas */}
      <h2 className="text-xl font-bold text-slate-100 mt-8 mb-4">Acesso Rápido</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="group relative bg-slate-900 border border-slate-800 hover:border-yellow-600/50 rounded-2xl p-6 transition-all hover:shadow-2xl hover:shadow-yellow-900/10">
          <div className="absolute top-6 right-6 p-2 bg-indigo-500/10 rounded-lg">
            <Sparkles className="text-indigo-400 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">Novo Treinamento</h3>
          <p className="text-slate-400 mb-6">Crie uma nova inteligência a partir dos seus dados.</p>
          <Link 
            href="/dashboard/training" 
            className="inline-flex items-center text-yellow-500 font-medium group-hover:gap-2 transition-all"
          >
            Ir para a Forja <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        <div className="group relative bg-slate-900 border border-slate-800 hover:border-yellow-600/50 rounded-2xl p-6 transition-all hover:shadow-2xl hover:shadow-yellow-900/10">
          <div className="absolute top-6 right-6 p-2 bg-blue-500/10 rounded-lg">
            <MessageSquare className="text-blue-400 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">Consultar Oráculo</h3>
          <p className="text-slate-400 mb-6">Teste seus modelos ou converse com Thoth.</p>
          <Link 
            href="/dashboard/chat" 
            className="inline-flex items-center text-yellow-500 font-medium group-hover:gap-2 transition-all"
          >
            Abrir Chat <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

      </div>
    </div>
  );
}