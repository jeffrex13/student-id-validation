import { Card, CardContent } from '@/components/ui/card';

interface CardProps {
  title: string;
  value: string | number;
  className?: string;
}

export function CustomCard({ title, value, className }: CardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
}
