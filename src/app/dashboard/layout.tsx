"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { 
  MessageSquare, 
  Database, 
  Cpu, 
  LogOut, 
  Pyramid, 
  Settings,
  Menu,
  User
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Proteção básica de Rota (Client-side)
  useEffect(() => {
    const token = localStorage.getItem('thoth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // Função para saber se o link está ativo
  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { name: 'Oráculo (Chat)', icon: MessageSquare, path: '/dashboard/chat' },
    { name: 'Forja (Treino)', icon: Database, path: '/dashboard/training' },
    { name: 'Mercado (Modelos)', icon: Cpu, path: '/dashboard/models' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('thoth_token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans">
      
      {/* Sidebar (O Obelisco) */}
     <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-slate-900 border-r border-yellow-600/10 transition-all duration-300 flex flex-col fixed h-full z-20`}
      >
        
        {/* LOGO (AGORA CLICÁVEL) */}
        <div className="h-16 flex items-center justify-center border-b border-yellow-600/10">
            <Link 
                href="/dashboard" 
                className="flex items-center gap-3 font-bold text-xl tracking-tighter hover:scale-105 transition-transform cursor-pointer"
                title="Ir para o Painel Inicial"
            >
                <Pyramid className="text-yellow-500 w-8 h-8" />
                {isSidebarOpen && (
                    <span className="bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
                        THOTH
                    </span>
                )}
            </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group
                ${isActive(item.path) 
                  ? 'bg-yellow-600/10 text-yellow-500 border border-yellow-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
            >
              <item.icon size={20} className={isActive(item.path) ? "text-yellow-500" : "group-hover:text-yellow-400"} />
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-3 border-t border-yellow-600/10 space-y-2">
           <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-all"
          >
            <Menu size={20} />
            {isSidebarOpen && <span className="text-sm">Recolher</span>}
          </button>
          
          <Link 
            href="/dashboard/profile"
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-yellow-500 hover:bg-slate-800 rounded-lg transition-all group"
          >
            <div className="bg-slate-800 p-1 rounded group-hover:bg-yellow-600/20 transition-colors">
                <User size={18} />
            </div>
            {isSidebarOpen && (
              <div className="text-sm font-medium text-slate-200 flex items-center gap-2">
                <span>Minha Conta</span>
                <button 
                  className="px-2 py-1 text-xs bg-yellow-500 rounded"
                  onClick={(e) =>  {
                    e.stopPropagation(); 
                    router.push('/dashboard/plans')}}
                >
                  Fazer Upgrade
                </button>
              </div>
            )}
          </Link>
        </div>
      </aside>

      {/* Conteúdo Principal (O Papiro) */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
        {children}
      </main>
    </div>
  );
}