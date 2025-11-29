"use client";

import React, { useState, useEffect } from 'react';
import { Cpu, Box, Clock, CheckCircle, XCircle, Loader2, RefreshCw, Download } from 'lucide-react';
import axios from 'axios';

type Model = {
  id: string;
  name: string;
  status: 'pending' | 'training' | 'completed' | 'failed';
  baseModel: string;
  createdAt: string;
  dataset: {
    name: string;
  };
};

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('thoth_token');
      const response = await axios.get('http://localhost:3001/models', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModels(response.data);
    } catch (error) {
      console.error("Erro ao buscar modelos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
    
    // Auto-refresh a cada 5 segundos para ver se o treino acabou
    const interval = setInterval(fetchModels, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="flex items-center gap-1 text-green-400 bg-green-900/30 px-2 py-1 rounded text-xs border border-green-500/20"><CheckCircle size={12}/> Concluído</span>;
      case 'training':
        return <span className="flex items-center gap-1 text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded text-xs border border-yellow-500/20"><Loader2 size={12} className="animate-spin"/> Treinando</span>;
      case 'failed':
        return <span className="flex items-center gap-1 text-red-400 bg-red-900/30 px-2 py-1 rounded text-xs border border-red-500/20"><XCircle size={12}/> Falha</span>;
      default:
        return <span className="flex items-center gap-1 text-slate-400 bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700"><Clock size={12}/> Pendente</span>;
    }
  };

  const handleDownload = async (model: Model) => {
    try {
      const token = localStorage.getItem('thoth_token');
      
      // Axios precisa saber que vai receber um arquivo binário (blob)
      const response = await axios.get(`http://localhost:3001/models/${model.id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      // Truque do navegador para iniciar download forçado
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      // Nome do arquivo sugerido
      link.setAttribute('download', `${model.name}.gguf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erro ao baixar", error);
      alert("Erro ao exportar o modelo.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Galeria de Modelos</h1>
          <p className="text-slate-400">Gerencie suas IAs treinadas e prontas para uso.</p>
        </div>
        <button onClick={fetchModels} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
            <RefreshCw size={20} />
        </button>
      </div>

      {loading && models.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
            <Loader2 className="animate-spin mx-auto mb-4" size={32} />
            Consultando o oráculo...
        </div>
      ) : models.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
            <Cpu className="mx-auto w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-xl font-medium text-slate-300">Nenhum modelo forjado ainda</h3>
            <p className="text-slate-500 mt-2">Vá até a aba de Treinamento para criar sua primeira IA.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
                <div key={model.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-yellow-600/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Cpu size={100} />
                    </div>
                    
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
                            <Box size={20} />
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(model.status)}
                            
                            {model.status === 'completed' && (
                                <button 
                                    onClick={() => handleDownload(model)}
                                    className="flex items-center gap-1 text-xs bg-yellow-600 hover:bg-yellow-500 text-slate-900 px-2 py-1 rounded font-bold transition-colors"
                                    title="Exportar Modelo Treinado"
                                >
                                    <Download size={12} /> Exportar .GGUF
                                </button>
                            )}
                        </div>
                    </div>
                    

                    <h3 className="text-lg font-bold text-slate-100 mb-1">{model.name}</h3>
                    <p className="text-xs text-slate-500 mb-4">Base: {model.baseModel}</p>

                    <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col gap-2">
                        <div className="flex justify-between">
                            <span>Dataset:</span>
                            <span className="text-slate-300">{model.dataset?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Criado em:</span>
                            <span>{new Date(model.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}