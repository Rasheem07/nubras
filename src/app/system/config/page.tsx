// app/settings/configuration/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ConfigValue {
  key: string;
  value: string;
}

export default function ConfigurationPage() {
  const [configs, setConfigs] = useState<Record<string, string>>({
    STRIPE_PUBLIC_KEY: '',
    STRIPE_SECRET_KEY: '',
    STRIPE_WEBHOOK_SECRET: '',
    TWILIO_ACCOUNT_SID: '',
    TWILIO_AUTH_TOKEN: '',
    TWILIO_FROM_NUMBER: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch('http://alnubrasstudio.ddns.net/config', {credentials: 'include'});
      const data: ConfigValue[] = await response.json();
      
      const configMap = data.reduce((acc, config) => ({
        ...acc,
        [config.key]: config.value
      }), {});
      
      setConfigs(prev => ({
        ...prev,
        ...configMap
      }));
    } catch (error) {
      toast.error('Failed to load configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const promises = Object.entries(configs).map(([key, value]) => 
        fetch('http://alnubrasstudio.ddns.net/config', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value })
        })
      );

      await Promise.all(promises);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const ConfigSection = ({ title, fields }: { 
    title: string, 
    fields: Array<{ key: string; label: string; type: string; placeholder: string }> 
  }) => (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-medium text-white mb-4">{title}</h2>
      <div className="space-y-4">
        {fields.map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {label}
            </label>
            <div className="relative">
              <input
                type={type}
                value={configs[key] || ''}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="w-full px-4 py-2 text-sm text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder={placeholder}
              />
              {configs[key] && (
                <span className="absolute right-3 top-2 text-xs text-green-500">
                  ●
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Configuration</h1>
        <button
          onClick={saveChanges}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <ConfigSection
        title="Database Configuration"
        fields={[
          { key: 'POSTGRES_HOST', label: 'Host', type: 'text', placeholder: 'localhost' },
          { key: 'POSTGRES_PORT', label: 'Port', type: 'text', placeholder: '5432' },
          { key: 'POSTGRES_DB', label: 'Database Name', type: 'text', placeholder: 'myapp_db' },
          { key: 'POSTGRES_USER', label: 'Username', type: 'text', placeholder: 'postgres' },
          { key: 'POSTGRES_PASSWORD', label: 'Password', type: 'password', placeholder: 'Enter database password' },
          { key: 'POSTGRES_SSL_MODE', label: 'SSL Mode', type: 'text', placeholder: 'require' }
        ]}
      />

            <ConfigSection
                title="Payment Integration"
                fields={[
                    { key: 'STRIPE_PUBLIC_KEY', label: 'Stripe Public Key', type: 'text', placeholder: 'pk_test_...' },
                    { key: 'STRIPE_SECRET_KEY', label: 'Stripe Secret Key', type: 'password', placeholder: 'sk_test_...' },
                    { key: 'STRIPE_WEBHOOK_SECRET', label: 'Webhook Secret', type: 'password', placeholder: 'whsec_...' }
                ]}
            />

            <ConfigSection
                title="Communication Settings"
                fields={[
                    { key: 'TWILIO_ACCOUNT_SID', label: 'Twilio Account SID', type: 'text', placeholder: 'AC...' },
                    { key: 'TWILIO_AUTH_TOKEN', label: 'Twilio Auth Token', type: 'password', placeholder: 'Your auth token' },
                    { key: 'TWILIO_FROM_NUMBER', label: 'SMS From Number', type: 'text', placeholder: '+1234567890' }
                ]}
            />

            <ConfigSection
                title="Fax Configuration"
                fields={[
                    { key: 'INTRAFAX_API_KEY', label: 'Intrafax API Key', type: 'password', placeholder: 'Your API key' },
                    { key: 'INTRAFAX_ENDPOINT', label: 'API Endpoint', type: 'text', placeholder: 'https://api.intrafax.com' },
                    { key: 'INTRAFAX_FROM_NUMBER', label: 'Fax From Number', type: 'text', placeholder: '+1234567890' }
                ]}
            />

            <ConfigSection
                title="API Gateway Settings"
                fields={[
                    { key: 'API_ALLOWED_IPS', label: 'Allowed IP Addresses', type: 'text', placeholder: '10.0.0.0/24, 192.168.1.0/24' },
                    { key: 'API_RATE_LIMIT', label: 'Rate Limit (requests)', type: 'text', placeholder: '100' },
                    { key: 'API_RATE_WINDOW', label: 'Rate Window (seconds)', type: 'text', placeholder: '60' },
                    { key: 'API_MAX_BODY_SIZE', label: 'Max Request Body Size', type: 'text', placeholder: '10mb' },
                    { key: 'API_TIMEOUT', label: 'Request Timeout (ms)', type: 'text', placeholder: '30000' }
                ]}
            />

            <ConfigSection
                title="Security Settings"
                fields={[
                    { key: 'JWT_SECRET', label: 'JWT Secret Key', type: 'password', placeholder: 'Enter JWT secret' },
                    { key: 'CORS_ORIGINS', label: 'CORS Allowed Origins', type: 'text', placeholder: 'https://example.com, http://alnubrasstudio.ddns.net' },
                    { key: 'SESSION_TIMEOUT', label: 'Session Timeout (minutes)', type: 'text', placeholder: '60' }
                ]}
            />
    
    </div>
  );
}