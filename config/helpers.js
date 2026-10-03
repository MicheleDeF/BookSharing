/** Questo file contiene gli helpers personalizzati
 *  da usate nei template handlebars,
 *  https://handlebarsjs.com/guide/builtin-helpers.html
 *  
 *  "section", utilizzzata per creare sezioni personalizzate nei template handlebars, come css, script, ect.;
 *  "getCurrentYear", utilizzata per ottenre l'anno corrente da utilizzare nel footer @2026;
 *  "truncate", utilizzata per tagliare il testo quando è troppo lungo, viene utilizzata soprattutto nelle card;
 *  "json", utilizzata per trasformare un oggetto json in stringa tramite 'JSON.stringify';
 *  "limit", utilizzata per effettuare un loop con limite su un array;
 *  "customizeData", utilizzata per ottenre una data in formato italiano;
 *  "eq", utilizzata per stabilire se due valori sono uguali;
 *  "uniqueRow", utilizzata per mettere un testo su una sola riga eliminando i ritorni a capo;
 *  "greaterThan", utilizzata per stabilire se un valore è maggiore di un altro;
 *  "slugChat", utilizzata nella sezione messaggi nell'area personale, per utilizzare i tab bootstrap.
 */
module.exports = {
    section: function(name, options) { 
      if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this); 
        return null;
      },
    getCurrentYear: () => new Date().getFullYear(),
    truncate: function (str, len) {
      if (str && str.length > len) {
        return str.substring(0, len) + '...';
      }
      return str;
    },
    json: (context) => JSON.stringify(context),
    limit: (arr, limit)=>{
        if (!Array.isArray(arr)) { return []; }
         return arr.slice(0, limit);
    },
    customizeData: function (d) {
      if (!d) return '';
      const data = new Date(d);
      return data.toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    eq: (a, b) => a == b,
    uniqueRow: (text)=>{
       if (!text) return '';
       return text.replace(/[\r\n]+/g, ' ').trim();
    },
    greaterThan: (a,b) =>{
      if (a > b) return true;      
    },
    slugChat: (name)=>{
        if (!name || typeof name !== 'string') return '';    
        return 'chat-' + name
            .toLowerCase()
            .normalize('NFD')                
            .replace(/[\u0300-\u036f]/g, '') 
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')   
            .replace(/\s+/g, '-')           
            .replace(/-+/g, '-');           
        }
}