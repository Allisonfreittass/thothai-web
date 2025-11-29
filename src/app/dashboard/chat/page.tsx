"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, User, Sparkles, ChevronDown, MessageSquare, Plus, Trash2, Menu, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

// --- TIPOS ---
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type Model = {
  id: string;
  name: string;
  status: string;
};

type Conversation = {
  id: string;
  title: string;
  updatedAt: string;
};

export default function ChatPage() {
  // --- STATES ---
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Responsividade mobile
  const router = useRouter();
  
  // Dados
  const [messages, setMessages] = useState<Message[]>([]);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  // Seleções
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [conversationId, setConversationId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // --- EFEITOS (Carregamento Inicial) ---
  useEffect(() => {
    fetchModels();
    fetchHistory();
  }, []);

  // Auto-scroll para baixo quando chega mensagem nova
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // --- FUNÇÕES DE BUSCA ---
  const fetchModels = async () => {
    try {
      const token = localStorage.getItem('thoth_token');
      const res = await axios.get('http://localhost:3001/models', {
         headers: { Authorization: `Bearer ${token}` }
      });
      // Só mostra modelos prontos
      setAvailableModels(res.data.filter((m: any) => m.status === 'completed'));
    } catch (error) {
      console.error("Erro ao buscar modelos", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('thoth_token');
      const res = await axios.get('http://localhost:3001/conversations', {
         headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data);
    } catch (error) {
      console.error("Erro ao buscar histórico", error);
    }
  };

  // --- AÇÕES DO USUÁRIO ---

  // 1. Carregar uma conversa antiga
  const loadConversation = async (id: string) => {
    setLoading(true);
    setConversationId(id);
    // Em telas pequenas, fecha a sidebar ao selecionar
    if (window.innerWidth < 768) setSidebarOpen(false); 

    try {
        const token = localStorage.getItem('thoth_token');
        const res = await axios.get(`http://localhost:3001/conversations/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data.messages || []);
        
        // Se a conversa tinha um modelo específico, poderíamos setar aqui também
        // if(res.data.modelId) setSelectedModel(res.data.modelId);

    } catch (error) {
        console.error("Erro ao carregar chat", error);
    } finally {
        setLoading(false);
    }
  };

  // 2. Criar Nova Conversa (Limpa a tela)
  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setSidebarOpen(false); // No mobile melhora a UX
  };

  // 3. Deletar Conversa
const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 

    toast('Deseja apagar esta memória?', {
      description: 'Essa ação é irreversível.',
      action: {
        label: 'Apagar',
        onClick: async () => {
             // A LÓGICA DE DELETAR VEM PRA CÁ
             try {
                const token = localStorage.getItem('thoth_token');
                await axios.delete(`http://localhost:3001/conversations/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setConversations(prev => prev.filter(c => c.id !== id));
                if (conversationId === id) handleNewChat();
                
                toast.success('Memória apagada com sucesso.');
            } catch (error) {
                toast.error('Erro ao apagar memória.');
            }
        },
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => console.log('Cancelado'),
      },
    });
  };

  // 4. Enviar Mensagem
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Adiciona msg do usuário visualmente na hora (Otimista)
    const tempUserMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, tempUserMsg]);
    const messageToSend = input;
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('thoth_token');
      
      const response = await axios.post('http://localhost:3001/chat/message', {
        message: messageToSend,
        modelId: selectedModel || null,
        conversationId: conversationId // Manda null se for novo, ou ID se já existe
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Backend retorna a resposta E o ID da conversa (se foi criada agora)
      const { reply, conversationId: newConvId } = response.data;

      // Adiciona resposta da IA
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: reply 
      };
      setMessages(prev => [...prev, aiMsg]);

      // Se era chat novo, atualiza o ID e recarrega a lista lateral
      if (!conversationId && newConvId) {
        setConversationId(newConvId);
        fetchHistory(); // Atualiza a sidebar para mostrar o novo chat
      }

    } catch (error) {
      if (error.response?.data?.error === 'LIMIT_REACHED') {
        toast('Limite de sabedoria atingido!', {
            description: 'Torne-se um Faraó para continuar conversando sem limites.',
            action: {
                label: 'Fazer Upgrade',
                onClick: () => router.push('/dashboard/plans') // Manda pra tela de planos
            },
            duration: 8000, // Fica mais tempo na tela
            style: { border: '1px solid #eab308' } // Borda amarela de alerta
        });
        
        // Remove a mensagem do usuário que não foi enviada (opcional, mas visualmente melhor)
        setMessages(prev => prev.slice(0, -1)); 
      } else {
        // Erro genérico
        const errorMsg: Message = { 
            id: Date.now().toString(), 
            role: 'assistant', 
            content: 'Houve uma perturbação na conexão.' 
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] gap-4 overflow-hidden relative">
      
      {/* --- SIDEBAR DE HISTÓRICO --- */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:bg-transparent md:border-none md:w-80 md:flex md:flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Botão Novo Chat */}
        <button 
            onClick={handleNewChat}
            className="w-full mb-4 flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-yellow-900/20"
        >
            <Plus size={20} /> Nova Conversa
        </button>

        {/* Lista de Conversas */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
            {conversations.length === 0 && (
                <div className="text-center text-slate-500 text-sm mt-10">
                    Nenhuma memória encontrada.
                </div>
            )}
            
            {conversations.map(chat => (
                <div 
                    key={chat.id}
                    onClick={() => loadConversation(chat.id)}
                    className={`
                        group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border
                        ${conversationId === chat.id 
                            ? 'bg-slate-800 border-yellow-600/30 text-yellow-500' 
                            : 'bg-slate-900/50 border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                    `}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <MessageSquare size={18} className="shrink-0" />
                        <span className="text-sm truncate font-medium">{chat.title}</span>
                    </div>
                    
                    <button 
                        onClick={(e) => handleDeleteChat(e, chat.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
        </div>
      </div>

      {/* Overlay para fechar sidebar no mobile */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- ÁREA PRINCIPAL DO CHAT --- */}
      <div className="flex-1 flex flex-col bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden relative">
        
        {/* Header do Chat */}
        <div className="bg-slate-950 border-b border-slate-800 p-3 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
                {/* Botão Toggle Sidebar (Mobile) */}
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-slate-400">
                    {sidebarOpen ? <X /> : <Menu />}
                </button>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Bot size={18} />
                    <span className="hidden sm:inline">Modelo:</span>
                </div>
                
                <div className="relative">
                    <select 
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-48 sm:w-64 p-2 appearance-none cursor-pointer"
                    >
                        <option value="">Thoth (Padrão)</option>
                        {availableModels.map(model => (
                            <option key={model.id} value={model.id}>
                                {model.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-slate-500 pointer-events-none" size={14} />
                </div>
            </div>
        </div>

        {/* Lista de Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                    <Sparkles size={48} className="mb-4 text-yellow-600" />
                    <p>O oráculo aguarda sua pergunta...</p>
                </div>
            ) : (
                messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex items-start gap-3 sm:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                    <div className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0
                    ${msg.role === 'user' ? 'bg-yellow-600/20 text-yellow-500' : 'bg-indigo-500/10 text-indigo-400'}
                    `}>
                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>

                    <div className={`
                    max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-sm leading-relaxed whitespace-pre-wrap
                    ${msg.role === 'user' 
                        ? 'bg-yellow-600/10 border border-yellow-600/20 text-slate-100 rounded-tr-none' 
                        : 'bg-slate-800 border border-slate-700 text-slate-300 rounded-tl-none'}
                    `}>
                    <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-yellow-500">
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                    </div>
                </div>
                ))
            )}
            
            {loading && (
                <div className="flex items-start gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                        <Sparkles size={20} />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-slate-500 text-sm">
                        Consultando os papiros...
                    </div>
                </div>
            )}
            <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
            <form onSubmit={handleSend} className="relative flex items-center gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte ao oráculo..."
                disabled={loading}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-4 text-slate-100 focus:outline-none focus:border-yellow-600/50 focus:ring-1 focus:ring-yellow-600/50 placeholder-slate-600 transition-all"
            />
            <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 p-2 bg-yellow-600 hover:bg-yellow-500 text-slate-900 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Send size={20} />
            </button>
            </form>
        </div>
      </div>
    </div>
  );
}