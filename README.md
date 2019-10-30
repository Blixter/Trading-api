# Trading-api
[![Code Coverage](https://scrutinizer-ci.com/g/Blixter/Trading-api/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/Blixter/Trading-api/?branch=master)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/Blixter/Trading-api/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/Blixter/Trading-api/?branch=master)
[![Build Status](https://scrutinizer-ci.com/g/Blixter/Trading-api/badges/build.png?b=master)](https://scrutinizer-ci.com/g/Blixter/Trading-api/build-status/master)
[![Build Status](https://travis-ci.org/Blixter/Trading-api.svg?branch=master)](https://travis-ci.org/Blixter/Trading-api)

## Krav 1: Backend
Jag skapade mitt API i Express och databasen SQLite. Jag gillar att arbeta i Express, främst för att jag känner mig bekväm i både Express och JavaScript då jag har arbetat mycket med det. Tack vara detta så hade jag mycket kod som gick att återanvända från tidigare kursmoment. Jag började egentligen att jobba med databasen MongoDB, som jag hade tänkt använda istället. Dock fastnade jag och kände att tidsbristen gjorde att jag fick välja en databas jag var van vid. I framtiden tänker jag dock arbeta mer med MongoDB då jag upplever den som en modernare databas som påminner mer om den typen av programmering jag vanligtvis arbetar med. Behöver dock sätta mig in i MongoDB mer och framför allt Mongoose som är ett paket för MongoDB till Express.

Som jag nämnde hade jag inte mycket tid därför blev det mycket återanvänding av kod i databasen, det var dock ändå mycket nytt som behövde göras för att min Trading-plattform skulle fungera. Jag ser en hel del förbättningsmöjligheter i min database men det fungerar och gör det den skall.

När en förfrågningar kommer in till i stort sett alla rötter så görs det en autentisering av användaren. Genom att en jwt-tokens skickas med i headern och denna token behöver vara giltig för att användaren skall kunna nå databasen.

När en användare har blivit autentiserad så hämtas emailen från den skickade token och sparas i <code>req.user.email</code>, som jag sedan kan nå från mina andra moduler. Email har jag som ett unikt id till de olika tabellerna och därför är det smdigt att email-adressen automatiskt följer med tokens.

När en användare registrerar sig så kopplas det automatiskt en depå till användaren.
Denna depå går att nå via routen GET /depots/view, och där får användaren tillbaka email, saldo och de objekt (om det finns några) kopplade till sitt konto.

## Krav 3: Realtid

Jag gjorde min micro-service integrerat med min backend. Jag skapade den med hjälp av paketet Socket-io. Som säljobjekt valde jag guld och silver. För att slumpa fram ett nytt nummer på detta vis: <code>Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min</code>, där min och maxvärdet på yrange, sätts när objektet skapas. Jag hade kunnat göra slumpningen mer realiskt, framför allt om jag hade använt mig av rates som i Emils exempel. Jag hann inte riktigt med det, utan det fick bli så här. Det slumpas alltså fram en siffra mellan min och max vid varje interval, som jag har satt till 5 sekunder. När det nya värdet skapas så sparas det i ett objekt där y = det slumpmässade värdet och x = <code>new Date().getTime()</code>. Socket.io skickad sedan ut en array med ett silver-objekt och ett guld-objekt som sedan tas hand om i frontenden. Vid varje interval byggs arrayen med objekt på och blir större och större, därför har jag begränsat längden på denna array till 50. När den har uppnått 50 så skriver den över arryen med de 20 senaste elementen och fortsätter sedan som vanligt.

## Krav 4: Tester backend

Jag använde mig av Chai och Mocha för mina tester. Anledningen till detta är framför allt för att jag använt dessa verktyg tidigare och behöver inte lägga massa tid på att lära mig nya verktyg.

Jag skapade en CI-kedja med hjälp av Travis och Scrutinizer, där koden testas vid varje uppdatering. Jag har infogat badges från dessa sidor som visar min kodtäckning, kodbetyg och om koden gick igenom eller ej.

Jag hade gärna arbetat mer med testerna och jag hade aboslut kunnat uppnå en högre kodtäckning, om jag kunnat lägga ner mer tid på testningen. Men jag lyckades ändå komma upp i 74% kodtäckning.
