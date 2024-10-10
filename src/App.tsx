import React, { useState } from 'react';
import { Book, Library, Upload } from 'lucide-react';
import ParentDashboard from './components/ParentDashboard';
import ChildViewer from './components/ChildViewer';

function App() {
  const [view, setView] = useState<'parent' | 'child'>('parent');

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Book className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">Libros Mágicos</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setView('parent')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  view === 'parent' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Upload className="inline-block mr-1 h-5 w-5" />
                Panel de Padres
              </button>
              <button
                onClick={() => setView('child')}
                className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                  view === 'child' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Library className="inline-block mr-1 h-5 w-5" />
                Biblioteca Infantil
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {view === 'parent' ? <ParentDashboard /> : <ChildViewer />}
      </main>
    </div>
  );
}

export default App;