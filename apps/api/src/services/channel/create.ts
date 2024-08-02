import { ajv, getUsernameFromSocket, logger, userRoom } from "@/utils";
import { dbHelper } from "@/db";
import { Channel, ChannelType } from "@/db/channel/type";
import { IEventListeners, TEventListenerCallback } from "../type";

interface ICreateChannelPayload {
  name: string;
}

const validate = ajv.compile<ICreateChannelPayload>({
  type: "object",
  properties: {
    name: { type: "string", minLength: 2, maxLength: 32 },
  },

  required: ["name"],
  additionalProperties: false,
});

export function createChannel({ io, socket, db }: IEventListeners) {
  const username = getUsernameFromSocket(socket);
  return async (
    payload: ICreateChannelPayload,
    callback: TEventListenerCallback
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
