# ======================
# 1. Base image
# ======================
FROM python:3.10-slim

# ======================
# 2. Environment
# ======================
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# ======================
# 3. Workdir
# ======================
WORKDIR /app

# ======================
# 4. Cài lib hệ thống (cho opencv + torch)
# ======================
RUN apt-get update && apt-get install -y \
    gcc \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# install torch CPU
RUN pip install --no-cache-dir torch==2.2.1 torchvision==0.17.1 --index-url https://download.pytorch.org/whl/cpu
# ======================
# 5. Copy requirements trước (cache)
# ======================
COPY requirements.txt .

# ======================
# 6. Install Python deps
# ======================
RUN pip install --no-cache-dir -r requirements.txt

# ======================
# 7. Copy source code
# ======================
COPY . .


# ======================
# 8. Expose port
# ======================
EXPOSE 8000

# ======================
# 9. Run app
# ======================
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:8000", "main:app"]