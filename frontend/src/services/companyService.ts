import { BASE_URL, handleJson } from './base';

// Company Types
export type CompanyDto = {
  id: number;
  name: string;
  domain: string | null;
  logo_url: string | null;
  is_active: boolean;
};

// Companies API
export async function searchCompanies(query: string): Promise<CompanyDto[]> {
  const url = `${BASE_URL}/api/companies/search?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  return handleJson<CompanyDto[]>(res);
}

