# Wetterstation

Die ist die Programmausarbeitung zu einer Wetterstation mithilfe eines Raspberrypi's zero W.

Links zur Website:
Mainsite die abrufbar ist um die Daten der letzten 5 Stunden anzuzeigen.
+ [Index - Mainpage](http://raspi-home.ddns.net:8080/)

Die Rohdaten der letzten 5 Stunden, die das frontend der Mainsite nutzt.
+ [Past 5h](http://raspi-home.ddns.net:8080/getdata/)

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


