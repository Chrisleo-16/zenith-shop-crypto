import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CryptoConfiguration from '@/components/admin/CryptoConfiguration';
import BackupAddresses from '@/components/admin/BackupAddresses';
import TransactionMonitor from '@/components/admin/TransactionMonitor';
import SecurityAuditLog from '@/components/admin/SecurityAuditLog';
import EmergencyControls from '@/components/admin/EmergencyControls';

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>You don't have admin privileges to access this dashboard.</p>
            <Button onClick={() => window.location.href = '/'}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Crypto Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </span>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="crypto-config" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="crypto-config">Payment Config</TabsTrigger>
            <TabsTrigger value="backup-addresses">Backup Addresses</TabsTrigger>
            <TabsTrigger value="transactions">Transaction Monitor</TabsTrigger>
            <TabsTrigger value="security-log">Security Audit</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Controls</TabsTrigger>
          </TabsList>

          <TabsContent value="crypto-config" className="space-y-6">
            <CryptoConfiguration />
          </TabsContent>

          <TabsContent value="backup-addresses" className="space-y-6">
            <BackupAddresses />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <TransactionMonitor />
          </TabsContent>

          <TabsContent value="security-log" className="space-y-6">
            <SecurityAuditLog />
          </TabsContent>

          <TabsContent value="emergency" className="space-y-6">
            <EmergencyControls />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;