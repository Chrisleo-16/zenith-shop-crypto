import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CryptoConfig {
  id: string;
  currency_symbol: string;
  currency_name: string;
  wallet_address: string;
  is_active: boolean | null;
  min_confirmation?: number;
}

interface CryptoSelectorProps {
  totalAmount: number;
  onCryptoSelect: (crypto: CryptoConfig) => void;
}

const CryptoSelector = ({ totalAmount, onCryptoSelect }: CryptoSelectorProps) => {
  const [cryptos, setCryptos] = useState<CryptoConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchCryptos();
  }, []);



const fetchCryptos = async () => {
  try {
    const { data, error } = await supabase
      .from("crypto_config")
      .select("id, currency_symbol, currency_name, wallet_address, is_active, min_confirmation")
      .eq("is_active", true)
      .order("currency_symbol");

    if (error) throw error;
    setCryptos(data || []);
  } catch (error) {
    console.error("Error fetching cryptos:", error);
    toast.error("Failed to load payment methods");
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <Button variant="crypto" className="w-full" disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading crypto options...
      </Button>
    );
  }

  if (cryptos.length === 0) {
    return (
      <Button variant="crypto" className="w-full opacity-50" disabled>
        <Coins className="w-4 h-4 mr-2" />
        No crypto payments available
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      {/* Toggle button */}
      <Button
        variant="crypto"
        className="w-full group justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <Coins className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
          Pay with Crypto
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>

      {/* Expandable list */}
      {expanded && (
        <Card>
          <CardContent className="p-3 space-y-2">
            {cryptos.map((crypto) => (
              <Button
                key={crypto.id}
                variant="outline"
                className="w-full justify-between text-sm hover:bg-accent/50"
                onClick={() => {
                  toast.success(`Selected ${crypto.currency_name}`);
                  onCryptoSelect(crypto);
                }}
              >
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-accent">
                      {crypto.currency_symbol}
                    </span>
                    <span className="text-muted-foreground">
                      {crypto.currency_name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground break-all">
                    {crypto.wallet_address}
                  </span>
                  {crypto.min_confirmation && (
                    <span className="text-xs text-muted-foreground">
                      Min confirmations: {crypto.min_confirmation}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  ≈ {getEstimatedAmount(crypto.currency_symbol, totalAmount)}
                </span>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// 🔑 Simple placeholder exchange rates (replace with live API later)
const getEstimatedAmount = (symbol: string, usdAmount: number): string => {
  const rates: Record<string, number> = {
    BTC: 30000,
    ETH: 2000,
    USDT: 1,
    USDC: 1,
    LTC: 100,
  };

  const rate = rates[symbol.toUpperCase()] || 1000;
  return (usdAmount / rate).toFixed(6);
};

export default CryptoSelector;
