import React, { useEffect, useState } from "react";

// Components
import BottomBar from "@/components/BottomBar/BottomBar";
import Sidebar from "@/components/Sidebar/Sidebar";
import GridLayout from "@/components/GridLayout/GridLayout";
import Prompts from "@/components/common/Prompts";
import { useEventListener, useHuddle01 } from "@huddle01/react/hooks";
import { useRoom, useAcl } from "@huddle01/react/hooks";
import { useRouter } from "next/router";
import AcceptRequest from "@/components/Modals/AcceptRequest";
import useStore from "@/store/slices";
import { toast } from "react-hot-toast";
import { useAppUtils } from "@huddle01/react/app-utils";

const Home = () => {
  const { isRoomJoined } = useRoom();
  const { push, query } = useRouter();
  const { changePeerRole } = useAcl();
  const { me } = useHuddle01();
  const [requestedPeerId, setRequestedPeerId] = useState("");
  const [showAcceptRequest, setShowAcceptRequest] = useState(false);
  const addRequestedPeers = useStore((state) => state.addRequestedPeers);
  const removeRequestedPeers = useStore((state) => state.removeRequestedPeers);
  const setSpacesTitle = useStore((state) => state.setSpacesTitle);
  const requestedPeers = useStore((state) => state.requestedPeers);
  const avatarUrl = useStore((state) => state.avatarUrl);
  const userDisplayName = useStore((state) => state.userDisplayName);
  const { changeAvatarUrl, setDisplayName } = useAppUtils();

  useEventListener("room:peer-joined", ({ peerId, role }) => {
    if (role === "peer") {
      changePeerRole(peerId, "listener");
    }
  });

  useEventListener("room:me-left", () => {
    setSpacesTitle("");
    push("/");
  });

  useEffect(() => {
    if (!isRoomJoined && query.roomId) {
      push(`/${query.roomId}/lobby`);
      return;
    }
  }, [isRoomJoined, query.roomId]);

  useEffect(() => {
    if (changeAvatarUrl.isCallable) {
      changeAvatarUrl(avatarUrl);
    }
  }, [changeAvatarUrl.isCallable]);

  useEffect(() => {
    if (setDisplayName.isCallable) {
      setDisplayName(userDisplayName);
    }
  }, [setDisplayName.isCallable]);

  useEventListener("room:me-role-update", (role) => {
    toast.success(`You are now ${role}`);
  });

  useEventListener("room:data-received", (data) => {
    if (
      data.payload["request-to-speak"] 
    ) {
      setShowAcceptRequest(true);
      setRequestedPeerId(data.payload["request-to-speak"]);
      addRequestedPeers(data.payload["request-to-speak"]);
      setTimeout(() => {
        setShowAcceptRequest(false);
      }, 5000);
    }
  });

  const handleAccept = () => {
    if (me.role == "host" || me.role == "coHost") {
      changePeerRole(requestedPeerId, "speaker");
      setShowAcceptRequest(false);
      removeRequestedPeers(requestedPeerId);
    }
  };

  useEffect(() => {
    if (!requestedPeers.includes(requestedPeerId)) {
      setShowAcceptRequest(false);
    }
  }, [requestedPeers]);

  return (
    <section className="bg-audio flex h-screen items-center justify-center w-full relative  text-slate-100">
      <div className="flex items-center justify-center w-full">
        <GridLayout />
        <Sidebar />
        <div className="absolute right-4 bottom-20">
          {showAcceptRequest && (
            <AcceptRequest
              peerId={requestedPeerId}
              onAccept={handleAccept}
              onDeny={() => {
                setShowAcceptRequest(false);
                removeRequestedPeers(requestedPeerId);
              }}
            />
          )}
        </div>
      </div>
      <BottomBar />
      <Prompts />
    </section>
  );
};
export default Home;
