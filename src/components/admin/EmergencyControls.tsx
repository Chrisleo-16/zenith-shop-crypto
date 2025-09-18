import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { AlertTriangle, Power, RotateCcw, Shield } from 'lucide-react';

interface SystemSettings {
  payments_enabled: boolean;
  maintenance_mode: boolean;
}

const EmergencyControls = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    payments_enabled: true,
    maintenance_mode: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['payments_enabled', 'maintenance_mode']);

      if (error) throw error;

      const settingsMap = data?.reduce((acc, setting) => {
        acc[setting.setting_key as keyof SystemSettings] = setting.setting_value;
        return acc;
      }, {} as any) || {};

      setSettings({
        payments_enabled: settingsMap.payments_enabled === 'true',
        maintenance_mode: settingsMap.maintenance_mode === 'true'
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof SystemSettings, value: boolean) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({
          setting_value: value.toString(),
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('setting_key', key);

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
      
      // Log audit entry
      const action = key === 'payments_enabled' ? 'pause_payments' : 'emergency_reset';
      await supabase
        .from('security_audit_log')
        .insert({
          action,
          description: `${key} set to ${value}`
        });

      toast.success(`System setting updated: ${key} is now ${value ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update system setting');
    }
  };

  const handleEmergencyReset = async () => {
    try {
      // Reset all crypto configurations to inactive
      await supabase
        .from('crypto_config')
        .update({ is_active: false })
        .neq('id', '');

      // Disable all backup addresses
      await supabase
        .from('backup_addresses')
        .update({ is_active: false })
        .neq('id', '');

      // Set system to maintenance mode and disable payments
      await Promise.all([
        updateSetting('payments_enabled', false),
        updateSetting('maintenance_mode', true)
      ]);

      // Log emergency reset
      await supabase
        .from('security_audit_log')
        .insert({
          action: 'emergency_reset',
          description: 'Emergency system reset performed - all crypto services disabled'
        });

      toast.success('Emergency reset completed. All crypto services have been disabled.');
    } catch (error) {
      console.error('Error performing emergency reset:', error);
      toast.error('Failed to perform emergency reset');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-warning">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            <span>Emergency Controls</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Use these controls to quickly manage system-wide security and payment settings.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Power className="h-4 w-4" />
                    <Label htmlFor="payments-toggle">Payment Processing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={settings.payments_enabled ? "default" : "destructive"}>
                      {settings.payments_enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      id="payments-toggle"
                      checked={settings.payments_enabled}
                      onCheckedChange={(checked) => updateSetting('payments_enabled', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <Label htmlFor="maintenance-toggle">Maintenance Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={settings.maintenance_mode ? "destructive" : "default"}>
                      {settings.maintenance_mode ? "Active" : "Inactive"}
                    </Badge>
                    <Switch
                      id="maintenance-toggle"
                      checked={settings.maintenance_mode}
                      onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-destructive">Emergency Actions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-destructive">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Power className="h-4 w-4 text-destructive" />
                      <h4 className="font-medium">Pause All Payments</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Immediately disable all cryptocurrency payment processing while keeping other services active.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full">
                          Pause Payments
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Pause All Payments?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will immediately disable all cryptocurrency payment processing. 
                            Users will not be able to make payments until you re-enable this feature.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => updateSetting('payments_enabled', false)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Pause Payments
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RotateCcw className="h-4 w-4 text-destructive" />
                      <h4 className="font-medium">Emergency Reset</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Disable all crypto services, backup addresses, and enable maintenance mode. 
                      Use only in emergency situations.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full">
                          Emergency Reset
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Perform Emergency Reset?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>Disable all cryptocurrency configurations</li>
                              <li>Disable all backup addresses</li>
                              <li>Stop all payment processing</li>
                              <li>Enable maintenance mode</li>
                            </ul>
                            <br />
                            This action should only be used in emergency situations and will require manual re-configuration.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleEmergencyReset}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Perform Emergency Reset
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Current System Status</h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Payments:</span>{' '}
                <Badge variant={settings.payments_enabled ? "default" : "destructive"} className="ml-1">
                  {settings.payments_enabled ? "Operational" : "Disabled"}
                </Badge>
              </p>
              <p>
                <span className="font-medium">Maintenance Mode:</span>{' '}
                <Badge variant={settings.maintenance_mode ? "destructive" : "default"} className="ml-1">
                  {settings.maintenance_mode ? "Active" : "Inactive"}
                </Badge>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyControls;