'use client';

export const ImageBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <img
        src="/fire.gif"
        alt="Fire background"
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
    </div>
  );
}; 