import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-semibold text-gray-900">
          Catalog
        </Link>

        <nav className="flex items-center gap-6 text-sm text-gray-700">
          <Link to="/" className="hover:text-black">
            Shop
          </Link>

          <Link to="/cart" className="relative hover:text-black">
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-4 -top-2 rounded-full bg-black px-2 py-0.5 text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;