import type { Tool } from '../data/tools';

type ProfileInput = Pick<
  Tool,
  'slug' | 'category' | 'deployment' | 'license' | 'protocols'
>;

function archetype(
  tool: ProfileInput,
): 'ramp' | 'step' | 'spike' | 'soak' | 'burst' {
  if (tool.category === 'Micro-benchmark CLI') return 'spike';
  if (tool.deployment === 'Cloud' && tool.license === 'Commercial')
    return 'burst';
  if (tool.category === 'Enterprise Suite') return 'step';
  if (tool.category === 'Protocol/API Load') return 'ramp';
  if (tool.license === 'Open Source') return 'soak';
  return 'burst';
}

export function loadProfilePoints(
  tool: ProfileInput,
  width = 160,
  height = 42,
): string {
  let seed = [...tool.slug].reduce(
    (value, char) => (value * 31 + char.charCodeAt(0)) >>> 0,
    7,
  );
  const points: string[] = [];
  const shape = archetype(tool);
  for (let index = 0; index < width / 4; index += 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const noise = (seed % 7) - 3;
    const progress = index / (width / 4 - 1);
    let envelope =
      progress < 0.22
        ? progress / 0.22
        : progress > 0.8
          ? (1 - progress) / 0.2
          : 1;
    if (shape === 'step')
      envelope = progress < 0.3 ? 0.25 : progress < 0.52 ? 0.62 : 0.9;
    if (shape === 'spike')
      envelope = Math.max(0.08, Math.exp(-((progress - 0.53) ** 2) / 0.008));
    if (shape === 'soak')
      envelope =
        progress < 0.2 ? progress / 0.2 : 0.78 + Math.sin(progress * 32) * 0.08;
    if (shape === 'burst')
      envelope = Math.max(0.12, Math.sin(progress * 30) ** 8);
    const baseline = shape === 'spike' ? 7 : shape === 'soak' ? 18 : 8;
    const peak = shape === 'spike' ? 48 : shape === 'step' ? 28 : 34;
    const value = Math.max(
      2,
      Math.round((baseline + envelope * peak + noise) * (height / 70)),
    );
    points.push(`${Math.round(index * 4)},${height - value}`);
  }
  return points.join(' ');
}

export function loadProfilePath(
  tool: ProfileInput,
  width = 160,
  height = 42,
): string {
  return `M ${loadProfilePoints(tool, width, height).replaceAll(' ', ' L ')}`;
}
