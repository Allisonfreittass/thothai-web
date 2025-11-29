"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Pyramid, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/auth/login', formData);
      
      localStorage.setItem('thoth_token', response.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao entrar no templo.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-600 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-900 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-yellow-600/20 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        
        <div className="p-8 text-center border-b border-yellow-600/10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-600/10 mb-4 border border-yellow-600/30">
            <Pyramid className="w-6 h-6 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">THOTH AI</h1>
          <p className="text-slate-400 text-sm mt-2">Acesse a sabedoria dos modelos.</p>
        </div>

        <div className="p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/30 rounded text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-yellow-500/80 uppercase tracking-wider mb-2">
                E-mail
              </label>
              <input 
                name="email"
                type="email" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-yellow-600/50 focus:ring-1 focus:ring-yellow-600/50 transition-all placeholder-slate-600"
                placeholder="iniciado@thoth.ai"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-yellow-500/80 uppercase tracking-wider mb-2">
                Senha
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
              className="w-full bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-slate-950 font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {loading ? 'Decifrando...' : (
                <>
                  Entrar no Templo <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Ainda não é um iniciado?{' '}
              <Link href="/register" className="text-yellow-500 hover:text-yellow-400 font-medium hover:underline">
                Inscreva-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}