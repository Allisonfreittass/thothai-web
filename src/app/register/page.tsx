"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Pyramid, UserPlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/auth/register', formData);
      router.push('/login');
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar o iniciado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-yellow-600 rounded-full blur-[100px]"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-900 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-yellow-600/20 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Header */}
        <div className="p-8 pb-4 text-center border-b border-yellow-600/10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-600/10 mb-4 border border-yellow-600/30">
            <Pyramid className="w-6 h-6 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Junte-se ao Thoth</h1>
          <p className="text-slate-400 text-sm mt-2">Inicie sua jornada na criação de IAs.</p>
        </div>

        {/* Form */}
        <div className="p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/30 rounded text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-yellow-500/80 uppercase tracking-wider mb-2">
                Nome do Iniciado
              </label>
              <input 
                name="name"
                type="text" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-yellow-600/50 focus:ring-1 focus:ring-yellow-600/50 transition-all placeholder-slate-600"
                placeholder="Seu Nome"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-yellow-500/80 uppercase tracking-wider mb-2">
                E-mail
              </label>
              <input 
                name="email"
                type="email" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-yellow-600/50 focus:ring-1 focus:ring-yellow-600/50 transition-all placeholder-slate-600"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-yellow-500/80 uppercase tracking-wider mb-2">
                Senha Mestra
              </label>
              <div className="relative">
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-yellow-600/50 focus:ring-1 focus:ring-yellow-600/50 transition-all placeholder-slate-600"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-yellow-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-slate-950 font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {loading ? 'Gravando nas pedras...' : (
                <>
                  Criar Conta <UserPlus size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Já possui acesso?{' '}
              <Link href="/login" className="text-yellow-500 hover:text-yellow-400 font-medium hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}