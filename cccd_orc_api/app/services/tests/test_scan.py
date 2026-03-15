import os

def test_scan_cccd(client):

    image_path = os.path.join(
        os.path.dirname(__file__),
        "images",
        "cccd_test.jpg"
    )

    with open(image_path, "rb") as img:

        data = {
            "storage_id": "1",
            "image": (img, "cccd_test.jpg")
        }

        res = client.post(
            "/api/scan/cccd",
            data=data,
            content_type="multipart/form-data"
        )

    print(res.json)

    assert res.status_code == 200