import { useEffect, useState, useContext, useRef } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Plus, Search, Filter, Trash2, LogOut, User as UserIcon, Edit } from 'lucide-react';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { EditTicketModal } from '../components/EditTicketModal';

interface Ticket {
  id: string;
  title: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
}

export function Dashboard() {
  const { user, signOut } = useContext(AuthContext);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<any | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const ticketsRef = useRef<HTMLDivElement | null>(null);
  const [anchorTop, setAnchorTop] = useState<number | null>(null);

  async function loadTickets() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/tickets', {
        params: { status, search } // Alterado para bater com o log de erro da sua imagem
      });
      setTickets(response.data);
    } catch (error) {
      console.error('Erro ao carregar tickets', error);
      setError('Erro ao carregar seus chamados');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadTickets();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [status, search]);

  async function handleDelete(id: string) {
    if (confirm("Deseja realmente excluir este ticket?")) {
      try {
        await api.delete(`/tickets/${id}`);
        loadTickets();
      } catch (error) {
        alert("Erro ao excluir ticket");
      }
    }
  }

  useEffect(() => {
    function updateAnchor() {
      if (!mainRef.current || !ticketsRef.current) return;
      const mainRect = mainRef.current.getBoundingClientRect();
      const ticketsRect = ticketsRef.current.getBoundingClientRect();
      setAnchorTop(ticketsRect.top - mainRect.top);
    }
    updateAnchor();
    window.addEventListener('resize', updateAnchor);
    return () => window.removeEventListener('resize', updateAnchor);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <span>Helpdesk Lite</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              <UserIcon size={16} className="text-gray-500" />
              <span className="text-sm font-medium">{user?.name || 'Usuário'}</span>
            </div>
            <button 
              onClick={signOut}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-semibold transition"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main ref={(el) => (mainRef.current = el)} className="relative p-6 md:p-10 container-max mx-auto">
        <div className="relative mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Painel de Chamados</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
            >
              <Plus size={20} /> Abrir Novo Ticket
            </button>
          </div>

          <CreateTicketModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={loadTickets}
            inline
            anchorTop={anchorTop}
          />

          <EditTicketModal
            isOpen={!!editingTicket}
            ticket={editingTicket}
            onClose={() => setEditingTicket(null)}
            onSuccess={() => { setEditingTicket(null); loadTickets(); }}
            inline
            anchorTop={anchorTop}
          />

          {(isModalOpen || !!editingTicket) && (
            <div
              className="absolute inset-0 bg-black/10 z-30"
              onClick={() => { setIsModalOpen(false); setEditingTicket(null); }}
            />
          )}
        </div>

        {/* FILTROS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar por título..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={18} />
            <select
              className="w-full p-2.5 border border-gray-300 rounded-lg outline-none bg-white cursor-pointer focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Todos os Status</option>
              <option value="OPEN">Aberto</option>
              <option value="IN_PROGRESS">Em Andamento</option>
              <option value="DONE">Concluído</option>
            </select>
          </div>
        </div>

        {/* LISTA DE TICKETS */}
        <div ref={(el) => (ticketsRef.current = el)} className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-gray-500 animate-pulse">Carregando seus chamados...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : tickets.length === 0 ? (
            <div className="p-20 text-center text-gray-400">Nenhum ticket encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Título</th>
                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider text-center">Status</th>
                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-blue-50/40 transition">
                      <td className="p-4 text-gray-800 font-medium">
                        {/* AQUI: O Link foi removido para mostrar apenas o texto do título */}
                        {ticket.title}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight ${
                          ticket.status === 'DONE' ? 'bg-green-100 text-green-700' :
                          ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {ticket.status === 'OPEN' ? 'Aberto' : 
                           ticket.status === 'IN_PROGRESS' ? 'Em Progresso' : 'Concluído'}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => setEditingTicket(ticket)}
                          title="Editar"
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(ticket.id)}
                          title="Excluir"
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}