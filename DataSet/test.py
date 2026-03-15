from ultralytics import YOLO
import cv2

# Load model đã train
model = YOLO("best.pt")

# Ảnh cần test
image_path = "test\images\9_jpg.rf.1834fca21612ef0640024ee7135d85a9.jpg"

# Predict
results = model(image_path)

# Hiển thị kết quả
for r in results:
    img = r.plot()  # vẽ bounding box lên ảnh
    cv2.imshow("Result", img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()