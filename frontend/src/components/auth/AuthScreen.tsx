import { motion } from 'framer-motion';
import { LogIn, User as UserIcon } from 'lucide-react';

interface AuthScreenProps {
  loginWithGoogle: () => void;
  loginAsGuest: () => void;
}

export function AuthScreen({ loginWithGoogle, loginAsGuest }: AuthScreenProps) {
  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-black text-white flex items-center justify-center font-sans p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 max-w-md w-full text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-3xl shadow-[0_0_20px_rgba(59,130,246,0.6)] mb-6">
          IQ
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Stadium<span className="text-blue-400">IQ</span>
        </h1>
        <p className="text-zinc-400 mb-10 text-sm">FIFA World Cup 2026 Smart Platform</p>

        <div className="space-y-4">
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 glass py-3 rounded-lg hover:bg-white/10 transition-colors font-medium border-white/20"
          >
            <LogIn size={18} />
            Sign in with Google
          </button>
          <button
            onClick={loginAsGuest}
            className="w-full flex items-center justify-center gap-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 py-3 rounded-lg hover:bg-blue-600/30 transition-colors font-medium"
          >
            <UserIcon size={18} />
            Continue as Guest Fan
          </button>
        </div>
      </motion.div>
    </div>
  );
}
