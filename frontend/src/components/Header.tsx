import { useCart } from '../context/CartContext';

const Header = () => {
  const { cart, removeFromCart, updateQuantity, cartTotalQuantity, cartTotalPrice } = useCart();

  return (
    <>
      <header className="bg-dark text-white py-3 mb-4 sticky-top shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-0">Hilton's Bookstore</h1>
            <small className="text-light">"Do hard things well."</small>
          </div>
          
          {/* Cart Summary Button - Triggers Offcanvas */}
          <button 
            className="btn btn-outline-light d-flex align-items-center gap-2"
            type="button" 
            data-bs-toggle="offcanvas" 
            data-bs-target="#cartOffcanvas" 
            aria-controls="cartOffcanvas"
          >
            <span className="fw-bold">Cart:</span>
            <span className="badge bg-danger rounded-pill">{cartTotalQuantity}</span>
            <span>- ${cartTotalPrice.toFixed(2)}</span>
          </button>
        </div>
      </header>

      {/* BOOTSTRAP OFFCANVAS (New Feature 1) - Acts as our Cart Page */}
      <div className="offcanvas offcanvas-end" tabIndex={-1} id="cartOffcanvas" aria-labelledby="cartOffcanvasLabel">
        <div className="offcanvas-header bg-light border-bottom">
          <h5 className="offcanvas-title" id="cartOffcanvasLabel">Your Shopping Cart</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body d-flex flex-column">
          {cart.length === 0 ? (
            <div className="text-center mt-5 text-muted">Your cart is empty.</div>
          ) : (
            <div className="flex-grow-1 overflow-auto">
              {cart.map((item) => (
                <div key={item.book.bookId} className="card mb-3 shadow-sm border-0 bg-light">
                  <div className="card-body">
                    <h6 className="card-title text-truncate">{item.book.title}</h6>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.book.bookId, item.quantity - 1)}>-</button>
                        <span className="fw-bold">{item.quantity}</span>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.book.bookId, item.quantity + 1)}>+</button>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold text-success">${(item.book.price * item.quantity).toFixed(2)}</div>
                        <button className="btn btn-sm btn-link text-danger p-0 mt-1" onClick={() => removeFromCart(item.book.bookId)}>Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Cart Totals & Checkout */}
          <div className="border-top pt-3 mt-auto">
            <div className="d-flex justify-content-between h5">
              <span>Total:</span>
              <span className="text-success fw-bold">${cartTotalPrice.toFixed(2)}</span>
            </div>
            {/* The "Continue Shopping" requirement is fulfilled natively by closing the offcanvas */}
            <button className="btn btn-secondary w-100 mb-2" data-bs-dismiss="offcanvas">
              Continue Shopping
            </button>
            <button className="btn btn-primary w-100 fw-bold" disabled={cart.length === 0}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;