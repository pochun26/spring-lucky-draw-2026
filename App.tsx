
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Participant, Winner, AppState, Prize } from './types';
import SlotMachine from './components/SlotMachine';
import { 
  Users, 
  Trophy, 
  RotateCcw, 
  Play, 
  Trash2, 
  History, 
  Settings,
  ClipboardList,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY_PARTICIPANTS = 'spring_gala_participants';
const STORAGE_KEY_WINNERS = 'spring_gala_winners';
const STORAGE_KEY_PRIZES = 'spring_gala_prizes';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [selectedPrizeId, setSelectedPrizeId] = useState<string>('');
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [rawInput, setRawInput] = useState<string>('');
  const [rawPrizeInput, setRawPrizeInput] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Load from LocalStorage
  useEffect(() => {
    const storedParticipants = localStorage.getItem(STORAGE_KEY_PARTICIPANTS);
    const storedWinners = localStorage.getItem(STORAGE_KEY_WINNERS);
    const storedPrizes = localStorage.getItem(STORAGE_KEY_PRIZES);
    
    if (storedParticipants) {
      setParticipants(JSON.parse(storedParticipants));
    }
    if (storedWinners) {
      setWinners(JSON.parse(storedWinners));
    }
    if (storedPrizes) {
      const parsedPrizes = JSON.parse(storedPrizes);
      setPrizes(parsedPrizes);
      if (parsedPrizes.length > 0) setSelectedPrizeId(parsedPrizes[0].id);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PARTICIPANTS, JSON.stringify(participants));
    localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify(winners));
    localStorage.setItem(STORAGE_KEY_PRIZES, JSON.stringify(prizes));
  }, [participants, winners, prizes]);

  // Derived state: Potential candidates (those who haven't won yet)
  const candidates = useMemo(() => {
    const winnerIds = new Set(winners.map(w => w.id));
    return participants.filter(p => !winnerIds.has(p.id));
  }, [participants, winners]);

  const selectedPrize = useMemo(() => 
    prizes.find(p => p.id === selectedPrizeId), 
  [prizes, selectedPrizeId]);

  const handleImport = () => {
    if (rawInput.trim()) {
      const lines = rawInput.split('\n').filter(line => line.trim() !== '');
      const newParticipants: Participant[] = lines.map((line, idx) => {
        return {
          id: `p-${Date.now()}-${idx}`,
          name: line.trim()
        };
      });
      setParticipants([...participants, ...newParticipants]);
      setRawInput('');
    }

    if (rawPrizeInput.trim()) {
      const prizeLines = rawPrizeInput.split('\n').filter(line => line.trim() !== '');
      const newPrizes: Prize[] = prizeLines.map((line, idx) => {
        const parts = line.split(/[,\t]/);
        return {
          id: `prize-${Date.now()}-${idx}`,
          name: parts[0].trim(),
          quantity: parts[1] ? parseInt(parts[1].trim()) : 1
        };
      });
      const updatedPrizes = [...prizes, ...newPrizes];
      setPrizes(updatedPrizes);
      if (!selectedPrizeId && updatedPrizes.length > 0) {
        setSelectedPrizeId(updatedPrizes[0].id);
      }
      setRawPrizeInput('');
    }
    
    setShowSettings(false);
  };

  const handleClearAll = () => {
    if (window.confirm('確定要清除所有資料（名單、獎項與中獎紀錄）嗎？')) {
      setParticipants([]);
      setWinners([]);
      setPrizes([]);
      setSelectedPrizeId('');
      setCurrentWinner(null);
      setAppState(AppState.IDLE);
      localStorage.clear();
    }
  };

  const handleDraw = useCallback(async () => {
    if (candidates.length === 0) {
      alert('所有人都已經中獎了，或名單為空！');
      return;
    }

    if (!selectedPrizeId) {
      alert('請先選擇或匯入獎項！');
      return;
    }

    const prize = prizes.find(p => p.id === selectedPrizeId);
    if (!prize || prize.quantity <= 0) {
      alert('該獎項已抽完！');
      return;
    }

    const winningIndex = Math.floor(Math.random() * candidates.length);
    const winner = candidates[winningIndex];

    setCurrentWinner(winner);
    setAppState(AppState.ROLLING);
  }, [candidates, selectedPrizeId, prizes]);

  const onAnimationComplete = useCallback(() => {
    setAppState(AppState.WINNER_REVEALED);
    
    if (currentWinner && selectedPrize) {
      const newWinner: Winner = {
        ...currentWinner,
        drawTimestamp: Date.now(),
        prizeName: selectedPrize.name
      };
      
      setWinners(prev => [newWinner, ...prev]);
      
      // Decrease prize quantity
      setPrizes(prev => prev.map(p => 
        p.id === selectedPrizeId ? { ...p, quantity: Math.max(0, p.quantity - 1) } : p
      ));

      // Fire confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#b91c1c', '#ffffff']
      });
    }
  }, [currentWinner, selectedPrize, selectedPrizeId]);

  const resetDraw = () => {
    setAppState(AppState.IDLE);
    setCurrentWinner(null);
  };

  return (
    <div className="min-h-screen festive-gradient flex flex-col text-white">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-black/30 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500 rounded-lg shadow-lg">
            <Trophy className="text-red-800" size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black gold-glow tracking-tighter">
              2026 馬上發財 Pinkoi 神馬龍舞
            </h1>
            <p className="text-xs text-yellow-500/80 font-medium">DRAGON YEAR LUCKY DRAW</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="設定與名單"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-8 max-w-5xl mx-auto w-full">
        {/* Main Lucky Draw Arena */}
        <div className="w-full relative py-8 px-4 bg-black/20 rounded-3xl border border-white/5 shadow-2xl">
          <SlotMachine 
            participants={candidates}
            winner={currentWinner}
            isRolling={appState === AppState.ROLLING}
            onAnimationComplete={onAnimationComplete}
          />

          {/* Controls Overlay */}
          <div className="mt-8 flex flex-col items-center gap-6">
            {appState === AppState.IDLE && (
              <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                {prizes.length > 0 && (
                  <div className="w-full">
                    <label className="block text-xs font-bold text-yellow-500/60 uppercase tracking-widest mb-2 text-center">選擇獎項</label>
                    <select 
                      value={selectedPrizeId}
                      onChange={(e) => setSelectedPrizeId(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white font-bold focus:border-yellow-500 outline-none transition-all appearance-none cursor-pointer text-center"
                    >
                      {prizes.map((prize) => (
                        <option key={prize.id} value={prize.id} className="bg-gray-900 text-white" disabled={prize.quantity <= 0}>
                          {prize.name} {prize.quantity <= 0 ? '(已抽完)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <button
                  onClick={handleDraw}
                  disabled={candidates.length === 0 || (prizes.length > 0 && (!selectedPrizeId || (selectedPrize?.quantity || 0) <= 0))}
                  className="group relative w-full px-12 py-5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 rounded-full text-red-900 font-black text-2xl shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 shimmer pointer-events-none"></div>
                  <Play fill="currentColor" size={24} />
                  開始抽獎
                </button>
              </div>
            )}

            {appState === AppState.WINNER_REVEALED && (
              <div className="text-center animate-in fade-in zoom-in duration-700">
                <div className="mb-2">
                  <span className="text-yellow-500/80 font-bold text-sm uppercase tracking-widest block mb-1">獲得 {selectedPrize?.name}</span>
                  <h2 className="text-5xl font-black text-yellow-400 gold-glow">
                    {currentWinner?.name}
                  </h2>
                </div>
                
                <div className="h-8"></div>

                <button
                  onClick={resetDraw}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold flex items-center gap-2 mx-auto transition-all"
                >
                  <RotateCcw size={18} />
                  準備下一次
                </button>
              </div>
            )}

            {appState === AppState.ROLLING && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
                <p className="text-yellow-500 font-bold animate-pulse tracking-widest uppercase text-sm">好運轉動中...</p>
              </div>
            )}
          </div>
        </div>

        {/* Winner History Section */}
        <div className="w-full mt-4">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-2">
            <History size={20} className="text-yellow-500" />
            <h3 className="text-lg font-bold tracking-tight">得獎紀錄 ({winners.length})</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {winners.length > 0 ? (
              winners.map((winner, idx) => (
                <div key={`${winner.id}-${idx}`} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center group hover:border-yellow-500/30 transition-all">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{winner.name}</span>
                      <span className="text-xs text-yellow-500/60 font-medium">({winner.prizeName})</span>
                    </div>
                    <div className="text-[10px] text-white/40 mt-1 uppercase tracking-tighter">
                      {new Date(winner.drawTimestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <CheckCircle2 size={18} />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center text-white/20 border-2 border-dashed border-white/5 rounded-2xl">
                <Users size={48} className="mb-2" />
                <p>尚無中獎紀錄</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Settings Modal (Import名單) */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2 text-yellow-500">
                <ClipboardList size={24} />
                <h2 className="text-xl font-bold">名單管理與設定</h2>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-white/50 hover:text-white">
                <RotateCcw size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">批次匯入名單 (每行一個人)</label>
                  <textarea
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="王大明&#10;李小華&#10;..."
                    className="w-full h-40 bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">批次匯入獎項 (格式: 獎項名稱,數量)</label>
                  <textarea
                    value={rawPrizeInput}
                    onChange={(e) => setRawPrizeInput(e.target.value)}
                    placeholder="特等獎: 10萬現金, 1&#10;一等獎: iPhone 15, 3&#10;..."
                    className="w-full h-40 bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleImport}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-red-900 font-bold py-3 rounded-xl transition-all"
                >
                  匯入名單
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 rounded-xl transition-all flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  清空所有
                </button>
              </div>

              <div className="pt-4 border-t border-white/5">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">當前名單 ({participants.length})</h4>
                <div className="max-h-32 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                  {participants.map((p, i) => (
                    <div key={p.id} className="text-sm py-1 border-b border-white/5 flex justify-between">
                      <span>{i + 1}. {p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 text-center">
              <button 
                onClick={() => setShowSettings(false)}
                className="text-sm font-bold text-gray-400 hover:text-white"
              >
                關閉設定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="p-6 text-center text-white/30 text-xs mt-auto">
        <p>© 2024 春酒大抽獎系統 • 隨機公平公正公開</p>
      </footer>
    </div>
  );
};

export default App;
