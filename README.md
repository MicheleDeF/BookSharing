## Guida all'installazione dell'applicazione

### Requisiti di sitema
* Versione NodeJs 22.21.1 o superiore
* Versione Apache 2.4.52 o superiore
* Versione MySql 8.4.3 o superiore
* Versione Git 2.47 o superiore

## Effettuare il clone del repository
### Da CMD lanciare il seguente comado
```
git clone https://github.com/MicheleDeF/BookSharing.git 
```
questo comando crea una cartella **BookSharing**, lanciare il comando
```
cd BookSharing
```
## Istallazione pacchetti npm richiesti
succcessivamente installare tutti i pacchetti npm contenuti nel file **package.json**
```
npm install
```
## Creazione database
Prima di proseguire con le altre operazioni, creare un database denominato **books_sharing** come impostato nel file _config/config.json_, con _username_ **root** e _password_ **null**, è possibile cambiare questi valori a condizione che si modifichi il file _config/config.json_.

## Creazione tabelle
Per creare le tabella usare il comando 
```
npx sequelize-cli db:migrate
```
tale comando va eseguito nella cartella radice del progetto, in questo caso è BookSharing.
Se l'operazione è andata a buon fine verranno create le tabelle **books**, **messages**, **sequelizemeta**, **statistics** e **users**.

## Generare dati di test
Per generare i dati di test usare il seguente comando nella cartella radice del progetto
```
npx sequelize-cli db:seed:all
```
questo comado popolerà le tabella create in precedenza con dati di esempio, in particolare due utenti ```user1@mail.it``` e ```user2@mail.it```, la password è unica per entrambi ```a1s2d3F4```.

## Avviare l'applicazione
E' possibile avviare l'applicazione tramite il comado 
```
nodemon index.js
```
oppure
```
node index.js
```