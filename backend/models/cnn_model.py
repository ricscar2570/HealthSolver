import os
from pathlib import Path

import cv2
import numpy as np
import pydicom
import torch
import torch.nn as nn
import torchvision.models as models


class LegacyCNNUnavailableError(RuntimeError):
    """Raised when the optional legacy DICOM CNN cannot be loaded safely."""


class CNNModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.model = models.resnet18(weights=None)
        self.model.fc = nn.Linear(self.model.fc.in_features, 2)

    def forward(self, x):
        return self.model(x)


def load_dicom_image(file_path):
    dicom = pydicom.dcmread(file_path)
    img = np.asarray(dicom.pixel_array)
    if img.ndim != 2 or img.size == 0:
        raise ValueError("Only non-empty single-frame 2D DICOM images are supported.")
    img = cv2.resize(img, (224, 224))
    img = np.stack([img] * 3, axis=-1)
    img = torch.tensor(img, dtype=torch.float32).permute(2, 0, 1) / 255.0
    return img.unsqueeze(0)


MODEL_PATH = Path(
    os.getenv("HEALTHSOLVER_CNN_MODEL_PATH", "models/saved_models/cnn_dicom_model.pth")
)
_cnn_model = None


def get_cnn_model():
    """Load the optional legacy CNN lazily; never infer with random weights."""
    global _cnn_model
    if _cnn_model is not None:
        return _cnn_model

    if not MODEL_PATH.is_file():
        raise LegacyCNNUnavailableError("Legacy DICOM CNN model is not installed.")

    candidate = CNNModel()
    try:
        try:
            state_dict = torch.load(
                MODEL_PATH,
                map_location=torch.device("cpu"),
                weights_only=True,
            )
        except TypeError:
            # Compatibility with older PyTorch releases used by the historical backend.
            state_dict = torch.load(MODEL_PATH, map_location=torch.device("cpu"))
        candidate.load_state_dict(state_dict)
    except Exception as exc:
        raise LegacyCNNUnavailableError(
            "Legacy DICOM CNN model could not be loaded."
        ) from exc

    candidate.eval()
    _cnn_model = candidate
    return _cnn_model


def predict_dicom(image_path):
    model = get_cnn_model()
    img = load_dicom_image(image_path)
    with torch.no_grad():
        output = model(img)
        _, predicted = torch.max(output, 1)
    return "Anomaly Detected" if predicted.item() == 1 else "Normal"
