# Wetterstation

Die ist die Programmausarbeitung zu einer Wetterstation mithilfe eines Raspberrypi's zero W.

Links zur Website:
Mainsite die abrufbar ist um die Daten der letzten 5 Stunden anzuzeigen.
+ [Index - Mainpage](http://raspi-home.ddns.net:8080/)

Die Rohdaten der letzten 5 Stunden, die das frontend der Mainsite nutzt.
+ [Past 5h](http://raspi-home.ddns.net:8080/getdata/)

## Getting Started

Um das Programm zu nutzten, muss es heruntergeladen und konfiguriert werden.<sup>1</sup>

Benötigt werden `python3, flask` packages.
```
git clone git@github.com:Salzsuppe/Wetterstation
cd Wetterstation
nano cfg/config.py
```
Nun die Pin-Numerierung anpassen, gemeint sind Physische Pins.

<kbd>strg+X</kbd>, <kbd>y</kbd>, <kbd>Enter</kbd>
Um die Änderungen unter dem selben Filename zu speichern.

Um Daten von der aktuellen Zeit einzutragen, führen Sie das Programm aus.
```
python3 insertData.py
```

Für automatisch Stündliche Datenaufnahme, kann man z.B. ein Crontab Eintrag erstellen.
`crontab -e`

Nun die Line anhängen:
```
1 * * * * cd /path/to/Wetterstation && python3 /path/to/Wetterstation/getData.py # Ausführung in der ersten Minute jeder Stunde
```



---
<sup>[1]: Git clone wird ohne private Key fehlschlagen, da es nicht public editierbar ist.</sup>


## Struktur
[cfg/](https://github.com/Salzsuppe/Wetterstation/tree/main/cfg) Konfigurations Dateien

[cfg/config.py](https://github.com/Salzsuppe/Wetterstation/tree/main/cfg/config.py) 
+ pinDict enthält die Pin nr. für IN, und wird genutzt in: [declareGPIOstate()](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py?plain=1#L25) & [readGPIOValue()](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py?plain=1#L35)
+ VPIN enthält die Pin nr. um die Sensorik zu aktivieren, und wird genutzt in: [declareGPIOstate()](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py?plain=1#L25) & [readGPIOValue()](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py?plain=1#L35)
+ DataEntryList enthält die Dictionary Names, und wird genutzt in: [getDataByVariable()](https://github.com/Salzsuppe/Wetterstation/blob/main/insertData.py?plain=1#L46)

[old/](https://github.com/Salzsuppe/Wetterstation/tree/main/old) enthält alte Version des Codes

[static/](https://github.com/Salzsuppe/Wetterstation/tree/main/static) enthält Grafiken und das JavaScript für das Frontend
+ [Wetterdesign/](https://github.com/Salzsuppe/Wetterstation/tree/main/static/Wetterdesign) enthält die Roh-Grafik
+ [styles/](https://github.com/Salzsuppe/Wetterstation/tree/main/static/styles) enthält die anordnung der Roh-Grafik
+ [main.js](https://github.com/Salzsuppe/Wetterstation/blob/main/static/main.js) das gesamte Frontend script, für Designänderungen, und die Dateneintragungen

[templates/](https://github.com/Salzsuppe/Wetterstation/tree/main/templates)
+ [index.html](https://github.com/Salzsuppe/Wetterstation/blob/main/templates/index.html) die Vorlage, in welche die Werte eingefüllt werden

[.gitignore](https://github.com/Salzsuppe/Wetterstation/blob/main/.gitignore) Ein Filter um files bei git push zu ignorieren

[README.md](https://github.com/Salzsuppe/Wetterstation/blob/main/README.md) Dieses File

[Raw.db](https://github.com/Salzsuppe/Wetterstation/blob/main/Raw.db) Unsere Database, mit Table RawData, die unsere gemessene und verarbeiteten Werte enthält

[app.py](https://github.com/Salzsuppe/Wetterstation/blob/main/app.py) Unsere Website-Framework wo der Inhalt für die URL's gestellt wird

[asciiflowchart](https://github.com/Salzsuppe/Wetterstation/blob/main/asciiflowchart) Ein Flowchart der Funktionsweise unseres Programmes

[insertData.py](https://github.com/Salzsuppe/Wetterstation/blob/main/insertData.py) Das Programm zur Eintragung der ausgelesenen Werte

[measureData.py](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py) Das Programm zu Auslesung der Sensorik



## Funktionsweise


## About

Diese Art von Projekt war für uns alle etwas neues, wir haben uns in der Zeit der ausarbeitung vieles neues angeeignet um ein möglichst gutes Ergebnis zu erziehlen. Dabei sind wir einigen Problemen entgegengetreten welche wir aber glücklicherweise bewältigen konnten.

+ Vorkenntnisse

Natürlich haben wir auch ein paar Vorkenntnisse mitgebracht damit wir so weit kommen konnten bei diesem Projekt.

+ Tom
  + Ich hatte mich voher schon mit Website Design, sprich HTML, CSS, JavaScript beschäftigt
  + Außerdem hatte ich schon Kenntnisse im Bereich Python Programmierung
  + Zuletzt habe ich noch Kenntnisse mit Mikroconrollern mitgebracht

+ Lennart
  + ...

+ Stefan
  +  ...

+ Probleme

