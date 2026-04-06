import Header from './components/Header';
import BookList from './components/BookList';
import './App.css';

function App() {
  return (
    <div className="bg-light min-vh-100 pb-5">
      <Header />
      <main>
        <BookList />
      </main>
    </div>
  );
}

export default App;