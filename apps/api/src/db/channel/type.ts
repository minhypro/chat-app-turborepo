export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
}

enum ChannelType {
  PUBLIC = "public",
  PRIVATE = "private",
}
