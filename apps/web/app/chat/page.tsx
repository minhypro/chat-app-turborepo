'use client';

import { useEffect, useState } from 'react';
import { initSocket } from '../socket';
import { logout } from '../lib/actions';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Chat() {
  const username = useSearchParams().get('username');
  const router = useRouter();
  const socket = initSocket(username as string);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [transport, setTransport] = useState('N/A');

  const handleConnectSocket = () => {
    if (!socket.connected) {
      socket.connect();
    } else {
      socket.disconnect();
    }
  };

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on('upgrade', transport => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  if (!username) {
    setTimeout(() => {
      router.replace('/login');
    }, 3000);
    return <div>Username not found</div>;
  }

  return (
    <div>
      <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
      <p>Transport: {transport}</p>
      <button onClick={handleConnectSocket}>Connect socket</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
