'use client';

export const FireAnimation = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
      <img
        src="/fire.gif"
        alt="Fire animation"
        className="max-w-3xl w-full h-auto opacity-50 blur-sm"
      />
    </div>
  );
}; 