import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const { cartItems } = useCart();

  const cartCount = cartItems ? cartItems.length : 0;

  return (
    <nav>
      <h2>LincesCKF</h2>

      <div>
        <Link to="/">Home</Link> |{" "}
        <Link to="/catalog">Catalog</Link> |{" "}
        <Link to="/about">About</Link> |{" "}
        <Link to="/contact">Contact</Link> |{" "}
        <Link to="/cart">Cart ({cartCount})</Link>
      </div>
    </nav>
  );
}

export default Navbar;