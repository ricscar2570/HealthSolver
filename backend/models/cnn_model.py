import torch
import torch.nn as nn
import torchvision.models as models
import pydicom
import numpy as np
import os
import cv2

class CNNModel(nn.Module):
    def __init__(self):
        super(CNNModel, self).__init__()
        self.model = models.resnet18(pretrained=True)
        self.model.fc = nn.Linear(self.model.fc.in_features, 2)

    def forward(self, x):
        return self.model(x)

def load_dicom_image(file_path):
    dicom = pydicom.dcmread(file_path)
    img = dicom.pixel_array
    img = cv2.resize(img, (224, 224))
    img = np.stack([img] * 3, axis=-1)
    img = torch.tensor(img, dtype=torch.float32).permute(2, 0, 1) / 255.0
    return img.unsqueeze(0)

def predict_dicom(model, image_path):
    model.eval()
    img = load_dicom_image(image_path)
    with torch.no_grad():
        output = model(img)
        _, predicted = torch.max(output, 1)
    return "Anomaly Detected" if predicted.item() == 1 else "Normal"

MODEL_PATH = "models/saved_models/cnn_dicom_model.pth"
cnn_model = CNNModel()
if os.path.exists(MODEL_PATH):
    cnn_model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
    cnn_model.eval()
