import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

type Ticket = {
  id: string;
  title: string;
  description?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
  updatedAt: string;
};

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Ticket['status']>('OPEN');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.get(`/tickets/${id}`);
        setTicket(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description || '');
        setStatus(res.data.status);
      } catch (err) {
        alert('Erro ao carregar o ticket');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, navigate]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (title.trim().length < 3) {
      setError('O título deve ter no mínimo 3 caracteres');
      return;
    }
    try {
      setSaving(true);
      await api.patch(`/tickets/${id}`, { title, description, status });
      alert('Ticket atualizado com sucesso');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar ticket');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8">Carregando...</div>;
  if (!ticket) return <div className="p-8">Ticket não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white/95 p-6 rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-4">Detalhe do Ticket</h2>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md h-32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="OPEN">Aberto</option>
              <option value="IN_PROGRESS">Em Andamento</option>
              <option value="DONE">Concluído</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={async () => {
                if (confirm('Deseja realmente excluir este ticket?')) {
                  try {
                    await api.delete(`/tickets/${id}`);
                    navigate('/dashboard');
                  } catch (err) {
                    alert('Erro ao excluir ticket');
                  }
                }
              }}
              className="px-4 py-2 rounded-md border text-red-600 hover:bg-red-50"
            >
              Excluir
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-md border"
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
