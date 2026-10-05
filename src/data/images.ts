/** Images d'exemple (Unsplash, comme dans les maquettes). Tailles réduites + recadrage serveur pour connexions lentes. */
export function unsplash(id: string, w: number, h: number, faces = false): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=70${faces ? '&crop=faces' : ''}`
}

export const IMG = {
  heroTeam: '1556761175-5973dc0f32e7',
  philoGroup: '1529156069898-49953e39b3ac',
  philoPortrait: '1573496359142-b8d87734a5a2',
  video: '1517245386807-bb43f82c33c4',
  avatarYao: '1531123897727-8f129e1688ce',
  avatarKodjo: '1506277886164-e25aa3f4ef7f',
  avatarSiya: '1488426862026-3ee34a7d66df',
  avatarJoin1: '1531384441138-2736e62e0919',
  avatarJoin2: '1589156280159-27698a70f29e',
  avatarJoin3: '1507152832244-10d45c7eda57',
  foodStand: '1555939594-58d7cb561ad1',
  foodProduct: '1567620905732-2d1ec7ab7445',
} as const
