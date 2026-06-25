import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { DEALS_SHEET_CSV_URL, Deal, DealRow } from '@/config/dealsSheet';

export function useTodaysDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDeals = async () => {
      try {
        setLoading(true);
        const response = await fetch(DEALS_SHEET_CSV_URL);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch deals: ${response.status} ${response.statusText}`);
        }
        
        const csvText = await response.text();
        
        Papa.parse<DealRow>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (!isMounted) return;

            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;

            const parsedDeals: Deal[] = results.data
              .filter((row) => {
                if (row.active?.toUpperCase() !== "TRUE") return false;
                
                // Date Validation
                // format in CSV is YYYY-MM-DD
                if (!row.valid_from || !row.valid_to) return false;
                
                if (todayStr > row.valid_to) {
                   return false;
                }
                
                return true;
              })
              .map((row) => ({
                ...row,
                price_cad: Number(row.price_cad) || 0,
              }))
              .sort((a, b) => {
                if (a.valid_from < b.valid_from) return -1;
                if (a.valid_from > b.valid_from) return 1;
                return 0;
              });

            setDeals(parsedDeals);
            setError(null);
            setLoading(false);
          },
          error: (error: any) => {
            if (!isMounted) return;
            console.error("PapaParse error:", error);
            setError(error as Error);
            setLoading(false);
          }
        });
      } catch (err) {
        if (!isMounted) return;
        console.error("Fetch deals error:", err);
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchDeals();

    // Refresh every 10 minutes
    const intervalId = setInterval(fetchDeals, 10 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { deals, loading, error };
}
