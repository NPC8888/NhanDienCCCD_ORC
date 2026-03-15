from ultralytics import YOLO
import cv2
import os
import uuid

model = YOLO("models_yolo/best.pt")

CROP_FOLDER = "uploads/crops"
os.makedirs(CROP_FOLDER, exist_ok=True)

def detect_fields(image_path):

    img = cv2.imread(image_path)

    if img is None:
        print("Image not found:", image_path)
        return []

    h, w = img.shape[:2]

    padding = 2

    results = model(img)

    detections = []

    for r in results:

        boxes = r.boxes.xyxy.cpu().numpy()
        classes = r.boxes.cls.cpu().numpy()
        scores = r.boxes.conf.cpu().numpy()

        for box, cls, score in zip(boxes, classes, scores):

            if score < 0.5:
                continue

            x1, y1, x2, y2 = map(int, box)

            x1 = max(0, x1 - padding)
            y1 = max(0, y1 - padding)
            x2 = min(w, x2 + padding)
            y2 = min(h, y2 + padding)

            if x2 <= x1 or y2 <= y1:
                continue

            field_name = model.names[int(cls)]

            crop = img[y1:y2, x1:x2]

            if crop.size == 0:
                continue

            crop_filename = f"{field_name}_{uuid.uuid4().hex}.jpg"

            crop_path = os.path.join(CROP_FOLDER, crop_filename)

            cv2.imwrite(crop_path, crop)

            detections.append({
                "field": field_name,
                "bbox": [x1, y1, x2, y2],
                "crop_path": crop_path
            })

    detections.sort(key=lambda d: (d["field"], d["bbox"][1]))

    return detections