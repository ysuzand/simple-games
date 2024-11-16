type BordPitKeys = 'one' | 'two' | 'three' | 'four' | 'five' | 'six' | 'store'
export type PlayerBoardData = Record<BordPitKeys, number>;
export type PlayerType = 'a' | 'b';

export type EmitSelectedPayloadType = { player: PlayerType, key: keyof PlayerBoardData; };