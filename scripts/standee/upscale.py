"""Prepare the stand artwork for large-format print.

The source is a 1024 x 1536 preview export. Nothing can recover detail it
never held, but a careful chain still beats letting the printer's RIP
interpolate it blind: the JPEG's ringing and block noise are removed
*before* enlargement, so they are not magnified into the print, and the
sharpening is applied after, where it lands on real edges.

  denoise (at source size) -> Lanczos -> gentle bilateral -> unsharp

Settings were chosen by rendering the sign and a foliage crop at each and
comparing: heavier bilateral cleaned the type but plasticised the thatch.
"""

import sys
import cv2

SRC, DST, SCALE = sys.argv[1], sys.argv[2], int(sys.argv[3])

src = cv2.imread(SRC)
h, w = src.shape[:2]
print(f"source {w} x {h}")

den = cv2.fastNlMeansDenoisingColored(src, None, 3, 3, 7, 21)
up = cv2.resize(den, (w * SCALE, h * SCALE), interpolation=cv2.INTER_LANCZOS4)
up = cv2.bilateralFilter(up, 5, 18, 7)
blur = cv2.GaussianBlur(up, (0, 0), 1.6)
out = cv2.addWeighted(up, 1.6, blur, -0.6, 0)

cv2.imwrite(DST, out, [cv2.IMWRITE_JPEG_QUALITY, 98, cv2.IMWRITE_JPEG_SAMPLING_FACTOR, cv2.IMWRITE_JPEG_SAMPLING_FACTOR_444])
print(f"wrote {out.shape[1]} x {out.shape[0]}  ->  {DST}")
