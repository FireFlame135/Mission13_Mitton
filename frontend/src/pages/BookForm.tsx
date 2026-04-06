import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import type { Book } from '../components/BookList';

const BookForm = () => {
  const { id } = useParams(); // If there's an ID in the URL, we are editing
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [book, setBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
  });

  useEffect(() => {
    if (isEditing) {
      fetch(`http://localhost:5145/api/Books/${id}`)
        .then((res) => res.json())
        .then((data) => setBook(data));
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setBook({
      ...book,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = isEditing 
      ? `http://localhost:5145/api/Books/${id}` 
      : 'http://localhost:5145/api/Books';
      
    await fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });

    navigate('/adminbooks'); // Send them back to the admin table
  };

  return (
    <div className="container mt-4 max-w-md" style={{ maxWidth: '600px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">{isEditing ? 'Edit Book' : 'Add New Book'}</h4>
        </div>
        <div className="card-body bg-light">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Title</label>
              <input type="text" name="title" className="form-control" value={book.title} onChange={handleChange} required />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Author</label>
                <input type="text" name="author" className="form-control" value={book.author} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Publisher</label>
                <input type="text" name="publisher" className="form-control" value={book.publisher} onChange={handleChange} required />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">ISBN</label>
                <input type="text" name="isbn" className="form-control" value={book.isbn} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Category</label>
                <input type="text" name="category" className="form-control" value={book.category} onChange={handleChange} required />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Classification</label>
                <input type="text" name="classification" className="form-control" value={book.classification} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Pages</label>
                <input type="number" name="pageCount" className="form-control" value={book.pageCount} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Price ($)</label>
                <input type="number" name="price" step="0.01" className="form-control" value={book.price} onChange={handleChange} required />
              </div>
            </div>
            
            <div className="d-flex justify-content-between mt-4 border-top pt-3">
              <Link to="/adminbooks" className="btn btn-secondary">Cancel</Link>
              <button type="submit" className="btn btn-primary fw-bold">
                {isEditing ? 'Save Changes' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookForm;