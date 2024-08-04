export interface GetUserPayLoad {
  userId: number;
}

export interface ReachUserPayload {
  name: string;
  memberIds: number[];
}

export interface SearchUserPayLoad {
  query: string;
  limit?: number;
}
