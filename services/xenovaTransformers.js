/** Documentazione @xenova/transformers 
 *  https://www.npmjs.com/package/@xenova/transformers 
 *  https://huggingface.co/docs/transformers.js/index
 */

const { pipeline } = require('@xenova/transformers');

/** 
 * Caricamento del modello "distilbert-multilingual-toxicity-classifier-ONNX"
 */
const modelPromise = pipeline('text-classification', 'onnx-community/distilbert-multilingual-toxicity-classifier-ONNX', {
    /** usa la versione "compressa" */
     quantized: true 
}).then(instance => {
     return instance;
}).catch(err => {
    console.error(err);
});

/** soglia di tolleranza dello 0.5 (50%) */
const threshold = 0.5;

async function checkText(text) {

    const moderationPipeline = await modelPromise;
    
    if (!moderationPipeline) {
        throw new Error("Il modello di moderazione non è disponibile!");
    }

    const results = await moderationPipeline(text);
    const toxicResult = results.find(r => r.label === 'toxic');
    const toxicScore = toxicResult ? toxicResult.score : 0;

    return {
        isApproved: toxicScore <= threshold,
        score: toxicScore
    };
}

module.exports = {
    checkText
};