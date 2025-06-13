export const getWebSocketURL = (): string => {
  const token = localStorage.getItem('token');
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://localhost:8080/api/ws/connect?token=${token}`;
};
