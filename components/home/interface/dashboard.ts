export interface DashboardCard {
  title: string;
  value: string;
  change: string;
  color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  icon: React.ReactNode;
}
