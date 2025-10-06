import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Plus, Edit, Trash2, Upload, Download, Package } from 'lucide-react';

interface Product {
id: string;
name: string;
description: string;
price: number;
category: string;
image_url: string;
stock_quantity: number;
is_active: boolean;
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
const [showCSVDialog, setShowCSVDialog] = useState(false);
const [editingProduct, setEditingProduct] = useState<Product | null>(null);
const [csvFile, setCsvFile] = useState<File | null>(null);
const [uploadingCSV, setUploadingCSV] = useState(false);

const [productForm, setProductForm] = useState({
name: '',
description: '',
price: '',
category: '',
stock_quantity: '',
image_url: '',
is_active: true
});

useEffect(() => {
fetchProducts();
fetchCategories();
}, []);

const fetchProducts = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

const fetchCategories = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('service_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('service-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

const handleSaveProduct = async () => {
try {
const productData = {
name: productForm.name,
description: productForm.description,
price: parseFloat(productForm.price),
category: productForm.category,
stock_quantity: parseInt(productForm.stock_quantity),
image_url: productForm.image_url,
is_active: productForm.is_active
};

if (editingProduct) {
      const { error } = await (supabase as any)
        .from('services')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) throw error;

      await supabase
        .from('security_audit_log')
        .insert({
          action: 'product_update',
          description: `Updated product: ${productForm.name}`
        });

      toast.success('Product updated successfully');
    } else {
      const { error } = await (supabase as any)
        .from('services')
        .insert(productData);

      if (error) throw error;

      await supabase
        .from('security_audit_log')
        .insert({
          action: 'product_add',
          description: `Added new product: ${productForm.name}`
        });

      toast.success('Product added successfully');
    }

  setShowAddDialog(false);  
  setEditingProduct(null);  
  resetForm();  
  fetchProducts();  
} catch (error) {  
  console.error('Error saving product:', error);  
  toast.error('Failed to save product');  
}

};

const handleDeleteProduct = async (product: Product) => {
    try {
      const { error } = await (supabase as any)
        .from('services')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      await supabase
        .from('security_audit_log')
        .insert({
          action: 'product_delete',
          description: `Deleted product: ${product.name}`
        });

      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

const handleRestockProduct = async (product: Product, newStock: number) => {
    try {
      const { error } = await (supabase as any)
        .from('services')
        .update({ stock_quantity: newStock })
        .eq('id', product.id);

      if (error) throw error;

      await supabase
        .from('security_audit_log')
        .insert({
          action: 'product_restock',
          description: `Restocked ${product.name} to ${newStock} units`
        });

      toast.success('Product restocked successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error restocking product:', error);
      toast.error('Failed to restock product');
    }
  };

const handleCSVUpload = async () => {
if (!csvFile) return;

setUploadingCSV(true);  
try {  
  const text = await csvFile.text();  
  const lines = text.split('\n');  
  const headers = lines[0].split(',').map(h => h.trim());  
    
  // Expected headers: name,description,price,category,stock_quantity,image_url  
  const requiredHeaders = ['name', 'price', 'category'];  
  const hasRequiredHeaders = requiredHeaders.every(header =>   
    headers.some(h => h.toLowerCase() === header.toLowerCase())  
  );  

  if (!hasRequiredHeaders) {  
    toast.error('CSV must contain columns: name, price, category');  
    return;  
  }  

  const products = [];  
  for (let i = 1; i < lines.length; i++) {  
    const values = lines[i].split(',').map(v => v.trim());  
    if (values.length >= 3 && values[0]) {  
      const nameIndex = headers.findIndex(h => h.toLowerCase() === 'name');  
      const priceIndex = headers.findIndex(h => h.toLowerCase() === 'price');  
      const categoryIndex = headers.findIndex(h => h.toLowerCase() === 'category');  
      const descIndex = headers.findIndex(h => h.toLowerCase() === 'description');  
      const stockIndex = headers.findIndex(h => h.toLowerCase() === 'stock_quantity');  
      const imageIndex = headers.findIndex(h => h.toLowerCase() === 'image_url');  

      products.push({  
        name: values[nameIndex],  
        price: parseFloat(values[priceIndex]),  
        category: values[categoryIndex],  
        description: descIndex >= 0 ? values[descIndex] : '',  
        stock_quantity: stockIndex >= 0 ? parseInt(values[stockIndex]) || 0 : 0,  
        image_url: imageIndex >= 0 ? values[imageIndex] : '',  
        is_active: true  
      });  
    }  
  }  

  const { error } = await (supabase as any)
    .from('services')
    .insert(products);

  if (error) throw error;

  await supabase  
    .from('security_audit_log')  
    .insert({  
      action: 'product_add',  
      description: `Bulk imported ${products.length} products via CSV`  
    });  

  toast.success(`Successfully imported ${products.length} products`);  
  setShowCSVDialog(false);  
  setCsvFile(null);  
  fetchProducts();  
} catch (error) {  
  console.error('Error uploading CSV:', error);  
  toast.error('Failed to import CSV');  
} finally {  
  setUploadingCSV(false);  
}

};

const handleEdit = (product: Product) => {
setEditingProduct(product);
setProductForm({
name: product.name,
description: product.description || '',
price: product.price.toString(),
category: product.category,
stock_quantity: product.stock_quantity.toString(),
image_url: product.image_url || '',
is_active: product.is_active
});
setShowAddDialog(true);
};

const resetForm = () => {
setProductForm({
name: '',
description: '',
price: '',
category: '',
stock_quantity: '',
image_url: '',
is_active: true
});
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
Product Management
</CardTitle>
<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
<Dialog open={showCSVDialog} onOpenChange={setShowCSVDialog}>
<DialogTrigger asChild>
<Button variant="outline" size="sm" className="w-full sm:w-auto">
<Upload className="h-4 w-4 mr-2" />
Import CSV
</Button>
</DialogTrigger>
<DialogContent>
<DialogHeader>
<DialogTitle>Import Products from CSV</DialogTitle>
</DialogHeader>
<div className="space-y-4">
<div>
<Label>CSV File</Label>
<Input
type="file"
accept=".csv"
onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
/>
<p className="text-sm text-muted-foreground mt-1">
Required columns: name, price, category. Optional: description, stock_quantity, image_url
</p>
</div>
<Button
onClick={handleCSVUpload}
disabled={!csvFile || uploadingCSV}
className="w-full"
>
{uploadingCSV ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
Import
</Button>
</div>
</DialogContent>
</Dialog>

<Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>  
            <DialogTrigger asChild>  
              <Button size="sm" className="w-full sm:w-auto">  
                <Plus className="h-4 w-4 mr-2" />  
                Add Product  
              </Button>  
            </DialogTrigger>  
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">  
              <DialogHeader>  
                <DialogTitle>  
                  {editingProduct ? 'Edit Product' : 'Add New Product'}  
                </DialogTitle>  
              </DialogHeader>  
              <div className="space-y-4">  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">  
                  <div>  
                    <Label>Product Name</Label>  
                    <Input  
                      value={productForm.name}  
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}  
                      placeholder="Enter product name"  
                    />  
                  </div>  
                  <div>  
                    <Label>Price</Label>  
                    <Input  
                      type="number"  
                      step="0.01"  
                      value={productForm.price}  
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}  
                      placeholder="0.00"  
                    />  
                  </div>  
                </div>  

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">  
                  <div>  
                    <Label>Category</Label>  
                    <Select  
                      value={productForm.category}  
                      onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}  
                    >  
                      <SelectTrigger>  
                        <SelectValue placeholder="Select category" />  
                      </SelectTrigger>  
                      <SelectContent>  
                        {categories.map((category) => (  
                          <SelectItem key={category.id} value={category.name}>  
                            {category.name}  
                          </SelectItem>  
                        ))}  
                      </SelectContent>  
                    </Select>  
                  </div>  
                  <div>  
                    <Label>Stock Quantity</Label>  
                    <Input  
                      type="number"  
                      value={productForm.stock_quantity}  
                      onChange={(e) => setProductForm(prev => ({ ...prev, stock_quantity: e.target.value }))}  
                      placeholder="0"  
                    />  
                  </div>  
                </div>  

                <div>  
                  <Label>Description</Label>  
                  <Textarea  
                    value={productForm.description}  
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}  
                    placeholder="Product description..."  
                    rows={3}  
                  />  
                </div>  

                <div>
                  <Label>Product Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleImageUpload(file);
                        if (url) {
                          setProductForm(prev => ({ ...prev, image_url: url }));
                        }
                      }
                    }}
                  />
                  {productForm.image_url && (
                    <div className="mt-2">
                      <img
                        src={productForm.image_url}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">  
                  <Switch  
                    checked={productForm.is_active}  
                    onCheckedChange={(checked) => setProductForm(prev => ({ ...prev, is_active: checked }))}  
                  />  
                  <Label>Active</Label>  
                </div>  

                <div className="flex flex-col sm:flex-row gap-2">  
                  <Button onClick={handleSaveProduct} className="flex-1">  
                    {editingProduct ? 'Update Product' : 'Add Product'}  
                  </Button>  
                  <Button   
                    variant="outline"   
                    onClick={() => {  
                      setShowAddDialog(false);  
                      setEditingProduct(null);  
                      resetForm();  
                    }}  
                    className="flex-1"  
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
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>  
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">  
                {product.description || 'No description'}  
              </p>  
              <div className="flex justify-between items-center mb-3">  
                <span className="text-lg font-bold">${product.price}</span>  
                <Badge variant="outline">{product.category}</Badge>  
              </div>  
              <div className="flex items-center justify-between mb-3">  
                <span className="text-sm">Stock: {product.stock_quantity}</span>  
                <Input  
                  type="number"  
                  className="w-20 h-7"  
                  onBlur={(e) => {  
                    const newStock = parseInt(e.target.value);  
                    if (newStock !== product.stock_quantity) {  
                      handleRestockProduct(product, newStock);  
                    }  
                  }}  
                  defaultValue={product.stock_quantity}  
                />  
              </div>  
              <div className="flex gap-2">  
                <Button  
                  variant="outline"  
                  size="sm"  
                  onClick={() => handleEdit(product)}  
                  className="flex-1"  
                >  
                  <Edit className="h-4 w-4 mr-1" />  
                  Edit  
                </Button>  
                <Button  
                  variant="destructive"  
                  size="sm"  
                  onClick={() => handleDeleteProduct(product)}  
                  className="flex-1"  
                >  
                  <Trash2 className="h-4 w-4 mr-1" />  
                  Delete  
                </Button>  
              </div>  
            </CardContent>  
          </Card>  
        ))}  
      </div>  
      {products.length === 0 && (  
        <div className="text-center py-12">  
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />  
          <h3 className="text-lg font-semibold mb-2">No products found</h3>  
          <p className="text-muted-foreground mb-4">  
            Start by adding your first product or importing from CSV  
          </p>  
        </div>  
      )}  
    </CardContent>  
  </Card>  
</div>

);
};

export default ProductManagement;


