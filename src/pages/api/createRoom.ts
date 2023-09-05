// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

interface RoomDetails {
  message: string;
  data?: {
    roomId: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch("https://api.huddle01.com/api/v1/create-room", {
    method: "POST",
    body: JSON.stringify({
      title: req.body.title,
      startTime: req.body.startTime,
      ...(req.body.isTokenGate && {
        ...(req.body.tokenGateCondition === "NFT"
          ? {
              tokenType: "ERC721",
              chain: req.body.chain,
              contractAddress: [req.body.tokenGateConditionValue],
            }
          : req.body.tokenGateCondition === "LENS"
          ? {
              tokenType: "LENS",
              chain: "POLYGON",
              conditionType: req.body.tokenGateConditionType,
              ...(req.body.tokenGateConditionType !== "HAVE_HANDLE" && {
                conditionValue: req.body.tokenGateConditionValue,
              }),
            }
          : req.body.tokenGateCondition === "CYBERCONNECT"
          ? {
              tokenType: "CYBERCONNECT",
              chain: "BSC",
              conditionType: req.body.tokenGateConditionType,
              ...(req.body.tokenGateConditionType !== "HAVE_HANDLE" && {
                conditionValue: req.body.tokenGateConditionValue,
              }),
            }
          : {
              tokenType: "POAP",
              chain: "ETHEREUM",
              contractAddress: [req.body.tokenGateConditionValue],
            }),
      }),
    }),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY as string,
    },
  });
  const data: RoomDetails = await response.json();
  res.status(200).json({ roomId: data?.data?.roomId });
}
