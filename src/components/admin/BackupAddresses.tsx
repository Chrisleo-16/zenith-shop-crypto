import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Trash2, Plus } from 'lucide-react';

interface BackupAddress {
  id: string;
  currency_symbol: string;
  wallet_address: string;
  label: string;
  is_active: boolean;
  created_at: string;
}

interface CryptoConfig {
  currency_symbol: string;
  currency_name: string;
}

const BackupAddresses = () => {
  const [addresses, setAddresses] = useState<BackupAddress[]>([]);
  const [cryptoConfigs, setCryptoConfigs] = useState<CryptoConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    currency_symbol: '',
    wallet_address: '',
    label: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [addressesResponse, configsResponse] = await Promise.all([
        supabase
          .from('backup_addresses')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('crypto_config')
          .select('currency_symbol, currency_name')
          .eq('is_active', true)
      ]);

      if (addressesResponse.error) throw addressesResponse.error;
      if (configsResponse.error) throw configsResponse.error;

      setAddresses(addressesResponse.data || []);
      setCryptoConfigs(configsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load backup addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.currency_symbol || !newAddress.wallet_address) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('backup_addresses')
        .insert({
          currency_symbol: newAddress.currency_symbol,
          wallet_address: newAddress.wallet_address,
          label: newAddress.label || null,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      // Log audit entry
      await supabase
        .from('security_audit_log')
        .insert({
          action: 'backup_address_add',
          description: `Added backup address for ${newAddress.currency_symbol}`
        });

      setNewAddress({ currency_symbol: '', wallet_address: '', label: '' });
      setIsAddDialogOpen(false);
      fetchData();
      toast.success('Backup address added successfully');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add backup address');
    }
  };

  const handleDeleteAddress = async (addressId: string, currencySymbol: string) => {
    try {
      const { error } = await supabase
        .from('backup_addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      // Log audit entry
      await supabase
        .from('security_audit_log')
        .insert({
          action: 'backup_address_delete',
          description: `Deleted backup address for ${currencySymbol}`
        });

      fetchData();
      toast.success('Backup address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete backup address');
    }
  };

  const handleToggleActive = async (addressId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('backup_addresses')
        .update({ is_active: isActive })
        .eq('id', addressId);

      if (error) throw error;

      fetchData();
      toast.success(`Backup address ${isActive ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling address:', error);
      toast.error('Failed to update backup address');
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Backup Wallet Addresses</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Backup Address
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Backup Address</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Cryptocurrency</Label>
                  <Select value={newAddress.currency_symbol} onValueChange={(value) => 
                    setNewAddress(prev => ({ ...prev, currency_symbol: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptoConfigs.map((config) => (
                        <SelectItem key={config.currency_symbol} value={config.currency_symbol}>
                          {config.currency_name} ({config.currency_symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Wallet Address</Label>
                  <Input
                    id="address"
                    value={newAddress.wallet_address}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, wallet_address: e.target.value }))}
                    placeholder="Enter wallet address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="label">Label (Optional)</Label>
                  <Input
                    id="label"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Enter a descriptive label"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddAddress}>Add Address</Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No backup addresses configured yet.
              </p>
            ) : (
              addresses.map((address) => (
                <div key={address.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{address.currency_symbol}</Badge>
                        {address.label && (
                          <span className="text-sm font-medium">{address.label}</span>
                        )}
                        <Badge variant={address.is_active ? "default" : "secondary"}>
                          {address.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono break-all">
                        {address.wallet_address}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Added: {new Date(address.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={address.is_active}
                        onCheckedChange={(checked) => handleToggleActive(address.id, checked)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id, address.currency_symbol)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupAddresses;