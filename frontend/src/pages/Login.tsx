import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Loading } from '../components/Loading';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Preencha e-mail e senha');
      return;
    }

    try {
      setLoading(true);
      await signIn({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-50 p-6">
      <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-gray-800">Helpdesk Lite</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Gerencie seus chamados com rapidez e simplicidade</p>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <div className="space-y-4">
          <input 
            type="email" placeholder="E-mail" 
            className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Senha" 
            className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <Loading /> : 'Entrar'}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Não tem conta? <Link to="/register" className="text-indigo-600 font-medium hover:underline">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}