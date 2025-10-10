import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InvestmentFramework = () => {
  const [currentPE, setCurrentPE] = useState(38);
  const [fairPE, setFairPE] = useState(25);
  const [cagr, setCagr] = useState(20);
  const [selectedPreset, setSelectedPreset] = useState('semiconductors');

  const presets = {
    semiconductors: { name: 'Semiconductors', currentPE: 38, fairPE: 25, cagr: 20 },
    healthcare: { name: 'Health Care', currentPE: 20, fairPE: 18, cagr: 10 },
    staples: { name: 'Consumer Staples', currentPE: 21, fairPE: 18, cagr: 7 },
    custom: { name: 'Custom', currentPE: 30, fairPE: 20, cagr: 15 }
  };

  const loadPreset = (preset) => {
    setSelectedPreset(preset);
    setCurrentPE(presets[preset].currentPE);
    setFairPE(presets[preset].fairPE);
    setCagr(presets[preset].cagr);
  };

  const calculations = useMemo(() => {
    // Years to breakeven at fair PE
    const requiredGrowth = (currentPE / fairPE - 1) * 100;
    const yearsToBreakeven = Math.log(currentPE / fairPE) / Math.log(1 + cagr / 100);

    // Calculate returns over time
    const returns = {};
    [5, 10, 15, 20, 25, 30].forEach(years => {
      const multiple = (fairPE / currentPE) * Math.pow(1 + cagr / 100, years);
      const annualized = (Math.pow(multiple, 1/years) - 1) * 100;
      returns[years] = { multiple, annualized };
    });

    // Generate chart data
    const chartData = [];
    for (let year = 0; year <= 30; year++) {
      const value = (fairPE / currentPE) * Math.pow(1 + cagr / 100, year) * 100;
      chartData.push({
        year,
        value: Math.round(value * 10) / 10,
        breakeven: 100
      });
    }

    // Sensitivity analysis
    const sensitivity = {
      cagrVariations: [-5, -2, 0, 2, 5].map(delta => ({
        cagr: cagr + delta,
        return10y: ((fairPE / currentPE) * Math.pow(1 + (cagr + delta) / 100, 10)),
        return20y: ((fairPE / currentPE) * Math.pow(1 + (cagr + delta) / 100, 20))
      })),
      fairPEVariations: [fairPE - 5, fairPE - 2, fairPE, fairPE + 2, fairPE + 5].map(fp => ({
        fairPE: fp,
        return10y: ((fp / currentPE) * Math.pow(1 + cagr / 100, 10)),
        return20y: ((fp / currentPE) * Math.pow(1 + cagr / 100, 20))
      }))
    };

    return { requiredGrowth, yearsToBreakeven, returns, chartData, sensitivity };
  }, [currentPE, fairPE, cagr]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Investment Framework Calculator</h1>
          <p className="text-slate-600">The three-variable framework: Current PE × Fair PE × Sustainable CAGR</p>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {Object.entries(presets).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => loadPreset(key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPreset === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="font-semibold text-slate-800">{preset.name}</div>
              <div className="text-sm text-slate-600 mt-1">
                PE {preset.currentPE} → {preset.fairPE} @ {preset.cagr}%
              </div>
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Current PE
            </label>
            <input
              type="number"
              value={currentPE}
              onChange={(e) => setCurrentPE(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="0.1"
            />
            <p className="text-xs text-slate-500 mt-2">What you're paying today</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Fair PE (Floor)
            </label>
            <input
              type="number"
              value={fairPE}
              onChange={(e) => setFairPE(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="0.1"
            />
            <p className="text-xs text-slate-500 mt-2">Long-term market valuation</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Sustainable CAGR (%)
            </label>
            <input
              type="number"
              value={cagr}
              onChange={(e) => setCagr(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="0.1"
            />
            <p className="text-xs text-slate-500 mt-2">Expected earnings growth rate</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
            <div className="text-sm font-medium opacity-90 mb-1">Required Growth to Breakeven</div>
            <div className="text-3xl font-bold">{calculations.requiredGrowth.toFixed(1)}%</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
            <div className="text-sm font-medium opacity-90 mb-1">Years to Breakeven</div>
            <div className="text-3xl font-bold">{calculations.yearsToBreakeven.toFixed(1)} years</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
            <div className="text-sm font-medium opacity-90 mb-1">PE Compression/Expansion</div>
            <div className="text-3xl font-bold">
              {((fairPE / currentPE - 1) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Wealth Accumulation Over Time</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={calculations.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="year" 
                label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                stroke="#64748b"
              />
              <YAxis 
                label={{ value: 'Portfolio Value ($100 → $X)', angle: -90, position: 'insideLeft' }}
                stroke="#64748b"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="breakeven" 
                stroke="#94a3b8" 
                strokeDasharray="5 5"
                name="Breakeven"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Portfolio Value"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-sm text-slate-600 mt-4 text-center">
            Starting with $100, reaching breakeven at year {calculations.yearsToBreakeven.toFixed(1)}
          </p>
        </div>

        {/* Expected Returns Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Expected Returns</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Time Horizon</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Total Return</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Annualized CAGR</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">$100 Becomes</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(calculations.returns).map(([years, data]) => (
                  <tr key={years} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-800">{years} years</td>
                    <td className="text-right py-3 px-4 text-slate-700">
                      {data.multiple.toFixed(2)}x
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700">
                      {data.annualized.toFixed(1)}%
                    </td>
                    <td className="text-right py-3 px-4 font-semibold text-green-600">
                      ${(data.multiple * 100).toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sensitivity Analysis */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">CAGR Sensitivity</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 font-semibold text-slate-700">CAGR</th>
                  <th className="text-right py-2 font-semibold text-slate-700">10Y Return</th>
                  <th className="text-right py-2 font-semibold text-slate-700">20Y Return</th>
                </tr>
              </thead>
              <tbody>
                {calculations.sensitivity.cagrVariations.map((item, idx) => (
                  <tr 
                    key={idx} 
                    className={`border-b border-slate-50 ${item.cagr === cagr ? 'bg-blue-50' : ''}`}
                  >
                    <td className="py-2 font-medium">{item.cagr}%</td>
                    <td className="text-right">{item.return10y.toFixed(2)}x</td>
                    <td className="text-right">{item.return20y.toFixed(2)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Fair PE Sensitivity</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 font-semibold text-slate-700">Fair PE</th>
                  <th className="text-right py-2 font-semibold text-slate-700">10Y Return</th>
                  <th className="text-right py-2 font-semibold text-slate-700">20Y Return</th>
                </tr>
              </thead>
              <tbody>
                {calculations.sensitivity.fairPEVariations.map((item, idx) => (
                  <tr 
                    key={idx} 
                    className={`border-b border-slate-50 ${item.fairPE === fairPE ? 'bg-blue-50' : ''}`}
                  >
                    <td className="py-2 font-medium">{item.fairPE}</td>
                    <td className="text-right">{item.return10y.toFixed(2)}x</td>
                    <td className="text-right">{item.return20y.toFixed(2)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formula Reference */}
        <div className="mt-8 bg-slate-800 text-white p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-3">The Formula</h3>
          <div className="font-mono text-sm space-y-2">
            <div>Expected Return = (Fair PE / Current PE) × (1 + CAGR)^Years</div>
            <div>Years to Breakeven = ln(Current PE / Fair PE) / ln(1 + CAGR)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentFramework;