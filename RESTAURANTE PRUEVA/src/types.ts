export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'tarde' | 'noche';
  image: string;
  available: boolean;
}

export interface SiteConfig {
  businessName: string;
  logoUrl: string;
  phone: string;
  address: string;
  slogan: string;
}

export interface BusinessInfo {
  businessName: string;
  logoUrl: string;
  phone: string;
  address: string;
  slogan: string;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  type: 'tarde' | 'noche';
  notes: string;
  status: 'pendiente' | 'confirmada' | 'rechazada';
  createdAt: string;
}
