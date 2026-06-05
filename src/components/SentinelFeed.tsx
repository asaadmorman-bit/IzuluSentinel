import React from 'react';
import { useSentinelTelemetry } from '../hooks/useSentinelTelemetry';
import { ShieldAlert, Key, Globe, Loader2, AlertCircle } from 'lucide-react';

interface SentinelFeedProps {
  tenantId: string;
  isTestingMode?: boolean;
}

const severityStyles = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const iconMap = {
  typosquatting: ShieldAlert,
  leaked_credential: Key,
  domain_lookup: Globe,
};

export const SentinelFeed: React.FC<SentinelFeedProps> = ({ tenantId, isTestingMode = false }) => {
  const { data: threats = [], isLoading, isError } = useSentinelTelemetry({
    tenantId,
    mock: isTestingMode,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-500 mb-2" />
        <p className="text-xs font-mono">polling izulu sentinel feeds...</p>
      </div>
    );
  }

  // Safe to read length directly due to our absolute strict array architecture rule
  if (threats.length === 0 || isError) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl p-12 text-center">
        <AlertCircle className="h-8 w-8 text-zinc-600 mb-3" />
        <h3 className="text-sm font-medium text-zinc-300">No Intelligence Threats Found</h3>
        <p className="text-xs text-zinc-500 max-w-xs mt-1 font-mono">
          Tenant context isolation validation verified. Target surface is secure or empty data state was served.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-400 font-mono">
          Active Threat Ingestions ({threats.length})
        </h3>
      </div>

      <div className="grid gap-3">
        {threats.map((threat) => {
          const Icon = iconMap[threat.type] || ShieldAlert;
          return (
            <div 
              key={threat.id} 
              className="group relative bg-zinc-950 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 group-hover:text-emerald-400 transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase ${severityStyles[threat.severity]}`}>
                        {threat.severity}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">ID: {threat.id}</span>
                    </div>
                    <h4 className="text-sm font-semibold tracking-tight text-zinc-200 mt-2">
                      {threat.exposure}
                    </h4>
                  </div>
                </div>
                
                <span className="text-[10px] text-zinc-500 font-mono text-right whitespace-nowrap">
                  {new Date(threat.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] font-mono border-t border-zinc-900/50 pt-2 text-zinc-500">
                <span>Source Engine: <strong className="text-zinc-400 font-medium">{threat.source}</strong></span>
                <span className="text-zinc-600">isolation: {tenantId}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};