"use client";

import { useMemo, useState } from "react";

type AsicMiner = {
  id: string;
  name: string;
  hashrateThs: number; // Terahash per second
  efficiencyJPerTh: number; // Joules per TH
  upfrontUsd: number;
};

const defaultAsicCatalog: AsicMiner[] = [
  {
    id: "antminer-s21",
    name: "Antminer S21",
    hashrateThs: 200,
    efficiencyJPerTh: 17.5,
    upfrontUsd: 4000,
  },
  {
    id: "antminer-s19xp",
    name: "Antminer S19 XP",
    hashrateThs: 140,
    efficiencyJPerTh: 21.5,
    upfrontUsd: 3000,
  },
  {
    id: "whatsminer-m50s",
    name: "Whatsminer M50S",
    hashrateThs: 126,
    efficiencyJPerTh: 26,
    upfrontUsd: 2500,
  },
  {
    id: "avalon-a1366",
    name: "Canaan Avalon A1366",
    hashrateThs: 130,
    efficiencyJPerTh: 25,
    upfrontUsd: 2400,
  },
];

export default function Home() {
  const [asicOptions] = useState<AsicMiner[]>(defaultAsicCatalog);
  const [selectedAsicId, setSelectedAsicId] = useState<string>(asicOptions[0]?.id ?? "");
  const selectedAsic = useMemo(() => asicOptions.find(a => a.id === selectedAsicId) ?? asicOptions[0], [asicOptions, selectedAsicId]);

  const [upfrontUsd, setUpfrontUsd] = useState<number>(selectedAsic?.upfrontUsd ?? 0);
  const [hashrateThs, setHashrateThs] = useState<number>(selectedAsic?.hashrateThs ?? 0);
  const [efficiencyJPerTh, setEfficiencyJPerTh] = useState<number>(selectedAsic?.efficiencyJPerTh ?? 0);

  // Sync editable fields when selection changes
  const handleSelectChange = (id: string) => {
    setSelectedAsicId(id);
    const next = asicOptions.find(a => a.id === id);
    if (next) {
      setUpfrontUsd(next.upfrontUsd);
      setHashrateThs(next.hashrateThs);
      setEfficiencyJPerTh(next.efficiencyJPerTh);
    }
  };
  return (
    <div className="font-sans min-h-screen p-8 sm:p-20">
      <main className="flex flex-col gap-[24px] items-center sm:items-start">
        {/* ASIC Miner Selection */}
        <section className="w-full max-w-2xl rounded-2xl border border-black/[.08] dark:border-white/[.145] p-6 shadow-sm bg-white/50 dark:bg-black/20">
          <h2 className="text-lg font-semibold mb-4">ASIC Miner Selection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-black/70 dark:text-white/70">Miner model</span>
              <select
                className="h-10 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 focus:outline-none"
                value={selectedAsicId}
                onChange={(e) => handleSelectChange(e.target.value)}
              >
                {asicOptions.map((option) => (
                  <option key={option.id} value={option.id} className="text-black dark:text-white bg-white dark:bg-[#111]">
                    {option.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-black/70 dark:text-white/70">Upfront cost (USD)</span>
              <input
                type="number"
                inputMode="decimal"
                className="h-10 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 focus:outline-none"
                value={Number.isFinite(upfrontUsd) ? upfrontUsd : ""}
                onChange={(e) => setUpfrontUsd(Number(e.target.value))}
                min={0}
                step={1}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-black/70 dark:text-white/70">Hashrate (TH/s)</span>
              <input
                type="number"
                inputMode="decimal"
                className="h-10 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 focus:outline-none"
                value={Number.isFinite(hashrateThs) ? hashrateThs : ""}
                onChange={(e) => setHashrateThs(Number(e.target.value))}
                min={0}
                step={0.1}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-black/70 dark:text-white/70">Efficiency (J/TH)</span>
              <input
                type="number"
                inputMode="decimal"
                className="h-10 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 focus:outline-none"
                value={Number.isFinite(efficiencyJPerTh) ? efficiencyJPerTh : ""}
                onChange={(e) => setEfficiencyJPerTh(Number(e.target.value))}
                min={0}
                step={0.1}
              />
            </label>
          </div>

          <div className="mt-4 text-sm text-black/70 dark:text-white/70">
            <p>
              Selected: <span className="font-medium text-black dark:text-white">{selectedAsic?.name}</span>
            </p>
            <p className="mt-1">Preset: {selectedAsic?.hashrateThs} TH/s • {selectedAsic?.efficiencyJPerTh} J/TH • ${new Intl.NumberFormat('en-US').format(selectedAsic?.upfrontUsd ?? 0)}</p>
        </div>
        </section>
      </main>
    </div>
  );
}
