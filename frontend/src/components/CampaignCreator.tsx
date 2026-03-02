import React, { useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { CampaignSchema, Audience, Rule, Metric, Operator, Action } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Play, CheckCircle2, AlertCircle, Loader2, BarChart3, Target, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const metrics: Metric[] = ['ROAS', 'CTR', 'CPC', 'Spend'];
const operators: Operator[] = ['<', '>', '='];
const actions: Action[] = ['pause', 'notify', 'scale_up'];
const devices: Audience['device'][] = ['mobile', 'desktop', 'tablet', 'all'];

export default function CampaignCreator() {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState(1000);
  const [audience, setAudience] = useState<Audience>({
    country: 'USA',
    device: 'all',
    ageRange: '18-45',
  });
  const [rule, setRule] = useState<Rule>({
    metric: 'ROAS',
    operator: '<',
    value: 3,
    action: 'pause',
  });

  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [createdCampaign, setCreatedCampaign] = useState<any>(null);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post('/api/campaigns', data);
      return res.data;
    },
    onSuccess: (data) => {
      setCreatedCampaign(data);
    },
  });

  const simulateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.post(`/api/campaigns/${id}/simulate`);
      return res.data;
    },
    onSuccess: (data) => {
      setSimulationResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ name, budget, audience, rule });
  };

  const chartData = useMemo(() => {
    if (!simulationResult) return [];
    return Object.entries(simulationResult.performance).map(([name, value]) => ({
      name,
      value: Number(value),
    }));
  }, [simulationResult]);

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12 font-sans">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Campaign Engine</h1>
        </div>
        <p className="text-zinc-500 text-lg">Architect your marketing automation with precision rules and audience targeting.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Section */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                01 Configuration
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Campaign Identity</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Q1 Growth Strategy"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Daily Budget Allocation ($)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-100">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">02 Targeting</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700">Region</label>
                  <input
                    type="text"
                    value={audience.country}
                    onChange={(e) => setAudience({ ...audience, country: e.target.value })}
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700">Platform</label>
                  <select
                    value={audience.device}
                    onChange={(e) => setAudience({ ...audience, device: e.target.value as any })}
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                  >
                    {devices.map((d) => (
                      <option key={d} value={d}>{d.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Demographic Range</label>
                <input
                  type="text"
                  value={audience.ageRange}
                  onChange={(e) => setAudience({ ...audience, ageRange: e.target.value })}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="e.g. 25-40"
                />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-100">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">03 Logic Gate</h2>
              <div className="p-4 bg-zinc-900 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-white font-mono text-sm">
                  <span className="text-indigo-400">IF</span>
                  <select
                    value={rule.metric}
                    onChange={(e) => setRule({ ...rule, metric: e.target.value as Metric })}
                    className="bg-zinc-800 border-none rounded px-2 py-1 outline-none text-white cursor-pointer hover:bg-zinc-700"
                  >
                    {metrics.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select
                    value={rule.operator}
                    onChange={(e) => setRule({ ...rule, operator: e.target.value as Operator })}
                    className="bg-zinc-800 border-none rounded px-2 py-1 outline-none text-white cursor-pointer hover:bg-zinc-700"
                  >
                    {operators.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <input
                    type="number"
                    step="0.1"
                    value={rule.value}
                    onChange={(e) => setRule({ ...rule, value: Number(e.target.value) })}
                    className="w-16 bg-zinc-800 border-none rounded px-2 py-1 outline-none text-white"
                  />
                </div>
                <div className="flex items-center gap-2 text-white font-mono text-sm">
                  <span className="text-emerald-400">THEN</span>
                  <select
                    value={rule.action}
                    onChange={(e) => setRule({ ...rule, action: e.target.value as Action })}
                    className="bg-zinc-800 border-none rounded px-2 py-1 outline-none text-white cursor-pointer hover:bg-zinc-700"
                  >
                    {actions.map((a) => <option key={a} value={a}>{a.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {createMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Create Campaign
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {createdCampaign ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-zinc-200 p-8 rounded-3xl shadow-sm space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                      Campaign Active
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900">{createdCampaign.name}</h3>
                    <p className="text-sm text-zinc-500 font-mono">UUID: {createdCampaign.id}</p>
                  </div>
                  <button
                    onClick={() => simulateMutation.mutate(createdCampaign.id)}
                    disabled={simulateMutation.isPending}
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-50 font-bold shadow-lg"
                  >
                    {simulateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    Simulate Traffic
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Budget</div>
                    <div className="text-xl font-bold text-zinc-900">${createdCampaign.budget}</div>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Region</div>
                    <div className="text-xl font-bold text-zinc-900">{createdCampaign.audience.country}</div>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Device</div>
                    <div className="text-xl font-bold text-zinc-900">{createdCampaign.audience.device.toUpperCase()}</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-3xl text-zinc-400 bg-zinc-50/50 space-y-4">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-zinc-100">
                  <Target className="w-8 h-8 text-zinc-300" />
                </div>
                <p className="font-medium">Awaiting campaign architecture...</p>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {simulationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  borderColor: simulationResult.simulation.triggered ? '#f43f5e' : '#10b981',
                  borderWidth: '2px'
                }}
                className="bg-white border p-8 rounded-3xl shadow-xl space-y-8 relative overflow-hidden"
              >
                {/* Status Banner */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${simulationResult.simulation.triggered ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-indigo-600" />
                    Performance Simulation
                  </h3>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 ${simulationResult.simulation.triggered ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-emerald-100 text-emerald-700'}`}>
                    {simulationResult.simulation.triggered ? (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        Action Required
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        System Nominal
                      </>
                    )}
                  </div>
                </div>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 600 }}
                      />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{ fill: '#f4f4f5' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.name === rule.metric ? '#4f46e5' : '#e4e4e7'} 
                          />
                        ))}
                      </Bar>
                      {/* Threshold Line for the specific metric */}
                      <ReferenceLine 
                        y={rule.value} 
                        stroke="#f43f5e" 
                        strokeDasharray="3 3" 
                        label={{ position: 'top', value: `Limit: ${rule.value}`, fill: '#f43f5e', fontSize: 10, fontWeight: 700 }} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Logic Evaluation</div>
                  <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-4">
                    <div className="text-sm text-zinc-600 bg-white p-3 rounded-xl border border-zinc-100 shadow-sm">
                      <span className="font-bold text-indigo-600">Rule Logic:</span> If the <span className="font-mono font-bold">{rule.metric}</span> {rule.operator === '<' ? 'falls below' : rule.operator === '>' ? 'exceeds' : 'is exactly'} <span className="font-mono font-bold">{rule.value}</span>, then the system will <span className="font-mono font-bold text-indigo-600">{rule.action.replace('_', ' ')}</span> the campaign.
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${simulationResult.simulation.triggered ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {simulationResult.simulation.triggered ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="text-sm text-zinc-500 font-medium">Condition Check</div>
                          <div className="text-lg font-bold text-zinc-900">
                            {rule.metric} ({simulationResult.performance[rule.metric].toFixed(2)}) {rule.operator} {rule.value}
                          </div>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-xl font-bold text-sm ${simulationResult.simulation.triggered ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                        {simulationResult.simulation.triggered ? 'TRIGGERED' : 'PASSED'}
                      </div>
                    </div>

                    {simulationResult.simulation.triggered && (
                      <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
                        <div className="text-sm font-semibold text-zinc-600 italic">Executing Protocol:</div>
                        <div className="font-mono font-bold text-rose-600 uppercase tracking-tighter text-lg">
                          {simulationResult.simulation.action.replace('_', ' ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
