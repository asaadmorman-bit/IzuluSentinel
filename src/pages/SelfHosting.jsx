import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, Download, Copy, Check, Terminal, Package, Database, Shield } from "lucide-react";

export default function SelfHosting() {
  const [copied, setCopied] = useState(false);

  const dockerCompose = `version: '3.8'

services:
  izulu-sentinel:
    image: izulusentinel/platform:latest
    ports:
      - "3000:3000"
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/izulu
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-secret-key
      - THREAT_FEED_API_KEY=your-api-key
    depends_on:
      - postgres
      - redis
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=izulu
      - POSTGRES_PASSWORD=secure-password
      - POSTGRES_DB=izulu_sentinel
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - izulu-sentinel
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:`;

  const kubernetesYaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: izulu-sentinel
  namespace: security
spec:
  replicas: 3
  selector:
    matchLabels:
      app: izulu-sentinel
  template:
    metadata:
      labels:
        app: izulu-sentinel
    spec:
      containers:
      - name: izulu-sentinel
        image: izulusentinel/platform:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: izulu-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
---
apiVersion: v1
kind: Service
metadata:
  name: izulu-sentinel-service
  namespace: security
spec:
  selector:
    app: izulu-sentinel
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const systemRequirements = [
    { component: "CPU", requirement: "4 cores minimum, 8 cores recommended" },
    { component: "RAM", requirement: "8GB minimum, 16GB recommended" },
    { component: "Storage", requirement: "100GB SSD minimum" },
    { component: "Network", requirement: "1 Gbps connection" },
    { component: "OS", requirement: "Ubuntu 20.04+, CentOS 8+, or RHEL 8+" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Server className="w-8 h-8 text-[#DC2626]" />
            Self-Hosting Deployment
          </h1>
          <p className="text-gray-400">Deploy Izulu Sentinel on your own infrastructure</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Package className="w-8 h-8 text-[#DC2626] mb-2" />
              <p className="text-sm text-gray-400 mb-1">Version</p>
              <p className="text-xl font-bold text-white">v2.1.0</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Server className="w-8 h-8 text-emerald-500 mb-2" />
              <p className="text-sm text-gray-400 mb-1">Deployment</p>
              <p className="text-xl font-bold text-white">Options</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Database className="w-8 h-8 text-cyan-500 mb-2" />
              <p className="text-sm text-gray-400 mb-1">Database</p>
              <p className="text-xl font-bold text-white">PostgreSQL</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Shield className="w-8 h-8 text-purple-500 mb-2" />
              <p className="text-sm text-gray-400 mb-1">Security</p>
              <p className="text-xl font-bold text-white">Built-in</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">System Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {systemRequirements.map((req, idx) => (
                <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <p className="text-sm text-gray-400 mb-1">{req.component}</p>
                  <p className="text-white font-medium">{req.requirement}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="docker" className="w-full">
          <TabsList className="bg-[#1a1a1a] border border-[#2a2a2a]">
            <TabsTrigger value="docker">Docker Compose</TabsTrigger>
            <TabsTrigger value="kubernetes">Kubernetes</TabsTrigger>
            <TabsTrigger value="manual">Manual Installation</TabsTrigger>
          </TabsList>

          <TabsContent value="docker" className="space-y-4 mt-6">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Docker Compose Configuration</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(dockerCompose)}
                    className="border-[#2a2a2a] text-white"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-[#1a1a1a] rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                  <pre>{dockerCompose}</pre>
                </div>

                <div className="mt-6 space-y-4">
                  <h4 className="font-semibold text-white">Quick Start Commands:</h4>
                  <div className="space-y-2">
                    <div className="bg-[#1a1a1a] rounded p-3">
                      <code className="text-sm text-cyan-400">docker-compose up -d</code>
                      <p className="text-xs text-gray-400 mt-1">Start all services</p>
                    </div>
                    <div className="bg-[#1a1a1a] rounded p-3">
                      <code className="text-sm text-cyan-400">docker-compose logs -f izulu-sentinel</code>
                      <p className="text-xs text-gray-400 mt-1">View logs</p>
                    </div>
                    <div className="bg-[#1a1a1a] rounded p-3">
                      <code className="text-sm text-cyan-400">docker-compose down</code>
                      <p className="text-xs text-gray-400 mt-1">Stop all services</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kubernetes" className="space-y-4 mt-6">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Kubernetes Deployment</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(kubernetesYaml)}
                    className="border-[#2a2a2a] text-white"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-[#1a1a1a] rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                  <pre>{kubernetesYaml}</pre>
                </div>

                <div className="mt-6 space-y-4">
                  <h4 className="font-semibold text-white">Deployment Commands:</h4>
                  <div className="space-y-2">
                    <div className="bg-[#1a1a1a] rounded p-3">
                      <code className="text-sm text-cyan-400">kubectl create namespace security</code>
                      <p className="text-xs text-gray-400 mt-1">Create namespace</p>
                    </div>
                    <div className="bg-[#1a1a1a] rounded p-3">
                      <code className="text-sm text-cyan-400">kubectl apply -f izulu-deployment.yaml</code>
                      <p className="text-xs text-gray-400 mt-1">Deploy application</p>
                    </div>
                    <div className="bg-[#1a1a1a] rounded p-3">
                      <code className="text-sm text-cyan-400">kubectl get pods -n security</code>
                      <p className="text-xs text-gray-400 mt-1">Check pod status</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 mt-6">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Manual Installation Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#DC2626] rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">Install Dependencies</h4>
                      <div className="bg-[#1a1a1a] rounded p-3">
                        <code className="text-sm text-cyan-400">
                          sudo apt update && sudo apt install -y postgresql redis-server nodejs npm
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#DC2626] rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">Download Izulu Sentinel</h4>
                      <div className="bg-[#1a1a1a] rounded p-3">
                        <code className="text-sm text-cyan-400">
                          wget https://releases.izulusentinel.com/latest/izulu-sentinel.tar.gz
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#DC2626] rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">Configure Database</h4>
                      <div className="bg-[#1a1a1a] rounded p-3">
                        <code className="text-sm text-cyan-400">
                          psql -U postgres -c "CREATE DATABASE izulu_sentinel;"
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#DC2626] rounded-full flex items-center justify-center text-white font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">Set Environment Variables</h4>
                      <div className="bg-[#1a1a1a] rounded p-3 space-y-1">
                        <code className="text-sm text-cyan-400 block">export DATABASE_URL="postgresql://user:pass@localhost:5432/izulu"</code>
                        <code className="text-sm text-cyan-400 block">export REDIS_URL="redis://localhost:6379"</code>
                        <code className="text-sm text-cyan-400 block">export JWT_SECRET="your-secret-key"</code>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#DC2626] rounded-full flex items-center justify-center text-white font-bold">
                      5
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">Start Application</h4>
                      <div className="bg-[#1a1a1a] rounded p-3">
                        <code className="text-sm text-cyan-400">
                          npm install && npm run start
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Configuration Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">Server Port</Label>
                  <Input
                    defaultValue="3000"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Admin Email</Label>
                  <Input
                    placeholder="admin@izulusentinel.com"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">JWT Secret</Label>
                  <Input
                    type="password"
                    placeholder="Your secure secret key"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Backup Frequency</Label>
                  <Input
                    defaultValue="Daily"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  />
                </div>
              </div>

              <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
                <Download className="w-4 h-4 mr-2" />
                Download Configuration File
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#DC2626]/30 bg-[#DC2626]/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-[#DC2626] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-white mb-2">Enterprise Support Available</h3>
                <p className="text-gray-300 mb-4">
                  Get dedicated support for your self-hosted deployment. Our team can assist with installation,
                  configuration, scaling, and ongoing maintenance.
                </p>
                <a 
                  href="mailto:enterprise@izulusentinel.com"
                  className="text-[#DC2626] hover:text-[#B91C1C] font-semibold"
                >
                  Contact Enterprise Support →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}