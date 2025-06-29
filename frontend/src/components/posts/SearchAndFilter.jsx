import React, { useState, useEffect } from "react";
import { useCategories } from "../../hooks/useCategories";

const SearchAndFilter = ({ filters, onUpdateFilters, onClearFilters }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const { categories, fetchCategories } = useCategories();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setSearchTerm(filters.search);
  }, [filters.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    onUpdateFilters({ search: searchTerm });
  };

  const handleCategoryChange = (e) => {
    onUpdateFilters({ category: e.target.value });
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split("-");
    onUpdateFilters({ sortBy, sortOrder });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    onClearFilters();
  };

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.sortBy !== "createdAt" ||
    filters.sortOrder !== "desc";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts by title or content..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Category:</label>
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={handleSortChange}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.search && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Search: "{filters.search}"
              </span>
            )}
            {filters.category && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Category:{" "}
                {categories.find((c) => c._id === filters.category)?.name}
              </span>
            )}
            {filters.sortBy !== "createdAt" || filters.sortOrder !== "desc" ? (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Sort: {filters.sortBy === "title" ? "Title" : "Date"}{" "}
                {filters.sortOrder === "asc" ? "A-Z" : "Z-A"}
              </span>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
