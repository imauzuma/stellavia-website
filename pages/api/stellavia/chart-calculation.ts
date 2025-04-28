import type { NextApiRequest, NextApiResponse } from 'next';

type ChartData = {
  planetPositions: {
    [key: string]: {
      sign: string,
      degree: number
    }
  },
  aspects: Array<{
    planet1: string,
    planet2: string,
    type: string,
    orb: number
  }>
};

type ErrorResponse = {
  message: string
};

const zodiacSigns = [
  'おひつじ座', 'おうし座', 'ふたご座', 'かに座',
  'しし座', 'おとめ座', 'てんびん座', 'さそり座',
  'いて座', 'やぎ座', 'みずがめ座', 'うお座'
];

const planetNames: { [key: number]: string } = {
  0: '太陽',
  1: '月',
  2: '水星',
  3: '金星',
  4: '火星',
  5: '木星',
  6: '土星',
  7: '天王星',
  8: '海王星',
  9: '冥王星'
};

const aspectTypes: { [key: string]: { angle: number, orb: number, name: string } } = {
  conjunction: { angle: 0, orb: 8, name: '合' },
  opposition: { angle: 180, orb: 8, name: '対向' },
  trine: { angle: 120, orb: 8, name: '三角' },
  square: { angle: 90, orb: 7, name: '四角' },
  sextile: { angle: 60, orb: 6, name: '六角' }
};

const calculatePlanetPositions = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  latitude: number,
  longitude: number
): { [key: string]: { sign: string, degree: number } } => {
  const positions: { [key: string]: { sign: string, degree: number } } = {};

  const seed = year + month * 100 + day + hour + minute;
  
  for (let i = 0; i <= 9; i++) {
    const randomFactor = ((seed * (i + 1)) % 360);
    const longitude = randomFactor;
    const signIndex = Math.floor(longitude / 30);
    const degree = longitude % 30;
    
    positions[planetNames[i]] = {
      sign: zodiacSigns[signIndex],
      degree: parseFloat(degree.toFixed(2))
    };
  }

  return positions;
};

const calculateAspects = (
  planetPositions: { [key: string]: { sign: string, degree: number } }
): Array<{ planet1: string, planet2: string, type: string, orb: number }> => {
  const aspects: Array<{ planet1: string, planet2: string, type: string, orb: number }> = [];
  const planets = Object.keys(planetPositions);

  const absoluteDegrees: { [key: string]: number } = {};
  for (const planet of planets) {
    const position = planetPositions[planet];
    const signIndex = zodiacSigns.indexOf(position.sign);
    absoluteDegrees[planet] = signIndex * 30 + position.degree;
  }

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      
      let angle = Math.abs(absoluteDegrees[planet1] - absoluteDegrees[planet2]);
      if (angle > 180) angle = 360 - angle;
      
      for (const [aspectName, aspectData] of Object.entries(aspectTypes)) {
        const orb = Math.abs(angle - aspectData.angle);
        if (orb <= aspectData.orb) {
          aspects.push({
            planet1,
            planet2,
            type: aspectData.name,
            orb: parseFloat(orb.toFixed(2))
          });
          break;
        }
      }
    }
  }

  return aspects;
};

const getCoordinates = async (address: string): Promise<{ latitude: number, longitude: number }> => {
  if (address.includes('東京')) {
    return { latitude: 35.6762, longitude: 139.6503 };
  }
  else if (address.includes('大阪')) {
    return { latitude: 34.6937, longitude: 135.5023 };
  }
  else if (address.includes('京都')) {
    return { latitude: 35.0116, longitude: 135.7681 };
  }
  return { latitude: 35.6762, longitude: 139.6503 };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChartData | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { nickname, birthdate, birthplace, birthtime, gender } = req.body;

    if (!nickname || !birthdate || !birthplace || !birthtime) {
      return res.status(400).json({ message: '必須項目が入力されていません' });
    }

    const [year, month, day] = birthdate.split('-').map(Number);
    
    const [hour, minute] = birthtime.split(':').map(Number);
    
    const { latitude, longitude } = await getCoordinates(birthplace);
    
    const planetPositions = calculatePlanetPositions(
      year,
      month,
      day,
      hour,
      minute,
      latitude,
      longitude
    );
    
    const aspects = calculateAspects(planetPositions);
    
    return res.status(200).json({
      planetPositions,
      aspects
    });
  } catch (error) {
    console.error('Error processing chart calculation:', error);
    return res.status(500).json({ message: '診断処理中にエラーが発生しました' });
  }
}
