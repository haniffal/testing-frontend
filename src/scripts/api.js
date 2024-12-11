// TODO: Silakan sesuaikan BASE URL dari endpoint Anda
const BASE_URL = 'https://plant-disease-backend-957998016544.asia-southeast2.run.app';

const ENDPOINT = {
  predict: `${BASE_URL}/predict`,
  history: `${BASE_URL}/history`,
};

class PredictAPI {
  static async predict(data) {
    const response = await fetch(ENDPOINT.predict, {
      method: 'POST',
      body: data,
      redirect: 'follow',
    });

    const json = await response.json();
    return json;
  }

  // Fungsi untuk menyimpan riwayat prediksi (opsional)
  static async saveHistory(data) {
    const response = await fetch(ENDPOINT.history, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    return json;
  }

}
