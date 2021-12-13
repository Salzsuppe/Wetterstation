# Wetterstation

Die ist die Programmausarbeitung zu einer Wetterstation mithilfe eines Raspberrypi's zero 2W als Website host und einem ESP32, der die Daten mit I2C misst und an den Raspberrypi weiterleitet.

## Links zur Website:

Mainseite die abrufbar ist um die Daten der letzten 5 Stunden anzuzeigen.
+ [Index - Mainpage](http://pizero2w.local/)

Die Rohdaten der letzten 5 Stunden, die das frontend der Mainseite nutzt.
+ [Past 5h](http://pizero2w.local/getdata/6)

Die Avgdaten der letzten 5 Stunden, die das frontend der Mainseite nutzt.

+ [Avg Past 5h](http://pizero2w.local/avg/6)
---
Die Anzahl der Stunden kann in der URL angepasst werden.

## Getting Started

Um das Programm zu nutzten, muss es heruntergeladen und konfiguriert werden.<sup>1</sup>
Das firstrun-script wird alle benötigten packages automatisch herunterladen.
```
cd # Setze die directory zu /home/$USER
sudo apt install git -y # Das tool welches genutzt wird zum Herunterladen des repo
git clone https://github.com/Salzsuppe/Wetterstation
cd Wetterstation
./firstrun.sh

nano cfg/config.py
```
Nun die Werte nach bedarf anpassen.
<kbd>strg+X</kbd>, <kbd>y</kbd>, <kbd>Enter</kbd>

Um die Änderungen unter dem selben Filename zu speichern.

Um Sensor spezifische Werte zu ändern, kann in `nano sensor/sensor.ino` bei `#define` verschiedenes angepasst werden.


Um Daten stündlich einzutragen, kann insertData ausgeführt werden, es wird automatisch am Anfang jeder Stunde eine Messung durchführen.
```
python3 insertData.py
```

Für ein automatisch Start der Stündliche Datenaufnahme, kann man z.B. ein Crontab Eintrag erstellen.<sup>2</sup>
`crontab -e`

Nun die Zeile anhängen:
```
@reboot cd /path/to/Wetterstation && python3 /path/to/Wetterstation/getData.py # Ausführung in der ersten Minute jeder Stunde
```

---
<sup>[1]: Ein 32-bit raspbian auf einem arm32 system ist vorrausgesetzt.</sup>

<sup>[2]: Wir haben dies mithilfe eines Systemctl.service gemacht.</sup>

## Struktur

[old/](https://github.com/Salzsuppe/Wetterstation/tree/main/old) enthält alte Version des Codes

[sensor/sensor.ino](https://github.com/Salzsuppe/Wetterstation/blob/main/sensor/sensor.ino) enthält das C++ programm um die Sensoren auszulesen und an den Raspi zu senden.
Er ist in einem Ordner, wie der Arduino-IDE es möchte.

[static/](https://github.com/Salzsuppe/Wetterstation/tree/main/static) enthält Grafiken und das JavaScript für das Frontend
+ [Wetterdesign/](https://github.com/Salzsuppe/Wetterstation/tree/main/static/Wetterdesign) enthält die Roh-Grafik
+ [styles/](https://github.com/Salzsuppe/Wetterstation/tree/main/static/styles) enthält die Anordnung der Roh-Grafik
+ [main.js](https://github.com/Salzsuppe/Wetterstation/blob/main/static/main.js) das gesamte Frontend Script, für Design Änderungen, und die Dateneintragungen

[templates/](https://github.com/Salzsuppe/Wetterstation/tree/main/templates)
+ [index.html](https://github.com/Salzsuppe/Wetterstation/blob/main/templates/index.html) die Vorlage, in welche die Werte eingefüllt werden

[.gitignore](https://github.com/Salzsuppe/Wetterstation/blob/main/.gitignore) Ein Filter um files bei der Synchronisierung mit dem git Repository zu ignorieren

[README.md](https://github.com/Salzsuppe/Wetterstation/blob/main/README.md) Dieses File

[Raw.db](https://github.com/Salzsuppe/Wetterstation/blob/main/Raw.db) Unsere Database, mit Table RawData, die unsere gemessene und verarbeiteten Werte enthält

[app.py](https://github.com/Salzsuppe/Wetterstation/blob/main/app.py) Unsere Website-Framework wo der Inhalt für die URL's gestellt wird

[asciiflowchart](https://github.com/Salzsuppe/Wetterstation/blob/main/asciiflowchart) Ein Flowchart der Funktionsweise unseres Programmes

[extractData.py](https://github.com/Salzsuppe/Wetterstation/blob/main/extractData.py) Das Programm zum extrahieren der Eingetragenen Werte

[insertData.py](https://github.com/Salzsuppe/Wetterstation/blob/main/insertData.py) Das Programm zur Eintragung der ausgelesenen Werte

[measureData.py](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py) Das Programm zu Auslesung der Sensorik



## Funktionsweise


Ein Überblick der generellen Funktionsweise als Programmablaufplan:
```
                                                     ┌───────────────────┐
                                                     │                   │
                                                     │  WRITE DatenBank  │
                                                     │                   │
┌────────────────────────────────────────────────────┴───────────────────┴──────────────────────────────────────────────────────┐
│                                                                                                                               │
│                                   ┌────────────────────────┐                ┌─────────────────────┐                           │
│                                   │        [Modul]         │                │      [Programm]     │                           │
│   ┌──────────────────┐            │    measureData.py      │                │     insertData.py   │                           │
│   │[Programm (esp32)]│            │   ┌────────────────┐   │                │       ┌──────┐      │                           │
│   │sensor/sensor.ino │            │   │measureValues() │   │                │       │Start │      │                           │
│   │    ┌──────┐      │            │   │    ┌─────┐     │   │                │       ├──────┤      │                           │
│   │    │Start │      │            │   │    │Start│     │   │                │     ┌─┴──────┴──┐   │                           │
│   │    ├──────┤      │            │   │    ├─────┤     │   │                │     │start-Timer│   │                           │
│   │   ┌┴──────┴─┐    │  Wecken    │   │   ┌┴─────┴┐    │   │                │     └┬──────────┘   │                           │
│   │   │Aufwachen│◄───┼────────────┼───┼───┤Weckruf│    │   │                │      │Jede stunde   │                           │
│   │   └───┬─────┘    │            │   │   └──┬────┘    │   │                │      │Start job     │                           │
│   │       │          │            │   │      │         │   │   Start        │   ┌──▼──────────┐   │                           │
│   │   ┌───┴────┐     │            │   │  ┌───┴──────┐  │◄──┼────────────────┼───┤     job     │   │                           │
│   │   │ start  │     │            │   │  │warten auf│  │   │                │   │ ┌────────┐  │   │                           │
│   │   │Sensoren│     │            │   │  │ Antwort  │  │   │                │   │ │createDB│  │   │           xxxxxxxxxxxxx   │
│   │   └────┬───┘     │            │   │  └────┬─────┘  │   │                │   │ └────────┘  │   │ schreiben x           x   │
│   │        │         │            │   │       │        │   │                │   │             ├───┼──────────►x DatenBank x   │
│   │   ┌────┴───┐     │            │   │   ┌───┴────┐   │   │   daten        │   │ ┌─────────┐ │   │           x           x   │
│   │   │ messen │     │  daten     │   │   │  daten ├───┼───┼────────────────┼───┤►│daten->DB│ │   │           xxxxxxxxxxxxx   │
│   │   │Sensoren├─────┼────────────┼───┼──►│Rückgabe│   │   │                │   │ └─────────┘ │   │                           │
│   │   └────────┘     │            │   │   └────────┘   │   │                │   │             │   │                           │
│   │                  │            │   │                │   │                │   └─────────────┘   │                           │
│   └──────────────────┘            │   └────────────────┘   │                │                     │                           │
│                                   │                        │                └─────────────────────┘                           │
│                                   └────────────────────────┘                                                                  │
│                                                                                                                               │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

                                                      ┌──────────────────┐
                                                      │                  │
                                                      │  READ DatenBank  │
                                                      │                  │
┌─────────────────────────────────────────────────────┴──────────────────┴───────────────────────────────────────────┐
│                                                                                                                    │
│                                                                                                                    │
│                                                                                   ┌─────────────────────────────┐  │
│                                                                                   │        [Programm]           │  │
│                                                                                   │          app.py             │  │
│                                                                                   │          ┌─────┐            │  │
│                                                                                   │          │Start│            │  │
│                                                                                   │          ├─────┤            │  │
│                                                                                   │     ┌────┴─────┴────┐       │  │
│                                                                                   │     │start-Webserver│       │  │
│                                                                                   │     └───────────────┘       │  │
│                                                                                   │                             │  │
│                                                                                   │      ┌──────────────┐       │  │
│                                                                                   │      │     (/)      │       │  │
│                                                                                   │      │Visualisierter│       │  │
│                        ┌───────────────────────────────────┐                      │      │  Überblick   │       │  │
│                        │              [Modul]              │                      │      └──────────────┘       │  │
│                        │           extractData.py          │                      │                             │  │
│   xxxxxxxxxxxxx        │   ┌───────────────────────────┐   │ $daten               │    ┌──────────────────┐     │  │
│   x           x  Lesen │   │                           ├───┼───────────für-Datum──┼───►│                  │     │  │
│   x DatenBank x────────┼──►│getDataByVariable(DateTime)│   │         seit $stunden│    │(/getdata/stunden)│     │  │
│   x           x        │   │>>> Daten bei DateTime     │◄──┼──────────────────────┼─┬──┤  daten(stunden)  │     │  │
│   xxxxxxxxxxxxx        │   └────────────┬──────────────┘   │                      │ │  └──────────────────┘     │  │
│                        │                │                  │                      │ │                           │  │
│                        │                │$daten            │                      │ │                           │  │
│                        │                │                  │                      │ │ ┌─────────────────────┐   │  │
│                        │     ┌──────────▼───────────┐      │                      │ └─┤                     │   │  │
│                        │     │      getAvg(daten)   │      │    $Durchschnitt     │   │   (/avg/stunden)    │   │  │
│                        │     │>>> Daten Durchschnitt├──────┼──────────────────────┼──►│Durchschnitt(stunden)│   │  │
│                        │     └──────────────────────┘      │                      │   │                     │   │  │
│                        │                                   │                      │   └─────────────────────┘   │  │
│                        └───────────────────────────────────┘                      │                             │  │
│                                                                                   └─────────────────────────────┘  │
│                                                                                                                    │
│                                                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
### Speicherung

Die Sensorik wird von dem ESP gelesen und an measureData gesendet, 
die Werte werden dann mithilfe der Namen in [sensor/cfg/config.py](https://github.com/Salzsuppe/Wetterstation/blob/main/sensor/cfg/config.py) zu einem Dictionary verarbeitet und an insertData weitergegeben.
Dort wird zuerst ein DB Table erstellt, sollte dieser nicht bereits vorhanden sein,
und darauf folgt eine [Funktion(insertValuesintoTable())](https://github.com/Salzsuppe/Wetterstation/blob/main/insertData.py?plain=1#L29) um die Daten von measureData in die DB zu schreiben.

Die Speicherung erfolgt durch das ausführen von insertData
### Auslesung

In extractData können die Werte mithilfe des Timestamps<sup>1</sup> und [getDataByVariable()](https://github.com/Salzsuppe/Wetterstation/blob/main/extractData.py?plain=1#L12) aus der DB ausgelesen werden.
Diese Funktion macht sich app.routes<sup>2</sup> aus app zum Nutzen. Die app.routes /getdata/<*hours*> und /avg/<*hours*> geben die Daten der Letzten *hours* zurück und sind unsere Schnittstellen zwischen Website & Backend.



---
<sup>[1]: YYYY-MM-DDTHH:MM:SS wobei unser Programm darauf ausgelegt ist das M und S jeweils 00 sind.</sup>

<sup>[2]: app.routes sind funktionen dessen `return` auf der angegeben URL angezeigt wird.</sup>

## About

Diese Art von Projekt war für uns alle etwas neues, wir haben uns in der Zeit der Ausarbeitung vieles neues angeeignet um ein möglichst gutes Ergebnis zu erzielen. Dabei sind wir einigen Problemen entgegengetreten welche wir aber glücklicherweise bewältigen konnten.

### Vorkenntnisse

Natürlich haben wir auch ein paar Vorkenntnisse mitgebracht damit wir so weit kommen konnten bei diesem Projekt.

+ Tom
  + Website Design, sprich HTML, CSS
  + Python Programmierung

+ Lennart
  + Linux-Enviroment (Filesystem/Console/Software)
  + Networking-Grundlagen (SSH, Sockets, Firewalls, Traffic)
  + Bash-Scripting (Enviroment, Commands, Scripts)

+ Stefan
  +  ...
  +  (Lennart möchte anmerken: Stefan kann googlen)

### Erkentnisse

Während der Ausarbeitung haben wir uns verschiedene Dinge angeeignet um das Projekt so auszuführen.

+ Tom
  + Python Kenntnisse verbessert
  + JavaScript
  + Daten von einem Flask Server in JS abrufen
  + Umgang mit Git gelernt

+ Lennart
  + Python3 (Libraries, functions, loops)
  + Sqlite3 (Struktur, statements)
  + Flask als webframework
  + I2C/UART/SPI/1-Wire - Protocols
  + C++ vorkenntnisse
  + Markdown (.md) Syntaxt (Diese Datei)
  + Git repository (Github/git)

+ Stefan
  + HTML basics gelernt
  + CSS basics gelernt
## Probleme

Während des Ablauf der Ausarbeitung haben sich viele Probleme gestellt, natürlich waren die meißten lösbar, aber es gab einen kleinen Teil, der uns lange Zeitspannen beschäftigt hat, oder sogar unlösbar blieb.
### Backend - Library
Am Anfang stellte sich die Frage womit man das Backend überhaupt machen soll, C war eine offensichtliche
Möglichkeit da wir mit den Arduinos auch in C programmieren. Nach ein bisschen stöbern stellte sich heraus,
dass die C Library, die sehr dem Style des Arduinos ähnelt (Digital.write()), nicht länger supported wird.
Nach kürze endschied ich mich dann das ganze Backend in Python3 zu programmieren.
Ich hatte keine Ahnung von Python3, aber auch nicht viel mehr von C außer das was im Unterricht behandelt wurde.

### Backend - Headless Setup/WLAN
Den Raspberrypi aufzusetzen ging schnell vorbei, nach kürze fand ich wie ich mithilfe von wpa_supplicant.conf
eine WLAN configuration aufsetzten kann bevor ich ihn starte. Nun konnte ich mit SSH auf in zugreifen.

Ein Problem was nun auftauchte war das ganze im Schulnetzwerk zu machen. Es hat eine PEAP config was ein bisschen
komplizierter in der Konfigurations Datei ist, ich habe es auf mehrere Weisen versucht, 
unteranderem Netzwerk-Manager aufzusetzen, was alles nicht funktioniert hatte.

Zwischendurch hatten wir einen WLAN Router den wir an das LAN Netzwerk angebunden haben, hier konnte ich lokal mit ihm kommunizieren,
aber nicht in das Internet aufgrund Proxy Anmelde-Daten (Diese könnte ich warscheinlich in den Einstellungen aufsetzen).

In Zukunft könnte die lokale Kommunikation ausreichen da ich plane einen Reverse SSH tunnel zu einem Server herzustellen der außerhalb erreichbar ist.
Dies resultiert darin, dass der SSH-port/Websocket von dem Raspberrypi zu dem Server forwarded wird, und von dort im WWW erreichbar ist.

In der Schule kann ich inzwischen auch mit ihm kommunizieren da man sowohl SSH connections als auch Internet Access über USB-Data port nutzen kann.

### Pins/Sensoren

Ursprünglich ging ich davon aus alle Sensore im Analog.read() style zu lesen, sichtbar [in alten entwürfen](https://github.com/Salzsuppe/Wetterstation/blob/main/old/getData.py?plain=1#L74)
schnell stellt sich heraus das die meisten Sensoren entweder Analog oder mit I2C verbunden werden
Analog Sensoren müssen mithilfe eines AD-Wandlers gelesen werden. Dieser wiederherum wird mit I2C verbunden.

Ich habe mehrere Sensoren ausprobiert, das System mehrmals neu aufgesetzt, verschiedenste Tutorials durchsucht und oft die Schaltung neu aufgebaut.
I2C funktioniert bei mir weder am Raspi Zero 2W noch am Raspi 4b+ den ich privat besitze.

Am ESP32 konnten alle Sensoren mit I2C gelesen werden, darauf hin habe ich eine serial connection zwischen ihnen aufgebaut, über GPIO ging es nicht direkt also habe ich ein Kabel genutzt.
Jetzt weckt measureData den esp, der dann mit der Messung beginnt, sobald das Programm die Daten erhalten hat, läuft es weiter.

## Reflexion

Wir sind der Meinung unser gestecktes Ziel gut erreicht zu haben, wir konnten alle MUSS Bedinungen erfüllen wobei sich [manche komplexer erwiesen](##%20Probleme "Siehe ## Probleme") als gedacht.

Durch die unerwarteten Umstände konnten wie also nur ein paar der angegebenen KANN Bedingungen erfüllen.

>

### Umsetzung der Bedingungen

Die MUSS Bedingungen zur Messung und Darstellung der verschiedenen Werte ist der Kern unseres Programmes, wir lesen, versenden, Speichern, extrahieren und stellen die Werte auf einer Website dar.<sup>1</sup>

Die ist auch im Back-end aufgeteilt, es gibt ein Programm mit seinen Funktionen für jede dieser Stufen, für eine struckturierte Verarbeitung.

Auf den Kern haben wir darauf noch weiter Funktionen erweitert:
+ MUSS007 Durschnittsrechnung ist in der theorie unkompliziert da wir eine Datenbank führen, einfach die gewünschten Einträge summieren und durch Anzahl teilen, der Code war etwas tückisch und hat zuerst nicht vorhandene Daten als 0 behandelt, aber das ist behoben.

+ MUSS008 Zur Warnhinweis-erkennung haben wir uns ein paar Merkmale in Korrelation zu den jeweiligen Ereignissen überlegt. 
+ KANN005 Zum rechnen der gefühlten Temperatur gibt es einfache Formeln aus Sensorwerte die wir zu verfügung haben. Also haben wir dies auf der Webseite verbaut.
+ KANN006 Solar & Akku Betrieb ist für uns wichtig da wir eine Komplett unabhängige (Wireless) Station bauen wollten, in der Praxis ist das durchaus möglich aber wir haben es nicht getestet. (Ich vermute im Winter gibt das Panel zu wenig leistung.)


- ~~KANN003~~ Sonnenverlauf wäre noch Zeitaufwendig gewesen, vorallem wenn man ihn, basierend auf vergangenen Daten, vorraussagen möchte und nicht nur aufnehmen.
(Dies währe mit dem Licht-Sensor möglich, aber die Visualisierung kostet auch wieder Zeit.)
- ~~KANN004~~ Eine Vorraussage des Wetters mithilfe von Luftdruck & Feuchtigkeit klingt machbar, aber ich weiß nicht in welchem Rahmen und welcher genauigkeit sich dies befindet.
Aufgrund von feinschliffen kommt es auch nicht hierzu.
- ~~KANN007~~ Die Wetterstation kann einen Motor haben, welcher das Solarpanel dreht.
<sup> Wäre Toll gewesen, aber leider zu Zeitaufwendig.</sup>

---
<sup>[1]: MUSS001-MUSS006 & KANN001/2

### Vision - Ein Blick in die Zukunft

Nun, was hätten wir umgesetzt wenn dies ein Hauptberufliches Projekt gewesen wäre?
Realistisch gesehen:
+ Umsetzung aller bedingungen im Laste/Pflichtenheft
+ Neues Web-Design: Moderner/Intuitiver/Praktischer
+ weitere Code optimierung
+ Ein praktisches/robustes/schönes Gehäuse

Idealistisch gesehen, besitzen wir die Grundlagen für alles was man noch in Python/JavaScript/HTML lernen kann und Idealistisch gesehen, werden auch keine größeren Probleme auftreten wie unser I2C was uns eine Menge Zeit gekostet hat.
+ Entfernen des ESP32 (Alles am Raspberrypi)
+ Volle Code Modularität/Optimierung
  + Einheitliche Config, die auch in die Sensor-Files geht
  + Für jede auslese-Art (I2C/Digital/Analog/UART/SPI..) ein eigenes File (/sensor/I2C.py, /sensor/SPI.py...)
+ Alle Realistischen gennanten Punkte


## Feedback


Uns hat das Projekt sehr gut gefallen, es hat uns ermutigt sich selber reinzuhängen und dinge anzulernen die für solch eine Umsetzung nötig waren.

*Einerseits* hätten wir uns noch gewünscht als Klasse Sensorik auszuwählen.
Dies hätte die Möglichkeit gegeben durch Standarisiert umsetzung besser Hilfe zu besprechen und untereinander auszutauschen. 

***Aber:*** Wir fanden auch den Freiraum, der gegeben war, extrem Wichtig.
Wären alle Gruppen nur die Möglichkeit den Arduino zu nutzen, wären viel Wünsche ein aufwendiges Programm aufzuziehen wohl auf der Strecke geblieben.

Auch die Möglichkeit mal eben "Schulische-Mittel" (z.B. 3D-Drucker/Webserver & public domain) ist sehr erfreulich.

Manchmal war die Kommunikation zwischen den Fächern etwas schwammig, und die genauen Ziele unklar (Nur prototyp vs. Endprodukt).

Außerdem wäre es hilfreich ein klaren Start zu Signalisieren in dem man noch früher die Idee/Umsetzung vom PAP in den Raum zu werfen.

*Hardware noch nicht da?*
Egal! Sensorik ist bekannt, das Programm kann entworfen werden.
&nbsp;

Trotz allem, es war ein spanndes Projekt mit elan-voller Unterstützung der Lehrerkräfte.

>10/10 | Would do it again