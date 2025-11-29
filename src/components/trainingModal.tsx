import React, { useState } from 'react';
import { X, Zap, Sliders, Info } from 'lucide-react';

type TrainingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (params: TrainingParams) => void;
  datasetName: string;
};

export type TrainingParams = {
  epochs: number;
  learningRate: number;
  baseModel: string;
};

export default function TrainingModal({ isOpen, onClose, onConfirm, datasetName }: TrainingModalProps) {
  if (!isOpen) return null;

  const [params, setParams] = useState<TrainingParams>({
    epochs: 3,
    learningRate: 0.0002,
    baseModel: 'llama-3-8b'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sliders size={20} className="text-yellow-500"/> Configurar Ritual
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="text-sm text-slate-400 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            Treinando com o papiro: <span className="text-yellow-500 font-bold">{datasetName}</span>
          </div>

          {/* Epochs Slider */}
          <div>
            <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">Épocas (Epochs)</label>
                <span className="text-xs text-yellow-500 font-bold bg-yellow-900/20 px-2 py-0.5 rounded">{params.epochs}</span>
            </div>
            <input 
                type="range" min="1" max="10" step="1"
                value={params.epochs}
                onChange={(e) => setParams({...params, epochs: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Quantas vezes a IA lerá os dados. (Padrão: 3)</p>
          </div>

          {/* Learning Rate Select */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Taxa de Aprendizado</label>
            <select 
                value={params.learningRate}
                onChange={(e) => setParams({...params, learningRate: parseFloat(e.target.value)})}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:border-yellow-500 focus:outline-none"
            >
                <option value={0.0001}>0.0001 (Lento & Preciso)</option>
                <option value={0.0002}>0.0002 (Equilibrado)</option>
                <option value={0.0005}>0.0005 (Rápido)</option>
            </select>
          </div>

          {/* Base Model */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Modelo Base</label>
            <div className="grid grid-cols-2 gap-2">
                <button 
                    onClick={() => setParams({...params, baseModel: 'llama-3-8b'})}
                    className={`p-3 rounded-lg border text-xs font-bold transition-all ${params.baseModel === 'llama-3-8b' ? 'bg-yellow-600/20 border-yellow-500 text-yellow-500' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                >
                    Llama 3 (8B)
                    <span className="block text-[9px] font-normal opacity-70 mt-1">Rápido / Leve</span>
                </button>
                <button 
                    onClick={() => setParams({...params, baseModel: 'mistral-7b'})}
                    className={`p-3 rounded-lg border text-xs font-bold transition-all ${params.baseModel === 'mistral-7b' ? 'bg-yellow-600/20 border-yellow-500 text-yellow-500' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                >
                    Mistral (7B)
                    <span className="block text-[9px] font-normal opacity-70 mt-1">Lógico / Código</span>
                </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
            <button 
                onClick={() => onConfirm(params)}
                className="bg-yellow-600 hover:bg-yellow-500 text-slate-900 font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-yellow-500/20"
            >
                <Zap size={18} /> Iniciar Treino
            </button>
        </div>

      </div>
    </div>
  );
}