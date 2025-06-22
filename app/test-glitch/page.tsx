"use client";

import GlitchText from '../../components/GlitchText';

export default function TestGlitch() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-white text-2xl mb-8">GlitchText Component Test</h1>
      
      {/* Test 1: Basic usage with hover */}
      <div className="text-center">
        <h2 className="text-gray-400 mb-4">Hover to activate glitch:</h2>
        <GlitchText
          speed={1}
          enableShadows={true}
          enableOnHover={true}
          className="large"
        >
          reactbits
        </GlitchText>
      </div>
      
      {/* Test 2: Always on glitch */}
      <div className="text-center">
        <h2 className="text-gray-400 mb-4">Always glitching:</h2>
        <GlitchText
          speed={0.5}
          enableShadows={true}
          enableOnHover={false}
          className="large"
        >
          ALWAYS ON
        </GlitchText>
      </div>
      
      {/* Test 3: No shadows */}
      <div className="text-center">
        <h2 className="text-gray-400 mb-4">No shadows (hover):</h2>
        <GlitchText
          speed={2}
          enableShadows={false}
          enableOnHover={true}
          className="large"
        >
          NO SHADOWS
        </GlitchText>
      </div>
      
      {/* Test 4: Small text in existing design */}
      <div className="text-center">
        <h2 className="text-gray-400 mb-4">Small text (like in navigation):</h2>
        <div className="text-2xl font-bold">
          <GlitchText
            speed={0.5}
            enableShadows={true}
            enableOnHover={true}
          >
            Solana Incinerator
          </GlitchText>
        </div>
      </div>
    </div>
  );
} 