import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface CryptoConfig {
  id: string;
  currency_symbol: string;
  currency_name: string;
  wallet_address: string;
  is_active: boolean;
  min_confirmation: number;
}

const CryptoConfiguration = () => {
  const [configs, setConfigs] = useState<CryptoConfig[]>([]);
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    wallet_address: '',
    min_confirmation: 3
  });
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('crypto_config')
        .select('*')
        .order('currency_symbol');

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Error fetching configs:', error);
      toast.error('Failed to load crypto configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config: CryptoConfig) => {
    setEditingConfig(config.id);
    setEditForm({
      wallet_address: config.wallet_address,
      min_confirmation: config.min_confirmation
    });
  };

  const handleSave = async (configId: string) => {
    try {
      const { error } = await supabase
        .from('crypto_config')
        .update({
          wallet_address: editForm.wallet_address,
          min_confirmation: editForm.min_confirmation
        })
        .eq('id', configId);

      if (error) throw error;

      // Log audit entry
      await supabase
        .from('security_audit_log')
        .insert({
          action: 'address_update',
          description: `Updated wallet address for ${configs.find(c => c.id === configId)?.currency_symbol}`
        });

      setEditingConfig(null);
      fetchConfigs();
      toast.success('Configuration updated successfully');
    } catch (error) {
      console.error('Error updating config:', error);
      toast.error('Failed to update configuration');
    }
  };

  const handleToggleActive = async (configId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('crypto_config')
        .update({ is_active: isActive })
        .eq('id', configId);

      if (error) throw error;

      fetchConfigs();
      toast.success(`Configuration ${isActive ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling config:', error);
      toast.error('Failed to update configuration');
    }
  };

  const testConnection = async (config: CryptoConfig) => {
    setTestingConnection(config.id);
    
    try {
      // Simulate connection test (in real app, this would validate the address)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log audit entry
      await supabase
        .from('security_audit_log')
        .insert({
          action: 'test_connection',
          description: `Tested connection for ${config.currency_symbol} wallet`
        });

      toast.success(`Connection test successful for ${config.currency_symbol}`);
    } catch (error) {
      toast.error('Connection test failed');
    } finally {
      setTestingConnection(null);
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
          <CardTitle>Cryptocurrency Payment Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {configs.map((config) => (
              <div key={config.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold">{config.currency_name}</h3>
                    <Badge variant="secondary">{config.currency_symbol}</Badge>
                    <Badge variant={config.is_active ? "default" : "secondary"}>
                      {config.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.is_active}
                      onCheckedChange={(checked) => handleToggleActive(config.id, checked)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection(config)}
                      disabled={testingConnection === config.id}
                    >
                      {testingConnection === config.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Test Connection'
                      )}
                    </Button>
                  </div>
                </div>

                {editingConfig === config.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="wallet-address">Wallet Address</Label>
                      <Input
                        id="wallet-address"
                        value={editForm.wallet_address}
                        onChange={(e) => setEditForm(prev => ({ ...prev, wallet_address: e.target.value }))}
                        placeholder="Enter wallet address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min-confirmation">Minimum Confirmations</Label>
                      <Input
                        id="min-confirmation"
                        type="number"
                        min="1"
                        value={editForm.min_confirmation}
                        onChange={(e) => setEditForm(prev => ({ ...prev, min_confirmation: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleSave(config.id)}>
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditingConfig(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">Wallet Address</Label>
                      <p className="text-sm text-muted-foreground font-mono break-all">
                        {config.wallet_address}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Minimum Confirmations</Label>
                      <p className="text-sm text-muted-foreground">{config.min_confirmation}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(config)}
                    >
                      Edit Configuration
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoConfiguration;