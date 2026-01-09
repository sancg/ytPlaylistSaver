async function downloadYouTubeVideo(videoId) {
  try {
      let videoUrlMatch = ''
      let directUrl = ''
    
    // Use a public API to get video info (no authentication needed)
    const response = await fetch(
      `https://www.youtube.com/watch?v=${videoId}`
    );
    const html = await response.text();
    
    // Parse the video URL from the page
    // (YouTube embeds video URLs in the page source)
     videoUrlMatch = html.match(/"url":"([^"]+)"/);
    const r = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
  );
  
  const info = await r.json();
  console.log('Video info:', info);
       // Extract player response JSON
    const match = html.match(/var ytInitialPlayerResponse = ({.+?});/);
    if (!match) throw new Error('Could not extract player data');
    
    const playerResponse = JSON.parse(match[1]);
    const formats = playerResponse.streamingData?.formats || [];
    const adaptiveFormats = playerResponse.streamingData?.adaptiveFormats || [];
      
    if (videoUrlMatch) {
       directUrl = JSON.parse(`"${videoUrlMatch[1]}"`);
    }
      console.log({formats, match,playerResponse, adaptiveFormats, videoUrlMatch, directUrl})
  }catch (error) {
      console.log(error)
  }
};
await downloadYouTubeVideo("jvthgujpku8");