## Guida all'installazione dell'applicazione

### Requisiti di sitema
* Versione NodeJs 22.21.1 o superiore
* Versione Apache 2.4.52 o superiore
* Versione MySql 8.4.3 o superiore
* Versione Git 2.47 o superiore

## Effettuare il clone del repository
### Da CMD eseguire il seguente comado
```
git clone https://github.com/MicheleDeF/BookSharing.git 
```
questo comando crea una cartella **BookSharing**, eseguire il comando per entrare nella cartella creata
```
cd BookSharing
```
Aprire la cartella BookSharing con un IDE qualsiasi (ad esempio Visual Studio Code), e rinominare il file ```.env_example``` in ```.env``` e definire le variabili di ambiente _JWT_SECRET_, _SESSION_SECRET_ rispettivamente per il jwt web token e le sessioni.

## Creazione database
Prima di proseguire con le altre operazioni, creare un database denominato **books_sharing** come impostato nel file _config/config.json_, con _username_ **root** e _password_ **null**, è possibile cambiare questi valori a condizione che si modifichi il file _config/config.json_ nella sezione _development_

## Istallazione pacchetti npm richiesti
Succcessivamente installare tutti i pacchetti npm contenuti nel file **package.json**, eseguire il seguente comando nella cartella radice del progetto, in questo caso è BookSharing
```
npm install
```

## Creazione tabelle
Per creare le tabelle eseguire il seguente comando nella cartella radice del progetto, in questo caso è BookSharing
```
npx sequelize-cli db:migrate
```
Se l'operazione è andata a buon fine verranno create le tabelle **books**, **messages**, **sequelizemeta**, **statistics** e **users**.

## Generare dati di test
Per generare i dati di test eseguire il seguente comando nella cartella radice del progetto, in questo caso è BookSharing
```
npx sequelize-cli db:seed:all
```
questo comando popolerà le tabelle create in precedenza con dati di esempio, in particolare due utenti i cui indirizzi email sono reperibili nella tabella **users** colonna _email_, la password è unica per entrambi ```a1s2d3F4```, usare email e password con uno degli utenti per effettuare il login.

## Avviare l'applicazione
E' possibile avviare l'applicazione tramite il comado 
```
nodemon index.js
```
oppure
```
node index.js
```
## Nota sull'uso dei dati di test
Per testare l'applicazione vengono inseriti tramite seeders dati di test, in particolare vengono usate coordinate fisse ```latitudine = 40.949282740897054``` e ```longitudine = 14.523030645794485``` per generare due utenti poco distanti uno dall'altro in modo simulare tutte le funzionalità.
Se si vuole testare l'applicazione con ```latitudine``` e ```longitudine``` con valori reali seguire i seguenti passi:

* prire il file ```public\js\script.js``` 
* decommentare le le due righe 51, 52 per ottenere la posizione esatta
* commentare 54, 55 per non usare i dati di test

## Nota sull'uso del compilatore Sass per compilare style.css
Per aggiungere stili aggiuntivi al file ```public/css/style.css``` eseguire il seguente comando nella cartella radice del progetto, in questo caso è BookSharing 
```
sass --watch public/scss/style.scss public/css/style.css  --style compressed
```
aggiungere gli stili aggiuntivi a ```public/scss/style.scss```, verranno aggiunti automaticamente a ```public/css/style.css```