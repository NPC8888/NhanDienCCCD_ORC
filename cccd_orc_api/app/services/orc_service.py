from vietocr.tool.predictor import Predictor
from vietocr.tool.config import Cfg
import cv2
from PIL import Image

# load model khi server start
config = Cfg.load_config_from_name("vgg_transformer")

config["device"] = "cpu"
config["predictor"]["beamsearch"] = False

ocr = Predictor(config)


def read_text(image_path):

    img = cv2.imread(image_path)

    img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    pil_img = Image.fromarray(gray)

    try:
        text = ocr.predict(pil_img)
    except:
        return ""

    return text