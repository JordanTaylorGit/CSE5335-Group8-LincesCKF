import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        minHeight: "360px",
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          flexGrow: 1,
        }}
      >
        <h3 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>
          {product.name}
        </h3>

        <p style={{ margin: 0, color: "#6b7280" }}>{product.category}</p>

        <p
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          ${product.price}
        </p>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: "10px",
          }}
        >
          <Link
            to={`/product/${product.id}`}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px 12px",
              borderRadius: "8px",
              backgroundColor: "#e5e7eb",
              textDecoration: "none",
              color: "#111827",
              fontWeight: 500,
            }}
          >
            View
          </Link>

          <button
            onClick={() => addToCart(product)}
            style={{
              flex: 1,
              padding: "10px 12px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#111827",
              color: "#ffffff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;