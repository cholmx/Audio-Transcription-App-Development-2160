import axios from 'axios';

// AssemblyAI API configuration
const ASSEMBLY_API_BASE_URL = "https://api.assemblyai.com/v2";
const ASSEMBLY_API_KEY = "ea6fa38ab683450db7a738e3028dc1ca";

const headers = {
  authorization: ASSEMBLY_API_KEY,
  "content-type": "application/json"
};

export const transcribeAudio = async (audioFile) => {
  try {
    // First upload the audio file to AssemblyAI
    const uploadUrl = await uploadAudioFile(audioFile);
    
    // Then request transcription of the uploaded file
    const transcriptId = await requestTranscription(uploadUrl);
    
    // Poll for transcription results
    return await pollForTranscriptionResults(transcriptId);
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error(error.message || 'Failed to transcribe audio');
  }
};

// Step 1: Upload the audio file to AssemblyAI's servers
async function uploadAudioFile(audioFile) {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', audioFile);

    // Upload the file
    const uploadResponse = await axios.post(
      `${ASSEMBLY_API_BASE_URL}/upload`,
      audioFile,
      { headers: { authorization: ASSEMBLY_API_KEY } }
    );

    return uploadResponse.data.upload_url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload audio file');
  }
}

// Step 2: Request transcription of the uploaded audio file
async function requestTranscription(audioUrl) {
  try {
    // Configure transcription options
    const data = {
      audio_url: audioUrl,
      speech_model: "universal" // Using the universal model for better accuracy
    };

    // Request transcription
    const response = await axios.post(
      `${ASSEMBLY_API_BASE_URL}/transcript`, 
      data, 
      { headers }
    );

    return response.data.id;
  } catch (error) {
    console.error('Error requesting transcription:', error);
    throw new Error('Failed to request transcription');
  }
}

// Step 3: Poll for transcription results
async function pollForTranscriptionResults(transcriptId) {
  try {
    const pollingEndpoint = `${ASSEMBLY_API_BASE_URL}/transcript/${transcriptId}`;
    
    // Poll until transcription is completed or error occurs
    while (true) {
      const pollingResponse = await axios.get(pollingEndpoint, { headers });
      const transcriptionResult = pollingResponse.data;

      if (transcriptionResult.status === "completed") {
        // Return the completed transcription text
        return transcriptionResult.text;
      } else if (transcriptionResult.status === "error") {
        throw new Error(`Transcription failed: ${transcriptionResult.error}`);
      } else {
        // If still processing, wait for 3 seconds before polling again
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  } catch (error) {
    console.error('Error polling for results:', error);
    throw new Error('Failed while waiting for transcription results');
  }
}

// This is a fallback function that will be used if the API call fails
function generateSimulatedTranscription(fileName, duration) {
  const sampleTranscriptions = [
    "Welcome to our audio transcription service. This is a sample transcription to demonstrate the functionality of our application. The actual transcription would depend on the content of your audio file.",
    "This is a demonstration of how the transcription service works. Your uploaded audio file has been processed and converted to text. In a production environment, this would use a real speech-to-text API service.",
    "Hello and thank you for using our transcription service. This sample text shows how your audio content would appear as transcribed text. The length and content would match your actual audio file.",
    "This transcription service converts your audio files into readable text format. The processing time depends on the length of your audio file. This is a sample output to show the expected format.",
    "Audio transcription complete. This sample demonstrates the text output format you can expect from the service. Your actual transcription would contain the spoken words from your uploaded audio file."
  ];
  
  const baseText = sampleTranscriptions[Math.floor(Math.random() * sampleTranscriptions.length)];
  const additionalText = duration > 30 
    ? " This is a longer audio file, so the transcription would be more extensive with additional content and details from the audio recording." 
    : "";
  
  return baseText + additionalText + ` (Processed from: ${fileName}, Duration: ${Math.round(duration)}s)`;
}