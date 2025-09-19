import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Coins } from 'lucide-react';
import CryptoConfiguration from './CryptoConfiguration';

const CryptoManagement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addingCrypto, setAddingCrypto] = useState(false);
  const [cryptoForm, setCryptoForm] = useState({
    currency_symbol: '',
    currency_name: '',
    wallet_address: '',
    min_confirmation: 3
  });

  const handleAddCrypto = async () => {
    if (!cryptoForm.currency_symbol || !cryptoForm.currency_name || !cryptoForm.wallet_address) {
      toast.error('Please fill in all required fields');
      return;
    }

    setAddingCrypto(true);
    try {
      const { error } = await supabase
        .from('crypto_config')
        .insert({
          currency_symbol: cryptoForm.currency_symbol.toUpperCase(),
          currency_name: cryptoForm.currency_name,
          wallet_address: cryptoForm.wallet_address,
          min_confirmation: cryptoForm.min_confirmation,
          is_active: true
        });

      if (error) throw error;

      await supabase
        .from('security_audit_log')
        .insert({
          action: 'crypto_add',
          description: `Added new cryptocurrency: ${cryptoForm.currency_symbol}`
        });

      toast.success('Cryptocurrency added successfully');
      setShowAddDialog(false);
      setCryptoForm({
        currency_symbol: '',
        currency_name: '',
        wallet_address: '',
        min_confirmation: 3
      });
      
      // Force refresh of the parent component
      window.location.reload();
    } catch (error: any) {
      console.error('Error adding crypto:', error);
      if (error.code === '23505') {
        toast.error('This cryptocurrency already exists');
      } else {
        toast.error('Failed to add cryptocurrency');
      }
    } finally {
      setAddingCrypto(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Cryptocurrency Management
            </CardTitle>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Cryptocurrency
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Cryptocurrency</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Currency Symbol</Label>
                    <Input
                      value={cryptoForm.currency_symbol}
                      onChange={(e) => setCryptoForm(prev => ({ ...prev, currency_symbol: e.target.value }))}
                      placeholder="BTC, ETH, etc."
                      className="uppercase"
                    />
                  </div>
                  <div>
                    <Label>Currency Name</Label>
                    <Input
                      value={cryptoForm.currency_name}
                      onChange={(e) => setCryptoForm(prev => ({ ...prev, currency_name: e.target.value }))}
                      placeholder="Bitcoin, Ethereum, etc."
                    />
                  </div>
                  <div>
                    <Label>Wallet Address</Label>
                    <Input
                      value={cryptoForm.wallet_address}
                      onChange={(e) => setCryptoForm(prev => ({ ...prev, wallet_address: e.target.value }))}
                      placeholder="Enter wallet address"
                    />
                  </div>
                  <div>
                    <Label>Minimum Confirmations</Label>
                    <Input
                      type="number"
                      min="1"
                      value={cryptoForm.min_confirmation}
                      onChange={(e) => setCryptoForm(prev => ({ ...prev, min_confirmation: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleAddCrypto} 
                      disabled={addingCrypto}
                      className="flex-1"
                    >
                      {addingCrypto ? 'Adding...' : 'Add Cryptocurrency'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <CryptoConfiguration />
    </div>
  );
};

export default CryptoManagement;