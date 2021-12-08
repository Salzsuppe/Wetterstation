# Wetterstation

[comment]: <> (This is a comment it wont be included in the HTML displayed, only in the source)

Die ist die Programmausarbeitung zu einer Wetterstation mithilfe eines Raspberrypi's zero 2W als Website host und einem ESP32, der die Daten mit I2C misst und an den Raspberrypi weiterleitet.

## Links zur Website:

Mainseite die abrufbar ist um die Daten der letzten 5 Stunden anzuzeigen.
+ [Index - Mainpage](http://raspi-home.ddns.net:8080/)

Die Rohdaten der letzten 5 Stunden, die das frontend der Mainseite nutzt.
+ [Past 5h](http://raspi-home.ddns.net:8080/getdata/6)

Die Avgdaten der letzten 5 Stunden, die das frontend der Mainseite nutzt.

+ [Avg Past 5h](http://raspi-home.ddns.net:8080/avg/6)
---
Die Anzahl der Stunden kann in der URL angepasst werden.

## Getting Started

Um das Programm zu nutzten, muss es heruntergeladen und konfiguriert werden.<sup>1</sup>
Benötigt werden `python3, flask` packages.
```
sudo apt update && apt upgrade -y # Systemupdate
sudo apt install python3 flask
pip install flask Adafruit_DHT

git clone https://github.com/Salzsuppe/Wetterstation
cd Wetterstation
nano cfg/config.py
```
Nun die Pin-Numerierung anpassen, gemeint sind Board Pins (Nur GPIO numerierung).
<kbd>strg+X</kbd>, <kbd>y</kbd>, <kbd>Enter</kbd>

Um die Änderungen unter dem selben Filename zu speichern.

Um Daten von der aktuellen Zeit einzutragen, führen Sie das Programm aus.
```
python3 insertData.py
```

Für automatisch Stündliche Datenaufnahme, kann man z.B. ein Crontab Eintrag erstellen.
`crontab -e`

Nun die Zeile anhängen:
```
1 * * * * cd /path/to/Wetterstation && python3 /path/to/Wetterstation/getData.py # Ausführung in der ersten Minute jeder Stunde
```



---
<sup>[1]: Ein 32-bit raspbian auf einem arm32 system ist vorrausgesetzt.</sup>


## Struktur

[old/](https://github.com/Salzsuppe/Wetterstation/tree/main/old) enthält alte Version des Codes

[sensor/](https://github.com/Salzsuppe/Wetterstation/tree/sensor) enthält programme die den sensor Wert zurückgeben

[sensor/cfg/config.py](https://github.com/Salzsuppe/Wetterstation/blob/main/sensor/cfg/config.py)
+ pinDict enthält die Pin nr. für IN pins, und wird genutzt in: [declareGPIOstate()](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py?plain=1#L26) & [readGPIOValue()](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py?plain=1#L34)
+ VPIN enthält die Pin nr. um die Sensorik zu aktivieren, und wird genutzt in: [declareGPIOstate()](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py?plain=1#L26) & [readGPIOValue()](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py?plain=1#L34)
+ DataEntryList enthält die Dictionary Names, und wird genutzt in: [getDataByVariable()](https://github.com/Salzsuppe/Wetterstation/blob/main/extractData.py?plain=1#L27)

[static/](https://github.com/Salzsuppe/Wetterstation/tree/main/static) enthält Grafiken und das JavaScript für das Frontend
+ [Wetterdesign/](https://github.com/Salzsuppe/Wetterstation/tree/main/static/Wetterdesign) enthält die Roh-Grafik
+ [styles/](https://github.com/Salzsuppe/Wetterstation/tree/main/static/styles) enthält die anordnung der Roh-Grafik
+ [main.js](https://github.com/Salzsuppe/Wetterstation/blob/main/static/main.js) das gesamte Frontend script, für Design Anderungen, und die Dateneintragungen

[templates/](https://github.com/Salzsuppe/Wetterstation/tree/main/templates)
+ [index.html](https://github.com/Salzsuppe/Wetterstation/blob/main/templates/index.html) die Vorlage, in welche die Werte eingefüllt werden

[.gitignore](https://github.com/Salzsuppe/Wetterstation/blob/main/.gitignore) Ein Filter um files bei synchronisierung mit dem git repository zu ignorieren

[README.md](https://github.com/Salzsuppe/Wetterstation/blob/main/README.md) Dieses File

[Raw.db](https://github.com/Salzsuppe/Wetterstation/blob/main/Raw.db) Unsere Database, mit Table RawData, die unsere gemessene und verarbeiteten Werte enthält

[app.py](https://github.com/Salzsuppe/Wetterstation/blob/main/app.py) Unsere Website-Framework wo der Inhalt für die URL's gestellt wird

[asciiflowchart](https://github.com/Salzsuppe/Wetterstation/blob/main/asciiflowchart) Ein Flowchart der Funktionsweise unseres Programmes

[extractData.py](https://github.com/Salzsuppe/Wetterstation/blob/main/extractData.py) Das Programm zum extrahieren der Eingetragenen Werte

[insertData.py](https://github.com/Salzsuppe/Wetterstation/blob/main/insertData.py) Das Programm zur Eintragung der ausgelesenen Werte

[measureData.py](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py) Das Programm zu Auslesung der Sensorik



## Funktionsweise

[comment]: <> (Unfortunaly, inside the source it is not formatted properly (depending on source tab size), but it will be on the HTML)

Ein Überblick der generellen Funktionsweise als Programmablaufplan:
```
┌─────────────────────────────────┐        ┌───────────────────────────────┐        ┌─────────────────────────┐
│          measureData.main()     │        │       insertData.main()       │        │          app.py         │
│            ┌───────┐            │        │          ┌────────┐           │        │          ┌─────┐        │
│            │ Start │            │        │          │createDB│           │        │          │Start│        │
│            └───┬───┘            │        │          └───┬────┘           │        │          └──┬──┘        │
│                │                │        │              │                │        │             │           │
│                │                ├────────►              │                ├────────►   ┌─────────▼────────┐  │
│   ┌────────────▼────────────┐   │ import │  ┌───────────▼────────────┐   │ import │   │ enable-App.routes│  │
│   │                         │   │        │  │                        │   │        │   └──────────────────┘  │
│   │ Einrichtung - Libraries │   ├────────┤  │ insertVariablesinTable │   ├────────►                         │
│   │                         │   │        │  │ ${measureData.main()}  │   │ import │                         │
│   └────────────┬────────────┘   │        │  └────────────────────────┘   │        │  ┌──────────────────┐   │
│                │                │        │                               │        │  │app.route(/)      │   │
│                │                │        │                               │        │  │return(index.html)│   │
│                │                │        ├───────────────────────────────┤        │  └──────────────────┘   │
│      ┌─────────▼─────────┐      │        │         extractData.py        │        │                         │
│      │                   │      │        │ ┌───────────────────────────┐ ├────────►                         │
│      │ DeclareGPIOstate  │      │        │ │getDataByVariable(DateTime)│ │ import │  ┌───────────────────┐  │
│      │                   │      │        │ └───┬─────────┬─────────────┘ │        │  │app.route(/getdata)│  │
│      └─────────┬─────────┘      │        │     │         │               │        │  │return(Past$hData) │  │
│                │                │        │     │         │               │        │  └───────────────────┘  │
│                │                │        │     │  $$$$$$$▼$$$$$$$        │        │                         │
│        ┌───────┴──────┐         │        │     │  $   return()  $        │        │   ┌─────────────────┐   │
│        │              │         │        │     │  $ DataRecords $        │        │   │app.route(/avg)  │   │
│        │ readGPIOValue│         │        │     │  $             $        │        │   │return(Past$hAvg)│   │
│        │              │         │        │     │  $$$$$$$$$$$$$$$        │        │   └─────────────────┘   │
│        └──────┬───────┘         │        │     │                         │        │                         │
│               │                 │        │    ┌▼───────────────┐         │        │                         │
│        $$$$$$$▼$$$$$$$$         │        │    │getAvg(dictDict)│         │        │                         │
│        $   return()   $         │        │    └──┬─────────────┘         │        └─────────────────────────┘
│        $ valueResult  $         │        │       │                       │
│        $              $         │        │       │                       │
│        $$$$$$$$$$$$$$$$         │        │   $$$$▼$$$$$$$$               │
│                                 │        │   $  return() $               │
└─────────────────────────────────┘        │   $ ValueDict $               │
                                           │   $           $               │
                                           │   $$$$$$$$$$$$$               │
                                           └───────────────────────────────┘
```
### Speicherung

Die [Sensor-files](https://github.com/Salzsuppe/Wetterstation/tree/sensor) werden von measureData.py aufgerufen und gelesen, 
die Werte werden dan mithilfe der Namen in [sensor/cfg/config.py](https://github.com/Salzsuppe/Wetterstation/blob/main/sensor/cfg/config.py) zu einem Dictionary verarbeitet und an insertData.py weitergegeben.
Dort wird zuerst ein DB Table erstellt, sollte dieser nicht bereits vorhanden sein.
Darauf folgt eine [Funktion(insertValuesintoTable())](https://github.com/Salzsuppe/Wetterstation/blob/main/insertData.py?plain=1#L29) um die Daten von measureData.py in die DB zu schreiben.

Die Speicherung erfolgt durch das ausführen von insertData.py
### Auslesung

In extractData.py können die Werte mithilfe des Timestamps<sup>1</sup> und [getDataByVariable()](https://github.com/Salzsuppe/Wetterstation/blob/main/extractData.py?plain=1#L12) aus der DB ausgelesen werden.
Diese Funktion macht sich app.routes<sup>2</sup> aus app.py zum Nutzen. Die app.routes /getdata/<*hours*> und /avg/<*hours*> geben die Daten der Letzten *hours* zurück und sind unsere Schnittstellen zwischen Website & Backend.



---
<sup>[1]: YYYY-MM-DDTHH:MM:SS wobei unser Programm darauf ausgelegt ist das M und S jeweils 00 sind.</sup>

<sup>[2]: app.routes sind funktionen dessen `return` auf der angegeben URL angezeigt wird.</sup>

## About

Diese Art von Projekt war für uns alle etwas neues, wir haben uns in der Zeit der ausarbeitung vieles neues angeeignet um ein möglichst gutes Ergebnis zu erziehlen. Dabei sind wir einigen Problemen entgegengetreten welche wir aber glücklicherweise bewältigen konnten.

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

Während der Ausarbeitung haben wir uns verschiedene Dinge angeignet um das Projekt so auszuführen.

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

### Backend - Library
Am Anfang stellte sich die Frage womit man das Backend überhaupt machen soll, C war eine offensichtliche
Möglichkeit da wir mit den Arduinos auch in C programmmieren. Nach ein bisschen stöbern stellte sich heraus,
dass die C Library, die sehr dem Style des Arduinos ähnelt (Digital.write()), nicht länger supported wird.
Nach kürze endschied ich mich dann das ganze Backend in Python3 zu programmieren.
Ich hatte keine Ahnung von Python3, aber auch nicht viel mehr von C außer das was im Unterricht behandelt wurde.

### Backend - Headless Setup/WLAN
Den Raspberrypi aufzusetzen ging schnell vorbei, nach kürze fand ich wie ich mithilfe von wpa_supplicant.conf
eine WLAN configurations aufsetzten kann bevor ich ihn starte. Nun konnte ich mit SSH auf in zugreifen.

Ein Problem was nun auftauchte war das ganze im Schulnetzwerk zu machen. Es hat eine PEAP config was ein bisschen
komplizierter in der configurations Datei ist, ich habe es auf mehrere Weisen versucht, 
unteranderem Netzwerk-Manager aufzusetzen, was alles nicht funktioniert hatte.

Zwischendurch hatten wir einen WLAN router den wir an das LAN Netzwerk angebunden haben, hier konnte ich lokal mit ihm kommunizieren,
aber nicht in das Internet aufgrund Proxy Anmelde-Daten (Diese könnte ich warscheinlich in den Einstellungen aufsetzen).

In Zukunft könnte die lokale Kommunikation ausreichen da ich plane einen Reverse SSH tunnel zu einem Server herzustellen der außerhalb erreichbar ist.
Dies resultiert darin, dass der SSH-port/Websocket von dem Raspberrypi zu dem Server forwarded wird, und von dort im WWW erreichbar ist.

In der Schule kann ich inzwischen auch mit ihm kommunizieren da man sowohl SSH connections als auch Internet Access über USB-Data port nutzen kann.

### Pins/Sensoren

Ursprünglich ging ich davon aus alle Sensore im Analog.read() style zu lesen, sichtbar [in alten entwürfen](https://github.com/Salzsuppe/Wetterstation/blob/main/old/getData.py?plain=1#L74)
schnell stellt sich heraus das die meißten Sensore entweder Analog oder mit I2C verbunden werden
Analog Sensoren müssen mithilfe eines AD-Wandlers gelesen werden. Dieser wiederherum wird mit I2C verbunden.

Ich habe mehrere Sensoren ausprobiert, das System mehrmals neu aufgesetzt, verschiedenste Tutorials durchsucht und oft die Schaltung neu aufgebaut.
I2C funktioniert bei mir weder am Raspi Zero 2W noch am Raspi 4b+ den ich privat besitze.
Am ESP32 werden BMP180 & BH1750 erkannt und können gelesen werden, die Werte sollen in Zukunft über serial übertragen werden.

