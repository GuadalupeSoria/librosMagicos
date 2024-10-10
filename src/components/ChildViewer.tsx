import React, { useState, useEffect } from 'react';
import { Book, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';

const ChildViewer: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [currentBook, setCurrentBook] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(-1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const savedBooks = localStorage.getItem('savedBooks');
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  const handleBookSelect = (book: any) => {
    setCurrentBook(book);
    setCurrentPage(-1);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const nextPage = () => {
    if (currentBook && currentPage < currentBook.pages.length - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 500);
    }
  };

  const prevPage = () => {
    if (currentPage > -1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 500);
    }
  };

  const renderBookContent = () => {
    if (currentPage === -1) {
      return (
        <div className="book-cover rounded-lg shadow-lg p-8 flex flex-col items-center justify-center h-[600px] relative overflow-hidden" style={{ backgroundColor: currentBook.coverColor || '#8B4513' }}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30"></div>
          <h2 className="text-4xl font-bold mb-4 text-white text-center relative z-10" style={{ fontFamily: 'Bookman, serif' }}>{currentBook.title}</h2>
          <Book className="h-24 w-24 text-white relative z-10" />
          <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[100px] border-r-[100px] border-b-amber-900 border-r-transparent"></div>
        </div>
      );
    } else {
      const leftPage = currentBook.pages[currentPage];
      const rightPage = currentBook.pages[currentPage + 1];
      const isLastPage = currentPage === currentBook.pages.length - 2;

      return (
        <div className="book-pages flex bg-white rounded-lg shadow-lg relative" style={{ height: '600px' }}>
          <div className="page left-page w-1/2 p-8 border-r border-gray-300 bg-gradient-to-r from-gray-100 to-white">
            <img 
              src={leftPage.image} 
              alt={`Página ${currentPage + 1}`} 
              className="w-full h-64 object-cover rounded-lg mb-4 shadow-md"
            />
            <p className="text-lg" style={{ fontFamily: 'Georgia, serif' }}>{leftPage.text}</p>
          </div>
          <div className="page right-page w-1/2 p-8 bg-gradient-to-l from-gray-100 to-white">
            {rightPage && (
              <>
                <img 
                  src={rightPage.image} 
                  alt={`Página ${currentPage + 2}`} 
                  className="w-full h-64 object-cover rounded-lg mb-4 shadow-md"
                />
                <p className="text-lg" style={{ fontFamily: 'Georgia, serif' }}>{rightPage.text}</p>
              </>
            )}
          </div>
          {isFlipping && (
            <div className={`absolute top-0 right-0 w-1/2 h-full ${isLastPage ? 'back-cover' : 'flipping-page'}`}>
              <div className="absolute inset-0 bg-white shadow-md"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-gray-200 to-white opacity-50"></div>
            </div>
          )}
          <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-amber-800 to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-amber-800 to-transparent"></div>
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-amber-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!currentBook ? (
          <div>
            <h2 className="text-3xl font-bold mb-4">Mi Biblioteca</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {books.map((book, index) => (
                <div
                  key={index}
                  className="rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-500 hover:scale-105 relative"
                  onClick={() => handleBookSelect(book)}
                  style={{ backgroundColor: book.coverColor || '#8B4513' }}
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30"></div>
                  <div className="p-4 h-48 flex items-center justify-center relative z-10">
                    <h3 className="text-xl font-semibold text-white text-center" style={{ fontFamily: 'Bookman, serif' }}>{book.title}</h3>
                  </div>
                  <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[50px] border-r-[50px] border-b-amber-900 border-r-transparent"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative book-container max-w-4xl mx-auto">
            <button
              onClick={() => setCurrentBook(null)}
              className="absolute top-4 left-4 z-10 bg-white rounded-full p-2 shadow-md"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div className="book-viewer bg-amber-100 rounded-lg shadow-2xl p-4 max-w-4xl mx-auto transform perspective-1000" style={{ minHeight: '600px' }}>
              {renderBookContent()}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={prevPage}
                  disabled={currentPage === -1 || isFlipping}
                  className="text-amber-800 hover:text-amber-600 transition duration-300 disabled:opacity-50 focus:outline-none"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage >= currentBook.pages.length - 1 || isFlipping}
                  className="text-amber-800 hover:text-amber-600 transition duration-300 disabled:opacity-50 focus:outline-none"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 right-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-lg"
      >
        {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default ChildViewer;