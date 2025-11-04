import { useEffect, useState } from 'react';
import { CoinDetail } from '@/types/crypto';
import { fetchCoinDetail } from '@/services/coingecko';
import { formatPrice, formatVolume, formatPercentage } from '@/utils/formatters';
import Icon from '@/components/ui/icon';
import PriceChart from './PriceChart';

interface CoinDetailModalProps {
  coinId: string;
  onClose: () => void;
}

export default function CoinDetailModal({ coinId, onClose }: CoinDetailModalProps) {
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCoinDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCoinDetail(coinId);
        setCoin(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load coin details');
      } finally {
        setLoading(false);
      }
    };

    loadCoinDetail();
  }, [coinId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-card rounded-2xl max-w-2xl w-full p-6 animate-scale-in">
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-card rounded-2xl max-w-2xl w-full p-6 animate-scale-in">
          <div className="flex flex-col items-center py-12">
            <Icon name="AlertCircle" size={48} className="text-destructive mb-4" />
            <p className="text-muted-foreground mb-6">{error || 'Ошибка загрузки'}</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPositive = coin.market_data.price_change_percentage_24h >= 0;
  const sparklineData = coin.market_data.sparkline_7d?.price || [];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={coin.image.large} alt={coin.name} className="w-12 h-12 rounded-full" />
            <div>
              <h2 className="text-2xl font-bold">{coin.name}</h2>
              <p className="text-muted-foreground uppercase">{coin.symbol}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Текущая цена</p>
            <p className="text-4xl font-bold">
              {formatPrice(coin.market_data.current_price.usd)}
            </p>
            <p className={`text-lg font-semibold mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {formatPercentage(coin.market_data.price_change_percentage_24h)}
            </p>
          </div>

          {sparklineData.length > 0 && (
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-4">График за 7 дней</p>
              <PriceChart prices={sparklineData} isPositive={isPositive} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-2">Изменение за 7д</p>
              <p className={`text-xl font-bold ${coin.market_data.price_change_percentage_7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercentage(coin.market_data.price_change_percentage_7d)}
              </p>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-2">Изменение за 30д</p>
              <p className={`text-xl font-bold ${coin.market_data.price_change_percentage_30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercentage(coin.market_data.price_change_percentage_30d)}
              </p>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-2">Рыночная капитализация</p>
              <p className="text-xl font-bold">{formatVolume(coin.market_data.market_cap.usd)}</p>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-2">Объём торгов</p>
              <p className="text-xl font-bold">{formatVolume(coin.market_data.total_volume.usd)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
