import fetch from "node-fetch"; // npm i node-fetch

export const getWordDefinition = async (req, res) => {
  const { word } = req.params;

  try {
    console.log(`[v0] Fetching definition for word: ${word}`);

    // Call Free Dictionary API
    const response = await fetch(
      `${process.env.DICTIONARY_API_URL}/en/${word}`
    );

    if (!response.ok) {
      console.log(`[v0] Dictionary API returned status: ${response.status}`);
      return res.status(404).json({
        error: "Word not found",
        message: `No definition found for "${word}"`,
      });
    }

    const data = await response.json();
    console.log(`[v0] Successfully fetched definition for: ${word}`);

    // Format response
    const formattedData = data.map((entry) => ({
      word: entry.word,
      phonetic: entry.phonetic || entry.phonetics?.[0]?.text || "",
      audio: entry.phonetics?.find((p) => p.audio)?.audio || "",
      meanings: entry.meanings.map((meaning) => ({
        partOfSpeech: meaning.partOfSpeech,
        definitions: meaning.definitions.slice(0, 3).map((def) => ({
          definition: def.definition,
          example: def.example || "",
        })),
      })),
    }));

    return res.json(formattedData);
  } catch (error) {
    console.error(`[v0] Error fetching dictionary data:`, error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch dictionary data",
    });
  }
};
