/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

function ProductGallery({ images, selectedImage, setSelectedImage, name }) {
  return (
    <div>
      <div className="bg-white border border-[#e8dfd4] p-3">
        <img
          src={selectedImage}
          alt={name}
          className="w-full h-[520px] object-cover"
        />
      </div>

      <div className="grid grid-cols-4 gap-3 mt-4">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`border-2 ${selectedImage === img ? "border-[#111a2f]" : "border-[#e8dfd4]"}`}
          >
            <img
              src={img}
              alt={`${name}-${index}`}
              className="w-full h-24 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;