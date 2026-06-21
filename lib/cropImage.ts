export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<File | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  // Force output to 400x400px to optimize storage and loading times
  const targetDimension = 400;

  canvas.width = targetDimension;
  canvas.height = targetDimension;

  ctx.translate(targetDimension / 2, targetDimension / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.translate(-targetDimension / 2, -targetDimension / 2)

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetDimension,
    targetDimension
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null)
        return
      }
      resolve(new File([blob], 'cropped.jpg', { type: 'image/jpeg', lastModified: Date.now() }))
    }, 'image/jpeg', 0.9)
  })
}
