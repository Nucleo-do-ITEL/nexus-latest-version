import torch
import torch.nn as nn
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import joblib  # Para salvar scaler
import os

class FloodPredictor(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(3, 10)  # Inputs: precip_mean, elev_mean, temp_mean
        self.fc2 = nn.Linear(10, 1)  # Output: risco (0-1)
        self.relu = nn.ReLU()
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = self.relu(self.fc1(x))
        return self.sigmoid(self.fc2(x))

def train_model(data_path="flood_data.csv", model_path="flood_model.pth", scaler_path="scaler.joblib"):
    if not os.path.exists(data_path):
        np.random.seed(42)
        n_samples = 1000
        precip = np.random.normal(20, 15, n_samples).clip(0, 200)  # Precipitação mm
        elev = np.random.normal(200, 100, n_samples).clip(0, 1000)  # Elevação m
        temp = np.random.normal(25, 5, n_samples).clip(10, 40)  # Temperatura °C
        # Risco mais realista: alta precip + baixa elev = alto risco
        risk_prob = 1 / (1 + np.exp(-(precip / 50 + (300 - elev) / 100 - temp / 10)))
        risk = np.random.binomial(1, risk_prob)
        df = pd.DataFrame({"precip": precip, "elev": elev, "temp": temp, "risk": risk})
        df.to_csv(data_path, index=False)
        print(f"✅ Dados sintéticos gerados em {data_path}")

    df = pd.read_csv(data_path)
    X = df[["precip", "elev", "temp"]].values
    y = df["risk"].values.reshape(-1, 1)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    model = FloodPredictor()
    criterion = nn.BCELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

    X_train_t = torch.tensor(X_train, dtype=torch.float32)
    y_train_t = torch.tensor(y_train, dtype=torch.float32)
    X_test_t = torch.tensor(X_test, dtype=torch.float32)
    y_test_t = torch.tensor(y_test, dtype=torch.float32)

    for epoch in range(100):
        optimizer.zero_grad()
        out = model(X_train_t)
        loss = criterion(out, y_train_t)
        loss.backward()
        optimizer.step()

    # Avaliação simples
    with torch.no_grad():
        test_out = model(X_test_t)
        test_pred = (test_out > 0.5).float().numpy()
        acc = accuracy_score(y_test, test_pred)
        print(f"✅ Treinamento concluído! Acurácia no test: {acc:.2f}")

    torch.save(model.state_dict(), model_path)
    joblib.dump(scaler, scaler_path)
    return model, scaler

def predict_flood_risk(precip, elev, temp, model_path="flood_model.pth", scaler_path="scaler.joblib"):
    if not all(os.path.exists(p) for p in [model_path, scaler_path]):
        print("⚠️ Modelos não encontrados. Treinando...")
        model, scaler = train_model()
    else:
        model = FloodPredictor()
        model.load_state_dict(torch.load(model_path))
        model.eval()
        scaler = joblib.load(scaler_path)

    inputs = scaler.transform([[precip, elev, temp]])
    inputs_t = torch.tensor(inputs, dtype=torch.float32)
    with torch.no_grad():
        risk = model(inputs_t).item()
    interpretacao = "Alto" if risk > 0.7 else "Médio" if risk > 0.4 else "Baixo"
    return {"risco_inundacao": risk, "interpretacao": interpretacao}