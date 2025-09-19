import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CryptoManagement from '@/components/admin/CryptoManagement';
import BackupAddresses from '@/components/admin/BackupAddresses';
import TransactionMonitor from '@/components/admin/TransactionMonitor';
import SecurityAuditLog from '@/components/admin/SecurityAuditLog';
import EmergencyControls from '@/components/admin/EmergencyControls';
import ProductManagement from '@/components/admin/ProductManagement';

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("products");

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
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </span>
            <Button variant="outline" onClick={signOut} size="sm" className="w-full sm:w-auto">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          
          {/* Desktop Tabs */}
          <TabsList className="hidden lg:grid w-full grid-cols-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="crypto-config">Payments</TabsTrigger>
            <TabsTrigger value="backup-addresses">Backups</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="security-log">Security</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>

          {/* Mobile Dropdown */}
          <div className="block lg:hidden mb-4">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full border rounded-md p-3 bg-background text-sm"
            >
              <option value="products">Product Management</option>
              <option value="crypto-config">Payment Configuration</option>
              <option value="backup-addresses">Backup Addresses</option>
              <option value="transactions">Transaction Monitor</option>
              <option value="security-log">Security Audit</option>
              <option value="emergency">Emergency Controls</option>
            </select>
          </div>

          <TabsContent value="products" className="space-y-6">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="crypto-config" className="space-y-6">
            <CryptoManagement />
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
