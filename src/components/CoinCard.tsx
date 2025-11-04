import { useState, useEffect } from 'react';
import { CryptoCoin } from '@/types/crypto';
import { formatPrice, formatVolume, formatPercentage } from '@/utils/formatters';
import { isFavorite, addFavorite, removeFavorite } from '@/utils/favorites';
import Icon from '@/components/ui/icon';

interface CoinCardProps {
  coin: CryptoCoin;
  onClick: () => void;
}

export default function CoinCard({ coin, onClick }: CoinCardProps) {
  const [favorite, setFavorite] = useState(false);
  const isPositive = coin.price_change_percentage_24h >= 0;

  useEffect(() => {
    setFavorite(isFavorite(coin.id));
  }, [coin.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(coin.id);
    } else {
      addFavorite(coin.id);
    }
    setFavorite(!favorite);
  };

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-all cursor-pointer hover:scale-[1.02] animate-fade-in"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="font-semibold text-foreground">{coin.name}</h3>
            <p className="text-sm text-muted-foreground uppercase">{coin.symbol}</p>
          </div>
        </div>
        
        <button
          onClick={handleFavoriteClick}
          className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
        >
          <Icon
            name={favorite ? 'Star' : 'Star'}
            size={20}
            className={favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}
          />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Цена</p>
          <p className="font-semibold text-foreground">{formatPrice(coin.current_price)}</p>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground mb-1">24ч</p>
          <p className={`font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {formatPercentage(coin.price_change_percentage_24h)}
          </p>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground mb-1">Объём</p>
          <p className="font-semibold text-foreground">{formatVolume(coin.total_volume)}</p>
        </div>
      </div>
    </div>
  );
}
