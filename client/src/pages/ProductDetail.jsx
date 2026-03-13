import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import products from "../data/products";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        padding: "20px",
        background: "#fff",
        borderRadius: "10px",
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "350px",
          height: "350px",
          objectFit: "cover",
        }}
      />

      <div>
        <h1>{product.name}</h1>

        <p style={{ color: "#6b7280" }}>
          Category: {product.category}
        </p>

        <h2>${product.price}</h2>

        <p
          style={{
            marginTop: "15px",
            lineHeight: "1.6",
            color: "#374151",
          }}
        >
          {product.description}
          
        </p>

        <button
          onClick={() => addToCart(product)}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;