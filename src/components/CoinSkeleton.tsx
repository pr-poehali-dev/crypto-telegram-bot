export default function CoinSkeleton() {
  return (
    <div className="bg-card rounded-xl p-4 border border-border animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted" />
          <div>
            <div className="h-4 w-24 bg-muted rounded mb-2" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
        </div>
        <div className="w-8 h-8 bg-muted rounded-full" />
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="h-3 w-12 bg-muted rounded mb-2" />
          <div className="h-5 w-20 bg-muted rounded" />
        </div>
        <div>
          <div className="h-3 w-16 bg-muted rounded mb-2" />
          <div className="h-5 w-16 bg-muted rounded" />
        </div>
        <div>
          <div className="h-3 w-14 bg-muted rounded mb-2" />
          <div className="h-5 w-20 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
