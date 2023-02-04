const startRecordingButton = document.getElementById('start-recording');
const stopRecordingButton = document.getElementById('stop-recording');
const textArea = document.getElementById('text-area');
const languageSelect = document.getElementById('language-select');
const speakButton = document.getElementById('speak');

let recognition;

const onStartRecording = () => {
  recognition = new webkitSpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = languageSelect.value;
  recognition.start();

  recognition.addEventListener('result', onSpeechResult);
  recognition.addEventListener('end', onStopRecording);
};

const onSpeechResult = (event) => {
  let transcript = '';
  for (let i = event.resultIndex; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript;
  }
  textArea.value = transcript;
};

const onStopRecording = () => {
  recognition.stop();
};

const translateText = (text, targetLanguage) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`);
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response[0][0][0]);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = (error) => reject(error);
    xhr.send();
  });
};

const onSpeak = async () => {
  const targetLanguage = languageSelect.value;
  const text = textArea.value;
  const translatedText = await translateText(text, targetLanguage);

  const speech = new SpeechSynthesisUtterance();
  speech.lang = targetLanguage;
  speech.text = translatedText;
  speechSynthesis.speak(speech);
};

startRecordingButton.addEventListener('click', onStartRecording);
stopRecordingButton.addEventListener('click', onStopRecording);
speakButton.addEventListener('click', onSpeak);
