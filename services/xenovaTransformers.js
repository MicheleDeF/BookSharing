/** Servizio per la classificazione del testo utilizzando il modello di Hugging Face */

const { pipeline } = require('@xenova/transformers');
// Inizializza il modello di classificazione del testo
const modelPromise = pipeline('text-classification', 'onnx-community/distilbert-multilingual-toxicity-classifier-ONNX', {
     // Utilizza la versione "compressa" del modello
     quantized: true 
}).then(instance => {
     // Il modello è pronto per l'uso
     return instance;
}).catch(err => {
    // Gestione degli errori durante il caricamento del modello
    console.error(err);
    return null;
});

// Soglia di punteggio per considerare un testo come "approvato"
const threshold = 0.5;

// Funzione per controllare se un testo è approvato o meno
async function checkText(text) {
    // Attende che il modello sia pronto
    const moderationPipeline = await modelPromise;
    // Verifica se il modello è stato caricato correttamente
    if (!moderationPipeline) {
        throw new Error("Si è verificato un errore durante il caricamento del modello!");
    }

    // Esegue la classificazione del testo
    const results = await moderationPipeline(text);
    // Cerca il risultato relativo alla categoria "toxic"
    const toxicResult = results.find(r => r.label === 'toxic');
    // Se non viene trovato alcun risultato, il punteggio di tossicità è considerato 0
    const toxicScore = toxicResult ? toxicResult.score : 0;
    // Restituisce un oggetto con l'indicazione se il testo è approvato e il punteggio di tossicità
    return {
        isApproved: toxicScore <= threshold,
        score: toxicScore
    };
}

module.exports = {
    checkText
};