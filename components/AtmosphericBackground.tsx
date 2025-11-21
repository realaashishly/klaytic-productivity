import React from 'react';

const AtmosphericBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030303]">
        {/* Perspective Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:60px_60px] perspective-grid"></div>

        {/* Ambient Fog */}
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-cyan-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-orange-900/10 blur-[120px] rounded-full"></div>

        {/* Overlays */}
        <div className="scanlines"></div>
        <div className="vignette"></div>
    </div>
);

export default AtmosphericBackground;
