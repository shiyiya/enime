const RESOLUTION_MAPPING = {
  '1920x1080': 1080,
  '2560x1440': 1440,
  '1280x720': 720,
  '640x480': 480
}

export const compareResolution = (resolution, other) => {
  resolution = resolution.toLowerCase().trim().replaceAll('p', '').replaceAll(' ', '');
  other = other.toLowerCase().trim().replaceAll('p', '').replaceAll(' ', '');

  if (resolution.includes('x')) resolution = RESOLUTION_MAPPING[resolution];
  if (other.includes('x')) other = RESOLUTION_MAPPING[other];

  if (!resolution) resolution = Number.MIN_SAFE_INTEGER;
  if (!other) other = Number.MIN_SAFE_INTEGER;

  return parseInt(resolution) - parseInt(other);
}
