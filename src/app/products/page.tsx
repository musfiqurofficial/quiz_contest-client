"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import ProductCard from "../components/products";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Head from "next/head";

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes] = useState<string[]>(["Small", "Medium", "Large"]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [price, setPrice] = useState(1000);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const res = await fetch("https://fakestoreapi.com/products");
      const data: Product[] = await res.json();

      setProducts(data);
      setFiltered(data);

      // Dynamic categories
      const uniqueCategories = Array.from(new Set(data.map((p) => p.category)));
      setCategories(uniqueCategories);

      // Colors detection (mock)
      const detectedColors = Array.from(
        new Set(
          data
            .map((p) =>
              ["red", "blue", "#f25b29", "gray"].find((c) =>
                p.title.toLowerCase().includes(c)
              )
            )
            .filter(Boolean)
        )
      ) as string[];
      setColors(detectedColors);

      const highest = Math.ceil(Math.max(...data.map((p) => p.price)));
      setMaxPrice(highest);
      setPrice(highest);

      setLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (selectedCategories.length) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (selectedColors.length) {
      result = result.filter((p) =>
        selectedColors.some((color) =>
          p.title.toLowerCase().includes(color.toLowerCase())
        )
      );
    }
    if (selectedSizes.length) {
      result = result.filter((p) =>
        selectedSizes.some((size) =>
          p.title.toLowerCase().includes(size.toLowerCase())
        )
      );
    }
    if (search.trim()) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    result = result.filter((p) => p.price <= price);

    setFiltered(result);
  }, [
    selectedCategories,
    selectedColors,
    selectedSizes,
    price,
    search,
    products,
  ]);

  const toggleSelection = (
    item: string,
    list: string[],
    setList: (val: string[]) => void
  ) => {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  };

  const SidebarFilters = () => (
    <div className="space-y-6 text-sm bg-white p-4  text-gray-800 dark:text-[#f25b29]">
      {/* Search */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">All Products</h1>
        <Label htmlFor="search" className="text-sm font-semibold block mb-2">
          Search Products
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-2">Categories</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() =>
                  toggleSelection(
                    cat,
                    selectedCategories,
                    setSelectedCategories
                  )
                }
              />
              <span className="cursor-pointer">{cat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Colors</h3>
          <ul className="space-y-2">
            {colors.map((color) => (
              <li key={color} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedColors.includes(color)}
                  onCheckedChange={() =>
                    toggleSelection(color, selectedColors, setSelectedColors)
                  }
                />
                <span>{color}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sizes */}
      <div>
        <h3 className="font-semibold mb-2">Sizes</h3>
        <ul className="space-y-2">
          {sizes.map((size) => (
            <li key={size} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedSizes.includes(size)}
                onCheckedChange={() =>
                  toggleSelection(size, selectedSizes, setSelectedSizes)
                }
              />
              <span>{size}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-semibold mb-2">Price</h3>
        <Slider
          min={0}
          max={maxPrice}
          step={1}
          value={[price]}
          onValueChange={(val: number[]) => setPrice(val[0] || 0)}
          className="mb-2 bg-[#f25b29]"
        />
        <p className="text-xs text-gray-500">Price: $0 — ${price}</p>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>All Product | Tech Element</title>
        <meta
          name="description"
          content="Browse a wide variety of tech products including phones, accessories, and more at Tech Element."
        />
      </Head>
      <main className="p-4 md:p-6 max-w-screen-xl mx-auto bg-white pt-20 sm:pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="text-2xl md:text-3xl font-bold"></h1>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm text-gray-500">
              Showing {filtered.length} results
            </span>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              Sort by popularity
              <ChevronDown className="h-4 w-4" />
            </Button>

            {/* Mobile filter */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MenuIcon className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <SidebarFilters />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="hidden md:block bg-white rounded border p-4 shadow-sm h-fit w-64 shrink-0 sticky top-1">
            <SidebarFilters />
          </aside>

          {/* Products Grid */}
          <section className="flex-1 grid grid-cols-1 sm:grid-cols-3  gap-4 sm:gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded" />
              ))
            ) : filtered.length ? (
              filtered.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 text-lg font-medium">
                No products found.
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
