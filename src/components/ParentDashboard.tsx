import React, { useState, useEffect } from 'react';
import { Upload, Image, Save, Plus, Trash2 } from 'lucide-react';

const ParentDashboard: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [bookTitle, setBookTitle] = useState('');
  const [pages, setPages] = useState<{ text: string; image: string }[]>([{ text: '', image: '' }]);
  const [currentPage, setCurrentPage] = useState(0);
  const [coverColor, setCoverColor] = useState('#8B4513'); // Color marrón por defecto

  useEffect(() => {
    const savedBooks = localStorage.getItem('savedBooks');
    if (savedBooks) {
      const parsedBooks = JSON.parse(savedBooks);
      setBooks(parsedBooks);
      if (parsedBooks.length > 0) {
        setCurrentBookIndex(0);
      }
    }
  }, []);

  useEffect(() => {
    if (books.length > 0 && currentBookIndex < books.length) {
      const currentBook = books[currentBookIndex];
      setBookTitle(currentBook.title || '');
      setPages(currentBook.pages || [{ text: '', image: '' }]);
      setCoverColor(currentBook.coverColor || '#8B4513');
    } else {
      // Reset state if there are no books or invalid index
      setBookTitle('');
      setPages([{ text: '', image: '' }]);
      setCoverColor('#8B4513');
    }
  }, [currentBookIndex, books]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPages = [...pages];
        newPages[currentPage] = { ...newPages[currentPage], image: reader.result as string };
        setPages(newPages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPages = [...pages];
    newPages[currentPage] = { ...newPages[currentPage], text: event.target.value };
    setPages(newPages);
  };

  const handleSaveBook = () => {
    const updatedBooks = [...books];
    const bookToSave = { title: bookTitle, pages, coverColor };
    if (currentBookIndex < books.length) {
      updatedBooks[currentBookIndex] = bookToSave;
    } else {
      updatedBooks.push(bookToSave);
    }
    setBooks(updatedBooks);
    localStorage.setItem('savedBooks', JSON.stringify(updatedBooks));
    alert('Libro guardado exitosamente!');
  };

  const addNewBook = () => {
    setCurrentBookIndex(books.length);
    setBookTitle('');
    setPages([{ text: '', image: '' }]);
    setCurrentPage(0);
    setCoverColor('#8B4513');
  };

  const deleteCurrentBook = () => {
    if (books.length > 0) {
      const updatedBooks = books.filter((_, index) => index !== currentBookIndex);
      setBooks(updatedBooks);
      localStorage.setItem('savedBooks', JSON.stringify(updatedBooks));
      if (currentBookIndex >= updatedBooks.length) {
        setCurrentBookIndex(Math.max(0, updatedBooks.length - 1));
      }
    }
  };

  const addNewPage = () => {
    setPages([...pages, { text: '', image: '' }]);
    setCurrentPage(pages.length);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      addNewPage();
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Panel de Control para Padres</h2>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => setCurrentBookIndex(Math.max(0, currentBookIndex - 1))}
            disabled={currentBookIndex === 0 || books.length === 0}
            className="mr-2 px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            &lt;
          </button>
          <span>Libro {books.length > 0 ? currentBookIndex + 1 : 0} de {books.length}</span>
          <button
            onClick={() => setCurrentBookIndex(Math.min(books.length - 1, currentBookIndex + 1))}
            disabled={currentBookIndex === books.length - 1 || books.length === 0}
            className="ml-2 px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
        <div>
          <button
            onClick={addNewBook}
            className="mr-2 px-3 py-1 bg-green-500 text-white rounded flex items-center"
          >
            <Plus size={16} className="mr-1" /> Nuevo Libro
          </button>
          <button
            onClick={deleteCurrentBook}
            disabled={books.length === 0}
            className="px-3 py-1 bg-red-500 text-white rounded flex items-center disabled:opacity-50"
          >
            <Trash2 size={16} className="mr-1" /> Eliminar Libro
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700">
          Título del Libro
        </label>
        <input
          type="text"
          id="bookTitle"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="coverColor" className="block text-sm font-medium text-gray-700">
          Color de la Portada
        </label>
        <input
          type="color"
          id="coverColor"
          value={coverColor}
          onChange={(e) => setCoverColor(e.target.value)}
          className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="pageText" className="block text-sm font-medium text-gray-700">
            Texto de la Página {currentPage + 1}
          </label>
          <textarea
            id="pageText"
            rows={5}
            value={pages[currentPage]?.text || ''}
            onChange={handleTextChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Escribe el contenido de la página aquí..."
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Imagen de la Página {currentPage + 1}</label>
          {pages[currentPage]?.image ? (
            <img
              src={pages[currentPage].image}
              alt="Imagen de la página"
              className="mt-1 w-full h-auto rounded-md"
            />
          ) : (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-xs text-gray-500">No hay imagen cargada</p>
              </div>
            </div>
          )}
          <input
            type="file"
            onChange={handleFileUpload}
            accept="image/*"
            className="mt-2 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Página Anterior
        </button>
        <span className="text-sm font-medium text-gray-500">
          Página {currentPage + 1} de {pages.length}
        </span>
        <button
          onClick={goToNextPage}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {currentPage === pages.length - 1 ? 'Añadir Página' : 'Siguiente Página'}
        </button>
      </div>
      <button
        onClick={handleSaveBook}
        className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <Save className="h-5 w-5 mr-2" />
        Guardar Libro
      </button>
    </div>
  );
};

export default ParentDashboard;