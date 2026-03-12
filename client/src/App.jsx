import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import { useCart } from "./context/CartContext";

function App() {
  const cartContext = useCart();
  const cartMessage = cartContext?.cartMessage || "";

  return (
    <>
      <Navbar />

      {cartMessage ? (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            backgroundColor: "green",
            color: "white",
            padding: "12px 16px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          {cartMessage}
        </div>
      ) : null}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </>
  );
}

export default App;