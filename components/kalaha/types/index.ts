type BordPitKeys = `${number}`
export type PlayerBoardData = Record<BordPitKeys, number>;
export type PlayerType = 'a' | 'b';

export type EmitSelectedPayloadType = { whoseRow: PlayerType, pitPosition: keyof PlayerBoardData; };