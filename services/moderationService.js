/** Questo Service viene utilizzare per moderare i testi inseriti dall'utente:
 *  - descrizione libro;
 *  - descrizione breve utente;
 *  - messaggi inviati.
 *  Usa il pacchetto npm content-checker (https://github.com/utilityfueled/content-checker).
 *  Inoltre è stata definita una lista di frasi non consentite nel file 'lista_badwords.txt',
 *  questo file è stato scaricato da GitHub al link:
 *  https://raw.githubusercontent.com/napolux/paroleitaliane/refs/heads/main/paroleitaliane/lista_badwords.txt
 */
const { Filter } = require('content-checker');
const fs = require('fs');
const path = require('path');
const pathFile = path.resolve(__dirname, 'lista_badwords.txt');

let filter;
try {
    /** Creazione array da passare all'oggetto 'filter'. */
    const fileContent = fs.readFileSync(pathFile, 'utf-8');
    const forbiddenWords = fileContent.split(/\r?\n/).map(word => word.trim()).filter(Boolean);
    /** Sostituisce parole non consentite con l'asterisco (*). */
    filter = new Filter({ placeHolder: '*' });
    /** Impostazione ulteriori parole non consentite. */
    filter.addWords(...forbiddenWords);    
    
} catch (error) {
    filter = new Filter({ placeHolder: '*' });
}

/** Funzione che effettua la pulizia del testo da frasi non consentite. */
const cleanText = (text) => {
    if (!text || typeof text !== 'string') return '';
    return filter.clean(text);
};

module.exports = {
    cleanText
};



