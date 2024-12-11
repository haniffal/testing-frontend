// Catch elements
const dropArea = document.getElementById('dropArea');
const predictForm = document.getElementById('predictForm');
const previewImg = document.getElementById('previewImg');

const waitingToPredicting = document.querySelector(
  '.result-container #waitingToPredicting',
);
const loadingPredict = document.querySelector('.result-container .loading');
const predictionError = document.querySelector('.result-container #predictionError');
const result = document.querySelector('.result-container #result');

// Form data
const predictFormData = new FormData();

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Prevent submitting form behaviors
['submit'].forEach((eventName) => {
  predictForm.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlight, false);
});
// Remove highlight drop area when item is drag leave
['dragleave', 'drop'].forEach((eventName) => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

function highlight() {
  dropArea.classList.add('highlight');
}

function unhighlight() {
  dropArea.classList.remove('highlight');
}

// Handle dropped and submit files
dropArea.addEventListener('drop', dropHandler, false);
predictForm.elements.skinFile.addEventListener('change', skinFileInputHandler);
predictForm.addEventListener('submit', predictFormSubmitHandler);

function dropHandler(event) {
  const dataTransfer = event.dataTransfer;
  const files = dataTransfer.files;

  const skinImage = files[0];
  predictFormData.set('image', skinImage, skinImage.name);

  previewFile(skinImage);
}

// Handle file by input element
function skinFileInputHandler(event) {
  const files = Array.from(event.target.files);

  const skinImage = files[0];
  predictFormData.set('image', skinImage, skinImage.name);

  previewFile(skinImage);
}

// Handle submit form
function predictFormSubmitHandler() {
  if (!predictFormData.has('image')) {
    alert('Silakan pilih gambar Anda terlebih dahulu');
    return;
  }

  uploadFile(predictFormData);
}

// Show preview after choose image
function previewFile(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onloadend = () => {
    previewImg.innerHTML = '';

    const img = document.createElement('img');
    img.src = reader.result;
    previewImg.appendChild(img);
  };
}

// Send image to server
async function uploadFile(formData) {
  try {
    hideElement(waitingToPredicting);
    hideElement(result);
    showElement(loadingPredict);

    const response = await PredictAPI.predict(formData);

    showPredictionResult(response);
    showElement(result);
  } catch (error) {
    console.error(error);

    predictionError.textContent = error.message;
  } finally {
    hideElement(loadingPredict);
  }
}

// Save prediction result in local
function savePredictionToHistory(predictionResult) {
    const history = JSON.parse(localStorage.getItem('predictionHistory')) || [];
    
    // Tambahkan hasil baru ke riwayat
    history.push(predictionResult);
    
    // Simpan kembali ke localStorage
    localStorage.setItem('predictionHistory', JSON.stringify(history));
    
    // Update UI riwayat
    displayHistory();
}
  
// Fungsi untuk menampilkan history
function displayHistory() {
    const historyContainer = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('predictionHistory')) || [];
    
    // Bersihkan riwayat sebelumnya
    historyContainer.innerHTML = '';
  
    // Jika ada riwayat
    if (history.length > 0) {
      history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `Prediksi pada ${item.timestamp}: ${item.result}`;
        historyContainer.appendChild(li);
      });
    } else {
      // Jika tidak ada riwayat
      document.getElementById('noHistoryMessage').style.display = 'block';
    }
};
  
  // Panggil fungsi displayHistory saat halaman dimuat
  window.onload = function() {
    displayHistory();
    };
  

// Show result to user
function showPredictionResult(response) {
    const { message, data } = response;
  
    // Simpan hasil prediksi ke riwayat
    const predictionResult = {
      timestamp: new Date().toLocaleString(),
      result: data.result,  // Hasil prediksi
    };
    savePredictionToHistory(predictionResult);
  
    result.innerHTML = `
      <div class="response-message">
        <i class="fas fa-check"></i>
        <span class="message">${message}</span>
      </div>
      <div class="prediction-result">
        <div>
          <div class="result-title">Result:</div>
          <div>${data.result}</div>
        </div>
        <div>
          <div class="result-title">Suggestion:</div>
          <div>${data.suggestion}</div>
        </div>
      </div>
    `;
}  
