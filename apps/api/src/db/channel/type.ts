export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
}

export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}
