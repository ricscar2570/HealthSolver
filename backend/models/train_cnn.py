import torch
import torch.nn as nn
import torch.optim as optim
import torchvision.transforms as transforms
from torch.utils.data import DataLoader, Dataset
import os
import pydicom
import numpy as np
import cv2

class DICOMDataset(Dataset):
    def __init__(self, image_folder, labels):
        self.image_folder = image_folder
        self.labels = labels
        self.transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Resize((224, 224)),
            transforms.Normalize(mean=[0.5], std=[0.5])
        ])

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        img_path = os.path.join(self.image_folder, self.labels[idx][0])
        dicom = pydicom.dcmread(img_path)
        img = dicom.pixel_array
        img = cv2.resize(img, (224, 224))
        img = np.stack([img] * 3, axis=-1)
        img = torch.tensor(img, dtype=torch.float32).permute(2, 0, 1) / 255.0
        label = self.labels[idx][1]
        return img, torch.tensor(label, dtype=torch.long)

def train_cnn():
    dataset = DICOMDataset("datasets/dicom_images", [("image1.dcm", 0), ("image2.dcm", 1)])
    dataloader = DataLoader(dataset, batch_size=8, shuffle=True)
    
    model = CNNModel()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    for epoch in range(5):
        for images, labels in dataloader:
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
    
    torch.save(model.state_dict(), "models/saved_models/cnn_dicom_model.pth")
    print("✅ Modello CNN addestrato e salvato!")

if __name__ == "__main__":
    train_cnn()
