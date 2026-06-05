import { useQuery } from '@tanstack/react-query';

export interface ThreatTelemetry {
  id: string;
  type: 'typosquatting' | 'leaked_credential' | 'domain_lookup';
  source: string;
  exposure: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

interface UseSentinelTelemetryOptions {
  tenantId: string;
  mock?: boolean;
  enabled?: boolean;
}

export function useSentinelTelemetry({ tenantId, mock = false, enabled = true }: UseSentinelTelemetryOptions) {
  return useQuery<ThreatTelemetry[]>({
    queryKey: ['sentinel', 'telemetry', tenantId, mock],
    queryFn: async () => {
      const isProductionMode = import.meta.env.VITE_SENTINEL_ENV === 'production';
      const productionUrl = import.meta.env.VITE_PRODUCTION_API_URL || 'https://izulusentinel.com';
      
      // Enforce strict query filter matching Rule 2 (Data Isolation)
      const params = new URLSearchParams({
        tenant_id: tenantId,
        ...(mock && { mock: 'true' })
      });

      // If production mode is active, fetch straight from live domain; otherwise, hit local proxy
      const targetBase = isProductionMode ? productionUrl : '';
      const requestUrl = `${targetBase}/api/v1/monitoring/domains?${params.toString()}`;

      const response = await fetch(requestUrl, {
        headers: {
          'Content-Type': 'application/json',
          // Space here to include production API Authorization tokens if required by the live domain
        }
      });
      
      if (!response.ok) {
        // Enforce Rule 1: Fallback gracefully to prevent THYREOS crashes
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!tenantId && enabled,
    refetchInterval: 15000, // Poll telemetry streams every 15 seconds
  });
}