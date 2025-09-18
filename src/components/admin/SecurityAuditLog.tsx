import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Download, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: 'login' | 'logout' | 'address_update' | 'backup_address_add' | 'backup_address_delete' | 'test_connection' | 'pause_payments' | 'emergency_reset' | 'export_logs';
  description: string | null;
  ip_address: unknown;
  user_agent: string | null;
  metadata: any;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string;
  } | null;
}

const SecurityAuditLog = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      let query = supabase
        .from('security_audit_log')
        .select(`
          *,
          profiles:user_id (
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(200);

      if (actionFilter !== 'all') {
        query = query.eq('action', actionFilter as AuditLog['action']);
      }

      if (searchTerm) {
        query = query.or(`description.ilike.%${searchTerm}%,action.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs((data as unknown as AuditLog[]) || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLogs();
  };

  const handleExportLogs = async () => {
    setExporting(true);
    
    try {
      // In a real application, you might want to implement server-side export
      // For now, we'll create a simple CSV export
      const csvContent = [
        'Date,User,Action,Description,IP Address',
        ...logs.map(log => [
          new Date(log.created_at).toISOString(),
          log.profiles?.email || 'System',
          log.action,
          log.description || '',
          log.ip_address || ''
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security_audit_log_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Log export action
      await supabase
        .from('security_audit_log')
        .insert({
          action: 'export_logs',
          description: 'Exported security audit logs'
        });

      toast.success('Audit logs exported successfully');
    } catch (error) {
      console.error('Error exporting logs:', error);
      toast.error('Failed to export audit logs');
    } finally {
      setExporting(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login':
        return 'default';
      case 'logout':
        return 'secondary';
      case 'address_update':
      case 'backup_address_add':
      case 'backup_address_delete':
        return 'outline';
      case 'emergency_reset':
      case 'pause_payments':
        return 'destructive';
      default:
        return 'secondary';
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
          <CardTitle className="flex items-center justify-between">
            Security Audit Log
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportLogs}
                disabled={exporting}
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export Logs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="address_update">Address Update</SelectItem>
                  <SelectItem value="backup_address_add">Backup Address Add</SelectItem>
                  <SelectItem value="backup_address_delete">Backup Address Delete</SelectItem>
                  <SelectItem value="test_connection">Test Connection</SelectItem>
                  <SelectItem value="pause_payments">Pause Payments</SelectItem>
                  <SelectItem value="emergency_reset">Emergency Reset</SelectItem>
                  <SelectItem value="export_logs">Export Logs</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchLogs}>
                Apply Filters
              </Button>
            </div>

            {/* Audit Log Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No audit logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {log.profiles?.email || log.profiles?.full_name || 'System'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getActionColor(log.action)}>
                            {log.action.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.description || '--'}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {(log.ip_address as string) || '--'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityAuditLog;