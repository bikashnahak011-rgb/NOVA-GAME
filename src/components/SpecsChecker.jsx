import { useState } from 'react';
import { games } from '../data/games.js';

function SpecsChecker() {
  const pcGames = games.filter((game) => game.platform === 'PC');
  const [selectedGameId, setSelectedGameId] = useState(pcGames[0]?.id || '');
  const [cpu, setCpu] = useState('i5');
  const [ram, setRam] = useState(8);
  const [gpu, setGpu] = useState('gtx1060');
  const [storage, setStorage] = useState(50);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [result, setResult] = useState(null);

  const selectedGame = pcGames.find((g) => g.id === selectedGameId);

  const handleScan = () => {
    if (!selectedGame) return;
    setScanning(true);
    setResult(null);

    const steps = [
      'Initializing diagnostics core...',
      'Analyzing CPU instructions...',
      'Mapping RAM volatile memory blocks...',
      'Probing GPU graphics pipelines and VRAM...',
      'Calculating disk cluster sectors...',
      'Compiling final system hardware report...'
    ];

    let currentStep = 0;
    setScanStep(steps[0]);

    const interval = setInterval(() => {
      currentStep += 1;
      if (currentStep < steps.length) {
        setScanStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        setScanning(false);
        calculateCompatibility();
      }
    }, 350);
  };

  const calculateCompatibility = () => {
    // Map options to numeric ranks for comparison
    const cpuRanks = { i3: 1, i5: 2, i7: 3, i9: 4 };
    const gpuRanks = { gtx960: 1, gtx1060: 2, rtx2060: 3, rtx3070: 4 };

    // CPU requirements mapping
    const getCpuRank = (text) => {
      const t = text.toLowerCase();
      if (t.includes('i9')) return 4;
      if (t.includes('i7')) return 3;
      if (t.includes('i5')) return 2;
      return 1; // i3 or lower
    };

    // GPU requirements mapping
    const getGpuRank = (text) => {
      const t = text.toLowerCase();
      if (t.includes('3070') || t.includes('3080') || t.includes('3060') || t.includes('40')) return 4;
      if (t.includes('2060') || t.includes('2070') || t.includes('2080') || t.includes('5600')) return 3;
      if (t.includes('1060') || t.includes('1070') || t.includes('1080') || t.includes('1660')) return 2;
      return 1; // 960 / 970 / etc
    };

    const parseStorage = (text) => {
      const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
      return isNaN(num) ? 30 : num;
    };

    const minReq = selectedGame.requirements.minimum;
    const recReq = selectedGame.requirements.recommended;

    // Parse requirements
    const minCpuStr = minReq.find(r => r.toLowerCase().includes('intel') || r.toLowerCase().includes('i')) || 'i5';
    const recCpuStr = recReq.find(r => r.toLowerCase().includes('intel') || r.toLowerCase().includes('i')) || 'i7';

    const minRamStr = minReq.find(r => r.toLowerCase().includes('ram')) || '8 GB';
    const recRamStr = recReq.find(r => r.toLowerCase().includes('ram')) || '16 GB';
    const minRamVal = parseInt(minRamStr.replace(/[^0-9]/g, ''), 10) || 8;
    const recRamVal = parseInt(recRamStr.replace(/[^0-9]/g, ''), 10) || 16;

    const minGpuStr = minReq.find(r => r.toLowerCase().includes('gtx') || r.toLowerCase().includes('rtx')) || 'GTX 1060';
    const recGpuStr = recReq.find(r => r.toLowerCase().includes('gtx') || r.toLowerCase().includes('rtx')) || 'RTX 2060';

    const minStorageStr = minReq.find(r => r.toLowerCase().includes('storage')) || '40 GB';
    const minStorageVal = parseStorage(minStorageStr);

    // Diagnostics logic
    const userCpuRank = cpuRanks[cpu];
    const userGpuRank = gpuRanks[gpu];
    const userRamVal = parseInt(ram, 10);
    const userStorageVal = parseInt(storage, 10);

    const minCpuRank = getCpuRank(minCpuStr);
    const recCpuRank = getCpuRank(recCpuStr);

    const minGpuRank = getGpuRank(minGpuStr);
    const recGpuRank = getGpuRank(recGpuStr);

    const cpuStatus = userCpuRank >= recCpuRank ? 'OPTIMAL' : userCpuRank >= minCpuRank ? 'COMPATIBLE' : 'LIMIT';
    const ramStatus = userRamVal >= recRamVal ? 'OPTIMAL' : userRamVal >= minRamVal ? 'COMPATIBLE' : 'LIMIT';
    const gpuStatus = userGpuRank >= recGpuRank ? 'OPTIMAL' : userGpuRank >= minGpuRank ? 'COMPATIBLE' : 'LIMIT';
    const storageStatus = userStorageVal >= minStorageVal ? 'OPTIMAL' : 'LIMIT';

    let overallStatus = 'OPTIMAL';
    if (cpuStatus === 'LIMIT' || ramStatus === 'LIMIT' || gpuStatus === 'LIMIT' || storageStatus === 'LIMIT') {
      overallStatus = 'LIMIT';
    } else if (cpuStatus === 'COMPATIBLE' || ramStatus === 'COMPATIBLE' || gpuStatus === 'COMPATIBLE') {
      overallStatus = 'COMPATIBLE';
    }

    setResult({
      cpu: cpuStatus,
      ram: ramStatus,
      gpu: gpuStatus,
      storage: storageStatus,
      overall: overallStatus,
      details: {
        gameTitle: selectedGame.title,
        minSpecs: { cpu: minCpuStr, ram: minRamStr, gpu: minGpuStr, disk: minStorageStr },
        recSpecs: { cpu: recCpuStr, ram: recRamStr, gpu: recGpuStr, disk: minStorageStr }
      }
    });
  };

  return (
    <div className="specs-checker-widget glass-panel">
      <div className="widget-header">
        <span className="glow-bullet" />
        <h3>System Compatibility Core</h3>
      </div>
      
      <p className="widget-subtitle">Select a title and map your tactical hardware rig to check download viability.</p>

      <div className="checker-form">
        <div className="form-group">
          <label>Target Game</label>
          <select value={selectedGameId} onChange={(e) => setSelectedGameId(e.target.value)} disabled={scanning}>
            {pcGames.map((game) => (
              <option key={game.id} value={game.id}>{game.title}</option>
            ))}
          </select>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>CPU Grade</label>
            <select value={cpu} onChange={(e) => setCpu(e.target.value)} disabled={scanning}>
              <option value="i3">Intel Core i3 / Ryzen 3</option>
              <option value="i5">Intel Core i5 / Ryzen 5</option>
              <option value="i7">Intel Core i7 / Ryzen 7</option>
              <option value="i9">Intel Core i9 / Ryzen 9</option>
            </select>
          </div>

          <div className="form-group">
            <label>System RAM</label>
            <select value={ram} onChange={(e) => setRam(Number(e.target.value))} disabled={scanning}>
              <option value="4">4 GB RAM</option>
              <option value="8">8 GB RAM</option>
              <option value="12">12 GB RAM</option>
              <option value="16">16 GB RAM</option>
              <option value="32">32 GB RAM</option>
            </select>
          </div>

          <div className="form-group">
            <label>GPU Chipset</label>
            <select value={gpu} onChange={(e) => setGpu(e.target.value)} disabled={scanning}>
              <option value="gtx960">NVIDIA GTX 960 / RX 460</option>
              <option value="gtx1060">NVIDIA GTX 1060 / RX 580</option>
              <option value="rtx2060">NVIDIA RTX 2060 / RX 5600</option>
              <option value="rtx3070">NVIDIA RTX 3070 / RX 6700</option>
            </select>
          </div>

          <div className="form-group">
            <label>Free Disk Space (GB)</label>
            <input
              type="number"
              value={storage}
              onChange={(e) => setStorage(Math.max(1, Number(e.target.value)))}
              disabled={scanning}
              min="1"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleScan}
          disabled={scanning || !selectedGameId}
          className={`button primary cyberpunk-button ${scanning ? 'scanning' : ''}`}
        >
          {scanning ? 'RUNNING SCAN...' : 'RUN DIAGNOSTIC SCAN'}
        </button>
      </div>

      {scanning && (
        <div className="scan-loader">
          <div className="scan-laser" />
          <p className="scan-message">{scanStep}</p>
          <div className="scan-progress-box">
            <div className="scan-progress-fill" />
          </div>
        </div>
      )}

      {result && (
        <div className={`scan-result-panel ${result.overall.toLowerCase()}`}>
          <div className="result-header">
            <h4>Diagnostics: {
              result.overall === 'OPTIMAL' ? '🟢 OPTIMAL RUNTIME READY' :
              result.overall === 'COMPATIBLE' ? '🟡 COMPATIBLE RUNTIME (MEDIUM SETTINGS)' :
              '🔴 HARDWARE UPGRADE REQUIRED'
            }</h4>
          </div>

          <div className="specs-report-grid">
            <div className={`report-item ${result.cpu.toLowerCase()}`}>
              <div className="report-label">Processor (CPU)</div>
              <div className="report-value">{cpu.toUpperCase()}</div>
              <div className="report-status">{result.cpu}</div>
              <div className="report-req">Req: {result.details.minSpecs.cpu}</div>
            </div>

            <div className={`report-item ${result.ram.toLowerCase()}`}>
              <div className="report-label">Memory (RAM)</div>
              <div className="report-value">{ram} GB</div>
              <div className="report-status">{result.ram}</div>
              <div className="report-req">Req: {result.details.minSpecs.ram}</div>
            </div>

            <div className={`report-item ${result.gpu.toLowerCase()}`}>
              <div className="report-label">Graphics (GPU)</div>
              <div className="report-value">{gpu.toUpperCase()}</div>
              <div className="report-status">{result.gpu}</div>
              <div className="report-req">Req: {result.details.minSpecs.gpu}</div>
            </div>

            <div className={`report-item ${result.storage.toLowerCase()}`}>
              <div className="report-label">Free Storage</div>
              <div className="report-value">{storage} GB</div>
              <div className="report-status">{result.storage}</div>
              <div className="report-req">Size: {result.details.minSpecs.disk}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpecsChecker;
