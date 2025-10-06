"use client";

import { useEffect, useState, useCallback } from "react";
import { Edit, Trash2, Download, PlusCircle, Search, Filter } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  description?: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      toast.error("Error loading products: " + error.message);
    } else {
      setProducts(data || []);
      setFilteredProducts(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter and Search
  useEffect(() => {
    let result = [...products];
    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchTerm.trim() !== "") {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(result);
    setPage(1);
  }, [searchTerm, selectedCategory, products]);

  // Handle Product Add/Edit/Delete
  const handleAddProduct = async () => {
    const name = prompt("Enter product name:");
    if (!name) return;
    const { data, error } = await supabase
      .from("products")
      .insert([{ name, price: 0, category: "Uncategorized", stock_quantity: 0 }])
      .select();

    if (error) toast.error("Error adding product: " + error.message);
    else {
      toast.success("Product added!");
      fetchProducts();
    }
  };

  const handleEdit = async (product: Product) => {
    const newName = prompt("Enter new name:", product.name);
    if (!newName) return;
    const { error } = await supabase
      .from("products")
      .update({ name: newName })
      .eq("id", product.id);
    if (error) toast.error("Error updating product");
    else {
      toast.success("Product updated!");
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Delete ${product.name}?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) toast.error("Error deleting product");
    else {
      toast.success("Product deleted!");
      fetchProducts();
    }
  };

  const handleRestockProduct = async (product: Product, newStock: number) => {
    const { error } = await supabase
      .from("products")
      .update({ stock_quantity: newStock })
      .eq("id", product.id);
    if (error) toast.error("Error updating stock");
    else {
      toast.success("Stock updated!");
      fetchProducts();
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="p-6 space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Product Management</h3>
          <Button onClick={handleAddProduct}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                className="border rounded-md px-2 py-1 text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {Array.from(new Set(products.map(p => p.category))).map(cat => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground py-10">
              Loading products...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedProducts.map((product) => (
                <Card key={product.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{product.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {product.category}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="text-sm">Price: ${product.price.toFixed(2)}</div>
                    <div className="text-sm flex items-center gap-2">
                      Stock:
                      <Input
                        type="number"
                        className="w-20 h-7"
                        defaultValue={product.stock_quantity}
                        onBlur={(e) => {
                          const newStock = parseInt(e.target.value);
                          if (
                            !isNaN(newStock) &&
                            newStock !== product.stock_quantity
                          ) {
                            handleRestockProduct(product, newStock);
                          }
                        }}
                      />
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(product.image_url || "");
                          toast.success("Image URL copied!");
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Copy URL
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-10">
                  No products found.
                </div>
              )}
            </div>
          )}
        </CardContent>

        {!loading && totalPages > 1 && (
          <CardFooter className="flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ProductManagement;