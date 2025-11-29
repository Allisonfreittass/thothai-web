import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thoth AI | Forja de Inteligência",
  description: "Plataforma de criação e treinamento de modelos de IA baseados em Llama e GPT.",
  icons: {
    icon: '/icon.svg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} bg-slate-950 text-slate-100`}>
        {children}
        
        {/* 2. ADICIONE O COMPONENTE AQUI NO FINAL */}
        {/* Configurado para ficar preto/dourado igual ao site */}
        <Toaster 
          position="top-right" 
          theme="dark"
          richColors
          toastOptions={{
            style: {
              background: '#0f172a', // Slate-950
              border: '1px solid rgba(202, 138, 4, 0.2)', // Borda Dourada sutil
              color: '#f1f5f9',
            },
            className: 'class-thoth-toast',
          }}
        />
        
      </body>
    </html>
  );
}