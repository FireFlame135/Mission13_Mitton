import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

export interface PaginatedResponse {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  books: Book[];
}

const BookList = () => {
  const { addToCart } = useCart();
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState('title_asc');
  
  // Toast Notification State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch Categories ONCE on load
  useEffect(() => {
    const fetchCategories = async () => {
      // REPLACE YOUR_BACKEND_PORT
      const response = await fetch('http://localhost:5145/api/Books/Categories');
      const cats = await response.json();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  // Fetch Books whenever filters change
  useEffect(() => {
    const fetchBooks = async () => {
      // REPLACE YOUR_BACKEND_PORT
      let url = `http://localhost:5145/api/Books?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    };
    fetchBooks();
  }, [page, pageSize, sortOrder, selectedCategory]);

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    setToastMessage(`"${book.title}" added to your cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Auto-hide Toast after 3s
  };

  if (!data) return <div className="text-center mt-5 spinner-border text-primary" role="status"></div>;

  const pageNumbers = Array.from({ length: data.totalPages }, (_, i) => i + 1);

  return (
    <div className="container position-relative">
      
      {/* BOOTSTRAP TOAST (New Feature 2) - Shows when item added to cart */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
        <div className={`toast align-items-center text-bg-success border-0 ${showToast ? 'show' : 'hide'}`} role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body fw-bold">
              {toastMessage}
            </div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
          </div>
        </div>
      </div>

      {/* Controls: Filtering, Sorting, Page Size */}
      <div className="row bg-light p-3 rounded shadow-sm mb-4 align-items-end">
        <div className="col-md-4 mb-2 mb-md-0">
          <label className="fw-bold mb-1">Filter by Category:</label>
          <select 
            className="form-select border-primary" 
            value={selectedCategory} 
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1); // Reset page on new filter
            }}
          >
            <option value="">All Categories</option>
            {categories.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>
        
        <div className="col-md-4 mb-2 mb-md-0">
          <label className="fw-bold mb-1">Sort By:</label>
          <select 
            className="form-select" 
            value={sortOrder} 
            onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
          >
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
          </select>
        </div>
        
        <div className="col-md-4">
          <label className="fw-bold mb-1">Results per page:</label>
          <select 
            className="form-select" 
            value={pageSize} 
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* BOOTSTRAP GRID - Arranging Books in Cards */}
      <div className="row g-4">
        {data.books.length === 0 ? (
          <div className="col-12 text-center h5 text-muted my-5">No books found for this category.</div>
        ) : (
          data.books.map((b) => (
            <div key={b.bookId} className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
              <div className="card w-100 shadow-sm border-0 h-100 hover-shadow transition">
                <div className="card-header bg-dark text-white text-center py-3">
                  <h5 className="card-title mb-0 h6 lh-base">{b.title}</h5>
                </div>
                <div className="card-body d-flex flex-column">
                  <p className="mb-1"><strong>Author:</strong> {b.author}</p>
                  <p className="mb-1 text-muted small"><strong>Publisher:</strong> {b.publisher}</p>
                  <p className="mb-1 text-muted small"><strong>ISBN:</strong> {b.isbn}</p>
                  <div className="mt-auto pt-3 d-flex justify-content-between align-items-center border-top">
                    <span className="badge bg-secondary">{b.category}</span>
                    <span className="h5 mb-0 text-success fw-bold">${b.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 pb-3 text-center">
                  <button 
                    className="btn btn-primary w-100 fw-bold"
                    onClick={() => handleAddToCart(b)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dynamic Pagination */}
      {data.totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-5 mb-5">
          <ul className="pagination flex-wrap shadow-sm">
            {pageNumbers.map((num) => (
              <li key={num} className={`page-item ${page === num ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(num)}>
                  {num}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default BookList;