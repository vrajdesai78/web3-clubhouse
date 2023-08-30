export const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_roomId",
        type: "string",
      },
      {
        internalType: "string",
        name: "_time",
        type: "string",
      },
    ],
    name: "scheduleMeeting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserMeetings",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "roomId",
            type: "string",
          },
          {
            internalType: "string",
            name: "time",
            type: "string",
          },
        ],
        internalType: "struct MeetingScheduler.Meeting[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
