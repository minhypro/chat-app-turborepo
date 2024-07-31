import { Server, Socket } from "socket.io";
import { ajv, logger, userRoom } from "@/utils";
import { ChatDatabase } from "@/global.type";
import { dbHelper } from "@/db";
import { Channel, ChannelType } from "@/db/channel/type";

interface ICreateChannel {
  io: Server;
  socket: Socket;
  db: ChatDatabase;
}

interface ICreateChannelPayload {
  name: string;
}

type TCreateChannelCallback = (arg0: {
  status: string;
  errors?: any;
  data?: any;
}) => void;

const validate = ajv.compile<ICreateChannelPayload>({
  type: "object",
  properties: {
    name: { type: "string", minLength: 2, maxLength: 32 },
  },

  required: ["name"],
  additionalProperties: false,
});

export function createChannel({ io, socket, db }: ICreateChannel) {
  const username = socket.handshake.auth.name;
  return async (
    payload: ICreateChannelPayload,
    callback: TCreateChannelCallback
  ) => {
    if (typeof callback !== "function") {
      return;
    }

    if (!validate(payload)) {
      return callback({
        status: "ERROR",
        errors: validate.errors,
      });
    }

    let channel: Channel;

    try {
      channel = await dbHelper.channelDb.insertChannel(db, {
        name: payload.name,
        type: ChannelType.PUBLIC,
      });

      logger.info(
        "public channel [%s] was created by user [%s]",
        channel.id,
        username
      );
    } catch (e) {
      return callback({
        status: "ERROR",
        errors: [{ message: "failed to insert" }],
      });
    }

    // broadcast to other tabs of the same user
    socket.to(userRoom(username)).emit("channel:created", channel);

    io.in(userRoom(username)).socketsJoin(`channel:${channel.id}`);

    callback({
      status: "OK",
      data: channel,
    });
  };
}
