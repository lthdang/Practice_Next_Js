export interface MenuData {
  id: string;
  name: string;
  children?: childrenData[];
  icon: React.ReactNode;
}

interface childrenData {
  id: string;
  name: string;
  icon: React.ReactNode;
}
