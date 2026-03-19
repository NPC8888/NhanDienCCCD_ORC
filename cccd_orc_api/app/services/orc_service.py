from vietocr.tool.predictor import Predictor
from vietocr.tool.config import Cfg
import cv2
from PIL import Image

config = Cfg.load_config_from_name("vgg_transformer")
config["device"] = "cpu"
config["predictor"]["beamsearch"] = False 
ocr = Predictor(config)

def read_text(image_path):
    try:
        img = cv2.imread(image_path)
        if img is None: return ""

        # TỐI ƯU CỐT LÕI: Ép Height về 32px chuẩn VietOCR
        h, w = img.shape[:2]
        new_h = 32
        new_w = int(w * (new_h / h))
        img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(img_rgb)

        return ocr.predict(pil_img).strip()
    except:
        return ""