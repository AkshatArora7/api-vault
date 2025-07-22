export interface ApiKey {
  id: string;
  name: string;
  description?: string;
  keyValue: string;
  service: string;
  environment: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
  userId: string;
  tags: Tag[];
  usageCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}
