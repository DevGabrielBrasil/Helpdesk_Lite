export function Loading({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mr-3" />
      <div className="text-gray-600">{message}</div>
    </div>
  );
}
