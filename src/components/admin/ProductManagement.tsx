import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Upload,
  Package,
  Download,
  FileUp,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_active: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
}

interface ProductCategory {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    is_active: true,
    stock: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ✅ Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error.message);
      toast.error("Failed to load products from Supabase.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch categories (safe)
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("service_categories")
        .select("*")
        .order("name");

      if (error) {
        console.warn("No service_categories table found.");
        return;
      }
      setCategories(data || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error.message);
    }
  };

  // ✅ Upload image
  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("service-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("service-images")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error.message);
      toast.error("Failed to upload image.");
      return null;
    }
  };

  // ✅ Save product
  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const productData = {
        name: productForm.name,
        description: productForm.description || "",
        price: parseFloat(productForm.price),
        category: productForm.category,
        image_url: productForm.image_url || "",
        is_active: productForm.is_active,
        stock: Number(productForm.stock),
      };

      let error = null;

      if (editingProduct) {
        const { error: updateError } = await supabase
          .from("services")
          .update(productData)
          .eq("id", editingProduct.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("services")
          .insert(productData);
        error = insertError;
      }

      if (error) throw error;

      toast.success(editingProduct ? "Service updated." : "Service added.");
      setShowAddDialog(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving service:", error.message);
      toast.error("Failed to save service.");
    }
  };

  // ✅ Delete product
  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      toast.success("Service deleted.");
      fetchProducts();
    } catch (error: any) {
      toast.error("Failed to delete service.");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url || "",
      is_active: product.is_active,
      stock: product.stock || 0,
    });
    setShowAddDialog(true);
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image_url: "",
      is_active: true,
      stock: 0,
    });
  };

  // ✅ Export to CSV
  const handleExportCSV = () => {
    if (products.length === 0) {
      toast.info("No products to export.");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["Name", "Description", "Price", "Category", "Stock", "Active"],
        ...products.map((p) => [
          p.name,
          p.description,
          p.price,
          p.category,
          p.stock,
          p.is_active ? "Yes" : "No",
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "services_export.csv";
    link.click();
  };

  // ✅ Import CSV
  const handleImportCSV = async (file: File) => {
    try {
      const text = await file.text();
      const rows = text.split("\n").slice(1);
      const newProducts = rows
        .map((row) => row.split(","))
        .filter((r) => r.length >= 5)
        .map((r) => ({
          name: r[0],
          description: r[1],
          price: parseFloat(r[2]),
          category: r[3],
          stock: parseInt(r[4]) || 0,
          is_active: r[5]?.trim().toLowerCase() === "yes",
        }));

      const { error } = await supabase.from("services").insert(newProducts);
      if (error) throw error;

      toast.success("CSV imported successfully!");
      fetchProducts();
    } catch (error: any) {
      console.error("Error importing CSV:", error.message);
      toast.error("Failed to import CSV.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Service Management
            </CardTitle>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("csvInput")?.click()}
              >
                <FileUp className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <input
                id="csvInput"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImportCSV(file);
                }}
              />

              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? "Edit Service" : "Add New Service"}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Service Name</Label>
                        <Input
                          value={productForm.name}
                          onChange={(e) =>
                            setProductForm((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Enter service name"
                        />
                      </div>
                      <div>
                        <Label>Price ($)</Label>
                        <Input
                          type="number"
                          value={productForm.price}
                          onChange={(e) =>
                            setProductForm((p) => ({
                              ...p,
                              price: e.target.value,
                            }))
                          }
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) =>
                          setProductForm((p) => ({
                            ...p,
                            stock: parseInt(e.target.value) || 0,
                          }))
                        }
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label>Category</Label>
                      <Select
                        value={productForm.category}
                        onValueChange={(v) =>
                          setProductForm((p) => ({ ...p, category: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length > 0 ? (
                            categories.map((c) => (
                              <SelectItem key={c.id} value={c.name}>
                                {c.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="General">General</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={productForm.description}
                        onChange={(e) =>
                          setProductForm((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        rows={3}
                        placeholder="Describe your service..."
                      />
                    </div>

                    <div>
                      <Label>Service Image</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleImageUpload(file);
                            if (url)
                              setProductForm((p) => ({ ...p, image_url: url }));
                          }
                        }}
                      />
                      {productForm.image_url && (
                        <img
                          src={productForm.image_url}
                          alt="Preview"
                          className="mt-2 h-20 w-20 object-cover rounded"
                        />
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={productForm.is_active}
                        onCheckedChange={(checked) =>
                          setProductForm((p) => ({ ...p, is_active: checked }))
                        }
                      />
                      <Label>Active</Label>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleSaveProduct} className="flex-1">
                        {editingProduct ? "Update" : "Add"}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowAddDialog(false);
                          setEditingProduct(null);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {product.description || "No description"}
                  </p>

                  <div className="flex justify-between mb-2">
                    <span className="text-lg font-bold">${product.price}</span>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    Stock: <strong>{product.stock}</strong>
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProduct(product)}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;
