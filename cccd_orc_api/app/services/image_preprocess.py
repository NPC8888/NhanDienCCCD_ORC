import cv2

def resize_to_640(image_path):

    img = cv2.imread(image_path)

    img_resized = cv2.resize(img, (640, 640))

    cv2.imwrite(image_path, img_resized)

    return image_path