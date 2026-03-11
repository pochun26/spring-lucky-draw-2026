
export interface Participant {
  id: string;
  name: string;
}

export interface Prize {
  id: string;
  name: string;
  quantity: number;
}

export interface Winner extends Participant {
  drawTimestamp: number;
  prizeName: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ROLLING = 'ROLLING',
  WINNER_REVEALED = 'WINNER_REVEALED'
}
