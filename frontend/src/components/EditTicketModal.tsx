import { useState, useEffect } from 'react';
import api from '../services/api';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ticket: { id: string; title: string; description?: string; status?: string } | null;
  inline?: boolean;
  anchorTop?: number | null;
}

export function EditTicketModal({ isOpen, onClose, onSuccess, ticket, inline = false, anchorTop = null }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('OPEN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ticket) {
      setTitle(ticket.title || '');
      setDescription(ticket.description || '');
      setStatus((ticket.status as string) || 'OPEN');
    }
  }, [ticket]);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let t: NodeJS.Timeout | undefined;
    if (isOpen) {
      setVisible(true);
    } else {
      t = setTimeout(() => setVisible(false), 300);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [isOpen]);

  if ((!isOpen && !visible) || !ticket) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (title.trim().length < 3) {
      setError('O título deve ter no mínimo 3 caracteres');
      return;
    }
    try {
      setLoading(true);
      await api.patch(`/tickets/${ticket.id}`, { title, description, status });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar ticket');
    } finally {
      setLoading(false);
    }
  }

  const panelStyle: React.CSSProperties = inline
    ? { maxHeight: '80vh', overflow: 'auto' }
    : { height: '100%' };

  const panel = (
    <div className={`flex flex-col bg-white/95 backdrop-blur-sm shadow-2xl border-l border-gray-100 p-6 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} style={panelStyle}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Editar Chamado</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {error && <div className="mb-2 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
              <textarea
                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 h-40"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none"
              >
                <option value="OPEN">Aberto</option>
                <option value="IN_PROGRESS">Em Andamento</option>
                <option value="DONE">Concluído</option>
              </select>
            </div>

            <div className="mt-auto flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">
                Cancelar
              </button>
            </div>
          </form>
        </div>
    );

  if (inline) {
    const topStyle = typeof anchorTop === 'number' ? { top: anchorTop } : { top: '50%', transform: 'translateY(-50%)' };
    return (
      <div style={{ position: 'absolute', right: 0, width: '24rem', zIndex: 60, pointerEvents: 'auto', ...topStyle }}>
        {panel}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="fixed top-0 right-0 pointer-events-auto" style={{ top: 0, right: 0, height: '100%', width: '24rem' }}>
        {panel}
      </div>
    </div>
  );
}
