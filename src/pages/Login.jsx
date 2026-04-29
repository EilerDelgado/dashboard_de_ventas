import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import logo from '../assets/perfil_chopper.png' 

export const Login = () => {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async () => {
    setError('')
    if (!email || !password) { setError('Completa todos los campos'); return }
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError(err.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <img src={logo} alt="logo" className="w-12 h-12 object-contain mx-auto mb-4" />
          <h1 className="font-display font-bold text-2xl text-white">Streaming Chopper</h1>
          <p className="text-gray-500 text-sm mt-1">Panel de administración</p>
        </div>

        <div className="bg-surface-900 border border-white/5 rounded-2xl p-6 space-y-4">
          <Input
            label="Correo"
            type="email"
            placeholder="admin@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button className="w-full justify-center" onClick={handleLogin} disabled={loading}>
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </Button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          Solo administradores autorizados
        </p>
      </div>
    </div>
  )
}
