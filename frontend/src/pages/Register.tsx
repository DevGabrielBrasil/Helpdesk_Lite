import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Loading } from '../components/Loading';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !email || password.length < 6) {
      setError('Preencha todos os campos corretamente. Senha mínimo 6 caracteres.');
      return;
    }
    try {
      setLoading(true);
      await api.post('/auth/register', { name, email, password });
      alert('Cadastro realizado com sucesso! Agora faça seu login.');
      navigate('/'); // Volta para a tela de login
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-50 p-6">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Criar Conta</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Comece a gerenciar seus chamados agora</p>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha (mín. 6 caracteres)</label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60"
          >
            {loading ? <Loading /> : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">Faça Login</Link>
        </p>
      </div>
    </div>
  );
}