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
      // Direct ingestion filter mapping to the Izulu Sentinel API requirements
      const params = new URLSearchParams({
        tenant_id: tenantId,
        ...(mock && { mode: 'live' }) // or mock=true based on your specific backend flag
      });

      const response = await fetch(`/api/v1/monitoring/domains?${params.toString()}`);
      
      if (!response.ok) {
        // Rule 1: Fallback gracefully to prevent client parser runtime crashes
        return [];
      }

      const data = await response.json();
      
      // Secondary check: Ensure the response is strictly an array before passing to components
      return Array.isArray(data) ? data : [];
    },
    enabled: !!tenantId && enabled,
    refetchInterval: 10000, // Pull fresh intelligence telemetry every 10 seconds
  });
}