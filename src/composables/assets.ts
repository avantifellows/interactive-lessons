export default function useAssets() {
  // reference https://github.com/vitejs/vite/issues/1265#issuecomment-885948466
  const jpegs = import.meta.globEager('/src/assets/thumbnails/*.jpeg')
  return {
    motion: jpegs['/src/assets/thumbnails/motion.jpeg'].default,
    dummy: jpegs['/src/assets/thumbnails/dummy.jpeg'].default,
  }
}
