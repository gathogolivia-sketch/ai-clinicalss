// Speech synthesis (Text-to-Speech) and Recognition (Speech-to-Text) utilities

export function speakPatientText(text: string, gender: string = 'Female') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip non-verbal stage cues like *sighs* or *shifts*
  const cleanText = text.replace(/\*[^*]+\*/g, '').trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.95; // slightly deliberate, authentic patient pacing
  utterance.pitch = gender.toLowerCase().includes('female') ? 1.05 : 0.85;

  const voices = window.speechSynthesis.getVoices();
  const langVoices = voices.filter(v => v.lang.startsWith('en'));

  if (langVoices.length > 0) {
    if (gender.toLowerCase().includes('female')) {
      const femaleVoice = langVoices.find(v =>
        v.name.includes('Female') ||
        v.name.includes('Samantha') ||
        v.name.includes('Victoria') ||
        v.name.includes('Zira') ||
        v.name.includes('Google UK English Female')
      );
      if (femaleVoice) utterance.voice = femaleVoice;
    } else {
      const maleVoice = langVoices.find(v =>
        v.name.includes('Male') ||
        v.name.includes('David') ||
        v.name.includes('George') ||
        v.name.includes('Alex') ||
        v.name.includes('Google UK English Male')
      );
      if (maleVoice) utterance.voice = maleVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
