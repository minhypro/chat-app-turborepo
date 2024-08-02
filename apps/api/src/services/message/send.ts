import { ajv, channelRoom, getUsernameFromSocket } from "@/utils";
import { IEventListeners, TEventListenerCallback } from "../type";
import { dbHelper } from "@/db";
import { MessageDTO } from "@/db/message/type";

interface ISendMessagePayload {
  content: string;
  channelId: string;
}

const validate = ajv.compile<ISendMessagePayload>({
  type: "object",
  properties: {
    content: { type: "string", minLength: 1, maxLength: 5000 },
    channelId: { type: "string", format: "uuid" },
  },
  required: ["content", "channelId"],
  additionalProperties: false,
});

export function sendMessage({ io, socket, db }: IEventListeners) {
  const username = getUsernameFromSocket(socket);
  return async (
    payload: ISendMessagePayload,
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

    const message: MessageDTO = {
      sender_id: username,
      channel_id: payload.channelId,
      content: payload.content,
    };

    try {
      const createdMessage = await dbHelper.messageDb.insertMessage(
        db,
        message
      );

      socket.broadcast
        .to(channelRoom(message.channel_id))
        .emit("message:sent", message);

      callback({
        status: "OK",
        data: {
          message: createdMessage,
        },
      });
    } catch (_) {
      return callback({
        status: "ERROR",
      });
    }
  };
}
