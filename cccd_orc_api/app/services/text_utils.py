import re
import cv2
from datetime import datetime


def read_qr(image_path):

    img = cv2.imread(image_path)

    detector = cv2.QRCodeDetector()

    data, bbox, _ = detector.detectAndDecode(img)

    return data

def fix_date(text):
    if not text:
        return ""

    text = text.replace(" ", "")

    # sửa lỗi 08101/2024 → 08/01/2024
    if re.match(r"\d{5}/\d{4}", text):
        text = text[:2] + "/" + text[2:]

    # sửa lỗi 08/101/2024 → 08/01/2024
    if re.match(r"\d{2}/\d{3}/\d{4}", text):
        text = text[:3] + text[4:]

    return text


def normalize_text(text):
    if not text:
        return ""
    return text.strip().replace("\n", " ")

def convert_date_mysql(text):
    if not text:
        return None

    try:
        date_obj = datetime.strptime(text, "%d/%m/%Y")
        return date_obj.strftime("%Y-%m-%d")
    except:
        return None