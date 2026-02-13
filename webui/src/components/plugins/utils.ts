// Simple hash function for colors
export const stringToColor = (str: string, isDark: boolean = false) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use HSL for better pastel/elegant colors
  const h = Math.abs(hash) % 360;
  // Increase saturation for text color to make it readable
  const s = isDark ? 70 : 60; 
  // Readability brightness: dark mode needs light text, light mode needs dark text
  const l = isDark ? 70 : 45; 
  
  return {
    h, s, l,
    color: `hsl(${h}, ${s}%, ${l}%)`,
    bg: 'transparent',
    border: `hsla(${h}, ${s}%, ${l}%, 0.5)`,
    // Add raw values for other uses
    raw: { h, s, l }
  };
};
