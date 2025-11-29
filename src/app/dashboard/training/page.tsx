"use client";

import React, { useState, useEffect } from 'react';
import { Upload, FileText, Database, Trash2, Zap, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import TrainingModal, { TrainingParams } from '../../../components/trainingModal';
import { toast } from 'sonner';
import { totalmem } from 'os';
// Definição do tipo de Dataset
type Dataset = {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  status: string;
};

export default function TrainingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [trainingLoading, setTrainingLoading] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDatasetForTraining, setSelectedDatasetForTraining] = useState<Dataset | null>(null);

  // Carregar lista de datasets ao abrir a página
  useEffect(() => {
    fetchDatasets();
  }, []);

  const openTrainingModal = (dataset: Dataset) => {
    setSelectedDatasetForTraining(dataset);
    setIsModalOpen(true);
  };

  const fetchDatasets = async () => {
    try {
      const token = localStorage.getItem('thoth_token');
      const response = await axios.get('http://localhost:3001/datasets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDatasets(response.data);
    } catch (error) {
      toast.error("Erro ao buscar papiros:", error);
    } finally {
      setLoadingList(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast('Deseja Reamlente apagar esse aquivo?', {
      description: 'Essa ação é irreversivel',
      action: {
        label: 'Apagar',
        onClick: async () => {
          try {
            const token = localStorage.getItem('thoth_token');
            await axios.delete(`http://localhost:3001/datasets/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        
            setDatasets(prev => prev.filter(d => d.id !== id));
            toast.success("Papiro destruído.");
          } catch (error) {
            toast.error("Erro ao deletar.");
          }
        }
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => console.log('Cancelado')
      }
    })
  };

  const confirmTrain = async (params: TrainingParams) => {
    if (!selectedDatasetForTraining) return;
    
    setIsModalOpen(false); // Fecha modal
    setTrainingLoading(selectedDatasetForTraining.id); // Inicia loading

    try {
        const token = localStorage.getItem('thoth_token');
        
        await axios.post('http://localhost:3001/models/train', {
            datasetId: selectedDatasetForTraining.id,
            name: `Thoth ${params.baseModel} - ${selectedDatasetForTraining.name}`,
            // ENVIANDO OS PARÂMETROS NOVOS PRO BACKEND
            baseModel: params.baseModel,
            epochs: params.epochs,
            learningRate: params.learningRate
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.success("O Ritual começou com suas configurações personalizadas!");
    } catch (error) {
        toast.error("Erro ao iniciar.");
    } finally {
        setTrainingLoading(null);
        setSelectedDatasetForTraining(null);
    }
  };

  const handleTrain = async (dataset: Dataset) => {
    if(!confirm(`Deseja iniciar o treinamento usando ${dataset.name}?`)) return;

    setTrainingLoading(dataset.id);
    try {
        const token = localStorage.getItem('thoth_token');
        await axios.post('http://localhost:3001/models/train', {
            datasetId: dataset.id,
            name: `Thoth Llama - ${dataset.name}`, // Nome automático por enquanto
            baseModel: 'llama-3-8b'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.success("O Ritual começou! Verifique a aba de Modelos.");
        // Opcional: Redirecionar para uma página de "Meus Modelos"
    } catch (error) {
        toast.error("Erro ao iniciar o treino.");
    } finally {
        setTrainingLoading(null);
    }
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file); // 'file' deve bater com o upload.single('file') do backend

    try {
      const token = localStorage.getItem('thoth_token');
      await axios.post('http://localhost:3001/datasets/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' // Importante para envio de arquivos
        }
      });
      
      // Limpa e recarrega a lista
      setFile(null);
      fetchDatasets();
      toast.success("Oferenda de conhecimento aceita!");
    } catch (error) {
      alert("Falha ao enviar o papiro.");
    } finally {
      setUploading(false);
    }
  };

  // Função auxiliar para formatar tamanho do arquivo
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">A Forja de Modelos</h1>
        <p className="text-slate-400">
          Envie pergaminhos (arquivos) para treinar novos modelos de inteligência.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna da Esquerda: Área de Upload */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-8">
            <h2 className="text-lg font-bold text-yellow-500 mb-4 flex items-center gap-2">
              <Upload size={20} /> Novo Conhecimento
            </h2>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-700 hover:border-yellow-600/50 rounded-xl p-8 text-center transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".txt,.jsonl,.pdf,.md" // Tipos aceitos
                />
                
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                    {file ? <FileText className="text-yellow-500" /> : <Database />}
                  </div>
                  {file ? (
                    <div className="text-sm text-yellow-500 font-medium break-all">
                      {file.name}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400">
                      <span className="text-slate-200 font-medium">Clique para escolher</span>
                      <br /> ou arraste o arquivo aqui
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Enviando...
                  </>
                ) : (
                  'Carregar para a Forja'
                )}
              </button>
            </form>

            <div className="mt-6 text-xs text-slate-500">
              <p>Formatos aceitos: .txt, .jsonl, .md</p>
              <p>Tamanho máximo: 10MB</p>
            </div>
          </div>
        </div>

        {/* Coluna da Direita: Lista de Datasets */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Database size={20} className="text-slate-400" /> Papiros Arquivados
          </h2>

          {loadingList ? (
            <div className="text-center py-12 text-slate-500 animate-pulse">Consultando os arquivos...</div>
          ) : datasets.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              Nenhum conhecimento arquivado ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {datasets.map((dataset) => (
                <div key={dataset.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between group hover:border-yellow-600/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="text-slate-200 font-medium">{dataset.name}</h3>
                      <p className="text-xs text-slate-500">
                        {formatBytes(dataset.size)} • {new Date(dataset.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full border border-green-500/20 flex items-center gap-1">
                      <CheckCircle size={12} /> Pronto
                    </span>
                    <button 
                        onClick={() => openTrainingModal(dataset)}
                        disabled={!!trainingLoading}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded flex items-center gap-2 transition-colors"
                    >
                        {trainingLoading === dataset.id ? (
                            <Loader2 className="animate-spin" size={14} />
                        ) : (
                            <>
                                <Zap size={14} /> Treinar
                            </>
                        )}
                    </button>
                    <button className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                    onClick={() => handleDelete(dataset.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    <TrainingModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)}
      datasetName={selectedDatasetForTraining?.name || ''}
      onConfirm={confirmTrain}
    />
    </div>
  );
}