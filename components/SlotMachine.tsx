
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';

interface SlotMachineProps {
  participants: Participant[];
  winner: Participant | null;
  isRolling: boolean;
  onAnimationComplete: () => void;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ 
  participants, 
  winner, 
  isRolling, 
  onAnimationComplete 
}) => {
  const [offset, setOffset] = useState(0);
  const [activeParticipants, setActiveParticipants] = useState<Participant[]>([]);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const startOffsetRef = useRef<number>(0);
  const offsetRef = useRef<number>(0); // Track offset via ref to avoid dependency issues
  
  // Height of a single item in pixels
  const ITEM_HEIGHT = 80;
  
  // Use activeParticipants for the display list during animation to ensure stability.
  // Fallback to participants when not animating or if activeParticipants is empty.
  const listToUse = activeParticipants.length > 0 ? activeParticipants : participants;
  
  // Increase loops significantly to support multiple draws without resetting to 0
  // and to provide enough content for long animations.
  const displayList = listToUse.length > 0 
    ? Array(30).fill(listToUse).flat() 
    : [];
    
  // Sync offset state to ref
  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    // Always return cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRolling && winner && participants.length > 0) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      // Freeze participants list for this roll
      setActiveParticipants(participants);

      const winnerIndex = participants.findIndex(p => p.id === winner.id);
      const safeWinnerIndex = winnerIndex >= 0 ? winnerIndex : 0;

      // Use current offset value via ref to avoid stale closure and dependency issues
      startOffsetRef.current = offsetRef.current;

      const itemCount = participants.length;
      const loopHeight = itemCount * ITEM_HEIGHT;

      const currentLoops = Math.floor(
        Math.abs(startOffsetRef.current) / loopHeight
      );

      const EXTRA_LOOPS = 20 + Math.floor(Math.random() * 5);
      const targetLoops = currentLoops + EXTRA_LOOPS;

      const normalizedIndex = safeWinnerIndex + itemCount;
      const finalTargetOffset = -(normalizedIndex * ITEM_HEIGHT);
      
      const OVERSHOOT_DISTANCE = ITEM_HEIGHT * (1/3);
      
      const targetIndex = targetLoops * itemCount + safeWinnerIndex;
      const finalOffsetWithLoops = -(targetIndex * ITEM_HEIGHT);
      
      const overshootTarget = finalOffsetWithLoops - OVERSHOOT_DISTANCE;
      
      const totalDistance = overshootTarget - startOffsetRef.current;

      const duration = 15000 + Math.floor(Math.random() * 5000);

      startTimeRef.current = performance.now();

      // Magnetic stop parameters
      const MAGNETIC_DURATION = 500; // Duration for magnetic snap effect (ms) - slightly longer for smoother effect
      const BOUNCE_DAMPING = 0.2; // Damping factor for bounce back (very subtle)
      
      let magneticStartTime: number | null = null;
      let magneticStartOffset: number = 0;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        /**
         * 🎰 SUDDEN SLOWDOWN EASING
         * Phase 1: Fast Acceleration (0-30% time) -> Covers 80% of distance
         * Phase 2: Long Inverse-Proportional Slowdown (30-100% time) -> Covers remaining 20%
         * This creates a "sudden brake" feel followed by a very smooth crawl.
         */
        const k = 40; // Damping intensity
        const splitTime = 0.2; // Fast phase is 20% of time
        const splitDist = 0.8; // Fast phase covers 80% of distance
        
        let ease;
        if (progress < splitTime) {
          // Quadratic ease-in: starts slow, ends fast at the transition point
          const p = progress / splitTime;
          ease = p * p * splitDist;
        } else {
          // Inverse-proportional slowdown: starts fast at transition, then decelerates rapidly
          const p = (progress - splitTime) / (1 - splitTime);
          // Normalize the inverse curve to ensure it hits 1.0 exactly at p=1
          const rawSlowEase = 1 - 1 / (k * p + 1);
          const maxSlowEase = 1 - 1 / (k + 1);
          const normalizedSlowEase = rawSlowEase / maxSlowEase;
          
          ease = splitDist + normalizedSlowEase * (1 - splitDist);
        }

        // Calculate position: 主動畫直接到達超過位置（overshootTarget）
        const currentPos = startOffsetRef.current + totalDistance * ease;
        setOffset(currentPos);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // 🧲 MAGNETIC STOP EFFECT
          // 主動畫已經超過目標位置，現在磁性效果彈回
          
          // 主動畫結束時已經在超過位置
          setOffset(overshootTarget);
          
          magneticStartTime = currentTime;
          magneticStartOffset = overshootTarget; // 從超過的位置開始磁性效果
          
          const magneticAnimate = (magTime: number) => {
            if (!magneticStartTime) return;
            
            const magElapsed = magTime - magneticStartTime;
            const magProgress = Math.min(magElapsed / MAGNETIC_DURATION, 1);
            
            // 從超過的位置彈回目標位置
            // magneticStartOffset 已經是 overshootTarget（超過的位置，包含 EXTRA_LOOPS）
            // 需要彈回到 finalOffsetWithLoops（因為 normalize 後等於 finalTargetOffset）
            // 這樣可以確保彈回距離正確，不會多轉
            const snapBackDistance = finalOffsetWithLoops - magneticStartOffset;
            
            // 使用 ease-out 緩動，加上微小的彈跳效果
            const snapEase = 1 - Math.pow(1 - magProgress, 3); // Cubic ease-out
            // 微小的阻尼振盪效果
            const bounce = Math.exp(-magProgress * 8) * Math.sin(magProgress * Math.PI * 1.5) * BOUNCE_DAMPING;
            
            const magneticPos = magneticStartOffset + snapBackDistance * snapEase + bounce * Math.abs(snapBackDistance);
            
            setOffset(magneticPos);
            
            if (magProgress < 1) {
              animationRef.current = requestAnimationFrame(magneticAnimate);
            } else {
              // 🏁 Final position - ensure precise alignment
              setOffset(finalTargetOffset);
              onAnimationComplete();
            }
          };
          
          animationRef.current = requestAnimationFrame(magneticAnimate);
        }
      };
      

      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isRolling, winner, participants, onAnimationComplete]);

  return (
    <div className="relative w-full max-w-xl mx-auto h-[240px] overflow-hidden rounded-2xl border-4 border-yellow-500 bg-gray-900 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
      {/* Viewport Overlay for center selection */}
      <div className="absolute inset-x-0 top-[80px] h-[80px] border-y-2 border-yellow-500/50 bg-yellow-500/10 pointer-events-none z-10"></div>
      
      {/* Decorative side lights */}
      <div className="absolute left-2 inset-y-0 flex flex-col justify-around py-4 z-20">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${isRolling ? 'animate-pulse bg-yellow-400' : 'bg-yellow-700'}`}></div>
        ))}
      </div>
      <div className="absolute right-2 inset-y-0 flex flex-col justify-around py-4 z-20">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${isRolling ? 'animate-pulse bg-yellow-400' : 'bg-yellow-700'}`}></div>
        ))}
      </div>

      {/* Rolling List */}
      <div 
        className="absolute w-full pt-[80px]"
        style={{ 
          transform: `translateY(${offset}px)`
        }}
      >
        {displayList.length > 0 ? (
          displayList.map((participant, index) => (
            <div 
              key={`${participant.id}-${index}`} 
              className="h-[80px] flex flex-col items-center justify-center px-4"
            >
              <span className="text-3xl font-bold text-white tracking-wider truncate max-w-full">
                {participant.name}
              </span>
            </div>
          ))
        ) : (
          <div className="h-[80px] flex items-center justify-center">
            <span className="text-gray-500 italic">尚未輸入名單</span>
          </div>
        )}
      </div>

      {/* Glossy overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/40"></div>
    </div>
  );
};

export default SlotMachine;
