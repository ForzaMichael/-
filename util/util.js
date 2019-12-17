export function randomRound(start, end) {
  return Math.round(Math.random() * (end - start) + start);
}
export function isValidClick(clickpointed, redPacketObj) {
  const distanceX = clickpointed.x - redPacketObj.x;
  const distanceY = clickpointed.y - redPacketObj.y;
  const validX = distanceX > 0 && distanceX < redPacketObj.radius;
  const validY = distanceY > 0 && distanceY < redPacketObj.radius * 1.5; //纵向1.5倍radius
  console.log(validX && validY);
  return validX && validY;
}
