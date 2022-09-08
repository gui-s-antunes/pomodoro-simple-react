// export default function setAudio(
//   audioName: string,
//   src?: string,
// ): HTMLAudioElement {
//   if (src) return new Audio(src + audioName);
//   return new Audio(audioName);
// }
export default function setAudio(audioName: string): HTMLAudioElement {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const newAudio = require(`../sounds/${audioName}`);
  return new Audio(newAudio);
}
