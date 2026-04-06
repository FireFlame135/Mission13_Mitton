import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../components/BookList';

const AdminBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);

  const fetchBooks = async () => {
    // Fetching with a large page size just to get all books for the admin table
    const response = await fetch('http://localhost:5145/api/Books?pageSize=1000');
    const data = await response.json();
    setBooks(data.books);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await fetch(`http://localhost:5145/api/Books/${id}`, {
        method: 'DELETE',
      });
      fetchBooks(); // Refresh the list after deleting
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard: Manage Books</h2>
        <Link to="/adminbooks/add" className="btn btn-success fw-bold">
          + Add New Book
        </Link>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.bookId}>
                <td className="fw-bold">{b.title}</td>
                <td>{b.author}</td>
                <td>{b.category}</td>
                <td>${b.price.toFixed(2)}</td>
                <td className="text-center">
                  <Link to={`/adminbooks/edit/${b.bookId}`} className="btn btn-sm btn-outline-primary me-2">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(b.bookId)} className="btn btn-sm btn-outline-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBooks;