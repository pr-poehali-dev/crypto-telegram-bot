import Icon from '@/components/ui/icon';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <Icon name="AlertCircle" size={32} className="text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Ошибка загрузки</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all hover:scale-105"
        >
          Попробовать снова
        </button>
      )}
    </div>
  );
}
