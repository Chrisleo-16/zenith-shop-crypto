import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  SidebarProvider, 
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { 
  User, 
  CreditCard, 
  Package, 
  Gift, 
  Settings, 
  Home,
  TrendingUp,
  DollarSign,
  Calendar,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  points: number;
}

interface Payment {
  id: string;
  amount: number;
  product_name: string;
  status: string;
  payment_method: string;
  created_at: string;
}

interface UserProduct {
  id: string;
  product_id: string;
  status: string;
  quantity: number;
  created_at: string;
  products: {
    name: string;
    price: number;
    image_url: string;
  };
}

interface BonusMilestone {
  id: string;
  points_required: number;
  reward_title: string;
  reward_description: string;
}

const menuItems = [
  { title: "Overview", url: "overview", icon: Home },
  { title: "Payments", url: "payments", icon: CreditCard },
  { title: "Products", url: "products", icon: Package },
  { title: "Bonuses", url: "bonuses", icon: Gift },
  { title: "Settings", url: "settings", icon: Settings },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={activeTab === item.url ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                  >
                    <button
                      onClick={() => setActiveTab(item.url)}
                      className="w-full justify-start"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const UserDashboard = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [userProducts, setUserProducts] = useState<UserProduct[]>([]);
  const [milestones, setMilestones] = useState<BonusMilestone[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from('user_payments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (paymentsData) {
        setPayments(paymentsData);
      }

      // Fetch user products
      const { data: productsData } = await supabase
        .from('user_products')
        .select(`
          *,
          products (
            name,
            price,
            image_url
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (productsData) {
        setUserProducts(productsData);
      }

      // Fetch bonus milestones
      const { data: milestonesData } = await supabase
        .from('bonus_milestones')
        .select('*')
        .eq('is_active', true)
        .order('points_required', { ascending: true });
      
      if (milestonesData) {
        setMilestones(milestonesData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const exportPayments = () => {
    if (payments.length === 0) {
      toast.error('No payments to export');
      return;
    }

    const csvContent = [
      ['Date', 'Product', 'Amount', 'Status', 'Payment Method'].join(','),
      ...payments.map(payment => [
        new Date(payment.created_at).toLocaleDateString(),
        payment.product_name || 'N/A',
        payment.amount,
        payment.status,
        payment.payment_method || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Payments exported successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const totalPayments = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const completedPayments = payments.filter(p => p.status === 'completed');
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const currentPoints = profile?.points || 0;

  const nextMilestone = milestones.find(m => m.points_required > currentPoints);
  const currentMilestone = milestones.filter(m => m.points_required <= currentPoints).slice(-1)[0];
  const progressToNext = nextMilestone 
    ? ((currentPoints - (currentMilestone?.points_required || 0)) / (nextMilestone.points_required - (currentMilestone?.points_required || 0))) * 100
    : 100;

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPayments.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From {payments.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayments.length}</div>
            <p className="text-xs text-muted-foreground">Successful payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bonus Points</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPoints}</div>
            <p className="text-xs text-muted-foreground">
              {currentMilestone ? currentMilestone.reward_title : 'Start earning points!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {nextMilestone && (
        <Card>
          <CardHeader>
            <CardTitle>Progress to Next Milestone</CardTitle>
            <CardDescription>
              {nextMilestone.points_required - currentPoints} points to unlock {nextMilestone.reward_title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressToNext} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {currentPoints} / {nextMilestone.points_required} points
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{payment.product_name || 'Payment'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${payment.amount}</p>
                    <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userProducts.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    {item.products.image_url ? (
                      <img 
                        src={item.products.image_url} 
                        alt={item.products.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.products.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} • ${item.products.price}
                    </p>
                  </div>
                  <Badge>{item.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment History</h2>
        <Button onClick={exportPayments} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Method</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">{payment.product_name || 'N/A'}</td>
                    <td className="p-4 font-medium">${payment.amount}</td>
                    <td className="p-4">
                      <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="p-4">{payment.payment_method || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Products</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userProducts.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="aspect-video w-full rounded-lg bg-muted mb-4 overflow-hidden">
                {item.products.image_url ? (
                  <img 
                    src={item.products.image_url} 
                    alt={item.products.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold mb-2">{item.products.name}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                <span className="font-medium">${item.products.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <Badge>{item.status}</Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBonuses = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Rewards & Bonuses</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            You have {currentPoints} points • 
            {currentMilestone ? ` Current level: ${currentMilestone.reward_title}` : ' Start earning points!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {nextMilestone && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to {nextMilestone.reward_title}</span>
                <span>{currentPoints} / {nextMilestone.points_required}</span>
              </div>
              <Progress value={progressToNext} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {milestones.map((milestone) => (
          <Card key={milestone.id} className={currentPoints >= milestone.points_required ? 'ring-2 ring-accent' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{milestone.reward_title}</CardTitle>
                {currentPoints >= milestone.points_required && (
                  <Badge className="bg-accent">Unlocked</Badge>
                )}
              </div>
              <CardDescription>{milestone.points_required} points required</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{milestone.reward_description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Account Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <p className="text-sm text-muted-foreground">{profile?.full_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Total Points</label>
            <p className="text-sm text-muted-foreground">{profile?.points} points</p>
          </div>
          <Separator />
          <Button variant="outline" className="w-full">
            Edit Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'payments':
        return renderPayments();
      case 'products':
        return renderProducts();
      case 'bonuses':
        return renderBonuses();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="w-60" collapsible="icon">
          <SidebarTrigger className="m-2 self-end" />
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild
                        className={activeTab === item.url ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                      >
                        <button
                          onClick={() => setActiveTab(item.url)}
                          className="w-full justify-start"
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold gradient-text">
                Welcome back, {profile?.full_name || 'User'}!
              </h1>
              <p className="text-muted-foreground">
                Manage your account, track payments, and explore rewards.
              </p>
            </div>
            
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;