import React, { useState, useEffect } from 'react';
import PrivateLayout from '../../components/layout/PrivateLayout';
import {
    ChartBarIcon,
    ServerIcon,
    ClockIcon,
    CpuChipIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchMetrics = async () => {
        try {
            const res = await fetch('/api/metrics');
            if (!res.ok) throw new Error('Failed to fetch metrics');
            const data = await res.json();
            setMetrics(data);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            console.error('Metrics fetch error:', err);
            setError('System Unreachable');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    // Helper to format uptime
    const formatUptime = (seconds) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${d}d ${h}h ${m}m`;
    };

    const StatusCard = ({ title, value, subtext, icon: Icon, status = 'neutral' }) => {
        const colors = {
            success: 'bg-green-50 text-green-700 border-green-200',
            error: 'bg-red-50 text-red-700 border-red-200',
            warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            neutral: 'bg-white text-gray-700 border-gray-200',
        };

        const iconColors = {
            success: 'text-green-500',
            error: 'text-red-500',
            warning: 'text-yellow-500',
            neutral: 'text-blue-500',
        };

        return (
            <div className={`p-6 rounded-xl border ${colors[status]} shadow-sm transition-all hover:shadow-md`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium uppercase tracking-wider opacity-80">{title}</h3>
                    <Icon className={`w-6 h-6 ${iconColors[status]}`} />
                </div>
                <div className="text-3xl font-bold mb-1">{value}</div>
                {subtext && <div className="text-xs opacity-70">{subtext}</div>}
            </div>
        );
    };

    return (
        <PrivateLayout title="System Dashboard | Admin">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">System Observability</h1>
                        <p className="text-gray-500 mt-1">Real-time infrastructure monitoring</p>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                        {lastUpdated && (
                            <span className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                Live: {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
                        <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                        {error}
                    </div>
                )}

                {loading && !metrics ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : metrics ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatusCard
                            title="System Status"
                            value={metrics.status.toUpperCase()}
                            subtext={`Node: ${metrics.meta.node_env}`}
                            icon={metrics.status === 'up' ? CheckCircleIcon : ExclamationTriangleIcon}
                            status={metrics.status === 'up' ? 'success' : 'error'}
                        />

                        <StatusCard
                            title="Database"
                            value={metrics.components.database.status.toUpperCase()}
                            subtext={`Latency: ${metrics.components.database.latency_ms}ms`}
                            icon={ServerIcon}
                            status={metrics.components.database.status === 'up' && metrics.components.database.latency_ms < 100 ? 'success' : 'warning'}
                        />

                        <StatusCard
                            title="Memory Usage"
                            value={`${metrics.components.memory.rss_mb} MB`}
                            subtext={`Heap: ${metrics.components.memory.heap_used_mb} MB`}
                            icon={CpuChipIcon}
                            status={metrics.components.memory.rss_mb < 512 ? 'neutral' : 'warning'}
                        />

                        <StatusCard
                            title="Uptime"
                            value={formatUptime(metrics.uptime)}
                            subtext="Since last deploy"
                            icon={ClockIcon}
                            status="neutral"
                        />
                    </div>
                ) : null}

                {/* JSON Dump for Debugging */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 font-mono text-sm overflow-auto max-h-96">
                    <h3 className="text-gray-500 mb-4 font-bold border-b pb-2">Complete Metrics Payload</h3>
                    <pre className="text-gray-600">
                        {JSON.stringify(metrics, null, 2)}
                    </pre>
                </div>
            </div>
        </PrivateLayout>
    );
};

export default Dashboard;
