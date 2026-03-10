function CatalogFilters({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort
}) {
  return (
    <div className="bg-white border border-[#e6ded3] rounded-[18px] p-5 shadow-sm mb-8">
      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search silk garments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#d8cfc3] px-4 py-3 outline-none focus:border-[#0f172a]"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-[#d8cfc3] px-4 py-3 outline-none focus:border-[#0f172a] bg-white"
        >
          <option value="All">All Categories</option>
          <option value="blouse">Blouse</option>
          <option value="dress">Dress</option>
          <option value="scarf">Scarf</option>
          <option value="shirt">Shirt</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full rounded-xl border border-[#d8cfc3] px-4 py-3 outline-none focus:border-[#0f172a] bg-white"
        >
          <option value="default">Sort By</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="name-a-z">Name: A-Z</option>
        </select>
      </div>
    </div>
  );
}

export default CatalogFilters;