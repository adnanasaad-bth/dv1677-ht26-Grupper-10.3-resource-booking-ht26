# Rapport

## Namn 
Adnan Asaad

## Projektval
Bokningssystem

## Teknikval 
Jag tänker välja React, då det är väldigt populärt på marknaden just nu, och jag vill gärna lära mig saker som är relevanta i dagens marknad. Vad jag kom fram till är att det är väl dokumenterat, så det är ett plus.



## Tillvägagångssätt
### Vecka 1-2
Jag ska jobba själv och valde Bokningssystem för att jag tycker att det känns mer avancerat än Texteditor. Jag kan kanske ha fel, men för mig känns det som att jag kan bygga vidare på Bokningssystemet.

Jag började med att få en uppfattning om hur allt hänger ihop genom att gå igenom koden. När jag kände att jag börjat förstå lite, skapade jag en fork av repot och bjöd in Mattias till forken.

Att fixa PUT-routen var lite utmanande, jag har inte jobbat med JavaScript på jättelänge.
Ni kan se i koden att det finns en liten bugg som tog lite tid för mig att fixa, men det löste sig till slut.
Det var en bra refresh på minnet så att jag kan ha bättre grepp på resten av kursen.

#### Säkerhetsgranskning
Repot hade 4 sårbarheter, alla inte så allvarliga. Två av dem löste sig genom att köra npm audit fix, och de sista två behövde jag överrida qs-versionen i package.json och sedan köra npm install för att kunna lösa de sista 2 sårbarheterna.