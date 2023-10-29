import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import FrequencyChart from "./FrequencyChart";

function AudioDetail({ songId }: { songId: string }) {

  const note: { [key: string]: number } = {
    "C4": 261.63,
    "D4": 293.66,
    "E4": 329.63,
    "F4": 349.23,
    "G4": 392,
    "A4": 440,
    "B4": 493.88,
    "C5": 523.25
  };

  const {
    data: audioData,
    error,
    isLoading,
  } = useSWR<{ id: string; songname: string , data : [string]}>(`https://api-ex4.vercel.app/getNotesByName/${songId}`, fetcher);
  
  const handleClick = (songId: string) => {
    const additionalParameter = `params=${audioData?.data}`; // Example additional parameter
    window.location.href = `/audio/${songId}/display?${additionalParameter}`;
  };

  const removeDuplicates = (arr : string[]) => {
    return [...new Set(arr)];
  }

  const arrayToAmplitude = (arr : string[]) => {
    let a = [];
    if (arr && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (note[arr[i].trim()]) {
          a.push(note[arr[i].trim()]);
        }
      }
    }
    return a;
  };
  
  const audioDataArray = audioData?.data || []; // Defaulting to an empty array if audioData?.data is undefined
  console.log(audioDataArray);
  

  const arrayToText = (arr : string[]) => {
    if (arr && arr.length > 0) {
      const uniqueNotes = removeDuplicates(arr);
      return uniqueNotes.join(", ");
    }
    return '';
  }

  return (
    <div className="halloween-container">
        {isLoading && <div>Loading...</div>}
        {error && <div>Error loading audio files</div>}
        <div style={{ fontFamily: 'Roboto, monospace' }}>
      <div className="halloween-header">
        <h3>{audioData?.songname}</h3>
        <hr />
      </div>
      <div className="receipt-details">
        <div className="receipt-info">
          <p><b>Date:</b> October 30, 2023</p>
          <p><b>Receipt ID :</b> {audioData?.id}</p>
        </div>
        <div className="customer-info">
          <p><b>Notes:</b> {arrayToText(audioDataArray)}</p>
        </div>
      </div>
      <div className="total">
        <hr className="new1"/>
        <FrequencyChart frequencies={arrayToAmplitude(audioDataArray)} />
      </div>
      <hr />
      <button style={{ fontFamily: 'Nosifer' }} onClick={() => handleClick(songId)} className="halloween-button">
        Play!
      </button>
    </div>
    </div>
  );
}

export default AudioDetail;
