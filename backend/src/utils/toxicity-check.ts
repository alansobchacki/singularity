export default async function checkToxicity(content: string): Promise<boolean> {
  const response = await fetch(
    `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comment: { text: content },
        languages: ['en', 'pt'],
        requestedAttributes: { 
          TOXICITY: {}
        },
      }),
    }
  );

  if (!response.ok) {
    console.error('Error checking toxicity:', response.statusText);
    throw new Error('Toxicity check failed');
  }

  const data = await response.json();
  const toxicityScore = data.attributeScores.TOXICITY.summaryScore.value;

  // enable for debugging reasons only
  // console.log(data);
  // console.log(`Toxicity score: ${toxicityScore}`);

  return toxicityScore >= 0.6; 
}
