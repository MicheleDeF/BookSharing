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
    }
}