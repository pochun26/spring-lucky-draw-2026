
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  CheckCircle2,
  Zap,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
// Image asset imports
import { bgMain } from './assets/images';
import { bannerTitle } from './assets/images';
import { decorSide } from './assets/images';
import { buttonBg1 } from './assets/images';
import { icon1 } from './assets/images';

const STORAGE_KEY_PARTICIPANTS = 'spring_gala_participants';
const STORAGE_KEY_WINNERS = 'spring_gala_winners';
const STORAGE_KEY_PRIZES = 'spring_gala_prizes';

const HARDCODED_PARTICIPANTS: Participant[] = [
  { id: 'p-1', name: '顏君庭/Peter Yen' },
  { id: 'p-2', name: '李讓/Mike Lee' },
  { id: 'p-3', name: '張登舜/Danny Chang' },
  { id: 'p-4', name: '賴冠儒/Seadmoon Lai' },
  { id: 'p-5', name: '苗一川/Angie Miao' },
  { id: 'p-6', name: '林湘婕/Kate Lin' },
  { id: 'p-7', name: '楊禮如/Lily Yang' },
  { id: 'p-8', name: '嚴守潔/Jessica Yen' },
  { id: 'p-11', name: '李少昱/Mark Lee' },
  { id: 'p-12', name: '許華汧/Jo Xu' },
  { id: 'p-13', name: '黃翊庭/Yiting Huang' },
  { id: 'p-14', name: '邊聖宇/Fred Pien' },
  { id: 'p-15', name: '曾宥瑞/Ray Tseng' },
  { id: 'p-16', name: '黃意玲/Lydia Huang' },
  { id: 'p-17', name: '陳昱珊/Emily Chen' },
  { id: 'p-18', name: '王嘉君/Karen Wang' },
  { id: 'p-19', name: '陳姿穎/ZihZih Chen' },
  { id: 'p-20', name: '陳映慈/April Chen' },
  { id: 'p-21', name: '許博鏞/Dickey Hsu' },
  { id: 'p-23', name: '邱瀚毅/Dixon Chiu' },
  { id: 'p-24', name: '杜杰翰/Jonathan Tu' },
  { id: 'p-25', name: '邱嘉慶/Aion Chiu' },
  { id: 'p-26', name: '郭思妍/Lucy Kuo' },
  { id: 'p-27', name: '陳彥如/Verna Chen' },
  { id: 'p-28', name: '鄭博元/Louis Zheng' },
  { id: 'p-30', name: '侯君妍/Kelly Hou' },
  { id: 'p-31', name: '蔡宗嶧/Seven Tsai' },
  { id: 'p-32', name: '葉建夆/Jimmy Yeh' },
  { id: 'p-34', name: '孫慧軒/Stephanie Sun' },
  { id: 'p-35', name: '黃以萱/Sheila Huang' },
  { id: 'p-36', name: '詹涵如/Ruby Chan' },
  { id: 'p-37', name: '紀諭如/Lulu Chi' },
  { id: 'p-38', name: '張雅甯/Grace Chang' },
  { id: 'p-39', name: '張瑀淳/Laura Chang' },
  { id: 'p-40', name: '陳奕/Eton Chen' },
  { id: 'p-41', name: '謝秉芸/Joyce Hsieh' },
  { id: 'p-42', name: '林若雯/Loran Lin' },
  { id: 'p-44', name: '莊期棋/Kiki Chuang' },
  { id: 'p-45', name: '陳錕詮/Jack Chen' },
  { id: 'p-46', name: '葉立安/Lian Yeh' },
  { id: 'p-47', name: '洪婉淇/Chelsea Hung' },
  { id: 'p-48', name: '陳亭潔/Jay Chen' },
  { id: 'p-49', name: '王顥潼/Doris Wang' },
  { id: 'p-50', name: '徐子婷/Gina Hsu' },
  { id: 'p-51', name: '陳柏君/Paul Chen' },
  { id: 'p-52', name: '吳玉凱/Kai Wu' },
  { id: 'p-53', name: '高于芩/Sara Kao' },
  { id: 'p-54', name: '李曈/Patricia Lee' },
  { id: 'p-55', name: '何品儀/Rita Ho' },
  { id: 'p-56', name: '梁姿宇/Faunia Liang' },
  { id: 'p-57', name: '郭泰維/Tavie Kuo' },
  { id: 'p-58', name: '溫子謙/Charlie Wen' },
  { id: 'p-59', name: '吳怡萱/Cheryl Wu' },
  { id: 'p-60', name: '潘柏涵/Sarah Pan' },
  { id: 'p-61', name: '李品嫻/Angela Lee' },
  { id: 'p-62', name: '吳萱/Esther Wu' },
  { id: 'p-63', name: '江依璇/Kerry Chiang' },
  { id: 'p-64', name: '林誠軒/Sherman Lin' },
  { id: 'p-65', name: '官瑞芃/Renata Kuan' },
  { id: 'p-66', name: '楊于慧/Yuhui Yang' },
  { id: 'p-67', name: '黃鈺淇/Eartha Huang' },
  { id: 'p-68', name: '林容/Lia Lin' },
  { id: 'p-69', name: '李榆慧/Wendy Lee' },
  { id: 'p-70', name: '方妍心/Cindy Fang' },
  { id: 'p-71', name: '羅士凱/Alex Lo' },
  { id: 'p-72', name: '張芷瑄/Cari Zhang' },
  { id: 'p-74', name: '楊博惟/William Yang' },
  { id: 'p-75', name: '王映雯/Raven Wang' },
  { id: 'p-76', name: '林奕嫻/Catherine Lin' },
  { id: 'p-77', name: '陳畇樺/Rainie Chen' },
  { id: 'p-78', name: '林俊良/Roger Lin' },
  { id: 'p-79', name: '張治尹/Jimmy Chang' },
];

// Fisher-Yates shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Initialize with a shuffled copy of the hardcoded participant list
const INITIAL_PARTICIPANTS = shuffleArray(HARDCODED_PARTICIPANTS);

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [selectedPrizeId, setSelectedPrizeId] = useState<string>('');
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
  const [currentWinners, setCurrentWinners] = useState<Participant[]>([]);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [rawPrizeInput, setRawPrizeInput] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [fastMode, setFastMode] = useState<boolean>(false);
  const [drawCount, setDrawCount] = useState<number>(1); // number of winners to draw: 1 or 2
  const [pendingRedraw, setPendingRedraw] = useState<boolean>(false); // triggers an immediate redraw after donation
  const animationCompletedRef = useRef<number>(0); // tracks how many slot machines have finished animating
  const currentDrawTimestampRef = useRef<number>(0); // timestamp shared between onAnimationComplete and handleDonate

  // Load from LocalStorage (only for winners and prizes, participants are hardcoded)
  useEffect(() => {
      const storedWinners = localStorage.getItem(STORAGE_KEY_WINNERS);
      const storedPrizes = localStorage.getItem(STORAGE_KEY_PRIZES);
      
      // Participants are always initialized from hardcoded list, shuffled randomly
      setParticipants(shuffleArray(HARDCODED_PARTICIPANTS));
      
      if (storedWinners) {
      setWinners(JSON.parse(storedWinners));
      }
      if (storedPrizes) {
        const parsedPrizes = JSON.parse(storedPrizes);
          setPrizes(parsedPrizes);
          if (parsedPrizes.length > 0) setSelectedPrizeId(parsedPrizes[0].id);
        }
  }, []);

  // Save to LocalStorage (participants are hardcoded, so we don't save them)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify(winners));
    localStorage.setItem(STORAGE_KEY_PRIZES, JSON.stringify(prizes));
  }, [winners, prizes]);

  // Derived state: Potential candidates (those who haven't won yet)
  const candidates = useMemo(() => {
    const winnerIds = new Set(winners.map(w => w.id));
    return participants.filter(p => !winnerIds.has(p.id));
  }, [participants, winners]);

  const selectedPrize = useMemo(() => 
    prizes.find(p => p.id === selectedPrizeId), 
  [prizes, selectedPrizeId]);

  const handleImport = () => {
    // Participants are hardcoded, so we only handle prize imports
    if (rawPrizeInput.trim()) {
      const prizeLines = rawPrizeInput.split('\n').filter(line => line.trim() !== '');
      const newPrizes: Prize[] = prizeLines.map((line, idx) => {
        const parts = line.split(/[,\t]/);
        const quantity = parts[1] ? parseInt(parts[1].trim(), 10) : 1;
        return {
          id: `prize-${Date.now()}-${idx}`,
          name: parts[0].trim(),
          quantity: isNaN(quantity) || quantity < 1 ? 1 : quantity
        };
      });
      const updatedPrizes = [...prizes, ...newPrizes];
      setPrizes(updatedPrizes);
      const currentPrizeExists = updatedPrizes.some(p => p.id === selectedPrizeId && p.quantity > 0);
      if (!currentPrizeExists && updatedPrizes.length > 0) {
        const firstValidPrize = updatedPrizes.find(p => p.quantity > 0) || updatedPrizes[0];
        setSelectedPrizeId(firstValidPrize.id);
      }
      setRawPrizeInput('');
    }
    
    setShowSettings(false);
  };

  const handleClearAll = () => {
    if (window.confirm('確定要清除所有資料（獎項與中獎紀錄）嗎？名單為固定名單，不會被清除。')) {
      setParticipants(shuffleArray(HARDCODED_PARTICIPANTS)); // Reset to hardcoded list, shuffled
      setWinners([]);
      setPrizes([]);
      setSelectedPrizeId('');
      setCurrentWinner(null);
      setCurrentWinners([]);
      setAppState(AppState.IDLE);
      localStorage.removeItem(STORAGE_KEY_WINNERS);
      localStorage.removeItem(STORAGE_KEY_PRIZES);
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

    // Clamp draw count to available candidates and prize quantity
    const actualDrawCount = Math.min(drawCount, candidates.length, prize.quantity);
    if (actualDrawCount === 0) {
      alert('沒有足夠的人數或獎項數量！');
      return;
    }

    // Pick unique winners by shuffling then slicing
    const shuffledCandidates = shuffleArray([...candidates]);
    const selectedWinners = shuffledCandidates.slice(0, actualDrawCount);
    
    // Reset animation completion counter before starting
    animationCompletedRef.current = 0;
    // First winner drives the SlotMachine scroll animation
    setCurrentWinner(selectedWinners[0]);
    // All winners are used for the final reveal
    setCurrentWinners(selectedWinners);
    setAppState(AppState.ROLLING);
  }, [candidates, selectedPrizeId, prizes, drawCount]);

  const onAnimationComplete = useCallback(() => {
    animationCompletedRef.current += 1;
    // Wait for all slot machines to finish before revealing the result
    if (animationCompletedRef.current < currentWinners.length) return;
    setAppState(AppState.WINNER_REVEALED);
    
    if (currentWinners.length > 0 && selectedPrize) {
      // Build Winner records for all drawn participants
      const timestamp = Date.now();
      currentDrawTimestampRef.current = timestamp;
      const newWinners: Winner[] = currentWinners.map(winner => ({
        ...winner,
        drawTimestamp: timestamp,
        prizeName: selectedPrize.name
      }));
      
      setWinners(prev => [...newWinners, ...prev]);
      
      // Reduce prize quantity by the number of winners actually drawn
      const actualDrawCount = currentWinners.length;
      setPrizes(prev => prev.map(p => 
        p.id === selectedPrizeId ? { ...p, quantity: Math.max(0, p.quantity - actualDrawCount) } : p
      ));

      // Fire confetti
      if (fastMode) {
        // Fast mode: single simplified burst
        confetti({
          particleCount: 100,
          spread: 120,
          origin: { y: 0.6, x: 0.5 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#FF69B4'],
          gravity: 0.6,
          ticks: 200,
          scalar: 1.2,
          startVelocity: 30
        });
      } else {
        // Normal mode: full multi-wave confetti effect
        const duration = 4000;
        const end = Date.now() + duration;
        
        // Main blast - center explosion
        confetti({
          particleCount: 400,
          spread: 150,
          origin: { y: 0.6, x: 0.5 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#FF69B4', '#FF00FF', '#b91c1c', '#ffffff', '#FFE4B5', '#FFB6C1'],
          gravity: 0.6,
          drift: 2,
          ticks: 300,
          scalar: 1.5,
          startVelocity: 45
        });
        
        // Left-side blast
        setTimeout(() => {
          confetti({
            particleCount: 250,
            angle: 60,
            spread: 100,
            origin: { y: 0.6, x: 0.2 },
            colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#b91c1c', '#FF69B4'],
            gravity: 0.5,
            drift: -2,
            ticks: 300,
            scalar: 1.3,
            startVelocity: 40
          });
        }, 50);
        
        // Right-side blast
        setTimeout(() => {
          confetti({
            particleCount: 250,
            angle: 120,
            spread: 100,
            origin: { y: 0.6, x: 0.8 },
            colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#b91c1c', '#FF69B4'],
            gravity: 0.5,
            drift: 2,
            ticks: 300,
            scalar: 1.3,
            startVelocity: 40
          });
        }, 100);
        
        // Top explosion
        setTimeout(() => {
          confetti({
            particleCount: 300,
            angle: 90,
            spread: 120,
            origin: { y: 0.3, x: 0.5 },
            colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#FF69B4', '#FF00FF', '#ffffff'],
            gravity: 0.4,
            drift: 0,
            ticks: 350,
            scalar: 1.6,
            startVelocity: 50
          });
        }, 150);
        
        // Continuous multi-point bursts for the animation duration
        const interval = setInterval(() => {
          if (Date.now() > end) {
            clearInterval(interval);
            return;
          }
          
          // Random-position mini bursts
          const randomX = Math.random() * 0.6 + 0.2;
          const randomY = Math.random() * 0.3 + 0.4;
          const randomAngle = Math.random() * 80 + 50;
          
          confetti({
            particleCount: 80,
            angle: randomAngle,
            spread: 70,
            origin: { y: randomY, x: randomX },
            colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#b91c1c', '#ffffff', '#FF69B4'],
            gravity: 0.7,
            drift: (Math.random() - 0.5) * 3,
            ticks: 200,
            scalar: 1.0 + Math.random() * 0.5,
            startVelocity: 30 + Math.random() * 20
          });
        }, 150);
        
        // Final mega blast - full-screen explosion
        setTimeout(() => {
          confetti({
            particleCount: 500,
            spread: 180,
            origin: { y: 0.5, x: 0.5 },
            colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#FF69B4', '#FF00FF', '#b91c1c', '#ffffff', '#FFE4B5', '#FFB6C1', '#FF1493'],
            gravity: 0.3,
            drift: 0,
            ticks: 400,
            scalar: 2.0,
            startVelocity: 60
          });
        }, 300);
        
        // Additional 360-degree radial burst
        setTimeout(() => {
          const defaults = {
            origin: { y: 0.5, x: 0.5 },
            colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#FF69B4'],
            scalar: 1.2,
            startVelocity: 35
          };
          
          function fire(particleRatio: number, opts: any) {
            confetti({
              ...defaults,
              ...opts,
              particleCount: Math.floor(200 * particleRatio),
              spread: 360,
              startVelocity: opts.startVelocity || 35
            });
          }
          
          fire(0.25, { angle: 60, spread: 55 });
          fire(0.2, { angle: 120, spread: 55 });
          fire(0.35, { angle: 90, spread: 55 });
          fire(0.1, { angle: 45, spread: 55 });
          fire(0.1, { angle: 135, spread: 55 });
        }, 400);
      }
    }
  }, [currentWinners, selectedPrize, selectedPrizeId, fastMode]);

  const resetDraw = () => {
    setAppState(AppState.IDLE);
    setCurrentWinner(null);
    setCurrentWinners([]);
  };

  // "Donate" the prize: remove current winners from records (they return to candidate pool),
  // restore prize quantity, then immediately redraw for the same prize.
  const handleDonate = useCallback(() => {
    if (currentWinners.length === 0) return;

    const donationTimestamp = currentDrawTimestampRef.current;

    // Keep winners in records (so they stay excluded from the candidate pool),
    // but mark their prize as donated so the history reflects it.
    setWinners(prev => prev.map(w =>
      w.drawTimestamp === donationTimestamp
        ? { ...w, prizeName: `${w.prizeName}（已捐出）` }
        : w
    ));

    // Restore prize quantity
    setPrizes(prev => prev.map(p =>
      p.id === selectedPrizeId
        ? { ...p, quantity: p.quantity + currentWinners.length }
        : p
    ));

    setCurrentWinner(null);
    setCurrentWinners([]);
    setAppState(AppState.IDLE);
    setPendingRedraw(true);
  }, [currentWinners, selectedPrizeId]);

  // Fire handleDraw on the next render cycle after donation state is settled
  useEffect(() => {
    if (pendingRedraw) {
      setPendingRedraw(false);
      handleDraw();
    }
  }, [pendingRedraw, handleDraw]);

  return (
    <div 
      className="min-h-screen flex flex-col text-white relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgMain})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 pointer-events-none"></div>
      
      {/* Side decorations */}
      <div className="absolute left-4 top-0 bottom-0 pointer-events-none opacity-30" style={{ width: '112px' }}>
        <img src={decorSide} alt="" className="h-full w-full object-contain" />
      </div>
      <div className="absolute right-4 top-0 bottom-0 pointer-events-none opacity-10" style={{ width: '112px', transform: 'scaleX(-1)' }}>
        <img src={decorSide} alt="" className="h-full w-full object-contain" />
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-black/30 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={icon1} alt="" className="w-12 h-12 object-contain" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Trophy className="text-yellow-400" size={20} />
            </div>
          </div>
          <div 
            className="relative h-12 px-6 flex items-center justify-center"
            style={{
              backgroundImage: `url(${bannerTitle})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              minWidth: '450px'
            }}
          >
            <h1 className="text-lg md:text-xl font-black gold-glow tracking-tighter whitespace-nowrap">
              2026 馬上發財 Pinkoi 神馬龍舞
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Draw count toggle */}
          <div className="flex items-center gap-1 bg-white/5 rounded-full px-1 py-1 border border-white/10">
            <button
              onClick={() => setDrawCount(1)}
              className={`px-3 py-1 rounded-full font-bold text-sm transition-all ${
                drawCount === 1
                  ? 'bg-yellow-500 text-red-900'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              1人
            </button>
            <button
              onClick={() => setDrawCount(2)}
              className={`px-3 py-1 rounded-full font-bold text-sm transition-all ${
                drawCount === 2
                  ? 'bg-yellow-500 text-red-900'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              2人
            </button>
          </div>

          {/* Fast mode toggle */}
          <button 
            onClick={() => setFastMode(!fastMode)}
            className={`p-2 rounded-full transition-all flex items-center gap-2 ${
              fastMode 
                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                : 'hover:bg-white/10 text-white/70 hover:text-white'
            }`}
            title={fastMode ? "快速模式已開啟" : "開啟快速模式"}
          >
            <Zap size={20} className={fastMode ? 'fill-current' : ''} />
            {fastMode && <span className="text-xs font-bold">快速</span>}
          </button>
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
          {drawCount === 2 && appState !== AppState.IDLE ? (
            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-center text-yellow-500/60 text-xs font-bold uppercase tracking-widest mb-2">第 1 位</div>
                <SlotMachine 
                  participants={candidates}
                  winner={currentWinners[0] ?? null}
                  isRolling={appState === AppState.ROLLING}
                  onAnimationComplete={onAnimationComplete}
                  fastMode={fastMode}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-center text-yellow-500/60 text-xs font-bold uppercase tracking-widest mb-2">第 2 位</div>
                <SlotMachine 
                  participants={candidates}
                  winner={currentWinners[1] ?? null}
                  isRolling={appState === AppState.ROLLING}
                  onAnimationComplete={onAnimationComplete}
                  fastMode={fastMode}
                  delay={300}
                />
              </div>
            </div>
          ) : (
            <SlotMachine 
              participants={candidates}
              winner={currentWinner}
              isRolling={appState === AppState.ROLLING}
              onAnimationComplete={onAnimationComplete}
              fastMode={fastMode}
            />
          )}

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
                  disabled={candidates.length === 0 || (prizes.length > 0 && (!selectedPrizeId || (selectedPrize?.quantity || 0) < drawCount))}
                  className="group relative w-full px-12 py-5 disabled:opacity-50 rounded-full text-white font-black text-2xl shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
                  style={{
                    backgroundImage: `url(${buttonBg1})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 shimmer pointer-events-none"></div>
                  <Play fill="currentColor" size={24} />
                  開始抽獎 {drawCount === 2 && '(2人)'}
                </button>
              </div>
            )}

            {appState === AppState.WINNER_REVEALED && (
              <div className="text-center animate-in fade-in zoom-in duration-700 w-full">
                <div className="mb-2">
                  <span className="text-yellow-500/80 font-bold text-sm uppercase tracking-widest block mb-3">
                    恭喜以上 {currentWinners.length} 位獲得 {selectedPrize?.name}！
                  </span>
                  {currentWinners.length === 1 && (
                    <h2 className="text-5xl font-black text-yellow-400 gold-glow">
                      {currentWinners[0]?.name}
                    </h2>
                  )}
                </div>
                
                <div className="h-4"></div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={resetDraw}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold flex items-center gap-2 transition-all"
                  >
                    <RotateCcw size={18} />
                    準備下一次
                  </button>
                  <button
                    onClick={handleDonate}
                    className="px-8 py-3 bg-red-800/40 hover:bg-red-700/50 border border-red-500/40 hover:border-red-400/60 rounded-full font-bold flex items-center gap-2 transition-all text-red-300 hover:text-red-200"
                  >
                    <Gift size={18} />
                    捐出來
                  </button>
                </div>
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

      {/* Settings modal */}
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
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">批次匯入獎項 (格式: 獎項名稱,數量)</label>
                <textarea
                  value={rawPrizeInput}
                  onChange={(e) => setRawPrizeInput(e.target.value)}
                  placeholder="特等獎: 10萬現金, 1&#10;一等獎: iPhone 15, 3&#10;..."
                  className="w-full h-40 bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleImport}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-red-900 font-bold py-3 rounded-xl transition-all"
                >
                  匯入獎項
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
      </div>
    </div>
  );
};

export default App;
