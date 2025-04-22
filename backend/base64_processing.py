import base64
from pdf2image import convert_from_path
from io import BytesIO



def pdf_to_base64_images(pdf_path, dpi=200):
    base64_images = []
    try:
        pages = convert_from_path(pdf_path, dpi=dpi)
        for page in pages:
            buffered = BytesIO()
            page.save(buffered, format="PNG")
            img = base64.b64encode(buffered.getvalue()).decode("utf-8")
            img_base64 = f"data:image/png;base64,{img}"

            base64_images.append(img_base64)
    except Exception as e:
        print(f"Error converting PDF to Base64 images: {e}")
        return None
    return base64_images

 