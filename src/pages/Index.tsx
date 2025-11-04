import { useState, useEffect, useMemo } from 'react';
import { CryptoCoin } from '@/types/crypto';
import { fetchMarketData } from '@/services/coingecko';
import { getFavorites } from '@/utils/favorites';
import CoinCard from '@/components/CoinCard';
import CoinSkeleton from '@/components/CoinSkeleton';
import ErrorMessage from '@/components/ErrorMessage';
import CoinDetailModal from '@/components/CoinDetailModal';
import Icon from '@/components/ui/icon';

type Tab = 'market' | 'favorites';
type SortField = 'price' | 'change' | 'volume';

const Index = () => {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('market');
  const [sortField, setSortField] = useState<SortField>('price');
  const [sortAscending, setSortAscending] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const COINS_PER_PAGE = 10;

  const loadMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMarketData(currentPage, COINS_PER_PAGE);
      setCoins(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarketData();
    const interval = setInterval(() => {
      loadMarketData();
    }, 60000);
    return () => clearInterval(interval);
  }, [currentPage]);

  useEffect(() => {
    setFavorites(getFavorites());
    const handleStorageChange = () => {
      setFavorites(getFavorites());
    };
    window.addEventListener('storage', handleStorageChange);
    const handleFavUpdate = () => setFavorites(getFavorites());
    window.addEventListener('favoritesUpdated', handleFavUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleFavUpdate);
    };
  }, [selectedCoinId]);

  const filteredAndSortedCoins = useMemo(() => {
    let result = coins;

    if (activeTab === 'favorites') {
      result = result.filter(coin => favorites.includes(coin.id));
    }

    if (searchQuery) {
      result = result.filter(
        coin =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result = [...result].sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (sortField) {
        case 'price':
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case 'change':
          aValue = a.price_change_percentage_24h;
          bValue = b.price_change_percentage_24h;
          break;
        case 'volume':
          aValue = a.total_volume;
          bValue = b.total_volume;
          break;
        default:
          return 0;
      }

      return sortAscending ? aValue - bValue : bValue - aValue;
    });

    return result;
  }, [coins, searchQuery, activeTab, sortField, sortAscending, favorites]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAscending(!sortAscending);
    } else {
      setSortField(field);
      setSortAscending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl gradient-purple flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">CryptoTracker</h1>
          </div>
          <p className="text-muted-foreground">Отслеживайте криптовалюты в реальном времени</p>
        </header>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Icon
                name="Search"
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Поиск по названию или тикеру..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2 bg-card rounded-xl p-1 border border-border">
              <button
                onClick={() => setActiveTab('market')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'market'
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="BarChart3" size={18} className="inline mr-2" />
                Рынок
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="Star" size={18} className="inline mr-2" />
                Избранное {favorites.length > 0 && `(${favorites.length})`}
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleSort('price')}
                className={`px-4 py-2 rounded-xl font-medium transition-all border text-sm ${
                  sortField === 'price'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                Цена {sortField === 'price' && (sortAscending ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSort('change')}
                className={`px-4 py-2 rounded-xl font-medium transition-all border text-sm ${
                  sortField === 'change'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                24ч {sortField === 'change' && (sortAscending ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSort('volume')}
                className={`px-4 py-2 rounded-xl font-medium transition-all border text-sm ${
                  sortField === 'volume'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                Объём {sortField === 'volume' && (sortAscending ? '↑' : '↓')}
              </button>
            </div>
          </div>

          {error && <ErrorMessage message={error} onRetry={loadMarketData} />}

          {loading && !error && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: COINS_PER_PAGE }).map((_, i) => (
                <CoinSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && !error && filteredAndSortedCoins.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
              <Icon name="SearchX" size={64} className="text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">
                {activeTab === 'favorites'
                  ? 'Вы пока не добавили монеты в избранное'
                  : 'Ничего не найдено'}
              </p>
            </div>
          )}

          {!loading && !error && filteredAndSortedCoins.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedCoins.map(coin => (
                <CoinCard
                  key={coin.id}
                  coin={coin}
                  onClick={() => setSelectedCoinId(coin.id)}
                />
              ))}
            </div>
          )}

          {!loading && !error && activeTab === 'market' && !searchQuery && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-6 py-2.5 bg-card border border-border rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/50 transition-all"
              >
                <Icon name="ChevronLeft" size={20} className="inline mr-1" />
                Назад
              </button>
              
              <span className="text-muted-foreground">
                Страница {currentPage}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-6 py-2.5 bg-card border border-border rounded-xl font-medium hover:border-primary/50 transition-all"
              >
                Вперёд
                <Icon name="ChevronRight" size={20} className="inline ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedCoinId && (
        <CoinDetailModal
          coinId={selectedCoinId}
          onClose={() => setSelectedCoinId(null)}
        />
      )}
    </div>
  );
};

export default Index;