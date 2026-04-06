import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BookList from './components/BookList';
import AdminBooks from './pages/AdminBooks';
import BookForm from './pages/BookForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="bg-light min-vh-100 pb-5">
        <Header />
        <main>
          <Routes>
            {/* The main storefront */}
            <Route path="/" element={<BookList />} />
            
            {/* The admin routes */}
            <Route path="/adminbooks" element={<AdminBooks />} />
            <Route path="/adminbooks/add" element={<BookForm />} />
            <Route path="/adminbooks/edit/:id" element={<BookForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;