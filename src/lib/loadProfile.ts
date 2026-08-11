import type { Tool } from '../data/tools';

export function loadProfilePoints(tool: Pick<Tool, 'slug' | 'category' | 'deployment' | 'protocols'>, width = 160, height = 42): string {
  let seed = [...tool.slug].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 7);
  const points: string[] = [];
  const ramp = 5 + (seed % 5);
  const steady = 7 + (tool.protocols.length % 5);
  const peak = 13 + (seed % 13) + (tool.deployment === 'Cloud' ? 4 : 0);
  for (let index = 0; index < width / 4; index += 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const noise = (seed % 7) - 3;
    const progress = index / (width / 4 - 1);
    const envelope = progress < 0.25 ? progress / 0.25 : progress > 0.78 ? (1 - progress) / 0.22 : 1;
    const value = Math.max(2, Math.round((steady + envelope * peak + noise + ramp) * (height / 70)));
    points.push(`${Math.round(index * 4)},${height - value}`);
  }
  return points.join(' ');
}

export function loadProfilePath(tool: Pick<Tool, 'slug' | 'category' | 'deployment' | 'protocols'>, width = 160, height = 42): string {
  return `M ${loadProfilePoints(tool, width, height).replaceAll(' ', ' L ')}`;
}
